# Canonical Mangrove Descent — Prototype Specification

Date: 2026-05-25
Scope: the minimum viable full descent experience, using the Sundarbans
mangrove as the single canonical instance. This document supersedes
prior descent attempts (`task-cinematic-rebuild`, `task-immersive-redesign`,
`task-globe-immersion`, `task-multi-species-expansion`,
`task-consolidation-v1`) for the purposes of the prototype.

This spec is the design substrate; the companion document
`2026-05-25-implementation-plan.md` is the executable plan.

---

## 1. Framing principle: zoom and scroll are different gestures

The seven-layer platform vision (planet → biome → habitat → ecosystem →
species → causation → archive → memory) collapses if treated as one
continuous gesture. The single most important architectural decision
for the prototype is to disambiguate the two axes.

- **ZOOM is discrete.** Three cinematic *cuts* with 2–3s transitions.
  Not a Powers-of-Ten infinite zoom.
- **SCROLL is continuous.** But only *inside* a single zoom level.
  Scroll is for reading; zoom is for arriving.

In the prototype there are exactly **two zoom transitions** (planet
into descent, descent back to planet) and **one scroll surface** (the
descent itself). That is the entire chassis.

```
[planet]  --Z1-->  [Sundarbans descent: a single scroll page]  --Z2-->  [return]
```

Layers 3–7 of the vision (perceptual world, scrollytelling, root-cause,
evidence, memory) are **not** separate routes or modals. They are the
vertical phases of one continuous scroll document. This is the single
biggest simplification.

---

## 2. The canonical instance

**Sundarbans → swimming Bengal tiger.** Chosen not for novelty but for
evidentiary completeness:

- The Sundarbans is the only place on Earth where the canonical apex
  predator is *aquatic in a forest*. The image carries its own
  argument.
- The causal chain is unusually well-evidenced and *finite*: upstream
  damming (Farakka barrage sediment loss) + downstream conversion
  (shrimp aquaculture) + sea-level rise. Three nodes, all citable, all
  presentable in editorial prose.
- Archival depth exists in three registers simultaneously: scientific
  (Landsat 1985→2020 mangrove cover; Goldberg et al. 2020),
  journalistic (Mongabay, NYT, BBC long-form), literary/cinematic
  (Amitav Ghosh, *The Hungry Tide*; Annu Jalais, *Forest of Tigers*;
  *Tiger* — Disneynature, 2024).
- One secondary witness species — the **mudskipper** — keeps the
  descent from being a hero-only frame without expanding into a
  multi-species page.

Pick the tiger as protagonist, the mudskipper as witness, no third.

---

## 3. The complete user journey (single path, one branch)

1. **Arrival.** Planet at rest as in the homepage audit. One sentence
   in editorial type. Sundarbans is the only **lit** hotspot; the
   other nine are visibly **anchored but dim** (locked, not absent —
   visible negative space matters editorially).
2. **Approach.** Hovering Sundarbans lifts its label; pressing it
   begins Z1.
3. **Z1: planetary descent.** 3-second camera move; the globe palette
   desaturates into the delta tone (warm-silt or cold-silt — pick one);
   the globe falls out of frame as the page composes itself from the
   same darkness.
4. **The descent.** One scroll page, six phases. Read through, no jump
   nav, no progress indicator.
5. **Coda.** The descent ends in held darkness, not a CTA. No "explore
   another species." No share buttons.
6. **Z2: ascent.** A single quiet affordance (`Return to the planet`)
   reverses Z1. The previously-lit Sundarbans hotspot now carries a
   thin baseline underline in its label — the only persistence the
   prototype keeps.

That is the whole thing. One linear path. Two reversible cuts. No
branches.

---

## 4. The six phases of the scroll descent

These are pacing markers, **not section headers** on the page. The
page reads continuously; the viewer should not feel the seams.

