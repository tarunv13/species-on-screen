#!/usr/bin/env node
/*
  scripts/curator-media-worksheet.mjs
  -----------------------------------
  The Research Curator's worklist for the V1.6 media archive, generated from
  the archive's own refusal record. It fabricates nothing: every row here was
  actually refused by scripts/media-citation-bar.mjs or by the harvester's
  stated relevance rule, and every row carries the identifier the curator will
  need to admit it by hand.

  WHY THIS EXISTS RATHER THAN A LOOSER RULE

  The relevance rule refuses Disneynature's "Tiger" (2024) because the title
  does not contain "Bengal tiger". That is a true positive the machine cannot
  see, and the correct response is a human, not a lower bar — loosening the
  rule to catch it also re-admits "Mud Crab" (2022), a film about an assault in
  an Australian coastal town. The bar stays strict and the curator arbitrates,
  which is the same L3 division of labour the DOI worksheet already uses.

  Parallel to, not part of, scripts/curator-worksheet.mjs: that one lifts the
  archives from L1 to L2/L3 and is generated from the reference validator. This
  one is about depictions. They share a discipline, not a data source.

  Writes .agents/curator-media-worksheet.md.
  Run: npm run curator-media-worksheet
*/

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ARCHIVE_DIR = join(ROOT, 'public', 'data', 'media-archive');
const OUT = join(ROOT, '.agents', 'curator-media-worksheet.md');

const REASON_NOTE = {
  'RELEVANCE_NOT_ESTABLISHED:taxon_absent_from_title':
    'The taxon name is not in the title. Frequently a TRUE POSITIVE — a documentary called "Tiger" is about tigers. Admit if the work is genuinely about this taxon.',
  'RELEVANCE_NOT_ESTABLISHED:name_absent_from_synopsis':
    'The title matched but the synopsis does not repeat the name. Often a title collision (a film called "Mud Crab" about an assault), sometimes just a terse synopsis. Read the synopsis before admitting.',
  'RELEVANCE_NOT_ESTABLISHED:no_disease_term_in_title':
    'The taxon is in the title but no disease term is. Usually correct — a genome assembly is not zoonosis literature. Admit only if the paper really is about infection or host association.',
  REFUSED_BARE_URL:
    'The record had no identifier, only a URL. If a stable id exists, add it; otherwise the record cannot enter.',
  REFUSED_NFT: 'Refused by policy. Do not admit.',
};

const files = existsSync(ARCHIVE_DIR)
  ? readdirSync(ARCHIVE_DIR).filter((f) => f.endsWith('.json')).sort()
  : [];

const md = [];
md.push('# Curator worksheet — the media archive\n');
md.push('**Generated** by `scripts/curator-media-worksheet.mjs` from each place\'s media archive.');
md.push('Regenerate after any harvest: `npm run media-archive && npm run curator-media-worksheet`.\n');
md.push('> Every row below was refused by the citation bar or the stated relevance rule.');
md.push('> **The bar is not to be loosened to clear this list.** Each row carries the identifier');
md.push('> it would have used, so admitting one is a human judgement plus a known id — not a');
md.push('> re-search. A refusal that is genuinely correct should simply be left here.\n');

if (!files.length) {
  md.push('_No media archive has been built yet._\n');
}

let totalRefused = 0;
for (const f of files) {
  const doc = JSON.parse(readFileSync(join(ARCHIVE_DIR, f), 'utf8'));
  const place = doc.place || f.replace(/\.json$/, '');
  md.push(`\n## ${place}\n`);
  md.push(`Built ${doc.generated || '(undated)'} — **${(doc.records || []).length} admitted**, `
    + `**${(doc.refused || []).length} refused**.\n`);

  const byReason = new Map();
  for (const r of doc.refused || []) {
    if (!byReason.has(r.reason)) byReason.set(r.reason, []);
    byReason.get(r.reason).push(r);
    totalRefused++;
  }

  for (const [reason, rows] of [...byReason.entries()].sort()) {
    md.push(`### ${reason} — ${rows.length}\n`);
    const note = REASON_NOTE[reason];
    if (note) md.push(`${note}\n`);
    md.push('| Year | Title | Taxon | Identifier | Admit? |');
    md.push('|---|---|---|---|---|');
    for (const r of rows.sort((a, b) => (a.year || 0) - (b.year || 0))) {
      const id = r.identifier ? `\`${r.identifier.scheme}:${r.identifier.value}\`` : '_none_';
      md.push(`| ${r.year || ''} | ${String(r.title).replace(/\|/g, '\\|')} | _${r.taxon}_ | ${id} | ☐ |`);
    }
    md.push('');
  }

  if ((doc.sources_skipped || []).length) {
    md.push('### Blocked on a credential, not on evidence\n');
    md.push('These classes are **absent, not empty**. Nothing was searched and found wanting; the');
    md.push('source could not be queried at all. Do not read an empty class as "no such records exist".\n');
    for (const s of doc.sources_skipped) md.push(`- ${s}`);
    md.push('');
  }
}

md.push('\n---\n');
md.push('**Standing refusal, not a backlog item:** CITES appendix listings are not to be written');
md.push('from memory while Species+ is unavailable. The listings are well known, which is exactly');
md.push('what makes it tempting; a guessed appendix is the Bates et al. 2005 error with higher');
md.push('stakes, because a wrong protection status is a claim about what is legal.');

writeFileSync(OUT, md.join('\n') + '\n', 'utf8');
console.log(`curator-media-worksheet: ${totalRefused} refused record(s) across ${files.length} place(s) → ${OUT.replace(ROOT, '.')}`);
