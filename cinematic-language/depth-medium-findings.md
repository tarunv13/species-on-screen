# Depth-Medium Findings

**Status:** experimental findings, advisory
**Source:** the v2 perceptual integrity pass on the Sundarbans descent prototype
**Scope:** what we learned about ecological depth in 2D layered DOM and what it implies for future agents

This document is not a specification. It records what the v2 experiment proved, what it disproved, and what discipline must accompany any future use of pointer-driven or breath-driven motion in this project.

---

## 1. The Question

The v1 prototype proved the *grammar* of the threshold-to-descent transition was implementable. It did not prove the *medium* could carry the grammar's claim of "ecological embeddedness." Layered DOM with z-index produces stacking; stacking is not depth.

The v2 pass tested one experimental answer: **can subjective parallax make 2D DOM perceptually depth-honest enough to be inhabitable, without crossing into shader spectacle, particle excess, or tilt-card delight patterns?**

---

## 2. The Answer

**Yes, partially, and with named limits.**

Subjective parallax — small per-layer translations driven by cursor position and a non-repeating breath, proportional to a depth coefficient — does materially improve the felt depth of the scene. It does so by performing the actual math the human visual system uses (parallax disparity), rather than by faking depth with z-index.

The ceiling is the silhouette: each layer is still flat, so any displacement large enough to make depth obvious also makes the flatness obvious. Honesty is bought by restraint of amplitude.

---

## 3. What Worked

- **Parallax disparity is the depth cue, not z-index.** Once layers translate proportional to depth, the eye reads depth even from 2D silhouettes. The math is the cue.
- **Breath — three sin/cos pairs on prime-incommensurable periods (17/19/23/29/37/41 s) — produces motion that does not repeat to perception over a session.** No two cycles align. There is no detectable loop point.
- **Breath alone is sufficient for embodiment.** Even with no cursor input, the world reads as "ongoing" rather than "frozen." This is the most important single finding of the pass.
- **GSAP's tracked transform model (`x` / `y` / `xPercent` / `yPercent` / `scale` as separate composed properties) is the right substrate.** It allows a state-machine handoff from descent-owned transforms to parallax-owned transforms with no perceptible kink.
- **A three-state machine (`threshold` / `descending` / `inhabited`) cleanly resolves transform ownership.** Parallax suspends writes during the descent; GSAP keeps `yPercent`/`scale`; parallax resumes adding `x`/`y` on top of GSAP's tracked rest pose.

---

## 4. What Did Not Work

- **Touch devices have no cursor.** Mobile users get breath only. Device orientation would fill the gap and remains a future consideration; using single-finger tracking would conflict with scroll/zoom intent and was correctly excluded.
- **The wallpaper threshold is low.** At amplitudes above approximately `coef × 35 px` for the nearest layer, silhouettes start sliding visibly across each other and the eye perceives "layers moving" instead of "depth." There is very little upward headroom.
- **Parallax does not extend to atmospheric layers.** Sky, haze, light shafts, and fog do not have a depth coefficient — they are diffuse, not localized in depth. Applying parallax to them would falsify their nature. This is correct but limits the effect to ~four layers.

---

## 5. The Wallpaper Ceiling

This is the durable limit of the medium. Future agents must understand it:

- 2D silhouettes can simulate depth via parallax disparity *up to a per-layer displacement of roughly 2–5% of viewport width.*
- Above that, the parallax becomes the visible event — the user notices "things sliding" — and the medium re-flattens.
- This ceiling is a function of *silhouette shape detection*, not a tunable parameter. It cannot be raised by easing curves, smoothing, or amplitude curves. It can only be raised by introducing volumetric mass — i.e., leaving the 2D-silhouette substrate.

When the project chooses to leave 2D silhouettes (whether via WebGL volumetric scenes, real 3D meshes, or scripted parallax with multiple intra-layer planes), the wallpaper ceiling lifts. Until then, this ceiling holds.

---

## 6. The Principle Tension

Cinematic principle §5 says: *"Motion that points at the user is wrong. Motion that continues regardless of the user is right."*

Subjective parallax responds to cursor position. Does it violate §5?

**No, but the line is thin.** The reasoning:

- Parallax does not *react to* the user. It represents *where the user is looking from.* A real ecological scene looks slightly different from different positions; this is not a property of the user's intent, it is a property of the world's geometry under perspective.
- The world does not change. The user's view of it does. This is the closest 2D analog of head/eye motion in real perception.
- The breath component ensures motion exists *regardless of* the user. Cursor parallax is additive on top of an already-moving world, not the sole motion source.

