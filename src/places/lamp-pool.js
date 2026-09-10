/*
  Lamp-pool light direction — Sprint V1.3, Part B.
  Transcribed verbatim from the design artifact "The Light of the Observation"
  (three-state reference render). Darkness is the SURROUND; the subject (the
  plate) is LIT by the light the record was made under. This drifting lamp pool
  REPLACES the flat plate veil — a redistribution of darkness, never a
  brightening.

  ORDER MATTERS — exact sequence from the reference (do not reorder):
    1. plate (drawn by the caller, cover-fit)
    2. cool grade      — multiply (surface water: rgba(150,185,205); EPR: warm)
    3. drifting lamp centre (incommensurable periods)
    4. water only: caustics + beam scatter   ('lighter', BEFORE the vignette)
    5. lamp-pool vignette                      ('source-over') — replaces the veil
    6. water only... marine snow               ('lighter', AFTER; lit in-beam only)

  TIME BASE: `t` is in SECONDS (drift periods ~45-65 s). The canvas scenes clock
  `amb` in MILLISECONDS, so the caller passes `amb / 1000`.

  DARKNESS — the 0.62 equal-mean-alpha constraint is RETIRED (V1.3 ruling): the
  three-state render is authoritative, not a mean-coverage number, and it
  integrates to ~0.516 at 16:9 by design (surround darker than a flat veil, a
  small pool brighter). Article VI is "nothing shouts," a peak/edge property,
  so the gate is now two bounds, evaluated AT REST (static mean lamp centre):
      corner alpha >= 0.94   (nothing shouts at the edges)
      centre alpha <= 0.10   (the plate genuinely reads as lit)
  Verified at the static centre for both lamp widths (crossing 0.49, EPR 0.30):
  corner >= 0.95, centre 0.05. The drift-time dip toward ~0.88 as the pool
  moves toward a corner is the effect working, not a violation (bound is
  at-rest). Portrait 9:16 (0.936) is not a target aspect. The area-weighted-mean
  integrator that surfaced the original discrepancy is kept below as a dev
  utility (`_meanAlpha`), no longer gating.

  ASPECT STABILITY (V1.3): radii are DIAGONAL-relative so the pool shape holds
  across aspects. r_outer = lampFactor*hypot(w,h); at lampFactor 0.49 that is
  0.562w at 16:9 (vs the reference 0.56w, identical within 0.5% — the approved
  frame preserved). Beam scatter and the marine-snow lit falloff share one
  radius (0.749*r_outer) so beam, scatter and lit-particle test stay coincident
  and scale with a narrower lamp.

  Per-place use (V1.3; do not homogenise):
    - crossing/coral-triangle : water=true,  snow=110, grade=true,               lampFactor=0.49
    - epr-vents               : water=false, snow=240, grade='rgba(200,205,210,1)', lampFactor=0.30
      (2550 m: no water column shifting colour, so the grade is a neutral
       desaturation, NOT a blue cast; the vent glow stays warm, drawn over.)
*/

const TAU = Math.PI * 2;
const LAMP_STOP_66 = 0.72;   // reference value — retained (0.62 gate retired)
const DEFAULT_LAMP_FACTOR = 0.49;
const BEAM_OVER_LAMP = 0.367 / 0.49;   // 0.749 — reference beam/lamp radius ratio
const COOL_GRADE = 'rgba(150,185,205,1)';

/* Marine snow, seeded once (re-seeded if the count changes). */
let SNOW = null;
function seedSnow(n) {
  const a = [];
  for (let i = 0; i < n; i++) {
    a.push({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.9 + 0.5,      // radius px
      s: Math.random() * 0.055 + 0.012,  // fall speed
      d: Math.random() * TAU,            // sway phase
      o: Math.random() * 0.5 + 0.25,     // base opacity
    });
  }
  return a;
}

/* 2 — grade: multiply a wash over the plate (darkens + tints). Cool for
   surface water, neutral desaturation for the deep vent lamp. */
