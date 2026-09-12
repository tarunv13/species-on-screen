# Species art — style guide & asset slot

The field record and the living place draw each species with a **layered,
animated procedural illustration** (`src/prototypes/species-art.js`), whose
*form* is chosen from the species' real GBIF taxonomy. That is the shipping
baseline — license-clean, consistent, and animated.

> **Asset licensing (repo-wide, non-negotiable).** NC (non-commercial) licences
> are NOT acceptable for committed assets — this repository is open source and a
> downstream fork must be able to honour every asset licence. CC0 / CC-BY /
> CC-BY-SA / public domain only.

## The photoreal plate slot ("exact of a photograph, but not a photograph")

To upgrade any species to a high-end plate, drop an image here:

```
public/art/<scientific-name-slug>.<png|webp|jpg|svg>
```

where the slug is the scientific name lowercased with non-alphanumerics
replaced by hyphens. Examples:

- `public/art/panthera-tigris-tigris.webp`  (Bengal tiger)
- `public/art/inia-geoffrensis.webp`        (Amazon river dolphin)
- `public/art/heritiera-fomes.png`          (Sundri mangrove)

The renderer prefers the plate when present (drawn with a soft ground
shadow and a gentle idle bob) and falls back to the procedural
illustration otherwise. **No code change is needed** — add the file and
the species upgrades on next load.

## Art direction (for generated or sourced plates)

- **Register:** documentary realism — the dignity of a natural-history
  field illustration or a Salgado/Nick Brandt frame, not a cartoon and
  not a stock photo. "Photoreal but not a photograph."
- **Pose:** the animal on its own terms, side or three-quarter profile,
  facing left (the illustrations face left; the web edges read left-to-
  right into the human node at the foot of the scene).
- **Light:** soft, single-direction, slightly cool; no studio rim light,
  no dramatic spotlight.
- **Background:** transparent (cut-out). The species sits in the canvas
  scene, not on a card.
- **Colour:** biome-accurate, desaturated toward the scene's palette;
  avoid saturated "wildlife poster" colour.
- **Scale:** consistent body framing so relative sizes read true across
  species in the same scene.

## Provenance (required)

Every plate must be license-clean and credited. Record each here:

| File | Source | Author | License |
|---|---|---|---|
| _(none yet — procedural illustrations in use)_ | | | |

Acceptable sources: AI-generated illustration (note the model + that it is
an illustration, not a photograph), public-domain natural-history art
(e.g. Biodiversity Heritage Library), or CC-BY scientific illustration.
Do **not** use copyrighted photographs as plates.

## Sourced, ready, uninstalled — species plate candidates (Sundarbans cast)

**Research half only. Nothing here is installed, cut out, or downloaded into the
repository.** The cut-out itself is blocked on tooling; this table is the
licence-and-suitability record that must exist *before* any cut-out is
attempted, so that the sourcing survives even though the plates do not.

**Method.** Candidates were drawn from iNaturalist, filtered to
`quality_grade=research` and `photo_license=cc0,cc-by,cc-by-sa` via the public
API, and **every licence below was read from the observation record itself —
the photo object's own `license_code` — never from a thumbnail, a search-page
caption, or the observation's licence (which can differ from its photos').**
Dimensions are the record's `original_dimensions`. Sourced 2026-09-11.

**Two licence facts that matter downstream.** A photo's licence and its
observation's licence are separate fields and do diverge, so the photo's is the
one recorded here. And **CC0 is the only licence in this set with no
attribution obligation** — which is the one open question the cinematic surface
cannot currently answer (PROJECT_STATUS backlog item 8: CC-BY/CC-BY-SA require
visible credit, D3 forbids chrome). A CC0 frame sidesteps that entirely; a
CC-BY one does not.

