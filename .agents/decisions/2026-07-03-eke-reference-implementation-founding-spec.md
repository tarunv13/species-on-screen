# Founding specification — Ecological Knowledge Environment as a reference implementation

**Date:** 2026-07-03
**Status:** Founding decision. Governs subsequent architectural, research, design, and
implementation work. Supersedes no prior doctrine; it sits *above* the three-surface
production work as the north star those surfaces now serve.
**Role:** Chief Architect ruling (records the convergence of the 2026-07 strategy sessions).

---

## 1. The goal

> Create the world's most scientifically rigorous ecological knowledge environment that
> becomes the **reference implementation for evidence-preserving ecological communication.**

The Observatory's three surfaces (Cinematic, Atlas, Research) are re-understood not as three
applications but as **three depths of one continuous environment**, and the whole is built to
serve one durable contribution: making an ecological claim's *evidence* perceptible and
machine-checkable, so that the reader can trace any claim to its warrant and see how far that
warrant reaches.

## 2. The standing evaluation rubric

Every architectural, research, design, and implementation decision is measured against these
six pillars. A decision that fails any one is rejected or reshaped until it passes.

1. **Scientific usefulness** — does it make a real reasoning task easier for a real user?
2. **Long-term adoption** — does it lower the cost of a *recurring* task, not a novelty?
3. **Interoperability** — does it reuse existing standards rather than invent?
4. **Progressive embodiment** — does the same grammar hold from web today to spatial computing,
   while remaining fully deployable as an ordinary website?
5. **Evidence before spectacle** — does motion/representation carry structural or evidentiary
   meaning, never decoration?
6. **Durability beyond current technology** — could this plausibly still matter in twenty years?

Standing preferences, applied to every decision:
*standards over invention · reusable primitives over features · reject anything that cannot
plausibly survive twenty years · avoid novelty for its own sake.*

## 3. The environment (accepted architecture)

One continuous environment organized by a single axis: **epistemic depth**, from *encounter*
to *warrant*. The user does not travel between applications; they ask a deeper or shallower
question of the same subject in front of them.

- **Experiential (surface)** — "what is it like here?" — the immersive encounter (today's
  Cinematic register, dark, pure Descent).
- **Analytical (mid)** — "how does this connect?" — the interaction web (today's Atlas /
  Living-Glass register).
- **Evidential (deep)** — "how do we know, and how far does the evidence reach?" — the record
  (today's Research register, light, editorial).

The register gradient (dark-felt → glass-structural → light-record) *is* the mode axis.
Transitions are continuous morphs with the cut hidden in a luminance dip; the subject is the
invariant carried across. Four verbs are constant at every depth: **press-in, step-back,
follow, interrogate.** Full grammar: see the 2026-07 embodiment-phase session notes.

## 4. The durable reference-implementation core

The reference implementation is **not** the media, the aesthetics, or the platform. It is the
**provenance-binding conformance profile and its validator**: the canonical, inspectable,
reusable definition of what it means for an ecological claim to be *bound to evidence*, and a
checker that certifies it.

**The reusable primitive** is the *binding*: an addressable claim → resolvable, source-identified
evidence → a support relation (offered-in-support-of, explicitly **not** proof) → reconciliation
against a *declared, version-pinned* backbone → an as-of timestamp → PROV attribution.

**The single normative contribution** is a decidable, reproducible conformance predicate:
a binding is *traceability-conformant* iff its evidence resolves, is source-identified,
reconciles to its declared pinned backbone, and carries an as-of stamp. It certifies
**traceability, never truth.**

**Standards reused (never duplicated):** Darwin Core (evidence records, DwC-A packaging),
OBO Relations Ontology (interaction typing), PROV (attribution/provenance), an existing
evidence vocabulary such as ECO/SEPIO (the support relation), and an existing container
(nanopublication or RO-Crate profile with content-addressed pinning). Backbones (e.g. GBIF)
are referenced by versioned pointer, never embedded. FAIR is design rationale; CARE is a
binding governance constraint (sensitive localities must remain non-resolvable; backbone
authority must be pluralizable and consent-aware).

## 5. Grounding in what already exists

This is not a green field. `scripts/check-manifest.js` (lines 143–147) already performs a
**count-parity traceability check** — it verifies that the manifest's declared interaction
counts equal the archive's actual `resource-relationship.txt` rows, and that every declared
surface resolves to a real file. `cinematic-language/place-manifest.json` is already the single
source of truth (ADR-001). The four DwC-A archives (`public/dwca/`) already type interactions
with OBO RO and carry EML rights (M22). The validator kernel, the manifest, and the corpus seed
of the reference implementation are therefore already in the repository; the work is to
**generalize them**, not to begin them.

## 6. Boundaries (what it must never become)

- **Never certifies truth** — only traceability of a claim to declared, resolvable, reconciled,
  current evidence.
- **Never invents a vocabulary, format, or authority** — it is a profile expressed as constraints
  over existing standards. It is not a competing standard.
- **Never an aggregator or portal** — GBIF/GloBI own aggregation; contribute *up* to them.
- **Presentation is permanently experimental** — the experiential/aesthetic shell (renderers,
  cinematic surface, palette, motion) is re-made each technology generation and is never frozen
  as the reference. Only the evidentiary core aspires to reference stability.
- **Sensitive knowledge is protected before it is traced** — CARE overrides radical traceability.

## 7. Explicitly rejected (do not relitigate)

The 2026-07 strategy sessions falsified, and permanently retire, these framings: a new
scientific discipline; a new scientific law; a new cognitive construct; a new cognitive
instrument comparable to the map/phylogenetic tree; a new ontology; and any novelty claim
already absorbed by existing literature (the "perceptual distinction between evidenced and
un-evidenced" reduces to the geological observed/inferred convention and to provenance-checking).
The contribution is **methodological, not theoretical**, and its home is information-visualization
practice and the biodiversity-informatics commons. Future work does not reopen these.

## 8. Smallest first buildable increment

Per the accepted convergence, the smallest outcome that could survive community review, scoped
to survive twenty years:

An **interaction-claim evidence-binding profile**, expressed purely as constraints over
Darwin Core + RO + PROV + ECO, hosted in an existing container, whose only normative content is
the conformance predicate (§4) and its reason-code vocabulary, accompanied by an open, versioned
**conformance test corpus** of bindings with expected verdicts. Scoped to *interaction claims*
first (the existing DwC-A idiom, shared with GloBI). No new terms, no truth claim, no certifying
authority, backbone pluralizable and consent-aware.

The concrete engineering seed: generalize `check-manifest.js`'s count-parity check into a
claim-level traceability check over the four existing archives — the reference validator's first
real behavior, exercised against a corpus we already hold.

## 9. How this decision is used

Cite this document by date in future decisions. Before adopting any feature, run it through the
§2 rubric in writing. If a proposal cannot show scientific usefulness, standards reuse, and a
plausible twenty-year life, it does not enter the environment. The environment advances through
completed increments of the evidentiary core, not through additional architectural documents.
