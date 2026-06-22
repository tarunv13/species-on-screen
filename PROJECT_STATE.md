# PROJECT_STATE.md

> Engineering handover for the **species-on-screen** repository
> (system name: **Eco-Cinema Observatory**).
> Audience: an expert engineer/designer joining the project cold.
> Written: 2026-06-21. This document is descriptive, not binding doctrine
> (the binding doctrine lives in `.kiro/steering/` — see §4).

---

## 0. How to read this document

1. Read §1 (What this is) and §2 (The one load-bearing idea) first. Nothing
   else makes sense without them.
2. Read §4 (The doctrine) before touching `index.html`, `src/main.js`,
   `src/globe.js`, `src/cinematic-engine.js`, or anything under `places/`.
   The project is governed by written design law that PR review enforces.
3. Read §9 (The exploration layer) to understand the large body of recent
   prototype work (scrollytelling, 3D, data pipelines) and §11 (the central
   tension) to understand why it lives where it lives.
4. Keep §13 (Gotchas) open while you work — several environment quirks will
   waste hours if you don't know them.

---

## 1. What this project is

Eco-Cinema Observatory is a **single-author, experimental, doctrine-governed
ecological web project**. Its subject is *wild species in their habitats, on
screen, with attested sources*. It is **not** a CMS, not a product, not a
component library, and (historically) not open to outside contribution —
though the owner now intends it to become an **open-source platform**.

It has two natures you must hold at once:

- **(A) The canonical, doctrine-governed system.** Two production surfaces
  (cinematic + research) plus an asymmetric "bridge", a four-document design
  constitution, a registry-backed narrative pipeline, and a deliberately
  severe aesthetic of restraint. This is what ships in `npm run build`.
- **(B) The exploration layer.** A growing set of *prototypes* under
  `prototypes/` + `src/prototypes/` that push toward an ambitious,
  immersive, data-rich, behaviour-change conservation platform (real GBIF/
  GloBI/GDELT data, high-fidelity painterly landscapes, WebGL 3D, species
  hover cards, the COM-B behaviour model). These are **dev-served only and
  excluded from the production build** (see §6, §9).

The friction between (A)'s restraint and (B)'s ambition is the project's
defining creative tension. §11 explains how it is currently reconciled.

The repository folder is `species-on-screen`; the npm package is
`eco-cinema-observatory`; the system name in copy is "Eco-Cinema
Observatory". They are the same thing; the names are historical.

---

## 2. The one load-bearing idea: surface asymmetry

By constitutional rule there are exactly **two public surfaces** plus a
non-UI bridge (`cinematic-language/platform-architecture.md`):

1. **Cinematic surface** — a *film, not an app*. "A click is a cut, a scroll
   is a slow push, a hover is a held breath." No chrome, no labels, no
   counts, no citations, no navigation, no species name (until the place has
   been *felt*). Its signature movement is **The Descent** (Article III):
   the camera lowers from planetary altitude to human altitude; the single
   sanctioned cut is hidden inside a luminance dip. Entrance: `index.html`.
   First (and currently only) canonical place: `places/sundarbans.html`.

2. **Research / archive surface** — *allowed to look like a journal, an
   atlas, or a magazine*. Everything forbidden in cinematic space —
   coordinates, IUCN status, taxonomy, population numbers, sources,
   comparison, lists, search — lives here. Surfaces: `notes/` (the article
   archive) and `atlas/` (the Living Atlas).

3. **The bridge** — *not a UI element*. A research article may end with a
   single italic editorial line that becomes a *threshold* into cinematic
   space. That is the only in-page crossing, and it crosses **one way**.
   The cinematic surface has no "back", no "sources", no exit affordance.
   You leave a place by leaving (closing the tab / browser back).

**The asymmetry is the architecture:** the research surface accommodates
everything; the cinematic surface accommodates almost nothing. When unsure
where something belongs, the answer is almost always research.

This is *load-bearing* because the project's own history records that
collapsing the asymmetry kills it: glassmorphic cards, layer toggles,
dashboards, and "by the numbers" sections were all removed from the cinematic
homepage in the 2026-05-24 audit (`private-book/chapters/asymmetry.md`).

---

## 3. Tech stack & environment

