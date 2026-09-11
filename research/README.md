# Species on Screen — research collection pipeline

A Python pipeline that collects **media metadata** and **biodiversity
identifiers** for the biodiversity-media corpus, and binds the two together.

It exists to serve the brief that opened this repository — mapping global
digital media to Earth's biodiversity through the IUCN Global Ecosystem
Typology and the Red List — without violating the discipline the corpus
framework and the pilot workspace already established.

```sh
cd research
python -m pip install -r requirements.txt
cp ../.env.example ../.env     # then fill in the keys you have
python -m sos_pipeline doctor
```

### Two repositories

The code is here and public. **The corpus is not.** The validated corpus and
the Paper 1 instrument live in the private repository
`tarunv13/species-on-screen-research`, and the pipeline writes into a checkout
of it:

```sh
git clone git@github.com:tarunv13/species-on-screen-research.git   # beside this repo
echo 'SOS_WORKSPACE_ROOT=/path/to/species-on-screen-research/task-pilot-execution' >> ../.env
```

`SOS_WORKSPACE_ROOT` wins over `corpus.workspace_root` in the config, because
the path is machine-specific and does not belong in a committed file. Without
it the read-only commands — `doctor`, `plan`, `registry --print-postgres-ddl` —
still run. Anything that writes a corpus row refuses and says why; it will not
create the directory, because an invented workspace would take a harvest and
put it somewhere no version control is watching.

The working split is: **raw harvest output stays offline** in `research/var/`
(git-ignored), and the **validated, cleaned corpus is PR'd** into the private
repo once it has been checked by hand. That is `coding-workspace-spec.md` §12's
weekly close, done deliberately rather than automatically.

---

## The one thing to understand first

The pipeline has **two planes**, and the line between them is not a style
preference.

| Plane | Who works here | What it may write |
|---|---|---|
| **Harvest** | The machine | Core metadata (§1.1): title, creator, dates, platform, URL, duration, languages, rights, access state. Plus taxon identifiers (§1.2). |
| **Corpus** | A human coder | Everything else. Narrative technique, emotional register, conservation framing, spectacle-vs-understanding, behavioural claims, research usefulness. |

Every harvested row arrives as a `candidate` with the interpretive columns
**empty**. `schema.validate_row` refuses a row that fills one, and a test walks
the whole coder-owned column set against every row every adapter emits.

That boundary is `.agents/tasks/task-pilot-execution/coding-workspace-spec.md`
§17, which holds the coding workflow manual for the duration of the pilot. The
pipeline collects candidates; it does not code them, does not click Save Page
Now, does not write Zotero records, and does not author notes files.

---

## Commands

| Command | What it does |
|---|---|
| `doctor` | Configuration, credentials, source readiness, quota left today. Makes no calls. |
| `plan` | The sampling frame and a quota estimate. Makes no calls. |
| `harvest` | Collect artefact metadata into the corpus. |
| `resolve` | Bind taxa to GBIF and the Red List; bind landscapes to the typology. |
| `signal` | Culturomics pass: Wikipedia pageviews, GDELT coverage. |
| `import-mcl` | Ingest a vetted Meta Content Library extract carried out of the enclave. |
| `snapshot` | The weekly CSV snapshot (§12) and the manual capture worklist. |
| `registry` | Rebuild the derived relational database. `--print-postgres-ddl` for the Postgres form. |

```sh
python -m sos_pipeline plan --show-queries
python -m sos_pipeline harvest --source youtube --landscape sundarbans --limit 50
python -m sos_pipeline resolve --landscape sundarbans
python -m sos_pipeline snapshot
```

Run the tests with no network and no test dependency:

```sh
python -m unittest discover -s sos_pipeline/tests -t .
```

---

## Sources

### Media

| Source | Access | Notes |
|---|---|---|
| **YouTube Data API v3** | API key | `search.list` has its **own bucket: 100 calls/day**. Everything else costs 1 unit against a separate 10,000/day pool. Enumerating a channel's uploads playlist is ~100× cheaper than searching, so seed channels are the preferred frame and discovery is off by default. |
| **Meta Content Library** | Enclave only | See below. Facebook and Instagram, through a secure research environment. |
| **TMDB** | API key | Film and television. Search finds candidates; it does not classify them. |
| **OMDb** | API key | A second film register, kept as a cross-check rather than merged. 1,000 calls/day. |
| **IGDB** | Twitch OAuth | Games, the artefact side of the Blake (2025) systematic map. |

