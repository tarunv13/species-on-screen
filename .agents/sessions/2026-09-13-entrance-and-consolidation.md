# Session diary — the entrance becomes evidence, and two sessions become one

**Date:** 2026-09-13 (arc spanning 2026-09-10 → 2026-09-13)
**Type:** Application (entrance, atlas, research pipeline) + six decision records + one doctrine amendment. Two parallel sessions consolidated into one at close.
**Role:** Creative Technical Lead → Research Curator → Repository steward.
**Branch:** `main`. Deployed.

---

## Where this leaves the project

The site is live at `https://tarunv13.github.io/species-on-screen/`, built from
`main`. The entrance is a dark world map of the places the archives actually
hold. Between 2026-09-10 and 2026-09-13 the project stopped decorating and
started showing its evidence — that is the whole arc in one sentence.

**Read this file before resuming anything.** It exists so a session days from
now does not re-derive four days of rulings, and several of them are
counter-intuitive enough to be re-litigated by accident.

## V1.5 — the occurrence map: uncertainty, not pins

The archive had held real GBIF coordinates since it was built, and the atlas
rendered them as text. They are now plotted — as **circles at each record's
declared `coordinateUncertaintyInMeters`**, never as pins.

A pin would assert a precision the record does not have. Every occurrence
declares 1 dp and 25 000 m after the 2026-09-11 generalisation, so the honest
mark is a real geodesic circle, built as a polygon in world coordinates rather
than a fixed pixel radius. **A reader who zooms in does not sharpen the claim;
they watch the circle fill the frame.** That behaviour is the feature.

**Max zoom is capped at 10.** At 21.8°N one pixel spans ~142 m at z=10, so a
25 km radius draws ~176 px — unmistakably a region, over a basemap still at
town scale with no street geometry. Past that the basemap resolves individual
roads while the circle sails off the viewport, and a reader looking at the
sharp middle of a soft claim reads the centre as an address. **The cap is the
point where the map stops being able to lie.** Do not raise it.

No heatmap, no interpolation, no density surface, no clustering — each invents
values between observations, and clustering additionally discards the
individual uncertainty radius, which is the one thing the layer exists to show.

Clicking a circle reuses the interaction-web node that already exists for that
occurrence, through the same `#fr-node-<id>` fragment a followed edge uses. No
second species panel was built.

## V1.6 — the media archive, and a bar that rejected what was already live

`scripts/media-citation-bar.mjs` is a pure, unit-tested gate (36 negative
checks). A record enters only with a stable, re-pullable identifier. **A bare
URL is refused**: a URL names a location and rots; an accession number names
the thing. NFTs are refused outright by scheme.

**The bar rejected all five films the site was already shipping.**
`tiger.json`'s `tmdb_media` carried `tmdb_url` and no id. The id was recoverable
from the route — normalisation, not invention — so they were re-admitted
through the same gate, and every one then failed relevance. Previously-shipped
content was not grandfathered. A bar that cannot reject what is already live is
not a bar.

**Relevance is a stated mechanical rule, not curation**, and the first loose
pass proved why it had to be tightened: it admitted **"Mud Crab" (2022)** for
*Scylla serrata* — a film about an assault in an Australian coastal town — and
labelled **three false-positive zoonosis papers** (a plant arachidonic-acid
enzyme study, a hilsa genome assembly, and a SARS-CoV-2 survey of *Odocoileus
virginianus*) as disease literature for three Sundarbans taxa. Each named the
taxon somewhere; each would have been a false claim about what that literature
is.

**7 admitted, 20 refused**, every refusal written into the output file with the
identifier it would have used, because the refusals are the evidence the bar
works. The cost is stated: the rule also drops true positives — it refuses
Disneynature's *Tiger* (2024) because the title lacks "Bengal tiger". **That is
curator work (`.agents/curator-media-worksheet.md`), not a reason to loosen the
bar.**

**agent-reach was DECLINED** (`.agents/decisions/2026-09-12-agent-reach-declined.md`).
It cleared the hooks ADR — that is recorded prominently so nobody reopens it on
discovering no hooks. It was declined on two other grounds: wrong tool class (a
social scraper, when every identifier the bar accepts comes from a catalogue
API), and unjustified credential surface (Twitter cookies, a Groq key, Chrome
cookie extraction) for zero capability gain.

## The IUCN GET crosswalk — deleted, not tuned

