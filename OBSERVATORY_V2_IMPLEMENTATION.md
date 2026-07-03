# Observatory v2 — Implementation Ledger

**Status:** Canonical implementation ledger for the frozen Observatory v2 roadmap
(M33–M40). This document records decisions frozen upstream (the design cascade of
2026-07-04) so the repository — not a conversation — is their source of truth. It
does **not** redesign anything. It sits atop the Embodiment Phase (the Ecological
Knowledge Environment, M28+).

Do not relitigate the grammar, the decisions, or the roadmap. Implement one milestone
at a time, preserve the invariants, verify, fill in this ledger, and stop.

---

## Frozen reference

### Interaction Grammar

- **One invariant** — the held **subject**, carried across every transition via the
  `eke-subject` view-transition morph.
- **One axis** — **epistemic depth**: experiential (cinematic) → analytical (atlas) →
  evidential (research / evidence ledger).
- **Four primitives** — **press-in**, **step-back**, **follow**, **interrogate**.
- **Terminal semantics** — *traceability, not truth*. Understanding = the **reach of a
  warrant**, including **honest non-resolution**.
- **Reasoning-state lattice** — encounter → recognition → relation → claim → warrant →
  verdict → understanding.

### Architecture Decisions D1–D10

- **D1** — subject = URL-addressable manifest id (`?subject=`).
- **D2** — depth is a discrete addressable coordinate; multi-document; scroll never crosses depth.
- **D3** — press-in / step-back are hosted *below* only; the cinematic surface hosts no depth
  affordance (affordance-sink; the one-way-bridge doctrine).
- **D4** — follow = an RO-typed lateral edge at the same depth.
- **D5** — interrogate = a depth-local reveal from `check-bindings --json`, never re-derived.
- **D6** — verdict + reason codes shown verbatim; badges name **reach, not truth** (three
  states); no pass/fail.
- **D7** — non-resolution is a first-class terminal state.
- **D8** — history = the primitive string; interrogation state lives in the URL fragment.
- **D9** — the subject morph is mandatory on every depth transition.
- **D10** — a single CI gate enforces the four grammar constraints.

### Execution order

M33 → M34 → M35, with **M36 in parallel**, then M37 → M38, then **M39 → M40 last**.
Session-landable: M33, M34, M36, M37. After prerequisites: M35, M38. Span sessions: M39, M40.

### Out of roadmap (human / browser-gated, not autonomous)

Curated-archive L2/L3 rigor and the Bates et al. (2005) citation (Research Curator); final
transition easing (needs a browser); the evidence-code field (awaits TDWG placement).

---

## Milestone ledger

### M33 — Non-resolution rendering (D7)

- **Goal:** Make **non-resolution a first-class terminal state** on the evidential surface. The
  evidence ledger must render a claim's reach honestly — distinguishing a warrant that reaches
  resolvable evidence from one that reaches a named source whose resolution is honestly open —
  rather than collapsing everything into a two-state pass/fail.
- **Status:** DONE (2026-07-04)
- **Acceptance Criteria:**
  - ✅ The evidence ledger renders reach in **three states** (traceable / open-non-resolution /
    baseline-gap), no pass/fail framing.
  - ✅ Non-resolution (a claim that reaches a named source with no resolvable persistent identifier)
    is presented calmly as an open question — **not** styled or worded as a failure or a defect.
  - ✅ The three states are **derived from the reference validator's own output**
    (`scripts/check-bindings.js`), never re-derived, so the page cannot drift from the verdicts.
  - ✅ Headline and index summaries are honest three-state counts.
  - ✅ Invariants preserved: L1 stays the build gate (`prebuild` unchanged); evidence HTML stays
    derived / git-ignored; standards reuse only (no new reason code, no schema change); cinematic
    surfaces untouched.
  - ✅ A unit test covers the classification of all three states and is wired into `verify`.
- **Files Changed:**
  - `scripts/evidence-reach.mjs` (new) — pure three-state reach classifier (`classifyReach`) +
    shared presentation vocabulary (`REACH_META`), derived solely from validator verdicts.
  - `scripts/evidence-reach.test.mjs` (new) — black-box unit test (11 classifications, all three
    states + discriminating cases).
  - `scripts/build-evidence.mjs` — runs the validator at L1 (verdict) and L2 (`SOURCE_UNRESOLVABLE`
    signal), aligns records positionally, classifies each claim, renders three honest states +
    calm non-resolution note; slate `--slate` token + `.open`/`.reach` styles.
  - `package.json` — `test:evidence-reach` script wired into `verify` (now 9 checks).