| Phase | Posture | Length | Visual register | Citations |
|---|---|---|---|---|
| 1. Approach | The forest as silhouette | ~120 words, 1 image | tidal silt, dawn ochre, shallow depth of field | 0 |
| 2. The forest as a body | Phenomenological — roots, salt, breath | ~250 words, 3 anchored details | mid-canopy parallax, slow | 2 |
| 3. The tiger that swims | The protagonist arrives | ~300 words, 2 photographs paired | water-line; surface tension visible | 2 |
| 4. What is happening to this forest | Pivot from observation to causation | ~400 words, 3 causal nodes | the visual quiets; type carries weight | 6 |
| 5. What was here | Archival pairing — 1985 vs 2020 | ~250 words, 1 paired image | side-by-side, neither animated | 3 |
| 6. Memory coda | One quotation, no interaction | ~150 words, 1 image | held darkness, slow fade | 1 |

Total: ~1,500 words; ~14 anchored citations; 5–7 images; 12–15 minute
careful read.

This is the editorial register. It is not TikTok dwell-time. The
prototype is a **publication**, not a feed.

---

## 5. Interaction architecture: only three verbs

- **DRAG** — rotates the planet. Globe view only.
- **PRESS** — descends into Sundarbans (Z1) or ascends back (Z2). One
  target each.
- **SCROLL** — drives the descent. Scroll never zooms. Zoom never
  scrolls.

Plus one passive verb: **HOVER** — lifts a hotspot label, opens an
inline citation expansion. It does not produce panels, modals, or
sidebars.

What is **not** a verb in the prototype: filter, search, toggle, tab,
menu, breadcrumb, "view 3D model," compare, timeline scrubber,
bookmark, share, save, account. If a feature requires a fourth verb,
it does not belong in the prototype.

---

## 6. Zoom and scroll transitions in detail

**Z1 (planet → descent), 3 seconds:**
- Camera flight from the rest position to a near-tangent over the Bay
  of Bengal.
- During flight, the descent page below composes itself behind the
  canvas (loaded but invisible).
- At t=2.0s the canvas alpha begins to drop; at t=2.6s the page beneath
  becomes interactive; at t=3.0s the canvas is at α=0 and pointer
  events transfer.
- The delta palette takes over the page background, so there is no
  flash-of-different-colour seam.

**Internal scroll within the descent:**
- Lenis-driven smooth scroll, scoped to the descent container.
- ScrollTrigger drives **one** thing per phase: image parallax, type
  fade-in, or causal-node reveal. Never multiple simultaneously.
- No "pin and play" sequences except phase 5 (archival pairing), where
  the 1985/2020 image pair holds while one paragraph of type passes.

**Z2 (descent → planet), 2 seconds:**
- Reverse of Z1, faster — the viewer has finished and wants the world
  back.
- The Sundarbans label now carries a thin baseline underline. No
  localStorage, no progress %.

---

## 7. Spatial narrative structure

The descent's spatial register changes by phase, all on the same page,
all with the same scroll axis. This is the trick that lets one page
carry layers 3–7 of the vision without separate routes.

- **Phases 1–3** (approach, body, protagonist) are **perceptual**.
  Image-led. Type sparse. The viewer is *in* the place.
- **Phase 4** (causation) is **investigative**. The image quiets to a
  single muted aerial; type takes the frame. The three causal nodes
  are illustrated as anchored paragraphs, **not** as an interactive
  diagram.
- **Phase 5** (archival) is **documentary**. Paired Landsat composites,
  a quotation from a 1980s field study, one film still. Layer 6 lives
  here.
- **Phase 6** (memory coda) is **literary**. One quotation (Ghosh, or
  Jalais) — cited and earned. No image, or one image at low
  luminance. Layer 7 lives here.

The spatial register shifts; the scroll axis does not. **One axis,
six tones.**

---

## 8. Evidence integration and citation behaviour

This is where the project earns or loses its claim to academic
seriousness. The doctrine:

1. **Inline anchored numerals** — superscripts in the prose, e.g.,
   "Sundarbans mangrove cover declined from approximately 1,690 km² in
   1985 to 1,360 km² in 2020.¹⁴" The numeral is a button.
