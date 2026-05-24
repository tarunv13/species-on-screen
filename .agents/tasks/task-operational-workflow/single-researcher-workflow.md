# Single-Researcher Operational Workflow

**Status:** working document. Not steering. Not doctrine. Lives at
`.agents/tasks/task-operational-workflow/` and is revisable at any time
without a numbered amendment.

**Scope.** How one researcher, working part-time at roughly ten hours per
week, executes the project as it now stands: the pilot corpus per PR #22,
the doctrine-validation walk per PR #18, and the platform sitting in
pre-prototype calibration after PR #17 and the supporting research-matrix
artefacts in PRs #19–#24.

**Time horizon.** The 8–12 weeks during which the pilot is executed,
the milestone walk is conducted, and the doctrine calibration PR is
opened. After that period, this document is reviewed and rewritten or
retired.

---

## 0. Operating principles

- One researcher, one budget — about ten hours a week. Anything that
  does not survive that constraint is fictional.
- The pilot is a learning instrument. Its output is methodological;
  substantive findings wait for a v1.0 corpus.
- Frameworks are downstream of evidence. The corpus produces the next
  framework; the next framework does not produce the corpus.
- Two tracks (research, platform), one researcher. They do not run in
  parallel inside the same week.
- Every artefact carries an explicit *what this is not* section. If it
  does not, it is doing more work than it has earned.

---

## 1. Weekly workflow structure

A two-mode week. In any given week the researcher operates in one mode;
mixing the modes produces neither track's output.

| Mode | Allocation | What happens |
|---|---|---|
| **Research week** | ~8 of 10 hours | Pilot capture, coding, or synthesis. Platform code is read-only — preview review of any open agent PR is the only platform task permitted. |
| **Platform week** | ~8 of 10 hours | One platform task: the doctrine walk, the calibration PR, or one bounded prototype scope. Research is read-only — Zotero queue triage and that is it. |

The remaining ~2 hours/week are reserved for evidence logging, literature
triage, and GitHub housekeeping (§3). They run in *every* week regardless
of mode.

Default ratio across the 8–12 week pilot window: 5 research weeks : 1
platform week : 1 buffer week. The buffer is non-negotiable. If a week
is missed, the next available week absorbs it as buffer; deliverables
move, not the weekly hour budget.

---

## 2. Recommended task order

Pilot phases per PR #22 §12, sequenced; the walk inserted at the only
slot it can occupy without disrupting coding flow.

1. **Setup** (~10 hrs, weeks 1–2). Open Zotero library; create the
   spreadsheet from the PR #21 §1 schema; install the Wayback Machine
   browser plugin; assemble the candidate-30 list from PR #22 §6;
   write a one-screen coder protocol. Stop here. Do not start coding
   before setup is complete.
2. **Capture** (~15 hrs, weeks 2–4). Archive each candidate at the
   moment of inclusion — Wayback for web, downloaded copies where
   licensing permits, screenshots of platform-volatile pages. Enter
   Zotero record + spreadsheet stub + capture path. No coding yet.
3. **Walk + calibration** (one platform week within weeks 4–6). Run
   the methodology in PR #18 §5 against the deployed site. Open a
   single calibration PR within seven days of the walk, citing the
   walk observation per change. Do not delay; do not amend the
   doctrine outside this PR.
4. **Coding** (~50 hrs, weeks 4–9). Code 4–6 artefacts per research
   week. Each artefact is closed in a single session — no half-coded
   entries left overnight. The failure log is written *during* coding,
   not after.
5. **Synthesis and write-up** (~20 hrs, weeks 9–12). Failure log first
   (D2). Vocabulary amendments second (D3). Methodology paper draft
   third (D4). Scaling decision document last (D5). The corpus itself
   (D1) is already complete by this point.

---

## 3. Daily, weekly, monthly cadence

**Daily** (any day a session is held — not every calendar day):

- Open the running session note (one Markdown file per week, dated).
  Two or three sentences before starting.
- Close the session note before stopping. Note: artefacts coded,
  ambiguities, failure-log additions, time spent.
