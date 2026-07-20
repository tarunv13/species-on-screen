---
id: YYYY-MM-DD-<slug>                 # equals this file's name without .md
title: <one line>
domain:                                # one OR MORE of: production | editorial | research | architecture
  - <domain>
origin: <where the thinking first entered the repository>   # provenance, not category — e.g. Claude Design | Claude Code | Research paper | Conversation | Supervisor discussion | Field observation
status: Working                        # Working | Under Review | Promoted | Archived | Superseded
opened: YYYY-MM-DD
updated: YYYY-MM-DD
promoted:                              # date frozen read-only, or empty while mutable
maturation: Thought                    # Thought | Task | ADR | Implementation | Book | Doctrine
supersedes:                            # id of a prior Thought, or empty
superseded-by:                         # id of a later Thought, or empty
---

# <title>

> When status is Promoted / Archived / Superseded this file is READ-ONLY: preserved as
> reasoning-of-record. Current truth lives in the downstream artifact named under
> Cross-references. Post-freeze changes are additive, dated amendments only.

**Thesis.** One paragraph. The claim or open question, in the documentary register
(`private-book/governance/prose-governance.md` §1 binds this file the way it binds a chapter).

## Reasoning

The evolving thinking. Preserved in full, permanently — never collapsed on promotion. This is
the part no other artifact holds.

## Decision to make

(Meaningful only while Working / Under Review.) The specific ruling or work-open this Thought
is asking for.

## Evolution

Append-only. One entry per MAJOR revision — dated, additive, never rewritten.

### YYYY-MM-DD — <what shifted>

- **Previous understanding:** …
- **New evidence:** …
- **Repository artifact that changed it:** <repo-relative path or stable doctrine identifier>
- **Resulting conclusion:** …

## Cross-references

Typed pointers. An empty slot stays empty until the artifact exists — no placeholder paths
(the future dangling-link check treats a non-resolving path as a failure).

- ADR:              .agents/decisions/<file>.md
- Task:             PROJECT_STATUS.md backlog #<n>  ·  M<n>  ·  WP<n>
- Session diaries:  .agents/sessions/<file>.md
- Book chapter:     private-book/... (Part N §M)
- Doctrine:         Article / Canon / Principle / Reference <id>
- Prototype review: prototypes/reviews/<file>.md