| Thing | Value |
|---|---|
| Build tool | **Vite 8** (`vite.config.js`) |
| Language | Vanilla ES modules + one TS file (the narrative schema/registry, consumed by Vite directly) |
| 3D | **three** ^0.184 (globe, atlas globe, the living-place 3D threshold) |
| Animation | **gsap** ^3.15 (cinematic descent timelines) |
| Smooth scroll | **lenis** ^1.3.23 (prototype scrollytelling) |
| Node | v24 (dev), needs ≥18 (global `fetch`, used by ingest scripts) |
| Package manager | npm |
| Deploy base | `base: '/species-on-screen/'` (GitHub Pages style). **Every URL must include this prefix.** |

There is no test framework, no linter config, no TypeScript compiler step
(Vite transpiles the one `.ts` on the fly). The only "CI gate" is
`check-narratives` (see §8), wired to run on `prebuild`.

---

## 4. The doctrine (binding design law) — `.kiro/steering/`

The project's intelligence is *written down* and PR review cites it by stable
token. Read these before changing anything visual or editorial on the
canonical surfaces.

| File | Token | Governs |
|---|---|---|
| `cinematic-vocabulary.md` | **Article** I–XVII | Camera, light, motion, composition on the cinematic surface. The four lawful camera behaviours (I Hold, II Drift, III Descent, IV Reveal); the forbidden gestures (§3); biome-led palette; "darkness is content". `inclusion: always`. |
| `editorial-voice.md` | **Canon** I–XXI | The documentary narrator. Third-person, present-tense for what is / present-perfect for what happened; no "we", no exclamation, no marketing register; quantitative restraint ("a statistic is a sentence, not a widget"); citation as architecture. |
| `pacing-principles.md` | **Principle** I–XX | Timing. The three temporal registers; the canonical Descent timing envelope; reduced-motion as parallel pacing; the forbidden "dashboard tempo". |
| `experiential-references.md` | **Reference** | The intuition layer — the works the project draws on (Planet Earth II, The Tree of Life, Journey, Outer Wilds, NFB interactive, eBird maps…) and, crucially, §4 the **anti-references** it would never point to. `inclusion: always`. |
| `platform-architecture.md` *(in `cinematic-language/`)* | operational | The two-surface model, the surface-compatibility matrix (§5), the architectural never-rules (§8). Binding on routing/runtime/layout. |
| `atlas-living-glass.md` | scoped | The Living Atlas glass exception (research surface only). |
| `liquid-glass-design-system.md` | scoped | The tokenized "Liquid Glass" material on the research surface. |

**The §4 anti-references are critical context for all recent work**: the
project explicitly rejects *teamLab/Awwwards spectacle, gamification, the
marketing register, the dashboard register, recommendation feeds, and
activist-poster framing*. Several of the owner's stated influences
(Active Theory, "SEE→FEEL→ACT", WWF Blue Corridors) sit near these
anti-references — see §11 for how that is reconciled.

The deeper "why" of the whole system, plus its unresolved tensions and a
planned ~100-page book, lives in `private-book/` (working artifacts, not
doctrine, not auto-loaded). `private-book/architecture/book-architecture.md`
is the single best map of the project's intent.

---

## 5. Repository layout