- One Zotero entry for any cited paper read or skimmed during the
  session, even partial.

**Weekly:**

- One commit to `.agents/tasks/task-pilot-execution/` carrying the
  week's session notes and any failure-log delta.
- A 30-minute review on the last research session of the week: did
  planned artefacts get coded? Are any fields drifting? Is the coder
  protocol still being followed?
- If a platform PR is open, one preview review against the steering
  doctrine. No more.

**Monthly:**

- One synthesis pass against the running failure log: are F1–F17
  confirming, or are new failure modes surfacing?
- One Zotero triage: prune the queue to ≤10 papers actively relevant
  to a pilot deliverable.
- One sustainability check (§10).

Anything that wants to happen more often than monthly that is not on
the daily/weekly list is a candidate time trap (§5).

---

## 4. Highest-leverage activities

Roughly ordered by return on hour invested.

1. **Coding the next artefact.** Direct progress against D1 and the
   only source of evidence for D2 and D3. Nothing else has this
   leverage.
2. **The failure log written during coding.** Failures observed in
   the moment are concrete; failures recalled in synthesis are
   abstract.
3. **Capturing artefacts to Wayback at the moment of inclusion.** F9
   (archive instability) is real. A lost artefact mid-pilot is a lost
   coded entry.
4. **The walk and the calibration PR.** The platform doctrine cannot
   be evaluated against anything else. One walk unblocks all
   subsequent platform decisions.
5. **One Zotero entry per session.** The literature foundation
   accretes through small consistent deposits; a "literature week"
   never arrives.

---

## 5. Time traps

Refuse:

- Expanding the codebook before pilot evidence supports it. The 13
  amendments surfaced in PR #23 are inputs to D3, not pre-pilot edits.
- Authoring further framework companions (narrative-technique
  taxonomy, habitat-coverage typology, bias-measurement framework)
  before D5 is drafted. Each is its own multi-week task.
- Inter-coder reliability statistics. PR #22 §8 defers this; a second
  coder on ~5 artefacts is the maximum scope.
- Reading new literature beyond what a coding session surfaces as
  immediately relevant. The Zotero queue is for *deferred* reading;
  weekly triage prunes it.
- Re-styling species pages, refactoring `safari-scene.js`, or any
  platform polish that is not a calibration outcome. The doctrine
  specifies the shape; calibration adjusts the values; nothing else
  is in scope right now.
- New steering files. The PR #17 doctrine is provisional. Adding more
  doctrine before the walk completes makes the walk impossible to
  execute against a stable target.
- Discussions about v1.0 corpus scaling before D5 is drafted. The
  decision belongs to D5; conversations beforehand pre-bias it.

---

## 6. Preventing framework overproduction

- One framework document per PR; no PR adds two.
- Every new framework PR must cite at least one piece of pilot or
  coding evidence motivating it. PRs #19, #20, #21, #24 were authored
  without pilot evidence because the pilot did not exist; that mode
  is now closed.
- Any framework proposed before the pilot completes must answer:
  *what would the pilot have to find for this to be wrong?* If the
  answer is *nothing*, the framework is not framework, it is
  preference.
- No further framework PRs land before D2 (failure log) is published.
  Frameworks resume after the failure log gives them targets.

---

## 7. Balancing research and platform work

The two tracks are coupled at exactly two points and decoupled
everywhere else.

