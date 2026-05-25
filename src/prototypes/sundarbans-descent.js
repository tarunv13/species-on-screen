/*
  Sundarbans Descent — Threshold to Habitat
  ------------------------------------------
  Implements Movements 1–5 of the transition grammar as a single
  continuous GSAP timeline. The threshold is composed of layered
  DOM elements; the descent does not navigate, it dissolves the
  framing while the world advances over it. No species, no labels,
  no UI returns on arrival.
*/

import { gsap } from 'gsap';
import './sundarbans-descent.css';

/* ---------- Procedural SVG: canopy silhouettes ---------- */

/**
 * Build a closed SVG path for an organic canopy silhouette.
 * Walks across `width` in `segments` steps, picking smooth-varying
 * crown heights, then closes downward. Quadratic mid-point smoothing
 * keeps the upper edge soft, like distant treeline.
 */
function buildCanopyPath(width, height, segments, roughness) {
  const points = [];
  let prev = height * 0.55;
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * width;
    const wave =
      Math.sin(i * 0.7) * height * 0.10 +
      Math.sin(i * 1.9 + 0.4) * height * 0.06;
    const noise = (Math.random() - 0.5) * height * roughness;
    let y = height * 0.45 + wave + noise;
    y = (prev + y) / 2; // smoothing pass
    prev = y;
    points.push([x, y]);
  }

  let d = `M0,${height} L${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    d += ` Q${x1.toFixed(1)},${y1.toFixed(1)} ${cx.toFixed(1)},${cy.toFixed(1)}`;
  }
  d += ` L${width},${height} Z`;
  return d;
}

/* ---------- Procedural SVG: pneumatophore root field ---------- */

/**
 * Build an SVG <g> innerHTML string of vertical mangrove pneumatophores.
 * Each root is a base ellipse (the knee where it meets mud/water) plus
 * a thin near-vertical line going up. Strokes and ellipse fills are
 * styled in CSS, so this function only emits geometry + stroke-width.
 */
function buildRootField(width, height, count, minHPct, maxHPct, opts = {}) {
  const minH = height * minHPct;
  const maxH = height * maxHPct;
  const baseY = height;
  const minStroke = opts.minStroke ?? 1.4;
  const maxStroke = opts.maxStroke ?? 3.2;

  let out = '';
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const h = minH + Math.random() * (maxH - minH);
    const top = baseY - h;
    const sw = minStroke + Math.random() * (maxStroke - minStroke);
    const xt = x + (Math.random() - 0.5) * 6; // small organic lean

    out += `<line x1="${x.toFixed(1)}" y1="${baseY.toFixed(1)}" x2="${xt.toFixed(1)}" y2="${top.toFixed(1)}" stroke-width="${sw.toFixed(2)}"/>`;
    out += `<ellipse cx="${x.toFixed(1)}" cy="${(baseY - 1).toFixed(1)}" rx="${(sw * 1.4).toFixed(2)}" ry="${(sw * 0.8).toFixed(2)}"/>`;
  }
  return out;
}

/* ---------- Procedural ambient: Web Audio bed ---------- */

/*
  Ambient bed is built procedurally — no asset fetch — and started by
  the user's click on the lens (which doubles as the gesture that
  unlocks audio). Architecture:
    drone   : two detuned low sines through a soft lowpass + slow LFO
    bed     : looped white-noise buffer, lowpass swept by a slow LFO
    shimmer : faint bandpassed noise, distant insect/wind register
  Master gain ramps from 0 to 0.55 over ~5s, so sound widens with the
  descent rather than punching in.
*/
let audioCtx = null;
function startAmbientAudio() {
  if (audioCtx) return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  audioCtx = new Ctx();

  const master = audioCtx.createGain();
  master.gain.value = 0;
  master.connect(audioCtx.destination);

  // Drone
  const o1 = audioCtx.createOscillator(); o1.type = 'sine'; o1.frequency.value = 48;
  const o2 = audioCtx.createOscillator(); o2.type = 'sine'; o2.frequency.value = 52.4;
  const droneFilter = audioCtx.createBiquadFilter();
  droneFilter.type = 'lowpass'; droneFilter.frequency.value = 220;
  const droneGain = audioCtx.createGain(); droneGain.gain.value = 0.07;
  o1.connect(droneFilter); o2.connect(droneFilter);
  droneFilter.connect(droneGain); droneGain.connect(master);
  o1.start(); o2.start();

  const breath = audioCtx.createOscillator(); breath.type = 'sine'; breath.frequency.value = 0.08;
  const breathAmp = audioCtx.createGain(); breathAmp.gain.value = 0.025;
  breath.connect(breathAmp); breathAmp.connect(droneGain.gain);
  breath.start();

  // Noise buffer (shared)
  const bufLen = audioCtx.sampleRate * 4;
  const buf = audioCtx.createBuffer(1, bufLen, audioCtx.sampleRate);
  const ch = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) ch[i] = (Math.random() * 2 - 1) * 0.5;

  // Air/water bed
  const noise = audioCtx.createBufferSource(); noise.buffer = buf; noise.loop = true;
  const nf = audioCtx.createBiquadFilter();
  nf.type = 'lowpass'; nf.frequency.value = 600; nf.Q.value = 0.7;
  const ng = audioCtx.createGain(); ng.gain.value = 0.06;
  noise.connect(nf); nf.connect(ng); ng.connect(master);
  noise.start();

  const fLfo = audioCtx.createOscillator(); fLfo.type = 'sine'; fLfo.frequency.value = 0.05;
  const fLfoAmp = audioCtx.createGain(); fLfoAmp.gain.value = 220;
  fLfo.connect(fLfoAmp); fLfoAmp.connect(nf.frequency);
  fLfo.start();

  // Distant shimmer
  const noise2 = audioCtx.createBufferSource(); noise2.buffer = buf; noise2.loop = true;
  const sf = audioCtx.createBiquadFilter();
  sf.type = 'bandpass'; sf.frequency.value = 4500; sf.Q.value = 1.2;
  const sg = audioCtx.createGain(); sg.gain.value = 0.018;
  noise2.connect(sf); sf.connect(sg); sg.connect(master);
  noise2.start();

  const now = audioCtx.currentTime;
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(0.55, now + 5);
}

/* ---------- Initial scene assembly ---------- */

function paintCanopies() {
  const farPath = document.getElementById('canopy-far-path');
  const midPath = document.getElementById('canopy-mid-path');
  if (farPath) farPath.setAttribute('d', buildCanopyPath(1600, 220, 64, 0.10));
  if (midPath) midPath.setAttribute('d', buildCanopyPath(1600, 260, 80, 0.14));
}

function paintRoots() {
  const midGroup  = document.getElementById('roots-mid-group');
  const foreGroup = document.getElementById('roots-fore-group');
  if (midGroup) {
    midGroup.innerHTML = buildRootField(1600, 320, 90, 0.30, 0.78, {
      minStroke: 1.2, maxStroke: 2.6
    });
  }
  if (foreGroup) {
    foreGroup.innerHTML = buildRootField(1600, 520, 180, 0.50, 0.96, {
      minStroke: 1.8, maxStroke: 4.0
    });
  }
}

/* ---------- Threshold reveal (page load) ---------- */

/*
  The threshold doesn't appear; it surfaces. A quiet beat, then the
  framing question resolves line-by-line, then the lenses settle in
  beneath it. This is not Movement 0 of the descent — it's the
  pre-descent inhabitation of the threshold itself.
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

/* ---------- The descent: Movements 1–5 ---------- */

/*
  Single continuous timeline. The five movements overlap deliberately
  so there are no perceptible boundaries between them. `k` compresses
  the whole thing for reduced-motion users while preserving sequence.
*/
function buildDescent() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const k = reduce ? 0.45 : 1.0;

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'sine.inOut' } });

  /* ----- Movement 1 — Acknowledgement (0.00 – 0.45s) ----- */
  // Unchosen lenses recede (not fade — recede). The chosen lens settles:
  // a small inward scale that reads as weight finding its center.
  // The framing question quiets but is still visible.
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

  /* ----- Movement 2 — Surrender of Frame (0.30 – 1.50s) ----- */
  // Mist rises from below the stage and passes OVER the threshold UI.
  // The frame-content opacity tween fades the typography to 0, but the
  // visible *cause* on screen is the rising atmosphere. The sky
  // simultaneously cools and dims — humidity, not a scene change.
  tl.to('.mist-rising', {
      opacity: 1,
      yPercent: -100, // from translateY(100%) → translateY(0%)
      duration: 1.20 * k,
      ease: 'sine.inOut'
    }, 0.30 * k)
    .to('.frame-content', {
      opacity: 0,
      duration: 0.85 * k,
      ease: 'sine.inOut'
    }, 0.55 * k)
    .to('.sky', {
      filter: 'brightness(0.82) saturate(0.85) hue-rotate(-3deg)',
      duration: 1.00 * k,
      ease: 'sine.inOut'
    }, 0.40 * k)
    .to('.haze-distant', {
      opacity: 0.55,
      duration: 1.00 * k
    }, 0.40 * k);

  /* ----- Movement 3 — Loss of Vantage (1.0 – 3.0s) ----- */
  // Distant elements rise in frame and recede (smaller, fainter) — the
  // horizon climbing as the eye drops below it. Foreground rises from
  // off-stage and dominates. Parallax effectively flips: slow far
  // layers stop moving, near layers take over.
  tl.to('.canopy-far', {
      yPercent: -10,
      scale: 0.92,
      opacity: 0.42,
      duration: 2.00 * k,
      ease: 'power2.inOut',
      transformOrigin: '50% 30%'
    }, 1.00 * k)
    .to('.canopy-mid', {
      yPercent: -7,
      scale: 1.06,
      duration: 2.00 * k,
      ease: 'power2.inOut',
      transformOrigin: '50% 30%'
    }, 1.00 * k)
    .to('.water', {
      opacity: 1,
      yPercent: 0,
      duration: 1.60 * k,
      ease: 'power2.out'
    }, 1.00 * k)
    .to('.roots-mid', {
      opacity: 1,
      yPercent: 0,
      duration: 1.80 * k,
      ease: 'power2.out'
    }, 1.20 * k);

  /* ----- Movement 4 — Emergence of Ecological Scale (2.5 – 4.5s) ----- */
  // Atmosphere first (already rising). Then mass: the foreground
  // pneumatophore field — the felt scale of root architecture
  // relative to a body. Then specificity: light shafts through the
  // canopy and humid foreground fog. No species, no labels.
  tl.to('.roots-fore', {
      opacity: 1,
      yPercent: 0,
      scale: 1.0,
      duration: 1.80 * k,
      ease: 'power2.out'
    }, 2.50 * k)
    .to('.fog-fore', {
      opacity: 0.85,
      duration: 1.50 * k,
      ease: 'sine.out'
    }, 2.80 * k)
    .to('.lightshafts', {
      opacity: 0.7,
      duration: 1.50 * k,
      ease: 'sine.out'
    }, 3.20 * k)
    .to('.mist-rising', {
      opacity: 0.55,
      duration: 1.50 * k,
      ease: 'sine.inOut'
    }, 3.00 * k);

  /* ----- Movement 5 — Settling (4.5 – 6.0s) ----- */
  // Motion decelerates into ambient life. The vignette deepens just
  // enough to feel surrounded. No UI returns; no title card lands.
  // The body class flips to `inhabited-state` purely as a hook for
  // any future atmospheric tweaks; nothing currently keys off it.
  tl.to('.vignette', {
      opacity: 1.0,
      duration: 1.00 * k,
      ease: 'sine.inOut'
    }, 4.50 * k)
    .to('.fog-fore', {
      opacity: 0.65,
      duration: 1.20 * k,
      ease: 'sine.inOut'
    }, 4.80 * k)
    .to('.mist-rising', {
      opacity: 0.40,
      duration: 1.00 * k,
      ease: 'sine.inOut'
    }, 5.00 * k)
    .add(() => {
      document.body.classList.remove('threshold-state');
      document.body.classList.add('inhabited-state');
    }, 5.20 * k);

  return tl;
}

/* ---------- Wiring ---------- */

function init() {
  paintCanopies();
  paintRoots();

  revealThreshold();
  const descent = buildDescent();

  const lensHabitat = document.getElementById('lensHabitat');
  if (!lensHabitat) return;

  // The descent is one-way. Once committed, the homepage is gone —
  // not by routing constraint but by perceptual position.
  let started = false;
  const beginDescent = (ev) => {
    if (started) return;
    started = true;
    if (ev) ev.preventDefault();

    // Audio bed unlocks on the user's gesture; visuals are canonical
    // if audio is blocked or unavailable.
    try { startAmbientAudio(); } catch (_) { /* silent */ }

    // Stop further input without yanking visible affordances mid-recede.
    document.querySelectorAll('.lens').forEach(b => {
      b.setAttribute('disabled', 'true');
      b.setAttribute('aria-disabled', 'true');
    });

    descent.play(0);
  };

  lensHabitat.addEventListener('click', beginDescent);
  lensHabitat.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') beginDescent(e);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
