import './style.css';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { CinematicEngine } from './cinematic-engine.js';
import { Globe } from './globe.js';
import { FloatingCards } from './floating-cards.js';
import { SafariScene } from './safari-scene.js';
import { prefersReducedMotion } from './reduced-motion.js';

let engine = null;
let globe = null;
let floatingCards = null;
let safariScene = null;
let isTransitioning = false;
// Single authoritative reference to the currently-playing transition timeline
// (forward into safari OR rollback to globe). Any new transition must kill the
// previous one before constructing its own, so two timelines never tween the
// same DOM property simultaneously.
let activeTransition = null;

function init() {
  const canvas = document.getElementById('cinematic-canvas');
  if (!canvas) return;

  const loadingScreen = document.getElementById('loading-screen');

  engine = new CinematicEngine(canvas);
  globe = new Globe(engine.getScene(), engine.getCamera(), engine.renderer);

  // Create safari scene instance
  const safariContainer = document.getElementById('safari-container');
  if (safariContainer) {
    safariScene = new SafariScene(safariContainer);
  }

  // Set initial layer to species (media)
  globe.setLayer('species');

  // Set up layer toggle buttons
  setupLayerToggles();

  // Handle resize
  window.addEventListener('resize', onResize);

  // Register globe update in the engine render loop
  engine.onUpdate((delta) => {
    if (globe) globe.update(delta);
    if (floatingCards) floatingCards.update(engine.getCamera(), globe);
  });

  // Hide loading screen then run landing sequence
  if (loadingScreen) {
    gsap.to(loadingScreen, {
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
      onComplete: () => {
        loadingScreen.style.display = 'none';
        runLandingSequence();
      },
    });
  } else {
    runLandingSequence();
  }

  // Set up return-to-globe button
  setupReturnButton();

  // Wait for species data to load, then create floating cards
  waitForSpeciesData();
}

function waitForSpeciesData() {
  const expectedCount = 10;
  const check = () => {
    if (Object.keys(globe.speciesDataCache).length >= expectedCount) {
      initFloatingCards();
    } else {
      setTimeout(check, 200);
    }
  };
  check();
}

function initFloatingCards() {
  const container = document.getElementById('floating-cards-container');
  if (!container) return;

  floatingCards = new FloatingCards(container, globe.speciesDataCache, onCardClick);
}

