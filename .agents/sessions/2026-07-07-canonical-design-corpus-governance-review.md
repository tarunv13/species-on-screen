# Session diary — Documentation governance audit, Canonical Design Corpus v1 review, lifecycle derivation

**Date:** 2026-07-07
**Type:** Governance / documentation audit. Docs-only — no application code, no build/verify/CI change.
**Role:** Repository Implementation Reviewer → Repository Integration Lead → Chief Architect ruling (ADR).
**Branch:** `feat/exploration-prototypes-and-data-pipelines`

---

## Scope

A long-running documentation-governance exercise in two parts: (1) an audit-to-integration cycle for a set of externally supplied "canonical reference" documents against the repository's existing governance system, and (2) a derived-then-falsified reusable lifecycle for how future large architectural investigations of this kind should be conducted.

## Part 1 — Documentation governance: audit → rejection → correct integration

- A repository-implementation review was requested against three named reference documents ("Editorial Architecture," "Observatory Narrative Stack," "Canonical Habitat Blueprint"). None existed in the repository (verified via `git ls-files` + full-tree grep); a discrepancy report was produced against best-fit real documents instead of fabricating their content.
- A real `Canonical Publishing Map.html` was then supplied and verified section-by-section against the repository (doctrine files, `platform-architecture.md`, `continuity-dossier.md`, `book-architecture.md`) — every citation checked out.
- This cascaded into a Canonicalization Plan → a Work Queue (WQ-1–WQ-9) → an "M0 Governance Freeze" of four new documents: `WORK_QUEUE.md`, `ROADMAP.md`, `OWNERSHIP_MATRIX.md`, `.docs/Repository Publishing Guide.md`.
- A governance-quality review found those four documents duplicated existing mechanisms: a second milestone namespace (M0–M5) colliding with the real M1–M17/M33–M40 history; a flattened ownership model duplicating `AI-OS.md`'s role table; a second backlog duplicating `PROJECT_STATUS.md`; a `.docs/` directory colliding with the existing `docs/`. **Verdict: reject.**
- Corrected disposition, reached by re-deriving rather than defending the first classification: `WORK_QUEUE.md`/`ROADMAP.md`/`OWNERSHIP_MATRIX.md`'s operational content belongs in `PROJECT_STATUS.md`'s existing Backlog (an ADR is a frozen ruling, "written only when a ruling is made" — not a live task tracker); the Publishing Guide's reusable procedure is slated for a new `PROJECT_OPERATING_MANUAL.md` §6.
- **Executed this session:** `.agents/decisions/2026-07-07-documentation-governance-integration.md` (ADR — drafted, ratified, then language-reviewed and edited for repository-stability: removed a fragile/incorrect tier count, the rejected M0–M5 labels, volatile Tier-3 tool-binding specifics, backlog item numbers, an unnecessary file count, and one internal repetition). `PROJECT_STATUS.md` Backlog gained item 6, in the existing prose/lettered-sub-item style, citing the ADR.
- **Not yet done:** `PROJECT_OPERATING_MANUAL.md` §6 is planned but not written; the four M0 documents and `.docs/` remain on disk, deletion gated on §6 landing first, per the approved Integration Plan's own ordering (never delete a source before its destination content is confirmed present).

## Part 2 — Canonical Design Corpus v1: registration, review, and lifecycle determination

- A five-document external corpus (Observatory - Conceptual Foundation, Architectural Reference Document, Observatory Narrative Stack, Habitat Blueprint — Canonical Reference (Sundarbans), Canonical Publishing Map) was read in full from a supplied local path — Project files, not repository files.
- Direct verification surfaced three findings: the corpus's own gaps register incorrectly lists `.agents/AI-OS.md` as unlocated (it exists, read in full this session); it has no node for the repository's Observatory v2 Interaction Grammar (`OBSERVATORY_V2_IMPLEMENTATION.md`, D1–D10, M33–M40, R1) and misidentifies it as possibly the DwC-A binding profile (`docs/interaction-claim-binding-profile.md`) — a different, real system; its dependency graph omits the repository's entire governance layer (`PROJECT_OPERATING_MANUAL.md`, `PROJECT_STATUS.md`, the ADR workflow, session diaries, the Thought System).
- Per instruction, these were recorded as repository-side integration notes — the corpus intentionally scopes to editorial architecture, not governance/tooling — not as corpus defects; the corpus itself was not modified or reinterpreted.
- A registration ADR was drafted (`.agents/decisions/2026-07-07-canonical-design-corpus-v1-registration.md`), then reviewed against repository convention and found thin: its decision changed nothing, restated content already present in the corpus's own Publishing Map and in this session's own prior verification, and had no `PROJECT_STATUS`-worthy trackable consequence. Recommendation at that point: fold to a single governance-map row, or don't register at all.
- A deeper question followed — should the corpus become part of permanent governance memory at all? Reasoning from the Thought System's own Promoted/frozen-as-reasoning-of-record model and the 2026-05-25 repository-audit precedent (preserved, "not re-binding," per `continuity-dossier.md` §8) concluded **no**: the corpus should stay external and unregistered unless and until it actually causes a specific repository change, at which point only that change (plus an ordinary session-diary citation) persists.
- **Note recorded honestly:** the registration ADR was written before this conclusion was reached and is, by the conclusion's own logic, over-scoped. It was not deleted or amended this session — left as an open question for the maintainer (see below), not unilaterally reversed.

