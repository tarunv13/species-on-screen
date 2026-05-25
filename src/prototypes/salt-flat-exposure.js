/*
  Salt Flat Exposure — Counter-test prototype to Sundarbans
  ----------------------------------------------------------
  M1 (acknowledgement) + M2 (bleach-out) only. The remaining movements
  are not built. The point of this prototype is to test whether the
  UI-burial grammar holds when its agent is glare instead of mist.

  No audio, no parallax, no heat shimmer animation, no descent past M2.
  Procedural salt cracks are minimal — enough to make the foreground
  read as salt crust rather than featureless tan.
*/

import { gsap } from 'gsap';
import './salt-flat-exposure.css';

/* ---------- Procedural SVG: salt crack pattern ---------- */

/**
 * Generate a sparse network of salt cracks across the foreground.
 * Points are distributed with depth-biased density (more in the near
 * foreground, fewer toward the horizon). Cracks are short line segments
 * connecting nearby points within a depth-scaled distance threshold.
 *
 * The algorithm is O(n²) but `count` is small (<200), so this is fine.
 */
function buildSaltCracks(width, height, count) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    // Bias toward bottom of frame: foreground has more cracks.
    const r = Math.random();
    const y = height * (0.05 + (r * r) * 0.95);
    const depth = y / height; // 0 = far, 1 = near
    points.push([x, y, depth]);
  }

  let out = '';
  for (let i = 0; i < points.length; i++) {
    const [x1, y1, d1] = points[i];
    for (let j = i + 1; j < points.length; j++) {
      const [x2, y2, d2] = points[j];
      const avgDepth = (d1 + d2) / 2;
      const maxDist = 30 + avgDepth * 90; // longer cracks near foreground
      const dx = x2 - x1, dy = y2 - y1;
      const dist2 = dx * dx + dy * dy;
      if (dist2 > maxDist * maxDist) continue;
      const sw = 0.4 + avgDepth * 1.6;
      const op = 0.15 + avgDepth * 0.45;
      out += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke-width="${sw.toFixed(2)}" stroke-opacity="${op.toFixed(2)}"/>`;
    }
  }
  return out;
}

function paintCracks() {
  const group = document.getElementById('cracks-group');
  if (!group) return;
  group.innerHTML = buildSaltCracks(1600, 600, 140);
}

/* ---------- Threshold reveal (page load) ---------- */

/*
  Same pacing as Sundarbans threshold reveal — the grammar test is in M2,
  not in the threshold reveal. Comparable timing keeps variables controlled.
*/
function revealThreshold() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return gsap.timeline()
    .set('.framing-question .line', { opacity: 0, y: 8 })
    .set('#framingQuestion', { opacity: 1 })
    .to('.framing-question .line', {
      opacity: 1,
      y: 0,
      duration: reduce ? 0.6 : 1.6,
      stagger: reduce ? 0.2 : 0.7,
      ease: 'sine.out',
      delay: reduce ? 0.2 : 0.9
    })
    .to('#lenses', {
      opacity: 1,
      duration: reduce ? 0.5 : 1.2,
      ease: 'sine.out'
    }, '-=0.3');
}

/* ---------- M1 + M2 timeline ---------- */

/*
  M1 — Acknowledgement (0.00 – 0.45s)
    Identical structure to Sundarbans. The click is internal to the
    threshold; no environmental mutation is needed at this stage. The
    grammar of acknowledgement is medium-independent.

  M2 — Surrender of Frame, mutated (0.30 – 1.70s)
    Mist → glare. Mechanism inverted but grammar preserved: an
    environmental layer (z-index 7) covers the threshold UI (z-index 6).
    The system does NOT tween frame-content opacity. The glare layer's
    own opacity and scale tween are what occludes the typography. UI
    burial via light, not via fog.

    Sky and ground filters brighten subtly during M2 to support the
    bleach — the world becomes too bright to read text in. This is the
    inverse of Sundarbans M2's `brightness(0.82)` darkening.
*/
function buildDescentM1M2() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const k = reduce ? 0.45 : 1.0;

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'sine.inOut' } });

  /* ----- Movement 1 — Acknowledgement (0.00 – 0.45s) ----- */
  tl.to('.lens--quiet', {
      opacity: 0,
      yPercent: 6,
      filter: 'blur(2px)',
      duration: 0.45 * k,
      ease: 'power2.out'
    }, 0)
    .to('#lensHabitat', {
      scale: 0.97,
      duration: 0.18 * k,
      ease: 'power2.out',
      transformOrigin: '50% 50%'
    }, 0)
    .to('#lensHabitat', {
      scale: 1.0,
      duration: 0.28 * k,
      ease: 'power2.inOut'
    }, 0.18 * k)
    .to('#framingQuestion', {
      opacity: 0.42,
      duration: 0.4 * k,
      ease: 'sine.out'
    }, 0.05 * k);

  /* ----- Movement 2 — Surrender of Frame via Glare (0.30 – 1.70s) ----- */
  // The glare overlay rises in opacity and expands outward from the horizon.
  // At end of M2 the inner bright zone of the radial gradient has scaled
  // beyond the viewport, so the entire frame is bleached and the UI below
  // is fully occluded.
  tl.to('.glare-overlay', {
      opacity: 1,
      scale: 1.4,
      duration: 1.40 * k,
      ease: 'sine.inOut'
    }, 0.30 * k)
    // Sky and grounds brighten to support the bleach. Subtle: the goal is
    // for glare to do the visible work; the filter shifts add light to the
    // air, not to the foreground.
    .to('.sky', {
      filter: 'brightness(1.18) saturate(0.92)',
      duration: 1.20 * k,
      ease: 'sine.inOut'
    }, 0.40 * k)
    .to('.distant-flat', {
      filter: 'brightness(1.12)',
      duration: 1.20 * k,
      ease: 'sine.inOut'
    }, 0.40 * k)
    .to('.near-flat', {
      filter: 'brightness(1.08)',
      duration: 1.20 * k,
      ease: 'sine.inOut'
    }, 0.40 * k);

  // M3-M5 not implemented in this build.
  return tl;
}

/* ---------- Wiring ---------- */

function init() {
  paintCracks();

  revealThreshold();
  const m1m2 = buildDescentM1M2();

  const lensHabitat = document.getElementById('lensHabitat');
  if (!lensHabitat) return;

  let started = false;
  const begin = (ev) => {
    if (started) return;
    started = true;
    if (ev) ev.preventDefault();
    document.querySelectorAll('.lens').forEach(b => {
      b.setAttribute('disabled', 'true');
      b.setAttribute('aria-disabled', 'true');
    });
    m1m2.play(0);
  };

  lensHabitat.addEventListener('click', begin);
  lensHabitat.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') begin(e);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
