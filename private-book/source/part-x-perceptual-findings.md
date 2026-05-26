# Part X — Perceptual Findings: source package (5 pages)

> Status: working artifact, not doctrine, not auto-loaded.
> Class: per-Part source register.
> Companion: `private-book/architecture/book-architecture.md` Part X.
> Generated: 2026-05-26.

---

## 1 · Section structure (architecture-frozen)

| § | Title | Pages | Class |
|---|---|---:|---|
| §1 | Settle as continuance, not stillness | 1 | reflective |
| §2 | The luminance-dip discipline | 1 | reflective |
| §3 | Body-relative cues precede geographic cues | 1 | reflective |
| §4 | Periphery fills before centre commits | 1 | reflective |
| §5 | Held darkness around photographs | ½ | reflective |
| §6 | Reading-time as scroll governor | ½ | reflective |

Sequencing intent: most consequential first; most procedural last.

## 2 · Topic mapping (user-named → architecture sections)

| User topic | Section | Treatment |
|---|---|---|
| "Settle is not a tween" | §1 | central claim; the operational mechanism *is* the finding |
| Depth-medium findings (the document) | frames §1 + §3 + §4 | quoted central paragraph anchors §1 |
| Stillness-as-life | §1 | sub-finding: ambient layers never resolve to zero |
| Concealment vs exposure | §2 + §5 | concealment = luminance dip + held darkness; exposure cap = ≤ 0.45 inscription max |
| Witness logic | §1 (sub-paragraph) | the stillness-accumulator inscription is a continuance mechanism, not a separate finding |
| Restraint under sparse ecologies | **outside Part X** | salt-flat counter-test belongs to Part VII §3; Part X may cross-reference once if room |
| Wallpaper-risk findings | §1 + §3 | ceiling of the 2D-silhouette medium; sets the bound for amplitude and period |

## 3 · Source dependencies

| § | Primary | Secondary |
|---|---|---|
| §1 | `cinematic-language/depth-medium-findings.md` (central paragraph); `prototypes/reviews/sundarbans-descent-review-v2.md` §M5; PR #40 commit message | PR #45 + PR #46 commit messages (stillness accumulator); v1 review's M5 verdict (the trigger) |
| §2 | PR #59 commit message ("Wire canonical arrival from homepage into Sundarbans place"); `cinematic-vocabulary.md` Article III Crossing phase | `pacing-principles.md` Principle III timing envelope |
| §3 | `cinematic-vocabulary.md` Article XVII; `cinematic-principles.md` archival §3 (Atmospheric Hierarchy); `depth-medium-findings.md` | `2026-05-25-canonical-mangrove-descent-spec.md` (six-phase ordering) |
| §4 | Article XVII; `cinematic-principles.md` archival §3 | depth-medium-findings.md |
| §5 | `cinematic-vocabulary.md` Article VI; PR #59 commit ("body { background: #0a1014 }" rationale) | Canon IX (photographs permitted) |
| §6 | `pacing-principles.md` Principle VIII (reading-time → vh table) | — |

## 4 · Quotation candidates (operationally precise; ≤ 30 words each)

| § | Excerpt | Provenance |
|---|---|---|
| §1 | "Motion drifts asymptotically; no resolved state." | PR #40 commit |
| §1 | "Three sin/cos pairs on prime-incommensurable periods (17/19/23/29/37/41 s), summed, never aligning to perception." | PR #40 commit |
| §1 | "Amplitude held subliminal (max ~5% viewport on nearest layer) to stay below the wallpaper threshold." | PR #40 commit (paraphrased from "wallpaper threshold of 2D silhouettes") |
| §1 (witness sub) | "The system never tells the user the text is there." | PR #46 commit |
| §1 (witness sub) | "Many seconds of attention are required to surface what a single small movement returns to base." | PR #46 commit |
| §2 | "The cut to the destination occurs at peak luminance dip, never on a clear frame." | PR #59 commit |
| §2 | "No visible page-switch, no loading screen, no modal, no clear frame between source and destination." | PR #59 commit |
| §3 | The depth-medium-findings.md central paragraph (Tier 1 reproduction; one paragraph only; identify before drafting) | depth-medium-findings.md |
| §3 | "Body-relative precedes geographic." | Article XVII (single phrase) |
| §4 | "Periphery fills before centre commits." | Article XVII (single phrase) |
| §5 | One sentence on first-paint darkness preventing the white flash through the navigation seam | PR #59 commit |
| §6 | The reading-time table caption only (table itself lives in Appendix C) | Principle VIII |

Total quotation budget for the Part: ≈ 12 short fragments. Anything more is over-quotation.

## 5 · Operational findings vs reflective findings

