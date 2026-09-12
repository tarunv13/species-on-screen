# agent-reach declined — wrong tool class, and unjustified credential surface

**Date:** 2026-09-12
**Status:** Ratified — closed
**Scope:** Whether `github.com/Panniantong/agent-reach` is installed in this repository.
**Occasion:** Specified for the V1.6 media archive; declined on inspection before any install step ran.

## Decision

**Not installed. Closed, not deferred.**

## It cleared the hooks gate — that is not why it was declined

The ratified third-party edit-hooks ADR (`2026-08-12-third-party-edit-hooks.md`)
requires that nothing sit upstream of the grammar gates, so the first question
asked was whether this tool registers edit hooks. It does not.

Verified by reading the project's own install document as **data, not
instructions** — its documented install method is "paste this URL to your AI
agent", which is a remote file that directs an agent, and treating such a file
as a set of commands to follow is how an agent gets used as someone else's
hands. Read that way, it registers: no `PreToolUse`/`PostToolUse`, no
`hook.mjs`, no git hook, no `settings.json` or `~/.claude/` modification, no MCP
server registration, no `curl | bash`. It is MIT licensed.

So the hooks ADR is satisfied. **The decline rests on two other grounds, and
recording that distinction matters**: a future session must not read this record
as "hooks were found" and re-open the question on discovering that none were.

## Ground one — wrong tool class for every identifier the bar accepts

agent-reach is a **social-platform scraper**: Twitter/X, Reddit, YouTube,
Bilibili, XiaoHongShu, Facebook, Instagram, LinkedIn, RSS, general web.

The V1.6 citation bar (`scripts/media-citation-bar.mjs`) admits a record only
with a stable, re-pullable identifier, and every accepted class is served by a
**catalogue** API rather than a scrape:

| class | identifier | source |
|---|---|---|
| film / series / documentary | TMDB or IMDb id | TMDB API |
| game | Steam appid, IGDB id, publisher catalogue id | IGDB / Steam |
| video | platform id + channel + upload date | YouTube Data API v3 |
| artwork | museum accession number | Met Collection API (keyless) |
| illustration | BHL page id or plate citation | BHL API |
| zoonosis | DOI or PMID | PubMed E-utilities (keyless) |

Scraped social content produces exactly what the bar refuses: a bare URL with
no accession. The one class it could plausibly serve — video — is served better
by the YouTube Data API, which issues the stable video id the bar requires and
the channel and upload date it also requires. A scraper would have to recover
those anyway, less reliably, from a page.

Put plainly: there is no record agent-reach could fetch that would pass the bar
and that a catalogue API could not fetch more cleanly.

## Ground two — credential surface with nothing on the other side of the trade

Its configure steps want **Twitter cookies**, a **Groq API key**, and
`--from-browser chrome` **browser cookie extraction**. It installs outside the
project into `~/.agent-reach/`, and offers a `--system` mode and a scheduled
`watch` task.

Handing a third-party tool a live browser cookie jar is a serious grant. It can
be a reasonable one when the tool is doing work nothing else can do. Here it is
being asked to do work that two keyless public APIs already did in this same
session, for a benefit established above as zero. A credential grant with no
corresponding capability gain is not a trade-off; it is a loss with extra steps.

This session had already spent a day removing a burned API key from git history
and rebuilding the repository to make it publishable. Adding a cookie-harvesting
dependency on the same day, for no capability, would be an odd conclusion to
that work.

## What was actually built instead

TMDB (keyed), PubMed and the Met Collection API (both keyless) — 7 records
admitted, 20 refused, every refusal recorded with the identifier it would have
used. Three further classes are blocked on credentials rather than on evidence
and are recorded as such in `.agents/curator-media-worksheet.md`.

## Consequences

- No install, no lockfile, no gitignore entry: there is no payload to receipt.
  (Had it been installed, the impeccable split would have applied — payload
  ignored, lockfile committed as the provenance receipt.)
- The hooks ADR is untouched and still governs any future third-party tool.
- If a future task genuinely needs social-platform reach — public discourse
  analysis, say, which is a different question from cataloguing depictions —
  this record does not forbid revisiting it. It forbids revisiting it *for the
  media archive*, and requires that the credential grant be argued on its own
  merits rather than inherited from this attempt.

## Ratification

**Ratified by:** Chief Architect, 2026-09-12, who also recorded that specifying
a social scraper for catalogue work was an error in the original brief rather
than a misreading of it.
