# Pilot Corpus Coding Workspace — Specification

**Status:** working spec. Not steering. Not doctrine. Lives at
`.agents/tasks/task-pilot-execution/` and is revisable when an entry
in `amendments-log.md` carries the scope tag `workspace-spec`.

**Scope.** The actual working environment for executing the pilot
corpus per PR #22, against the schema authored in PR #21, the
typology in PR #19, the audience-effects framework in PR #20, the
exemplar coding evidence in PR #23, and the hypothesis tracker in
PR #24. The workspace itself runs on the cadence prescribed by
PR #25.

**Lifecycle.** Read-only during the pilot window unless an
amendment lands in `amendments-log.md`. Reviewed at end of pilot
and either rewritten for v1.0 or retired alongside the operational
workflow.

---

## 0. Operating principles

- Three surfaces, each with one job. No surface duplicates another.
- The schema is PR #21 §1; this spec only specifies *how it is
  worked with*, not what it is.
- No binary artefact files in the repository. Captures live in
  Zotero attachments and on the researcher's local disk; the repo
  records *where they are*, not the bytes themselves.
- Every operational choice is reversible by hand. Anything that
  needs a script to undo is out of scope.

---

## 1. Workspace surfaces

The workspace consists of exactly three places.

| Surface | Holds | Source-of-truth for |
|---|---|---|
| **Zotero library** | Bibliographic records for every artefact and every paper. PDF / video attachments where licensing permits. Citekeys via Better BibTeX. | Citation. |
| **One spreadsheet** (Google Sheets or a single `.xlsx`) | The corpus rows, the species rows, the controlled vocabularies, and the spreadsheet mirrors of the failure / amendment / effort logs. | Tabular data. |
| **Repository markdown** under `.agents/tasks/task-pilot-execution/` | Per-artefact notes, the canonical failure log, the canonical amendments log, the canonical hypothesis tracker, the controlled vocabularies as markdown, and weekly CSV snapshots of the spreadsheet. | Prose, audit trail, schema, vocabularies. |

The cross-key between all three surfaces is the `artefact_id`
(§14). One `artefact_id` resolves to one Zotero record + one
spreadsheet row + one notes file. No exceptions.

---

## 2. Spreadsheet tabs

Seven tabs. No more.

| Tab | Purpose | Row granularity |
|---|---|---|
| `index` | Filter-driven summary view (counts by form / region / species category; status counts; effort totals). Computed from `corpus` and `effort-log`. | n/a (formulas only) |
| `corpus` | The artefact table. One row per artefact, columns per §3. Frozen first column: `artefact_id`. | One row per artefact. |
| `species` | Per-taxon rows for §1.2 of PR #21, keyed by `artefact_id`. | One row per (artefact, taxon) pair. |
| `vocabularies` | Controlled vocabulary lists (§6). Data-validation source for the multi-tag columns on `corpus`. | One row per (vocabulary, term) pair. |
| `failure-log` | Filterable mirror of `failure-log.md` (§9). | One row per failure observation. |
| `amendments` | Filterable mirror of `amendments-log.md` (§15). | One row per amendment. |
| `effort-log` | Minutes per coding session, per artefact. Drives D5 scaling estimates. | One row per (artefact, session) pair. |

Markdown files are canonical for `failure-log` and `amendments`;
the spreadsheet tabs are mirrors maintained at monthly synthesis.
Spreadsheet writes never replace markdown writes.

---

## 3. Core columns on the `corpus` tab

The `corpus` tab columns are the *flattened* PR #21 §1 schema plus
the pilot-specific audit columns below. Schema field names are
preserved verbatim from PR #21 §1.1 through §1.12 — do not rename.

### 3.1 Flattening rules

