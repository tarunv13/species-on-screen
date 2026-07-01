# Eco-Cinema Observatory — Project Status

**HEAD:** `feat/exploration-prototypes-and-data-pipelines` · build green · `observatory-v1.0` at e61e898 · **observatory-v2.0 release prepared — Independent Release Review = PASS WITH WARNINGS, 0 blockers; tag recommended (not yet applied). See `.agents/sessions/2026-07-02-observatory-v2.0-release.md`.**

---

## Production state

| Surface | Pages |
|---|---|
| Cinematic | `index.html`, `places/sundarbans.html`, `places/crossing.html`, `places/epr-vents.html` |
| Atlas | `atlas/index.html`, `atlas/sundarbans.html`, `atlas/amazon-varzea.html`, `atlas/crossing.html`, `atlas/coral-triangle.html`, `atlas/epr-vents.html` |
| Research | `notes/` × 13 (Sundarbans, Coral Triangle, Amazon várzea carry cross-surface nav) |

Navigation graph complete. M1–M17 + R1 shipped. Coral Triangle certified as Observatory reference implementation. Amazon várzea DwC-A orphan resolved: 3-surface experience live. **13 of 13 narratives are `verified`**; 0 remain `draft`. East Pacific Rise now has the full three-surface experience: cinematic (`places/epr-vents.html`, UX-reviewed), research (`notes/east-pacific-rise-tubeworm-chemosynthesis.html`), and atlas field record (`atlas/epr-vents.html`, M20) reading its DwC-A (`public/dwca/epr-vents/`, M19). `public/dwca/index.json` lists 4 archives. See `git log` and `.agents/sessions/` for execution history.

---

## Active blockers

None.

---

## Backlog

1. **EPR homepage nav** — add EPR vents to `index.html` main navigation (deferred per M15 decision record; now unblocked — the atlas surface is complete as of M20)
2. **EPR DwC-A reference audit (M9C-equivalent)** — confirm DOIs for the non-1981 interaction citations flagged in `public/dwca/epr-vents/CREDITS.md`.
3. **EPR atlas backdrop biome** — `src/prototypes/biome-backdrop.js` has no `vent`/abyssal recipe, so `atlas/epr-vents.html` uses the generic `default` painterly backdrop. Tonally consistent with the light research surface but not vent-specific; add an abyssal recipe + `keyFor` branch so the vent field "reads as itself" (fidelity nicety; deferred in M20 to avoid touching a shared module beyond scope).
4. **Amazon várzea cinematic surface** — `places/amazon-varzea.html`, deferred; would complete existing 3-surface infrastructure
5. **Cinematic coherence follow-ups (from M18 review)** — (a) Sundarbans↔canvas interaction-model divergence (click/GSAP-timeline vs scroll/Canvas2D) — the Observatory's central coherence tension; architectural, needs a Chief Architect ruling before any work. (b) Sundarbans `.vignette` (opacity 0.55) reconciled against Article V's vignette prohibition. (c) Cross-surface type-stack drift: Sundarbans leads with "Iowan Old Style", canvas surfaces with Georgia. (d) EPR camera `ay: H*0.50` vs The Crossing's `H*0.60` arrival framing. (e) Screen-reader exposure of editorial captions (currently `aria-hidden`); pending the forthcoming accessibility doctrine. (f) EPR/Crossing per-frame performance measurement (Principle XVI / Article XV).

---

## Completed milestones

- **M20** (2026-07-02) — East Pacific Rise atlas surface: `atlas/epr-vents.html` (thin shell mirroring `amazon-varzea.html`), rendering the M19 DwC-A live through the data-driven `field-record.js` engine. Archive registered in `public/dwca/index.json` within the same milestone so the atlas discovery chip resolves (M19 deferral closed). Navigation wired into the three existing per-place structures — research→atlas (`render-narrative.js` SURFACE_LINKS), atlas-overview detail card and atlas field-record nav (`atlas.js`, `field-record.js`) — preserving the Cinematic↔Atlas↔Research pattern; cinematic surface untouched. Auto-discovered as a vite build input; emitted to `dist/atlas/`. No atlas-architecture change, no new infrastructure. EPR three-surface experience now complete. Build green. Deferred: a vent-specific backdrop recipe (backlog 3). Diary: `.agents/sessions/2026-07-02-m20-epr-atlas.md`.
- **M19** (2026-07-02) — East Pacific Rise DwC-A designed and assembled (Research Curator): `public/dwca/epr-vents/` (occurrence.txt, resource-relationship.txt, meta.xml, eml.xml, CREDITS.md). 9 occurrences / 10 OBO-RO-typed interactions — the Observatory's only chemosynthetic (non-photosynthetic) trophic web: focal *Riftia pachyptila*, its *Candidatus* Endoriftia persephone endosymbiont, free-living *Beggiatoa* mat, vent mussel, Pompeii worm, limpet, crab, eelpout, *Homo sapiens*. GBIF backbone verified per-taxon; jurisdiction (ABNJ/ISA, empty countryCode), observational access (HumanObservation submersible + MaterialSample microbes), and abiotic vent chemistry (habitat + dynamicProperties.energySource, not a fake taxon) all ruled in `.agents/decisions/2026-07-02-epr-dwca-design.md`. Resolves the M15 open challenges. Not registered in `public/dwca/index.json` (bundled with the atlas build to avoid a chip to a missing page). Validated (columns, referential integrity, JSON, XML); build green.
- **M18** (2026-07-02) — Creative Director + UX review of all three cinematic surfaces (Sundarbans, The Crossing, East Pacific Rise) audited together as one Observatory. One Critical issue fixed across all three: render/ambient loops never paused when the tab was hidden (Principle XVII, codified non-negotiable). Added `visibilitychange` pause + a ~400ms resumption Hold with time-base reset in `src/places/crossing.js`, `epr-vents.js`, and `sundarbans.js`. Important/Nice-to-have findings recorded in the session diary, not implemented (per task scope): the Sundarbans↔canvas interaction-model divergence (architectural), the Sundarbans vignette vs Article V, cross-surface type-stack drift (Iowan Old Style vs Georgia), EPR camera `ay` framing vs The Crossing, screen-reader exposure of captions, and EPR/Crossing performance measurement. Build green.
- **M17** (2026-06-27) — Creative Director UX review of EPR cinematic surface. Three critical fixes in `src/places/epr-vents.js`: (1) warmth-beat/ventA misalignment — moved ventA gate from p=0.55 to p=0.45, so thermal glow is faintly present when beat 4 "a warmth with no source above it" lands at p=0.52; (2) compositing order — vent particles moved before worm tubes so atmospheric particles don't float in front of inhabitants (Article XVII); (3) depth gradient extended from `smoothstep(0,0.38)` to `smoothstep(0.05,0.60)`, maintaining visual texture in mid-descent; luminance dip repositioned to p=0.40 with narrower sigma. Full review in session diary.
- **M16** (2026-06-27) — East Pacific Rise cinematic surface live: `places/epr-vents.html`. Canvas 2D scroll-driven descent from sunlit surface through absolute abyss to vent field; 4 vents, 7 editorial beats, EPR biome palette (thermal orange, white smoker mineral, arterial-red worm plume, marine snow). Article XVII atmospheric hierarchy (thermal glow → plumes → worms). Article III luminance dip at p≈0.48. `SURFACE_LINKS` wired for research-to-cinematic nav. 3 files created, 1 modified. Build green.
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
