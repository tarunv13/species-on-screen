# Architecture Decision Record — The Thought System (V1.0)

**Date:** 2026-07-07
**Status:** RATIFIED (2026-07-07) — Chief Architect ruling. Sections 1–9 are the ratified record. Amendments, if any, are appended and dated per the project's amendment convention (`cinematic-vocabulary.md` §13); the ruling is not overwritten.
**Role:** Chief Architect ruling. Authorizes a new institutional-memory layer and amends `.agents/AI-OS.md`. Per `PROJECT_OPERATING_MANUAL.md` §4, opening a new architecture requires a decision record; this is that record.

---

## 1. The deficiency this closes

The repository has a canonical home for every *resolved* form of work — doctrine (`.kiro/steering/`), rulings (`.agents/decisions/`), per-session record (`.agents/sessions/`), milestone state (`PROJECT_STATUS.md`), pending units (the `PROJECT_STATUS.md` backlog), and durable extraction (`private-book/`). It has no home for *pre-resolution* thinking: a line of reasoning that spans more than one session, is not yet a ruling (ADRs are written "when a ruling is made"), and is not yet a committed milestone. That thinking currently survives only in conversation, and is therefore lost when the conversation ends.

This is a real, recurring deficiency, not a hypothetical one. The full Observatory design cascade that produced the D1–D10 grammar existed only in a design conversation before M33 transcribed it (`PROJECT_STATUS.md`, M33 entry: "previously lived only in a design conversation"). The same loss vector recurs whenever design reasoning outruns the artifact that will eventually hold it.

## 2. What a Thought is

A **Thought** is a durable, evolving record of a line of reasoning that is not yet resolved into a ruling (ADR) or a completed milestone. It is the working-memory tier upstream of ADRs, milestones, and the book, and it feeds them. It is *not* a second copy of any resolved artifact: exactly one artifact owns a current decision or implementation (the ADR or milestone); exactly one owns the reasoning that produced it (the Thought). These are different facts, one home each — the M27 single-source discipline, applied to the reasoning layer.

## 3. The ratified V1.0 design

- **Location.** A single flat directory `.agents/thoughts/`, sibling to `decisions/` and `sessions/`. One file per Thought, `YYYY-MM-DD-<slug>.md`. Domains are frontmatter, not folders, so a Thought crossing domains never moves or renames.
- **Domains (controlled set, aligned to the AI-OS role split).** `production` · `editorial` · `research` · `architecture`. `domain:` is a list; one or more.
- **Origin (open vocabulary, required).** Where the thinking first entered the repository — provenance, not category (e.g. `Claude Design`, `Claude Code`, `Research paper`, `Conversation`, `Supervisor discussion`, `Field observation`). Presence is required; membership is not enforced.
- **Lifecycle — two mutable states, three frozen.** `Working` → `Under Review` → `Promoted`; with `Archived` (closed without promotion) and `Superseded` (replaced by a later Thought). Promotion **freezes the Thought read-only; it never shortens it.** The full reasoning is preserved permanently as reasoning-of-record; the downstream artifact named in Cross-references becomes the source of truth for current state. Post-freeze changes are additive, dated amendments only.
- **Sections.** Thesis · Reasoning (preserved in full) · Evolution (append-only, one dated entry per major revision: previous understanding / new evidence / repository artifact that changed it / resulting conclusion) · Cross-references (typed pointers to ADRs, Tasks, Session diaries, Book chapters, Doctrine, Prototype reviews — empty until the artifact exists, no placeholders).
- **Maturation without duplication.** `Thought → Task → ADR → Implementation → Book → Doctrine`. "Task" is a `PROJECT_STATUS.md` backlog item / milestone (M-number) / work package (WP-number) — the `.agents/tasks/` directory named in older documents is retired. The Thought accumulates pointers and freezes; it sheds no content.

## 4. Governance philosophy (preserved from the source discipline)

Provenance over deletion; the read-only freeze is the same additive-amendment convention the ADRs already use. Every cross-reference is a repo-relative path or a stable doctrine identifier, verbatim (`prose-governance.md` §4 rule 3). Thoughts are governance documents, not shipped artifacts, so their eventual validator belongs in `verify` + CI, never in `prebuild`/`build`.

## 5. Scope of this ratification — V1.0, deferred, rejected

