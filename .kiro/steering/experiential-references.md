---
inclusion: always
---

# Experiential References

> The works this project would point to if asked *what is this trying to feel
> like?* This document names the perceptual intuitions that the Articles
> (cinematic), Canons (editorial), and Principles (pacing) encode. When a
> rule in the other three documents seems arbitrary, the answer is here:
> the rule exists because a specific work, in a specific medium, taught the
> project that this is how the experience of a species in habitat is meant
> to register.
>
> **Status:** provisional. The reference set is expected to be refined as
> the project meets its first audiences. The synthesis sections (§3) are
> intended to be stable; the reference list (§2) is editable as we learn
> which works actually held up under review.

## 0. What this document governs

This document governs *intuition*, not output. It names the works the
project draws from and, equally importantly, the works it does not. It
binds the *imaginary* of the project: the felt sense a contributor or
reviewer should be able to recover when a UI/UX decision feels right or
wrong but they cannot name the rule.

It does not contain hex values, easing curves, copy text, or millisecond
budgets. Those live in the other three documents. This document is the
source of why those numbers and rules feel correct.

When this document and the other three come into tension, the priority is
unchanged:

1. Editorial voice
2. Pacing principles
3. Cinematic vocabulary
4. Experiential references (this document) — only as the source of
   intuition for amendments to 1–3.

A reviewer cannot reject a PR by citing only this document. They can use
it to argue for an amendment to one of the others.

## 1. The ten experiential qualities

The qualities the project is trying to produce, defined in perceptual
terms. Each is paired with one observable consequence so the quality is
testable in a review walk-through, not abstract.

| Quality | Definition (perceptual) | Observable consequence |
|---|---|---|
| **Ecological immersion** | Being inside a biome's optical and sonic register, not viewing it from outside through chrome. | The frame that holds the species has no UI inside its rectangle. Photographs are not backgrounds for paragraphs. |
| **Slowness** | Duration that exceeds the threshold at which a viewer starts expecting a payoff. | A held shot lasts long enough that the viewer notices their own breath, not the system's responsiveness. |
| **Environmental presence** | The sensation that the place exists whether or not the viewer is watching. | Ambient motion (drift, particles, atmosphere) continues across beats and never resets to greet the viewer. |
| **Emotional gravity** | Affect produced by composition and duration, not by adjectives, music swells, or interface celebration. | Removing all copy from a beat leaves the emotional intent legible. The frame carries it. |
| **Spatial humility** | The viewer is small in the frame; the interface does not centre them. | The species and the place occupy the largest area of every composition. Cards never overlap a silhouette. |
| **Cinematic pacing** | A rhythm of beats and holds, not transitions and jumps. | Two adjacent beats are separated by a moment in which nothing changes on screen. |
| **Embodied exploration** | Movement *through* space (drag, descent, arrival), not navigation through a list of links. | The primary way to reach a species is to touch the globe, not to read its name from a menu. |
| **Ecological memory** | Traces of where the viewer has been accumulate as quiet marks, not as scoreboards. | A visited hotspot carries a held luminance; nothing tallies, nothing congratulates. |
| **Non-extractive interaction** | Species, places, and viewer attention are not converted into resources, leaderboards, recommendations, or engagement metrics. | No "you might also like." No "popular this week." No completion bar. |
| **Contemplative interaction** | The interface protects pauses the viewer did not ask for. | First arrival into a safari scene holds on the place before any text. The hold is non-skippable. |

## 2. References

Each reference is given in four lines:

- **Relevant**: the specific perceptual property the project is borrowing.
- **Adapt**: the concrete carry-over to UI/UX decisions in *this* project.
- **Do not copy**: the failure mode if the work is imported uncritically.
- **Quality**: which of the ten qualities (§1) this reference informs.

### 2.1 Nature documentaries

