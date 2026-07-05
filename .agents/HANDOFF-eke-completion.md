# Completion handoff — Ecological Knowledge Environment

**Date:** 2026-07-03
**Status:** The reference implementation and the unified environment's buildable/verifiable
scope are complete and green (`npm run verify`, `npm run build`). This document is the exact,
actionable checklist for the four remaining items, each of which requires something an
autonomous headless session cannot supply — a human at a browser, a curator's source
verification, a standards body's ruling, or real-world time. **None require re-architecture.**

See the founding spec (`.agents/decisions/2026-07-03-eke-reference-implementation-founding-spec.md`),
the L3 data-model decision (`.agents/decisions/2026-07-03-l3-conformance-data-model.md`), and the
profile (`docs/interaction-claim-binding-profile.md`).

---

## 1. Final transition easing — a browser (≈30 min)

The transition *mechanism* is built and shipping (W3C View Transitions): a root cross-fade dip
plus a subject-title morph (`view-transition-name: eke-subject`).

- **Do:** in a Chromium-based browser, open a research note (`notes/<id>.html`), click
  **Evidence ledger →**, and watch the place title morph across the dip. Tune only the *feel* —
  `animation-duration`/easing on `::view-transition-old/new(root)` in `src/notes/research-article.css`,
  `src/atlas/atlas.css`, `src/atlas/field-record.css`, and the CSS block in `scripts/build-evidence.mjs`.
- **Constraint:** cinematic pages must stay pure (no `@view-transition`). Verify with
  `grep -rl view-transition dist/assets/*.css` — no `places-*.css` may appear.
- **Done when:** the descent reads as one calm dip with the title carrying through; nothing else changes.

## 2. Curated-archive L2/L3 rigor — the Research Curator (per-archive source work)

The validator enforces the checks; the archives are at L1. Reaching higher levels means writing
**verified** values into curated data — never inventing them.

**A generated worklist is ready:** `.agents/curator-l2-l3-worksheet.md` (`npm run curator-worksheet`)
— the exact, deduplicated inventory extracted from the archives (nothing invented): the **35 distinct
source citations** that need a verified DOI/URL (L2), and the per-archive count of occurrences needing
a backbone-version pin and bindings needing an establishment date (L3). Regenerate after any edit.

For each of `public/dwca/{sundarbans,coral-triangle,amazon-varzea,epr-vents}/`:
- **L2 (`SOURCE_UNRESOLVABLE`):** replace each citation-string `relationshipAccordingTo` in
  `resource-relationship.txt` with a **verified DOI or resolvable URL**. Start with the open
  backlog item (EPR non-1981 citations). Confirm every DOI resolves; a wrong DOI is worse than a string.
- **L3 (`BACKBONE_UNPINNED`):** add `"backboneVersion":"<GBIF Backbone DOI/version actually used>"`
  to each occurrence's `dynamicProperties` in `occurrence.txt`. Use the real ingest-time snapshot; do not guess.
- **L3 (`ASSERTION_UNATTRIBUTED`):** populate `relationshipEstablishedDate` — a Curator decides the
  semantic (publication date of the source vs record-assembly date) and applies it consistently.
- **Verify per archive:** `node scripts/check-bindings.js public/dwca/<slug> --level=L2` then `--level=L3`
  → 0 gaps when complete. Regenerate ledgers with `npm run build:evidence`.
- **Rule:** if a value cannot be verified, leave the gap. Fabricated provenance fails the whole point.

## 3. Evidence-code field — TDWG (standards process)

`EVIDENCE_CODE_MISSING` is reserved, not enforced, because Darwin Core has no field for an ECO/SEPIO
evidence code and inventing one locally would violate standards-over-invention.
- **A submittable proposal is drafted:** `docs/tdwg-evidence-code-proposal.md` — a placement question
  (not a new vocabulary) presenting three options (interim `relationshipRemarks` token / recommended
  DwC MeasurementOrFact extension linked by `resourceRelationshipID` / durable new term), with the
  reference implementation's readiness to encode whichever the community ratifies.
- **Do:** submit that proposal to the **TDWG** Biodiversity Interactions Interest Group / Darwin Core
  Maintenance Group (with GloBI). Once a placement is agreed, implement the reserved check in
  `scripts/check-bindings.js` at L3 and add fixtures + expectations to `test/conformance/`.

## 4. Adoption — external, over time (the enablers are built)

Built already: the README on-ramp, one-command direct-archive validation, the citable profile, the
versioned conformance corpus, the CI verify gate, and the citation metadata (`CITATION.cff` +
`codemeta.json`, machine-readable and consistent, ready for a Zenodo/Software-Heritage release).
- **Do:** contribute the four interaction archives **up to GloBI** (they are already GloBI-idiom);
  propose the profile to the TDWG/GloBI community as an application profile; register a **citable
  release** (Zenodo concept + version DOIs) so the profile and validator can be cited. Then outreach to
  biodiversity-informatics producers. Uptake is earned over years and cannot be shortcut.

---

**Guardrail for whoever continues:** every decision is still measured against the six pillars
(scientific usefulness, long-term adoption, interoperability, progressive embodiment, evidence
before spectacle, durability) and the standing preferences (standards over invention, reusable
primitives over features, reject anything that cannot plausibly survive twenty years). The fastest
way to *lower* this project's rigor is to fabricate provenance or invent against a standard to look
finished — so don't.
