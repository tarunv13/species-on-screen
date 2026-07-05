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
import { classifyReach, REACH_META, reasonCodesVerbatim } from './evidence-reach.mjs';
import { interrogationChain } from './evidence-interrogate.mjs';
import { withSubject } from '../src/subject.js';
import { CLAIM_PREFIX, claimDomId } from './interrogation-url.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(REPO_ROOT, 'public', 'evidence');
const MANIFEST = path.join(REPO_ROOT, 'cinematic-language', 'place-manifest.json');

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const CSS = `
/* Cross-depth transition (W3C View Transitions): calm dip where supported, plain navigation where not. */
@view-transition{navigation:auto}
::view-transition-old(root),::view-transition-new(root){animation-duration:.35s}
:root{--paper:#f5f1e8;--ink:#241f1a;--muted:#6b6258;--rule:#ddd4c4;--teal:#2f7d6b;--warn:#9a5b2e;--slate:#4a5573}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.6 Georgia,'Iowan Old Style',serif}
.wrap{max-width:820px;margin:0 auto;padding:3rem 1.25rem 5rem}
h1{font-size:2rem;margin:0 0 .25rem;view-transition-name:eke-subject}.sub{color:var(--muted);margin:0 0 2rem;font-size:.95rem}
.note{border-left:3px solid var(--teal);padding:.4rem 0 .4rem .9rem;color:var(--muted);font-size:.9rem;margin:0 0 2.25rem}
.claim{border-top:1px solid var(--rule);padding:1.25rem 0}
.head{font-size:1.15rem;margin:0 0 .35rem}.rel{color:var(--teal);font-style:italic}
.badge{display:inline-block;font:600 .72rem/1 -apple-system,system-ui,sans-serif;letter-spacing:.04em;padding:.28rem .5rem;border-radius:.25rem;vertical-align:.1em;margin-left:.4rem}
.ok{background:#e5efe9;color:var(--teal)}.no{background:#f3e7dc;color:var(--warn)}.open{background:#e7e9f1;color:var(--slate)}
.src{color:var(--muted);font-size:.92rem;margin:.15rem 0 .5rem}
.reach{font-size:.86rem;margin:.1rem 0 .5rem;padding:.35rem 0 .35rem .8rem;border-left:2px solid var(--slate);color:var(--slate);font-style:italic}
.codes{font-size:.82rem;margin:.1rem 0 .5rem;color:var(--muted)}
.codes .lbl{letter-spacing:.03em}
.codes code{display:inline-block;background:#ece7db;border-radius:.2rem;padding:.06rem .34rem;margin:.05rem .12rem .05rem 0;font:.78rem/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--ink)}
.ev{list-style:none;margin:0;padding:0;font:.86rem/1.5 -apple-system,system-ui,sans-serif;color:var(--muted)}
.ev li{padding:.1rem 0}.ev .sci{font-style:italic;color:var(--ink)}
.interrogate{margin:.5rem 0 .1rem;font:.86rem/1.5 -apple-system,system-ui,sans-serif}
.interrogate>summary{cursor:pointer;color:var(--teal);list-style:none;display:inline-block;padding:.15rem 0;letter-spacing:.02em}
.interrogate>summary::-webkit-details-marker{display:none}
.interrogate>summary::before{content:"▸ ";color:var(--muted)}
.interrogate[open]>summary::before{content:"▾ "}
.chain{border-left:2px solid var(--rule);margin:.5rem 0 .3rem;padding:.3rem 0 .3rem .9rem;color:var(--muted)}
.chain .row{padding:.12rem 0}.chain .k{color:var(--ink);font-weight:600}
.chain code{background:#ece7db;border-radius:.2rem;padding:.06rem .34rem;font:.8rem/1.4 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--ink)}
.chain .occ{margin:.35rem 0 0}.chain .occ .sci{font-style:italic;color:var(--ink)}
.chain .occ .facts{color:var(--muted)}
.interrogate{scroll-margin-top:1.5rem}
.foot{margin-top:3rem;color:var(--muted);font-size:.82rem;border-top:1px solid var(--rule);padding-top:1rem}
a{color:var(--teal)}
.nav{display:flex;flex-wrap:wrap;gap:.6rem;margin:0 0 2.25rem}
.nav a{display:inline-block;border:1px solid var(--rule);border-radius:.3rem;padding:.4rem .75rem;text-decoration:none;font:.85rem/1 -apple-system,system-ui,sans-serif;color:var(--teal);background:#fff}
.nav .depth{color:var(--muted);font-size:.72rem;display:block;margin-bottom:.15rem;letter-spacing:.03em}
`;

