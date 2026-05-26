# Seed: Why cinematic ecology required asymmetry

> Status: seed draft, not for publication.
> Class: Part I framing chapter.
> Companion: `private-book/architecture/book-architecture.md` Parts I, V.
> Generated: 2026-05-26.

---

Two surfaces; one source of truth. The arrangement is the project's architecture, and the symmetry it appears to promise — two registers, sharing data, accessed by choice — was unattainable from the first prototype. The cinematic surface and the research surface cannot obey the same informational logic. The book records the incompatibility before it records anything else.

## The two registers do not negotiate

The research surface is conventional. A `notes/<id>.html` page renders a single ecological narrative as an article: header (place name, species common and scientific, IUCN status, geographic identifiers), editorial place line, sourced observation as a block-quoted claim, markdown body in paragraphs, numbered bibliography with per-kind formatting, metadata footer. Around twenty fields per record reach the page. No filtering, no search, no dashboard chrome. The register is academic record-keeping in its most ordinary form.

The cinematic surface is severe. `places/sundarbans.html` extracts three fields from the same record: `place.name`, `place.editorialPlaceLine`, `editorial.fragment`. The species name does not appear. Taxonomy does not appear. IUCN status does not appear. The observation summary does not appear. The sources do not appear. The body does not appear. What enters cinematic space is a place, an editorial line that frames a threshold, and a single fragment which the inscription system surfaces only after sustained inhabitation.

The same record produces both pages. The schema (`cinematic-language/ecological-narrative.example.ts`) is the single source. The disjointness is enforced at the build: `places/sundarbans.js` does not import `notes/render-narrative.js`; their bundles share the schema chunk and nothing else. Each surface picks its subset.

That picking — three fields against twenty — is the asymmetry. It is not an editorial preference. It is the platform architecture, codified in §5 of `platform-architecture.md`, and it was reached by elimination.

## Why the cinematic surface accommodates almost nothing

The forms that compose research material — names, numbers, dates, citations, comparisons, lists, captions — are each individually incompatible with cinematic grammar. Names break the body-relative-precedes-geographic ordering: a place is felt as low, surrounded, humid, dim, before it is named. Numbers introduce dashboard register at the moment they acquire a backplate. Dates and citations carry encyclopedia register, which Article XV refuses on cinematic surfaces. Comparisons require two visible objects, which the Descent's Crossing does not preserve. Lists require parallelism, which fragments the held attention the Settle is engineered to maintain. Image captions require text adjacent to image, which violates Article VI's held-darkness-around-photograph rule.

What survives the threshold are: a place's name, introduced after the place has already been felt; an editorial place-line, which becomes the threshold's framing copy in the canonical arrival; and one fragment under twelve words, observational, no species or place naming, no conservation register. Three pieces. Everything else fails the surface-compatibility matrix.

The cinematic surface accommodates almost nothing because almost nothing survives the constraints already imposed by doctrine on motion, light, atmosphere, sound, and pacing.

## Why the research surface accommodates almost everything

A second-language account of the same arrangement: the research surface is where the material that could not enter cinematic space is recorded with full attribution. The conventional article is the simplest form that handles a sourced ecological observation without distortion. Adding to it costs nothing perceptual, because the research surface is not perceptual — it is referential. A bibliography, a metadata block, a per-source DOI link, a coding journal's `[?]` ambiguity flag: each lands on the research surface without consequence to any other system.

The asymmetry follows directly. One surface refuses; the other holds.

## What failures produced the split

The split was not designed in advance. It was reached by repeated failure of attempts at symmetry.

The pre-doctrine prototype era — the homepage's first two months — carried every fingerprint of generic 2020s product UI: a layer-toggle bar in the segmented-control register, a frosted-glass species card with a green status pill, a cursor-following tooltip, a loading screen in the SaaS-onboarding register, a brand-accent green inherited from Tailwind's `green-400`. The 2026-05-24 homepage audit (`task-homepage-audit/2026-05-24-homepage-review.md`) named eleven such surfaces with file:line citations and the doctrine each conflicted with. The audit's framing was that the homepage was a dashboard with a globe inside it; the cinematic register and the dashboard register cannot share a frame.