### Biodiversity and culturomics

| Source | Access | Notes |
|---|---|---|
| **GBIF** | None | Backbone taxonomy. The same API `scripts/ingest/gbif.mjs` uses, so corpus and archive join on `usageKey`. |
| **IUCN Red List v4** | Bearer token | Selects the assessment **in force at publication**, not today's, because that is what §1.2 asks for. |
| **IUCN GET** | Local file | See "The typology table" below. |
| **GloBI** | None | Interaction evidence, with study citations, in the same RO terms the archives use. |
| **GDELT** | None | News coverage, driven by the `newsQuery` strings already in `landscapes.json`. |
| **Wikipedia** | None | Pageviews as a salience signal. Attention, not biological importance (§7.7). |
| **Wayback** | None | **Availability check only.** It never submits a save; it writes a worklist for you to click. |

---

## Meta Content Library: the two-machine shape

The Content Library API **cannot be reached from your own machine.** It is
served only inside Meta's Secure Research Environment or the ICPSR SOMAR
Virtual Data Enclave, through Amazon WorkSpaces Secure Browser, and all
interaction happens in a Jupyter notebook there.

So the workflow is:

1. **In the enclave.** Paste `enclave/mcl_enclave_harvest.py` into a notebook,
   set the CONFIG block, run it. It queries `facebook/posts/preview` (or submits
   an asynchronous job for large pulls), aggregates to surface level, applies
   the widely-known-account thresholds, and writes two files: `<label>.csv` and
   `<label>.vetting.json`.
2. **Check and approve.** Confirm no column carries post, comment or profile
   text, then set `export_approved` to `true` in the vetting record.
3. **Export both files** through the approved channel into
   `research/var/mcl-imports/`.
4. **On your machine.** `python -m sos_pipeline import-mcl`.

The importer refuses an extract whose vetting record is missing, incomplete,
unapproved, or declares user content. The pair travels together or not at all.

**Documented limits, enforced in the enclave script:** 60 synchronous searches
per minute; 1,000 results per synchronous query at 10 per page; 1 asynchronous
job per minute; 100,000 results per job; and a combined UI + API retrieval cap
of **500,000 records per rolling 7 days** — CSV downloads from the Content
Library UI count against the same cap.

**Export eligibility is Meta's rule:** Facebook Pages with at least 15,000
followers, public profiles with at least 25,000 followers or a verified status.
The enclave script applies those thresholds before writing, and the importer
applies them again on the way in.

### One thing you must decide before Facebook rows can land

The platform vocabulary in the corpus framework predates Content Library access
and names **no Meta surface at all**. Adding `facebook`, `facebook-page`,
`facebook-group` and `threads` is a vocabulary amendment, and §12.2 requires a
definition, an example and a rationale for each.

Those are written for you in `config/vocabulary-amendments.json`, all marked
`proposed`. A row carrying a proposed term is **refused**. To put them in
force, set `status` to `accepted` and fill `accepted_by` and `accepted_date`,
then record the decision in `amendments-log.md` — the markdown log is canonical,
the JSON file is its machine-readable mirror.

This is deliberately not a config toggle you would flip without noticing.

---

## The typology table

There is no public JSON API for the IUCN Global Ecosystem Typology. Download
the Ecosystem Functional Group table from <https://global-ecosystems.org/explore>
(v2.1; Keith et al. 2022, *Nature*, doi:10.1038/s41586-022-05318-4) and save it
as `config/iucn-get-typology.csv` with columns:

```
realm_code, realm_name, biome_code, biome_name, efg_code, efg_name
```

If the file is absent, **every ecosystem binding stays unresolved.** No EFG
code is ever guessed. Matching is lexical and conservative: a landscape binds
only on an unambiguous match, and two near-equal candidates are reported for a
human to settle rather than arbitrated.

---

## What the pipeline refuses to do

