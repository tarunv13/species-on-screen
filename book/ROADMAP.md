# Book Drafting Roadmap

**Status:** durable future-writing roadmap. Frozen 2026-05-26 while
reasoning continuity is strong. Single file by design.

**Scope.** Operational sequencing only. Does not draft prose, does
not amend the book architecture, does not expand governance.

**Companions:**
- [`book/INDEX.md`](INDEX.md) — chapter-slot mapping (canonical).
- [`.agents/tasks/task-book-architecture/2026-05-25-book-architecture.md`](../.agents/tasks/task-book-architecture/2026-05-25-book-architecture.md) — Part-level architecture, page budgets, soft-maximum table, turning-point register.

---

## 1. Drafted chapters

| Slug | Path | Length | State |
|------|------|--------|-------|
| `family-c-and-the-contradiction-made-visible` | [`chapters/family-c-and-the-contradiction-made-visible.md`](chapters/family-c-and-the-contradiction-made-visible.md) | ~1,380 words | seed; not yet ratified against the book architecture |

---

## 2. Highest-priority remaining chapters (memory-fade ranking)

Chapters whose operational reasoning is most likely to fade before
the repository alone can reconstruct it. Draft these first.

| Rank | Slug | Memory-fade risk | Why volatile |
|------|------|------------------|--------------|
| 1 | `settle-is-not-a-tween-chapter` | high | The §7 finding in `depth-medium-findings.md` records the rule, not the perceptual reasoning that produced it. The v1→v2 pivot (PR #38 → PR #40) is the one turning point on the architecture's seven-item register that has no first-person operational record. |
| 2 | `asymmetry-chapter` | high | `platform-architecture.md` §6 codifies the bridge as asymmetric; the reasoning for *why a symmetric bridge fails* lives between PRs #43 and #45 and is not captured on disk. The Family C seed chapter resolves the surface-level case but not the structural argument. |
| 3 | `doctrine-consolidation-chapter` | medium | The audit (PR #50), proposal (PR #51), and execution (PR #61) are preserved. The walk that determined *only* §3 Atmospheric Hierarchy was uncovered material — a section-by-section comparison against the steering trio — was conducted in conversation. |

---

## 3. Safest future drafting order

Order minimises cross-chapter redundancy and front-loads
memory-volatile material.

| Order | Slug | Rationale |
|-------|------|-----------|
| 1 | `settle-is-not-a-tween-chapter` | Most volatile. Soft-maximum constraint per book-architecture Part VII §3 — must be drafted tight. |
| 2 | `asymmetry-chapter` | Anchors the structural argument the Family C seed leaves implicit. Drafting before doctrine-consolidation prevents that chapter from absorbing the asymmetry material. |
| 3 | `doctrine-consolidation-chapter` | Anchored by three preserved PRs; needs the walk-narrative recovered before it fades further. |
| 4 | `perceptual-findings-drafts` | After settle is drafted, the rest of `depth-medium-findings.md` can be drafted as a single chapter without redundancy. |
| 5 | `source-hierarchy-outputs` | Repository-preserved (schema, workflow, checklist). Low memory dependency; can wait. |
| 6 | `continuity-dossier` | Synthesis chapter; drafting later means the prior chapters are available as anchors. |
| 7 | `prose-governance-layer` | Canonical layer fully on disk; this chapter is mostly tour, not recovery. |
| 8 | `book-architecture-outputs` | The architecture is the deliverable; a chapter about it is ratification, not narration. Last. |

---

## 4. Intentionally deferred

Per book-architecture Part XII (intentionally-undocumented register).
These do not enter the chapter list.

- Per-narrative editorial reasoning (the editor's case-by-case calls).
- The author's relationship to the subject.
- Future plans for the project.
- The slug `drafted-book-chapters` (focus area #1) — meta-slot; the architecture itself is the chapter list.

---

## 5. Chapters that risk redundancy

| Pair | Overlap | Boundary rule |
|------|---------|---------------|
| `asymmetry-chapter` ↔ `family-c-and-the-contradiction-made-visible` | Both terminate at the asymmetric-bridge resolution. | Asymmetry chapter argues the structure; Family C chapter narrates the case. Asymmetry must not re-narrate Family C; Family C must not re-derive the structural argument. |
| `doctrine-consolidation-chapter` ↔ `family-c-and-the-contradiction-made-visible` | Both touch the 2026-05-25 audit (PR #50). | Family C cites §4 (folder drift) and §7 (misuse ranking). Doctrine-consolidation owns §1–§2 (duplicate concepts; parallel doctrine folders) and the proposal/execution sequence. |
| `perceptual-findings-drafts` ↔ `settle-is-not-a-tween-chapter` | Settle is §7 of `depth-medium-findings.md`. | Settle becomes its own chapter. Perceptual-findings chapter covers §1–§6 + §8 only and cross-references settle without restating it. |
| `source-hierarchy-outputs` ↔ `prose-governance-layer` | Both touch citation discipline (Canon VII, citation laundering). | Source-hierarchy owns the discriminated-union schema and the evidence-threshold ladder. Prose-governance owns Canon VII as voice rule, not as schema. |

---

## 6. Chapters requiring the most caution

| Slug | Failure mode | Mitigation |
|------|--------------|------------|
| `doctrine-consolidation-chapter` | Drift into governance philosophy. | Hold tight to the audit/proposal/execution sequence. Cite PR #50, #51, #61 as the three structural beats; do not generalise. |
| `asymmetry-chapter` | Drift into philosophy-of-web. | Ground every section in `platform-architecture.md` §5–§8 surface rules. No claim about *the web*; only claims about the project's two surfaces. |
| `continuity-dossier` | Drift into project nostalgia. | Anchor to the seven-item turning-point register (book-architecture Part VIII §5). One operational beat per turning point; no narrative arc. |
| `settle-is-not-a-tween-chapter` | Soft-maximum violation per book-architecture Part VII §3. | Honour the soft maximum. The chapter exists to register the finding, not to elaborate it. |
| `perceptual-findings-drafts` | Re-deriving doctrine. | Findings are advisory; the chapter must not assert any rule that has not already become an Article. Article XVII is the only finding that crossed into doctrine; the rest stay advisory. |

---

## 7. Unresolved book-architecture tensions

Tensions identified during the 2026-05-26 preservation pass. None
require resolution before drafting begins; all should be settled
in an architecture-amendment PR before a writing pass goes wide.

| # | Tension | Surfaces in |
|---|---------|-------------|
| T1 | INDEX slugs (chapter-keyed) do not map 1:1 onto book-architecture Parts (Part-keyed). A chapter may belong inside a Part, span Parts, or sit in an appendix. | INDEX §1 vs book-architecture Parts I–XIII |
| T2 | The seven-item turning-point register and the ten chapter slots in INDEX are different cuts of the same project. Six turning points map cleanly to a chapter slot; one (the narrative-registry pipeline) does not. | book-architecture Part VIII §5 vs INDEX §1 |
| T3 | The five-axis Part classification (foundational / operational / archival / reflective / reference-only) does not project onto chapter status. A reflective Part may carry foundational chapters. | book-architecture Part-level classification |
| T4 | The Tier 1 / 2 / 3 reproduction system governs artefact reproduction in the book. It does not specify how a chapter quotes a Tier 2 artefact (extracted, not reproduced). | book-architecture Part X (artefact tiers) |
| T5 | Page budgets are Part-level (±10%); chapters are author-level. Drafting cannot verify page-budget compliance until Parts are populated. | book-architecture Part-level page allocations |
| T6 | The Family C seed chapter is drafted but not yet placed in a Part. Likely Part VI (the publication-readiness sequence) or Part VIII (turning points), not both. | INDEX §1 row 10; book-architecture Parts VI / VIII |

---

## 8. Recommended stopping points for future drafting phases

Each phase ends at a natural review boundary. Phases are independently
mergeable.

| Phase | Chapters | Stop after | Review focus |
|-------|----------|------------|--------------|
| A | 1. settle-is-not-a-tween, 2. asymmetry | Phase A complete when both seed drafts land. | Memory-volatile material is captured; subsequent drafting is repository-anchored. |
| B | 3. doctrine-consolidation | Phase B complete when the walk-narrative is recovered. | All three high-fade-risk chapters (§2 above) are now on disk. |
| C | 4. perceptual-findings, 5. source-hierarchy | Phase C complete when the two repository-rich chapters land. | Operational chapters complete; reflective chapters remain. |
| D | 6. continuity-dossier, 7. prose-governance | Phase D complete when synthesis chapters land. | The book has a structural body. Architecture-output chapter remains. |
| E | 8. book-architecture-outputs | Phase E complete when the architecture is ratified or amended. | Whole-book read-through. Architecture-amendment PR opens before ratification if Phase A–D surfaced changes. |
| F | Place all chapters into Parts. Resolve T1–T6. | Architecture-amendment PR. | Page-budget verification (±10%); turning-point register vs chapter slugs reconciled; Tier 1/2/3 quoting rule defined. |

---

## 9. Memory-fade vs preservation-sufficient

Determines what *must* be drafted soon and what *can* wait.

### 9a. Depend on operational memory fading quickly — draft soon

| Slug | What is on disk | What is in volatile memory |
|------|-----------------|----------------------------|
| `settle-is-not-a-tween-chapter` | Rule + brief justification (`depth-medium-findings.md` §7); the v2 review's "M5 — From resolution to continuance" diff. | Why the v1 settle read as scene-ending; the perceptual session that produced the continuance reframing; the moment the term *tween* was rejected as the wrong primitive. |
| `asymmetry-chapter` | Bridge codified (`platform-architecture.md` §5–§8); operational implementation (PR #45). | Why a symmetric bridge was tried first and abandoned; the discussion that produced "burden of proof on the proposer; default is research"; the failure mode each never-rule in §8 prevents. |
| `doctrine-consolidation-chapter` | Audit, proposal, execution (PRs #50, #51, #61). | The walk against `cinematic-principles.md` that determined §3 Atmospheric Hierarchy was the only uncovered section; the reasoning for re-status (archival, not deletion); the decision to fold §3 into Article XVII rather than create a fifth steering doc. |

### 9b. Repository artefacts already preserve sufficiently — can wait

| Slug | Why preservation is sufficient |
|------|--------------------------------|
| `book-architecture-outputs` | The architecture file (PR #62) is itself the chapter content. |
| `prose-governance-layer` | Editorial-voice canons (PR #17), ingestion workflow (PR #49), review checklist (PR #55) are all canonical and load-bearing on disk. The chapter is a tour. |
| `source-hierarchy-outputs` | Schema (PR #44), workflow §2 (PR #49), checklist §1–§2 (PR #55), build-time integrity check (PR #54), exemplar packets (PR #23) capture the full operational surface. |
| `continuity-dossier` | Repository audit, bootstrap sprint, single-researcher workflow, turning-point register all on disk. The chapter synthesises preserved material. |
| `perceptual-findings-drafts` | `depth-medium-findings.md` and the v2 review preserve the findings advisory-grade. Article XVII captures the one finding that became doctrine. |

---

## 10. What this roadmap does not do

- Does not draft prose.
- Does not amend the book architecture (T1–T6 are the agenda for that amendment, not the amendment itself).
- Does not expand governance.
- Does not specify chapter lengths beyond the soft-maximum constraint already in book-architecture Part VII §3.
- Does not propose a calendar.
- Does not bind any PR; can be re-frozen at the next preservation pass.
