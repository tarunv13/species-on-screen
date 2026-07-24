# Delegated Ratification Framework

*Governance instrument. The ratification **mechanism** for the existing Q1–Q5
gate (`docs/VALIDATION_PROTOCOL.md`). Landed post-V1.0 as versioned
governance, the same way the validation protocol landed. This document
defines **how** a Q1–Q5 verdict is issued once real evidence exists; it
changes no decision status and builds no automation. It does not answer the
questions, manufacture the evidence, or alter any doctrine.*

---

## What this delegates — and what it never can

Delegation covers **adjudication only**: applying the protocol's
pre-committed decision rules to real, already-collected evidence, and
recording the result. Three things are permanently outside delegation:

- **Never witnessing.** The mechanism may not manufacture the eight
  validation sessions, invent participants, or produce any evidence. The
  moderator's paper logs are the only instrument (`docs/VALIDATION_PROTOCOL.md`);
  a verdict may only *read* evidence that a human collected.
- **Never amendment.** It may not alter frozen doctrine (the Constitution,
  the Canons/Principles/Articles, ratified ADRs). Adjudication applies rules;
  it does not rewrite them.
- **Never fabrication.** No invented counts, quotes, DOIs, or verdicts. An
  absent or ambiguous input is surfaced, never filled.

## The two agents

**Steward-Proxy.** Applies the pre-committed decision rules to the real
evidence, under the human steward's **standing, revocable permission**. It
is a proxy, not the steward: permission can be withdrawn at any time, and
withdrawal returns all adjudication to the human. Every verdict it issues
carries, without exception:

- **rule fired** — the exact pre-committed rule and threshold applied
  (e.g. Q1 "≥5/8 seek the record");
- **evidence trace** — the specific logged evidence the verdict reads,
  quoted, never summarised into a score;
- **confidence** — the proxy's own reading of how cleanly the evidence meets
  the rule;
- **scope flag** — whether the verdict is AUTO or must ESCALATE (see below).

**Adversarial Questioner.** A **separate** agent whose only job is to
challenge the Steward-Proxy's verdict — testing the evidence read, the rule
application, and the boundary. It **may force escalation** to the human. It
**may not ratify**: it can block or challenge, never approve. The two roles
are never played by one agent.

## Bounded scope

| Tier | Criteria | Who decides |
|---|---|---|
| **AUTO** | Rule-bound · evidence-backed · reversible | Steward-Proxy, under standing permission, with the Questioner's assent |
| **ESCALATE** | Ambiguous · contested (Questioner challenges unresolved) · precedent-setting · irreversible | Returned to the human steward |
| **NEVER** | Witnessing · amendment · fabrication | Nobody — outside delegation entirely |

The **ESCALATE** tier mirrors the repository's BLOCKER/MUST rule: anything a
launch-critical review would stop on — ambiguity, an unresolved objection, a
precedent, or an irreversible consequence — stops here too and goes to the
human.

## The loop

1. **Real evidence** — the moderator's paper logs from all eight sessions
   (the protocol's instrument), transcribed as-is.
2. **Proxy verdict** — the Steward-Proxy applies the pre-committed rule and
   issues a verdict carrying rule-fired + evidence trace + confidence + scope
   flag.
3. **Questioner critique** — the Adversarial Questioner challenges it.
4. **Reconcile or escalate** — if the challenge is resolved within the rules
   and the evidence, the verdict stands (AUTO); if it is not, or the matter
   is precedent-setting/irreversible, it **escalates** to the human.
5. **ACCORD-style record** — the outcome is written to a ratification record
   (below).
6. **Status change** — only then may a D4–D6 status change in
   `docs/PRODUCT_DECISIONS.md`, and only as the record dictates → then spec →
   then implementation.

## Ratification records

One dated record per ratified (or escalated) question, at:

`.agents/decisions/ratification-records/YYYY-MM-DD-<question>.md`

Each record carries the ACCORD fields:

- **Consensus definition** — what agreement meant for this question (which
  pre-committed rule governs it).
- **Evidence read** — the specific logged evidence, quoted.
- **Rule fired** — the exact rule and threshold applied.
- **Critic challenges + resolution** — every challenge the Adversarial
  Questioner raised and how each was resolved (or that it forced escalation).
- **Verdict** — the outcome.
- **Escalated (Y/N)** — whether the human steward was required.

These records live beside, and follow the conventions of, the repository's
decision records (`.agents/decisions/`); they are the ratification tier the
validation protocol's output chain terminates in.

## What this framework does not do

It builds no agent tooling, resolver, or scaffold ("never create
speculatively"). It is prose governance describing a mechanism to be enacted
when real Q1–Q5 evidence exists. Until a ratification record exists for a
question, that question's D4–D6 status does not change.
