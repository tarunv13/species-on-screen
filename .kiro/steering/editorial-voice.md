---
inclusion: always
---

# Editorial Voice

> Editorial law for Species on Screen.
> This document governs every word that appears in the experience —
> headings, body copy, captions, labels, error states, alt text, and the
> hidden text in metadata. PRs are evaluated against the Canons below.
> Reviewers cite them by name (e.g. "Canon V: Quantitative restraint")
> in feedback.
>
> **Status:** canonical doctrine. Canons are stable identifiers and are
> cited in PR review. The prohibited-word lists are editable through
> the standard amendment path as new editorial surfaces appear; the
> register does not.

## 0. What this document governs

This document governs language. It governs what the project *says* and
the register in which it says it. It binds:

- Hero copy and section copy in `index.html`.
- All renderers in `species-page.js` and `safari-scene.js` that emit
  copy from JSON (titles, threat sentences, COM-B claims, cultural
  cards, comic-strip captions, citation lines).
- All text content in species JSON files under `public/data/`.
- Every label on a UI surface (layer toggles, return affordance,
  tooltip text, breadcrumbs).
- Loading states, error states, empty states.
- `<title>`, meta descriptions, Open Graph copy, JSON-LD descriptions,
  and other text addressed to crawlers.
- Commit messages, PR titles, and review prose by humans and agents
  contributing to the project.

It does not govern visual treatment of text (that is `cinematic-vocabulary.md`)
or how long text is on screen (that is `pacing-principles.md`).

## 1. The narrator

### Canon I — The narrator is a documentarian, not a host

The voice of the project is a documentarian addressing a viewer who
has chosen to be there. It is not a host welcoming a user, not a guide
explaining a tool, not a marketer pitching a feature, not a teacher
correcting a student.

This narrator:

- Speaks in the third person about the world, never in the first
  person plural about the project ("we", "our team", "we built this"
  do not occur in the experience).
- Speaks in the second person sparingly and only when situating the
  viewer in space ("here, the canopy thins"), never to instruct
  ("click to learn more").
- Is unhurried. Sentences are allowed to breathe; paragraphs are
  allowed to be short.
- Is informed but never performs expertise. Latin names appear in
  italics where editorially correct, but specialist vocabulary is not
  used to signal authority.
- Does not address the viewer's emotion directly. The frame creates
  the emotion; the narrator does not declare it.

### Canon II — Tense and posture

Habitat description, behaviour, and presence are written in **simple
present tense**: *the tiger prowls*, *the dolphin moves through brown
water*, *the orangutan builds a nest at dusk*. This is the tense of
natural-history writing and of museum panel copy. It places the
species in continuous existence, not in a frozen photograph.

Decline, loss, and threat are written in **present perfect or simple
past where causal**: *the range has contracted*, *deforestation
removed 95% of the canopy in a century*. The grammar carries the
weight; the narrator does not editorialise.

Conservation programmes and active interventions are written in
**present continuous or present simple**: *Project Tiger is restoring
corridors*, *rangers patrol the buffer zones*. Active voice. Named
actors where the source supports it.

The narrator never uses future tense to make predictions. Citations
make predictions; the narrator reports them.

## 2. The species as subject

### Canon III — The species is the subject of every clause that can carry it

Sentences are constructed so that the species, the habitat, or a
named human actor (a researcher, a programme, a community) is the
grammatical subject. The interface, the data, the platform, and the
viewer are not subjects of editorial sentences.

In voice:
> *The hawksbill returns to the same stretch of beach for forty
> nesting seasons.*

Out of voice:
> *Our data shows the hawksbill returning to the same beach for
> forty nesting seasons.*
> *You can see that the hawksbill returns to the same beach...*
> *This page presents data on the hawksbill's nesting behaviour.*

Citations and source attributions live in their own architecture
(Canon VII) and do not invade narrative sentences.

### Canon IV — The species is named, not categorised

The first reference to a species in any beat uses its common name.
Subsequent references may use the common name or a respectful
descriptor (*the cat*, *the cetacean*, *the great ape*). The species
is not referred to as *this animal*, *this creature*, *the subject*,
*the entry*, or *the profile*.

