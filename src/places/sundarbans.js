/*
  Sundarbans — Canonical Cinematic Place Surface
  ----------------------------------------------
  The first published cinematic place in the system. Implements
  Movements 1–5 of the transition grammar as a single continuous
  GSAP timeline. The threshold is composed of layered DOM elements;
  the descent does not navigate, it dissolves the framing while the
  world advances over it. No species, no labels, no UI returns on
  arrival.

  Wired to the verified narrative record at
  cinematic-language/narratives/sundarbans-bengal-tiger-saline-swimmer.ts
  via the canonical narrative registry. Per platform architecture
  §5, this surface extracts only place.name,
  place.editorialPlaceLine, and editorial.fragment from that record.
  Everything else (species identity, taxonomy, IUCN status,
  observation summary, sources, full editorial body) is
  research-surface and is rendered at
  notes/sundarbans-bengal-tiger-saline-swimmer.html, which this file
  does not reference.

  Cinematic grammar locked at v2 of the prototype review series; see
  prototypes/reviews/sundarbans-descent-review-v1.md and v2.md for
  the authored history of this surface's perceptual decisions.
*/

import { gsap } from 'gsap';
import './sundarbans.css';

/* ---------- Canonical narrative extraction ---------- */

/*
  The cinematic surface reads from the same canonical narrative
  registry the research surface uses, but extracts only three
  fields. Per platform-architecture §5, the rest (species name,
  taxonomy, IUCN, observation, sources, full editorial body,
  methodology) is forbidden inside cinematic space.

  The narrative is fetched by id at module load. A missing narrative
  is a programming error for this hard-coded surface (the page is
  bound to one specific narrative), so we throw clearly rather than
  rendering a placeholder. The registry itself never throws; that
  contract is unaffected.
*/
import { getNarrativeById } from
  '../../cinematic-language/narrative-registry.ts';

const NARRATIVE = getNarrativeById('sundarbans-bengal-tiger-saline-swimmer');
if (!NARRATIVE) {
  throw new Error(
    'sundarbans-bengal-tiger-saline-swimmer narrative is missing from the ' +
    'registry. Verify cinematic-language/narratives/ contains the file ' +
    'and that it default-exports a structurally valid EcologicalNarrative.'
  );
}
const PLACE_NAME = NARRATIVE.place.name;
const PLACE_LINE = NARRATIVE.place.editorialPlaceLine;
const FRAGMENT   = NARRATIVE.editorial.fragment;

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

/* ---------- Subjective parallax (depth-honest perception) ---------- */

/*
  The medium is still 2D layered DOM. The depth illusion in the v1 prototype
  was *stacking*: z-ordered planes whose perceived depth dies the moment the
  eye stops moving, because the visual system estimates depth from parallax
  *disparity*, not from z-index. This module replaces that with subjective
  parallax: every depth-cueing layer translates as a function of two inputs:

    1. cursor position (smoothed, low-pass filtered) — represents *where*
       the viewer is looking from, not what they are commanding;
    2. ambient breath — three pairs of sin/cos on incommensurable prime
       periods (17/19/23/29/37/41 s), summed, never aligning to perception.

  Layers move proportional to a depth coefficient. This is the cue real
  vision uses. Amplitude is intentionally tiny (max ~5% viewport at the
  closest layer); above that the wallpaper effect appears, since each
  layer is still a flat silhouette. See cinematic-language/depth-medium-findings.md.
*/

const PARALLAX_LAYERS = ['.canopy-far', '.canopy-mid', '.roots-mid', '.roots-fore'];
const DEPTH_COEF = {
  '.canopy-far':  0.15,  // farther → moves less
  '.canopy-mid':  0.30,
  '.roots-mid':   0.55,
  '.roots-fore':  0.95   // closest → moves most
};
const AMP_X = 32;        // px at extreme cursor / max breath, scaled by depth
const AMP_Y = 18;
const BREATH_GAIN = 0.28;
const CURSOR_SMOOTH = 0.045;

