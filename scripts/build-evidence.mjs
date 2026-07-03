#!/usr/bin/env node
/*
  scripts/build-evidence.mjs
  --------------------------
  Generates the EVIDENTIAL-DEPTH surface of the Ecological Knowledge Environment:
  a static, self-contained HTML "evidence ledger" per place, rendered from the
  reference validator's own output (scripts/check-bindings.js --json), so the
  page can never drift from the conformance verdicts it displays.

  This is the deepest, most stable stratum of the environment (founding spec §3):
  the light editorial record. It carries the "trace any claim to its evidence"
  capability with zero animation — pure evidence before spectacle — so it renders
  and is verifiable in any medium, and the experiential/analytical surfaces layer
  on top of it later without re-deriving the evidence.

  Output: public/evidence/<slug>.html + public/evidence/index.html (derived
  artifacts, regenerated every build; not a source of truth). Certifies
  traceability, not truth. Dependency-free (Node stdlib).
*/
import { spawnSync } from 'node:child_process';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(REPO_ROOT, 'public', 'evidence');
const MANIFEST = path.join(REPO_ROOT, 'cinematic-language', 'place-manifest.json');

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const CSS = `
/* Cross-depth transition (W3C View Transitions): calm dip where supported, plain navigation where not. */
@view-transition{navigation:auto}
::view-transition-old(root),::view-transition-new(root){animation-duration:.35s}
:root{--paper:#f5f1e8;--ink:#241f1a;--muted:#6b6258;--rule:#ddd4c4;--teal:#2f7d6b;--warn:#9a5b2e}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.6 Georgia,'Iowan Old Style',serif}
.wrap{max-width:820px;margin:0 auto;padding:3rem 1.25rem 5rem}
h1{font-size:2rem;margin:0 0 .25rem;view-transition-name:eke-subject}.sub{color:var(--muted);margin:0 0 2rem;font-size:.95rem}
.note{border-left:3px solid var(--teal);padding:.4rem 0 .4rem .9rem;color:var(--muted);font-size:.9rem;margin:0 0 2.25rem}
.claim{border-top:1px solid var(--rule);padding:1.25rem 0}
.head{font-size:1.15rem;margin:0 0 .35rem}.rel{color:var(--teal);font-style:italic}
.badge{display:inline-block;font:600 .72rem/1 -apple-system,system-ui,sans-serif;letter-spacing:.04em;padding:.28rem .5rem;border-radius:.25rem;vertical-align:.1em;margin-left:.4rem}
.ok{background:#e5efe9;color:var(--teal)}.no{background:#f3e7dc;color:var(--warn)}
.src{color:var(--muted);font-size:.92rem;margin:.15rem 0 .5rem}
.ev{list-style:none;margin:0;padding:0;font:.86rem/1.5 -apple-system,system-ui,sans-serif;color:var(--muted)}
.ev li{padding:.1rem 0}.ev .sci{font-style:italic;color:var(--ink)}
.foot{margin-top:3rem;color:var(--muted);font-size:.82rem;border-top:1px solid var(--rule);padding-top:1rem}
a{color:var(--teal)}
.nav{display:flex;flex-wrap:wrap;gap:.6rem;margin:0 0 2.25rem}
.nav a{display:inline-block;border:1px solid var(--rule);border-radius:.3rem;padding:.4rem .75rem;text-decoration:none;font:.85rem/1 -apple-system,system-ui,sans-serif;color:var(--teal);background:#fff}
.nav .depth{color:var(--muted);font-size:.72rem;display:block;margin-bottom:.15rem;letter-spacing:.03em}
`;

function crossDepthNav(surfaces) {
  const s = surfaces || {};
  const links = [];
  // Step-back / ascend along the epistemic-depth axis: from this evidential
  // record up to the analytical (interaction web) and experiential (encounter)
  // depths, using the manifest's own cross-surface bindings (ADR-001).
  if (s.cinematic && s.cinematic.slug) {
    links.push(`<a href="../places/${esc(s.cinematic.slug)}.html"><span class="depth">experiential</span>${esc(s.cinematic.enterLabel || 'Enter the place')} →</a>`);
  }
  const fr = (s.atlas || []).find((a) => a.kind === 'field-record');
  if (fr && fr.slug) {
    links.push(`<a href="../atlas/${esc(fr.slug)}.html"><span class="depth">analytical</span>Interaction web →</a>`);
  }
  if (s.research && s.research.slug) {
    links.push(`<a href="../notes/${esc(s.research.slug)}.html"><span class="depth">research</span>Field notes →</a>`);
  }
  return links.length ? `  <nav class="nav" aria-label="This place across the environment">\n    ${links.join('\n    ')}\n  </nav>` : '';
}