2. **Pressing a numeral expands the source inline**, in place — a
   small block of editorial type opens between paragraphs (not a
   tooltip, not a modal, not a sidebar).
3. **The full source list lives at the foot of the same page**, in
   full bibliographic form: author, year, title, publication, URL,
   plus a one-line methodological note where the figure is statistical.
4. **Every statistical claim carries a date and method.** "1,360 km² in
   2020 (Landsat-derived)" is the editorial discipline that prevents
   the figure from being decorative.
5. **Where evidence is contested, the prose says so.** In editorial
   voice. In the body. Not in a footnote.
6. **Film references are first-class citations:** director, year, the
   specific sequence or frame. Generic "as seen in nature
   documentaries" never appears.

Citations are not chrome. They are part of the sentence. The
interaction is "open the source," not "see references." If a claim
cannot be anchored to a real source, it is rewritten or removed before
publication.

---

## 9. Archival layering, in one section

Phase 5 is the entire archive in the prototype. It contains:

- **One paired image** — Landsat 1985 vs Landsat 2020, side by side,
  neither animated, with a single caption naming the source and the
  methodological note.
- **One quotation** — from a 1980s field study or news report, in
  full, with citation. Length: 30–60 words.
- **One film reference** — director, year, the specific sequence
  cited, and what it shows. Not a clip; a reference.

That is the archive. Three artifacts. Not a gallery, not a database,
not a search.

---

## 10. Behavioural-change logic (COM-B), at the smallest honest size

The COM-B framing exists in the project's prior data pipeline
(`tiger.json:com_b`). It tempts a dashboard. The prototype's
discipline:

- COM-B does **not** appear as a section, panel, or tag.
- It appears as **one paragraph** at the end of phase 4, in editorial
  prose, naming what capability/opportunity/motivation gap stands
  between the viewer and any action they could take.
- One sentence; one citation to the COM-B literature (Michie et al.
  2011).
- No action button. No "what you can do" list. No newsletter.

If COM-B cannot be discharged honestly in one paragraph, it is not
yet ready to live on the page. Do not put a framework in the chrome.

---

## 11. Narrative pacing — the held silence

The pacing audit of the homepage is the model. The descent inherits it.

- **Z1 lands the viewer in held silence**, not in a hero unit. Phase 1's
  first paragraph appears 2–3 seconds *after* the page is interactive.
  The first thing the viewer sees in the descent is the image and the
  silt; the type comes when the eye has settled.
- **No phase begins on a heading.** Each phase begins on an image or a
  sentence, never a label.
- **Phase 4's pivot is signaled by a tonal shift** (the visual register
  quiets; the page background gains a hairline of additional grey),
  not by a banner saying "Threats" or "Investigation."
- **Phase 6 ends in held darkness.** The page does not scroll into a
  related-content unit. It ends. The only affordance after it is the
  ascent button.

---

## 12. What MUST exist in the first prototype

1. The planetary view with one lit ecosystem (Sundarbans) and nine
   visibly-locked hotspots — using the homepage-audit's editorial
   chrome (no glass cards, no green/orange brand accents, anchored
   labels, ambient drift rotation).
2. **Z1 / Z2** as the two cinematic cuts, with palette continuity
   across the cut.
3. **One linear scrollytelling descent** in six phases, ~1,500 words,
   on one route.
4. **Tiger as protagonist + mudskipper as witness.**
5. **Three causal nodes**, named and anchored: shrimp aquaculture
   conversion, Farakka sediment loss, sea-level rise. Two citations
   per node.
6. **Inline anchored citations** with in-place expansion; full source
   list at the foot of the descent.
7. **One archival pairing** (1985/2020 satellite), **one historical
   quotation**, **one film reference**.
8. **One memory coda** — quotation + ~150 words.
9. The two return-state details: ambient slow-drift planet and a thin
   underline on the visited hotspot label.
10. A `noscript` editorial fallback.

---

## 13. What should be postponed entirely

- All other biomes. The other nine hotspots are dim and locked.
- Multi-species sprawl within the mangrove. Two species, no third.
- Layer toggles (`Species / Habitats / Threats`) on the planet —
  collapse them into the descent itself; remove the bottom bar entirely.
