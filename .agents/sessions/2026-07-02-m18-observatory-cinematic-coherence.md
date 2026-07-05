# Session diary — M18: Observatory cinematic coherence review

**Date:** 2026-07-02
**Milestone:** M18
**Role:** Creative Director + UX Reviewer
**Branch:** `feat/exploration-prototypes-and-data-pipelines`
**Fix commit:** `c0ff155`

---

## Brief

Audit the three cinematic surfaces — Sundarbans (`places/sundarbans.html`),
The Crossing (`places/crossing.html`), East Pacific Rise (`places/epr-vents.html`)
— **together, as one Observatory**, not as separate pages. Review the user
experience first; inspect implementation only to confirm experiential findings.
Produce Critical / Important / Nice-to-have tiers. Implement Critical only.
Constraints: no architecture, refactoring, infrastructure, DwC-A, atlas, or
governance changes.

## Review method

Read against all three doctrine documents (`cinematic-vocabulary.md`,
`pacing-principles.md`, `editorial-voice.md`) as a single continuous
first-viewing across the three places, in the order a viewer would meet them.
Implementation (JS/CSS/HTML) was read after forming the experiential read, to
confirm each finding's mechanism.

## The Observatory as one experience — the central finding

The three surfaces do not share one cinematic **delivery model**:

- **The Crossing** and **EPR** are the coherent core: scroll-driven Canvas 2D,
  a shared engine (identical scroll smoothing `p += (rawP-p)*0.085`, identical
  7-beat model and `beatOpacity`, byte-identical caption/`.begin` typography,
  the same luminance-dip mechanism, "settle is not a tween" ambient motion).
  Read back-to-back they are unmistakably the same instrument in two biomes —
  cool bioluminescent surface crossing vs. warm abyssal descent.
- **Sundarbans** is a different instrument: a click-triggered GSAP timeline
  over layered DOM/SVG, with cursor-driven parallax, a Web Audio ambient bed,
  a stillness-rewarded inscription, its own type stack ("Iowan Old Style"
  first), and a vignette. It is the "first surface" and carries its own
  established grammar.

A viewer moving through the Observatory therefore meets two different contracts
for how a place begins and advances (you *click a lens and watch* vs. *you
scroll and drive*). This is the Observatory's central coherence tension. It is
**architectural** to resolve and is out of this task's scope; logged to the
backlog for a Chief Architect ruling, not fixed here.

---

## 1. Critical issues (must fix) — IMPLEMENTED

### C1 — Render loops never pause when the tab is hidden (Principle XVII)

**Present uniformly in all three surfaces.** Every surface schedules
`requestAnimationFrame` unconditionally and forever: `frame()` in
`crossing.js` and `epr-vents.js`, `rafLoop()` in `sundarbans.js`. Principle
XVII codifies loop-pause-on-hidden as **non-negotiable**, and requires the
resumption from a backgrounded state to itself be a **~400ms Hold** so the
viewer's return-to-tab does not catch the scene mid-motion. Neither the pause
nor the resumption Hold existed anywhere. (The M17 diary had already flagged
this as an unimplemented systemic gap — item C — across the surfaces.)

Honest scope note: modern browsers already throttle/suspend rAF in hidden
tabs, so the raw CPU symptom is partly mitigated by the platform. The value of
this fix is (1) explicit compliance with a codified non-negotiable Principle,
(2) the **sanctioned ~400ms re-entry Hold**, which the browser does *not*
provide, and (3) correctness on engines that do not fully suspend rAF. Because
it is the one place all three surfaces uniformly break a "non-negotiable"
Principle, and it is fixable within the constraint set, it is the session's
Critical fix.

