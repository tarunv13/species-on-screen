/*
  Species art — high-end illustration system.
  -------------------------------------------
  A layered, shaded, animated canvas illustration per species, far richer
  than a flat silhouette: body volume (gradients), limb articulation,
  taxon-specific markings (tiger stripes vs jaguar rosettes), an eye
  glint, and movie-like idle motion. The drawn FORM is chosen from the
  species' REAL GBIF taxonomy (class / order / family) carried in the
  Darwin Core occurrence record — so adding a species needs no per-species
  code.

  Photoreal upgrade path ("exact of a real photograph, but not a
  photograph"): if an asset exists at public/art/<scientificName>.<ext>
  (png|webp|jpg|svg), it is drawn in place of the procedural illustration,
  with a soft ground shadow. Dropping a plate in upgrades the visual with
  zero code change. See public/art/STYLE-GUIDE.md.
*/

const EXTS = ['png', 'webp', 'jpg', 'svg'];
const slug = (sci) => sci.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/* ---------- drawing helpers ---------- */
const rgb = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const shade = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
function ellipse(ctx, x, y, rx, ry, rot) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot || 0, 0, 6.28); ctx.fill(); }
function line(ctx, x1, y1, x2, y2, w, col, a) { ctx.strokeStyle = rgb(col, a); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function bodyGrad(ctx, x, y, r, top, bot, a) {
  const g = ctx.createLinearGradient(x, y - r, x, y + r);
  g.addColorStop(0, rgb(top, a)); g.addColorStop(1, rgb(bot, a));
  return g;
}
function eye(ctx, x, y, r, a) {
  ctx.fillStyle = rgb([8, 10, 14], a); ellipse(ctx, x, y, r, r);
  ctx.fillStyle = rgb([255, 250, 235], a * 0.9); ellipse(ctx, x - r * 0.3, y - r * 0.3, r * 0.35, r * 0.35);
}

/* ---------- form: which illustration for this taxon ---------- */
export function formOf(a) {
  const k = (a.kingdom || '').toLowerCase();
  const cls = (a.class || '').toLowerCase();
  const ord = (a.order || '').toLowerCase();
  const fam = (a.family || '').toLowerCase();
  const role = a.role || '';
  if (k === 'plantae' || role === 'primary_producer') return 'tree';
  if (fam === 'apidae' || cls === 'insecta') return 'bee';
  if (cls === 'aves') return 'bird';
  if (cls === 'actinopterygii' || cls === 'teleostei') return 'fish';
  if (ord === 'decapoda' || cls === 'malacostraca') return 'crab';
  if (fam === 'iniidae' || ord === 'cetacea') return 'dolphin';
  if (fam === 'felidae') return 'bigcat';
  if (fam === 'cervidae') return 'deer';
  if (fam === 'mustelidae') return 'otter';
  if (fam === 'hominidae') return 'human';
  if (fam === 'psittacidae') return 'bird';
  if (cls === 'mammalia') return 'quadruped';
  return 'creature';
}

/* ---------- the forms ---------- */
const FORMS = {
  tree(ctx, x, y, s, col, a, t, ph) {
    const sway = Math.sin(t * 0.5 + ph) * 0.04;
    const trunk = shade(col, 0.5), leaf = col, leafDk = shade(col, 0.7);
    line(ctx, x, y, x, y - 30 * s, 5 * s, trunk, a);
    line(ctx, x, y - 4 * s, x - 11 * s, y, 2.4 * s, trunk, a);
    line(ctx, x, y - 4 * s, x + 11 * s, y, 2.4 * s, trunk, a);
    line(ctx, x, y - 10 * s, x - 16 * s, y, 1.8 * s, trunk, a * 0.8);
    line(ctx, x, y - 10 * s, x + 16 * s, y, 1.8 * s, trunk, a * 0.8);
    ctx.save(); ctx.translate(x, y - 34 * s); ctx.rotate(sway);
    ctx.fillStyle = rgb(leafDk, a); ellipse(ctx, 0, 4 * s, 22 * s, 15 * s);
    ctx.fillStyle = rgb(leaf, a); ellipse(ctx, -10 * s, -2 * s, 13 * s, 11 * s);
    ellipse(ctx, 12 * s, -1 * s, 13 * s, 11 * s);
    ctx.fillStyle = rgb(shade(col, 1.15), a * 0.8); ellipse(ctx, 0, -8 * s, 14 * s, 10 * s);
    ctx.restore();
  },
  bee(ctx, x, y, s, col, a, t, ph) {
    y += Math.sin(t * 3 + ph) * 4 * s;
    const flut = 0.4 + Math.abs(Math.sin(t * 24 + ph)) * 0.6;
    ctx.fillStyle = rgb([235, 240, 248], a * 0.5);
    ellipse(ctx, x - 2 * s, y - 3 * s, 4.5 * s, 2.4 * s * flut, -0.5);
    ellipse(ctx, x + 2 * s, y - 3 * s, 4.5 * s, 2.4 * s * flut, 0.5);
    ctx.fillStyle = rgb(col, a); ellipse(ctx, x, y, 5.5 * s, 3.6 * s);
    ctx.fillStyle = rgb(shade(col, 0.4), a); // stripes
    ctx.fillRect(x - 1.5 * s, y - 3 * s, 1.4 * s, 6 * s);
    ctx.fillRect(x + 1.5 * s, y - 3 * s, 1.4 * s, 6 * s);
  },
  bird(ctx, x, y, s, col, a, t, ph) {
    const wing = Math.sin(t * 2 + ph) * 0.3;
    ctx.fillStyle = bodyGrad(ctx, x, y - 5 * s, 9 * s, shade(col, 1.2), shade(col, 0.7), a);
    ellipse(ctx, x, y - 5 * s, 5.5 * s, 8 * s, -0.25);
    ctx.save(); ctx.translate(x + 1 * s, y - 6 * s); ctx.rotate(wing);
    ctx.fillStyle = rgb(shade(col, 0.8), a); ellipse(ctx, 2 * s, 0, 5 * s, 3 * s, 0.5); ctx.restore();
    ctx.fillStyle = rgb(shade(col, 1.15), a); ellipse(ctx, x - 3 * s, y - 13 * s, 3.6 * s, 3.4 * s);
    line(ctx, x - 6 * s, y - 13 * s, x - 12 * s, y - 12 * s, 1.8 * s, [40, 40, 46], a); // beak
    eye(ctx, x - 3.5 * s, y - 13.5 * s, 1.1 * s, a);
    line(ctx, x - 1 * s, y + 2 * s, x - 2 * s, y + 7 * s, 1.3 * s, shade(col, 0.5), a);
    line(ctx, x + 1 * s, y + 2 * s, x + 2 * s, y + 7 * s, 1.3 * s, shade(col, 0.5), a);
  },
  fish(ctx, x, y, s, col, a, t, ph) {
    const wig = Math.sin(t * 4 + ph) * 3 * s;
    ctx.fillStyle = bodyGrad(ctx, x, y, 5 * s, shade(col, 1.25), shade(col, 0.65), a);
    ellipse(ctx, x, y, 10 * s, 4.5 * s);
    ctx.fillStyle = rgb(shade(col, 0.7), a);
    ctx.beginPath(); ctx.moveTo(x + 8 * s, y); ctx.lineTo(x + 16 * s, y - 5 * s + wig); ctx.lineTo(x + 16 * s, y + 5 * s + wig); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - 1 * s, y - 3 * s); ctx.lineTo(x + 3 * s, y - 8 * s); ctx.lineTo(x + 5 * s, y - 3 * s); ctx.closePath(); ctx.fill(); // dorsal
    eye(ctx, x - 6 * s, y - 1 * s, 1.1 * s, a);
  },
  crab(ctx, x, y, s, col, a, t, ph) {
    const sw = Math.sin(t * 3 + ph) * 1.4 * s;
    const leg = shade(col, 0.7);
    for (let i = -1; i <= 1; i++) {
      line(ctx, x + i * 3 * s, y, x + i * 6 * s - 10 * s, y + 3 * s + sw, 1.6 * s, leg, a);
      line(ctx, x + i * 3 * s, y, x + i * 6 * s + 10 * s, y + 3 * s - sw, 1.6 * s, leg, a);
    }
    line(ctx, x - 7 * s, y - 1 * s, x - 13 * s, y - 6 * s, 2.6 * s, col, a);
    line(ctx, x + 7 * s, y - 1 * s, x + 13 * s, y - 6 * s, 2.6 * s, col, a);
    ctx.fillStyle = bodyGrad(ctx, x, y - 1 * s, 5 * s, shade(col, 1.2), shade(col, 0.7), a);
    ellipse(ctx, x, y - 1 * s, 8.5 * s, 5.5 * s);
    eye(ctx, x - 2.5 * s, y - 4 * s, 0.9 * s, a); eye(ctx, x + 2.5 * s, y - 4 * s, 0.9 * s, a);
  },
  dolphin(ctx, x, y, s, col, a, t, ph) {
    const arch = Math.sin(t * 1.4 + ph) * 2 * s;
    ctx.fillStyle = bodyGrad(ctx, x, y - arch, 7 * s, shade(col, 1.2), shade(col, 0.7), a);
    ctx.save(); ctx.translate(x, y - arch);
    ctx.beginPath(); ctx.moveTo(-14 * s, 0); ctx.quadraticCurveTo(-2 * s, -8 * s, 12 * s, -2 * s);
    ctx.quadraticCurveTo(16 * s, 2 * s, 12 * s, 4 * s); ctx.quadraticCurveTo(-2 * s, 2 * s, -14 * s, 3 * s); ctx.closePath(); ctx.fill();
    line(ctx, 12 * s, -2 * s, 19 * s, -4 * s, 2.4 * s, shade(col, 0.8), a); // long beak (river dolphin)
    ctx.fillStyle = rgb(shade(col, 0.7), a); ctx.beginPath(); ctx.moveTo(-2 * s, -4 * s); ctx.lineTo(2 * s, -10 * s); ctx.lineTo(4 * s, -3 * s); ctx.closePath(); ctx.fill();
    eye(ctx, 8 * s, -1 * s, 1 * s, a); ctx.restore();
  },
  bigcat(ctx, x, y, s, col, a, t, ph, actor) {
    quadrupedBody(ctx, x, y, s, col, a, t, ph, { body: 30, h: 11, leg: 13, ears: true, tail: true, neck: 5 });
    // markings by genus
    const sci = (actor && actor.sci || '').toLowerCase();
    ctx.save(); ctx.globalAlpha = a;
    if (/panthera tigris/.test(sci)) {
      ctx.strokeStyle = rgb(shade(col, 0.45), a); ctx.lineWidth = 1.4 * s;
      for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(x + i * 4 * s, y - 16 * s); ctx.lineTo(x + i * 4 * s + 2 * s, y - 6 * s); ctx.stroke(); }
    } else if (/panthera onca|leopard|pardus/.test(sci)) {
      ctx.fillStyle = rgb(shade(col, 0.5), a);
      for (let i = 0; i < 7; i++) { const rx = x - 12 * s + (i % 4) * 8 * s, ry = y - 16 * s + Math.floor(i / 4) * 6 * s; ellipse(ctx, rx, ry, 1.8 * s, 1.4 * s); }
    } else if (/prionailurus/.test(sci)) {
      ctx.fillStyle = rgb(shade(col, 0.55), a);
      for (let i = 0; i < 6; i++) ellipse(ctx, x - 10 * s + i * 4 * s, y - 13 * s, 1 * s, 1 * s);
    }
    ctx.restore();
  },
  deer(ctx, x, y, s, col, a, t, ph, actor) {
    quadrupedBody(ctx, x, y, s * 0.95, col, a, t, ph, { body: 24, h: 9, leg: 15, antlers: true, neck: 8 });
    if (/axis/.test((actor && actor.sci || '').toLowerCase())) {
      ctx.fillStyle = rgb([245, 245, 235], a * 0.55);
      for (let i = 0; i < 6; i++) ellipse(ctx, x - 8 * s + (i % 3) * 7 * s, y - 13 * s + Math.floor(i / 3) * 5 * s, 0.9 * s, 0.9 * s);
    }
  },
  otter(ctx, x, y, s, col, a, t, ph) {
    const w = Math.sin(t * 2 + ph) * 2 * s;
    ctx.fillStyle = bodyGrad(ctx, x, y - 6 * s, 7 * s, shade(col, 1.15), shade(col, 0.7), a);
    ellipse(ctx, x, y - 5 * s, 13 * s, 5.5 * s, -0.15);
    line(ctx, x + 11 * s, y - 5 * s, x + 20 * s, y - 2 * s + w, 3 * s, shade(col, 0.8), a); // tail
    ctx.fillStyle = rgb(shade(col, 1.15), a); ellipse(ctx, x - 11 * s, y - 9 * s, 4.5 * s, 4 * s);
    line(ctx, x - 6 * s, y - 1 * s, x - 7 * s, y + 5 * s, 2 * s, shade(col, 0.6), a);
    line(ctx, x + 4 * s, y - 1 * s, x + 4 * s, y + 5 * s, 2 * s, shade(col, 0.6), a);
    eye(ctx, x - 12 * s, y - 10 * s, 1 * s, a);
  },
  human(ctx, x, y, s, col, a, t, ph) {
    const bob = Math.sin(t * 0.9 + ph) * 1.5 * s;
    line(ctx, x - 19 * s, y, x + 19 * s, y, 3 * s, shade(col, 0.6), a); // canoe
    ctx.strokeStyle = rgb(shade(col, 0.6), a); ctx.lineWidth = 3 * s; ctx.beginPath();
    ctx.moveTo(x - 19 * s, y); ctx.quadraticCurveTo(x, y + 9 * s, x + 19 * s, y); ctx.stroke();
    const fy = y - 4 * s + bob;
    line(ctx, x, fy, x, fy - 12 * s, 3.4 * s, col, a);
    ctx.fillStyle = rgb(shade(col, 1.1), a); ellipse(ctx, x, fy - 16 * s, 3.6 * s, 3.6 * s);
    line(ctx, x, fy - 9 * s, x + 10 * s, fy - 15 * s, 2 * s, col, a); // pole
  },
  quadruped(ctx, x, y, s, col, a, t, ph) { quadrupedBody(ctx, x, y, s, col, a, t, ph, { body: 26, h: 10, leg: 12, ears: true, tail: true, neck: 6 }); },
  creature(ctx, x, y, s, col, a, t, ph) {
    ctx.fillStyle = bodyGrad(ctx, x, y, 7 * s, shade(col, 1.2), shade(col, 0.7), a);
    ellipse(ctx, x, y - 4 * s, 9 * s, 6 * s);
    eye(ctx, x - 4 * s, y - 5 * s, 1.1 * s, a);
  },
};

