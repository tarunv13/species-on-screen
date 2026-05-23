import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-driven animations for all sections.
 * Uses GSAP ScrollTrigger with scrub for scroll-linked timing.
 * Respects prefers-reduced-motion.
 */

export function initScrollAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  initHeroScroll();
  initGlobeScroll();
  initConceptScroll();
  initSpeciesScroll();
  initVisionScroll();
}

/**
 * Hero section: pin and parallax title out as user scrolls
 */
function initHeroScroll() {
  const hero = document.getElementById('hero');
  const title = hero?.querySelector('.hero__title');
  const subtitle = hero?.querySelector('.hero__subtitle');
  const particles = hero?.querySelector('.hero__particles');

  if (!hero) return;

  // Pin hero during initial scroll
  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: '+=50%',
    pin: true,
    pinSpacing: true,
  });

  // Parallax title and fade out during pin
  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=50%',
      scrub: 1,
    },
  });

  if (title) {
    heroTl.to(title, { y: -60, opacity: 0, ease: 'none' }, 0);
  }
  if (subtitle) {
    heroTl.to(subtitle, { y: -30, opacity: 0, ease: 'none' }, 0.1);
  }
  if (particles) {
    heroTl.to(particles, { opacity: 0, ease: 'none' }, 0);
  }
}

/**
 * Globe section: reveal with scale effect
 */
function initGlobeScroll() {
  const globeSection = document.getElementById('globe-section');
  const globeContainer = document.getElementById('globe-container');
  const heading = globeSection?.querySelector('.section__heading');
  const text = globeSection?.querySelector('.section__text');
  const companions = globeSection?.querySelectorAll('.globe-companion');

  if (!globeSection) return;

  // Set initial states
  gsap.set(globeContainer, { opacity: 0, scale: 0.9 });
  if (heading) gsap.set(heading, { opacity: 0, y: 30 });
  if (text) gsap.set(text, { opacity: 0, y: 20 });

  // Reveal animation
  const globeTl = gsap.timeline({
    scrollTrigger: {
      trigger: globeSection,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1,
    },
  });

  if (heading) {
    globeTl.to(heading, { opacity: 1, y: 0, ease: 'none' }, 0);
  }
  if (text) {
    globeTl.to(text, { opacity: 1, y: 0, ease: 'none' }, 0.1);
  }
  globeTl.to(globeContainer, { opacity: 1, scale: 1, ease: 'none' }, 0.2);

  // Companion text panels stagger in
  if (companions && companions.length > 0) {
    companions.forEach((panel, i) => {
      gsap.set(panel, { opacity: 0, y: 25 });
      gsap.to(panel, {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: panel,
          start: 'top 85%',
          end: 'top 55%',
          scrub: 1,
        },
      });
    });
  }
}

/**
 * Concept section: heading + staggered glass cards
 */
function initConceptScroll() {
  const conceptSection = document.getElementById('concept-section');
  if (!conceptSection) return;

  const heading = conceptSection.querySelector('.section__heading');
  const text = conceptSection.querySelector('.section__text');
  const cards = conceptSection.querySelectorAll('.glass-card');

  if (heading) {
    gsap.set(heading, { opacity: 0, y: 30 });
    gsap.to(heading, {
      opacity: 1,
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: heading,
        start: 'top 80%',
        end: 'top 55%',
        scrub: 1,
      },
    });
  }

  if (text) {
    gsap.set(text, { opacity: 0, y: 20 });
    gsap.to(text, {
      opacity: 1,
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: text,
        start: 'top 80%',
        end: 'top 55%',
        scrub: 1,
      },
    });
  }

  // Stagger cards
  if (cards.length > 0) {
    cards.forEach((card, i) => {
      gsap.set(card, { opacity: 0, y: 40, scale: 0.95 });
      gsap.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 60%',
          scrub: 1,
        },
      });
    });
  }
}

/**
 * Species section: header, hero stat, and connecting story animate in.
 * Panel reveals are handled by tiger-section.js for more control.
 */
function initSpeciesScroll() {
  const speciesSection = document.getElementById('species-section');
  if (!speciesSection) return;

  const header = speciesSection.querySelector('.species__header');
  const heroStat = speciesSection.querySelector('.species__hero-stat');
  const connectingStory = speciesSection.querySelector('.species__connecting-story');

  if (header) {
    gsap.set(header, { opacity: 0, y: 30 });
    gsap.to(header, {
      opacity: 1,
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: header,
        start: 'top 80%',
        end: 'top 60%',
        scrub: 1,
      },
    });
  }

  if (heroStat) {
    gsap.set(heroStat, { opacity: 0, scale: 0.8 });
    gsap.to(heroStat, {
      opacity: 1,
      scale: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: heroStat,
        start: 'top 82%',
        end: 'top 55%',
        scrub: 1,
      },
    });
  }

  if (connectingStory) {
    gsap.set(connectingStory, { opacity: 0, y: 25 });
    gsap.to(connectingStory, {
      opacity: 1,
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: connectingStory,
        start: 'top 85%',
        end: 'top 60%',
        scrub: 1,
      },
    });
  }
}

/**
 * Vision section: cinematic blur-to-clear fade in
 */
function initVisionScroll() {
  const visionSection = document.getElementById('vision-section');
  if (!visionSection) return;

  const heading = visionSection.querySelector('.section__heading');
  const texts = visionSection.querySelectorAll('.section__text');
  const roadmap = visionSection.querySelector('.vision__roadmap');
  const footer = visionSection.querySelector('.vision__footer');

  // Set initial states with blur
  if (heading) {
    gsap.set(heading, { opacity: 0, y: 30, filter: 'blur(8px)' });
    gsap.to(heading, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      ease: 'none',
      scrollTrigger: {
        trigger: heading,
        start: 'top 80%',
        end: 'top 50%',
        scrub: 1,
      },
    });
  }

  if (texts.length > 0) {
    texts.forEach((text) => {
      gsap.set(text, { opacity: 0, y: 25, filter: 'blur(6px)' });
      gsap.to(text, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        ease: 'none',
        scrollTrigger: {
          trigger: text,
          start: 'top 82%',
          end: 'top 52%',
          scrub: 1,
        },
      });
    });
  }

  if (roadmap) {
    gsap.set(roadmap, { opacity: 0, y: 20 });
    gsap.to(roadmap, {
      opacity: 1,
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: roadmap,
        start: 'top 85%',
        end: 'top 65%',
        scrub: 1,
      },
    });
  }

  if (footer) {
    gsap.set(footer, { opacity: 0 });
    gsap.to(footer, {
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: footer,
        start: 'top 90%',
        end: 'top 75%',
        scrub: 1,
      },
    });
  }
}