**Fix.** On the two canvas surfaces (identical block, preserving their
consistency): a `visibilitychange` handler cancels the rAF handle when hidden;
on returning to visible it clears any pending resume, waits ~400ms (0 under
reduced motion), resets `t0 = performance.now()` so the ambient clock does not
jump, then resumes `frame`. Sundarbans gets the same pattern adapted to its
`rafLoop` (`stopParallax` / `resumeParallax`, listener registered inside
`startParallax`). Sundarbans' GSAP descent/mist tweens run on GSAP's own
ticker, which the browser throttles when hidden, and were deliberately left
untouched to avoid pausing an in-flight descent (which would be an
architectural change to the timeline's ownership).

Files: `src/places/crossing.js`, `src/places/epr-vents.js`,
`src/places/sundarbans.js`. Build green; three place bundles recompiled.

---

## 2. Important improvements (should fix) — NOT implemented (out of scope)

- **I1 — Interaction-model divergence (the central tension above).** Sundarbans
  is click/GSAP-timeline; Crossing and EPR are scroll/Canvas2D. Resolving it —
  whether by porting Sundarbans to the scroll-canvas grammar or by formally
  sanctioning two lawful delivery models in doctrine — is architectural and
  needs a Chief Architect ruling. Backlog item 5(a).

- **I2 — Sundarbans vignette vs Article V.** `.vignette` renders at opacity
  0.55 with corner alpha ramping to ~0.20–0.36. Article V forbids "vignettes
  that visibly darken the corners as a frame device … the viewer must not be
  able to name the effect." The CSS carries a documented defense ("edge
  attenuation, not a film vignette"), and it is the *only* surface with a
  vignette — so it is both a possible Article V violation and a cross-surface
  inconsistency. Left to a deliberate decision rather than overridden under a
  "must fix" banner. Backlog 5(b).

- **I3 — Type-stack drift.** Sundarbans leads with `"Iowan Old Style", Georgia,
  …`; Crossing and EPR lead with `Georgia, "Times New Roman", …`. On systems
  with Iowan Old Style (macOS), Sundarbans renders in a different serif than
  the other two places; on Windows all fall back to Georgia and match. Neutral
  tones also differ slightly (`#d6d2c8`/`#ece6d8` vs `#e9e4d9`). One Observatory
  should have one typographic voice. Backlog 5(c).

- **I4 — EPR arrival framing vs The Crossing.** EPR's camera settles the vent
  field at `ay: H*0.50` (vertical centre); The Crossing settles its subject at
  `ay → H*0.60` (lower third), which better reads as *arrival at the bottom of
  a descent*. For two shared-engine descents, the framing convention should
  match. (Also raised in M17 as improvement B.) Backlog 5(d).

- **I5 — Editorial captions are hidden from assistive tech.** On both canvas
  surfaces the caption layer is `aria-hidden="true"`, so the editorial
  fragments — which are genuine content — are invisible to screen readers, and
  the JS-enabled page exposes nothing (noscript only covers JS-off). Pending
  the forthcoming accessibility doctrine (pacing-principles §11). Backlog 5(e).

- **I6 — Performance unmeasured.** EPR's peak `lighter`-mode draw count
  (motes + vent particles + thermal glow) and the Crossing's mote field have no
  quoted baseline framerate (Principle XVI / Article XV). Should be measured
  before EPR gains further canvas load (e.g. the atlas). Backlog 5(f).

---

## 3. Nice-to-have refinements (could improve) — NOT implemented

- **N1 — `<title>` suffix register.** Runtime titles are "{place} · Descent"
  (Sundarbans), "{place} · Crossing", "{place} · Vent Field". Three different
  registers (a movement, a journey, a place-type). Harmonising the suffix
  convention would tighten the Observatory's chrome.
- **N2 — `.begin` affordance wording.** "descend" (EPR) is exact to its
  motion; "begin" (Crossing) is generic. A crossing-specific verb ("set out",
  "cross") would match EPR's specificity. Both are quiet and in-register; minor.
- **N3 — EPR framing beat demonstrative.** "No light reaches the bottom of
  this." — "this" is a weak demonstrative on repeat viewing (also noted in
  M17). A place-anchored phrasing could read better.
- **N4 — EPR per-vent plume lean / seafloor baseline / zoom-scaled snow** —
  carried over from M17's nice-to-have list; still open.

---

## Verification

- `npm run build` → green (`check-narratives` passed via prebuild; vite build
  ✓). Place bundles recompiled: crossing 6.45→6.77 kB, epr-vents 6.57→6.88 kB,
  sundarbans 7.52→7.88 kB (added visibility handlers).
- Fix committed at `c0ff155`; working tree clean after docs commit.

## Outcome

The Observatory's scroll-canvas core (Crossing + EPR) is strongly coherent.
Its deepest coherence gap — Sundarbans' separate delivery model — is
architectural and deferred to a ruling. The one uniformly-present doctrine
violation that was fixable within scope (Principle XVII loop pause) is fixed
across all three surfaces. All other findings are logged to the backlog with
their doctrine citations for a future session to decide and act on.
