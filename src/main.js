import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initHero } from './hero.js';
import { initScrollAnimations } from './scroll-animations.js';
import { initConceptSection } from './concept-section.js';
import { initSpeciesGallery } from './species-gallery.js';
import { initVisionSection } from './vision-section.js';
import { initNav } from './nav.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// --- Scroll progress navigation ---
function initScrollNav() {
  const dots = document.querySelectorAll('.scroll-nav__dot');
  const sections = document.querySelectorAll('.section');

  sections.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setActiveDot(index),
      onEnterBack: () => setActiveDot(index),
    });
  });

  function setActiveDot(activeIndex) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  }
}

// --- Lazy-load globe when its section is near the viewport ---
function initGlobeLazy() {
  const globeSection = document.getElementById('globe-section');
  if (!globeSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          observer.disconnect();
          import('./globe.js').then(({ initGlobe }) => {
            initGlobe();
          });
          break;
        }
      }
    },
    { rootMargin: '200px' }
  );

  observer.observe(globeSection);
}

// --- Fallback: remove js-loaded if an error occurs mid-init ---
window.addEventListener('error', () => {
  document.body.classList.remove('js-loaded');
});

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-loaded');

  initNav();
  initScrollNav();
  initHero();
  initGlobeLazy();
  initScrollAnimations();
  initConceptSection();
  initSpeciesGallery();
  initVisionSection();
});