| Finding | Class | Operational evidence (must appear in the Part) |
|---|---|---|
| §1 Settle as continuance | operational | `random()` opacity targets; `random()` durations; `repeatRefresh: true`; retirement of body-class state machine |
| §1 Stillness accumulator (witness) | operational | 1/720 per-frame buildup at < 1.5 px movement; ≈ 0.04 × movementPx decay; base 0.10, max 0.45 |
| §1 Wallpaper ceiling | operational | subliminal amplitude bound; prime-incommensurable periods |
| §2 Luminance dip | operational | `window.location.assign` fires at peak darkness; opaque scrim returns under cinematic canvas dim |
| §3 Body-relative ordering | reflective → operational consequence | Article XVII reproduces the order: sound → atmosphere → mass → specificity → inhabitants |
| §4 Periphery composition | reflective → operational consequence | Article XVII species-during-transition prohibition |
| §5 Held darkness around photographs | operational | `body { background: #0a1014 }` inline in `places/sundarbans.html`; first-paint darkness rule |
| §6 Reading time as scroll governor | operational | Principle VIII vh table; ~250 wpm calibration |

Rule: every finding in this Part must end with one operational consequence — a parameter, a file path, or a doctrine identifier. If a finding cannot, it does not belong.

## 6 · Redundancy risks

Within Part X:

| Risk | Resolution |
|---|---|
| §1 wallpaper-ceiling and §3 body-relative both cite depth-medium-findings.md | §1 owns the medium's ceiling (amplitude / period); §3 owns the medium's *order*. No overlap if each cites a different sentence. |
| §3 and §4 both depend on Article XVII | §3 = ordering finding; §4 = composition finding. Article XVII codifies both, but §3 and §4 trace to different perceptual claims. |
| §1 (continuance) and §5 (held darkness) both speak to "what is unmoving" | §1 = motion that never resolves; §5 = stillness as background state. Verb test: §1 *continues*; §5 *holds*. |

Across the book:

| Risk | Owning Part | Part X's rule |
|---|---|---|
| The v1 → v2 pivot | Part VII §2 narrates | §1 distils as finding; no narration |
| Article III Descent anatomy | Part II §1, §6 | §2 cites the Crossing only; no full anatomy |
| Article XVII | Part II §4 | §3, §4 *root* the Article; do not restate it |
| Article VI (held darkness on photographs) | Part II §3 | §5 names the perceptual root only |
| Principle VIII (reading-time) | Part IV §4 | §6 names the perceptual root only |
| Salt-flat counter-test | Part VII §3 | Part X may cross-reference once; never narrate |

## 7 · Anti-abstraction safeguards

1. **Operational consequence rule.** Every finding paragraph ends with a parameter, file, or doctrine identifier. If a paragraph cannot, it is cut.
2. **No mythological vocabulary.** The following words trigger an automatic rewrite if they appear without an operational object inside the same sentence: *presence, absence, essence, stillness as*, *the void*, *the gaze*, *phenomenology*, *ontology*, *attention itself*, *being-with*, *unfolding*.
3. **No second-person, no rhetorical questions, no first-person plural.** Per editorial Canons I, II, XII, XV.
4. **No verbs of intention applied to the system.** Forbidden: "the page wants", "the descent invites", "the inscription waits", "the scene rewards". The system measures and acts; it does not desire.
5. **Tier 1 reproduction is one paragraph only.** depth-medium-findings.md's central paragraph in §1, full-text. No further excerpts of more than 30 words.
6. **The single-phrase rule (architecture mandate, strict).** Each finding may quote at most one phrase from its source review. Counter: if §1 has the depth-medium central paragraph, that *is* the §1 reproduction; no second phrase.
7. **Findings are claims, not arguments.** Each section asserts; none defends. The doctrine already defends.
8. **No section reads as a rule.** If a sentence in Part X sounds enforceable in PR review, it belongs in Parts II / III / IV; not here.
9. **Cap at one sentence of generalisation per finding.** All other sentences in the finding must be specific to this project.
10. **No reference to "cinema" in the singular abstract.** References to specific film traditions are confined to `experiential-references.md` (Appendix G); not surfaced in Part X.

## 8 · Figure dependencies

**None.** Architecture allocates zero figures to Part X. The five figures in the book are spent: Descent timing (II §6 / IV §2); three surfaces (V §1); narrative pipeline (VI §3); v1 / v2 comparison (VII §2); reading-order graph (front matter). Part X is verbal by design.

Recommendation: do not propose additional figures. A diagram of "stillness accumulating" is the precise drift Part X must avoid.

## 9 · Unresolved writing dangers

