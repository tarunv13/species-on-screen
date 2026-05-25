---
inclusion: always
---

# Pacing Principles

> Doctrine for time, rhythm, and cadence in Species on Screen.
> This document defines when things happen, for how long, and in what
> order. PRs are evaluated against the Principles below. Reviewers
> cite them by name (e.g. "Principle IV: The Hold") in feedback.
>
> **Status:** canonical doctrine. Principles are stable identifiers
> and are cited in PR review. The specific millisecond envelopes
> (Principle III's Descent table, the Hold minimums, the reading-time
> calibration, the cadence-per-scene-type table) remain editable
> through the standard amendment path; the temporal worldview
> (Principles I–II, V, XIX–XX) does not.

## 0. What this document governs

This document governs the temporal shape of the experience: durations,
delays, sequences, holds, transitions, scroll cadence, the rhythm of
revelation, and the budget of viewer attention. It binds:

- Every duration in `gsap.to`, `gsap.timeline`, `gsap.fromTo`, and
  every easing decision tied to time.
- Every `setTimeout`, `requestAnimationFrame`-based countdown, and
  scroll trigger threshold.
- The timing relationship between camera, content, and chrome
  during the canonical Descent and Return.
- The cadence of beats inside the safari scene (parallax → first
  text → comic strip → photographs → threats → COM-B → cinema →
  cultural → sources).
- The behaviour of loading, error, and re-entry states with respect
  to time.
- The accessibility contract for `prefers-reduced-motion`.

It does not govern what the camera does (`cinematic-vocabulary.md`)
or what the experience says (`editorial-voice.md`).

## 1. The temporal worldview

### Principle I — The viewer is not in a hurry

The single ruling assumption of this project is that the viewer has
chosen to be here and is not optimising for time-on-task. They are
reading. They are looking. They will tolerate, and reward, a held
moment.

This assumption rules out:

- Skip-intro buttons, "skip to content" affordances framed as time-
  saving, "tap to continue" prompts. The experience does not assume
  it is being endured.
- Auto-advance through any beat that contains text.
- Default-fast settings or a "speed up animations" preference.
  Reduced-motion (Principle XV) is a separate accessibility contract,
  not a tempo preference.
- Progress bars on transitions. A transition is a moment, not a task
  with a percentage.

This assumption is not a license for indulgence. A held moment is
held *for a reason*. A duration that the viewer cannot register as
deliberate is not pacing; it is friction.

### Principle II — Three temporal layers

The experience has three temporal registers, in increasing intimacy:

1. **Planetary time** — the time of the globe view. Slow drift,
   ambient inertia, no urgent durations. Tempo: minutes of dwell are
   normal; nothing on screen demands a response within seconds.
2. **Transitional time** — the time of the Descent and the Return.
   Bounded, composed, on the order of a few seconds, with internal
   beats that are themselves composed.
3. **Local time** — the time of a safari scene. Reading time. Scroll
   cadence. Beats separated by deliberate space. The viewer's pace,
   not the system's.

Each beat in the experience is in exactly one of these registers. A
beat that confuses registers — planetary chrome appearing during
local time, transitional time interrupting reading — is out of
pacing.

## 2. The canonical Descent timing

### Principle III — The Descent is timed, not improvised

The Descent (Article III of `cinematic-vocabulary.md`) has a single
canonical timing envelope. Per-species variation is forbidden. Per-
device adaptation is permitted only along the axes named below.

Reference timing on a baseline device (mid-range mobile, 60Hz):

| Phase        | Start (ms) | End (ms) | Duration (ms) | Notes |
|--------------|-----------:|---------:|--------------:|-------|
| Departure    |          0 |      600 |           600 | Cards dissolve; UI recedes. |
| Approach     |        600 |     1400 |           800 | Camera arcs; globe inertia zeroed at 600. |
| Crossing     |       1400 |     1800 |           400 | Luminance dip; planetary fades; local fades in *underneath*, not over. |
| Settle       |       1800 |     2400 |           600 | Local atmosphere takes; first hold begins at 2400. |
| First hold   |       2400 |     3000 |           600 | No text yet. Place only. |
| First reveal |       3000 |        — |             — | First editorial element fades in. |

Total: ~3.0 s from click to first text. Of that, the last 600ms is a
mandatory hold on the place (Article XIII).

Permitted adaptations:

- Reduced-motion path (Principle XV) collapses this envelope to a
  single 200ms crossfade plus the first hold; no camera move occurs.
- Slow-network conditions may extend the Departure phase up to a
  ceiling of 1200ms while the safari assets resolve. They may *not*
  shorten any subsequent phase to compensate.
