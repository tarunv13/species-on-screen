# Species art — style guide & asset slot

The field record and the living place draw each species with a **layered,
animated procedural illustration** (`src/prototypes/species-art.js`), whose
*form* is chosen from the species' real GBIF taxonomy. That is the shipping
baseline — license-clean, consistent, and animated.

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
