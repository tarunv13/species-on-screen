# Project Operating Manual — Eco-Cinema Observatory

**Purpose.** The canonical, top-level manual for *operating* this repository: where the
governing documents live, how work is selected and verified, and the constraints every
change must respect. It is an **index and procedure**, not new doctrine — it points to the
existing canonical sources and does not duplicate them (the project keeps a strict
single-source-of-truth discipline; see M27). If this manual and a source it points to ever
disagree, **the source wins**.

**Status.** Canonicalizes the previously conversation-only "Operating Manual" into the
repository (same transcription pattern the M33 session used for the Observatory v2 roadmap).
No architecture is introduced here.

---

## 1. Canonical governance map (single source of truth)

| Concern | Canonical source | Notes |
|---|---|---|
| **Constitution** (design law) | `.kiro/steering/` — `cinematic-vocabulary.md` (Article I–XVII), `editorial-voice.md` (Canon I–XXI), `pacing-principles.md` (Principle I–XX), `experiential-references.md` (Reference); + `cinematic-language/platform-architecture.md` | Binding on the cinematic + editorial surfaces. Frozen — amend by formal amendment only. |
| **Architecture Index** | `PROJECT_STATE.md` | Engineering map: two-surface asymmetry, stack, doctrine index (§4), repo layout (§5). |
| **AI Operating System** (roles, pipeline, Technical Lead protocol) | `.agents/AI-OS.md` | Frozen constraint. The role/decision-authority framework and the session protocol §"Technical Lead Mode". |
| **Observatory v2 Roadmap** | `OBSERVATORY_V2_IMPLEMENTATION.md` | Frozen grammar + D1–D10; M33–M40 closure record; live remaining work R1–R3. |
| **Implementation Blueprint** | `IMPLEMENTATION_BLUEPRINT.md` | Retrospective execution detail beneath the roadmap: per-milestone modules/reuse/never-touch, dependency graph, critical path, shared-file conflict surface, rollback unit. Descriptive, not binding — the roadmap's closure table remains the source of milestone status. |
| **Status** | `PROJECT_STATUS.md` | Updated only when a milestone state changes. |
| **Session diaries** | `.agents/sessions/YYYY-MM-DD-<topic>.md` | One per session. |
| **Decisions** | `.agents/decisions/YYYY-MM-DD-<ruling>.md` | Written only when a ruling is made. |
| **Thoughts** | `.agents/thoughts/YYYY-MM-DD-<slug>.md` | Durable pre-resolution reasoning upstream of Tasks/ADRs/milestones. Read-only once promoted; feeds the canonical artifacts, never duplicates them. See `.agents/decisions/2026-07-07-thought-system.md`. |
| **Product decisions** | `docs/PRODUCT_DECISIONS.md` | Concise, stable register of approved/proposed experience decisions, keyed by stable IDs (D-numbers). Reader-facing index of product-level decisions; references an ADR when a decision also carries a full ruling, never restating it. See `.agents/decisions/2026-07-21-product-decisions-log.md`. |

The frozen-constraint documents (Constitution, Architecture Index, Knowledge Lifecycle,
Production / Capability / Workflow Architecture, AI Operating System) are **not re-read or
reinterpreted** during routine milestone work unless the AI Operating System explicitly
references them.

---

## 2. The one load-bearing idea

Two public surfaces plus a one-way bridge (`PROJECT_STATE.md` §2): the **cinematic** surface
(a film, not an app — no chrome, labels, counts, citations, or exit affordance) and the
**research / evidential** surface (journal/atlas/ledger — everything the cinematic surface
forbids). The asymmetry *is* the architecture; when unsure where something belongs, the answer
is almost always research. The cinematic surface is an **affordance-sink** (D3): it hosts no
depth affordance, and the grammar gate (D10) enforces this at build time.

---

## 3. Build & verification gate

The frozen acceptance bar for any change is **headless and green**:

