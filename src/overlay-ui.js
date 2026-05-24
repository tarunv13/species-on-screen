import { gsap } from 'gsap';

/**
 * Overlay visibility ranges - each overlay is visible during a portion of scroll progress
 * Values are [fadeInStart, fullyVisible, fadeOutStart, fullyHidden]
 */
const OVERLAY_RANGES = {
  hero: [0, 0.0, 0.15, 0.22],
  globe: [0.18, 0.25, 0.40, 0.48],
  numbers: [0.38, 0.44, 0.48, 0.54],
  species: [0.50, 0.52, 0.75, 0.82],
  vision: [0.78, 0.85, 1.0, 1.0],
};

/**
 * OverlayUI - manages HTML overlay visibility based on scroll progress
 */
export class OverlayUI {
  constructor() {
    this.overlays = {};
    this._prevVisible = {};
    this._cacheElements();
  }

  _cacheElements() {
    this.overlays.hero = document.querySelector('.overlay--hero');
    this.overlays.globe = document.querySelector('.overlay--globe');
    this.overlays.numbers = document.querySelector('.overlay--numbers');
    this.overlays.species = document.querySelector('.overlay--species');
    this.overlays.vision = document.querySelector('.overlay--vision');
  }

  /**
   * Calculate opacity for an overlay given a progress value and its range
   */
  _getOpacity(progress, range) {
    const [fadeIn, visibleStart, fadeOutStart, hidden] = range;

    if (progress <= fadeIn) return 0;
    if (progress >= hidden) return 0;
    if (progress >= visibleStart && progress <= fadeOutStart) return 1;

    // Fading in
    if (progress > fadeIn && progress < visibleStart) {
      return (progress - fadeIn) / (visibleStart - fadeIn);
    }

    // Fading out
    if (progress > fadeOutStart && progress < hidden) {
      return 1 - (progress - fadeOutStart) / (hidden - fadeOutStart);
    }

    return 0;
  }

  /**
   * Stagger child elements when an overlay becomes visible
   */
  _staggerChildren(el, isBecomingVisible) {
    if (!el) return;
    const children = el.querySelectorAll('.overlay__heading, .overlay__text, .overlay__tagline, .species-grid, .numbers-grid');
    if (isBecomingVisible && children.length > 0) {
      gsap.fromTo(children, {
        opacity: 0,
        y: 15,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: 'back.out(1.4)',
        overwrite: true,
      });
    }
  }

  /**
   * Update overlay visibility based on scroll progress (0-1)
   */
  update(progress) {
    Object.entries(OVERLAY_RANGES).forEach(([key, range]) => {
      const el = this.overlays[key];
      if (!el) return;

      const opacity = this._getOpacity(progress, range);
      const isVisible = opacity > 0.01;
      const wasVisible = this._prevVisible[key] || false;

      // Trigger stagger animation on visibility change
      if (isVisible && !wasVisible) {
        this._staggerChildren(el, true);
      }
      this._prevVisible[key] = isVisible;

      const translateY = isVisible ? 0 : 30;

      gsap.set(el, {
        opacity,
        visibility: isVisible ? 'visible' : 'hidden',
        pointerEvents: opacity > 0.5 ? 'auto' : 'none',
        y: translateY * (1 - opacity),
      });
    });
  }
}
