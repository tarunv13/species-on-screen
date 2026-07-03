# Interaction-Claim Evidence-Binding Profile (v0.1, draft)

**Status:** Draft profile. The human-readable specification that the reference validator
(`scripts/check-bindings.js`) implements and the conformance corpus (`test/conformance/`)
tests. Governed by `.agents/decisions/2026-07-03-eke-reference-implementation-founding-spec.md`.

This is an **application profile**, not a new standard. It invents no vocabulary, no format,
and no authority. It constrains and combines **existing** standards to define what it means for
an ecological *interaction claim* to be **bound to evidence**, and it certifies **traceability,
never truth**.

## 1. Scope

**Governs:** the binding between an asserted biotic interaction (species A stands in relation R
to species B, at a place, per a source) and the evidence that licenses the assertion.

**Never governs (out of scope, permanently):**
- **Truth or sufficiency** of the interaction — only that the claim is *traceable* to declared,
  resolvable, typed, sourced, reconciled, dated evidence.
- **Vocabularies** — taxonomy, relations, and provenance terms are referenced, never redefined.
- **Presentation** — how a bound claim is rendered or experienced.
- **Aggregation / authority** — this is not a portal or a certifying body; contribute records
  *up* to GloBI/GBIF and the profile *up* to TDWG.

## 2. Normative primitives → existing standards (reuse-only mapping)

A **binding** is one Darwin Core `ResourceRelationship` record plus the two `Occurrence` records
it references. Each abstract primitive maps to existing terms:

| Primitive | Carried by (existing standard) |
|---|---|
| **Claim** | a `dwc:ResourceRelationship` row (`resourceRelationshipID`), subject `resourceID` → object `relatedResourceID` |
| **Typed relation** | `dwc:relationshipOfResourceID` = a controlled, resolvable **OBO Relations Ontology** PURL (e.g. `RO_0002455` pollinates); `relationshipOfResource` carries the human label |
| **Evidence reference** | `resourceID`/`relatedResourceID` resolving to `dwc:Occurrence` rows (`occurrenceID`) — the occurrences are the evidence records |
| **Support relation** | the `ResourceRelationship` itself; its declared source is `dwc:relationshipAccordingTo`. Semantics are "offered in support of," aligned with **ECO/SEPIO** (evidence-for-assertion), referenced not embedded |
| **Backbone reconciliation** | each occurrence's taxon reconciles to a declared backbone via `dwc:associatedReferences` (GBIF backbone URL) and/or `gbifTaxonKey` in `dwc:dynamicProperties` |
| **Temporal validity** | `dwc:eventDate` on the occurrences (and `relationshipEstablishedDate` when present) |
| **Assertion provenance** | `relationshipAccordingTo` (source) + dataset-level EML `<intellectualRights>`/attribution; a per-binding **PROV** mapping is the upgrade path |

## 3. Conformance predicate

A binding is **CONFORMANT** iff none of the following hold. The reason-code vocabulary is
**append-only** — never remove or repurpose a code; new checks add new codes.

| Reason code | Non-conformance condition |
|---|---|
| `EVIDENCE_UNRESOLVABLE` | a `resourceID`/`relatedResourceID` resolves to no occurrence |
| `RELATION_UNTYPED` | `relationshipOfResourceID` is not a controlled, resolvable IRI (OBO RO) |
| `SOURCE_MISSING` | `relationshipAccordingTo` is empty |
| `BACKBONE_UNRECONCILED` | a referenced occurrence has no backbone taxon key/reference |
| `AS_OF_MISSING` | a referenced occurrence has no `eventDate` |

## 4. Conformance mechanism

Conformance is **black-box**: an implementation is conformant iff, run over the versioned
conformance corpus, it emits **the same verdict and the same reason-code set for every binding**
as `test/conformance/expected.json`. It is independent of language, internal method, and output
styling. The reference implementation is `scripts/check-bindings.js` (`--json` emits per-binding
verdicts); the harness is `scripts/check-bindings.test.mjs`. Any implementation can be pointed at
the corpus via `EKE_MANIFEST` and `EKE_DWCA_ROOT`.

## 5. Conformance levels (maturity, additive)

To be honest about current versus target rigor, conformance is layered; higher levels are
strictly additive and never weaken lower ones:

- **L1 — Baseline traceability (default, shipped).** The §3 predicate: evidence resolves,
  relation is OBO-typed, source is declared, taxa reconcile to a backbone, occurrences are dated.
  The four production archives satisfy L1 (38/38 bindings).
- **L2 — Resolvable sources (implemented; opt-in via `--level=L2`).** `relationshipAccordingTo`
  must resolve to a persistent identifier — a DOI or an http(s) URL — not a bare citation string.
  Adds the additive reason code `SOURCE_UNRESOLVABLE` (a present-but-non-PID source; an empty
  source remains `SOURCE_MISSING`). The production archives are L1 but not yet L2: all 38 bindings
  cite sources as strings, so L2 reports 38 `SOURCE_UNRESOLVABLE` — a precise, actionable upgrade
  path (it independently flags the EPR-vents interaction citations already noted DOI-unconfirmed).
- **L3 — Pinned backbone + dated binding (partially implemented; opt-in via `--level=L3`).**
  Two additive checks, both pure Darwin Core reuse (see
  `.agents/decisions/2026-07-03-l3-conformance-data-model.md`): `BACKBONE_UNPINNED` (an occurrence
  declares no `dynamicProperties.backboneVersion`) and `ASSERTION_UNATTRIBUTED` (empty
  `relationshipEstablishedDate`). One further check, `EVIDENCE_CODE_MISSING` (an ECO/SEPIO evidence
  code on the support relation), is **reserved but not enforced**: Darwin Core has no field for it,
  so its placement is deferred to a TDWG-profile decision rather than invented locally. The
  production archives are L1 but not L3; at L3 all 38 bindings report the gap as an upgrade path.

## 6. Stability policy

- **Stable for decades:** the abstract binding model, the traceability-not-truth boundary, and
  the black-box conformance mechanism.
- **Evolves additively:** referenced vocabularies/backbones (by *versioned pointer*, never
  embedded), the reason-code vocabulary (append-only), serializations, and the corpus.

## 7. CARE constraint (non-negotiable)

Traceability never overrides Indigenous data governance. Sensitive localities MUST remain
non-resolvable (coordinate generalisation per the repository's sensitive-data policy), and the
reconciliation backbone MUST be pluralizable and consent-aware — a claim grounded in Traditional
Knowledge is not made non-conformant for failing to reconcile against a Western backbone.

## 8. Relationship to the reference-implementation triad

- **Specification** — this document.
- **Reference implementation** — `scripts/check-bindings.js`.
- **Conformance corpus** — `test/conformance/` (fixtures + `expected.json`).

Together they let an independent implementation, in any language, be checked for conformance
without sharing code or comparing appearance — the definition of a reference implementation.

Any Darwin Core archive producer can also run the reference validator directly on their **own**
archive — `node scripts/check-bindings.js <archiveDir>` — without adopting the Observatory's
Place Manifest, so the profile is usable by GloBI contributors and biodiversity-informatics
producers on day one.

The validator renders the **evidence chain** per claim in two forms, both carrying the same
audit trail (claim → typed relation → each evidence occurrence's backbone/date/pin status →
source → verdict): `--trace` (human-readable) and `--json` (machine-readable, for a surface or an
AI system). This is the "trace any claim to its evidence and see how far it reaches" capability as
a usable tool, independent of any rendering surface — the evidential layer the future
experiential/analytical surfaces consume without re-deriving it.