The Latin binomial appears once per page, in italics, near the top of
the species' authoritative section, as a fact. It is not used for
typographic effect or as a header.

IUCN status is named in plain English (*Endangered*, *Critically
Endangered*, *Vulnerable*). The acronym IUCN appears once on first
mention with a brief gloss; the badge that displays the status uses
the plain word, not the acronym.

## 3. Quantitative restraint

### Canon V — Numbers are punctuation, not display

Statistics in this project are quiet. They land in the sentence
where they belong, with the source they came from. They are not
animated counters, not rotating "stat carousels", not centerpiece
typography.

Permitted forms:

- A single hero stat per species (the `hero_stat` field), set as a
  declarative phrase, not a number-plus-label split. Example: *95% of
  tiger habitat lost in 100 years*. Not: a giant `95%` over a small
  caption.
- An inline number inside a sentence, with units and an attached
  source. Example: *fewer than 4,500 remain in the wild [Source].*
- A small number set in a comic-strip panel as a single beat, with a
  short clause beneath it.

Forbidden:

- "By the numbers" sections that aggregate stats out of context. (The
  project has flirted with this. It is out of voice and is now
  prohibited under this Canon.)
- Counter animations on initial load. Counting up is permitted only
  inside a narrative beat where the counting *is* the narrative
  point. The default presentation of any number is its final value.
- Percentage bars, gauge charts, sparklines, donut charts, KPI tiles,
  or any other dashboard primitive used to render a single statistic.
  A statistic is a sentence; it is not a widget.
- Round numbers presented as more authoritative than the source
  supports. If the source says "approximately 4,500", the copy says
  *approximately 4,500* or *fewer than 5,000*, not *4,500*.

### Canon VI — Uncertainty is preserved

Conservation data is uncertain. Editorial voice preserves that
uncertainty rather than smoothing it away. Hedges are not weakness;
they are accuracy. Acceptable hedges include *approximately*,
*estimated*, *fewer than*, *between X and Y*, *as of [year]*. These
are signals of integrity, not editorial timidity.

Where the underlying data is contested, the copy says so in one
clause and cites both sides. It does not pick a side silently.

## 4. Sources and citations

### Canon VII — Citation is architecture, not footnote

This project takes its sources seriously enough that they are visible.
Citations are not asterisks at the bottom of the page. They are
inline, named, and linked.

The form, by surface:

- **In narrative sentences containing a contested fact, a number, or
  a recent finding**: a small linked source phrase at the end of the
  clause or sentence — *Karanth et al. (2016)*, *IUCN Red List
  (2024)*, *TRAFFIC (2020)*. Linked to a stable URL where one exists.
- **In COM-B claim cards**: every claim carries an attribution line
  with the same form, set quietly beneath the claim. A claim without
  a citation does not appear in the rendered page; the renderer must
  skip it.
- **In photograph captions**: credit and source, always. *Photographer
  / Institution* or *TMDB / TMDB poster path*. Photographs without
  attribution do not appear.
- **In data references**: a "Sources" beat at the end of the species
  page lists the structured `data_sources`, by section. This is a
  section, not a footer.

A statement that cannot be cited is either rephrased into a
description of the place that needs no citation (Canon II's natural-
history register) or is removed.

### Canon VIII — The TMDB pipeline obeys the same law

Cinema and documentary references sourced from TMDB are not
"recommendations" or "media we found." They are screen representations
that the project is reporting on. Their copy follows from this:

- A film card shows: title, year, director (where known), and one
  line of editorial framing connecting the film to the species or its
  context. Star ratings, audience scores, and "popularity" indicators
  are forbidden.
- Genre or relevance scores from the pipeline are not surfaced as
  numbers in the UI. They govern inclusion, not display.
- Where a film's framing of a species is problematic (anthropomorphic,
  fictionalised, exoticising), that is named in the editorial line,
  not hidden.

## 5. Cultural framing

### Canon IX — Paradox is preserved; resolution is not the project's job

Cultural significance copy holds tensions rather than resolving them.
The tiger is sacred and persecuted. The blue whale is mythic and
hunted to near-extinction. The orangutan is "the person of the
forest" in Malay and the mascot of palm-oil-funded zoos. These
contradictions are the substance of the cultural section, not its
inconvenience.