// D8 — interrogation state in the URL fragment. A tiny, self-contained,
// progressive-enhancement script (the ledger content stays static — M35): it
// opens the claim addressed by #claim-N on load and on back/forward, and opening
// a claim sets the fragment (a history entry, so back/forward retraces). Without
// JS the <details> still work manually; only URL restoration is lost. The
// subject stays in ?subject= (D1), interrogation in the fragment — one model.
const INTERROGATE_SYNC = `<script>
(function(){
  var RX = new RegExp('^' + ${JSON.stringify(CLAIM_PREFIX)} + '\\\\d+$');
  function target(){ var h = (location.hash || '').replace(/^#/, ''); return RX.test(h) ? h : ''; }
  function sync(){
    var id = target();
    document.querySelectorAll('details.interrogate').forEach(function(d){
      var match = d.id === id; if (d.open !== match) d.open = match;
    });
    var el = id && document.getElementById(id);
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
  }
  window.addEventListener('hashchange', sync);
  document.querySelectorAll('details.interrogate').forEach(function(d){
    d.addEventListener('toggle', function(){
      if (d.open){ if (location.hash !== '#' + d.id) location.hash = d.id; }
      else if (location.hash === '#' + d.id){ history.replaceState(null, '', location.pathname + location.search); }
    });
  });
  sync();
})();
</script>`;

function crossDepthNav(surfaces, subjectId) {
  const s = surfaces || {};
  const links = [];
  // Step-back / ascend along the epistemic-depth axis: from this evidential
  // record up to the analytical (interaction web) and experiential (encounter)
  // depths, using the manifest's own cross-surface bindings (ADR-001). D1: the
  // held subject (canonical placeId) is carried on each link as ?subject=.
  if (s.cinematic && s.cinematic.slug) {
    links.push(`<a href="${esc(withSubject(`../places/${s.cinematic.slug}.html`, subjectId))}"><span class="depth">experiential</span>${esc(s.cinematic.enterLabel || 'Enter the place')} →</a>`);
  }
  const fr = (s.atlas || []).find((a) => a.kind === 'field-record');
  if (fr && fr.slug) {
    links.push(`<a href="${esc(withSubject(`../atlas/${fr.slug}.html`, subjectId))}"><span class="depth">analytical</span>Interaction web →</a>`);
  }
  if (s.research && s.research.slug) {
    links.push(`<a href="${esc(withSubject(`../notes/${s.research.slug}.html`, subjectId))}"><span class="depth">research</span>Field notes →</a>`);
  }
  return links.length ? `  <nav class="nav" aria-label="This place across the environment">\n    ${links.join('\n    ')}\n  </nav>` : '';
}

function pageHtml(place, records) {
  const displayName = place.displayName;
  const nav = crossDepthNav(place.surfaces, place.placeId);
  const claims = records.map((r, i) => {
    const meta = REACH_META[r.reach];
    // D6: the badge names REACH (not truth), identically shaped for every state —
    // no pass/fail, no code list smuggled into the badge text.
    const badge = `<span class="badge ${meta.cls}">${esc(meta.badge)}</span>`;
    // D6: the validator's reason codes are shown VERBATIM beside the badge — the
    // exact append-only strings from check-bindings.js, never paraphrased.
    const codes = reasonCodesVerbatim(r.reachCodes);
    const codesLine = codes.length
      ? `\n        <p class="codes"><span class="lbl">reason codes:</span> ${codes.map((c) => `<code>${esc(c)}</code>`).join(' ')}</p>`
      : '';
    // D7: non-resolution is a first-class terminal state — a calm italic note
    // framing the open reach as an open question rather than a failure.
    const reachNote = r.reach === 'open' ? `\n        <p class="reach">${esc(meta.note)}</p>` : '';
    // D5 — INTERROGATE: a depth-local <details> reveal (no navigation, no JS)
    // showing the full evidence chain, inlined at build time straight from the
    // validator record. interrogationChain() only selects fields; it never
    // re-derives, so the reveal cannot drift from check-bindings.js.
    const chain = interrogationChain(r);
    const occRow = (o) => `<div class="occ"><span class="k">${esc(o.role)}:</span> <span class="sci">${esc(o.name || o.occurrenceID)}</span>
          <div class="facts">occurrenceID <code>${esc(o.occurrenceID)}</code> · GBIF backbone ${o.backbone ? 'reconciled' : 'unreconciled'} · as-of ${o.asOf ? `<code>${esc(o.asOf)}</code>` : '—'} · backbone version ${o.pinned ? 'pinned' : 'unpinned'}</div></div>`;
    const chainCodes = chain.reasons.length
      ? chain.reasons.map((c) => `<code>${esc(c)}</code>`).join(' ')
      : '<span class="k">none</span>';
    const interrogate = `\n        <details class="interrogate" id="${claimDomId(i + 1)}">
          <summary>Interrogate — trace this claim to its evidence</summary>
          <div class="chain">
            <div class="row"><span class="k">validator verdict (baseline):</span> <code>${esc(chain.verdict || '—')}</code></div>
            <div class="row"><span class="k">reason codes:</span> ${chainCodes}</div>
            <div class="row"><span class="k">source:</span> ${esc(chain.source || '(none declared)')}</div>
            ${occRow(chain.subject)}
            ${occRow(chain.object)}
          </div>
        </details>`;
    return `      <article class="claim">
        <p class="head">${esc(r.subject.name || r.resourceID)} <span class="rel">${esc(r.relation)}</span> ${esc(r.object.name || r.relatedResourceID)}${badge}</p>
        <p class="src">Source: ${esc(r.source || '(none declared)')}</p>${codesLine}${reachNote}${interrogate}
      </article>`;
  }).join('\n');
  const traceable = records.filter((r) => r.reach === 'traceable').length;
  const open = records.filter((r) => r.reach === 'open').length;
  const gap = records.filter((r) => r.reach === 'gap').length;
  const baseline = traceable + open; // baseline-traceable = reaches a named source, resolvable or not
  const parts = [`${traceable} resolve to a persistent identifier`];
  if (open) parts.push(`${open} reach a named source whose resolution is honestly open`);
  if (gap) parts.push(`${gap} baseline-incomplete`);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(displayName)} — evidence ledger</title><style>${CSS}</style></head>
