# First Pilot Coding Session — Plan

**Status:** single-use document. Not steering. Not doctrine. Lives at
`.agents/tasks/task-pilot-execution/` and either reduces to a one-
paragraph postmortem at `postmortems/session-001.md` or retires
entirely after the first session runs.

**Scope.** A practical guide for the very first pilot coding session
against the workspace specified in PR #26, the schema in PR #21, and
the workflow in PR #25. One artefact — at most two if the first
finishes well — across a 2–3 hour block. Subsequent sessions follow
the standing workflow without a separate guide.

**Lifecycle.** Read once before the session. Used during the
session as a checklist. Closed after the session and not amended.
Any standing changes derived from the session land in
`amendments-log.md` per PR #26 §15, not in this file.

---

## 0. What this session is — and is not

- The workspace's pilot, not the artefact's. The first artefact is
  a vehicle for testing whether the spreadsheet, Zotero, and
  notes-file workflow holds up under real coding pressure.
- Friction is the deliverable. Coded fields are a side-effect.
- Ambiguity logged is a success. Ambiguity silently absorbed is a
  failure.
- It is *not* a methodological validation. PR #22 §10's success
  criteria apply across the whole pilot, not one session. Do not
  generalise from this session to the schema, the vocabularies, or
  the workspace until at least three sessions have run.

---

## 1. Pre-session preparation

**Time:** 15–30 minutes the day before, or first thing on the
session day.

Checklist:

- [ ] Re-read `coder-protocol.md` (one screen). If it doesn't yet
      exist, write it before the session — bullet form, ≤ 25 lines.
- [ ] Skim PR #21 §1.1 through §1.12 once. Do not study; orient.
- [ ] Open the spreadsheet and confirm the seven tabs from PR #26
      §2 exist with the correct columns. Add nothing if they don't
      — fix the spreadsheet first, in a separate sitting.
- [ ] Confirm the `vocabularies` tab carries the eight seed
      vocabularies from PR #26 §13, and that `corpus`-tab data
      validation actually points at them.
- [ ] Open Zotero. Confirm Better BibTeX is configured. Confirm the
      *Pilot Corpus* / *Method* / *Background* collections exist.
- [ ] Open the repository in your editor.
- [ ] Block 3 hours of clock time. Phone silenced. One browser
      window. No music with lyrics.
- [ ] Decide the artefact (§2). Do not start until decided.
- [ ] Have water. Skip caffeine if the session is in the morning;
      if afternoon, the usual amount is fine. The PR #18 no-caffeine
      rule is walk-specific, not a session rule.

If any checklist item is not green, stop. Resolve it in a separate
sitting. The first session does not begin under improvisation.

---

## 2. Artefact selection criteria

The artefact should be *easy* by design. The first session is for
finding workspace friction; an artefact at the schema's strong
suit minimises artefact-driven friction so workspace-driven
friction becomes legible.

Required:

- A long-form natural-history documentary episode. The canonical
  case the PR #21 schema was built for.
- Roughly 50–60 minutes of runtime.
- Available with a stable platform catalogue page (BBC, Netflix,
  Apple TV, PBS — anything with a permanent URL).
- English-language narration (avoids language-coding ambiguity in
  the first session; multilingual artefacts are queued for later).
- Subject taxa the coder can identify by sight without consulting
  a field guide more than twice.

Disqualifying:

- The three artefacts already coded in PR #23 (Planet Earth II
  "Mountains"; the slow loris "tickling" TikTok; *Mountain* by
  David O'Reilly). Pilot rows must not duplicate the exemplar
  packets.
- Anything from PR #22 §6's "schema-stressor" tier (Bear71, *Endling*,
  iNaturalist platform-as-artefact). Save those for sessions 5+.
- Anything the coder has personal stakes in (favourite documentary;
  family connection to the producer). Positionality risk per
  PR #22 §9 F10.
- Anything not on the PR #22 §6 candidate-30 list. Use the list;
  do not improvise the corpus.

Pick from the canonical-case rows of PR #22 §6. The right artefact
is identifiable in under five minutes; if it takes longer, the
candidate list is being re-examined and the session is already
drifting.

---

## 3. Time budget and order of actions