- All charts, dashboards, time-sliders, and comparison views.
- Soundscape. Register the absence per Article XVI; do not build it.
- Mobile descent as first-class. Read-only fallback on mobile only.
- User accounts, bookmarks, sharing, "explore another species"
  affordances.
- Speculative future scenarios beyond the single-paragraph coda.
- A descent template generalisable to other ecosystems. Build the
  mangrove descent as a self-contained module.
- COM-B as anything more than one paragraph and one citation.
- Embedded video. Film references are textual.

---

## 14. What risks overwhelming the experience

Near-irresistible failure modes; named so they can be refused on sight.

1. **The infinite-zoom temptation.** Collapsing Z1+scroll+Z2 into one
   continuous Powers-of-Ten camera move. Always magnetic in tech demos,
   always destroys narrative orientation.
2. **The evidence sidebar.** Putting citations and archive in a
   parallel panel. Splits attention; the viewer either ignores it or
   stops reading the body.
3. **The completeness urge.** Wanting to enumerate every threat, every
   citation, every species in the mangrove. The discipline is the
   single causal chain of three nodes and the two species.
4. **Multimedia stacking.** Video + audio + parallax + particles +
   scroll-driven typography in the same phase. Pick one per phase.
5. **UI chrome creeping back.** Progress indicators ("4 / 6"), sticky
   tables of contents, "you are here" maps, breadcrumbs. None of these
   belong.
6. **Footnote-density academic pose.** Ten citations per paragraph as
   a posture of seriousness. The discipline is exactly one anchored
   citation per substantive claim, no more.
7. **Section headers per phase.** Headers reify the seams; the page
   should read as one body of prose.
8. **An action CTA at the coda.** "Take action," "donate," "share."
   Article-level betrayal of the editorial voice.

---

## 15. Architectural simplifications

1. One slug, one route, one scroll page. No tab system, no
   sub-routes, no in-page nav.
2. Citations are anchored numerals with in-place expansion, sourced
   from a single JSON beside the descent's prose. Source list rendered
   to the page foot from the same JSON. No CMS, no database.
3. The archive is text + two images + a film reference.
4. The causal chain is illustrated through editorial paragraphs, not
   an interactive diagram. Three paragraphs, three node labels in the
   body, six citations.
5. Z1 and Z2 are two GSAP timelines sharing palette continuity tokens;
   no general transition framework.
6. No descent-template abstraction. The mangrove descent is a
   hand-authored long-form page.
7. State across cuts is a single boolean (`hasVisitedSundarbans`) held
   in memory only; no persistence, no localStorage.
8. Mobile is a separate, simpler artifact — the descent's prose
   rendered as a long-form static article, no scrollytelling.

---

## 16. Academic rigour without overload

1. Anchor every factual claim, but anchor it once. One citation per
   claim, never two.
2. Carry the date and method on every statistic in the running text,
   in parentheses. Highest-leverage rigour tactic.
3. Where evidence is contested, say so in the body, in editorial voice.
4. Use full bibliographic form in the source list. Half-cites are the
   failure mode.
5. Do not invent citations. The prototype's source list should contain
   no more than ~14 citations; every one of them must be real.
6. Film references include director, year, and the specific sequence.
7. The COM-B paragraph names what the viewer cannot do as honestly as
   what they can.
8. Pick one editorial source for each contested claim rather than
   averaging.

The prototype's rigour lives in the discipline of fewer, better-formed
citations — not in their proliferation.

---

## 17. What this prototype proves, and what it does not

It proves: that one ecosystem can be carried from planet to memory in
a single descent that reads as an editorial publication; that zoom and
scroll are separable; that evidence and archive can live inside the
prose rather than beside it; that a behavioural-change frame can be
discharged in one honest paragraph.

It does not prove: that the descent template generalises; that biome
proliferation works; that a soundscape is needed; that mobile
scrollytelling is viable; that the platform scales. Those are v2
questions. Resist them.