- Re-entry to a previously visited species (warm cache) shortens
  Crossing to 300ms but preserves Approach and the first hold.

Forbidden:

- Skipping the first hold under any condition that is not reduced-
  motion. The hold is what makes arrival legible.
- "Quick descent" modes, double-click-to-skip, or any short-circuit
  triggered by the viewer.

### Principle IV — Inertia is bounded, not absolute

When the Descent begins (Article III, Departure), globe rotational
velocity must be zeroed in the same frame as the timeline starts. The
globe must not continue rotating behind the safari overlay. (This was
the substance of an earlier review issue and is now codified.)

When the Return completes, the globe is delivered to the viewer at
**the rotation it held at the moment of the Descent's Departure**,
not at a default pose and not at the rotation it would have reached
under continued inertia. The Descent suspends planetary time; the
Return resumes it.

## 3. The Hold

### Principle V — The Hold is a feature, not a delay

A Hold is a deliberate moment in which nothing changes on screen. It
exists to allow the viewer to register where they are, what they
just saw, or what they are about to see. Holds are non-negotiable
beats; they may not be tuned away under pressure to feel "snappy."

Mandatory Holds in the experience:

| Location                                | Minimum (ms) |
|-----------------------------------------|-------------:|
| Landing fly-in: end of Drift            |          800 |
| Globe view: between layer-toggle states |          250 |
| Descent: Settle → first reveal          |          600 |
| Safari scene: between major beats       |     ≥ scroll |
| Return: globe re-establish → cards in   |          400 |
| Error state appearance                  |         1200 |

The "≥ scroll" entry on safari beats means that beat-to-beat
transitions are not on a clock; they are on viewer-driven scroll.
Holds in that register are infinite by default.

A Hold of 200ms is not a Hold; it is a stutter. Holds shorter than
their minimum are violations.

### Principle VI — Reveals stagger; they do not converge

When multiple elements reveal in the same beat (e.g. the title, the
hero stat, and the breadcrumb appearing on first load of a species
page), they reveal in stagger, not in parallel. Stagger spacing is
80–160ms between siblings. Parallel reveals are flat; staggered
reveals describe the order of attention the editorial voice
intends.

Stagger order is editorial, not alphabetical or DOM-ordered. The
PR introducing a new beat must specify the stagger order against
the editorial intent.

## 4. Scroll cadence

### Principle VII — One revelation per beat

A beat is the vertical span of a single editorial moment in the
safari scene. A beat contains exactly one revelation: one composition
that crosses the threshold and becomes visible.

This forbids:

- Multiple major elements crossing the same scroll trigger
  threshold at the same scroll position. Each gets its own threshold
  with its own stagger.
- A scroll position at which both the previous beat's exit animation
  and the next beat's entrance animation are simultaneously running
  with `pointer-events: auto`. (This was previously seen between the
  *numbers* and *species* overlays at progress 0.44 and is now
  forbidden under this Principle.)
- Scroll-driven scrubs that animate the same property of the same
  element across two consecutive beats with no rest position
  between them.

### Principle VIII — Reading time is the scroll governor

Beat lengths in the safari scene are calibrated to expected reading
time of their text content, not to a fixed viewport height.

Calibration table (target reading speed: ~250 wpm, reading-aware
beat length):

| Text length        | Beat length (vh) |
|--------------------|-----------------:|
| 0 words (image)    |               60 |
| ≤ 25 words         |               80 |
| 26–60 words        |              100 |
| 61–120 words       |              140 |
| 121+ words         |          120 + 1vh per 2 words over 120 |

Beats shorter than the table value force the viewer to scroll past
text before it has been read. Beats much longer than the table value
read as filler.

These values are guidelines, not a layout engine. The reviewer is
empowered to call out a beat that scrolls past too quickly *as a
function of how much it asks the viewer to read*, citing this
Principle.

### Principle IX — Smooth scrolling is local, not global

Lenis (or any future smooth-scroll library) is instantiated **per
scene**, not as a global singleton, and is destroyed when the scene
exits. The planetary frame does not need smooth scrolling because it
does not scroll. The safari scene needs it because the cadence
depends on a controllable scroll velocity.

A single global Lenis instance creates the orphan-ticker problem
documented in earlier reviews and is forbidden under this Principle.

## 5. Re-entry

### Principle X — Return is not Undo

When the viewer returns from a safari scene to the globe, the
experience is not rolled back to a previous state. It is advanced to
a *new* state that acknowledges what just happened.

Concretely:

