# Eco-Cinema Observatory — Project Status

**HEAD:** `41d0234` · `feat/exploration-prototypes-and-data-pipelines` · build green

---

## Production state

| Surface | Pages |
|---|---|
| Cinematic | `index.html`, `places/sundarbans.html`, `places/crossing.html` |
| Atlas | `atlas/index.html`, `atlas/sundarbans.html`, `atlas/amazon-varzea.html`, `atlas/crossing.html` |
| Research | `notes/` × 12 (Sundarbans + Coral Triangle carry cross-surface nav) |

Navigation graph complete. M1–M8 shipped. 9 of 12 narratives are `verified`; 3 remain `draft` (dinaric olm, east pacific tubeworm, hudson tomcod). See `git log` and `.agents/sessions/` for execution history.

---

## Active blockers

- `public/dwca/coral-triangle/` absent — blocks `atlas/coral-triangle.html`. Requires ecological data assembly.

---

## Backlog

1. **Coral Triangle DwC-A** — assemble occurrence + interaction data; promote to `atlas/coral-triangle.html`
2. **Amazon várzea narrative** — DwC-A data orphan (8 actors, 8 interactions) with no narrative, no atlas chip, no notes page; creating a narrative unlocks a full 3-surface experience
3. **Remaining draft elevations** — dinaric olm, east pacific tubeworm, hudson tomcod; Track A verification only, no code
4. **Third cinematic place** — candidate not selected; homepage nav evolves when ready

---

## Next milestone

**M9 — Coral Triangle interaction web.** M9A (Research Curator) in progress: producing `coral-triangle-design.md` from literature. M9B (Technical Lead) follows once design is verified. Completes the Coral Triangle 3-surface experience.