```
/
├── index.html                      CINEMATIC homepage (the globe / threshold)
├── places/sundarbans.html          CINEMATIC canonical place (the Descent)
├── notes/                          RESEARCH archive — one HTML shell per narrative (12)
│   ├── index.html                  archive index
│   └── <narrative-id>.html         empty shells; basename === narrative id
├── atlas/index.html                RESEARCH "Living Atlas" (glassmorphic globe)
├── prototypes/                     EXPLORATION (NOT bundled; dev-served from root)
│   ├── crossing.html               cinematic migration journey (hawksbill)
│   ├── field-record.html           research scrollytelling (DwC-A grounded)
│   ├── living-place.html           research-exploratory (3D threshold + body systems)
│   ├── alpine.html / mangrove.html / salt-flat-exposure.html   older stress-tests
│   └── reviews/                    prototype review records (markdown)
├── species/                        LEGACY "Family C" product pages (NOT bundled; on disk for record)
├── cinematic-language/             schema, registry, workflow, platform architecture, narrative records
│   ├── ecological-narrative.example.ts   the EcologicalNarrative SCHEMA (despite .example name)
│   ├── narrative-registry.ts             import.meta.glob discovery
│   ├── narratives/<id>.ts                one EcologicalNarrative per file (11)
│   ├── platform-architecture.md          operational doctrine
│   └── *.md                              ingestion workflow, lifecycle, review checklist, depth-medium findings
├── src/
│   ├── main.js, globe.js, cinematic-engine.js   CINEMATIC homepage runtime
│   ├── style.css                                cinematic frame tokens
│   ├── places/sundarbans.{js,css}               CINEMATIC place runtime (Descent timeline)
│   ├── notes/render-narrative.js + research-article.css   RESEARCH article renderer
│   ├── atlas/                                   RESEARCH Living Atlas runtime
│   │   ├── atlas.js, atlas-globe.js, atlas.css, season.js
│   │   └── liquid-glass.{css,js}                the glass material + pointer-lensing controller
│   └── prototypes/                              EXPLORATION runtimes
│       ├── crossing.{js,css}
│       ├── field-record.{js,css}
│       ├── living-place.{js,css}
│       ├── species-art.js                       SHARED species illustration system
│       ├── biome-backdrop.js                    SHARED high-fidelity painterly backdrop engine
│       └── (older) MangroveCanopy.js, Terrain.js, alpine.*, salt-flat-exposure.* ...
├── public/                         served at the base root in dev + build
│   ├── data/<species>.json         legacy "Family C" rich data — incl. com_b (COM-B behaviour data)
│   ├── dwca/<place>/               GENERATED Darwin Core Archives (occurrence + relationships + meta + eml + CREDITS)
│   │   └── index.json              registry of ingested places
│   ├── news/<landscape>.json       GENERATED GDELT news per landscape
│   └── art/                        ASSET SLOTS for photoreal upgrades
│       ├── STYLE-GUIDE.md          species illustration plate slot (public/art/<sci-slug>.webp)
│       └── 3d/README.md            3D model slot (public/art/3d/<biome>.glb)
├── scripts/
│   ├── check-narratives.js         build-time integrity gate (5 invariants)
│   ├── new-narrative.js            scaffolder for a new narrative + notes shell
│   ├── fetch-tmdb-data.js          legacy TMDB media fetch
│   └── ingest/                     DATA PIPELINE (NEW)
│       ├── places.config.json      editorial skeleton per field-record place
│       ├── landscapes.json         global registry of 24 priority landscapes
│       ├── gbif.mjs                GBIF taxonomy + occurrence enrichment
│       ├── globi.mjs               GloBI interaction evidence
│       ├── build-dwca.mjs          → public/dwca/<id>/   (npm run ingest)
│       ├── gdelt.mjs               GDELT news client
│       └── build-news.mjs          → public/news/<id>.json  (npm run ingest:news)
├── .kiro/steering/                 THE DOCTRINE (see §4)
├── private-book/                   the planned book + continuity dossier (working artifacts)
├── .agents/tasks/                  historical task records, audits, reviews (~20 dirs)
└── vite.config.js                  build inputs (only canonical surfaces are bundled)
```

---

## 6. Build, run, deploy

```sh
npm install
npm run dev          # Vite dev server. Prototypes are reachable here ONLY.
npm run build        # runs check-narratives (prebuild), then builds dist/
npm run preview      # serve the built dist/
```

- Dev URL base is `/species-on-screen/`. Examples:
  - `http://localhost:5173/species-on-screen/`                      (cinematic homepage)
  - `http://localhost:5173/species-on-screen/places/sundarbans.html`
  - `http://localhost:5173/species-on-screen/atlas/index.html`
  - `http://localhost:5173/species-on-screen/notes/`
  - `http://localhost:5173/species-on-screen/prototypes/field-record.html`
  - `http://localhost:5173/species-on-screen/prototypes/living-place.html`
- **`vite.config.js` only bundles** `index.html`, `places/*.html`,
  `notes/*.html`, and `atlas/*.html`. `prototypes/*` and `species/*` are
  **deliberately excluded** from `dist/` (they remain on disk and dev-served).
  So the prototypes are experiments, not shipped product — adding one needs
  no config change; promoting one to production is an explicit decision.
- Deploy is via `.github/workflows/` (GitHub Pages-style; see
  `.github/PREVIEW_WORKFLOW.md`). PR previews + cleanup workflows exist.

