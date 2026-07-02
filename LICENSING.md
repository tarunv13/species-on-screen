# Licensing

The Eco-Cinema Observatory (`species-on-screen`) is a heterogeneous research
repository — executable code, scholarly documentation and editorial prose,
structured Darwin Core data, and (in future) media. It is therefore
**licensed by content type**. This file is the authoritative map; each
instrument below is the standard for its reuse community, chosen to maximise
long-term scientific credibility, reproducibility, and reuse.

**Copyright 2026 Eco-Cinema Observatory (`species-on-screen`) contributors.**

## Content-type license map

| Content type | Applies to | License |
|---|---|---|
| **Code** | `src/`, `scripts/`, build config, `*.js` / `*.mjs` / `*.ts` runtime and tooling, `index.html`, `places/*.html`, `atlas/*.html`, `notes/*.html` templates | **Apache License 2.0** (see [`LICENSE`](./LICENSE)) |
| **Documentation & editorial prose** | `.kiro/steering/`, `cinematic-language/*.md`, `.agents/` doctrine, decisions, session diaries, `README.md`, `PROJECT_STATUS.md`, and the editorial/narrative text in `cinematic-language/narratives/*.ts` and `notes/*.html` | **Creative Commons Attribution 4.0 International (CC-BY-4.0)** — https://creativecommons.org/licenses/by/4.0/ |
| **Darwin Core data** | `public/dwca/**` (occurrence, resource-relationship, meta.xml, eml.xml, CREDITS.md) | **Creative Commons Attribution 4.0 International (CC-BY-4.0)**, declared in each archive's `eml.xml` `<intellectualRights>` |
| **Original media** | original illustrations, generated art, and any original images/audio placed under `public/art/` or similar | **CC-BY-4.0** |
| **Third-party content** | see [`THIRD-PARTY-NOTICES.md`](./THIRD-PARTY-NOTICES.md) | retains its upstream license; only license-compatible assets are admitted |

If a file's type is ambiguous, the more restrictive-of-reuse interpretation
does **not** apply automatically — instead, treat authored prose as CC-BY-4.0,
executable/config as Apache-2.0, and structured data under `public/dwca/` as
CC-BY-4.0, and record any exception here.

## Why these instruments

- **Apache-2.0 for code** — permissive (maximises reuse, which serves an open
  conservation tool) while adding an explicit patent grant and clear
  contribution/attribution terms that give a long-lived academic artifact more
  legal durability than a bare permissive license. Copyleft was rejected
  because it would suppress exactly the institutional and educational reuse this
  project wants.
- **CC-BY-4.0 for documentation, editorial prose, and data** — the scholarly
  standard: fully open and reusable while preserving the attribution that is an
  academic's currency. The GBIF taxonomy backbone this data derives from is
  itself CC-BY-4.0, so the compilation license is clean and compatible.
- **No NC / ND** — non-commercial and no-derivatives clauses are excluded on
  principle: they block legitimate educational, infrastructural, and
  translation reuse, are remix-incompatible with CC-BY/CC0, and are disfavoured
  in open-science practice.

## How to comply (attribution)

- **Code:** retain the Apache-2.0 `LICENSE` and copyright notices; state
  changes in modified files (Apache-2.0 §4).
- **Docs, prose, data, media (CC-BY-4.0):** credit *"Eco-Cinema Observatory
  (species-on-screen), CC-BY-4.0"* with a link to this repository, and indicate
  if changes were made. For the Darwin Core data, the per-archive `eml.xml`
  `<intellectualRights>` is the machine-readable license of record.
- **Citation:** see [`CITATION.cff`](./CITATION.cff).

## Scope note

This project remains single-author and is not currently open to external
contribution (see `README.md`). These licenses govern **reuse of the published
artifacts**, not a contribution process. Software-heritage archival, a Zenodo
DOI, `codemeta.json`, and schema.org Dataset metadata are planned future
milestones and are not part of this foundation.
