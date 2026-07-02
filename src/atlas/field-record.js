/*
  Field record — research-surface scrollytelling controller (atlas/sundarbans).
  ------------------------------------------------------------------------------
  Canonical promotion of the Sundarbans field record from prototypes/ to the
  atlas surface. Reads a real Darwin Core Archive at /dwca/sundarbans/
  (Occurrence core + ResourceRelationship extension) and renders it as a
  scroll-driven field record: a sticky landscape stage carrying the body-system
  motion vocabulary, scroll-stepped sourced text, seasonality, and the
  development cascade. Research register — it names, places, counts and
  cites freely (platform-architecture §4). The cinematic surface is
  untouched and shares no runtime with this file.

  Data flow: fetch TSV → parse → ACTORS (occurrences) + RELS
  (interactions) → drive the canvas. The cascade is a derived scenario
  keyed off dynamicProperties.cascadeFailOrder; it never mutates the
  attested data.
*/

import Lenis from 'lenis';
import './field-record.css';
import { makeSpeciesArt } from '../prototypes/species-art.js';
import { makeBackdrop } from '../prototypes/biome-backdrop.js';
import { getPlaceBySurfaceSlug } from '../../cinematic-language/place-manifest.ts';

const BASE = import.meta.env.BASE_URL || '/';
// Which place to read. Prefers the ?place= query param (dev/prototype use);
// falls back to the URL filename so atlas/amazon-varzea.html resolves to
// 'amazon-varzea' with no query string. 'field-record' (prototype filename)
// is excluded; all unknowns default to 'sundarbans'.
const _qPlace = new URLSearchParams(location.search).get('place');
const _pPlace = location.pathname.split('/').pop().replace('.html', '');
const PLACE = _qPlace || (_pPlace && _pPlace !== 'field-record' ? _pPlace : 'sundarbans');
const DWCA = BASE + 'dwca/' + PLACE + '/';
const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const art = makeSpeciesArt(BASE);
const backdrop = makeBackdrop(BASE);

/* ---------- small utils ---------- */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const rgb = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
function mix(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }

/* ---------- TSV parser ---------- */
function parseTSV(text) {
  const lines = text.replace(/\r/g, '').split('\n').filter((l) => l.length);
  const head = lines[0].split('\t');
  return lines.slice(1).map((line) => {
    const cells = line.split('\t');
    const o = {};
    head.forEach((h, i) => { o[h] = cells[i]; });
    return o;
  });
}

/* ---------- role palette ---------- */
const ROLE = {
  primary_producer: [127, 214, 160],
  pollinator: [255, 212, 128],
  herbivore: [206, 196, 150],
  detritivore: [184, 152, 120],
  consumer: [120, 182, 212],
  predator: [128, 205, 222],
  mesopredator: [176, 200, 210],
  apex_predator: [232, 150, 96],
  human_community: [236, 170, 112],
};
let ACTORS = {};      // id -> actor
let RELS = [];        // {from,to,type,roid,according,remarks,season}
let actorList = [];

function relSeason(remarks) {
  if (/seasonal:wet/.test(remarks)) return 'wet';
  if (/seasonal:dry/.test(remarks)) return 'dry';
  return 'all';
}

async function loadDwc() {
  const [occT, relT] = await Promise.all([
    fetch(DWCA + 'occurrence.txt').then((r) => r.text()),
    fetch(DWCA + 'resource-relationship.txt').then((r) => r.text()),
  ]);
  parseTSV(occT).forEach((row) => {
    let dyn = {};
    try { dyn = JSON.parse(row.dynamicProperties); } catch (e) { dyn = {}; }
    const a = {
      id: row.occurrenceID,
      sci: row.scientificName,
      vern: row.vernacularName,
      iucn: dyn.iucnCategory || 'NE',
      role: dyn.trophicRole || 'consumer',
      bx: dyn.sceneX != null ? dyn.sceneX : 0.5,
      by: dyn.sceneY != null ? dyn.sceneY : 0.5,
      seasonal: dyn.seasonalPresence || { wet: 1, dry: 1 },
      fail: dyn.cascadeFailOrder || 0,
      refs: row.associatedReferences || '',
      lat: row.decimalLatitude, lng: row.decimalLongitude,
      // Real GBIF taxonomy — species-art picks the illustrated form from it.
      kingdom: row.kingdom || '', class: row.class || '',
      order: row.order || '', family: row.family || '',
      ph: Math.random() * 6.28,
      px: 0, py: 0,
    };
    ACTORS[a.id] = a;
  });
  actorList = Object.values(ACTORS);
  RELS = parseTSV(relT).map((row) => ({
    from: row.resourceID, to: row.relatedResourceID,
    type: row.relationshipOfResource, roid: row.relationshipOfResourceID,
    according: row.relationshipAccordingTo, remarks: row.relationshipRemarks,
    season: relSeason(row.relationshipRemarks),
  }));
}

