import { gsap } from 'gsap';

/**
 * Immersive zoom-in transition for species cards
 * Creates a clone overlay that expands from card position to fill viewport
 */
export function animateCardZoom(cardEl) {
  return new Promise((resolve) => {
    const rect = cardEl.getBoundingClientRect();
    const clone = cardEl.cloneNode(true);
    const overlay = document.createElement('div');

    overlay.className = 'zoom-overlay';
    clone.className = 'zoom-clone';

    Object.assign(clone.style, {
      position: 'fixed',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      zIndex: '9999',
      borderRadius: '12px',
      pointerEvents: 'none',
    });

    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      background: 'rgba(250, 250, 248, 0)',
      backdropFilter: 'blur(0px)',
      zIndex: '9998',
      pointerEvents: 'none',
    });

    document.body.appendChild(overlay);
    document.body.appendChild(clone);

    const tl = gsap.timeline({
      onComplete: () => {
        clone.remove();
        overlay.remove();
        resolve();
      },
    });

    tl.to(overlay, {
      background: 'rgba(250, 250, 248, 0.8)',
      backdropFilter: 'blur(8px)',
      duration: 0.6,
      ease: 'power3.inOut',
    }, 0);

    tl.to(clone, {
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      width: '90vw',
      height: '60vh',
      borderRadius: '24px',
      opacity: 0,
      scale: 1.1,
      duration: 0.8,
      ease: 'power3.inOut',
    }, 0);
  });
}