- `npm run verify` — the full gate: 5 checks (`check-narratives`, `check-manifest`,
  `check-bindings`, `check-dwca-xml`, `check-grammar`) + 12 unit tests
  (`test:conformance`, `test:surface-links`, `test:biome-backdrop`, `test:dwca-xml`,
  `test:evidence-reach`, `test:interaction-web`, `test:follow-url`,
  `test:evidence-interrogate`, `test:cinematic-grammar`, `test:grammar`, `test:subject`,
  `test:interrogation-url`).
- `npm run build` — Vite build; `prebuild` runs the invariant gates
  (`check-narratives`, `check-manifest`, `check-bindings`, `check-dwca-xml`,
  `check-grammar`, `build:evidence`).
- CI: `.github/workflows/verify.yml` runs `npm run verify` on push/PR, with an explicit
  "Grammar gate (D10)" step.

Evidence HTML (`public/evidence/`, `dist/evidence/`) is **derived and git-ignored** —
regenerated every build, never a source of truth.

---

## 4. Milestone working protocol

The procedure for advancing the roadmap (mirrors the AI-OS Technical Lead session protocol):

1. Read `PROJECT_STATUS.md`, the Roadmap, and `git log`.
2. Determine the **earliest genuinely incomplete** milestone.
3. Verify all predecessor milestones are complete (their automated acceptance green).
4. Verify no existing implementation already satisfies the remaining acceptance criteria.
5. Implement **only** that milestone (or only its missing criteria if partial). Small,
   reviewable commits; green build after every logical change.
6. Verify (`npm run verify` + `npm run build`).
7. Update `PROJECT_STATUS.md` **only if a milestone state changes**; write a session diary.
8. Commit. **Stop** — do not continue to the next milestone.

Opening a **new** milestone (beyond the frozen roadmap) is an architectural act and requires
a **Chief Architect decision record** (`.agents/decisions/`); it is never done ad hoc.

---

## 5. Frozen-architecture constraints (every change)

- **No redesign, no architectural change** — implement within the frozen grammar (D1–D10)
  and doctrine.
- **Standards reuse over invention** — Darwin Core, OBO RO, GBIF, PROV/ECO; no new reason
  code, vocabulary, or schema without a ruling.
- **Single source of truth** — no duplicated metadata or dual sources (M27).
- **Cinematic purity** — no depth affordance on the cinematic surface (D3); the grammar gate
  (D10) enforces it.
- **Traceability, not truth** — the evidential surface reports the *reach* of a warrant,
  including honest non-resolution (D6/D7); never pass/fail.
- **No unrelated refactoring**; **reuse existing code wherever possible**.

**Operating principle** (`.agents/AI-OS.md`): *the repository advances through completed
production milestones, not through additional architectural documents.*

---

## 6. Documentation-canonicalization procedure

When an external document (a design-tool output, a conversation summary, a prior session's
artifact) proposes new repository content, apply this procedure before creating anything.
Absorbed from a 2026-07-07 governance review (`.agents/decisions/2026-07-07-documentation-governance-integration.md`)
that rejected a four-document parallel governance layer built without it.

1. **Verify before canonicalizing.** Check whether the source document — and everything it
   claims as a destination — actually exists in the repository (`git ls-files`, full-tree
   grep, direct file reads). Absence is a finding, not an assumption to paper over. Read the
   actual destination content and compare it, line by line where it matters, against what the
   external document claims; a citation to a section/Article/Canon/Principle number is a
   falsifiable claim. Never fabricate a reference frame — if a named document doesn't exist,
   say so and ask how to proceed rather than inventing its contents.
2. **Check the governance map first (§1).** Before proposing a new root-level file or
   top-level directory, confirm no existing tier in §1's table already owns that content
   class. If one does, the new material is routed there.
3. **Default to reference, never copy.** For any proposed content, decide one of: *reference*
   (destination already states this — point to it), *merge* (fold into an existing
   destination), *replace* (supersede stale content), *archive* (retire without deleting the
   historical record), or *standalone* (genuinely new, no existing destination — must be
   explicitly proposed, never silently inserted). Duplication across near-duplicate files
   (e.g. a second backlog, a second ownership table, a `.docs/` beside `docs/`) is the
   failure mode this step exists to catch.
