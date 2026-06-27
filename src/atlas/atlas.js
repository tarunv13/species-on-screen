/*
  Living Atlas — experience controller.
  -------------------------------------
  The research-surface companion to the cinematic homepage. Presents
  every documented habitat as an entry point on a slow, dreamy globe;
  selecting one immerses the viewer in that habitat's seasonal
  atmosphere with a floating glass species card.

  This surface is ADDITIVE and REVERSIBLE: it does not modify or
  replace the cinematic homepage (index.html) or the canonical
  Sundarbans descent (places/sundarbans.html). Removing the atlas is
  deleting src/atlas/ + atlas/ and the vite input — nothing else
  depends on it. See .kiro/steering/atlas-living-glass.md.

  Data discipline: every species fact rendered here comes from the
  attested narrative record and its cited sources. The seasonal layer
  controls atmosphere and framing only and asserts no ecology.
*/

// Liquid Glass material first, so atlas.css layout rules win on cascade.
import './liquid-glass.css';
import './atlas.css';
import { gsap } from 'gsap';
import { initLiquidGlass } from './liquid-glass.js';
import { listNarratives } from '../../cinematic-language/narrative-registry.ts';
import { describeSeason, overviewPalette } from './season.js';

const BASE = import.meta.env.BASE_URL || '/';

/* ---------- small DOM helpers ---------- */

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function applyVars(target, vars) {
  for (const [k, v] of Object.entries(vars)) target.style.setProperty(k, v);
}

