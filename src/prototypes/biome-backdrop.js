/*
  Biome backdrop — high-fidelity, painterly landscape engine (shared).
  --------------------------------------------------------------------
  A real-landscape feel from procedural painting, not flat silhouettes:
  each depth plane is built from hundreds of light-and-shadow foliage
  strokes (the "depth of strokes" of a landscape painter), with aerial
  perspective (planes pale and soften toward the back), depth-of-field
  blur, water reflections, a low sun and atmospheric haze, and film
  grain. Planes are PRE-BAKED to offscreen canvases once per size, then
  composited each frame with parallax + live water ripples — so the
  detail is high but the per-frame cost is a few drawImage calls.

  Backdrops are diagnostic of their landscape CLASSIFICATION (mangrove
  vs várzea vs reef vs savanna), so each place reads as itself.

  Photoreal upgrade path: if a plate exists at
  public/art/backdrops/<biome>.<png|webp|jpg>, it is used as the scene
  base in place of the painted planes (parallaxed) — drop a real
  landscape image in and the scene becomes photographic, no code change.

  Shared by the field record and the living-place surface so both
  carry one art direction.
*/

const rgb = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a == null ? 1 : a})`;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const jit = (c, n) => [c[0] + (Math.random() - 0.5) * n, c[1] + (Math.random() - 0.5) * n, c[2] + (Math.random() - 0.5) * n];

/* 1-D value noise for organic silhouettes (seeded, smooth). */
function makeNoise(n, seed) {
  const a = [];
  let s = seed || 1;
  for (let i = 0; i < n; i++) { s = (s * 9301 + 49297) % 233280; a.push(s / 233280); }
  return (x) => {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    return lerp(a[((i % n) + n) % n], a[(((i + 1) % n) + n) % n], u);
  };
}

/* ---------- biome recipes (palettes + plane bands + signature) ---------- */
const RECIPES = {
  mangrove: {
    sky: { top: [150, 192, 216], hor: [210, 226, 220], sun: [248, 246, 230], sunX: 0.82 },
    bands: [
      { y0: 0.40, y1: 0.60, light: [196, 214, 192], shadow: [150, 178, 150], density: 520, r: 13, par: 0.10, blur: 5 },
      { y0: 0.50, y1: 0.74, light: [150, 184, 138], shadow: [96, 132, 96], density: 760, r: 12, par: 0.22, blur: 2 },
      { y0: 0.60, y1: 0.86, light: [110, 152, 102], shadow: [56, 92, 62], density: 980, r: 11, par: 0.40, blur: 0 },
    ],
    water: { y: 0.80, col: [150, 186, 184] }, signature: 'pneumatophores', fore: [44, 64, 48],
  },
  varzea: {
    sky: { top: [150, 196, 212], hor: [216, 228, 224], sun: [250, 248, 232], sunX: 0.20 },
    bands: [
      { y0: 0.36, y1: 0.56, light: [188, 206, 186], shadow: [146, 172, 144], density: 520, r: 13, par: 0.10, blur: 5 },
      { y0: 0.46, y1: 0.66, light: [132, 168, 118], shadow: [80, 116, 80], density: 820, r: 12, par: 0.24, blur: 1 },
    ],
    water: { y: 0.66, col: [150, 184, 182] }, signature: 'emergents', fore: [47, 64, 48],
  },
  reef: {
    sky: { top: [90, 150, 176], hor: [120, 176, 190], sun: [200, 230, 232], sunX: 0.7 },
    bands: [
      { y0: 0.30, y1: 0.62, light: [150, 198, 204], shadow: [86, 150, 168], density: 420, r: 16, par: 0.12, blur: 7 },
      { y0: 0.50, y1: 0.92, light: [110, 170, 180], shadow: [54, 116, 140], density: 700, r: 14, par: 0.30, blur: 1 },
    ],
    water: { y: 0.0, col: [96, 158, 176] }, signature: 'coral', fore: [40, 90, 104],
  },
  savanna: {
    sky: { top: [176, 200, 214], hor: [232, 220, 188], sun: [252, 244, 214], sunX: 0.8 },
    bands: [
      { y0: 0.52, y1: 0.64, light: [206, 200, 152], shadow: [176, 168, 116], density: 380, r: 12, par: 0.10, blur: 4 },
      { y0: 0.60, y1: 0.78, light: [190, 178, 120], shadow: [150, 138, 84], density: 620, r: 11, par: 0.26, blur: 0 },
    ],
    water: { y: 0.90, col: [188, 196, 166] }, signature: 'grass', fore: [96, 84, 44],
  },
  default: {
    sky: { top: [156, 196, 214], hor: [218, 228, 220], sun: [248, 246, 230], sunX: 0.78 },
    bands: [
      { y0: 0.42, y1: 0.62, light: [192, 212, 188], shadow: [146, 176, 144], density: 520, r: 13, par: 0.10, blur: 5 },
      { y0: 0.52, y1: 0.76, light: [140, 176, 130], shadow: [88, 124, 90], density: 800, r: 12, par: 0.24, blur: 2 },
      { y0: 0.62, y1: 0.88, light: [100, 144, 98], shadow: [54, 92, 62], density: 980, r: 11, par: 0.40, blur: 0 },
    ],
    water: { y: 0.80, col: [168, 198, 196] }, signature: 'reeds', fore: [46, 66, 48],
  },
};

function keyFor(typeStr) {
  const tp = (typeStr || '').toLowerCase();
  if (/mangrove/.test(tp)) return 'mangrove';
  if (/flood|v[áa]rzea/.test(tp)) return 'varzea';
  if (/reef|coral|marine/.test(tp)) return 'reef';
  if (/savanna|grass/.test(tp)) return 'savanna';
  return 'default';
}

/* ---------- foliage painter (the depth of strokes) ---------- */
function paintFoliage(c, W, H, band, sunX) {
  const topN = makeNoise(40, Math.floor(Math.random() * 9999) + 1);
  const lumpN = makeNoise(120, Math.floor(Math.random() * 9999) + 1);
  const y0 = H * band.y0, y1 = H * band.y1;
  for (let i = 0; i < band.density; i++) {
    const x = Math.random() * (W + 80) - 40;
    const top = y0 + (topN(x * 0.012) - 0.5) * (y1 - y0) * 0.5 + lumpN(x * 0.05) * (y1 - y0) * 0.3;
    const y = top + Math.random() * (y1 - top);
    if (y > y1) continue;
    const tnorm = clamp((y - top) / ((y1 - top) || 1), 0, 1);
    // lit toward canopy top + toward the sun side; shadowed lower
    const sunBias = 1 - Math.abs(x / W - sunX) * 0.5;
    const col = jit(mix(band.light, band.shadow, clamp(tnorm * 0.9 + (1 - sunBias) * 0.3, 0, 1)), 14);
    const r = band.r * (0.6 + Math.random() * 0.9);
    c.globalAlpha = 0.45 + Math.random() * 0.4;
    c.fillStyle = rgb(col);
    c.beginPath(); c.arc(x, y, r, 0, 6.28); c.fill();
  }
  c.globalAlpha = 1;
}

/* ---------- signature foreground ---------- */
function paintSignature(c, W, H, rec) {
  const wy = H * rec.water.y, fore = rec.fore;
  c.lineCap = 'round';
  if (rec.signature === 'pneumatophores') {
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * W; const h = 12 + Math.random() * 34; const w = 1.4 + Math.random() * 3;
      const col = jit(mix(fore, [90, 110, 86], Math.random() * 0.4), 12);
      c.strokeStyle = rgb([col[0] * 0.5, col[1] * 0.5, col[2] * 0.5], 0.3); c.lineWidth = w; // cast shadow
      c.beginPath(); c.moveTo(x + 4, H - 3); c.lineTo(x + 10, H - 3); c.stroke();
      c.strokeStyle = rgb(col); c.lineWidth = w;
      c.beginPath(); c.moveTo(x, H - 2); c.lineTo(x + Math.sin(i) * 2, H - 2 - h); c.stroke();
      c.fillStyle = rgb(jit(mix(col, [200, 210, 180], 0.4), 8)); c.beginPath(); c.arc(x + Math.sin(i) * 2, H - 2 - h, w * 0.7, 0, 6.28); c.fill();
    }
  } else if (rec.signature === 'emergents') {
    [[0.22, 0], [0.55, 1], [0.82, 2]].forEach(([tx, i]) => {
      const x = tx * W, top = H * 0.26;
      c.strokeStyle = rgb(jit([104, 86, 64], 10)); c.lineWidth = 9 - i * 1.6;
      c.beginPath(); c.moveTo(x, wy + 24); c.lineTo(x, top); c.stroke();
      for (let b = 0; b < 5; b++) { const by = top + 20 + b * 26; c.lineWidth = 3; c.beginPath(); c.moveTo(x, by); c.lineTo(x + (b % 2 ? 26 : -26), by - 14); c.stroke(); }
      const crown = { light: [128, 162, 104], shadow: [70, 104, 70], y0: (top - 30) / H, y1: (top + 28) / H, r: 9, density: 240 };
      c.save(); c.translate(x - 0.5 * 90, 0); paintFoliage(c, 180, H, crown, 0.5); c.restore();
    });
  } else if (rec.signature === 'grass') {
    for (let i = 0; i < 220; i++) { const x = Math.random() * W; const h = 14 + Math.random() * 30; c.strokeStyle = rgb(jit(mix(fore, [150, 140, 80], Math.random()), 14)); c.lineWidth = 1 + Math.random() * 1.6; c.beginPath(); c.moveTo(x, H - 2); c.lineTo(x + (Math.random() - 0.5) * 10, H - 2 - h); c.stroke(); }
  } else if (rec.signature === 'coral') {
    for (let i = 0; i < 30; i++) { const x = Math.random() * W, h = 16 + Math.random() * 40; c.fillStyle = rgb(jit([150, 120, 120], 30), 0.85); c.beginPath(); c.moveTo(x - 9, H); c.quadraticCurveTo(x, H - h, x + 9, H); c.fill(); }
  } else {
    for (let i = 0; i < 120; i++) { const x = Math.random() * W; const h = 16 + Math.random() * 26; c.strokeStyle = rgb(jit(fore, 12)); c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, H - 2); c.lineTo(x + 6, H - 2 - h); c.stroke(); }
  }
  // framing occluders, leafy
  c.fillStyle = rgb(jit(fore, 8));
  c.beginPath(); c.moveTo(-10, H); c.quadraticCurveTo(60, H - 60, 130, H - 6); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(W + 10, H); c.quadraticCurveTo(W - 60, H - 60, W - 130, H - 6); c.closePath(); c.fill();
}

function offscreen(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

/* ---------- public factory ---------- */
export function makeBackdrop(base) {
  const BASE = base || '/';
  let W = 0, H = 0, bakedKey = null, DPR = 1;
  let sky = null, planes = [], foreC = null, grain = null;
  let plate = null, plateTried = false;

  function bakeGrain() {
    const g = offscreen(160, 160); const c = g.getContext('2d');
    const img = c.createImageData(160, 160);
    for (let i = 0; i < img.data.length; i += 4) { const v = 120 + Math.random() * 135; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    c.putImageData(img, 0, 0); grain = g;
  }

  function tryPlate(key) {
    plateTried = true;
    const exts = ['webp', 'png', 'jpg'];
    let i = 0;
    const attempt = () => {
      if (i >= exts.length) return;
      const img = new Image();
      img.onload = () => { plate = img; };
      img.onerror = () => { i++; attempt(); };
      img.src = `${BASE}art/backdrops/${key}.${exts[i]}`;
    };
    attempt();
  }

  function bake(w, h, key) {
    W = w; H = h; bakedKey = key;
    const rec = RECIPES[key] || RECIPES.default;
    if (!grain) bakeGrain();
    if (!plateTried) tryPlate(key);
    // sky
    sky = offscreen(w, h); const sc = sky.getContext('2d');
    const g = sc.createLinearGradient(0, 0, 0, h * 0.85);
    g.addColorStop(0, rgb(rec.sky.top)); g.addColorStop(1, rgb(rec.sky.hor));
    sc.fillStyle = g; sc.fillRect(0, 0, w, h);
    const sx = w * rec.sky.sunX, sy = h * 0.16;
    const sg = sc.createRadialGradient(sx, sy, 0, sx, sy, h * 0.6);
    sg.addColorStop(0, rgb(rec.sky.sun, 0.7)); sg.addColorStop(0.4, rgb(rec.sky.sun, 0.18)); sg.addColorStop(1, rgb(rec.sky.sun, 0));
    sc.fillStyle = sg; sc.fillRect(0, 0, w, h);
    // planes (each its own canvas, baked soft for far → sharp for near)
    planes = rec.bands.map((band) => {
      const cn = offscreen(w, h); const c = cn.getContext('2d');
      if (band.blur) c.filter = `blur(${band.blur}px)`;
      paintFoliage(c, w, h, band, rec.sky.sunX);
      c.filter = 'none';
      return { canvas: cn, par: band.par };
    });
    // foreground signature
    foreC = offscreen(w, h); const fc = foreC.getContext('2d');
    paintSignature(fc, w, h, rec);
    return rec;
  }

  function resize(w, h, typeStr) {
    const key = keyFor(typeStr);
    if (key !== bakedKey || w !== W || h !== H) { plateTried = plateTried && key === bakedKey; bake(w, h, key); }
  }

  function draw(ctx, t, sp, opts) {
    if (!sky) return H * 0.74;
    opts = opts || {};
    const rec = RECIPES[bakedKey] || RECIPES.default;
    const deg = opts.cascade || 0;
    const par = (sp - 0.5);
    const wy = rec.water.y > 0.01 ? H * rec.water.y : H * 0.74;

    // photoreal plate path: a single parallaxed landscape image
    if (plate && plate.complete && plate.naturalWidth) {
      const scale = Math.max(W / plate.naturalWidth, H / plate.naturalHeight) * 1.08;
      const iw = plate.naturalWidth * scale, ih = plate.naturalHeight * scale;
      ctx.drawImage(plate, (W - iw) / 2 + par * 40, (H - ih) / 2, iw, ih);
    } else {
      ctx.drawImage(sky, 0, 0, W, H);
      planes.forEach((p) => { const dx = par * 80 * p.par; ctx.drawImage(p.canvas, dx, 0, W, H); });
      // water with live reflection + ripples
      if (rec.water.y > 0.01) {
        const wcol = mix(rec.water.col, [150, 140, 122], deg * 0.6);
        ctx.fillStyle = rgb(wcol); ctx.fillRect(0, wy, W, H - wy);
        ctx.save(); ctx.beginPath(); ctx.rect(0, wy, W, H - wy); ctx.clip();
        ctx.globalAlpha = 0.30; ctx.translate(0, 2 * wy); ctx.scale(1, -1);
        planes.forEach((p) => { const dx = par * 80 * p.par; ctx.drawImage(p.canvas, dx + 1.5, 0, W, H); });
        ctx.restore();
        // ripple highlights + sky wash
        ctx.fillStyle = rgb(mix(wcol, [255, 255, 255], 0.3), 0.18); ctx.fillRect(0, wy, W, H - wy);
        ctx.strokeStyle = rgb(mix(wcol, [255, 255, 255], 0.5), 0.22); ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) { const yy = wy + 8 + i * ((H - wy) / 7); ctx.beginPath(); for (let x = 0; x <= W; x += 20) { const y = yy + Math.sin(x * 0.03 + t * 0.6 + i) * 2; if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.stroke(); }
      }
      ctx.drawImage(foreC, par * 80 * 0.5, 0, W, H);
    }

    // atmospheric haze + cascade smoke (warm), as light overlays
    if (deg > 0.01) { ctx.fillStyle = rgb([196, 178, 150], deg * 0.5); ctx.fillRect(0, 0, W, H); }
    // film grain — photographic texture
    if (grain) {
      ctx.save(); ctx.globalAlpha = 0.05; ctx.globalCompositeOperation = 'overlay';
      for (let y = 0; y < H; y += 160) for (let x = 0; x < W; x += 160) ctx.drawImage(grain, x, y);
      ctx.restore();
    }
    return wy;
  }

  return { resize, draw, keyFor };
}