**The compliance is by amplitude, not by category.** If amplitude is increased to the point where pointer-driven motion reads as a hover effect, the system has crossed into delight-pattern territory and must be reduced. There is no "off switch" beyond restraint.

---

## 7. Settles Are Not Tweens

The other finding of the pass is independent of depth and belongs in the cinematic principles canon:

**A settle that resolves is a scene ending. A settle that hands off to non-repeating ambient is ecology continuing.**

The v1 prototype ended M5 with three sine.inOut tweens to fixed final opacities and a vignette landing. That is the literal grammar of a film fade-out. v2 replaced it with `gsap.to(...)` calls using `random()` targets, `random()` durations, and `repeatRefresh: true`. Each cycle picks new values. There is no resolved state. The world has no end.

This is generalizable: **any transition that closes by easing motion to zero has reverted to cinema. Ecology continues.**

---

## 8. Rules for Future Agents

These are operational rules emerging from the v2 pass. They join (and reinforce) the cinematic principles canon.

### On pointer-driven motion

- Pointer parallax is permitted only when:
  - it is paired with an always-on breath component (so the world moves regardless of input);
  - amplitude is subliminal (max ~5% of viewport on the nearest depth-cueing element);
  - input is smoothed (low-pass, no direct mapping);
  - it represents perceptual position, not user command (no zoom-on-click, no fly-to-cursor, no follow-the-mouse creature).
- Pointer parallax is forbidden when:
  - it triggers any UI affordance;
  - amplitude exceeds the wallpaper threshold;
  - it is the sole motion source (no breath companion).

### On breath

- Any inhabited state without a transition active must have a breath component.
- Breath must be built from incommensurable-period sums or noise drivers; never single-period sine.
- Breath drives at minimum one of: layer position, atmospheric opacity, or color temperature. It must be perceptible without being noticeable.
- Breath stops when the user navigates away, never when the user is still.

### On settles

- No settle may resolve to a fixed value via a single ease.
- Settles hand off to non-repeating ambient — `random()`-target tweens, noise drivers, or breath-modulated opacity drift.
- Loops with periods under ~30 seconds on visible motion are forbidden; they reveal themselves in a session.

### On the wallpaper ceiling

- 2D silhouette layers may carry parallax displacement up to ~5% viewport on the nearest layer. Above that, silhouettes flatten.
- A proposal to raise this ceiling is a proposal to change medium. It must be accompanied by a depth-medium proposal that names what replaces silhouettes (volumetric mass, real 3D, intra-layer planes) and what new ceiling that medium implies.

### On state machines

- Any transition that hands transform ownership between systems must use an explicit state machine, not flag-based coupling.
- Rest poses must be captured from the *outgoing* system's final state at handoff, not assumed.
- The handoff frame must be visually undetectable. If it produces a kink, the substrate is wrong.

---

## 9. What This Implies for v3 and Beyond

When the project chooses to escalate the medium — and the wallpaper ceiling will eventually require that — the natural next steps in increasing order of cost and risk are:

1. **Device orientation as parallax input on mobile.** Closes the input asymmetry. No medium change.
2. **Intra-layer parallax planes.** Each silhouette becomes 2–3 closely-spaced planes; depth is finer-grained. Medium is still 2D-stacked but the wallpaper threshold roughly doubles.
3. **Sparse volumetric elements.** A few specific objects (a single foreground root cluster, a single canopy section) become real 3D meshes inside an otherwise-2D scene. Hybrid substrate. New ceiling, new constraints.
4. **Full WebGL scene.** Real depth, real volumetric fog, real refractive water. The wallpaper ceiling is gone. New risks: shader spectacle, performance, and the "WebGL demo" feel — must be governed by an updated principles addendum before commitment.

Each of these is a distinct medium choice with its own honesty profile. None is automatic. Each requires its own findings document if attempted.

---

## 10. Final Note

The depth-medium experiment in v2 succeeded on its own terms: subjective parallax materially improves embodied descent within the limits of 2D silhouette layering. The success was bought by restraint, not by adding capability. This is the durable lesson — every honest cinematic move in this project will likely be bought by restraint. Capability is not the same as honesty, and the project's discipline is the difference.

When in doubt, withhold.