/* ---------- the steps ---------- */
const A = (id) => ACTORS[id] || {};
function chip(id) {
  const a = A(id); const c = ROLE[a.role] || [200, 200, 200];
  return `<span class="fr-chip"><span class="dot" style="background:${rgb(c, 1)}"></span>${a.vern} <span class="sci">${a.sci}</span></span>`;
}
const STEPS_SUNDARBANS = [
  {
    kicker: 'Placement', title: 'Nine actors, one tidal forest',
    body: 'The Sundarbans is read here as an assemblage. Each actor — eight species and one human community — is placed from a Darwin Core occurrence record, with its scientific name, its rank, and its source.',
    chips: ['SUNDARBANS:OCC:1', 'SUNDARBANS:OCC:8', 'SUNDARBANS:OCC:9'],
    src: 'Darwin Core Archive · Occurrence core (this page reads it live)',
    state: { nerve: 1, labels: 1, edges: 0, water: 0, forest: 0, season: 1, cascade: 0, focus: [] },
  },
  {
    kicker: 'The web', title: 'Every line is a relationship',
    body: 'The relationships are not decoration; they are records. Each edge is a ResourceRelationship typed with an OBO Relations Ontology term — the same vocabulary the Global Biotic Interactions network uses.',
    chips: [], note: 'pollinates · eats · preysOn · interactsWith',
    src: 'Darwin Core Archive · ResourceRelationship extension',
    state: { nerve: 1, labels: 1, edges: 1, water: 0, forest: 0, season: 1, cascade: 0, focus: [] },
  },
  {
    kicker: 'Circulatory · water', title: 'The tide is the bloodstream',
    body: 'Twice a day the tide carries nutrients, larvae and mud-crab recruits through the channels. In the wet season the flow is at its fullest — the hilsa run, the crabs process the litter the mangrove drops.',
    chips: ['SUNDARBANS:OCC:4', 'SUNDARBANS:OCC:5'],
    src: 'Chand & Dey (2008); Hossain et al. (2019)',
    state: { nerve: 0.45, labels: 0.5, edges: 0.6, water: 1, forest: 0, season: 1, cascade: 0, focus: [] },
  },
  {
    kicker: 'Respiratory · forest', title: 'The forest breathes',
    body: 'Heritiera fomes — the sundri that gives the forest its name — fixes carbon, breathes through its pneumatophores at low tide, and feeds the whole web from below. Pollinated by the giant honey bee.',
    chips: ['SUNDARBANS:OCC:1', 'SUNDARBANS:OCC:2'],
    src: 'Siddiqi (2001); Gani (2003)',
    state: { nerve: 0.45, labels: 0.5, edges: 0.5, water: 0, forest: 1, season: 1, cascade: 0, focus: ['SUNDARBANS:OCC:1', 'SUNDARBANS:OCC:2'] },
  },
  {
    kicker: 'The people', title: 'Inside the web, not above it',
    body: 'The Mawali enter in the dry season to gather wild honey; the fishers work the channels in the wet. People are placed here as Homo sapiens — an occurrence in the same archive — bound to bees, to fish, and to the tiger.',
    chips: ['SUNDARBANS:OCC:9', 'SUNDARBANS:OCC:8'],
    src: 'Jalais (2010), oral accounts; Gani (2003)',
    state: { nerve: 1, labels: 1, edges: 1, water: 0, forest: 0, season: 0, cascade: 0, focus: ['SUNDARBANS:OCC:9', 'SUNDARBANS:OCC:8', 'SUNDARBANS:OCC:5', 'SUNDARBANS:OCC:2'] },
  },
  {
    kicker: 'Seasonality', title: 'The web is not the same all year',
    body: 'Move from wet to dry and the web re-weights itself: the honey relationship strengthens, the hilsa harvest thins, the channels drop. The interactions carry their own season in the record.',
    chips: [], note: 'wet  ⇄  dry',
    src: 'seasonalPresence (dynamicProperties); relationshipRemarks',
    state: { nerve: 0.7, labels: 0.6, edges: 0.8, water: 0.4, forest: 0.3, season: 0, cascade: 0, focus: [] },
  },
  {
    kicker: 'The cascade', title: 'One embankment, and the lines go dark',
    body: 'An aquaculture embankment severs a tidal channel. The sundri dies back first; then the detritus, the pollination, the browse; then the fish; then the predators. The people remain — but the harvest collapses and the tiger comes to the fence. This is mechanism, traced node by node, not a mood.',
    chips: [], note: 'failure propagates by cascadeFailOrder',
    src: 'IUCN (Heritiera fomes, EN); Jalais (2010) on conflict',
    warn: true,
    state: { nerve: 1, labels: 0.7, edges: 1, water: 0.3, forest: 0, season: 0, cascade: 1, focus: [] },
  },
];

/* Generic, data-driven steps for any other place (same 7-beat structure,
   prose derived from the actors and interactions in its DwC-A). The
   bespoke Sundarbans prose stays; new places get correct, sourced steps
   with zero hand-authoring. */
