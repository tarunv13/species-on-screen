# Sundarbans Descent — Cinematic Review v1

**Subject:** `prototypes/sundarbans-descent.html` and supporting modules
**Lens of review:** cinematic system, not frontend artifact
**Status:** v1 prototype, not production candidate

---

## Frame

The prototype is judged here as a piece of investigative ecological cinema: did the threshold revoke the catalog contract, did the descent dissolve the framing, did the world arrive without being announced? Frontend correctness is taken as table stakes and not discussed.

---

## What Worked

- **The threshold is no longer a map.** The single framing question and three-stance commitment successfully replace browsing with editorial orientation. Plurality at the entry has been broken.
- **UI burial is real, not metaphorical.** The framing question and lenses live inside the atmospheric stack. Mist rising from below physically passes over the typography. The disappearance has an ecological cause, not a system mechanism.
- **Idle layers never pause.** Sky breath, haze drift, canopy drift, and water sheen run on independent periods (38s / 42s / 64s / 48s / 11s) so no two cycles align. The world keeps going during, before, and after the descent.
- **Continuity holds across all five movements.** No black frame. No route change. No layout reassembly on arrival. The descent is one continuous perceptual gesture, not a sequence of screens.
- **The arrival is unannounced.** No title card. No "Sundarbans" label. No on-landing UI. The user is left in a place that does not know it has been entered.
- **One-way commitment is enforced perceptually, not structurally.** There is no back button to disable; there is simply no position from which "back" is meaningful.
- **Procedural geometry and procedural audio.** No image assets, no stock soundtrack. The place is reproducible, re-randomizable, and free of postcard logic.
- **Reduced motion compresses without skipping.** The grammar survives accessibility constraints.

---

## What Failed

- **Layered DOM is stacking, not depth.** Atmospheric perspective (blur, opacity, scale) does meaningful work for ~3 seconds; beyond that the medium reads as 2.5D theater. The "descent of the eye" is performed, not embodied. This is the prototype's largest honesty gap.
- **The pre-orientation scene is still, not mid-event.** The architecture called for ecology already underway — tide rising, weather acting, something in motion that reads as consequence. The current scene is calm. Embeddedness in consequence is asserted, not depicted.
- **Specificity is generic.** The palette is brackish and the root architecture is pneumatophore-shaped, but the place reads as *humid mangrove,* not *Sundarbans.* Tide line, brackish color, the specific feel of the Bengal delta are claimed by the architecture and not yet encoded.
- **UI burial has a small deception.** The framing question's `opacity` is tweened toward 0 underneath the rising mist. The ecological cause is visible, but the mechanism is still a fade. A more honest implementation would leave UI opacity at 1 and let the layer above do the entire occlusion.
- **The "recede" of unchosen lenses reads as blur-and-fade.** The intended semantic — losing relevance — is approximated by a UI animation. The grammar lands, but the gesture is competent rather than meaningful.
- **M5 reads as "scene ending," not "world continuing."** Vignette darkening and globally easing curves give the settle a cinematic-cliché resolution. Cinema concludes; ecology continues. This conflation is small but structurally important.
- **The acoustic field is undifferentiated.** The drone + filtered-noise + bandpass shimmer reads as humid forest. There is no place-specific punctuation — no cicada, no water lap, no distant boat — and no event scripting. Ecology without event is wallpaper.

---

## Emotional Register

- **Where it lands:** quiet, deliberate, faintly ceremonial. Italic editorial typography and the single thin underline establish a literary register, not an app register. The threshold reads as a magazine page; the descent reads as a slow contemplative film.
- **Where it misses:** *contemplative* rather than *embedded.* The user watches the place arrive instead of arriving in it. The viewer's chair is still felt at the edges of the frame.
- **Honesty about register:** literary contemplation is a defensible second-best while volumetric depth is unavailable. It must not be mistaken for the destination.

---

## Spatial Depth Quality

- Atmospheric perspective (haze, blur falloff, scale-with-distance) is the only mechanism currently doing real depth work, and it is doing more than expected.
- Layered translation (yPercent on near/far layers during M3) sells parallax for the duration of the move, then flattens.
- No user-driven parallax (cursor, device tilt) means the depth illusion is non-interactive and therefore brittle.
- Light shafts in M4 lay flat across the scene; they do not filter through canopy mass.
- Verdict: depth is **suggested,** not **inhabited.** Acceptable for v1, not durable for v2.

