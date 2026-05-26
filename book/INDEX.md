# Book Index

**Status:** preservation index. Not steering, not doctrine, not a
chapter. Maps the nine focus areas of the 2026-05-26 preservation
pass to existing on-disk source material, related PRs, doctrine
dependencies, and archival status. Single file by design.

**Scope.** This index is the minimum operational scaffolding for
future private-book work. It does not draft, refine, rewrite,
expand, or consolidate any existing material. It points.

**Companion:** the binding architecture for the future ~100-page
project record is
[`.agents/tasks/task-book-architecture/2026-05-25-book-architecture.md`](../.agents/tasks/task-book-architecture/2026-05-25-book-architecture.md).
That file is the chapter list. This file is the source map.

---

## 0. Naming and structure

- `book/` is excluded from production builds by virtue of not being
  declared as a Vite input (see `vite.config.js`). It mirrors the
  on-disk-but-not-shipped pattern of `prototypes/` and `species/`.
- Chapter drafts, when authored, land at `book/chapters/<slug>.md`,
  one chapter per file, kebab-case basename matching the slug below.
- All references in this index are repository-relative paths so
  they survive a future repo reorganisation that preserves layout.
- Citation tokens follow the canonical project vocabulary:
  *Article* (cinematic-vocabulary), *Canon* (editorial-voice),
  *Principle* (pacing-principles), *Reference* (experiential-references),
  per the doctrine consolidation in PR #61.

---

## 1. Focus-area map

Nine focus areas from the 2026-05-26 preservation pass, in the
order the brief listed them. Each row is one chapter slot.

| # | Slug | Status | Primary source(s) | Related PRs | Doctrine dependency | Archival status |
|---|------|--------|-------------------|-------------|---------------------|-----------------|
| 1 | `drafted-book-chapters` | architecture-only; no chapters drafted | [`task-book-architecture/2026-05-25-book-architecture.md`](../.agents/tasks/task-book-architecture/2026-05-25-book-architecture.md) | #62 | binds to all four canonical doctrine files (Articles, Canons, Principles, References) | architecture in repo; chapter prose pending future writing pass |
| 2 | `continuity-dossier` | sources captured across multiple task records | [`task-repo-consolidation/2026-05-25-repository-audit.md`](../.agents/tasks/task-repo-consolidation/2026-05-25-repository-audit.md), [`task-bootstrap-sprint/week-1-plan.md`](../.agents/tasks/task-bootstrap-sprint/week-1-plan.md), [`task-operational-workflow/single-researcher-workflow.md`](../.agents/tasks/task-operational-workflow/single-researcher-workflow.md), turning-points register in [`task-book-architecture/2026-05-25-book-architecture.md`](../.agents/tasks/task-book-architecture/2026-05-25-book-architecture.md) Part VIII §5 | #50, #28, #25, #62 | none (observational; cites doctrine but does not bind) | in repo as task records; dossier consolidation pending future writing pass |
| 3 | `prose-governance-layer` | canonical layer in steering | [`.kiro/steering/editorial-voice.md`](../.kiro/steering/editorial-voice.md), [`cinematic-language/narrative-ingestion-workflow.md`](../cinematic-language/narrative-ingestion-workflow.md) §3, [`cinematic-language/narrative-review-checklist.md`](../cinematic-language/narrative-review-checklist.md) §3 | #17, #29 (intuition layer), #49, #55, #61 | Canons I–XXI (governing); fragment rules cross-reference Canon V & XI | canonical and load-bearing on disk |
| 4 | `source-hierarchy-outputs` | canonical schema + workflow + checklist | [`cinematic-language/ecological-narrative.example.ts`](../cinematic-language/ecological-narrative.example.ts) (`sources[]` discriminated union), [`cinematic-language/narrative-ingestion-workflow.md`](../cinematic-language/narrative-ingestion-workflow.md) §2 (evidence threshold), [`cinematic-language/narrative-review-checklist.md`](../cinematic-language/narrative-review-checklist.md) §1–§2 (claim↔source, citation laundering); research-matrix exemplar packets at [`task-research-matrix/exemplar-coding-packets.md`](../.agents/tasks/task-research-matrix/exemplar-coding-packets.md), pilot D2/D3 deliverables at [`task-research-matrix/pilot-corpus-plan.md`](../.agents/tasks/task-research-matrix/pilot-corpus-plan.md) §13 | #44, #49, #54, #55, #23, #22 | Canon VII (citation as architecture), Canon VI (uncertainty preserved), Canon VIII (TMDB pipeline) | canonical (schema, workflow, checklist) + reflective (research-matrix outputs); both in repo |
| 5 | `book-architecture-outputs` | binding architecture | [`task-book-architecture/2026-05-25-book-architecture.md`](../.agents/tasks/task-book-architecture/2026-05-25-book-architecture.md) (~1,058 lines) | #62 | references all four canonical doctrine files; does not amend any | in repo; ratification or amendment is the next operation |
| 6 | `perceptual-findings-drafts` | findings document + v2 review excerpts | [`cinematic-language/depth-medium-findings.md`](../cinematic-language/depth-medium-findings.md), [`prototypes/reviews/sundarbans-descent-review-v2.md`](../prototypes/reviews/sundarbans-descent-review-v2.md), Article XVII in [`.kiro/steering/cinematic-vocabulary.md`](../.kiro/steering/cinematic-vocabulary.md) (§4) | #40, #61 (Article XVII fold-in) | informs Article III (Descent), Article VI (darkness), Article XVII (atmospheric hierarchy), Principle XV (reduced motion); self-labeled advisory, not binding | findings advisory on disk; perceptual material that became binding now lives as Article XVII |
| 7 | `asymmetry-chapter` | sources captured; chapter not drafted | [`cinematic-language/platform-architecture.md`](../cinematic-language/platform-architecture.md) §6 (asymmetric bridge), §5 (compatibility matrix), §8 (architectural never-rules); [`task-homepage-audit/2026-05-24-homepage-review.md`](../.agents/tasks/task-homepage-audit/2026-05-24-homepage-review.md) (homepage-side asymmetry) | #43, #45, #30, #36, #37 | platform-architecture is the operational authority (PR #61 framing); cross-references Articles III, X, XII, XIII, XIV; Canon XVII; Principles I–II | sources in repo; chapter prose pending future writing pass |
| 8 | `doctrine-consolidation-chapter` | sources captured; chapter not drafted | [`task-repo-consolidation/2026-05-25-doctrine-resolution-proposal.md`](../.agents/tasks/task-repo-consolidation/2026-05-25-doctrine-resolution-proposal.md), [`task-repo-consolidation/2026-05-25-repository-audit.md`](../.agents/tasks/task-repo-consolidation/2026-05-25-repository-audit.md), the consolidation execution itself in PR #61, archival status header on [`cinematic-language/cinematic-principles.md`](../cinematic-language/cinematic-principles.md) | #50, #51, #61 | resolves duplication between `.kiro/steering/` and `cinematic-language/cinematic-principles.md`; folds §3 Atmospheric Hierarchy in as Article XVII | sources in repo; the consolidation event is itself archival on disk |
| 9 | `settle-is-not-a-tween-chapter` | sources captured; chapter not drafted | [`cinematic-language/depth-medium-findings.md`](../cinematic-language/depth-medium-findings.md) §7, [`prototypes/reviews/sundarbans-descent-review-v2.md`](../prototypes/reviews/sundarbans-descent-review-v2.md) ("M5 — From resolution to continuance" and "M5 as continuance is a pacing principle, not a tween") | #40 | informs Article III (Descent: Settle phase), Principle V (the Hold), Principle XVIII (one ambient + one editorial motion); cross-references the v1 → v2 pivot in `task-book-architecture` Part VII §2 | findings advisory on disk; chapter prose pending future writing pass |

