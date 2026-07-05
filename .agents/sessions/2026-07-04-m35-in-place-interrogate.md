# Session diary — M35: in-place interrogate from inline validator JSON (D5)

**Date:** 2026-07-04
**Milestone:** M35 (Observatory v2, roadmap milestone — Architecture Decision D5)
**Role:** Principal Engineer (autonomous milestone execution)
**Branch:** `feat/exploration-prototypes-and-data-pipelines`

---

## Task

Implement **only M35**, satisfy every acceptance criterion, verify, regenerate outputs, run
repository verification, update the three docs, and — if M34 and M35 both pass — land exactly one
clean commit. Do not touch any other milestone.

## D5, precisely

D5: **interrogate = a depth-local reveal from `check-bindings --json`, never re-derived.** The
evidential surface (the evidence ledger, `scripts/build-evidence.mjs`) is its home — it already
renders the validator's output, so interrogation deepens that disclosure in place.

## Implementation

**`scripts/evidence-interrogate.mjs` (new, pure, dependency-free).** `interrogationChain(record)`
takes one `check-bindings --json` record (with build-evidence's L2 `reachCodes`) and returns the
claim's full evidence chain — `verdict`, `reasons` (reachCodes preferred, else L1 `reasons`),
`source`, `relation`, and each occurrence's `{ occurrenceID, name, backbone, asOf, pinned }`. It
only **selects and shapes** — it never recomputes an evidentiary judgement. Same "pure model +
render in the caller + Node test" pattern as `evidence-reach.mjs` and `interaction-web.js`.

**`scripts/build-evidence.mjs`.** Each claim now renders a native **`<details class="interrogate">`**
reveal built from that chain: verbatim validator verdict, reason codes, source, and both
occurrences' full backbone / as-of / pinned status. `<details>`/`<summary>` toggles **in place** —
no `href`, no navigation, no depth change — and needs **zero JS**, so the disclosure is entirely
static HTML inlined at build time. The occurrence detail that used to sit in the always-visible
`<ul class="ev">` moved **into** the reveal (interrogate = depth on demand); the always-visible
claim keeps the D6 reach badge, the D7 open note, the source line, and the verbatim reason-code
chips — so M33/M34 are not regressed.

**`scripts/evidence-interrogate.test.mjs` (new).** 21 black-box checks: verbatim verdict / source /
relation; reason codes taken from `reachCodes` verbatim, falling back to L1 `reasons`; each
occurrence field echoed field-for-field; a `null` `asOf` preserved (not fabricated); non-string
reason codes dropped; empty/undefined record never throws and yields empty (not fabricated) values.
Wired into `verify` as `test:evidence-interrogate` (now 11 checks).

## Design note — the verbatim verdict finds its home

The M34 Independent Release Review flagged that the literal verbatim verdict string
(`CONFORMANT` / `NON_CONFORMANT`) appeared nowhere, because printing it in the badge would violate
D6's "no pass/fail". M35's interrogation reveal is exactly the right place for it: the **badge**
names reach (D6), and **interrogating** discloses the **raw validator record** — including the
verbatim verdict — as the deep audit trail (D5, "from `check-bindings --json`"). So the finding is
closed without any pass/fail language leaking into the badge layer.

## One implementation snag

The first pass wrote the disclosure-triangle CSS as `content:"\25B8"` inside the JS template
literal for `CSS`; Node rejects `\2…` as an octal escape in template strings. Fixed by using the
literal glyphs `▸` / `▾`. Caught immediately by running `build:evidence`.

## Verification

- `npm run test:evidence-interrogate` — PASS (21 checks).
- `npm run verify` — 11 checks green.
- `npm run build` — green.
- **Headless real-data cross-check:** parsed `check-bindings.js --json` (+ L2), then for every
  ledger asserted the `<details>` count equals the record count and that **all 190 inlined
  validator fields** (occurrenceIDs, verdicts, as-of dates, reason codes) appear verbatim in the
  built HTML. All matched — the reveal cannot drift from the validator.
- Built `dist/evidence/epr-vents.html` ships 10 interrogate reveals; M34 reach badges
  (`REACHES A SOURCE`) + verbatim `SOURCE_UNRESOLVABLE` chips intact.
- **D3 / cinematic purity:** `interrogate` appears in **no** `dist/assets/places-*.js` — nor in the
  atlas or research bundles; it is depth-local to the evidential ledger HTML.

## Frozen architecture preserved

No manifest, schema, or validator change. L1 stays the build gate (`prebuild` unchanged). Standards
reuse only. Only the evidential surface changed; M33 (D7) and M34 (D6) behaviour intact.

## Outcome

Every interaction claim in the evidence ledger can now be **interrogated in place** — one click
reveals its full, verbatim evidence chain, inlined from the validator, with nothing recomputed in
the browser. With M33 (D7), M34 (D6) and M35 (D5) done, the **evidential-depth roadmap is complete**;
M36 (D4) landed in parallel.

**Stopping here per protocol** — one milestone. Next is M37 (D3/D9 build gates).
