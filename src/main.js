import './style.css';
import { gsap } from 'gsap';
import { getPlaceByNarrativeId } from '../cinematic-language/place-manifest.ts';
import {
  mountEntranceMap, mountFallbackEntrance, hasWebGL, ENTRANCE_ATTRIBUTION,
} from './entrance-map.js';

/*
  Homepage entry. Wires the entrance map, the editorial captions, and the
  canonical arrival path into each published cinematic place.

  V1.7 — FIRST CONTACT IS A MAP, NOT A PLANET. The photographed globe
  (src/globe.js, NASA Blue Marble NG + Black Marble) is retired from the
  entrance. Not for being rendered — it was not rendered, and doctrine asks for
  photography — but because an establishing shot of Earth carries no record. It
  shows the planet; it does not show the observations. The entrance now shows
  the places, at their real coordinates, from the registry.
  See .agents/decisions/2026-09-12-entrance-amended-globe-to-map.md.

  PRESERVED EXACTLY: held darkness (Article VI), the 1.5s hold + 1.4s fade
  through, the ~6s approach, the 0.9s post-arrival beat, and Article III's
  Departure -> Approach -> Crossing -> Cut. Sundarbans keeps its 2.0s camera
  arc; only what the camera arcs toward has changed.
*/

let entrance = null;          // { map, approach, jumpSettled, flyToPlace }
let wiredCaptions = [];
let isTransitioning = false;
let activeTransition = null;

/*
  The places the entrance plots.

  COORDINATES ARE READ, NEVER RECALLED. Every lat/lng below was read from
  scripts/ingest/landscapes.json -> landscapes[].center on 2026-09-12. That
  file is the registry and remains authoritative; if a centre changes there,
  re-read it rather than editing these by hand. They are literals here only
  because landscapes.json lives under scripts/ and is not served to the browser.

  WHY THREE AND NOT FIVE. The V1.7 brief named five. What each one has:

    sundarbans           archive + atlas + cinematic (places/sundarbans.html)
    coral-triangle       archive + atlas + cinematic (places/crossing.html)
    epr-vents            archive + atlas + cinematic (places/epr-vents.html)
    amazon-varzea        archive + atlas, NO cinematic surface (backlog item 1)
    wood-buffalo-boreal  nothing: no archive, no atlas, no page, no note

  wood-buffalo-boreal is a registry-only entry, so a pin for it would lead
  nowhere — the "coming soon" promise the same ruling forbids two lines
  earlier. amazon-varzea is excluded by D3; see the note below. Both are
  omitted and reported rather than drawn, and either can be added here the
  moment it has a cinematic surface.
*/
const ENTRANCE_PLACES = [
  { id: 'sundarbans',     lat: 21.95, lng: 89.18,   label: 'Sundarbans' },
  { id: 'coral-triangle', lat: 0,     lng: 123,     label: 'Coral Triangle' },
  { id: 'epr-vents',      lat: 9.83,  lng: -104.29, label: 'East Pacific Rise' },
];

/*
  AMAZON VARZEA IS NOT PLOTTED, AND D3 IS WHY.

  It has an archive and an atlas record but no cinematic surface (backlog
  item 1). Reaching it from here would mean the entrance — a cinematic surface —
  carrying a link to atlas/ or notes/. That is exactly the affordance sink D3
  forbids, and check-grammar caught the attempt: "[cross-depth navigation
  string] src/main.js". The gate is the authority and the gate said no.

  The curated captions in index.html get away with cross-depth hrefs because
  index.html is deliberately exempt — its anchors are no-JS fallbacks the
  runtime intercepts. Generated pins have no such exemption and should not
  acquire one.

  So the entrance plots the places it can actually ENTER: the three with a
  cinematic surface. That is the same three the captions have always named.
  When the Amazon varzea cinematic surface is built, add it here and it will
  pass the gate unchanged.
*/

/* Registry id -> the manifest's research slug, which is how a place is looked
   up (the manifest keys arrivals by narrative id). */
