---
id: 2026-07-07-thought-system-v1
title: A capture net for pre-resolution reasoning — the Thought System
domain:
  - architecture
origin: Conversation
status: Promoted
opened: 2026-07-07
updated: 2026-07-07
promoted: 2026-07-07
maturation: ADR
supersedes:
superseded-by:
---

# A capture net for pre-resolution reasoning — the Thought System

> This file is READ-ONLY: preserved as reasoning-of-record. Current truth lives in the
> downstream artifact named under Cross-references (`.agents/decisions/2026-07-07-thought-system.md`).
> Post-freeze changes are additive, dated amendments only.
>
> It also serves as the worked example of the template: it exercises every section — Thesis,
> Reasoning, Evolution, Cross-references — and shows a Promoted (frozen) Thought pointing at the
> ADR that now owns the decision.

**Thesis.** The repository has a home for every resolved form of work but none for the
pre-resolution reasoning that spans sessions before it becomes a ruling or a milestone. That
reasoning currently survives only in conversation and is lost when the conversation ends. A
single flat `.agents/thoughts/` directory, governed by the same institutional-memory discipline
as `decisions/` and `sessions/`, closes that gap without adding a parallel governance system.

## Reasoning

Every resolved artifact already has a canonical home: doctrine in `.kiro/steering/`, rulings in
`.agents/decisions/`, per-session record in `.agents/sessions/`, milestone state and the backlog
in `PROJECT_STATUS.md`, durable extraction in `private-book/`. The gap is the *working-memory*
tier upstream of all of them — a line of reasoning that is not yet a ruling (ADRs are written
"when a ruling is made"), not tied to one session (diaries are "one per session"), and not yet a
committed milestone. The M33 entry in `PROJECT_STATUS.md` records the concrete failure mode: the
Observatory v2 design cascade "previously lived only in a design conversation" until a milestone
transcribed it. Reasoning that outruns its eventual artifact evaporates.

A Thought fills that tier. The load-bearing rule is the M27 single-source discipline applied to
reasoning: exactly one artifact owns a current decision (the ADR or milestone); exactly one owns
the reasoning that produced it (the Thought). Different facts, one home each. On promotion a
Thought is frozen read-only — preserved in full as reasoning-of-record, never shortened — and the
downstream artifact becomes the source of truth for current state. Preservation over deletion is
the same additive-amendment convention the ADRs already use, and it matches the environment's own
"traceability, not truth" ethos (the Ecological Knowledge Environment founding spec,
`.agents/decisions/2026-07-03-eke-reference-implementation-founding-spec.md`).

The design is deliberately small: one flat directory, domains carried in frontmatter rather than
folders (so a Thought crossing domains never moves), an `origin` field for provenance, a
five-state lifecycle, and an Evolution log that turns each Thought into an auditable history
rather than only a proposal. Automation is staged and mostly deferred: only the static scaffold
ships now, because the operating principle in `.agents/AI-OS.md` binds new machinery to
demonstrated need.

## Decision to make

Resolved. The open question — whether pre-resolution reasoning warrants its own institutional
layer, and in what shape — was ruled on by the Chief Architect in
`.agents/decisions/2026-07-07-thought-system.md` (V1.0 adopted; TS2–TS4 automation deferred; the
`confidence` field rejected permanently). This Thought is therefore Promoted and frozen; the ADR
governs.

## Evolution

### 2026-07-07 — from a production-only capture to a general institutional layer

- **Previous understanding:** the capture net was scoped as `production-thoughts/` — a single
  register for production milestone thinking.
- **New evidence:** the same loss vector applies to editorial, research, and architecture
  reasoning, which the repository already treats as distinct concerns (the AI-OS role split;
  the tone-classes in `private-book/governance/prose-governance.md` §10).
- **Repository artifact that changed it:** `.agents/AI-OS.md` (Roles table).
- **Resulting conclusion:** generalize to `.agents/thoughts/` with four domains
  (production · editorial · research · architecture).

### 2026-07-07 — promotion preserves reasoning, it does not shorten it

- **Previous understanding:** on promotion a Thought would be reduced to a thesis plus a pointer
  to the downstream artifact, to avoid duplication.
- **New evidence:** reducing the body would destroy the reasoning-of-record; provenance is not
  duplication, and the project preserves superseded reasoning rather than collapsing it (the
  amendment convention in `cinematic-vocabulary.md` §13; the three dated amendments on the WP8
  ADR).
- **Repository artifact that changed it:** `.agents/decisions/2026-07-05-wp8-interaction-model-adr.md`.
- **Resulting conclusion:** promotion freezes a Thought read-only with its full reasoning intact;
  an Evolution section is added so the change history is auditable.

### 2026-07-07 — flat directory, domains and origin in frontmatter

- **Previous understanding:** four physical subfolders, one per domain.
- **New evidence:** a Thought that evolves across domains would have to move and rename, breaking
  its history and links; the repository names provenance as a first-class property (the
  founding spec's traceability pillars).
- **Repository artifact that changed it:** `.agents/decisions/2026-07-03-eke-reference-implementation-founding-spec.md`.
- **Resulting conclusion:** keep one flat directory; carry one or more `domain` values plus a
  required `origin` in frontmatter; INDEX groups by domain as a derived view. A session-close
  Thought Review is added to the AI-OS protocol.

### 2026-07-07 — freeze V1.0; defer three refinements; reject confidence

- **Previous understanding:** four proposed refinements (a `Dormant` state, an Evidence section,
  a second Thought-Review question, and a `confidence` field) might all fold into V1.0.
- **New evidence:** `confidence` is the subjective summary-judgment register the evidential
  surface was engineered to forbid (`PROJECT_STATUS.md`, M34: forbidden-term unit test; M33/D7:
  non-resolution as "an open question, not a failure"); the other three are beneficial in
  principle but their benefit only manifests under real usage, which the AI-OS bars from being
  pre-empted ("Never create speculatively").
- **Repository artifact that changed it:** `PROJECT_STATUS.md` (M33/M34 entries) and
  `.agents/AI-OS.md` (operating principle + Appendix).
- **Resulting conclusion:** freeze V1.0; reject `confidence` permanently; record Dormant, the
  Evidence section, and the invalidation question as the system's own first deferred Thoughts,
  to be adopted only when a real Thought demonstrates the need.

## Cross-references

- ADR:              .agents/decisions/2026-07-07-thought-system.md
- Task:             PROJECT_STATUS.md — Thought System TS0+TS1 milestone
- Session diaries:  .agents/sessions/2026-07-07-thought-system-ts0-ts1.md
- Book chapter:
- Doctrine:
- Prototype review:
