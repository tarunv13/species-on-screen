# Eco-Cinema Observatory — AI Operating System v1.0

**Status:** Frozen 2026-06-27. Do not redesign unless a production task fails because a specific
capability is missing. Amend only the tier where the deficiency lives.

**Validated against:** Crossing canonicalization (2026-06-27). See `.agents/sessions/2026-06-27-crossing-canonicalization.md`.

---

## Operating Principle

> The repository advances through completed production milestones, not through additional
> architectural documents.

The AI-OS is infrastructure. It is modified only when real work demonstrates a deficiency.

---

## Three-Tier Structure

| Tier | Name | Stability |
|---|---|---|
| 1 | Stable Core | Changes via formal amendment only |
| 2 | Evolvable Roles | Updated after 3–5 real feature cycles |
| 3 | Tool Adapters | Updated freely when tools change |

---

## TIER 1 — STABLE CORE

### Roles

| Role | Responsibility |
|---|---|
| **Chief Architect** | Does this work belong in this repository at all? |
| **Session Primer** | Re-establish context from PROJECT_STATUS.md + recent session diaries |
| **Feature Intake** | Classify surface, check doctrine, gate Design Agent and Research Curator |
| **Repository Analyst** | Audit what exists before planning |
| **Design Agent** | Art direction for genuinely novel visual decisions only |
| **Implementation Planner** | Produce a phased plan precise enough to execute without micro-decisions |
| **Implementation Agent** | Execute the approved plan exactly |
| **Doctrine Reviewer** | Verify implementation against `.kiro/steering/` before commit |
| **Research Curator** | Validate ecological data: narrative records, GBIF/GloBI, Darwin Core, Paper 1 |
| **Release Manager** | check-narratives → build → smoke test → commit → PROJECT_STATUS update |

### Pipeline

```
1.  SESSION PRIME
2.  CHIEF ARCHITECT (required: new features, scope changes, architecture questions)
3.  FEATURE INTAKE
4.  REPOSITORY ANALYSIS
5.  DESIGN EXPLORATION (only when Design Agent gate fires)
6.  IMPLEMENTATION PLAN → surface to user as text; wait for response before any file is written  ← v1.0 amendment
7.  IMPLEMENTATION
8.  DOCTRINE REVIEW
9.  RESEARCH CURATOR (only when ecological data is touched)
10. INTEGRITY + BUILD
11. GIT COMMIT
12. SESSION CLOSE
```

### Decision Authority

```
Chief Architect   — rejects any feature; overrides all roles
Feature Intake    — rejects on doctrine grounds
Implementation    — chooses between approaches within the plan; stops on unexpected dependencies
  Planner/Agent
Doctrine Reviewer — blocks commit; cannot redesign
Research Curator  — blocks narrative promotion; blocks GBIF/DwC ingest
```

### Design Agent Gate (all three must be true)

1. Feature involves a visual decision on the cinematic surface OR a new pattern on the research surface
2. Decision cannot be resolved from existing doctrine
3. Multiple directions are genuinely possible and exploring them visually produces a better decision than specifying them in text

### Research Curator Invocation Criteria

Invoke when any of the following are touched:
- An `EcologicalNarrative` record is being promoted beyond `draft`
- `scripts/ingest/` is producing new `public/dwca/` archives
- GBIF or GloBI data enters the repository for the first time for a new place
- Paper 1 methodology, coding instruments, or IRR protocol changes

### Institutional Memory Architecture

| Layer | Location | Updated |
|---|---|---|
| Doctrine | `.kiro/steering/` | Formal amendment only |
| AI OS | `.agents/AI-OS.md` | This document |
| Status | `PROJECT_STATUS.md` | Every session |
| Session Diary | `.agents/sessions/YYYY-MM-DD-<topic>.md` | One per session |
| Decisions | `.agents/decisions/YYYY-MM-DD-<ruling>.md` | When a ruling is made |

---

## Technical Lead Mode

Active when the user grants sustained autonomous execution authority. The Technical Lead selects, implements, validates, commits, and documents milestones without pausing for confirmation, provided:

