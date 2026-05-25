# Narrative archival lifecycle

This document defines the minimum lifecycle rules for ecological
narrative records after they enter the archive. It supplements the
ingestion workflow and the reviewer checklist; it does not replace
either, and it introduces no new moderation, governance, or
contributor structure.

## 1. Drafts

Drafts exist to be revised. A draft is not yet a record; it is the
proposal of one.

- Drafts do not appear on the public archive by default.
- A draft that has not been revised within twelve months of its last
  review pass is **stalled**.
- A stalled draft is removed if a deliberate revision attempt fails
  to bring it to `in_review`, or after another twelve months without
  revision. The slug is not reused.

A draft that cannot be revised is not preserved. Sludge prevention
takes precedence over record preservation.

## 2. In-review

`in_review` is a transient state — the state of a record with one
open editorial question.

- An in-review record carries at most one open question at a time.
  If a second arises, the record is demoted to `draft`.
- An in-review record without an editorial ruling for twelve months
  is demoted to `draft`. Demotion signals that the question requires
  structural work, not adjudication.
- An in-review record promotes to `verified` when the open question
  is resolved and the reviewer checklist passes on a fresh re-read of
  the full record.

`in_review` is not a holding pen for indefinite uncertainty.
Uncertainty that cannot be ruled on belongs in `draft` — or, if
honestly stated, in `verified` (see §4).

## 3. Verified

A verified record is downgraded to `draft` when *any* of the
following occurs:

- A cited source is retracted.
- A new primary publication directly contradicts a cited claim.
- A re-read fails any reviewer-checklist item the record previously
  passed.
- A taxonomic revision invalidates the species identification.

The downgrade *is* the editorial response. There is no appeals
process and no moderation queue. After downgrade, the record follows
the standard `draft` → `in_review` → `verified` path.

There is no tier above `verified`. Verified is the ceiling.

## 4. Unresolved scientific uncertainty

A verified record may carry honestly stated scientific uncertainty
without time limit. The calibration case is the Lake Baikal sponge
mortality record: the cause is unresolved, the record states so, and
the record stands verified for as long as that hedge remains
accurate.

When new primary literature resolves *or* substantially narrows the
uncertainty, the record is revised within twelve months of that
literature being available. Failure to revise marks the record
stale and triggers re-review under §3.

When uncertainty is resolved, the hedge is replaced by the
resolution. No memorial of the prior uncertainty is preserved.

## 5. Outdated science

A record is not stale merely because newer science exists alongside
its cited sources. Newer work supplements; it does not, by itself,
supersede.

A record *is* stale when both of the following hold:

- The record makes a present-tense ecological claim, and
- Newer primary literature has substantially updated that
  present-tense claim.

Time-anchored claims do not become stale. *"X was observed in 1981
to do Y"* is true forever — that is the historical record. *"The
population shows X"* is current, and ages.

Taxonomy is the exception. `species.scientificName` and `species.id`
reflect current taxonomy at all times, regardless of the names used
by the cited primaries. Primaries are cited as they were published.

## 6. Archival permanence

Permanence in this system is conditional on defensibility, not on
duration of existence.

- A verified record persists as long as it remains a defensible
  observation.
- Records are revised in place. The record's identity is the
  observation, not the specific text.
- Removal is deliberate and final. A record is removed only when it
  cannot be revised to defensibility *and* no useful version of the
  observation can be preserved.
- Removed slugs are not reused.

The archive makes no claim of perpetual access. It claims only that
records currently on the surface are currently defensible. Whatever
else matters lives in git.
