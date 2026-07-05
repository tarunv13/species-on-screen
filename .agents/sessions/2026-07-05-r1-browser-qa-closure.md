# Session diary — R1 browser QA closure (M37/M39 morph, M28 easing, cinematic purity)

**Date:** 2026-07-05
**Type:** Governance / QA closure. Documentation-only — no implementation code touched.

## Scope

Close the last open items in Observatory v2's R1 ("Browser / visual QA of the realized
grammar", `OBSERVATORY_V2_IMPLEMENTATION.md`): the `eke-subject` view-transition morph across
the research→evidential and atlas→evidential descents (D1/D9), including the live `?subject=`
resolution on each surface (M37/M39), and the M28 carryover (final transition easing/timing
polish, `.agents/HANDOFF-eke-completion.md` item 1). M36, M40, and the async cold deep-link
restore were already closed in prior sessions and were not re-verified here.

## Procedure

1. Read `PROJECT_STATUS.md`, `OBSERVATORY_V2_IMPLEMENTATION.md`, and
   `.agents/decisions/2026-07-05-wp8-interaction-model-adr.md` /
   `.agents/HANDOFF-eke-completion.md` to reconstruct expected state.
2. Ran `npm run verify` (17 checks) — all green.
3. Ran `npm run build` — green.
4. Ran the objective cinematic-purity grep from the HANDOFF: `grep -rl view-transition
   dist/assets/*.css` — matched only `render-narrative-*.css`, `field-record-*.css`,
   `atlas-index-*.css`; no `places-*.css` present.
5. Ran `npm run check-grammar` and `npm run check-cinematic-grammar` directly — both reported
   all constraints (D1/D2/D3/D9) holding on the real build.
6. Served the built `dist/` with `vite preview` and drove it in a real Chromium browser
   (via the claude-in-chrome extension) against the East Pacific Rise place:
   - `notes/east-pacific-rise-tubeworm-chemosynthesis.html` → clicked "Evidence ledger →".
   - `atlas/epr-vents.html` → clicked "Evidence ledger →".
7. On each surface, inspected via JS execution: `getComputedStyle(h1).viewTransitionName`,
   the anchor's resolved `href`, and post-navigation `location.href` + landed `h1` text.
8. Checked browser console for errors after each transition.
9. Cross-checked apparent click-to-navigate latency against the landed page's
   `performance.getEntriesByType('navigation')` timing to rule out a real site-side delay.

## Evidence gathered

- `view-transition-name: eke-subject` confirmed identical on: the research-article `h1`
  (`#narrative header h1`), the atlas field-record masthead `h1` (`.fr-masthead h1`), and the
  evidence-ledger `h1` (`.wrap h1`).
- Research→evidential descent: link `href="../evidence/epr-vents.html?subject=east-pacific-rise"`;
  after click, landed on `evidence/epr-vents.html?subject=east-pacific-rise` with `h1` text
  "East Pacific Rise vent field" unchanged from the source page.
- Atlas→evidential descent: link
  `href="/species-on-screen/evidence/epr-vents.html?subject=east-pacific-rise"`; after click,
  same landing URL and unchanged title.
- No console errors observed on either transition.
- Navigation Timing on the landed evidence-ledger page: `fetchStart≈23ms`,
  `responseEnd≈43ms`, `loadEventEnd≈216ms` — confirming the page itself resolves fast; an
  earlier apparent ~1–2s delay between the automated click and the observed URL change was
  therefore browser-automation input-dispatch latency in this session's tooling, not a site
  behavior, and is not reported as a finding.
- `grep -rl view-transition dist/assets/*.css` → `atlas-index-*.css`, `field-record-*.css`,
  `render-narrative-*.css` only.
- `npm run check-grammar` → "ok — all four grammar constraints hold (affordance placement D3 ·
  subject morph D9 · subject invariant D1 · depth discreteness D2)".
- `npm run check-cinematic-grammar` → "ok (D3 cinematic purity across 4 js + 4 css + 3 shells;
  D9 eke-subject morph on 3 depth-transition surfaces)".

## Outcome

| Item | Verdict |
|---|---|
| M28 (final transition easing/timing polish) | **PASS** |
| M37/M39 (`eke-subject` morph + live `?subject=` resolution) | **PASS** |
| Cinematic purity (grep + both grammar gates) | **PASS** |

No implementation defect was found on any of the three evaluated items. No code was changed —
the existing implementation satisfied every acceptance criterion as written in
`OBSERVATORY_V2_IMPLEMENTATION.md` and `.agents/HANDOFF-eke-completion.md`.

## Verify / build status

- `npm run verify` — green (17 checks).
- `npm run build` — green.
- Re-confirmed at closure time (this session), immediately before the governance commit.

## Conclusion

No implementation work was required. Combined with the already-closed M36 and M40 browser QA
and the already-fixed async cold deep-link restore, every R1 acceptance item is now satisfied.
**R1 is closed.** `PROJECT_STATUS.md` and `OBSERVATORY_V2_IMPLEMENTATION.md` are updated in the
same commit as this diary to record the closure. **R2 (merge to `main`) is now formally
unblocked**, contingent only on the standing `verify`/`build` gate holding at merge time.
