# Observatory v2 — Implementation Roadmap & Ledger

**Status:** Frozen design cascade (2026-07-04), transcribed into the repository as the
canonical reference. This document does **not** redesign anything — it records decisions
already frozen upstream so the repository (not a conversation) is their source of truth.
It sits atop the Embodiment Phase (the Ecological Knowledge Environment, M28+).

Do not relitigate the grammar, the decisions, or the roadmap. Implement one milestone at a
time, preserve the invariants, verify, update this ledger, and stop.

---

## 1. Interaction Grammar (frozen)

- **One invariant** — the held **subject**, carried across every transition via the
  `eke-subject` view-transition morph.
- **One axis** — **epistemic depth**: experiential (cinematic) → analytical (atlas) →
  evidential (research / evidence ledger).
- **Four primitives** — **press-in**, **step-back**, **follow**, **interrogate**.
- **Terminal semantics** — *traceability, not truth*. Understanding = the **reach of a
  warrant**, including **honest non-resolution**.
- **Reasoning-state lattice** — encounter → recognition → relation → claim → warrant →
  verdict → understanding.

## 2. Architecture Decisions D1–D10 (frozen)

- **D1** — subject = URL-addressable manifest id (`?subject=`).
- **D2** — depth is a discrete addressable coordinate; multi-document; scroll never crosses depth.
- **D3** — press-in / step-back are hosted *below* only; the cinematic surface hosts no depth
  affordance (it is an affordance-sink; the one-way-bridge doctrine).
- **D4** — follow = an RO-typed lateral edge at the same depth.
- **D5** — interrogate = a depth-local reveal from `check-bindings --json`, never re-derived.
- **D6** — verdict + reason codes shown verbatim; badges name **reach, not truth** (three
  states); no pass/fail.
- **D7** — **non-resolution is a first-class terminal state.**
- **D8** — history = the primitive string; interrogation state lives in the URL fragment.
- **D9** — the subject morph is mandatory on every depth transition.
- **D10** — a single CI gate enforces the four grammar constraints.

## 3. Roadmap M33–M40 & Ledger

Each milestone implements one D-decision. Repo numbering continues after M32.

Execution order: M33 → M34 → M35, M36 (parallel), M37 → M38, then M39 → M40 last.

| # | Decision | Scope | Landability | Status |
|---|---|---|---|---|
| **M33** | D7 | Non-resolution rendering — the evidential surface renders reach in three states, non-resolution first-class | session, low/med, user-visible | **✅ done (2026-07-04)** |
| M34 | D6 | Verdict + reason-code "reach-not-truth" badges (verbatim codes, three states) | session, low/med, user-visible | pending |
| M35 | D5 | In-place interrogate from inline validator JSON | after M34 | pending |
| M36 | D4 | Typed-edge follow in the atlas | session (parallel) | pending |
| M37 | D3, D9 | Cinematic-purity + subject-morph build gates | session | pending |
| M38 | D10 | Composite grammar-rejection CI gate | after M37 | pending |
| M39 | D1 | Subject URL-addressability across surfaces (high blast radius) | spans sessions | pending |
| M40 | D8 | History-as-trace + interrogation state in URL | spans sessions, last | pending |

**Primary generators touched by the roadmap:** `scripts/build-evidence.mjs` (evidential
surface), `scripts/check-bindings.js` (validator), `src/atlas/{atlas,field-record}.js`,
`src/notes/{render-narrative,surface-links}.js`, `src/main.js`, the manifest resolvers, plus
new `scripts/check-*.js` gates and `package.json` verify/prebuild wiring.

**Out of roadmap (human/browser-gated, not autonomous):** curated-archive L2/L3 rigor and the
Bates et al. (2005) citation (Research Curator); final transition easing (needs a browser); the
evidence-code field (awaits TDWG placement).

---

## 4. Implementation ledger — detail

### M33 — Non-resolution rendering (D7) · 2026-07-04

The evidence ledger (`scripts/build-evidence.mjs`) previously collapsed every binding into two
states — `TRACEABLE` (green) or a red `GAP` — which read as pass/fail and over-claimed: at
baseline (L1) all 38 real bindings are conformant, so the ledger showed "38/38 traceable, all
green" while hiding that **not one source resolves to a persistent identifier** (all 38 are
`SOURCE_UNRESOLVABLE` at L2).

M33 makes non-resolution a **first-class terminal state**. A new pure, unit-tested classifier
(`scripts/evidence-reach.mjs`, `classifyReach`) derives three reach-states **from the
validator's own output** (no re-derivation, so the page cannot drift from the verdicts):

- **traceable** — baseline-conformant *and* the source resolves to a persistent identifier.
- **open** — baseline-conformant but the source is a citation with no resolvable identifier
  (the validator's L2 `SOURCE_UNRESOLVABLE`). Rendered calmly (slate, not warn-red) with an
  italic per-claim note framing it as an open question — **not** a failure, **not** a "gap".
- **gap** — baseline-nonconformant (e.g. `SOURCE_MISSING`): baseline traceability itself is
  incomplete. Still names the specific unmet codes.

`build-evidence.mjs` now runs the validator at L1 (authoritative verdict) and L2 (the
`SOURCE_UNRESOLVABLE` signal), aligns the two record arrays positionally, and classifies each
claim. Headlines and the index are honest three-state summaries. On the real corpus every
claim currently renders **open** — a truthful mirror of the DOI-unconfirmed backlog rather than
a false wall of green.

- **Invariants preserved:** L1 remains the build gate (`prebuild` unchanged); evidence HTML
  stays derived / git-ignored; the ledger still certifies *traceability, not truth*; standards
  reuse only (no new reason code, no schema change); cinematic surfaces untouched.
- **Verification:** `npm run test:evidence-reach` (new, wired into `verify` — now 9 checks);
  `npm run verify` and `npm run build` green; `dist/evidence/*.html` ship the three-state
  rendering (10 per-claim reach notes + header note confirmed in the built EPR ledger).
- **Files:** new `scripts/evidence-reach.mjs`, `scripts/evidence-reach.test.mjs`; modified
  `scripts/build-evidence.mjs`, `package.json`.