function buildGenericSteps() {
  const name = (PLACE_META && PLACE_META.name) || PLACE;
  const N = actorList.length;
  const producer = actorList.find((a) => a.role === 'primary_producer');
  const apex = actorList.find((a) => a.role === 'apex_predator') || actorList.find((a) => /predator/.test(a.role));
  const human = actorList.find((a) => a.role === 'human_community');
  const chipIds = [producer, apex, human].filter(Boolean).map((a) => a.id);
  const pV = producer ? producer.vern : 'The vegetation';
  const hV = human ? human.vern : 'People';
  return [
    { kicker: 'Placement', title: `${N} actors, one landscape`,
      body: `${name} is read here as an assemblage — ${N - 1} species and one human community — each placed from a Darwin Core occurrence record, with its scientific name and source.`,
      chips: chipIds, src: 'Darwin Core Archive · Occurrence core (read live)',
      state: { nerve: 1, labels: 1, edges: 0, water: 0, forest: 0, season: 1, cascade: 0, focus: [] } },
    { kicker: 'The web', title: 'Every line is a relationship',
      body: `The ${RELS.length} relationships are records, not decoration — each typed with an OBO Relations Ontology term and corroborated in GloBI or the cited literature.`,
      chips: [], note: 'pollinates · eats · preysOn · interactsWith',
      src: 'Darwin Core Archive · ResourceRelationship extension',
      state: { nerve: 1, labels: 1, edges: 1, water: 0, forest: 0, season: 1, cascade: 0, focus: [] } },
    { kicker: 'Circulatory · water', title: 'Water is the bloodstream',
      body: `Water moves through ${name}, carrying nutrients and connecting its lives. In the high-water season the flow is at its fullest.`,
      chips: [], src: 'seasonalPresence (dynamicProperties)',
      state: { nerve: 0.45, labels: 0.5, edges: 0.6, water: 1, forest: 0, season: 1, cascade: 0, focus: [] } },
    { kicker: 'Respiratory · forest', title: 'The vegetation breathes',
      body: `${pV} fixes carbon, exchanges gas with the air, and feeds the whole web from below.`,
      chips: producer ? [producer.id] : [], src: 'GBIF backbone taxonomy',
      state: { nerve: 0.45, labels: 0.5, edges: 0.5, water: 0, forest: 1, season: 1, cascade: 0, focus: producer ? [producer.id] : [] } },
    { kicker: 'The people', title: 'Inside the web, not above it',
      body: `${hV} are placed here as Homo sapiens — an occurrence in the same archive — bound to the lives around them.`,
      chips: human ? [human.id] : [], src: 'Darwin Core · Homo sapiens occurrence',
      state: { nerve: 1, labels: 1, edges: 1, water: 0, forest: 0, season: 0, cascade: 0, focus: human ? [human.id] : [] } },
    { kicker: 'Seasonality', title: 'The web is not the same all year',
      body: 'Move from high to low water and the web re-weights itself; the interactions carry their own season in the record.',
      chips: [], note: 'wet  ⇄  dry', src: 'relationshipRemarks; seasonalPresence',
      state: { nerve: 0.7, labels: 0.6, edges: 0.8, water: 0.4, forest: 0.3, season: 0, cascade: 0, focus: [] } },
    { kicker: 'The cascade', title: 'One pressure, and the lines go dark',
      body: `A development pressure severs the base of the web. ${pV} fails first; then its dependents; then the predators. ${hV} remain — but the relationships break. Mechanism, traced node by node, not a mood.`,
      chips: [], note: 'failure propagates by cascadeFailOrder',
      src: 'IUCN assessments; cascadeFailOrder', warn: true,
      state: { nerve: 1, labels: 0.7, edges: 1, water: 0.3, forest: 0, season: 0, cascade: 1, focus: [] } },
  ];
}

/* ---------- DOM: steps + observer ---------- */
let PLACE_META = null;
let STEPS = STEPS_SUNDARBANS;
let TARGET = Object.assign({}, STEPS[0].state);
let activeIdx = 0;
let NEWS = null;

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* The "current coverage" block: recent English news for this landscape
   (GDELT), shown in the cascade beat as the media joint between the
   attested record and the present. Degrades honestly when empty — never
   fabricated. */
function renderNews() {
  if (!NEWS || !NEWS.articles || !NEWS.articles.length) {
    return `<div class="fr-news"><span class="lbl">Current coverage · GDELT</span>`
      + `<p class="muted" style="margin:0;font-size:0.82rem">Recent English-language reporting for this landscape streams from the GDELT 2.0 news index. Run <code>npm run ingest:news ${escapeHtml(PLACE)}</code> to populate it.</p></div>`;
  }
  const items = NEWS.articles.slice(0, 5).map((a) =>
    `<a href="${escapeHtml(a.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(a.title)}`
    + `<span class="meta">${escapeHtml(a.date)} · ${escapeHtml(a.domain)}${a.country ? ' · ' + escapeHtml(a.country) : ''}</span></a>`).join('');
  return `<div class="fr-news"><span class="lbl">Current coverage · GDELT (${NEWS.articles.length})</span>${items}</div>`;
}

function buildSteps() {
  const wrap = document.getElementById('fr-steps');
  STEPS.forEach((s, i) => {
    const step = document.createElement('div');
    step.className = 'fr-step' + (i % 2 ? '' : '');
    const chips = (s.chips && s.chips.length) ? `<div class="fr-chips">${s.chips.map(chip).join('')}</div>` : '';
    const note = s.note ? `<div class="fr-chips"><span class="fr-chip">${s.note}</span></div>` : '';
    // The cascade beat carries the "current coverage" news block — real,
    // dated, sourced reporting as the joint between record and present.
    const newsBlock = s.warn ? renderNews() : '';
    step.innerHTML = `<div class="fr-card${s.warn ? ' warn' : ''}">
      <div class="kicker">${s.kicker}</div>
      <h2>${s.title}</h2>
      <p>${s.body}</p>
      ${chips}${note}
      <div class="fr-src"><span class="lbl">source</span>${s.src}</div>
      ${newsBlock}
    </div>`;
    step.dataset.idx = i;
    wrap.appendChild(step);
  });

  // The observer governs only the text cards + chrome (legend/season);
  // the stage itself glides continuously from scroll position.
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const i = +e.target.dataset.idx;
        document.querySelectorAll('.fr-step').forEach((s) => s.classList.toggle('is-active', s === e.target));
        activeIdx = i;
        updateChrome(i);
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  document.querySelectorAll('.fr-step').forEach((s) => obs.observe(s));
  recomputeStepCenters();
}