- **Commit:** `c6f1874` (implementation; bundled with the previously-uncommitted, verified M29–M32
  work because they share `package.json`/`PROJECT_STATUS.md` — a clean isolated commit was not
  possible without rewriting shared history). Ledger/status finalization in the current docs commit.
- **Verification:**
  - `npm run test:evidence-reach` — PASS (11 classifications; all three states discriminated).
  - `npm run verify` — 9 checks green.
  - `npm run build` — green (`prebuild` → `build:evidence` uses the classifier; L1 stays the gate).
  - Regenerated `public/evidence/*.html`; built `dist/evidence/epr-vents.html` ships 10 `UNRESOLVED`
    badges + 10 per-claim `.reach` notes + the header note; index carries the "open question" framing.
  - Cinematic purity confirmed: no reach logic (`UNRESOLVED`/`classifyReach`/`first-class terminal`)
    in any `dist/assets/places-*.js` bundle.
- **Notes:** Session-landable, low/med, user-visible. First roadmap milestone; no prerequisites.
  Primary generator: `scripts/build-evidence.mjs`. On the real corpus every claim currently renders
  **open** — a truthful mirror of the DOI-unconfirmed backlog (all 38 binding sources are still bare
  citation strings, i.e. `SOURCE_UNRESOLVABLE` at L2; upgrading them to persistent identifiers is
  out-of-roadmap Research-Curator work). The full "reach-not-truth" badge reform across all verdict +
  reason codes is **M34 (D6)**, deliberately not done here.

### M34 — Verdict + reason-code "reach-not-truth" badges (D6)

- **Goal:** Present each claim's **verdict and reason codes verbatim**, with badges that name the
  **reach of the warrant, not truth** — three states, never pass/fail.
- **Status:** NOT STARTED
- **Acceptance Criteria:**
  - Reason codes are shown **verbatim** (the append-only vocabulary from `check-bindings.js`), not
    paraphrased or hidden.
  - Badge language names reach (e.g. how far the warrant reaches), never correctness/truth; no
    "pass", "fail", "error", or check/cross semantics.
  - Exactly **three** badge states, consistent with D7's terminal non-resolution state.
  - Badges are derived from the validator's output, not re-derived.
  - Cinematic surfaces untouched; standards reuse only.
  - A unit test covers the badge/reason-code mapping and is wired into `verify`.
- **Files Changed:** —
- **Commit:** —
- **Verification:** —
- **Notes:** Session-landable, low/med, user-visible. Depends on M33. Primary generator:
  `scripts/build-evidence.mjs` (+ shared reach vocabulary).

### M35 — In-place interrogate from inline validator JSON (D5)

- **Goal:** Implement the **interrogate** primitive as a **depth-local reveal** that exposes a
  claim's evidence chain from `check-bindings --json`, **never re-derived** at render time.
- **Status:** NOT STARTED
- **Acceptance Criteria:**
  - Interrogation happens **in place, at the current depth** — it does not navigate to another
    depth or document.
  - The revealed evidence (subject/object occurrences, source, backbone/date/pin status, verdict,
    reason codes) comes **directly from the validator's JSON**, embedded at build time; nothing is
    recomputed in the browser.
  - No new evidentiary logic lives on the surface (single source of truth = the validator).
  - Cinematic surfaces host no interrogate affordance (consistent with D3).
  - Verified headlessly (the inlined JSON matches the validator output; the reveal is present in
    the built artifact).
- **Files Changed:** —
- **Commit:** —
- **Verification:** —
- **Notes:** Follows M34 (needs the reach-not-truth badge vocabulary). Primary generators:
  `scripts/build-evidence.mjs`, `scripts/check-bindings.js` (`--json`).

### M36 — Typed-edge follow in the atlas (D4)

- **Goal:** Implement the **follow** primitive as an **RO-typed lateral edge at the same depth**
  in the analytical (atlas) surface.