const RESEARCH_SLUG = {
  'sundarbans': 'sundarbans-bengal-tiger-saline-swimmer',
  'coral-triangle': 'coral-triangle-hawksbill-natal-homing',
  'epr-vents': 'east-pacific-rise-tubeworm-chemosynthesis',
  'amazon-varzea': 'amazon-varzea-arapaima-flood-pulse',
};

const BASE = import.meta.env.BASE_URL || '/';
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function placeFor(id) {
  const slug = RESEARCH_SLUG[id];
  return slug ? getPlaceByNarrativeId(slug) : null;
}

function init() {
  const host = document.getElementById('entrance');
  if (!host) return;

  const loadingScreen = document.getElementById('loading-screen');
  const attr = document.getElementById('entrance-attribution');
  if (attr) attr.innerHTML = ENTRANCE_ATTRIBUTION;

  // Every plotted place has a cinematic surface, so every pin is intercepted
  // by arrive(). No cross-depth destination is constructed here — see the note
  // on ENTRANCE_PLACES.
  const places = ENTRANCE_PLACES;

  setupCaptions();

  if (!hasWebGL()) {
    // No WebGL: positioned links at real coordinates over a dark field. NOT a
    // list — a menu is what experiential-references.md forbids.
    mountFallbackEntrance(host, places, null);
    revealChrome(loadingScreen, 0);
    return;
  }

  mountEntranceMap(host, places, onPinSelect)
    .then((e) => {
      entrance = e;
      // Audit §9.3 pacing, unchanged: darkness holds 1.5s, fades through over
      // 1.4s, then the approach runs. The visitor sees darkness, then the
      // world, then the captions — never all three at once.
      if (!loadingScreen) return runLandingSequence();
      gsap.to(loadingScreen, {
        opacity: 0,
        duration: 1.4,
        delay: 1.5,
        ease: 'power2.inOut',
        onComplete: () => {
          loadingScreen.style.display = 'none';
          runLandingSequence();
        },
      });
    })
    .catch((err) => {
      console.error('Entrance map unavailable; showing the static entrance.', err);
      host.innerHTML = '';
      mountFallbackEntrance(host, places, null);
      revealChrome(loadingScreen, 0);
    });
}

function revealChrome(loadingScreen, delay) {
  if (loadingScreen) { loadingScreen.style.display = 'none'; }
  gsap.delayedCall(delay, () => {
    const ui = document.getElementById('globe-ui-container');
    if (ui) ui.classList.add('active');
    wiredCaptions.forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('.entrance-pin').forEach((el) => el.classList.add('is-visible'));
  });
}

/*
  The approach. A CAMERA MOVE, not a fade: arriving at the world is a gesture a
  map can make honestly. 6.0s, GSAP's power3.inOut curve expressed as MapLibre
  easing — the same curve the globe fly-in used.

  Under reduced motion the settled view is taken directly and the chrome
  settles after 0.6s, exactly as the globe entrance did.
*/
function runLandingSequence() {
  const loadingScreen = document.getElementById('loading-screen');
  if (!entrance) return;

  if (reduced()) {
    entrance.jumpSettled();
    revealChrome(loadingScreen, 0.6);
    return;
  }

  entrance.approach(6).then(() => {
    // Audit §9.3: the post-arrival hold. The world sits in silence for 0.9s
    // after the camera stops — the "this place exists" beat — before the
    // captions fade in. The fade itself keeps --duration-fade and
    // --ease-editorial; the two curves are deliberately not unified.
    revealChrome(loadingScreen, 0.9);
  });
}

function onPinSelect(placeId, el) {
  const place = placeFor(placeId);
  if (place && place.surfaces && place.surfaces.cinematic) {
    arrive(place, el, placeId);
    return;
  }
  // Unreachable by construction: every plotted place has a cinematic surface.
  // Kept as a guard rather than a fallback, because the alternative would be a
  // cross-depth affordance on a cinematic surface (D3).
}

