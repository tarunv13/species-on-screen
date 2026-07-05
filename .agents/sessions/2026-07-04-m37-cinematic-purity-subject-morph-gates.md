# Session diary — M37: cinematic-purity + subject-morph build gates (D3, D9)

**Date:** 2026-07-04
**Milestone:** M37 (Observatory v2, roadmap milestone — Architecture Decisions D3 + D9)
**Role:** Principal Engineer (autonomous milestone execution)
**Branch:** `feat/exploration-prototypes-and-data-pipelines`

---

## Task

Implement **only M37**, satisfy every acceptance criterion, verify, regenerate outputs, run
repository verification, update the three docs, and land exactly one clean commit. Do not touch any
other milestone.

## D3 + D9, precisely

- **D3** — the cinematic surface is an **affordance-sink / one-way bridge**: its runtime hosts **no**
  depth affordance (no press-in / step-back / interrogate, no cross-depth link or import, no
  cross-document view-transition).
- **D9** — the held **subject** morph (`view-transition-name: eke-subject`) is present on **every**
  depth-transition surface, and is the **only** view-transition-name used there.

Prior milestones (M28, M33–M36) checked cinematic purity by hand in review greps. M37 turns these
into an **enforced build gate**.

## Investigation first (so the gate passes on correct code)

- The only cross-depth tokens in cinematic JS are **comments**: `src/places/sundarbans.js`'s header
  block comment names `notes/…`. `src/main.js` reads caption hrefs from the DOM **generically** and
  holds no cross-depth string.
- `places/*.html` reference `notes/…` only inside `<!-- -->` wiring-documentation comments.
- `index.html` (the hub) has real caption anchors `href="notes/…"` — **intentional no-JS fallbacks**
  the runtime intercepts for the cinematic arrival (progressive enhancement).
- `eke-subject` is declared on exactly three subject surfaces: research article, atlas field-record,
  evidence-ledger CSS. `atlas.css` (the hub) has `@view-transition` but **no** subject — correct,
  it lists places and has no single held subject.

These facts set the gate's scope: check the cinematic **runtime** (JS + CSS + place shells, comments
stripped); exempt `index.html`'s documented no-JS fallbacks; require the morph only on the three
subject surfaces.

## Implementation

**`scripts/cinematic-grammar.mjs` (new, pure, dependency-free).** `stripJsComments` (block +
pure-line, preserving string URLs like `http://…`), `stripHtmlComments`, and four detectors:
`findCinematicJsAffordances` (cross-depth import / navigation string / evidential-analytical logic
identifier / interrogate), `findCinematicCssTransitions` (`@view-transition` / `eke-subject` in
cinematic CSS), `findHtmlCrossDepthLinks` (real `<a href>` into another depth, after comment strip),
`findMissingSubjectMorph` (missing opt-in / missing `eke-subject` / any foreign view-transition-name).

**`scripts/check-cinematic-grammar.js` (new, CLI).** Reads the real surfaces — 4 cinematic JS
(`src/main.js` + `src/places/*.js`), 4 cinematic CSS (`src/style.css` + `src/places/*.css`), 3 place
shells (`places/*.html`) — and the 3 depth-transition subject surfaces; prints violations; exit 1 if
any. `index.html` is exempt from the shell-link check by design.

**`scripts/check-cinematic-grammar.test.mjs` (new).** 19 negative + positive checks: comment
stripping ignores prose; each D3 failure mode (import, logic identifier, nav string, interrogate,
cinematic-CSS transition, real shell link) is caught; each clean shape passes; each D9 failure mode
(missing opt-in, missing morph, foreign name) is caught and the clean surface passes.

**`package.json`.** `check-cinematic-grammar` wired into **`prebuild`** (build invariant) and
**`verify`**; `test:cinematic-grammar` into `verify` (now 12 checks).

## Scope decision — source, not post-build bundle

The gate enforces D3 on the cinematic **source**, the authoritative input every bundle is built
from. This is deterministic, runs **before** the build as an invariant, and the vite build injects
no affordances — so bundle purity is inherited. Grepping the post-build bundle would only run after a
build (not at prebuild) and would be a weaker, later signal. Documented in the module + ledger.

## Verification

- `npm run test:cinematic-grammar` — PASS (19 checks).
- `node scripts/check-cinematic-grammar.js` on real code — PASS (D3 across 4 js + 4 css + 3 shells;
  D9 morph on 3 subject surfaces).
- **Live injection** (beyond fixtures): appended `.leak{view-transition-name:eke-subject}` to
  `src/places/epr-vents.css` → gate failed (exit 1, correct file + kind) → reverted, `git` clean.
- `npm run verify` — 12 checks green.
- `npm run build` — green; `prebuild` runs the gate as an invariant.

## Constraints honored

Only new files + `package.json` wiring — no cinematic/atlas/evidence source touched, so no other
milestone is affected. Dependency-free. The gate passes on the current (correct) code and fails on
real violations.

## Outcome

D3 (cinematic purity) and D9 (single-subject morph) are now **enforced invariants**, not hand-checked
conventions — a build cannot ship a cinematic depth affordance or a depth transition missing the held
subject.

**Stopping here per protocol** — one milestone. Next is M38 (D10, the composite grammar-rejection CI
gate that consolidates this and the other constraints).
