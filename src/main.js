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
    } catch {
      returnToGlobe();
    }
  });
}

function returnToGlobe() {
  if (isTransitioning) return;
  isTransitioning = true;

  if (safariScene) safariScene.exit();

  const tl = gsap.timeline();

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
  tl.add(engine.flyCamera(defaultPos, defaultTarget, 1.0, 'power3.inOut'), 0.3);

  // Show floating cards again
  tl.add(() => {
    if (floatingCards) floatingCards.show();
    isTransitioning = false;
  }, 1.3);
}

function runLandingSequence() {
  const globeUI = document.getElementById('globe-ui-container');

  // Camera starts far away, flies in to globe view position
  const targetPos = new THREE.Vector3(0, 0.3, 5.5);
  const targetLookAt = new THREE.Vector3(0, 0, 0);

  const tl = engine.flyCamera(targetPos, targetLookAt, 3, 'power3.inOut');

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
