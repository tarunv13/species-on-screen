# Architecture Decision Record — Documentation Governance Integration

**Date:** 2026-07-07
**Status:** RATIFIED (2026-07-07) — Chief Architect ruling. Sections 1–6 are the ratified record; Section 7 records the ratification. Amendments, if any, are appended and dated per the project's amendment convention (`cinematic-vocabulary.md` §13); the ruling is not overwritten.
**Role:** Chief Architect ruling. Rejects a proposed parallel governance layer and rules on where its content is integrated. Per `PROJECT_OPERATING_MANUAL.md` §4, opening a new architecture — or, as here, closing one down — requires a decision record; this is that record.

---

## 1. The question this resolves

A four-document governance proposal (`WORK_QUEUE.md`, `ROADMAP.md`, `OWNERSHIP_MATRIX.md`, `.docs/Repository Publishing Guide.md`) was drafted this session to track a documentation-canonicalization backlog. Before any of its content was acted on, a governance quality review examined whether these four documents belong in the repository's existing structure, per `PROJECT_OPERATING_MANUAL.md` §1's canonical governance map. This record rules on that review's finding.

## 2. Verified facts from the repository

Confirmed by direct inspection this session:

- `PROJECT_OPERATING_MANUAL.md` §1 lists governance tiers, each with a location and an update cadence (Constitution, Architecture Index, AI Operating System, Roadmap, Status, Session diaries, Decisions, Thoughts). None of the four proposed documents is an entry in this table.
- `PROJECT_STATUS.md` states *"M1–M17 shipped"* as real, already-used milestone history, and `OBSERVATORY_V2_IMPLEMENTATION.md` owns the live M33–M40 roadmap. The proposed `ROADMAP.md` introduced its own sequential milestone-style labels under the same prefix — a direct namespace collision with real milestone numbers, not a stylistic echo.
- `.agents/AI-OS.md` Tier 1 already defines the repository's role table (Chief Architect, Design Agent, Doctrine Reviewer, Implementation Agent, and others) and Tier 3 tool-adapter bindings mapping each role to its current tool. The proposed `OWNERSHIP_MATRIX.md` restated a flattened three-role version of this table without citing it.
- `PROJECT_STATUS.md`'s existing Backlog section already carries content of exactly this shape — some entries carry lettered sub-items with per-item status, and one entry cites an ADR for the ruling behind it. The proposed `WORK_QUEUE.md` was a second, uncited backlog of the same shape.
- A `docs/` directory (no leading dot) already exists in the repository, holding existing prose/standards documents. The proposal created a second, near-identically named `.docs/` directory for one new file.
- `.agents/tasks/` directories exist, but every instance predates the 2026-05-25 doctrine consolidation; `private-book/continuity/continuity-dossier.md` marks them *"Pre-doctrine or deprecated-track. Archival only. Do not consult as guidance."* `PROJECT_OPERATING_MANUAL.md` §1's canonical map, written after that consolidation, omits `.agents/tasks/` entirely.

## 3. Constraints imposed by existing doctrine and governance

- `.agents/AI-OS.md`'s operating principle: *"the repository advances through completed production milestones, not through additional architectural documents."*
- `.agents/AI-OS.md`'s creation policy for `.agents/decisions/`: *"File only when a ruling is made"* — no equivalent standing policy authorizes new root-level backlog, roadmap, or ownership files.
- `PROJECT_OPERATING_MANUAL.md` §4: *"Opening a new milestone (beyond the frozen roadmap) is an architectural act and requires a Chief Architect decision record; it is never done ad hoc."*
- `PROJECT_OPERATING_MANUAL.md`'s single-source-of-truth discipline (M27): no duplicated metadata or dual sources.

## 4. Decision

The four-document proposal is **rejected** as a parallel governance layer, for the reasons detailed in §2.

## 5. Integration ruling

- Operational work items are tracked as a `PROJECT_STATUS.md` Backlog entry, in the same style as its existing items — not as a standalone file.
- Reusable documentation-canonicalization procedure is absorbed as a new section of `PROJECT_OPERATING_MANUAL.md` — not as a standalone guide.
- Ownership and role authority remain exclusively in `.agents/AI-OS.md`, referenced by name where needed — not restated elsewhere.
- The four proposed documents and the `.docs/` directory are removed once the above destinations hold their content.

This record does not itemize the specific work entries or migration steps; those are tracked in the destinations named above, consistent with the single-source-of-truth discipline this ruling reaffirms.

## 6. Standing precedent

Before any future session creates a new root-level file or a new top-level directory for governance, backlog, ownership, or procedural content, `PROJECT_OPERATING_MANUAL.md` §1's canonical governance map must be checked first. If an existing tier already owns that content class, the new material is routed there; a new tier is created only via its own decision record, per §4 of that manual.

## 7. Ratification

**Ratified by:** Chief Architect
**Date:** 2026-07-07
**Decision:** The proposed governance-freeze layer is rejected as a parallel governance layer. Its content is integrated per §5, using the repository's existing governance tiers. No new governance tier is created by this record.
