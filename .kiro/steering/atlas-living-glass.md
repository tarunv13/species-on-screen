# Living Atlas — glassmorphic research surface (additive, reversible)

**Status:** active, additive, reversible
**Authority:** scoped to the Atlas surface only. Does **not** amend
`cinematic-language/platform-architecture.md`; the cinematic surface
and its canonical descent are untouched.

## What this is

The **Living Atlas** (`atlas/`, `src/atlas/`) is a glassmorphic,
seasonal entry surface: a slow, dreamy mesh-gradient planet whose
points of light are every documented habitat. Selecting one immerses
the viewer in that habitat's seasonal atmosphere with a floating glass
species card built from the attested narrative record.

It was commissioned by the researcher as a deliberate "best of both
worlds" direction: the calming habitat immersion of the cinematic
surface, plus the legible, card-based species information of the
research surface — together, on one page.

## Why it is doctrine-compatible (mostly), and where it is honest about deviating

`platform-architecture.md` §1/§4 define the **research/archive
surface** as one that is explicitly *allowed to look like "a journal,
an atlas, or a magazine"*, with cards, lists, navigation, species
identifiers, and citations. The Atlas is an instance of that surface.
Glassmorphism (`backdrop-filter`, rounded corners, semi-transparent
gradients) is a research-surface styling choice; the cinematic
forbiddance of those properties applies to the **cinematic descent's**
minimal visual system, not here.

**One deliberate, documented deviation:** §8 forbids *hybrid pages
where cinematic atmosphere and research articles share a layout*. The
Atlas intentionally softens that line by placing an **ambient,
decorative habitat atmosphere** (a mesh-gradient background — not a
cinematic descent, not Movements 1–5) behind research cards. This is a
scoped exception for the Atlas surface, made at the researcher's
explicit request, and it is kept reversible (below). The canonical
cinematic descent at `places/` remains pure: no cards, no chrome, no
species names, exactly as before.

## Integrity guardrail (non-negotiable)

Every species fact in the Atlas comes from the **attested narrative
record and its cited sources**. The seasonal layer
(`src/atlas/season.js`) controls **atmosphere and framing only** and
asserts no ecology. Seasonal framing lines describe light and season
over a *place* ("Northern summer lies over the Sundarbans"), never the
behaviour or status of a *species*. Do not let the seasonal layer grow
into invented "seasonal facts" — that would break the project's
evidentiary discipline.

## Reversibility (how to undo this cleanly)

The Atlas is purely additive. To remove it entirely:

1. delete `atlas/` and `src/atlas/`
2. remove the `atlasPages` block + `...atlasPages` from `vite.config.js`
3. delete this steering file

Nothing else imports the Atlas. The cinematic homepage (`index.html`,
`src/main.js`, `src/globe.js`), the canonical descent
(`places/sundarbans.html`, `src/places/`), the research notes
(`notes/`, `src/notes/`), and the narrative registry are unchanged by
its presence.

## Data source

Driven entirely by the canonical narrative registry
(`cinematic-language/narrative-registry.ts`, `listNarratives()`). Every
verified narrative appears automatically; adding a habitat is adding a
narrative record — no Atlas code change required. A live external data
pipeline (e.g. GBIF ingestion) is explicitly **future work** and is not
part of this surface.
