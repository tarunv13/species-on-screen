# Cinematic Principles

**Status:** canonical governance
**Scope:** every threshold, descent, place, lens, transition, and arrival in this project
**Authority:** binding on all future agents — human and AI — until explicitly revised by the project lead

This document is not a style guide. It is the project's perceptual constitution. Style guides describe surface; this document describes what the system is allowed to *be.*

---

## 0. Premise

The project is investigative ecological cinema, not a biodiversity application.
The world is the protagonist. The user is a guest who has been given a stance from which to look.
Every cinematic decision is judged against ecological honesty, not against engagement.

---

## 1. Cinematic Ecology Principles

These are the four structural commitments that govern everything below.

1. **The world is the protagonist.** Not the user, not the species, not the dataset. Interface, transitions, and content all serve the world's continuity.
2. **Ecology continues; cinema ends.** The system must continue. Resolutions, conclusions, scene-completes, and credits-roll easings are forbidden.
3. **Place precedes name. Felt precedes identified.** The user must inhabit a place before the place identifies itself. Recognition is permitted to arrive late, or never.
4. **Editorial commitment > content completeness.** What is chosen and foregrounded is more present than what is offered. Comprehensiveness is the catalog's argument, not ours.

---

## 2. Ecological Pacing Rules

- **World tempo, not UI tempo.** All ambient motion runs slower than any plausible UI animation. If a motion would be at home in a productivity app, it is too fast.
- **Idle never pauses.** Atmospheric layers continue during transitions, during user inactivity, during loading, during arrival. The world does not freeze to perform a moment.
- **Movements overlap, never step.** Cinematic moves bleed into each other so no boundary is perceptible. A user who can locate the seam between two movements has identified a failure.
- **Decelerate into continuance, not stillness.** Settles end with motion still present, just no longer directed at the viewer. Globally easing to zero is a cinema gesture and is forbidden.
- **Reduced motion compresses; never skips.** The sequence must survive accessibility. Removing entire movements destroys the grammar.

---

## 3. Atmospheric Hierarchy

The order in which a place asserts itself is fixed.

1. **Sound bed** (humidity, water, wind, distance)
2. **Atmosphere** (light quality, color temperature, haze)
3. **Mass** (canopy, root architecture, water surface, terrain)
4. **Specificity** (the cues that make the place *this* place)
5. **Inhabitants** (creatures, signs of presence)

Inhabitants are the **last** thing to appear, often well after the transition itself ends. A species visible during a transition is a system failure. Periphery fills before center commits. Body-relative cues (low, surrounded, humid, dim) precede geographic cues (Sundarbans, Bengal delta).

---

## 4. UI Burial vs UI Removal

This distinction is non-negotiable.

- **UI is consumed by the world. UI is not deleted by the system.**
- UI must live inside the same stacking context as atmospheric layers, so atmosphere can pass over it.
- The visible mechanism of UI's disappearance must always be ecological — mist, water, foliage, light shift — never systemic — fade, dissolve, slide-out, route-change.
- A fade-to-zero that happens to coincide with mist is not burial. It is removal with cover. Burial requires the layer above to do the entire occluding.
- Forbidden, always: loaders, spinners, skeletons, progress bars, percentages, "loading…" text.
- Forbidden on arrival: title cards, place labels, "Welcome to X," breadcrumbs, scene names.
- Forbidden during transitions: navigation chrome, headers, sidebars, modals, toasts.

---

## 5. Non-Spectacular Motion Principles

- **Motion that points at the user is wrong. Motion that continues regardless of the user is right.**
- No "fly-to," no camera dolly, no cinematic zoom-to-target.
- No bouncy, springy, elastic, or playful easing. Sine and slow power curves only.
- No particle bursts, no sparkle, no shimmer-on-hover, no glow-pulse.
- Hover affordances are at most a single weight-shift — an underline scaling, a small opacity nudge. Never a flourish.
- No focus state that calls attention to itself with color or animation. Focus is felt, not advertised.
- No motion exists to delight. Motion exists because the world is moving.

---

## 6. Restraint Rules

- **One attractor per threshold.**
- **One question per moment.**
- **One commitment per descent.**
- The fewer interactive surfaces present, the more weight each carries.
- Plurality flattens gravity. If three things are offered as equivalents, the system is a catalog.
- Editorial selection is always preferable to neutral plurality. Pick a side.
- The withheld is louder than the present. Things visibly absent (the fourth lens, the locked descent, the unspoken name) carry editorial argument.