function onCardClick(speciesSlug) {
  if (isTransitioning) return;
  isTransitioning = true;

  // Defensive: any leftover transition (should be null in normal flow).
  killActiveTransition();

  // Isolate globe-only UI for the duration of the safari. Inerting
  // #globe-ui-container removes the layer-toggle buttons from the tab
  // order and the a11y tree (silent state mutation via Enter/Space is
  // no longer possible) and blocks pointer events through the subtree
  // even if future z-index changes ever expose them. Synchronous DOM
  // property assignment — no animation, no choreography impact.
  freezeGlobeUI();

  // Zero out globe inertia to prevent drift during safari
  globe._velocity.x = 0;
  globe._velocity.y = 0;

  // Begin hero-image preload as early as possible, in parallel with the
  // 2s forward transition. By the time onComplete awaits it, the bitmap
  // is normally already in the HTTP cache and the safari hero paints
  // synchronously when innerHTML is set inside enter(). The 2500ms
  // ceiling means a stalled CDN can extend the transition by at most
  // ~500ms past the 2s timeline; if it times out, the safari opens
  // with the same blank-then-fade behaviour as before this commit, so
  // the change is monotonically non-regressive.
  const cachedData = globe.speciesDataCache[speciesSlug];
  const heroUrl = cachedData
    && Array.isArray(cachedData.photos)
    && cachedData.photos.length > 0
    && typeof cachedData.photos[0].url === 'string'
    ? cachedData.photos[0].url
    : null;
  const heroPreload = preloadImage(heroUrl, 2500);

  const speciesWorldPos = globe.getSpeciesPosition(speciesSlug);
  // Transform to world coordinates
  globe.group.updateMatrixWorld();
  const worldPos = speciesWorldPos.clone().applyMatrix4(globe.group.matrixWorld);
  const normal = worldPos.clone().normalize();
  // Camera target: slightly above the species point, looking at it
  const cameraTo = worldPos.clone().add(normal.clone().multiplyScalar(2));
  const targetTo = worldPos.clone();

  const tl = gsap.timeline();
  activeTransition = tl;

  // Phase 1 (0-600ms): Cards fade out
  tl.add(() => {
    if (floatingCards) floatingCards.hide();
  }, 0);

  // Phase 2 (600-1400ms): Camera flies toward species point.
  // Reduced-motion: collapse the spatial fly to ~1 frame; the rest of
  // the timeline (canvas/safari fades) carries the narrative tempo.
  const forwardFlyDuration = prefersReducedMotion() ? 0.01 : 0.8;
  tl.add(engine.flyCamera(cameraTo, targetTo, forwardFlyDuration, 'power3.inOut'), 0.6);

  // Phase 3 (1400-2000ms): Globe fades, safari appears
  tl.to('#cinematic-canvas', { opacity: 0.3, duration: 0.6, ease: 'power2.inOut' }, 1.4);
  tl.add(() => {
    const safariContainer = document.getElementById('safari-container');
    const returnBtn = document.querySelector('.return-to-globe');
    if (safariContainer) safariContainer.classList.add('active');
    if (returnBtn) returnBtn.style.display = 'block';
  }, 1.6);
  tl.to('#safari-container', { opacity: 1, duration: 0.4, ease: 'power2.out' }, 1.6);

  // Phase 4: Enter safari scene after transition completes
  tl.eventCallback('onComplete', async () => {
    // Capture ownership at the moment the timeline naturally completes.
    // If a force-rollback (or any future code path) replaces activeTransition
    // while we are awaiting safariScene.enter(), the resolution must NOT
    // mutate state that no longer belongs to us.
    const ownedTl = tl;
    try {
      // Block enter() until the hero bitmap is decoded (or the preload
      // timeout fires). heroPreload never rejects — preloadImage is
      // fault-tolerant by construction — so this await cannot throw.
      await heroPreload;
      await safariScene.enter(speciesSlug, cachedData);
      if (activeTransition !== ownedTl) return; // stale; new owner has the floor
      isTransitioning = false;
      activeTransition = null;
    } catch (err) {
      if (activeTransition !== ownedTl) return; // stale; do not double-rollback
      // eslint-disable-next-line no-console
      console.warn(`[main] Safari enter failed for "${speciesSlug}", rolling back transition state:`, err);
      executeReturnToGlobe({ force: true });
    }
  });
}

/**
 * Resolve once the image at `url` has been fetched and decoded (so a
 * subsequent `<img src=URL>` paints synchronously from the HTTP cache),
 * or after `timeoutMs` has elapsed — whichever happens first. Never
 * rejects; on any failure mode the resolved promise lets the caller
 * proceed with whatever fallback behaviour they already had.
 *
 * Preload is a passive cache-warmer: no DOM insertion, no event-listener
 * leak, and the Image instance is GC-eligible once decode settles.
 *
 * @param {string|null} url
 * @param {number} timeoutMs
 * @returns {Promise<void>}
 */
function preloadImage(url, timeoutMs) {
  if (!url) return Promise.resolve();
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    const img = new Image();
    img.decoding = 'async';
    img.src = url; // triggers HTTP fetch immediately
    if (typeof img.decode === 'function') {
      // decode() resolves only after the bitmap is paint-ready
      img.decode().then(finish, finish);
    } else {
      img.onload = finish;
      img.onerror = finish;
    }
    // Hard ceiling so a stalled CDN cannot extend the transition.
    setTimeout(finish, timeoutMs);
  });
}

function killActiveTransition() {
  if (activeTransition) {
    activeTransition.kill();
    activeTransition = null;
  }
}

/**
 * Make every globe-only UI element inert for the duration of the safari:
 *   - #globe-ui-container subtree: removed from tab order, a11y tree,
 *     and pointer events via the HTML `inert` property. Reverts on thaw.
 *   - #globe-tooltip: explicitly hidden once at safari entry; the Globe's
 *     per-frame tooltip writes are stable because canvas mouse events
 *     stop firing once the safari overlays the canvas, so the last write
 *     before freeze remains the active value.
 *
 * Synchronous, idempotent. On browsers without `inert` support (pre-2022
 * Safari/Firefox) the assignment is a no-op — current behaviour preserved,
 * no regression.
 */
function freezeGlobeUI() {
  const globeUI = document.getElementById('globe-ui-container');
  if (globeUI) globeUI.inert = true;
  const tooltip = document.getElementById('globe-tooltip');
  if (tooltip) tooltip.style.opacity = '0';
}

/** Inverse of freezeGlobeUI. Synchronous, idempotent. */
function thawGlobeUI() {
  const globeUI = document.getElementById('globe-ui-container');
  if (globeUI) globeUI.inert = false;
}

