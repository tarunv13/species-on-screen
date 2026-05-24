---
inclusion: always
---

# Cinematic Vocabulary

> Production doctrine for camera, light, motion, and composition.
> This document defines what *cinematic* means inside Species on Screen.
> Future PRs are evaluated against the Articles below. Reviewers may cite
> them by name (e.g. "Article III: The Descent") in feedback.
>
> **Status:** provisional constitutional guidance pending the first
> milestone review walks. The grammar is intended to be stable; specific
> parameter values (timings, particle ceilings, hover thresholds) are
> expected to be revisited after the first terrain-descent prototype
> ships and is reviewed against this doctrine in practice. See the
> introducing PR for the list of Articles flagged as flex-pending.

## 0. What this document governs

This document governs every decision that produces or modifies a moving
image in the experience: camera position and motion, lens behaviour,
lighting, atmospheric effect, post-processing, the shape of a transition,
the framing of a card, the silhouette of a globe, the pose of a habitat.

It does not govern copy, information density, or pacing. Those are
governed by `editorial-voice.md` and `pacing-principles.md` respectively.

When the three documents come into tension, the priority is:

1. Editorial voice (what the project says)
2. Pacing principles (when and for how long it says it)
3. Cinematic vocabulary (how it looks while saying it)

Cinematic decisions exist to serve the editorial line, not to perform.

## 1. Cinematic identity

Species on Screen is **a film, not an app**. The interface is staged. The
globe is photographed, not rendered. A click is a cut. A scroll is a
slow push. A hover is a held breath. Every surface that flickers, jumps,
or insists on being noticed weakens the contract with the viewer.

The reference register is the natural-history feature film at its most
restrained: long lenses, long takes, slow camera moves, deliberate
darkness, generous negative space, and an overwhelming preference for
the subject over the apparatus. The wrong references are: dashboards,
data explorers, tech demos, generative art, motion graphics reels,
GIS tools, biodiversity portals, gamified maps.

If the experience can be screenshotted into a still that looks like a
frame from a documentary, it is in voice. If it can be screenshotted into
a still that looks like a SaaS landing page or a control panel, it is out
of voice and must be reworked.

## 2. The four lawful camera behaviours

The camera (`CinematicEngine` and any future scene cameras) has only
four lawful behaviours. New camera moves must be expressible as a
composition of these.

### Article I — Hold

The camera is still. The world moves: the globe rotates with inertia,
particles drift, atmosphere breathes. The camera does not.

Holds are the default. The camera holds during the landing frame, during
any moment where text is being read, during the dwell at the bottom of a
descent, and during empty states. A held camera is what allows the
viewer to feel located.

Holds must last long enough to be felt as holds. A 200ms hold is not a
hold; it is a stutter. Minimum hold duration in continuous interaction is
~600ms.

### Article II — Drift

The camera moves slowly along a single axis or arc. Drift is reserved
for ambient time: the landing fly-in once it has resolved, the moment
before a descent begins, the return-to-globe arc.

Drift speeds are measured against the visible world, not the clock. The
target is roughly one screen-width of subject motion every 8–12 seconds.
Anything faster reads as panning. Anything slower reads as broken.

Drift never reverses direction within a single shot. If the camera must
return, that is a new shot, separated by a hold or a cut.

### Article III — The Descent

The Descent is the canonical signature movement of the project. It is
not "zoom." It is the camera lowering itself from planetary altitude to
human altitude, accompanied by a softening of light and a thickening of
atmosphere.

A Descent has four obligatory phases:

1. **Departure** — globe UI recedes; floating cards dissolve; the camera
   begins to lean toward the chosen point.
2. **Approach** — the camera arcs in along the surface normal of the
   selected hotspot; the globe occupies more of the frame; rotation
   slows; world inertia is zeroed.
3. **Crossing** — the planetary frame fades. The local frame fades in
   underneath. The horizon line of the safari scene becomes the new
   ground plane. This is the only sanctioned cut in the experience and
   it must be hidden inside a luminance dip, never executed on a clear
   frame.