---

## 7. Anti-Gamification Rules

These mechanics are forbidden anywhere in the project.

- No score, level, XP, badge, achievement, streak, ranking, or leaderboard.
- No "X of Y explored," "your progress," "completion percentage."
- No unlock animations, no reveal-with-fanfare.
- No countdown timers, urgency mechanics, FOMO copy.
- No collectibles, checklists, trophies, journal-fill metaphors.
- No "discovery" framing. The user is not finding things; the world is showing itself.
- No quest, mission, level, or stage vocabulary.
- The descent is not a game. The world is not content.

---

## 8. Transition Philosophy

- **Transitions are not navigation. They are perceptual deepening.**
- The destination is already present at the threshold; the transition is the dissolution of obstruction.
- No fade-to-black, no white-flash, no page-change felt by the user.
- A transition that the user can locate the start or end of is a failure.
- One-way is structural. Re-entrability of a threshold destroys the grammar of commitment.
- The threshold must become *perceptually* unreachable, not *technically* blocked. Routing constraints are a poor substitute for perceptual position.
- A successful transition leaves the user unable to identify the moment of arrival.

---

## 9. Sensory Ethics

- **Audio is procedural or place-true.** No stock "ambient nature" libraries. No music score. No score swells, no leitmotifs, no triumphant cues.
- Audio fades in with the world. Audio never punches in on click.
- Audio is always optional. Meaning must survive muted playback.
- No flash, no sudden brightness, no sharp impact, no jump-cut audio.
- No saturation-up for prettiness. Color fidelity to the place is a discipline.
- No image assets for ecological scenes. Procedural, painted, or composed. Photography turns ecology into postcard.
- The system must be inhabitable for minutes without aesthetic fatigue. No looping spectacle.
- Reduced motion, reduced transparency, focus visibility, captions where applicable: must be honored without breaking the grammar.

---

## 10. Rules Future Agents Must Follow

These are the operational obligations on anyone — human or AI — proposing or executing changes.

**Before touching anything:**
- Read the homepage architecture document.
- Read the transition grammar document.
- Read this file.
- Read the most recent prototype review for the surface being modified.

**Forbidden additions:**
- No back button on a descent.
- No title card on arrival.
- No spinner, skeleton, progress bar, loader.
- No global navigation chrome inside a threshold or descent.
- No analytics events that interrupt the visual register.
- No third-party widgets (chat, intercom, cookie banners, support pop-ups) on threshold or descent surfaces.
- No marketing modal, newsletter prompt, or interstitial.
- No species lists at the threshold.

**Required artifacts before code:**
- A new ecological place: produce a transition grammar and a principles compliance checklist before writing code.
- A new perspective lens: produce a stance-distinct descent grammar. Do not reuse the Habitat descent shape with different content.
- A new species: it is *not* a homepage object. It lives inside a chosen perspective. The threshold does not list species.
- A new threshold attractor: justify it against §6. The bar is high.

**Required attitudes:**
- Continuity > pacing > atmosphere > feature completeness. This ordering is fixed.
- When in doubt, withhold.
- When tempted to label, do not.
- When tempted to decorate, stop.
- When tempted to confirm, let the world do it.

---

## 11. Failure Modes (named so they cannot return)

If any of these begin to appear, the system has reverted to catalog logic and must be corrected:

- A globe with simultaneous species labels.
- A grid of species cards.
- A filter bar over an ecological scene.
- A "browse" verb anywhere in the UI.
- A "discover" verb anywhere in the UI.
- A search input on a threshold.
- A loading screen.
- A "back to home" button on a descent.
- A title card announcing the place.
- An achievement, level, or unlock notification.
- A scoring or progress display.
- A photograph as the primary representation of an ecological place.
- A music track underscoring a transition.
- A modal interrupting a descent.

---

## 12. Final Authority

These principles supersede aesthetic preference, engagement metric, accessibility convenience, framework idiom, and prior art from adjacent industries. They do not supersede:

- Ecological accuracy
- User safety and accessibility (which they explicitly preserve via §2 and §9)
- Editorial judgment by the project lead

When a conflict appears between these principles and a proposed feature, the principles win until explicitly revised in writing.

---

*Versioned governance. Revisions require an entry in `prototypes/reviews/` documenting what changed, why, and what was tested against the change.*
