# Sundarbans Descent — Cinematic Review v2

**Subject:** `prototypes/sundarbans-descent.html` after the perceptual integrity pass
**Lens of review:** the two High-severity items from v1 only
**Status:** v2 prototype, perceptual integrity pass. Not production candidate.

---

## Frame

This review is scoped to the two structural failures named in v1:

1. **M5 read as scene-ending, not world-continuing** (cinema-vs-ecology conflation)
2. **Layered DOM was stacking, not depth** (medium honesty gap)

No other surfaces were touched. No new features were added. No visual escalation. v1 review (`sundarbans-descent-review-v1.md`) remains the canonical baseline for everything else.

---

## What v2 Changed

### M5 — From resolution to continuance

- Deleted the `.vignette → opacity 1.0` tween. The vignette no longer arrives as a closing iris.
- Reduced the vignette's CSS default from `opacity: 0.85` to `opacity: 0.55`. It is now edge attenuation, not a film vignette.
- Replaced the fog-fore and mist-rising "settle" tweens (which resolved to fixed opacities at fixed durations — the literal grammar of cinematic closure) with `gsap.to(...)` calls using `random()` opacity targets, `random()` durations, and `repeatRefresh: true`. Each cycle picks new values. The motion never repeats to perception. There is no settled state.
- Removed the `threshold-state` / `inhabited-state` body-class flip and its dead hooks. The "scene complete" state machine is gone.

### Depth — From stacking to subjective parallax

- Introduced a single `requestAnimationFrame` loop driving every depth-cueing layer (canopy-far, canopy-mid, roots-mid, roots-fore) by:
  - smoothed cursor position (low-pass, `0.045` lerp), and
  - an ambient breath built from three sin/cos pairs on prime-incommensurable periods (17/19/23/29/37/41 s), summed and never aligning.
- Each layer is given a depth coefficient (`0.15`, `0.30`, `0.55`, `0.95`). Translation is proportional to depth.
- Retired the CSS keyframe `canopy-drift-far` and `canopy-drift-mid` animations — they were obvious loops and they conflicted with the new system.
- A three-state machine (`threshold` → `descending` → `inhabited`) governs transform ownership: parallax owns transforms before and after the descent; GSAP owns transforms during. On entering `inhabited`, parallax captures rest poses from GSAP's final state, so post-descent motion is additive on top of inhabited geometry rather than a fresh ambient layer.

---

## What v2 Resolved

- **M5 no longer reads as a scene ending.** There is no closing iris, no easing into stillness, no frame composition that suggests credits-roll. The world keeps doing what it was doing.
- **Spatial depth is no longer purely an illusion of stacking.** When the cursor moves, near layers shift more than far layers — the actual cue the visual system uses to estimate depth. The illusion holds beyond the moment of motion because breath continues when the cursor is still.
- **The threshold has perceptual presence from the moment it loads.** Pre-descent, the layers respond to the viewer's position. The threshold is no longer a still postcard.
- **Obvious loops are gone from the most-detected layers.** Canopy drift no longer cycles. Mist and fog opacity no longer settle.

---

## What v2 Did Not Resolve

- **Each layer is still a flat silhouette.** Parallax cues *between* layers, but a sufficiently large cursor sweep would still reveal the wallpaper. Amplitude is held subliminal (max ~5% of viewport on the closest layer) precisely to stay below this threshold. Above it, the medium re-flattens.
- **Touch users get no parallax.** Mobile gets the breath component only. Device orientation could fill the gap; intentionally out of this pass's scope.
- **The pre-orientation scene is still not mid-event.** Tide is not rising. Weather is not acting. Nothing in motion reads as ecological consequence. The architecture's call for "embeddedness in consequence" remains unimplemented. v1 noted this; v2 did not address it.
- **Acoustic specificity is unchanged.** Drone + filtered noise still reads as humid forest, not Sundarbans. No cicada layer, no water lap, no distant boat. Acoustic event scripting was not in scope.
- **The grammar still doesn't carry across to other lenses.** Ecosystem and Species descents are unbuilt. The Habitat descent shape must not become a template; that work belongs to a future stance-distinct pass.

---

## New Observations Emerging from v2

### The breath does most of the work

Cursor parallax is the *honest* part of the system, but the breath is what makes the world feel inhabited when no one is touching anything. Without it, the post-M5 settle would still feel resolved; the user would simply be standing in a stack of frozen planes. Breath alone — even with no cursor input — reads as "the world is going on."

