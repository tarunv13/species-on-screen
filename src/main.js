import './style.css';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { CinematicEngine } from './cinematic-engine.js';
import { Globe } from './globe.js';
import { FloatingCards } from './floating-cards.js';
import { SafariScene } from './safari-scene.js';

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

  // Handle resize
  window.addEventListener('resize', onResize);

  // Register globe update in the engine render loop
  engine.onUpdate((delta) => {
    if (globe) globe.update(delta);
    if (floatingCards) floatingCards.update(engine.getCamera(), globe);
  });

  // Audit §9.3: extended landing pacing. The page now holds darkness
  // for 1.5s before the scrim begins to fade, takes 1.4s to fade
  // through, and lets the camera approach take 6s instead of 3s.
  // Total landing time roughly doubles (≈ 8.9s vs ≈ 4.3s). The
  // doctrine: patience is one thing at a time, in order. The visitor
  // sees darkness, then a planet, then captions — never all three
  // at once.
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

  // Set up return-to-globe button
  setupReturnButton();

  // Wait for species data to load, then create floating cards
  waitForSpeciesData();
}

function waitForSpeciesData() {
  if (!globe || typeof globe.whenDataLoaded !== 'function') return;

  globe.whenDataLoaded().then(({ loaded, failed }) => {
    if (failed.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(
        `[main] ${failed.length}/${failed.length + loaded.length} species failed to load — continuing with ${loaded.length}.`
      );
    }
    if (loaded.length === 0) {
      // eslint-disable-next-line no-console
      console.warn('[main] No species data loaded — floating cards will not render. Globe remains interactive.');
      return;
    }
    initFloatingCards();
  }).catch((err) => {
    // eslint-disable-next-line no-console
    console.warn('[main] Species data load pipeline error:', err);
  });
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

  // Zero out globe inertia to prevent drift during safari
  globe._velocity.x = 0;
  globe._velocity.y = 0;

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

  // Phase 2 (600-1400ms): Camera flies toward species point
  tl.add(engine.flyCamera(cameraTo, targetTo, 0.8, 'power3.inOut'), 0.6);

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
    try {
      const cachedData = globe.speciesDataCache[speciesSlug];
      await safariScene.enter(speciesSlug, cachedData);
      isTransitioning = false;
      activeTransition = null;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`[main] Safari enter failed for "${speciesSlug}", rolling back transition state:`, err);
      executeReturnToGlobe({ force: true });
    }
  });
}

function killActiveTransition() {
  if (activeTransition) {
    activeTransition.kill();
    activeTransition = null;
  }
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

  // Audit §9.3: re-entry uses the same off-centre composition target
  // as runLandingSequence (X = +1.0). The visitor returns to the
  // same framing they left from; the planet does not leap to centre
  // when the species page exits.
  const defaultPos = new THREE.Vector3(1.0, 0.3, 5.5);
  const defaultTarget = new THREE.Vector3(0, 0, 0);
  tl.add(engine.flyCamera(defaultPos, defaultTarget, 1.0, 'power3.inOut'), 0.3);

  // Show floating cards again, release the transition lock.
  tl.add(() => {
    if (floatingCards) floatingCards.show();
    isTransitioning = false;
    activeTransition = null;
  }, 1.3);
}

function runLandingSequence() {
  const globeUI = document.getElementById('globe-ui-container');

  // Audit §9.3: off-centre composition target. The camera arrives
  // shifted +1.0 unit on X relative to the previous centred framing.
  // With the camera looking at world-origin, this places the planet
  // slightly LEFT of frame centre (≈18% off-axis at z=5.5), giving
  // breathing space to the right. Editorial documentary framing,
  // not centred product-shot framing. The same off-axis position is
  // used by executeReturnToGlobe so re-entry preserves composition.
  const targetPos = new THREE.Vector3(1.0, 0.3, 5.5);
  const targetLookAt = new THREE.Vector3(0, 0, 0);

  // Fly-in extended from 3.0s to 6.0s. The planet emerges as a slow
  // approach, not a swoop. power3.inOut keeps the start and end
  // hesitant rather than spring-loaded.
  const tl = engine.flyCamera(targetPos, targetLookAt, 6, 'power3.inOut');

  tl.eventCallback('onComplete', () => {
    // Audit §9.3: post-arrival hold. The planet sits in silence for
    // 0.9s after the camera stops — the 'this place exists' beat —
    // before the species captions begin to fade in. Without this
    // hold, the captions read as "labels appearing" (interactive);
    // with it, they read as "captions arriving" (editorial).
    gsap.delayedCall(0.9, () => {
      if (globeUI) {
        globeUI.classList.add('active');
      }
      if (floatingCards) {
        floatingCards.show();
      }
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