The audit closed with a minimum-viable change set across `index.html`, `src/style.css`, `src/main.js`, `src/globe.js`, and `src/floating-cards.js` — about eighty lines. The four PRs that followed (#35 through #37) did not redesign anything; they removed. Layer toggles, tooltip, cursor pointer, hover flash, ring halos, floating-card glassmorphism, brand accent, drag-to-rotate inertia, column-as-bar-chart, ten of eleven hotspots, the screen-projected card system. After the reductions, the homepage carried one anchored line of editorial type and one canonical hotspot.

The repair is not the record. The record is that the perceptual identity emerged only after every symmetric option had been demonstrated to fail.

## Family C and the contradiction made visible

The legacy `species/*.html` directory was the last symmetric attempt to survive. Each file was a parallel encyclopedia surface in product-site grammar — breadcrumbs, JSON-LD structured data, brand chrome. The pages were never on the cinematic surface; their failure was that they coexisted with it.

Until the publication-readiness audit, a JS-enabled visitor at the homepage entered the canonical descent into `places/sundarbans.html`; a no-JS visitor was dropped into `species/tiger.html` through the `noscript` fallback. Same destination word, two different registers. The page-caption's `href` shared the same encyclopedia destination. The contradiction was not editorial taste. It was structural: the platform had two competing answers to the question of where this name leads.

PR #60 resolved the contradiction by exclusion. The `speciesPages` collection was removed from `vite.config.js` build inputs; Family C remains on disk as historical record but does not bundle, does not route, does not appear in `dist/`. The `noscript` fallback was rewritten in research register and repointed to `notes/sundarbans-bengal-tiger-saline-swimmer.html` — the canonical research narrative for the same record. The page-caption's `href` was repointed identically. After the change, the JS-enabled path leads into cinema; the no-JS path leads into research. Neither lands in encyclopedia register from the homepage.

Family C was the precise demonstration that the surfaces cannot share a fallback. A fallback is a single answer to a question; the platform required two answers, and the answer depended on the surface, not on the visitor's environment.

## The bridge is not a UI element

The architecture's §6 names the bridge between cinematic and research as asymmetric: research → cinematic via threshold reuse, cinematic → research via URL convention only. The cinematic surface has no in-page affordance for leaving toward research. The visitor exits the way they exit any web page.

The reason is operational. A bridge component would have to render in both registers. A *back to research* button on the cinematic surface re-introduces dashboard chrome and breaks Article XV, which prohibits acknowledgement in cinematic space. More consequentially, it breaks Article III's Crossing — the cut to the destination that fires at peak luminance dip. The cut depends on no surviving UI; if a back-button is on screen, there is a clear frame on either side of the navigation. The seam shows. The Descent ends as a page-switch.

A *view in cinema* button on the research surface forces the research register to carry cinematic invitation copy. The research surface ceases to be referential and becomes promotional. Canon XII prohibits this directly.

The bridge therefore became two things that are not controls: an editorial gesture and a URL convention. The editorial gesture is the page-caption on the homepage — one anchored line, no chrome, no hover plate, navigable by click but indistinguishable from text — which dispatches the four-phase canonical arrival and navigates at peak darkness via `window.location.assign`. The URL convention is `notes/<id>.html`: each cinematic record has a research counterpart at a predictable path; the visitor who knows the convention can type it; the visitor who follows links can find it through the archive index. Neither path requires any element on either surface to know about the other at runtime.

The cinematic and research bundles import the same schema and import nothing else from each other. The build output enforces this: `dist/places/sundarbans.html` and `dist/notes/sundarbans-bengal-tiger-saline-swimmer.html` exist as siblings; neither references the other.

## What the asymmetry costs and preserves

The asymmetry preserves the cinematic identity by precluding negotiation. It costs the platform anything that would have read as a unified product surface — no shared navigation, no shared header, no consistent affordance. The research archive index is plain. The cinematic place arrives without preamble. The split is not concealed; it is the architecture.

The remainder of the book follows from this. Parts II, III, and IV record what survives the threshold: the camera doctrine, the editorial register, the temporal grammar that govern the cinematic surface in detail. Parts V and VI record the architecture that carries the split — the three surfaces, the bridge, the narrative pipeline — and the schema that makes one source of truth produce two disjoint pages. The remaining Parts record the prototypes, audits, and reversals through which the asymmetry was reached.

The single source of place truth holds. The two surfaces do not converge. The bridge is not a UI element.
