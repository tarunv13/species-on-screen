# Mangrove Prototype — Implementation Plan

Date: 2026-05-25
Companion to: `2026-05-25-canonical-mangrove-descent-spec.md`
Scope: the executable plan for delivering the canonical mangrove
descent. File-level reuse, discard, and phasing decisions, with named
risks at each layer.

---

## 1. Audit of the current repository state

**Stack** — Vite 8 + Three 0.184 + GSAP 3.15 + Lenis 1.3 + an unused
`@barba/core` dependency. No React, no SSR, no router framework. The
toolchain is correct for a publication-grade cinematic site; nothing
about the stack needs to change.

**Architecture** — One canvas (`#cinematic-canvas`), one DOM overlay
(`#globe-ui-container`), one scrolling overlay (`#safari-container`),
and a `return-to-globe` button. The slot-based separation between the
planet and the descent is correct and reusable.

**The planet** (`globe.js`, `floating-cards.js`, the bottom-of-
`index.html` chrome) is in violation of the project's own doctrine.
The homepage audit at
`.agents/tasks/task-homepage-audit/2026-05-24-homepage-review.md`
already enumerates the violations and prescribes the fix in §6 and §9.
None of those changes have shipped.

**The descent** (`safari-scene.js`) is a six-panel "comic strip" +
threats grid + media grid + cultural grid + facts grid + footer. This
is the dashboard/educational-app UX that has been explicitly rejected.
It is the wrong descent at the level of register, not at the level of
polish — its grid components, glassmorphic cards, and brand greens
cannot be shaped into the editorial publication required.

**Data** — `public/data/tiger.json` is unusually rich: prose habitat
description, threats, conservation, cultural significance,
`cultural_depth.india_sundarbans` with a sourced Bonbibi entry citing
Jalais 2010, a `com_b` block with author/year/url, a real
`evidence_summary`, and an `academic_references` list. The shape is
fine for a wide tiger-anywhere page; **it is not Sundarbans-specific
and will not carry the prototype**. The causal chain (Goldberg 2020
mangrove loss, Farakka sediment loss, sea-level rise) is not yet
present.

**Other** — `prototypes/mangrove.html` is an empty stub canvas.
`species/*.html` are static fallback pages. `vite.config.js`
multi-input is harmless.

---

## 2. What is reusable as-is or with light tuning

| Artifact | Decision | Why |
|---|---|---|
| `src/cinematic-engine.js` | Keep, dial bloom on Z1 | Engine is correct: clock, particle drift, ACES tone mapping, `flyCamera`, visibility-pause. Reduce `bloomPass.strength` to 0 across the Z1/Z2 hand-off so the canvas-to-DOM seam doesn't flash. |
| `src/globe.js` (architecture) | Keep architecture, replace chrome | `_setupDragRotate`, atmosphere shader, raycasting, `getSpeciesPosition`, `Promise.allSettled` data load with `whenDataLoaded()` are all sound. The columns, pulses, tooltip, and emissive flash are doctrinal violations to remove (audit §9.4). |
| `src/safari-scene.js` (Lenis + ScrollTrigger plumbing) | Salvage ~30 lines; retire the rest | Extract `_initLenis` + `_initScrollAnimations` + `exit()` cleanup pattern into `src/descent/scroll-stage.js`. Throw away everything else. |
| `src/main.js` (transition orchestration) | Keep `killActiveTransition` discipline | The dual-timeline guard against overlapping forward/back tweens survives the rewrite, renamed to drive Z1/Z2. |
| `index.html` (structural slots) | Keep slots; replace inner chrome | Replace inner copy and remove `.layer-toggle-bar`, `#globe-tooltip` per audit §9.1. |
| `vite.config.js` | Keep | Multi-input build accommodates `species/*.html` as fallback. |
| `tiger.json:cultural_depth.india_sundarbans` | Cite, do not consume | The Bonbibi citation (Jalais 2010, doi.org/10.4324/9780203847275) is real and will appear in the descent's bibliography. The file itself is not the descent's data source. |
| `species/tiger.html` and the other 9 static pages | Leave on disk; do not link from the prototype | They serve the noscript fallback for users who land directly. They are not in the descent's path. |

---

## 3. What should be discarded entirely

- `src/safari-scene.js` (the comic-strip descent) — retire after
  Phase 6.
