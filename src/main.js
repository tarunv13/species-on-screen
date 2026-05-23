import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
  initScrollNav();

  // Future module initialization:
  // - Globe (FEAT-002): import and init Three.js globe in #globe-container
  // - Scroll animations (FEAT-003): GSAP section entrance animations
});
