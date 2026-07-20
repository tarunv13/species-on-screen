# Book Architecture: Species on Screen

**Status:** design-only architecture for a future ~100-page A4 project book.
**Scope:** structure, sequencing, page distribution, dependency graph,
artifact-placement strategy, and explicit non-content. Not the book itself,
not a draft, not a marketing document.
**Audience:** future contributors and maintainers; readers approaching the
project after the current implementation phase; the project itself, as
institutional memory.

This file is the binding outline. Any future writing pass against it must
fit this structure or amend it.

---

## 0. What the book is, and is not

### 0.1 What it is

A sober systems document recording how the cinematic ecology emerged.
The project's intelligence is presently distributed across:

- four canonical doctrine files (`.kiro/steering/`),
- one operational architecture (`cinematic-language/platform-architecture.md`),
- a registry-backed narrative pipeline (`cinematic-language/narratives/`,
  `notes/*.html`, `narrative-registry.ts`, `scripts/check-narratives.js`),
- three cinematic places (`places/sundarbans.html`, `places/crossing.html`, `places/epr-vents.html`),
- one archival doctrine document (`cinematic-language/cinematic-principles.md`),
- two prototype review records (`prototypes/reviews/`),
- one advisory findings document (`cinematic-language/depth-medium-findings.md`),
- and ~20 task directories under `.agents/tasks/` containing audits, plans,
  reviews, and proposals from the project's first eighteen months.

The book extracts what is durable from this corpus. It records the system
the way a journal records a long investigation: structure, sources,
decisions, rejections, and the residue.

Closest cousins in posture: The Long Now Foundation essays, Forensic
Architecture monographs, NFB Interactive catalogue notes, museum
exhibition catalogues for long-running shows.

### 0.2 What it is not

- Not a portfolio piece.
- Not a process diary.
- Not a startup retrospective.
- Not an "AI-assisted development" memoir.
- Not generic UX writing.
- Not a manifesto.
- Not a mood-board.
- Not a coffee-table object.
- Not a tutorial in cinematic web design.

If a section in the outline below cannot be written without slipping into
one of these registers, the section is wrong, not the constraint.

### 0.3 Voice

