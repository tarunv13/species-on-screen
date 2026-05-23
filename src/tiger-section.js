import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Tiger section interactivity.
 * Animated counter for the population stat and sequential panel reveals.
 */

export function initTigerSection() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initCounter(prefersReducedMotion);
  if (!prefersReducedMotion) {
    initPanelReveals();
  }
}

/**
 * Animates the population counter from 0 to target value when scrolled into view.
 */
function initCounter(reducedMotion) {
  const counterEl = document.querySelector('.species__counter');
  if (!counterEl) return;

  const target = parseInt(counterEl.dataset.target, 10);
  if (isNaN(target)) return;

  if (reducedMotion) {
    counterEl.textContent = target.toLocaleString();
    return;
  }

  const obj = { value: 0 };

  ScrollTrigger.create({
    trigger: counterEl,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to(obj, {
        value: target,
        duration: 2.5,
        ease: 'power2.out',
        onUpdate: () => {
          counterEl.textContent = Math.round(obj.value).toLocaleString();
        },
      });
    },
  });
}

/**
 * Each species panel reveals sequentially as the user scrolls through.
 */
function initPanelReveals() {
  const panels = document.querySelectorAll('.species__panel');

  panels.forEach((panel) => {
    gsap.set(panel, { opacity: 0, y: 50 });

    gsap.to(panel, {
      opacity: 1,
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: panel,
        start: 'top 85%',
        end: 'top 55%',
        scrub: 1,
      },
    });
  });
}
