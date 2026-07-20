# Architecture Decision Record — Canonical Design Corpus v1 Registration

**Date:** 2026-07-07
**Status:** RATIFIED (2026-07-07) — Chief Architect ruling. Sections 1–5 are the ratified record; Section 6 records the ratification. Amendments, if any, are appended and dated per the project's amendment convention (`cinematic-vocabulary.md` §13); the ruling is not overwritten.
**Role:** Chief Architect ruling. Registers an external reference corpus against the repository's existing governance system, integrating by citation only. Per `PROJECT_OPERATING_MANUAL.md` §4, this kind of documentation act requires a decision record; this is that record.

---

## 1. What this records

The Canonical Design Corpus v1 — five documents (Observatory - Conceptual Foundation, Architectural Reference Document, Observatory Narrative Stack, Habitat Blueprint — Canonical Reference (Sundarbans), Canonical Publishing Map) — is registered as external reference material describing the repository's **editorial architecture**: the doctrine's conceptual hierarchy, the platform's three-surface model, the narrative pipeline, the Descent's timing envelope, the Darwin Core Archive / EcologicalNarrative relationship, and a Sundarbans production instantiation. The corpus is frozen and is not reproduced or copied into this repository; its own stated default is "reference, never copy," which this record follows.

## 2. Scope of the corpus

The corpus documents editorial architecture. It does not document, and was not scoped to document, the repository's agent-operating-system layer, ADR workflow, session-diary protocol, or the Thought System — these are repository governance and implementation tooling, a distinct concern from the editorial architecture the corpus addresses. Where the corpus is silent on these, that silence reflects scope, not a defect in the corpus.

## 3. Verified facts from the repository

Confirmed by direct inspection this session, cross-checked against the corpus's own Publishing Map:

- Of the Architectural Reference Document's 18 sections, the majority are reference-only: their content is already owned by existing repository files (`cinematic-language/platform-architecture.md`, the four `.kiro/steering/` doctrine files, `cinematic-language/narrative-lifecycle.md`, `private-book/continuity/continuity-dossier.md`, `private-book/architecture/book-architecture.md`), confirmed present and matching as cited.
- Two sections (§09, §14) are flagged by the corpus's own Publishing Map as duplicating existing tables (`continuity-dossier.md` §2; `book-architecture.md` §10) — to be cited, not restated, if the corpus is ever transcribed anywhere.
- Two sections (§02, §15) propose new figures for `platform-architecture.md`, and one finding (inside §11) proposes a new entry for `continuity-dossier.md` §4 — all three remain proposals pending maintainer ratification; none is adopted by this record.
- Section §18's finding — that the EcologicalNarrative evidence model and the Darwin Core Archive conformance model are Independent, connected only through the Place Manifest as a routing/index layer — matches this session's own direct repository verification of `place-manifest.json`/`.schema.json`/`.ts`, `check-bindings.js`, `check-manifest.js`, and `narrative-registry.ts`. This is a confirmed agreement; no further action is needed on it.

## 4. Repository integration notes (quarantined — not corpus corrections)

These are observations about the repository's own governance-layer documentation, made in the course of this registration. They are recorded here as integration notes, not as defects in or amendments to the Canonical Design Corpus, which is unmodified and unreinterpreted by this record:

- The repository's agent-operating-system layer is documented at `.agents/AI-OS.md`.
- The repository's Interaction Grammar system — the D1–D10 primitives, the M33–M40 roadmap, and R1 — is documented at `OBSERVATORY_V2_IMPLEMENTATION.md` and `PROJECT_STATUS.md`, and is a distinct system from the Darwin Core Archive claim-binding profile (`docs/interaction-claim-binding-profile.md`).
- The repository's own governance-document set — `PROJECT_OPERATING_MANUAL.md` §1, `AI-OS.md`, the `.agents/decisions/` ADR workflow, `.agents/sessions/` session diaries, and the `.agents/thoughts/` Thought System — is documented independently of the corpus's editorial-architecture scope.

## 5. Decision

The Canonical Design Corpus v1 is registered as external editorial-architecture reference material. No corpus document is copied into the repository. The reference-only majority of its sections requires no new repository documentation, being already owned by the files named in §3. The proposed figures and the new tension finding remain pending maintainer ratification and are not adopted here. Should any of the repository governance documents named in §4 require updating as a result of anything learned during this registration, that update is made to the relevant document through its own decision record, following the normal ADR workflow — not by treating it as a correction to the Canonical Design Corpus, which remains frozen and unmodified.

## 6. Ratification

**Ratified by:** Chief Architect
**Date:** 2026-07-07
**Decision:** The Canonical Design Corpus v1 is registered as external reference material per §1–§5. No repository file is created to hold its content; existing files are cited by reference. The three integration notes in §4 are recorded as repository-side observations, outside the corpus's scope, and do not modify or reinterpret the corpus.