---

## Pacing Analysis

| Movement | Window | Verdict |
|---|---|---|
| M1 — Acknowledgement | 0.00–0.45s | Tight. Reads as responsive without reading as click. |
| M2 — Surrender of Frame | 0.30–1.50s | The single most successful movement. Mist + occlusion has real grammar. |
| M3 — Loss of Vantage | 1.00–3.00s | Competent. Lacks an asymmetric beat — everything moves at once, which transforms rather than descends. |
| M4 — Emergence of Scale | 2.50–4.50s | Slightly concurrent. Architecture asked for atmosphere → mass → specificity in sequence; implementation runs them more in parallel. |
| M5 — Settling | 4.50–6.00s | Reads as scene ending. Easing curves are too resolved. World should continue without easing into stillness. |

Overall: **competently cinematic, not yet ecologically honest.** The total ~6s envelope is correct. The internal asymmetries are not yet sharp enough.

---

## What Felt Artificial

- The vignette landing at full opacity in M5.
- The synchronous global ease into stillness.
- The flatness of light shafts.
- The undifferentiated audio bed.
- The static pre-orientation scene.
- The blur-fade on receding lenses.
- The opacity tween on the framing question (the mechanism, not the visual cause).

---

## What Felt Ecologically True

- Independent idle drift cycles. Nothing locked to a beat.
- Mist physically passing over typography in DOM stacking order.
- Procedural canopy and root geometry — no two loads identical.
- The absence of any UI on arrival.
- The absence of a back affordance.
- Audio fading *in with* the world rather than punching in on click.
- Reduced motion preserving sequence rather than skipping the descent.

---

## What Should Never Change

- **The descent is one-way.** No back, no return, no "exit threshold" affordance.
- **No title card on arrival.** Naming is later, gentler, or never.
- **UI lives inside the atmosphere stack.** Never lift it into an overlay or portal.
- **Idle layers continue during the descent.** The world does not pause to play the transition.
- **No image assets for ecological scenes.** Procedural, painted, or composed; never photographic postcard.
- **No spinner, skeleton, progress bar, loader.** Ecology has no progress.
- **One framing question, one commitment.** Never plural offers at the threshold.
- **Reduced motion compresses; never skips.** The grammar must survive accessibility.
- **Audio is procedural or place-true.** No stock libraries. No score.

---

## What May Evolve

- The medium itself: 2D layered DOM is a stand-in. WebGL with real depth, volumetric mist, refractive water, and canopy-occluded light is the natural next step, governed by the same grammar.
- Cursor and device-tilt parallax to sell depth honestly without breaking restraint.
- Place-specific event scripting (tide rising, weather acting, distant traffic) to replace the static pre-orientation scene.
- Acoustic specificity (cicada layer, water lap, occasional distant boat) without becoming a soundtrack.
- The withheld fourth lens, currently absent for scope.
- Per-lens descent shapes for Ecosystem and Species — distinct grammars, not skinned variants of Habitat.
- A "specificity pass" that lets the place feel like Sundarbans without ever naming itself.

---

## Severity Map

| Failure | Severity | Notes |
|---|---|---|
| Depth is performed, not inhabited | **High** | Medium-level limit. Requires WebGL or honest 2.5D scripting. |
| M5 reads as resolution | **High** | Cinema vs. ecology distinction. Fixable in pacing. |
| Specificity generic | **Medium** | Place-specific event and acoustic scripting required. |
| UI opacity tween underneath mist | **Low** | Honesty improvement, not user-visible. |
| Vignette in M5 | **Low** | Single tween to remove. |
| Static pre-orientation | **Medium** | Architectural — needs scripted ecology, not animation polish. |

---

## Verdict

The prototype proves the grammar is implementable. It does not yet prove the medium can carry it. v1 is **directionally complete** as a perceptual contract and **incomplete** as ecological truth. The honest path forward is not visual polish; it is depth-of-medium and event-of-place.

The principles extracted alongside this review (`cinematic-language/cinematic-principles.md`) are the canonical governance for any future descent.
