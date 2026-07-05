# Session diary — M38: composite grammar-rejection CI gate (D10)

**Date:** 2026-07-04
**Milestone:** M38 (Observatory v2, roadmap milestone — Architecture Decision D10)
**Role:** Principal Engineer (autonomous milestone execution)
**Branch:** `feat/exploration-prototypes-and-data-pipelines`

---

## Task

Implement **only M38**, satisfy every acceptance criterion, verify, run repository verification,
update the three docs, and land exactly one clean commit. Do not touch any other milestone.

## D10, precisely

D10: **a single CI gate enforcing the four grammar constraints.** M37 already enforced two of them —
affordance placement (D3) and subject morph (D9). M38 must (1) add the other two — subject invariant
(D1) and depth discreteness (D2), (2) present all four as **one composite gate** that composes M37's
logic rather than duplicating it, (3) wire it into CI + verify, (4) negative-test each constraint.

## Investigation first

- No production surface JS performs any `location`/`history` navigation at all → D2 passes.
- The only `view-transition-name` in production is `eke-subject`; a `something-else` occurs **only**
  in M37's test fixture → the D1 scan must target **production** stylesheets and exclude
  `scripts/*.test.mjs`.

## Implementation

**`scripts/grammar-constraints.mjs` (new).** The two constraints M37 lacked, reusing M37's helpers
(`stripJsComments`, `SUBJECT_MORPH` imported from `cinematic-grammar.mjs`):
- **D1 `findForeignSubjectNames`** — any `view-transition-name` ≠ `eke-subject` is a competing
  subject identity → violation. (M37/D9 checks the morph is *present* per surface; this checks it is
  the *same one everywhere* — the single held subject.)
- **D2 `findScrollDepthCrossing`** — flags a line that both navigates programmatically
  (`location.href`/`assign`/`replace`, `(window.)location =`, `history.push/replaceState`) **and**
  names a cross-depth path (`atlas/`|`notes/`|`evidence/`). Cross-depth movement must be a
  declarative `<a href>` (multi-document navigation); a programmatic jump could be scroll/timer
  driven and cross depth. `places/` (experiential) is excluded, so the same-depth cinematic arrival
  is not a crossing; an anchor element's `.href =` is not matched (only `location`/`history`).

**`scripts/check-grammar.js` (new) — the single composite gate.** A pure `evaluateGrammar(inputs)`
runs the four constraint groups, **importing** the M37 predicates + the two new ones (no
re-implementation), and returns `{ groups, ok }`. The CLI reads the real surfaces (cinematic JS/CSS/
shells; the three subject surfaces; every production stylesheet for D1; every surface runtime for D2)
and prints violations grouped by constraint, exit 1 if any. A robust `pathToFileURL` main-guard lets
the test import `evaluateGrammar` without running the CLI.

**`scripts/check-grammar.test.mjs` (new).** 9 checks: a clean world passes and reports exactly four
constraints; **each** of the four constraints is violated in turn and the composite rejects it (D3
import, D3 shell link, D9 missing morph, D1 foreign identity, D2 programmatic crossing); and two
must-NOT-flag cases — a declarative `anchor.href = 'evidence/…'` and a same-depth arrival to
`places/`.

**Wiring (the D10 consolidation).** `check-grammar` **replaces** the standalone M37 gate in
`prebuild` and `verify`, and runs as an explicit **"Grammar gate (D10)"** step in
`.github/workflows/verify.yml`. `test:grammar` added to `verify` (now 13). M37's `test:cinematic-grammar`
is retained.

## M37 left untouched

M37's three files (`cinematic-grammar.mjs`, `check-cinematic-grammar.js`, its test) are
**byte-identical** — confirmed via `git status`. The composite **reuses** M37's predicates and
**supersedes its standalone gate in the wiring**, which is exactly what D10 (a single gate) asks for.
M37's behaviour/enforcement is fully preserved (now run through the composite) and its unit test
still runs.

## Verification

- `npm run test:grammar` — PASS (9 checks; each constraint rejected, clean + edge cases pass).
- `node scripts/check-grammar.js` on real code — PASS (all four constraints hold).
- **Live injection** (beyond fixtures): appended `.hero{view-transition-name:rogue-subject}` to
  `src/atlas/atlas.css` → composite failed under **subject invariant (D1)** (exit 1, correct
  constraint + file) → reverted, `git` clean.
- `npm run verify` — 13 checks green.
- `npm run build` — green; `prebuild` runs the composite gate as an invariant.

## Outcome

The four Interaction-Grammar constraints are now enforced by **one composite gate**, run in
`prebuild`, `verify`, and an explicit CI step — a single place a grammar violation is rejected before
merge.

**Stopping here per protocol** — one milestone. Next is M39 (D1, subject URL-addressability across
surfaces — high blast radius, spans sessions), then M40.
