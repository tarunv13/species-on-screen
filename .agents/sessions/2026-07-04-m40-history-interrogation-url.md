# Session diary — M40: history-as-trace + interrogation state in URL (D8)

**Date:** 2026-07-04
**Milestone:** M40 (Observatory v2, **final** roadmap milestone — Architecture Decision D8)
**Role:** Principal Engineer (autonomous milestone execution)
**Branch:** `feat/exploration-prototypes-and-data-pipelines`

---

## Task

Implement **only M40**, satisfy every acceptance criterion, verify, regenerate outputs, run
repository verification, update the three docs, land one clean commit. Do not touch any other
milestone. M40 is the last milestone — it completes the M33–M40 roadmap.

## D8, precisely

D8: **history = the primitive string**, and **interrogation state in the URL fragment**. The four
primitives are press-in, step-back, follow, interrogate. Three of them already produce a URL change
(and therefore a history entry): press-in/step-back are cross-depth `<a href>` document navigations
(carrying `?subject=` per M39); **follow** is M36's `#fr-node-<id>` hash (restorable via native
`:target` scroll). Only **interrogate** (M35's `<details>` reveal) was ephemeral DOM state, outside
the URL — which the M35 review had explicitly flagged and deferred to D8/M40. So M40's active work
is putting interrogation in the fragment; the others need no change.

## Implementation

**`scripts/interrogation-url.mjs` (new, pure, dependency-free).** The one fragment↔claim definition:
`CLAIM_PREFIX = 'claim-'`, `claimDomId(index)` (1-based, stable, collision-free — avoids relying on a
possibly-absent/duplicated resourceRelationshipID), `domIdFromHash(hash)` (returns the claim id only
for a `claim-<digits>` fragment, so a non-interrogation fragment — M36's `#fr-node-…` or a subject
query — is ignored). Used to stamp the DOM ids at build time and (inlined) drive the ledger script,
so there is one source of truth for the prefix.

**`scripts/build-evidence.mjs`.** Each interrogation `<details>` gets `id="claim-N"`. A small
self-contained progressive-enhancement `<script>` (the `CLAIM_PREFIX` interpolated in) is emitted at
the end of the ledger body: on load and on `hashchange` it opens the `<details>` addressed by the
fragment and closes the others (single-focus) and scrolls it into view; opening a `<details>` sets
`location.hash` to its id (a history entry, so opening an interrogation is retraceable and back
closes it); manually closing the addressed one drops the fragment via `history.replaceState`.
`.interrogate{scroll-margin-top}` for a clean anchored scroll.

**`scripts/interrogation-url.test.mjs` (new).** 15 checks: DOM id, round-trip, and that
non-interrogation fragments (`#fr-node-EPR:OCC:1`, `#`, empty, null, `#claim-abc`, `#claim-`,
`#claim-3x`) are ignored. Wired into `verify` as `test:interrogation-url`.

## Why the other primitives were left untouched

"History as the primitive string" already holds for press-in/step-back (document navigations) and
follow (M36's hash). Changing M36 or the cross-depth links would be touching other milestones and is
unnecessary — each already produces a history entry and restores from a deep link. M40 only adds the
interrogate fragment. This keeps M36/M35 intact and the change surgical.

## M35 preserved

M35's guarantee was that the evidence **content** is static/inlined and nothing is recomputed in the
browser. The M40 script only toggles `<details>` open/closed and syncs the URL — it never touches the
evidence chain — and without JS the `<details>` still work manually (progressive enhancement). So
M35 is not regressed; the URL-state layer is exactly the D8 work the M35 review deferred here.

## Verification

- `npm run test:interrogation-url` — PASS (15 checks).
- `npm run verify` — 15 checks green, **including the M38 grammar gate** (the inline script uses
  `location.hash` / `history.replaceState` with no cross-depth string — not a programmatic
  cross-depth navigation, so D2 holds; cinematic untouched, so D3 holds).
- `npm run build` — green. The built ledger stamps 10 `id="claim-N"` and ships the restore script;
  the **extracted inline script passes `node --check`** (valid JS; the escaped `^claim-\d+$` regex
  renders correctly); the index page (no claims) carries no script.
- **Restorable model verified:** `withSubject('…evidence/epr-vents.html#claim-3', 'east-pacific-rise')`
  → `…?subject=east-pacific-rise#claim-3` — subject (query) + interrogation (fragment) coexist; a
  copied URL restores subject + depth (page) + interrogation (fragment opens the claim).
- **M35 intact:** all verdicts/occurrences still present in the built ledger.

## Outcome

Interrogation is now URL-addressable in the fragment, and the four primitives each produce a history
entry, so the browser history reads as the reasoning path and a copied URL restores subject + depth +
interrogation. **The Observatory v2 roadmap M33–M40 is complete** — the Interaction Grammar is
realized and enforced across the evidential, analytical, and experiential surfaces.

**Stopping here per protocol** — one milestone; the roadmap is finished.
