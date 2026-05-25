/*
  Salt Flat Exposure — Counter-test prototype to Sundarbans
  ----------------------------------------------------------
  M1 (acknowledgement) + M2 (bleach-out) + ONE of three experimental
  M3 strategies, selectable via URL hash:

    #horizon-pull            (default) — horizon line dissolves
    #atmospheric-recession              — distance markers thin
    #heat-distance                      — depth estimation destabilized
    #none                               — M1 + M2 only

  M4 and M5 are deliberately unimplemented. Audio, parallax, mineral
  glints, and shimmer-on-foreground are deliberately unimplemented.
  This file is a perception experiment, not a finished prototype.
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

/* ---------- M3 variants ---------- */

/*
  Each variant adds tweens to the existing timeline at `t0`. They are
  intentionally minimal (2–3 tweens each) and never add new layers or
  geometry. The grammar test is whether vantage shift on a flat plane
  can be carried by atmospheric or perceptual change alone.

  Total M3 duration is ~1.6s, slightly overlapping the tail of M2 (which
  ends near 1.7s). The overlap is required by the cinematic principle:
  movements bleed into each other so no boundary is perceptible.
*/

/** A — Horizon Pull. The horizon dissolves into ambiguous bright haze. */
function buildM3HorizonPull(tl, k, t0) {
  tl.to('.horizon-haze', {
      height: '24%',
      opacity: 0.85,
      duration: 1.60 * k,
      ease: 'sine.inOut'
    }, t0)
    .to('.distant-flat', {
      opacity: 0.42,
      filter: 'blur(2px) saturate(0.85)',
      duration: 1.60 * k,
      ease: 'sine.inOut'
    }, t0);
}

/** B — Atmospheric Recession. Distance markers thin; air takes over. */
function buildM3AtmosphericRecession(tl, k, t0) {
  tl.to('.distant-flat', {
      opacity: 0.32,
      filter: 'saturate(0.55) brightness(1.06)',
      duration: 1.60 * k,
      ease: 'sine.inOut'
    }, t0)
    .to('.near-flat', {
      filter: 'contrast(0.88) saturate(0.85)',
      duration: 1.60 * k,
      ease: 'sine.inOut'
    }, t0);
}

/** C — Heat-Distance Ambiguity. Depth estimation destabilized via wobble. */
function buildM3HeatDistance(tl, k, t0) {
  tl.to('.horizon-haze', {
      opacity: 0.78,
      filter: 'blur(3px)',
      duration: 1.40 * k,
      ease: 'sine.inOut'
    }, t0)
    .add(() => {
      // Subliminal non-repeating wobble — never aligns to perception.
      // Amplitude is intentionally tiny (~3px / ~2px). Larger amplitudes
      // cross from "heat shimmer" into "the screen is moving," which is
      // a software gesture, not an atmospheric one.
      gsap.to('.horizon-haze', {
        x: 'random(-3, 3)',
        duration: 'random(2.5, 4.5)',
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        repeatRefresh: true
      });
      gsap.to('.distant-flat', {
        x: 'random(-2, 2)',
        duration: 'random(3, 5)',
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        repeatRefresh: true
      });
    }, t0);
}

const M3_VARIANTS = {
  'horizon-pull': buildM3HorizonPull,
  'atmospheric-recession': buildM3AtmosphericRecession,
  'heat-distance': buildM3HeatDistance,
  'none': null
};

/** Read the URL hash and pick a variant. Default: horizon-pull. */
function selectVariant() {
  const raw = (window.location.hash || '').replace('#', '').toLowerCase().trim();
  if (raw && Object.prototype.hasOwnProperty.call(M3_VARIANTS, raw)) {
    return raw;
  }
  return 'horizon-pull';
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