**In V1.0.** The design in §3, the four-tier automation plan (blocking gate · derived INDEX · scaffold · report), and the Thought Review's *creation* question (§7).

**Deferred until real usage demonstrates a deficiency** (this is a deliberate application of the AI-OS operating principle, *"modified only when real work demonstrates a deficiency"*, and the Appendix rule *"Never create speculatively"*):

- A **`Dormant`** state (with a required `waiting-on:` dependency pointer) — justified in principle by the pervasive deferral pattern in the backlog (items 1, 2, 3(e), 5; M15 Amazon várzea deferral), but its concrete benefit (suppressing a stale-report false positive) cannot arise until a Thought is actually parked against a live blocker.
- An **Evidence** section separating verified findings from Reasoning — justified in principle by the `Verified facts` section of the WP8 ADR (`.agents/decisions/2026-07-05-wp8-interaction-model-adr.md` §2) and the "Evidence gathered" section of `.agents/sessions/2026-07-05-r1-browser-qa-closure.md`, but a single `Working` Thought can cite its basis inline until volume demonstrates the conflation.
- A second Thought-Review question, *"Did today's work invalidate an existing Thought?"* — justified in principle by the project's documented willingness to reverse prior conclusions under new evidence (M12, M13, M31→M32; the WP8 ADR's three amendments), but a prompt enhancement, not a defect fix, since supersession can be triggered outside session close.

These three are to be recorded as the Thought System's own first `architecture`-domain Thoughts once the system is in use, and adopted only when a real Thought demonstrates the need.

**Rejected permanently.** A `confidence` field (Low/Medium/High). A subjective scalar over an evidence chain is exactly the summary-judgment register the evidential surface was engineered to forbid (`PROJECT_STATUS.md`, M34: "no pass/fail, error, or check/cross language … enforced by a unit test against a forbidden-term list"; M33/D7: non-resolution rendered "an open question, not a failure"). Standing is already derivable from `status` + `maturation`; a manual scalar goes stale with nothing forcing its update, contrary to the "updated only when a milestone state changes" discipline.

## 6. Implementation staging (accepted roadmap)

Implementation is staged TS0–TS4 and is intentionally limited to **TS0 (this record + the AI-OS/Operating-Manual amendments) and TS1 (the static scaffold, usable by hand)**. The automation milestones — TS2 (the blocking validator), TS3 (the derived INDEX generator), TS4 (the scaffold script + report modes) — are **not implemented now.** They require real repository usage of the folder before their benefit is demonstrated, per the operating principle in §5. No validator, script, `package.json`, `verify`, or CI change is made under this record.

## 7. Amendment to the AI Operating System

This record formally amends `.agents/AI-OS.md` (a frozen constraint, amendable by formal record only):

1. The **Institutional Memory Architecture** table gains a **Thoughts** layer at `.agents/thoughts/YYYY-MM-DD-<slug>.md`, updated when durable pre-resolution reasoning is captured or advanced.
2. The **Technical Lead session protocol** gains a session-close **Thought Review** step: at the end of a session, ask whether the work generated durable thinking; if an existing Thought owns that reasoning, evolve it; only if none does, create one; never create a duplicate; always prefer evolving an existing Thought. Until TS4 lands, the "does one already own this?" check is performed by hand against the flat directory. The one-line outcome is recorded in the session diary.

`PROJECT_OPERATING_MANUAL.md` §1 (the canonical governance map) gains a matching **Thoughts** row.

## 8. Why this does not violate the operating principle

The AI-OS states the repository "advances through completed production milestones, not through additional architectural documents," and is "modified only when real work demonstrates a deficiency." The Thought System is not a new doctrine layer; it is a capture net for the one tier the AI-OS currently drops — pre-resolution reasoning that today evaporates into conversation (§1). Its footprint under this record is one folder, one template, one index, one example, and an additive amendment to two governance documents. No production surface, build gate, or shipped artifact is touched. The automation that would add weight is deferred until usage justifies it.

## 9. Ratification

**Ratified by:** Chief Architect
**Date:** 2026-07-07
**Decision:** The Thought System V1.0 (§3) is adopted. Implementation is limited to TS0 and TS1. TS2–TS4 are deferred per §5–§6. The `confidence` field is rejected permanently. `.agents/AI-OS.md` and `PROJECT_OPERATING_MANUAL.md` are amended per §7.