Same documentary register as the project itself. Third-person about the
system. Present-tense for what the system is; present-perfect for what
has happened to it. No first-person plural ("we" / "the team" / "we
built"). No second-person address. No exclamation. No marketing register.
No project tagline. (Editorial-voice Canons I, II, XII, XIII, XV bind the
book.)

---

## 1. Page budget and macroscopic shape

Total: ~100 A4 pages, 12pt body, generous margins, 400–500 words per page,
~45,000 words.

| Block | Pages | Cumulative |
|---|---:|---:|
| Front matter | 5 | 5 |
| Part I — Foundations | 9 | 14 |
| Part II — The Cinematic Language | 16 | 30 |
| Part III — Editorial Voice | 8 | 38 |
| Part IV — Pacing | 7 | 45 |
| Part V — Platform Architecture | 8 | 53 |
| Part VI — The Narrative Pipeline | 7 | 60 |
| Part VII — Prototype Evolution | 7 | 67 |
| Part VIII — Failed Directions and Reversals | 5 | 72 |
| Part IX — The Anti-Pattern Catalogue | 4 | 76 |
| Part X — Perceptual Findings | 5 | 81 |
| Part XI — Technical Implementation Decisions | 4 | 85 |
| Part XII — Publication-Readiness | 3 | 88 |
| Part XIII — Unresolved Tensions | 4 | 92 |
| Appendices A–G | 7 | 99 |
| Back matter | 1 | 100 |

The proportions are intentional. The doctrinal core (Parts I–VI) is just
over half the book. The historical and reflective sections (VII–XIII)
are a third. Reference material is the remainder. There is no
introduction longer than five pages; there is no conclusion. The book
ends at the unresolved tensions and the appendices.

---

## 2. Reading-order graph

Front matter is read first. Part I is read second. The remainder may be
read in topical order.

```
                 Front matter
                      │
                      ▼
             Part I — Foundations
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
       Part II      Part III      Part IV
   (Cinematic)   (Editorial)     (Pacing)
        │             │             │
        └──────┬──────┴──────┬──────┘
               ▼             ▼
            Part V        Part VI
        (Architecture) (Narrative Pipeline)
               │             │
               └─────┬───────┘
                     ▼
        ┌────────────┼────────────┐
        ▼            ▼            ▼
     Part VII     Part VIII     Part X
  (Prototypes) (Reversals) (Perceptual)
        │            │            │
        └─────┬──────┴────────────┘
              ▼
           Part IX
       (Anti-Patterns)
              │
              ▼
           Part XI
   (Technical Implementation)
              │
              ▼
          Part XII
   (Publication-Readiness)
              │
              ▼
         Part XIII
       (Unresolved)
              │
              ▼
          Appendices
```

Every Part may be read on its own once Part I is read. Cross-references
between Parts are by Article / Canon / Principle / Reference number,
never by chapter title alone.

---

## 3. Classification scheme

Each Part is tagged below with one or more of:

- **foundational** — establishes the framework on which later parts depend.
- **operational** — codifies binding rules; the project's working law.
- **archival** — preserves a record of what the project once was, did, or
  rejected.
- **reflective** — extracts findings from concrete artifacts (prototype
  reviews, audits) without re-asserting them as doctrine.
- **reference-only** — appendix or apparatus; not read sequentially.

The five categories matter because they govern what the book does *not*
do. Operational sections must not slip into reflection. Reflective
sections must not silently amend the operational doctrine. Archival
sections must not be cited as binding.

---

## 4. Front matter (5 pages)

| Page | Content |
|---:|---|
| i | Half-title |
| ii | Title page; year of compilation; the word *Species on Screen* |
| iii | Publication note: this is a record, not a guide; binding doctrine lives in the repository, not in this book |
| iv | Contents (Parts I–XIII, Appendices A–G) |
| v | Citation conventions: Article (cinematic), Canon (editorial), Principle (pacing), Reference (intuition); how the book cites itself; how it cites the repository |

The front matter contains no introduction, no preface, no acknowledgements,
no foreword, no dedication. The publication note is one paragraph and is
the only prefatory prose in the book.

**Class:** foundational + reference-only.

---

## 5. Part-by-part outline

For each Part: purpose; why it matters; classification; estimated pages;
contents; reproductions; dependencies; redundancy risks; what stays out.

---

### Part I — Foundations (9 pages)

**Purpose.** Establish the four-axis framework that the book and the
project both rest on: subject, doctrine layer, operational architecture,
archival record. After this Part, the reader has the conceptual map.

**Why it matters.** Every later Part presupposes this map. Without it,
Parts II–IV read as four parallel rule-books rather than as one
constitutional layer with four axes.

**Class.** foundational.

**Contents.**

- §1 Subject — what the project is investigating: species on screen, in
  habitat, with sources. One page.
- §2 The constitutional layer — the four canonical steering files as the
  perceptual / editorial / temporal / intuitional authority. Two pages.
- §3 The operational layer — `platform-architecture.md` and the three
  surfaces. One page.
- §4 The archival layer — what `cinematic-principles.md` was, what it
  became, why it remains on disk. One page.
- §5 The doctrine fracture and consolidation — the moment of two parallel
  doctrine sets, the audit that named it, the proposal that resolved it,
  the consolidation that executed. Two pages.
- §6 Citation as architecture — Articles, Canons, Principles, References
  as stable identifiers. Why the project cites by Roman numeral. One page.
- §7 Restraint as identity — the single sentence the rest of the book
  presumes. One page. *This is the only section in the entire book that
  argues for restraint as a posture; subsequent sections assume it.*

**Reproduces.**
- The four-line summary of each canonical steering file's authority
  (from `2026-05-25-doctrine-resolution-proposal.md` §1).
- The dependency diagram of the doctrine layer.

**Depends on.** Nothing. Read first.

**Redundancy risk.** The argument for restraint appears across the
doctrine. This Part makes the case once; later Parts must not.

**What stays out.** Any "philosophy of design" prose. Any "we believe."
Any quotation of inspirational sources without operational consequence.

---

### Part II — The Cinematic Language (16 pages)

**Purpose.** Document the seventeen Articles and their grammar. This is
the longest Part because the cinematic vocabulary is the most-cited and
the most-contested layer of the doctrine.

**Why it matters.** Every visual decision in the project has been
adjudicated against an Article in this list. A reader who understands
this Part can read a PR diff and predict its outcome.

**Class.** operational + foundational.

**Contents.**

- §1 The four lawful camera behaviours — Articles I–IV (Hold, Drift,
  Descent, Reveal). Five pages.
- §2 The forbidden gestures — the §3 list from `cinematic-vocabulary.md`,
  reproduced and annotated by which prototype review surfaced each one.
  Two pages.
- §3 Light, atmosphere, colour — Articles V–VIII; one page on saturation
  discipline; the chromatic budget. Three pages.
- §4 Composition and the atmospheric hierarchy — Articles IX, X, XVII.
  *Article XVII is treated here because its existence is itself a record
  of consolidation: the only doctrinal amendment produced by the
  consolidation pass.* Two pages.
- §5 Globe, safari, post-processing, type, sound — Articles XI–XVI.
  Compact. Three pages.
- §6 The Descent: anatomy of the signature movement — the four phases,
  the timing envelope, the luminance dip, the cut at peak black. One
  page; the timing envelope itself is reproduced as a table (Appendix C).
  One page.

**Reproduces.**
- The full Articles I–IV in their canonical wording (camera doctrine).
- The forbidden-gestures list, verbatim.
- The Descent timing envelope (referenced; full table in Appendix C).
- A single annotated screenshot or diagram of the Descent's four phases.
  *No others.* The book does not become a screenshot reel.

**Depends on.** Part I.

**Redundancy risk.** Articles already gesture at editorial and pacing
material. The book defers those treatments to Parts III and IV; this Part
discusses only the visual grammar.

**What stays out.** Per-pixel rendering choices. Three.js scaffolding.
Easing-curve catalogues beyond the Descent's. Why bloom is tuned high; why
the particle ceiling is 1500. Those are repository concerns.

**Risk if over-explained.** The Descent's authority comes from its
four-phase grammar, not from any single timing value. Narrating each
ease-curve choice in book form turns Article III into an animation
cookbook. The book reproduces the table and otherwise leaves the Descent
alone.

---

### Part III — Editorial Voice (8 pages)

**Purpose.** Document the twenty-one Canons and the project's documentary
register.

**Why it matters.** The narrator is the project's most consistent failure
mode and its most consistent strength. Without this Part, the
forbidden-registers section reads as arbitrary.

**Class.** operational + foundational.

**Contents.**

- §1 The narrator — Canons I–II. The documentary register, the tense
  rules, the third-person posture. Two pages.
- §2 The species as subject — Canons III–IV. One page.
- §3 Quantitative restraint — Canons V–VI. *Why a statistic is a
  sentence, not a widget.* One page.
- §4 Citation as architecture — Canons VII–VIII. One page.
- §5 Cultural framing and the threat sentence — Canons IX–XI. One page.
- §6 Forbidden registers — Canons XII–XIV. The dashboard, marketing, and
  gamification prohibitions. *Synthesised here once*; Part IX
  cross-references rather than repeats. One page.
- §7 Microcopy and metadata — Canons XVII, XX, XXI. One page.

**Reproduces.**
- The natural-history register example pair (in voice / out of voice)
  from `editorial-voice.md` §2.
- The threat sentence example (Canon XI).

**Depends on.** Part I.

**Redundancy risk.** The forbidden registers list is the book's largest
duplication risk. Canons XII–XIV here, the §3 list in Part II, Principle
XIX in Part IV, and Part IX all touch it. This Part owns the editorial
formulation; the others cross-reference.

**What stays out.** Localisation procedure (Canon XIX preserves it;
procedural detail is repository-only). Proper-noun lists.

---

### Part IV — Pacing (7 pages)

**Purpose.** Document the twenty Principles and the project's three
temporal registers.

**Why it matters.** The most measurable layer of the doctrine. Reviewers
cite Principle III timing values in literal milliseconds.

**Class.** operational + foundational.

**Contents.**

- §1 The temporal worldview — Principles I–II. The three registers
  (planetary, transitional, local). One page.
- §2 The canonical Descent timing — Principle III. The full envelope
  table reproduced inline. *This is the single most-reproduced artifact
  in the book.* Two pages.
- §3 The Hold — Principles V–VI. One page.
- §4 Scroll cadence and reading time — Principles VII–IX. One page.
- §5 Re-entry, loading, errors — Principles X–XIV. One page.
- §6 Reduced motion as parallel pacing — Principle XV. Half a page.
- §7 The forbidden tempo — Principles XIX–XX. *Dashboard tempo as the
  project's structural opposite.* Half a page.

**Reproduces.**
- The full Descent timing envelope table.
- The cadence-per-scene-type table from `pacing-principles.md` §10
  (referenced in Appendix C).
- The reading-time calibration table (Principle VIII).

**Depends on.** Part I; benefits from Part II §6 (Descent anatomy).

**Redundancy risk.** Principle XIX overlaps with Canons XII–XIV.
Cross-reference, do not repeat.

**What stays out.** Frame-rate budgets (Principle XVI mentions them; the
detail is repository-only).

---

### Part V — Platform Architecture (8 pages)

**Purpose.** Document the three-surface model and the bridge layer.
Operational doctrine over routing, runtime, and the asymmetry between
cinematic and research.

**Why it matters.** The single most under-cited piece of doctrine in PR
review, and the layer that catches "drift" most reliably. The
surface-compatibility matrix has decided more proposals than any other
single artifact.

**Class.** operational.

**Contents.**

- §1 The three surfaces — cinematic, research, bridge. One page.
- §2 Information compatibility with cinematic grammar — *the matrix.*
  The reproduced table from `platform-architecture.md` §5. One page.
- §3 The cinematic surface — what belongs inside; what does not. One page.
- §4 The research / archive surface — what it accommodates; library
  grammar. One page.
- §5 The bridge layer — asymmetry; why there is no in-page exit
  affordance from cinematic to research. Two pages.
- §6 Operational requirements — separate URL spaces, separate runtime
  modules, separate page templates. One page.
- §7 Architectural never-rules — the §8 list, reproduced and grouped.
  One page.

**Reproduces.**
- The surface-compatibility matrix (Appendix E).
- The architectural never-rules, verbatim.
- A diagram of the three surfaces and the bridge.

**Depends on.** Parts I–IV.

**Redundancy risk.** Never-rules overlap with cinematic forbidden
gestures and editorial forbidden registers. The book treats them in
their respective Parts; Part IX synthesises.

**What stays out.** URL pattern specifics. Vite configuration. Build
output directory layout. Repository-only.

---

### Part VI — The Narrative Pipeline (7 pages)

**Purpose.** Document the schema, the ingestion workflow, the lifecycle,
the review checklist, and the build-time integrity checks. This is the
project's research-surface engine.

**Why it matters.** Every record after the first is added through this
pipeline. Future contributors will use this Part as the operational
reference; the doctrine binding it lives in Part III.

**Class.** operational.

**Contents.**

- §1 The schema — `EcologicalNarrative`. One narrative is one record. One
  page; full schema in Appendix D.
- §2 Source kinds and the evidence threshold — peer-reviewed, field
  report, camera trap, satellite imagery, oral account. Two pages.
- §3 The ingestion workflow — `narrative-ingestion-workflow.md` distilled
  to its operative form. One page.
- §4 Editorial fragments — the under-twelve-words rule; the no-naming
  rule; the no-conservation-register rule; example calibration. One
  page.
- §5 Lifecycle and the review checklist — draft → in_review → verified →
  published. One page.
- §6 Build-time integrity — `check-narratives.js`'s five invariants
  (id-filename match, duplicate ids, schemaVersion, archive-index drift,
  missing shells). One page.

**Reproduces.**
- The schema (Appendix D).
- The lifecycle table (referenced from `narrative-lifecycle.md`).
- The fragment calibration set: *every root is also a lung*; *a
  vertebrate kept at the speed of stone*; *the rain that fed it never
  fell in this century.*

**Depends on.** Parts I, III, V.

**Redundancy risk.** Editorial fragment rules overlap with Canons V, XI.
The book treats fragment construction here; the wider register is in
Part III.

**What stays out.** Per-narrative editorial body content. The narrator
of each record. Source URLs. Repository-only.

---

### Part VII — Prototype Evolution (7 pages)

**Purpose.** Reflective record of how the cinematic language was tested
against actual prototypes. Two prototype reviews exist on disk
(`sundarbans-descent-review-v1.md`, `sundarbans-descent-review-v2.md`);
the book extracts what they taught.

**Why it matters.** The doctrine in Parts II and IV did not arrive
abstractly; it arrived from concrete failures and survivals in
prototype. Without this Part, the operational rules read as decreed.

**Class.** archival + reflective.

**Contents.**

- §1 The Sundarbans descent: v1 — what was attempted, what worked, what
  did not. *The first canonical Descent.* Two pages.
- §2 The v1 → v2 pivot — depth-of-medium findings, "settle is not a
  tween," the discovery that ambient drift must persist past the end of
  any timeline. The most consequential single review in the project's
  history. Two pages.
- §3 The Sundarbans descent: v2 — what changed. One page.
- §4 The mangrove canonical descent spec — the doctrine's first test
  against a *new* place. The 2026-05-25 spec is itself a turning point:
  it shows that the four-phase grammar generalises. One page.
- §5 Counter-tests: alpine, salt-flat-exposure — what they were, what
  they tested, why they remain prototypes (excluded from production).
  One page.

**Reproduces.**
- The depth-medium findings core paragraph: *settles must end with
  motion still present, not eased to zero.*
- An excerpt from v2's pacing-principle list (the moment doctrine and
  practice met).

