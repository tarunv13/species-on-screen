/*
  The occurrence map — V1.5.
  --------------------------------------------------------------------------
  The archive has held real GBIF coordinates since it was built, and the atlas
  rendered them as text. This plots them.

  THE EDITORIAL POINT IS THE CIRCLE, NOT THE POINT.

  Every occurrence in the archive now declares 1 dp of coordinate precision and
  25 000 m of uncertainty (generalised 2026-09-11 under SENSITIVE-DATA-POLICY
  rule 1). A map pin would assert a precision the record does not have — it
  would say "the tiger was HERE", when the record says "somewhere within 25 km
  of here". So no pin is drawn. Each record is a real geodesic circle at its
  own declared `coordinateUncertaintyInMeters`, projected on the ground, which
  grows and shrinks correctly at every zoom because it is a polygon in world
  coordinates rather than a fixed pixel radius.

  A reader who zooms in does not sharpen the claim; they watch the circle fill
  the screen. That is the honest behaviour and it is the whole reason the layer
  exists.

  WHAT IS DELIBERATELY ABSENT

  No heatmap, no interpolation, no kernel density, no convex hull. Every one of
  those invents values between observations — a density surface drawn from 14
  records would render confident colour across water the archive says nothing
  about. Points and their declared uncertainty only.

  No clustering either: collapsing two records into a numbered bubble discards
  the individual uncertainty radius, which is the one thing this layer exists
  to show.

  REUSE, NOT DUPLICATION

  Clicking a circle does not open a second species panel. It reveals the
  interaction-web node that already exists for that occurrence — the same
  reveal M36's lateral `follow` gives, through the same `#fr-node-<id>`
  fragment, so a clicked point produces a copyable URL exactly as a followed
  edge does. The caller supplies that reveal; this module never renders
  species prose.

  REGISTER

  Research surface only. The atlas is not held in darkness, so this uses the
  warm Liquid Glass tokens like everything else here. It must never appear on a
  cinematic surface; nothing in src/places/ imports it.
*/

import { ROLE_PALETTE } from './role-palette.js';

/* Cap. At 21.8 N one pixel spans roughly 156543 * cos(lat) / 2^z metres, so at
   z=10 that is about 142 m/px and a 25 km radius draws ~176 px — unmistakably a
   region, over a basemap still at town scale with no street geometry. Past that
   the basemap starts resolving individual roads while the circle sails off the
   viewport, and a reader looking at the sharp middle of a soft claim will read
   the centre as an address. The cap is the point where the map stops being able
   to lie. */
export const MAX_ZOOM = 10;

const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

/* The style ships no `attribution` on its sources, so it is stated here rather
   than left to the library to infer. Basemap and data both, in the field
   record's own source-row voice. */
export const ATTRIBUTION =
  'Basemap &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, '
  + 'tiles by <a href="https://openfreemap.org">OpenFreeMap</a> (<a href="https://openmaptiles.org/">OpenMapTiles</a> schema); '
  + 'relief from <a href="https://www.naturalearthdata.com/">Natural Earth</a> (public domain). '
  + 'Occurrence records from this place&rsquo;s Darwin Core Archive, sourced from '
  + '<a href="https://www.gbif.org/">GBIF</a>. '
  + 'Coordinates are generalised to 1 decimal place; each circle is the record&rsquo;s own declared uncertainty.';

const rgb = (a, alpha) => `rgba(${a[0]}, ${a[1]}, ${a[2]}, ${alpha})`;

/* A geodesic circle as a GeoJSON ring. Equirectangular correction on longitude
   is accurate enough at these radii and this latitude, and keeps the module
   dependency-free beyond MapLibre. */
function circleRing(lat, lng, radiusM, steps = 72) {
  const ring = [];
  const dLat = (radiusM / 111320);
  const dLng = (radiusM / (111320 * Math.max(0.01, Math.cos((lat * Math.PI) / 180))));
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    ring.push([lng + dLng * Math.cos(t), lat + dLat * Math.sin(t)]);
  }
  return ring;
}

