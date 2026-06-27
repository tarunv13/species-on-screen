# Eco-Cinema Observatory — Project Status

**HEAD:** `07c138c` · `feat/exploration-prototypes-and-data-pipelines` · build green

---

## Production state

| Surface | Pages |
|---|---|
| Cinematic | `index.html`, `places/sundarbans.html`, `places/crossing.html` |
| Atlas | `atlas/index.html`, `atlas/sundarbans.html`, `atlas/amazon-varzea.html`, `atlas/crossing.html` |
| Research | `notes/` × 12 (Sundarbans + Coral Triangle carry cross-surface nav) |

Navigation graph complete. M1–M7 shipped. See `git log` and `.agents/sessions/` for execution history.

---

## Active blockers

- `public/dwca/coral-triangle/` absent — blocks `atlas/coral-triangle.html`. Requires ecological data assembly.

---

## Backlog

1. **Coral Triangle DwC-A** — assemble occurrence + interaction data; promote to `atlas/coral-triangle.html`
2. **Narrative elevations** — Atacama tamarugo, Delaware Bay horseshoe crab, Santa Barbara giant kelp, Sendai crow (`in_review` → `verified`); Track A source verification only
3. **Third cinematic place** — candidate not selected; homepage nav evolves when ready

---

## Next milestone

**M8 — In-review narrative elevations.** Four narratives eligible for Track A verification. No code changes; pure research curation. Unblocks the notes surface completeness and is executable now without the Coral Triangle data dependency.
