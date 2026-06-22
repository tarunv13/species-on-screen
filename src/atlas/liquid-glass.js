/*
  Liquid Glass — pointer-lensing controller.
  ------------------------------------------
  Drives the traveling key light (--lg-px / --lg-py) and the micro-tilt
  (--lg-rx / --lg-ry) on `.glass` surfaces. Companion to liquid-glass.css.

  Behaviour:
    · Ambient — a slow sine drift of the key-light position, written once
      per frame onto the root (#atlas). All `.glass` children inherit it,
      so the light breathes across every panel without per-element work.
    · Pointer — while a `.glass` element is hovered, its key light eases
      toward the pointer (inline override of the inherited ambient), and
      tilt tiers (`.glass--card`) lean a capped ≤3° toward the cursor.
      On leave, the inline overrides are eased out and cleared, returning
      the panel to the ambient drift.

  Discipline: tilt ≤ 3°, no scale here (hover scale lives in CSS, ≤1.04).
  No-op under prefers-reduced-motion and on coarse / no-hover pointers —
  the visual stays calm and the controller never touches the DOM.

  Pure DOM + rAF; no dependencies. Reversible: delete this file and the
  initLiquidGlass() call in atlas.js.
*/

const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const COARSE = window.matchMedia('(hover: none), (pointer: coarse)').matches;

const TILT_SELECTOR = '.glass--card';
const MAX_TILT = 3;      // degrees
const EASE = 0.12;       // per-frame approach to target

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/**
 * Start the Liquid Glass controller.
 * @param {HTMLElement} [root] the surface whose `.glass` children animate
 *   (defaults to #atlas). Ambient light position is written here.
 */
export function initLiquidGlass(root = document.getElementById('atlas')) {
  if (!root) return;

  // On reduced-motion or touch we leave the static CSS defaults in place.
  const ambient = !REDUCE && !COARSE;
  const interactive = !COARSE;

  let active = null;   // currently hovered .glass element
  let tiltEl = null;   // active element, if it is a tilt tier

  const cur = { px: 0.5, py: 0.32, rx: 0, ry: 0 };
  const tgt = { px: 0.5, py: 0.32, rx: 0, ry: 0 };

  // The ambient drift is slow (period ~30–50s); updating it every frame
  // would repaint every backdrop-filtered panel 60×/s for no perceptible
  // gain. Throttle to ~12fps. Pointer easing still runs every frame, but
  // only while a panel is actually hovered.
  const AMBIENT_INTERVAL = 80; // ms
  let lastAmbient = 0;
  let lastAx = -1;

  function clearEl(el) {
    el.style.removeProperty('--lg-px');
    el.style.removeProperty('--lg-py');
    el.style.removeProperty('--lg-rx');
    el.style.removeProperty('--lg-ry');
  }

  function setActive(el) {
    if (el === active) return;
    if (active) clearEl(active);
    active = el;
    tiltEl = el && el.matches(TILT_SELECTOR) ? el : null;
    // Seed the eased state from the inherited ambient so it doesn't jump.
    if (!el) { tgt.px = 0.5; tgt.py = 0.32; tgt.rx = 0; tgt.ry = 0; }
  }

  function onMove(e) {
    const el = e.target.closest ? e.target.closest('.glass') : null;
    setActive(el);
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const px = clamp((e.clientX - r.left) / r.width, 0, 1);
    const py = clamp((e.clientY - r.top) / r.height, 0, 1);
    tgt.px = px;
    tgt.py = py;
    if (tiltEl) {
      tgt.ry = (px - 0.5) * 2 * MAX_TILT;   // cursor right → lean right
      tgt.rx = -(py - 0.5) * 2 * MAX_TILT;  // cursor down  → lean back
    } else {
      tgt.rx = 0;
      tgt.ry = 0;
    }
  }

  function onLeaveSurface() {
    if (active) clearEl(active);
    active = null;
    tiltEl = null;
    tgt.px = 0.5; tgt.py = 0.32; tgt.rx = 0; tgt.ry = 0;
  }

  if (interactive) {
    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerleave', onLeaveSurface, { passive: true });
  }

  function frame(now) {
    // Pointer easing — only meaningful while a panel is hovered.
    if (active) {
      cur.px += (tgt.px - cur.px) * EASE;
      cur.py += (tgt.py - cur.py) * EASE;
      cur.rx += (tgt.rx - cur.rx) * EASE;
      cur.ry += (tgt.ry - cur.ry) * EASE;
      active.style.setProperty('--lg-px', cur.px.toFixed(3));
      active.style.setProperty('--lg-py', cur.py.toFixed(3));
      if (tiltEl) {
        tiltEl.style.setProperty('--lg-rx', cur.rx.toFixed(2) + 'deg');
        tiltEl.style.setProperty('--lg-ry', cur.ry.toFixed(2) + 'deg');
      }
    }

    // Ambient drift — throttled; skip writes when the value barely moved.
    if (ambient && now - lastAmbient >= AMBIENT_INTERVAL) {
      lastAmbient = now;
      const ax = 0.5 + 0.30 * Math.sin(now * 0.00018);
      const ay = 0.34 + 0.16 * Math.sin(now * 0.00012 + 1.3);
      if (Math.abs(ax - lastAx) > 0.002) {
        lastAx = ax;
        root.style.setProperty('--lg-px', ax.toFixed(3));
        root.style.setProperty('--lg-py', ay.toFixed(3));
      }
    }

    requestAnimationFrame(frame);
  }

  // Only spin the loop if there's something to animate.
  if (ambient || interactive) requestAnimationFrame(frame);
}