---

## 2. Doctrine layer (reference, not redefinition)

Pointers only. The canonical layer was consolidated by PR #61.
This index does not amend or extend it.

| Layer | File | Citation token |
|-------|------|----------------|
| Cinematic | [`.kiro/steering/cinematic-vocabulary.md`](../.kiro/steering/cinematic-vocabulary.md) | Article I–XVII |
| Editorial | [`.kiro/steering/editorial-voice.md`](../.kiro/steering/editorial-voice.md) | Canon I–XXI |
| Pacing | [`.kiro/steering/pacing-principles.md`](../.kiro/steering/pacing-principles.md) | Principle I–XX |
| Intuition | [`.kiro/steering/experiential-references.md`](../.kiro/steering/experiential-references.md) | Reference §2.1–§2.10 |
| Operational architecture | [`cinematic-language/platform-architecture.md`](../cinematic-language/platform-architecture.md) | §1–§9 |
| Archival (superseded) | [`cinematic-language/cinematic-principles.md`](../cinematic-language/cinematic-principles.md) | none — do not cite |

---

## 3. PR ledger (preservation-relevant only)

Linear history of the PRs that produced or directly affected the
material listed in §1. Numbers are stable; titles paraphrased for
brevity.

| PR | Subject | Affects focus area(s) |
|----|---------|----------------------|
| #17 | Tier C steering — cinematic, editorial, pacing | 3 |
| #29 | Experiential references doc | 3 |
| #22 | Pilot corpus plan | 4 |
| #23 | Exemplar coding packets | 4 |
| #30 | Homepage audit | 7 |
| #36, #37 | Homepage doctrine application | 7 |
| #40 | Sundarbans v2 perceptual integrity pass + depth-medium findings | 6, 9 |
| #43 | Platform architecture (three surfaces, asymmetric bridge) | 7 |
| #44 | Ecological-narrative canonical schema | 4 |
| #45 | Render canonical narrative into both surfaces | 7 |
| #49 | Narrative ingestion workflow | 3, 4 |
| #50 | Repository consolidation audit | 2, 8 |
| #51 | Doctrine resolution proposal | 8 |
| #54 | Narrative integrity check (build-time) | 4 |
| #55 | Narrative review checklist | 3, 4 |
| #61 | Doctrine consolidation (single canonical layer; Article XVII added) | 3, 6, 8 |
| #62 | Book architecture (~100-page record, design-only) | 1, 5 |

---

## 4. Archival-status legend

- **canonical** — load-bearing on disk; cited in PR review.
- **operational** — non-doctrine specification; consulted by
  contributors but not auto-loaded.
- **reflective** — observational record (audit, review, findings);
  never cited as binding rule per PR #51 §3.
- **architecture-only** — design substrate; the deliverable is the
  document itself, not yet executed in prose.
- **superseded** — preserved on disk as historical record; do not
  cite. See `cinematic-principles.md` archival header.
- **pending capture** — material identified but not yet on disk.
  As of 2026-05-26 there are **no** entries in this state; all
  nine focus areas resolve to existing repository files. If a
  future preservation pass surfaces material that exists only in
  conversation history, this is where it would be tracked.

---

## 5. What this index does not do

- Does not draft any chapter.
- Does not amend, refine, or consolidate any existing material.
- Does not create a new doctrine layer or governance document.
- Does not redefine archival status of any file.
- Does not propose a writing schedule.
- Does not duplicate content (every row points; nothing is copied).

When the first chapter is drafted, it lands at `book/chapters/<slug>.md`
with the slug from §1, and a single line is added to that row in
the table updating `Status`.
