# Observatory v2 — Implementation Blueprint (M33–M40)

**Status:** canonical, retrospective. Transcribed into the repository from a prior
design session's conversation-only artifact (see the session's memory record:
"Implementation Blueprint + Implementation Dependency Graph + Fable Implementation
Playbook for M33–M40"), which existed only as design output until now. Same
transcription discipline `PROJECT_OPERATING_MANUAL.md` and
`OBSERVATORY_V2_IMPLEMENTATION.md` already established: this document **describes**
already-shipped, already-audited work — it introduces no new architecture, no new
milestone, and no reinterpretation of frozen doctrine.

**Authority:** descriptive, not binding. `OBSERVATORY_V2_IMPLEMENTATION.md` remains
the canonical roadmap (status, closure table, acceptance). This document is the
execution detail *beneath* that roadmap — build order, shared-file conflict
surface, rollback unit, and parallelizability per milestone — reconstructed
directly from git history (`git show --stat` per commit) and the closure
descriptions already recorded in `PROJECT_STATUS.md`. Every file list below is
copied from the actual commit diff, not recalled or inferred.

**Companion:** `PROJECT_OPERATING_MANUAL.md` §1 (governance map), §4 (milestone
working protocol). If this document and a commit ever disagree, the commit wins.

---

## 1. Dependency graph and critical path

The eight milestones form **two independent four-deep chains**, both converging at
M40:

```
M33 → M34 → M35 ─┐
                  ├─→ M40
M37 → M38 → M39 ─┘

M36 — parallelizable, off-path (feeds nothing downstream)
```

- **Chain A (evidential surface):** M33 (D7, non-resolution) → M34 (D6, reach
  badges) → M35 (D5, interrogate) → M40 (D8, interrogation URL state). Each step
  reads the previous step's output shape; M40's `#claim-N` addressing requires
  M35's `<details>` ids to exist.
- **Chain B (grammar-gate surface):** M37 (D3/D9, cinematic-purity + subject-morph
  gates) → M38 (D10, composite gate composing M37's predicates) → M39 (D1, subject
  URL-addressability) → M40 (D8, history-as-trace, which reuses M39's `withSubject`
  URL-coexistence model for `?subject=…#claim-N`).
- **M36 (D4, follow)** touches only `src/atlas/interaction-web.js` and
  `src/atlas/field-record.js`/`.css` — it shares no file with either chain until
  M40, and M40 only *reads* M36's `#fr-node-…` fragment convention (to ignore it,
  never to depend on it). It was, and remains, safe to land in any order relative
  to the two chains.
- **Realized order** (`OBSERVATORY_V2_IMPLEMENTATION.md` §"Frozen reference"):
  M33 → M34 → M36 → M35 → M37 → M38 → M39 → M40 — M36 landed early in wall-clock
  time but is not on either dependency chain, confirming its parallelizability
  retrospectively.
- **Highest merge-conflict-risk milestone: M39.** It is the only milestone to
  touch four independent consumer files in one commit
  (`src/atlas/atlas.js`, `src/atlas/field-record.js`,
  `src/notes/render-narrative.js`, `scripts/build-evidence.mjs`) plus the shared
  manifest (`cinematic-language/place-manifest.ts`) and a new shared primitive
  (`src/subject.js`) — the widest simultaneous-file footprint of the eight.

**Standing invariant across every milestone (never-touch, verified per commit):**
no cinematic file (`src/main.js`, `src/places/*`, `places/*.html`) appears in any
of the eight diffs. This is the D3 affordance-sink boundary holding mechanically,
not just by policy.

---

## 2. Per-milestone blueprint

Each entry: **Modules** (new files, from the commit diff) · **Touched** (existing
files modified) · **Reused** (pre-existing code the milestone built on, not
reinvented) · **Predecessor → Successor** · **Shared-file conflict surface** ·
**Validation** · **Rollback unit** · **Parallelizability**.