**Planet Earth II — "Cities" leopard sequence (BBC, 2016)**
- *Relevant*: Several minutes of a leopard moving through Mumbai at night, lit only by sodium streetlamps, with no narration. The composition does the work; the narrator is silent.
- *Adapt*: Beats inside the safari scene where the species is shown in habitat carry no explanatory copy in their first hold. Place precedes claim.
- *Do not copy*: The flagship-narration moments where Attenborough declares conclusion at the climax. Our narrator does not declare emotion; the frame produces it (Canon I).
- *Quality*: ecological immersion, environmental presence, contemplative interaction.

**My Octopus Teacher (Pippa Ehrlich & James Reed, 2020)**
- *Relevant*: The relationship is built across many short visits to a single subject, not in one heroic encounter. Familiarity accumulates as a perceptual fact, not as a narrative claim.
- *Adapt*: Repeat visits to the same species in a session feel familiar (Principle XI: warm Descent), but nothing in the UI announces "welcome back" or tracks count.
- *Do not copy*: The first-person voice-over framing the relationship. Our narrator is third-person (Canon I); the relationship is established through repeat composition, not through a confessional.
- *Quality*: ecological memory, slowness, contemplative interaction.

**Encounters at the End of the World (Werner Herzog, 2007)**
- *Relevant*: Long static shots of Antarctic ice and water with the camera held on places that resist human meaning. The film does not explain why the shot is long; it is long because the place is.
- *Adapt*: The first hold of any safari scene, and the held darkness around photographs, are sized to the place, not to the user's patience.
- *Do not copy*: Herzog's diaristic philosophical voice-over. Our voice is documentary, not authorial confession (Canon I).
- *Quality*: slowness, environmental presence, spatial humility.

### 2.2 Films (cinema)

**The Tree of Life (Terrence Malick, 2011) — the cosmological prologue**
- *Relevant*: Whispered voice-over barely above the threshold of audibility, natural light shot at golden hour, the camera lifted close to grass and water. The image is allowed to be inarticulate; clarity is not always the goal.
- *Adapt*: Hero typography sits *near* the photograph rather than over it; light and palette take precedence over legibility-at-a-glance for the opening hold of a species page.
- *Do not copy*: The mannerist voice-over that names cosmic feelings. Our copy does not name the emotion the frame is producing (Canon I).
- *Quality*: emotional gravity, ecological immersion, spatial humility.

**Cemetery of Splendour (Apichatpong Weerasethakul, 2015) — the jungle dusk scenes**
- *Relevant*: The forest is an actor with its own duration. The camera does not move; the world moves through frame, slowly, with insect sound at field-recording density.
- *Adapt*: The safari scene's hero parallax holds long enough for the viewer to register sound and depth before any reading is required. Particle and atmospheric drift continue at their own pace, not the user's.
- *Do not copy*: The dream-logic narrative drift. Our editorial voice is grounded and citation-bound (Canon VII).
- *Quality*: environmental presence, slowness, emotional gravity.

**Stalker (Andrei Tarkovsky, 1979) — the Zone**
- *Relevant*: Walking is the dominant interaction. Distance is felt as duration. The camera leads the body through space rather than cutting between locations.
- *Adapt*: The Descent (Article III) is a composed traversal, not a transition. The viewer feels they are travelling somewhere, not opening a panel.
- *Do not copy*: The metaphysical and authorial weight. We do not ask the viewer to interpret; we ask the viewer to attend.
- *Quality*: embodied exploration, slowness, cinematic pacing.

**Nostalgia for the Light (Patricio Guzmán, 2010)**
- *Relevant*: Landscape (the Atacama) is treated as memory storage. The film moves between astronomical telescopes and the desert's archaeological strata as a single subject. Place is a record of what has happened.
- *Adapt*: The "data sources" beat at the end of a species page is part of the place, not a footer. Citation architecture (Canon VII) is the project's equivalent of the Atacama's preserving aridity.
- *Do not copy*: The personal-essay first person. Our voice is third-person (Canon I), but it inherits the same posture: place remembers.
- *Quality*: ecological memory, environmental presence, non-extractive interaction.

### 2.3 Games

