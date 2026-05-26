# /private-book/ — index

> Status: working artifacts; not doctrine; not auto-loaded; do not bind PR review.
> Provenance: book architecture ratified in PR #62 (2026-05-25). Other artifacts compiled 2026-05-26.
> Purpose: durable repository home for all materials supporting the future writing pass against `architecture/book-architecture.md`.

---

## Layout

```
private-book/
├── README.md                                # this file
├── architecture/
│   └── book-architecture.md                 # binding 100-page outline (PR #62)
├── chapters/                                # seed drafts; not for publication
│   ├── asymmetry.md                         # Part I framing
│   ├── doctrine-consolidation.md            # Part I §5
│   └── settle-is-not-a-tween.md             # Part X §1
├── source/                                  # per-Part source registers
│   ├── source-hierarchy.md                  # book-wide canonical source register
│   ├── part-i-foundations.md                # 9-page Part I package
│   └── part-x-perceptual-findings.md        # 5-page Part X package
├── continuity/
│   └── continuity-dossier.md                # repository-state snapshot for recovery
└── governance/
    └── prose-governance.md                  # writing discipline; binding on every chapter
```

## File map

| File | Class | Architecture mapping | Companion PRs | Status |
|---|---|---|---|---|
| `architecture/book-architecture.md` | constitutional | book-wide | #62 | binding |
| `chapters/asymmetry.md` | seed draft | Part I framing | #43, #45, #50, #51, #60 | working |
| `chapters/doctrine-consolidation.md` | seed draft | Part I §5; Part II §4 | #50, #51, #61 | working |
| `chapters/settle-is-not-a-tween.md` | seed draft | Part X §1 | #38, #39, #40, #41, #45, #46, #47, #59, #61 | working |
| `source/source-hierarchy.md` | source register | book-wide | — | working |
| `source/part-i-foundations.md` | source register | Part I (9 pages) | — | working |
| `source/part-x-perceptual-findings.md` | source register | Part X (5 pages) | — | working |
| `continuity/continuity-dossier.md` | continuity record | repository-wide | — | working |
| `governance/prose-governance.md` | writing discipline | book-wide | — | binding for drafting |

## Doctrine dependencies (per file)

| File | Canonical doctrine cited | Operational authority cited | Tier-2 sources cited |
|---|---|---|---|
| `architecture/book-architecture.md` | all four steering files; full Articles / Canons / Principles / References vocabulary | `platform-architecture.md` §5; `ecological-narrative.example.ts`; pipeline trio | v1/v2 reviews; homepage audit; repo audit; doctrine-resolution proposal; publication-readiness commit; mangrove canonical descent spec |
| `chapters/asymmetry.md` | Articles III, VI, IX, XV; Canon XII; Article XVII | `platform-architecture.md` §5–§7; `ecological-narrative.example.ts` | `task-homepage-audit/2026-05-24-homepage-review.md` |
| `chapters/doctrine-consolidation.md` | Articles I–IV, XVII; Canon V; Principles III, VIII | `platform-architecture.md` §9 | `task-repo-consolidation/2026-05-25-repository-audit.md`; `…/2026-05-25-doctrine-resolution-proposal.md`; `cinematic-language/cinematic-principles.md` (archival) |
| `chapters/settle-is-not-a-tween.md` | Article III (Hold/Drift/Crossing/Settle); Article XVII; Article VI | — | `prototypes/reviews/sundarbans-descent-review-v{1,2}.md`; `cinematic-language/depth-medium-findings.md`; `task-mangrove-prototype/2026-05-25-canonical-mangrove-descent-spec.md` |
| `source/source-hierarchy.md` | all four steering files (cited as authoritative); platform architecture; schema; pipeline trio | — | full Tier-2 list |
| `source/part-i-foundations.md` | Canons I, II, V, XII; Principle XIX; Article XVII | `platform-architecture.md` §1, §6, §7; `narrative-ingestion-workflow.md` §1 | repo audit; doctrine-resolution proposal; PR #61 commit; `cinematic-principles.md` archival header |
| `source/part-x-perceptual-findings.md` | Articles III, VI, XVII; Principle III; Principle VIII; Canon IX | — | v1/v2 reviews; `depth-medium-findings.md`; PR #40, #45, #46, #59 commits; mangrove canonical descent spec |
| `continuity/continuity-dossier.md` | all four steering files; Articles I–XVII; Canons I–XXI; Principles I–XX (by token) | full operational layer | full Tier-2 list; pre-doctrine task folders flagged archival |
| `governance/prose-governance.md` | Canons I, II, V, XII, XV (register); Articles III, XV (forbidden gestures, dashboard register) | — | architecture §0.3, §10, §11, §12 |