Data-pipeline commands (network required; see §10):
```sh
npm run ingest                       # all field-record places → public/dwca/
npm run ingest sundarbans            # one place
npm run ingest:news sundarbans amazon-varzea   # GDELT news for given landscapes (throttled)
```

---

## 7. The canonical surfaces (production)

### 7.1 Cinematic surface
- `index.html` + `src/main.js` + `src/globe.js` + `src/cinematic-engine.js`:
  the planetary homepage. The globe is a *body, not a button* (Article XI):
  ambient drift, **no drag-to-rotate** (deliberately retired — "the page
  presents; it does not offer manipulation"), one canonical hotspot
  (Sundarbans), one editorial page-caption that is the entrance.
- `places/sundarbans.html` + `src/places/sundarbans.js`: the canonical
  **Descent**. A single continuous GSAP timeline implements Movements 1–5
  (threshold → surrender of frame → loss of vantage → emergence of scale →
  settle). Key perceptual findings are encoded here: **"settle is not a
  tween"** (ambient motion never resolves to zero), the luminance-dip cut,
  body-relative cues before geographic cues. It extracts exactly **three**
  fields from its narrative record (place name, editorial place-line,
  fragment) and nothing else.
- Procedural Web-Audio ambient bed is generated in `sundarbans.js`
  (`startAmbientAudio`) — reused by the prototypes.

### 7.2 Research surface
- `notes/<id>.html` are empty shells; `src/notes/render-narrative.js` reads
  the narrative id from the URL basename, looks it up in the registry, and
  renders the **full** article (header, identifiers incl. coordinates,
  sourced observation, editorial body, sources, metadata). Conventional
  library grammar; `src/notes/research-article.css` is cream-paper, light.
- `atlas/index.html` + `src/atlas/*`: the **Living Atlas** — a dreamy
  mesh-gradient globe of every documented habitat; selecting one opens a
  floating glass species card built from the attested narrative record. This
  is where **glassmorphism is doctrine-blessed** (research surface only).

---

## 8. The narrative pipeline (the research-surface engine)

One ecological observation = one **`EcologicalNarrative`** record.

- **Schema:** `cinematic-language/ecological-narrative.example.ts` (the
  `.example` suffix is historical; this is the canonical schema). Fields:
  `place`, `species`, `observation`, `sources[]` (≥1 required), `editorial`
  (fragment + body + voice), `metadata` (schemaVersion, status, contributor,
  dates). Cinematic-extractable subset: `place.name`,
  `place.editorialPlaceLine`, `editorial.fragment` — nothing else.
- **Records:** `cinematic-language/narratives/<id>.ts`, one default-exported
  object per file (currently **11**). Discovered at build time by
  `narrative-registry.ts` via `import.meta.glob`.
- **Research shells:** each narrative needs a matching `notes/<id>.html`
  (currently **12** html files).
- **Integrity gate:** `npm run check-narratives` (also runs on `prebuild`)
  enforces 5 invariants: id↔filename match, no duplicate ids, schemaVersion,
  valid `metadata.status`, non-empty `sources`, `export default` present, and
  a matching `notes/<id>.html` shell. A build cannot ship narrative drift.
- **Scaffold a new one:** `npm run new-narrative` (prompts for id, place,
  common name, scientific name; generates the `.ts` + the `.html` shell with
  TODO placeholders). Editorial rules/evidence threshold:
  `cinematic-language/narrative-ingestion-workflow.md`.

---

## 9. The exploration layer (recent prototype work)

All of the following are **prototypes** (`prototypes/*.html` +
`src/prototypes/*`), dev-served only, additive and reversible, and they do
**not** touch the canonical cinematic surface. They were built across an
extended session in June 2026.

### 9.1 `crossing.html` — cinematic migration journey
A scroll-governed *Crossing*: a single species' migration (hawksbill turtle's
natal-homing) traced as a luminous route across a dark ocean, the Descent
grammar generalised into a journey. Held darkness, place-before-name editorial
fragments, the cut hidden in a luminance dip, ambient continuance. 2D canvas.
This one sits in the **cinematic register** (it is the project's first test of
"multi-place coherence" — generalising the Descent across geography).

