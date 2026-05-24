# Week-1 Bootstrap Sprint Plan

**Status:** single-use document. Not steering. Not doctrine. Lives at
`.agents/tasks/task-bootstrap-sprint/` and either reduces to a
one-paragraph postmortem at `postmortem.md` at end of week or
retires entirely.

**Scope.** The minimum critical actions required to move the
project from *all-planned, none-executed* to *first-row-of-evidence
and platform-calibrated*. One bootstrap week. Total budget: ~13-14
hours across 7 days.

**What "done" for the week means.** One coded (or `included`) row
exists at `pilot-001`. Pages serves production and at least one
preview. The walk has run and a single calibration PR is open. The
workspace folder is operational on `main`. Anything beyond this is
out of scope for the sprint.

---

## 0. Operating principles for this week

- Bootstrap week, not steady-state. PR #25 §1's two-mode discipline
  starts *next* week. This week mixes platform and research tasks
  out of necessity; that is the only week it does.
- One coding session this week — not plural. Two would push the
  budget to ~17 hours and leave every other bootstrap step
  half-done.
- Hour discipline: if a day overruns by more than 50 %, stop. The
  remainder slides to the next available day. Day 7 (the session)
  does not slide; if it cannot run on Day 7, it goes to the
  following weekend and the rest of the week is treated as having
  failed gracefully.
- No new framework PRs land this week. The legal authoring
  vehicles are the workspace-setup PR (Days 2-3) and the
  calibration PR (Day 6). Anything else stays in
  `amendments-log.md` per PR #26 §15.
- Ambiguity logs and failure logs accept anything; act on nothing
  this week beyond what each day's *do-not* list explicitly
  permits.

---

## 1. Pre-sprint state assumed

- PRs #1-#27 merged on `main`. (Confirmed: #26 at `e6d89fe`, #27
  at `5f7d94c`.)
- `.agents/tasks/task-pilot-execution/` contains only the two
  specifications. The actual workspace skeleton (vocabularies,
  schema-flat, log skeletons, spreadsheet) does **not** yet exist
  on disk.
- GitHub Pages source-switch from PR #16 may or may not have been
  performed. Day 1 verifies.
- No coded artefacts. No Zotero library yet. No spreadsheet yet.

---

## 2. The seven days

### Day 1 — Stabilise and verify

- **Primary objective.** Pages is serving correctly; the steering
  doctrine and workspace specs are confirmed live on `main`.
- **Concrete tasks.**
  1. GitHub Settings → Pages → Source. Confirm *Deploy from a
     branch*; Branch *gh-pages* / `/ (root)`. If still on the old
     *GitHub Actions* mechanism, switch now per PR #16's runbook
     in `.github/PREVIEW_WORKFLOW.md`.
  2. Wait ~5 minutes. Visit `https://tarunv13.github.io/species-on-screen/`.
     Confirm production loads; cards click; the safari transition
     completes; reduced-motion path loads if the OS preference is
     set.
  3. Open one recently-merged PR's preview URL (e.g.
     `…/preview/26/`). If the cleanup workflow has already removed
     it, that is correct — open the most recent *open* PR's
     preview instead, or the next preview generated when Day 2's
     setup PR is opened.
  4. Confirm `.agents/tasks/task-pilot-execution/coding-workspace-spec.md`
     and `first-session-plan.md` are on `main`.
- **Effort.** ~1 h.
- **Dependencies.** None.
- **Done means.** Pages source confirmed at `gh-pages`. Production
  and at least one preview both load end-to-end. The two pilot-
  execution specs visible on `main`.
- **Do NOT.** Tweak `deploy.yml`. Add new workflows. Make any
  cosmetic changes to the site. "Test" the cinematic transitions
  beyond a single end-to-end check. Begin any platform refactor.
  Read the doctrine documents (the walk on Day 4 needs ≥24 hours
  since last reading).

### Day 2 — Workspace skeleton

- **Primary objective.** The empty pilot-execution folder structure
  exists per PR #26 §13 with placeholder log files ready to receive
  content.
- **Concrete tasks.**
  1. Create branch `pilot/setup`.
  2. Create `failure-log.md` — header + one-line "append-only"
     statement + the entry-format reminder copied from PR #26 §9.
     No entries.
  3. Create `amendments-log.md` — header + the AM-NNN entry
     template copied from PR #26 §15. No entries.
  4. Create `hypothesis-status.md` — copy PR #24's H1-H10
     verbatim. Add three blank columns: *evidence as of date*,
     *direction of evidence*, *change since last review*. Per
     PR #25 §11, updated only at monthly synthesis; left blank
     for now.
  5. Create `coder-protocol.md` — one screen, ≤25 lines, bullet
     form. Source: PR #21 §1 sub-section anchors; PR #27 §6 hard
     stops; PR #26 §7 state machine summary. The spreadsheet URL
     placeholder goes here, populated on Day 3.
  6. Confirm the empty subfolders exist: `notes/`, `data/`,
     `data/snapshots/`, `schema/`, `schema/vocabularies/`. A
     `.gitkeep` per empty folder is sufficient.
