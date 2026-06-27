# Eco-Cinema Observatory — Project Status

**HEAD:** `feat/exploration-prototypes-and-data-pipelines` · build green

---

## Production state

| Surface | Pages |
|---|---|
| Cinematic | `index.html`, `places/sundarbans.html`, `places/crossing.html` |
| Atlas | `atlas/index.html`, `atlas/sundarbans.html`, `atlas/amazon-varzea.html`, `atlas/crossing.html`, `atlas/coral-triangle.html` |
| Research | `notes/` × 12 (Sundarbans + Coral Triangle carry cross-surface nav) |

Navigation graph complete. M1–M9 + R1 shipped. Coral Triangle certified as Observatory reference implementation for DwC-A interaction-web ecosystems. 9 of 12 narratives are `verified`; 3 remain `draft` (dinaric olm, east pacific tubeworm, hudson tomcod). See `git log` and `.agents/sessions/` for execution history.

---

## Active blockers

None.

---

## Backlog

1. **Amazon várzea narrative** — DwC-A data orphan (8 actors, 8 interactions) with no narrative, no atlas chip, no notes page; creating a narrative unlocks a full 3-surface experience
2. **Remaining draft elevations** — dinaric olm, east pacific tubeworm, hudson tomcod; Track A verification only, no code
3. **Third cinematic place** — candidate not selected; homepage nav evolves when ready

---

## Completed milestones

- **R1** (2026-06-27) — Release Patch R1: resolved two Independent Release Review blockers. Added "Interaction web →" to coral-triangle notes-surface SURFACE_LINKS (`src/notes/render-narrative.js`); added Hughes et al. (2007) to `public/dwca/coral-triangle/CREDITS.md`. Coral Triangle DwC-A certified as Observatory reference implementation.
- **M9C** (2026-06-27) — Scientific Validation Audit: GBIF key 5220228 corrected to 8841716 (*E. imbricata*); OCC:1 class/order corrected to backbone; two DOI errors resolved (Barott: correct DOI confirmed; Hoey & Bellwood: DOI removed); month "0" → empty.
- **M9B** (2026-06-27) — Coral Triangle field record: 9-actor DwC-A, 10 interactions, `atlas/coral-triangle.html`, atlas card + field-record nav.
- **M9A** (2026-06-27) — Coral Triangle ecological design (Research Curator); 8-issue Scientific Review + M9A Revision 1; spec at `.agents/decisions/2026-06-27-coral-triangle-design-v2.md`.
- **M1–M8** — see prior `git log` entries.