### 9.2 `field-record.html` — research-surface scrollytelling (the flagship data surface)
"Read the field record" reimagined as a sticky-stage, scroll-stepped
scrollytelling, grounded in a real **Darwin Core Archive** (§10). It renders
a species–species–**human** interaction web over a high-fidelity biome
backdrop, with seasonality, a development cascade, a "current coverage"
GDELT news block, and full sources. Generalised to any place via
`?place=<id>` (Sundarbans bespoke prose; other places get generic
data-driven steps). Light editorial palette. Smooth gliding scroll (Lenis +
continuous scroll-progress state interpolation). **Species hover →
glassmorphic face-card** (vernacular, scientific, IUCN, role, family,
interactions, source). `src/prototypes/field-record.{js,css}`.

### 9.3 `living-place.html` — research-exploratory surface (the 3D flagship)
"Enter the living place" as the body metaphor: water = circulation, forest =
breath, species interactions = nervous system. Zone 1 is a **real WebGL
Three.js 3D "floating living-island"** (displaced rock mass, ~7000 instanced
grass blades, flowering moss, reclaimed-concrete shards, sun lighting, soft
shadow, drifting motes, pointer parallax). The species appear on the island
as **~9 glowing "points of life"**; **raycast hover** (done in the
`pointermove` handler, not the animation loop) opens the same glassmorphic
species card. Below the threshold: body-system scroll beats (circulatory →
respiratory → nervous → people) over the shared backdrop, closing on a
**COM-B behaviour section** (capability / opportunity / motivation, sourced
from `public/data/<flagship>.json` `com_b`). Light palette.
`src/prototypes/living-place.{js,css}`.

### 9.4 Shared modules (used by field-record + living-place)
- **`src/prototypes/species-art.js`** — illustration system. Picks each
  species' drawn *form* from its REAL GBIF `class`/`order`/`family`
  (tree/bee/bird/fish/crab/dolphin/bigcat/deer/otter/human/…), with shaded
  bodies, taxon-specific markings (tiger stripes vs jaguar rosettes), eyes,
  motion. **Photoreal plate slot:** drop `public/art/<scientific-name-slug>.{png,webp,jpg,svg}`
  and it replaces the illustration, zero code change (`public/art/STYLE-GUIDE.md`).
- **`src/prototypes/biome-backdrop.js`** — high-fidelity painterly landscape
  engine. Each depth plane is hundreds of light/shadow *foliage strokes*
  (stippled, value-jittered, sun-biased), pre-baked to offscreen canvases for
  performance, with aerial perspective, depth-of-field blur, water
  reflections, a low sun, atmospheric haze, and film grain. Backdrops are
  **diagnostic of the landscape classification** (mangrove = low/dense +
  pneumatophores + tidal channel; várzea = tall emergent trunks + flood;
  plus reef/savanna/default), keyed by `PLACE_META.type`. **Photoreal slot:**
  `public/art/backdrops/<biome>.{webp,png,jpg}` becomes a parallaxed
  photographic base, zero code change.

### 9.5 Liquid Glass (research-surface design system)
`src/atlas/liquid-glass.{css,js}` + `.kiro/steering/liquid-glass-design-system.md`.
A tokenized "refined glass" material (specular rim, traveling key light,
depth, elevation tiers, frost-forms reveal, pointer-lensing controller, full
a11y/perf fallbacks). The Living Atlas is its reference implementation.
**Scoped to the research surface; the cinematic surface stays glass-free.**

---

## 10. Data pipelines (`scripts/ingest/`)

The field record and living place read **real, sourced biodiversity data**
generated at build time. Both GBIF and GloBI public APIs are reachable from a
normal network; GDELT is rate-limited (§13).

### 10.1 Darwin Core Archive ingest — `npm run ingest`
- `places.config.json` is the **editorial skeleton** per place: which actors
  (species + the human community as `Homo sapiens`), their scene layout
  (`sceneX/sceneY`), seasonality, cascade order, IUCN, and the curated
  interaction list with literature citations. (Currently: `sundarbans`,
  `amazon-varzea`.)
- `gbif.mjs` enriches each actor with **authoritative GBIF backbone
  taxonomy** + a representative georeferenced occurrence coordinate within
  the place bbox.
- `globi.mjs` queries **GloBI** for evidence of each interaction (corroboration
  count + study citation); the curated literature citation is preferred, GloBI
  noted in remarks. Interaction types use **OBO Relations Ontology** terms as
  GloBI uses them (`preysOn` RO_0002439, `pollinates` RO_0002455, `eats`
  RO_0002470, `interactsWith` RO_0002437).
