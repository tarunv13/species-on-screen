# Canonical source hierarchy

> Status: working artifact, not doctrine, not auto-loaded.
> Class: book-wide source register.
> Companion: `private-book/architecture/book-architecture.md` §8 (artifact-placement strategy).
> Generated: 2026-05-26.

---

## 1 · Authoritative sources (primary; quotable in the book)

Doctrine layer — the four steering docs (Tier 1 reproduction):

| Path | Vocabulary token |
|---|---|
| `.kiro/steering/cinematic-vocabulary.md` | Articles I–XVII |
| `.kiro/steering/editorial-voice.md` | Canons I–XXI |
| `.kiro/steering/pacing-principles.md` | Principles I–XX |
| `.kiro/steering/experiential-references.md` | References (priority 4) |

Operational authority + frozen schemas:

| Path | Status |
|---|---|
| `cinematic-language/platform-architecture.md` | Operational authority; surface-compatibility matrix Tier 1 |
| `cinematic-language/ecological-narrative.example.ts` | v1 schema, frozen |
| `cinematic-language/narrative-ingestion-workflow.md` | Pipeline (entry) |
| `cinematic-language/narrative-review-checklist.md` | Pipeline (verification) |
| `cinematic-language/narrative-lifecycle.md` | Pipeline (archival) — Tier 1 lifecycle table |

Constitutional:
- `private-book/architecture/book-architecture.md` — binding architecture; amendment target before any prose

## 2 · Secondary / contextual sources (extracted, not reproduced — Tier 2)

| Path | Role |
|---|---|
| `prototypes/reviews/sundarbans-descent-review-v1.md` | Founding prototype review |
| `prototypes/reviews/sundarbans-descent-review-v2.md` | Depth-medium pivot |
| `cinematic-language/depth-medium-findings.md` | Pointer parallax / wallpaper-ceiling findings |
| `.agents/tasks/task-homepage-audit/2026-05-24-homepage-review.md` | Homepage audit (turning point) |
| `.agents/tasks/task-repo-consolidation/2026-05-25-repository-audit.md` | Repo audit |
| `.agents/tasks/task-repo-consolidation/2026-05-25-doctrine-resolution-proposal.md` | Doctrine consolidation proposal |
| `.agents/tasks/task-mangrove-prototype/2026-05-25-canonical-mangrove-descent-spec.md` | Mangrove canonical design substrate |
| PR #60 commit message | Publication-readiness remediation reasoning |
| PR #61 commit message | Doctrine consolidation reasoning |

PR-bodies preserved as reasoning-of-record (extract quotes only, do not reproduce):
- #30, #38, #40, #41, #42, #43, #44, #45, #50, #51, #52, #54, #55, #60, #61

## 3 · Archival-only sources (preserved on disk; cite as superseded record, not as authority)

| Path | Reason |
|---|---|
| `cinematic-language/cinematic-principles.md` | Superseded by steering trio + Article XVII |
| `.agents/tasks/task-mangrove-prototype/2026-05-25-implementation-plan.md` | Plan; rolled into spec |
| `.agents/tasks/task-cinematic-rebuild/**` | Pre-doctrine track |
| `.agents/tasks/task-immersive-redesign/**` | Pre-doctrine track |
| `.agents/tasks/task-animation-overhaul/**` | Pre-doctrine track |
| `.agents/tasks/task-multi-species-expansion/**` | Pre-doctrine track |
| `.agents/tasks/task-globe-immersion/**` | Pre-doctrine track |
| `.agents/tasks/task-consolidation-v1/**` | Pre-doctrine track |
| `.agents/tasks/task-doctrine-validation/evaluation-framework.md` | Walk methodology, single-use, design retires |
| `.agents/tasks/task-bootstrap-sprint/week-1-plan.md` | Single-use sprint, retires |
| `.agents/tasks/task-research-matrix/**` | Deprecated research-matrix track |
| `.agents/tasks/task-pilot-execution/**` | Deprecated pilot track |
| `.agents/tasks/task-operational-workflow/**` | Deprecated operational track |

## 4 · Repository-only sources (live in repo; do not appear in book directly)

- `src/**` — all runtime modules (engine, globe, places, notes, prototypes)
- `cinematic-language/narrative-registry.ts` — discovery mechanism
- `cinematic-language/narratives/*.ts` — per-narrative bodies (cited; not reproduced)
- `notes/*.html`, `places/sundarbans.html`, `prototypes/*.html`
- `scripts/check-narratives.js`, `scripts/new-narrative.js`, `scripts/fetch-tmdb-data.js`
- `species/*.html` — excluded-from-production legacy
- `vite.config.js`, `package.json`, `package-lock.json`, `index.html`
- `public/data/*.json`
- `.github/workflows/*`, `.github/PREVIEW_WORKFLOW.md`

## 5 · Excluded / non-book materials (never appear in the book)

- All pre-doctrine PRs (#1–#16) — early prototype era predating cinematic doctrine
- Transition-resilience hardening PRs (#9–#15) — operational; superseded
- Pages-deploy fix PRs (#32, #48) — operational
- TMDB / safari-mode legacy assets and data files — superseded by narrative pipeline
- Per-narrative editorial reasoning (architectural exclusion)
- Author's relationship to the subject (architectural exclusion)
- Future plans / roadmap (architectural exclusion)
- Internal task scaffolding beyond what §2 names
- PR-specific marketing prose (preview links, attribution boilerplate)
- Screenshot reels / build artefacts (`dist/`, gh-pages branch)

---

## TOP 15 artifacts to preserve for future writing

Ordered by quotation-load and structural necessity:

| # | Artifact | Class |
|---|---|---|
| 1 | `private-book/architecture/book-architecture.md` (PR #62) | Constitutional |
| 2 | `.kiro/steering/cinematic-vocabulary.md` | Authoritative — Articles |
| 3 | `.kiro/steering/editorial-voice.md` | Authoritative — Canons |
| 4 | `.kiro/steering/pacing-principles.md` | Authoritative — Principles |
| 5 | `.kiro/steering/experiential-references.md` | Authoritative — References |
| 6 | `cinematic-language/platform-architecture.md` | Authoritative — operational |
| 7 | `cinematic-language/ecological-narrative.example.ts` | Authoritative — frozen schema |
| 8 | `cinematic-language/narrative-ingestion-workflow.md` | Authoritative — pipeline |
| 9 | `cinematic-language/narrative-review-checklist.md` | Authoritative — pipeline |
| 10 | `cinematic-language/narrative-lifecycle.md` | Authoritative — pipeline |
| 11 | `cinematic-language/depth-medium-findings.md` | Secondary — pivot evidence |
| 12 | `prototypes/reviews/sundarbans-descent-review-v1.md` | Secondary — turning point #1/#2 |
| 13 | `prototypes/reviews/sundarbans-descent-review-v2.md` | Secondary — turning point #2 |
| 14 | `.agents/tasks/task-homepage-audit/2026-05-24-homepage-review.md` | Secondary — turning point #4 |
| 15 | `.agents/tasks/task-repo-consolidation/` (audit + doctrine-resolution-proposal, paired) | Secondary — turning point #5/#7 |
