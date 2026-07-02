# Session diary — M25: Place Manifest Phase 1B (Atlas surface consumers)

**Date:** 2026-07-02
**Milestone:** M25 (Observatory v3.0, ADR-001 Phase 1B)
**Role:** Chief Architect + Technical Lead
**Branch:** `feat/exploration-prototypes-and-data-pipelines`
**Feature commit:** `193ad38`

---

## Task

Migrate **exactly one** consumer layer — the Atlas surface (`src/atlas/atlas.js`,
`src/atlas/field-record.js`) — from hard-coded per-place branches to the
canonical Place Manifest (ADR-001), preserving identical runtime behaviour, all
URLs, atlas rendering, and backward compatibility. Do not migrate Homepage or
Cinematic.

## Session protocol

- `git status` clean; HEAD `e97a369` (M24); build green baseline.
- Read both consumers' per-place branches to capture exact current output.

## Changes

- **`atlas.js`** (overview detail card): removed the 5 `n.place.id === …`
  branches. Bridge links now derive from the manifest via
  `getPlaceByNarrativeId(n.id)`: each field-record atlas ("Interaction web →"),
  then each companion atlas ("Research companion →"), then the cinematic place
  (its manifest `enterLabel`). The always-present "Field note →" is unchanged.
- **`field-record.js`** (field-record page back-nav): removed the sundarbans /
  coral-triangle / epr-vents branches. Nav derives via
  `getPlaceBySurfaceSlug(PLACE)` (PLACE is the atlas slug): companion atlas
  links, then the cinematic enter link; "← Living Atlas" is still injected
  first. A field record never links to itself; a place with no cinematic
  (amazon-varzea) gets only the Living Atlas link.

## Parity nuances handled

- **Two lookup keys.** The overview iterates narratives, so atlas.js looks up by
  `narrativeId`. The field-record page is identified by its atlas slug, so
  field-record.js looks up by surface slug (`getPlaceBySurfaceSlug`).
- **Deliberately NOT migrated (content, not nav).** field-record.js retains two
  `PLACE === 'sundarbans'` uses — the `STEPS_SUNDARBANS` bespoke-steps selector
  and the sundarbans-only "attested field note" foot sentence. Neither is
  cross-surface navigation, neither is represented in the manifest, and
  generalising the foot note would *add* it to other places (a behaviour
  change). Left exactly as-is to preserve identical output.
- **Encoding.** `atlas.js`'s label strings were a mix of `→` escapes and a
  literal `→`, which the in-editor patch tool could not match uniformly; that
  one block was replaced deterministically with a Node script anchored on
  arrow-free text. `field-record.js` used uniform literal `→` and was edited
  normally.

## Validation

- **Output parity (proven):** a Node harness reconstructed both old branch sets
  and the new manifest derivations and compared per place — byte-identical link
  lists and order: atlas detail card sundarbans 2 / coral-triangle 3 /
  east-pacific-rise 2 / amazon-varzea 1; field-record nav sundarbans 1 /
  amazon-varzea 0 / coral-triangle 2 / epr-vents 1.
- **URLs + rendering preserved:** `../atlas/<slug>.html`, `../places/<slug>.html`
  unchanged; the field-record canvas/steps engine untouched.
- **Scope confirmed:** `atlas.js` now has 0 per-place nav branches; both atlas
  files import the manifest; `main.js` (Homepage, 7 arrival funcs) and the
  cinematic surfaces are unchanged.
- `check-narratives` (13) + `check-manifest` (4) pass; `npm run build` green;
  working tree clean after docs commit.

## Constraints honored

One consumer layer (Atlas) migrated; identical behaviour; URLs/rendering
preserved; Homepage + Cinematic untouched; ADR-001 not redesigned; minimal and
reversible (2 files, +55/−57).

## Outcome

Two of the three cross-surface consumers (Research, Atlas) now read the
manifest, with proven parity. Only the **Homepage** remains hard-coded. Next:
**M26 Phase 1C** — migrate `main.js`/`index.html` homepage captions + arrivals
to the manifest (`homepagePlaces()`, arrival dispatch by `arrival.kind`),
completing the consumer migration and paired with the homepage-curation
doctrine decision.