**Journey (thatgamecompany, 2012)**
- *Relevant*: Wordless emotional arc carried by colour temperature, scale, and weather. The interface is the body of the player avatar in landscape; nothing is named on screen.
- *Adapt*: The planetary frame's affordances are diegetic — the globe is touched, the cards float in the same space — rather than UI-chrome around a content area.
- *Do not copy*: The collected-symbol progression and the multiplayer surprise. Our experience is single-viewer, and progression is forbidden (Canon XIV, Principle XX).
- *Quality*: embodied exploration, spatial humility, emotional gravity.

**Outer Wilds (Mobius Digital, 2019)**
- *Relevant*: Discovery is the only mechanic. There are no quests, no checklists, no XP. The player learns the solar system by being in it. Knowing the world *is* the progression.
- *Adapt*: The species set is a constellation, not a checklist. There is no "see all 10 species" affordance; the viewer reads what they read.
- *Do not copy*: The puzzle-box reward structure. We are not solving anything; we are attending.
- *Quality*: non-extractive interaction, ecological memory, contemplative interaction.

**Red Dead Redemption 2 (Rockstar, 2018) — wildlife observation, not hunting**
- *Relevant*: Animals exist on their own schedules in the simulation. Most encounters do not yield reward. The patient player learns where to be at dawn.
- *Adapt*: Globe ambient state — rotation inertia, particle drift, hotspot luminance — is governed by the world's clock, not the viewer's hover. Nothing rewards looking; looking is its own reason.
- *Do not copy*: The hunt and skin systems, and the entire reticle/HUD register. Our globe has no reticle, no targeting feedback, no inventory.
- *Quality*: environmental presence, non-extractive interaction, spatial humility.

### 2.4 Interactive documentary and web essays

**Bear 71 (NFB, 2012)**
- *Relevant*: A bear's life narrated through the surveillance grid that records it. The project critiques the very act of representing wildlife through technology while doing it. Self-aware, not self-congratulatory.
- *Adapt*: The project's own apparatus — the data pipeline, the TMDB filter, the COM-B framing — is named in the Colophon (Canon XXI), not hidden, and not celebrated.
- *Do not copy*: The grid map UI itself. A surveillance grid is the wrong visual register for our project, even as critique.
- *Quality*: non-extractive interaction, ecological memory.

**Snow Fall (John Branch, NYT, 2012) — without its successors**
- *Relevant*: Long-form scrollytelling in which images and text take turns, neither subordinating the other. The pacing is the page; there is no sidebar.
- *Adapt*: Safari scene cadence (Principle VIII): one revelation per beat, reading-time as scroll governor.
- *Do not copy*: The decade of imitators that followed, in which the parallax became the point and the journalism became filler. Parallax serves a beat or it does not appear.
- *Quality*: cinematic pacing, slowness.

**Forensic Architecture investigations (e.g., "The Killing of Mark Duggan", 2020)**
- *Relevant*: Methodology is part of the artifact, not appendix. The viewer sees how the claim was built. Sources are inline and linked.
- *Adapt*: Every COM-B claim, threat sentence, and statistic carries its source where it is read (Canon VII), not collected at the bottom.
- *Do not copy*: The investigative urgency and the criminal-procedure register. Our subject is conservation in long time, not adjudication.
- *Quality*: non-extractive interaction, ecological memory.

### 2.5 Museums and installations

**Olafur Eliasson — *The Weather Project* (Tate Modern Turbine Hall, 2003)**
- *Relevant*: A single luminous body fills a vast room. Visitors lie on the floor and watch. The work makes no demand and is in no hurry.
- *Adapt*: The globe is the largest body in the experience and is composed to be looked at, not interacted with first (Article XI). The landing frame holds the body before any affordance is offered.
- *Do not copy*: The single-spectacle Instagrammability. Our globe is not a photo opportunity; it is a working subject.
- *Quality*: spatial humility, contemplative interaction, emotional gravity.

