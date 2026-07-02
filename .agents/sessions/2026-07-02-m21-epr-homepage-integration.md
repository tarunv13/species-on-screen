# Session diary — M21: East Pacific Rise homepage integration

**Date:** 2026-07-02
**Milestone:** M21 (first post-v2.0)
**Role:** Implementation (Technical Lead)
**Branch:** `feat/exploration-prototypes-and-data-pipelines`
**Feature commit:** `5446b2a`

---

## Task

Begin the first post-v2.0 milestone: implement the highest-priority
product-completeness gap — East Pacific Rise homepage integration — closing the
sole Major warning from the v2.0 Independent Release Review (EPR unreachable
from the planetary homepage). Preserve the homepage architecture, reuse existing
navigation patterns, do not redesign the homepage, and do not modify Cinematic /
Atlas / Research implementations beyond the homepage integration required.

## Session protocol

- `git status` clean; HEAD `72caec7` (v2.0 release prep); build green baseline.
- Reconstructed the homepage architecture from `index.html`, `src/main.js`,
  `src/style.css`.

## What the reconstruction established

The homepage carries editorial **caption anchors** inside `#globe-ui-container`,
each wired in `main.js` to an arrival function:

- `#page-caption` (Sundarbans) → `arriveAtSundarbans()` — uses the globe's
  `tiger` hotspot: camera fly to the hotspot, then the Article III luminance
  dip, then navigate to `places/sundarbans.html`.
- `#page-caption-crossing` (Coral Triangle) → `arriveToCrossing()` — **no globe
  hotspot** (an open-ocean journey), so it skips the camera fly and runs the
  luminance dip only.

EPR is the same shape as the Crossing: an abyssal descent, not a point on the
planet, with no globe hotspot. The Crossing is therefore the exact template —
no globe/hotspot work is required (adding an EPR hotspot would modify `globe.js`,
out of scope).

## Changes (four additive edits, one per surface concern)

1. **`index.html`** — added a third caption anchor `#page-caption-epr`
   ("East Pacific Rise · Giant tubeworm"), `class="page-caption
   page-caption--tertiary"`, `href` fallback to the EPR research note
   (`notes/east-pacific-rise-tubeworm-chemosynthesis.html`) for JS-off visitors,
   `data-place="epr-vents"` — mirroring `#page-caption-crossing`.
2. **`src/main.js`** — (a) wired the caption's click in `setupPageCaption()` to
   `arriveToEPR()`; (b) added `arriveToEPR()`, a verbatim mirror of
   `arriveToCrossing()` that navigates to `places/epr-vents.html` (luminance-dip-
   only Article III arrival; the destination opens on a near-black `#02030a`
   body, so the dark frame is continuous across the cut); (c) revealed the
   caption alongside the others in `runLandingSequence()`'s onComplete.
3. **`src/style.css`** — added `.page-caption--tertiary` (and its `:hover` and
   mobile override), stacking the third caption above the secondary at
   `bottom: 5.2rem` (5.6rem mobile) in the same subordinate `ink-low` register.
   Continues the existing primary/secondary hierarchy; no new typographic
   treatment.

The Crossing arrival grammar was reused verbatim (Departure → luminance dip →
cut at peak black, `k`-scaled for reduced motion). Nothing in
`places/*`, `atlas/*`, `src/atlas/*`, or `src/notes/*` was touched — the
integration is entirely on the homepage surface.

## Scope discipline

- No homepage redesign: the change is one caption + one arrival function + one
  CSS position modifier — the same extension shape the Crossing used.
- No globe/hotspot change: EPR uses the hotspot-free arrival, so `globe.js` is
  untouched.
- No changes to Cinematic, Atlas, or Research implementations.

## Validation

- `npm run build` green (`check-narratives` via prebuild).
- `#page-caption-epr` present in `dist/index.html`; `places/epr-vents.html`
  arrival target present in the built bundle.
- All EPR wiring points confirmed in source (`arriveToEPR`, caption listener,
  landing-sequence reveal, tertiary CSS).
- Working tree clean after the docs commit.

## Outcome

All three cinematic places now have a homepage entry point. The v2.0 review's
sole Major warning is closed; EPR is discoverable from the primary (planetary)
entry with the same paced Article III arrival as the other places. Remaining
open items are the tracked Minor warnings (EPR DwC-A DOI audit, EPR atlas
backdrop recipe) and deferred features (Amazon várzea cinematic, M18 coherence
follow-ups).
