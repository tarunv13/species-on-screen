/*
  The entrance — V1.7.
  --------------------------------------------------------------------------
  First contact is a dark world map of the places this project actually holds,
  at their real coordinates. It replaces the photographed globe.

  WHY, PRECISELY. Not because the globe was rendered — it was not; since V1.3
  Part A it was NASA Blue Marble Next Generation and Black Marble imagery, and
  doctrine (cinematic-vocabulary.md:38) asks for exactly that. The globe is
  retired because, however beautifully photographed, it is an ESTABLISHING SHOT
  THAT CARRIES NO RECORD. It shows the planet; it does not show the
  observations. An establishing shot of Earth is the image every nature
  documentary opens with. Five coordinates with an archive behind each is the
  thing only this project can open with.

  See .agents/decisions/2026-09-12-entrance-amended-globe-to-map.md.

  HELD IN DARKNESS — ARTICLE VI STILL GOVERNS HERE. The homepage is
  cinematic-adjacent, so the basemap is not accepted as it arrives. It is
  desaturated, dimmed and veiled to the night ground before anything is drawn
  on top. A bright product map at this position would be a louder claim than
  anything the archives support.

  WHAT IS DELIBERATELY ABSENT

  Only the five built or registered places are plotted. The twenty-one
  registry-only entries render NOTHING — no greyed pin, no "coming soon". The
  entrance must not promise twenty-five places when the project has five, and a
  placeholder pin is a promise.

  No stats, no counts, no badges, no IUCN codes, no occurrence totals. The
  entrance names places; it does not rank them or score them (Canon XIV). The
  label is the place name at --font-caption in ink-low, and nothing else.

  No heatmap, no density surface, no clustering — the same refusals the V1.5
  occurrence map makes, for the same reason.
*/

const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

/* The settled world view. Wide enough that all five places are on screen at
   once, because the entrance's claim is the SET of places, not any one of
   them. */
export const SETTLED = { center: [10, 18], zoom: 1.15 };

/* The approach begins further out, so the 6s move reads as arriving rather
   than as panning. */
const APPROACH_FROM = { center: [10, 18], zoom: 0.2 };

/* GSAP's power3.inOut, expressed as a MapLibre easing function so the approach
   and the existing transitions share one curve. The caption fade keeps its own
   --ease-editorial; the two were never the same curve and are not unified. */
export const power3InOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

/* Equirectangular placement, shared by the map markers' fallback twin so a
   place sits in the same relative position with or without WebGL. */
export function toPercent(lat, lng) {
  return { left: ((Number(lng) + 180) / 360) * 100, top: ((90 - Number(lat)) / 180) * 100 };
}

/**
 * Mount the entrance map.
 *
 * @param {HTMLElement} container
 * @param {Array<{id,name,label,lat,lng}>} places  the five, coordinates from landscapes.json
 * @param {(placeId: string, el: HTMLElement) => void} onSelect
 * @returns {Promise<{map, flyToPlace, jumpSettled, approach}>}
 */
export async function mountEntranceMap(container, places, onSelect) {
  const [maplibregl] = await Promise.all([
    import('maplibre-gl').then((m) => m.default || m),
    import('maplibre-gl/dist/maplibre-gl.css'),
  ]);

  const map = new maplibregl.Map({
    container,
    style: STYLE_URL,
    center: APPROACH_FROM.center,
    zoom: APPROACH_FROM.zoom,
    attributionControl: false,   // stated in prose, as the atlas map does
    interactive: true,
    dragRotate: false,           // the camera does not roll here (Article I)
    pitchWithRotate: false,
    touchZoomRotate: true,
    maxZoom: 6,                  // the entrance names places; it is not a viewer
    minZoom: 0.2,
  });

  await new Promise((resolve) => {
    if (map.loaded()) resolve();
    else map.once('load', resolve);
  });

  /* The five places as DOM markers, so the hit target is ours to size. */
  for (const p of places) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'entrance-pin';
    el.setAttribute('data-place', p.id);
    // The accessible name is the place, not "marker" — a screen reader should
    // hear what a sighted reader reads.
    el.setAttribute('aria-label', p.label || p.name);
    el.innerHTML = `<span class="entrance-pin__dot" aria-hidden="true"></span>`
      + `<span class="entrance-pin__label">${escapeHtml(p.label || p.name)}</span>`;
    el.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (typeof onSelect === 'function') onSelect(p.id, el);
    });
    new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([p.lng, p.lat])
      .addTo(map);
  }

  /* The approach: a camera move, not a fade. "Arriving at the planet" is a
     gesture a map can make honestly, and it is the same 6s the globe fly-in
     held. */
  const approach = (seconds = 6) => new Promise((resolve) => {
    map.once('moveend', resolve);
    map.flyTo({
      center: SETTLED.center,
      zoom: SETTLED.zoom,
      duration: seconds * 1000,
      easing: power3InOut,
      essential: true,
    });
  });

  const jumpSettled = () => map.jumpTo({ center: SETTLED.center, zoom: SETTLED.zoom });

  /* Sundarbans' Article III arc, preserved at its authored duration. What
     changed is what the camera arcs TOWARD — a hotspot on a map rather than a
     hotspot on a sphere. An arc is an arc. */
  const flyToPlace = (place, seconds) => new Promise((resolve) => {
    map.once('moveend', resolve);
    map.flyTo({
      center: [place.lng, place.lat],
      zoom: 4.2,
      duration: Math.max(1, seconds) * 1000,
      easing: power3InOut,
      essential: true,
    });
  });

  return { map, approach, jumpSettled, flyToPlace };
}

/**
 * The no-WebGL entrance. NOT a list: experiential-references.md forbids
 * reaching a species by reading its name from a menu, and a plain <ul> is
 * exactly that menu. The five places are positioned links at their real
 * coordinates over a dark field, so touch-the-place survives without WebGL.
 *
 * The dark field is a plain ground, not a world plate: the repository holds no
 * licence-clean dark world image, and sourcing one was not this turn's work. A
 * plate can replace the ground later without moving a single link.
 */
export function mountFallbackEntrance(container, places, onSelect) {
  container.classList.add('entrance-fallback');
  container.innerHTML = '<p class="entrance-fallback__note">Interactive map unavailable. '
    + 'The five places are placed at their real coordinates.</p>';
  for (const p of places) {
    const { left, top } = toPercent(p.lat, p.lng);
    const a = document.createElement('a');
    a.className = 'entrance-pin entrance-pin--static';
    a.href = p.href || '#';
    a.setAttribute('data-place', p.id);
    a.style.left = `${left}%`;
    a.style.top = `${top}%`;
    a.innerHTML = `<span class="entrance-pin__dot" aria-hidden="true"></span>`
      + `<span class="entrance-pin__label">${escapeHtml(p.label || p.name)}</span>`;
    a.addEventListener('click', (ev) => {
      if (typeof onSelect !== 'function') return;   // the href is the honest fallback
      ev.preventDefault();
      onSelect(p.id, a);
    });
    container.appendChild(a);
  }
}

export const ENTRANCE_ATTRIBUTION =
  'Basemap &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, '
  + 'tiles by <a href="https://openfreemap.org">OpenFreeMap</a>. '
  + 'Place coordinates from this project&rsquo;s own landscape registry.';

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