The lexical matcher in `research/sos_pipeline/sources/iucn_get.py` is **DELETED**.
Not disabled, not thresholded. Two controlled vocabularies that share no
terminology cannot be bridged by string similarity: *"Mangrove tidal forest"*
and *"Intertidal forests and shrublands"* are the **same** ecosystem and share
no content word, while *"Tropical savanna grassland"* and *"Tropical flooded
forests"* are **different** and share two. The score is uncorrelated with
correctness and the failure is silent.

**Five bound, each with a quoted GET profile justification:**

| landscape | EFG |
|---|---|
| `sundarbans` | **[MFT1.1** Coastal river deltas, **MFT1.2** Intertidal forests and shrublands] |
| `amazon-varzea` | TF1.1 Tropical flooded forests and peat forests |
| `coral-triangle` | M1.3 Photic coral reefs |
| `epr-vents` | M3.7 Chemosynthetic-based-ecosystems |
| `wood-buffalo-boreal` | T2.1 Boreal and temperate high montane forests |

**`iucn_get` is an ARRAY and element ORDER IS MEANINGFUL**: the containing group
first, the embedded group second. Sundarbans is MFT1.1 *then* MFT1.2 because
the mangrove forest sits as a patch inside the delta mosaic — which the MFT1.1
profile says of itself. They are not peers, and `contains` / `embedded_in` are
written onto the elements so the relationship survives an element being read
alone. `bind()` validates **per element**: an uncited element is refused while
its cited siblings are kept.

**21 honest nulls.** `iucn_get: null` + `iucn_get_unbound: "unbuilt"` means
**not examined**. An empty array would claim the place *was* examined and
nothing fitted — a stronger claim than a registry placeholder supports — and
`bind()` rejects one as a schema error to keep the distinction enforced rather
than documented. **Do not populate them.**

**Wood Buffalo is examined-and-not-bound** for its second ecosystem. The
Peace-Athabasca Delta is real, and no profile sentence justifies a code: TF1.4's
only distribution sentence reads *"Seasonal tropics and subhumid temperate
regions"*, excluding a delta at 59°N; MFT1.1 is explicitly coastal; TF1.6/TF1.7
are peatlands. **The typology holds no inland-delta group.** Recorded in
`iucn_get_partial` so the search is not repeated.

## Pressures — the deployed version is the ruled version

The Sundarbans pressures block ships reach-honest and **stays that way**
(`.agents/decisions/2026-09-12-pressures-reach-honesty.md`). **Exactly 1 of 9
dossier fields has usable attribution** — the IUCN category, bound to the
dossier's own `assessment`-typed source, and stating outright that no
assessment year is recorded. The other eight carry `REACH INCOMPLETE`.

**The eight unattributed fields must NOT be auto-bound to the document-level
`data_sources` list.** A document-level source is not a per-claim warrant, and
binding them would manufacture attribution that does not exist. They are
curator work — **backlog item 15**.

## The entrance amendment — globe to map

`.agents/decisions/2026-09-12-entrance-amended-globe-to-map.md`.

**The reason, stated correctly.** An earlier framing said the globe was retired
for being "procedurally rendered". That was false and is retracted: since V1.3
Part A (`51c0475`, pre-rebuild `848b5e4`) it was NASA Blue Marble NG and Black
Marble photography, and `cinematic-vocabulary.md:38` asks for exactly that. It
was retired because **an establishing shot carries no record** — it shows the
planet, not the observations.