| PR #21 construct | Spreadsheet representation |
|---|---|
| Single-value field | One column, same name. |
| List of strings (multi-tag, controlled vocab) | One column. Pipe-delimited (` \| `) tokens drawn from the matching `vocabularies` tab list. |
| List of free-text strings (e.g., `notable_absences`) | One column. Pipe-delimited. |
| Structured record list (`primary_subject_taxa`, `background_taxa`, `urls`) | Lifted to its own tab. `species` tab for §1.2; URL list collapsed to two columns on `corpus` (`url_primary`, `url_archive`) — additional URLs go in the artefact's notes file. |
| `four_construct_classification` (§1.11) | Eight columns: `claim_awareness` / `evid_awareness` / `claim_emotional` / `evid_emotional` / `claim_understanding` / `evid_understanding` / `claim_behavioural` / `evid_behavioural`. Values: `Y`, `N`, `partial`. |
| `balance_classification` (§1.9) | Derived column (formula on `spectacle_intensity` and `structural_content`). Not hand-edited. |
| `mismatch_flag` (§1.4) | Derived column (`producer_country` ≠ any of `subject_country`). Not hand-edited. |

### 3.2 Pilot-specific audit columns (added after the §1 fields)

| Column | Type | Purpose |
|---|---|---|
| `coding_status` | enum (§7) | Lifecycle state. |
| `confidence_overall` | enum (`high` / `medium` / `low`) | Per §8. |
| `ambiguity_count` | integer | Number of `Ax` entries in the artefact's notes file. |
| `notes_path` | string | Relative path to `notes/{artefact_id}.md`. |
| `zotero_key` | string | Better BibTeX citekey. |
| `wayback_url` | URL | Save Page Now archive URL captured at inclusion. |
| `local_capture_path` | string | Path on the researcher's local disk; not in the repo. Empty if Wayback is sufficient. |
| `included_date` | ISO 8601 | When the row was added in `included` state. |
| `coded_date` | ISO 8601 | When the row entered `coded` state. Empty otherwise. |
| `schema_version_at_coding` | string | Value of the schema version (e.g. `v0.1`) under which the artefact was coded. |
| `vocab_version_at_coding` | string | Value of the vocabulary version under which the artefact was coded. |
| `coder_id` | string | Initials. |
| `recoded_under` | string | Schema version, if the artefact was re-coded after an amendment. Empty otherwise. |

Anything that does not fit one of these columns goes into the
artefact's notes file. The spreadsheet does not absorb prose.

---

## 4. The `species` tab

Keyed by `artefact_id`. One row per (artefact, taxon) pair.
Columns: the seven §1.2 sub-fields per taxon
(`taxon_name_common`, `taxon_name_scientific`, `taxon_id_external`,
`coverage_proportion`, `coverage_role`, `iucn_status_at_publication`,
`typology_categories`) plus a `subject_class` enum (`primary` /
`background`) distinguishing the two §1.2 lists.

`typology_categories` is the multi-tag from PR #19, pipe-delimited.
A tiger row reliably tags seven values; that is the expected
behaviour.

---

## 5. Required vs optional fields

Required and optional are inherited from PR #21 §1, not redefined
here. The pilot adds two layered rules.

**By coding state:**

| Coding state | Fields that must be populated |
|---|---|
| `candidate` | `artefact_id`, `title`, `form_classification` (provisional), `included_date` (TBD). |
| `included` | All `Required: Yes` fields in PR #21 §1.1 (Core metadata). `wayback_url` set. `zotero_key` set. `included_date` set. |
| `coded` | Every `Required: Yes` field across PR #21 §1.1–§1.12. All `confidence_overall` set. `notes_path` set and the file populated against the §10 template. `coded_date` set. `schema_version_at_coding` and `vocab_version_at_coding` set. |
| `retired` | A reason recorded in the artefact's notes file under section *Retirement*. The row is preserved on the `corpus` tab; not deleted. |

**Pilot-specific deferrals.** During the pilot window, the
following PR #21 fields are *coded if observable* but treated as
optional rather than blocking the `coded` state:

- `intensity_per_technique` (§1.5) — kept in notes if recorded.
- `evidence_independence` (§1.11) — recorded as `none` where
  unclear, with an `Ax` ambiguity entry.
- `linked_artefacts` (§1.12) — populated only at monthly
  synthesis, not during single-artefact coding sessions.

Any further deferral lands in `amendments-log.md` with scope
`pilot-deferral` before the pilot resumes.

---

## 6. Controlled vocabularies

**Canonical form.** One markdown file per vocabulary under
`schema/vocabularies/`, with a stable filename listed in §13.
Each file follows a single template:

