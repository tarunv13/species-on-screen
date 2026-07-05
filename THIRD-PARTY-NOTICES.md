# Third-party notices

The Eco-Cinema Observatory reuses external data standards, datasets, and
software libraries. Each retains its upstream license and attribution. This
file records them. **Policy: only license-compatible third-party content
(CC0, CC-BY, public domain, or OSI-approved permissive software) is admitted;
NC / ND / unknown-license assets are not vendored into this repository.**

## Data & scientific standards

- **GBIF Backbone Taxonomy** — used for all per-occurrence taxonomy
  (`kingdom`/`phylum`/`class`/`order`/`family`, `gbifTaxonKey`) and verified via
  the GBIF species-match API. License: **CC-BY-4.0**. Attribute: GBIF
  Secretariat, GBIF Backbone Taxonomy (https://doi.org/10.15468/39omei).
  Per-occurrence source URLs are recorded in each archive's
  `associatedReferences`.
- **Global Biotic Interactions (GloBI)** — interaction corroboration and the
  interaction-typing convention (OBO Relations Ontology terms as GloBI uses
  them). Attribute: Poelen, J.H. et al., Global Biotic Interactions
  (https://www.globalbioticinteractions.org). Interaction records also carry
  their own literature citations in `relationshipAccordingTo`.
- **OBO Relations Ontology (RO)** — interaction relationship identifiers
  (`relationshipOfResourceID`, e.g. `RO_0002470` eats, `RO_0002439` preysOn,
  `RO_0002454` hasHost). License: **CC-BY-4.0** (OBO Foundry). Terms are used
  as stable identifiers via `http://purl.obolibrary.org/obo/`.
- **Interaction literature** — facts are drawn from cited peer-reviewed and
  grey-literature sources listed in each archive's `CREDITS.md` and in
  `relationshipAccordingTo`. Facts are not copyrightable; source *expression*
  is never copied.

## Software libraries (runtime & build)

Dependencies are declared in `package.json`; each is used under its own license:

- **three.js** — 3D globe rendering — MIT License.
- **GSAP (GreenSock Animation Platform)** — cinematic timelines — GreenSock
  Standard "No Charge" License (free tier); see https://gsap.com/licensing/.
- **Lenis** — smooth scroll — MIT License.
- **Vite** — build tooling — MIT License.

## Media & audio

No third-party raster images or audio recordings are currently vendored; all
visuals and the ambient beds are generated procedurally in code. When
openly-licensed field recordings or photoreal plates are added, each asset's
license and source must be recorded here (and in the relevant `CREDITS.md`)
before it is committed. Only CC0 / CC-BY / public-domain media are eligible.
