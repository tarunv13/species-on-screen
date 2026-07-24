#!/usr/bin/env node
/*
  scripts/ingest/build-references.mjs
  -----------------------------------
  Structures each habitat's interaction bibliography into a machine-readable
  references.json beside its resource-relationship.txt, so the atlas field
  record can render full APA + identifier instead of a bare author-year string.

  Option A (ratified 2026-07-24): STRUCTURE + RENDER ONLY. No Crossref, no
  automated DOI resolution. DOI confirmation is a human Research Curator task
  under the ratified L3 conformance model
  (.agents/decisions/2026-07-03-l3-conformance-data-model.md); the backlog is
  scripts/curator-worksheet.mjs -> .agents/curator-l2-l3-worksheet.md. This
  script never invents an identifier.

  Two habitat classes:
  - EPR + Coral: already human-audited to full APA + DOI (M31/M32; M9C).
    Parsed VERBATIM from CREDITS.md '## Interaction literature'. Asserted DOIs
    become verified:true; books/reports/theses with no DOI are verified:true
    (legitimately none); entries whose CREDITS bracket marks the DOI
    unresolved/unverified/removed (Bates 2005; Hoey & Bellwood 2008) are
    verified:false and routed to the curator backlog. Any doi-like string
    inside a discussion bracket is NEVER extracted as an asserted identifier.
  - Sundarbans + Amazon: bare author-year (no titles); never audited. Every
    reference is verified:false, identifier:null, routed to the curator
    backlog. No resolution attempted.

  Writes public/dwca/<habitat>/references.json. For Sundarbans + Amazon it also
  rewrites their CREDITS.md '## Interaction literature' to show the pending
  state; EPR + Coral CREDITS.md are left untouched (they are the verbatim
  source of truth, including their human-authored curator notes).

  Run: npm run build:references. Dependency-free (Node stdlib).
*/
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DWCA = path.join(REPO_ROOT, 'public', 'dwca');
const TODAY = new Date().toISOString().slice(0, 10);
const BACKLOG = 'curator-worksheet L2 — see .agents/curator-l2-l3-worksheet.md';

const AUDITED = ['epr-vents', 'coral-triangle'];
const BACKLOGGED = ['sundarbans', 'amazon-varzea'];

/* ---- helpers ---- */

// Pull the bullet lines under '## Interaction literature' up to the next '## '.
function interactionBullets(credits) {
  const lines = credits.split(/\r?\n/);
  const start = lines.findIndex((l) => /^##\s+Interaction literature\s*$/i.test(l));
  if (start === -1) return [];
  const out = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s/.test(lines[i])) break;
    const m = lines[i].match(/^\s*-\s+(.*\S)\s*$/);
    if (m) out.push(m[1]);
  }
  return out;
}

const stripMd = (s) => s.replace(/\*(.+?)\*/g, '$1').replace(/\s{2,}/g, ' ').trim();

// A discussion bracket that says the DOI is not settled. If present, the entry
// is unresolved regardless of any doi-like text inside it.
function hasUnresolvedMarker(bullet) {
  const brackets = bullet.match(/\[[^\]]*\]/g) || [];
  return brackets.some((b) => /unresolved|unverified|removed|pending|not guessed|no persistent identifier/i.test(b));
}

// Asserted DOI only: a `doi:` prefix that is NOT inside a discussion bracket.
function assertedDoi(bullet) {
  const withoutBrackets = bullet.replace(/\[[^\]]*\]/g, '');
  const m = withoutBrackets.match(/doi:\s*(10\.[^\s)\]]+)/i);
  if (!m) return null;
  return m[1].replace(/[.,;]+$/, '');
}

function classifyType(bullet) {
  if (/\bthesis|dissertation|PhD\b/i.test(bullet)) return 'thesis';
  if (/University Press|CRC Press|\bPress\b|\(eds?\)|In .+\(eds?\)/i.test(bullet)) return 'book';
  if (/IUCN|Red List|\bEPA\b|TRAFFIC|Queensland|\breport\b/i.test(bullet)) return 'report';
  return 'journal';
}