- `build-dwca.mjs` writes a standards-compliant archive into
  `public/dwca/<id>/`: `occurrence.txt` (Occurrence core), `resource-relationship.txt`
  (ResourceRelationship extension), `meta.xml` (archive descriptor),
  `eml.xml` (dataset metadata), `CREDITS.md`, plus updates
  `public/dwca/index.json` (the place registry the prototypes read for name/type).
- **The committed archives double as the offline fallback** — the site never
  depends on a live network at runtime; the pages `fetch` these static files.
- **To add a place:** add an entry to `places.config.json` and run
  `npm run ingest <id>`. The field record then works at `?place=<id>` (with
  generic data-driven steps). A biome backdrop appears automatically if the
  place `type` matches a recipe in `biome-backdrop.js`.

### 10.2 News layer — `npm run ingest:news`
- `landscapes.json` is the **global registry of 24 priority landscapes**
  across IUCN realms (Sundarbans, Amazon, Congo, Serengeti, Borneo, GBR,
  Galápagos, Madagascar, Yellowstone, Himalaya, Coral Triangle, Okavango,
  Pantanal, Mekong, Western Ghats, Cerrado, Sumatra, Virunga, Svalbard,
  Patagonia, Sonoran, Danube Delta, Białowieża, Antarctic Peninsula). Each has
  center/bbox/protectedArea/biome/`newsQuery`/`hasFieldRecord`.
- `gdelt.mjs` + `build-news.mjs` query the **GDELT 2.0 DOC API** (recent
  English coverage per landscape, throttled ~5 s/request) → `public/news/<id>.json`
  + `public/news/index.json`. The field record shows these in its cascade
  beat; **degrades honestly when empty (never fabricated)**.
- News exists today for: `sundarbans`, `amazon-varzea`, `congo-basin`,
  `serengeti-mara`, `great-barrier-reef` (fetched during dev; may be empty if
  the API rate-limited that run — re-run to repopulate).

### 10.3 Behaviour-change data (COM-B)
`public/data/<species>.json` are legacy "Family C" rich records; their
`com_b` field (capability / opportunity / motivation, each a sourced array)
drives the living-place behaviour close. Flagship mapping in `living-place.js`:
`sundarbans → tiger`, `amazon-varzea → amazon-river-dolphin`.

---

## 11. The central creative tension (read before any new design work)

The doctrine (§4) is built on **restraint** and explicitly lists, as
anti-references, the *teamLab/Awwwards spectacle, gamification, marketing,
dashboard, and recommendation* registers. The project owner, however, has
been steering toward an immersive, data-rich, behaviour-change platform
(real 3D, live data, "SEE→FEEL→ACT", Active Theory influence, WWF Blue
Corridors). These are in genuine tension.

**Current reconciliation (the working principle):**
- The **canonical cinematic surface stays pure** — no glass, no dashboards,
  no spectacle, no data, no gamification. `index.html`, `src/main.js`,
  `src/globe.js`, `src/cinematic-engine.js`, `places/`, `src/places/` are
  *not touched* by the exploration work.
- The **research-exploratory surfaces** (field record, living place, atlas)
  are where the immersion, the real data, the WebGL 3D, the hover cards, and
  the behaviour layer live — because the research surface is doctrinally
  *allowed* to be a journal/atlas/magazine.
- **Behaviour change is pursued the evidence-endorsed way**, not the
  marketing way: the project's own
  `.agents/tasks/task-research-matrix/audience-effects-framework.md` shows
  that durable pro-environmental behaviour comes from *active cognitive
  engagement + structural/causal understanding + sustained attention*
  (citizen science, serious games, COM-B) — and that high-spectacle media
  reliably produce awe without transformation. So: structural understanding
  (the interaction graph, the body-system, the cascade *mechanism*) and a
  **sourced COM-B layer** — **never** badges, streaks, leaderboards, or CTAs.

If you are asked to "make it more immersive/dramatic", the safe path is:
build it on a research-exploratory surface, keep it sourced and structural,
and do not import it into the cinematic descent.

---

## 12. Design language (as currently practised on the exploration layer)

- **Light, editorial palette** (warm paper, dark ink, one restrained teal
  accent). The owner explicitly rejected dark webpage chrome.