function prettyStatus(code) {
  if (!code) return 'Status unknown';
  return code.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatYear(year) {
  if (Array.isArray(year)) return `${year[0]}\u2013${year[1]}`;
  return String(year);
}

/* ---------- source formatting (research register) ---------- */

function formatSource(s) {
  const li = el('li');
  let text = '';
  let href = '';
  switch (s.kind) {
    case 'peer_reviewed':
      text = `${(s.authors || []).join(', ')} (${s.year}). ${s.title}. ${s.journal}.`;
      href = s.doi ? `https://doi.org/${s.doi}` : (s.url || '');
      break;
    case 'field_report':
      text = `${(s.authors || []).join(', ')} (${s.year}). ${s.title}. ${s.organization}.`;
      href = s.url || '';
      break;
    case 'camera_trap':
      text = `Camera trap ${s.label}, ${s.operator} (${s.year})${s.location ? `, ${s.location}` : ''}.`;
      break;
    case 'satellite_imagery':
      text = `${s.provider} ${s.sensor} (${s.year}), ${s.identifier}.`;
      break;
    case 'oral_account':
      text = `Oral account: ${s.contributor}, ${s.relation} (${s.yearRecorded}).`;
      break;
    default:
      text = s.title || 'Source';
  }
  if (href) {
    const a = el('a', null, text);
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    li.appendChild(a);
  } else {
    li.textContent = text;
  }
  return li;
}

/* ---------- the species card ---------- */

function buildSpeciesCard(n, onBack) {
  const lat = n.place.coordinates ? n.place.coordinates.latitude : 0;
  const season = describeSeason(lat, n.place.name);

  const card = el('article', 'species-card glass glass--card');

  card.appendChild(el('div', 'place-name', n.place.name));
  card.appendChild(el('div', 'place-kind', n.place.type || ''));
  card.appendChild(el('p', 'season-line', season.framing));

  card.appendChild(el('div', 'divider'));

  card.appendChild(el('div', 'species-name', n.species.commonName));
  card.appendChild(el('div', 'species-sci', n.species.scientificName));

  const meta = el('div', 'meta-row');
  meta.appendChild(el('span', 'tag iucn', prettyStatus(n.species.iucnStatus)));
  if (n.place.countries && n.place.countries.length) {
    meta.appendChild(el('span', 'tag', n.place.countries.join(' \u00b7 ')));
  }
  meta.appendChild(el('span', 'tag', `Season: ${season.label}`));
  card.appendChild(meta);

  const obs = el('div', 'observation');
  obs.appendChild(el('span', 'obs-label', `Field observation \u00b7 ${formatYear(n.observation.year)}`));
  obs.appendChild(document.createTextNode(n.observation.summary));
  card.appendChild(obs);

  if (Array.isArray(n.sources) && n.sources.length) {
    const src = el('div', 'sources');
    src.appendChild(el('span', 'src-label', 'Sources'));
    const ol = el('ol');
    n.sources.forEach((s) => ol.appendChild(formatSource(s)));
    src.appendChild(ol);
    card.appendChild(src);
  }

  const actions = el('div', 'card-actions');
  const record = el('a', 'link', 'Field note \u2192');
  record.href = `${BASE}notes/${n.id}.html`;
  actions.appendChild(record);

  // Bridge to the interactive field record (atlas surface), where one exists.
  if (n.place.id === 'sundarbans') {
    const fieldRecord = el('a', 'link', 'Interaction web \u2192');
    fieldRecord.href = `${BASE}atlas/sundarbans.html`;
    actions.appendChild(fieldRecord);
  }

  // Bridge to the canonical cinematic place, where one exists.
  if (n.place.id === 'sundarbans') {
    const enter = el('a', 'link', 'Enter the living place \u2192');
    enter.href = `${BASE}places/sundarbans.html`;
    actions.appendChild(enter);
  }
  if (n.place.id === 'coral-triangle') {
    const enter = el('a', 'link', 'Enter the crossing \u2192');
    enter.href = `${BASE}places/crossing.html`;
    actions.appendChild(enter);
  }
  card.appendChild(actions);

  return { card, season };
}

/* ---------- controller ---------- */

async function init() {
  const root = document.getElementById('atlas');
  const veil = document.getElementById('atlas-veil');
  const canvas = document.getElementById('atlas-globe-canvas');
  const chipLayer = document.getElementById('chip-layer');
  const extra = document.getElementById('chip-extra');
  const detail = document.getElementById('habitat-detail');
  const back = document.getElementById('atlas-back');
  const seasonBadge = document.getElementById('season-badge-label');

  if (!root) return;

  applyVars(root, overviewPalette());

  // Liquid Glass: ambient key-light drift + pointer lensing on .glass
  // surfaces. No-op under reduced-motion / coarse pointers.
  initLiquidGlass(root);

  const narratives = listNarratives()
    .slice()
    .sort((a, b) => a.place.name.localeCompare(b.place.name));

  // Show the viewer's "now" season at a familiar northern-temperate
  // latitude as the ambient badge (purely atmospheric).
  if (seasonBadge) {
    seasonBadge.textContent = describeSeason(45, null).label;
  }

  const placed = narratives.filter((n) => n.place.coordinates);
  const unplaced = narratives.filter((n) => !n.place.coordinates);

  const chipById = new Map();

  function makeChip(n) {
    const chip = el('button', 'habitat-chip glass glass--chip');
    chip.type = 'button';
    chip.appendChild(el('span', 'place', n.place.name));
    chip.appendChild(el('span', 'kind', n.place.type || ''));
    chip.addEventListener('click', () => openHabitat(n));
    chipById.set(n.id, chip);
    return chip;
  }

  let detailCard = null;

  function openHabitat(n) {
    if (detailCard) { detailCard.remove(); detailCard = null; }
    const { card, season } = buildSpeciesCard(n, closeHabitat);
    detailCard = card;
    detail.insertBefore(card, detail.firstChild);
    applyVars(root, season.cssVars);
    detail.classList.add('is-open');
    back.style.display = 'inline-flex';
    document.title = `${n.place.name} \u00b7 Living Atlas`;
  }

  function closeHabitat() {
    detail.classList.remove('is-open');
    back.style.display = 'none';
    applyVars(root, overviewPalette());
    document.title = 'Living Atlas \u00b7 Eco-Cinema Observatory';
    window.setTimeout(() => {
      if (detailCard) { detailCard.remove(); detailCard = null; }
    }, 650);
  }

  back.addEventListener('click', closeHabitat);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && detail.classList.contains('is-open')) closeHabitat();
  });

  // Try the dreamy globe; fall back to a calm chip cloud if WebGL or
  // the module is unavailable for any reason.
  let globe = null;
  let usingGlobe = false;
  try {
    // Dynamic import keeps a WebGL/init failure from breaking the page.
    // eslint-disable-next-line import/no-unresolved
    const mod = await import('./atlas-globe.js');
    globe = new mod.AtlasGlobe(canvas);
    usingGlobe = true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[atlas] globe unavailable; using fallback layout.', err);
  }

  if (usingGlobe && globe) {
    // Globe present: placed chips float over the planet; coordinate-
    // less records live in a small static glass cluster.
    placed.forEach((n) => chipLayer.appendChild(makeChip(n)));
    if (unplaced.length) {
      extra.style.display = 'flex';
      extra.appendChild(el('span', 'extra-label', 'Also in the atlas'));
      unplaced.forEach((n) => extra.appendChild(makeChip(n)));
    }
    globe.addPoints(placed.map((n) => ({
      id: n.id,
      lat: n.place.coordinates.latitude,
      lng: n.place.coordinates.longitude,
    })));
    globe.onFrame((positions) => {
      for (const pos of positions) {
        const chip = chipById.get(pos.id);
        if (!chip) continue;
        if (pos.visible) {
          chip.style.left = `${pos.x}px`;
          chip.style.top = `${pos.y}px`;
          chip.classList.add('is-visible');
        } else {
          chip.classList.remove('is-visible');
        }
      }
    });
    window.addEventListener('resize', () => globe.resize());
  } else {
    // Fallback: every habitat as a chip in a centred, scrollable cloud.
    canvas.style.display = 'none';
    chipLayer.classList.add('is-fallback');
    narratives.forEach((n) => {
      const chip = makeChip(n);
      chip.classList.add('is-visible');
      chipLayer.appendChild(chip);
    });
  }

  // Dissolve the held darkness.
  if (veil) {
    gsap.to(veil, {
      opacity: 0,
      duration: 1.1,
      delay: 0.5,
      ease: 'power2.inOut',
      onComplete: () => { veil.style.display = 'none'; },
    });
  }
}

// Top-level await is supported in Vite's ESM module graph; wrap init
// so the dynamic import of the globe can be awaited cleanly.
async function boot() { await init(); }

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
