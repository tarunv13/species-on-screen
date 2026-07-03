# Session diary — M34: verdict + reason-code "reach-not-truth" badges (D6)

**Date:** 2026-07-04
**Milestone:** M34 (Observatory v2, second roadmap milestone — Architecture Decision D6)
**Role:** Principal Engineer (autonomous milestone execution)
**Branch:** `feat/exploration-prototypes-and-data-pipelines`

---

## Task

Implement **only M34**, satisfy every acceptance criterion, verify, regenerate outputs, run
repository verification, update `PROJECT_STATUS.md` / this diary / `OBSERVATORY_V2_IMPLEMENTATION.md`,
and land exactly one clean commit. Do not touch any other milestone.

## D6, precisely

D6: the badge **names reach, not truth** — three states, no pass/fail — and the validator's
**verdict + reason codes are shown verbatim**. M34 builds directly on the M33 (D7) three-state
surface.

**Starting point (M33):** the badge text was `TRACEABLE` / `UNRESOLVED` / `GAP: <codes>`. Two D6
problems: (1) reason codes only appeared for the `gap` state, smuggled *into* the badge; (2) the
labels leaned on defect framing (`GAP`) rather than naming reach.

## Implementation

**`scripts/evidence-reach.mjs`**
- Reformed `REACH_META` badge labels to name reach: **`REACHES EVIDENCE`** (traceable),
  **`REACHES A SOURCE`** (open — the D7 first-class non-resolution state), **`REACH INCOMPLETE`**
  (gap). None uses pass/fail, "error", or check/cross language.
- Added `reasonCodesVerbatim(codes)` — returns the codes as-is (filters non-strings / empties),
  never renaming or paraphrasing. This is the single guarantee that codes are surfaced verbatim.

**`scripts/build-evidence.mjs`**
- The badge is now **uniform for every state** (`REACH_META[r.reach].badge`) — no `GAP:`-in-badge
  special case.
- New per-claim **verbatim reason-code line** (`.codes`): the validator's codes rendered as
  monospace `<code>` chips, escaped, straight from `r.reachCodes`.
- `main()` attaches `r.reachCodes = l2[i].reasons` — the L2 reason set (the fullest verbatim
  signal; L2 ⊇ L1 codes), taken directly from the validator's `--json` output.
- The `open` state keeps its calm D7 note (non-resolution as a first-class terminal state) — M33
  is not regressed.
- The index now names **all three** reach-states (traceable / open / reach-incomplete), closing
  the M33-review residual where the index could not express `gap`.

**`scripts/evidence-reach.test.mjs`** — extended with D6 assertions: three distinct reach-naming
badges; a forbidden-term guard (no `pass`/`fail`/`error`/`valid`/`check`/`cross`/✓/✗ … in any
badge); each badge names reach (`/reach/i`); and `reasonCodesVerbatim` pass-through (order
preserved, non-strings dropped, undefined safe). 19 checks total (was 11).

## Design decision — the verdict string is not reprinted

D6 (frozen memory phrasing) says "verdict + reason-codes verbatim." Reprinting the raw verdict
string (`NON_CONFORMANT`) would reintroduce the exact pass/fail language D6 also forbids ("badges
name reach not truth … no pass/fail"). The ledger's own M34 acceptance criteria require **reason
codes** verbatim (not the verdict string). Resolution: the **reach badge** carries the state
(named as reach), the **verbatim reason codes** carry the exact machine signal, and the raw
verdict word is omitted. This satisfies the verbatim requirement without the pass/fail framing.

## Validation

- `npm run test:evidence-reach` — PASS (19 checks; D7 classifier + D6 badges/verbatim codes).
- `npm run verify` — 9 checks green.
- `npm run build` — green (`prebuild` → `build:evidence`; L1 stays the gate).
- Regenerated `public/evidence/*.html`. Built `dist/evidence/epr-vents.html`: 10 `REACHES A SOURCE`
  badges, 10 verbatim `<code>SOURCE_UNRESOLVABLE</code>` lines, the D7 open note intact; index
  names all three states.
- **Cinematic purity:** no reach/badge logic (`REACHES`, `reasonCodesVerbatim`, `classifyReach`,
  `SOURCE_UNRESOLVABLE`) in any `dist/assets/places-*.js`.

## Invariants preserved

L1 remains the build gate (`prebuild` unchanged). Evidence HTML stays derived / git-ignored.
Standards reuse only — no new reason code, no schema change, no touched archive. Cinematic surfaces
untouched. Only M34's surface (the evidential badges + codes) changed; M33's D7 behaviour intact.

## Outcome

Every interaction claim on the evidential surface now shows a badge that names how far its warrant
**reaches** — never whether the claim is true — beside the validator's reason codes verbatim. The
three-state reach grammar (D6 + D7) is complete on the evidential depth.

**Stopping here per protocol** — one milestone; M35 (D5, in-place interrogate from inline validator
JSON) is next, not started.