const LEGENDS = {
  default: [['relationship', '#9fc2c2'], ['signal', '#ffe6b0']],
  cascade: [['relationship', '#9fc2c2'], ['failing', '#ec6b52'], ['conflict', '#ec6b52']],
};
function updateChrome(i) {
  const s = STEPS[i];
  const seasonEl = document.getElementById('fr-season');
  seasonEl.textContent = (s.state.season >= 0.5 ? 'Wet season' : 'Dry season') + (s.state.cascade ? ' · degraded' : '');
  const leg = s.state.cascade ? LEGENDS.cascade : LEGENDS.default;
  document.getElementById('fr-legend').innerHTML = leg.map((r) =>
    `<div class="row"><span class="dot" style="background:${r[1]};box-shadow:0 0 7px ${r[1]}"></span>${r[0]}</div>`).join('');
}

/* ---------- canvas ---------- */
const cur = { nerve: 1, labels: 1, edges: 0, water: 0, forest: 0, season: 1, cascade: 0 };
let curFocus = [];
let cv, ctx, W = 0, H = 0, DPR = 1;
let scrollProg = 0;          // 0..1 across the whole scrolly (drives parallax)
let stepCenters = [];        // document-space y centre of each step
let hoveredId = null;
const pointer = { x: -1e4, y: -1e4, active: false, overUI: false };

const IUCN_LABEL = { CR: 'Critically endangered', EN: 'Endangered', VU: 'Vulnerable', NT: 'Near threatened', LC: 'Least concern', DD: 'Data deficient', NE: 'Not evaluated' };
const SAFE_IUCN = { LC: 1, NT: 1, NE: 1, DD: 1 };
const prettyRole = (r) => String(r || '').replace(/_/g, ' ').replace(/\b\w/, (c) => c.toUpperCase());

/* the glassmorphic species face-card, shown on hover */
function speciesRels(a) {
  const out = [];
  RELS.forEach((r) => {
    if (r.from === a.id && ACTORS[r.to]) out.push(`<em>${r.type}</em> ${ACTORS[r.to].vern}`);
    else if (r.to === a.id && ACTORS[r.from]) out.push(`${ACTORS[r.from].vern} <em>${r.type}</em> this`);
  });
  return out.slice(0, 4);
}
function updateCard(a) {
  const el = document.getElementById('fr-speciescard'); if (!el) return;
  if (!a) { el.classList.remove('is-on'); return; }
  const iucn = a.iucn || 'NE';
  const rels = speciesRels(a);
  const fam = a.family || a.class || '';
  el.innerHTML = `
    <div class="sc-vern">${a.vern}</div>
    <div class="sc-sci">${a.sci}</div>
    <div class="sc-tags">
      <span class="sc-tag iucn${SAFE_IUCN[iucn] ? ' safe' : ''}">${IUCN_LABEL[iucn] || iucn}</span>
      <span class="sc-tag">${prettyRole(a.role)}</span>
      ${fam ? `<span class="sc-tag">${fam}</span>` : ''}
    </div>
    ${rels.length ? `<div class="sc-rels"><span class="sc-lbl">interactions</span>${rels.map((r) => `<div class="sc-rel">${r}</div>`).join('')}</div>` : ''}
    <div class="sc-src">${a.refs && /gbif/i.test(a.refs) ? 'GBIF backbone taxonomy' : (a.refs || '')}</div>`;
  el.classList.add('is-on');
}
function positionCard(a) {
  const el = document.getElementById('fr-speciescard'); if (!el) return;
  const cw = el.offsetWidth || 272, chh = el.offsetHeight || 150;
  let x = a.px + 28; if (x + cw > window.innerWidth - 12) x = a.px - cw - 28;
  if (x < 12) x = 12;
  let y = a.py - 30; y = clamp(y, 12, window.innerHeight - chh - 12);
  el.style.left = Math.round(x) + 'px'; el.style.top = Math.round(y) + 'px';
}
function setHovered(a) {
  const id = a ? a.id : null;
  if (id !== hoveredId) { hoveredId = id; updateCard(a); }
  if (a) positionCard(a);
}

/* The stage state is interpolated CONTINUOUSLY from scroll position
   between adjacent steps, so the narrative glides rather than snapping. */
const STATE_KEYS = ['nerve', 'labels', 'edges', 'water', 'forest', 'season', 'cascade'];
function lerpState(a, b, f) {
  const o = {};
  for (const k of STATE_KEYS) o[k] = lerp(a[k] != null ? a[k] : 0, b[k] != null ? b[k] : 0, f);
  o.focus = (f < 0.5 ? a.focus : b.focus) || [];
  return o;
}
function recomputeStepCenters() {
  stepCenters = [...document.querySelectorAll('.fr-step')].map((el) => {
    const r = el.getBoundingClientRect(); return r.top + window.scrollY + r.height / 2;
  });
}
function stateFromScroll() {
  const max = document.body.scrollHeight - window.innerHeight;
  scrollProg = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
  if (!stepCenters.length || !STEPS.length) return STEPS[0] ? STEPS[0].state : {};
  const vc = window.scrollY + window.innerHeight / 2;
  if (vc <= stepCenters[0]) return STEPS[0].state;
  const last = stepCenters.length - 1;
  if (vc >= stepCenters[last]) return STEPS[last].state;
  for (let i = 0; i < last; i++) {
    if (vc >= stepCenters[i] && vc <= stepCenters[i + 1]) {
      const f = (vc - stepCenters[i]) / ((stepCenters[i + 1] - stepCenters[i]) || 1);
      return lerpState(STEPS[i].state, STEPS[i + 1].state, smooth(0, 1, f));
    }
  }
  return STEPS[last].state;
}

