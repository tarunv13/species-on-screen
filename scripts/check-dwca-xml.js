#!/usr/bin/env node
/*
  scripts/check-dwca-xml.js
  --------------------------
  Build-time well-formedness check for the DwC-A XML descriptors
  (public/dwca/<slug>/{meta.xml,eml.xml}). Runs as part of `npm run verify`
  and is also invokable directly via `npm run check-dwca-xml`.

  What it catches that nothing else does:

  check-manifest.js verifies these files EXIST; it never opens them. The
  EML template in scripts/ingest/build-dwca.mjs interpolates place.name /
  place.locality straight into XML text content with no escaping — a
  future place name or locality containing '&', '<', or '>' would ship a
  malformed eml.xml with zero errors anywhere in the pipeline. These files
  are also linked as direct downloads from the atlas field-record page
  (src/atlas/field-record.js `<a href="...meta.xml">`), so a visitor can
  click straight into a broken file, and they are the artifacts external
  biodiversity-informatics tools (GBIF, GloBI, TDWG-based validators)
  would ingest. This check closes that gap: mismatched/unclosed tags,
  multiple or missing root elements, and unescaped bare '&' are all
  build-breaking failures.

  Dependency-free (Node stdlib only) — matches the pattern of
  check-narratives.js / check-manifest.js / check-bindings.js. This is a
  pragmatic well-formedness lint, not a full XML Infoset validator: it
  does not resolve DTDs/entities or validate against the DwC-A schema.
  That scope is intentional and sufficient to catch the failure modes
  above.

  Exits 0 on pass, 1 on any failure.
*/

import { readFile, readdir } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const DWCA_ROOT = path.join(REPO_ROOT, 'public', 'dwca');