function setupCaptions() {
  const caps = document.querySelectorAll('#globe-ui-container a.page-caption');
  caps.forEach((el) => {
    const href = el.getAttribute('href') || '';
    const slug = href.split('/').pop().replace(/\.html$/, '');
    const place = getPlaceByNarrativeId(slug);
    if (!place || !place.surfaces.cinematic) return;
    wiredCaptions.push(el);
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const id = Object.keys(RESEARCH_SLUG).find((k) => RESEARCH_SLUG[k] === slug);
      arrive(place, el, id);
    });
  });
}

/**
 * Canonical Article III arrival into a curated cinematic place, dispatched by
 * the manifest's cinematic.arrival.kind. Timings, easings and the luminance dip
 * are UNCHANGED from the globe entrance; only the camera's subject moved.
 *
 *   entrance-hotspot (Sundarbans): departure fades the arriving caption +
 *     chrome; the camera arcs to the place over 2.0s * k (Approach); luminance
 *     dip; cut to places/<slug>.html at peak black (3.0s * k).
 *   dip (The Crossing, East Pacific Rise): no camera fly -- a journey/descent,
 *     not a point on the map; departure fades chrome; dip; cut at 1.5s * k.
 *
 * k compresses the envelope for reduced motion (0.5) without losing grammar.
 */
function arrive(place, captionEl, placeId) {
  if (isTransitioning) return;
  isTransitioning = true;
  killActiveTransition();

  const cine = place.surfaces.cinematic;
  const k = reduced() ? 0.5 : 1.0;
  const dest = `${BASE}places/${cine.slug}.html`;

  const tl = gsap.timeline();
  activeTransition = tl;

  if (cine.arrival.kind === 'entrance-hotspot') {
    /* ----- Departure (0 - 0.7s * k) ----- */
    if (captionEl) tl.to(captionEl, { opacity: 0, duration: 0.7 * k, ease: 'sine.inOut' }, 0);
    tl.to('#globe-ui-container', { opacity: 0, duration: 0.7 * k, ease: 'sine.inOut' }, 0);

    /* ----- Approach (0.4 - 2.4s * k) — the arc, preserved at 2.0s * k ----- */
    const target = ENTRANCE_PLACES.find((p) => p.id === placeId);
    if (entrance && target) {
      tl.add(() => { entrance.flyToPlace(target, 2.0 * k); }, 0.4 * k);
    }

    /* ----- Crossing (1.9 - 3.0s * k) -- luminance dip ----- */
    tl.add(() => {
      const ls = document.getElementById('loading-screen');
      if (ls) { ls.style.display = 'block'; ls.style.opacity = '0'; }
    }, 1.9 * k);
    tl.to('#loading-screen', { opacity: 1, duration: 1.0 * k, ease: 'power2.inOut' }, 1.9 * k);
    tl.to('#entrance', { opacity: 0, duration: 0.9 * k, ease: 'power2.inOut' }, 2.0 * k);

    /* ----- Cut at peak black (3.0s * k) ----- */
    tl.add(() => { window.location.assign(dest); }, 3.0 * k);
  } else {
    /* ----- Departure (0 - 0.7s * k) ----- */
    tl.to('#globe-ui-container', { opacity: 0, duration: 0.7 * k, ease: 'sine.inOut' }, 0);

    /* ----- Crossing (0.5 - 1.5s * k) -- luminance dip ----- */
    tl.add(() => {
      const ls = document.getElementById('loading-screen');
      if (ls) { ls.style.display = 'block'; ls.style.opacity = '0'; }
    }, 0.5 * k);
    tl.to('#loading-screen', { opacity: 1, duration: 0.9 * k, ease: 'power2.inOut' }, 0.5 * k);
    tl.to('#entrance', { opacity: 0, duration: 0.8 * k, ease: 'power2.inOut' }, 0.6 * k);

    /* ----- Cut at peak black (1.5s * k) ----- */
    tl.add(() => { window.location.assign(dest); }, 1.5 * k);
  }
}

function killActiveTransition() {
  if (activeTransition) {
    activeTransition.kill();
    activeTransition = null;
  }
}

document.addEventListener('DOMContentLoaded', init);
