# Observatory v2 — Canonical Implementation Roadmap

**Status:** The M33–M40 roadmap is **IMPLEMENTED and CLOSED**. The implementation audit
of 2026-07-04 is **accepted**: every milestone's commit is present in the branch history,
each commit's file list matches its ledger claim, and the full automated gate is green
— `npm run verify` (5 gates: `check-narratives`, `check-manifest`, `check-bindings`,
`check-dwca-xml`, `check-grammar` + 12 unit tests) and `npm run build`.

This document is now the **canonical implementation roadmap**. It supersedes the prior
verbose per-milestone ledger; the full implementation detail for each closed milestone
remains in the repository in three places — git history (the commits below), the
per-milestone session diaries `.agents/sessions/2026-07-04-m3*.md`, and the "Completed
milestones" section of `PROJECT_STATUS.md`.

**Do not relitigate** the grammar, the decisions, or the closed milestones. The only live
work is **R1–R3** (below) — browser/visual QA, merge-to-`main`, and out-of-roadmap
Research-Curator DOI rigor. **None of it is new architecture or a new grammar primitive.**
Any capability beyond D1–D10 requires a Chief Architect decision record, not an ad-hoc
milestone.

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

The realized order was **M33 → M34 → M36 → M35 → M37 → M38 → M39 → M40**, conforming to the
planned order (M36 in parallel with the M33→M34→M35 chain; M39→M40 last). No corrective
reordering was required.

---

## Closed milestones (M33–M40)

Numbering preserved; all eight **CLOSED** (audit-verified 2026-07-04). Acceptance = the
milestone's automated test(s), all green in the current tree.

| M | Decision | Objective | Status | Commit | Acceptance (automated) |
|---|---|---|---|---|---|
| M33 | D7 | Non-resolution a first-class terminal state on the evidence ledger | CLOSED | `c6f1874` + `85c2016` | `evidence-reach.test` (three reach-states, derived from validator) |
| M34 | D6 | Verdict + reason codes verbatim; badges name reach, not truth | CLOSED | `cfa3f67` | `evidence-reach.test` (19 checks: reach badges + verbatim codes + forbidden-term guard) |
| M35 | D5 | In-place interrogate from inline validator JSON (zero-JS reveal) | CLOSED | `8aaaf45` | `evidence-interrogate.test` (21 checks; 190 fields matched validator headlessly) |
| M36 | D4 | RO-typed lateral *follow* edges on the analytical surface | CLOSED¹ | `bf8237d` | `interaction-web.test` (19 checks; all edges RO-typed, lateral, derived) |
| M37 | D3/D9 | Cinematic-purity + subject-morph build gates | CLOSED | `e180792` | `cinematic-grammar.test` (19 checks) + live-injection |
| M38 | D10 | Single composite grammar-rejection CI gate | CLOSED | `ccb2b2d` | `check-grammar.test` (9 checks; each constraint rejected) + CI wiring |
| M39 | D1 | Subject URL-addressability across surfaces | CLOSED² | `701a49a` | `subject.test` (37 checks; one id resolves per surface, degrades gracefully) |
| M40 | D8 | History-as-trace + interrogation state in URL fragment | CLOSED³ | `fc3edc6` | `interrogation-url.test` (15 checks) + inline script `node --check` |

**Audit notes (the entries the audit flagged):**

1. **M36** — closed; **R1 browser QA now DONE (2026-07-05).** The `:target` follow-highlight
   pulse — verified structurally at closure — is now **browser-verified** against `dist/`
   (`vite preview`, EPR field record): a follow activation sets `#fr-node-<id>`, matches
   `:target` (accent-soft background), runs `fr-follow-pulse`, moves a11y focus, and adds one
   history entry; Back/Forward retrace re-resolves `:target`; the reduced-motion rule suppresses
   the pulse. No code changed for the follow *action*. A cold-deep-link gap surfaced during this
   QA (a copied `#fr-node-<id>` did not restore the followed node, because the field record's
   follow web is built async after a fetch — the node is absent at the browser's load-time
   fragment resolution) and was then **fixed** (see R1 below): the D8 restorability claim for the
   follow primitive now holds on the async surface. Session diaries:
   `.agents/sessions/2026-07-05-m36-browser-qa.md`,
   `.agents/sessions/2026-07-05-follow-deeplink-restore.md`.
