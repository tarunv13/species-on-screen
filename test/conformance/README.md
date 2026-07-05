# Conformance corpus — interaction-claim traceability profile

This is the versioned conformance corpus for the Ecological Knowledge Environment's
reference validator (`scripts/check-bindings.js`). See the founding specification:
`.agents/decisions/2026-07-03-eke-reference-implementation-founding-spec.md`.

## What conformance means

An implementation of the interaction-claim evidence-binding profile is **conformant**
iff, run over this corpus, it emits **the same verdict and the same reason-code set for
every binding** as `expected.json`. Conformance is black-box: it is verdict-and-reason
agreement over the corpus, independent of language, internal method, or output styling.

The profile certifies **traceability, not truth** — that a claim is bound to declared,
resolvable, typed, sourced, reconciled, dated evidence — never that the asserted
interaction is correct.

## The conformance predicate (reason-code vocabulary — append-only)

A binding is `CONFORMANT` iff none of these hold:

| Reason code | Fires when |
|---|---|
| `EVIDENCE_UNRESOLVABLE` | a `resourceID`/`relatedResourceID` has no occurrence row |
| `RELATION_UNTYPED` | `relationshipOfResourceID` is not a controlled, resolvable IRI (OBO RO) |
| `SOURCE_MISSING` | `relationshipAccordingTo` is empty |
| `BACKBONE_UNRECONCILED` | a referenced occurrence has no backbone taxon key/reference |
| `AS_OF_MISSING` | a referenced occurrence has no `eventDate` |

Codes are **append-only**: never remove or repurpose one. New checks add new codes. Higher
conformance levels (opt-in) add codes; levels are additive and L1 is the default:
- **L2** (`--level=L2`): `SOURCE_UNRESOLVABLE` — a present source that is not a persistent
  identifier (DOI or http(s) URL).
- **L3** (`--level=L3`): `BACKBONE_UNPINNED` (no `dynamicProperties.backboneVersion`) and
  `ASSERTION_UNATTRIBUTED` (empty `relationshipEstablishedDate`). `EVIDENCE_CODE_MISSING` is
  reserved but not yet enforced (awaiting a TDWG placement).

This corpus carries per-level expectations for L1, L2, and L3 in `expected.json`.

## Layout

- `dwca/clean/` — two bindings, both fully conformant.
- `dwca/mixed/` — one conformant binding plus one binding per reason code.
- `manifest.json` — binds the two fixture archives (minimal; the validator reads only
  `surfaces.dwca.slug`).
- `expected.json` — the contract: `<archiveSlug>/<resourceRelationshipID>` → verdict + reasons.
- `build.mjs` — regenerates the tab-delimited fixtures deterministically (guaranteed tabs).

## Run

```
npm run test:conformance                  # assert the validator matches the contract (L1 + L2)
npm run conformance:build                  # regenerate the fixtures (maintenance only)
node scripts/check-bindings.js --level=L2  # opt-in stricter rigor (requires PID sources)
```

Any Darwin Core archive producer can validate their **own** archive directly, without
adopting the Place Manifest:

```
node scripts/check-bindings.js path/to/my-archive              # one archive
node scripts/check-bindings.js path/to/a path/to/b --level=L2  # several, stricter level
node scripts/check-bindings.js path/to/my-archive --trace      # render the evidence chain per claim
```

The reference validator can also be pointed at any corpus via `EKE_MANIFEST` and
`EKE_DWCA_ROOT`, so another implementation can be checked against this exact corpus.
