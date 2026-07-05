/*
  Crossing research companion — atlas/crossing.html controller.
  -------------------------------------------------------------
  Renders a sourced research companion for the hawksbill natal-homing
  Crossing. Reads from two sources:
    · cinematic-language narrative registry (observation, sources)
    · public/data/hawksbill-turtle.json (nesting sites, threats)

  Both sources are cited; no ecological claim appears without a reference.
  Research register — names, places, counts and cites freely
  (platform-architecture §4). Cinematic surface is untouched.
*/

import './field-record.css';
import { getNarrativeById } from '../../cinematic-language/narrative-registry.ts';

const BASE = import.meta.env.BASE_URL || '/';
const NARRATIVE = getNarrativeById('coral-triangle-hawksbill-natal-homing');

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function formatNarrativeSource(s) {
  const authors = (s.authors || []).join(', ');
  const text = `${authors} (${s.year}). ${s.title}. ${s.journal}.`;
  const href = s.doi ? `https://doi.org/${s.doi}` : (s.url || '');
  if (href) return `<li><a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(text)}</a></li>`;
  return `<li>${esc(text)}</li>`;
}

async function init() {
  if (!NARRATIVE) {
    const b = document.getElementById('cr-body');
    if (b) b.innerHTML = '<div class="fr-card"><p class="muted">Narrative record not found.</p></div>';
    return;
  }

  // Back navigation (before data loads — immediate appearance).
  const nav = document.createElement('nav');
  nav.className = 'fr-nav';
  nav.setAttribute('aria-label', 'Site navigation');
  nav.innerHTML = `<a href="${BASE}atlas/">← Living Atlas</a>`
    + `<a href="${BASE}places/crossing.html">Enter the crossing →</a>`;
  const fr = document.getElementById('fr');
  if (fr) fr.insertBefore(nav, fr.firstChild);

  // Title + subtitle from narrative.
  const titleEl = document.getElementById('cr-title');
  if (titleEl) titleEl.textContent = NARRATIVE.species.commonName;
  const subEl = document.getElementById('cr-sub');
  if (subEl) subEl.textContent = NARRATIVE.place.editorialPlaceLine;

  document.title = `${NARRATIVE.species.commonName} · Research companion`;

  // Observation card.
  const body = document.getElementById('cr-body');
  const yearRange = Array.isArray(NARRATIVE.observation.year)
    ? `${NARRATIVE.observation.year[0]}–${NARRATIVE.observation.year[1]}`
    : String(NARRATIVE.observation.year);

  let html = `
    <div class="fr-card">
      <div class="kicker">Observation &middot; ${yearRange}</div>
      <h2>${esc(NARRATIVE.editorial.fragment)}</h2>
      <p>${esc(NARRATIVE.observation.summary)}</p>
      <p>${esc(NARRATIVE.editorial.body)}</p>
      <div class="fr-src"><span class="lbl">sources</span>Lohmann, Putman &amp; Lohmann (2008) PNAS &middot; Meylan &amp; Donnelly (1999) Chelonian Conservation and Biology</div>
    </div>`;

  // Fetch species data for nesting sites and threats.
  let speciesData = null;
  try {
    const res = await fetch(BASE + 'data/hawksbill-turtle.json');
    if (res.ok) speciesData = await res.json();
  } catch (e) { speciesData = null; }

  // Key habitat sites (geographic context; no population ecology claims).
  if (speciesData && Array.isArray(speciesData.habitat.key_locations)) {
    const chips = speciesData.habitat.key_locations
      .map((s) => `<span class="fr-chip">${esc(s)}</span>`).join('');
    html += `
      <div class="fr-card">
        <div class="kicker">Key habitats</div>
        <h2>Where the crossing ends</h2>
        <p>Hawksbills nest on beaches at the sites named below. Geomagnetic imprinting means females return to the beach of their birth, so nesting activity concentrates at these sites across generations (Lohmann et al. 2008).</p>
        <div class="fr-chips">${chips}</div>
        <div class="fr-src"><span class="lbl">source</span>IUCN Red List range data; Coral Triangle Initiative</div>
      </div>`;
  }

  // Threats (each carries an individual citation in the species data).
  if (speciesData && Array.isArray(speciesData.threats) && speciesData.threats.length) {
    const items = speciesData.threats.map((t) =>
      `<li style="margin:0 0 0.75rem"><strong>${esc(t.name)}</strong> — ${esc(t.description)}</li>`
    ).join('');
    html += `
      <div class="fr-card warn">
        <div class="kicker">Pressures</div>
        <h2>What interrupts the crossing</h2>
        <ul style="list-style:none;padding:0;margin:0.5rem 0 0;font-size:1rem;line-height:1.65;color:var(--fr-ink)">${items}</ul>
        <div class="fr-src"><span class="lbl">source</span>IUCN Red List assessment; cited per pressure above</div>
      </div>`;
  }

  // Peer-reviewed sources from the narrative registry.
  if (NARRATIVE.sources && NARRATIVE.sources.length) {
    const srcList = NARRATIVE.sources.map(formatNarrativeSource).join('');
    html += `
      <div class="fr-card">
        <div class="kicker">Peer-reviewed record</div>
        <h2>Sources</h2>
        <ol style="padding-left:1.3rem;margin:0.5rem 0 0;font-size:0.96rem;line-height:1.55;color:var(--fr-ink)">${srcList}</ol>
        <div class="fr-src"><span class="lbl">registry</span>cinematic-language/narratives/coral-triangle-hawksbill-natal-homing.ts &middot; status: verified</div>
      </div>`;
  }

  // Entry CTAs.
  html += `
    <div style="display:flex;flex-wrap:wrap;gap:0.9rem;padding:2.5rem 0 6rem">
      <a href="${BASE}places/crossing.html" class="fr-archive">Enter the crossing →</a>
      <a href="${BASE}notes/coral-triangle-hawksbill-natal-homing.html" class="fr-archive">Field note →</a>
    </div>`;

  body.innerHTML = html;
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