/* shared shaded quadruped */
function quadrupedBody(ctx, x, y, s, col, a, t, ph, o) {
  const bw = o.body * s, bh = o.h * s, leg = o.leg * s;
  const sw = Math.sin(t * 2 + ph) * 2 * s;
  const legCol = shade(col, 0.6), bodyTop = shade(col, 1.18), bodyBot = shade(col, 0.62);
  line(ctx, x - bw * 0.32, y - bh, x - bw * 0.32 + sw, y + leg - bh, 2.6 * s, legCol, a);
  line(ctx, x + bw * 0.30, y - bh, x + bw * 0.30 - sw, y + leg - bh, 2.6 * s, legCol, a);
  line(ctx, x - bw * 0.18, y - bh, x - bw * 0.18 - sw, y + leg - bh, 2.6 * s, legCol, a);
  line(ctx, x + bw * 0.16, y - bh, x + bw * 0.16 + sw, y + leg - bh, 2.6 * s, legCol, a);
  ctx.fillStyle = bodyGrad(ctx, x, y - bh, bh + 2, bodyTop, bodyBot, a);
  ellipse(ctx, x, y - bh, bw * 0.5, bh);
  const hx = x - bw * 0.5, hy = y - bh - (o.neck || 6) * s;
  line(ctx, x - bw * 0.36, y - bh, hx, hy, 3.2 * s, col, a);
  ctx.fillStyle = rgb(bodyTop, a); ellipse(ctx, hx - 2 * s, hy, 5.2 * s, 4.2 * s);
  if (o.ears) { line(ctx, hx - 1 * s, hy - 3 * s, hx - 2 * s, hy - 7 * s, 2.2 * s, col, a); line(ctx, hx - 4 * s, hy - 3 * s, hx - 5 * s, hy - 7 * s, 2.2 * s, col, a); }
  if (o.antlers) { line(ctx, hx - 2 * s, hy - 3 * s, hx - 5 * s, hy - 13 * s, 1.6 * s, shade(col, 0.8), a); line(ctx, hx, hy - 3 * s, hx + 1 * s, hy - 14 * s, 1.6 * s, shade(col, 0.8), a); }
  if (o.tail) { const ty = y - bh - Math.sin(t * 2 + ph) * 3 * s; line(ctx, x + bw * 0.46, y - bh, x + bw * 0.64, ty - 6 * s, 2.4 * s, shade(col, 0.7), a); }
  eye(ctx, hx - 3.5 * s, hy - 0.5 * s, 1.1 * s, a);
}

