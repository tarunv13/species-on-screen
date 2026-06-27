/*
  East Pacific Rise vent field — canonical cinematic place page.
  ---------------------------------------------------------------
  Wired to the verified EcologicalNarrative record:
    cinematic-language/narratives/east-pacific-rise-tubeworm-chemosynthesis.ts

  Three fields only are extracted from the narrative (platform-architecture §5):
    place.name            → document <title>
    place.editorialPlaceLine → <meta name="description">
    editorial.fragment    → BEATS[6] inscription text (breathes at Settle)

  The interior journey (BEATS[1-5]) is hand-authored cinematic interior
  language, not derived from the schema. The framing beat (BEATS[0]) is
  also hand-authored — it announces the condition, not the place.

  Doctrine this surface answers to:
    · Article I  (Hold)   — held darkness before any heat arrives.
    · Article III(Descent)— the one sanctioned cut is at p≈0.48, hidden
                            in the luminance dip at maximum abyssal depth.
    · Article VI (Darkness is content) — ≥40% of pixels are near-black;
                            at EPR this is true by ecological fact, not palette.
    · Article XVII (Atmospheric hierarchy) — light (vent glow) arrives
                            before mass (plume columns), then place-specificity
                            (mineral sheen), then inhabitants (worms) last.
    · "settle is not a tween" — ambient motion (falling snow, plume wobble)
                            never resolves to zero.

  Nothing is named on the cinematic surface (platform-architecture §3, §5).
  No species, no depth, no coordinates, no counts, no sources.
*/

import { getNarrativeById } from '../../cinematic-language/narrative-registry.ts';
import { gsap } from 'gsap';
import './epr-vents.css';

/* ---------- Narrative registry (3 extractable fields only) ---------- */

const NARRATIVE = getNarrativeById('east-pacific-rise-tubeworm-chemosynthesis');
if (!NARRATIVE) {
  throw new Error(
    'Narrative not found: east-pacific-rise-tubeworm-chemosynthesis. ' +
    'Run `npm run check-narratives` to diagnose.'
  );
}

const PLACE_NAME = NARRATIVE.place.name;
const PLACE_LINE = NARRATIVE.place.editorialPlaceLine;
const FRAGMENT   = NARRATIVE.editorial.fragment;

/* ---------- Motion preference ---------- */

