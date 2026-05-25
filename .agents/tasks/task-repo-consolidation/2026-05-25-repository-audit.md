# Repository Consolidation Audit

**Date:** 2026-05-25
**Scope:** repo-wide, structural and editorial
**Output:** observations only — no code changes, no file moves, no doctrine
merges, no architecture redesign in this pass

This document is a stabilization read-through before production
infrastructure work begins. It names what is duplicated, what is drifting,
and what a future contributor (human or agent) is most likely to misuse.
It is **not** itself a doctrine document and must not be cited in PR
reviews.

If a section here ever becomes the basis for a binding rule, it has
escaped the audit and should be promoted, in writing, into the
appropriate canonical document.

---

## 1. Duplicated concepts

Concepts that are described in more than one place under different names,
in roughly decreasing severity:

1. **"What cinematic motion is allowed to do."** Defined in
   `.kiro/steering/cinematic-vocabulary.md` as Articles I–IV (Hold,
   Drift, Descent, Reveal) **and** in
   `cinematic-language/cinematic-principles.md` §1, §5, §8 ("Cinematic
   Ecology Principles", "Non-Spectacular Motion Principles", "Transition
   Philosophy"). Same subject, two vocabularies. The Articles are
   numbered Roman; the principles are numbered Arabic. A future agent
   citing "Article III" will find no Article III in
   `cinematic-principles.md`, and vice versa.
2. **"How long things take."** Defined in
   `.kiro/steering/pacing-principles.md` (Principles I–XVI+, with
   millisecond envelopes) **and** in
   `cinematic-language/cinematic-principles.md` §2 ("Ecological Pacing
   Rules"). The two documents agree on intent and disagree on
   granularity. The steering doc is the only one with concrete numbers.
3. **"What must never happen inside cinematic space."** Listed as
   forbidden gestures in `cinematic-vocabulary.md` §3, as restraint
   rules in `cinematic-principles.md` §6, and again as
   never-rules in `platform-architecture.md` §8. Three near-identical
   lists. None cross-references the others.
4. **Failure modes.** `cinematic-principles.md` §11 names them. The new
   `narrative-ingestion-workflow.md` §7 names them again for a different
   surface. They are different lists for different surfaces, but a
   future contributor reading either in isolation may believe it is the
   only such list.
5. **A frozen schema and three example narratives.** Co-located in
   `cinematic-language/ecological-narrative.example.ts`. The `.example`
   suffix understates the file's role: it is the **only** definition of
   the v1 narrative interface in the repo. Documented inside the file,
   but the filename invites deletion.

## 2. Overlapping doctrine files

Two parallel doctrine sets with overlapping scope and conflicting
statuses:

| Doctrine set | Files | Lines | Header status |
|---|---|---|---|
| `.kiro/steering/` | `cinematic-vocabulary.md`, `editorial-voice.md`, `pacing-principles.md`, `experiential-references.md` | 1791 | "provisional constitutional guidance pending the first milestone review walks" |
| `cinematic-language/` | `cinematic-principles.md`, `platform-architecture.md`, `depth-medium-findings.md` | 519 | "canonical governance" / "canonical, operational" |

Both apply to the same project. Both are auto-included into agent
context (`.kiro/steering/*.md` is `inclusion: always`;
`cinematic-language/*.md` is referenced from
`ecological-narrative.example.ts` and from the new
`narrative-ingestion-workflow.md`). Neither references the other. Both
contain a "Final Authority" / "Authority" clause.

**Concrete consequences:**

- A reviewer can cite *either* "Article III" *or* "Principle 1" for the
  same point and both citations look load-bearing.
- A future agent generating new code will learn the rules from whichever
  doctrine set it sees first; the project has no canonical reading
  order.
- The `provisional` vs `canonical` status mismatch means a contributor
  who reads `cinematic-language/` first will treat the steering files as
  drafts, while a contributor who reads `.kiro/steering/` first will
  treat the cinematic-language files as elaboration. Both are wrong.

**Specific overlapping pairs that will eventually need reconciliation
(do not reconcile now):**

- `cinematic-vocabulary.md` ↔ `cinematic-principles.md`
- `pacing-principles.md` ↔ `cinematic-principles.md` §2
- `editorial-voice.md` ↔ `narrative-ingestion-workflow.md` §3
  (fragment rules)
- `experiential-references.md` ↔ `cinematic-principles.md` §0–1
  (premise / structural commitments)

## 3. Naming inconsistencies

- **Module casing in `src/prototypes/`.** Mixed PascalCase and
  kebab-case. Class modules: `Terrain.js`, `SkyDome.js`, `CloudSea.js`,
  `MangroveCanopy.js`, `MangroveRoots.js`, `MangroveWater.js`. Entry
  modules: `alpine.js`, `mangrove.js`, `salt-flat-exposure.js`,
  `sundarbans-descent.js`. The split (Pascal for classes, kebab for
  entry points) is internally consistent, but the alpine prototype
  uses **generic** class names (`Terrain`, `SkyDome`, `CloudSea`) while
  the mangrove prototype uses **prefixed** ones (`MangroveCanopy`,
  `MangroveRoots`). A future contributor adding alpine-specific
  vegetation will not know whether to call it `Vegetation.js` or
  `AlpineVegetation.js`.
- **Date prefixes vs version suffixes vs neither.** Three conventions
  for time-stamping documents:
  - `.agents/tasks/task-mangrove-prototype/2026-05-25-canonical-...md`
    (date prefix)
  - `prototypes/reviews/sundarbans-descent-review-v1.md` (version
    suffix)
  - `cinematic-language/depth-medium-findings.md` (neither)
- **TypeScript file in a JavaScript codebase.**
  `cinematic-language/ecological-narrative.example.ts` is the only
  `.ts` file in the project. Vite handles the import transparently, but
  a future contributor may interpret it as a signal that the project is
  TypeScript and add more.
- **The `.example` suffix.**
  `cinematic-language/ecological-narrative.example.ts` is named like a
  fixture but functions as the canonical schema definition. The two
  stress-test exports added in PR #49 inherit this misleading filename.

## 4. Folder drift

- **Two review homes.** `prototypes/reviews/sundarbans-descent-review-v{1,2}.md`
  hold cinematic-system reviews; `.agents/tasks/task-*/...-review.md`
  hold task-workflow reviews. The genres are arguably different but
  share enough vocabulary that future contributors will not know where
  a new review belongs.
- **Two narrative homes.** `species/*.html` (10 pages, full-featured)
  is the legacy species directory; `notes/sundarbans-bengal-tiger-saline-swimmer.html`
  (1 page) is the new research-surface home introduced by the canonical
  narrative work (PR #45). No file states whether `species/*` is
  deprecated, scaffolding, or canonical alongside `notes/`. The
  homepage doctrine collapsed everything to the Sundarbans tiger; the
  other 9 species pages remain reachable by URL but are no longer the
  homepage's concern.
- **Two species-data homes.** `public/data/*.json` (10 files) feeds the
  legacy species pages; `cinematic-language/ecological-narrative.example.ts`
  is the canonical schema for the new pipeline. Both contain
  Sundarbans tiger data in incompatible shapes.
- **`scripts/`** contains exactly one file (`fetch-tmdb-data.js`) with
  no README. `editorial-voice.md` Canon VIII references "the TMDB
  pipeline"; no document records whether the pipeline is still in use.
- **`narrative-ingestion-workflow.md` placement** (added by PR #49).
  Lives in `cinematic-language/` even though it governs a
  research-surface workflow. Defensible because the schema lives there
  too, but a future contributor looking for "how to write a narrative"
  may not look in `cinematic-language/`.

## 5. Prototypes that should become canonical

- **`prototypes/sundarbans-descent.html`** + `src/prototypes/sundarbans-descent.{css,js}`.
  This is no longer a prototype. PR #45 wired it into the canonical
  narrative pipeline: it imports
  `cinematic-language/ecological-narrative.example.ts` and renders
  three fields (`place.name`, `place.editorialPlaceLine`,
  `editorial.fragment`) into the cinematic surface. The descent timeline,
  the parallax engine, the audio bed, the inscription stillness
  accumulator, and the M5 continuance pattern are the canonical
  cinematic surface. A future contributor who treats it as a
  rebuildable experiment will retire functionality that is now load-bearing.
- **`src/prototypes/SkyDome.js`, `Terrain.js`, `CloudSea.js`.** Used
  only by the alpine prototype (a stress-test, see §6) but their
  internals — gradient sky, ridged-FBM terrain, alpha-tested cloud
  plane — are general primitives. Their name and location say "alpine
  one-off"; their behavior says "atmospheric building blocks." Worth
  flagging that *if* a future scene needs any of them, they should be
  promoted out of `src/prototypes/`, not duplicated.
- **`src/cinematic-engine.js`** is already canonical (imported by
  `main.js` and prototype bootstraps). No drift; mentioned only to
  confirm it is the correct location for engine code.

## 6. Temporary experiments that should stay isolated

- **`prototypes/alpine.html`** + supporting modules. PR #31's verdict
  is explicit: "single dead-end prototype." Success criterion is
  whether it reads as a held documentary aerial. Not a target for
  further development. Should remain in `prototypes/` indefinitely.
- **`prototypes/mangrove.html`** + supporting modules. PR #33's
  posture: "peer-test to alpine." Proves the implicit biome-language
  framework generalises; not a product surface. Note that the
  *mangrove* in this prototype is a different artifact from the
  *Sundarbans descent* — both are mangrove-themed, but the former is a
  technical stress-test and the latter is the canonical descent. The
  filename collision is a real misuse risk.
- **`prototypes/salt-flat-exposure.html`** + supporting modules.
  PR #41/#47's posture: counter-test for the UI burial grammar.
  Currently builds M1+M2+M3 (per #47). The descent is unfinished by
  design; it is a grammar test, not a target product surface.
- **`prototypes/reviews/sundarbans-descent-review-v{1,2}.md`** are
  isolated correctly under `prototypes/reviews/`. No action.

## 7. Files future contributors are most likely to misuse

Ranked by predicted likelihood of harm. Each entry is a concrete,
named risk.

1. **`.kiro/steering/cinematic-vocabulary.md` and
   `cinematic-language/cinematic-principles.md`** — the parallel
   cinematic-doctrine pair. Highest misuse risk in the repo. A future
   PR will eventually argue against itself by citing both.
2. **`cinematic-language/ecological-narrative.example.ts`** — the
   `.example` suffix invites deletion or duplication. A contributor
   adding a second narrative may either copy the entire file (instead
   of adding an export) or treat the schema as an example to riff on.
3. **`species/*.html` (10 files) and `public/data/*.json` (10 files)** —
   the legacy species directory. Looks canonical. A contributor adding
   a new species will likely follow this pattern instead of the
   `cinematic-language/ecological-narrative.example.ts` →
   `notes/<id>.html` path the canonical narrative work introduced.
4. **`prototypes/sundarbans-descent.html`** — looks like a prototype,
   functions as the production cinematic surface for the canonical
   narrative. See §5.
5. **`prototypes/mangrove.html`** vs the Sundarbans-mangrove descent —
   filename collision risk. A future contributor told "expand the
   mangrove work" must be told *which* mangrove.
6. **`scripts/fetch-tmdb-data.js`** — undocumented, single-purpose,
   referenced obliquely in editorial-voice doctrine. A contributor
   may either run it expecting current data or delete it expecting
   dead code. Both wrong without context.
7. **`cinematic-language/depth-medium-findings.md`** — labeled
   "experimental findings, advisory." Very easy to mistake as a
   binding doctrine document because of the heading style and its
   neighbors. If it ever shapes a PR review, it has been misused.
8. **`narrative-ingestion-workflow.md`** (just added in PR #49) —
   risk profile is currently unknown. The contemporaneous risk: a
   future contributor cites its rejection criteria (§6) as if they
   were schema-level constraints, locking out narratives the schema
   would actually accept.

---

## Cross-cutting observations

- The repo has roughly **2,300 lines of doctrine markdown** before any
  consolidation. Most of it is good. The risk is not its content but
  its **distribution across two folders with overlapping authority**.
- "Provisional" appears as a status word in all four
  `.kiro/steering/*.md` headers. "Canonical" appears in three
  `cinematic-language/*.md` headers. Neither word has a defined
  promotion path.
- Eight species pages (`species/african-elephant.html` through
  `species/staghorn-coral.html`, excluding the tiger) are reachable by
  URL but unreferenced from the homepage and unconnected to the
  canonical narrative pipeline. They are functionally orphaned.

---

## Suggested order of operations (for a future cleanup PR, **not
this one**)

This audit recommends nothing be merged or moved in this pass. When the
cleanup work begins, the order that minimizes regret:

1. **Resolve the doctrine duplication first.** Decide which folder is
   canonical. Migrate or merge the other. Establish a single
   authority and a single citation vocabulary.
2. **Decide the legacy species fate.** Either declare `species/*.html`
   and `public/data/*.json` deprecated and schedule removal, or
   declare them canonical alongside `notes/` and document the
   relationship.
3. **Promote `sundarbans-descent` out of `prototypes/`.** Rename to
   reflect its production status. Move associated source modules
   accordingly.
4. **Standardize naming.** Pick one casing convention for prototype
   modules. Pick one date/version convention for documents. Apply
   uniformly.
5. **Document `scripts/fetch-tmdb-data.js`** or retire it.
6. **Re-examine the `.example.ts` suffix** on the schema file.

---

## What this audit deliberately does not do

- Does not propose new architecture.
- Does not merge any doctrine files.
- Does not move any code.
- Does not rename anything.
- Does not establish new conventions.
- Does not retire any file, including the orphaned species pages.
- Does not introduce a "consolidation roadmap," "cleanup phase," or
  "v2 doctrine."
- Does not become a steering file. This document lives at
  `.agents/tasks/task-repo-consolidation/` for the same reason
  `task-homepage-audit/2026-05-24-homepage-review.md` lives there: it
  is observation, not law.