**James Turrell — Skyspaces / *Aten Reign* (Guggenheim, 2013)**
- *Relevant*: Light is the durational subject. The viewer's eye adapts over minutes. The work is in the time it takes the iris to widen.
- *Adapt*: Bloom, atmospheric tinting, and biome palette transitions (Articles V, VII) are calibrated to be felt over duration, not perceived as effects.
- *Do not copy*: The architectural commitment and the meditative singularity. Our project carries content; it cannot afford to ask the viewer to sit empty for ten minutes before anything happens.
- *Quality*: slowness, environmental presence.

**Wildlife Photographer of the Year exhibition (Natural History Museum, London — annual)**
- *Relevant*: Dim rooms, large prints, single-line captions in small type. The photograph claims the wall; the caption holds beneath it.
- *Adapt*: Photograph layout in the safari scene (Article IX): the image is the subject; the caption is small, sourced, and below.
- *Do not copy*: The award-and-runners-up framing. Our photographs are not in competition (Canon V on number-as-display).
- *Quality*: spatial humility, ecological immersion, non-extractive interaction.

**Maya Lin — *What Is Missing?* (ongoing memorial, 2009–)**
- *Relevant*: A memorial form for ecological loss. Sound recordings, sites, and timelines arranged with the gravity of a war memorial, not the cleverness of a data visualization.
- *Adapt*: Threat copy carries the register of memorial, not severity-tag. The threat sentence (Canon XI) is the project's equivalent of a name on a wall.
- *Do not copy*: The branded "What is Missing?" identity layer. Our project does not wrap itself in a movement title.
- *Quality*: emotional gravity, ecological memory, non-extractive interaction.

### 2.6 Photography

**Sebastião Salgado — *Genesis* (2013)**
- *Relevant*: Black-and-white at planetary scale, with patient compositions of habitats untouched or barely touched. Dignity is a formal property of the frame.
- *Adapt*: Photograph selection prefers compositions in which the species occupies its place on its own terms. Close-up "portrait" framing without context is avoided.
- *Do not copy*: The black-and-white treatment as a project-wide identity. Our biome palettes (Article VII) are colour and editorial; monochrome is not a default.
- *Quality*: ecological immersion, spatial humility, emotional gravity.

**Nick Brandt — *Inherit the Dust* (2016) and *On This Earth* series**
- *Relevant*: Twilight palettes, monumental composition, animals shown with the weight of monuments. The work is unsentimental about decline.
- *Adapt*: Twilight is a permitted lighting register for safari heroes. Composition can carry monumentality without becoming heroic-poster style.
- *Do not copy*: The literal life-size print installations and the memento-mori sentimentality at full strength. Our project doesn't pose loss; it states it (Canon XI).
- *Quality*: emotional gravity, environmental presence.

**Hiroshi Sugimoto — *Seascapes* (1980–)**
- *Relevant*: Long exposures of ocean horizon. Each photograph is the same composition; the differences between them are the entire content. Looking is taught.
- *Adapt*: The first hold of a safari hero (Principle III) is a moment in which the viewer is given enough time to register what is the same and what is different about this place.
- *Do not copy*: The minimalism-as-genre register. Our images are not exercises in reduction; they are working photographs of habitat.
- *Quality*: slowness, environmental presence.

### 2.7 Ecological art

**Agnes Denes — *Wheatfield – A Confrontation* (1982, Battery Park Landfill)**
- *Relevant*: A wheatfield planted on the landfill that became Battery Park City. The work is the act of putting an ecological body where a financial body was about to stand.
- *Adapt*: The project privileges the species and place over the apparatus; the apparatus (data pipeline, code, framework) is acknowledged in Colophon (Canon XXI), never centred.
- *Do not copy*: The polemical singularity of the gesture. Our project is many quiet beats, not one symbolic act.
- *Quality*: non-extractive interaction, spatial humility.

**Joseph Beuys — *7000 Oaks* (Documenta 7, 1982 – ongoing)**
- *Relevant*: A work whose form is durational planting across a city, completed after the artist's death. The artwork is time itself.
- *Adapt*: The project assumes ecological time horizons. Copy speaks in present tense for the place (Canon II) and present perfect for what has happened to it; the viewer is not asked to wait, but the project is honest that the species exists in long time.
- *Do not copy*: The cult of the artist signing the durational work. Our project has no auteur surface.
- *Quality*: ecological memory, slowness.