**Depends on.** Parts II, IV, X.

**Redundancy risk.** The findings overlap with Part X (Perceptual
Findings). This Part stays narrative-of-prototypes; Part X stays
abstracted.

**What stays out.** The full reviews. They live in the repository at
`prototypes/reviews/`. The book does not reproduce them; it extracts.

**Risk if over-explained.** The reviews are the project's confessional
form. Reproducing them in book form turns the book into a process diary
— the register the project most consistently rejects (Canon I). Extract,
do not transcribe.

---

### Part VIII — Failed Directions and Reversals (5 pages)

**Purpose.** Record the directions the project tried and reversed.
Without this Part, the present state reads as inevitable. It was not.

**Why it matters.** Future contributors will be tempted by the same
directions. The reversals are the durable lesson.

**Class.** archival + reflective.

**Contents.**

- §1 Family C — the legacy product-grade species pages. Ten species,
  full breadcrumb chrome, JSON-LD WebPage type, "Eco-Cinema Observatory"
  branding, Tailwind green on `style="color:#4ade80"`. The reversal:
  excluded from the production build, kept on disk for record. One and a
  half pages.
- §2 The Eco-Cinema Observatory brand register — the moment the project
  briefly named itself as a brand and then retired the gesture. Half a
  page.
- §3 The "by the numbers" temptation — Canon V's prohibition is named
  for a real episode. Half a page.