4. **Settle** — the camera arrives at rest. The local atmosphere takes
   over: parallax layers, biome palette, ambient drift.

Departure-to-Settle is the experience's longest sanctioned interaction.
Its timing is governed by `pacing-principles.md`, but its *shape* is
defined here and may not be altered without revising this Article.

The reverse motion (Return) is not a Descent played backward. It is its
own movement, gentler and shorter, governed by Article XIV.

### Article IV — Reveal

A Reveal is a deliberate uncovering: a label appears, a comic strip
panel slides into frame, a fact card emerges from beneath a photograph.
Reveals are slow, additive, and never simultaneous. Two things may not
reveal in the same beat. Stagger is mandatory.

Reveal motion is always toward rest, never away from it. Things settle
into place; they do not fly in and bounce. Easing is exclusively
`power2.out`, `power3.out`, or comparable decelerations. Bounce, elastic,
back, and overshoot easings are forbidden in the main interface.

(Spring physics may be used inside the safari scene for incidental
elements where their behaviour reads as natural — e.g. a leaf tilt on
hover. They are forbidden on cards, headers, layer toggles, and any
typographic element.)

## 3. The forbidden gestures

The following motions are out of voice in every context:

- **Continuous parallax tied to mouse position on the globe view.** The
  globe is a body, not a parallax surface.
- **Marquees, infinite scrollers, ticker tapes.** Editorial voice
  forbids these in copy form; cinematic voice forbids them in motion.
- **Camera shake of any kind.** No earthquake feedback, no impact
  shudder, no nervous "alive" wobble. The camera is composed.
- **Lens flare anchored to the cursor.** The cursor is not a light
  source.
- **Auto-rotating carousels.** The viewer chooses what advances.
- **Hover scaling above 1.04.** Cards do not pop; they acknowledge.
- **Confetti, particle bursts on click, success animations.** This is
  not a game.
- **Loading spinners as primary feedback.** Loading is a held darkness,
  a slow fade, or a held composition with text — never a spinning ring.
- **Skeleton screens that flicker.** If structure must show before
  content, it shows once and stays still.
- **Tooltips that follow the cursor.** Tooltips anchor to their target.

Any PR that introduces one of these gestures must justify it in the
description against this Article and propose an amendment if the
gesture is genuinely warranted.

## 4. Light and atmosphere

### Article V — Light is never neutral

There is no flat exposure in this project. Every frame has a direction
of light, an implied time of day, and a depth of atmosphere. Even the
planetary view is lit: the Earth has a terminator, a side of warmth, a
side of cool, and an atmospheric rim that does not vanish on dark
backgrounds.

Acceptable atmospheric tools (already present in the engine):

- A bloom pass tuned for **highlight halation, not glow**. Bloom should
  read as the bleed of bright detail into adjacent pixels; it should
  never read as a uniform haze. Threshold high, intensity restrained.
- A subtle film grain or chromatic settle, applied at a level the
  viewer registers only on side-by-side comparison. Grain is a texture
  of the image, not a stylistic effect.
- Particle drift at low density (target: under 1500 particles in any
  scene, additive blending only when narratively justified, normal
  blending preferred for dust and pollen registers).
- Atmospheric fog or distance haze in the safari scene, biome-tinted.

Forbidden atmospheric tools:

- Vignettes that visibly darken the corners as a frame device. The
  viewer must not be able to name the effect.
- God rays, volumetric beams, anime-style speed lines, screen-space
  reflections used as decoration.
- Heavy chromatic aberration. A trace, optionally, near the edges of a
  Descent only.
- Screen-wide colour grading LUTs that override biome palette. Grading
  is local to the shot, not global.

### Article VI — Darkness is content

Black is a colour the project uses generously. Negative space is not
empty; it is the held breath around the subject. A frame in which 40%
of the pixels are near-black is in voice. A frame in which every pixel
is doing something is out of voice.