<body><main class="wrap">
  <h1>${esc(displayName)}</h1>
  <p class="sub">Evidence ledger · ${records.length} interaction claim${records.length === 1 ? '' : 's'} · ${parts.join(' · ')}</p>
  <p class="note">Each claim below is bound to the Darwin Core records that license it. This ledger certifies <strong>traceability, not truth</strong>: it shows what each claim rests on and how far its warrant reaches. Where a claim reaches a named source but no persistent identifier resolves it, that <strong>non-resolution is shown as a first-class terminal state</strong> — an open question, not a failure.</p>
${nav}
${claims}
  <p class="foot">Generated from <code>public/dwca/</code> by the reference validator (<code>scripts/check-bindings.js</code>). Regenerated every build; derived, not a source of truth. · <a href="./index.html">All places</a></p>
</main>
${INTERROGATE_SYNC}
</body></html>
`;
}

function indexHtml(entries) {
  const items = entries.map((e) => {
    const openClause = e.open ? `, ${e.open} reaching a named source whose resolution is honestly open` : '';
    const gapClause = e.gap ? `, ${e.gap} with reach incomplete at baseline` : '';
    return `    <li><a href="./${esc(e.slug)}.html">${esc(e.displayName)}</a> — ${e.total} claim${e.total === 1 ? '' : 's'}, ${e.traceable} reaching evidence that resolves to a persistent identifier${openClause}${gapClause}</li>`;
  }).join('\n');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Evidence ledgers — Ecological Knowledge Environment</title><style>${CSS}</style></head>
<body><main class="wrap">
  <h1>Evidence ledgers</h1>
  <p class="sub">The evidential depth of the Ecological Knowledge Environment — each place's interaction claims, traced to the evidence that licenses them.</p>
  <p class="note">Certifies <strong>traceability, not truth</strong>. A claim that reaches a named source but no resolvable identifier is shown as an <strong>open question</strong> — a first-class terminal state, not a failure.</p>
  <ul class="ev" style="font-size:1rem">
${items}
  </ul>
</main></body></html>
`;
}

// Run the reference validator once and return its per-binding records. The
// validator exits non-zero when bindings are non-conformant (expected at L2,
// where a citation source is SOURCE_UNRESOLVABLE) but still writes JSON to
// stdout; only a total failure with no stdout is fatal here.
function runValidator(level) {
  const args = ['scripts/check-bindings.js', '--json'];
  if (level) args.push(`--level=${level}`);
  const run = spawnSync('node', args, { cwd: REPO_ROOT, encoding: 'utf8' });
  if (!run.stdout) {
    console.error(`build-evidence: validator failed at ${level || 'L1'} —`, (run.stderr || '').trim());
    process.exit(1);
  }
  return JSON.parse(run.stdout);
}

async function main() {
  // Baseline (L1) gives the authoritative verdict; L2 adds the SOURCE_UNRESOLVABLE
  // signal that distinguishes honest non-resolution (open) from full traceability.
  // Both runs iterate the same archives and rows in the same order, so the record
  // arrays align positionally — the honest join key (relationship ids are not
  // guaranteed unique).
  const records = runValidator(null);
  const l2 = runValidator('L2');
  if (l2.length !== records.length) {
    console.error(`build-evidence: L1/L2 record count mismatch (${records.length} vs ${l2.length}).`);
    process.exit(1);
  }
  records.forEach((r, i) => {
    r.reach = classifyReach(r.verdict, l2[i].reasons);
    // The L2 reason set is the fullest verbatim diagnostic (L2 ⊇ L1 codes); it is
    // shown as-is, straight from the validator (D6 — verbatim, no re-derivation).
    r.reachCodes = l2[i].reasons;
  });

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
    entries.push({
      slug,
      displayName: place.displayName || slug,
      traceable: recs.filter((r) => r.reach === 'traceable').length,
      open: recs.filter((r) => r.reach === 'open').length,
      gap: recs.filter((r) => r.reach === 'gap').length,
      total: recs.length,
    });
  }
  entries.sort((a, b) => a.displayName.localeCompare(b.displayName));
  await writeFile(path.join(OUT_DIR, 'index.html'), indexHtml(entries));

  console.log(`build-evidence: wrote ${entries.length} evidence ledger(s) + index to public/evidence/`);
}

main().catch((e) => { console.error('build-evidence:', e && e.message ? e.message : e); process.exit(1); });
