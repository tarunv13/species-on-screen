# Proposal: carrying an evidence code on Darwin Core interaction records

**For:** TDWG Biodiversity Interactions Interest Group / Darwin Core Maintenance Group (with GloBI).
**From:** the interaction-claim evidence-binding profile (`docs/interaction-claim-binding-profile.md`)
and its reference validator (`scripts/check-bindings.js`).
**Status:** Draft for community review. This is a placement question, not a new-vocabulary request —
the evidence codes themselves already exist (ECO / SEPIO).

---

## Problem

Darwin Core's `ResourceRelationship` extension can type *what* the relation is
(`relationshipOfResourceID`, e.g. an OBO Relations Ontology PURL such as `RO_0002470` "eats") and
*who* asserts it (`relationshipAccordingTo`). It has **no field for the evidence *type*** — how the
assertion is supported: direct observation, experiment, inference, literature-combinatorial, etc.

Consumers of interaction data (GloBI, aggregators, downstream analyses) need this to appraise
records: an experimentally demonstrated interaction and an inferred one are both traceable to a
source, but they warrant differently. A traceability profile can certify a claim traces to declared,
resolvable evidence; it cannot, today, type that evidence in a standard, queryable way.

## Constraint we are holding to

The evidence codes already exist — the **Evidence and Conclusion Ontology (ECO)** and **SEPIO**
provide controlled IRIs for evidence types. We do **not** propose a new vocabulary. We are also
unwilling to invent a private Darwin Core field: that would violate *standards over invention*. The
question is purely **where an ECO evidence-code IRI should live** on an interaction record.

## Options

**A. Namespaced token in `relationshipRemarks`.** No schema change; works today. But
`relationshipRemarks` is free text, so the code is unstructured and not reliably queryable.
*Interim only.*

**B. A Darwin Core MeasurementOrFact record linked by `resourceRelationshipID`** —
`measurementType = "evidence code"`, `measurementValue = <ECO IRI>`, `measurementTypeID` pointing at
a controlled term, `measurementDeterminedBy`/`Date` as needed. Reuses an existing Darwin Core
extension; structured and queryable; no core change. **Recommended for near-term adoption.**

**C. A first-class term** (e.g. an evidence-code term on the ResourceRelationship extension, or a
`dwciri:` term). Cleanest semantics and simplest to author, but requires a Darwin Core vocabulary
change and its ratification process. **The durable path if uptake warrants it.**

## Recommendation

Adopt **B** now (no core change, structured, immediately usable by GloBI and aggregators), and
open **C** as the long-term term-addition once there is demonstrated multi-provider use. Evidence
codes are drawn from ECO/SEPIO in all cases.

## Reference implementation readiness

The reference validator already **reserves** the reason code `EVIDENCE_CODE_MISSING` (conformance
level L3) but does not enforce it, precisely because the placement is unresolved
(`.agents/decisions/2026-07-03-l3-conformance-data-model.md` §3). Once a placement is agreed:

1. implement the check in `scripts/check-bindings.js` (read the ECO IRI from the agreed location),
2. add fixtures + per-level expectations to `test/conformance/`,
3. document it in `docs/interaction-claim-binding-profile.md` §3/§5.

The profile, validator, and versioned conformance corpus are ready to encode whichever placement
the community ratifies, so a conformant, checkable evidence-code becomes available to any producer
immediately on agreement — using existing standards throughout.

## Request

Guidance from the interest group on the preferred placement (A interim, B near-term, C durable),
and whether a MeasurementOrFact profile for interaction evidence (option B) is already conventional
in current GloBI/aggregator practice.
