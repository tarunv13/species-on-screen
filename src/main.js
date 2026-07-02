import './style.css';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { CinematicEngine } from './cinematic-engine.js';
import { Globe } from './globe.js';
import { getPlaceByNarrativeId } from '../cinematic-language/place-manifest.ts';

/*
  Homepage entry. Wires the planet, the editorial caption, and the
  canonical arrival path into the published Sundarbans place.

  Arrival is governed by Article III of the cinematic vocabulary
  (Departure -> Approach -> Crossing -> Settle). The previous
  `safari-scene` arrival is retired here; nothing on the homepage
  references SafariScene any longer.
*/

let engine = null;
let globe = null;
let wiredCaptions = [];
let isTransitioning = false;
// Single authoritative reference to the currently-playing transition
// timeline. Any new transition kills the previous one before
// constructing its own, so two timelines never tween the same DOM
// property simultaneously.
let activeTransition = null;

function init() {
  const canvas = document.getElementById('cinematic-canvas');
  if (!canvas) return;

  const loadingScreen = document.getElementById('loading-screen');

  engine = new CinematicEngine(canvas);
  globe = new Globe(engine.getScene(), engine.getCamera(), engine.renderer);

  // Keep the species marker layer active.
  globe.setLayer('species');

  window.addEventListener('resize', onResize);

  // Register globe update in the engine render loop.
  engine.onUpdate((delta) => {
    if (globe) globe.update(delta);
  });

  // Audit \u00a79.3: extended landing pacing. The page holds darkness
  // for 1.5s, takes 1.4s to fade through, and lets the camera
  // approach take 6s. The visitor sees darkness, then a planet, then
  // captions \u2014 never all three at once.
  if (loadingScreen) {
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
  } else {
    runLandingSequence();
  }

  // Wire the curated homepage captions to their manifest-driven arrivals.
  // Captions are human-authored anchors in index.html (curated, never
  // generated); the manifest supplies each caption's arrival kind/target
  // (ADR-002). The href remains the JS-disabled fallback to the research note.
  setupCaptions();
}

/*
  Wire the curated homepage captions to their cinematic arrivals. The captions
  are human-authored static anchors in index.html (curated composition, never
  generated -- ADR-002). A caption is matched to its place by the research-note
  slug in its href; its arrival kind/target/hotspot are DATA from the Place
  Manifest. This replaced the three bespoke arrival functions and per-id wiring
  (M26 Phase 1C). A caption with no manifest place (or no cinematic surface) is
  left as a plain link; a new place never appears here unless a human authors
  its caption anchor.
*/
function placeForCaption(el) {
  const href = el.getAttribute('href') || '';
  const slug = href.split('/').pop().replace(/\.html$/, '');
  return getPlaceByNarrativeId(slug);
}

function setupCaptions() {
  const caps = document.querySelectorAll('#globe-ui-container a.page-caption');
  caps.forEach((el) => {
    const place = placeForCaption(el);
    if (!place || !place.surfaces.cinematic) return;
    wiredCaptions.push(el);
    el.addEventListener('click', (e) => {
      e.preventDefault();
      arrive(place, el);
    });
  });
}

/**
 * Canonical Article III arrival into a curated cinematic place, dispatched by
 * the manifest's cinematic.arrival.kind. Timings, easings, camera fly, and the
 * luminance dip are unchanged from the pre-M26 bespoke functions; only the data
 * source (which place, which kind, which target, which hotspot) is the manifest.
 *
 *   globe-hotspot (Sundarbans): departure fades the arriving caption + chrome;
 *     the camera arcs to the hotspot (Approach); luminance dip; cut to
 *     places/<slug>.html at peak black (3.0s * k).
 *   dip (The Crossing, East Pacific Rise): no globe fly -- a journey/descent,
 *     not a point on the planet; departure fades chrome; dip; cut at 1.5s * k.
 *
 * k compresses the envelope for reduced motion (0.5) without losing grammar.
 */
function arrive(place, captionEl) {
  if (isTransitioning) return;
  isTransitioning = true;

  killActiveTransition();

  // Zero cursor-bias drift so the planet does not slide during the transition.
  globe.isHovered = false;

  const cine = place.surfaces.cinematic;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const k = reduce ? 0.5 : 1.0;
  const base = import.meta.env.BASE_URL || '/';
  const dest = `${base}places/${cine.slug}.html`;

  const tl = gsap.timeline();
  activeTransition = tl;

  if (cine.arrival.kind === 'globe-hotspot') {
    globe.group.updateMatrixWorld();
    const speciesPos = globe.getSpeciesPosition(cine.arrival.hotspotId);
    const worldPos = speciesPos.clone().applyMatrix4(globe.group.matrixWorld);
    const normal = worldPos.clone().normalize();
    const cameraTo = worldPos.clone().add(normal.clone().multiplyScalar(3.0));
    const targetTo = worldPos.clone();

    /* ----- Departure (0 - 0.7s * k) ----- */
    tl.to(captionEl, { opacity: 0, duration: 0.7 * k, ease: 'sine.inOut' }, 0);
    tl.to('#globe-ui-container', { opacity: 0, duration: 0.7 * k, ease: 'sine.inOut' }, 0);

    /* ----- Approach (0.4 - 2.4s * k) ----- */
    tl.add(engine.flyCamera(cameraTo, targetTo, 2.0 * k, 'power3.inOut'), 0.4 * k);

    /* ----- Crossing (1.9 - 3.0s * k) -- luminance dip ----- */
    tl.add(() => {
      const ls = document.getElementById('loading-screen');
      if (ls) { ls.style.display = 'block'; ls.style.opacity = '0'; }
    }, 1.9 * k);
    tl.to('#loading-screen', { opacity: 1, duration: 1.0 * k, ease: 'power2.inOut' }, 1.9 * k);
    tl.to('#cinematic-canvas', { opacity: 0, duration: 0.9 * k, ease: 'power2.inOut' }, 2.0 * k);

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
    tl.to('#cinematic-canvas', { opacity: 0, duration: 0.8 * k, ease: 'power2.inOut' }, 0.6 * k);

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

function runLandingSequence() {
  const globeUI = document.getElementById('globe-ui-container');

  // Audit \u00a79.3: off-centre composition target. The camera arrives
  // shifted +1.0 unit on X relative to a centred framing, placing
  // the planet slightly LEFT of frame centre. Editorial documentary
  // framing, not centred product-shot framing.
  const targetPos = new THREE.Vector3(1.0, 0.3, 5.5);
  const targetLookAt = new THREE.Vector3(0, 0, 0);

  // Fly-in is 6.0s \u2014 a slow approach, not a swoop.
  const tl = engine.flyCamera(targetPos, targetLookAt, 6, 'power3.inOut');

  tl.eventCallback('onComplete', () => {
    // Audit \u00a79.3: post-arrival hold. The planet sits in silence
    // for 0.9s after the camera stops \u2014 the 'this place exists'
    // beat \u2014 before the caption fades in.
    gsap.delayedCall(0.9, () => {
      if (globeUI) globeUI.classList.add('active');
      wiredCaptions.forEach((el) => el.classList.add('is-visible'));
    });
  });
}

function onResize() {
  if (engine) engine.resize();
}

document.addEventListener('DOMContentLoaded', init);