- **Aerial depth** — backdrops built from recessing planes that pale/haze/
  soften toward the back and darken/sharpen/thicken toward the front
  ("depth of strokes").
- **Biome-diagnostic backdrops** — each landscape reads as its own
  classification (§9.4).
- **Gliding smooth scroll** — Lenis + continuous scroll-progress state
  interpolation (the stage morphs continuously between steps, not snapping).
- **Glassmorphism** on the research surface (Liquid Glass material; the
  species hover face-cards).
- **Monumental serif typography** on the 3D threshold, minimal layout.
- **Species are the subject** — drawn large; hover reveals the glass card.
- **Real 3D** is the chosen forward register for thresholds/heroes
  (Three.js), with `.glb`/image asset slots for photoreal upgrades.

---

## 13. Gotchas & known limitations (will save you hours)

1. **The headless preview pauses animation.** The MCP/automated browser
   preview reports `document.hidden = true`, which **pauses
   `requestAnimationFrame`**. Any logic in a draw loop (canvas position
   updates, the 3D animate loop) **does not tick between captures** — values
   read as their initial state (e.g., species positions read `0`). Two
   consequences: (a) verify rAF-independent things via DOM/computed-style
   reads; (b) do interactive picking in **event handlers** (e.g. raycast in
   `pointermove`, calling `scene.updateMatrixWorld(true)` first) so it works
   and is testable regardless. This is exactly how the living-place hover was
   made verifiable.
2. **WebGL/heavy-`backdrop-filter` screenshots time out** in the GPU-less
   headless preview, especially full-screen. Verify at ≤~600px viewports and
   via computed styles / DOM state. (Real browsers with a GPU are fine.)
3. **GDELT is aggressively rate-limited** (1 request / ~5 s, and it will
   penalty-box an IP that bursts). `build-news.mjs` throttles; expect empty
   results if the IP is boxed; re-run later. The `sourcelang:` operator broke
   queries and was removed (English is filtered in code instead).
4. **Base path is mandatory.** `localhost:5173/prototypes/...` (without
   `/species-on-screen/`) 404s. Opening `.html` via `file://` fails — the ES
   module imports need the Vite dev server.
5. **Prototypes are not in the build.** Don't expect `prototypes/*` in
   `dist/`. They're dev-only by design (`vite.config.js`).
6. **Photoreal is an asset drop, not a code change.** The procedural species
   art, painterly backdrops, and 3D island are the license-clean baselines;
   true photorealism comes from dropping CC0/CC-BY assets into `public/art/`,
   `public/art/backdrops/`, `public/art/3d/` (each documented). I cannot
   generate photoreal raster/3D assets from inside a coding session — that
   was stated honestly throughout.
7. **Cinematic globe is intentionally non-interactive.** If asked "why can't
   I drag the homepage globe?" — that's doctrine (Article XI / the final
   reduction), not a bug. The *Atlas* globe (`src/atlas/atlas-globe.js`) is
   draggable; the homepage one is not.
8. **`.example.ts` is the real schema** (not a sample to delete).
9. **`public/data/*.json` and `species/*.html` are "Family C"** — legacy
   product-grade data/pages, kept on disk, excluded from the cinematic build,
   but `com_b` and `globe_layers` are still read by current code. Don't delete
   wholesale.

---

## 14. Verification & how to test

- **Narrative integrity:** `npm run check-narratives` (must stay green; runs
  on `prebuild`).
- **Visual/behaviour:** use the preview tooling, mindful of §13.1–13.2. For
  canvas/3D, prefer: computed-style/DOM reads, event-driven test hooks
  (project a 3D marker to screen, dispatch a synthetic `pointermove`, assert
  the card), and small-viewport screenshots.
- **Data:** `npm run ingest <id>` regenerates an archive; confirm the field
  record renders it at `?place=<id>` with no console errors. The DwC-A is
  GBIF/GBIF-validatable in principle (meta.xml term URIs).
- **Doctrine compliance:** before merging anything on the canonical surfaces,
  re-read §4 and the platform-architecture surface-compatibility matrix; the
  burden is on the proposer to show cinematic compatibility.

---

## 15. Status of each surface / prototype

