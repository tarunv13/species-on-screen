import './style.css';
import { gsap } from 'gsap';
import { CinematicEngine } from './cinematic-engine.js';
import { Globe } from './globe.js';
import { FloatingCards } from './floating-cards.js';
import * as THREE from 'three';

let engine = null;
let globe = null;
let floatingCards = null;

function init() {
  const canvas = document.getElementById('cinematic-canvas');
  if (!canvas) return;

  const loadingScreen = document.getElementById('loading-screen');

  engine = new CinematicEngine(canvas);
  globe = new Globe(engine.getScene(), engine.getCamera(), engine.renderer);

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
  const check = () => {
    if (Object.keys(globe.speciesDataCache).length > 0) {
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
  const safariContainer = document.getElementById('safari-container');
  const returnBtn = document.querySelector('.return-to-globe');
  if (!safariContainer) return;

  // Navigate to species page in safari container or full page
  const basePath = import.meta.env.BASE_URL || '/';
  window.location.href = `${basePath}species/${speciesSlug}.html`;
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
  returnBtn.addEventListener('click', () => {
    const safariContainer = document.getElementById('safari-container');
    if (safariContainer) safariContainer.classList.remove('active');
    returnBtn.style.display = 'none';
  });
}

function onResize() {
  if (engine) engine.resize();
}

document.addEventListener('DOMContentLoaded', init);