The `cultural_paradox` field on each species exists for this Canon.
Renderers must treat it as first-class content, not an optional
appendix.

### Canon X — Plurality of voice within a single subject

Where a species exists in multiple cultural traditions, the editorial
line names them by name. *In Hindu tradition, the tiger is the mount
of Durga. In Tungusic-speaking communities of the Russian Far East,
the Amur tiger is addressed as Amba.* Generic phrasing — *many
cultures*, *traditional beliefs* — is forbidden under this Canon as
both inaccurate and disrespectful.

Where the project lacks the depth to name the traditions specifically,
it omits the section rather than gesturing vaguely.

## 6. The threat sentence

### Canon XI — Threats are sentences, not bullet bars

A threat in this project takes the form of a short paragraph: a name,
a clause of mechanism, and a clause of magnitude or consequence.

In voice:
> **Habitat Loss.** Deforestation for agriculture, palm oil
> plantations, and urban expansion has reduced tiger habitat by over
> 95% in the last century.

Out of voice:
> **Habitat Loss** [████████████████░░] 95% / 100%

The threat sentence does not become a progress bar, a percentage
ring, a heatmap cell, or a severity icon. It does not need a
"Severity: High" tag. The sentence carries the magnitude.

Order of threats follows ecological causation where possible: the
upstream cause first, the proximate threat next, the climate context
last. This ordering is editorial work per species, not algorithmic.

## 7. Forbidden registers

### Canon XII — The dashboard register is forbidden

Words and phrases that signal data-dashboard register are out of voice
across all surfaces. The non-exhaustive prohibited list:

- *Dashboard, KPI, metric, indicator, score, ranking, leaderboard,
  performance, benchmark.*
- *User, end-user, audience member, visitor.* The viewer is the
  viewer, where they must be named at all.
- *Insights, takeaways, key facts, highlights, at-a-glance, snapshot.*
- *Click here, learn more, find out more, explore more, dive in,
  discover, unlock, swipe.* Buttons are named for what they do.
- *Powered by, built with, made possible by* — except in a single
  Colophon entry where engineering credits and library acknowledgements
  belong by professional courtesy.

### Canon XIII — The marketing register is forbidden

- *Stunning, breathtaking, immersive*¹, *next-generation, cutting-edge,
  revolutionary, world-class, journey, adventure*²*.* The frame
  produces these qualities; the copy does not announce them.
- Exclamation marks. The project does not exclaim.
- Slogans. The project does not have a tagline. The hero copy is a
  sentence about the world, not a sentence about the project.

¹ The word *immersive* may appear in design documentation,
including this file, to describe the project to its makers. It does
not appear in copy addressed to viewers.

² *Safari* is permitted as the technical name of a scene type
inside the experience and as a descriptor of the local-habitat beat;
it is not a marketing word. It is used in editorial copy only when
the descent is being narratively named.

### Canon XIV — The gamification register is forbidden

- *Earn, unlock, level up, complete, progress, achievement, badge,
  streak, points, score.* No element of the experience is a quest.
- Calls to "see all", "complete the collection", or "discover all
  species." The species set is a constellation, not a checklist.
- Onboarding tours, coachmarks, dotted-line annotations pointing at
  features. The interface is small enough to read as an image; it
  does not need to be taught.

## 8. Headlines, hero copy, and microcopy

### Canon XV — The hero says one thing about the world

The single line of copy that anchors the planetary frame is a
sentence about the planet, not a sentence about the project. Its
form: a short, declarative observation that places the viewer in
the editorial subject. It does not name the project, does not
include a verb addressed to the viewer, and does not contain a
proper noun unless the proper noun is the subject.

### Canon XVI — Section openers are observations

Each major beat (planetary, descent, habitat, threats, cultural,
cinema, COM-B, sources) opens with a one-sentence observation that
locates the beat in the world, not in the page architecture. Section
labels are nouns or short noun phrases (*Habitat*, *Cultural
Significance*, *On Screen*) and they sit beneath or beside the
observation, not above it as titling.

### Canon XVII — Microcopy is named, not generic

Every label on every interactive surface is named for the specific
action it performs in this project, not from a UI catalogue.

