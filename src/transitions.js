import { gsap } from 'gsap';

/**
 * Animate transition into species safari view
 */
export function animateToSafari(safariContainer, returnBtn) {
  return new Promise((resolve) => {
    if (safariContainer) {
      safariContainer.classList.add('active');
    }
    if (returnBtn) {
      returnBtn.style.display = 'block';
    }
    gsap.fromTo(safariContainer, { opacity: 0 }, {
      opacity: 1, duration: 0.5, ease: 'power2.inOut', onComplete: resolve,
    });
  });
}

/**
 * Animate transition back to globe view
 */
export function animateToGlobe(safariContainer, returnBtn) {
  return new Promise((resolve) => {
    gsap.to(safariContainer, {
      opacity: 0, duration: 0.4, ease: 'power2.inOut',
      onComplete: () => {
        safariContainer.classList.remove('active');
        if (returnBtn) returnBtn.style.display = 'none';
        resolve();
      },
    });
  });
}