function returnToGlobe() {
  executeReturnToGlobe({ force: false });
}

// Authoritative rollback. Used by both the user-initiated back button
// (force=false, respects in-flight transitions) and the onCardClick failure
// path (force=true, bypasses the guard because we ARE the in-flight
// transition that needs unwinding).
function executeReturnToGlobe({ force = false } = {}) {
  if (isTransitioning && !force) return;
  isTransitioning = true;

  // Kill any in-flight forward timeline so it can no longer tween properties
  // we're about to reset. GSAP v3: tl.kill() does not fire onComplete and
  // propagates to nested child timelines added via tl.add().
  killActiveTransition();

  // Restore globe-only UI to interactive state at the very start of the
  // rollback (whether user-initiated or force-rollback). Mirrors the
  // freezeGlobeUI() call in onCardClick. Idempotent: safe to run even
  // if the globe UI is already interactive (no in-flight safari).
  thawGlobeUI();

  // Defensively tear down safari state. exit() is idempotent in current
  // SafariScene; the try/catch shields the rollback if a half-initialised
  // safari throws on cleanup.
  if (safariScene && typeof safariScene.exit === 'function') {
    try { safariScene.exit(); } catch { /* tolerate cleanup errors */ }
  }

  const tl = gsap.timeline();
  activeTransition = tl;

  // Fade safari out
  tl.to('#safari-container', { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, 0);
  tl.add(() => {
    const safariContainer = document.getElementById('safari-container');
    const returnBtn = document.querySelector('.return-to-globe');
    if (safariContainer) safariContainer.classList.remove('active');
    if (returnBtn) returnBtn.style.display = 'none';
  }, 0.4);

  // Restore canvas and fly camera back
  tl.to('#cinematic-canvas', { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.3);

  const defaultPos = new THREE.Vector3(0, 0.3, 5.5);
  const defaultTarget = new THREE.Vector3(0, 0, 0);
  // Reduced-motion: snap camera home; canvas opacity tween still
  // carries the perceived return.
  const flybackDuration = prefersReducedMotion() ? 0.01 : 1.0;
  tl.add(engine.flyCamera(defaultPos, defaultTarget, flybackDuration, 'power3.inOut'), 0.3);

  // Release the transition lock and re-show cards on the timeline's actual
  // completion event, not at a fixed beat. Decouples lifecycle ownership
  // from the assumption that the rollback animation is exactly 1.3s long.
  // Owner-check guards against a future force-rollback that replaces us
  // mid-flight (GSAP v3 suppresses onComplete on kill(), so this is a
  // belt-and-braces invariant for any later refactor).
  const ownedTl = tl;
  tl.eventCallback('onComplete', () => {
    if (activeTransition !== ownedTl) return;
    if (floatingCards) floatingCards.show();
    isTransitioning = false;
    activeTransition = null;
  });
}

function runLandingSequence() {
  const globeUI = document.getElementById('globe-ui-container');

  // Camera starts far away, flies in to globe view position
  const targetPos = new THREE.Vector3(0, 0.3, 5.5);
  const targetLookAt = new THREE.Vector3(0, 0, 0);

  // Reduced-motion: snap to the final camera position so the page
  // opens already-arrived. The runLandingSequence onComplete still
  // fires (just immediately) and adds .active to the globe-UI, which
  // CSS-fades in over 0.6s — so the narrative beat "globe arrives,
  // then UI reveals" is preserved without any fly-in trajectory.
  const landingDuration = prefersReducedMotion() ? 0.01 : 3;
  const tl = engine.flyCamera(targetPos, targetLookAt, landingDuration, 'power3.inOut');

  tl.eventCallback('onComplete', () => {
    // Show globe UI after landing completes
    if (globeUI) {
      globeUI.classList.add('active');
    }
    if (floatingCards) {
      floatingCards.show();
    }
  });
}

function setupLayerToggles() {
  const buttons = document.querySelectorAll('.layer-toggle-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const layer = btn.dataset.layer;
      if (globe) globe.setLayer(layer);
      if (floatingCards) floatingCards.setLayerVisibility(layer);
    });
  });
}

function setupReturnButton() {
  const returnBtn = document.querySelector('.return-to-globe');
  if (!returnBtn) return;
  returnBtn.addEventListener('click', returnToGlobe);
}

function onResize() {
  if (engine) engine.resize();
}

document.addEventListener('DOMContentLoaded', init);