### M33 — D7, non-resolution as a first-class terminal state
- **Commits:** `c6f1874` (18 files, +1248/−42), `85c2016` (docs finalization,
  `OBSERVATORY_V2_IMPLEMENTATION.md` only).
- **Modules (new):** `scripts/evidence-reach.mjs`, `scripts/evidence-reach.test.mjs`,
  `scripts/check-dwca-xml.js`, `scripts/check-dwca-xml.test.mjs`,
  `scripts/biome-backdrop.test.mjs`, `src/prototypes/biome-backdrop.js`.
- **Touched:** `scripts/build-evidence.mjs`, `public/dwca/epr-vents/CREDITS.md`,
  `package.json`, `PROJECT_STATUS.md`.
- **Reused:** the existing `check-bindings.js` validator's L1/L2 verdicts (M33
  classifies them into three reach-states; it does not re-derive traceability).
- **Predecessor:** none (roadmap opener). **Successor:** M34 (consumes M33's
  reach-state classifier), M40 (Chain A terminus).
- **Shared-file conflict surface:** `scripts/build-evidence.mjs` (also touched by
  M34, M35, M39, M40 — the single most contended file in the roadmap).
- **Validation:** `evidence-reach.test.mjs` (19 checks after M34's extension;
  fewer at M33 landing). **Rollback unit:** revert `c6f1874` (`85c2016` is docs-only
  and reverts independently). **Parallelizability:** blocks M34; safe to run
  alongside M37/M38/M39 (Chain B, disjoint files) and M36.

### M34 — D6, reach-not-truth badges + verbatim reason codes
- **Commit:** `cfa3f67` (6 files, +205/−38).
- **Modules:** none new.
- **Touched:** `scripts/evidence-reach.mjs`, `scripts/evidence-reach.test.mjs`,
  `scripts/build-evidence.mjs`, `PROJECT_STATUS.md`.
- **Reused:** M33's reach-state classifier (extended in place, not replaced).
- **Predecessor:** M33. **Successor:** M35 (interrogate reveal sits beside M34's
  badge on the same claim card).
- **Shared-file conflict surface:** `scripts/evidence-reach.mjs`,
  `scripts/build-evidence.mjs` (both also touched by M33/M35/M40).
- **Validation:** `evidence-reach.test.mjs` (19 checks: reach badges + verbatim
  codes + forbidden-term guard). **Rollback unit:** revert `cfa3f67` cleanly
  (single commit, no dependents modify the same lines). **Parallelizability:**
  sequential-only within Chain A; independent of Chain B and M36.

### M35 — D5, in-place interrogate from inline validator JSON
- **Commit:** `8aaaf45` (7 files, +286/−20).
- **Modules:** `scripts/evidence-interrogate.mjs`, `scripts/evidence-interrogate.test.mjs`.
- **Touched:** `scripts/build-evidence.mjs`, `package.json`, `PROJECT_STATUS.md`.
- **Reused:** `check-bindings.js --json` output verbatim (never re-derived — the
  M34-review gap this milestone explicitly closed).
