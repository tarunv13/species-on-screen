# L3 conformance — data-model placements (for Research Curator review)

**Date:** 2026-07-03
**Status:** Proposed. Implements the two placements that reuse existing Darwin Core terms;
**defers** the one placement that has no Darwin Core slot to a TDWG-profile decision. Concerns
curated scientific data, so the archive-facing parts are routed to the Research Curator per the
AI-OS invocation criteria before any archive is modified.
**Governs:** conformance level L3 of the interaction-claim binding profile
(`docs/interaction-claim-binding-profile.md`).

---

## Context

L3 was specified as "reconciliation against a version-pinned backbone snapshot; the support
relation carries an ECO/SEPIO evidence code and a PROV attribution for the binding's creation."
Each of its three requirements needs a *place to live* in a Darwin Core Archive. This record
fixes those placements standards-first (reuse over invention), and separates what can be enforced
now from what needs a standards process.

## Placements

### 1. Pinned backbone version → `dynamicProperties.backboneVersion` (occurrence-level)

`dwc:dynamicProperties` is the Darwin Core term for additional structured data, already used by
these archives (it carries `gbifTaxonKey`). A backbone *version* (ideally the GBIF Backbone
Taxonomy dataset DOI, which is versioned) is added there:
`"backboneVersion": "10.15468/39omei"`. This makes reconciliation reproducible: a checker can
confirm the taxon key was valid against a *declared, dated* snapshot, not merely "GBIF today."
- **Reason code:** `BACKBONE_UNPINNED` (a referenced occurrence declares no backbone version).
- **Enforceable now:** yes — pure reuse of an existing term. Implemented at `--level=L3`.

### 2. Assertion provenance (temporal) → `relationshipEstablishedDate` (existing DwC term)

`dwc:relationshipEstablishedDate` is an existing ResourceRelationship term, already present (but
empty) in these archives. It carries the PROV `generatedAtTime` of the binding's *creation* —
distinct from `relationshipAccordingTo` (the source of the ecological claim). The agent side of
PROV attribution is carried at dataset level by the EML `<creator>`.
- **Reason code:** `ASSERTION_UNATTRIBUTED` (`relationshipEstablishedDate` is empty).
- **Enforceable now:** yes — pure reuse of an existing term. Implemented at `--level=L3`.

### 3. ECO/SEPIO evidence code → **no Darwin Core slot; deferred to TDWG**

The support relation's *evidence type* (e.g. ECO:0000212) has no field in the Darwin Core
ResourceRelationship extension. `relationshipOfResourceID` already carries the *relation* type
(OBO RO), not the evidence type. The standards-first options are:
- (a) a namespaced token in `relationshipRemarks` (interim, semi-structured, reuse-only);
- (b) a Darwin Core MeasurementOrFact extension row linked by `resourceRelationshipID`
  (`measurementType = evidenceCode`, `measurementValue = ECO:…`) — cleaner, adds an extension;
- (c) propose an evidence-code term to a TDWG profile extension (durable).
- **Reason code (reserved, not yet enforced):** `EVIDENCE_CODE_MISSING`.
- **Decision:** do not enforce until the placement is chosen with the Research Curator and, for
  (b)/(c), TDWG. Inventing a local field now would violate "prefer standards over invention."

## What this changes

- The **validator** gains `--level=L3` enforcing `BACKBONE_UNPINNED` and `ASSERTION_UNATTRIBUTED`
  (both pure DwC reuse). No curated archive is modified: like L2, the production archives simply
  report the L3 gaps as an actionable upgrade path.
- The **profile** (§5) marks L3 partially implemented, with `EVIDENCE_CODE_MISSING` reserved.
- **No archive edit is made by this record.** Adding `backboneVersion`, populating
  `relationshipEstablishedDate`, and choosing the ECO placement across the four curated archives
  is a Research Curator task, proposed here for review.

## Reason-code additions (append-only)

`BACKBONE_UNPINNED`, `ASSERTION_UNATTRIBUTED` (enforced at L3); `EVIDENCE_CODE_MISSING` (reserved).
