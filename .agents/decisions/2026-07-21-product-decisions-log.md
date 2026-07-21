# Architecture Decision Record — Product Decisions Register

**Date:** 2026-07-21
**Status:** RATIFIED (2026-07-21) — maintainer-directed. Sections 1–5 are the ratified record; Section 6 records the ratification. Amendments, if any, are appended and dated per the project's amendment convention (`cinematic-vocabulary.md` §13); the ruling is not overwritten.
**Role:** Chief Architect ruling, recording a maintainer-directed governance-map addition. Per `PROJECT_OPERATING_MANUAL.md` §6, a new standing document created outside §1's map requires its own decision record amending §1 first; this is that record.

---

## 1. The question this resolves

Whether to add a new canonical tier — a single-file, concise, stable register of product/experience decisions (`docs/PRODUCT_DECISIONS.md`) — to the governance map, and how it is bounded against the tiers that already exist so it is not a parallel decisions layer of the kind rejected by `.agents/decisions/2026-07-07-documentation-governance-integration.md`.

## 2. Decision

A new governance tier is established: `docs/PRODUCT_DECISIONS.md`, a concise, stable register of approved and proposed experience/product decisions keyed by stable IDs (D-numbers). `PROJECT_OPERATING_MANUAL.md` §1's canonical governance map is amended to include it. The register was directed by the maintainer.

## 3. Boundary against existing tiers (why this is not a duplicate)

`PROJECT_OPERATING_MANUAL.md` §6 forbids a new standing document that duplicates a content class an existing tier already owns. This register is bounded to avoid that:

- **`.agents/decisions/` (ADRs)** own full architectural *rulings* — one file per ruling, with rationale and verification. The register does **not** restate them; when a product decision also requires a full ruling, that ruling remains an ADR and the register entry references it (reference, never copy — §6 step 3).
- **`PROJECT_STATUS.md`** owns milestone/backlog *state*. The register is a decision-level ledger, not a milestone or task tracker; it does not duplicate status tracking.
- The register's distinct content class is a **reader-facing, stable-ID index of product/experience decisions and their status** (approved/proposed, scope, blockers), spanning decisions that may never warrant a full ADR. No existing tier owned this class.

## 4. Format and lifecycle

Entries are appended, keyed by stable D-numbers, and never renumbered; an entry's Status/Scope/Blocked-by fields are updated in place as a decision advances. The register is human-readable and deliberately concise. Its initial entries (D1–D6) are recorded at establishment.

## 5. Standing precedent

This record authorizes no further new tier. The next new standing document, tracker, or top-level directory still requires the §1 governance-map check and, if genuinely new, its own decision record amending §1 — per §6.

## 6. Ratification

**Ratified by:** Maintainer-directed; recorded by Chief Architect.
**Date:** 2026-07-21
**Decision:** `docs/PRODUCT_DECISIONS.md` is established as a governance tier and added to `PROJECT_OPERATING_MANUAL.md` §1. Its boundary against `.agents/decisions/` and `PROJECT_STATUS.md` is fixed per §3. No other tier is created.
