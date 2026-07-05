# Session diary — M22: before-PhD open-science governance foundation

**Date:** 2026-07-02
**Milestone:** M22
**Role:** Principal Architect + Open Science Advisor → Implementation
**Branch:** `feat/exploration-prototypes-and-data-pipelines`
**Feature commit:** `f5faa45`

---

## Task

The governance strategy (Option B — independent scholarly observatory that
interoperates with GBIF; decision papers of 2026-07-02) was approved. Implement
**only the "Before PhD" foundation**: Apache-2.0 LICENSE, LICENSING.md,
CITATION.cff, THIRD-PARTY-NOTICES.md, EML `<intellectualRights>`, repository
citation/reuse metadata, and a sensitive-locality policy. No architecture,
functionality, or DwC-A structural change (metadata only). Validate all
metadata. Defer Zenodo, Software Heritage, codemeta.json, schema.org Dataset
metadata, CI enhancements, and GloBI integration.

## Session protocol

- `git status` clean; HEAD `b6a4cd2` (M21); build green baseline.
- Confirmed the current gap: no `LICENSE`, `CITATION.cff`, `codemeta`, `.zenodo`;
  no EML `<intellectualRights>`. Read the two EMLs not previously seen
  (sundarbans, amazon-varzea) to place the rights element precisely; confirmed
  the git remote for citation metadata.

## What shipped

Content-typed licensing, per the approved strategy:

- **`LICENSE`** — full Apache License 2.0 text (code).
- **`LICENSING.md`** — authoritative content-type → license map: code
  Apache-2.0; documentation, editorial prose, and Darwin Core data CC-BY-4.0;
  original media CC-BY-4.0; third-party retains upstream license. Records the
  rationale (permissive-with-attribution; NC/ND/copyleft excluded) and the
  copyright line.
- **`CITATION.cff`** — CFF 1.2.0 software citation. `version: 2.0.0` (matches the
  `observatory-v2.0` tag), `license: [Apache-2.0, CC-BY-4.0]`, repository-code
  and url set. Author recorded from the git handle with an explicit in-file
  TODO to replace with full legal name + ORCID before the first formal citation
  or archival release (Zenodo DOI is a deferred milestone).
- **`THIRD-PARTY-NOTICES.md`** — GBIF Backbone Taxonomy (CC-BY-4.0), GloBI, OBO
  Relations Ontology (CC-BY-4.0), interaction literature; runtime libraries
  (three.js MIT, GSAP GreenSock Standard, Lenis MIT, Vite MIT); a media policy
  (CC0/CC-BY/PD only; per-asset provenance before commit).
- **`SENSITIVE-DATA-POLICY.md`** — standing conservation-ethics safeguard:
  never publish precise localities of exploitable/threatened taxa; generalise
  and record; follow GBIF sensitive-species guidance; a blocking review gate for
  precise sensitive coordinates. Documents that current coordinates are already
  representative and the cinematic surface exposes no locality data.
- **`eml.xml` × 4** — added `<intellectualRights>` (CC-BY-4.0, machine-readable
  `ulink`) between `</abstract>` and `<coverage>` (correct EML 2.1.1 order).
- **`scripts/ingest/build-dwca.mjs`** — the `eml()` template gained the same
  `<intellectualRights>` block so regenerating sundarbans/amazon-varzea does not
  drop the rights (reproducibility parity for the rights metadata).
- **`package.json`** — `license: Apache-2.0`, `description`, `author`,
  `repository`, `homepage` (citation/reuse metadata; the private package version
  is left at 0.1.0 — the *citable* version is the git tag, carried by
  `CITATION.cff`).

## Scope discipline

- No repository architecture change; no Observatory functionality change; DwC-A
  changed at the **metadata** level only (`<intellectualRights>`), not
  structure — occurrence/relationship columns and `meta.xml` untouched.
- Zenodo, Software Heritage, `codemeta.json`, schema.org Dataset metadata, CI
  enhancements, and GloBI integration explicitly deferred to future milestones
  (backlog item 4).

## Validation

- All four `eml.xml` parse well-formed (Python minidom) and contain
  `<intellectualRights>`.
- `package.json` and `public/dwca/index.json` are valid JSON; `license` and
  `repository` present.
- `CITATION.cff` is valid YAML with all required CFF keys (`cff-version`,
  `message`, `title`, `authors`, `type`); `version` and `license` correct.
- `npm run build` green; CC-BY rights present in all four `dist/dwca/*/eml.xml`.
  Repo-level governance files correctly do **not** ship to `dist/` (they are
  repository metadata, not deployed site assets).
- Working tree clean after the docs commit.

## Follow-ups (logged to backlog item 4)

Zenodo concept/version DOIs (into CITATION.cff + EML packageId); codemeta.json;
schema.org Dataset JSON-LD; CI DwC-A/link/license validation; Software Heritage
+ Internet Archive snapshots; GloBI contribution of interactions; author
full-name/ORCID completion. GBIF registration only if archives are reframed.

## Outcome

The repository is converted from "readable artifacts" into a legally reusable,
citable scientific resource: every content type has an explicit license, the
Darwin Core archives carry machine-readable CC-BY rights, the project is
citable via CITATION.cff, third-party dependencies are attributed, and a
conservation-ethics safeguard is in force. This is the before-PhD foundation of
the approved Option-B open-science strategy.