**Robert Macfarlane & Jackie Morris — *The Lost Words* (2017)**
- *Relevant*: A book made in response to the removal of nature words from a children's dictionary. Vocabulary is treated as an ecological asset; loss of language is loss of habitat.
- *Adapt*: Editorial voice (Canons IV, X) names species, places, and traditions specifically rather than generically. Vague language is treated as a refusal to attend.
- *Do not copy*: The illustrated children's-book aesthetic at face value. Our visual register is documentary, not illuminated.
- *Quality*: ecological memory, non-extractive interaction.

### 2.8 Sound and spatial audio

**Chris Watson — *Stepping into the Dark* (1996) and BBC nature recording career**
- *Relevant*: Recordings made by leaving a microphone in a place for hours and listening for what the place is, rather than for an animal performance. The biome speaks; the recordist does not narrate.
- *Adapt*: When sound is implemented (Article XVI), it is biome bed first, not interface effect. There are no clicks, hovers, or arrival chimes.
- *Do not copy*: The radio-feature framing of recordings as standalone "tracks." Our sound is environmental and background to reading, not a curated playlist.
- *Quality*: ecological immersion, environmental presence.

**Bernie Krause — *The Great Animal Orchestra* (concept and album, 2012)**
- *Relevant*: The biophony / geophony / anthropophony framing: a healthy biome has a frequency-spectrum signature, and species occupy non-overlapping niches in the soundscape.
- *Adapt*: When ambient layers are introduced, they are organised by depth and frequency, not loudness. Different beats in the safari scene have different sonic registers.
- *Do not copy*: The lecture register. We do not teach the framework on screen; we use it as a structuring principle.
- *Quality*: ecological immersion, environmental presence.

**Jana Winderen — *The Noisiest Guys on the Planet* (2009) and underwater field recording**
- *Relevant*: Recordings made beneath ice and water at frequencies usually inaudible. The work admits the limits of human perception and listens past them.
- *Adapt*: The project is honest about what cannot be perceived directly (deep ocean, microhabitat, scale). Copy and composition do not pretend to give first-person access where there is none.
- *Do not copy*: The album-form release. Our sound, when present, is environment, not artifact.
- *Quality*: spatial humility, environmental presence.

### 2.9 Map experiences

**Native Land Digital — *native-land.ca***
- *Relevant*: A map whose primary act is to show that the named territory has names other than the official one. Maps are not neutral; cartography is editorial.
- *Adapt*: Our globe carries hotspots that are not flag-pin locations on an administrative basemap. Place is named in editorial form (Canon X) and in the species' own terms.
- *Do not copy*: The activist surface and the layered modal disclaimers. Our globe does not lecture; it shows.
- *Quality*: non-extractive interaction, ecological memory.

**Stamen Design — *Watercolor* tile set (2012)**
- *Relevant*: A map whose styling is a painting. It is impractical for navigation and excellent for atmosphere. It demonstrates that cartographic chrome is a choice, not a default.
- *Adapt*: The globe's surface is treated as a photograph (NASA Blue Marble), not a basemap with grid, graticule, or label clutter. No country borders by default; no place labels except for the species hotspots.
- *Do not copy*: The literal watercolor texture; that is a different project's identity.
- *Quality*: ecological immersion, spatial humility.

**eBird abundance maps (Cornell Lab of Ornithology)**
- *Relevant*: Conservation data rendered as a slow seasonal flow of presence across a continent. The map is a fact, not a dashboard. It rewards looking at it for a minute.
- *Adapt*: Range and threat layers (Article XII) are editorial states of the globe, not analytical filters. Their visual treatment is restrained, with no legend grid.
- *Do not copy*: The scientific-tool surface around the maps (controls, axes, ticks). Our globe has none of those.
- *Quality*: environmental presence, contemplative interaction, non-extractive interaction.

### 2.10 Immersive digital environments