/* ---------- Scene inscription (single annotation interaction) ----------
   A test of whether ecological information can appear without breaking
   the cinematic grammar. Active only in 'inhabited' state. Slowly fades
   from 0 to a barely-visible base opacity over ~5s after entering
   inhabited; sustained cursor stillness then gradually nudges opacity
   up to a still-subtle maximum. No cursor proximity, no hover logic,
   no interaction trigger — the inscription rewards attention measured
   as duration, not pointing.

   The element lives inside .roots-fore in the DOM so it inherits the
   foreground's descent + parallax transforms automatically. */
const INSCRIPTION_BASE_OPACITY = 0.18;
const INSCRIPTION_MAX_OPACITY = 0.45;
const INSCRIPTION_REVEAL_MS = 5000;          // first-fade-in duration after inhabited
const STILLNESS_THRESHOLD_PX = 1.5;          // sub-pixel cursor jitter counts as still
const STILLNESS_BUILDUP_PER_FRAME = 1 / 720; // fills 0 → 1 in ~12s at 60fps
const STILLNESS_DECAY_PER_PX = 0.04;         // ~25 px of movement zeros the accumulator
let inscriptionOpacity = 0;
let inscriptionRevealStart = 0;
let stillnessAccum = 0;                      // 0..1, sustained-stillness measure
const prevCursorTarget = { x: 0, y: 0 };

/** State machine for transform ownership.
 *  threshold  — parallax owns transforms; descent timeline is paused
 *  descending — descent timeline owns transforms; parallax suspends writes
 *  inhabited  — parallax owns transforms again, with rest poses captured
 *               from the descent's final state so post-descent motion is
 *               additive on top of the inhabited geometry.
 */
let descentState = 'threshold';

/*
  Scroll progress (WP8 migration Steps 1 & 3).
  Normalized 0→1 value derived from live scroll position, computed the
  same way src/places/crossing.js's rawP is: scrollY over the total
  scrollable range. scrollDirection tracks whether the most recent
  change was forward or backward — GSAP's tl.add() callbacks fire on
  every crossing of their timestamp in either direction with no
  built-in way to tell which, so the two M5 handoff callbacks below
  read this to behave correctly under reversible scrubbing.
*/
let scrollP = 0;
let scrollDirection = 'forward';
function readScrollProgress() {
  const max = document.body.scrollHeight - window.innerHeight;
  const next = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  if (next !== scrollP) scrollDirection = next > scrollP ? 'forward' : 'backward';
  scrollP = next;
}

/*
  WP8 migration Step 2 — authorization gate, not yet a driver.
  Before the Habitat Lens is chosen, scroll input is not authorized to
  move the descent at all (the threshold/idle experience is exactly as
  before). Once the lens is chosen, scrollDrivesDescent becomes true,
  retiring the old click-triggered autoplay (descent.play(0)) as the
  descent's driver. Nothing yet reads scrollDrivesDescent to call
  descent.progress(scrollP) — that wiring is Step 3. This step only
  ensures the old and new drivers are never both active at once.
*/
let scrollDrivesDescent = false;

const cursorTarget   = { x: 0, y: 0 };
const cursorSmoothed = { x: 0, y: 0 };
const restPose = Object.create(null);   // selector → { x, y } in px

function updateCursorFromEvent(clientX, clientY) {
  cursorTarget.x = (clientX / window.innerWidth)  * 2 - 1;
  cursorTarget.y = (clientY / window.innerHeight) * 2 - 1;
}

function bindParallaxInput() {
  window.addEventListener('mousemove', (e) => {
    updateCursorFromEvent(e.clientX, e.clientY);
  }, { passive: true });
  // Touch users get breath-only by default. Single-finger tracking would
  // conflict with scroll/zoom intent; device orientation is the natural
  // input here and is intentionally out of this surgical pass's scope.
}