function pageHtml(place, records) {
  const displayName = place.displayName;
  const nav = crossDepthNav(place.surfaces);
  const claims = records.map((r) => {
    const cls = r.verdict === 'CONFORMANT' ? 'ok' : 'no';
    const badge = r.verdict === 'CONFORMANT'
      ? `<span class="badge ok">TRACEABLE</span>`
      : `<span class="badge no">GAP: ${esc(r.reasons.join(', '))}</span>`;
    const occ = (o) => `<li><span class="sci">${esc(o.name || o.occurrenceID)}</span> — backbone ${o.backbone ? 'reconciled' : 'unreconciled'}${o.asOf ? `, recorded ${esc(o.asOf)}` : ''}</li>`;
    return `      <article class="claim">
        <p class="head">${esc(r.subject.name || r.resourceID)} <span class="rel">${esc(r.relation)}</span> ${esc(r.object.name || r.relatedResourceID)}${badge}</p>
        <p class="src">Source: ${esc(r.source || '(none declared)')}</p>
        <ul class="ev">${occ(r.subject)}${occ(r.object)}</ul>
      </article>`;
  }).join('\n');
  const ok = records.filter((r) => r.verdict === 'CONFORMANT').length;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(displayName)} — evidence ledger</title><style>${CSS}</style></head>
<body><main class="wrap">
  <h1>${esc(displayName)}</h1>
  <p class="sub">Evidence ledger · ${ok}/${records.length} interaction claims traceable to evidence (baseline)</p>
  <p class="note">Each claim below is bound to the Darwin Core records that license it. This ledger certifies <strong>traceability, not truth</strong>: it shows what each claim rests on and where the evidence reaches, not that the interaction is correct.</p>
${nav}
${claims}
  <p class="foot">Generated from <code>public/dwca/</code> by the reference validator (<code>scripts/check-bindings.js</code>). Regenerated every build; derived, not a source of truth. · <a href="./index.html">All places</a></p>
</main></body></html>
`;
}

function indexHtml(entries) {
  const items = entries.map((e) => `    <li><a href="./${esc(e.slug)}.html">${esc(e.displayName)}</a> — ${e.ok}/${e.total} claims traceable</li>`).join('\n');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Evidence ledgers — Ecological Knowledge Environment</title><style>${CSS}</style></head>
<body><main class="wrap">
  <h1>Evidence ledgers</h1>
  <p class="sub">The evidential depth of the Ecological Knowledge Environment — each place's interaction claims, traced to the evidence that licenses them.</p>
  <p class="note">Certifies <strong>traceability, not truth</strong>.</p>
  <ul class="ev" style="font-size:1rem">
${items}
  </ul>
</main></body></html>
`;
}

async function main() {
  const run = spawnSync('node', ['scripts/check-bindings.js', '--json'], { cwd: REPO_ROOT, encoding: 'utf8' });
  if (run.status !== 0 && !run.stdout) {
    console.error('build-evidence: validator failed —', (run.stderr || '').trim());
    process.exit(1);
  }
  const records = JSON.parse(run.stdout);

  let places = {};
  if (existsSync(MANIFEST)) {
    const m = JSON.parse(await readFile(MANIFEST, 'utf8'));
    for (const p of m.places || []) {
      const slug = p && p.surfaces && p.surfaces.dwca && p.surfaces.dwca.slug;
      if (slug) places[slug] = p;
    }
  }

  const groups = new Map();
  for (const r of records) {
    if (!groups.has(r.archive)) groups.set(r.archive, []);
    groups.get(r.archive).push(r);
  }

  await mkdir(OUT_DIR, { recursive: true });
  const entries = [];
  for (const [slug, recs] of groups) {
    const place = places[slug] || { displayName: slug, surfaces: {} };
    await writeFile(path.join(OUT_DIR, `${slug}.html`), pageHtml(place, recs));
    entries.push({ slug, displayName: place.displayName || slug, ok: recs.filter((r) => r.verdict === 'CONFORMANT').length, total: recs.length });
  }
  entries.sort((a, b) => a.displayName.localeCompare(b.displayName));
  await writeFile(path.join(OUT_DIR, 'index.html'), indexHtml(entries));

  console.log(`build-evidence: wrote ${entries.length} evidence ledger(s) + index to public/evidence/`);
}

main().catch((e) => { console.error('build-evidence:', e && e.message ? e.message : e); process.exit(1); });