function resize() {
  // The stage is always full-viewport (.fr-graphic is sticky, 100vw x
  // 100vh), so size from the viewport directly — robust against any
  // layout-timing quirk in the parent's measured height at init.
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  // Re-bake the high-fidelity backdrop for this size + biome classification.
  backdrop.resize(W, H, PLACE_META && PLACE_META.type);
}

function actorAlive(a) {
  if (cur.cascade <= 0 || a.fail <= 0) return 1;
  const start = (a.fail - 1) / 5;
  return 1 - smooth(start, start + 0.18, cur.cascade);
}
function seasonW(season) { return season === 'all' ? 1 : (season === 'wet' ? lerp(0.35, 1, cur.season) : lerp(1, 0.35, cur.season)); }
function inFocus(id) { return curFocus.length === 0 || curFocus.indexOf(id) >= 0; }

const flow = []; for (let i = 0; i < 70; i++) flow.push({ p: Math.random(), lane: Math.random(), s: 0.02 + Math.random() * 0.05 });
const motes = []; for (let j = 0; j < 50; j++) motes.push({ x: Math.random(), y: Math.random(), v: 0.02 + Math.random() * 0.05, ph: Math.random() * 6.28 });
const smoke = []; for (let k = 0; k < 36; k++) smoke.push({ x: Math.random(), y: Math.random(), v: 0.03 + Math.random() * 0.05 });

