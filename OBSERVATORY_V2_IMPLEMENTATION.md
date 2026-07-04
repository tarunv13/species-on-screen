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
- **Status:** DONE (2026-07-04)
- **Acceptance Criteria:**
  - ✅ Interrogation happens **in place, at the current depth** — each claim carries a native
    `<details>` reveal that toggles inline; no `href`, no navigation, no depth change.
  - ✅ The revealed evidence (subject/object occurrences, source, backbone/date/pin status,
    verdict, reason codes) comes **directly from the validator's JSON**, inlined at build time;
    the reveal is static HTML with **zero JS** — nothing is recomputed in the browser.
  - ✅ No new evidentiary logic lives on the surface: the pure `interrogationChain()` only selects
    and shapes validator fields (single source of truth = `check-bindings.js`), unit-proven verbatim.
  - ✅ Cinematic surfaces host no interrogate affordance (D3) — confirmed absent from every
    `dist/assets/places-*.js`; also absent from the atlas/research bundles (it is depth-local to
    the evidential ledger).
  - ✅ Verified headlessly: a cross-check confirmed **all 190 inlined fields match the validator
    output** exactly across the four ledgers, and the reveal ships in the built artifact.
- **Files Changed:**
  - `scripts/evidence-interrogate.mjs` (new) — pure, dependency-free `interrogationChain(record)`
    that copies verdict / reason codes / source / subject+object occurrence status (occurrenceID,
    name, backbone, as-of, pinned) verbatim from one validator `--json` record; never re-derives.
  - `scripts/build-evidence.mjs` — renders a `<details class="interrogate">` per claim from that
    chain (verdict verbatim, reason codes, source, both occurrences' full status); the occurrence
    detail moved from the always-visible summary into the reveal; new interrogate/chain styles.
  - `scripts/evidence-interrogate.test.mjs` (new) — 21 black-box checks (verbatim verdict/source/
    occurrence fields, reachCodes preferred then L1 reasons, null-not-fabricated, defensive input).
    `package.json` wires `test:evidence-interrogate` into `verify` (now 11 checks).
- **Commit:** One clean M35 commit (this change set); see `git log` on
  `feat/exploration-prototypes-and-data-pipelines`.
- **Verification:**
  - `npm run test:evidence-interrogate` — PASS (21 checks).
  - `npm run verify` — 11 checks green.
  - `npm run build` — green.
  - Real-data cross-check: parsed `check-bindings.js --json` (+ L2), asserted every ledger's
    `<details>` count equals its record count and **all 190 inlined validator fields matched**.
  - Built `dist/evidence/epr-vents.html` ships 10 interrogate reveals; M34's reach badges +
    verbatim codes intact; no interrogate logic in any cinematic/atlas/research bundle.
- **Notes:** Followed M34 (uses the reach-not-truth badge context). The `<details>` reveal now also
  surfaces the **verbatim validator verdict** (`CONFORMANT` / `NON_CONFORMANT`) — the raw audit
  disclosure where the literal verdict token belongs — which closes the M34-review observation that
  the verbatim verdict appeared nowhere, without reintroducing pass/fail language into the badge.

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
- **Status:** DONE (2026-07-04)
- **Acceptance Criteria:**
  - ✅ A build check **fails** if the cinematic runtime contains a depth affordance — a cross-depth
    import, a cross-depth navigation string, an evidential/analytical logic identifier
    (`interrogationChain` / `interactionWebModel` / `classifyReach` / `REACH_META` /
    `reasonCodesVerbatim`), an `interrogate` marker, a cross-document `@view-transition` / `eke-subject`
    in cinematic CSS, or a real cross-depth `<a>` in a place shell. (Runtime = JS + CSS + shells;
    prose comments are stripped first; the built bundle is a pure transform of this gated source.)
  - ✅ A build check **fails** if any depth-transition subject surface (research article, atlas
    field-record, evidence ledger) is missing the `@view-transition` opt-in or the
    `view-transition-name: eke-subject` morph, or declares any **other** view-transition-name
    (the single-subject invariant).
  - ✅ Both checks are dependency-free (Node stdlib) and run in **`verify`** and **`prebuild`**
    (build invariants).
  - ✅ Negative-tested: 19 fixture checks exercise every failure mode + every clean shape, plus a
    live injection into a real cinematic CSS file (caught, exit 1) then reverted.
- **Files Changed:**
  - `scripts/cinematic-grammar.mjs` (new) — pure, dependency-free predicates: `stripJsComments` /
    `stripHtmlComments`, `findCinematicJsAffordances`, `findCinematicCssTransitions`,
    `findHtmlCrossDepthLinks`, `findMissingSubjectMorph`.
  - `scripts/check-cinematic-grammar.js` (new) — CLI gate reading the real surfaces (4 cinematic JS,
    4 cinematic CSS, 3 place shells; 3 depth-transition subject surfaces).
  - `scripts/check-cinematic-grammar.test.mjs` (new) — 19 negative + positive checks.
  - `package.json` — `check-cinematic-grammar` wired into `prebuild` **and** `verify`;
    `test:cinematic-grammar` into `verify` (now 12 checks).
- **Commit:** One clean M37 commit (this change set); see `git log` on
  `feat/exploration-prototypes-and-data-pipelines`.
- **Verification:**
  - `npm run test:cinematic-grammar` — PASS (19 checks).
  - `node scripts/check-cinematic-grammar.js` on real code — PASS (D3 across 4 js + 4 css + 3 shells;
    D9 morph on 3 surfaces).
  - Live injection: appended `view-transition-name:eke-subject` to `src/places/epr-vents.css` → gate
    failed (exit 1, correct file/kind) → reverted (`git` clean).
  - `npm run verify` — 12 checks green; `npm run build` — green (`prebuild` runs the gate as an
    invariant).
- **Notes:** Session-landable; precedes M38 (which composes this into the single grammar CI gate).
  **Scope decision:** the gate enforces D3 on the cinematic **source** (the authoritative input the
  bundle is built from) rather than grepping the post-build bundle — deterministic, runs before the
  build as an invariant, and the vite build injects no affordances, so bundle purity is inherited.
  `index.html` (the hub) is exempt from the shell cross-depth-link check: its caption anchors are
  intentional no-JS fallbacks the runtime intercepts (its runtime, `src/main.js`, is still gated and
  reads hrefs generically — it holds no cross-depth string). The atlas overview (`atlas.css`) has the
  calm cross-fade but no held subject, so it is correctly **not** a subject surface.

### M38 — Composite grammar-rejection CI gate (D10)

- **Goal:** Consolidate the grammar's constraints into **a single CI gate** that rejects any change
  violating the four constraints (subject invariant, depth discreteness, affordance placement,
  subject-morph).
- **Status:** DONE (2026-07-04)
- **Acceptance Criteria:**
  - ✅ **One** gate — `scripts/check-grammar.js` (`npm run check-grammar`) — enforces all four
    constraints; a violation of **any** one fails the gate (exit 1), reported grouped by constraint.
  - ✅ It **composes** M37 rather than duplicating: it imports M37's pure predicates
    (`findCinematicJsAffordances` / `…CssTransitions` / `…HtmlCrossDepthLinks` / `findMissingSubjectMorph`
    from `cinematic-grammar.mjs`) plus the two new ones (`findForeignSubjectNames` /
    `findScrollDepthCrossing` from `grammar-constraints.mjs`, which themselves reuse M37's
    `stripJsComments`/`SUBJECT_MORPH`). No logic is re-implemented.
  - ✅ Wired into **CI** (`.github/workflows/verify.yml` — an explicit "Grammar gate (D10)" step)
    and **`verify`** (and `prebuild`, replacing the standalone M37 gate — the D10 consolidation).
  - ✅ Negative-tested: `check-grammar.test.mjs` violates **each** of the four constraints in turn
    (plus a clean world, a declarative-anchor-is-not-a-crossing case, and a same-depth cinematic
    arrival case) and asserts the composite rejects/accepts correctly.
- **Files Changed:**
  - `scripts/grammar-constraints.mjs` (new) — the two constraints M37 lacked: `findForeignSubjectNames`
    (D1 — `eke-subject` is the only view-transition-name anywhere) and `findScrollDepthCrossing`
    (D2 — no programmatic cross-depth navigation; movement is declarative & multi-document). Reuses
    M37's helpers.
  - `scripts/check-grammar.js` (new) — the single composite gate: a pure, testable `evaluateGrammar()`
    over the four constraint groups + a CLI that reads the real surfaces.
  - `scripts/check-grammar.test.mjs` (new) — 9 checks (each constraint rejected + clean/edge cases).
  - `package.json` — `check-grammar` + `test:grammar` scripts; `check-grammar` replaces
    `check-cinematic-grammar` in `prebuild` and `verify` (consolidation); `test:grammar` added to
    `verify` (now 13 checks). `test:cinematic-grammar` (M37's unit test) retained.
  - `.github/workflows/verify.yml` — explicit "Grammar gate (D10)" step + header note.
- **Commit:** One clean M38 commit (this change set); see `git log` on
  `feat/exploration-prototypes-and-data-pipelines`.
- **Verification:**
  - `npm run test:grammar` — PASS (9 checks; each of the four constraints rejected, clean world +
    edge cases pass).
  - `node scripts/check-grammar.js` on real code — PASS (all four hold).
  - Live injection: added `view-transition-name:rogue-subject` to `src/atlas/atlas.css` → composite
    failed under **subject invariant (D1)** (exit 1) → reverted, `git` clean.
  - `npm run verify` — 13 checks green; `npm run build` — green (`prebuild` runs the composite gate).
- **Notes:** **M37 is untouched** — its three files are byte-identical and `test:cinematic-grammar`
  still runs; the composite **reuses** M37's predicates and **supersedes the standalone M37 gate in
  the build/verify wiring** (that is exactly D10's consolidation). Operationalisation of the two new
  constraints: **D1 (subject invariant)** = `eke-subject` is the only view-transition-name across
  production stylesheets (test fixtures excluded); **D2 (depth discreteness)** = cross-depth movement
  must be a declarative `<a href>` (a user navigation → multi-document view transition), never a
  programmatic `location`/`history` jump that scroll or a timer could drive — `places/` (the
  experiential depth) is excluded, so the same-depth cinematic arrival is not a crossing.

### M39 — Subject URL-addressability across surfaces (D1)

- **Goal:** Make the held **subject a URL-addressable manifest id** (`?subject=`) that resolves
  consistently across every surface.
- **Status:** DONE (2026-07-04)
- **Acceptance Criteria:**
  - ✅ The subject is addressable by a stable **manifest id** (the canonical `placeId`) via a
    `?subject=` query parameter — read with `subjectIdFromSearch`, resolved with `resolveSubject`.
  - ✅ The same `?subject=` resolves correctly on each surface via the **one shared** resolver +
    the manifest (ADR-001), with **no per-surface bespoke mapping**: e.g. `?subject=east-pacific-rise`
    yields the cinematic/atlas/dwca slug `epr-vents` and the research slug
    `east-pacific-rise-tubeworm-chemosynthesis` on every surface; `?subject=coral-triangle` yields
    cinematic slug `crossing`. Each surface derives its **own** local slug from the resolved place.
  - ✅ Unknown / absent subject degrades gracefully — `heldSubject` falls back to the surface's own
    identity, `withSubject` is a no-op on a falsy id, and a place with no cinematic surface simply
    carries no cinematic link (amazon-várzea verified).
  - ✅ Cinematic purity + navigation parity preserved: **no cinematic file was touched** (the place
    *is* the subject; links *into* it carry `?subject=` from other surfaces); the M38 grammar gate
    stays green; link **targets** are unchanged (the `?subject=` is additive; existing query/fragment
    preserved).
  - ✅ Verified across surfaces: a 37-check unit test against the real manifest + the built evidence
    ledgers show one id → the correct per-surface slug across experiential/analytical/evidential/
    research, on all four places.
- **Files Changed:**
  - `src/subject.js` (new) — the **single** URL-addressability mechanism (pure, dependency-free):
    `subjectIdFromSearch`, `resolveSubject(places, id)`, `heldSubject(places, search, fallbackId)`,
    `withSubject(href, id)`. Used by every surface; no second identity scheme.
  - `cinematic-language/place-manifest.ts` — added the typed `resolveSubject(subjectId)` resolver
    (= `getPlaceById`, the subject id is the canonical `placeId`).
  - `src/atlas/field-record.js` — resolves `?subject=` to establish `PLACE` (subject → field-record
    slug wins, else `?place=`/filename), and carries `?subject=` on all four nav links.
  - `src/atlas/atlas.js` — carries `?subject=` on the detail-card bridges + the discovery chips.
  - `src/notes/render-narrative.js` — carries `?subject=` on the cross-surface links (the pure
    `surface-links.js` derivation + its test unchanged; the subject is layered on at render).
  - `scripts/build-evidence.mjs` — the evidence ledger's ascent links carry `?subject=<placeId>`.
  - `scripts/subject.test.mjs` (new) — 37 checks; `package.json` wires `test:subject` into `verify`
    (now 14 checks).
- **Commit:** One clean M39 commit (this change set); see `git log` on
  `feat/exploration-prototypes-and-data-pipelines`.
- **Verification:**
  - `npm run test:subject` — PASS (37 checks against the real manifest).
  - `npm run verify` — 14 checks green, **including the M38 grammar gate** (cinematic purity + depth
    discreteness intact after the surface edits).
  - `npm run build` — green. Built evidence ledgers carry `?subject=<placeId>` on every ascent link;
    the same canonical id resolves to the correct per-surface slug (EPR → `epr-vents`/…; coral-triangle
    → `crossing`); amazon-várzea (no cinematic) carries subject on atlas + research only.
  - Cinematic bundles confirmed pure (no `?subject=` cross-depth logic in any `dist/assets/places-*.js`);
    the atlas/research/field-record bundles carry the subject logic.
- **Notes:** **High blast radius** but landed in one session as a **complete, additive** increment.
  **`src/main.js` was deliberately not touched** — the goal listed it, but the cinematic surface is an
  affordance-sink (M37/M38): giving it a subject-carrying cross-depth affordance would violate D3, and
  the cinematic place page *is* the subject already; other surfaces' links into it carry `?subject=`.
  Scope held to URL-addressability (read + resolve + carry + graceful); making a per-place page *switch*
  its whole content by `?subject=` beyond the field record, and persisting the subject through history,
  is M40 (D8) territory and was not started.

### M40 — History-as-trace + interrogation state in URL (D8)

- **Goal:** Make browser **history the primitive string** (the sequence of grammar primitives
  taken), with **interrogation state carried in the URL fragment** (D8).
- **Status:** DONE (2026-07-04)
- **Acceptance Criteria:**
  - ✅ Navigating with the four primitives produces a **history stack that reads as the primitive
    string**: press-in / step-back are cross-depth `<a href>` document navigations (each a history
    entry, carrying `?subject=` per M39); **follow** is M36's `#fr-node-<id>` hash (a history entry);
    **interrogate** now sets `#claim-N` via `location.hash` (a history entry) — so back/forward
    retraces the reasoning path.
  - ✅ Interrogation (which claim is open) is encoded in the **URL fragment** (`#claim-N`): the
    ledger's tiny restore/sync script opens the addressed claim on load and on back/forward, so a
    deep link restores the interrogation state; opening a claim writes the fragment (a history entry).
  - ✅ Consistent with D1 (M39): a **shared, restorable URL model** — the subject stays in the query
    (`?subject=`), the interrogation in the fragment (`#claim-N`); they coexist (verified:
    `withSubject('…#claim-3', …)` → `…?subject=…#claim-3`).
  - ✅ Verified: a copied URL `evidence/<slug>.html?subject=<placeId>#claim-N` restores **subject**
    (query, carried onward), **depth** (the page = evidential), and **interrogation** (the fragment
    opens claim N).
- **Files Changed:**
  - `scripts/interrogation-url.mjs` (new) — pure, dependency-free fragment↔claim mapping
    (`CLAIM_PREFIX`, `claimDomId(index)`, `domIdFromHash(hash)`); the single definition used to stamp
    the claim DOM ids at build time and (inlined) drive the restore script.
  - `scripts/build-evidence.mjs` — each interrogation `<details>` gets `id="claim-N"`; a small
    self-contained progressive-enhancement `<script>` syncs the addressed `<details>` open-state ↔
    the URL fragment (open on load/hashchange, write the fragment on open, drop it on manual close),
    `scroll-margin` for the anchored claim.
  - `scripts/interrogation-url.test.mjs` (new) — 15 checks (round-trip; non-interrogation fragments —
    incl. M36's `#fr-node-…` and a subject query — ignored). `package.json` wires
    `test:interrogation-url` into `verify` (now 15 checks).
- **Commit:** One clean M40 commit (this change set); see `git log` on
  `feat/exploration-prototypes-and-data-pipelines`.
- **Verification:**
  - `npm run test:interrogation-url` — PASS (15 checks).
  - `npm run verify` — 15 checks green, **including the M38 grammar gate**.
  - `npm run build` — green. The built ledger stamps 10 `id="claim-N"` and ships the restore script;
    the extracted inline script passes `node --check` (valid JS; the escaped `^claim-\d+$` regex
    renders correctly); the index page (no claims) carries no script.
  - **M35 not regressed:** the evidence chain stays static/inlined (all verdicts + occurrences
    present); the script only manages open/close ↔ URL, never the evidence content — and without JS
    the `<details>` still work manually (progressive enhancement).
- **Notes:** Last milestone; the roadmap M33–M40 is complete. **M36's follow and the cross-depth
  `<a href>` navigations were left untouched** — they already produce history entries and restore
  from a deep link (M36's `#fr-node` via native `:target` scroll), so "history as the primitive
  string" holds for all four primitives without changing them; M40's active work is the interrogate
  fragment on the evidential surface. Cinematic untouched; the grammar gate stays green.