**Preserved:** Article VI (the basemap is desaturated, dimmed and veiled to the
night ground — the held-darkness rule applied to someone else's tiles), the
1.5s darkness + 1.4s fade + ~6s approach + **0.9s hold**, and two deliberately
distinct curves (approach `power3.inOut`; caption fade `--duration-fade` with
`--ease-editorial`).

**Sundarbans' 2.0s arc is preserved** via MapLibre `flyTo` at matched duration
and easing, inside Departure → Approach → Crossing → Cut. Only what the camera
arcs toward changed. It did **not** become a `dip`.

**Four `.kiro/steering/` provisions rebound** under one named amendment, each
citing it inline: Planetary time; Principle IV (rotation continuity →
**camera** continuity); "touch the place, not read its name from a menu"
(preserved and strengthened); Article XI's largest-body composition. A fifth —
`cinematic-vocabulary.md`'s Approach phase — was rebound separately from
"surface normal" to the view axis.

**`globe-hotspot` → `entrance-hotspot`** migrated across schema, TS type,
manifest row and `check-manifest.js`, with `hotspotId` still required. Renamed,
never deprecated.

**One authorised copy edit**, the only break in the copy freeze: the noscript
line, because *"The planetary view requires JavaScript"* became false. A frozen
string that has become a lie is not preserved by leaving it alone.

## ⚠ THE PITCH TRIPWIRE — read this before touching the entrance camera

`cinematic-vocabulary.md`'s Approach phase used to read *"the camera arcs in
along the surface normal of the selected hotspot"*. A map has no surface normal,
so the mechanism was rebound to the view axis.

But "surface normal" also guaranteed something the new wording does not say:
**the camera arrives perpendicular to the ground, so the place is faced rather
than swung past.**

**That guarantee is preserved on the entrance map by `pitch` remaining 0** —
`dragRotate` and `pitchWithRotate` are both `false` and pitch is never set. It
holds **structurally**, not as a setting.

**If pitch is ever introduced to the entrance, Principle IV must be revisited**,
because the guarantee stops being structural and becomes a setting — and a
setting can be changed by someone who does not know it was load-bearing.

## The three-places ruling

**The entrance plots places that can be ENTERED, not places that are
registered.** Three, not five.

`check-grammar` found this, not a human: it refused the attempt to plot
`amazon-varzea` with *"[cross-depth navigation string] src/main.js"*. That place
has an archive and an atlas record but no cinematic surface, so reaching it
means the entrance carrying an `atlas/` or `notes/` link — the D3 affordance
sink. `index.html` is exempt because its anchors are no-JS fallbacks; generated
pins are not, and must not acquire the exemption. **The gate was not weakened.**
`wood-buffalo-boreal` is registry-only, so its pin would lead nowhere.

**The entrance's count is a consequence of what is built, never a target.** A
later session finding fewer pins than the registry holds is watching the
mechanism work.

## The repo rebuild and the dead-SHA crosswalk

The repository was rebuilt on 2026-09-11 to remove a burned credential and
precise species localities from history, then renamed to
`species-on-screen-legacy` (private) while a new public repo took the name. The
rebuild was chosen over a force-push because `refs/pull/*` survive a force-push
and two of them still resolved to a Bengal tiger camera-trap locality at ~0.1 m
precision.

**Every commit SHA was rewritten.** `PROJECT_STATUS.md` carries a pre-rebuild →
live crosswalk table at its top, above the first SHA in the prose. 11 of 12
cited SHAs were dead; one of them was cited in this arc's own entrance ADR and
is now corrected to `51c0475` with the dead identity kept beside it.

This became **`PROJECT_OPERATING_MANUAL.md` §7 — the dangling-reference defect
class**: a reference that reads as authoritative and resolves to nothing. It
hit from three directions in one week (a SHA, a path, an enum value) and the
shared tell is that **it resolves locally, or reads plausibly, so it passes
review**. Verify against a **fresh clone**, never local `cat-file` — lingering
unreferenced objects give false positives, and a false positive converts a
doubt into a confirmation.

## Thought Review (AI-OS session-close step)

**No new Thought captured.** Every durable lesson from this arc found a
resolved home rather than staying pre-resolution: the dangling-reference class
is now `PROJECT_OPERATING_MANUAL.md` §7; the entrance amendment, the crosswalk
ruling, agent-reach, credential posture and pressures honesty are decision
records; the pitch tripwire is recorded in doctrine at the provision it
constrains and again here. The one open Thought
(`2026-09-11-nature-security-landscape-priority`) stays at `Working` for the
build-order question, which remains declined rather than deferred.

Per the never-create-speculatively discipline, no Thought is opened.

## Verify / build status

`npm run verify` green (18 checks), `npm run build` green, `check-grammar` and
`check-cinematic-grammar` both ok. Deployed at `8ac0e6e`, run `34708018932`,
conclusion success.

**No felt pass has been run, and none is claimed.** The gates cannot see light,
and this arc replaced the thing the entrance looks like. That is the first item
waiting.

## Conclusion

The project spent four days replacing decoration with evidence, and refusing
things: a matcher that could not work, a scraper that did not fit, five films
already on the site, twenty-one bindings nobody had examined, two pins that
would have led nowhere. What shipped is smaller than what was asked for in
almost every case, and in every case the smaller thing is the one that can be
defended.