- The cards on the globe re-establish in the same Stagger they used
  on first load, but slightly faster (300–400ms total) because the
  viewer has already met them.
- The species the viewer just visited is marked, briefly and
  quietly, by a held luminance bloom on its hotspot. The mark fades
  on the next interaction. It is not persistent; it is a memory
  beat, not a checklist tick (Canon XIV).
- The globe rotation is the rotation at Descent-Departure (Principle
  IV), not the default landing pose.

### Principle XI — Repeat visits are warm

Returning to a species the viewer has already visited within the
session must use a shortened Descent (Principle III): same Departure
and Approach, shortened Crossing (300ms), same first hold. The
viewer should feel the path is familiar without the system claiming
it knows them.

State for "visited" lives in memory only (no localStorage, no
cookies). The session ends with the tab; the next session is fresh.

### Principle XII — Scroll position resets on every safari entry

Each entry into a safari scene begins at scroll position zero,
regardless of where the previous safari (same or different species)
was scrolled to. The first hold (Principle III) is the first thing
the viewer sees, every time. Returning mid-scroll to a previously-
visited safari is a violation under this Principle.

## 6. Loading, errors, and emptiness

### Principle XIII — Loading is composed, not announced

Loading states are visual compositions, not progress reports. The
acceptable forms:

- A held darkness with a single line of editorial copy (Canon XVII)
  fading in once and remaining still.
- A still photograph at full opacity with the species' name in
  editorial form, settled, while data resolves underneath.
- The current planetary frame, undisturbed, while a card's data
  resolves quietly into it (no per-card spinners).

A loading state must not:

- Spin, pulse, or otherwise animate to signal activity. Activity is
  invisible; what the viewer sees is composed waiting.
- Show a percentage, a remaining time, or "Loading X of Y" copy.
- Replace itself with a flash of unstyled content. The transition
  from loading to loaded is a crossfade of ≥300ms.
- Display longer than 8 seconds without escalating to the error
  posture (Principle XIV).

If a critical asset (e.g. the globe texture) fails after the
loading state has already dismissed (a real failure mode in this
codebase per prior review), the failure is handled by composed
fallback (a low-res bundled texture) rather than re-entering loading.

### Principle XIV — Errors hold; they do not retry-loop

An error state appears once, holds for a minimum of 1200ms (Principle
V), and remains until the viewer acts. It does not auto-retry every
n seconds. It does not flash. It does not stack with subsequent
errors into a queue.

Error copy follows Canon XVII: a single sentence in the documentary
narrator's voice, with one named recovery action.

### Principle XV — Reduced motion is a parallel pacing track, not a degradation

When `prefers-reduced-motion: reduce` is honoured by the OS, the
project enters a parallel pacing track:

- The Descent collapses to a single 200ms crossfade into the safari
  scene. No camera move. No parallax animation on entry.
- Scroll-triggered reveals become CSS opacity transitions, ≤200ms,
  no transforms.
- Globe inertia is disabled. Drag rotates 1:1 with pointer
  movement.
- Particle drift is reduced or stopped.
- The first hold (Principle III) is preserved at full duration. The
  Hold is not motion; it is the absence of motion. Reduced-motion
  preserves it.

The reduced-motion track is *not* a "lite" version. It is a different
pace, not a lesser experience. Editorial content is identical.

This Principle binds every new animated element. PRs introducing
animation must demonstrate the reduced-motion path in the
description.

## 7. The frame budget vs the experiential budget

### Principle XVI — 60fps is a floor; cadence is the ceiling

Performance discipline serves pacing, not the other way around. A
beat that runs at 120fps but lands the viewer in the wrong place is
a failure. A beat that holds at 30fps but reveals at the right
moment is acceptable, though improvable.

Concretely:

- Frame-rate regressions inside the Descent are unacceptable: the
  Descent is the most cinematically loaded moment of the experience
  and must hold its envelope (Principle III) on baseline mobile.
- Frame-rate regressions during a Hold are acceptable if the hold
  duration is preserved. A held composition with steady frame is a
  held composition.
- Background work (TMDB metadata fetches, JSON enrichment) must
  never preempt active animation. Defer to `requestIdleCallback`
  where available.

### Principle XVII — Render loops pause when the experience is not visible

`document.visibilityState !== 'visible'` pauses the cinematic engine
loop and the globe update loop. (This is non-negotiable per earlier
review; this Principle codifies it.) A backgrounded tab does not
continue animating, raycasting, or scheduling work.

Resumption from a backgrounded state is itself a Hold (~400ms)
before motion resumes, to prevent the viewer's return-to-tab from
catching the experience mid-motion.

## 8. The animation budget per beat

