import './style.css';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { CinematicEngine } from './cinematic-engine.js';
import { Globe } from './globe.js';

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
let pageCaption = null;
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

  // Wire up the static page caption (Sundarbans \u00b7 Bengal tiger).
  // Clicking it intercepts the anchor and drives the canonical arrival
  // into the published Sundarbans place. The href remains as the
  // unenhanced fallback to the canonical research narrative at
  // notes/sundarbans-bengal-tiger-saline-swimmer.html for a JS-disabled
  // visitor; that page reads without 3D and stays in research register.
  setupPageCaption();
}

function setupPageCaption() {
  pageCaption = document.getElementById('page-caption');
  if (pageCaption) {
    pageCaption.addEventListener('click', (e) => {
      e.preventDefault();
      arriveAtSundarbans();
    });
  }

  const crossingCaption = document.getElementById('page-caption-crossing');
  if (crossingCaption) {
    crossingCaption.addEventListener('click', (e) => {
      e.preventDefault();
      arriveToCrossing();
    });
  }

  const eprCaption = document.getElementById('page-caption-epr');
  if (eprCaption) {
    eprCaption.addEventListener('click', (e) => {
      e.preventDefault();
      arriveToEPR();
    });
  }
}

/**
 * Canonical arrival into the published Sundarbans place.
 *
 * Implements Article III's four-phase transition. The five timing
 * marks below are scaled by `k` (1.0 normal, 0.5 reduced-motion) so
 * the sequence compresses without losing its grammar.
 *
 *   Departure (0.0 - 0.8s * k)
 *     The page-caption and the surrounding chrome recede. The camera
 *     begins to lean toward the Sundarbans hotspot. World drift is
 *     zeroed so the planet does not slide while we move past it.
 *
 *   Approach (0.4 - 2.4s * k)
 *     The camera arcs along the surface normal to a near-tangent
 *     over the Sundarbans hotspot, ending ~3 units off the surface.
 *     The planet occupies more frame.
 *
 *   Crossing (1.9 - 3.0s * k)
 *     The cinematic canvas dims to opacity 0 while the loading-screen
 *     scrim returns to opaque black, producing a luminance dip on
 *     top of the canvas. Article III \u00a73 mandates that the cut to
 *     the destination occur INSIDE this dip, never on a clear frame.
 *     At peak darkness (3.0s * k) we navigate to
 *     places/sundarbans.html.
 *
 *   Settle (post-navigation)
 *     The destination paints from a near-black inline-styled body, so
 *     the dark frame continues uninterrupted across the cut. The
 *     destination's own threshold reveal (~0.9s delay, then 1.6s
 *     ease) brings the framing question up out of the dark. The
 *     viewer never sees an unstyled flash, never sees a navigation
 *     gesture, and never sees a clear frame between source and
 *     destination.
 */
function arriveAtSundarbans() {
  if (isTransitioning) return;
  isTransitioning = true;

  killActiveTransition();

  // Zero the cursor-bias drift so the planet does not slide during
  // the approach. globe.update() reads `isHovered` and `mouse.x` each
  // frame; setting isHovered=false drops the bias to zero on the next
  // frame. The planet finishes its motion on AMBIENT_DRIFT alone.
  globe.isHovered = false;

  // Camera target: a near-tangent position over the Sundarbans
  // hotspot.
  globe.group.updateMatrixWorld();
  const speciesPos = globe.getSpeciesPosition('tiger');
  const worldPos = speciesPos.clone().applyMatrix4(globe.group.matrixWorld);
  const normal = worldPos.clone().normalize();
  const cameraTo = worldPos.clone().add(normal.clone().multiplyScalar(3.0));
  const targetTo = worldPos.clone();

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const k = reduce ? 0.5 : 1.0;

  const tl = gsap.timeline();
  activeTransition = tl;

  /* ----- Departure (0 - 0.8s * k) ----- */
  tl.to('#page-caption', {
    opacity: 0,
    duration: 0.7 * k,
    ease: 'sine.inOut'
  }, 0);
  tl.to('#globe-ui-container', {
    opacity: 0,
    duration: 0.7 * k,
    ease: 'sine.inOut'
  }, 0);

  /* ----- Approach (0.4 - 2.4s * k) ----- */
  tl.add(
    engine.flyCamera(cameraTo, targetTo, 2.0 * k, 'power3.inOut'),
    0.4 * k
  );

  /* ----- Crossing (1.9 - 3.0s * k) - the luminance dip -----
     The loading-screen scrim returns to opaque black underneath the
     canvas, then the canvas dims through it. The dip closes on true
     black, not on a transparent canvas over the body background. */
  tl.add(() => {
    const ls = document.getElementById('loading-screen');
    if (ls) {
      ls.style.display = 'block';
      ls.style.opacity = '0';
    }
  }, 1.9 * k);
  tl.to('#loading-screen', {
    opacity: 1,
    duration: 1.0 * k,
    ease: 'power2.inOut'
  }, 1.9 * k);
  tl.to('#cinematic-canvas', {
    opacity: 0,
    duration: 0.9 * k,
    ease: 'power2.inOut'
  }, 2.0 * k);

  /* ----- Cut at peak black (3.0s * k) -----
     The destination begins on a near-black inline-styled body
     (places/sundarbans.html <head> ensures first-paint darkness),
     so the dark frame continues across the navigation. Article III
     \u00a73 observed: the cut is hidden inside the luminance dip from
     both sides. Continuity is ecological: dark to dark. */
  tl.add(() => {
    const base = import.meta.env.BASE_URL || '/';
    // The browser fully tears down this page on navigation; the
    // engine animation loop, particle drift, and globe rotation stop
    // with it. No explicit teardown is required. activeTransition
    // stays referenced because it is the timeline currently in
    // flight; on navigation the reference is discarded with the
    // document.
    window.location.assign(`${base}places/sundarbans.html`);
  }, 3.0 * k);
}