## Part 3 — A reusable lifecycle, derived then falsified

- A 3-stage lifecycle for large architectural investigations was derived from the whole exercise (Working → Maturity Gate → Integration & Retirement), then adversarially tested against repository evidence rather than accepted as final:
  - Stage 2 (Maturity Gate) collapses into Stage 1's own stated completion criteria — no independent capability.
  - "Integration & Retirement" bundles three already-separately-named repository mechanisms (Ratification, the Milestone working protocol, ordinary doctrine amendment) under an invented umbrella term; "Retirement" duplicates the Thought System's own term, Promoted.
  - Historical precedent (WP8, Coral Triangle, EPR, the 2026-05-25 doctrine consolidation) shows a flagged, blocked `PROJECT_STATUS.md` backlog item is a valid Stage-1 holding pattern predating and independent of the Thought System — absent from the first draft.
  - The Thought System's own creation ADR falsifies "exactly one output": a single ratification produced an ADR and simultaneously amended two other documents.
  - The corrected lifecycle's content is largely already implied by `AI-OS.md`'s role pipeline, `PROJECT_OPERATING_MANUAL.md` §4's milestone protocol, and the Thought System's three states — it does not clearly warrant becoming its own standing document.
- **Corrected minimal form (2 stages, not formalized as a file):** **Working** (verify directly against real files, grade confidence verified/inferred/gap, hold as a Thought *or* a flagged blocked backlog item, exit only once a decision is named) → **Ratify/Route** (one or more of: an ADR containing the ruling only; a `PROJECT_STATUS.md` Backlog entry in the existing style; a direct doctrine amendment — never a new artifact type; Promote any Thought used).

## Explicitly NOT done

No new doctrine. No new milestone or backlog namespace. No application code, `package.json`, or CI change. `PROJECT_OPERATING_MANUAL.md` §6 not written. The four M0 documents and `.docs/` not deleted. The Corpus Registration ADR not deleted or amended despite this session's own conclusion that it was unwarranted. The corrected 2-stage lifecycle not written into any repository file.

## Verify / build status

Unchanged — no application code, `package.json`, or CI file touched. `npm run verify` / `npm run build` not re-run; nothing they check was modified.

## Thought Review (session-close step, per `AI-OS.md`'s Technical Lead protocol step 11)

Durable thinking generated this session: the corrected 2-stage minimal lifecycle (Working → Ratify/Route), and the general principle that documentation-governance work should default to extending `PROJECT_STATUS.md` / `PROJECT_OPERATING_MANUAL.md` / `AI-OS.md` over creating new artifacts. No existing Thought owns this reasoning — `.agents/thoughts/INDEX.md` lists only the Thought System's own worked example (`architecture` domain), which is a different subject. **Outcome: not captured as a new Thought this session.** Per the same "never create speculatively" discipline this session's own analysis converged on, no Thought is opened without a demonstrated downstream need for one; this diary is the reasoning's record for now, and a maintainer may promote it to a Thought or fold it into `PROJECT_OPERATING_MANUAL.md` §4 later if it proves durable in use.

## Open questions for the maintainer

1. Whether to proceed with `PROJECT_OPERATING_MANUAL.md` §6 and the subsequent deletion of the four M0 documents + `.docs/`, per the already-approved Integration Plan.
2. Whether to delete or amend `.agents/decisions/2026-07-07-canonical-design-corpus-v1-registration.md`, given this session's own later conclusion that it was unwarranted under the repository's lifecycle philosophy.
3. Whether the corrected 2-stage lifecycle should be formalized (as a Thought, or folded into `PROJECT_OPERATING_MANUAL.md` §4) or left as this diary's own record only.

## Conclusion

Two governance threads advanced this session. The documentation-governance thread has one artifact ratified and one backlog entry landed, with two steps remaining under an approved plan. The Canonical Design Corpus v1 thread ran its own audit-to-integration cycle, over-corrected once (a registration ADR later found unwarranted), and converged — via the repository's own lifecycle philosophy, not a new one — on leaving the corpus external until it earns a concrete repository change. The lifecycle derived from watching this happen was itself tested to destruction and reduced from three stages to two, all three names in the process for its own conclusion.