**Hard ceiling:** 3 hours of clock time, including breaks. If the
session approaches 3.5 hours, stop. The workspace or the artefact
choice is wrong.

**Realistic budget**, with buffers:

| Block | Wall time | What happens |
|---|---|---|
| A — Setup | 0:00–0:15 | Reserve `pilot-001`. Add a `candidate` row with title only. Open the artefact. |
| B — Capture & metadata | 0:15–0:50 | Zotero record (item type *Film*; citekey via Better BibTeX; tag `pilot:included`). Wayback Save Page Now on the catalogue URL. Record `wayback_url` and `zotero_key` on the row. Promote state to `included`. |
| C — Notes file & viewing | 0:50–1:30 | Create `notes/pilot-001.md` from the PR #26 §10 template. Fill front matter. Watch — or rewatch — the artefact's key segments, taking coding-journal entries with time-codes during viewing. State moves to `in-progress`. |
| D — Schema coding, first pass | 1:30–2:30 | Code §1.1 (already mostly populated), §1.2 (species; populate the `species` tab rows for primary subjects only — background taxa can wait), §1.3 (ecosystem), §1.4 (geography), §1.5 (narrative techniques). Use the data-validation dropdowns. Flag ambiguities with `[?]` and add `Ax` entries to the notes as you go. |
| E — Schema coding, second pass | 2:30–2:50 | If time permits: §1.6 (emotional), §1.7 (conservation framing), §1.9 (spectacle / structural-content scales). Skip §1.8, §1.10, §1.11, §1.12 if running long — flag with `[?]` and a single `Ax` entry per skipped sub-section. |
| F — Close | 2:50–3:00 | Set `confidence_overall`. Set `coded_date` if all §5 required-when-coded fields are set; otherwise let state revert to `included`. Log effort to the `effort-log` tab (artefact ID, minutes, date, coder). Commit on `pilot/coding-week-1`. |

The 1:1 ratio between Capture+Notes (Blocks B+C) and Coding
(Blocks D+E) is intentional. Capture under-effort is the most
common first-session failure; coding over-effort is the second.

**Second artefact, if and only if the first reaches `coded` by
2:00.** Apply the same template starting at block A → Block B with
the remaining budget. If the first artefact is still at
`in-progress` at 2:00, the second artefact does not exist. PR #25
§1's hour budget is non-negotiable.

---

## 4. What to capture first

The four anchors that survive everything else, in this order:

1. **Wayback URL.** The Save Page Now snapshot. This is the
   archival citation; if every other surface is corrupted, the
   artefact is still findable through this URL. Capture this
   *first*, before anything else risks distraction.
2. **Zotero record + citekey.** The bibliographic anchor. All
   downstream surfaces reference the citekey.
3. **Title, year, producer, primary URL, language, form
   classification.** PR #21 §1.1's required-required core
   metadata. Five fields.
4. **The artefact ID and its row state.** `pilot-001` reserved on
   the `corpus` tab, status `included`. Single source of truth for
   "this thing now exists in the corpus".

Everything else is recoverable from these four. Do not attempt to
code species, narrative, or framing before all four are committed.

---

## 5. What to ignore for now

Blanket ignore-list for the first session:

- `intensity_per_technique` (§1.5) — pilot deferral per PR #26 §5.
- `evidence_independence` (§1.11) — record `none` if unclear, with
  one `Ax`. Do not investigate the production team.