- §4 Drafts that did not promote — the records that reached `draft` and
  stayed there. The lifecycle's `draft → in_review → verified → published`
  is one-way in name; in practice records also retreat. Half a page.
- §5 Turning points: a register — *a numbered list, spare, of the
  moments that changed direction.* Two pages.

**Turning points named in §5 (the canonical list).**

1. The first descent prototype: cinematic redesign begins
   (task-cinematic-rebuild, 2025-01).
2. The v1 → v2 review pivot: depth-of-medium findings
   (2025-01-2x, the most consequential single document in the project's
   reflective layer).
3. The narrative-registry pipeline: research surface emerges as
   first-class architecture (task-multi-species-expansion → task-globe-
   immersion → task-consolidation-v1).
4. The 2026-05-24 homepage audit: the moment that named "publication
   readiness" as a category.
5. The 2026-05-25 repository audit and doctrine resolution proposal: the
   moment the parallel doctrine sets were named and resolved.
6. The publication-readiness remediation: Family C exclusion, archive-
   index reconciliation, prototype-policy resolution.
7. The doctrine consolidation: single canonical layer, Article XVII
   added, `cinematic-principles.md` archived.

**Reproduces.**
- The three publication fractures (titles only; detail in Part XII).
- The doctrine-resolution-proposal §3 status table.

