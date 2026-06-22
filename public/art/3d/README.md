# 3D model slot — the photoreal threshold upgrade

The "Enter the living place" threshold (`src/prototypes/living-place.js`)
renders a **real WebGL 3D floating living-island** procedurally — a
craggy earth mass, thousands of instanced grass blades, flowering moss,
and reclaimed-concrete shards, lit by a low sun on a minimal studio
backdrop. That is the shipping baseline (license-clean, generated in the
browser, no asset needed).

## To upgrade the threshold to a photoreal model

Drop a glTF binary here:

```
public/art/3d/<biome>.glb
```

keyed by the biome classification used elsewhere:

- `mangrove.glb` · `varzea.glb` · `reef.glb` · `savanna.glb` · `default.glb`

The threshold tries to load `<biome>.glb` on start; if present it is
auto-centred, scaled to frame, and used **in place of** the procedural
island (which is hidden) — with the same lighting, soft shadow, drifting
motes, parallax and float. **No code change needed.**

## Art direction for the model

- A single hero object: a fragment of habitat reclaimed by life — moss,
  grass, flowering plants, perhaps a reclaimed human-made surface, on a
  floating earth/rock base (cf. the project's reference board).
- Photogrammetry scans, Quixel/Polyhaven assets, or AI-to-3D
  (e.g. text-to-3D / image-to-3D) all work, provided the **licence is
  open** (this is an open-source platform — CC0 / CC-BY / public domain
  only). Record provenance below.
- Keep it under ~8 MB and decimated for the web; embed textures in the
  `.glb`.

## Provenance (required)

| File | Source | Author | Licence |
|---|---|---|---|
| _(none yet — procedural island in use)_ | | | |
