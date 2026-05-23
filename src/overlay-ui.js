import { gsap } from 'gsap';

/**
 * Overlay visibility ranges - each overlay is visible during a portion of scroll progress
 * Values are [fadeInStart, fullyVisible, fadeOutStart, fullyHidden]
 */
const OVERLAY_RANGES = {
  hero: [0, 0.0, 0.12, 0.18],
  globe: [0.14, 0.20, 0.30, 0.36],
  research: [0.32, 0.38, 0.50, 0.56],
  species: [0.52, 0.58, 0.72, 0.78],
  methodology: [0.74, 0.80, 0.88, 0.92],
  vision: [0.88, 0.93, 1.0, 1.0],
};

/**
 * OverlayUI - manages HTML overlay visibility based on scroll progress
 */
export class OverlayUI {
  constructor() {
    this.overlays = {};
    this._cacheElements();
  }

  _cacheElements() {
    this.overlays.hero = document.querySelector('.overlay--hero');
    this.overlays.globe = document.querySelector('.overlay--globe');
    this.overlays.research = document.querySelector('.overlay--research');
    this.overlays.species = document.querySelector('.overlay--species');
    this.overlays.methodology = document.querySelector('.overlay--methodology');
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
   * Update overlay visibility based on scroll progress (0-1)
   */
  update(progress) {
    Object.entries(OVERLAY_RANGES).forEach(([key, range]) => {
      const el = this.overlays[key];
      if (!el) return;

      const opacity = this._getOpacity(progress, range);

      gsap.set(el, {
        opacity,
        visibility: opacity > 0.01 ? 'visible' : 'hidden',
        pointerEvents: opacity > 0.5 ? 'auto' : 'none',
      });
    });
  }
}
