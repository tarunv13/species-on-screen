# Session diary — follow deep-link restore (D4/D8 completion)

**Date:** 2026-07-05
**Scope:** Fix a genuine repository/roadmap gap surfaced by M36 browser QA — not a new milestone.
**Role:** Principal Engineer (autonomous milestone verification)
**Branch:** `feat/exploration-prototypes-and-data-pipelines`

---

## Task

The prior session in this run (`.agents/sessions/2026-07-05-m36-browser-qa.md`) browser-verified
M36's *follow* primitive (D4) and, in doing so, found that the repository does **not** fully satisfy
a written acceptance claim: M40/D8 states press-in/step-back/follow/interrogate are each
**"retraceable"** and that **"a copied URL restores subject + depth + interrogation"** — the follow
primitive specifically being **"restorable via native `:target` scroll."** In-browser testing showed
a **cold** deep-link `atlas/epr-vents.html#fr-node-<id>` does not restore: `location.hash` is correct
and the target node exists, but `:target` matches nothing and the page is not scrolled, because the
atlas field record builds its follow web (the Sources panel) **asynchronously** after a DwC-A fetch
— the node does not exist yet at the moment the browser resolves the load-time fragment, and no
subsequent navigation/`hashchange` fires to make it re-resolve.

Per the goal's protocol — verify against the repository, not only the roadmap; implement only the
missing acceptance criteria; reuse existing code; smallest reviewable commit — this is implemented
here as a direct, minimal fix, following exactly the pattern M40 already established for `#claim-N`
on the evidence ledger (a pure fragment↔dom-id mapping + an on-load restore call).

## Implementation

**`src/atlas/follow-url.js` (new, pure, dependency-free).** `followDomId(occurrenceId)` builds the
`fr-node-<id>` DOM id (mirrors the field-record template exactly); `followDomIdFromHash(hash)`
returns the DOM id a fragment addresses, or `null` for anything else (empty, `#claim-N`, an
unrelated fragment) — percent-decoded to match `getElementById`. Same "one pure mapping drives both
the build-time id and the runtime restore" shape as `scripts/interrogation-url.mjs`.

**`src/atlas/field-record.js`.** The follow click handler's ad hoc `decodeURIComponent(...replace)`
is replaced by `followDomIdFromHash` (no behavior change — same inputs, same outputs — just the one
shared definition). The reveal itself (`classList` pulse-restart + `focus`) is extracted into
`revealFollowNode(node, doScroll)`, reused by both the click path (`doScroll:false`, since the native
anchor already scrolled) and a new on-load call: after `buildSources()` populates the follow web,
if `location.hash` addresses a follow node, `revealFollowNode(node, true)` scrolls it into view and
applies the same highlight + a11y focus a click gives.

**`scripts/follow-url.test.mjs` (new).** 15 black-box checks: DOM-id construction (including a
colon-bearing occurrence id and a null-degrades case); round-trip for three real-shaped ids;
percent-decoding; and every non-follow fragment (`#claim-N`, empty, no fragment, null, prefix-only,
unrelated) returns `null`. Wired into `verify` as `test:follow-url` (now 12 unit tests).

## Verification

- `npm run test:follow-url` — PASS (15 checks).
- `npm run verify` — GREEN (5 gates + 12 unit tests).
- `npm run build` — GREEN.
- **Browser-verified against `dist/`** (`vite preview`, EPR field record):
  - Cold load of `#fr-node-EPR-VENTS:OCC:5` — node exists, `is-followed` applied, `fr-follow-pulse`
    running, node scrolled into view (`rect.top ≈ 24px`, `scrollY` moved from the unscrolled
    ~9361px position to ~8431px), a11y focus moved to the node.
  - Warm follow (click) — unregressed: hash set, history grows by exactly one, `:target` matches,
    pulse running, focus moved.

## Frozen architecture preserved

No manifest, schema, or validator change; no new vocabulary or reason code. No cinematic file
touched (the fix is confined to `src/atlas/`); the grammar gate (D10) stays green — the restore is
`getElementById`/`scrollIntoView`, not a programmatic cross-depth navigation. M40's `#claim-N`
mapping and M36's follow-click behavior are untouched. Standards reuse only; reused the existing
`.is-followed`/`fr-follow-pulse` CSS and the existing click-reveal logic (only extracted, not
rewritten).

## Outcome

The D8 restorability claim for the *follow* primitive now holds on the async field record, closing
the one genuine repository/roadmap gap this run's audit surfaced. `OBSERVATORY_V2_IMPLEMENTATION.md`
and `PROJECT_STATUS.md` updated to record the fix. Stopping — this was the smallest reviewable unit;
no further milestone work follows in this run.
