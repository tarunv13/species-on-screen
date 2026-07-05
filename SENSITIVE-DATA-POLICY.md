# Sensitive locality policy

This is a conservation project publishing open data. Open geographic data can
cause harm: precise localities of exploitable or threatened species can aid
poaching, collection, or disturbance. This policy is a standing governance
obligation, binding on every place added to the Observatory.

## Principle

**Never publish precise localities of species that could be harmed by their
disclosure.** Locality precision is deliberately generalised, and the
generalisation is recorded, not hidden.

## Current practice (as of this foundation)

- Darwin Core coordinates in `public/dwca/**` are **representative, not
  precise**: geographic-centre / reserve-centroid / spreading-ridge-segment
  points, with small deterministic jitter where used.
- `coordinateUncertaintyInMeters` is set to reflect that generalisation
  (e.g. 5,000–50,000 m), never a false precision.
- The archives are labelled **"attested, illustrative"** in their EML abstracts:
  they are curated interaction datasets, not precise primary-occurrence records.
- The **cinematic surface** carries no coordinates, names, or identifiers at all
  (platform-architecture §3), so it exposes no locality data by construction.

## Rules for future places

Before any new place is added:

1. **Classify the taxa.** If any actor is a species vulnerable to
   collection/persecution (e.g. CITES-listed, IUCN threatened, or otherwise
   sensitive), precise localities must not be published.
2. **Generalise to the coarsest scale that preserves ecological meaning** —
   protected-area, region, or grid-cell centroid — and set
   `coordinateUncertaintyInMeters` accordingly. Follow GBIF's guidance on
   sensitive-species data
   (https://www.gbif.org/document/80512/best-practices-for-recording-and-publishing-sensitive-species-data).
3. **Prefer illustrative/representative coordinates** over exact ones for this
   project's editorial purpose; exactness is not required for an interaction
   web and is a liability.
4. **Record the decision** in the place's DwC-A `CREDITS.md` and, where a ruling
   is made, in `.agents/decisions/`.

## Review gate

Adding precise coordinates for a sensitive taxon is a **blocking** condition:
it may not be committed without an explicit written justification and a
generalisation decision recorded per rule 4. When in doubt, generalise.