const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Biome palette ----------
   Abyssal: the deepest darkness in the Observatory. Where crossing.css
   uses --ink-deep (#05070d), this surface uses --ink-abyss (#02030a).
   The vent palette is the only warm register in the Observatory: orange
   heat, arterial red, mineral white, all isolated against absolute black. */
const PAL = {
  abyss:     [2,   3,   8  ],   // structural absence of light
  deepOcean: [5,  12,  22  ],   // deep column
  midWater:  [12,  30,  55  ],  // upper descent
  ventCore:  [255, 160,  45 ],  // vent thermal core
  ventGlow:  [200,  90,  15 ],  // vent heat ring
  plume:     [230, 225, 210 ],  // white smoker mineral
  sulfur:    [180, 165,  35 ],  // sulfide mineral tint
  wormPlume: [165,  40,  35 ],  // arterial red plume tip
  snow:      [170, 195, 215 ],  // marine snow (cold blue-white)
  bone:      [230, 222, 208 ],  // caption neutrals (matches CSS var)
};

const rgb        = (c, a)       => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const lerp       = (a, b, t)    => a + (b - a) * t;
const clamp      = (v, lo, hi)  => Math.max(lo, Math.min(hi, v));
const smoothstep = (e0, e1, x)  => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const lerpC      = (a, b, t)    => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/* ---------- Vent field geometry ----------
   Abstract world space: FIELD_W × FIELD_H. The vent field is clustered
   at the bottom of the world (y near FIELD_H). The camera descends from
   the upper-middle toward the vent field. Stylised coordinates — no real
   lat/long appears (platform-architecture §3).

   r      — thermal glow radius in world units
   plumeH — smoker plume height in world units
   intensity — drives glow brightness and worm density scaling */
const FIELD_W = 2000;
const FIELD_H = 1400;
const VENTS = [
  { x:  540, y: 1380, r: 160, plumeH: 440, intensity: 0.80 },
  { x: 1000, y: 1420, r: 200, plumeH: 500, intensity: 1.00 },
  { x: 1420, y: 1390, r: 130, plumeH: 380, intensity: 0.70 },
  { x:  750, y: 1490, r:  80, plumeH: 220, intensity: 0.45 },
];

/* ---------- Worm clusters (seeded once at load) ----------
   Each vent has a cluster of tubeworms. Seeded from Math.random() at
   module initialisation — positions are deterministic per session. */
function buildWormCluster(v) {
  const worms = [];
  const count = 10 + Math.floor(Math.random() * 12);
  for (let i = 0; i < count; i++) {
    const angle  = (Math.PI * i / count) + (Math.random() - 0.5) * 0.5;
    const spread = v.r * (0.12 + Math.random() * 0.60);
    worms.push({
      x:    v.x + Math.cos(angle) * spread * 0.75,
      y:    v.y + (Math.random() - 0.3) * 12,
      h:    45 + Math.random() * 120,
      w:    1.2 + Math.random() * 3.2,
      lean: (Math.random() - 0.5) * 0.10,
    });
  }
  return worms;
}
const WORM_CLUSTERS = VENTS.map(buildWormCluster);

/* ---------- Vent upwelling particles (seeded once at load) ---------- */
const VENT_PARTS = [];
(function seedVentParts() {
  for (const v of VENTS) {
    const n = REDUCE ? 6 : 28;
    for (let i = 0; i < n; i++) {
      VENT_PARTS.push({
        ventX:     v.x + (Math.random() - 0.5) * v.r * 0.5,
        ventY:     v.y,
        ventH:     v.plumeH * 0.65,
        r:         0.4 + Math.random() * 1.1,
        a:         0.35 + Math.random() * 0.45,
        speed:     0.00005 + Math.random() * 0.00010,
        phase:     Math.random(),
        intensity: v.intensity,
      });
    }
  }
})();

/* ---------- Canvas + camera ---------- */
const canvas = document.getElementById('epr-vents');
const ctx    = canvas.getContext('2d');
let W = 0, H = 0, DPR = 1, baseFit = 1;

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W   = window.innerWidth;
  H   = window.innerHeight;
  canvas.width  = Math.round(W * DPR);
  canvas.height = Math.round(H * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  baseFit = Math.min(W / FIELD_W, H / FIELD_H);
}
window.addEventListener('resize', resize);

/* The camera descends. Zoom increases as depth increases; the centre of
   view (cy) moves from upper-middle world space toward the vent field.
   ax/ay: the screen position that the camera centre maps to. */
function camera(p) {
  const zoom  = lerp(0.60, 2.20, smoothstep(0.20, 0.92, p));
  const scale = baseFit * zoom;
  const cy    = lerp(FIELD_H * 0.30, FIELD_H * 0.92, smoothstep(0.12, 0.90, p));
  return { scale, cx: FIELD_W / 2, cy, ax: W / 2, ay: H * 0.50 };
}

function project(cam, wx, wy) {
  return [
    (wx - cam.cx) * cam.scale + cam.ax,
    (wy - cam.cy) * cam.scale + cam.ay,
  ];
}

/* ---------- Marine snow (falls downward) ----------
   In the Crossing, motes drift upward (vy negative, surfacing bioluminescence).
   At EPR the particles are marine snow: organic detritus drifting down from the
   sunlit zone above. vy is positive (downward). */
const MOTES = [];
(function seedMotes() {
  const n = REDUCE ? 60 : 260;
  for (let i = 0; i < n; i++) {
    MOTES.push({
      x:  Math.random(),
      y:  Math.random(),
      r:  0.4 + Math.random() * 1.2,
      vx: (-0.2 + Math.random() * 0.4) * 0.000018,
      vy:  0.000025 + Math.random() * 0.000040,   // positive → falls down
      a:   0.04 + Math.random() * 0.12,
      ph:  Math.random() * Math.PI * 2,
    });
  }
})();

/* ---------- Editorial fragments ----------
   BEATS[6] derives from editorial.fragment (registry).
   BEATS[0–5] are hand-authored cinematic interior language describing
   the physical descent from the surface to the vent field.
   Nothing names the species or the geography. */
const BEATS = [
  { at: 0.00,  text: 'No light reaches the bottom of this.',         kind: 'framing' },
  { at: 0.17,  text: 'the water deepens without changing colour' },
  { at: 0.34,  text: 'one kilometre, then two, then silence' },
  { at: 0.52,  text: 'a warmth with no source above it' },
  { at: 0.68,  text: 'the rock is opening' },
  { at: 0.84,  text: 'red in the water where the plumes are' },
  { at: 0.955, text: FRAGMENT,                                        kind: 'inscription' },
];

const captionLayer = document.getElementById('captions');
const beginEl      = document.getElementById('begin');
BEATS.forEach((b) => {
  const el = document.createElement('p');
  el.className = 'caption' + (b.kind ? ` is-${b.kind}` : '');
  el.textContent = b.text;
  captionLayer.appendChild(el);
  b.el = el;
});

function beatOpacity(b, p, t) {
  if (b.kind === 'framing') {
    return (1 - smoothstep(0.05, 0.115, p)) * 0.95;
  }
  if (b.kind === 'inscription') {
    const inAmt  = smoothstep(b.at, b.at + 0.03, p);
    const breathe = REDUCE ? 0.42 : 0.40 + 0.10 * Math.sin(t * 0.0007);
    return inAmt * breathe;
  }
  const out     = b.at + 0.10;
  const fadeIn  = smoothstep(b.at, b.at + (REDUCE ? 0.012 : 0.03), p);
  const fadeOut = 1 - smoothstep(out - 0.035, out, p);
  return fadeIn * fadeOut * 0.82;
}

/* ---------- Scroll progress ---------- */
let rawP = 0, p = 0, started = false;
function readScroll() {
  const max = document.body.scrollHeight - window.innerHeight;
  rawP = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
  if (!started && rawP > 0.004) {
    started = true;
    gsap.to(beginEl, { opacity: 0, duration: 0.8, ease: 'power2.out' });
  }
}
window.addEventListener('scroll', readScroll, { passive: true });

/* ---------- Render ---------- */
let t0 = performance.now();
let amb = 0;

/* Depth gradient. The scene opens on dim surface-blue and descends to
   absolute abyss. As the vent field approaches (ventA), the bottom of
   the frame warms with vent heat before the glows themselves appear. */
function paintBase(progress, ventA) {
  const depth    = smoothstep(0, 0.38, progress);
  const topCol   = lerpC(PAL.midWater, PAL.abyss,     depth);
  const midCol   = lerpC(PAL.deepOcean, PAL.abyss,    depth);
  const botCol   = lerpC(PAL.abyss, PAL.ventGlow,     ventA * 0.40);

  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0,    rgb(topCol,        1));
  g.addColorStop(0.38, rgb(midCol,        1));
  g.addColorStop(0.68, rgb(PAL.abyss,     1));
  g.addColorStop(1,    rgb(botCol,        1));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

/* Soft orange radial glow at each vent opening. Light arrives before
   mass (Article XVII): these glows precede the plume columns. */
function paintThermalGlow(cam, ventA) {
  if (ventA <= 0.01) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const v of VENTS) {
    const [vx, vy] = project(cam, v.x, v.y);
    const r = v.r * cam.scale;
    const rg = ctx.createRadialGradient(vx, vy, 0, vx, vy, r);
    rg.addColorStop(0,    rgb(PAL.ventCore, 0.48 * v.intensity * ventA));
    rg.addColorStop(0.25, rgb(PAL.ventGlow, 0.22 * v.intensity * ventA));
    rg.addColorStop(0.70, rgb(PAL.ventGlow, 0.06 * v.intensity * ventA));
    rg.addColorStop(1,    rgb(PAL.abyss,    0));
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(vx, vy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/* Marine snow falling. Identical in structure to crossing.js MOTES but:
   vy is positive (downward) and the wrap point is y > 1.02 → reset to top. */
function paintMotes() {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const m of MOTES) {
    if (!REDUCE) {
      m.x += m.vx;
      m.y += m.vy;
      if (m.y > 1.02)  { m.y = -0.02; m.x = Math.random(); }
      if (m.x < -0.02) { m.x =  1.02; } else if (m.x > 1.02) { m.x = -0.02; }
    }
    const tw = REDUCE ? 1 : 0.6 + 0.4 * Math.sin(amb * 0.002 + m.ph);
    ctx.fillStyle = rgb(PAL.snow, m.a * tw);
    ctx.beginPath();
    ctx.arc(m.x * W, m.y * H, m.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/* White smoker plume columns, one per vent. Each plume is a curved wedge
   (narrow at source, wide at top) with a time-driven lateral wobble that
   simulates the current at depth. */
function paintPlumes(cam, ventA, time) {
  if (ventA <= 0.01) return;
  ctx.save();
  for (const v of VENTS) {
    const [bx, by] = project(cam, v.x, v.y);
    const pH = v.plumeH * cam.scale;
    const bW = 6  * cam.scale;
    const tW = 20 * cam.scale * v.intensity;
    const wob = REDUCE ? 0 : Math.sin(time * 0.0006 + v.x * 0.003) * 14 * cam.scale;
    const a   = ventA * v.intensity;

    const g = ctx.createLinearGradient(bx, by, bx + wob, by - pH);
    g.addColorStop(0,    rgb(PAL.plume,  0.66 * a));
    g.addColorStop(0.15, rgb(PAL.sulfur, 0.40 * a));
    g.addColorStop(0.55, rgb(PAL.plume,  0.14 * a));
    g.addColorStop(1,    rgb(PAL.plume,  0));

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(bx - bW, by);
    ctx.quadraticCurveTo(
      bx + wob * 0.4 - tW * 0.3, by - pH * 0.55,
      bx + wob - tW,              by - pH
    );
    ctx.lineTo(bx + wob + tW, by - pH);
    ctx.quadraticCurveTo(
      bx + wob * 0.4 + tW * 0.3, by - pH * 0.55,
      bx + bW, by
    );
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/* Tubeworm clusters. Inhabitants arrive last (Article XVII). Each worm
   is a dark tube with a soft red radial glow at the plume tip — the feather
   duster apparatus the worm extends into the vent current to absorb
   dissolved sulphide. */
function paintWorms(cam, wormA) {
  if (wormA <= 0.01) return;
  WORM_CLUSTERS.forEach((cluster, ci) => {
    const v = VENTS[ci];
    for (const worm of cluster) {
      const [bx, by] = project(cam, worm.x, worm.y);
      const tipX = bx + worm.lean * worm.h * cam.scale;
      const tipY = by - worm.h * cam.scale;
      const hw   = worm.w * cam.scale;

      ctx.fillStyle = rgb(PAL.abyss, wormA * 0.97);
      ctx.beginPath();
      ctx.moveTo(bx - hw, by);
      ctx.lineTo(bx + hw, by);
      ctx.lineTo(tipX + hw * 0.5, tipY);
      ctx.lineTo(tipX - hw * 0.5, tipY);
      ctx.closePath();
      ctx.fill();

      const tipR = hw * 5.5 * v.intensity;
      if (tipR < 0.3) continue;
      const rg = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, tipR);
      rg.addColorStop(0, rgb(PAL.wormPlume, wormA * 0.72 * v.intensity));
      rg.addColorStop(1, rgb(PAL.wormPlume, 0));
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(tipX, tipY, tipR, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

/* Upwelling vent particles (mineral-rich fluid, near-boiling). Ambient
   motion that never fully resolves — the settle is not a tween. */
function paintVentParticles(cam, ventA) {
  if (ventA <= 0.02) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const pt of VENT_PARTS) {
    const age   = (amb * pt.speed + pt.phase) % 1.0;
    const wy    = pt.ventY - age * pt.ventH;
    const [sx, sy] = project(cam, pt.ventX, wy);
    const alpha = (1 - age) * pt.a * ventA * pt.intensity;
    if (alpha <= 0.01) continue;
    ctx.fillStyle = rgb(PAL.ventCore, alpha);
    ctx.beginPath();
    ctx.arc(sx, sy, pt.r * cam.scale, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/* The Descent's one sanctioned cut (Article III): a luminance dip
   centred at p≈0.48 — the deepest point of total darkness, just before
   the first vent warmth seeps into the base gradient. */
function paintLuminanceDip(progress) {
  const dip = Math.exp(-((progress - 0.48) ** 2) / (2 * 0.13 ** 2)) * 0.82;
  if (dip <= 0.001) return;
  ctx.fillStyle = rgb(PAL.abyss, dip);
  ctx.fillRect(0, 0, W, H);
}

function render() {
  const cam   = camera(p);
  const ventA = smoothstep(0.55, 0.82, p);   // thermal glow, plumes, particles
  const wormA = smoothstep(0.73, 0.92, p);   // inhabitants arrive last

  ctx.clearRect(0, 0, W, H);
  paintBase(p, ventA);
  paintThermalGlow(cam, ventA);
  paintMotes();
  paintPlumes(cam, ventA, amb);
  paintWorms(cam, wormA);
  paintVentParticles(cam, ventA);
  paintLuminanceDip(p);
}

/* ---------- Frame loop ---------- */
function frame(now) {
  const dt = Math.min(now - t0, 50);
  t0 = now;
  if (!REDUCE) amb += dt;

  p += (rawP - p) * (REDUCE ? 0.30 : 0.085);

  render();

  for (const b of BEATS) {
    b.el.style.opacity = beatOpacity(b, p, amb).toFixed(3);
  }

  requestAnimationFrame(frame);
}

/* ---------- Boot ---------- */
function init() {
  resize();
  readScroll();

  document.title = `${PLACE_NAME} · Vent Field`;
  const desc = document.getElementById('docDesc');
  if (desc) desc.setAttribute('content', PLACE_LINE);

  gsap.fromTo(beginEl, { opacity: 0 }, {
    opacity:  REDUCE ? 0.5 : 0.45,
    duration: 1.4,
    delay:    REDUCE ? 0.3 : 2.4,
    ease:     'power2.out',
  });
  requestAnimationFrame((n) => { t0 = n; frame(n); });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