function captureRestPoses() {
  for (const sel of PARALLAX_LAYERS) {
    const el = document.querySelector(sel);
    if (!el) continue;
    restPose[sel] = {
      x: Number(gsap.getProperty(el, 'x')) || 0,
      y: Number(gsap.getProperty(el, 'y')) || 0
    };
  }
}

function resetParallaxOffsets() {
  // Called on entering 'descending' so the descent's tweens start from a
  // clean transform baseline (no stray parallax-induced x/y).
  for (const sel of PARALLAX_LAYERS) {
    const el = document.querySelector(sel);
    if (!el) continue;
    gsap.set(el, { x: 0, y: 0 });
  }
}

function rafLoop(t) {
  // Smooth cursor toward target.
  cursorSmoothed.x += (cursorTarget.x - cursorSmoothed.x) * CURSOR_SMOOTH;
  cursorSmoothed.y += (cursorTarget.y - cursorSmoothed.y) * CURSOR_SMOOTH;

  // Breath: three sin/cos pairs on prime-incommensurable periods.
  // Amplitude bounded to roughly [-1, 1] like cursorSmoothed.
  const breathX =
    0.5 * Math.sin(t / 17000) +
    0.3 * Math.sin(t / 23000 + 1.7) +
    0.2 * Math.sin(t / 41000 + 0.4);
  const breathY =
    0.5 * Math.cos(t / 19000) +
    0.3 * Math.sin(t / 29000 + 0.9) +
    0.2 * Math.cos(t / 37000 + 0.2);

  if (descentState === 'threshold' || descentState === 'inhabited') {
    const offX = cursorSmoothed.x + breathX * BREATH_GAIN;
    const offY = cursorSmoothed.y + breathY * BREATH_GAIN;

    for (const sel of PARALLAX_LAYERS) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const coef = DEPTH_COEF[sel];
      const rest = restPose[sel] || { x: 0, y: 0 };
      // Negative sign produces correct parallax: cursor right → near layers
      // shift left more than far layers, simulating a leftward perspective shift.
      const dx = -coef * offX * AMP_X;
      const dy = -coef * offY * AMP_Y;
      gsap.set(el, { x: rest.x + dx, y: rest.y + dy });
    }
  }

  // Scene inscription: active only after the descent settles. The element
  // inherits its position via DOM placement (inside .roots-fore); we only
  // animate its opacity here, as a function of (a) time-since-inhabited
  // for the first-pass reveal, and (b) sustained cursor stillness. No
  // hover logic, no proximity coupling. The inscription rewards duration,
  // not pointing.
  const inscription = document.getElementById('sceneInscription');
  if (inscription) {
    if (descentState !== 'inhabited') {
      inscriptionOpacity = 0;
      stillnessAccum = 0;
      inscription.style.opacity = '0';
    } else {
      if (!inscriptionRevealStart) inscriptionRevealStart = t;
      const revealAge = Math.min(1, (t - inscriptionRevealStart) / INSCRIPTION_REVEAL_MS);
      const baseOpacity = revealAge * INSCRIPTION_BASE_OPACITY;

      // Stillness accumulator: builds slowly when cursor is essentially
      // still, decays with any meaningful motion. The asymmetry is
      // intentional — many seconds of stillness are required to surface
      // what a single small movement returns to barely-visible base.
      const dx = (cursorTarget.x - prevCursorTarget.x) * window.innerWidth / 2;
      const dy = (cursorTarget.y - prevCursorTarget.y) * window.innerHeight / 2;
      const movementPx = Math.hypot(dx, dy);
      if (movementPx < STILLNESS_THRESHOLD_PX) {
        stillnessAccum = Math.min(1, stillnessAccum + STILLNESS_BUILDUP_PER_FRAME);
      } else {
        stillnessAccum = Math.max(0, stillnessAccum - movementPx * STILLNESS_DECAY_PER_PX);
      }
      prevCursorTarget.x = cursorTarget.x;
      prevCursorTarget.y = cursorTarget.y;

      const stillnessNudge =
        stillnessAccum * (INSCRIPTION_MAX_OPACITY - INSCRIPTION_BASE_OPACITY);

      const target = baseOpacity + stillnessNudge;
      inscriptionOpacity += (target - inscriptionOpacity) * 0.04;
      inscription.style.opacity = inscriptionOpacity.toFixed(3);
    }
  }

  parallaxRaf = requestAnimationFrame(rafLoop);
}

