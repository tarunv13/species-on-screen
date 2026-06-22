/*
  Enter the living place — research-exploratory controller (prototype).
  ---------------------------------------------------------------------
  Shares the field record's art direction — the high-fidelity biome
  backdrop engine (aerial depth, water reflections, grain), species
  illustrations, and gliding smooth scroll — but reframes the landscape
  as a living BODY: water = circulation, forest = breath, species
  interactions = nervous system. It closes on what makes change possible
  (the COM-B behaviour model, sourced) — behaviour change through
  structural understanding, not gamification (experiential-references §4).

  Reads the same Darwin Core Archive as the field record and the per-
  species COM-B data. Cinematic descent (places/) is untouched.
*/

import * as THREE from 'three';
import Lenis from 'lenis';
import './living-place.css';
import { makeSpeciesArt } from './species-art.js';
import { makeBackdrop } from './biome-backdrop.js';

const BASE = import.meta.env.BASE_URL || '/';
const PLACE = new URLSearchParams(location.search).get('place') || 'sundarbans';
const DWCA = BASE + 'dwca/' + PLACE + '/';
const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const art = makeSpeciesArt(BASE);
const backdrop = makeBackdrop(BASE);
// Flagship species whose COM-B behaviour data frames the close.
const FLAGSHIP = { sundarbans: 'tiger', 'amazon-varzea': 'amazon-river-dolphin' }[PLACE] || null;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const rgb = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a == null ? 1 : a})`;
const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ROLE = {
  primary_producer: [127, 214, 160], pollinator: [255, 212, 128], herbivore: [206, 196, 150],
  detritivore: [184, 152, 120], consumer: [120, 182, 212], predator: [128, 205, 222],
  mesopredator: [176, 200, 210], apex_predator: [232, 150, 96], human_community: [236, 170, 112],
};

let ACTORS = {}, RELS = [], actorList = [], PLACE_META = null, COMB = null;

function parseTSV(text) {
  const lines = text.replace(/\r/g, '').split('\n').filter((l) => l.length);
  const head = lines[0].split('\t');
  return lines.slice(1).map((line) => { const c = line.split('\t'); const o = {}; head.forEach((h, i) => { o[h] = c[i]; }); return o; });
}
async function loadDwc() {
  const [occT, relT] = await Promise.all([
    fetch(DWCA + 'occurrence.txt').then((r) => r.text()),
    fetch(DWCA + 'resource-relationship.txt').then((r) => r.text()),
  ]);
  parseTSV(occT).forEach((row) => {
    let dyn = {}; try { dyn = JSON.parse(row.dynamicProperties); } catch (e) { /* */ }
    ACTORS[row.occurrenceID] = {
      id: row.occurrenceID, sci: row.scientificName, vern: row.vernacularName, iucn: dyn.iucnCategory || 'NE',
      role: dyn.trophicRole || 'consumer', bx: dyn.sceneX != null ? dyn.sceneX : 0.5, by: dyn.sceneY != null ? dyn.sceneY : 0.5,
      seasonal: dyn.seasonalPresence || { wet: 1, dry: 1 },
      kingdom: row.kingdom || '', class: row.class || '', order: row.order || '', family: row.family || '',
      ph: Math.random() * 6.28, px: 0, py: 0, depth: 0.6,
    };
  });
  actorList = Object.values(ACTORS);
  RELS = parseTSV(relT).map((row) => ({ from: row.resourceID, to: row.relatedResourceID, type: row.relationshipOfResource }));
}

/* ---------- body-system beats ---------- */
let STEPS = [], PEOPLE_ID = null;
function buildBeats() {
  const human = actorList.find((a) => a.role === 'human_community');
  PEOPLE_ID = human ? human.id : null;
  const name = (PLACE_META && PLACE_META.name) || 'this place';
  STEPS = [
    { kicker: 'Arrival', title: 'You have arrived', body: `Before the names, before the numbers — ${name} as a place that exists whether or not you are watching.`, src: '', state: { water: 0, forest: 0, nerve: 0.25, edges: 0, labels: 0, season: 1, focus: [] } },
    { kicker: 'Circulatory · water', title: 'The water is its circulation', body: 'The tide and the channels are the bloodstream — carrying nutrients, larvae and the pressure that keeps every other system supplied.', src: 'Darwin Core occurrences · seasonal flow', state: { water: 1, forest: 0, nerve: 0.3, edges: 0.3, labels: 0.3, season: 1, focus: [] } },
    { kicker: 'Respiratory · forest', title: 'The forest is its breath', body: 'The vegetation draws carbon and releases oxygen and water vapour — the exchange that regulates the air and feeds the web from below.', src: 'GBIF backbone · primary producers', state: { water: 0, forest: 1, nerve: 0.3, edges: 0.3, labels: 0.4, season: 1, focus: [] } },
    { kicker: 'Nervous · interactions', title: 'The species are its nervous system', body: 'Predator and prey, pollinator and plant — the interactions are the signals that travel through the body and keep it regulated.', src: 'ResourceRelationship · GloBI / OBO RO', state: { water: 0, forest: 0, nerve: 1, edges: 1, labels: 1, season: 1, focus: [] } },
    { kicker: 'The people', title: 'People are inside the body', body: 'Not above the system, but a part of it — bound to the same water, the same forest, the same web. Which is why its future runs through them.', src: 'Homo sapiens occurrence · oral accounts', state: { water: 0.3, forest: 0.3, nerve: 1, edges: 1, labels: 1, season: 0, focus: PEOPLE_ID ? [PEOPLE_ID] : [] } },
  ];
}

/* ---------- DOM + observer ---------- */
let activeIdx = 0;
function buildSteps() {
  const wrap = document.getElementById('lp-steps');
  STEPS.forEach((s, i) => {
    const step = document.createElement('div'); step.className = 'lp-step'; step.dataset.idx = i;
    step.innerHTML = `<div class="lp-card"><div class="kicker">${esc(s.kicker)}</div><h2>${esc(s.title)}</h2><p>${esc(s.body)}</p>${s.src ? `<div class="src"><span class="lbl">source</span>${esc(s.src)}</div>` : ''}</div>`;
    wrap.appendChild(step);
  });
  const obs = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) {
      activeIdx = +e.target.dataset.idx;
      document.querySelectorAll('.lp-step').forEach((s) => s.classList.toggle('is-active', s === e.target));
      const sys = STEPS[activeIdx].kicker;
      document.getElementById('lp-system').textContent = sys.includes('·') ? sys : '';
    }
  }), { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  document.querySelectorAll('.lp-step').forEach((s) => obs.observe(s));
  recomputeCenters();
}

/* ---------- gliding state ---------- */
const cur = { water: 0, forest: 0, nerve: 0.25, edges: 0, labels: 0, season: 1, cascade: 0 };
let curFocus = [], scrollProg = 0, centers = [];
const KEYS = ['water', 'forest', 'nerve', 'edges', 'labels', 'season', 'cascade'];
function lerpState(a, b, f) { const o = {}; for (const k of KEYS) o[k] = lerp(a[k] || 0, b[k] || 0, f); o.focus = (f < 0.5 ? a.focus : b.focus) || []; return o; }
function recomputeCenters() { centers = [...document.querySelectorAll('.lp-step')].map((el) => { const r = el.getBoundingClientRect(); return r.top + window.scrollY + r.height / 2; }); }
function stateFromScroll() {
  const max = document.body.scrollHeight - window.innerHeight; scrollProg = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
  if (!centers.length) return STEPS[0].state;
  const vc = window.scrollY + window.innerHeight / 2, last = centers.length - 1;
  if (vc <= centers[0]) return STEPS[0].state;
  if (vc >= centers[last]) return STEPS[last].state;
  for (let i = 0; i < last; i++) if (vc >= centers[i] && vc <= centers[i + 1]) return lerpState(STEPS[i].state, STEPS[i + 1].state, smooth(0, 1, (vc - centers[i]) / ((centers[i + 1] - centers[i]) || 1)));
  return STEPS[last].state;
}

/* ---------- canvas ---------- */
let cv, ctx, W = 0, H = 0, DPR = 1;
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2); W = window.innerWidth; H = window.innerHeight;
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  backdrop.resize(W, H, PLACE_META && PLACE_META.type);
}
const flow = []; for (let i = 0; i < 70; i++) flow.push({ p: Math.random(), lane: Math.random(), s: 0.02 + Math.random() * 0.05 });
const motes = []; for (let j = 0; j < 50; j++) motes.push({ x: Math.random(), y: Math.random(), v: 0.02 + Math.random() * 0.05, ph: Math.random() * 6.28 });
const inFocus = (id) => curFocus.length === 0 || curFocus.indexOf(id) >= 0;

function draw(now) {
  const t = now / 1000;
  const tgt = stateFromScroll();
  for (const k of KEYS) cur[k] += ((tgt[k] != null ? tgt[k] : cur[k]) - cur[k]) * (REDUCE ? 0.3 : 0.09);
  curFocus = tgt.focus || [];

  const wy = backdrop.draw(ctx, t, scrollProg, { season: cur.season });

  actorList.forEach((a) => { const bob = Math.sin(t * 0.8 + a.ph) * 3; a.depth = clamp((a.by - 0.38) / 0.54, 0, 1); a.px = a.bx * W + (scrollProg - 0.5) * 60 * a.depth; a.py = a.by * H + bob; });

  // circulatory
  if (cur.water > 0.01) for (const p of flow) { p.p = (p.p + p.s * 0.004) % 1; const x = p.p * W, y = wy + 8 + p.lane * (H - wy - 12) + Math.sin(x * 0.03 + t) * 3; ctx.fillStyle = rgb([70, 150, 170], cur.water * 0.5 * (0.4 + p.lane)); ctx.beginPath(); ctx.arc(x, y, 1.7, 0, 6.28); ctx.fill(); }
  // respiratory
  if (cur.forest > 0.01) for (const m of motes) { m.y -= m.v * 0.004; if (m.y < 0.2) { m.y = 0.6; m.x = Math.random(); } ctx.fillStyle = rgb([86, 146, 100], cur.forest * 0.45 * (0.3 + 0.7 * (0.6 - m.y) / 0.4)); ctx.beginPath(); ctx.arc(m.x * W + Math.sin(t + m.ph) * 8, m.y * H, 1.6, 0, 6.28); ctx.fill(); }
  // nervous — edges + signals
  if (cur.edges > 0.01) RELS.forEach((r, i) => {
    const a = ACTORS[r.from], b = ACTORS[r.to]; if (!a || !b) return;
    const foc = (inFocus(r.from) && inFocus(r.to)) ? 1 : 0.22;
    ctx.strokeStyle = rgb([70, 96, 92], (0.2 + 0.4) * cur.edges * foc); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(a.px, a.py - 6); ctx.lineTo(b.px, b.py - 6); ctx.stroke();
    const sp = ((t * 0.16 + i * 0.31) % 1), sx = lerp(a.px, b.px, sp), sy = lerp(a.py - 6, b.py - 6, sp);
    ctx.fillStyle = rgb([206, 142, 52], 0.85 * cur.edges * foc); ctx.beginPath(); ctx.arc(sx, sy, 2.8, 0, 6.28); ctx.fill();
  });
  // species (inhabitants, at depth)
  actorList.forEach((a) => {
    const foc = inFocus(a.id) ? 1 : 0.34, depth = a.depth;
    const base = ROLE[a.role] || [150, 150, 150]; let col = [base[0] * 0.78, base[1] * 0.78, base[2] * 0.78];
    if (depth < 0.62) col = mix(col, [198, 208, 204], (0.62 - depth) * 0.6);
    const pres = lerp(a.seasonal.dry, a.seasonal.wet, cur.season);
    const form = art.formOf(a); const s = ((form === 'bigcat' || form === 'human' || form === 'tree' || form === 'dolphin') ? 1.1 : 0.95) * lerp(0.82, 1.16, depth);
    art.draw(ctx, a, a.px, a.py, s, col, clamp((0.55 + 0.4 * cur.nerve) * pres * foc, 0, 1), t, a.ph);
    if (cur.labels > 0.05) {
      const la = cur.labels * foc; ctx.save(); ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(255,255,255,0.82)'; ctx.shadowBlur = 5;
      ctx.fillStyle = rgb([34, 40, 32], 0.95 * la); ctx.font = '12px sans-serif'; ctx.fillText(a.vern, a.px, a.py + 22);
      ctx.fillStyle = rgb([92, 88, 74], 0.85 * la); ctx.font = 'italic 10px Georgia, serif'; ctx.fillText(a.sci, a.px, a.py + 35); ctx.restore();
    }
  });
  requestAnimationFrame(draw);
}

/* ---------- COM-B close (behaviour through understanding) ---------- */
function buildCombo() {
  const el = document.getElementById('lp-combo');
  const flagshipName = COMB && COMB.taxonomy ? COMB.taxonomy.common_name : 'this place';
  const cols = [
    ['Capability', COMB && COMB.com_b ? COMB.com_b.capability : null, 'what people are able to do'],
    ['Opportunity', COMB && COMB.com_b ? COMB.com_b.opportunity : null, 'what circumstances allow'],
    ['Motivation', COMB && COMB.com_b ? COMB.com_b.motivation : null, 'what people are moved to do'],
  ];
  const boxes = cols.map(([title, arr, sub]) => {
    const items = (arr && arr.length) ? arr.map((x) => `<li>${esc(x.text)}${x.source ? `<cite>${x.source_url ? `<a href="${esc(x.source_url)}" target="_blank" rel="noopener noreferrer">${esc(x.source)}</a>` : esc(x.source)}</cite>` : ''}</li>`).join('') : `<li class="muted">${esc(sub)} — data pending.</li>`;
    return `<div class="lp-cobox"><h3>${esc(title)}</h3><ul>${items}</ul></div>`;
  }).join('');
  el.innerHTML = `
    <p class="lead">A living place is not saved by attention alone. It changes when people are <span class="accent">able</span>, when circumstances give them the <span class="accent">opportunity</span>, and when they are <span class="accent">moved</span> to act.</p>
    <div class="grid">${boxes}</div>
    <p class="lp-foot">The capability–opportunity–motivation (COM-B) model, after Michie et al. (2011). Drawn from the attested record for ${esc(flagshipName)}; every line is sourced. This is understanding, not a call to action — the field record holds the full evidence: <a href="field-record.html${PLACE !== 'sundarbans' ? '?place=' + esc(PLACE) : ''}">read the field record</a>.</p>`;
}

/* ---------- sound (procedural bed) ---------- */
let audioCtx = null, master = null, soundOn = false;
function startAudio() {
  if (audioCtx) return; const C = window.AudioContext || window.webkitAudioContext; if (!C) return; audioCtx = new C();
  master = audioCtx.createGain(); master.gain.value = 0; master.connect(audioCtx.destination);
  const o1 = audioCtx.createOscillator(); o1.type = 'sine'; o1.frequency.value = 48; const o2 = audioCtx.createOscillator(); o2.type = 'sine'; o2.frequency.value = 52.4;
  const df = audioCtx.createBiquadFilter(); df.type = 'lowpass'; df.frequency.value = 220; const dg = audioCtx.createGain(); dg.gain.value = 0.07;
  o1.connect(df); o2.connect(df); df.connect(dg); dg.connect(master); o1.start(); o2.start();
  const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 4, audioCtx.sampleRate); const ch = buf.getChannelData(0); for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * 0.5;
  const n = audioCtx.createBufferSource(); n.buffer = buf; n.loop = true; const nf = audioCtx.createBiquadFilter(); nf.type = 'lowpass'; nf.frequency.value = 600; const ng = audioCtx.createGain(); ng.gain.value = 0.06; n.connect(nf); nf.connect(ng); ng.connect(master); n.start();
  master.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 4);
}
function toggleSound() { const b = document.getElementById('lp-sound'); if (!soundOn) { startAudio(); soundOn = true; b.textContent = '⏸ Sound: on'; b.setAttribute('aria-pressed', 'true'); } else { soundOn = false; if (master) master.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.6); b.textContent = '▷ Sound: off'; b.setAttribute('aria-pressed', 'false'); } }

/* ---------- the threshold: a real WebGL 3D living-island ---------- */
const noise3 = (x, y, z) => (Math.sin(x * 2.1 + z * 1.7) + Math.sin(y * 1.9 + x * 1.1) + Math.sin(z * 2.3 + y * 1.5) + Math.sin((x + z) * 3.3)) / 4;
function thresholdTheme(type) {
  const k = (type || '').toLowerCase();
  if (/reef|coral|marine/.test(k)) return { rock: 0x4a6a72, grass: false, gA: new THREE.Color(0x6fb0a8), gB: new THREE.Color(0xcf8f7f), fA: 0xe8a07a, fB: 0xf0d0a0, shard: 0x8a9a9a };
  if (/savanna|grass/.test(k)) return { rock: 0x7a6a4a, grass: true, gA: new THREE.Color(0xc6c07a), gB: new THREE.Color(0xa89a58), fA: 0xe8d080, fB: 0xfff0c0, shard: 0x9a8a6a };
  return { rock: 0x5a5048, grass: true, gA: new THREE.Color(0x4f7a3e), gB: new THREE.Color(0x86b25a), fA: 0xd98fb0, fB: 0xf0e0c0, shard: 0x8a8680 };
}
function displaceIsland(geo) {
  const p = geo.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i); const d = v.clone().normalize();
    v.setLength(1.5 + noise3(d.x * 2.2, d.y * 2.2, d.z * 2.2) * 0.16);
    if (d.y > 0) v.y *= 0.42;
    else { v.y *= (1 + (-d.y) * 1.5); v.x += noise3(v.x * 3, v.y * 3, v.z * 3) * 0.14; v.z += noise3(v.z * 3, v.x * 3, v.y * 3) * 0.14; }
    p.setXYZ(i, v.x, v.y, v.z);
  }
  p.needsUpdate = true;
}
function collectAnchors(geo) {
  const p = geo.attributes.position, n = geo.attributes.normal, out = [], v = new THREE.Vector3(), nv = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); nv.fromBufferAttribute(n, i); if (nv.y > 0.45 && v.y > -0.15) out.push(v.clone()); }
  return out;
}
function buildGrass(anchors, th) {
  const blade = new THREE.ConeGeometry(0.014, 0.2, 4); blade.translate(0, 0.1, 0);
  const N = Math.min(7000, anchors.length * 16);
  const mesh = new THREE.InstancedMesh(blade, new THREE.MeshStandardMaterial({ roughness: 0.8, flatShading: true }), N);
  const dm = new THREE.Object3D(), c = new THREE.Color();
  for (let i = 0; i < N; i++) {
    const a = anchors[(Math.random() * anchors.length) | 0];
    dm.position.set(a.x + (Math.random() - 0.5) * 0.12, a.y - 0.01, a.z + (Math.random() - 0.5) * 0.12);
    dm.rotation.set((Math.random() - 0.5) * 0.5, Math.random() * 6.28, (Math.random() - 0.5) * 0.5);
    const s = 0.6 + Math.random() * 0.9; dm.scale.set(s, 0.7 + Math.random() * 1.0, s); dm.updateMatrix();
    mesh.setMatrixAt(i, dm.matrix); mesh.setColorAt(i, c.copy(th.gA).lerp(th.gB, Math.random()));
  }
  mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  return mesh;
}
function buildFlowers(anchors, th) {
  const geo = new THREE.IcosahedronGeometry(0.035, 0);
  const N = 180; const mesh = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ roughness: 0.7, flatShading: true }), N);
  const dm = new THREE.Object3D(), c = new THREE.Color(), a1 = new THREE.Color(th.fA), a2 = new THREE.Color(th.fB);
  for (let i = 0; i < N; i++) { const a = anchors[(Math.random() * anchors.length) | 0]; dm.position.set(a.x + (Math.random() - 0.5) * 0.1, a.y + 0.08, a.z + (Math.random() - 0.5) * 0.1); const s = 0.6 + Math.random() * 0.9; dm.scale.setScalar(s); dm.updateMatrix(); mesh.setMatrixAt(i, dm.matrix); mesh.setColorAt(i, c.copy(a1).lerp(a2, Math.random())); }
  mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  return mesh;
}
function buildShards(anchors, th) {
  const g = new THREE.Group(); const mat = new THREE.MeshStandardMaterial({ color: th.shard, roughness: 1, flatShading: true });
  for (let i = 0; i < 5; i++) { const a = anchors[(Math.random() * anchors.length) | 0]; const m = new THREE.Mesh(new THREE.BoxGeometry(0.08 + Math.random() * 0.1, 0.4 + Math.random() * 0.4, 0.05 + Math.random() * 0.06), mat); m.position.set(a.x, a.y + 0.1, a.z); m.rotation.set((Math.random() - 0.5) * 0.6, Math.random() * 6.28, (Math.random() - 0.5) * 0.6); g.add(m); }
  return g;
}
function buildBlobShadow() {
  const cv2 = document.createElement('canvas'); cv2.width = cv2.height = 128; const c = cv2.getContext('2d');
  const grd = c.createRadialGradient(64, 64, 0, 64, 64, 64); grd.addColorStop(0, 'rgba(40,46,38,0.5)'); grd.addColorStop(1, 'rgba(40,46,38,0)'); c.fillStyle = grd; c.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(cv2);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = -2.5; return m;
}
function buildMotes() {
  const N = 240, pos = new Float32Array(N * 3); for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 6; pos[i * 3 + 1] = (Math.random() - 0.5) * 4; pos[i * 3 + 2] = (Math.random() - 0.5) * 4; }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, transparent: true, opacity: 0.5, depthWrite: false }));
  pts.userData.update = (t) => { const p = geo.attributes.position; for (let i = 0; i < N; i++) { let y = p.getY(i) + 0.004; if (y > 2) y = -2; p.setY(i, y); p.setX(i, p.getX(i) + Math.sin(t + i) * 0.0008); } p.needsUpdate = true; };
  return pts;
}
async function tryGLB(key, group, procedural) {
  try {
    const mod = await import('three/examples/jsm/loaders/GLTFLoader.js');
    new mod.GLTFLoader().load(`${BASE}art/3d/${key}.glb`, (gltf) => {
      const m = gltf.scene, box = new THREE.Box3().setFromObject(m), size = box.getSize(new THREE.Vector3()), ctr = box.getCenter(new THREE.Vector3());
      const scl = 3.2 / Math.max(size.x, size.y, size.z); m.scale.setScalar(scl); m.position.sub(ctr.multiplyScalar(scl)); group.add(m);
      procedural.forEach((o) => { if (o) o.visible = false; });
    }, undefined, () => { /* no plate; keep procedural */ });
  } catch (e) { /* loader unavailable */ }
}
/* species face-card + 3D "points of life" markers on the island */
const IUCN_LABEL = { CR: 'Critically endangered', EN: 'Endangered', VU: 'Vulnerable', NT: 'Near threatened', LC: 'Least concern', DD: 'Data deficient', NE: 'Not evaluated' };
const SAFE_IUCN = { LC: 1, NT: 1, NE: 1, DD: 1 };
const prettyRole = (r) => String(r || '').replace(/_/g, ' ').replace(/\b\w/, (c) => c.toUpperCase());
function speciesRels(a) {
  const out = [];
  RELS.forEach((r) => { if (r.from === a.id && ACTORS[r.to]) out.push(`<em>${r.type}</em> ${ACTORS[r.to].vern}`); else if (r.to === a.id && ACTORS[r.from]) out.push(`${ACTORS[r.from].vern} <em>${r.type}</em> this`); });
  return out.slice(0, 4);
}
function showThCard(a, cx, cy) {
  const el = document.getElementById('th-card'); if (!el) return;
  const iucn = a.iucn || 'NE', rels = speciesRels(a), fam = a.family || a.class || '';
  el.innerHTML = `<div class="sc-vern">${esc(a.vern)}</div><div class="sc-sci">${esc(a.sci)}</div>`
    + `<div class="sc-tags"><span class="sc-tag iucn${SAFE_IUCN[iucn] ? ' safe' : ''}">${IUCN_LABEL[iucn] || iucn}</span><span class="sc-tag">${esc(prettyRole(a.role))}</span>${fam ? `<span class="sc-tag">${esc(fam)}</span>` : ''}</div>`
    + (rels.length ? `<div class="sc-rels"><span class="sc-lbl">interactions</span>${rels.map((r) => `<div class="sc-rel">${r}</div>`).join('')}</div>` : '');
  const cw = el.offsetWidth || 272, chh = el.offsetHeight || 150;
  let x = cx + 22; if (x + cw > window.innerWidth - 12) x = cx - cw - 22; if (x < 12) x = 12;
  let y = cy - 20; y = clamp(y, 12, window.innerHeight - chh - 12);
  el.style.left = Math.round(x) + 'px'; el.style.top = Math.round(y) + 'px'; el.classList.add('is-on');
}
function hideThCard() { const el = document.getElementById('th-card'); if (el) el.classList.remove('is-on'); }
function roleColor(role) { const c = ROLE[role] || [150, 200, 150]; return new THREE.Color(c[0] / 255, c[1] / 255, c[2] / 255); }
function placeMarkers(group, anchors, actors) {
  const picks = [], markers = [], used = [];
  actors.slice(0, 10).forEach((a) => {
    let best = null, bestMin = -1;
    for (let k = 0; k < 50; k++) { const c = anchors[(Math.random() * anchors.length) | 0]; let mn = 1e9; for (const u of used) mn = Math.min(mn, c.distanceTo(u)); if (mn > bestMin) { bestMin = mn; best = c; } }
    if (!best) return; used.push(best);
    const col = roleColor(a.role), mk = new THREE.Group(); mk.position.copy(best); mk.position.y += 0.03;
    const bright = col.clone().lerp(new THREE.Color(0xffffff), 0.35);
    const sph = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), new THREE.MeshBasicMaterial({ color: bright })); mk.add(sph);
    const pick = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })); pick.userData.actor = a; mk.add(pick); picks.push(pick);
    mk.add(new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshBasicMaterial({ color: bright, transparent: true, opacity: 0.3, depthWrite: false })));
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.7, 6), new THREE.MeshBasicMaterial({ color: bright, transparent: true, opacity: 0.35, depthWrite: false })); beam.position.y = 0.35; mk.add(beam);
    mk.userData.pulse = Math.random() * 6.28; group.add(mk); markers.push(mk);
  });
  return { picks, markers };
}

function initThreshold(biomeType) {
  const canvas = document.getElementById('th-canvas'), section = document.getElementById('th'); if (!canvas || !section) return;
  let renderer; try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { const l = document.getElementById('th-loading'); if (l) l.textContent = ''; return; }
  let W = section.clientWidth, H = section.clientHeight || window.innerHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.setSize(W, H, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0xd7dbda, 7, 17);
  const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100); camera.position.set(0, 0.4, 6.4); camera.lookAt(0, -0.25, 0);
  scene.add(new THREE.HemisphereLight(0xeef2f0, 0x6b7a5a, 0.95));
  const sun = new THREE.DirectionalLight(0xfff4e2, 1.5); sun.position.set(4, 6, 3); scene.add(sun);
  const fill = new THREE.DirectionalLight(0xbcd0e0, 0.4); fill.position.set(-5, 2, -2); scene.add(fill);
  const group = new THREE.Group(); scene.add(group);
  group.position.x = 0.7; group.position.z = 0.2; // sit right-of-centre, clear of the headline
  const th = thresholdTheme(biomeType);
  const baseGeo = new THREE.IcosahedronGeometry(1.5, 22); displaceIsland(baseGeo); baseGeo.computeVertexNormals();
  const base = new THREE.Mesh(baseGeo, new THREE.MeshStandardMaterial({ color: th.rock, roughness: 0.96, flatShading: true })); group.add(base);
  const anchors = collectAnchors(baseGeo);
  const grass = th.grass ? buildGrass(anchors, th) : null; if (grass) group.add(grass);
  const flowers = buildFlowers(anchors, th); group.add(flowers);
  const shards = buildShards(anchors, th); group.add(shards);
  group.add(buildBlobShadow());
  const motes = buildMotes(); group.add(motes);
  tryGLB(biomeType, group, [base, grass, flowers, shards]);
  // The species become discoverable points of life ON the island.
  const { picks, markers } = placeMarkers(group, anchors, actorList);
  // Raycast hover → glassmorphic species card. Event-driven (not tied to
  // the animation loop), so it stays responsive and is testable.
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1; ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    scene.updateMatrixWorld(true); ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(picks, false)[0];
    if (hit) { showThCard(hit.object.userData.actor, e.clientX, e.clientY); canvas.style.cursor = 'pointer'; }
    else { hideThCard(); canvas.style.cursor = ''; }
  });
  canvas.addEventListener('pointerleave', () => { hideThCard(); canvas.style.cursor = ''; });
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  window.addEventListener('pointermove', (e) => { tmx = e.clientX / window.innerWidth - 0.5; tmy = e.clientY / window.innerHeight - 0.5; }, { passive: true });
  window.addEventListener('resize', () => { W = section.clientWidth; H = section.clientHeight || window.innerHeight; renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); });
  const loadingEl = document.getElementById('th-loading'); const clock = new THREE.Clock(); let started = false;
  (function animate() {
    requestAnimationFrame(animate); const t = clock.getElapsedTime();
    mx += (tmx - mx) * 0.04; my += (tmy - my) * 0.04;
    group.rotation.y = t * 0.06 + mx * 0.5; group.rotation.x = -0.04 + my * 0.2; group.position.y = Math.sin(t * 0.6) * 0.06;
    if (!REDUCE) for (const mk of markers) mk.scale.setScalar(1 + Math.sin(t * 2 + mk.userData.pulse) * 0.16);
    if (motes.userData.update && !REDUCE) motes.userData.update(t);
    renderer.render(scene, camera);
    if (!started) { started = true; if (loadingEl) loadingEl.style.display = 'none'; }
  })();
}

/* ---------- boot ---------- */
async function init() {
  cv = document.getElementById('lp-canvas'); ctx = cv.getContext('2d');
  document.getElementById('lp-sound').addEventListener('click', toggleSound);
  window.addEventListener('scroll', () => { const h = document.getElementById('lp-hint'); if (h && window.scrollY > 40) h.style.opacity = '0'; }, { passive: true });
  try { const idx = await fetch(BASE + 'dwca/index.json').then((r) => r.json()); PLACE_META = (idx || []).find((p) => p.id === PLACE) || null; } catch (e) { /* */ }
  try { await loadDwc(); } catch (e) { document.getElementById('lp-steps').innerHTML = '<div class="lp-step"><div class="lp-card"><h2>Archive unavailable</h2><p>Run <code>npm run ingest ' + esc(PLACE) + '</code>.</p></div></div>'; return; }
  if (FLAGSHIP) { try { COMB = await fetch(BASE + 'data/' + FLAGSHIP + '.json').then((r) => (r.ok ? r.json() : null)); } catch (e) { COMB = null; } }
  if (PLACE_META) {
    document.title = 'Enter the living place · ' + PLACE_META.name;
    const tEl = document.getElementById('lp-title'); if (tEl) tEl.textContent = PLACE_META.name;
    const hEl = document.getElementById('th-headline'); if (hEl) hEl.innerHTML = `Enter the living <em>${esc(PLACE_META.name)}</em>.`;
  }
  // Zone 1 — the WebGL 3D threshold (biome-themed; .glb upgrades it).
  initThreshold(PLACE_META && PLACE_META.type);
  buildBeats(); buildSteps(); buildCombo();
  resize(); const onLayout = () => { resize(); recomputeCenters(); }; window.addEventListener('resize', onLayout); window.addEventListener('load', onLayout);
  document.querySelector('.lp-step') && document.querySelector('.lp-step').classList.add('is-active');
  if (!REDUCE) { const lenis = new Lenis({ duration: 1.2, smoothWheel: true, wheelMultiplier: 0.9 }); const lr = (time) => { lenis.raf(time); requestAnimationFrame(lr); }; requestAnimationFrame(lr); }
  setTimeout(recomputeCenters, 300);
  requestAnimationFrame(draw);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
