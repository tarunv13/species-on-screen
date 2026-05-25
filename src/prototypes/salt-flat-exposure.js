/*
  Salt Flat Exposure — Counter-test prototype to Sundarbans
  ----------------------------------------------------------
  M1 (acknowledgement) + M2 (bleach-out) + a converged M3 grammar:
  atmospheric recession with a small horizon-edge softening borrowed
  from the earlier horizon-pull experiment.

    (default)   — converged hybrid plays after M2
    #none       — M1 + M2 only (control)

  Three earlier M3 candidates (horizon-pull, atmospheric-recession,
  heat-distance) were evaluated as standalones. The first two are
  collapsed into the single grammar below; heat-distance is deferred
  pending SVG-turbulence substrate work.

  M4 and M5 are deliberately unimplemented. Audio, parallax, mineral
  glints, and shimmer-on-foreground are deliberately unimplemented.
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

/* ---------- M3: converged grammar ---------- */

/**
 * Converged M3 — atmospheric recession with horizon-edge softening.
 *
 * Primary mechanism (atmospheric recession): distant-flat fades toward
 * sky-color and desaturates; near-flat loses local contrast. The eye
 * registers depth thinning beyond a point it cannot reach. No motion.
 *
 * Borrowed minimum from horizon-pull: a 1.2px blur on distant-flat
 * softens its top edge — which IS the horizon line. The horizon loses
 * fixed identity not because we added haze on top of it (that was
 * horizon-pull's dishonest, additive move), but because we removed
 * contrast at the boundary. Subtractive grammar, not additive. The
 * .horizon-haze layer is left untouched.
 *
 * Heat-distance ambiguity is intentionally absent. Wobble via
 * x-translate is too fake; honest implementation requires SVG
 * <feTurbulence> + <feDisplacementMap>, which is a substrate
 * escalation outside surgical scope. This M3 is production-viable
 * without it.
 */
function buildM3Recession(tl, k, t0) {
  tl.to('.distant-flat', {
      opacity: 0.32,
      filter: 'saturate(0.55) brightness(1.06) blur(1.2px)',
      duration: 1.60 * k,
      ease: 'sine.inOut'
    }, t0)
    .to('.near-flat', {
      filter: 'contrast(0.88) saturate(0.85)',
      duration: 1.60 * k,
      ease: 'sine.inOut'
    }, t0);
}

const M3_VARIANTS = {
  'recession': buildM3Recession,
  'none': null
};

/**
 * Read the URL hash. The converged grammar plays by default; only
 * `#none` is honored as a debug-control to skip M3 entirely.
 */
function selectVariant() {
  const raw = (window.location.hash || '').replace('#', '').toLowerCase().trim();
  if (raw === 'none') return 'none';
  return 'recession';
}

/* ---------- M1 + M2 + (selected M3) timeline ---------- */

function buildDescent(variant) {
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

  /* ----- Movement 3 — selected variant (1.50 – 3.10s) ----- */
  const builder = M3_VARIANTS[variant];
  if (builder) {
    builder(tl, k, 1.50 * k);
  }

  // M4 + M5 not implemented in this build.
  return tl;
}

/* ---------- Wiring ---------- */

function init() {
  paintCracks();

  const variant = selectVariant();
  // Expose for review/inspection. Nothing in the page reads this.
  document.body.dataset.m3 = variant;

  revealThreshold();
  const descent = buildDescent(variant);

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
    descent.play(0);
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
