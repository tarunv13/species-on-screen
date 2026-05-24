import './style.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import barba from '@barba/core';
import { CinematicEngine } from './cinematic-engine.js';
import { Globe } from './globe.js';
import { OverlayUI } from './overlay-ui.js';
import { init3DHover, destroy3DHover } from './hover-3d.js';
import { animateCardZoom } from './transitions.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

let engine = null;
let globe = null;
let overlayUI = null;
let progressBar = null;
let lenis = null;
let lenisTickerCallback = null;

/**
 * Initialize the cinematic experience
 */
function init() {
  const canvas = document.getElementById('cinematic-canvas');
  if (!canvas) return;

  // Show loading screen
  const loadingScreen = document.getElementById('loading-screen');

  // STEP 1 - Enhanced Lenis Config
  lenis = createLenis();

  // Initialize cinematic engine (Three.js scene)
  engine = new CinematicEngine(canvas);

  // Initialize globe and add to scene
  globe = new Globe(engine.getScene(), engine.getCamera(), engine.renderer);

  // Set up globe layer toggle buttons
  setupGlobeLayerToggles();

  // Set up globe info panel
  setupGlobeInfoPanel();

  // Initialize overlay UI
  overlayUI = new OverlayUI();

  // Progress bar
  progressBar = document.querySelector('.scroll-progress-bar');

  // Set up scroll-driven animation
  setupScrollTrigger();

  // Set up parallax layers (STEP 4)
  setupParallax();

  // Initialize 3D hover (STEP 3)
  init3DHover();

  // Species card click animation before full-page navigation
  setupSpeciesCardClicks();

  // Update nav state on scroll
  setupNavigation();

  // Handle resize
  window.addEventListener('resize', onResize);

  // Hide loading screen then run landing sequence
  if (loadingScreen) {
    gsap.to(loadingScreen, {
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      onComplete: () => {
        loadingScreen.style.display = 'none';
        runLandingSequence();
      },
    });
  } else {
    runLandingSequence();
  }

  // Register globe update in the engine's render loop
  engine.onUpdate((delta) => {
    if (globe) {
      globe.update(delta);
    }
  });
}

/**
 * Create a new Lenis instance with optimal cinematic settings
 */
function createLenis() {
  const instance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 1.5,
  });

  // Connect Lenis to GSAP ScrollTrigger
  instance.on('scroll', ScrollTrigger.update);
  lenisTickerCallback = (time) => { instance.raf(time * 1000); };
  gsap.ticker.add(lenisTickerCallback);
  gsap.ticker.lagSmoothing(0);

  return instance;
}

/**
 * STEP 2 - Landing Sequence with GSAP timeline
 */
function runLandingSequence() {
  const landing = document.querySelector('.landing-sequence');
  if (!landing) return;

  const layers = landing.querySelectorAll('.landing-layer');
  if (layers.length === 0) return;

  // Disable scroll during landing
  if (lenis) lenis.stop();

  const tl = gsap.timeline({
    onComplete: () => {
      // Phase 2 complete - enable scroll and reveal content
      if (lenis) lenis.start();
      gsap.to(landing, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          landing.style.display = 'none';
        },
      });
    },
  });

  // Phase 1 (0-2200ms): Layers fade in sequentially
  layers.forEach((layer, i) => {
    const delay = i * 0.22;
    tl.fromTo(layer, {
      opacity: 0,
      scale: 1.08 - (i * 0.008),
      y: 20 + (i * 3),
    }, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.5,
      ease: 'power4.out',
    }, delay);
  });

  // Phase 2 (2200-3200ms): Layers separate with parallax depth
  layers.forEach((layer, i) => {
    const depth = (i - 4) * 15;
    tl.to(layer, {
      y: depth,
      scale: 1 + (i * 0.005),
      opacity: i < 3 ? 0.4 : 1,
      duration: 1.0,
      ease: 'power2.inOut',
    }, 2.2);
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

      // Update nav active state
      updateNavActive(progress);
    },
  });
}

/**
 * STEP 4 - Parallax storytelling with ScrollTrigger scrub
 * Toggles will-change only while in active range for performance
 */
function setupParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax-speed]');

  parallaxEls.forEach((el) => {
    const speed = parseFloat(el.dataset.parallaxSpeed) || 1;
    const yOffset = (1 - speed) * 150;

    gsap.to(el, {
      y: yOffset,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onToggle: (self) => {
          el.style.willChange = self.isActive ? 'transform' : '';
        },
      },
    });
  });
}