function draw(now) {
  const t = now / 1000;
  // Continuous target from scroll position (glides between steps); ease
  // the live state toward it for an extra layer of smoothing.
  const tgt = stateFromScroll();
  for (const k of STATE_KEYS) cur[k] += ((tgt[k] != null ? tgt[k] : cur[k]) - cur[k]) * (REDUCE ? 0.3 : 0.09);
  curFocus = tgt.focus || [];

  const wy = backdrop.draw(ctx, t, scrollProg, { cascade: cur.cascade, season: cur.season, forest: cur.forest });

  // live positions (with depth-driven parallax: nearer actors drift more)
  actorList.forEach((a) => {
    const bob = Math.sin(t * 0.8 + a.ph) * 3;
    const depth = clamp((a.by - 0.38) / 0.54, 0, 1); // 0 far(high) .. 1 near(low)
    a.px = a.bx * W + (scrollProg - 0.5) * 60 * depth;
    a.py = a.by * H + bob;
    a.depth = depth;
  });
  // apex leans toward prey when the web is lit
  const tiger = ACTORS['SUNDARBANS:OCC:8'], deer = ACTORS['SUNDARBANS:OCC:3'];
  if (tiger && deer) { tiger.px += (deer.px - tiger.bx * W) * 0.05 * cur.nerve; }

  // hover hit-test → glassmorphic species face-card
  let hoverBest = null;
  if (pointer.active && !pointer.overUI) {
    let bd = 1e9;
    for (const a of actorList) { const dd = Math.hypot(a.px - pointer.x, a.py - pointer.y); const rad = 46 * (0.85 + 0.5 * (a.depth || 0.5)); if (dd < rad && dd < bd) { bd = dd; hoverBest = a; } }
  }
  setHovered(hoverBest);
  if (cv) cv.style.cursor = hoverBest ? 'pointer' : '';

  // CIRCULATORY — flowing water (normal blending; reads on light)
  if (cur.water > 0.01) {
    ctx.save();
    const a = cur.water * (1 - 0.4 * cur.cascade);
    for (const p of flow) { p.p = (p.p + p.s * 0.004) % 1; const x = p.p * W, y = wy + 8 + p.lane * (H - wy - 12) + Math.sin(x * 0.03 + t) * 3; ctx.fillStyle = rgb([70, 150, 170], a * 0.5 * (0.4 + p.lane)); ctx.beginPath(); ctx.arc(x, y, 1.7, 0, 6.28); ctx.fill(); }
    ctx.restore();
  }
  // RESPIRATORY — transpiration (pale, soft, reads on light)
  if (cur.forest > 0.01) {
    ctx.save();
    const a = cur.forest * (1 - 0.4 * cur.cascade);
    for (const m of motes) { m.y -= m.v * 0.004; if (m.y < 0.2) { m.y = 0.6; m.x = Math.random(); } ctx.fillStyle = rgb([86, 146, 100], a * 0.45 * (0.3 + 0.7 * (0.6 - m.y) / 0.4)); ctx.beginPath(); ctx.arc(m.x * W + Math.sin(t + m.ph) * 8, m.y * H, 1.6, 0, 6.28); ctx.fill(); }
    ctx.restore();
  }

  // EDGES — relationships (ink-toned lines, warm signals; read on light)
  if (cur.edges > 0.01) {
    RELS.forEach((r, i) => {
      const a = ACTORS[r.from], b = ACTORS[r.to]; if (!a || !b) return;
      const conflict = r.type === 'interactsWith' && /conflict/.test(r.remarks);
      const av = Math.min(actorAlive(a), actorAlive(b));
      const sW = seasonW(r.season);
      const foc = (inFocus(r.from) && inFocus(r.to)) ? 1 : 0.22;
      let col = [70, 96, 92], w = 1, alpha = (0.22 + 0.55 * av) * cur.edges * sW * foc;
      if (conflict) { const heat = smooth(0.45, 0.95, cur.cascade); col = mix([90, 110, 104], [184, 64, 40], heat); w = 1 + heat * 3; alpha = (0.28 + 0.5 * Math.max(av, heat)) * cur.edges * foc; }
      ctx.strokeStyle = rgb(col, alpha); ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(a.px, a.py - 6); ctx.lineTo(b.px, b.py - 6); ctx.stroke();
      // signal — a travelling dot (normal blending, warm/saturated)
      if (av > 0.05 || conflict) {
        const sp = ((t * 0.16 + i * 0.31) % 1); const sx = lerp(a.px, b.px, sp), sy = lerp(a.py - 6, b.py - 6, sp);
        const scol = conflict ? mix([214, 150, 60], [184, 64, 40], smooth(0.45, 0.95, cur.cascade)) : [206, 142, 52];
        ctx.fillStyle = rgb(scol, (0.55 + 0.4 * Math.max(av, conflict ? 0.4 : 0)) * cur.edges * foc);
        ctx.beginPath(); ctx.arc(sx, sy, 2.8, 0, 6.28); ctx.fill();
      }
      // edge label (type)
      if (cur.labels > 0.6 && cur.edges > 0.7 && foc === 1) {
        const mx = (a.px + b.px) / 2, my = (a.py + b.py) / 2 - 6;
        ctx.save(); ctx.shadowColor = 'rgba(255,255,255,0.8)'; ctx.shadowBlur = 4;
        ctx.fillStyle = rgb([58, 78, 74], 0.75 * cur.labels); ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(r.type, mx, my - 3); ctx.restore();
      }
    });
  }

  // NODES (illustrated species)
  actorList.forEach((a) => {
    const av = actorAlive(a);
    const presence = lerp(a.seasonal.dry, a.seasonal.wet, cur.season);
    const foc = inFocus(a.id) ? 1 : 0.34;
    const baseCol = ROLE[a.role] || [150, 150, 150];
    const inked = [baseCol[0] * 0.78, baseCol[1] * 0.78, baseCol[2] * 0.78]; // darker for the light stage
    // failing species fade toward the pale stage, not toward black
    let col = mix([188, 184, 172], inked, clamp(0.18 + 0.82 * av, 0, 1));
    // aerial perspective: far actors (high in frame) haze toward the sky
    const depth = a.depth != null ? a.depth : 0.6;
    if (depth < 0.62) col = mix(col, [198, 208, 204], (0.62 - depth) * 0.6);
    const isHover = a.id === hoveredId;
    const alpha = clamp((isHover ? 1 : (0.6 + 0.4 * av)) * presence * (isHover ? 1 : foc), 0, 1);
    const form = art.formOf(a);
    const baseS = (form === 'bigcat' || form === 'human' || form === 'tree' || form === 'dolphin') ? 1.25 : 1.05;
    // Species are the subject — drawn large. Near = larger, far = smaller;
    // the hovered species lifts further.
    const s = baseS * lerp(0.84, 1.18, depth) * 1.9 * (isHover ? 1.16 : 1);
    if (isHover) {
      ctx.save(); ctx.beginPath(); ctx.arc(a.px, a.py - 6, 30 + 8 * s, 0, 6.28);
      ctx.fillStyle = rgb([47, 125, 107], 0.1); ctx.fill();
      ctx.strokeStyle = rgb([47, 125, 107], 0.45); ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
    }
    art.draw(ctx, a, a.px, a.py, s, col, alpha, t, a.ph);
    // labels (dark ink with a soft light halo); hidden for the hovered
    // species since the face-card carries its name.
    if (cur.labels > 0.05 && !isHover) {
      const la = cur.labels * foc * (0.6 + 0.4 * av);
      const ly = a.py + 34 + 14 * (s - 1);
      ctx.save(); ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(255,255,255,0.85)'; ctx.shadowBlur = 5;
      ctx.fillStyle = rgb([34, 40, 32], 0.95 * la); ctx.font = '600 13px sans-serif'; ctx.fillText(a.vern, a.px, ly);
      ctx.fillStyle = rgb([92, 88, 74], 0.85 * la); ctx.font = 'italic 11px Georgia, serif'; ctx.fillText(a.sci, a.px, ly + 14);
      ctx.restore();
    }
  });

  // CASCADE: embankment + ember haze + smoke (light register)
  if (cur.cascade > 0.01) {
    const ex = W * 0.94, ey = H * 0.8, ig = smooth(0, 0.18, cur.cascade);
    ctx.fillStyle = rgb([70, 56, 44], 0.6 * ig); ctx.fillRect(ex - 30, ey - 8, 34, 24); // embankment
    const fl = 0.5 + 0.5 * Math.sin(t * 3);
    const em = ctx.createRadialGradient(ex - 14, ey, 0, ex - 14, ey, 110);
    em.addColorStop(0, rgb([224, 120, 56], 0.42 * ig * (0.6 + 0.4 * fl))); em.addColorStop(1, 'rgba(224,120,56,0)');
    ctx.fillStyle = em; ctx.beginPath(); ctx.arc(ex - 14, ey, 110, 0, 6.28); ctx.fill();
    for (const sk of smoke) { sk.y -= sk.v * 0.004; if (sk.y < 0) { sk.y = 1; sk.x = Math.random(); } ctx.fillStyle = rgb([120, 110, 100], 0.12 * ig * sk.y); ctx.beginPath(); ctx.arc(ex - 14 + (sk.x - 0.5) * 70 * sk.y, ey - (1 - sk.y) * H * 0.66, 7 + (1 - sk.y) * 16, 0, 6.28); ctx.fill(); }
  }

  requestAnimationFrame(draw);
}