/* Principle XVII: the ambient/parallax loop pauses when the tab is hidden —
   a backgrounded tab does not animate or schedule work. Resumption is itself
   a ~400ms Hold before motion resumes, so returning to the tab never catches
   the scene mid-motion. (The GSAP descent/mist tweens run on their own ticker,
   which the browser already throttles when hidden.) */
let parallaxRaf = 0;
let parallaxResumeTimer = 0;
let parallaxRunning = true;

function stopParallax() {
  parallaxRunning = false;
  if (parallaxRaf) { cancelAnimationFrame(parallaxRaf); parallaxRaf = 0; }
  if (parallaxResumeTimer) { clearTimeout(parallaxResumeTimer); parallaxResumeTimer = 0; }
}
function resumeParallax() {
  if (parallaxRunning) return;
  parallaxRunning = true;
  if (parallaxResumeTimer) clearTimeout(parallaxResumeTimer);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  parallaxResumeTimer = setTimeout(() => {
    parallaxResumeTimer = 0;
    parallaxRaf = requestAnimationFrame(rafLoop);
  }, reduce ? 0 : 400);
}

function startParallax() {
  bindParallaxInput();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') resumeParallax(); else stopParallax();
  });
  parallaxRaf = requestAnimationFrame(rafLoop);
}

/* ---------- Ambient mist (post-M5 continuance) ---------- */

/*
  Replaces the v1 "settle" tweens that brought fog-fore and mist-rising to
  fixed final opacities (closure: a movie ending). These tweens use
  random() targets and durations with repeatRefresh, so each cycle picks
  new values and the motion never repeats to perception. Asymptotic
  continuance, not resolution.
*/
function startAmbientMist() {
  gsap.to('.mist-rising', {
    opacity: 'random(0.28, 0.52)',
    duration: 'random(9, 15)',
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    repeatRefresh: true
  });
  gsap.to('.fog-fore', {
    opacity: 'random(0.48, 0.78)',
    duration: 'random(7, 12)',
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    repeatRefresh: true
  });
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

  /*
    WP8 migration Step 5 (revised) — reduced-motion magnitude, not
    suppression, for the layers whose transform is the sole or primary
    carrier of their beat's meaning (per the accepted composition
    audit). For .mist-rising/.water/.roots-mid/.roots-fore, the
    starting offset each tween below animates FROM is reduced by a CSS
    rule in sundarbans.css (not a tl.set() here): an empirical probe
    against this project's installed GSAP confirmed that a .set() at
    timeline position 0 combined with a later .to() on the SAME
    property does not reliably apply on the first .progress() render
    (a real, reproducible GSAP quirk, not this codebase's bug) —
    whereas GSAP reading a percentage-based CSS transform as a tween's
    starting value already works correctly (proven by the existing,
    unmodified normal-motion behavior). The CSS override is therefore
    the reliable mechanism; see sundarbans.css.
  */

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
      // WP8 Step 5 (revised): canopy-mid has no separate opacity cue or
      // base offset (unlike the .set() layers above) -- this tween's
      // target values ARE its entire motion, so the target itself is
      // scaled by k. At k=1.0: yPercent=-7, scale=1.06 (unchanged).
      yPercent: -7 * k,
      scale: 1 + 0.06 * k,
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

  /* ----- Movement 5 — Settling (4.5 – ∞) ----- */
  // The world does not conclude. The fog-fore and mist-rising
  // "settle" tweens are replaced with non-looping random tweens that
  // never resolve, so opacity drifts asymptotically. At the close of
  // M5 the parallax system takes ownership of transforms with rest
  // poses captured from the descent's final state, so post-descent
  // motion is additive on top of inhabited geometry rather than a
  // separate ambient loop.
  //
  // WP8 migration Step 3 — reversibility guards (requirement 9):
  // GSAP fires an .add() callback on every crossing of its timestamp
  // in either direction, with no built-in way to distinguish them, and
  // empirical testing against this project's installed GSAP confirmed
  // it (a same callback fires on forward AND backward crossings). Two
  // adaptations were required; the tweens, durations, easing, and
  // keyframes above are unchanged.
  let ambientMistStarted = false;
  tl.add(() => {
      // startAmbientMist() creates two infinite-repeat tweens; calling
      // it again would stack duplicates. Guarded to fire once, only
      // going forward. Deliberately NOT stopped on a later backward
      // crossing: once started it is a slow (9-15s) independent drift
      // layered under the timeline's own value for the same
      // properties — killing/restarting it on every back-and-forth
      // crossing was judged more disruptive (visible tween restarts)
      // than leaving it running quietly. This is the one explained,
      // deliberate residual difference from a single-direction fire.
      if (scrollDirection === 'forward' && !ambientMistStarted) {
        startAmbientMist();
        ambientMistStarted = true;
      }
    }, 4.50 * k)
    .add(() => {
      if (scrollDirection === 'forward') {
        // Hand transform ownership back to parallax. The descent's
        // yPercent/scale on each layer remain in GSAP's tracked state;
        // parallax only modifies x/y on top of those values.
        captureRestPoses();
        descentState = 'inhabited';
      } else if (descentState === 'inhabited') {
        // Reverse the handoff: re-suspend idle parallax so it does not
        // fight the timeline's own scrubbed transforms while scrolling
        // back into the descent's active range.
        descentState = 'descending';
      }
    }, 5.20 * k);

  return tl;
}

