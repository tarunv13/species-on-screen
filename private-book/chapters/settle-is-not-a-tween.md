# Seed: Settle is not a tween

> Status: seed draft, not for publication.
> Class: Part X §1 chapter (perceptual finding).
> Companion: `private-book/architecture/book-architecture.md` Part X §1; Part VII §2.
> Generated: 2026-05-26.

---

The finding comes from one prototype and one revision. The Sundarbans descent prototype (PR #38, 2026-05-25) implemented Article III's four-phase Descent through a five-movement timeline: M1 Acknowledgement, M2 Surrender of frame, M3 Loss of vantage, M4 Emergence of ecological scale, M5 Settling. The v1 review (PR #39, same day) flagged M5 as one of two High-severity items. The v2 pass (PR #40, roughly thirty minutes after the review merged) replaced M5's mechanism. The new mechanism produces a perceptual register the project had not previously named, and the doctrine cannot describe a Settle phase without reference to it.

## M5 as built in v1

The v1 implementation closed the descent with three concurrent operations. The vignette CSS opacity tweened from its default to 1.0 across the final phase. The `fog-fore` layer's opacity tweened to a fixed target. The `mist-rising` layer's opacity tweened to a fixed target. A body-class flip from `threshold-state` to `inhabited-state` fired at the moment M5 began, with hooks attached to either class.

The choreography read on screen as: vignette darkens around the frame's edge; foreground fog and rising mist resolve to their settled values; the page enters a stable inhabited state in which animations have completed and the scene is held.

The PR #38 description named the closing operation: *vignette deepens, motion decelerates into ambient life. No UI returns. No title card. The threshold becomes perceptually unreachable.* The mechanism was internally consistent. Each tween moved toward a value, reached it, and stopped.

## What the v1 review said

The v1 review (`prototypes/reviews/sundarbans-descent-review-v1.md`) named two High-severity items. The depth-of-medium item — *depth is performed, not embodied* — produced the v2 subjective-parallax system and is not the subject of this chapter. The other High-severity item read: *M5 reads as scene-ending rather than world-continuing.*

The review's framing is observational. The vignette tween toward opacity 1.0 was a closing-iris gesture borrowed from the grammar of scene endings. A fade to fixed values across the atmospheric layers produced a state in which all motion in the frame had reached its target and stopped. The body-class flip surfaced the transition explicitly; an inhabited-state class is a marker that the scene has arrived at its destination configuration.

Each of these mechanisms is a tween in the standard sense: a transition from a starting value to an ending value, with the ending value being the one that holds. Tweens converge. M5 was a tween that converged, and the convergence was visible on screen as the scene completing.

## Why "scene-ending" contradicted ecological continuity

Article III's grammar — Hold, Drift, Crossing, Settle — names each phase by what it does to the visitor's relationship to the world. The first three phases bring the visitor into a place. The Settle is the phase in which the place exists without the descent.

A scene-ending is the opposite. It is a state in which the descent exists without the place. The image on screen has resolved; the animation has converged; what is left is the stilled frame of a movement that is over. A film cut would follow this beat. The scene is closed.

A place is not closed. Real places do not converge. Tides do not converge. Light does not resolve. The Settle's contract is a state that places do not reach. The v1 implementation produced convergence at the exact moment the phase required non-convergence.

The contradiction is structural, not stylistic. Any tween-based settling will produce convergence by definition: a tween's contract is that it reaches its target. The Settle therefore cannot be a tween. The phase has to be implemented by something other than animation toward a value.

## The v2 mechanism

PR #40 replaced M5 with three concrete changes.

The vignette opacity tween toward 1.0 was deleted. The vignette's CSS default opacity was lowered from 0.85 to 0.55, with the change documented as *edge attenuation, not film vignette*. After the change, the vignette is a constant property of the frame's edges throughout and after the descent; it does not deepen at the close.

The `fog-fore` and `mist-rising` settle tweens were replaced with `gsap.to(...)` calls using `random()` targets, `random()` durations, and `repeatRefresh: true`. The construction is operationally specific. `random()` in GSAP returns a different value each time the tween's `repeat` cycle begins. `repeatRefresh: true` instructs GSAP to re-evaluate the parameters on every cycle rather than caching them. Each cycle of fog or mist therefore moves toward a new opacity target across a new duration. The motion drifts asymptotically; it does not converge.

The body-class flip from `threshold-state` to `inhabited-state` was removed, along with the hooks attached to either class. The phase boundary was retired as a state-machine event. Without the flip, the scene has no point in time at which it is *now inhabited* as distinct from descending; the phases are ordered by the timeline's clock alone.

The build verifies the change. After PR #40, no class transition fires in M5; the vignette opacity is a constant; the fog and mist layers run a permanent low-amplitude drift loop on randomized parameters.

## Why the finding is perceptual, not animation-engineering

The finding is named *settles are not tweens* in `cinematic-language/depth-medium-findings.md`. The phrase is operational shorthand for the contract: the Settle phase cannot be implemented by any animation that converges to a target.

The `random()` + `repeatRefresh: true` mechanism is one consequence of the contract; other implementations satisfy it. The contract itself names a perceptual fact: a frame reads as a continuing place if and only if no element in it has reached a destination value. As long as one element is moving without resolution, the frame continues. As soon as every element is at rest, the frame has ended.

The v1 implementation had not been a poor parameter choice. It had been a structurally wrong mechanism. The v2 pass did not improve M5; it replaced the mechanism with one that satisfies the contract.

The finding is therefore not a result of further animation tuning. It is a property of motion in the cinematic-ecology medium: ambient layers must drift on parameters that change per cycle, and no element in the closing phase may converge.

## Operational consequences in doctrine

The finding did not produce a new Article. Article III's existing fourth phase already named the Settle; the consolidation walk (PR #61) added Article XVII for atmospheric hierarchy and made no addition to Article III. What the finding produced was a binding constraint on Article III's implementation, recorded in `depth-medium-findings.md` as advisory.

The doctrine's auto-loaded layer therefore carries the contract by reference. `depth-medium-findings.md` is `cinematic-language/`-resident and is not auto-loaded; the steering layer's Article III is auto-loaded and references the Settle's continuance property. A reviewer adjudicating an M5 implementation cites Article III; the implementation must satisfy the continuance contract; the contract's text lives in the findings document.

The architecture's classification holds the finding as advisory. `depth-medium-findings.md` self-labels as advisory, is not promoted to canonical, and is referenced by name in the steering quartet rather than reproduced in it. The continuance contract enters PR review by indirection rather than by literal citation. The indirection is intentional. A direct doctrinal clause stating *no Settle may be a tween* would harden a finding that is precise about a medium and a phase, not about animation in general.

## What carried forward

The Sundarbans canonical place (`places/sundarbans.html`, promoted from prototype in PR #59) inherits the v2 settle mechanism unchanged. The fog and mist drift loops run on randomized parameters; the vignette is a constant attenuation; no class transition fires in M5. The promotion preserved the v2 timeline byte-for-byte; the cinematic grammar locked at the v2 review is the grammar in production.

The mangrove canonical descent specification (`task-mangrove-prototype/2026-05-25-canonical-mangrove-descent-spec.md`) inherits the contract by reference. The spec's six-phase descent ends with a settling phase whose grammar is described as atmospheric drift with no resolved state. The construction is the v2 mechanism applied to a different biome.

The salt-flat-exposure counter-test (PR #41 and PR #47) tested whether the contract held in a sparse ecology. The M3 convergence in PR #47 retired *horizon-pull* and *heat-distance* candidates and converged on atmospheric recession with edge softening — distant-flat opacity drifting on randomized parameters, with subtractive contrast removal at the horizon. The mechanism is the v2 settle's contract, recovered from a different starting condition. The salt-flat closing does not converge; the horizon dissolves without resolving.

The finding is the medium's contract. Any cinematic place implementing Article III's Settle must satisfy it. The settle is not a tween.