**The Long Now Foundation — *The Clock of the Long Now* (project) and longnow.org**
- *Relevant*: An institution organised around resisting short-termism. The web surface carries the institution's pace: long-form essays, dated talks, no engagement loops.
- *Adapt*: The project's metadata, share copy, and crawler-addressed surfaces (Canon XX) speak in the same register as the on-screen experience. There is no marketing register at the edges.
- *Do not copy*: The institutional brand identity and the explicit "long-term thinking" framing in copy. Our project doesn't have to announce its tempo; it simply runs at it.
- *Quality*: slowness, non-extractive interaction.

**The NFB Interactive catalogue (e.g. *Highrise*, 2010–2015)**
- *Relevant*: Documentary-grade content in web form, with editorial gravitas treated as the default rather than the exception. The web is treated as a place to publish a film, not a place to perform a brand.
- *Adapt*: The project is published, not launched. The species pages are publication artifacts (Canon XXI: no marketing surfaces).
- *Do not copy*: The Flash-era interaction patterns and the sometimes heavy authorial voice. Our voice is documentary, not authored.
- *Quality*: cinematic pacing, contemplative interaction.

**Are.na — channels by ecological thinkers**
- *Relevant*: A platform whose interface refuses recommendation, ranking, and engagement metrics. Content collects slowly; the design supports thinking over reacting.
- *Adapt*: The project never surfaces "popular," "trending," or "you might also like." The species set is a constellation (§1: ecological memory).
- *Do not copy*: The platform's open-collection register. Our project is curated and authored; it does not invite contribution by default.
- *Quality*: non-extractive interaction, ecological memory.

## 3. Synthesis

These five sections crystallise the references above into operational
guidance. They are intentionally short. When a contributor is unsure
which Article, Canon, or Principle applies, they should be able to read
this section in two minutes and recover the project's posture.

### 3.1 Core experiential identity

Species on Screen is **a documentary published on the web**, organised
around individual species in their habitats. Its closest cousins are the
natural-history feature film, the museum exhibition catalogue, and the
serious interactive documentary. Its most consistent failure mode is to
drift toward dashboard, data-explorer, or marketing-microsite. Every
review walk-through is a check against that drift.

The project does not perform expertise, it does not perform innovation,
and it does not perform conservation urgency. It reports on species and
their representation in screen media, with the gravity of a curator and
the patience of a documentarian.

### 3.2 Emotional atmosphere

