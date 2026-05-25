# Platform Architecture

**Status:** canonical, operational
**Authority:** binding on all routing, layout, runtime, and deployment decisions
**Companion document:** `cinematic-principles.md` (governs the inside of the cinematic surface)

This document defines the only three surfaces the platform is allowed to have, what each contains, and how a user moves between them. Its purpose is to prevent the cinematic surface from being eroded into a dashboard, and to prevent the research surface from being denied its conventional reading affordances. Both losses kill the project.

---

## 1. The Three Surfaces

1. **Cinematic ecology surface.** Thresholds, descents, inhabited places. Atmosphere is the layout. No chrome, no dashboards. Governed by `cinematic-principles.md`.
2. **Research / archive surface.** Articles, citations, methodology, taxonomic references, datasets, attribution, indices. Conventional reading interface. Library grammar.
3. **Bridge layer.** The asymmetric, restrained passage between the two. *Not a UI element.* See §6.

There are no other surfaces. There is no fourth thing.

---

## 2. What Belongs Inside Cinematic Space

- Threshold (framing question, perspective lenses, withheld lenses)
- Descent timelines (M1–M5)
- Inhabited place (atmosphere, parallax, ambient continuance)
- Place-specific procedural geometry and procedural audio
- One editorial fragment per place, attention-revealed (see "scene inscription" pattern)
- Editorial framing copy (italic, fragmentary, observational, no full propositions)

Nothing else.

---

## 3. What Must Stay Outside Cinematic Space

- Citations, footnotes, sources
- Methodology notes, dataset references, sampling parameters
- Taxonomic identifiers (binomial names, IUCN codes, family/genus)
- Geographic identifiers (latitude/longitude, country, protected-area code)
- Population statistics, conservation status, area figures, date ranges
- Comparison tables, cross-references, "see also"
- Tags, categories, breadcrumbs, faceting
- Search inputs, filters, sort controls
- Lists of any kind, including species lists
- Definitions of terms, glossaries
- Login, accounts, profiles, settings, preferences
- Site navigation chrome (header, footer, menu, logo-as-home)
- Tooltips, modals, popovers, drawers, sidebars, panels
- Toasts, notifications, system messages
- Share/social affordances
- Cookie banners, consent prompts, support widgets, chat, ads
- Versioning, changelogs, "last updated"
- Analytics-visible events that change the visual register
- A/B test branches
- Personalization ("places you've visited," "recommended")

If a piece of content is not explicitly in §2, it is in §3.

---

## 4. What Belongs in Research / Archive Space

- Article-shaped pages: headings, paragraphs, figures, footnotes
- Citation lists in academic format with persistent identifiers
- Source attribution (camera traps, field surveys, satellite imagery, peer-reviewed papers, government datasets)
- Methodology and dataset documentation
- Taxonomic and geographic identifiers
- Comparison tables where editorially appropriate
- Cross-references to other articles, other places
- Indices: by place, by ecological type, by threat, by date
- Bibliography, contributor list, versioning, changelog
- Standard reading affordances: search, filter, sort, table of contents, in-page anchors
- Conventional site navigation (header, footer, menu)

The research surface is allowed to look like a journal, an atlas, or a magazine. It is *not* required to be cinematic. It must be *legible.*

---

## 5. Information Compatibility With Cinematic Grammar

| Information type | Cinematic-compatible | Goes in research |
|---|---|---|
| One observational fragment per place | Yes (sparingly, attention-revealed) | Yes |
| Place name | Only after sustained inhabitation, never as a label | Yes (as identifier) |
| Editorial framing question | Yes (one per threshold) | Yes (as article copy) |
| Species name | **No** | Yes |
| Taxonomic identifier | **No** | Yes |
| Population number | **No** | Yes |
| Date, year, time-range | **No** | Yes |
| Conservation status | **No** | Yes |
| Citation | **No, ever** | Yes |
| Methodology | **No** | Yes |
| Comparison | **No** | Yes |
| List of anything | **No** | Yes |
| Image with caption | **No** | Yes |

The general rule: any content that uses the grammar of *naming, counting, comparing, sourcing, or listing* is incompatible with cinematic space. Such content lives in research space without exception.

---

## 6. The Bridge Layer

**The bridge is not a UI element.** It is a navigational and editorial discipline.

### From research to cinematic

A research article about a place may end with a single editorial line that, when chosen, becomes a *threshold.* The threshold's grammar then engages exactly as if the user had arrived at the cinematic surface directly. This is the only in-page affordance that crosses surfaces, and it crosses in only this direction.