| Species | Source record | Observer | Date · Locality | Licence | Pixel dims | Pose note | Cut-out required |
|---|---|---|---|---|---|---|---|
| *Heritiera fomes* | [iNat obs 167960583](https://www.inaturalist.org/observations/167960583), photo 291013660 | WATANABE Hitoshi (`tbc_watanabe`) | 2023-06-15 · Khulna, **Bangladesh** — the Sundarbans region itself | **CC-BY** | 2048×1365 | **Strongest of the set.** Flowering branch, soft dappled canopy daylight, green bokeh — the light already *is* the Sundarbans vocabulary, no regrade needed. Facing-rule N/A (a tree). Reservation: it is a *branch detail*, so at scene scale it reads as foliage, not as a canopy tree. | Yes — and hard: fine inflorescence against busy foliage |
| *Apis dorsata* | — | — | — | — | — | **No compliant frame found.** See failures below. | — |
| *Axis axis* | [iNat obs 228543648](https://www.inaturalist.org/observations/228543648), photo 405568044 | Tom Field (`tomfeild`) | 2023-04-06 · Karnataka, India | **CC-BY** | 2048×1346 | Adult stag, full body, clean three-quarter — but **facing right**, so it needs a horizontal flip (a permitted CC-BY derivative, which must then be declared as a modification). **Light does not match:** warm, arid, dry-season deciduous woodland, not humid mangrove. Would need a regrade, and a regraded subject is the "sticker" failure the spec warns about. | Yes — feasible; legs are low-contrast against leaf litter |
| *Scylla serrata* | — | — | — | — | — | **No compliant frame found.** See failures below. | — |
| *Tenualosa ilisha* | [iNat obs 58127691](https://www.inaturalist.org/observations/58127691), photo 92777412 | Sabarni Sarker (`sabarnisarker`) | 2020-08-31 · Kazla, Rajshahi, **Bangladesh** (Padma hilsa) | **CC-BY** | 1872×1154 | Clean full lateral profile, **facing left** already, crisp edges, correct region for the fishery. **Reservation, and it is a real one:** the fish is dead in a steel sink beside a plastic bag, under flat indoor light. That fails "the animal on its own terms" — it is a post-catch record, not a portrait. Admissible only if the editorial intent is explicitly the *fishery*, not the fish. | Yes — easy; hard edges against flat steel |
| *Todiramphus chloris* | [iNat obs 267793747](https://www.inaturalist.org/observations/267793747), photo 481287863 | Don Wellmann (`don54`) | 2025-03-08 · Phang Nga, Thailand | **CC0** | 2048×1354 | Perched, full body, dappled canopy light with bright green bokeh — **the light matches the vocabulary.** **Facing right**, so a flip is needed. Subject is contre-jour and underlit against the bright background; the perch branch crosses the feet. Locality is mangrove-register but not Sundarbans. **CC0, so no attribution obligation** — the only row here that raises no D3 credit problem. | Yes — feasible; silhouette separates cleanly from bokeh |
| *Prionailurus viverrinus* | [iNat obs 378753221](https://www.inaturalist.org/observations/378753221), photo 692742749 | `twan3253` ("Tim") | 2026-01-06 · Hambantota, Sri Lanka | **CC-BY** | 1631×1409 | **Facing left**, which is right — and nothing else is. Hard frontal **flash at night** against a black field: the opposite of dappled daylight, and unregradeable. The lower body is **occluded by wet paddy grass**, so no cut-out is possible below the chest. Not admissible. | Yes — but impossible as framed |

### Documented failures — PERMANENTLY CLOSED (ruling 2026-09-11)

> **Do not re-search either species.** These two are closed the way the coral
> scene plate is closed: not "none found yet", but *none findable by this
> method*. The reason is structural and is stated below; a future session that
> reopens them will rediscover the same result at the same cost.

**No compliant frame found** for two species. Both searches covered the same
ground: the **iNaturalist research-grade CC pool** (CC0 / CC-BY / CC-BY-SA,
queried by taxon name via the public API), regional candidates first (India,
Bangladesh, Nepal, West Bengal), then the pool at large.

- ***Apis dorsata*** — 1,249 research-grade CC observations, 67 CC-licensed
  photos. Three best regional candidates reviewed frame by frame:
  obs 96316789 (Assam, CC-BY, 2048×1536) is a **dead bee on red concrete**;
  obs 129000222 (Bengaluru, **CC0**, 2048×1646) is a bee **being eaten by a
  lynx spider**; obs 37300463 (Nepal, CC-BY, 2048×1536) is a magnificent
  **open-comb bee curtain** — genuinely the defining image of the species,
  which builds a single exposed comb — but it is a *colony texture*, not an
  individual animal, and the plate slot renders one species figure into a
  scene. Kept on record because if the slot is ever widened from "a species"
  to "a species' work", that frame is the one to revisit.
- ***Scylla serrata*** — 113 research-grade CC observations, 67 CC-licensed
  photos. Regional candidates reviewed: obs 36695304 (Kerala, **CC0**) shows
  the crab **held in a man's hands**, with the person prominent in frame and
  the crab far too small to survive a cut-out; obs 175177811 (Kerala, CC-BY)
  is a **dead crab entangled in a discarded ghost net**, shot top-down in flat
  grey light. The remaining regional option is Australian (CC-BY-SA), wrong
  locality for this cast.

**Why this is closed and not merely unfinished.** The pool is small, but the
size of the pool is not the problem. **Occurrence photography optimises for
documentation, and its best frames are unusable as portraits.** A
research-grade photograph exists to prove *that this organism was here, then*
— so the frames that serve it best are exactly the ones a plate cannot use:
top-down for diagnostic features, in-hand for scale, dead because a specimen
holds still, on a neutral substrate because background is noise. Two of the
five candidate rows in the table above are dead animals on man-made surfaces
for precisely that reason, and they are the *best* available.

Searching harder does not change an optimisation target. A compliant frame for
these two would have to come from a different kind of source entirely —
commissioned illustration, a natural-history archive, or a photographer working
to a brief — which is a different decision, with a different budget, and not a
continuation of this search. **Locality and dignity were not loosened to fill
rows**, the same discipline that vetoed the coral scene plate.

### Standing refusals — do not source these

Two species in the Sundarbans cast are **not to be sourced**, and these
refusals are not open to a better frame turning up.

- ***Panthera tigris tigris*** — the species plate slot renders into the
  cinematic surface, where **tiger-as-absence** holds. The tiger is present by
  its absence; a plate would make it a portrait subject and undo the doctrine.
  No licence makes this admissible.
- ***Homo sapiens*** — people appear in the interaction web as
  `HumanObservation` records, and that is where they belong. **A licence
  covers the photographer's rights, not a depicted person's dignity.** A CC-BY
  photograph of an identifiable person carries no consent to be rendered as a
  figure in an editorial scene. (This is not hypothetical: the *Scylla
  serrata* CC0 candidate above was rejected in part on exactly this ground.)


---

# The scene plate slot (the PLACE held as a plate)

> Governed by `.agents/decisions/2026-07-25-visual-layer-recovery.md`
> (Sprint V1.2 / V1.2b).

One level up from the species plate above: here the **place itself** — the
horizon, not the animal — becomes a plate held in darkness, replacing the
procedural scene. **This slot is empty by design until an asset is dropped,
and its emptiness is not a neutral state.** An asset slot with no visible
authoring contract can sit empty while everything around it reads as
compliant — so emptiness must be made legible *as a defect*, which is what
this section and the provenance table below exist to do.

## Three tiers, and the resolution order

Per cinematic place, resolution is **3D → layered → flat → procedural**. The
first tier that has an asset wins; with none, the procedural scene renders —
**byte-identical to today** (an empty `public/art/` changes nothing on screen
except that nothing was ever installed):

| Tier | Drop file(s) at | Applies to |
|---|---|---|
| **3D** | `public/art/3d/<name>.glb` | reserved (living-place threshold; not wired into the DOM/canvas descents) |
| **layered** | `public/art/scene/<slug>/<layerId>.{webp,png,jpg,svg}` | DOM parallax scenes (sundarbans) |
| **flat** | `public/art/scene/<slug>.{webp,png,jpg,svg}` | any cinematic scene (a single backdrop) |
| **procedural** | — (no asset) | the shipping fallback |

`<slug>` is the place's cinematic slug: `sundarbans`, `crossing`, `epr-vents`.
Drop a file, no code change — the scene upgrades on next load.

## Held in darkness — load-bearing, not stylistic

Scene plates are authored **dark**: **≥ 40% near-black, no bright sky, no
poster colour.** This is not a preference. The scene holds the plate in its
own darkness — the canvas scenes (`crossing`, `epr-vents`) draw their existing
`paintBase` gradient back *over* the plate as a veil (`BACKDROP_VEIL = 0.45`),
and the Article III luminance dip darkens the sanctioned cut. Both assume a
dark plate. **A bright plate will blow out the frame and break the cut.**
(Article VI — darkness is content.) No caption, no UI, ever, on the cinematic
surface: the plate is held, never labelled.

## Art direction

Same register as the species plates: **documentary realism** — the dignity of
a Salgado or Nick Brandt frame, not a cartoon and not a stock photo. Soft,
single-direction, slightly cool light; **no studio rim light**, no dramatic
spotlight. Biome-accurate but **desaturated toward the scene's palette** — no
saturated "wildlife-poster" colour. "Photoreal but not a photograph."

## Per-layer intent — sundarbans (layered set)

A layered set is authored to **composite** back-to-front. Each file fills its
parallax layer and inherits that layer's depth, atmosphere, opacity, and
descent choreography automatically:

| Layer id (file) | Intent | Declared depth (z) |
|---|---|---|
| `canopy-far` | distant treeline silhouette; recedes and dims during the descent | 120 |
| `canopy-mid` | nearer canopy mass; the mid horizon | 60 |
| `roots-mid` | mid pneumatophore field; rises during the descent | 24 |
| `roots-fore` | dominant foreground root architecture at human scale | 8 |

The `z` values (notional metres, far → near) are declared in
`cinematic-language/place-manifest.json` (`cinematic.scene.layers`). They are
the depth declaration a future spatial / WebXR renderer extrudes into a scene
graph — author the layered set to those depths and it is spatially
forward-compatible with no re-authoring. The canvas places (`crossing`,
`epr-vents`) declare a single `backdrop` layer (z 60).

## Provenance (required — same discipline as the species plates)

Every scene plate must be license-clean and credited. One row per file:

| File | Source | Author | License | Modification |
|---|---|---|---|---|
| `scene/epr-vents.webp` | USGS — East Pacific Rise, 9°39′N, 2550 m; DSV *Alvin*, 1991; "9N black smoker PICT0039" ([usgs.gov](https://www.usgs.gov/media/images/deep-ocean-hydrothermal-vent-system-east-pacific-rise)) | Pat Shanks, U.S. Geological Survey | Public Domain (USGS) | downscaled 4911→2000px, EXIF stripped, WebP q80 |
| `scene/crossing.webp` | Wikimedia Commons — "Soft coral peach komodo.jpg"; *Dendronephthya* soft coral, **Komodo National Park, Indonesia (Coral Triangle)**; strobe-lit; acquired 2006-08-14 ([commons](https://commons.wikimedia.org/wiki/File:Soft_coral_peach_komodo.jpg)) | Nick Hobgood (Nhobgood) | **CC-BY-SA-3.0** — attribute "Nick Hobgood, CC BY-SA 3.0"; **ShareAlike**: derivatives carry the same licence | ⚠ **PLACEHOLDER** (vetoed — portrait + subject-not-place); downscaled→WebP |

> ⚠ **`scene/crossing.webp` is a PLACEHOLDER, not the design.** Vetoed 2026-07-28:
> it is PORTRAIT (1260×1680 — cover-fit into 16:9 discards ~58%) and a single
> soft-coral *colony* (a subject, not a place). A compliant replacement must be
> **landscape (3:2–2:1)**, read as a reef slope/wall/structure you are *inside*,
> Coral-Triangle-proper with stated locality, ≥1400px, no diver, CC0/CC-BY/CC-BY-SA.
> Sourcing attempt 2026-07-28 (NOAA Ocean Exploration + Photo Library + Coral Reef
> Watch, then Wikimedia) found **no compliant landscape Coral-Triangle reef scene** —
> NOAA reef imagery is Micronesia/Pacific-US, and Commons yields only divers,
> single-species close-ups, aerial scenics, or unstated-locality generics. Locality
> honesty was **not** loosened to fill the slot.

Acceptable sources are the same as the species plates (AI-generated
illustration noted as such, public-domain natural-history art, or CC-BY
scientific illustration); **do not use copyrighted photographs.**

**An empty provenance table means the design is not installed — the procedural
output is a placeholder, not the design.**

## Sourced but not installed (deferred scenes)

License-clean and fully identified, but **not downloaded or installed** — the
scene that would host them does not exist yet. Recorded so the sourcing is not
lost (per the V1.3 ruling).

**amazon-varzea** — Amazon várzea, seasonally flooded forest / flood pulse.
No cinematic scene file exists yet (`PROJECT_STATUS.md` backlog #1). Two NASA
public-domain aerials, ready to use when the scene is built:

| Candidate | Source (provider · collection · ID · date · author) | License | Dims |
|---|---|---|---|
| Juruá meanders (Landsat, top-down) | NASA Earth Observatory · Landsat 8 OLI · image 145819 · acquired 2019-05-27 · Lauren Dauphin / NASA EO | Public Domain (NASA/USGS) | 8383×3913 |
| Muddy Water floodplain (ISS, oblique) | NASA Earth Observatory · ISS Crew Earth Observations · ISS064-E-14990 · 2020-12-23 · JSC ESRS / NASA | Public Domain (NASA) | 4928×2768 |

## Homepage globe textures (V1.3 Part A)

The planetary view (`src/globe.js`) is a three.js sphere textured with local
public-domain NASA imagery; a custom shader blends day/night across the
terminator. All public domain; **708 KB combined** (≤4 MB budget).

| File | Dataset · Collection · Resolution · Date | Author | License |
|---|---|---|---|
| `textures/blue-marble-august.webp` (day, 4096×2048) | **Blue Marble: Next Generation w/ Topography & Bathymetry** — **August 2004** monthly composite; NASA Visible Earth / Earth Observatory (record **73776**, `world.topo.bathy.200408.3x5400x2700`) | NASA Earth Observatory (Reto Stöckli) | Public Domain (NASA) |
| `textures/black-marble.webp` (night, 2048×1024) | **Earth at Night 2012 ("Black Marble")** — VIIRS day/night-band city lights; NASA Earth Observatory (record **79765**, `dnb_land_ocean_ice.2012.3600x1800`) | NASA Earth Observatory (NASA / NOAA) | Public Domain (NASA) |

**August** chosen for seasonality (V1.3 ruling): cloud-free by construction,
maximal northern vegetation, minimal Arctic ice, monsoon-green Sundarbans.

### RETIRED FROM THE ENTRANCE (2026-09-12)

**Both plates above are retired from the homepage.** `src/globe.js` and
`public/textures/` are deleted from the build path; the entrance is now a dark
world map of the places, at their real coordinates.

**They were not retired for being wrong.** They are correct, licence-clean,
well-chosen imagery, and `cinematic-vocabulary.md` asks for exactly this — "the
globe is photographed, not rendered." An earlier draft of the ruling said the
globe was retired for being *procedurally rendered*; that was false and is
retracted here as well as in the decision record.

They are retired because **correct imagery was serving a decorative purpose**.
However well photographed, a globe at first contact is an establishing shot
that carries no record: it shows the planet, it does not show the observations.
The entrance now shows the five places the archives actually hold. The register
is unchanged — held darkness, photographed rather than drawn, planetary scale.
Only the subject of first contact moved, from the planet to the places on it.

The provenance rows above are kept rather than deleted: the sourcing was sound,
and a future surface that needs a licence-clean planetary plate should find this
work rather than repeat it. See
`.agents/decisions/2026-09-12-entrance-amended-globe-to-map.md`.

