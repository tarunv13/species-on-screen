# Session diary — M23: Place Manifest, Phase 0 (describe, don't consume)

**Date:** 2026-07-02
**Milestone:** M23 (Observatory v3.0, ADR-001 Phase 0)
**Role:** Chief Architect + Technical Lead
**Branch:** `feat/exploration-prototypes-and-data-pipelines`
**Feature commit:** `017b428`

---

## Task

Implement ADR-001 Phase 0: create the canonical **Place Manifest** as the single
source of truth for cross-surface place bindings, **describing the current
repository state without changing Observatory behaviour**. No consumer reads it
yet. Canonical representation = JSON source (per the pre-M23 representation
decision): JSON + JSON Schema + typed TS wrapper + dependency-free validator,
integrated into the existing validation workflow.

## Session protocol

- `git status` clean; HEAD `3c68fe6` (M22); build green baseline.
- Captured ground truth so the manifest describes reality exactly: homepage
  caption text/order (`index.html`), arrival kinds (`main.js`: sundarbans =
  globe-hotspot `tiger`; crossing + epr = dip-only), enter-labels
  (`render-narrative.js` SURFACE_LINKS), and DwC-A counts (`index.json`).
  Confirmed **amazon-varzea** is a multi-surface place (research + atlas + dwca,
  no cinematic/homepage) and must be in the manifest.

## What shipped

- **`cinematic-language/place-manifest.json`** — canonical source: an object
  with `$schema` + `places[]`. Four entries describing the current state:
  - `sundarbans` — cinematic `sundarbans` (globe-hotspot `tiger`), atlas
    field-record, dwca 9/10, homepage order 1.
  - `coral-triangle` — the stress test: cinematic slug `crossing` (dip),
    **two** atlas surfaces (`coral-triangle` field-record + `crossing`
    companion), dwca 9/10, homepage order 2.
  - `east-pacific-rise` — cinematic/atlas/dwca slug `epr-vents` (dip), dwca
    9/10, homepage order 3.
  - `amazon-varzea` — research + atlas + dwca (8/8); no cinematic, no homepage.
  Canonical `placeId` is distinct from the per-surface slugs it records (e.g.
  `east-pacific-rise` vs slug `epr-vents`) — no files renamed. Cross-surface nav
  is left to be **derived** from `surfaces` by Phase 1 consumers, not declared.
  Research-only narratives excluded (convention covers their single surface).
- **`cinematic-language/place-manifest.schema.json`** — JSON Schema (draft
  2020-12): editor support + documentation; conditional rule (globe-hotspot ⇒
  hotspotId).
- **`cinematic-language/place-manifest.ts`** — thin typed wrapper importing the
  JSON and re-exporting typed accessors (`PLACES`, `getPlaceById`,
  `getPlaceByNarrativeId`, `getPlaceBySurfaceSlug`, `homepagePlaces`).
  Unconsumed in Phase 0 → not reachable from any entry → not bundled.
- **`scripts/check-manifest.js`** — dependency-free validator (Node stdlib
  only), mirroring `check-narratives.js`. Enforces: schema-shape (required
  fields, types, enums, no unknown keys); canonical ids (unique kebab
  `placeId`, kebab `narrativeId`/slugs, `research.slug == narrativeId`, unique
  `homepage.order`); referenced-file existence (`notes/`, `places/`, `atlas/`,
  `public/dwca/<slug>/` core files, and the bound narrative `.ts`); **DwC-A
  count parity** (declared `actors`/`interactions` vs actual archive rows); and
  navigation bindings (arrival present for cinematic; `hotspotId` for
  globe-hotspot; homepage requires cinematic; companion atlas requires a
  field-record).
- **`package.json`** — `prebuild` now runs `check-narratives && check-manifest`;
  added the `check-manifest` script. (Workflow integration only.)

## Constraints honored

- No consumer reads the manifest; no navigation change; no existing code
  refactored; no architectural expansion beyond ADR-001. Confirmed the manifest
  is **absent from `dist/`** — runtime behaviour is unchanged.

## Validation

- `place-manifest.json` and `place-manifest.schema.json` are valid JSON.
- `check-manifest` passes: **4 places, all bindings resolve**.
- **Negative test** (against a temp copy, restored afterward with the tree left
  clean): the validator correctly failed (exit 1) on a wrong `dwca.actors`
  count and a missing `hotspotId`, with precise messages.
- `npm run build` green through both prebuild validators (`check-narratives` 13
  ok; `check-manifest` 4 ok).
- Working tree clean after the docs commit.

## Outcome

The Observatory now has a validated, single source of truth for cross-surface
place bindings that exactly describes the current repository — with zero
behavioural change. This is the keystone for v3.0. Phase 1a (M24) will point the
research and atlas navigation consumers at the manifest, removing their
per-place branches one surface at a time, each step verified for output parity.
