/*
  The Crossing — canonical cinematic place page (places/crossing.html).
  -----------------------------------------------------------------------
  Wired to the verified EcologicalNarrative record:
    cinematic-language/narratives/coral-triangle-hawksbill-natal-homing.ts

  Three fields only are extracted from the narrative (platform-architecture §5):
    place.name            → document <title>
    place.editorialPlaceLine → <meta name="description">
    editorial.fragment    → BEATS[6] inscription text (breathes at Settle)

  The interior journey (BEATS[1-5]) is hand-authored cinematic language,
  not derived from the schema. The framing beat (BEATS[0]) is also
  hand-authored — it describes the journey, not the place.

  Doctrine this surface answers to:
    · Article I  (Hold)   — held darkness at the threshold and between beats.
    · Article II (Drift)  — the camera leaves the origin along a single arc.
    · Article III(Descent)— the Crossing's one sanctioned cut is hidden
                            inside a luminance dip at open ocean.
    · Article IV (Reveal) — the natal shore reveals toward rest (decel only).
    · Article VI (Darkness is content) — ≥40% of the frame is near-black.
    · Article XVII (Atmospheric hierarchy) — light, then mass (shore), then
                            place-specificity (surf), then the inhabitant
                            (a track in the sand) last.
    · "settle is not a tween" — ambient motion never resolves to zero.

  Nothing is named on the cinematic surface (platform-architecture §3, §5).
  No species, no place name, no coordinates, no counts, no sources.
*/

import { getNarrativeById } from '../../cinematic-language/narrative-registry.ts';
import { gsap } from 'gsap';
import './crossing.css';

/* ---------- Narrative registry (3 extractable fields only) ---------- */

const NARRATIVE = getNarrativeById('coral-triangle-hawksbill-natal-homing');
if (!NARRATIVE) {
  throw new Error(
    'Narrative not found: coral-triangle-hawksbill-natal-homing. ' +
    'Run `npm run check-narratives` to diagnose.'
  );
}

const PLACE_NAME = NARRATIVE.place.name;
const PLACE_LINE = NARRATIVE.place.editorialPlaceLine;
const FRAGMENT   = NARRATIVE.editorial.fragment;

/* ---------- Motion preference ---------- */

const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Biome palette ----------
   Cool, oceanic, near-black. Grounded in the Coral Triangle's
   open-water register. Biome-specific; stays in this file and CSS. */
const PAL = {
  abyss:      [4, 7, 13],      // deepest held darkness
  deepWater:  [10, 20, 36],    // #0a1424
  midWater:   [20, 60, 92],    // mid ocean, darkened
  route:      [150, 214, 230], // luminous bioluminescent teal-white
  routeCore:  [224, 244, 248],
  shore:      [196, 188, 170], // pale sand in low pre-dawn light
  preDawn:    [30, 34, 40],    // faint warmth lent to the water at arrival
};
const rgb = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const smoothstep = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
const lerpC = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/* ---------- The route ----------
   Abstract world space (FIELD_W × FIELD_H). Origin reef at the lower
   left; the bow of an open-ocean crossing; the natal shore upper right.
   Stylised coordinates — the cinematic surface carries no real lat/long
   (platform-architecture §3). */
const FIELD_W = 2000;
const FIELD_H = 1400;
const ROUTE = [
  { x: 250,  y: 1185 },  // origin reef
  { x: 470,  y: 1025 },
  { x: 700,  y: 965 },
  { x: 945,  y: 845 },
  { x: 1130, y: 640 },
  { x: 1188, y: 432 },   // apex of the open crossing
  { x: 1372, y: 366 },
  { x: 1612, y: 332 },
  { x: 1786, y: 252 },   // natal shore
];

const SHORE = ROUTE[ROUTE.length - 1];

/* ---------- Catmull-Rom spline with an arc-length LUT ----------
   pointAtU(u): even-speed position along the whole route for u in [0,1].
   The LUT depends only on ROUTE, so it is built once. */