```
# Vocabulary: {name}
Vocabulary version: {vN.N}    Last amendment: {ISO date}
Source: {PR # and § that defines or seeds this vocabulary}

| term | definition (≤25 words) | added (date) | motivating artefact_id | status |
|---|---|---|---|---|
| {term-1} | … | {date} | {id or "seed"} | active |
| {term-2} | … | {date} | {id} | active |
| {term-3} | … | {date} | {id} | retired (see amendment AM-007) |
```

**Spreadsheet mirror.** The `vocabularies` tab carries the same
data, one row per (vocabulary, term) pair, used as the data-
validation source for the `corpus` tab's multi-tag columns.

**Strategy.**

- Initial vocabularies are seeded from PR #19 (species typology),
  PR #20 (form classifications, audience-effects constructs),
  PR #21 §1.5–§1.10 (narrative techniques, emotional registers,
  framing modes, biome scheme, audience relationship terms,
  interaction modes), PR #23 (the five term-additions surfaced in
  the exemplar packets, queued as `proposed` until D3).
- Multi-tag fields use Google Sheets *Data validation → List from
  range*, source pointing at the matching column on the
  `vocabularies` tab. Adding a term outside the validated set
  raises a warning; it does not silently succeed.
- Term additions follow the path: edit
  `schema/vocabularies/{name}.md` → log an entry in
  `amendments-log.md` (scope `vocabulary`) → mirror the change to
  the `vocabularies` tab → bump `vocabulary_version` in the
  vocabulary file. No shortcuts.
- Retired terms are not deleted; status flips to `retired (see
  amendment AM-NNN)`. Coded artefacts retain the retired term in
  their cell value; re-coding under a newer vocabulary version is
  opt-in.

---

## 7. Coding states

Five values for `coding_status`. State transitions are unidirectional
except where noted.

| State | Meaning | Allowed next states |
|---|---|---|
| `candidate` | On the §6 candidate list of PR #22. Not yet captured. | `included`, `dropped` (with reason in notes) |
| `included` | In the corpus, captured to Wayback, Zotero record exists. Not yet coded. | `in-progress`, `retired` |
| `in-progress` | A coding session is open. The state never persists across calendar days; if a session ends without `coded`, the row reverts to `included` at session close. | `coded`, `included` |
| `coded` | All §5 required-when-coded fields populated; notes file complete; confidence set. | `recoded` (under a newer schema version), `retired` |
| `retired` | Removed from the analytical corpus. Row preserved on `corpus` tab; reason recorded in the artefact's notes file. | (terminal) |

`recoded` is not a state — it is a re-entry into `coded` with
`recoded_under` populated.

---

## 8. Coding confidence

Two levels.

**Field-level.** Optional `[?]` prefix in front of any cell value
flags ambiguous coding for that field. Mandatory whenever the
coder's subjective confidence in that field is below ~70 %. Carries
no quantitative interpretation; it is a signal that the cell
deserves a corresponding `Ax` entry in the notes file (§9).

**Artefact-level.** `confidence_overall` is `high`, `medium`, or
`low`. Required at the transition to `coded`. Heuristic anchors:

- `high` — zero or one `[?]`-flagged fields; coder would defend
  the coding to a second reviewer without caveat.
- `medium` — two or three flagged fields, or one structurally
  ambiguous field (e.g., `four_construct_classification` on a
  short-form artefact).
- `low` — four or more flagged fields, or any field where the
  schema vocabulary did not contain a term that fit.

Confidence is a methodological signal, not a KPI. Do not surface
the distribution as a chart, dashboard, or progress visual; it is
read at monthly synthesis only. PR #22 §10 S1 (≥85 % codability,
≥85 % confidence) governs the threshold; routine review of the
`low` count is the only intended use.

---

## 9. Ambiguity logging

Three layers; each does one job.

1. **In-cell `[?]` flag** on the spreadsheet — fast signal during
   coding. No prose.
2. **`Ax` entry** in the artefact's notes file — the
   chronological, prose record of the ambiguity. `A1`, `A2`, …
   numbered per artefact. Each entry: field, observation,
   provisional decision, related failure ID (`F1`–`F17` or new),
   date.
