# Project continuity dossier — Species on Screen

> Status: continuity record, not doctrine, not auto-loaded.
> Class: project-state snapshot.
> Companion: `private-book/architecture/book-architecture.md`.
> Generated: 2026-05-26. Read before changing anything.

---

## 1 · Current state

- **Doctrine consolidated** (PR #61, 2026-05-25). Single canonical perceptual / editorial / temporal / intuitional layer at `.kiro/steering/`; single operational authority at `cinematic-language/platform-architecture.md`; `cinematic-principles.md` archival.
- **Book architecture frozen** (PR #62, 2026-05-25). 100-page A4 outline binding; no prose drafted.
- **Publication-readiness reached** (PR #60). Family C and prototypes excluded from production; archive-index drift gated by build.
- **Three canonical cinematic places** (`places/sundarbans.html`, `places/crossing.html`, `places/epr-vents.html`). Descent grammar locked at v2.
- **13 narrative records** under `cinematic-language/narratives/`; registry-backed; build-time integrity check (`scripts/check-narratives.js`) is a prebuild gate.
- **Deploy** via `actions/deploy-pages` only; `gh-pages` mirror retired (PR #48). Per-PR previews under `gh-pages/preview/{n}/`.

## 2 · Canonical layers (binding citation tokens)

| Layer | Authority | Tokens |
|---|---|---|
| Cinematic doctrine | `.kiro/steering/cinematic-vocabulary.md` | Articles I–XVII |
| Editorial doctrine | `.kiro/steering/editorial-voice.md` | Canons I–XXI |
| Pacing doctrine | `.kiro/steering/pacing-principles.md` | Principles I–XX |
| Intuitional doctrine | `.kiro/steering/experiential-references.md` | References |
| Operational architecture | `cinematic-language/platform-architecture.md` | three-surface + bridge model; §5 surface-compatibility matrix |
| Schema | `cinematic-language/ecological-narrative.example.ts` | `EcologicalNarrative` v1 |
| Pipeline | `narrative-ingestion-workflow.md`, `narrative-review-checklist.md`, `narrative-lifecycle.md` | entry / verification / archival |

**Resolution order in PR review:** editorial > pacing > cinematic > references. Operational architecture is a separate register; it never overrides doctrine and is not overridden by it.

## 3 · Frozen vs active

| Frozen (no edit without amendment trail) | Active |
|---|---|
| Numbering of Articles / Canons / Principles | Per-narrative record promotion (`draft → in_review → verified → published`) |
| Schema v1 (any change = v2 migration, not edit) | Authoring new narratives (`scripts/new-narrative.js`) |
| Three-surface architecture; bridge asymmetry | Authoring new canonical places (mangrove spec waits as substrate) |
| Descent four-phase grammar (Article III) | Build-time integrity gate |
| Settle-as-continuance; luminance-dip rule | Per-PR preview deploys |
| Family C and `prototypes/*` excluded from build | Production deploy via `actions/deploy-pages` |
| 13 narrative ids + HTML shells | Tightening of `check-narratives` invariants (additive only) |
| Book architecture file (`private-book/architecture/book-architecture.md`) | — |

## 4 · Intentionally deferred tensions (do not resolve casually)

1. **Audio (Article XVI).** Reserved territory. No implementation.
2. **Localisation (Canon XIX).** English is the voice. No second language attempted.
3. **Multi-place coherence.** Three cinematic places exist (Sundarbans, Crossing, East Pacific Rise vents). Mangrove canonical spec ratified but not built.
4. **Draft URLs reachable.** `notes/<id>.html` shells exist for draft records; index hides them. Doctrine accepted; alternative not chosen.
5. **`public/data/*.json` substrate.** Legacy species data is mechanically read by the canonical globe. Not Family C residue; a substrate decision unresolved.
6. **`observation.type` schema.** Six enum values do not cover life-history traits (extreme longevity). Flagged PR #49; do not edit silently.
7. **Future doctrine re-collision.** Governance against future split lives only in steering status headers; not enforced in code.
8. **The book itself.** Architecture warns: a book about restraint can become the first artifact that performs rather than reports.

## 5 · Forbidden future directions

| Class | Specific prohibitions |
|---|---|
| Doctrine | Adding a fifth always-on steering file without retiring one. New authority claim parallel to `platform-architecture.md`. Promoting `.agents/tasks/*` documents to doctrine. |
| Schema | Adding `views`, `likes`, `popularity`, A/B fields, personalization, "see also" arrays, recommendation hints, tracking IDs, multilingual nested fields, atmospheric / scene parameters. |
| Cinematic surface | Live data feeds. Third-party scripts. Tooltips that follow cursor. Hover scaling > 1.04. Annotation CMS. Immersive-mode toggle. Hybrid pages. Pointer parallax that "points at the user" (depth-medium-findings.md §5 tension). Continuous attention-grabbing animation. |
| Research surface | Encyclopedia register on cinematic targets (brand h1, breadcrumbs, JSON-LD). Marketing/brand chrome. Share affordances. Conservation register words ("save", "act now"). |
| Voice | Second-person address. First-person plural. Exclamation. Tagline. Marketing register. Quantitative widgets in place of sentences. Imperative mood in narrative bodies. |
| Build | Re-bundling `species/*` or `prototypes/*` into `dist/`. Cookies. `localStorage` (no exception yet earned). |
| Book | More than five figures. Screenshot reel. Conclusion section. Acknowledgements. Foreword. Afterword. Inspirational prose. Per-narrative editorial reasoning. Author-relationship-to-subject. Roadmap / future plans. |
| Process | Silent schema edits. Doctrine promotion of audits / reviews / findings. Promotion of `cinematic-principles.md` from archival back to canonical. |

## 6 · Safest next implementation priorities

In order of value-per-risk:

1. **Promote drafts through the review checklist.** Cumulative, uses existing infra, exposes review-checklist friction empirically.
2. **Identify the `depth-medium-findings.md` central paragraph.** Tier-1 reproduction blocker for book Part X §1.
3. **Author the mangrove canonical place** against the existing spec. Tests multi-place coherence (deferred tension §4.3) by use, not theory.
4. **Ratify Part I sequencing** of the book before drafting (gap from earlier Part I package: §7 Restraint placement vs reader-comprehension order).
5. **Schema v2 migration design** — when corpus pressure forces it, *not before*. Drafted as an amendment trail (`AM-NNN`), schema_version bump, `recoded_under` migration path; never silent.
6. **PR-preview migration to per-PR Pages environments.** Operational; low priority; resolves the `gh-pages` race documented in PR #48.

Anti-priorities (look like progress; are drift):

- Building the book before architecture amendments are absorbed.
- Adding new steering files.
- Building a second canonical place without its canonical descent spec.
- New audit / review / findings documents that read as governance.
- Productionising prototypes (alpine, salt-flat-exposure) without canonicalisation pass.

## 7 · Highest-risk drift patterns

| Drift | Recognition signal | Doctrine that catches it |
|---|---|---|
| Dashboard register | Frosted-glass cards, KPI widgets, status pills, layer toggles, segmented-control bars | Canons XII–XIV; Article 3; Principle XIX |
| Marketing register | Brand accent colour, hero CTA, share button, tagline | Canon XII; Article VII (palette); Article XV |
| Encyclopedia register on cinematic targets | Brand h1, breadcrumbs, JSON-LD, "View on Wikipedia" | platform-architecture §5; PR #60 Fracture 1 |
| Spectacle without subject | teamLab / Awwwards-style infinite stimulation; particle floods | Articles I–IV bound the lawful behaviours; everything else is forbidden |
| Aesthetic mystification | "Presence", "absence", "the void", "the gaze" without operational consequence | Editorial Canons I, II, V; Part X anti-abstraction safeguards |
| Motion that points at the user | Cursor-following parallax; reactive hover scaling; tooltips following pointer | depth-medium-findings.md §5; Article 3 |
| Dual doctrine | A second `.md` claiming authority on perception, register, or pacing | doctrine-resolution-proposal.md §7 (the ten non-duplication rules) |
| Schema accretion under deadline | New field added directly without `AM-NNN` entry | narrative-lifecycle and the workspace amendment trail |
| Per-narrative bias creep | Editorial body drifting into advocacy / imperative / hortatory mood | review-checklist §4 |
| Book becoming literary | Inspirational sentence with no operational object | Part X anti-abstraction safeguards; book §0.2 |
| Family C revival | `species/*.html` re-bundled into `dist/`; noscript fallback re-pointed | `vite.config.js` post-#60; `index.html` noscript post-#60 |
| Prototype publication | `prototypes/*.html` in `dist/` | `vite.config.js` post-#60 |

## 8 · Repository areas requiring the most caution

| Path | Hazard |
|---|---|
| `.kiro/steering/*.md` | Auto-loaded into every agent context. Status-header changes are governance changes. Numbering is permanent. |
| `cinematic-language/platform-architecture.md` | §5 matrix is binding. §9 was renamed to *Operational authority* in PR #61; do not restore *Final Authority*. |
| `cinematic-language/ecological-narrative.example.ts` | v1 schema. Edit = silent v2 migration. Always opens an `AM-NNN`. |
| `cinematic-language/cinematic-principles.md` | Archival. Status header (post-#61) is load-bearing — it is the redirect that catches stale citations. Do not delete. Do not cite as authority. |
| `cinematic-language/narrative-{ingestion-workflow,review-checklist,lifecycle}.md` | Pipeline. Editable through standard amendment; `narrative-lifecycle.md` §1 is enforced by `check-narratives.js`. |
| `places/sundarbans.html` + `src/places/sundarbans.{js,css}` | The canonical instance. Visual changes touch Article III directly. The inline `body{background:#0a1014}` style is load-bearing for the cross-page luminance dip; do not move to imported CSS. |
| `index.html` | Post-#37 reduction: one anchor, one caption. Post-#60: noscript points to `notes/`, page-caption href is the canonical research narrative. Reverting either re-opens a fracture. |
| `src/main.js` | Drag-rotate has been retired; ambient drift + cursor bias only. Re-introducing drag re-opens drift / inertia / hover-tooltip violations. |
| `src/globe.js` | Single hotspot (Sundarbans). Column heights are no-op. Tooltip element no longer written to. Reverting any of these breaks Articles 3 / XV / Canon V. |
| `vite.config.js` | `species/*` and `prototypes/*` excluded from build. Restoring either re-opens Fractures 1 and 3 from PR #60. |
| `public/data/*.json` | Legacy substrate; canonical globe still reads it. See deferred tension §4.5. Do not migrate without weighing globe coupling. |
| `scripts/check-narratives.js` | Five failure modes are the contract: id drift, duplicate ids, malformed records, missing shells, archive-index drift (post-#60). Add invariants additively; do not remove. |
| `cinematic-language/depth-medium-findings.md` | Self-labelled advisory. Do not promote. Cite by name only in book Part X. |
| `prototypes/reviews/sundarbans-descent-review-v{1,2}.md` | Record. Tier-2 extraction in book. Never doctrine. |
| `private-book/architecture/book-architecture.md` | The architecture is the deliverable. Future writing amends or ratifies the file before drafting prose. |
| `.agents/tasks/task-repo-consolidation/` | Audit + proposal binding decisions are *recorded*, not re-binding; consolidation already executed in PR #61. |
| `.agents/tasks/task-{cinematic-rebuild,immersive-redesign,animation-overhaul,multi-species-expansion,globe-immersion,consolidation-v1,doctrine-validation,bootstrap-sprint,research-matrix,pilot-execution,operational-workflow}/` | Pre-doctrine or deprecated-track. Archival only. Do not consult as guidance. |
| `species/*.html` | Excluded-from-production legacy. Kept on disk as historical record. Do not delete. Do not bundle. |
| `prototypes/{alpine,mangrove,salt-flat-exposure}.html` | Stress-tests. Excluded from production. Reachable under `npm run dev` only. Promotion path is explicit canonicalisation into `places/`, never implicit listing. |
| `.github/workflows/*` | `gh-pages-write` concurrency group is shared across `pr-preview` and `pr-cleanup`. The mirror step in `deploy.yml` is deliberately absent (PR #48). |

## 9 · Recovery rules of thumb

- **When in doubt, lower a tier.** Tier 1 → Tier 2 → Tier 3 reproduction; doctrine → operational → archival.
- **Each finding ends with an operational consequence.** A parameter, a file, a doctrine identifier. If it cannot, it does not belong.
- **Numbers > narration.** A specific millisecond, particle count, or px threshold wins against any abstract claim.
- **Never auto-load a fifth steering file.** The slot is fixed at four; one in / one out.
- **Audits are records, never law.** `.agents/tasks/*` documents do not bind PR review. Only the canonical layers do.
- **The cinematic surface accommodates almost nothing.** The research surface accommodates everything. The asymmetry is the architecture; do not symmetrise it.
- **The doctrine is in the repository.** This dossier is a map of where to look, not a replacement.
