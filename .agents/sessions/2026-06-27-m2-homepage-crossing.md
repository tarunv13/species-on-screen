# Session Diary — 2026-06-27 — M2: Homepage surfaces the Crossing

**Commit:** e389ea7
**Pipeline:** Session Prime → Feature Intake → Repository Analysis → Implementation → Doctrine Review → Build → Commit

## Built
- `index.html` — added `<a id="page-caption-crossing">` above existing caption
- `src/style.css` — added `.page-caption--secondary` (bottom: 3.6rem, color: ink-low, hover lifts to ink-mid)
- `src/main.js` — added `arriveToCrossing()` (1.5s luminance dip, no globe fly), wired both captions in `setupPageCaption()`, wired both to `.is-visible` in `runLandingSequence()`

## Decided
- **No globe camera fly for Crossing.** The Crossing is an open-ocean journey with no geographic hotspot on the planet. The globe fly is the Sundarbans-specific animation. `arriveToCrossing()` goes straight to the luminance dip — still Article III compliant, just 1.5s instead of 3.0s.
- **Primary/secondary hierarchy.** Sundarbans = ink-mid (78% white, bottom: 2rem). Crossing = ink-low (50% white, bottom: 3.6rem). Same typographic register, different weight. Clean, no new visual language.
- **No-JS fallback:** `href="notes/coral-triangle-hawksbill-natal-homing.html"` — consistent with Sundarbans pattern.

## Unblocked
- M3 (hawksbill narrative to `verified`) is now the only gap between the Crossing launch and a fully linked two-surface experience.

## Open
- M3 requires source citation verification (Lohmann et al. 2008 PNAS, Meylan & Donnelly 1999 Chelonian Conservation and Biology) before status elevation.
- Doctrine Advisory from M1 still open: Article VI visual verification for the Crossing canvas requires a real browser — confirmed architecturally but not screenshotted.

## Surprising
- The `arriveToCrossing()` function was simpler than expected — skipping the globe fly cut the implementation to ~30 lines vs Sundarbans' ~60. The transition grammar (luminance dip) scales down cleanly.
- The partial edit to `setupPageCaption()` introduced a brace error that required a full replacement. The AI OS Implementation Plan gap (field-level precision) applied here too — a plan should specify "replace the function body" not "modify the function."