function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}
const _samples = [];
let _totalLen = 0;
(function buildLUT() {
  const pts = ROUTE;
  const SEG = 90;
  let prev = null;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || pts[i + 1];
    for (let j = 0; j < SEG; j++) {
      const t = j / SEG;
      const x = catmull(p0.x, p1.x, p2.x, p3.x, t);
      const y = catmull(p0.y, p1.y, p2.y, p3.y, t);
      if (prev) _totalLen += Math.hypot(x - prev.x, y - prev.y);
      _samples.push({ x, y, d: _totalLen });
      prev = { x, y };
    }
  }
})();
function pointAtU(u) {
  const target = clamp(u, 0, 1) * _totalLen;
  let lo = 0, hi = _samples.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (_samples[mid].d < target) lo = mid + 1; else hi = mid;
  }
  const b = _samples[lo];
  const a = _samples[lo - 1] || b;
  const span = b.d - a.d || 1;
  const f = (target - a.d) / span;
  return { x: lerp(a.x, b.x, f), y: lerp(a.y, b.y, f) };
}

/* ---------- Canvas + camera ---------- */
const canvas = document.getElementById('crossing');
const ctx = canvas.getContext('2d');
let W = 0, H = 0, DPR = 1, baseFit = 1;

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.round(W * DPR);
  canvas.height = Math.round(H * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  baseFit = Math.min(W / FIELD_W, H / FIELD_H);
}
window.addEventListener('resize', resize);

function camera(p) {
  const follow = smoothstep(0.10, 0.42, p);
  const zoom = lerp(0.94, 3.1, smoothstep(0.08, 0.94, p));
  const scale = baseFit * zoom;
  const head = pointAtU(p);
  const cx = lerp(FIELD_W / 2, head.x, follow);
  const cy = lerp(FIELD_H / 2, head.y, follow);
  const ax = lerp(W / 2, W * 0.52, follow);
  // ay lerps from 50% (screen-centre) to 60% as follow engages, framing
  // the subject lower to leave room above for sky/horizon. Reviewed
  // (WP7): deliberate per-scene framing, not unreconciled drift — differs
  // from East Pacific Rise's fixed 50% centre-hold by design.
  const ay = lerp(H / 2, H * 0.60, follow);
  return { scale, cx, cy, ax, ay };
}
function project(cam, wx, wy) {
  return [(wx - cam.cx) * cam.scale + cam.ax, (wy - cam.cy) * cam.scale + cam.ay];
}

/* ---------- Ambient particulate (marine snow) ---------- */
const MOTES = [];
(function seedMotes() {
  const n = REDUCE ? 70 : 300;
  for (let i = 0; i < n; i++) {
    MOTES.push({
      x: Math.random(), y: Math.random(),
      r: 0.4 + Math.random() * 1.3,
      vx: (-0.2 + Math.random() * 0.4) * 0.00002,
      vy: -0.00003 - Math.random() * 0.00004,
      a: 0.05 + Math.random() * 0.14,
      ph: Math.random() * Math.PI * 2,
    });
  }
})();

/* ---------- Editorial fragments ----------
   BEATS[6] inscription derives from editorial.fragment (registry).
   All other beats are hand-authored cinematic interior language.
   Nothing here names the animal or the shore (platform-architecture §5). */
const BEATS = [
  { at: 0.00, text: 'A crossing begins where the water deepens.', kind: 'framing' },
  { at: 0.17, text: 'the reef falls away behind' },
  { at: 0.37, text: 'open water in every direction' },
  { at: 0.52, text: 'no shore, no star — only a pull in the dark' },
  { at: 0.71, text: 'the water begins to remember a shape' },
  { at: 0.86, text: 'the same sand, a lifetime later' },
  { at: 0.955, text: FRAGMENT, kind: 'inscription' },
];