The line is editorial, not a CTA. It is one sentence, italic, in the project's voice. It is not a button labeled "Enter the place" or "View in immersive mode." It is something the user reads and may follow.

### From cinematic to research

**There is no in-page bridge.** The cinematic surface has no exit affordance, no "back," no "sources," no "field notes" link. To leave, the user navigates the way they leave any web page: closing the tab, using the browser back button, or typing another URL.

The research surface is reachable via:

- A predictable URL convention (e.g., the cinematic place at `/place/<name>` has its corresponding research at `/notes/<name>` or `/research/<name>`). The convention is documented in the footer of research pages, *never* announced inside cinematic space.
- The standard site index, search, and bibliography of the research surface itself.
- External links from outside the project (citations elsewhere, search engines, direct URL).

This asymmetry is intentional. Research is something one *enters.* Cinematic space is somewhere one *is.* You leave a place by leaving.

### What the bridge never does

- Live inside cinematic space (no overlay, portal, or on-page link)
- Live as a persistent UI element on either side
- Synchronize state between surfaces (no "currently inhabiting" indicator)
- Offer previews or peeks of the other side
- Carry analytics events that make either surface aware of the other
- Allow toggling — these are not the same content rendered differently

---

## 7. Operational Requirements

These are minimum platform constraints. Implementations may add more discipline; they may not relax these.

- **Separate URL spaces.** Cinematic places and research articles live under distinct route groups. The two never share a URL prefix.
- **Separate runtime modules.** The cinematic engine (atmosphere, descents, parallax, scene inscriptions) and the research reader (typography, navigation, search) load on disjoint pages. Zero shared JavaScript at runtime. A research page must not load the cinematic engine; a cinematic page must not load research-page chrome.
- **Separate page templates.** A research page is built from research components only. A cinematic page is built from atmosphere components only. There is no shared layout shell that wraps both.
- **Shared design tokens are permitted, not required.** Typography choices, color palette primitives, and base typographic spacing may be common. Interaction primitives (buttons, inputs, menus, lists) belong to research only.
- **Bridge is implemented as URL convention + threshold reuse.** No bridge component, no bridge module, no bridge service.
- **No global navigation chrome wraps cinematic pages.** A site header that appears on the research surface does not appear on the cinematic surface, ever.
- **Single source of place truth.** Each ecological place exists once in the data model. The cinematic surface and research surface read from the same place record but render disjoint subsets of it. Atmospheric scene parameters are cinematic-only fields; citations are research-only fields; place name and short editorial line may be shared.

---

## 8. Architectural Never-Rules

Each of these would be a step toward dashboard/archive sludge. None is recoverable from once started.

- No "immersive mode" toggle of any kind. Cinematic and research are not the same content rendered differently.
- No live data feeds piped into cinematic space (no realtime population counts, no streaming weather, no event tickers, no time-elapsed counters).
- No analytics events that change the visual register of cinematic surfaces.
- No third-party scripts inside cinematic surfaces — chat, support, ads, marketing, embeds, social widgets, consent banners, surveys.
- No A/B test variants of cinematic surfaces. The descent is not optimized for engagement.
- No personalization of cinematic surfaces ("places you've visited," "recommended for you," "continue from last time"). Each entry is fresh.
- No share/social affordances inside cinematic space.
- No bridge UI component. If a `<Bridge>` or `bridgeService` ever appears in the codebase, the architecture has failed.
- No hybrid pages where cinematic atmosphere and research articles share a layout. There is no "place page with both an immersive scene and an article below it." That page is two pages joined by a URL convention.
- No "annotation system" that scales the scene-inscription pattern into a CMS. One inscription per place, hand-written, lives inside cinematic. Everything else is in research.
- No "place explorer" component that visualizes a list of places cinematically. Lists belong to research.
- No exit affordance from cinematic to research inside the cinematic surface itself.

---

## 9. Final Authority

These three surfaces, and only these three, exist. The cinematic principles canon governs the inside of surface 1. Conventional web governance covers surface 2. This document governs the boundary between them.

When a feature proposal or design change is unclear about which surface it belongs to, the answer is almost always research, and the burden is on the proposer to demonstrate cinematic compatibility against §5.

When in doubt, withhold from cinematic. The research surface accommodates everything; the cinematic surface accommodates almost nothing. That asymmetry is the architecture.