- **Status:** NOT STARTED
- **Acceptance Criteria:**
  - A follow edge stays at the **same epistemic depth** (analytical → analytical); it does not
    press-in or step-back.
  - Each followable edge is **typed by its OBO Relations Ontology relation** (the same controlled
    IRI the validator checks), not an untyped link.
  - Edges are derived from the archive's `resource-relationship.txt` / manifest, not hand-authored.
  - Cinematic surfaces untouched; standards reuse only.
  - Verified headlessly (typed edges present in the built atlas surface; relation IRIs correct).
- **Files Changed:** —
- **Commit:** —
- **Verification:** —
- **Notes:** Session-landable, can proceed **in parallel** with M34/M35. Primary generators:
  `src/atlas/atlas.js`, `src/atlas/field-record.js`.

### M37 — Cinematic-purity + subject-morph build gates (D3, D9)

- **Goal:** Enforce, at build time, that the **cinematic surface hosts no depth affordance** (D3)
  and that the **subject morph is present on every depth transition** (D9).
- **Status:** NOT STARTED
- **Acceptance Criteria:**
  - A build/CI check **fails** if any cinematic bundle contains a depth affordance (press-in /
    step-back / interrogate / cross-depth link) — the affordance-sink / one-way-bridge doctrine.
  - A build/CI check **fails** if any depth-transition entry point is missing the shared
    `eke-subject` view-transition morph on the held subject.
  - Both checks are dependency-free and run in `verify` (and `prebuild` where they are invariants).
  - Checks are negative-tested (a deliberately-broken fixture is caught).
- **Files Changed:** —
- **Commit:** —
- **Verification:** —
- **Notes:** Session-landable. Precedes M38. New `scripts/check-*.js` gate(s) + `package.json`
  wiring; reads built bundles / source surfaces.

### M38 — Composite grammar-rejection CI gate (D10)

- **Goal:** Consolidate the grammar's constraints into **a single CI gate** that rejects any change
  violating the four constraints (subject invariant, depth discreteness, affordance placement,
  subject-morph).
- **Status:** NOT STARTED
- **Acceptance Criteria:**
  - **One** gate (one command / one CI job) enforces all four grammar constraints; a violation of
    any one fails the gate.
  - The gate composes the M37 checks (and any others) rather than duplicating their logic.
  - Wired into CI (`.github/workflows/`) and `verify`.
  - Negative-tested: each of the four constraints, when violated, fails the composite gate.
- **Files Changed:** —
- **Commit:** —
- **Verification:** —
- **Notes:** Follows M37. New composite `scripts/check-*.js` + CI wiring.

### M39 — Subject URL-addressability across surfaces (D1)

- **Goal:** Make the held **subject a URL-addressable manifest id** (`?subject=`) that resolves
  consistently across every surface.
- **Status:** NOT STARTED
- **Acceptance Criteria:**
  - The subject is addressable by a stable **manifest id** via a `?subject=` query parameter.
  - The same `?subject=` resolves correctly on each surface (experiential / analytical /
    evidential), using the manifest resolvers (ADR-001), with no per-surface bespoke mapping.
  - Unknown / absent subject degrades gracefully (no broken surface).
  - Cinematic purity and existing navigation parity preserved.
  - Verified across surfaces (the same id resolves to the same subject everywhere).
- **Files Changed:** —
- **Commit:** —
- **Verification:** —
- **Notes:** **High blast radius; spans sessions.** Touches the manifest resolvers, `src/main.js`,
  `src/atlas/*`, `src/notes/*`, `scripts/build-evidence.mjs`. Sequenced after M37/M38.

### M40 — History-as-trace + interrogation state in URL (D8)

- **Goal:** Make browser **history the primitive string** (the sequence of grammar primitives
  taken), with **interrogation state carried in the URL fragment** (D8).
- **Status:** NOT STARTED
- **Acceptance Criteria:**
  - Navigating with the four primitives produces a **history stack that reads as the primitive
    string** (press-in / step-back / follow / interrogate), so back/forward retraces the reasoning
    path.
  - Interrogation (open/closed, which claim) is encoded in the **URL fragment**, so a deep link
    restores the interrogation state.
  - Consistent with D1 subject addressability (M39) — a shared, restorable URL model.
  - Verified: a copied URL restores subject + depth + interrogation state.
- **Files Changed:** —
- **Commit:** —
- **Verification:** —
- **Notes:** **Spans sessions; last milestone.** Depends on M39. Touches history/URL handling
  across surfaces.
