# Session diary — M24: Place Manifest Phase 1A (Research surface consumer)

**Date:** 2026-07-02
**Milestone:** M24 (Observatory v3.0, ADR-001 Phase 1A)
**Role:** Chief Architect + Technical Lead
**Branch:** `feat/exploration-prototypes-and-data-pipelines`
**Feature commit:** `7be690b`

---

## Task

Migrate **exactly one** consumer layer — the Research surface — from hard-coded
per-place navigation to the canonical Place Manifest (ADR-001), preserving
identical runtime behaviour, all URLs, all output, and backward compatibility.
Do not migrate Atlas, Homepage, or Cinematic.

## Session protocol

- `git status` clean; HEAD `ed7669c` (M23); build green baseline.
- Read the sole Research consumer, `src/notes/render-narrative.js`: the
  `SURFACE_LINKS` object keyed by `n.place.id`, rendered by `renderSurfaceLinks`.

## Key join decision

The manifest stores `narrativeId` and a canonical `placeId` that **intentionally
differs** from a narrative's `place.id` (e.g. `east-pacific-rise` vs
`east-pacific-rise-vents`). The reliable join from a narrative to its manifest
entry is therefore `getPlaceByNarrativeId(n.id)` — not `place.id`.

## Change (single file)

`src/notes/render-narrative.js`:
- Added `import { getPlaceByNarrativeId } from '../../cinematic-language/place-manifest.ts'`.
- Removed the per-place `SURFACE_LINKS` table.
- New `surfaceLinksFor(n)` derives links from `place.surfaces`, in the exact
  prior order: each `field-record` atlas → `Interaction web →`, then each
  `companion` atlas → `Research companion →`, then the cinematic place → its
  manifest `enterLabel`. `renderSurfaceLinks` is otherwise unchanged (same
  `<nav class="surface-links">` wrapper, same `escape()` on href/label).
- The generic atlas labels remain in the consumer (research-surface convention,
  not per-place data); only the place-specific cinematic label comes from the
  manifest — consistent with ADR-001's "nav is derived, not declared."

## Validation

- **Output parity (proven):** a Node harness reconstructed the old
  `SURFACE_LINKS` table and the new manifest derivation and compared them per
  place — byte-identical link lists for sundarbans (2), coral-triangle (3),
  east-pacific-rise (2), amazon-varzea (1); and a research-only narrative
  (`dinaric-olm-century-lifespan`) yields no links under both, matching the old
  empty-string behaviour. Since the HTML wrapper is unchanged, link-list parity
  = output parity.
- **URLs preserved:** `../atlas/<slug>.html` and `../places/<slug>.html`
  unchanged for every place.
- **Data-source-only change confirmed:** the manifest is now bundled into the
  `render-narrative` (research) bundle (the sundarbans `enterLabel` "Enter the
  living place →", whose hardcode was removed, is present); `main`, `places-*`,
  and `atlas-globe` bundles are confirmed free of the manifest.
- **Scope confirmed:** Atlas (`atlas.js` 5 `n.place.id ===` branches),
  Homepage (`main.js` arrivals), and Cinematic sources are unchanged.
- `check-narratives` (13) + `check-manifest` (4) pass; `npm run build` green;
  working tree clean after docs commit.

## Constraints honored

One consumer layer migrated; identical behaviour; URLs/output preserved;
Atlas/Homepage/Cinematic untouched; ADR-001 not redesigned; change minimal and
reversible (single file, 41/20 line diff).

## Outcome

The Research surface is now driven by the manifest with zero behavioural
change — the first consumer proven to migrate cleanly. This de-risks the
remaining phases. Next: **M25 Phase 1B**, the Atlas consumers (`atlas.js`
detail-card branches and `field-record.js` nav branch), each verified for
output parity the same way.