2. **M39** — closed with a **recorded plan revision**: the original plan named `src/main.js`;
   the milestone deliberately did **not** touch it, because a subject-carrying affordance on the
   cinematic surface would violate D3 (affordance-sink). The cinematic place *is* the subject;
   other surfaces link *into* it carrying `?subject=`. The revision is correct and the D1
   objective is fully met.
3. **M40** — **implementation** closed and headless-verified (pure fragment↔claim mapping,
   inline restore script syntax-checked, ids stamped, coexists with `?subject=`). Its runtime
   behaviors — deep-link `#claim-N` restore, back/forward retrace, `hashchange` handling — are
   **not yet exercised in a browser**. This is the single most browser-dependent acceptance in
   the roadmap and is the primary content of **R1**.

---

## Remaining work (the live roadmap)

These are **not** new milestones (opening a new `M` requires a Chief Architect ruling). They
are the closeout items an autonomous headless process structurally cannot supply. None is new
architecture.

### R1 — Browser / visual QA of the realized grammar — ✅ CLOSED (2026-07-05)

Open a real browser against the built `dist/` and confirm the interaction behaviors that were
only verified headlessly:

- **M40 (primary): ✅ DONE (browser-verified 2026-07-04).** Driven against `dist/` served by
  `vite preview` on the EPR evidence ledger. All four behavioral criteria confirmed: a deep link
  `#claim-N` opens the addressed claim on load; opening a claim (real summary click) writes
  `#claim-N` and adds exactly one history entry; `back`/`forward` retrace (re-opening the
  addressed claim via `hashchange`); `?subject=<placeId>#claim-N` coexist — subject restored from
  the query, interrogation from the fragment, and closing a claim drops the fragment while
  preserving `?subject=`. The existing implementation satisfied every criterion; no code change
  was required. Session diary: `.agents/sessions/2026-07-04-m40-browser-qa.md`.
- **M36 (primary): ✅ DONE (browser-verified 2026-07-05).** Driven against `dist/` on the EPR
  field record. Follow renders as 20 same-depth lateral edges; a follow activation sets
  `#fr-node-<id>`, matches `:target` (accent-soft background), runs the `fr-follow-pulse`
  animation, moves a11y focus to the node, and adds exactly one history entry; real Back/Forward
  retrace re-resolves `:target`; the reduced-motion media rule suppresses the pulse. Existing
  code satisfied every criterion; no code change. Session diary:
  `.agents/sessions/2026-07-05-m36-browser-qa.md`.
- **M37/M39: ✅ DONE (browser-verified 2026-07-05).** The `eke-subject` view-transition morph
  across a research→evidential / atlas→evidential descent, with the live `?subject=` resolution,
  was driven against `dist/` on the EPR place. `view-transition-name: eke-subject` confirmed
  identical on the research-article `h1`, the atlas field-record masthead `h1`, and the evidence-
  ledger `h1`; both descent paths (`notes/east-pacific-rise-tubeworm-chemosynthesis.html` →
  evidence ledger, and `atlas/epr-vents.html` → evidence ledger) navigated cleanly, carrying and
  resolving `?subject=east-pacific-rise` on each, with the place title carrying through unchanged
  and no console errors. (M39's subject-carry on the ascent links was confirmed present during the
  M40 pass.) Existing code satisfied every criterion; no code change. Session diary:
  `.agents/sessions/2026-07-05-r1-browser-qa-closure.md`.
- **M28 carryover: ✅ DONE (browser-verified 2026-07-05).** The final transition easing/timing
  polish item (the ~30-min browser item from `.agents/HANDOFF-eke-completion.md`) was exercised on
  the same two descent paths: the descent reads as one dip with the title carrying through and
  nothing else changing, matching the HANDOFF's stated acceptance. No defect found; no tuning was
  required or performed. Session diary: `.agents/sessions/2026-07-05-r1-browser-qa-closure.md`.