- `linked_artefacts` (§1.12) — explicitly not populated during
  single-artefact sessions (PR #26 §5).
- `four_construct_classification` (§1.11) — if behavioural-change
  claims are not explicit in the artefact, leave the eight cells
  empty with a single `[?]` flag and one `Ax` entry. Do not
  hallucinate claim structure where there is none.
- Background taxa (§1.2). Primary subjects only on session one.
- Inter-coder reliability. Out of scope per PR #22 §8.
- Hypothesis tracking. Monthly synthesis only, per PR #25 §3.
- The hypothesis-status file. Do not open it during the session.
- Vocabulary expansion. Log gaps as amendment candidates in
  `amendments-log.md`; do not edit `schema/vocabularies/*.md`
  during the session.
- Spreadsheet aesthetics. Column widths, conditional formatting,
  banding. None of it changes during a session.
- Tooling experiments. No new browser extensions. No CSV export
  scripts. No "let me just try this Zotero plugin".
- Reading new literature. Anything Zotero surfaces that requires
  reading goes into the *Background* collection with a `read-later`
  tag. Reading happens in synthesis, not coding.

A single rule covers most of the above: **if it is not on a state-
machine path in PR #26 §7, it is not in scope for this session.**

---

## 6. When to stop coding and log instead

Hard stops, each with an explicit numeric or behavioural trigger.
When any one fires, flag the field with `[?]`, write an `Ax` entry
in the notes file, and move on. Do not negotiate.

- **Five-minute rule.** A single field has been mulled for more
  than five minutes without a decision. Stop. Flag.
- **No-fit rule.** The vocabulary lookup returns no term that fits
  the observed phenomenon. Stop. Flag. Log an amendment candidate
  to `amendments-log.md` with scope `vocabulary` and the
  motivating artefact ID. Move on.
- **Re-watch rule.** The field requires watching a specific
  segment of the artefact a third time. Stop. Flag. Two re-watches
  is the maximum the budget supports.
- **Interdependence rule.** Two adjacent fields are entangled in a
  way the schema does not anticipate. Flag both. Write *one* `Ax`
  covering the interdependence; do not write two.
- **Confidence rule.** The coder is below ~70 % confident on the
  cell value. Flag. The confidence threshold is the trigger; the
  flag is the response.
- **Schema-shape rule.** The field requires the *schema itself* to
  change before it can be filled honestly. Flag. Log to
  `amendments-log.md` with scope `schema`. Do not try to backfill
  with a closest-fit; honest emptiness is preferred to mis-coded
  data.

The `Ax` entries are the session's most valuable output. The 13
amendments PR #23 derived from three artefacts will not all repeat
on a single canonical-case artefact, but two to four amendment
candidates per session is the realistic expectation.

---

## 7. What counts as a successful first session

The bar is deliberately low. Methodological output is the success
criterion, not coverage.

A session is successful if all of the following are true at close:

- One row exists on `corpus` at `coded` *or* `included` state. Not
  `candidate`.
- One notes file exists with at least: front matter populated,
  capture record filled, ≥ 3 coding-journal entries.
- ≥ 1 entry has been added to `amendments-log.md`. Two to four is
  the realistic range.
- ≥ 1 entry has been added to `failure-log.md`, cross-referencing
  one of `F1`–`F17` from PR #22 §9 / PR #23 *or* a new F-number.
- `effort-log` carries at least one row for the session.
- The coder has formed an opinion on whether the workspace itself
  is workable. The opinion does not need to be correct or final.

Explicit non-criteria — none of these are required:

- Every PR #21 §1 field populated.
- Zero `[?]` flags. (Zero is suspicious, not impressive.)
- `confidence_overall = high`. `medium` is the default expectation
  for a first session.
- Reaching `coded` state. Reverting cleanly to `included` and
  resuming next session is a fully acceptable outcome.
- A second artefact. The first is enough.

---

## 8. Failure signals

Any one of these means the session is going wrong; two or more
means stop and review before the next session.

- Wall time exceeds 3.5 hours.
- Time spent on capture exceeds time spent on coding.
- The data-validation dropdown does not match the seed vocabulary
  (workspace bug — log to `amendments-log.md` with scope
  `workspace-spec` and stop, even mid-session).
- The coding journal has prose entries but zero `Ax` entries by
  the 90-minute mark.
- The failure log is still empty by close.
- The coder feels the urge to add a column, a tab, or a
  vocabulary entry mid-session — and is tempted to act on it.
- Three or more amendment candidates have scope `framework-
  candidate` rather than `vocabulary` or `schema` (over-generalising
  from one artefact).
- The notes file has been re-templated mid-session.
- The coder finds themselves explaining a coding decision to an
  imagined audience rather than to the notes file.

---

## 9. Post-session review

Two phases. The split mirrors PR #18's 24-hour rule (SG1).

**Same day, after closing the session:** nothing. Walk away. Do
not re-open the spreadsheet. Do not re-read the notes. Do not
amend `amendments-log.md`. The session is complete.

**Within 24 hours, but not on the same day:**

- Re-read `notes/pilot-001.md` end-to-end. Once.
- Walk the `corpus` row left-to-right on the spreadsheet. Are the
  values readable to a hypothetical second coder?
- Read the new `amendments-log.md` entries. For each, decide:
  signal (keep, marked `D3 candidate: yes`) or noise (delete or
  mark `D3 candidate: no`).
- If a single-bullet edit to `coder-protocol.md` would have
  prevented one of the session's ambiguities, make that edit.
  Otherwise leave the protocol alone.
- Write a one-paragraph postmortem at
  `postmortems/session-001.md`: artefact, time, what worked, what
  did not, dominant friction, one decision for next session.

**Do not** during this 24-hour window:

- Edit any `schema/vocabularies/*.md` file.
- Edit `corpus-schema.md`.
- Re-template `notes/pilot-001.md`.
- Open a calibration discussion with anyone.
- Begin session two.

---

## 10. What feeds back into methodology revision

Generous about logging; ruthless about acting.

After session one, *act on* only:

- A vocabulary addition where the same gap was hit on this
  artefact *and* no existing seed term covers it. (Both
  conditions; either alone is insufficient.)
- A schema clarification where a field was structurally
  unfillable, not merely hard to fill. *Unfillable* means: the
  field as written cannot be answered for this artefact in any
  sensible value, including `none` and `n/a`.
- A coder-protocol bullet whose addition would prevent a repeated
  ambiguity in session two.
- A workspace-spec defect (a tab, column, or validation that
  literally does not work). Logged with scope `workspace-spec`;
  fixed in a separate, deliberate sitting.

After session one, *do not act on* — but log freely:

- "The schema needs another sub-section." Wait until ≥ 3 artefacts
  confirm.
- "The form taxonomy needs a thirteenth value." Wait until two
  artefacts cannot be classified under any of the current twelve.
- "The notes template needs reorganising." Wait until two sessions
  confirm the same friction in the same place.
- "The spreadsheet layout is wrong." Wait until two weeks of
  sessions confirm.
- "The hypothesis tracker should look different." Out of scope —
  hypothesis-status edits are monthly synthesis only.
- "PR #21 §1 needs a new section." Wait until D2 (the failure
  log's synthesis); the failure log is the legitimate vehicle.

---

## 11. What should NOT trigger immediate framework expansion

The following are *expected* outcomes of a first session and should
not produce new framework documents, addenda, or doctrine:

- A surprising or annoying artefact behaviour.
- A vocabulary gap on a single field.
- A failure-log entry of a type not listed in `F1`–`F17`. PR #23
  surfaced seven new ones across three artefacts; novel failures
  are the norm.
- A coding decision that felt unprincipled. PR #22 §9 F10
  (researcher positionality) is in scope precisely because of
  this.
- The temptation to write an addendum to PR #21 §1.
- The temptation to draft a new framework document — narrative-
  technique taxonomy, habitat-coverage typology, bias-measurement
  framework, anything.
- An urge to "fix the workspace" mid-pilot, including
  reorganising tabs, adding pivot views, or scripting a join.

The remediation is the same in every case: log the observation to
`amendments-log.md` with scope `framework-candidate` and a
descriptive title, and proceed. Synthesis (D2 and D3) is the
correct vehicle for these; sessions are not.

PR #25 §6 governs: no further framework PRs land before D2 is
published.

---

## 12. Lifecycle

This document is single-use. Within 24 hours of the first
session's close, it is one of:

- reduced to a one-paragraph postmortem at
  `.agents/tasks/task-pilot-execution/postmortems/session-001.md`,
  with a `git rm` of this file in the same commit, *or*
- left in place, untouched, if the postmortem records that the
  guide was actively used end-to-end and would still be useful
  for sessions two and three.

It is not promoted, not amended, not extended. Subsequent sessions
follow the standing workflow in PR #25 and the workspace
specification in PR #26; if a second-session guide is ever needed,
it is authored separately under
`.agents/tasks/task-pilot-execution/` with its own lifecycle.