- **Effort.** ~1.5 h.
- **Dependencies.** Day 1 done.
- **Done means.** `pilot/setup` branch contains the skeleton; the
  layout matches PR #26 §13 exactly; nothing has been authored
  beyond placeholders and the hypothesis-status copy.
- **Do NOT.** Author any of the eight vocabularies (Day 3). Add
  any test rows or sample failure entries. Create the spreadsheet
  yet. Edit PR #24's hypotheses (copy verbatim only). Open the PR
  yet — wait for Day 3's content so the setup is one PR, not two.

### Day 3 — Workspace content

- **Primary objective.** The flat schema reference and the eight
  seed vocabularies are committed; the spreadsheet exists with
  seven tabs and working data validation.
- **Concrete tasks.**
  1. Author `schema/corpus-schema.md` — flat column reference for
     the `corpus` and `species` tabs. Each column row: name; source
     PR/§; type; required Y/N; data-validation source if multi-tag.
     Definitions defer to PR #21 §1; this file is a flat lookup,
     not a redefinition.
  2. Author the eight vocabulary markdown files at `schema/vocabularies/`
     per PR #26 §6 template. Sources:
     - `species-categories.md` ← PR #19 (17 categories)
     - `forms.md` ← PR #20 / PR #21 §1.8 (12 forms)
     - `narrative-techniques.md` ← PR #21 §1.5 + PR #23's five
       proposed amendments (status `proposed`)
     - `emotional-registers.md` ← PR #21 §1.6 (13 registers)
     - `framing-modes.md` ← PR #21 §1.7 (9 modes)
     - `biomes.md` ← PR #21 §1.3
     - `audience-relationship.md` ← PR #21 §1.8
     - `interaction-modes.md` ← PR #21 §1.10
  3. Create the Google Sheets spreadsheet (or one .xlsx file). Seven
     tabs per PR #26 §2: `index`, `corpus`, `species`,
     `vocabularies`, `failure-log`, `amendments`, `effort-log`.
     Header rows match `corpus-schema.md`. Populate the
     `vocabularies` tab from the markdown files. Set data
     validation on each multi-tag column on `corpus` to pull from
     the matching column on `vocabularies`. Test one dropdown
     end-to-end.
  4. Record the spreadsheet URL in `coder-protocol.md`.
  5. Open PR `pilot/setup` against `main`.
- **Effort.** ~3 h. The heaviest day.
- **Dependencies.** Day 2 skeleton committed.
- **Done means.** Eight vocabulary files exist and reference their
  source PRs; `corpus-schema.md` exists; the spreadsheet has seven
  tabs and at least one data-validation dropdown verified working;
  the spreadsheet URL is in `coder-protocol.md`; the workspace-
  setup PR is open.
- **Do NOT.** Add a ninth vocabulary. Add columns not in PR #21 §1
  + PR #26 §3.2. Spend time on spreadsheet aesthetics (column
  widths, banding, conditional formatting). Create any test
  artefact rows. Pre-populate the `index` tab with anything beyond
  a header row — its formulas land later when there is data to
  pivot. Re-read the doctrine documents.

### Day 4 — Milestone walk

- **Primary objective.** Conduct the first milestone walk per
  PR #18 §5 and produce raw walk notes in the fixed format.
- **Concrete tasks.**
  1. Pre-walk preparation per PR #18 §5.1: re-read the three PR #17
     doctrine documents some time within the last 24 hours but
     **not** within the last 4 hours. Print the article/canon/
     principle names (no body text) onto one page or have it
     accessible. Open the walk-notes file in the fixed format ready
     to receive notes.
  2. Conduct the eight-stage walkthrough per PR #18 §5.2: cold
     landing → free planetary → single descent → full descent →
     return → second descent → third descent → close-and-sit.
  3. Take notes during/right after each stage in the fixed format.
     Cite doctrine by name. Log contradictions per PR #18 §5.4
     using type A / B / C.
  4. Sit for five minutes after closing the tab. Do not look at
     the workspace.
  5. Save: `.agents/tasks/task-doctrine-validation/walk-notes-{ISO-date}.md`.
     Commit on a `walk/notes-{ISO-date}` branch. No PR yet.