function grade(ctx, w, h, color) {
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/* 4a — caustics (surface-lit places only): 7 wavy 'lighter' ribbons. */
function caustics(ctx, w, h, t) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 7; i++) {
    const yy = h * (0.12 + i * 0.13) + Math.sin(t * 0.5 + i) * 10;
    const alpha = 0.055 + 0.03 * Math.sin(t * 0.8 + i * 1.7);
    const g = ctx.createLinearGradient(0, yy - 26, 0, yy + 26);
    g.addColorStop(0, 'rgba(120,175,195,0)');
    g.addColorStop(0.5, `rgba(140,195,215,${alpha})`);
    g.addColorStop(1, 'rgba(120,175,195,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 16) {           // outbound (top) edge
      const yo = Math.sin(x * 0.006 + t * 0.7 + i) * 9
               + Math.sin(x * 0.017 - t * 0.45 + i) * 5;
      const y = yy + yo - 26;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    for (let x = w; x >= 0; x -= 16) {            // return (bottom) edge
      const yo = Math.sin(x * 0.006 + t * 0.7 + i) * 9
               + Math.sin(x * 0.017 - t * 0.45 + i) * 5;
      ctx.lineTo(x, yy + yo + 26);
    }
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/* 4b — beam scatter (no hard cone edges): a soft 'lighter' radial bloom. */
function beamScatter(ctx, w, h, cx, cy, beamR) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const b = ctx.createRadialGradient(cx, cy, 0, cx, cy, beamR);
  b.addColorStop(0.00, 'rgba(190,225,240,0.10)');
  b.addColorStop(0.45, 'rgba(150,200,220,0.045)');
  b.addColorStop(1.00, 'rgba(120,170,195,0)');
  ctx.fillStyle = b;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/* 5 — the lamp pool (replaces the flat veil). Diagonal-relative radius. */
function lampPool(ctx, w, h, cx, cy, R) {
  const rInner = R * (0.045 / 0.56);   // preserve the reference inner/outer ratio
  const g = ctx.createRadialGradient(cx, cy, rInner, cx, cy, R);
  g.addColorStop(0.00, 'rgba(3,7,10,0.05)');
  g.addColorStop(0.34, 'rgba(3,7,10,0.30)');
  g.addColorStop(0.66, `rgba(3,7,10,${LAMP_STOP_66})`);
  g.addColorStop(1.00, 'rgba(2,5,7,0.955)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

/* 6 — marine snow, lit ONLY inside the beam (the whole trick). */
function marineSnow(ctx, w, h, t, cx, cy, count, beamR) {
  if (!SNOW || SNOW.length !== count) SNOW = seedSnow(count);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const p of SNOW) {
    const py = (((p.y + t * p.s * 0.06) % 1.08) - 0.04) * h;
    const px = (p.x * w + Math.sin(t * 0.5 + p.d) * 11 + w) % w;
    const dist = Math.hypot(px - cx, py - cy) / beamR;
    const lit = Math.max(0, 1 - dist * dist);
    if (lit <= 0.02) continue;                       // invisible outside the beam
    ctx.fillStyle = `rgba(215,238,248,${p.o * lit * 0.85})`;
    const radius = p.r * (0.7 + lit * 0.7);
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Apply the lamp-pool light direction over an already-drawn plate.
 * The caller draws the plate (step 1), then calls this.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {{w:number,h:number,t:number,water:boolean,snow:number,
 *          grade:(boolean|string),lampFactor?:number}} o
 *   t          — SECONDS (caller passes amb/1000)
 *   water      — true only for surface-lit places (caustics + beam scatter)
 *   snow       — marine-snow particle count (0 = none)
 *   grade      — true = cool water grade; a CSS colour string = that multiply
 *                colour (e.g. 'rgba(200,205,210,1)' for the deep vent lamp);
 *                false/undefined = no grade
 *   lampFactor — outer-radius factor (default 0.49; 0.30 = hard narrow lamp)
 */
export function applyLampPool(ctx, o) {
  const { w, h, t } = o;
  const R = (o.lampFactor || DEFAULT_LAMP_FACTOR) * Math.hypot(w, h);
  const beamR = R * BEAM_OVER_LAMP;                              // coincident beam + snow
  const gradeColor = o.grade === true ? COOL_GRADE : (typeof o.grade === 'string' ? o.grade : null);
  if (gradeColor) grade(ctx, w, h, gradeColor);                 // 2
  const cx = w * (0.5 + Math.sin(t * 0.13) * 0.045);            // 3
  const cy = h * (0.47 + Math.cos(t * 0.097) * 0.035);
  if (o.water) { caustics(ctx, w, h, t); beamScatter(ctx, w, h, cx, cy, beamR); }  // 4
  lampPool(ctx, w, h, cx, cy, R);                               // 5
  if (o.snow) marineSnow(ctx, w, h, t, cx, cy, o.snow, beamR);  // 6
}

/* Dev utility (not gating). Area-weighted mean alpha of the vignette over a
   w×h frame at the mean lamp centre, for a given lampFactor. Article VI is
   bounded by corner/centre alpha (see header), not by this mean. */
export function _meanAlpha(w, h, lampFactor = DEFAULT_LAMP_FACTOR) {
  const R = lampFactor * Math.hypot(w, h), rInner = R * (0.045 / 0.56);
  const stops = [[0, 0.05], [0.34, 0.30], [0.66, LAMP_STOP_66], [1, 0.955]];
  const a = (off) => {
    if (off <= 0) return stops[0][1];
    if (off >= 1) return stops[3][1];
    for (let i = 0; i < 3; i++) { const [o0, a0] = stops[i], [o1, a1] = stops[i + 1]; if (off <= o1) return a0 + (a1 - a0) * (off - o0) / (o1 - o0); }
    return stops[3][1];
  };
  const cx = 0.5 * w, cy = 0.47 * h; let sum = 0, n = 0;
  for (let iy = 0; iy < 240; iy++) for (let ix = 0; ix < 240; ix++) {
    const x = (ix + 0.5) / 240 * w, y = (iy + 0.5) / 240 * h;
    sum += a(Math.min(1, Math.max(0, (Math.hypot(x - cx, y - cy) - rInner) / (R - rInner)))); n++;
  }
  return sum / n;
}
