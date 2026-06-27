/*
  Research-surface narrative renderer.
  ------------------------------------
  Reads a canonical EcologicalNarrative object and renders the FULL
  thing as an article. Conventional library grammar: header,
  identifiers, observation as a sourced claim, editorial body, place
  line, sources list, metadata footer.

  This file is the research surface's render path. It loads only on
  research pages. The cinematic engine is not imported here; no
  parallax, no audio, no atmosphere, no descent timeline. Per
  platform-architecture §7: zero shared JavaScript at runtime
  between cinematic and research surfaces.

  The narrative to render is selected by URL pathname: each notes/*.html
  is an empty shell whose basename (without `.html`) is the narrative
  id. Adding a narrative to the research surface is creating one new
  HTML file under notes/ and one new narrative file under
  cinematic-language/narratives/. No router, no server, no fetch.
*/

import { getNarrativeById } from
  '../../cinematic-language/narrative-registry.ts';
import './research-article.css';

const IUCN_LABEL = {
  least_concern: 'Least Concern',
  near_threatened: 'Near Threatened',
  vulnerable: 'Vulnerable',
  endangered: 'Endangered',
  critically_endangered: 'Critically Endangered',
  extinct_in_wild: 'Extinct in the Wild',
  extinct: 'Extinct',
  data_deficient: 'Data Deficient',
  not_evaluated: 'Not Evaluated'
};

const SOURCE_KIND_LABEL = {
  peer_reviewed: 'peer-reviewed',
  field_report: 'field report',
  camera_trap: 'camera trap',
  satellite_imagery: 'satellite imagery',
  oral_account: 'oral account'
};

const STATUS_LABEL = {
  draft: 'Draft',
  in_review: 'In review',
  verified: 'Verified',
  published: 'Published'
};

/* ---------- Source formatting (per kind) ---------- */

function formatYearRange(year) {
  if (Array.isArray(year)) return `${year[0]}\u2013${year[1]}`;
  return String(year);
}

function authorList(authors) {
  if (!authors || authors.length === 0) return '';
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
  return authors.slice(0, -1).join(', ') + ', & ' + authors[authors.length - 1];
}

function renderSource(s) {
  const kind = `<span class="source-kind">${SOURCE_KIND_LABEL[s.kind]}</span>`;
  switch (s.kind) {
    case 'peer_reviewed': {
      const linkOut = s.doi
        ? ` <a href="https://doi.org/${encodeURIComponent(s.doi)}">doi:${escape(s.doi)}</a>`
        : (s.url ? ` <a href="${escape(s.url)}">link</a>` : '');
      return `<li>${kind}${escape(authorList(s.authors))} (${s.year}). ${escape(s.title)}. <cite>${escape(s.journal)}</cite>.${linkOut}</li>`;
    }
    case 'field_report': {
      const linkOut = s.url ? ` <a href="${escape(s.url)}">link</a>` : '';
      return `<li>${kind}${escape(authorList(s.authors))} (${s.year}). ${escape(s.title)}. <cite>${escape(s.organization)}</cite>.${linkOut}</li>`;
    }
    case 'camera_trap': {
      const loc = s.location ? `, ${escape(s.location)}` : '';
      return `<li>${kind}${escape(s.label)} \u00b7 ${escape(s.operator)}${loc} (${s.year}).</li>`;
    }
    case 'satellite_imagery': {
      return `<li>${kind}${escape(s.provider)} ${escape(s.sensor)} \u00b7 ${escape(s.identifier)} (${s.year}).</li>`;
    }
    case 'oral_account': {
      return `<li>${kind}${escape(s.contributor)} (${escape(s.relation)}), recorded ${s.yearRecorded}.</li>`;
    }
    default:
      return '';
  }
}

/* ---------- HTML escaping ---------- */

function escape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ---------- Body markdown (minimal: paragraph splits only) ---------- */

function renderBody(body) {
  return body
    .split(/\n\n+/)
    .map(p => `<p>${escape(p.trim())}</p>`)
    .join('');
}

/* ---------- Identifiers block ---------- */

function renderIdentifiers(n) {
  const rows = [
    ['IUCN status', IUCN_LABEL[n.species.iucnStatus]],
    ['Place type', n.place.type],
    ['Countries', n.place.countries.join(', ')]
  ];
  if (n.place.protectedArea) rows.push(['Protected area', n.place.protectedArea]);
  if (n.place.coordinates) {
    rows.push([
      'Coordinates',
      `${n.place.coordinates.latitude.toFixed(2)}, ${n.place.coordinates.longitude.toFixed(2)}`
    ]);
  }
  rows.push(['Observed', formatYearRange(n.observation.year)]);
  return rows
    .map(([k, v]) => `<dt>${escape(k)}</dt><dd>${escape(v)}</dd>`)
    .join('');
}