const captionLayer = document.getElementById('captions');
const beginEl = document.getElementById('begin');
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
    const inAmt = smoothstep(b.at, b.at + 0.03, p);
    const breathe = REDUCE ? 0.42 : 0.40 + 0.10 * Math.sin(t * 0.0007);
    return inAmt * breathe;
  }
  const out = b.at + 0.10;
  const fadeIn = smoothstep(b.at, b.at + (REDUCE ? 0.012 : 0.03), p);
  const fadeOut = 1 - smoothstep(out - 0.035, out, p);
  return fadeIn * fadeOut * 0.82;
}

/* ---------- Scroll progress (smoothed: "a scroll is a slow push") ---------- */
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

function paintBase(progress, beachP) {
  const top = lerpC(PAL.deepWater, PAL.preDawn, beachP * 0.5);
  const bot = lerpC(PAL.abyss, PAL.abyss, 0);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, rgb(lerpC(PAL.abyss, top, 0.7), 1));
  g.addColorStop(0.55, rgb(lerpC(PAL.abyss, PAL.deepWater, 0.45), 1));
  g.addColorStop(1, rgb(bot, 1));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const glowY = lerp(H * 0.34, H * 0.2, beachP);
  const breathe = REDUCE ? 0.5 : 0.5 + 0.5 * Math.sin(amb * 0.0004);
  const rg = ctx.createRadialGradient(W * 0.56, glowY, 0, W * 0.56, glowY, H * 0.9);
  rg.addColorStop(0, rgb(PAL.midWater, 0.10 + 0.05 * breathe));
  rg.addColorStop(1, rgb(PAL.midWater, 0));
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, W, H);
}