- `src/safari-scene.css` — same.
- `src/floating-cards.js` glass-thumbnail-status-pill rendering — the
  file survives but is rewritten to render only an anchored species
  name (audit §9.5).
- `#globe-tooltip` in `index.html` and the cursor-follower branch in
  `globe.js:update()`. Forbidden by Article 3.
- `.layer-toggle-bar` (Species / Habitats / Threats pills). Article XII.
- `_createColumns` height-encoded media counts in `globe.js`. Article
  XI: "the globe is a body, not a chart."
- `_createFloraFauna` decorative point sprites — drop.
- `COMING_SOON_HOTSPOTS` markers and their `Math.sin` pulse. Editorial
  restraint.
- `HOTSPOTS` consolidation: from 29 entries (multi-pin per species) to
  10 entries (one per species). Sundarbans gets a hand-placed anchor
  at `21.95, 88.9`.
- `@barba/core` from `package.json`. Never imported in `src/`.
- The hero-stat pill, IUCN-status pill, threats grid, comic-strip
  generator, TMDB media gallery, cultural depth grid, "Did You Know?"
  facts grid, "Data sourced from IUCN..." footer line — all die with
  `safari-scene.js`.
- `_createProtectedAreaMarkers` and the `protectedAreaData` array.

---

## 4. The minimum implementation sequence

Eight phases. Each ends with a reviewable artifact. Stop at any
boundary and ship a coherent partial.

**Phase 0 — Persist the prior session's design.** Commit the spec
document and this implementation plan to
`.agents/tasks/task-mangrove-prototype/`. Pure documentation; zero
code change. *(This phase.)*

**Phase 1 — Doctrine baseline on the planet.** Apply homepage-audit
§9.1–§9.5 verbatim, plus: gate every hotspot except Sundarbans into a
"dim, anchored, inert" state. End artifact: an editorially correct
planet with one live target.

**Phase 2 — Z1 cinematic cut.** Replace `onCardClick →
safari-scene.enter()` with `onSundarbansPress → flyToTangent + palette
dissolve + descent mount`. Descent target is empty (delta-tide
darkness) at this milestone. End artifact: the cut works as cinema.

**Phase 3 — Descent prose scaffold.** Author the six-phase prose at
full editorial length (~1,500 words) into
`public/data/sundarbans/descent.json`. Render statically with editorial
type, no scroll animation, one image per phase loaded but not
animated. End artifact: the descent reads as a publication.

**Phase 4 — Citation system.** Inline anchored numerals + in-place
expansion + foot-of-page bibliography. Author ~14 citations into
`public/data/sundarbans/citations.json`. End artifact: every claim
sourced.

**Phase 5 — Z2 ascent + return-to-planet underline.** Inverse cut.
Sundarbans label carries a 1px baseline underline at frame-paper-low
on return. End artifact: round-trip closed. **First truly reviewable
prototype.**

**Phase 6 — Scrollytelling.** Lenis + scoped ScrollTrigger phase fades,
per-phase tonal palette gradient, and the archival 1985/2020 paired
pin in phase 5. One effect per phase per scroll moment. End artifact:
cinematic pacing.

**Phase 7 — noscript long-form fallback.** Render the prose +
bibliography statically into `species/sundarbans.html` and the
`<noscript>` block. End artifact: mobile and JS-disabled honesty.

**Phase 8 — Retire the dead descent.** Delete `safari-scene.js`,
`safari-scene.css`, the unused `@barba/core` dependency, and unlink
non-Sundarbans species pages from active paths. End artifact: the
codebase is the prototype.

---

## 5. Highest-risk technical bottlenecks

1. **Z1 palette continuity across canvas-to-DOM hand-off.** The engine
   renders through ACES tone mapping + bloom; the DOM is gamma-
   corrected sRGB. Mitigation: drop `bloomPass.strength` to 0 across
   the 600ms straddling the hand-off; pin both sides to the same
   desaturated value validated visually in a scratch route, or
   pre-flight the post-tone-mapping sample via `gl.readPixels`.
2. **Lenis inside `position: fixed`.** Reuse the existing safari-scene
   pattern (`scroller: this.container`, `wrapper`/`content` set on
   Lenis). Call `ScrollTrigger.refresh()` once after the prose renders
   post-Z1.