3. **Failure-log entry** in `failure-log.md` when the ambiguity
   reflects a *systematic* schema problem rather than an artefact-
   specific oddity. Each failure-log entry: failure ID, artefact
   ID(s), one paragraph of observation, one sentence of
   provisional response. No analysis; analysis is for D2.

Mapping rule: every `Ax` entry that proposes a vocabulary or
schema change escalates to an `amendments-log.md` entry; every
`Ax` entry that confirms an existing F-failure cross-references
that F-number; an `Ax` entry that does neither stays local to the
artefact's notes file.

`ambiguity_count` on the `corpus` tab equals the count of `Ax`
entries in the artefact's notes file. Maintained by hand at
session close.

---

## 10. Evidence notes

**Path.** `notes/{artefact_id}.md`, one file per artefact.

**Template** (every notes file starts here; sections are not
deleted, only emptied where not applicable):

```
---
artefact_id: {pilot-NNN}
title: {original-language title}
form_classification: {form}
producer: {creator}
year_published: {YYYY}
zotero_key: {citekey}
wayback_url: {url}
local_capture_path: {path or "—"}
schema_version: {vN.N}
vocab_version: {vN.N}
coder_id: {initials}
included_date: {ISO}
coded_date: {ISO or "—"}
---

## Capture record
- Source URL: …
- Wayback save: …  (date, status code)
- Zotero attachment: yes / no (reason if no)
- Local copy: path or none (rights note)

## Coding journal
Chronological notes during the coding session(s). Date each
entry. Quote-and-cite at the moment of reading. Time-codes for
video; section anchors for text; in-game references for games.

## Ambiguities
- A1. {field} — {observation}. Provisional decision: …. Related failure: {F-number or "—"}.
- A2. …

## Decisions
Map of which ambiguity led to which provisional coding choice.
Cross-reference back to the spreadsheet cell.

## Cross-references
- Zotero citekeys consulted during coding.
- Linked artefacts (other pilot rows referenced).

## Retirement
(Empty unless the artefact reaches `retired`. Reason and date.)
```

The notes file is the *only* prose surface for an artefact. Do not
write coding prose into spreadsheet cells; do not write artefact-
level decisions in `failure-log.md`.

---

## 11. Citation handling

**One Zotero library, three top-level collections** per PR #25
§11: *Pilot Corpus*, *Method*, *Background*.

**Item types.** Use the closest native Zotero type per artefact
form:

- nature-documentary, streaming-platform-production → *Film*
- youtube-ecology, tiktok-virality, instagram-aesthetics → *Video
  Recording* (with platform recorded in *Library Catalog*)
- environmental-journalism → *Magazine Article* / *Newspaper
  Article*
- interactive-documentary, vr-immersive → *Web Page* (with the
  type captured in tags)
- serious-game, non-commercial-game → *Software*
- citizen-science → *Web Page*

**Citekeys.** Better BibTeX, format `{auth}{year}{shorttitle}`,
case-folded. Citekeys are stable; they appear unmodified in the
notes file front-matter, the `corpus` tab, and any drafted
deliverable.

**Tagging.** Three tag prefixes:

- `pilot:included` — every artefact at `included` state or beyond.
- `method:{prN}` — every paper cited in PR #19 / #20 / #21 / #22
  / #23 / #24, by PR number.
- `corpus-evidence:{artefact_id}` — papers that materially shaped
  a specific artefact's coding decisions, applied to those
  papers (not the artefact).

**No bibliographies authored by hand.** D2, D3, and D4 cite via
citekeys; the bibliography is exported from Zotero at draft
time.

---

## 12. Version tracking

Two version numbers, both ASCII strings, both surfaced in every
relevant artefact.

| Version | Increments when | Recorded on |
|---|---|---|
| `schema_version` | A column is added, removed, or has its semantics changed on the `corpus` or `species` tabs. Source-of-truth: `schema/corpus-schema.md`. | Each `corpus` row's `schema_version_at_coding`; each notes file's front-matter; each amendments-log entry. |
| `vocab_version` | A vocabulary term is added, retired, or has its definition changed. Source-of-truth: header of each `schema/vocabularies/{name}.md`. | Each `corpus` row's `vocab_version_at_coding`; each notes file. Vocabulary-specific (each vocabulary has its own version). |

