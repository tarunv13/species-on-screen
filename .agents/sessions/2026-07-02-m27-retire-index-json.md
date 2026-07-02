# Session diary — M27: retire public/dwca/index.json (single source of truth)

**Date:** 2026-07-02
**Milestone:** M27 (Observatory v3.0; resolves the certification's dual-source debt)
**Role:** Chief Architect + Technical Lead
**Branch:** `feat/exploration-prototypes-and-data-pipelines`
**Feature commit:** `534fa64`

---

## Task

Eliminate `public/dwca/index.json` as an independently maintained metadata
source, completing the transition to a single canonical source of truth
(ADR-001). Preserve identical runtime behaviour, all URLs, atlas discovery,
field-record rendering, and backward compatibility. Choose the smallest change
that satisfies ADR-001; do not redesign ADR-001; do not expand scope.

## Session protocol

- `git status` clean; HEAD `44d7522` (M26); build green baseline.
- Confirmed the two production consumers of `index.json` (`atlas.js` discovery
  panel; `field-record.js` `PLACE_META`) both already import the manifest
  wrapper (from M25). The `index.json` metadata (id/name/type) is fully covered
  by the manifest (dwca.slug / displayName / type).

## Decision: consume the manifest directly (delete index.json)

Two options were considered: (A) derive `index.json` from the manifest at
build time, or (B) remove the dependency and consume the manifest directly.
**Chose B** — the simpler long-term architecture: no generated artifact, no
build-time codegen, no runtime fetch, and one source that consumers import.
Since both consumers already import the manifest, B is also the smaller change.

## Changes

- **`src/atlas/atlas.js`** — the field-records discovery panel is built from
  `PLACES` (filtered to places with a `dwca` surface and a `field-record` atlas)
  instead of `fetch('dwca/index.json')`. Each chip's href/name/type derive from
  the field-record atlas slug / `displayName` / `type`.
- **`src/atlas/field-record.js`** — `PLACE_META` (masthead name + backdrop type)
  is `{ name: displayName, type }` from `getPlaceBySurfaceSlug(PLACE)`, replacing
  the `index.json` fetch. All existing `PLACE_META.name`/`.type` uses unchanged.
- **`scripts/ingest/build-dwca.mjs`** — stopped writing `public/dwca/index.json`
  (it would otherwise resurrect the dual source). The manifest is authoritative;
  `check-manifest` validates its dwca counts against each archive's actual rows,
  so regenerating an archive that changes counts forces a manifest update.
- **`cinematic-language/place-manifest.json`** — `places` array reordered to
  `[sundarbans, amazon-varzea, coral-triangle, east-pacific-rise]` via a
  formatting-preserving block move (11/11 lines, no reformatting) so the
  discovery panel renders in byte-identical order to the retired `index.json`.
  The manifest array order is now the canonical discovery order.
- **`src/atlas/atlas.css`** — stale comment updated (panel populated from the
  manifest, not `index.json`).
- **`public/dwca/index.json`** — deleted.

## Validation

- **Discovery parity — byte-identical (order + content):** a Node harness
  compared the manifest-derived chips against the retired `index.json`; all four
  places match on href (`atlas/<slug>.html`), name (`displayName`), and type,
  in the same order after the manifest reorder.
- **field-record parity:** `PLACE_META` name/type identical per place.
- **No duplicated metadata / no stale production refs:** no production consumer
  references `dwca/index.json`; the file is absent from repo and `dist/`. The
  only remaining references are the dev-only prototypes
  (`src/prototypes/*`), which are excluded from the production build and whose
  optional fetch degrades gracefully — left untouched (out of scope).
- `check-narratives` (13) + `check-manifest` (4) pass; `npm run build` green.
- Working tree clean after docs commit. (The feature commit was amended once to
  include the consumer migration alongside the deletion, so M27 is one coherent
  commit rather than a broken deletion-only state.)

## Constraints honored

Smallest ADR-001-satisfying change; identical behaviour, URLs, discovery, and
field-record rendering; no ADR-001 redesign; scope not expanded (prototypes and
ingest editorial config untouched beyond stopping the index.json emission);
reversible.

## Outcome

The Place Manifest is now the **single canonical source of truth** for
cross-surface place bindings and DwC-A discovery. Adding or re-curating a place
is a single manifest-anchored edit; there is no second metadata file to keep in
sync, and `check-manifest` guards the manifest against the archives. This closes
the one architectural-debt item from the v3.0 certification — ADR-001's
single-source goal is now total, and the Observatory is unconditionally ready to
scale to many more ecological places.