- **Predecessor:** M34 (needs the badge to sit beside). **Successor:** M40
  (stamps the `id="claim-N"` this milestone's `<details>` elements carry).
- **Shared-file conflict surface:** `scripts/build-evidence.mjs`.
- **Validation:** `evidence-interrogate.test.mjs` (21 checks; 190 inlined fields
  cross-checked against the validator headlessly). **Rollback unit:** revert
  `8aaaf45`. **Parallelizability:** Chain A terminus before M40; independent of
  Chain B and M36.

### M36 — D4, RO-typed lateral follow (off-path, parallelizable)
- **Commit:** `bf8237d` (8 files, +338/−17).
- **Modules:** `scripts/interaction-web.test.mjs`, `src/atlas/interaction-web.js`.
- **Touched:** `src/atlas/field-record.css`, `src/atlas/field-record.js`,
  `package.json`, `PROJECT_STATUS.md`.
- **Reused:** the existing field-record Sources panel's actor/relationship data
  (previously rendered as flat sentences; M36 restructures the *rendering*, not
  the data model).
- **Predecessor:** none (independent of both chains). **Successor:** none within
  the roadmap; M40 only reads its `#fr-node-…` convention to explicitly ignore it
  as a non-interrogation fragment.
- **Shared-file conflict surface:** none with M33–M35/M37–M40 (the only milestone
  with zero file overlap against every other milestone's diff).
- **Validation:** `interaction-web.test.mjs` (19 checks) — later joined by
  `follow-url.test.mjs` (15 checks, this session's R1 closeout addition, see §3).
- **Rollback unit:** revert `bf8237d`. **Parallelizability:** maximal — could have
  landed first, last, or anywhere between the two chains with no rebase cost;
  confirmed retrospectively by its actual landing position (2nd of 8, ahead of M35).

### M37 — D3/D9, cinematic-purity + subject-morph build gates
- **Commit:** `e180792` (7 files, +382/−15).
- **Modules:** `scripts/check-cinematic-grammar.js`,
  `scripts/check-cinematic-grammar.test.mjs`, `scripts/cinematic-grammar.mjs`.
- **Touched:** `package.json` (wires `prebuild` + `verify`), `PROJECT_STATUS.md`.
- **Reused:** nothing pre-existing — this is Chain B's foundation, providing the
  pure predicates M38 later composes.
- **Predecessor:** none (Chain B opener). **Successor:** M38 (composes M37's
  predicates without modifying them).
- **Shared-file conflict surface:** `package.json` (touched by every milestone
  M33–M40 except M33's docs-finalization commit — the second most contended file
  after `scripts/build-evidence.mjs`, but low-conflict since each milestone only
  appends one script line).
- **Validation:** `cinematic-grammar.test.mjs` (19 checks) + a live-injection test
  (a real violation introduced then reverted, confirmed caught).
  **Rollback unit:** revert `e180792` (M38 depends on its exports; reverting M37
  requires reverting M38 first — the one milestone pair with a real rollback
  ordering constraint). **Parallelizability:** blocks M38; independent of Chain A
  and M36.

### M38 — D10, single composite grammar-rejection CI gate
- **Commit:** `ccb2b2d` (8 files, +397/−17).
- **Modules:** `scripts/check-grammar.js`, `scripts/check-grammar.test.mjs`,
  `scripts/grammar-constraints.mjs`.
- **Touched:** `package.json`, `PROJECT_STATUS.md`.
- **Reused:** M37's `cinematic-grammar.mjs` predicates verbatim (imported, not
  duplicated); adds two new predicates in `grammar-constraints.mjs` for the
  subject-invariant (D1) and depth-discreteness (D2) constraints M37 didn't cover.
- **Predecessor:** M37. **Successor:** M39 (subject URL-addressability must not
  regress the D1 constraint M38 just made a build gate).
- **Shared-file conflict surface:** `package.json`.
- **Validation:** `check-grammar.test.mjs` (9 checks; each of the four constraints
  independently rejected) + explicit CI step in `.github/workflows/verify.yml`.
  **Rollback unit:** revert `ccb2b2d`. **Parallelizability:** sequential-only
  within Chain B.

### M39 — D1, subject URL-addressability across surfaces
- **Commit:** `701a49a` (11 files, +321/−39 — the widest file footprint of the
  eight milestones).
- **Modules:** `src/subject.js`, `scripts/subject.test.mjs`.
- **Touched:** `cinematic-language/place-manifest.ts`, `src/atlas/atlas.js`,
  `src/atlas/field-record.js`, `src/notes/render-narrative.js`,
  `scripts/build-evidence.mjs`, `package.json`, `PROJECT_STATUS.md`.
- **Reused:** the existing Place Manifest resolver pattern (ADR-001); the
  pre-existing `surface-links.js` derivation in `render-narrative.js`, left
  untouched — `?subject=` is layered on at render, not merged into it.
- **Predecessor:** M38 (must not violate the D1 gate M38 just built).
  **Successor:** M40 (reuses `withSubject`'s query/fragment-coexistence model
  for `?subject=…#claim-N`).
- **Shared-file conflict surface:** the **widest** in the roadmap —
  `scripts/build-evidence.mjs` (shared with Chain A) plus three independent
  consumer files (`atlas.js`, `field-record.js`, `render-narrative.js`) — this is
  the milestone a rebase against a concurrent Chain-A change would most likely
  conflict on, via `build-evidence.mjs`.
- **Validation:** `subject.test.mjs` (37 checks against the real manifest) +
  built-`dist/` confirmation that cinematic bundles carry no `?subject=` logic
  (purity check). **Rollback unit:** revert `701a49a` (self-contained; M40 does
  not modify `subject.js` itself, only imports it, so reverting M39 alone would
  break M40's build — the second real rollback-ordering constraint in the
  roadmap). **Parallelizability:** sequential-only within Chain B; the file
  overlap with `build-evidence.mjs` means it should not land concurrently with
  M33–M35 without a rebase.

### M40 — D8, history-as-trace + interrogation state in URL fragment
- **Commit:** `fc3edc6` (7 files, +234/−18).
- **Modules:** `scripts/interrogation-url.mjs`, `scripts/interrogation-url.test.mjs`.
- **Touched:** `scripts/build-evidence.mjs`, `package.json`, `PROJECT_STATUS.md`.
- **Reused:** M35's `id="claim-N"` stamping convention (addressed, not
  re-derived); M39's `withSubject` coexistence model (`?subject=id#claim-N`);
  M36's `#fr-node-…` convention (explicitly recognized and ignored as
  non-interrogation).