**Snapshots.** Every Friday of a research week, export the
spreadsheet as CSV (one CSV per tab) into
`data/snapshots/{ISO-date}/`. Update the symlink-equivalent files
at `data/corpus-latest.csv`, `data/species-latest.csv`, etc., by
overwrite. Commit. The git history is the corpus's revision log;
no separate "version history" sheet is maintained.

**Re-coding under a new schema.** When `schema_version` increments,
already-`coded` artefacts are *not* automatically re-coded. The
`recoded_under` column is empty until and unless an artefact is
revisited. Re-coding happens deliberately, one artefact at a
time, and is logged in the notes file's coding journal with a new
dated entry.

---

## 13. Folder layout

Under `.agents/tasks/task-pilot-execution/`:

```
.agents/tasks/task-pilot-execution/
  coding-workspace-spec.md          ← this document
  coder-protocol.md                 ← one-screen protocol per PR #25 §2
  schema/
    corpus-schema.md                ← flat column reference (mirrors PR #21 §1)
    vocabularies/
      species-categories.md         ← seeded from PR #19
      forms.md                      ← seeded from PR #20 / PR #21 §1.8
      narrative-techniques.md       ← seeded from PR #21 §1.5
      emotional-registers.md        ← seeded from PR #21 §1.6
      framing-modes.md              ← seeded from PR #21 §1.7
      biomes.md                     ← seeded from PR #21 §1.3
      audience-relationship.md      ← seeded from PR #21 §1.8
      interaction-modes.md          ← seeded from PR #21 §1.10
  data/
    corpus-latest.csv               ← weekly export
    species-latest.csv
    vocabularies-latest.csv
    snapshots/
      {YYYY-MM-DD}/                 ← one folder per Friday snapshot
        corpus.csv
        species.csv
        vocabularies.csv
        failure-log.csv
        amendments.csv
        effort-log.csv
  notes/
    {artefact_id}.md                ← one file per artefact, per §10 template
  failure-log.md                    ← canonical (mirrored to spreadsheet tab)
  hypothesis-status.md              ← canonical (PR #24 schema, monthly updates)
  amendments-log.md                 ← canonical (mirrored to spreadsheet tab)
```

The spreadsheet itself does not live in the repo; its weekly CSV
export does. If using Google Sheets, the document URL is recorded
in `coder-protocol.md` only.

---

## 14. Artefact IDs

**Format.** `pilot-NNN`, three-digit zero-padded sequential, per
PR #21 §1.1's `[corpus-version]-[sequential-number]`. The pilot
is `pilot`; the next corpus version (if v1.0 lands) starts a new
sequence.

**Allocation.** Strictly first-come-first-served at the moment of
moving from `candidate` → `included`. IDs are never reassigned. A
`retired` artefact keeps its ID; the next inclusion takes the
next sequential number, leaving the gap visible.