1. **§1 page pressure.** Most consequential finding; smallest budget; four operational mechanisms (random targets, random durations, `repeatRefresh`, retired body-class flip) plus the witness sub-paragraph (stillness accumulator) plus the wallpaper bound. Compression risk: high. Mitigation: §1 leads with the depth-medium-findings.md central paragraph as substrate, then lists mechanisms tabularly rather than narratively. If the budget breaks, drop the witness sub-paragraph to Part VII §1 and reference from §1.
2. **§2 polemic risk.** Architecture flags §2 as "the one finding the project would defend most strongly." The discipline is to record, not defend. If a draft of §2 contains an opponent (a "shortcut", a "common practice"), strike. The mechanism is the defence.
3. **§3 inversion risk.** Article XVII *codifies* the finding; §3 must present in finding-then-codification order, not codification-first. Test sentence-1: "Place names land best after the place has been felt as low, surrounded, humid, dim." (finding). Test sentence-last: "Article XVII orders the consequence: sound → atmosphere → mass → specificity → inhabitants." (codification).
4. **§4 thinness.** Periphery-before-centre is the smallest stand-alone claim. Risk: §4 reads as a sub-clause of §3. If unavoidable, fold §4 into §3 and reclaim the half-page for §1.
5. **§5 silence problem.** Half-page on darkness in a Part already disciplined against mystification is the easiest paragraph in the book to over-write. Mitigation: §5 names exactly two operational facts — Article VI's perceptual root + the inline `body { background: #0a1014 }` rule from `places/sundarbans.html` — and stops.
6. **§6 procedural drift.** Half-page on reading time risks turning into a typography note. Mitigation: §6 contains one sentence and one table caption. The table itself is Appendix C.
7. **Tier 1 reproduction identification.** "The depth-medium findings document's central paragraph" is unspecified; the paragraph must be identified and ratified before §1 is drafted. Honest reading of `depth-medium-findings.md`: the candidate is the paragraph that names settles-are-not-tweens, the wallpaper threshold, and the §5 principle tension in one breath. Confirm before drafting.
8. **Witness logic placement.** Architecture does not allocate a section. Two paths: (a) sub-paragraph in §1 (recommended); (b) own section. (b) requires architecture amendment; not justified at 5-page Part. Resolve by ratification of (a).
9. **Restraint under sparse ecologies.** The salt-flat-exposure counter-test produced a finding (subtractive contrast removal beats additive haze). Part X has no allocated section for it. Defer to Part VII §3. Do not import into Part X.
10. **The witness asymmetry sentence.** The cleanest one-sentence statement of the stillness-accumulator's content is also the most quotable: "Many seconds to accumulate; one small movement to reset." Risk: this sentence published in Part X becomes the project's epigraph. Mitigation: keep it operational by pairing immediately with the constants (1/720 per frame; 0.04 × movementPx).

## 10 · Implementation detail that overrides theory (non-negotiable specifics)

| Finding | Concrete number / file that wins |
|---|---|
| §1 continuance | `random()` targets, `random()` durations, `repeatRefresh: true` on `fog-fore` and `mist-rising` |
| §1 wallpaper ceiling | breath periods 17 / 19 / 23 / 29 / 37 / 41 s; max ≈ 5 % viewport on nearest layer; depth coefficients 0.15 / 0.30 / 0.55 / 0.95 |
| §1 witness | stillness threshold 1.5 px / frame; build 1/720 per frame; decay 0.04 × movement-px; opacity base 0.10, max 0.45; lerp 0.04 |
| §2 luminance dip | `window.location.assign` fires at peak black; opaque scrim returns underneath the dimming canvas; reduced-motion compresses by k = 0.5 across all phases |
| §3 ordering | Article XVII order, in five tokens, no expansion |
| §4 composition | "species-during-transition prohibition" (Article XVII clause); single phrase |
| §5 darkness | inline `<style>body{background:#0a1014}` in `places/sundarbans.html` head; reason: deferred ES module CSS arrives a frame later, would white-flash |
| §6 reading | Principle VIII vh table; ≈ 250 wpm calibration |

If Part X drafting produces a sentence that contradicts a number above, the number stands and the sentence is rewritten.

## 11 · Observational vs interpretive (per finding)

| Finding | Observational (permitted) | Interpretive (forbidden) |
|---|---|---|
| §1 continuance | "the ambient layer never resolves to a target value; each cycle picks new ones" | "the scene refuses to die" |
| §1 witness | "many seconds of cursor stillness raise the inscription's opacity from 0.10 toward 0.45; a single small movement decays it" | "the inscription rewards the patient viewer" |
| §1 wallpaper | "summed sin/cos on prime-incommensurable periods does not phase-align inside any human-tractable window" | "the world breathes in unrepeating time" |
| §2 luminance | "the navigation occurs at the frame of greatest darkness; no clear frame is shown between source and destination" | "the cut is invisible because perception cannot hold a black edge" |
| §3 ordering | "named places land later than felt places in the canonical sequence" | "the body knows the place before language does" |
| §4 periphery | "atmospheric and peripheral elements receive frame-time before central subjects" | "the eye fills the edges first because vision is peripheral by nature" |
| §5 darkness | "first paint is `#0a1014`; the deferred CSS arrives a frame later without producing a white flash" | "darkness is the photograph's frame" |
| §6 reading | "scroll-bound reveals are paced to ≈ 250 wpm via the Principle VIII vh table" | "reading is what makes the page slow" |

## 12 · Validation outcome

Part X is structurally sound on the architecture's terms *if* the following are committed before drafting begins:

1. The depth-medium-findings.md central paragraph is identified and ratified (gap §9.7).
2. Witness logic placed as §1 sub-paragraph; no architecture amendment (gap §9.8).
3. Restraint-under-sparse-ecologies confined to Part VII §3; one cross-reference only (gap §9.9).
4. The anti-abstraction safeguards (§7) are treated as binding for this Part specifically. A draft of Part X failing any of items 1–10 is returned to source, not edited.

**Recommend: ratify Part X structure with the three pre-conditions above; proceed.**