const ENTITY_OK = /&(amp|lt|gt|apos|quot|#\d+|#x[0-9a-fA-F]+);/y;

/*
  Stack-based well-formedness scan: declaration / comments / CDATA /
  markup declarations are skipped as opaque spans; every other '<...>'
  is parsed as an open, close, or self-closing tag with a quote-aware
  scan for '>' (so a '>' inside a quoted attribute value does not end
  the tag early). Returns a list of human-readable error strings; an
  empty list means well-formed by this check's scope.
*/
export function checkXmlWellFormed(text) {
  const errors = [];
  const len = text.length;
  const stack = [];
  let rootCount = 0;
  let i = 0;

  const lineAt = (idx) => {
    let line = 1;
    for (let k = 0; k < idx && k < len; k++) if (text[k] === '\n') line++;
    return line;
  };

  while (i < len) {
    const ch = text[i];
    if (ch === '&') {
      ENTITY_OK.lastIndex = i;
      if (!ENTITY_OK.test(text)) {
        errors.push(`unescaped '&' at line ${lineAt(i)} (not a valid entity reference)`);
      }
      i += 1;
      continue;
    }
    if (ch !== '<') { i += 1; continue; }

    if (text.startsWith('<?', i)) {
      const end = text.indexOf('?>', i);
      if (end === -1) { errors.push(`unterminated processing instruction at line ${lineAt(i)}`); break; }
      i = end + 2;
      continue;
    }
    if (text.startsWith('<!--', i)) {
      const end = text.indexOf('-->', i + 4);
      if (end === -1) { errors.push(`unterminated comment at line ${lineAt(i)}`); break; }
      i = end + 3;
      continue;
    }
    if (text.startsWith('<![CDATA[', i)) {
      const end = text.indexOf(']]>', i + 9);
      if (end === -1) { errors.push(`unterminated CDATA section at line ${lineAt(i)}`); break; }
      i = end + 3;
      continue;
    }
    if (text.startsWith('<!', i)) {
      // DOCTYPE or other markup declaration — not used by this project's
      // templates, but skip it opaquely if ever present.
      const end = text.indexOf('>', i);
      if (end === -1) { errors.push(`unterminated markup declaration at line ${lineAt(i)}`); break; }
      i = end + 1;
      continue;
    }

    // A regular tag: scan for the closing '>', quote-aware.
    const tagStart = i;
    let j = i + 1;
    let inQuote = null;
    let bad = false;
    while (j < len) {
      const c = text[j];
      if (inQuote) {
        if (c === inQuote) inQuote = null;
      } else if (c === '"' || c === "'") {
        inQuote = c;
      } else if (c === '>') {
        break;
      } else if (c === '<') {
        errors.push(`unexpected '<' inside a tag starting at line ${lineAt(tagStart)}`);
        bad = true;
        break;
      }
      j += 1;
    }
    if (bad) { i = j; continue; }
    if (j >= len) { errors.push(`unterminated tag starting at line ${lineAt(tagStart)}`); break; }

    const raw = text.slice(i + 1, j);
    i = j + 1;

    // '&' inside a tag only legitimately occurs in an attribute value (as
    // an entity reference); the outer per-character scan never visits
    // this span because the tag was consumed above as one unit.
    for (let k = 0; k < raw.length; k++) {
      if (raw[k] !== '&') continue;
      ENTITY_OK.lastIndex = k;
      if (!ENTITY_OK.test(raw)) {
        errors.push(`unescaped '&' at line ${lineAt(tagStart + 1 + k)} (not a valid entity reference)`);
      }
    }

    if (raw.startsWith('/')) {
      const name = raw.slice(1).trim();
      const top = stack.pop();
      if (!top) {
        errors.push(`closing tag </${name}> at line ${lineAt(tagStart)} has no matching open tag`);
      } else if (top.name !== name) {
        errors.push(
          `mismatched closing tag at line ${lineAt(tagStart)}: expected </${top.name}> ` +
          `(opened at line ${top.line}), found </${name}>`
        );
      }
      continue;
    }

    const selfClosing = raw.endsWith('/');
    const body = selfClosing ? raw.slice(0, -1) : raw;
    const nameMatch = body.match(/^([^\s/>]+)/);
    const name = nameMatch ? nameMatch[1] : '';
    if (!name) { errors.push(`malformed tag near line ${lineAt(tagStart)}`); continue; }

    if (selfClosing) {
      if (stack.length === 0) rootCount += 1;
    } else {
      if (stack.length === 0) rootCount += 1;
      stack.push({ name, line: lineAt(tagStart) });
    }
  }

  if (stack.length) {
    errors.push(`unclosed tag(s) at EOF: ${stack.map((s) => `<${s.name}> (opened line ${s.line})`).join(', ')}`);
  }
  if (rootCount === 0) errors.push('no root element found');
  if (rootCount > 1) errors.push(`multiple root elements (${rootCount}); XML requires exactly one`);

  return errors;
}

async function main() {
  if (!existsSync(DWCA_ROOT)) {
    console.error(`\ncheck-dwca-xml: ${path.relative(REPO_ROOT, DWCA_ROOT)} does not exist.\n`);
    process.exit(1);
  }

  const entries = (await readdir(DWCA_ROOT)).filter((e) => statSync(path.join(DWCA_ROOT, e)).isDirectory());
  const errors = [];
  let checked = 0;

  for (const slug of entries) {
    for (const file of ['meta.xml', 'eml.xml']) {
      const p = path.join(DWCA_ROOT, slug, file);
      if (!existsSync(p)) continue; // existence is check-manifest.js's job
      const text = await readFile(p, 'utf8');
      const fileErrors = checkXmlWellFormed(text);
      checked += 1;
      for (const e of fileErrors) errors.push(`${slug}/${file}: ${e}`);
    }
  }

  if (errors.length) {
    console.error(`\ncheck-dwca-xml: ${errors.length} issue(s) across ${entries.length} archive(s).\n`);
    for (const e of errors) console.error(`  - ${e}`);
    console.error('');
    process.exit(1);
  }

  console.log(`check-dwca-xml: ok (${checked} XML descriptors across ${entries.length} archives, all well-formed)`);
}

// Only run as a CLI when executed directly (cross-platform entry-point
// check) — importable for the unit test without triggering process.exit.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(`\ncheck-dwca-xml: ${e && e.message ? e.message : e}`);
    process.exit(1);
  });
}