This Article is the most often violated under pressure to "use the
space." The space is not unused; it is composed.

## 5. Colour

### Article VII — Palette is biome-led, not brand-led

There is no project-wide palette. There are two palette layers:

1. **Frame palette** — the few neutrals that define the chassis: the
   near-black of the planetary frame, the bone/cream of typography in
   light contexts, the muted glass of floating cards. These are stable
   across the experience and live in `style.css` as CSS custom
   properties prefixed `--frame-`.

2. **Biome palettes** — per-species, sourced from each species'
   `safari_scene` block in its JSON. Sky gradient, silhouette, mid,
   foreground. These take over inside the safari scene and may tint
   transitional moments (the Crossing phase of a Descent), but they
   never leak into the planetary view.

There is no accent colour. There is no brand colour. There is no
gradient that announces the project. The project's identity is its
restraint, not its hue.

When introducing a new species, the biome palette is authored editorial
work, not a generated value. It must read as a documentary still of that
habitat, not as a stylised illustration of it.

### Article VIII — Saturation discipline

Highly saturated colour is reserved for editorially earned moments: a
single fact stat in a comic-strip panel, a state change on an active
layer, the ember in a photograph. The interface chrome (cards, toggles,
borders, dividers) is desaturated. If the chrome competes with the
photograph, the chrome is wrong.

## 6. Composition

### Article IX — The subject claims the frame

Whether the subject is the Earth, a habitat, a species, a single
sentence, or a citation, it must be able to claim the frame without
fighting another element for primacy. There is one subject per beat.

This forbids:

- A floating card that overlaps the silhouette of the species in the
  same frame.
- A layer toggle bar that crosses the terminator of the globe.
- A heading that competes typographically with a stat in the same
  visual zone.
- A photograph used as a background under a paragraph at full opacity.

Photographs are subjects, not textures. If a photograph appears, the
text either holds beside it, holds beneath it on a dedicated band, or
does not appear at the same moment.

### Article X — Cards are objects, not panels

The floating glass cards on the globe are not UI panels. They are
**diegetic objects suspended in the frame**, with weight, refractive
character, and a position in three-dimensional space (even when projected
to 2D). Their styling derives from this premise:

- They have a frosted backplate with measurable depth, not a flat fill.
- They cast no hard shadow; they have a soft luminance footprint at
  most.
- They never have sharp 1px borders; their edges are defined by
  refraction and density, not by a stroke.
- They animate in sympathy with camera and globe motion, not against
  it. When the globe drifts, cards drift with it, slightly damped.
- They never collide visually with the silhouette of a species point;
  their anchor maintains an offset from the hotspot, with a thin
  connector if needed (a tether, never a callout box arrow).

Inside the safari scene, comic-strip panels are also objects: each panel
sits inside the parallax stage at a layer depth, not on top of it as
overlay UI. Their edges are part of the composition, not borrowed from
chrome.

## 7. Globe doctrine

### Article XI — The globe is a body, not a button

The globe is the largest body in the experience and the most
photographed. Its presence rules:

- The globe is **never centred-and-static at the start**. The landing
  frame establishes it through a Drift or a held lean.
- The globe **rotates with inertia, never on a constant rotation
  loop**. Constant rotation reads as a screensaver. Inertia reads as a
  body responding to a hand.
- The globe **may be touched (drag), but never grabbed**. Drag has a
  damping coefficient that releases the body smoothly. There is no
  click-to-instant-rotate.
- The globe's atmosphere rim is mandatory. A globe without atmosphere
  is a sphere, and a sphere is not the subject of this project.
- Hotspot markers are **dimensional, not iconographic**. They have
  height, opacity falloff, and a sense of standing on the surface. Pin
  glyphs from map UIs are forbidden.

### Article XII — Layers are editorial, not analytical

The layer toggles (species / habitat / threats, today) are editorial
selectors that change what the globe is *about* in this moment. They
are not analytical filters. The visual treatment must reinforce this:

- Only one layer is active at a time, except when an editorial reason
  requires a deliberate combination. Multi-select-by-default is
  forbidden.