function renderMetadata(m) {
  return `
    <dt>Schema</dt><dd>v${escape(m.schemaVersion)}</dd>
    <dt>Status</dt><dd>${escape(STATUS_LABEL[m.status] || m.status)}</dd>
    <dt>Contributor</dt><dd>${escape(m.contributor)}</dd>
    <dt>Created</dt><dd>${escape(m.created)}</dd>
    <dt>Updated</dt><dd>${escape(m.updated)}</dd>
  `;
}

/* ---------- Cross-surface navigation (atlas companions + cinematic places) ---------- */

// Notes pages live at notes/<id>.html; relative paths work regardless of base.
const SURFACE_LINKS = {
  sundarbans: [
    { href: '../atlas/sundarbans.html', label: 'Interaction web →' },
    { href: '../places/sundarbans.html', label: 'Enter the living place →' },
  ],
  'amazon-varzea': [
    { href: '../atlas/amazon-varzea.html', label: 'Interaction web →' },
  ],
  'coral-triangle': [
    { href: '../atlas/coral-triangle.html', label: 'Interaction web →' },
    { href: '../atlas/crossing.html', label: 'Research companion →' },
    { href: '../places/crossing.html', label: 'Enter the crossing →' },
  ],
  'east-pacific-rise-vents': [
    { href: '../places/epr-vents.html', label: 'Enter the vent field →' },
  ],
};

function renderSurfaceLinks(n) {
  const links = SURFACE_LINKS[n.place.id];
  if (!links || !links.length) return '';
  const items = links.map((l) => `<a href="${escape(l.href)}">${escape(l.label)}</a>`).join('');
  return `<nav class="surface-links" aria-label="Observatory surfaces">${items}</nav>`;
}

/* ---------- Page render ---------- */

function renderArticle(n) {
  const root = document.getElementById('narrative');
  if (!root) return;

  // The research surface exposes everything: place name AND species
  // common + scientific names, IUCN, geo, observation, sources, body.
  // The cinematic surface (separate runtime, separate page) extracts
  // only place.name, place.editorialPlaceLine, and editorial.fragment.
  root.innerHTML = `
    <header>
      <h1>${escape(n.place.name)}</h1>
      <p class="subtitle">
        <em>${escape(n.species.commonName)}</em>
        &middot; ${escape(n.species.scientificName)}
      </p>
      <dl class="identifiers">
        ${renderIdentifiers(n)}
      </dl>
    </header>

    <p class="place-line">${escape(n.place.editorialPlaceLine)}</p>

    <section class="claim" aria-label="Sourced observation">
      <p class="observation">${escape(n.observation.summary)}</p>
    </section>

    <section class="body">
      ${renderBody(n.editorial.body)}
    </section>

    <p class="fragment">&mdash; ${escape(n.editorial.fragment)}</p>

    <section class="sources">
      <h2>Sources</h2>
      <ol>
        ${n.sources.map(renderSource).join('')}
      </ol>
    </section>

    <footer class="metadata">
      ${renderMetadata(n.metadata)}
    </footer>

    ${renderSurfaceLinks(n)}
  `;

  // Page <title> on research surface includes species name.
  // (On the cinematic surface, the same data populates only place.name.)
  document.title = `${n.place.name} \u00b7 ${n.species.commonName} \u2014 Notes`;
}

/* ---------- Not-found state ---------- */

/*
  The research surface is keyed off the URL pathname. Each notes/*.html
  page is an empty shell whose basename (without `.html`) is the
  narrative id. Visiting a page whose id is not in the registry
  produces a clean, low-authority message — no errors thrown, no
  console noise, no styling drift.
*/
function renderNotFound(id) {
  const root = document.getElementById('narrative');
  if (!root) return;
  root.innerHTML = `
    <header>
      <h1>Narrative not found</h1>
      <p class="subtitle">
        No narrative is registered with id <code>${escape(id)}</code>.
      </p>
    </header>
  `;
  document.title = 'Notes \u2014 not found';
}

/* ---------- Entry point: id from URL pathname ---------- */

/*
  The page URL is `/[base]/notes/<id>.html`. The basename without the
  extension is the narrative id. This ties slug to filename, which is
  intentional: filename collisions are the same kind of error as id
  collisions, and the OS already prevents both.
*/
function getNarrativeIdFromUrl() {
  const last = location.pathname
    .replace(/\/$/, '')
    .split('/')
    .pop() || '';
  return last.replace(/\.html$/, '');
}

const id = getNarrativeIdFromUrl();
const narrative = getNarrativeById(id);

if (narrative) {
  renderArticle(narrative);
} else {
  renderNotFound(id);
}