/* ---------- Wiring ---------- */

function init() {
  paintCanopies();
  paintRoots();

  // Apply the three cinematic-extracted fields from the canonical narrative.
  // No species name, no observation, no sources are rendered on this surface.
  // Per platform-architecture §5: cinematic extracts place.name,
  // place.editorialPlaceLine, and editorial.fragment — nothing else.
  document.title = `${PLACE_NAME} \u00b7 Descent`;
  const desc = document.getElementById('docDesc');
  if (desc) desc.setAttribute('content', PLACE_LINE);
  const inscription = document.getElementById('sceneInscription');
  if (inscription) inscription.textContent = FRAGMENT;

  // Subjective parallax begins immediately, in 'threshold' state.
  // The threshold is no longer a still scene — it has perceptual
  // presence relative to the viewer the moment the page loads.
  startParallax();

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

    // Hand transform ownership to the descent timeline. The rAF loop
    // keeps running but suspends its writes while in 'descending'.
    descentState = 'descending';
    resetParallaxOffsets();

    // WP8 migration Step 2: scroll progress is now the only authorized
    // driver of the descent going forward. The prior autoplay trigger
    // (descent.play(0)) is retired here rather than left to compete
    // with it once Step 3 wires scrollP to descent.progress().
    scrollDrivesDescent = true;
  };

  lensHabitat.addEventListener('click', beginDescent);
  lensHabitat.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') beginDescent(e);
  });

  // WP8 migration Step 3: once authorized (scrollDrivesDescent, set by
  // beginDescent above), live scroll position drives the existing
  // descent timeline's progress directly — no autoplay, no separate
  // clock. Registered after readScrollProgress so scrollP is current
  // for each scroll event before this reads it.
  function driveDescentFromScroll() {
    if (!scrollDrivesDescent) return;
    descent.progress(scrollP);
  }

  readScrollProgress();
  window.addEventListener('scroll', readScrollProgress, { passive: true });
  window.addEventListener('scroll', driveDescentFromScroll, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