/* ---------- sound: procedural bed (ported from places/sundarbans.js) + scene gain ---------- */
let audioCtx = null, master = null, soundOn = false;
function startAudio() {
  if (audioCtx) return;
  const Ctx = window.AudioContext || window.webkitAudioContext; if (!Ctx) return;
  audioCtx = new Ctx();
  master = audioCtx.createGain(); master.gain.value = 0; master.connect(audioCtx.destination);
  const o1 = audioCtx.createOscillator(); o1.type = 'sine'; o1.frequency.value = 48;
  const o2 = audioCtx.createOscillator(); o2.type = 'sine'; o2.frequency.value = 52.4;
  const df = audioCtx.createBiquadFilter(); df.type = 'lowpass'; df.frequency.value = 220;
  const dg = audioCtx.createGain(); dg.gain.value = 0.07;
  o1.connect(df); o2.connect(df); df.connect(dg); dg.connect(master); o1.start(); o2.start();
  const bufLen = audioCtx.sampleRate * 4; const buf = audioCtx.createBuffer(1, bufLen, audioCtx.sampleRate);
  const ch = buf.getChannelData(0); for (let i = 0; i < bufLen; i++) ch[i] = (Math.random() * 2 - 1) * 0.5;
  const noise = audioCtx.createBufferSource(); noise.buffer = buf; noise.loop = true;
  const nf = audioCtx.createBiquadFilter(); nf.type = 'lowpass'; nf.frequency.value = 600; nf.Q.value = 0.7;
  const ng = audioCtx.createGain(); ng.gain.value = 0.06; noise.connect(nf); nf.connect(ng); ng.connect(master); noise.start();
  const fl = audioCtx.createOscillator(); fl.type = 'sine'; fl.frequency.value = 0.05;
  const fa = audioCtx.createGain(); fa.gain.value = 220; fl.connect(fa); fa.connect(nf.frequency); fl.start();
  const n2 = audioCtx.createBufferSource(); n2.buffer = buf; n2.loop = true;
  const sf = audioCtx.createBiquadFilter(); sf.type = 'bandpass'; sf.frequency.value = 4500; sf.Q.value = 1.2;
  const sg = audioCtx.createGain(); sg.gain.value = 0.018; n2.connect(sf); sf.connect(sg); sg.connect(master); n2.start();
  master.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 4);
}
function toggleSound() {
  const btn = document.getElementById('fr-sound');
  if (!soundOn) { startAudio(); soundOn = true; btn.textContent = '⏸ Sound: on'; btn.setAttribute('aria-pressed', 'true'); }
  else { soundOn = false; if (master) master.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.6); btn.textContent = '▷ Sound: off'; btn.setAttribute('aria-pressed', 'false'); }
}

/* ---------- sources / archive panel ---------- */
function citationsFrom() {
  const set = new Set();
  actorList.forEach((a) => a.refs.split(/;\s*/).forEach((c) => c && set.add(c.trim())));
  RELS.forEach((r) => r.according && set.add(r.according.trim()));
  return [...set].sort();
}
function buildSources() {
  const el = document.getElementById('fr-sources');
  const rels = RELS.map((r) => `<li>${A(r.from).vern} <em>${r.type}</em> ${A(r.to).vern} <span style="opacity:.7">— ${A(r.from).sci} → ${A(r.to).sci}; according to ${r.according}</span></li>`).join('');
  const cites = citationsFrom().map((c) => `<li>${c}</li>`).join('');
  el.innerHTML = `
    <h2>The interaction web</h2>
    <ul>${rels}</ul>
    <h2>Sources</h2>
    <ol>${cites}</ol>
    <h2>Darwin Core mapping</h2>
    <table class="dwc-table">
      <tr><th>What you saw</th><th>Darwin Core term</th></tr>
      <tr><td>Actor placement</td><td><code>occurrenceID</code>, <code>scientificName</code>, <code>decimalLatitude/Longitude</code></td></tr>
      <tr><td>An interaction edge</td><td><code>ResourceRelationship</code>: <code>relationshipOfResource</code> (OBO RO term)</td></tr>
      <tr><td>Seasonality &amp; scene</td><td><code>dynamicProperties</code>, <code>month</code>; <code>relationshipRemarks</code></td></tr>
      <tr><td>The people</td><td><code>scientificName</code> = <em>Homo sapiens</em>, <code>basisOfRecord</code> = HumanObservation</td></tr>
      <tr><td>Citations</td><td><code>associatedReferences</code>, <code>relationshipAccordingTo</code></td></tr>
    </table>
    <h2>The archive</h2>
    <p style="font-family:var(--fr-sans);font-size:.92rem;line-height:1.6;color:var(--fr-ink-soft)">This page reads a real Darwin Core Archive. Open the files directly:</p>
    <p>
      <a class="fr-archive" href="${DWCA}meta.xml">meta.xml ↗</a>
      <a class="fr-archive" href="${DWCA}occurrence.txt">occurrence.txt ↗</a>
      <a class="fr-archive" href="${DWCA}resource-relationship.txt">resource-relationship.txt ↗</a>
      <a class="fr-archive" href="${DWCA}eml.xml">eml.xml ↗</a>
    </p>
    <p class="fr-foot">Sound: a procedural biome bed (low drone, water bed, insect shimmer) generated in the browser; openly-licensed field recordings are credited in
      <a href="${DWCA}CREDITS.md">CREDITS.md</a> as they are added. Species are illustrated from their real GBIF taxonomy; a photoreal plate dropped into <code>public/art/</code> upgrades any species with no code change.
      ${PLACE === 'sundarbans' ? `The attested field note is at <a href="${BASE}notes/sundarbans-bengal-tiger-saline-swimmer.html">notes/</a>.` : ''}</p>
  `;
}