/* ---------- factory: asset-aware draw ---------- */
export function makeSpeciesArt(base) {
  const BASE = base || '/';
  const cache = new Map(); // sci -> { img, ok } | null(loading) | false(none)

  function tryLoad(sci) {
    cache.set(sci, null);
    let i = 0;
    const attempt = () => {
      if (i >= EXTS.length) { cache.set(sci, false); return; }
      const img = new Image();
      img.onload = () => cache.set(sci, { img, ok: true });
      img.onerror = () => { i++; attempt(); };
      img.src = `${BASE}art/${slug(sci)}.${EXTS[i]}`;
    };
    attempt();
  }

  function draw(ctx, actor, x, y, scale, col, alpha, t, ph) {
    const sci = actor.sci;
    if (!cache.has(sci)) tryLoad(sci);
    const entry = cache.get(sci);
    if (entry && entry.ok) {
      const img = entry.img;
      const w = 64 * scale, h = w * (img.naturalHeight / img.naturalWidth || 1);
      // soft ground shadow
      ctx.save(); ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(4,8,12,0.35)'; ctx.beginPath(); ctx.ellipse(x, y + 2, w * 0.34, h * 0.08, 0, 0, 6.28); ctx.fill();
      const bob = Math.sin(t * 0.8 + ph) * 2 * scale;
      ctx.drawImage(img, x - w / 2, y - h + 6 * scale + bob, w, h);
      ctx.restore();
      return;
    }
    // procedural illustration (baseline)
    const form = formOf(actor);
    (FORMS[form] || FORMS.creature)(ctx, x, y, scale, col, alpha, t, ph, actor);
  }

  return { draw, formOf };
}
