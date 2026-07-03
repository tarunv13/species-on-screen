# Handoff — session end

**1. Current task:** None in progress. M31 (EPR DwC-A reference audit) is complete and verified. No task is mid-flight.

**2. Files modified (all uncommitted, working tree):**
- `public/dwca/epr-vents/CREDITS.md` (M31 — DOI corrections)
- `src/prototypes/biome-backdrop.js`, `package.json`, `.github/workflows/verify.yml`, `PROJECT_STATUS.md` (M29/M30)
- New: `scripts/biome-backdrop.test.mjs`, `scripts/check-dwca-xml.js`, `scripts/check-dwca-xml.test.mjs`, `.agents/sessions/2026-07-03-m29-*.md`, `-m30-*.md`, `-m31-*.md`

**3. Completed:** M29 (EPR abyssal backdrop), M30 (`check-dwca-xml` well-formedness gate), M31 (7/9 EPR citations DOI-confirmed via CrossRef). `npm run verify` (8/8) and `npm run build` both green.

**4. Remaining:** Nothing blocking. Backlog (see `PROJECT_STATUS.md`): Amazon várzea cinematic surface; open-science roadmap (post-PhD); M18 cinematic coherence follow-ups; Bates et al. (2005) citation ambiguity (needs a Curator reading the actual papers, not abstracts).

**5. External lookups already done:** CrossRef DOI resolution for 7 citations (Lutz 1994, Desbruyères 1998, Micheli 2002, Sancho 2005, Van Dover 2018, Boschen 2013, Robidart 2008) — all independently verified via `api.crossref.org/works/<doi>`. Do not re-search these.

**6. Assumptions that must not change:** Never fabricate a DOI/backbone-version/date — leave gaps rather than guess. `resource-relationship.txt` `relationshipAccordingTo` fields are intentionally untouched (separate L2 curator work). Cinematic surfaces stay pure (no shared infra leaks in). Nothing committed to git — user has not asked for a commit.

**7. Recommended next action:** Review the uncommitted diff and commit if satisfied; no further autonomous work needed until directed.
