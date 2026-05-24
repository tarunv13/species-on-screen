import './style.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CinematicEngine } from './cinematic-engine.js';
import { Globe } from './globe.js';
import { OverlayUI } from './overlay-ui.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

let engine = null;
let globe = null;
let overlayUI = null;
let progressBar = null;

/**
 * Initialize the cinematic experience
 */
function init() {
  const canvas = document.getElementById('cinematic-canvas');
  if (!canvas) return;

  // Show loading screen
  const loadingScreen = document.getElementById('loading-screen');

  // Initialize Lenis smooth scrolling
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  // Connect Lenis to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  // Initialize cinematic engine (Three.js scene)
  engine = new CinematicEngine(canvas);

  // Initialize globe and add to scene
  globe = new Globe(engine.getScene(), engine.getCamera(), engine.renderer);

  // Initialize overlay UI
  overlayUI = new OverlayUI();

  // Progress bar
  progressBar = document.querySelector('.scroll-progress-bar');

  // Set up scroll-driven animation
  setupScrollTrigger();

  // Handle resize
  window.addEventListener('resize', onResize);

  // Hide loading screen
  if (loadingScreen) {
    gsap.to(loadingScreen, {
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      onComplete: () => {
        loadingScreen.style.display = 'none';
      },
    });
  }

  // Register globe update in the engine's render loop
  engine.onUpdate((delta) => {
    if (globe) {
      globe.update(delta);
    }
  });
}

/**
 * Set up GSAP ScrollTrigger to drive camera and overlays
 */
function setupScrollTrigger() {
  const scrollContainer = document.getElementById('scroll-container');
  if (!scrollContainer) return;

  ScrollTrigger.create({
    trigger: scrollContainer,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;

      // Update camera position
      if (engine) {
        engine.update(progress);
      }

      // Update overlay visibility
      if (overlayUI) {
        overlayUI.update(progress);
      }

      // Update progress bar
      if (progressBar) {
        progressBar.style.transform = `scaleX(${progress})`;
      }
    },
  });
}

/**
 * Handle window resize
 */
function onResize() {
  if (engine) {
    engine.resize();
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