**Depends on.** Parts II–V.

**Redundancy risk.** Anti-patterns sit closely; this Part records the
specific past episodes; Part IX abstracts.

**What stays out.** Specific PR numbers and commit hashes. Reviewer
identities. Failure narratives written in confessional register.

---

### Part IX — The Anti-Pattern Catalogue (4 pages)

**Purpose.** Synthesise the project's negative space. The doctrine has
six structural opposites; the book names them once, in one place.

**Why it matters.** The doctrine repeats its prohibitions across many
documents because each surface needs to know what it is not. The book
collects them so a reader can see the project's negative shape in a
single page.

**Class.** operational.

**Contents.**

- §1 The six anti-registers, each one page or less:
  1. The dashboard register.
  2. The marketing register.
  3. The gamification register.
  4. The encyclopedia register (a project-specific anti-pattern
     surfaced by the Family C reversal).
  5. Spectacle without subject (the teamLab/Awwwards risk).
  6. Abstract philosophy disconnected from perception.

Each anti-register entry contains: the project's term for it; the
canonical doctrine that prohibits it (Article / Canon / Principle
references); two operational tells; one historical episode.

**Reproduces.**
- Nothing in full; this Part is a synthesis.

**Depends on.** Parts II, III, IV, VIII.

**Redundancy risk.** This Part is itself the redundancy-handling
section. Other Parts cross-reference here.

**Risk if over-explained.** Each anti-register tempts a long essay on
*why* it is wrong. The book gives each one page maximum. The doctrine
already explains why; this Part lists.

---

### Part X — Perceptual Findings (5 pages)

**Purpose.** Distil the perceptual findings the project has accumulated:
discoveries about how cinematic ecology actually registers in human
attention. These are not doctrine; they are findings that produced
doctrine.

**Why it matters.** The doctrine without its findings reads as preference.
With them, it reads as worked-through.

**Class.** reflective.

**Contents.**

- §1 Settle as continuance, not stillness — the v1 → v2 finding. *The
  most consequential perceptual discovery in the project; the reason the
  ambient layer never resolves to zero.* One page.
- §2 The luminance-dip discipline — why the Descent's Crossing is hidden
  inside a luminance dip, not a clear frame. *The one finding the
  project would defend most strongly against engineering shortcuts.* One
  page.
- §3 Body-relative cues precede geographic cues — the discovery that
  named places land best after the place has already been felt as low,
  surrounded, humid, dim. The basis for Article XVII. One page.
- §4 Periphery fills before centre commits — the composition finding.
  One page.
- §5 Held darkness around photographs — Article VI's perceptual root.
  Half a page.
- §6 Reading-time as scroll governor — Principle VIII's perceptual root.
  Half a page.

**Reproduces.**
- The depth-medium findings document's central paragraph.
- A single phrase from each finding's source review.

**Depends on.** Part VII (which the findings emerged from).

**Redundancy risk.** Material here also appears in Parts II §4 (Article
XVII), VII §2 (v2 review). The Part frames the *findings as findings*;
the operational consequences live elsewhere.

**Risk if over-explained.** Each finding tempts elaboration into a small
essay on attention. The book gives each one page or less. The findings
are claims, not arguments.

---

### Part XI — Technical Implementation Decisions (4 pages)

**Purpose.** Record the technical decisions that have outlived their
implementation context and become institutional. Not the code; the
choices.

**Why it matters.** A future reimplementation in a different stack must
know which decisions are durable and which are incidental.

**Class.** operational + archival.

**Contents.**

- §1 The cinematic engine — what `CinematicEngine` is, what it
  guarantees (camera control, post-process budget, render-loop pause
  on visibility change), what it deliberately does not do. Half a page.
- §2 The narrative registry — `import.meta.glob` as the discovery
  mechanism; why narrative records are TypeScript files; why the
  registry runs at build time, not runtime; why malformed records are
  excluded silently and the build-time check is the loud channel. One
  page.
- §3 The build-time integrity check — `scripts/check-narratives.js`'s
  five invariant categories; why source-text validation rather than
  module import; why the check fails build rather than warning. One
  page.
