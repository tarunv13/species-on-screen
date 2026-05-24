import { gsap } from 'gsap';

/**
 * 3D Hover Effect Module
 * Applies perspective tilt on mousemove for elements with class .hover-3d
 */

const MAX_ROTATION = 8; // degrees

/**
 * Initialize 3D hover effect on all .hover-3d elements
 */
export function init3DHover() {
  const elements = document.querySelectorAll('.hover-3d');

  elements.forEach((el) => {
    const content = el.querySelector('.hover-3d__content');

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Normalize to -1 to 1
      const normalizedX = (x / rect.width) * 2 - 1;
      const normalizedY = (y / rect.height) * 2 - 1;

      // Calculate rotation (inverted for natural feel)
      const rotateX = -normalizedY * MAX_ROTATION;
      const rotateY = normalizedX * MAX_ROTATION;

      gsap.to(el, {
        rotateX: rotateX,
        rotateY: rotateY,
        scale: 1.02,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      // Opposing parallax on inner content
      if (content) {
        gsap.to(content, {
          x: normalizedX * 4,
          y: normalizedY * 4,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto',
      });

      if (content) {
        gsap.to(content, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)',
          overwrite: 'auto',
        });
      }
    });
  });
}