- The "back to globe" affordance is labelled with a phrase consonant
  with the cinematic Return — e.g. *Return to the planet* — not
  *Back* or *Close*.
- The layer toggle states are named — e.g. *Range*, *Habitat*,
  *Pressures* — not *Show / Hide* or *On / Off*.
- The first-load state of a species page, before content arrives, is
  a short composed sentence naming the place — not *Loading...*.
- The error state, where it must exist, is a sentence the documentary
  narrator could speak. *The connection to the species record was
  lost.* — not *Error 500* or *Oops! Something went wrong.*

The `species-page-loading` placeholder, the `globe-tooltip`, the
return button, the layer toggle bar, and any future affordance must
be named under this Canon. PR descriptions introducing new affordances
must include the proposed copy and its justification.

## 9. The COM-B register

### Canon XVIII — COM-B claims are sentences with sources

The COM-B framework (Capability, Opportunity, Motivation → Behaviour)
is the project's behavioural-conservation spine. Each claim card
contains:

1. A single sentence stating the claim, in the natural-history
   register (Canon II), without hedging away the underlying tension.
2. A source line beneath the claim, citing a real publication or
   institutional report (Canon VII).

A COM-B claim is not a bullet, not a tag, not a "challenge" framed
as a problem-statement. It is an observation about why the gap
between knowledge and action persists in this species' context.

The renderer must skip claims missing a source rather than display
them with a placeholder. The card grid displays the claims that
qualify under this Canon and does not pad to a fixed count.

## 10. Localisation posture

### Canon XIX — English is the voice; the interface is not the voice

The project is in English at present. When localised, the editorial
voice — register, tense, restraint, citation architecture — is what
must be preserved. The interface chrome (labels, buttons, tooltips)
adapts; the narrator's posture does not.

Place names, species names in local languages, and cultural
attributions are preserved in their original orthography where
known and Romanised secondarily, not the other way around.

The project does not auto-translate scientific names, conservation
programme names, or institutional names.

## 11. Metadata, alt text, and crawler-addressed copy

### Canon XX — The crawler reads the same documentary

Search engines, social previews, and screen readers receive the
project's voice, not a stripped-down marketing version. Concretely:

- `<title>` tags name the species in editorial form: *Tiger — Species
  on Screen* is acceptable; *Tiger | All Species | Animals
  Database* is not.
- Meta descriptions are a single sentence in the natural-history
  register, drawn from or written to match the species' opening
  observation. They do not contain calls to action.
- Open Graph descriptions are the same as meta descriptions unless
  there is reason to differ.
- JSON-LD descriptions are populated with substantive editorial
  content, not the literal placeholder *Species profile for tiger*
  that earlier prerender stubs produced.
- Alt text on photographs is descriptive and editorial: *A tiger
  walks through tall grass at dusk in Ranthambore National Park.* —
  not *tiger.jpg* or *Image of tiger*.
- `aria-label`s on interactive surfaces follow Canon XVII: named
  for the action in this project's own register.

### Canon XXI — There is no "About this site" page

The project does not have an About page, a Mission page, an FAQ, a
Contact page, or a Press page. Where institutional context is
required (funding, methodology, contributors, licenses), it lives in
a single Colophon entry written in the same voice as the rest of
the project. The Colophon is a beat, not a section navigator.

## 12. What this document is not

- This is not a style guide for spelling, capitalisation, or comma
  usage. The project follows standard British or American English
  consistently per file (current state: American English in code
  comments, mixed in copy — to be unified). A future spelling-and-
  punctuation document may be added without amending this one.
- This is not a content strategy document. It does not specify the
  set of species, the expansion roadmap, or the editorial calendar.
- This is not a translation specification. Canon XIX reserves
  localisation posture; the procedures live elsewhere.

## 13. How to cite this document in review

When approving or rejecting a copy change, name the Canon:

- "Canon V — this is a stat displayed as a widget; rewrite it as a
  sentence."
- "Canon VII — this claim has no source; either source it or remove
  it."
- "Approved against Canon XI — the threat reads as a paragraph and
  carries its own magnitude."
- "Canon XII — *insights at-a-glance* is dashboard register; the
  documentarian doesn't speak this way."

Canons are stable identifiers. Amendments are dated and noted in
this file; numbers are preserved.