- §4 Build separation — `vite.config.js` as the production-vs-prototype
  boundary; why `species/` and `prototypes/` are excluded from the build
  but kept on disk; why `places/`, `notes/`, and `atlas/` are the only
  canonical bundled surfaces. Half a page.
- §5 Three-surface separation in code — why `places/sundarbans.js` does
  not load `notes/render-narrative.js` and vice versa; the runtime
  module disjointness rule. Half a page.
- §6 Disposable details: a register — what is *not* durable. Half a
  page.

**Disposable details (the §6 list).**

- Specific easing-curve choices.
- Specific particle counts and bloom thresholds.
- Specific font choices and CSS custom-property names.
- Framework versions (Vite 8.x, GSAP, Three.js).
- The exact GSAP timeline composition of any single descent.
- The TMDB pipeline and its associated data files (legacy, not
  cinematically load-bearing).

**Reproduces.**
- The five invariant categories from `scripts/check-narratives.js`.
- The four-input shape of `vite.config.js` (main + places + notes + atlas).

**Depends on.** Parts V, VI.

**Redundancy risk.** Easy to drift into a code walk. The Part stays at
the level of decisions, not implementations.

**What stays out.** Code listings. Source files. Repository-only.

**Risk if over-explained.** Implementation detail dates faster than
doctrine. Over-explained, this Part becomes the most quickly-stale Part
in the book. The discipline is to record decisions, not lines of code.

---

### Part XII — Publication-Readiness (3 pages)

**Purpose.** Record what "limited public release" meant and how it was
reached. The 2026-05-24 homepage audit and the publication-readiness
remediation are a single coherent moment in the project's history.

**Why it matters.** The book is an artifact of *this* publication
moment; the publication discipline is part of the book's record.

**Class.** archival.

**Contents.**

- §1 The three publication fractures — Family C contamination, archive-
  index drift, public prototype exposure. *Named, not narrated.* One
  page.
- §2 The remediation — smallest viable interventions, doctrine
  preserved, no productionization creep. One page.
- §3 What "publishable in limited public form" meant — the standards the
  project chose to meet, and the standards it deliberately did not (no
  marketing site, no analytics, no share-affordances, no SEO chrome).
  One page.

**Reproduces.**
- The publication-readiness commit message (one of the rare full-artifact
  reproductions; the message captures the reasoning chain in one place).

**Depends on.** Parts V, VIII.

**Redundancy risk.** Material overlaps with Part VIII §1 (Family C). This
Part is short enough that the overlap is a single cross-reference.

**What stays out.** PR numbers (referenced in the apparatus, not in body
text). Reviewer commentary. Specific build hashes.

---

### Part XIII — Unresolved Tensions (4 pages)

**Purpose.** Name the tensions the project has not resolved and is not
trying to resolve. The book ends here, not in a conclusion.

**Why it matters.** The doctrine is internally consistent; the *project
in the world* is not yet. Future contributors arrive into the tensions,
not into the doctrine. Naming them sets the inheritance honestly.

**Class.** reflective.

**Contents.**

- §1 Drafts addressable by URL — `notes/<id>.html` shells exist for all
  registered narratives, including drafts; the index hides them but the
  shells remain. The book records the choice and the alternatives the
  project did not take. Half a page.
- §2 `public/data/*.json` as shared substrate — the legacy species data
  is mechanically read by the canonical globe, not by Family C alone.
  This is *not* a Family C residue; it is a substrate decision the
  project has not yet renamed. Half a page.
- §3 Audio (Article XVI) reserved — sound has been deferred since the
  first audit. The doctrine reserves the territory; the implementation
  has not arrived. Half a page.
- §4 Localisation (Canon XIX) reserved — the editorial voice claims
  English is the voice and the interface is not the voice; no second
  language has been attempted. Half a page.
- §5 Multi-place coherence — three cinematic places exist (Sundarbans, Crossing, East Pacific Rise vents).
  The doctrine generalises; the project has not yet tested the
  generalisation. The mangrove spec begins to. One page.
- §6 The two-doctrine-set risk in the future — the consolidation closed
  the present collision; the *governance* against future re-collision
  lives in the steering files' status headers, not in code. The book
  names the risk so the next architect inherits it. Half a page.
- §7 The book itself as a failure mode — books about restraint risk
  becoming the first project artifact that performs rather than reports.
  Half a page.

**Reproduces.**
- Nothing in full.

**Depends on.** Everything.

**Redundancy risk.** The Part is by nature a synthesis; the cost is
allowable.

**Risk if over-explained.** Each tension can be argued for pages. The
book gives each half a page. The reader's job is to inherit them, not to
have them resolved.

---

## 6. Appendices A–G (7 pages)

| App | Title | Pages | Class | Source |
|---|---|---:|---|---|
| A | Citation conventions and stable identifiers | 1 | reference-only | new |
| B | Articles, Canons, Principles, References — index | 2 | reference-only | derived from `.kiro/steering/` |
| C | The Descent timing envelope and the cadence-per-scene-type table | 1 | reference-only | `pacing-principles.md` §2, §10 |
| D | The `EcologicalNarrative` schema | 1 | reference-only | `cinematic-language/ecological-narrative.example.ts` |
| E | The surface-compatibility matrix | 1 | reference-only | `platform-architecture.md` §5 |
| F | Glossary of project-specific terms | 1 | reference-only | new |
| G | External references — works the project draws on | (no allocation; cross-reference to `experiential-references.md`) | reference-only | repository |

