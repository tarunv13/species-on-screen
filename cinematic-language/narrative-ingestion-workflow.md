# Narrative Ingestion Workflow

A narrative is one record: one place, one species, one observation, sources,
an editorial framing. The schema is frozen — see
[`ecological-narrative.example.ts`](./ecological-narrative.example.ts).

This document is how a researcher or editor moves a new narrative from idea
to `published` without losing restraint. It is deliberately short. There is
no review board, no queue, no scoring.

## Pipeline

The schema already defines the pipeline through `metadata.status`:

    draft → in_review → verified → published

Each transition has a single gate, defined below. Nothing else gates anything.

---

## 1. Creating a narrative

Before opening the editor:

1. Pick **one** observation. If you are describing two facts, you have two
   narratives.
2. Confirm a real place and a real species — not a clade, not a region.
3. Locate at least one citeable source for the observation **before** writing
   any prose.

Then create the record by copying the canonical example and replacing fields.
Use the schema vocabulary verbatim:

- `place.type` is a single descriptor, not a tag list.
- `observation.type` is one of the six declared values, not free text.
- `species.iucnStatus` is the current Red List value, not an inference.
- `metadata.schemaVersion` is `'1'`. It does not move until the schema does.

Set `metadata.status: 'draft'` and commit. The record now exists.

---

## 2. Evidence threshold

| Status       | Minimum evidence                                                                 |
| ------------ | -------------------------------------------------------------------------------- |
| `draft`      | One source of any kind. The schema requires this.                                |
| `in_review`  | Two sources, at least one of which is `peer_reviewed` or `field_report`.         |
| `verified`   | Two **independent** sources. `oral_account` alone never qualifies.               |
| `published`  | Same evidence as `verified`, plus a final editorial pass over fragment and body. |

**Independence** means: not derived from each other. A 2024 review that cites
a 1980 primary paper is **one** line of evidence, not two.

**Extraordinary claims** — a behavior never recorded elsewhere, a longevity
claim, a population estimate, a first-of-kind observation — require at least
one `peer_reviewed` source regardless of how many other sources exist.

---

## 3. Editorial fragments

The `editorial.fragment` is the only editorial element that may surface in
cinematic space (see [`editorial-voice.md`](../.kiro/steering/editorial-voice.md)
and [`cinematic-vocabulary.md`](../.kiro/steering/cinematic-vocabulary.md)).
Treat it as the most expensive sentence in the project.

**Length.** Under twelve words. Not a sentence. Not a slogan.

**Voice.** Observational. The fragment notices something the world is doing.
It does not interpret, advocate, warn, or conclude.

**No naming.** The fragment must not contain the species' common or scientific
name, the place's name, or a country. Those surface separately through
`place.name` and the research surface.

**No conservation register.** No *endangered*, *at risk*, *vulnerable*,
*dying*, *losing*, *fragile*, *last*. The fragment is about what is, not
about what is being lost.

**Self-standing test.** Read the fragment aloud without the species or place
attached. If it still reads as a true observation about the world, keep it.
If it collapses into marketing copy or nonsense, rewrite.

Existing fragments, for calibration:

- *every root is also a lung* — a fact, not a feeling
- *a vertebrate kept at the speed of stone* — describes a metabolism
- *the rain that fed it never fell in this century* — temporal, not advocacy

---

## 4. Validating source kinds

Each source kind has a single bar. If a source cannot clear its bar, it is
not that kind — and is probably not a source.

- **`peer_reviewed`** — verifiable journal, named authors, year, DOI when one
  exists. A press article is not peer-reviewed. A preprint is not
  peer-reviewed.
- **`field_report`** — produced by a named organization with a public
  reporting record (national authority, accredited NGO, university field
  station). Internal memos do not qualify.
- **`camera_trap`** — deployment is traceable to an operator and a location.
  "Camera trap footage from the internet" is not a source.
- **`satellite_imagery`** — provider, sensor, and an archive identifier
  another person could re-pull. A Google Earth screenshot is not a source.
- **`oral_account`** — named contributor, specified relation, year recorded.
  Anonymous or composite testimony does not qualify.

If the closest source kind does not fit, the source is unusable in this
schema. Do not bend the kind. Find a better source or drop the claim.

---

## 5. Checking ecological claims

Before promoting from `in_review` to `verified`, run this checklist against
the record. Every item must pass.

1. **Summary supports.** `observation.summary` is reconstructible from the
   cited sources. Nothing in the summary is added editorially.
2. **Year aligns.** `observation.year` reflects either the year of the
   observation or the documentation window — never the year of a recent
   review.
3. **Taxonomy current.** `species.scientificName` matches the current
   Catalogue of Life / IUCN entry. Synonyms may live in the body; the field
   does not carry them.
4. **IUCN current.** `species.iucnStatus` matches the latest Red List
   assessment. Do not infer status from population trend prose.
5. **Place precise.** `place.coordinates` lands inside the actual ecological
   feature. A country centroid or a park headquarters is not a place.
6. **Body consistent.** The editorial body never contradicts or exceeds the
   cited sources. If the body says "for over a century," a source must
   support that.
7. **Fragment passes** the §3 tests.

If any item fails, return the record to `draft`. There is no half-verified
state.

---

## 6. When to reject

Reject — do not publish, do not park, do not soft-reserve — when any of the
following is true:

- The observation cannot be reduced to one factual claim.
- The claim is supported only by an `oral_account`, or only by sources that
  all derive from a single primary.
- The species/place pairing is geographically incompatible with the cited
  sources.
- The fragment cannot be rewritten to pass §3 without losing the observation.
- The contributor cannot name a real place and a real species at the level
  the schema requires.
- The record is structurally fine but tells a story the schema is not
  designed to tell (a clade-wide trend, a campaign, an opinion).

Rejection is a normal outcome. The schema is meant to make it easy.

---

## 7. Failure modes to expect

These patterns will recur. Spot them early.

1. **Charisma drift.** Picking the photogenic species over the well-attested
   observation. The narrative is the unit, not the species.
2. **Fragment inflation.** The fragment grows into a sentence, then names
   the species, then explains itself. Cut every non-load-bearing word.
3. **Source-kind misuse.** Labeling a news article as `field_report` because
   it is the closest fit. The kind is a contract, not a bucket.
4. **Citation laundering.** Citing a 2024 review for a 1980 finding and
   inheriting the recency. Cite the primary; the year follows.
5. **Tag-style `place.type`.** Using the field as a comma-joined list of
   habitats. It is a single descriptor.
6. **Two observations smuggled into one summary.** A summary joined by "and"
   is two records.
7. **Body drift into advocacy.** The editorial body starts narrating the
   threat instead of the observation. Move advocacy out of the body, or out
   of the record.
8. **Taxonomy decay.** The scientific name was current when the source was
   written, not when the record was created. Update the field; keep the
   synonym in the body.
9. **Coordinate sloppiness.** A capital city, a park headquarters, or a
   country centroid in place of the actual site.
10. **Promotion without re-reading.** Status promotion is the moment to
    re-read fragment and body, not just to re-count the sources.

---

## What this workflow does not do

It does not assign reviewers. It does not score contributions. It does not
track contributor reputation. It does not require approvals from people not
editing the record. The schema is the gate; this document is how to use it.

If a step here ever feels heavier than reading the schema, the step is
wrong — not the schema.