- **Effort.** ~2-2.5 h.
- **Dependencies.** Day 1 verified Pages live on `main`. ≥24 hours
  since last doctrine reading. Clear schedule (no other cognitive
  load that day). Per PR #18 §5.1: no caffeine before the walk.
- **Done means.** Walk notes committed in the fixed format with
  observer comments populated for all eight stages. Contradictions
  classified A / B / C. The walker has done the five-minute sit.
- **Do NOT.** Finalise contradictions (24-hour rule, SG1). Open
  any calibration PR yet (Day 6). Amend doctrine inline. Re-walk
  to confirm a finding (excitement-quarantine, SG6 — single walk
  only). Compare to other websites for "benchmarking". Record any
  quantitative measure outside the small permitted set in PR #18
  §3. Begin coding work today.

### Day 5 — Walk quarantine

- **Primary objective.** Honour PR #18's 24-hour rule (SG1). Apply
  the seven safeguards. No walk-derived editing of doctrine.
- **Concrete tasks.**
  1. SG2 — recall test. Without re-opening the deployed site,
     write what you remember from yesterday's walk. Compare to
     last night's notes. Flag mismatches.
  2. SG4 — plain-screen test. Re-walk briefly with reduced-motion
     enabled (or any high-contrast accessibility mode). Record
     whether the doctrinal observations still hold under the
     parallel track.
  3. SG6 — excitement quarantine. Mark anything that felt "great"
     during the walk for re-examination tomorrow. Do **not** add
     it to the calibration list yet.
  4. Light Zotero work permitted: open the library, create the
     three top-level collections per PR #26 §11 (*Pilot Corpus*,
     *Method*, *Background*). Configure Better BibTeX citekey
     format. Do not add records yet.
  5. First-session artefact selection per PR #27 §2. Pick one
     artefact from PR #22 §6's candidate-30 list that matches the
     six required and four disqualifying criteria. Write the
     choice into a private note (not yet committed).
- **Effort.** ~1-1.5 h.
- **Dependencies.** Day 4 walk done.
- **Done means.** Recall-test and plain-screen-test results
  recorded against yesterday's walk notes. Excitement-flagged
  items listed but not yet acted on. Zotero collections exist.
  First-session artefact chosen but not yet recorded in the
  workspace.
- **Do NOT.** Open the calibration PR (24-hour rule still
  pending). Start the Zotero record for the chosen artefact (Day
  6). Begin coding. Refactor anything observed during the walk.
  "Fix" anything in the platform. Add more candidate vocabularies
  to the workspace.

### Day 6 — Calibration PR + first-session preparation

- **Primary objective.** Open the single calibration PR per
  PR #18 §5.5 and complete PR #27 §1's pre-session checklist for
  Day 7.
- **Concrete tasks.**
  1. Re-read walk notes once. Identify only those values where the
     walk surfaced doctrine outside ±20 % of stated targets per
     PR #18 §5.5. Other observations stay in the walk-notes file
     as logged-but-not-acted.
  2. Open calibration PR amending only those values. Each amendment
     in the PR cites the specific walk observation as evidence.
     Branch `calibration/walk-001`. PR description follows the
     established pattern: *what this is / what this is not /
     lifecycle*. Numbering on Articles, Canons, and Principles is
     preserved per PR #17.
  3. PR #27 §1 pre-session checklist:
     - Spreadsheet has seven tabs and data validation works.
     - Zotero collections exist and Better BibTeX is configured.
     - Create the Zotero record for the chosen artefact (item type
       per PR #26 §11; citekey via Better BibTeX; tag
       `pilot:included`).
     - Reserve `pilot-001` on the `corpus` tab. State: `candidate`.
       Title only.
     - Save Page Now / Wayback workflow ready to fire on Day 7.
  4. Block 3 hours on Day 7's calendar. Phone silenced. One
     browser window. No music with lyrics.
- **Effort.** ~1.5 h.
- **Dependencies.** Day 5 quarantine results recorded. Day 3
  workspace operational.
- **Done means.** Calibration PR open with one citation per
  amendment. PR #27 §1 checklist green. Zotero record exists.
  `pilot-001` reserved at `candidate` state. Day 7 calendar
  blocked.
