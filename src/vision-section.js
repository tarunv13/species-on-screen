import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Vision section interactivity.
 * Staggered reveal of roadmap items and breathing pulse animation.
 */

export function initVisionSection() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  initRoadmapReveal();
}

/**
 * Roadmap items fade and stagger in as user scrolls into view.
 */
function initRoadmapReveal() {
  const items = document.querySelectorAll('.vision__roadmap-item');

  items.forEach((item, i) => {
    gsap.set(item, { opacity: 0, x: -15 });

    gsap.to(item, {
      opacity: 1,
      x: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: item,
        start: 'top 88%',
        end: 'top 68%',
        scrub: 1,
      },
    });
  });
}