// APA text: the citation without the trailing doi: and without any discussion
// bracket (the bracket, if any, stays in CREDITS.md for EPR/Coral).
function apaText(bullet) {
  let s = bullet;
  const br = s.indexOf(' [');
  if (br !== -1) s = s.slice(0, br);
  const di = s.search(/\s*doi:/i);
  if (di !== -1) s = s.slice(0, di);
  return stripMd(s).replace(/\.\s*$/, '') + '.';
}

/* ---- builders ---- */

function buildAudited(bullets) {
  return bullets.map((bullet) => {
    const unresolved = hasUnresolvedMarker(bullet);
    const doi = unresolved ? null : assertedDoi(bullet);
    const type = classifyType(bullet);
    const ref = { apa7: apaText(bullet), type, identifier: null, verified: false };
    if (doi) { ref.identifier = { kind: 'doi', value: doi }; ref.verified = true; }
    else if (unresolved) { ref.verified = false; ref.backlog = BACKLOG; }
    else { ref.verified = true; } // book/report/thesis with legitimately no DOI
    return ref;
  });
}

function buildBacklogged(bullets) {
  // Split compound citations ("A (2001); B (2002)") into distinct references.
  const seen = new Set();
  const refs = [];
  for (const bullet of bullets) {
    for (const piece of bullet.split(/;\s*/)) {
      const apa7 = stripMd(piece).replace(/\.\s*$/, '');
      if (!apa7 || seen.has(apa7)) continue;
      seen.add(apa7);
      refs.push({ apa7, type: 'unresolved', identifier: null, verified: false, backlog: BACKLOG });
    }
  }
  return refs;
}

// Rewrite CREDITS.md '## Interaction literature' for the backlog habitats so
// the file itself shows the pending-identifier state.
function rewriteCreditsInteraction(credits, refs) {
  const lines = credits.split(/\r?\n/);
  const start = lines.findIndex((l) => /^##\s+Interaction literature\s*$/i.test(l));
  if (start === -1) return credits;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) { if (/^##\s/.test(lines[i])) { end = i; break; } }
  const body = [
    '',
    '_Author-year citations; no title/DOI in the source. Every reference below is `verified:false`',
    '— an identifier is pending human confirmation via the Research Curator backlog',
    '(`npm run curator-worksheet` → `.agents/curator-l2-l3-worksheet.md`). No DOI is invented here._',
    '',
    ...refs.map((r) => `- ${r.apa7} — _identifier pending — curator backlog_`),
    '',
  ];
  return [...lines.slice(0, start + 1), ...body, ...lines.slice(end)].join('\n');
}

/* ---- run ---- */

const report = {};
for (const habitat of [...AUDITED, ...BACKLOGGED]) {
  const dir = path.join(DWCA, habitat);
  const creditsPath = path.join(dir, 'CREDITS.md');
  const credits = await readFile(creditsPath, 'utf8');
  const bullets = interactionBullets(credits);
  const audited = AUDITED.includes(habitat);
  const refs = audited ? buildAudited(bullets) : buildBacklogged(bullets);

  const json = {
    habitat,
    generated: TODAY,
    source: audited ? 'human-audit (verbatim from CREDITS.md)' : 'author-year — curator backlog',
    note: 'Option A: structure + render only. No automated DOI resolution. DOI confirmation is a human Research Curator task (L3 conformance model). Unresolved items are routed to curator-worksheet.',
    references: refs,
  };
  await writeFile(path.join(dir, 'references.json'), JSON.stringify(json, null, 2) + '\n');

  if (!audited) {
    await writeFile(creditsPath, rewriteCreditsInteraction(credits, refs));
  }

  const withDoi = refs.filter((r) => r.identifier && r.identifier.kind === 'doi').length;
  const noDoiOk = refs.filter((r) => r.verified && !r.identifier).length;
  const backlog = refs.filter((r) => !r.verified).length;
  report[habitat] = { total: refs.length, withDoi, noDoiOk, backlog, audited };
}

console.log('build-references: wrote references.json for', Object.keys(report).length, 'habitats');
for (const [h, r] of Object.entries(report)) {
  console.log(
    `  ${h.padEnd(15)} total=${r.total}  ` +
    (r.audited
      ? `verified-with-doi=${r.withDoi}  verified-no-doi(book/report)=${r.noDoiOk}  backlog(unresolved)=${r.backlog}  [preserved verbatim]`
      : `backlog-to-worksheet=${r.backlog}  [author-year]`)
  );
}
