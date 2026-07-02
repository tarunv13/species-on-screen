# Session diary — M26: Place Manifest Phase 1C (Homepage consumer)

**Date:** 2026-07-02
**Milestone:** M26 (Observatory v3.0, ADR-001 Phase 1C; governed by ADR-002)
**Role:** Chief Architect + Technical Lead
**Branch:** `feat/exploration-prototypes-and-data-pipelines`
**Feature commit:** `9153f4c`

---

## Task

Migrate the **Homepage** — the last hard-coded consumer — to the Place Manifest,
under the ADR-002 hybrid: keep the curated cinematic entrance, but make the
arrival data and dispatch manifest-driven. Preserve captions, ordering, timings,
animations, globe choreography, arrival behaviour, and identical runtime output.
No generated captions, no auto-inclusion, no new arrival types, no redesign, no
visual change.

## Session protocol

- `git status` clean; HEAD `18925c1` (M25); build green baseline.
- Read the full `src/main.js`: three bespoke arrival functions
  (`arriveAtSundarbans` globe-hotspot/`tiger`; `arriveToCrossing`,
  `arriveToEPR` dip-only), per-id caption wiring, and per-id landing reveal.

## Design (ADR-002 hybrid, parity-exact)

- **Captions stay authored.** The static caption anchors in `index.html` are the
  curated composition — left untouched (no generation, no derived text, no
  auto-inclusion). `index.html` is unchanged.
- **Arrival data/dispatch become manifest-driven.** One `arrive(place, captionEl)`
  dispatcher replaces the three functions, branching on
  `cinematic.arrival.kind`: `globe-hotspot` runs the full Article III
  (departure fades the arriving caption + chrome → camera fly to `hotspotId` →
  luminance dip → cut at 3.0s·k); `dip` skips the fly (departure fades chrome →
  dip → cut at 1.5s·k). All timings, easings, and the cut targets are the
  pre-M26 values verbatim; only which place/kind/hotspot/target is now data.
- **Caption→place binding without touching markup.** `setupCaptions()` reads
  each caption's existing `href` (`notes/<slug>.html`), and resolves the place
  via `getPlaceByNarrativeId(slug)` (research slug == narrativeId). No new data
  attributes, no id conventions. A caption that resolves to no manifest place —
  or a place with no cinematic surface — is left as a plain link.

## Parity nuances handled

- **Primary-caption squared fade preserved.** The old globe-hotspot arrival
  faded `#page-caption` *and* its parent `#globe-ui-container` simultaneously
  (the primary caption fades slightly faster). The dispatcher reproduces this by
  fading `captionEl` (the arriving caption) plus the container in the
  globe-hotspot branch; the dip branch fades only the container — exactly as
  before.
- **Two dip functions collapsed to one branch.** Crossing and EPR were identical
  dip functions; they now share the dip branch, dispatched to their own
  `cinematic.slug` — identical per-invocation behaviour.
- **Encoding.** `main.js` comments carry literal `§`/`—` escapes; the
  migration was applied with a deterministic Node patch anchored on ASCII code
  to avoid escape-matching hazards.

## Validation

- **Arrival parity proven:** each caption's href slug → manifest →
  (kind, hotspotId, dest) matches the old hardcoded arrivals exactly —
  sundarbans → globe-hotspot / tiger / places/sundarbans.html; coral-triangle →
  dip / places/crossing.html; east-pacific-rise → dip / places/epr-vents.html.
- **Timelines intact:** every timing constant of both grammars survived with the
  correct counts; the globe-hotspot branch fades the arriving caption (1
  occurrence), the dip branch fades only chrome.
- **Curation intact:** `index.html` unchanged (3 authored caption anchors); the
  homepage bundle now embeds the manifest arrival data; 0 bespoke arrivals and 0
  stale `pageCaption` references remain.
- `check-narratives` (13) + `check-manifest` (4) pass; `npm run build` green
  (`src/main.js` +87/−247 — the per-place duplication collapsed to one
  dispatcher). Working tree clean after docs commit.

## Constraints honored

Homepage only; identical behaviour, URLs, timings, choreography; captions
human-authored and not generated; no auto-inclusion; no new arrival types; no
visual change / redesign; ADR-001 and ADR-002 not redesigned; minimal and
reversible (one file).

## Outcome

The Place Manifest consumer migration is **complete**. All three cross-surface
consumers — Research (M24), Atlas (M25), Homepage (M26) — now read the single
source of truth; the cinematic surfaces remain pure (no outbound nav). Adding or
re-curating a place is now a manifest edit (plus, for the homepage, one authored
caption anchor) rather than edits across six code sites. This closes ADR-001
Phase 1 and clears the way for the remaining v3.0 items (manifest-driven
`new-place` generator, derived indexes, discovery).
