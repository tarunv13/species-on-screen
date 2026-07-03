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
- **Status:** DONE (2026-07-04)
- **Acceptance Criteria:**
  - ✅ Reason codes are shown **verbatim** (the append-only vocabulary from `check-bindings.js`),
    not paraphrased or hidden — rendered per claim as `<code>` chips straight from the validator.
  - ✅ Badge language names reach (`REACHES EVIDENCE` / `REACHES A SOURCE` / `REACH INCOMPLETE`),
    never correctness/truth; no "pass", "fail", "error", or check/cross semantics (unit-enforced
    against a forbidden-term list).
  - ✅ Exactly **three** badge states, consistent with D7's terminal non-resolution state (the
    `open` state keeps its calm first-class D7 note).
  - ✅ Badges are derived from the validator's output (`classifyReach` from the L1 verdict; codes
    are the validator's L2 reason set passed through verbatim), not re-derived.
  - ✅ Cinematic surfaces untouched (confirmed by grep against `dist/assets/places-*.js`); standards
    reuse only (no new reason code, no schema change).
  - ✅ A unit test covers the badge/reason-code mapping (reach-naming + forbidden-term guard +
    verbatim pass-through) and is wired into `verify`.
- **Files Changed:**
  - `scripts/evidence-reach.mjs` — reformed `REACH_META` badge labels to reach-naming
    (`REACHES EVIDENCE` / `REACHES A SOURCE` / `REACH INCOMPLETE`); added `reasonCodesVerbatim`
    (filters non-strings, never paraphrases).
  - `scripts/build-evidence.mjs` — uniform reach badge for every state (no `GAP:`-in-badge special
    case); new verbatim `.codes` line per claim; carries `r.reachCodes` (validator L2 reasons);
    index now names all three states (traceable / open / reach-incomplete).
  - `scripts/evidence-reach.test.mjs` — added D6 assertions (three distinct reach-naming badges,
    forbidden-term guard, verbatim reason-code pass-through). 19 checks total.
- **Commit:** One clean M34 commit (this change set); see `git log` on
  `feat/exploration-prototypes-and-data-pipelines`.
- **Verification:**
  - `npm run test:evidence-reach` — PASS (19 checks: D7 classifier + D6 badges/verbatim codes).
  - `npm run verify` — 9 checks green.
  - `npm run build` — green.
  - Regenerated `public/evidence/*.html`; built `dist/evidence/epr-vents.html` shows 10 reach
    badges (`REACHES A SOURCE`) + 10 verbatim `<code>SOURCE_UNRESOLVABLE</code>` lines + the D7 open
    note; index expresses all three states.
  - Cinematic purity confirmed: no reach/badge logic in any `dist/assets/places-*.js`.
- **Notes:** Session-landable, low/med, user-visible. Built on M33 (D7) without regressing it — the
  `open` state stays calm and first-class. As a side consistency fix on the same surface, the index
  now also names the `gap` state (closing the M33-review residual where the index could not express
  it). The full **verdict string** is intentionally not reprinted (it would reintroduce
  "non-conformant" pass/fail language); the badge names reach and the reason codes carry the exact
  machine signal, satisfying D6's verbatim requirement without the pass/fail framing D6 forbids.

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
- **Status:** DONE (2026-07-04)
- **Acceptance Criteria:**
  - ✅ A follow edge stays at the **same epistemic depth** (analytical → analytical); it does not
    press-in or step-back — every follow is an in-page `#fr-node-<id>` fragment to another actor
    at the same depth (unit-asserted: every follow-target is an actor in the same set).
  - ✅ Each followable edge is **typed by its OBO Relations Ontology relation** — the relation term
    links to the controlled IRI (`http://purl.obolibrary.org/obo/RO_…`) the validator checks; an
    edge with no controlled IRI is marked untyped rather than faked.
  - ✅ Edges are derived from the archive's `resource-relationship.txt` + occurrence records
    (`RELS` / `actorList`), not hand-authored.
  - ✅ Cinematic surfaces untouched (confirmed: no follow-web logic in any `dist/assets/places-*.js`);
    standards reuse only (OBO RO PURLs; no new vocabulary).
  - ✅ Verified headlessly: unit test on the pure model + a real-data render check across all four
    archives (100% of edges RO-typed, all IRIs valid, all follow-targets lateral) + the built
    `field-record` bundle carries the follow web.
- **Files Changed:**
  - `src/atlas/interaction-web.js` (new) — pure, dependency-free `interactionWebModel(actors, rels)`
    + `isRoIri` (mirrors the validator's controlled-IRI pattern). Builds one node per actor with its
    RO-typed edges, `dir` (out/in), and lateral follow-target; never fakes an IRI.
  - `src/atlas/field-record.js` — renders the interaction web from that model as followable actor
    nodes (`#fr-node-<id>`), relation terms linked to their OBO RO IRI, plus a small a11y/highlight
    handler on follow; replaced the old flat relationship list (same information, now navigable).
  - `src/atlas/field-record.css` — styles for the typed follow web (`.fr-node` / `.fr-web` /
    `.fr-rel` / `.fr-follow`), a `:target` + reduced-motion-safe pulse highlight on the followed node.
  - `scripts/interaction-web.test.mjs` (new) — 19 black-box checks (RO-typing, verbatim IRI, lateral
    follow-targets, untyped-not-faked, derived-only, defensive input). `package.json` wires
    `test:interaction-web` into `verify` (now 10 checks).
- **Commit:** One clean M36 commit (this change set); see `git log` on
  `feat/exploration-prototypes-and-data-pipelines`.
- **Verification:**
  - `npm run test:interaction-web` — PASS (19 checks).
  - `npm run verify` — 10 checks green.
  - `npm run build` — green.
  - Real-data render check (all 4 archives): sundarbans/coral-triangle/epr-vents 20 edges each,
    amazon-várzea 16 — every edge RO-typed, every IRI valid, every follow-target lateral.
  - Built `dist/assets/field-record-*.js` carries `interactionWebModel` / `fr-follow` / `fr-node-` /
    `purl.obolibrary`; absent from every `dist/assets/places-*.js`.
- **Notes:** Session-landable; landed independently of M35 (parallel per the execution order).
  `src/atlas/atlas.js` (the discovery overview) was **not** touched — it renders no interaction
  edges, so the typed follow web lives entirely in the field-record interaction web. The follow is
  implemented as same-depth DOM navigation (the grammatically essential lateral act) and is
  deliberately **not** coupled to the canvas focus system — that avoids fighting the scroll-driven
  narrative focus and keeps the surface robust; not required by D4.

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