export function occurrenceGeoJSON(actors) {
  const features = [];
  for (const a of actors) {
    const lat = Number(a.lat);
    const lng = Number(a.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;   // citation-or-skip
    const unc = Number(a.uncertainty);
    const radius = Number.isFinite(unc) && unc > 0 ? unc : null;
    if (radius === null) continue;  // a record with no declared uncertainty is not plotted
    features.push({
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [circleRing(lat, lng, radius)] },
      properties: {
        id: a.id,
        vern: a.vern || '',
        sci: a.sci || '',
        role: a.role || 'consumer',
        basis: a.basis || '',
        uncertainty: radius,
        colour: rgb(ROLE_PALETTE[a.role] || ROLE_PALETTE.consumer, 1),
      },
    });
  }
  return { type: 'FeatureCollection', features };
}

/* Fit bounds across every ring, with a little padding. */
function boundsOf(geojson) {
  let w = 180, s = 90, e = -180, n = -90;
  for (const f of geojson.features) {
    for (const [lng, lat] of f.geometry.coordinates[0]) {
      if (lng < w) w = lng; if (lng > e) e = lng;
      if (lat < s) s = lat; if (lat > n) n = lat;
    }
  }
  return [[w, s], [e, n]];
}

/**
 * Mount the map. Loads MapLibre dynamically so the atlas pays for it only on a
 * page that actually plots records.
 *
 * @param {HTMLElement} container
 * @param {Array} actors      parsed occurrence rows (id, lat, lng, uncertainty, role, basis, vern, sci)
 * @param {(occurrenceId: string) => void} onSelect  reveals the existing fr-node panel
 */
export async function mountOccurrenceMap(container, actors, onSelect) {
  const data = occurrenceGeoJSON(actors);
  if (!container || !data.features.length) return null;   // nothing attested → render nothing

  const [maplibregl] = await Promise.all([
    import('maplibre-gl').then((m) => m.default || m),
    import('maplibre-gl/dist/maplibre-gl.css'),
  ]);

  const map = new maplibregl.Map({
    container,
    style: STYLE_URL,
    bounds: boundsOf(data),
    fitBoundsOptions: { padding: 48, maxZoom: MAX_ZOOM },
    maxZoom: MAX_ZOOM,
    attributionControl: false,   // stated in prose beneath the map instead
    cooperativeGestures: true,   // scrolling the page must not zoom the map
  });
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
  map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

  map.on('load', () => {
    map.addSource('occurrences', { type: 'geojson', data });
    map.addLayer({
      id: 'occ-fill',
      type: 'fill',
      source: 'occurrences',
      paint: { 'fill-color': ['get', 'colour'], 'fill-opacity': 0.16 },
    });
    map.addLayer({
      id: 'occ-edge',
      type: 'line',
      source: 'occurrences',
      paint: { 'line-color': ['get', 'colour'], 'line-width': 1.25, 'line-opacity': 0.85 },
    });

    map.on('mouseenter', 'occ-fill', () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', 'occ-fill', () => { map.getCanvas().style.cursor = ''; });

    map.on('click', 'occ-fill', (ev) => {
      const f = ev.features && ev.features[0];
      if (!f) return;
      const p = f.properties;
      new maplibregl.Popup({ closeButton: true, maxWidth: '17rem' })
        .setLngLat(ev.lngLat)
        .setHTML(
          `<div class="fr-map-pop">
             <strong>${escapeHtml(p.vern)}</strong>
             <span class="sci">${escapeHtml(p.sci)}</span>
             <dl>
               <dt>method</dt><dd>${escapeHtml(p.basis || 'not recorded')}</dd>
               <dt>uncertainty</dt><dd>&plusmn;${Math.round(Number(p.uncertainty) / 1000)} km</dd>
             </dl>
             <a href="#fr-node-${escapeHtml(p.id)}" data-occ="${escapeHtml(p.id)}">Read the record &rarr;</a>
           </div>`)
        .addTo(map);
    });

    /* The popup link reveals the node the interaction web already rendered. */
    container.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('[data-occ]');
      if (!a) return;
      if (typeof onSelect === 'function') onSelect(a.getAttribute('data-occ'));
    });
  });

  return map;
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
