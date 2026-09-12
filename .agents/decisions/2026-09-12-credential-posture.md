# Credential posture — settled; rotation happens after deployment

**Date:** 2026-09-12
**Status:** Ratified — settled by the principal, not open for re-argument
**Scope:** When credentials are rotated, renewed or restricted; what remains enforced in the meantime.
**Occasion:** Keys were supplied in conversation during the V1.6 build and rotation was raised. The principal has ruled on the timing.

## Decision

**Key rotation, renewal and restriction happen AFTER full deployment and after
the data pipelines are complete.** This is the principal's call on sequencing,
and it is settled.

**Do not prompt for rotation, renewal or restriction again until the principal
reopens it.** Raising it a second time is not diligence; it is re-arguing a
decision that has been made, and it costs attention that the pipelines need.

## Why this is a reasonable sequencing call

Rotating a key mid-build breaks every ingestion that depends on it, and the
ingestion is what the keys exist for. A key that is burned but working is a
known, bounded exposure; a half-migrated credential set during active
harvesting is an unbounded one. Doing it once, after the pipelines settle, is
fewer moving parts and fewer silent failures.

This record exists so that the reasoning survives, rather than the question
being rediscovered and re-asked by a future session reading a burned key in a
transcript.

## What remains enforced — this is enforcement, not nagging

These are standing rules, not reminders, and they do not expire with the
rotation pause:

1. **`.env` stays gitignored and untracked.** A key is never committed, never
   echoed into a log, a commit message, a build artifact, an artifact page, or
   a report.
2. **`.env` is never copied anywhere.** Duplicating a secret multiplies the
   number of places it can leak from, and every copy has to be tracked and
   destroyed later.
3. **Keys are used solely for this project's ingestion.** No other purpose, no
   other project, no exploratory calls unrelated to the archive.

## The one exception to the no-raising rule

**A credential found in git history or in a build output is a BLOCKER and is
reported immediately.**

That is not a hygiene reminder and it is not covered by the pause. It is a
leak: the difference is that a key in `.env` is exposed only to this machine,
while a key in history or in `dist/` is exposed to everyone who can clone or
fetch the site. This repository went public on 2026-09-11 precisely by removing
such a leak from its history, and the distinction is the whole reason that work
was done.

So: silence on rotation timing, immediate noise on discovered leakage. Those
are not in tension — they are the same rule applied to two different facts.

## The expired YouTube key stays where it is

It is `PROJECT_STATUS.md` backlog item 13, recorded as **blocked on a
credential, not on evidence**. It is not re-raised here and should not be
re-raised elsewhere.

The archive already states the situation honestly: the `video` class resolves
zero records *because the key expired*, not because no such records exist, and
`.agents/curator-media-worksheet.md` renders that under "Blocked on a
credential, not on evidence" with the explicit warning that an empty class must
never be read as "no such records exist". The honest rendering is the
deliverable; the renewal is scheduled work.

## Consequences

- No session raises rotation, renewal or restriction until the principal
  reopens it.
- Backlog item 13 stands unchanged.
- A future sweep that finds a credential in history or in a build output
  reports it at once, citing this record's exception clause.

## Ratification

**Ratified by:** the principal, 2026-09-12.
**Decision:** rotation follows deployment and pipeline completion; the three
standing rules remain in force throughout; discovered leakage is the sole
reportable exception.