- **Do NOT.** Code any field on `pilot-001` yet (state stays
  `candidate`). Add anything to the calibration PR beyond
  ±20 % deviations. Over-prepare ("just in case the schema is
  wrong" — no). Read literature on the artefact's subject taxa
  ("warming up" — no, per PR #27 §5). Re-read doctrine documents
  cumulatively today (the calibration PR cites the walk; the walk
  cites the doctrine; the chain is enough).

### Day 7 — First coding session

- **Primary objective.** Execute PR #27 in full. Produce one row
  of usable research evidence.
- **Concrete tasks.**
  1. Run PR #27 §3's six-block sequence: Setup → Capture &
     metadata → Notes file & viewing → Schema first pass → Schema
     second pass → Close. Hard ceiling: 3 hours of clock time. If
     the session approaches 3.5, stop.
  2. Apply PR #27 §6's hard stops as soon as triggered: five-minute
     rule, no-fit rule, re-watch rule, interdependence rule,
     confidence rule, schema-shape rule.
  3. At close: set `confidence_overall`; set `coded_date` if every
     PR #26 §5 required-when-coded field is set, otherwise let
     state revert to `included`; log the session row to the
     `effort-log` tab; commit on `pilot/coding-week-1` branch.
  4. Walk away from the workspace per PR #27 §9 — same-day post-
     session work is *nothing*. The post-session review opens
     within 24-72 hours, in next week's research time.
- **Effort.** ~2.5-3 h hard ceiling.
- **Dependencies.** Days 1-6 all done. Calibration PR open
  (does not need to be merged before the session). Workspace
  operational.
- **Done means.** `pilot-001` exists at `coded` or `included`.
  `notes/pilot-001.md` populated against PR #26 §10 template.
  ≥1 entry in `failure-log.md`. ≥1 entry in `amendments-log.md`.
  ≥1 row in `effort-log` tab. `pilot/coding-week-1` branch
  committed. The post-session review queued for next week.
- **Do NOT.** Code a second artefact. Reach for `confidence_overall
  = high` (default expectation is `medium` per PR #27 §7).
  Complete fields you cannot honestly answer. Re-template the
  notes file mid-session. Open the post-session review the same
  day. Touch the calibration PR. Begin Day 8.

---

## 3. Cross-cutting rules

- **The calibration PR can land any time after Day 6.** It does
  not block Day 7. If it has not been reviewed by Sunday close,
  that is acceptable — it is open and visible.
- **The workspace-setup PR (Days 2-3) should land before Day 7.**
  The first session needs the schema-flat reference and the
  vocabularies on `main`. If self-review is enough, squash-merge
  on Day 3 evening. If a sleep-on-it pause is preferred, merge
  Day 4 morning before the walk.
- **Buffer absorption rule.** Days 2-6 each have natural slack.
  Days 1, 4, and 7 do not. If Day 2 or Day 3 overruns, push
  remaining work into Day 5 or Day 6's quieter slots before
  trying to compress Days 4 or 7.
- **The post-session review is next week's work.** Within 24-72
  hours of the session per PR #27 §9; not Day 7, not Day 8 of
  this sprint.
- **No reading the doctrine documents on Days 5-7.** PR #18 §5.1
  governs the pre-walk window; the days *after* the walk are also
  reading-light by design, so that Day 6's calibration sees the
  walk notes through fresh eyes rather than re-priming on
  doctrine.

---

## 4. End-of-week deliverable

By Sunday close of the bootstrap week:

- Pages serves production and at least one preview URL.
- The workspace-setup PR is merged on `main`.
- The calibration PR is open (or merged) with one citation per
  amendment.
- `task-pilot-execution/` contains: `failure-log.md`,
  `amendments-log.md`, `hypothesis-status.md` (PR #24 verbatim
  + three blank columns), `coder-protocol.md` (with spreadsheet
  URL), `schema/corpus-schema.md`, eight `schema/vocabularies/*.md`,
  empty `notes/`, empty `data/snapshots/`.
- One row at `pilot-001` on the `corpus` tab, state `coded` or
  `included`.
- One entry in `failure-log.md`. One entry in `amendments-log.md`.
  One row in the `effort-log` tab.
- `pilot/coding-week-1` branch committed.

This is the minimum viable evidence the week produces. It is not
"the pilot" — it is the first row plus the platform calibration.
From Week 2, the project operates in PR #25 §1's two-mode cadence
without a sprint document.

---

## 5. Lifecycle

Single-use document. Within 24 hours of Day 7 closing (or its
actual finishing date if the week slipped), this file is one of:

- reduced to a one-paragraph postmortem at
  `.agents/tasks/task-bootstrap-sprint/postmortem.md` listing
  what slipped and what stuck, with this file `git rm`'d in the
  same commit, *or*
- left in place as a reference if a Week-2 follow-on sprint is
  needed (it should not be — Week 2 onward follows PR #25).

It is not promoted to `.kiro/steering/`. It binds no PR. It does
not amend any prior framework. Its only job is to make the
boundary week between *all-planned* and *first-row-of-evidence*
executable by one person without re-deriving the schedule.