/**
 * Arrival into the Crossing place (places/crossing.html).
 *
 * The Crossing has no globe hotspot — it is an open-ocean journey,
 * not a point on the planet. The transition therefore skips the globe
 * camera fly and runs only the luminance dip (Article III §3: the cut
 * to the destination must occur inside the dip, never on a clear frame).
 * Total duration is ~1.5s vs Sundarbans' 3.0s; the difference is the
 * absence of the 2.0s approach arc. The grammar is otherwise identical.
 */
function arriveToCrossing() {
  if (isTransitioning) return;
  isTransitioning = true;

  killActiveTransition();
  globe.isHovered = false;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const k = reduce ? 0.5 : 1.0;

  const tl = gsap.timeline();
  activeTransition = tl;

  /* ----- Departure (0 - 0.7s * k) ----- */
  tl.to('#globe-ui-container', {
    opacity: 0,
    duration: 0.7 * k,
    ease: 'sine.inOut'
  }, 0);

  /* ----- Crossing (0.5 - 1.5s * k) — luminance dip ----- */
  tl.add(() => {
    const ls = document.getElementById('loading-screen');
    if (ls) {
      ls.style.display = 'block';
      ls.style.opacity = '0';
    }
  }, 0.5 * k);
  tl.to('#loading-screen', {
    opacity: 1,
    duration: 0.9 * k,
    ease: 'power2.inOut'
  }, 0.5 * k);
  tl.to('#cinematic-canvas', {
    opacity: 0,
    duration: 0.8 * k,
    ease: 'power2.inOut'
  }, 0.6 * k);

  /* ----- Cut at peak black (1.5s * k) ----- */
  tl.add(() => {
    const base = import.meta.env.BASE_URL || '/';
    window.location.assign(`${base}places/crossing.html`);
  }, 1.5 * k);
}

/**
 * Arrival into the East Pacific Rise place (places/epr-vents.html).
 *
 * Like the Crossing, the vent field has no globe hotspot — it is an
 * abyssal descent, not a point on the planet — so this transition skips
 * the globe camera fly and runs only the luminance dip (Article III §3:
 * the cut must occur inside the dip, never on a clear frame). The
 * destination begins on a near-black inline-styled body (#02030a), so
 * the dark frame continues uninterrupted across the cut. Grammar and
 * timing are identical to arriveToCrossing().
 */
function arriveToEPR() {
  if (isTransitioning) return;
  isTransitioning = true;

  killActiveTransition();
  globe.isHovered = false;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const k = reduce ? 0.5 : 1.0;

  const tl = gsap.timeline();
  activeTransition = tl;

  /* ----- Departure (0 - 0.7s * k) ----- */
  tl.to('#globe-ui-container', {
    opacity: 0,
    duration: 0.7 * k,
    ease: 'sine.inOut'
  }, 0);

  /* ----- Crossing (0.5 - 1.5s * k) — luminance dip ----- */
  tl.add(() => {
    const ls = document.getElementById('loading-screen');
    if (ls) {
      ls.style.display = 'block';
      ls.style.opacity = '0';
    }
  }, 0.5 * k);
  tl.to('#loading-screen', {
    opacity: 1,
    duration: 0.9 * k,
    ease: 'power2.inOut'
  }, 0.5 * k);
  tl.to('#cinematic-canvas', {
    opacity: 0,
    duration: 0.8 * k,
    ease: 'power2.inOut'
  }, 0.6 * k);

  /* ----- Cut at peak black (1.5s * k) ----- */
  tl.add(() => {
    const base = import.meta.env.BASE_URL || '/';
    window.location.assign(`${base}places/epr-vents.html`);
  }, 1.5 * k);
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
      if (pageCaption) pageCaption.classList.add('is-visible');
      const crossingCaption = document.getElementById('page-caption-crossing');
      if (crossingCaption) crossingCaption.classList.add('is-visible');
      const eprCaption = document.getElementById('page-caption-epr');
      if (eprCaption) eprCaption.classList.add('is-visible');
    });
  });
}

function onResize() {
  if (engine) engine.resize();
}

document.addEventListener('DOMContentLoaded', init);