| It will not | Because |
|---|---|
| Fill an interpretive field | coding-workspace-spec §17 |
| Download content files | §8.1 — metadata is collectable, content is not |
| Collect comments by default | §8.4 / §8.8 — audience comments are human-subject data |
| Collect from creators below 10,000 followers | §8.3 — consent-or-opt-out territory |
| Admit an artefact whose audience size is unknown | Admitting on ignorance loads the corpus with exactly the small creators §8.3 protects |
| Submit Save Page Now | §17 keeps captures manual |
| Publish a precise locality for a threatened taxon | SENSITIVE-DATA-POLICY.md — that is a blocking condition |
| Guess an identifier | A wrong GBIF key or EFG code propagates into everything citing it |
| Overwrite a coded cell | The merge protects coder-owned and write-once columns under every flag |

Every refusal is **counted** and appears in the run's sampling-frame report. An
exclusion that leaves no trace is a silent bias; a counted one is a documented
sampling decision.

---

## Where things are written

| Path | Contents | Committed |
|---|---|---|
| `<SOS_WORKSPACE_ROOT>/data/` | `corpus-latest.csv`, `species-latest.csv`, `vocabularies-latest.csv`, `capture-worklist.csv`, `snapshots/` | yes, to the **private** repo, by PR after manual validation |
| `research/var/raw/` | Raw API payloads as JSONL, with provenance | no |
| `research/var/runs/<run-id>/` | `run-manifest.json`, `receipts.jsonl`, `enrichment.jsonl`, `sampling-frame.md` | no |
| `research/var/quota-ledger.json` | Daily spend per bucket | no |
| `research/var/artefact-id-ledger.json` | `(source, external_id)` → `pilot-NNN` | no |
| `research/var/registry.sqlite3` | Derived relational registry | no |

The CSVs are the corpus, and they live in the private repository. The SQLite
registry is derived and can be deleted and rebuilt. `var/` is git-ignored and
never leaves this machine.

---

## Provenance

Every HTTP call leaves a receipt: endpoint, parameters with credentials
redacted, status, timestamp, payload hash, quota spent. Every run leaves a
manifest naming its configuration by hash, the repository commit, every query
issued, everything excluded and why, and every field that could not be
resolved.

`Unresolved` is a first-class value. A field the pipeline could not attest is
written **empty** with a reason recorded — never filled with a plausible guess.
That follows the standing precedent in this repository: Bates et al. 2005 was
left unresolved through two milestones rather than given an invented DOI.

---

## Credentials

Keys live in `.env` at the repository root, which is git-ignored. The config
file names the environment variable and never the value. A real shell variable
always wins over the file.

`scripts/fetch-tmdb-data.js` previously carried a live TMDB key in committed
source. It now reads `TMDB_API_KEY`, but **the old key is in git history and
should be rotated before reuse.**

---

## Sources of authority

This pipeline implements decisions made elsewhere. Where it disagrees with one
of these, the source wins.

> **The authority documents live in a different repository.**
> This repository is public and holds the code. The Paper 1 instrument —
> `task-research-matrix/`, `task-pilot-execution/`, the coding manuals and the
> corpus itself — lives in the private repository
> **`tarunv13/species-on-screen-research`**, and stays there until the papers
> land.
>
> The modules below cite those documents by section throughout, and the
> citations stay. They are the record of what the code implements and why: a
> reader with corpus access resolves them, and a reader without one learns that
> the instrument exists and is held privately, which is the truth.

- `.agents/tasks/task-research-matrix/corpus-seed-framework.md` — the schema
  (§1), inclusion and exclusion (§2, §3), sampling (§4), culturomics (§7),
  ethics (§8), bias (§9), the seed-corpus recommendations (§11), vocabulary
  maintenance (§12).
- `.agents/tasks/task-pilot-execution/coding-workspace-spec.md` — flattened
  columns (§3), coding states (§7), citation handling (§11), versioning and
  snapshots (§12), folder layout (§13), artefact ids (§14), the end-to-end
  workflow (§16), and the manual boundary (§17).
- `SENSITIVE-DATA-POLICY.md` — locality generalisation and the review gate.
- `scripts/ingest/landscapes.json` — the 24-landscape sampling frame.
- `scripts/ingest/places.config.json` — per-place actors and interactions.

## One schema collision, recorded not hidden

`coding_notes` is specified twice in the framework, under §1.5 and §1.9. A flat
table cannot carry two columns of the same name. The pipeline splits them as
`coding_notes_techniques` and `coding_notes_balance`, and records the choice as
an amendment candidate in `sos_pipeline/schema.py` rather than making it
silently. Nothing else is renamed.