- **Coupling point 1: the doctrine validation walk.** Research-side
  methodological discipline (PR #18's seven safeguards) governs how
  the walk is conducted. The deployed site is the subject. The walk
  is one platform-week task and produces one calibration PR.
- **Coupling point 2: D4, the methodology paper.** The platform
  exists in part as a public-facing instantiation of the project's
  editorial posture (PR #17). D4 may cite the platform as an
  artefact; the platform does not need to instantiate D4 in code.

Outside those two points the platform and the research-matrix run
independently. Do not let a research insight retrigger platform
refactor work mid-pilot; do not let a platform observation force a
methodology amendment outside the calibration PR.

The default is research. Platform work happens only when the
calendar (§1) says so.

---

## 8. What should NOT be built yet

- The Tiger / Sundarbans terrain-descent prototype. PR #18 §6 lists
  six pieces of evidence required first; none have arrived.
- Any database, ingestion pipeline, or coding-platform tooling. PR
  #22 is explicit: spreadsheet, Zotero, Wayback. Anything more is
  engineering ahead of evidence.
- A public dataset release for the pilot corpus. PR #22 §8 defers
  this; release waits for v1.0 with consent and ethics review.
- A v1.0 corpus larger than ~40 artefacts. The pilot has not
  concluded; scaling is D5's decision.
- Inter-coder reliability infrastructure (Krippendorff calculators,
  agreement dashboards, reconciliation UIs). The pilot has one coder.
- Audience-side instruments (surveys, eye-tracking, reception
  studies). PR #22 §8 defers; PR #20 reserves the territory.
- Algorithmic or API-driven sourcing of artefacts. The pilot uses
  purposive stratified sampling per PR #22 §5.
- New species pages, new biomes, expansion of the platform's
  ten-species set. PR #17 Editorial Canon XII forbids this drift.
- Any doctrine amendment outside the calibration PR. The calibration
  PR is the only legal vehicle until the doctrine moves out of
  *provisional*.

---

## 9. Minimum viable infrastructure

Sufficient stack for the entire pilot window. Outgrowing it is a
signal that scope has expanded past the pilot — re-read §10 before
adding tools.

| Function | Tool | Why this and not more |
|---|---|---|
| Reference management | Zotero (free desktop app) + one shared library | Citation export, attachment storage, tag-based filtering. No reason to upgrade. |
| Coding spreadsheet | Google Sheets *or* a single Numbers/Excel file | One row per artefact, columns from PR #21 §1. Versionable via export-to-CSV-on-commit. |
| Web archive | Wayback Machine "Save Page Now" + browser extension | Free, citable, persistent. Run on every artefact at inclusion. |
| Annotation | Zotero PDF annotator for papers; spreadsheet `notes` cell + a per-artefact `notes/{slug}.md` for artefacts | Two annotation surfaces is the maximum the budget supports. |
| Failure log | One Markdown file: `.agents/tasks/task-pilot-execution/failure-log.md` | Append-only. One entry per failure observation, dated, by failure ID (F1–F17 + new). |
| Hypothesis tracking | One Markdown file: `.agents/tasks/task-pilot-execution/hypothesis-status.md` mirroring PR #24's six-field schema | Updated only at monthly synthesis (§3). Falsification criteria copied from PR #24; evidence accreting as the pilot progresses. |
| Documents | Repository-tracked Markdown for everything except the spreadsheet and PDF attachments | Diff-able, citable by commit hash. |
| Manuscript drafting | Markdown → Pandoc → Word/PDF for D4 | Style follows the eventual journal; switching tools at submission is cheap. |
| GitHub | One branch per deliverable, one PR per branch | See §11 *GitHub discipline*. |

---

## 10. Signs the project is becoming unsustainably complex

If two or more of these are true at any monthly check-in, scope
reduction is required before the next research week.

- More than five frameworks under active maintenance. PR #17's three
  doctrines plus PR #19, #20, #21, #24 already approach this; new
  ones increase the count.
- A coding session has not completed an artefact in two consecutive
  research weeks.
- The failure log has not been added to in three consecutive coding
  sessions. Failures are being missed, not absent.
- A new infrastructure decision is being considered (database,
  dashboard, API ingestion). The temptation to engineer is the
  symptom.
- Any deliverable's effort estimate has grown by more than 25 % from
  PR #22 §12 without a documented reason in the running session note.
- A platform refactor has consumed a research week.
- The Zotero queue exceeds 30 items.
- The researcher cannot, from memory, name what is in §8 (the
  do-not-build list). The boundary is no longer felt.
- Any document not on the lifecycle list (PR #17 doctrines, PR
  #19/#20/#21/#24 frameworks, this workflow, the pilot deliverables
  D1–D5) has appeared in `.kiro/steering/` or `.agents/`.
- A discussion has begun about v1.0 sampling design or n > 40 corpus
  before D5 is drafted.

The remediation in every case is the same: pause for one week,
re-read §5 and §8, drop the lowest-value active commitment, document
the drop in the failure log.

---

## 11. Per-area operational rules

**Pilot corpus execution.** Order is fixed: capture before coding,
coding before synthesis. Never code an artefact whose Wayback capture
has not landed.

**Coding workflow.** One artefact per session, closed before stopping.
The schema is PR #21 §1; deviations are recorded in the failure log,
not silently absorbed. The coder protocol is one screen of bullet
points; longer means it is being expanded prematurely.

**Evidence logging.** The failure log is the single source of evidence
for D2 and the trigger for D3. Each entry: artefact ID, failure ID
(F-number), one paragraph of what was observed, one sentence of
provisional response. No analysis in the failure log; analysis is for
D2.

**GitHub discipline.** One branch per deliverable. Suggested namespace:
`pilot/setup`, `pilot/capture-week-N`, `pilot/walk-calibration`,
`pilot/coding-week-N`, `pilot/d2-failure-log`, `pilot/d3-vocab`,
`pilot/d4-paper`, `pilot/d5-scaling`. One PR per branch. PR
descriptions follow the established pattern (*what this is / what this
is not / lifecycle*). Squash-merge after self-review unless a second
reviewer is available. The platform branch namespace
(`feat/`, `harden/`, `fix/`, `infra/`) remains reserved for platform
PRs and is not used for research deliverables.

**Document organisation.** Working documents live under
`.agents/tasks/task-{name}/`. Doctrine lives under `.kiro/steering/`
(currently the three PR #17 documents — and only those). The pilot
has a single dedicated task folder: `.agents/tasks/task-pilot-execution/`.
Anything that does not fit either location does not exist yet.

**Zotero / literature workflow.** One library; three top-level
collections — *Pilot Corpus* (every artefact), *Method* (papers cited
in PR #19 through PR #24), *Background* (everything else). Tags carry
the schema fields, not collections. Queue triaged monthly; nothing
pinned to *must-read* without a deliverable that needs it.

**Annotation process.** Two surfaces only. PDFs annotated in Zotero.
Artefacts annotated in `notes/{slug}.md` adjacent to the spreadsheet
row. Quote-and-cite at the moment of reading; do not re-read to
extract quotes for synthesis later.

**Hypothesis tracking.** PR #24's ten hypotheses copied verbatim into
`hypothesis-status.md` with three additional rows added at monthly
synthesis: *evidence as of date*, *direction of evidence (supports /
contradicts / null)*, *change since last review*. No new hypotheses
added until D2 is complete. Falsification criteria are not amended
pre-pilot.

**Methodology revision process.** Schema amendments derived from
coding land in D3, not in PR #21. PR #21 is read-only until D3
publishes. The amendments document is itself the amendment. The same
rule applies to PR #19, PR #20, and PR #24 — no in-place revision of
already-merged research-matrix documents until pilot evidence
justifies it.

**Platform-prototype coordination.** Platform work happens only in
platform weeks (§1). The walk is the only platform-blocking task
during the pilot window. After the calibration PR merges, the next
platform increment is paused until the pilot reaches D2 — the failure
log may reframe what the platform should be in service of.

**Publication pipeline preparation.** D4 targets one journal selected
before week 9, on the basis of fit (methodology papers in conservation
communication, environmental humanities, or media studies). The
journal's word limit and format govern D4's structure; do not write a
free-form draft and reformat. No co-authors added during the pilot.
No pre-prints before D5 is drafted; the scaling decision is upstream
of any wider claim.

---

## 12. Lifecycle

This document is reviewed at the end of the pilot window — week 12, or
whenever D5 is drafted, whichever comes first — and either:

- rewritten for the v1.0 phase if v1.0 is approved, or
- retired (moved to `.agents/tasks/task-operational-workflow/archive/`)
  if v1.0 is deferred.

It is not promoted to `.kiro/steering/`. It binds no PR. Its only job
is to make the next 8–12 weeks executable by one person without
re-deriving the schedule each Monday.