### Principle XVIII — One ambient motion, one editorial motion

Within any active beat, the experience runs at most:

1. One *ambient* motion: the always-on character of the place
   (parallax drift, particle motion, globe rotation, atmospheric
   shimmer). This is the breathing of the scene.
2. One *editorial* motion: a deliberate animation tied to the beat's
   revelation (a reveal stagger, a comic-strip panel sliding into
   place, a stat counting up where the count is the point).

Two editorial motions in a single beat are forbidden. They compete
for the viewer's attention and dilute the beat. Where two editorial
elements must appear, they appear in stagger (Principle VI), not in
parallel.

## 9. The forbidden tempo: dashboard

### Principle XIX — The project does not run at dashboard tempo

Dashboard tempo is the tempo of feedback-on-action: a click yields a
state change in <100ms; the viewer is being conditioned to expect
constant responsiveness. This is correct for a tool. It is wrong for
this experience.

The project's tempo is the tempo of attention: a click yields a
composed transition; a scroll yields a paced reveal; a hold yields
held space. Every interaction has a moment of grace before its
result lands.

Practical rules:

- The minimum time from click to first visible response on a card
  is 80ms — fast enough to feel responsive, slow enough to register
  as a deliberate beat.
- The minimum time from click to *full* response (the destination
  state) is governed by Principle III for Descents, by Principle V
  for layer toggles (250ms), and by editorial timing per beat
  elsewhere.
- "Optimistic UI" patterns where state changes before confirmation
  are forbidden in this experience. There is nothing to be
  optimistic about; the result is composed.

### Principle XX — Time-on-task is not a metric

The project does not measure time-on-task, time-to-first-content
(beyond TTFB obligations to crawlers), or any other performance
metric framed as viewer impatience. If such metrics are introduced
operationally, they are operational only and do not influence
pacing decisions.

## 10. Cadence per scene type

The following table summarises the cadence expectations for each
known scene type. New scene types must specify their cadence in the
introducing PR and earn an entry here.

| Scene                  | Tempo register | Default Hold | Reveal stagger | Scroll governor |
|------------------------|----------------|-------------:|---------------:|-----------------|
| Landing fly-in         | Planetary      |        800ms |          120ms | n/a             |
| Globe (idle)           | Planetary      |     ambient  |              — | n/a             |
| Globe (layer change)   | Planetary      |        250ms |          100ms | n/a             |
| Descent                | Transitional   | 600ms (settle) |        160ms | timed (Principle III) |
| Safari hero            | Local          |   ≥ scroll   |          120ms | reading-time   |
| Safari comic strip     | Local          |   ≥ scroll   |    panel-by-panel | reading-time |
| Safari photographs     | Local          |   ≥ scroll   |          150ms | reading-time   |
| Safari threats         | Local          |   ≥ scroll   |          120ms | reading-time   |
| Safari COM-B           | Local          |   ≥ scroll   |     200ms / claim | reading-time |
| Safari cinema (TMDB)   | Local          |   ≥ scroll   |     180ms / card | reading-time  |
| Safari cultural        | Local          |   ≥ scroll   |          150ms | reading-time   |
| Safari sources         | Local          |   ≥ scroll   |              — | reading-time   |
| Return to globe        | Transitional   |        400ms |          120ms | timed          |

The entries in this table are the binding cadence specifications
of the experience. PRs that change cadence change this table.

## 11. What this document is not

- This is not a performance budget. Frame rate, bundle size, and
  asset budgets live in the engineering documentation. Performance
  serves pacing (Principle XVI); it is not specified here.
- This is not an accessibility specification. Reduced motion is
  bound to pacing under Principle XV; full accessibility doctrine
  (focus order, screen-reader pacing, keyboard navigation cadence)
  is a forthcoming sibling document and is referenced here only
  where it touches time.
- This is not a platform-tempo policy. The project is single-
  platform (web, GitHub Pages) at present. Native or installed
  contexts, if introduced, will inherit this doctrine and may amend
  it; they may not silently relax it.

## 12. How to cite this document in review

When approving or rejecting a timing decision, name the Principle:

- "Principle III — the Crossing is 200ms here, must be 400ms."
- "Principle V — the layer-change Hold has been removed; please
  restore the 250ms minimum."
- "Principle VII — both the *threats* beat and the *cinema* beat
  are revealing at the same scroll position; introduce stagger or
  separate the thresholds."
- "Approved against Principle XV — the reduced-motion path is
  demonstrated and the first Hold is preserved."

Principles are stable identifiers. Amendments are dated and noted in
this file; numbers are preserved.