Appendices are reference-only and do not narrate. Appendix B is the
single most consulted page in the book. Appendix G deliberately lives
only in the repository; the book lists it by reference because
reproducing the experiential-references list would inflate the book and
its content is editable in ways the repository handles better.

**Glossary entries (Appendix F, indicative).**
*Article.* The cinematic-vocabulary citation token.
*Beat.* A single editorial moment in safari-scene cadence.
*Bridge.* The asymmetric, non-UI passage between cinematic and research
surfaces.
*Canon.* The editorial-voice citation token.
*Cinematic surface.* Surface 1 of the platform architecture.
*Continuance.* The state of motion that persists past the end of any
animated timeline.
*Crossing.* The third phase of the canonical Descent.
*Descent.* Article III; the project's signature movement.
*Family C.* The legacy product-grade species pages, excluded from
production at publication-readiness remediation.
*Fragment.* The single editorial element permitted to surface inside
cinematic space (Canons V, XI; ingestion workflow §3).
*Hold.* Article I; Principle V.
*Luminance dip.* The darkness inside which the Descent's Crossing cuts.
*Place.* A canonical cinematic surface; not a page.
*Principle.* The pacing-principles citation token.
*Reference.* The experiential-references citation token.
*Research surface.* Surface 2 of the platform architecture.
*Settle.* The fourth phase of the canonical Descent; never tweens to
zero.
*Threshold.* The moment of editorial commitment to a place, before the
Descent.

---

## 7. Back matter (1 page)

| Page | Content |
|---:|---|
| 100 | Colophon: typesetting, project URL, repository URL, the year of compilation, and one closing line: *the doctrine is in the repository.* |

The book has no afterword, no acknowledgements page, no biographical
note. The colophon names what produced the artifact and points back to
the live system.

---

## 8. Artifact-placement strategy

The book has three reproduction tiers.

**Tier 1 — reproduced in full.** Articles I–IV (camera doctrine);
Article XVII (atmospheric hierarchy); the forbidden-gestures list; the
Descent timing envelope; the `EcologicalNarrative` schema; the surface-
compatibility matrix; the lifecycle table; the architectural never-rules
list. These are reproduced because they are the project's most-cited
artifacts and a reader of the book without repository access must be
able to operate against them.

**Tier 2 — extracted, not reproduced.** Prototype reviews v1 and v2; the
2026-05-24 homepage audit; the 2026-05-25 repository audit and doctrine-
resolution proposal; the publication-readiness commit message; the
mangrove canonical descent spec. The book quotes operatively, paraphrases
sparingly, names the source. The full text lives in the repository.

**Tier 3 — referenced only.** All other task documents, all per-narrative
records, all source code, all configuration files, all per-PR review
prose. The book points; the repository holds.

The boundary between Tier 1 and Tier 2 is editorial, not procedural.
When in doubt, lower a tier.

**Image and figure placement.**
- One Descent timing diagram (Part II §6 / Part IV §2).
- One three-surfaces diagram (Part V §1).
- One narrative-pipeline diagram (Part VI §3).
- One Sundarbans descent v1 / v2 comparison (Part VII §2).
- One reading-order graph (front matter, page v).

That is five figures total. The book does not become a screenshot reel.
The cinematic surface is documented in word, not image; the visual
artifact is the live system.

---

## 9. Turning points: the canonical register

These seven moments deserve named treatment. Part VIII §5 lists them in
chronological order; later Parts cross-reference by name.

| # | Moment | Located in | Reproduces |
|---|---|---|---|
| 1 | First descent prototype | Part VII §1 | Tier 2 from v1 review |
| 2 | v1 → v2 pivot (depth-of-medium) | Part VII §2; Part X §1 | Tier 1 from `depth-medium-findings.md` |
| 3 | Narrative-registry pipeline | Part VI §1; Part XI §2 | Tier 1 schema (Appendix D) |
| 4 | Homepage audit (2026-05-24) | Part VIII §1; Part XII §1 | Tier 2 |
| 5 | Repository audit + doctrine proposal (2026-05-25) | Part I §5 | Tier 2 |
| 6 | Publication-readiness remediation | Part XII §2 | Tier 2 (commit message) |
| 7 | Doctrine consolidation | Part I §5; Part II §4 | Tier 1 (the four steering headers) |

These are the only seven moments tagged as *turning points* in the
book's apparatus. Other moments are recorded but not elevated.

---

## 10. Redundancy risks and how the book handles them

The doctrine is internally repetitive on purpose: each surface needs to
know what it is not. The book is not a doctrine reference; it is a
*record*, and the same repetition would inflate it past discipline.