function paintShore(cam, beachP) {
  if (beachP <= 0) return;
  const [sx, sy] = project(cam, SHORE.x, SHORE.y);
  const R = (120 + 360 * beachP) * Math.max(cam.scale / baseFit, 0.5);
  const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, R);
  sg.addColorStop(0, rgb(PAL.shore, 0.30 * beachP));
  sg.addColorStop(0.5, rgb(PAL.shore, 0.10 * beachP));
  sg.addColorStop(1, rgb(PAL.shore, 0));
  ctx.fillStyle = sg;
  ctx.beginPath();
  ctx.arc(sx, sy, R, 0, Math.PI * 2);
  ctx.fill();

  const surfP = smoothstep(0.78, 0.95, lastP);
  if (surfP > 0) {
    ctx.save();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = rgb(PAL.routeCore, 0.5 * surfP);
    ctx.shadowColor = rgb(PAL.route, 0.6 * surfP);
    ctx.shadowBlur = 16;
    ctx.beginPath();
    const span = R * 1.2;
    for (let i = 0; i <= 40; i++) {
      const f = i / 40;
      const x = sx - span / 2 + f * span;
      const wob = REDUCE ? 0 : Math.sin(f * 9 + amb * 0.002) * 5;
      const y = sy + 40 + wob;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  const trackP = smoothstep(0.93, 1.0, lastP);
  if (trackP > 0) {
    ctx.save();
    ctx.strokeStyle = rgb(PAL.preDawn, 0);
    ctx.fillStyle = rgb([12, 16, 22], 0.45 * trackP);
    for (let i = 0; i < 5; i++) {
      const tx = sx - 18 + i * 9;
      const ty = sy + 18 + i * 14;
      ctx.beginPath();
      ctx.ellipse(tx, ty, 5, 2.4, -0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function paintRoute(cam, progress) {
  const N = 240;
  const upto = Math.max(1, Math.floor(N * progress));
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  for (let i = 0; i <= upto; i++) {
    const u = (i / N);
    const wp = pointAtU(u);
    const [x, y] = project(cam, wp.x, wp.y);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = rgb(PAL.route, 0.10);
  ctx.lineWidth = 10;
  ctx.shadowColor = rgb(PAL.route, 0.5);
  ctx.shadowBlur = 22;
  ctx.stroke();

  ctx.strokeStyle = rgb(PAL.routeCore, 0.7);
  ctx.lineWidth = 1.8;
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.restore();

  const reef = pointAtU(0);
  const [rx, ry] = project(cam, reef.x, reef.y);
  const reefA = (1 - smoothstep(0.04, 0.26, progress)) * 0.9;
  if (reefA > 0.01) glint(rx, ry, 26, PAL.route, reefA * 0.5, PAL.routeCore, reefA);

  const head = pointAtU(progress);
  const [hx, hy] = project(cam, head.x, head.y);
  const pulse = REDUCE ? 1 : 0.82 + 0.18 * Math.sin(amb * 0.003);
  const headA = (0.55 + 0.35 * smoothstep(0.82, 1.0, progress)) * pulse;
  glint(hx, hy, 22, PAL.route, headA * 0.4, PAL.routeCore, headA);
}

function glint(x, y, r, soft, softA, core, coreA) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgb(core, coreA));
  g.addColorStop(0.3, rgb(soft, softA));
  g.addColorStop(1, rgb(soft, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function paintMotes() {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const m of MOTES) {
    if (!REDUCE) {
      m.x += m.vx; m.y += m.vy;
      if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); }
      if (m.x < -0.02) m.x = 1.02; else if (m.x > 1.02) m.x = -0.02;
    }
    const tw = REDUCE ? 1 : 0.6 + 0.4 * Math.sin(amb * 0.002 + m.ph);
    ctx.fillStyle = rgb(PAL.route, m.a * tw);
    ctx.beginPath();
    ctx.arc(m.x * W, m.y * H, m.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function paintLuminanceDip(progress) {
  // The Descent's one sanctioned cut, hidden in a luminance dip (Article III).
  const dip = Math.exp(-((progress - 0.5) ** 2) / (2 * 0.13 ** 2)) * 0.80;
  if (dip <= 0.001) return;
  ctx.fillStyle = rgb(PAL.abyss, dip);
  ctx.fillRect(0, 0, W, H);
}

let lastP = 0;
function render() {
  const cam = camera(p);
  const beachP = smoothstep(0.66, 0.97, p);
  lastP = p;

  ctx.clearRect(0, 0, W, H);
  paintBase(p, beachP);
  paintShore(cam, beachP);
  paintRoute(cam, p);
  paintMotes();
  paintLuminanceDip(p);
}

/* ---------- Frame loop ---------- */
let rafId = 0;
let resumeTimer = 0;
let running = true;

function frame(now) {
  const dt = Math.min(now - t0, 50);
  t0 = now;
  if (!REDUCE) amb += dt;

  p += (rawP - p) * (REDUCE ? 0.30 : 0.085);

  render();

  for (const b of BEATS) {
    b.el.style.opacity = beatOpacity(b, p, amb).toFixed(3);
  }

  rafId = requestAnimationFrame(frame);
}

/* Principle XVII: the render loop pauses when the tab is not visible — a
   backgrounded tab does not animate or schedule work. Resumption is itself
   a ~400ms Hold before motion resumes, so returning to the tab never catches
   the scene mid-motion; t0 is reset so the ambient clock does not jump. */
function stopLoop() {
  running = false;
  if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  if (resumeTimer) { clearTimeout(resumeTimer); resumeTimer = 0; }
}
function startLoop() {
  if (running) return;
  running = true;
  if (resumeTimer) clearTimeout(resumeTimer);
  resumeTimer = setTimeout(() => {
    resumeTimer = 0;
    t0 = performance.now();
    rafId = requestAnimationFrame(frame);
  }, REDUCE ? 0 : 400);
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') startLoop(); else stopLoop();
});

/* ---------- Boot ---------- */
function init() {
  resize();
  readScroll();

  // Wire narrative metadata to the page.
  document.title = `${PLACE_NAME} · Crossing`;
  const desc = document.getElementById('docDesc');
  if (desc) desc.setAttribute('content', PLACE_LINE);

  gsap.fromTo(beginEl, { opacity: 0 }, {
    opacity: REDUCE ? 0.5 : 0.45,
    duration: 1.4,
    delay: REDUCE ? 0.3 : 2.4,
    ease: 'power2.out',
  });
  requestAnimationFrame((n) => { t0 = n; frame(n); });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
