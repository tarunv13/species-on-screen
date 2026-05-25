#!/usr/bin/env node
/*
  scripts/check-narratives.js
  ---------------------------
  Build-time integrity check for the narrative pipeline. Runs as a
  `prebuild` step on `npm run build`, and is also invokable directly
  via `npm run check-narratives`.

  What it catches that nothing else does:

    1. id drift     — a narrative file's `id` field disagreeing with
                      its own filename. The registry keys off the
                      filename in `import.meta.glob`; the URL slug
                      keys off the filename. A mismatched id renders
                      a 404 from a page that exists.

    2. duplicate ids — two narrative files declaring the same `id`.
                      The registry silently keeps the first and drops
                      the second; the contributor sees no error.

    3. malformed records — schemaVersion drift, missing required
                      sections, or empty `sources`. The registry
                      already excludes these via `getMalformed()` at
                      runtime, but does so silently. CI must not.

    4. missing research-surface shell — a narrative file under
                      `cinematic-language/narratives/<id>.ts` with no
                      matching `notes/<id>.html`. The narrative would
                      load into the registry but be unreachable.

    5. archive-index drift — `notes/index.html` out of sync with the
                      registry: a non-draft record missing a link, a
                      link pointing at an unregistered slug, or a
                      link pointing at a record whose status is
                      `draft` (drafts are not surfaced on the public
                      archive per narrative-lifecycle.md §1).

  Why source-text validation, not import:

  The narrative files are TypeScript and would require compilation
  to execute under Node. `tsx`/`ts-node` would add a dependency; the
  registry uses Vite's `import.meta.glob` which is browser-runtime
  only. This script does the same invariant checks at the source
  level — sufficient for the four targets above, and complementary
  to the registry's runtime validation (which still runs at vite
  build time on the live module graph).

  Node stdlib only. No package dependencies. Exits 0 on pass, 1 on
  any failure. Handles missing directories as 'nothing to check'.
*/

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/* ---------- Paths ---------- */

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const NARRATIVES_DIR = path.join(
  REPO_ROOT, 'cinematic-language', 'narratives'
);
const NOTES_DIR = path.join(REPO_ROOT, 'notes');
const NOTES_INDEX = path.join(NOTES_DIR, 'index.html');

/* ---------- Schema constraints ---------- */

const VALID_STATUSES = new Set([
  'draft', 'in_review', 'verified', 'published'
]);

const SLUG_REGEX = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

/* ---------- Helpers ---------- */

function relPath(p) {
  return path.relative(REPO_ROOT, p);
}

/**
 * Extract the narrative `id` field. Anchored on the
 * `EcologicalNarrative = { id: ... }` opening so we don't match
 * nested ids inside `place` or `species` (those come later).
 */
