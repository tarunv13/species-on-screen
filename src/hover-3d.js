import { gsap } from 'gsap';

/**
 * 3D Hover Effect Module
 * Applies perspective tilt on mousemove for elements with class .hover-3d
 */

const MAX_ROTATION = 8; // degrees
const _initializedElements = new WeakSet();
const _listeners = new WeakMap();

/**
 * Destroy all 3D hover listeners on previously initialized elements
 */
export function destroy3DHover() {
  const elements = document.querySelectorAll('.hover-3d');
  elements.forEach((el) => {
    const handlers = _listeners.get(el);
    if (handlers) {
      el.removeEventListener('mousemove', handlers.mousemove);
      el.removeEventListener('mouseleave', handlers.mouseleave);
      _listeners.delete(el);
    }
    _initializedElements.delete(el);
  });
}

/**
 * Initialize 3D hover effect on all .hover-3d elements
 */
export function init3DHover() {
  const elements = document.querySelectorAll('.hover-3d');

  elements.forEach((el) => {
    // Skip if already initialized
    if (_initializedElements.has(el)) return;

    const content = el.querySelector('.hover-3d__content');

    const onMouseMove = (e) => {
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
    };

    const onMouseLeave = () => {
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
    };

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);

    _listeners.set(el, { mousemove: onMouseMove, mouseleave: onMouseLeave });
    _initializedElements.add(el);
  });
}
