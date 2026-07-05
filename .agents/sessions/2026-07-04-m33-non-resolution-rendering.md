# Session diary — M33: non-resolution rendering (D7)

**Date:** 2026-07-04
**Milestone:** M33 (Observatory v2, first roadmap milestone — Architecture Decision D7)
**Role:** Principal Engineer (autonomous milestone execution)
**Branch:** `feat/exploration-prototypes-and-data-pipelines`

---

## Task selection

Per the session protocol: repository is canonical; the Interaction Grammar, Architecture
Decisions, Capability/Workflow Architecture, and the Observatory v2 roadmap (M33–M40) are
frozen; implement one milestone, preserve invariants, verify, update status/diary/ledger,
commit, stop.

M32 was the last completed milestone. The next roadmap milestone is **M33 = non-resolution
rendering (D7)**.

**Precondition found:** `OBSERVATORY_V2_IMPLEMENTATION.md` did not exist — the frozen cascade
lived only in a prior design conversation (and in agent memory). "Repository is canonical"
requires it to be in-repo before it can be a frozen constraint anyone can implement against, and
the protocol tells me to *read* it and *update the implementation ledger* each milestone. So this
session (a) transcribed the frozen cascade into the repo verbatim as the canonical roadmap +
ledger, then (b) implemented M33. Part (a) is transcription, not redesign.

**Repository state verified first:** `npm run verify` (8/8) and `npm run build` both green before
starting, matching `PROJECT_STATUS.md`.

## D7, precisely

Interaction Grammar terminal semantics: *traceability, not truth* — understanding is the **reach
of a warrant, including honest non-resolution**. D7: **non-resolution is a first-class terminal
state.**

The evidence ledger (the evidential depth, `scripts/build-evidence.mjs`) rendered every binding
as one of two states: `TRACEABLE` (green) or a red `GAP: <codes>`. Two problems:

1. It reads as **pass/fail** — the exact framing the grammar forbids ("no pass/fail").
2. It **over-claims**. `build-evidence` runs the validator at L1, where all 38 real bindings are
   conformant, so the ledger showed "38/38 traceable, all green" — while hiding that **not one
   binding source resolves to a persistent identifier**. Confirmed empirically: at L2 all 38 are
   `SOURCE_UNRESOLVABLE` (the `relationshipAccordingTo` fields are still bare citation strings —
   "Gani (2003)", "Khan (2012)", … — the untouched L2 curator work). Non-resolution was invisible.

This is the honest, real embodiment of D7: every claim reaches a *named* published source (the
warrant reaches), but the warrant honestly stops at a citation with no machine-resolvable
identifier — an **open** terminal state, neither a success to hide nor a failure to flag red.

## Implementation

**New `scripts/evidence-reach.mjs`** — a pure classifier deriving three reach-states **from the
validator's own verdicts** (never re-derived, so the surface cannot drift from
`check-bindings.js`):

- `traceable` — baseline-conformant AND source resolves to a persistent id.
- `open` — baseline-conformant but source is `SOURCE_UNRESOLVABLE` at L2. **First-class terminal
  state.** Rendered calmly (slate `--slate:#4a5573`, not warn-red), with a per-claim italic
  `.reach` note framing it as an open question, not a defect, not a gap.
- `gap` — baseline-nonconformant (e.g. `SOURCE_MISSING` — no source at all). Still names the
  specific unmet codes; a genuine baseline deficiency, kept distinct from honest non-resolution.

`classifyReach(baselineVerdict, l2Reasons)` is a two-input pure function; `REACH_META` holds the
shared presentation vocabulary (one definition, no drift). The minimal D7 badge language only —
the full "reach-not-truth" badge reform across all verdict+reason codes is **M34 (D6)**, deliberately
not done here.

**`scripts/build-evidence.mjs`** — now runs the validator twice: L1 (`--json`, authoritative
verdict) and L2 (`--json --level=L2`, the `SOURCE_UNRESOLVABLE` signal). Both runs iterate the same
archives/rows in the same order, so the record arrays align positionally (the honest join key —
relationship ids are not guaranteed unique); a length-mismatch guard fails loudly. Each record
gets `reach = classifyReach(...)`. Per-claim badge, the `.reach` note for open claims, the page
sub-headline, the index list, and the top framing note are all rewritten as honest three-state
summaries. A new `runValidator(level)` helper tolerates the validator's expected non-zero exit at
L2 (it still writes JSON to stdout).

**`scripts/evidence-reach.test.mjs`** (`npm run test:evidence-reach`, wired into `verify`) — black-box
tests all three states incl. the discriminating cases (conformant+SOURCE_UNRESOLVABLE → open;
conformant alone → traceable; any nonconformant → gap; SOURCE_UNRESOLVABLE on a nonconformant row
still → gap; undefined reasons never throw), plus metadata completeness/distinctness. 11 assertions.

**`OBSERVATORY_V2_IMPLEMENTATION.md`** (new) — the frozen cascade transcribed: grammar, D1–D10,
the M33–M40 roadmap table (with a status column = the ledger), and an M33 detail entry.

## Validation

- `npm run test:evidence-reach` — PASS (11 classifications, all three states).
- `npm run verify` — 9 checks, all green.
- `npm run build` — green (`prebuild` → `build:evidence` uses the new classifier; L1 stays the gate).
- Built output confirmed: `dist/evidence/epr-vents.html` ships 10 `badge open">UNRESOLVED`, 10
  per-claim `.reach` notes + the header note; `dist/evidence/index.html` carries the "open question"
  framing. Every real claim renders **open** — the honest mirror of the DOI-unconfirmed backlog.

## Invariants preserved

L1 remains the build gate (`prebuild` unchanged — non-resolution is a rendering distinction, not a
new gate). Evidence HTML stays derived / git-ignored. Standards reuse only — no new reason code, no
schema change, no touched archive. "Traceability, not truth" framing intact and strengthened.
Cinematic surfaces untouched. M34 (D6 badges) and the L2 curator DOI work are deliberately out of
scope.

## Outcome

The evidential surface now tells the truth about its own reach: non-resolution is a first-class
terminal state, rendered calmly as an open question rather than concealed behind a wall of green or
flagged as failure. The v2 roadmap is now canonical in-repo.

**Stopping here per protocol** — one milestone; M34 (D6, reach-not-truth badges) is next, not started.
