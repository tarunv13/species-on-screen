#!/usr/bin/env node
/*
  scripts/curator-worksheet.mjs
  -----------------------------
  Generates the exact, non-fabricating worklist a Research Curator needs to lift
  the archives from L1 to L2/L3 (see the L3 decision record and the handoff). It
  fabricates nothing: it runs the reference validator at L3 and reports, per gap,
  the real data already in the archives — which source citations need a verified
  DOI (L2), which occurrences need a real backbone-version pin (L3), and which
  bindings need an establishment date (L3). Deduplicates citations so the Curator
  sees the true number of distinct sources to verify, not one row per binding.

  Writes .agents/curator-l2-l3-worksheet.md. Run: npm run curator-worksheet.
  Regenerate after any archive change. Dependency-free (Node stdlib).
*/
import { spawnSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(REPO_ROOT, '.agents', 'curator-l2-l3-worksheet.md');

const run = spawnSync('node', ['scripts/check-bindings.js', '--json', '--level=L3'], {
  cwd: REPO_ROOT, encoding: 'utf8',
});
const records = JSON.parse(run.stdout);

// L2: unique source citations that are not persistent identifiers.
const sources = new Map(); // source string -> [{archive,id}]
for (const r of records) {
  if (r.reasons.includes('SOURCE_UNRESOLVABLE')) {
    const key = r.source || '(none)';
    if (!sources.has(key)) sources.set(key, []);
    sources.get(key).push(`${r.archive}/${r.id}`);
  }
}
// L3: per-archive counts of unpinned backbone and undated bindings.
const perArchive = new Map();
for (const r of records) {
  if (!perArchive.has(r.archive)) perArchive.set(r.archive, { unpinned: 0, undated: 0, total: 0 });
  const a = perArchive.get(r.archive);
  a.total++;
  if (r.reasons.includes('BACKBONE_UNPINNED')) a.unpinned++;
  if (r.reasons.includes('ASSERTION_UNATTRIBUTED')) a.undated++;
}

const md = [];
md.push('# Curator worksheet — lifting the archives from L1 to L2/L3\n');
md.push('**Generated** by `scripts/curator-worksheet.mjs` from the reference validator at L3.');
md.push('Nothing here is fabricated — it is the real gap inventory. **Rule: never invent a DOI,');
md.push('backbone-version, or date. If a value cannot be verified, leave the gap.** Regenerate after');
md.push('any archive edit. See `.agents/decisions/2026-07-03-l3-conformance-data-model.md`.\n');

md.push('## L2 — verify a persistent identifier for each source\n');
md.push(`There are **${sources.size} distinct source citations** that currently lack a DOI/URL in`);
md.push('`relationshipAccordingTo`. Find and confirm a resolving DOI (or stable URL) for each, then');
md.push('replace the citation string in the relevant `resource-relationship.txt` rows. A wrong DOI is');
md.push('worse than a citation string.\n');
md.push('| Source citation (to verify) | Used by (archive/binding) |');
md.push('|---|---|');
for (const [src, uses] of [...sources.entries()].sort()) {
  md.push(`| ${src.replace(/\|/g, '\\|')} | ${uses.join(', ')} |`);
}
md.push('');

md.push('## L3 — pin the backbone version and date each binding\n');
md.push('| Archive | bindings | need `dynamicProperties.backboneVersion` | need `relationshipEstablishedDate` |');
md.push('|---|--:|--:|--:|');
for (const [a, c] of [...perArchive.entries()].sort()) {
  md.push(`| ${a} | ${c.total} | ${c.unpinned} | ${c.undated} |`);
}
md.push('');
md.push('- **Backbone version:** add the GBIF Backbone Taxonomy version/DOI **actually used at ingest**');
md.push('  to each occurrence\'s `dynamicProperties` (`"backboneVersion": "…"`). Do not guess the snapshot.');
md.push('- **Establishment date:** decide the semantic (source publication date vs record-assembly date),');
md.push('  apply it consistently, and populate `relationshipEstablishedDate`.\n');
md.push('## Verify progress\n');
md.push('```sh');
md.push('node scripts/check-bindings.js public/dwca/<slug> --level=L2   # 0 gaps when L2 done');
md.push('node scripts/check-bindings.js public/dwca/<slug> --level=L3   # 0 gaps when L3 done');
md.push('npm run build:evidence                                        # refresh the ledgers');
md.push('```');

await writeFile(OUT, md.join('\n') + '\n');
console.log(`curator-worksheet: wrote ${sources.size} distinct sources to verify + per-archive L3 tasks → ${path.relative(REPO_ROOT, OUT)}`);
