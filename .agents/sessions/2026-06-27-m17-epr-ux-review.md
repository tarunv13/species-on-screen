# Session diary — M17: EPR cinematic surface UX review

**Date:** 2026-06-27  
**Milestone:** M17  
**Role:** Creative Director + UX Reviewer  
**Branch:** `feat/exploration-prototypes-and-data-pipelines`  
**Commit:** `f227852`

---

## Review method

Surface reviewed as a complete user journey against all three doctrine documents:
- `cinematic-vocabulary.md` (Articles I, III, VI, VII, XVII)
- `pacing-principles.md` (Principles I, III, VII, VIII, XVI, XVII)
- `editorial-voice.md` (Canons I, II, XII, XIII, XVII)

The implementation was read before the doctrine, not the other way around, to simulate a cold first-viewing.

---

## Critical issues — identified and fixed

### C1: Warmth beat / ventA misalignment

**Issue:** Beat 4 — "a warmth with no source above it" — lands at p=0.52. `ventA = smoothstep(0.55, 0.82, p)` means the thermal glow (paintThermalGlow), the base-gradient orange tint (botCol in paintBase), the smoker plumes, and vent particles are all zero until p=0.55. The viewer reads about warmth while looking at pure black. The text makes a promise the visual hasn't kept.

**Fix:** `ventA = smoothstep(0.45, 0.78, p)`.
- At p=0.52: ventA = 0.116 — a faint orange glow at vent positions, trace warm tint at base gradient
- At p=0.68 ("the rock is opening"): ventA = 0.700 — strong glow and plumes visible ✓
- At p=0.78: ventA reaches 1.0 ✓

Also adjusted wormA: `smoothstep(0.73, 0.92)` → `smoothstep(0.70, 0.90)`.
- At p=0.84 ("red in the water where the plumes are"): wormA = 0.78 (was 0.62). Red plume tips more visible when text announces them.

### C2: Vent particles rendered above worm tube bodies

**Issue:** In render(), `paintVentParticles(cam, ventA)` was called AFTER `paintWorms(cam, wormA)`. Upwelling mineral particles (using `globalCompositeOperation = 'lighter'`) rendered visually in front of dark tubeworm tube silhouettes. Glowing orange specks appeared to float in front of solid objects. Violates Article XVII: atmospheric elements must not occupy the inhabitants' visual layer.

**Fix:** Swapped render order. `paintVentParticles` now precedes `paintWorms`. Particles are behind the worm bodies; only the worm plume tips (red radial glows rendered after the tube) appear in front of the particle layer.

### C3: Luminance dip invisible; mid-descent gradient collapsed too early

**Issue (two parts):**

*Part A — depth gradient:* `depth = smoothstep(0, 0.38, progress)` reached full abyss at p=0.38. From p=0.38 to p=1.0, `paintBase` produced a featureless near-black gradient. The three mid-descent text beats (p=0.17, 0.34, 0.52) played over a visually static dark canvas. The gradual darkening that should accompany the text "the water deepens without changing colour" was already complete well before that beat appeared.

*Part B — luminance dip:* `Math.exp(-((p-0.48)²)/(2×0.13²)) × 0.82` adds `rgba(2,3,8, 0.82)` over a background that was already `rgba(2,3,8, 1.0)`. At EPR luminance levels (~3% at p=0.48), the human eye's JND is insufficient to register an additional darkening. The Article III sanctioned cut had no visual manifestation.

**Fix:**
- Extended depth transition: `smoothstep(0.05, 0.60, progress)`. At p=0.17: depth=0.20 (still 80% surface blue visible). At p=0.34: depth=0.55. At p=0.52 (warmth beat): depth=0.97 (nearly complete, but not yet flat). Gradient provides visual texture during the three pre-warmth beats.
- Repositioned dip: centre p=0.48 → p=0.40; sigma 0.13 → 0.06; amplitude 0.82 → 0.75. At p=0.40, the extended gradient still carries a faint dark-blue (`topCol ≈ [5, 12, 22]`), giving the dip something to darken. Narrower sigma ensures the dip resolves (to <10% coverage) by p=0.52 so it doesn't suppress the nascent warmth.
- **Honest assessment:** At these luminance levels, the dip remains at the threshold of perception on most displays. EPR's abyssal darkness means Article III's cut is conceptual as much as visual: the darkness IS the transition. The repositioning and sigma-narrowing are the correct improvements, and are shipped; the biome's physics are the limiting factor.

---

## Important improvements — identified, deferred

**A: Performance budget not measured.** MOTES (260) + VENT_PARTS (112/frame peak) + paintThermalGlow (4 radials, `lighter`) total ~376 `lighter`-mode draws per frame at peak. No measured frame-rate cost quoted. Principle XVI requires measurement on a baseline device before reporting performance status. Deferred: no regression vs The Crossing (300 MOTES only, no separate vent particles), but should be measured before the EPR atlas adds further canvas load.

**B: Camera screen anchor `ay: H*0.50` centers the vent field vertically.** At p=0.9+, the viewer has been "descending" for the full journey — they may expect vents to appear near the bottom of frame. Moving to `ay: H*0.60` would place vents in the lower 40% of the screen, reinforcing the spatial grammar. Deferred: non-breaking improvement; lower priority than the critical fixes.

**C: `document.visibilityState` pause not implemented.** Principle XVII: render loops pause when not visible. This is consistent with The Crossing (also unimplemented); a systemic gap across both surfaces, not EPR-specific.

---

## Nice-to-have — identified, not implementing

i. A seafloor baseline (dark horizontal edge below vent clusters) to ground the vents in basalt  
ii. Per-vent plume lean constants (EPR current runs east-northeast; all four plumes currently use identical wobble phase)  
iii. Marine snow particle radius should scale with camera zoom (currently screen-space, so apparent size doesn't grow as the camera closes in)  
iv. "No light reaches the bottom of this." — "this" is a weak demonstrative; "here" or a more place-specific anchor might read better on repeated viewing

---

## What was not changed

- `places/epr-vents.html` — no change
- `src/places/epr-vents.css` — no change
- BEATS text — no change (all beats passed editorial review under Canon I and Canon II)
- Vent geometry (VENTS, WORM_CLUSTERS, VENT_PARTS) — no change
- Camera function — no change
- `paintThermalGlow`, `paintPlumes`, `paintWorms`, `paintMotes`, `paintVentParticles` function bodies — no change; only render order and gate values changed

---

## Observatory state after M17

`places/epr-vents.html` is the first EPR surface and the first Observatory cinematic place to undergo a formal Creative Director review pass. The three critical fixes address: ecological storytelling coherence (warmth before warmth text), cinematic hierarchy (Article XVII compositing order), and visual texture (extended gradient + repositioned dip). Build green. Working tree clean post-commit.