- Layer transitions are crossfades with a beat between them, not
  simultaneous toggles.
- A layer toggle is a small typographic switch with a state line, not
  a checkbox grid.
- The legend, if any, is a sentence, not a key.

## 8. Safari scene doctrine

### Article XIII — The safari is a place, not a page

The safari scene (`SafariScene`) is staged geography. The viewer has
arrived somewhere. This rules:

- The hero band is a parallax composition with at minimum three depth
  layers (sky, mid, foreground). Two layers is a banner, not a place.
- The biome palette governs every chrome element inside the safari.
  Frame neutrals retreat. Cards in the safari take on the local light.
- The first beat of the safari is **always a hold on the place**
  before any text appears. The viewer must register where they are
  before being told about it.
- Comic-strip panels, photographs, threat blocks, COM-B blocks, and
  cultural cards each have a reserved beat in the cadence (governed
  by `pacing-principles.md`). They never tile.

### Article XIV — Return is a movement, not a dismissal

Returning to the globe from the safari is not closing a modal. It is
the camera ascending. The Return is its own composed movement: the
local atmosphere fades, the parallax layers compress, the planetary
frame re-establishes from above. The viewer arrives back at the globe
with the rotation they left it at, not at a default pose.

## 9. Post-processing budget

### Article XV — Effects must be earned, measured, and reviewable

The post-processing chain (currently bloom + grain in
`CinematicEngine`) is a budget, not a feature list. New passes must:

1. Identify the editorial moment they serve.
2. Quote a measured framerate cost on a baseline mobile device.
3. Be conditionally compiled out when the user prefers reduced motion
   (see `pacing-principles.md`) or when GPU hints suggest a low-end
   device.
4. Be defaulted-off and cited in the PR if their effect is at the edge
   of perception.

A reviewer is empowered to reject a pass on the grounds that "I cannot
tell what this is doing in the frame." The burden of legibility is on
the proposer.

## 10. Typographic motion

Typography in motion follows the camera, not the other way around.
Headings settle. Paragraphs reveal in stagger. Stats count up only when
counting up is the editorial point of the stat (see
`editorial-voice.md`); otherwise stats appear at their final value.

Forbidden: per-letter animations, kinetic typography, type that scales
on hover, type that changes weight on scroll.

## 11. Sound (reserved)

Audio is not implemented and is deferred. When implemented, it will
follow this Article.

### Article XVI — Sound is biome, not interface

The first audio in the project will be ambient biome beds inside the
safari scene, layered to support the parallax depth (distant ambience,
mid, near). There will be:

- No interface sounds (no clicks, no toggles, no hover blips).
- No music score laid over the planetary view at launch.
- No autoplaying audio. Sound is opted into through a single
  typographic toggle in the planetary frame, governed by editorial
  voice.

Until implemented, this Article reserves the territory and forbids
incidental audio additions.

## 12. What this is not

To make this document operational, here are explicit rejections:

- This is not a brand guideline. It does not specify a logo, a
  signature gradient, a marketing surface, or a hero homepage layout.
- This is not a component library. It does not enumerate buttons,
  inputs, modals, or form controls. (The project largely does not
  have these and should resist acquiring them.)
- This is not an animation cookbook. It defines the *grammar* of
  motion, not the parameter values for every transition. Parameter
  decisions live in `pacing-principles.md` and in the code.
- This is not a style sheet. It does not name colours by hex value or
  fonts by family. Those live in `style.css` as the implementation of
  this doctrine.

## 13. How to cite this document in review

When rejecting or approving a visual change, name the Article:

- "This violates Article III — the Crossing is happening on a clear
  frame instead of inside a luminance dip."
- "Approved against Article IX — the photograph claims the frame and
  the caption holds beneath it."
- "Article XV requires a measured cost; please add the baseline
  framerate before this pass merges."

Articles are stable identifiers. If an Article is amended, the
amendment is dated and noted in this file; the number is preserved.