4. **Sequence cheap-to-expensive when a queue is warranted.** Land mechanical, no-decision
   corrections first; batch same-file changes together; resolve any large structural question
   as its own gate before smaller additions land against it; batch every item awaiting
   maintainer-plus-Design approval into one review round; give explicitly deprioritized items
   their own place in the existing `PROJECT_STATUS.md` Backlog rather than a new file.
5. **Route the outcome through an existing tier, never a new artifact type.** Operational
   work items go in `PROJECT_STATUS.md`'s Backlog (lettered sub-items, in its existing
   style). A ruling that opens or closes an architectural question is a decision record under
   `.agents/decisions/`. A reusable procedure is absorbed as a section of this manual. No
   standing tracker, roadmap, or ownership file is created outside §1's map without its own
   decision record amending §1 first.

---

## 7. The dangling-reference defect class

**A reference that reads as authoritative and resolves to nothing.**

This is recorded as one named class rather than three lessons, because in a
single week it hit this repository from three different directions and each
time was mistaken for an isolated slip:

| instance | the reference | how it failed | how it was fixed |
|---|---|---|---|
| **A SHA in a status file** | `848b5e4`, `d6b7cbb` and ten others in `PROJECT_STATUS.md` | the 2026-09-11 history rebuild rewrote every commit; the cited SHAs no longer exist on any branch | the pre-rebuild → live crosswalk table at the top of `PROJECT_STATUS.md` |
| **A path in a steering doc** | `src/globe.js` in `.kiro/steering/atlas-living-glass.md`, and four comments in `src/atlas/atlas-globe.js` | the file was deleted when the entrance became a map; the prose kept naming it | repointed to `src/entrance-map.js` |
| **An enum value nobody migrated** | `arrival.kind: "globe-hotspot"` | would have stayed valid in the schema and the checker after the globe it named was gone | renamed to `entrance-hotspot` across schema, TS type, manifest row and `check-manifest.js` — renamed, never merely deprecated |

### The shared tell — this is the whole value of naming it

**It resolves locally, or it reads plausibly, so it passes review.**

That is the entire mechanism. None of these three announced itself:

- The dead SHA *resolved* on the machine that wrote it. Pre-rebuild objects
  linger unreferenced in a long-lived clone's object store, so
  `git cat-file -e d6b7cbb` succeeds and reads as confirmation — while
  `git merge-base --is-ancestor d6b7cbb <any ref>` matches nothing. A brief was
  once issued to build a section that was already built and already live,
  because its SHA looked resolvable. **That is the worked instance; treat it as
  the canonical example of this class.**
- The dead path *read plausibly*. It was a comment, nothing imported it,
  nothing broke — which is precisely why it survived. A later session reading
  that file would conclude it was authoritative about a file that no longer
  exists.
- The dead enum *would have validated*. A retired-but-valid value rots
  silently: the next session finds it admissible in the schema and binds to it.

A reference that fails loudly is not this class. A reference that fails loudly
gets fixed the same afternoon. This class is defined by passing.

### The check

**Verify against a fresh clone, never local `cat-file`.** Lingering
unreferenced objects give false positives, and a false positive here is worse
than no check at all, because it converts a doubt into a confirmation.

More generally: **confirm by behaviour, not by resolution.** Grep the source.
Find the call site. Look at the deployed bundle. A short SHA in prose is not
evidence that the work it names exists; a path in a comment is not evidence
that the file does; an enum value in a schema is not evidence that anything
implements it.

### When this applies

Any time a record is written that names something by identifier rather than by
behaviour — a commit, a file path, a schema value, a DOI, an accession number,
an EFG code. The archive's citation discipline (citation-or-skip, and the
standing refusal to guess an identifier) is the same rule applied to evidence;
this section is that rule applied to the repository's own prose.

The remedy is always the same shape, and it is never deletion: **keep the dead
reference beside the live one** where the history matters, and make the
mapping explicit. A pointer that is known-stale and labelled is useful. A
pointer that is stale and silent is the defect.