The atmosphere is **attentive, unhurried, and slightly melancholic**.
Attentive because every beat presumes the viewer is looking at one thing
at a time. Unhurried because the project assumes the viewer chose to be
here. Slightly melancholic because the subjects are species in decline,
and the project does not pretend otherwise. Joy and wonder are permitted
as registers; they are produced by composition (a held photograph at
dusk, the curve of a coastline in the globe's terminator), never declared
in copy.

Closest analogues by emotional register: the prologue of *The Tree of
Life*; the dim rooms of the Wildlife Photographer of the Year
exhibition; the held silences in *Encounters at the End of the World*.
Distant from: documentary television's swelling scores; museum
education halls' bright didactic chrome; "good news for the planet"
campaigning.

### 3.3 Perceptual goals

The viewer should come away having experienced:

1. The **size of the planet** at the scale of a hand on a globe.
2. The **specificity of habitat** as light, palette, and depth, not as
   description.
3. The **species as subject** of every frame it appears in, never as a
   thumbnail.
4. **Sources as part of the place**, not as a footer they ignored.
5. Their **own rhythm** of attention, slowed by an interface that
   refused to hurry them.
6. A **light memory** of having visited one or two species closely,
   without a count or a list.

Any UI/UX decision that produces one of these against the others is in
voice. Any decision that scores well on engagement metrics but produces
none of these is out of voice and should be reverted.

### 3.4 Interaction philosophy

Interaction is **composed**, not feedback-driven. A click yields a beat,
not a state change. A scroll yields a paced reveal, not a reflow. A
hover acknowledges, never celebrates. The body of the globe and the body
of the safari scene are treated as places one moves through, not as
panels one toggles.

The project rejects the foundational metaphor of interactive software —
that the user issues commands and the system responds — and replaces it
with the metaphor of attending: the viewer is at a screening, in a
gallery, on a long walk through habitat. The interface holds the door
open and steps aside.

Concretely:

- The primary verb is **arriving** (at the planet, at a hotspot, at a
  habitat), not **clicking** or **selecting**.
- The primary affordance is the **globe**, not a navigation menu.
- The primary feedback is **composition**, not state-change animation.

### 3.5 Visual and spatial tone

Visually: **photographed, not designed**. Frame palettes are neutral and
quiet; biome palettes are colour and editorial. Type is documentary
serif/sans appropriate to publication, not interface system fonts. Cards
are diegetic objects suspended in the frame, not panels stacked over
content (Article X). Motion is slow, decelerating, and never in pursuit
of the viewer.

Spatially: **two registers, both real**. The globe is a body the viewer
can address from outside (planetary register); the safari scene is a
place the viewer has arrived inside (local register). The Descent
(Article III) is the only authorised passage between them, and it is
composed as a traversal, not a transition. There is no "modal" register;
nothing pops over content, because there is no content for things to
pop over — there is only the place currently being looked at.

## 4. Anti-references — what this project is not

Equally load-bearing as §2: the works the project would never point to.

- **Awwwards-style spectacle sites** (the rolling typography reels, the
  scroll-jacked WebGL portfolios, the kinetic homepage). These are
  performances of design competence; we are publishing on a subject.
- **Apple-style minimalism imitation** (centered hero with one product
  shot, one verb, one CTA). Our subject is not a product; centring is
  not our register; restraint is not minimalism.
- **Generic "cinematic UX" web language** (bloom, depth-of-field, slow
  scroll, parallax) used to dress up otherwise standard product
  layouts. Cinematic, here, refers to the four lawful camera behaviours
  (Articles I–IV), not to a stylistic finish.
- **Dashboard register** (KPI tiles, gauge charts, sparklines, donut
  charts, "by the numbers" sections). Already prohibited under Canons V
  and XII; named again here because the temptation is constant.
- **Gamification register** (collect-them-all, completion bars, badges,
  streaks, "you've explored X% of species"). Forbidden under Canon XIV
  and Principle XX.
- **Recommendation register** ("you might also like," "trending,"
  "popular this week"). Non-extractive interaction (§1) is violated by
  any of these.
- **teamLab-style infinite-spectacle installations** as a digital
  reference. Spectacle without subject is the failure mode of museum
  digital; we are after the opposite.
- **Activist-poster framing** of conservation (red urgency typography,
  countdown clocks, "before it's too late" copy). The threat sentence
  (Canon XI) carries the magnitude; the chrome does not raise its
  voice.
- **Educational-platform UI** (course progress, "lesson 3 of 7",
  quizzes, "what did you learn"). The project is a publication, not a
  curriculum.
- **Abstract philosophy disconnected from perception** ("we want users
  to feel the universe"). This document refuses such language; if a
  contribution can only justify itself in those terms, it is out of
  voice.

## 5. How to cite this document in review

This document is cited rarely and as the source of an Article, Canon,
or Principle. Typical uses:

- "This card layout violates Article IX (subject claims the frame).
  See §1: spatial humility — the viewer is small in the frame, the
  interface does not centre them."
- "This counter animation is forbidden under Canon V and Principle
  XVIII. Reference: Canon V is grounded in §2.6 (Wildlife Photographer
  of the Year — the caption holds beneath the photograph)."
- "Approved against §3.4: the layer toggle behaves as a beat
  (composition change), not as a feedback control."

A reviewer may also propose an amendment to one of the other three
documents by citing a reference here:

- "Article XV currently forbids screen-wide chromatic aberration
  outside the Descent. Per §2.2 (Cemetery of Splendour) and §2.5
  (Aten Reign), I propose a localised chromatic settle on the safari
  hero held shot. This is an amendment proposal, not a violation."

References (§2) are stable identifiers within this document. New
references may be added; existing ones are retired only with a note in
the introducing PR.