- **Predecessor:** M35 (Chain A) and M39 (Chain B) — the only milestone with two
  predecessors, both required. **Successor:** none (roadmap terminus).
- **Shared-file conflict surface:** `scripts/build-evidence.mjs` (its sixth and
  final touch across the roadmap: M33, M34, M35, M39, M40 all modify it).
- **Validation:** `interrogation-url.test.mjs` (15 checks) + built-ledger
  confirmation (10 `id="claim-N"` stamped, restore script `node --check`-valid).
  Later joined by this session's browser-behavioral QA (R1, see §3).
  **Rollback unit:** revert `fc3edc6` (safe in isolation — nothing in the roadmap
  depends on M40's output, since it is the terminus).
  **Parallelizability:** none — the only milestone requiring both chains complete.

---

## 3. Post-roadmap closeout already folded in (R1, not a new milestone)

Two closeout items landed **after** the roadmap's closure audit, against R1
(browser-behavioral verification the audit had explicitly deferred), each as a
single small commit and each explicitly *not* a new milestone per §4:

- **M40 browser QA** (`bf6865a`, 2026-07-04) — all four D8 behavioral criteria
  confirmed in a real browser against built `dist/`; no code changed.
- **M36 browser QA** (`c5a1b87`, 2026-07-05) — the follow action's `:target`
  pulse/focus/history behavior confirmed in a real browser; no code changed.
- **Follow deep-link restore** (`862f892`, 2026-07-05) — the one genuine
  repository/roadmap gap the M36 QA surfaced (a cold `#fr-node-<id>` deep link did
  not restore on the async field record, contradicting D8's restorability claim)
  was fixed: `src/atlas/follow-url.js` (new) + `src/atlas/field-record.js`
  (touched), validated by `scripts/follow-url.test.mjs` (15 checks).

Remaining R1: the `eke-subject` view-transition morph (M37/M39) and the M28
easing/timing polish — both animation-QA items, not implementation gaps, per
`OBSERVATORY_V2_IMPLEMENTATION.md` §"Remaining work".

---

## 4. What this document is not

- Not a new roadmap. It documents milestones already CLOSED in
  `OBSERVATORY_V2_IMPLEMENTATION.md`; it opens none.
- Not a redesign of any frozen decision (D1–D10) or doctrine. Every dependency,
  file list, and risk note above is read directly from git history, not decided
  here.
- Not a substitute for the roadmap's closure table, which remains the sole
  source of milestone *status*. This document is execution detail only.