This is a useful general finding. **Breath is more important than cursor parallax** for embodied stillness. The depth-cue work is welcome bonus.

### The "wallpaper threshold" is real and low

In testing the chosen amplitudes, the closest layer (`roots-fore`, coef 0.95) shifts up to ~30 px at the corners of a typical viewport. That is approximately at the limit. Increasing amplitude even modestly shatters the illusion: the silhouettes start sliding visibly across each other and the user perceives "layers moving" instead of "depth." The honest amplitude is small. Future tuning has very little headroom upward.

### The state-machine handoff is invisible

The transition from descent-owned transforms to parallax-owned transforms at the close of M5 happens at `5.20 * k` seconds. Watching the prototype, this handoff is undetectable; the world continues moving without any perceptible kink. This is the desired behavior, and it confirms that GSAP's tracked transform model (separate `x`, `y`, `xPercent`, `yPercent`, `scale` properties composed into one `transform` string) was the right substrate for the strategy. A naive substrate would have produced a snap.

### M5 as continuance is a pacing principle, not a tween

The lesson is broader than this prototype. **Settles must end with motion still present, not eased to zero.** A scene that ends a transition with `sine.inOut → 0` is a cinema scene. A scene that ends with `random(...)` ambient drift is an ecology. This belongs in `cinematic-principles.md §2` (it is already implied by "decelerate into continuance, not stillness," but v2 makes it concrete).

---

## Pacing Re-Verdict

| Movement | Window | v1 verdict | v2 verdict |
|---|---|---|---|
| M1 — Acknowledgement | 0.00–0.45s | Tight | Unchanged |
| M2 — Surrender of Frame | 0.30–1.50s | Strongest | Unchanged |
| M3 — Loss of Vantage | 1.00–3.00s | Competent, no asymmetric beat | Unchanged. Now augmented by parallax post-descent — depth is felt rather than performed once parallax takes over. |
| M4 — Emergence of Scale | 2.50–4.50s | Slightly concurrent | Unchanged |
| M5 — Settling | 4.50–6.00s | Read as scene ending | **Resolved.** No vignette landing, no resolved opacities, no body-class arrival event. Asymptotic continuance via random non-repeating drift, depth-honest motion via parallax handoff. |

---

## Updated Severity Map

| Failure | v1 severity | v2 severity | Notes |
|---|---|---|---|
| Depth is performed, not inhabited | High | **Medium** | Materially improved by subjective parallax. Still bounded by 2D silhouettes — the wallpaper threshold is the new ceiling. |
| M5 reads as resolution | High | **Resolved** | Continuance grammar in place. |
| Specificity generic | Medium | **Medium** (unchanged) | Out of scope for this pass. |
| UI opacity tween underneath mist | Low | Low (unchanged) | Out of scope. |
| Vignette in M5 | Low | **Resolved** | Default lowered, landing tween deleted. |
| Static pre-orientation | Medium | **Medium** (unchanged, partially mitigated) | Parallax breath gives the threshold *perceptual* life, but ecological events are still absent. |
| Touch lacks parallax input | (new) | Low | Acceptable. Breath continues. Device orientation is a future consideration. |

---

## What Still Should Never Change (additions to v1's list)

- **Settles do not resolve.** Any tween whose final value is fixed and reached by a smooth ease is ending a scene. Settles must hand off to non-repeating ambient.
- **Subjective parallax amplitude is subliminal, not interactive.** If the closest layer's max shift exceeds ~5% of viewport, the prototype has crossed into the tilt-card idiom and must be reduced.
- **Breath is mandatory.** Cursor parallax alone makes the world conditional on the user. Breath ensures the world has its own continuity. Removing breath while keeping cursor parallax is a regression.
- **Loops with periods under ~30s on visible motion are forbidden.** They reveal themselves in a session. Use random non-repeating tweens, or noise-driven drivers, or incommensurable-period sums.

---

## Verdict

The v2 pass closes both High-severity items from v1.

- **M5:** the cinema-vs-ecology conflation is gone. The world continues.
- **Depth:** the medium is meaningfully more honest. Stacking has been replaced with a real parallax system. The remaining ceiling — flat silhouettes — is a function of the medium's substrate, not its grammar.

The prototype is now **directionally complete** *and* **perceptually honest within its medium.** The next axis of honesty (ecological events, acoustic specificity, place-specific tide and weather) is the v3 conversation, when called.

Findings on the depth medium itself are recorded separately in `cinematic-language/depth-medium-findings.md`.
