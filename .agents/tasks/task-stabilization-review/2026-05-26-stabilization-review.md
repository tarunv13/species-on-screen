# Repository Stabilization and Merge-Readiness Review

**Date:** 2026-05-26.
**Scope:** branch hygiene, merge sequencing, canonical-file
consistency, build integrity, leftover Family C and prototype
leakage, surviving doctrine/source ambiguity. Limited public release
preparation.
**Status:** observational task record. Not steering, not doctrine,
not amendment. Cannot be cited in PR review (per PR #51 §3).

**Repository state.** `main` at `52452da` (PR #64 merged). `npm run
check-narratives` and `npm run build` both pass; `dist/` totals 940
KB. No open PRs. Local branch `book-preservation-pass` carries two
orphan commits (see §6).

---

## 1. Highest-priority stabilization actions

Ordered by release-blocking severity. Each is independently shippable.

| # | Action | Why | Surface |
|---|--------|-----|---------|
| A | Collapse the `book/` ↔ `private-book/` duality | Two parallel book taxonomies exist on `main`. PR #64 declared `private-book/` the single durable home; `book/` is now redundant and carries stale architecture references. | `book/INDEX.md`, `book/chapters/.gitkeep` |
| B | Retire orphaned legacy renderer | `src/species-page.js` (1,149 lines) and `src/species-page.css` are imported by no production module after PR #60 Fracture 1; they are reachable only by file path and future revival is the standing risk. | `src/species-page.js`, `src/species-page.css` |
| C | Add archival header to `species/*.html` | Ten files sit on disk without a status note. PR #60 kept them deliberately; the absence of a header makes accidental revival cheap. One comment block per file. | `species/*.html` (10 files) |
| D | Prune unused species data from production | `dist/data/` ships 10 JSON files; current homepage (`HOTSPOTS` reduced to one in PR #37) reads only `tiger.json`. Nine unused JSONs leak through every build. | `public/data/*.json` (9 of 10), `scripts/fetch-tmdb-data.js` |
| E | Update `README.md` for orientation | README covers narrative authoring only. A first-time reader has no pointer to `places/` (cinematic), `notes/` (research), the asymmetric bridge, or `private-book/`. Release-blocker for limited public release. | `README.md` |
| F | Reconcile stale architecture references | `book/INDEX.md` and `private-book/README.md` both still cite the original `.agents/tasks/task-book-architecture/2026-05-25-book-architecture.md` path. PR #64 moved the file to `private-book/architecture/book-architecture.md`. | `book/INDEX.md`, `private-book/README.md` |
| G | Verify remote branch hygiene | Remote `book-preservation-pass` could not be inspected due to a sandbox auth limitation; confirm it is deleted post-merge. | remote `origin/book-preservation-pass` |

Items A, B, C, F bundle naturally as one **repository-hygiene PR**.
Items D, E bundle as one **public-release-prep PR**. G is verification
only.

---

## 2. Safest merge order

No open PRs at the time of review. Merge order applies to the
stabilization actions above.

| Order | PR scope | Items | Rationale |
|-------|----------|-------|-----------|
| 1 | This review | the document itself | Establishes the stabilization agenda before any change lands. |
| 2 | Repository-hygiene | A, B, C, F | All four are non-functional cleanups; together they retire `book/`, retire the legacy renderer, mark `species/*.html` as archival, and resolve stale references. Ordering inside the PR: F first (so headers cite the right path), A second, B third, C last. |
| 3 | Public-release-prep | D, E | Both touch user-facing surfaces. D may need a follow-up to confirm no implicit homepage logic depends on the eight non-tiger JSONs (none observed in `src/globe.js`, but the `COMING_SOON_HOTSPOTS` array remains in module scope per PR #37). E is README-only. |
| 4 | (deferred) | G | After #2 and #3 land, confirm remote branches and re-run a clean build. |

The orphan-commits decision (§6) is independent of this order and
should be resolved before #2 lands so the Family C chapter, if
wanted, can be ported into the same `private-book/` cleanup.

---

## 3. Unresolved conflicts and dependencies

| ID | Conflict | Files involved | Resolution |
|----|----------|----------------|------------|
| C1 | Two book indexes | `book/INDEX.md`, `private-book/README.md` | Delete `book/`; `private-book/README.md` is canonical (PR #64). |
| C2 | Stale architecture path | both files above | After PR #64 the architecture lives at `private-book/architecture/book-architecture.md`; the two indexes still cite `task-book-architecture/...`. |
| C3 | Chapter-slot count mismatch | `book/INDEX.md` (10 slots, mine), `private-book/chapters/` (3 chapters: asymmetry, doctrine-consolidation, settle-is-not-a-tween) | Resolved by C1; `private-book/` is the survivor. |
| C4 | Orphan commits | local `book-preservation-pass` branch carries `908c240` (Family C seed chapter) and `0daf116` (drafting roadmap) | See §6. |
| C5 | Architecture tensions T1–T6 | unresolved per the orphan roadmap | Out of scope for stabilization. Reopens as architecture-amendment PR after stabilization completes. |

No build-time conflicts. `npm run check-narratives` passes (11
narratives, all invariants); `npm run build` passes; `dist/species/`
and `dist/prototypes/` confirmed absent.

---

## 4. Files and branches safe to archive or close

| Item | Type | Status | Disposal |
|------|------|--------|----------|
| `book/INDEX.md` | file | superseded by `private-book/README.md` | delete |
| `book/chapters/.gitkeep` | file | placeholder, no chapter content landed | delete |
| `book/` | directory | empty after the two files above are removed | delete |
| `src/species-page.js` | file | orphan renderer; no import from any production module | delete (or move under `species/` to colocate with archival HTML) |
| `src/species-page.css` | file | orphan stylesheet; only `src/species-page.js` references it | delete with above |
| `book-preservation-pass` (local) | branch | merged into `main` at an earlier state; carries two orphan commits | delete after orphan-commits decision (§6) |
| `book-preservation-pass` (remote) | branch | indeterminate (auth limit); likely already deleted by PR #63 merge | confirm and delete if still present |

Not for archival:
- `species/*.html` — kept on disk per PR #60. Adds an archival
  comment header; do not delete.
- `cinematic-language/cinematic-principles.md` — archival per PR
  #61 with redirect header. Already correctly statused.
- `prototypes/*.html` — kept on disk per PR #60 Fracture 3. Used
  under `npm run dev`.

---

## 5. Remaining public-release risks

| ID | Risk | Severity | Mitigation |
|----|------|----------|------------|
| R1 | README provides no project orientation | high | E above. Without it, a first-time visitor sees a narrative-authoring guide and nothing else. |
| R2 | Nine unused species JSONs ship in `dist/data/` | medium | D above. Not user-facing (no homepage logic reads them), but they are public artefacts. |
| R3 | `species/*.html` reachable in repo without archival header | medium | C above. Disk-only; not bundled. The header prevents accidental revival but does not block discovery. |
| R4 | Two book taxonomies confuse a returning reader | medium | A and F above. |
| R5 | Pre-existing chunk-size warning (main bundle 544 KB) | low | Not a release blocker. Pre-dates the stabilization scope. Defer. |
| R6 | Architecture file references stale path in two indexes | low | F above. |
| R7 | `COMING_SOON_HOTSPOTS` data array in `src/globe.js` retained in module scope | low | Per PR #37 commit message: rendering retired, data persists. Decide on retention separately; not a release blocker. |
| R8 | `scripts/fetch-tmdb-data.js` re-writes 10 species JSONs if invoked | low | Could become R2 again on next data refresh. If D restricts the data set, also restrict the script. |

No high-severity risks beyond R1.

---

## 6. Surviving Family C remnants

| Item | Reachable from production? | Disposal |
|------|---------------------------|----------|
| `species/*.html` (10 files) | no — removed from `vite.config.js` build inputs in PR #60 | retain on disk; add archival header (action C) |
| `src/species-page.js` | no — no production import | delete (action B) |
| `src/species-page.css` | no — only consumed by the file above | delete (action B) |
| `public/data/*.json` (10 files) | tiger only — homepage HOTSPOTS reduced to 1 | prune to active species (action D) |
| `dist/data/*.json` (10 files) | rebuilt from `public/data/` on every `npm run build` | resolves with action D |
| `scripts/fetch-tmdb-data.js` | invoked manually via `npm run fetch-data` | restrict to active species when D lands |
| `<noscript>` fallback in `index.html` | yes | already in research register per PR #60; no remediation needed |
| Page-caption `href` in `index.html` | yes | already retargets to `notes/sundarbans-bengal-tiger-saline-swimmer.html` per PR #60; clean |

The architectural Family C remediation (PR #60 Fracture 1) holds.
What survives is **disk residue** plus **data leakage**, both
addressable by actions B, C, D.

### Orphan commits — separate disposal

Local branch `book-preservation-pass` carries two commits not
reflected in `main`:

| SHA | Subject | Disposal options |
|-----|---------|------------------|
| `908c240` | Seed chapter: Family C and the contradiction made visible (~1,380 words) | (a) port to `private-book/chapters/family-c-and-the-contradiction-made-visible.md` as a fourth chapter; (b) discard. |
| `0daf116` | Future-drafting roadmap (153 lines, 10 sections) | (a) port to `private-book/ROADMAP.md`; (b) discard — `private-book/README.md` covers similar ground. |

Decision belongs to the next session. Both commits are recoverable
from the local branch reflog until it is deleted.

---

## 7. Surviving doctrine and source ambiguity

| Layer | State | Ambiguity? |
|-------|-------|-----------|
| `.kiro/steering/cinematic-vocabulary.md` (Articles I–XVII) | canonical | none |
| `.kiro/steering/editorial-voice.md` (Canons I–XXI) | canonical | none |
| `.kiro/steering/pacing-principles.md` (Principles I–XX) | canonical | none |
| `.kiro/steering/experiential-references.md` (References) | canonical | none |
| `cinematic-language/platform-architecture.md` | operational authority | none |
| `cinematic-language/cinematic-principles.md` | archival, redirect header | none — PR #61 cleaned this up |
| `cinematic-language/depth-medium-findings.md` | advisory, self-labeled | none |
| `cinematic-language/narrative-ingestion-workflow.md` | operational | none |
| `cinematic-language/narrative-review-checklist.md` | operational | none |
| Schema file `cinematic-language/ecological-narrative.example.ts` | canonical schema | residual: `.example.ts` suffix is misleading (flagged in PR #50 §3); rename deferred and not a release blocker |
| `book/` vs `private-book/` | parallel | yes — C1, resolved by action A |
| Architecture file path | dual reference | yes — C2, resolved by action F |

No doctrine-layer ambiguity. The four canonical doctrine files are
single-source after PR #61. The remaining ambiguity sits in the
book layer and is bookkeeping, not governance.

---

## 8. What this review does not do

- Does not redesign the architecture.
- Does not amend `private-book/README.md`, the Part-level
  architecture, or any chapter draft.
- Does not generate new doctrine.
- Does not propose new features.
- Does not start new prototypes.
- Does not perform philosophical analysis.
- Does not bind any PR.

The output is a checklist for the next session. Re-read once before
opening the repository-hygiene PR; do not cite during PR review.
