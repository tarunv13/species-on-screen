# Family C and the contradiction made visible

**Status:** seed chapter — first draft, 2026-05-26 preservation pass.
**Source material:** PR #50 §4, §7; PR #60 Fracture 1; PR #43 §5–§8;
PR #45; PR #59; `vite.config.js`; `index.html`; `places/sundarbans.html`;
`notes/sundarbans-bengal-tiger-saline-swimmer.html`; the 2026-05-24
homepage audit.
**Doctrine dependency:** `cinematic-language/platform-architecture.md`
§5–§8; Articles III, X, XII, XIII; Canon XVII.
**Archival status:** seed; not yet ratified against the book
architecture.

---

## 1. What Family C was

`species/*.html` was the project's first published surface. Ten files —
`tiger.html`, `snow-leopard.html`, `bornean-orangutan.html`, and seven
others — emitted from a single renderer at `src/species-page.js` against
`src/species-page.css`. Each page carried the same shape: a hero photo
block, a breadcrumb, a brand `<h1>`, an IUCN status pill in conservation
green (`#4ade80`), a JSON-LD block, an Open Graph header, and a body
composed of population statistics, threat lists, and TMDB media cards.
The 2026-05-25 repository audit (PR #50) referred to this surface as
*Family C*, the legacy encyclopedia register. `vite.config.js` declared
the directory as `speciesPages` under `rollupOptions.input`, so each
file shipped to `dist/species/<slug>.html`.

The audit's §7 ranking placed the legacy `species/*` directory among
the eight files future contributors were most likely to misuse — not
because the renderer was broken, but because the surface was still
reachable from the production homepage after two newer surfaces had
been published.

## 2. Why it became incompatible

The first cinematic surface was promoted from `prototypes/` to
`places/sundarbans.html` in PR #59. Its render path was disjoint:
`src/places/sundarbans.{js,css}`, no shared component with the species
pages, no shared template. The cinematic surface read three fields out
of the canonical narrative record — `place.name`,
`place.editorialPlaceLine`, and `editorial.fragment` — and rendered
them inside the descent grammar specified by Article III. Everything
else on the record was structurally unavailable to the cinematic
surface.

The research surface was published at `notes/`. Each `notes/<id>.html`
was a thin shell whose basename matched a narrative id. The render path
was `src/notes/render-narrative.js`, which read the basename, looked
the record up via `cinematic-language/narrative-registry.ts`, and
emitted a long-form article exposing every field on the record. No
brand `<h1>`, no IUCN pill, no breadcrumb.

After both landed, a single ecological record — *Bengal tiger,
Sundarbans, saline swimmer* — was reachable on three URLs:

- `places/sundarbans.html` — cinematic, place-keyed, descent register.
- `notes/sundarbans-bengal-tiger-saline-swimmer.html` — research,
  narrative-keyed, full exposure.
- `species/tiger.html` — encyclopedia, species-keyed, brand chrome.

The three surfaces did not agree on what the record was. The cinematic
surface treated it as a place a viewer descends into, with the species
held just below the threshold of articulation. The research surface
treated it as an attested observation, with the species name, the year
window, and the source list as primary fields. The species page
treated it as an animal entry in an encyclopedia, with the place
demoted to a habitat tag. These were not three views on a shared
model. They were three publication ontologies sharing a slug.

## 3. How no-JS fallback behaviour exposed the contradiction

The contradiction was reachable, not theoretical.

`index.html` carried two fallback paths to the encyclopedia register.
The first was the `<noscript>` element, a static link the browser
renders when JavaScript is disabled. It pointed at `species/tiger.html`.
The second was the page-caption anchor — an `<a>` element with
`href="species/tiger.html"`, intercepted at runtime by a click handler
in `src/main.js` and replaced with the canonical four-phase arrival
into `places/sundarbans.html`. If the click handler did not run — JS
disabled, blocked at the network edge, or failed to attach — the
anchor's native `href` resolved.

The selector between the two destinations was a single property of the
visitor's browser: whether it executed the project's script.

A JS-enabled visitor experienced what the rest of the doctrine
specified — held darkness, the camera approaching the planet, a single
editorial caption, a click into Article III's Departure / Approach /
Crossing / Settle, arrival inside `places/sundarbans.html`. A no-JS
visitor — a search-engine crawler, a screen reader configured
restrictively, a corporate-network visitor whose proxy stripped inline
modules, a NoScript user — was delivered into the species page's
chrome. The same `<title>` claim was made by both documents; the
documents underneath were governed by incompatible registers.

The 2026-05-24 homepage audit had already named the species-page
surface as carrying brand chrome that contradicted the editorial
register the canvas itself was adopting. PR #50 §4 named the same
asymmetry in structural terms: two narrative homes, `species/*` legacy
and `notes/*` canonical, with no relationship between them.

## 4. Why the issue was architectural, not aesthetic

The species pages were not poorly designed. The renderer worked. The
JSON-LD validated. The photographs were attributed. An aesthetic
complaint would have been resolvable by restyling — a different
palette, a quieter pill, a different typographic register.

The complaint was structural. Three properties did not survive
scrutiny.

**Slug ownership.** The slug `tiger` keyed the species page. The slug
`sundarbans-bengal-tiger-saline-swimmer` keyed the research narrative.
The slug `sundarbans` keyed the cinematic place. There was no rule by
which a record advanced from one slug shape to another. A reviewer
asked which surface was canonical for a given record; the answer
required knowing which family the contributor had reached for first.

**Build inputs.** `vite.config.js` declared four collections:
`speciesPages`, `placePages`, `prototypePages`, and the singleton
entry. All four shipped to `dist/`. The build did not encode which
family was the production surface and which was either staging or
historical. A page that emitted under `dist/` was a published page,
regardless of how it was reached.

**Promotion path.** PR #59 promoted the Sundarbans descent from
`prototypes/` to `places/` by moving files and updating the Vite
`placePages` collector. The species pages had no corresponding
retirement path. They were carried forward by default.

A surface whose continued existence is governed by build-input inertia
is not a publication surface. It is a residue.

## 5. How publication-readiness remediation resolved it

PR #60 named the residue as Fracture 1 of the publication-readiness
remediation pass and applied three concrete edits.

`vite.config.js`: the `speciesPages` collection was removed from
`rollupOptions.input`. The ten `species/*.html` files remained on
disk; they were no longer build inputs, no longer routed, no longer
reachable under `dist/`. The directory became archival without being
deleted, so prior PR-review citations against it still resolved.

`index.html`: the `<noscript>` fallback was rewritten in research
register — Georgia serif, no brand `<h1>`, a single sentence pointing
at the `notes/` archive. The page-caption `href` was retargeted from
`species/tiger.html` to `notes/sundarbans-bengal-tiger-saline-swimmer.html`,
the canonical research narrative for the same record. The two fallback
paths now resolved into the same family.

`src/main.js`: the comment block describing the unenhanced fallback
was updated to match. No runtime behaviour changed for the JS-enabled
path; the cinematic arrival into `places/sundarbans.html` was
unaffected.

After the edit, `dist/` contained `index.html`, `places/sundarbans.html`,
`notes/index.html`, the eleven narrative shells, and the shared
`data/*.json`. `dist/species/` did not exist. `dist/prototypes/` did
not exist (Fracture 3 of the same PR retired prototypes from
production with the same mechanism). The publication surface and the
build output now agreed on which families were canonical.

A no-JS visitor reached research. A JS-enabled visitor reached
cinematic. Neither reached encyclopedia.

## 6. Why research/cinematic asymmetry became operationally necessary

Removing Family C did not by itself produce a coherent system. Two
surfaces remained, and the question of which one a given piece of
information belonged to had to be answered structurally rather than
case by case.

The answer was already in `cinematic-language/platform-architecture.md`.
§5 carried a per-information-type compatibility matrix; names,
numbers, dates, citations, comparisons, lists, and image captions were
marked incompatible with cinematic grammar and assigned to research.
§6 defined the bridge as asymmetric — research-to-cinematic via a
single editorial line that becomes a threshold; cinematic-to-research
via URL convention only, with no in-page affordance. §7 required
separate URL spaces, separate runtime modules, separate page
templates, and *single source of place truth* with disjoint field
rendering — the rule PR #45 made operational by routing both surfaces
through the narrative registry and letting each render its own subset
of the same record. §8 codified a set of architectural never-rules:
no immersive-mode toggle, no live data feeds in cinematic, no hybrid
pages, no annotation CMS, no bridge component.

The asymmetry was not a stylistic preference. It was the only
structure that admitted a single ecological record at two surfaces
without producing a third reading. Research accommodates everything
attested. Cinematic accommodates the three fields the descent grammar
permits. Anything that does not fit the cinematic surface lives in
research; the burden of proof for cinematic compatibility is on the
proposer; the default is research.

After PR #60 the project had one canonical record per attested
ecological observation, one cinematic place per descent, one research
narrative per record, and a documented retirement path for surfaces
that had outlived their publication role. The contradiction Family C
had made visible — that the project carried multiple competing
publication ontologies under shared slugs — stopped being reachable.
Every surface now served one register. Every record had one canonical
home in each register that admitted it.