- **Cinematic purity: reconfirmed 2026-07-05.** `grep -rl view-transition dist/assets/*.css`
  matches only `render-narrative`/`field-record`/`atlas-index` (no `places-*.css`); `check-grammar`
  and `check-cinematic-grammar` both report all constraints holding on the real build.
- **Cold deep-link `#fr-node` restore (recorded 2026-07-05): ✅ FIXED (browser-verified
  2026-07-05).** Completes the D8 restorability claim for the *follow* primitive on the async
  field record: a copied `atlas/<place>.html#fr-node-<id>` now scrolls the addressed actor node
  into view and applies the same highlight/focus a follow click gives. The field record builds its
  follow web async after the archive fetch, so a cold `#fr-node-<id>` is absent at the browser's
  load-time fragment resolution (native `:target`/scroll never fire); the renderer now reveals the
  addressed node after `buildSources()`. Implemented with a new pure fragment↔dom-id mapping
  `src/atlas/follow-url.js` (`followDomIdFromHash`) — the single definition shared by the click
  handler and the on-load restore — with a Node test `scripts/follow-url.test.mjs` (15 checks;
  round-trip, non-follow fragments ignored) wired into `verify`. Warm follow + Back/Forward
  unregressed (verified). Diary: `.agents/sessions/2026-07-05-follow-deeplink-restore.md`.

**R1 is closed.** Every item is now browser-verified: M36 and M40 (2026-07-04/05), the async
cold-restore edge (fixed 2026-07-05), and the M37/M39 subject morph + M28 easing polish (browser-
verified 2026-07-05, no implementation defect found, no code changed). No re-architecture was
required anywhere in R1. **R2 is now unblocked.**

### R2 — Merge M33–M40 to `main`

The entire Observatory v2 roadmap lives on `feat/exploration-prototypes-and-data-pipelines`;
`main` does not yet carry it. Merge after R1. The CI grammar gate (`.github/workflows/verify.yml`,
D10) already guards `main` against regression once merged.

### R3 — Out-of-roadmap Research-Curator DOI rigor

On the real corpus **every claim currently renders `open`** — all 38 binding sources are
unresolved citation strings (`SOURCE_UNRESOLVABLE` at L2). This is the honest state D7 was
built to expose, **not** a milestone defect. Upgrading `open` → `traceable` requires a Research
Curator to attach verified persistent identifiers (never invented DOIs), plus the still-open
Bates et al. (2005) citation (`PROJECT_STATUS.md` backlog 4) and the evidence-code field
awaiting TDWG placement. Curator-gated; not autonomous. Independent of R1/R2.

---

## Related architecture decision (outside D1–D10 scope)

**Not part of the Observatory v2 grammar or the M33–M40 closure above.** The Interaction Grammar
(D1–D10) governs the research/analytical/evidential surfaces only; it does not touch cinematic
camera mechanics. Recorded here only because this document is the project's canonical roadmap.

**WP8 — Sundarbans↔canvas interaction-model divergence: ARCHITECTURE DECISION COMPLETE
(RATIFIED 2026-07-05).** The Chief Architect ruling is recorded in
`.agents/decisions/2026-07-05-wp8-interaction-model-adr.md`: **Option A** — converge on
scroll-scrubbed Canvas2D; retrofit Sundarbans to match Crossing and East Pacific Rise. See
`PROJECT_STATUS.md` backlog item 3(a) for the corresponding status entry.

**Retrofit status: IMPLEMENTED.** `src/places/sundarbans.js`'s Movements (M1–M5) are now
driven by live scroll position (`camera(p)`-style, matching `crossing.js`/`epr-vents.js`)
rather than an autoplaying `gsap.timeline()`. WP8 is certified **PASS WITH WARNINGS**
(ADR Amendment 3, 2026-07-05) — see `PROJECT_STATUS.md` backlog items 3(a) and 5 for the
corresponding status and the one open warning.