/**
 * STEP 7 - Navigation setup with click-to-scroll
 */
function setupNavigation() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  const indicator = nav.querySelector('.site-nav__indicator');
  const items = nav.querySelectorAll('.site-nav__item');

  // Set initial active
  if (items.length > 0) {
    items[0].classList.add('site-nav__item--active');
  }

  // Scroll progress targets for each nav item
  const scrollTargets = [0, 0.20, 0.40, 0.52, 0.80];

  items.forEach((item, i) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const scrollContainer = document.getElementById('scroll-container');
      if (!scrollContainer) return;
      const targetY = scrollTargets[i] * (scrollContainer.scrollHeight - window.innerHeight);
      if (lenis) {
        lenis.scrollTo(targetY);
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  });

  // Store reference for scroll updates
  nav._indicator = indicator;
  nav._items = items;
}

/**
 * Species card click handler - plays zoom animation then navigates via full page load
 */
function setupSpeciesCardClicks() {
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.species-card');
    if (!card) return;
    e.preventDefault();
    animateCardZoom(card).then(() => {
      window.location.href = card.href;
    });
  });
}

/**
 * Update nav active item based on scroll progress
 */
function updateNavActive(progress) {
  const nav = document.querySelector('.site-nav');
  if (!nav || !nav._items) return;

  const items = nav._items;
  let activeIndex = 0;

  if (progress > 0.78) activeIndex = 4;
  else if (progress > 0.50) activeIndex = 3;
  else if (progress > 0.38) activeIndex = 2;
  else if (progress > 0.18) activeIndex = 1;

  items.forEach((item, i) => {
    item.classList.toggle('site-nav__item--active', i === activeIndex);
  });

  // Show/hide globe layer toggles when globe section is active
  const layerToggles = document.getElementById('globe-layer-toggles');
  if (layerToggles) {
    if (progress > 0.10 && progress < 0.45) {
      layerToggles.classList.add('visible');
    } else {
      layerToggles.classList.remove('visible');
    }
  }
}

/**
 * Handle window resize
 */
function onResize() {
  if (engine) {
    engine.resize();
  }
}

/**
 * Set up globe layer toggle buttons
 */
function setupGlobeLayerToggles() {
  const buttons = document.querySelectorAll('.globe-layer-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (globe) {
        globe.setLayer(btn.dataset.layer);
      }
    });
  });
}

/**
 * Set up globe info panel close and explore interactions
 */
function setupGlobeInfoPanel() {
  const panel = document.getElementById('globe-info-panel');
  if (!panel) return;

  const closeBtn = panel.querySelector('.globe-info-panel__close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      panel.style.display = 'none';
    });
  }

  const exploreBtn = panel.querySelector('.globe-info-panel__explore');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = exploreBtn.getAttribute('href');
      if (url && url !== '#') {
        window.location.href = url;
      }
    });
  }
}

/**
 * STEP 6 - Initialize Barba.js page transitions
 */
function initBarba() {
  barba.init({
    preventRunning: true,
    prefetchIgnore: false,
    transitions: [{
      name: 'zoom-transition',
      leave(data) {
        // Kill all ScrollTrigger instances to prevent leaks (issue #2)
        ScrollTrigger.getAll().forEach(t => t.kill());

        // Destroy Lenis before page swap (issue #3)
        if (lenis) {
          if (lenisTickerCallback) {
            gsap.ticker.remove(lenisTickerCallback);
            lenisTickerCallback = null;
          }
          lenis.destroy();
          lenis = null;
        }

        return gsap.to(data.current.container, {
          opacity: 0,
          scale: 1.1,
          duration: 0.6,
          ease: 'power3.inOut',
        });
      },
      enter(data) {
        return gsap.from(data.next.container, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: 'back.out(1.4)',
        });
      },
      afterEnter(data) {
        window.scrollTo(0, 0);

        // Destroy old hover listeners before re-init (issue #6)
        destroy3DHover();
        init3DHover();

        // If navigating back to home, re-setup scroll-driven features
        const namespace = data.next.namespace;
        if (namespace === 'home') {
          // Recreate Lenis (issue #3)
          lenis = createLenis();

          // Re-register ScrollTrigger and parallax (issue #2)
          setupScrollTrigger();
          setupParallax();
          setupNavigation();
        }
      },
    }],
  });

  // Wire globe clicks to full-page navigation for species pages
  if (globe) {
    globe.setNavigationHandler((url) => {
      window.location.href = url;
    });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  init();
  initBarba();
});