| Surface | State | Verified |
|---|---|---|
| Cinematic homepage (`index.html`) | Canonical, shipping | Pre-existing |
| Cinematic place (`places/sundarbans.html`) | Canonical, shipping | Pre-existing |
| Research notes (`notes/`) | Canonical, shipping | Pre-existing |
| Living Atlas (`atlas/`) + Liquid Glass | Shipping research surface; glass system added this session | Computed styles + screenshots ✓ |
| `prototypes/crossing.html` | Prototype, complete | Screenshots ✓ |
| `prototypes/field-record.html` | Prototype, feature-rich; real DwC-A; hover cards; news; bigger species | DwC parse, generalization, hover card content ✓ (live hover needs a real browser per §13.1) |
| `prototypes/living-place.html` | Prototype; WebGL 3D threshold + inhabited markers + hover cards + body-system scroll + COM-B | 3D renders, raycast hover verified, COM-B sourced ✓ |
| Shared `species-art.js` / `biome-backdrop.js` | Working baselines; asset slots wired | ✓ |
| DwC-A ingest (GBIF+GloBI) | Working; 2 places generated | ✓ |
| News ingest (GDELT) | Working pipeline; data sparse due to rate limit | partial |

All exploration work: **no console errors, `check-narratives` green,
cinematic surface untouched, additive/reversible** at each step.

---

## 16. Open threads, roadmap, unresolved tensions

Built but worth extending:
- **Mirror the species hover face-card to `field-record.html`'s 2D scene** is
  done; consider mirroring the *bigger species + hover* polish consistently
  and giving the living-place 2D body-system scene the same treatment.
- **Photoreal asset population** — wire an image-to-3D / text-to-3D step (or
  source CC assets) to fill `public/art/3d/`, `public/art/backdrops/`,
  `public/art/<species>` so the procedural baselines upgrade to photoreal.
- **More biomes/places** — add `places.config.json` entries (reef, savanna,
  etc.) and authored backdrop recipes; the 24-landscape registry is the
  target coverage.

Named but not built (from the owner's creative-direction brief / project
plans):
- WDPA protected-area boundaries (Protected Planet API needs a token);
  Movebank migration telemetry (ties to `crossing.html`); iNaturalist/EoL
  cross-reference; a "world map" zone; AR layers; a live "pulse" dashboard;
  an education zone.
- **Unresolved doctrinal tensions** (`book-architecture.md` Part XIII):
  multi-place coherence (only one canonical cinematic place exists); audio
  (Article XVI) reserved; localisation (Canon XIX) reserved; drafts
  addressable by URL; the two-doctrine-set re-collision risk.

The 100-page project book is *designed but unwritten*
(`private-book/architecture/book-architecture.md` is the binding outline).

---

## 17. Glossary

- **Article / Canon / Principle / Reference** — citation tokens for the four
  doctrine documents (cinematic / editorial / pacing / intuition).
- **The Descent** — Article III; the cinematic signature movement.
- **Settle is not a tween** — ambient motion must persist past the end of any
  timeline; never ease to zero.
- **Bridge** — the one-way, non-UI passage from research to cinematic.
- **EcologicalNarrative** — the canonical one-record-per-observation schema.
- **Family C** — the legacy product-grade `species/*.html` + `public/data/*.json`;
  excluded from the build, kept for record.
- **DwC-A** — Darwin Core Archive (Occurrence core + ResourceRelationship
  extension) — the field-record's attested data substrate.
- **COM-B** — capability/opportunity/motivation behaviour model (Michie et
  al. 2011); the living-place's behaviour close.
- **Liquid Glass** — the tokenized research-surface glass material.
- **Points of life** — the glowing 3D species markers on the living-island.

---

## 18. First-day checklist for the joining engineer

1. `npm install && npm run dev`.
2. Open the cinematic homepage, then `places/sundarbans.html` — feel the
   Descent. This is the soul; do not "improve" it without reading §4.
3. Open `atlas/index.html` — the research glass surface.
4. Open `prototypes/field-record.html` and `prototypes/living-place.html`
   (try `?place=amazon-varzea`) — the exploration frontier.
5. `npm run check-narratives` — confirm green.
6. Read `.kiro/steering/cinematic-vocabulary.md` §2–§3,
   `cinematic-language/platform-architecture.md` §5/§8, and
   `experiential-references.md` §4 (anti-references).
7. Skim `private-book/architecture/book-architecture.md` for the full intent.
8. Re-read §11 and §13 of this document before writing any code.

*The doctrine is in the repository. This document is a map of where to look.*