**Slug.** A separate `slug` column on `corpus` carries a
human-readable handle for filenames where they would otherwise
collide (e.g., on the researcher's local disk). Format:
lowercase, hyphenated, ≤40 characters. The slug is *not* the
identifier; cross-surface references use the `artefact_id`.

**Form prefix not embedded in ID.** Form classification lives in
its own column. Embedding it in the ID was considered and
rejected — re-classifying an artefact across the form vocabulary
(plausible during the pilot per PR #23) would otherwise force ID
churn.

---

## 15. Methodology amendment tracking

`amendments-log.md` is canonical. Append-only. One entry per
amendment.

**Entry format:**

```
## AM-NNN — {short title}
- Date: {ISO}
- Scope: vocabulary | schema | state-machine | workspace-spec | pilot-deferral
- Motivating artefact(s): {pilot-NNN, …}  or  "—" for cross-cutting
- Failure references: {F-number, …}  or  "—"
- Before: {one sentence}
- After: {one sentence}
- Rationale: {≤80 words}
- Effective from: {schema_version or vocab_version}
- D3 candidate: yes | no | maybe
```

**Rules.**

- Amendments do not retroactively change `coded` artefacts.
  `schema_version_at_coding` / `vocab_version_at_coding` preserve
  the original coding context.
- An amendment with `D3 candidate: yes` is automatically pulled
  forward into the D3 vocabulary-amendments document at synthesis;
  the `amendments-log.md` is the working tracker, D3 is the
  published synthesis.
- The `amendments` tab on the spreadsheet is mirrored from this
  file at monthly synthesis; the spreadsheet tab is never the
  source.
- Amendments to *this* spec carry scope `workspace-spec` and
  amend §0–§17 of this document directly, with a dated commit and
  a reference to the AM-NNN entry in the commit message.

---

## 16. Minimum viable end-to-end workflow

Eight steps. The order is enforced by the state machine in §7.

1. **Identify candidate** → add Zotero record (correct item type,
   citekey via Better BibTeX) → reserve next `pilot-NNN` →
   add a `candidate` row to `corpus`.
2. **Capture** → run *Save Page Now* on the artefact URL → record
   the Wayback URL in the row → if licensing permits, attach a
   local copy to the Zotero record → fill `local_capture_path`
   only if the local copy is needed for offline coding (otherwise
   leave empty).
3. **Promote to `included`** → confirm all PR #21 §1.1 fields are
   set → set `included_date` → state moves to `included`.
4. **Open coding session** → set state to `in-progress` → create
   `notes/{artefact_id}.md` from the §10 template → start the
   coding journal.
5. **Code fields** → schema sub-section by sub-section (PR #21
   §1.1 → §1.12) → vocabulary lookups via the `vocabularies` tab's
   data-validation dropdown → flag ambiguities with `[?]` and
   add corresponding `Ax` entries to the notes → log new amendment
   candidates in `amendments-log.md` (scope `vocabulary` or
   `schema`).
6. **Close session** → review §5 required-when-coded fields → set
   `confidence_overall` → set `coded_date` → state moves to
   `coded` → log the session in `effort-log` (artefact ID,
   minutes, date, coder).
7. **Weekly close** (last research session of week) → export CSVs
   to `data/snapshots/{ISO-date}/` and overwrite `*-latest.csv` →
   commit on the week's `pilot/coding-week-N` branch → write the
   week's session-note summary.
8. **Monthly synthesis** → mirror failure-log markdown to the
   spreadsheet `failure-log` tab → mirror amendments-log markdown
   to the `amendments` tab → update `hypothesis-status.md` per
   PR #24's six-field schema → re-prune Zotero queue.

D2 / D3 / D4 / D5 (PR #22 §13) are produced by reading the
artefacts of this workflow at synthesis (PR #25 §2 phase 5). They
are not parallel deliverables; they are downstream of it.

---

## 17. What stays manual

Everything below remains hand-driven during the pilot. None of
these are upgraded to scripts, watchers, or automations until
after D5.

- *Save Page Now* clicks for Wayback captures.
- Zotero record entry and citekey verification.
- Vocabulary-term entry (validated by the dropdown, not
  auto-completed).
- Markdown ↔ spreadsheet mirroring of `failure-log` and
  `amendments`.
- CSV export from the spreadsheet (File → Download → CSV per
  tab).
- Cross-surface joins (artefact_id is the only join key; no
  scripts perform the join).
- Inter-coder reliability work (out of scope per PR #22 §8).
- Hypothesis-status updates (PR #24's schema, by hand, monthly).
- Notes-file front-matter authoring and the `Ax` numbering.
- Effort logging (one row per session, typed by hand at session
  close).

What is *not* manual is exactly what git, the spreadsheet
application, Zotero, and Pandoc do for free. Anything that
requires writing code is out of scope; the pilot is a
methodological instrument, not a tooling project.

---

## 18. Lifecycle

Reviewed at the end of the pilot window or when D5 is drafted,
whichever comes first. Either rewritten for v1.0 or retired
alongside `single-researcher-workflow.md`. Not promoted to
`.kiro/steering/`. Binds no PR. Its only job is to make the
spreadsheet, the Zotero library, the markdown notes, and the
git history mutually legible to one researcher across the eight-
to-twelve-week pilot window.