- No architectural decision is required
- Doctrine is unchanged
- Scientific evidence is sufficient
- Build remains green
- Each milestone is independently commit-worthy

**Session protocol (every session, in order):**

1. Read `PROJECT_STATUS.md`
2. Run `git log --oneline -10`
3. Re-rank the backlog against current repository state
4. Select highest-value executable milestone
5. Implement → build → validate
6. Commit
7. **Verification gate** — before writing any documentation:
   - `git status` (clean tree)
   - `git log --oneline -10` (commit present)
   - `npm run build` (green)
   - Resolve any discrepancy before proceeding
8. Update `PROJECT_STATUS.md`
9. Write session diary at `.agents/sessions/YYYY-MM-DD-<topic>.md`
10. Commit documentation

Git is the canonical source of truth. Documentation reflects repository state; repository state does not follow documentation.

---

## TIER 2 — EVOLVABLE ROLES

### Implementation Plan — required sections

Every plan must include:
1. Files to create (exact paths)
2. Files to modify (exact paths + specific lines/functions)
3. Files not to touch
4. Phase sequence with validation gate per phase
5. Rollback strategy
6. **Registry field mapping** (if feature extracts from narrative registry):  ← v1.0 amendment
   ```
   place.name            → [destination]
   place.editorialPlaceLine → [destination]
   editorial.fragment    → [destination]
   ```

### Doctrine Review — canvas surface verification  ← v1.0 amendment

For Canvas 2D surfaces, Article VI darkness compliance is verified in two tracks:

**(a) Architectural track** — Read PAL constants and gradient render order. If abyss/deepWater values
dominate and no light-background overlay is present, mark: `APPROVED — architectural review only`.

**(b) Visual track** — Required before narrative is elevated from `draft` to `verified`. Deferred if
headless. Release Manager smoke-test fulfills it. Mark as `PENDING`, not `BLOCKED`.

### Research Curator — Track A (narrative promotion)

Checklist before any `draft` → `verified` promotion:
1. Summary supportability — claims traceable to sources
2. Year range accuracy
3. Taxonomy currency (GBIF backbone)
4. IUCN currency (current Red List)
5. Place precision (named region, not continent/country centroid)
6. Body consistency with observation and sources
7. Fragment quality: ≤12 words, no proper nouns, no conservation register, self-standing
8. Source independence (different institutions, methodologies, or time periods)
9. `metadata.status: 'draft'` until all above pass
10. `editorialPlaceLine` ≤15 words, factual, place not journey

---

## TIER 3 — TOOL ADAPTERS

### Current bindings (June 2026)

| Role | Tool | Access |
|---|---|---|
| All roles except Design Agent | Claude Code (Sonnet 4.6) | Claude Code CLI |
| Design Agent | Claude Design | claude.ai/design |

### Design Agent Brief Template

Every Claude Design session begins with a filled-in brief:

```
DESIGN BRIEF
Surface: [cinematic / research]
Decision to resolve: [one sentence]
What fails if this is wrong: [one sentence — perceptual or doctrinal consequence]
Doctrine constraints: [cite Articles/Canons]
What must not be contradicted: [fixed files/elements/palettes]
Reference register: [specific analogies, not mood words]
Explicitly rejected registers: [dashboard, SaaS, luxury-brand, etc.]
Success criterion: [one sentence]
Deliverable: Written art direction summary. NOT pixel specs. Two directions maximum.
```

### Adapter Contract

Any tool filling a role must provide: file read/write, shell command execution (Implementation Agent);
text synthesis and doctrine-document reading (all review roles); visual output from structured brief
(Design Agent).

---

## Appendix: What to create vs. defer

**File immediately:** This document. SESSION DIARY. PROJECT_STATUS update after every session.

**File after 3+ features:** Individual role prompt files under `.agents/roles/`.

**File only when a ruling is made:** `.agents/decisions/` directory.

**Never create speculatively:** Feature backlog systems, automated pipeline enforcement, per-role
output directories, tool adapter configuration files separate from this document.
