/**
 * Single source of truth for prefers-reduced-motion. Each call queries
 * the OS-level media query fresh, so a mid-session toggle takes effect
 * on the next decision without requiring a reload.
 *
 * matchMedia is cheap (modern browsers cache the resolved value
 * internally), so calling this in per-frame update loops is fine.
 *
 * Defensive fallback returns false in environments without window or
 * matchMedia (SSR, exotic embeddings) so callers never receive a
 * surprise truthy value.
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