/* ---------- boot ---------- */
async function init() {
  // Back navigation — injected before async data loads so it appears immediately.
  const nav = document.createElement('nav');
  nav.className = 'fr-nav';
  nav.setAttribute('aria-label', 'Site navigation');
  const atlasLink = document.createElement('a');
  atlasLink.href = BASE + 'atlas/';
  atlasLink.textContent = '← Living Atlas';
  nav.appendChild(atlasLink);
  // Cross-surface nav, derived from the canonical Place Manifest (ADR-001).
  // Replaces the per-place branches (M25 Phase 1B). Reproduces prior output and
  // order exactly: each companion atlas ("Research companion →"), then the
  // cinematic place (its manifest enterLabel). A field record never links to
  // itself, and a place with no cinematic (e.g. amazon-varzea) gets only the
  // "← Living Atlas" link above, as before. PLACE is the atlas slug, so the
  // manifest lookup is by surface slug.
  const manifestPlace = getPlaceBySurfaceSlug(PLACE);
  if (manifestPlace) {
    for (const a of (manifestPlace.surfaces.atlas || [])) {
      if (a.kind === 'companion') {
        const companionLink = document.createElement('a');
        companionLink.href = BASE + 'atlas/' + a.slug + '.html';
        companionLink.textContent = 'Research companion →';
        nav.appendChild(companionLink);
      }
    }
    if (manifestPlace.surfaces.cinematic) {
      const enterLink = document.createElement('a');
      enterLink.href = BASE + 'places/' + manifestPlace.surfaces.cinematic.slug + '.html';
      enterLink.textContent = manifestPlace.surfaces.cinematic.enterLabel;
      nav.appendChild(enterLink);
    }
  }
  const fr = document.getElementById('fr');
  if (fr) fr.insertBefore(nav, fr.firstChild);

  cv = document.getElementById('fr-canvas'); ctx = cv.getContext('2d');
  document.getElementById('fr-sound').addEventListener('click', toggleSound);
  window.addEventListener('scroll', () => { const h = document.getElementById('fr-scrollhint'); if (h && window.scrollY > 40) h.style.opacity = '0'; }, { passive: true });
  // Pointer tracking for the hover species face-card.
  window.addEventListener('pointermove', (e) => {
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
    pointer.overUI = !!(e.target && e.target.closest && e.target.closest('.fr-card, .fr-sources, .fr-masthead, .fr-speciescard'));
  }, { passive: true });
  window.addEventListener('pointerleave', () => { pointer.active = false; setHovered(null); }, { passive: true });
  // Place metadata (name/type) from the ingest registry, for the masthead.
  try {
    const idx = await fetch(BASE + 'dwca/index.json').then((r) => r.json());
    PLACE_META = (idx || []).find((p) => p.id === PLACE) || null;
  } catch (e) { PLACE_META = null; }
  try {
    await loadDwc();
  } catch (e) {
    document.getElementById('fr-steps').innerHTML = `<div class="fr-step center"><div class="fr-card"><h2>Archive unavailable</h2><p class="muted">The Darwin Core Archive at /dwca/${PLACE}/ could not be loaded. Run <code>npm run ingest ${PLACE}</code>.</p></div></div>`;
    return;
  }
  // Masthead + steps adapt to the place.
  if (PLACE_META) {
    document.title = `Field record · ${PLACE_META.name}`;
    const titleEl = document.getElementById('fr-title'); if (titleEl) titleEl.textContent = PLACE_META.name;
    const subEl = document.getElementById('fr-sub');
    if (subEl && PLACE !== 'sundarbans') subEl.textContent = `A ${(PLACE_META.type || 'landscape').toLowerCase()}, read as a living interaction web — every actor placed, every relationship sourced.`;
  }
  // Current-coverage news (optional; degrades gracefully if absent).
  try { NEWS = await fetch(BASE + 'news/' + PLACE + '.json').then((r) => (r.ok ? r.json() : null)); } catch (e) { NEWS = null; }
  STEPS = (PLACE === 'sundarbans') ? STEPS_SUNDARBANS : buildGenericSteps();
  TARGET = Object.assign({}, STEPS[0].state);
  buildSteps();
  buildSources();
  updateChrome(0);
  resize();
  const onLayout = () => { resize(); recomputeStepCenters(); };
  window.addEventListener('resize', onLayout);
  window.addEventListener('load', onLayout);
  document.querySelector('.fr-step') && document.querySelector('.fr-step').classList.add('is-active');

  // Lenis — gliding smooth scroll that connects the narrative. The stage
  // reads window.scrollY each frame, so Lenis's smoothing flows straight
  // into the scene's continuous state. Disabled under reduced motion.
  if (!REDUCE) {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9 });
    const lraf = (time) => { lenis.raf(time); requestAnimationFrame(lraf); };
    requestAnimationFrame(lraf);
  }
  // Recompute step centres once layout settles (fonts/images).
  setTimeout(recomputeStepCenters, 300);
  requestAnimationFrame(draw);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
