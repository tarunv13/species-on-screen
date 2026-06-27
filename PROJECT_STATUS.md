# Eco-Cinema Observatory — Project Status

**HEAD:** `feat/exploration-prototypes-and-data-pipelines` · build green · `observatory-v1.0` tagged at e61e898

---

## Production state

| Surface | Pages |
|---|---|
| Cinematic | `index.html`, `places/sundarbans.html`, `places/crossing.html` |
| Atlas | `atlas/index.html`, `atlas/sundarbans.html`, `atlas/amazon-varzea.html`, `atlas/crossing.html`, `atlas/coral-triangle.html` |
| Research | `notes/` × 13 (Sundarbans, Coral Triangle, Amazon várzea carry cross-surface nav) |

Navigation graph complete. M1–M14 + R1 shipped. Coral Triangle certified as Observatory reference implementation. Amazon várzea DwC-A orphan resolved: 3-surface experience live. **13 of 13 narratives are `verified`**; 0 remain `draft`. See `git log` and `.agents/sessions/` for execution history.

---

## Active blockers

None.

---

## Backlog

1. **EPR vents DwC-A design** — Research Curator session required before implementation; must address international-waters jurisdiction and deepwater observational access. Follows M9A precedent. Decision record: `.agents/decisions/2026-06-27-third-cinematic-place-epr.md`
2. **EPR vents atlas field record** — `atlas/epr-vents.html`, after DwC-A design accepted
3. **EPR vents cinematic surface** — `places/epr-vents.html`, after atlas complete; third cinematic place, third full 3-surface experience
4. **Amazon várzea cinematic surface** — `places/amazon-varzea.html`, deferred; fallback if EPR blocked; would complete existing 3-surface infrastructure

---

## Completed milestones

- **M15** (2026-06-27) — Chief Architect ruling: East Pacific Rise hydrothermal vents selected as third cinematic place. 5-candidate evaluation (EPR, Amazon várzea, Santa Barbara Channel, Dinaric olm, Pando). EPR wins on cinematic potential and geographic diversity; Amazon várzea deferred (strong fallback). Decision record: `.agents/decisions/2026-06-27-third-cinematic-place-epr.md`. No files modified; decision only.
- **M14** (2026-06-27) — Track A: `amazon-varzea-arapaima-flood-pulse` promoted draft → verified. Castello (2008) DOI confirmed (`10.1111/j.1600-0633.2007.00255.x`); title corrected to match publication. Castello et al. (2009) JAI supplement not indexed in CrossRef — no DOI assigned, citation retained. `notes/index.html` updated. **13/13 verified.**
- **M13** (2026-06-27) — Track A: `hudson-river-tomcod-pcb-resistance` promoted draft → verified. Correction: year start 1989 → 2006 (Wirgin 1989 is K-ras/tumour biology; Yuan 2006 EHP is earliest PCB-resistance source). DOI-anchored (Wirgin 2011, Yuan 2006). `notes/index.html` updated. 12 verified.
- **M12** (2026-06-27) — Track A: `east-pacific-rise-tubeworm-chemosynthesis` promoted draft → verified. Correction: year end 2011 → 1991 (Childress et al. 1991 is latest source). Dual DOI-anchored 1981 Science sources confirmed. `notes/index.html` updated. 11 verified.
- **M11** (2026-06-27) — Track A: `dinaric-olm-century-lifespan` promoted draft → verified. Correction: `order` Urodela → Caudata (GBIF backbone). DOI-anchored (Voituron et al. 2011). `notes/index.html` updated. 10 verified.
- **M10** (2026-06-27) — Amazon várzea narrative: `amazon-varzea-arapaima-flood-pulse` (Arapaima gigas, draft). Notes shell + narrative `.ts` created; SURFACE_LINKS and atlas.js card updated. DwC-A orphan resolved; full 3-surface experience live. 13 narratives registered.
- **R1** (2026-06-27) — Release Patch R1: resolved two Independent Release Review blockers. Added "Interaction web →" to coral-triangle notes-surface SURFACE_LINKS (`src/notes/render-narrative.js`); added Hughes et al. (2007) to `public/dwca/coral-triangle/CREDITS.md`. Coral Triangle DwC-A certified as Observatory reference implementation.
- **M9C** (2026-06-27) — Scientific Validation Audit: GBIF key 5220228 corrected to 8841716 (*E. imbricata*); OCC:1 class/order corrected to backbone; two DOI errors resolved (Barott: correct DOI confirmed; Hoey & Bellwood: DOI removed); month "0" → empty.
- **M9B** (2026-06-27) — Coral Triangle field record: 9-actor DwC-A, 10 interactions, `atlas/coral-triangle.html`, atlas card + field-record nav.
- **M9A** (2026-06-27) — Coral Triangle ecological design (Research Curator); 8-issue Scientific Review + M9A Revision 1; spec at `.agents/decisions/2026-06-27-coral-triangle-design-v2.md`.
- **M1–M8** — see prior `git log` entries.
