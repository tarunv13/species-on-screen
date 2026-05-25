# Narrative Review Checklist

**Use when:** promoting `metadata.status` from `draft` → `in_review`,
or from `in_review` → `verified`.

**Time budget:** under 5 minutes per narrative.

**Outcome:** every item passes, or the narrative returns to `draft`.

This is a checklist, not a process. There are no reviewer roles, no
scoring, no second opinions, no approval flow. The schema and
[`narrative-ingestion-workflow.md`](./narrative-ingestion-workflow.md)
already define what is allowed; this document is how a human verifies
one narrative against them quickly.

The seven checks below operationalize the editorial-judgment items
in the workflow's §5 (claim/source check) and §3 (fragment rules),
plus the §7 failure modes most likely to slip past the build-time
integrity check (`scripts/check-narratives.js`). Items that require
external lookups — current taxonomy on Catalogue of Life, current
IUCN Red List status, observation-year alignment — sit outside this
quick pass and stay in the workflow's full §5 list.

---

## 1. Claim ↔ source alignment

- [ ] Open at least one cited source and locate the passage that
      supports `observation.summary`.
- [ ] The summary is a fair restatement, not an extension or a
      strengthening.

**Fail cue:** the summary contains a claim no cited source actually
makes, or strengthens a quantitative claim ("up to" → "regularly",
"some populations" → "the species").

## 2. Citation laundering

- [ ] If `observation.year` falls in the recent past (post-2015), at
      least one cited source dates from the actual observation or
      documentation window — not from a recent review alone.
- [ ] Reviews are cited only when a primary they synthesize is also
      cited.

**Fail cue:** the only source for a 1980 finding is a 2024
literature review. Cite the primary; the year follows.

## 3. Fragment restraint

Read `editorial.fragment` aloud:

- [ ] ≤ 12 words.
- [ ] Does not contain the species' common or scientific name, the
      place name, or a country.
- [ ] No conservation register words: *endangered*, *vulnerable*,
      *threatened*, *last*, *dying*, *losing*, *fragile*, *at risk*.
- [ ] Does not interpret, advocate, warn, or conclude — observes.
- [ ] Reads as a true statement about the world even with the
      species and place not yet attached.

**Fail cue:** any of the five is "no". Rewrite. There is no partial
pass.

## 4. Advocacy drift in body

Skim `editorial.body`:

- [ ] Narrates the observation, not the threat.
- [ ] No imperative or hortatory mood (*must*, *should*, *ought*,
      *we need to*, *cannot afford to*).
- [ ] Stakes mentioned (loss, decline, extinction risk) are
      attested in `sources[]`, not introduced as editorial framing.

**Fail cue:** the body argues for action, mourns, or appeals.
Editorial-voice (Canons I–II on the documentary narrator and the
present-tense register) is upstream; this check enforces it at
narrative scale.

## 5. Coordinate plausibility

- [ ] Open `place.coordinates` on any map (OpenStreetMap, Google
      Maps).
- [ ] The pin lands inside the actual ecological feature named by
      `place.name` and `place.type`.

**Fail cue:** a country centroid, a capital city, a national-park
headquarters, an arbitrary ocean point, or land coordinates for a
marine ecosystem.

## 6. Ecological specificity

- [ ] `place.type` is a single descriptor (e.g.
      *mangrove tidal forest*) — not a comma-joined list of habitats.
- [ ] `place.name` names a place, not a region. *Sundarbans*, not
      *South Asia*.
- [ ] `species.scientificName` is a species or subspecies — not a
      genus, not a clade.
- [ ] `observation.summary` is one fact. If it joins two findings
      with "and", it is two narratives.

**Fail cue:** any of the four is generic, compound, or theme-level.

## 7. TODO leakage

Search the narrative file for the literal string `TODO`:

- [ ] No `TODO` markers remain in narrative-data positions
      (commented-out optional-field hints like
      `// protectedArea: 'TODO'` are fine; live string values are
      not).

**Fail cue:** any unedited scaffolder placeholder. The scaffolder
generates these as forced-edit signals; their presence anywhere
above `metadata.status: 'draft'` is a clear bug. The build-time
integrity check does not catch placeholder strings inside otherwise
valid fields — only this human read does.

---

## The decision

If any check fails, return the narrative to `metadata.status:
'draft'` and note which check failed in the commit message that
sets the status back. There is no half-verified state and no
"conditional approval." Workflow §5 specifies this; the build-time
integrity check enforces the structural half. This document is the
editorial half.

---

## What this checklist does not do

- Does not assign reviewers.
- Does not require a second pair of eyes.
- Does not record reviewer identity in the schema.
- Does not score the narrative on a scale.
- Does not introduce a new `metadata` field for review state.
- Does not gate the cinematic surface (it gates `metadata.status`,
  which the cinematic surface does not read).
- Does not become doctrine. It operationalizes
  [`narrative-ingestion-workflow.md`](./narrative-ingestion-workflow.md)
  §3, §5, and §7 verbatim — if those move, this follows.