| Repeated material | Doctrine homes | Book's home | Cross-references |
|---|---|---|---|
| Forbidden registers (dashboard / marketing / gamification) | Cinematic-vocabulary §3; Editorial-voice Canons XII–XIV; Pacing Principle XIX; Experiential-references §4 | Part III §6 (editorial formulation) | Part II §2; Part IV §7; Part IX |
| "Place precedes name" | Editorial-voice Canon I; Cinematic-vocabulary Article XIII; Pacing Principle III; Experiential-references §1; Cinematic-principles archival §1 | Part III §1; Part II §6; Part X §3 | each cites the others by Article/Canon number |
| Restraint as posture | Across all four steering files | Part I §7 (one page) | every later Part assumes |
| "Withheld is louder than present" | Cinematic-principles archival §6; gestured at across the trio | Part I §7 (one paragraph) | not elaborated elsewhere |
| The Descent | Cinematic-vocabulary Article III; Pacing Principle III; depth-medium-findings; v1/v2 reviews | Part II §6 (anatomy); Part IV §2 (timing); Part VII §1–§3 (history) | each Part owns its facet |
| Anti-patterns | Across multiple doctrine docs and reviews | Part IX (synthesis) | every Part above cross-references |

The architecture pre-resolves the redundancy. A reader hitting the same
material twice in the book is a sign the structure has slipped.

---

## 11. What stays out of the book

Five categories of repository content do not enter the book.

1. **Source code in full.** `src/` is repository-only. The book records
   the decisions; the code is the implementation.
2. **Per-narrative editorial bodies.** The narratives live in
   `cinematic-language/narratives/` and `notes/<id>.html`. The book
   names the schema and the workflow; the records are not reproduced.
3. **Build configuration.** `vite.config.js`, `package.json`,
   `.gitignore`. The book documents the production/prototype boundary
   as a decision; the configuration is repository-only.
4. **Internal task scaffolding.** `.agents/tasks/*` `task.json` and
   `context.json` files, FEAT-NNN.json files, per-task workflow
   metadata. The book references the task names where relevant; the
   scaffolding is invisible.
5. **PR-specific prose.** Review comments, line-by-line discussions,
   commit hashes. The book references commits by date and consequence;
   not by SHA.

---

## 12. What would weaken if over-explained

Six topics tempt elaboration; each has a soft maximum length in the
book.

| Topic | Soft maximum | Why |
|---|---|---|
| The Descent (Article III) | 2 pages (anatomy) + 1 timing table | Authority is in the four-phase grammar; further narration becomes an animation cookbook |
| The "withheld is louder than present" principle | 1 paragraph | Elaboration defeats the principle |
| The forbidden-gestures / Canons / never-rules lists | 1 page each, by surface | Listing is precise; analysing each entry psychologises |
| The hero copy / page-caption / fragment construction | 1 page | The rules already in Canons V, XI suffice; tutorialising tools the project rejects |
| The biome palette doctrine | 1 paragraph in Part II §3 | Past one paragraph it becomes a brand guideline |
| The Settle finding ("not a tween") | 1 page in Part X §1 | Elaboration into a theory of attention is the book's largest risk |

Where a topic exceeds its soft maximum, the writing pass against this
architecture should re-distribute or cut, not amend the soft maxima
upward.

---

## 13. What is intentionally undocumented

Three categories of project material are intentionally not written into
the book.

1. **Internal editorial reasoning per narrative.** Why a specific
   fragment was chosen over its alternatives. The fragment stands; the
   discarded options live nowhere.
2. **The author's relationship to the subject.** The project does not
   have an "auteur surface" (Reference 2.7 / Beuys). The book preserves
   the absence.
3. **Future plans.** The book ends at Part XIII (Unresolved Tensions),
   not at a roadmap. Roadmap content is operational and lives in
   `.agents/tasks/` where it can be revised; in book form it would
   either be wrong by the time of publication or, worse, would commit
   the project to a future it has not chosen.

---

## 14. Production discipline

Notes for any future writing pass against this architecture.

- The page budget is binding to within ±10%. Any Part that exceeds its
  budget by more than two pages is a structural failure; redistribute or
  cut.
- The voice is bound by the editorial canons (Canons I, II, XII, XIII,
  XV in particular). PR-style review applies to chapter drafts.
- Citations within the book use the project's own system (Article /
  Canon / Principle / Reference). External citations follow Canon VII
  (named, dated, sourced).
- Figures cap at five (§8 above). New figure proposals require an
  amendment to this architecture.
- Reproductions are tiered (§8 above); promotions across tiers require
  an amendment to this architecture.
- Turning points are seven (§9 above); promotions to *turning point*
  status require an amendment to this architecture.

---

## 15. Status of this document

This file is the architecture, not the book. It defines:

- structure and sequencing,
- page distribution,
- the tier-system for reproductions,
- the canonical turning-point register,
- the redundancy-handling map,
- the soft-maximum table,
- the intentionally-undocumented register,
- and the production discipline.

A future writing pass against this architecture begins by amending or
ratifying this file, not by drafting prose.