3. **Web font loading vs the held-darkness sentence.** Self-host the
   chosen serif (regular + italic + bold + bold-italic), preload via
   `<link rel="preload" as="font" crossorigin>`, hold the loading
   screen until `document.fonts.ready` or a 1.2s timeout. System
   serif fallback on timeout.
4. **Camera target during Z1.** Compute `worldSundarbans` via
   `getSpeciesPosition('sundarbans').applyMatrix4(group.matrixWorld)`
   *once* at Z1 start (after freezing drag), tween toward a position
   offset along the surface normal by ~3.0 units.
5. **Image rights for the archival pair.** NASA Earth Observatory
   Landsat composites only (USGS public domain). Bonbibi shrine +
   field-worker photographs from Wikimedia Commons under CC-BY-SA,
   credited inline. Author captions before writing prose — prose is
   downstream of what can legally be shown.
6. **GSAP ScrollTrigger plugin import.** Free since 3.11; on 3.15.
   Confirm in build output.

---

## 6. Highest-risk narrative bottlenecks

1. **Phase 4 collapsing into a list of threats.** Phase 4 is *one
   argument with three named mechanisms*, not three subheaders.
2. **The tiger arriving as cliché.** First ~80 words of phase 3 must
   not contain the word "tiger." Animal arrives as perceptual register
   first — water-line, surface tension, the impossibility of a forest
   cat that swims.
3. **The COM-B paragraph being softened into "what you can do."** The
   discipline is honesty about what the viewer cannot affect. The
   viewer cannot affect Farakka. Cite Michie et al. 2011. No CTA.
4. **The memory coda quotation being decorative.** Cite Ghosh, *The
   Hungry Tide* (2004) or Jalais (2010). Earn it.
5. **Witness species choice.** Mudskipper. It is the literal animal
   of the tidal floor; it carries phase 2's "forest as a body"
   register; it does not compete with the protagonist. Fishing cat
   would be too close to a second tiger.
6. **Citation density distribution.** Enforce `0 / 2 / 2 / 6 / 3 / 1`
   across the six phases. Otherwise the page reads as "lyrical prose
   then a citation dump."

---

## 7. Minimum viable visual system

If a token is not in this list, it does not exist on the page.

**Type — one family, one weight family**
```css
--font-body: "IBM Plex Serif", "Source Serif Pro", Georgia, serif;
--type-body:    1.05rem / 1.55;
--type-pull:    1.4rem  / 1.35;   /* phase-opening sentences only */
--type-caption: 0.9rem  / 1.45;
--type-numeral: 0.7rem;            /* citation superscripts */
```
No display family. One weight, italic when grammar demands it. No
tracking adjustments anywhere.

**Colour — four tokens + one phase variable**
```css
--frame-black:      #0d1014;
--frame-paper:      #e8e2d6;
--frame-paper-low:  rgba(232,226,214,0.55);
--frame-tide:       #1f2a2c;       /* descent palette base */
--phase-tint:       var(--frame-tide);
```
No green, no orange, no any-other-accent. Article VII observed.

**Spacing — four units** `0.4rem / 1rem / 2rem / 4rem`. No 12/14/18/24
/32px scale. Generous; editorial.

**Containers** Prose column `max-width: 38rem`, centred. Editorial
breakout (archival pair only) `max-width: 64rem`, centred. Images
aspect-ratio-locked, `width: 100%` of container, no border, no shadow,
no rounded corners.

**Verbs — one underline treatment** 1px frame-paper at 0.4 alpha, 4px
underline-offset, 1px thickness. Same treatment for: anchored hotspot
labels, citation numerals at rest, `Return to the planet`,
bibliography URLs.

**Affordance feedback** Hover lifts a label or numeral by ~15%
luminance via colour interpolation. No emissive flash, no box-shadow,
no transform. An acknowledgement, not a celebration.

**Forbidden** `border-radius` on any element. `backdrop-filter`.
`box-shadow`. Any colour outside the five tokens above.

That's the entire visual system: ~30 lines of CSS variables + one
underline rule.

---

## 8. Minimum viable evidence/citation system

Two JSON files, one renderer, ~150 lines total.

**`public/data/sundarbans/citations.json`** — flat object, integer
keys, no auto-numbering. Numeric keys are stable forever; if a
citation is removed in editing, leave the gap.