## Related PRs

| PR | Date | Title | Repository touchpoints in this material |
|---|---|---|---|
| #17 | 2026-05-24 | Tier C steering doctrine | `.kiro/steering/{cinematic-vocabulary,editorial-voice,pacing-principles}.md` |
| #29 | 2026-05-24 | Experiential references doc | `.kiro/steering/experiential-references.md` |
| #30 | 2026-05-24 | Homepage audit | `task-homepage-audit/2026-05-24-homepage-review.md` |
| #35–#37 | 2026-05-25 | Homepage doctrine application | `index.html`, `src/style.css`, `src/main.js`, `src/globe.js`, `src/floating-cards.js` |
| #38 | 2026-05-25 | Sundarbans descent v1 prototype | `prototypes/sundarbans-descent.html` and src |
| #39 | 2026-05-25 | Cinematic governance v1 (review + cinematic-principles.md) | `prototypes/reviews/sundarbans-descent-review-v1.md`; `cinematic-language/cinematic-principles.md` |
| #40 | 2026-05-25 | Sundarbans descent v2 (depth-medium pivot) | `prototypes/reviews/sundarbans-descent-review-v2.md`; `cinematic-language/depth-medium-findings.md` |
| #41, #47 | 2026-05-25 | Salt-flat-exposure counter-test (M3 convergence) | `prototypes/salt-flat-exposure.html` and src |
| #42, #45, #46 | 2026-05-25 | Annotation interaction (stillness accumulator); end-to-end render | `src/prototypes/sundarbans-descent.js` (annotation); `notes/render-narrative.js`; schema integration |
| #43 | 2026-05-25 | Platform architecture | `cinematic-language/platform-architecture.md` |
| #44 | 2026-05-25 | EcologicalNarrative schema | `cinematic-language/ecological-narrative.example.ts` |
| #49 | 2026-05-25 | Narrative ingestion workflow + stress tests | `cinematic-language/narrative-ingestion-workflow.md` |
| #50 | 2026-05-25 | Repository consolidation audit | `.agents/tasks/task-repo-consolidation/2026-05-25-repository-audit.md` |
| #51 | 2026-05-25 | Doctrine resolution proposal | `.agents/tasks/task-repo-consolidation/2026-05-25-doctrine-resolution-proposal.md` |
| #52, #53, #54, #55 | 2026-05-25 | Narrative registry, scaffolder, integrity check, review checklist | `cinematic-language/narrative-registry.ts`; `scripts/{check,new}-narratives.js`; `narrative-review-checklist.md` |
| #56–#59 | 2026-05-25 | Narrative records (4 + 2 + 2 + revisions); archive index; lifecycle; first promotions; Sundarbans canonical move; canonical homepage arrival | `cinematic-language/narratives/*.ts`; `notes/*.html`; `places/sundarbans.html`; `narrative-lifecycle.md`; `index.html` canonical arrival |
| #60 | 2026-05-25 | Publication-readiness remediation (Family C; archive-index drift; prototype exposure) | `vite.config.js`; `index.html` noscript; `scripts/check-narratives.js` (drift gate) |
| #61 | 2026-05-25 | Doctrine consolidation | `.kiro/steering/*.md` (status headers); `cinematic-language/cinematic-principles.md` (archival header); `platform-architecture.md` §9 rename; cross-reference cleanup; Article XVII added |
| #62 | 2026-05-25 | Book architecture | `architecture/book-architecture.md` (this folder; original location was `.agents/tasks/task-book-architecture/2026-05-25-book-architecture.md`) |

## Archival status

All files in `private-book/` are working artifacts. None is doctrine. None is auto-loaded into agent context. None binds PR review.

The architecture file (`architecture/book-architecture.md`) is the only file in this folder that is *binding* — binding on the *book*, not on the project's PR review. Future writing passes amend or ratify the architecture before drafting prose.

The chapter seeds in `chapters/` are drafts at preservation stage; not edited for publication. The asymmetry chapter is the model that the prose-governance layer encodes as binding for future drafting.

The source registers in `source/` are working analyses derived from the architecture; they do not amend the architecture and do not become doctrine.

The continuity dossier (`continuity/continuity-dossier.md`) is a project-state snapshot useful for recovery if active development pauses; it captures frozen / active / deferred / forbidden / safest-next status across the repository.

The prose-governance layer (`governance/prose-governance.md`) is binding on every chapter draft inside this folder. A draft passage failing any rule in `prose-governance.md` is returned to source, not edited.

---

*The doctrine is in the repository. This folder is a map of where to look for the future book.*
