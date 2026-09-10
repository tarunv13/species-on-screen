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