```json
{
  "1": {
    "author": "Goldberg, L. and Lagomasino, D. and Thomas, N. and Fatoyinbo, T.",
    "year": 2020,
    "title": "Global declines in human-driven mangrove loss",
    "publication": "Global Change Biology, 26(10): 5844-5855",
    "url": "https://doi.org/10.1111/gcb.15275",
    "method": "Global Mangrove Watch Landsat-derived loss attribution, 2000–2016"
  }
}
```

**`public/data/sundarbans/descent.json`** — six phase objects; prose
carries `[^N]` tokens that the renderer rewrites.

```json
{
  "phase_1_approach": {
    "image": "/img/sundarbans/dawn-tide.jpg",
    "image_caption": "The Sundarbans at the turn of high tide.",
    "image_credit": "USGS / NASA Earth Observatory, 2020-02-14",
    "prose": "When the tide turns over the Bay of Bengal, ..."
  },
  "phase_4_causation": {
    "prose": "Three forces are eating this forest. Upstream, the Farakka barrage[^7] has cut the dry-season sediment supply by an estimated 30 percent[^8]; ..."
  }
}
```

**`src/descent/sundarbans/render.js`** — single file, three
responsibilities:
1. Read both JSONs at descent mount time.
2. For each phase, render `image + caption + credit + prose`. Rewrite
   `[^N]` tokens into `<button class="citation" data-ref="N">`
   carrying the numeral as superscript; on click toggle an
   `<aside class="citation-expansion">` directly below the surrounding
   `<p>`.
3. Render `<section class="bibliography">` iterating
   `Object.keys(citations).sort((a,b)=>+a-+b)` and printing each in
   full bibliographic form.

No CMS. No remote source-of-truth. No search. No filter. Expansion is
*inline*, not a modal, not a tooltip, not a sidebar.

---

## 9. The first truly reviewable prototype (end of Phase 5)

**Present:**
- Editorially correct planet: dark page, off-centre composition,
  ambient drift at ~1 rev / 6 min, drag to rotate, inertia damps to
  drift floor, ten anchored species labels of which only Sundarbans
  lifts on hover and responds to press, a 1px baseline underline on
  the Sundarbans label after the first descent has been completed.
- Held-darkness loader with one editorial sentence (~3.6s total: read
  → hold → dissolve).
- Z1 cut: 3-second flight to a near-tangent over the Bay of Bengal,
  palette continuity into the descent, no UI during the cut, no
  progress indicator.
- Six-phase descent rendered as static editorial type at full
  ~1,500-word length, with one image per phase. Archival pair in
  phase 5: two side-by-side Landsat composites (1985 and 2020),
  credited "USGS / NASA Earth Observatory."
- Inline anchored numerals on every substantive claim — ~14
  citations distributed `0 / 2 / 2 / 6 / 3 / 1` across phases. Press
  to expand inline below the paragraph; press again to close.
- Bibliography section at the foot of the descent, ~14 entries in
  numeric order, full bibliographic form, real URLs, methodological
  note where statistical.
- Single editorial affordance at the foot: `Return to the planet`.
  Press → Z2 (2-second reverse flight). Sundarbans label visibly
  visited.
- `noscript` block at `index.html` listing six phase titles as static
  section anchors (Phase 7 fills the prose dump).

**Deliberately absent (so the prototype is honest):**
- Scroll-driven phase fades and palette gradients (Phase 6).
- Per-phase pinned archival sequence (Phase 6).
- Mobile scrollytelling (Phase 7's static long-form is the fallback).
- Soundscape (registered as an absence per Article XVI).
- Embedded video; *Tiger* (Disneynature, 2024) is a textual citation.
- Mudskipper as a section; phase 2's prose mentions it as a sentence.
- Any second protagonist.

**What the review evaluates:**
1. Whether the editorial register survives the full descent — does it
   feel like a publication or a product page.
2. Whether the cut between planet and descent feels like cinema or a
   route change.
3. Whether the citation system feels academically honest or
   decorative.
4. Whether the COM-B paragraph reads as honesty or as a softened CTA.
5. Whether the memory coda earns its quotation or decorates with it.

If the answer to any of these is "no," the right response is *not* to
add Phase 6's polish — it is to revise the prose. Phase 6 cannot fix
a register problem; it can only amplify what is already there.
