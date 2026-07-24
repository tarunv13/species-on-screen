# Q1–Q5 Validation Protocol

*Governance instrument gating D4–D6 (`docs/PRODUCT_DECISIONS.md`). Landed
post-V1.0 from the approved validation-protocol design (transcribed from the
close-out order of 2026-07-23). The statuses of D4, D5, and D6 may change only
via a Q1–Q5 ratification ADR (see Output chain, below). This document defines
how the five open questions are answered; it does not answer them.*

---

## Binding constraint

**No analytics. No tracking. No session recording. No A/B infrastructure.**
Moderated observation plus paper only. The instrument is the moderator's log.

Grounding: the editorial doctrine forbids the dashboard register (Canon XII)
and the gamification register (Canon XIV), and Principle XX rules that
time-on-task is not a metric — the project does not measure viewers. A
validation apparatus that instrumented visitors would violate the doctrine it
exists to serve. Observation is human, consented, and written down by hand.

## Method

**Participants: 8 strangers.**
- 4 with no background in ecology/conservation; 4 with some.
- At least 2 recruited as impatient users (self-described or screened).
- At least 1 using `prefers-reduced-motion`.
- 0 designers, 0 colleagues, 0 friends of the project.

**Setup.** Each session opens with the fixed sentence, spoken verbatim:

> "Spend as long as you want here. Think aloud if it's natural; go quiet
> when it isn't."

Nothing else is explained. No task is assigned.

**Observation.** The moderator observes silently and logs, on paper, the five
moments:

1. **Threshold** — what the participant does at the Sundarbans threshold.
2. **Descent posture** — how they drive (or don't drive) the descent.
3. **Arrival +10s** — what they do in the first ten seconds after arrival.
4. **Archive-seeking** — whether, when, and how they seek the record/archive
   surface.
5. **Natural end** — how the session ends when the participant decides it has.

**Debrief.** Fixed wording, asked only after the participant has finished, no
leading follow-ups beyond it. The debrief wording is part of the moderator's
paper kit and is identical across all eight sessions.

## Pre-committed decision rules

These five rules are committed **before** any session runs. The counts decide;
no post-hoc reinterpretation.

- **Q1 — Do visitors seek the record?**
  ≥5/8 seek the record → the drive is instrumental; **D4 lives**.
  ≤2/8 → **D4 withdrawn**.
  3–4 → **D4 stays gated** (no action).

- **Q2 — How deep do visitors go?**
  One-deep majority → **D5 safe** (returning path only).
  Collection behaviour → **D5 must keep a real choosing moment**.

- **Q3 — When is the crossing wanted?**
  ≥5 want the crossing after arrival → **D4 shape confirmed**.
  Earlier → **record as tension, do not act**.

- **Q4 — Do impatient visitors feel arrival?**
  ≥2 impatient participants feel arrival → **D6 shrinks**.
  0 → **D6 validated**, scoped to named barriers.

- **Q5 — Whose act was the descent?**
  Witness-grammar plus "chose" → **D5 may merge**.
  "Taken" majority → **D5 frozen**.

## Output chain

Q1–Q5 verdicts are issued via `docs/RATIFICATION_FRAMEWORK.md`.

Strictly ordered; no stage may be skipped:

1. **Per-session paper logs** (the moderator's instrument, one per session).
2. **Synthesis memo** — counts plus verbatim quotes. No scores, no ratings,
   no derived metrics.
3. **Steward ratification ADR** at
   `.agents/decisions/YYYY-MM-DD-q1-q5-ratification.md`, applying the
   pre-committed rules to the counts.
4. **Only then** may D4–D6 statuses change in `docs/PRODUCT_DECISIONS.md`
   → then specification → then implementation.

No validators, scaffolds, or tooling are built for this protocol — paper is
the instrument ("never create speculatively").