function extractNarrativeId(content) {
  const m = content.match(
    /EcologicalNarrative\s*=\s*\{\s*id:\s*['"]([^'"]+)['"]/
  );
  return m ? m[1] : null;
}

function extractField(content, field, valuePattern = "['\"]([^'\"]+)['\"]") {
  const re = new RegExp(`${field}:\\s*${valuePattern}`);
  const m = content.match(re);
  return m ? m[1] : null;
}

function hasNonEmptySources(content) {
  // Find the `sources: [ ... ]` block. Use a non-greedy match across
  // newlines. Then check the inside contains at least one source
  // object literal (`{ kind: ...`).
  const m = content.match(/sources:\s*\[([^]*?)\n\s*\]/);
  if (!m) return false;
  return /\{\s*kind:\s*['"][a-z_]+['"]/.test(m[1]);
}

function hasDefaultExport(content) {
  return /^\s*export\s+default\s+narrative\s*;?\s*$/m.test(content);
}

/* ---------- Per-file validation ---------- */

function checkNarrativeFile({ file, filename, content, htmlExists }) {
  const errors = [];

  // 1. The narrative-level id must be present.
  const id = extractNarrativeId(content);
  if (!id) {
    errors.push(
      'no id field at the top of the EcologicalNarrative literal'
    );
    return { id: null, status: null, errors };
  }

  // 2. id must be a valid kebab-case slug.
  if (!SLUG_REGEX.test(id)) {
    errors.push(
      `id "${id}" is not a kebab-case slug ` +
      '(see scripts/new-narrative.js for the expected form)'
    );
  }

  // 3. id must equal the filename basename.
  if (id !== filename) {
    errors.push(
      `id "${id}" does not match filename "${filename}.ts" ` +
      '(the registry keys off filename; mismatch produces a 404 ' +
      'from a page that exists)'
    );
  }

  // 4. metadata.schemaVersion must be exactly '1'.
  const schemaVersion = extractField(content, 'schemaVersion');
  if (schemaVersion !== '1') {
    errors.push(
      schemaVersion === null
        ? 'metadata.schemaVersion is missing'
        : `metadata.schemaVersion must be "1", got "${schemaVersion}" ` +
          '(this registry serves v1 only)'
    );
  }

  // 5. metadata.status must be a valid enum value.
  const status = extractField(content, 'status');
  if (!status) {
    errors.push('metadata.status is missing');
  } else if (!VALID_STATUSES.has(status)) {
    errors.push(
      `metadata.status "${status}" is not a valid value ` +
      `(must be one of: ${[...VALID_STATUSES].join(', ')})`
    );
  }

  // 6. sources must be a non-empty array.
  if (!hasNonEmptySources(content)) {
    errors.push(
      'sources must be a non-empty array of source objects ' +
      '(a narrative without sources is not attested and must not ' +
      'be served)'
    );
  }

  // 7. The file must export a default named `narrative`.
  if (!hasDefaultExport(content)) {
    errors.push(
      'missing `export default narrative;` at end of file ' +
      '(the registry reads `module.default`)'
    );
  }

  // 8. A matching research-surface HTML shell must exist.
  if (!htmlExists) {
    errors.push(
      `no matching research-surface shell at ` +
      `notes/${id}.html ` +
      '(scaffolder generates both files together; see ' +
      '`npm run new-narrative`)'
    );
  }

  return { id, status, errors };
}

/* ---------- Cross-file: archive index drift ---------- */

/**
 * Reconcile `notes/index.html` against the registry. Three drift
 * conditions are caught:
 *
 *   - a non-draft record (verified, in_review, published) with no
 *     link in the index — silent omission
 *   - a link in the index pointing at a slug not in the registry —
 *     orphaned link, will 404 on click
 *   - a link in the index pointing at a record whose registry status
 *     is `draft` — public archive must not surface drafts
 *     (narrative-lifecycle.md §1)
 *
 * The check parses the index as text (regex over `<a href="<slug>.html">`)
 * to keep the script dependency-free; the index is small and the
 * link form is stable. Missing index file is treated as 'nothing to
 * reconcile', not an error — the archive is optional.
 */
async function checkArchiveIndexDrift(narratives) {
  let indexContent;
  try {
    indexContent = await readFile(NOTES_INDEX, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }

  const linkRe = /<a\s+href="([a-z][a-z0-9]*(?:-[a-z0-9]+)*)\.html"/g;
  const indexedSlugs = new Set();
  let m;
  while ((m = linkRe.exec(indexContent)) !== null) {
    indexedSlugs.add(m[1]);
  }

  const statusById = new Map(
    narratives
      .filter(n => n.id !== null && n.status !== null)
      .map(n => [n.id, n.status])
  );

  const errors = [];

  // Non-draft records must appear in the index.
  for (const { id, status } of narratives) {
    if (id === null || status === null) continue;
    if (status === 'draft') continue;
    if (!indexedSlugs.has(id)) {
      errors.push(
        `notes/index.html is missing a link to "${id}.html" ` +
        `(registry status: ${status}; non-draft records must be ` +
        `listed in the public archive)`
      );
    }
  }

  // Indexed slugs must correspond to registered non-draft records.
  for (const slug of indexedSlugs) {
    if (!statusById.has(slug)) {
      errors.push(
        `notes/index.html links to "${slug}.html" which has no ` +
        `matching narrative in the registry ` +
        `(orphaned archive link)`
      );
    } else if (statusById.get(slug) === 'draft') {
      errors.push(
        `notes/index.html links to "${slug}.html" but its registry ` +
        `status is "draft" ` +
        `(drafts must not appear in the public archive per ` +
        `narrative-lifecycle.md \u00a71)`
      );
    }
  }

  return errors;
}

/* ---------- Output ---------- */

function reportFailures(perFileErrors) {
  const total = perFileErrors.reduce(
    (acc, { errors }) => acc + errors.length, 0
  );
  console.error(
    `\ncheck-narratives: ${total} integrity issue(s) ` +
    `across ${perFileErrors.length} file(s).\n`
  );
  for (const { file, errors } of perFileErrors) {
    console.error(`  ${file}`);
    for (const err of errors) {
      console.error(`    - ${err}`);
    }
  }
  console.error('');
}

/* ---------- Main ---------- */

async function main() {
  let entries;
  try {
    entries = await readdir(NARRATIVES_DIR);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(
        'check-narratives: no narratives directory ' +
        `(${relPath(NARRATIVES_DIR)}); nothing to check.`
      );
      return;
    }
    throw err;
  }

  const files = entries.filter((f) => f.endsWith('.ts'));
  if (files.length === 0) {
    console.log('check-narratives: 0 narratives; nothing to check.');
    return;
  }

  const idToFile = new Map();
  const perFileErrors = [];
  const allRecords = [];

  for (const file of files) {
    const filename = file.replace(/\.ts$/, '');
    const filePath = path.join(NARRATIVES_DIR, file);
    const content = await readFile(filePath, 'utf8');
    const htmlExists = existsSync(path.join(NOTES_DIR, `${filename}.html`));

    const { id, status, errors } = checkNarrativeFile({
      file, filename, content, htmlExists
    });

    allRecords.push({ id, status });

    // Cross-file duplicate-id detection. Only meaningful for files
    // whose id parsed cleanly.
    if (id && idToFile.has(id)) {
      errors.push(
        `duplicate id "${id}" \u2014 also declared in ` +
        `${idToFile.get(id)} ` +
        '(the registry would silently drop one of these at load time)'
      );
    } else if (id) {
      idToFile.set(id, file);
    }

    if (errors.length > 0) {
      perFileErrors.push({ file, errors });
    }
  }

  // Cross-file: archive index ↔ registry reconciliation.
  // Run unconditionally — drift can exist even when every per-file
  // check passes.
  const driftErrors = await checkArchiveIndexDrift(allRecords);
  if (driftErrors.length > 0) {
    perFileErrors.push({
      file: 'notes/index.html',
      errors: driftErrors
    });
  }

  if (perFileErrors.length > 0) {
    reportFailures(perFileErrors);
    process.exit(1);
  }

  console.log(
    `check-narratives: ok (${files.length} narrative` +
    `${files.length === 1 ? '' : 's'}, all invariants pass)`
  );
}

main().catch((err) => {
  console.error(`\ncheck-narratives: ${err && err.message ? err.message : err}`);
  process.exit(1);
});
