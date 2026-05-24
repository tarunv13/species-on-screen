# Homepage / Landing Audit — 2026-05-24

Scope: only the surface a viewer meets *before* selecting a species. That is
the document shell (`index.html`), the loading screen, the camera landing
sequence, the globe at rest, the floating cards anchored to it, and the
bottom layer-toggle bar. Everything past the click-into-safari is out of
scope.

This audit is grounded in the four steering documents: the cinematic
vocabulary's Articles, the editorial voice's Canons, the pacing
principles' Principles, and the experiential references. Citations point
to specific files and lines as of this commit so a contributor can act on
the change without re-reading the audit.

## 1. The homepage as it currently is

A viewer arrives and sees, in order:

1. `#0a0a1a` near-black fill, centred panel: **"LOADING EXPERIENCE"** in
   uppercase letter-spaced 0.15em type at 0.5 opacity, plus three
   white-alpha dots animating on a 1.4s loop
   (`src/style.css:.loading__text`, `.loading__dots`).
2. After 1.3s minimum (0.5s delay + 0.8s opacity tween in `main.js`
   `init()`), the loading screen fades out and a 3-second camera
   `flyCamera` lands at `(0, 0.3, 5.5)` looking at the origin
   (`main.js:runLandingSequence`).
3. The globe is then visible: a sphere of radius 1.5 textured with the
   `unpkg.com` blue-marble image, an atmosphere shader at radius 1.58,
   and 29 cylindrical columns rising from the surface whose height
   encodes media count (`globe.js:_createColumns`,
   `globe.js:_updateColumnHeights`).
4. At the same moment, `#globe-ui-container` fades in over 0.6s,
   revealing the floating cards (one per species, frosted-glass
   backplate, 40px round thumbnail, name, lime-green `#4ade80`
   uppercase pill labelled with conservation status) and the bottom
   layer-toggle bar (three rounded pills: *Species / Habitats /
   Threats*).
5. Continuous ambient motion: low-frequency sinusoidal scaling on
   coming-soon markers (`globe.js:update`,
   `Math.sin(this.floraFaunaTime * 2 + i * 1.5) * 0.2`) and on
   protected-area markers when their layer is active. Coloured
   "flora-fauna" point sprites drift over each ecosystem region.
6. Hover behaviour: cursor-following tooltip
   (`#globe-tooltip` in `index.html`, positioned via mouse coordinates
   in `globe.js:update`); column emissive intensity flashes from
   `0.5` to `1.0` (`globe.js:update`); cursor switches to `pointer`.
7. Drag rotates the globe with inertia, x-axis clamped at ±π/3
   (`globe.js:_setupDragRotate`, `globe.js:update`).

That is the entire homepage.

## 2. What currently feels weak or generic

A list of specific surfaces, each with the failure named in editorial
terms (not "feels off") and the steering rule it conflicts with.

- **"LOADING EXPERIENCE" with bouncing dots.** The phrase is the most
  common SaaS template loader copy in existence. The dots animation is
  exactly the spinner Principle XIII forbids ("there are no spinners,
  no busy dots, no progress bars"). The `text-transform: uppercase` +
  `letter-spacing: 0.15em` combination is the dashboard-microbrand tag
  register Canon XV calls out.
- **System font stack on `body`.** `-apple-system, BlinkMacSystemFont,
  'Segoe UI', 'Helvetica Neue'` (`style.css` line 9) is the framework
  default. It is the most legible "we used the defaults" signal a web
  page can carry. The editorial voice presumes a publication-grade
  family; the current type is interface, not publication.
- **`font-weight: 200` + `letter-spacing: 0.08em` headings** elsewhere
  in the project (and in the same register here at 300). Thin display
  type with wide letter-spacing is the luxury-tech aesthetic — Apple
  marketing pages, Linear hero sections, Vercel templates. Article on
  type is unambiguous: editorial weight, not display weight.
- **Brand accents `#4ade80` and `#ff6b35`.** The green is Tailwind
  `green-400`; the orange is the standard "alert sentinel" used on
  product launch pages. Article VII forbids brand accent: there is no
  project colour. The greens and oranges sit on the planetary view as
  pure brand register.
- **Floating-card chrome.** `background: rgba(255,255,255,0.1)`,
  `backdrop-filter: blur(16px)`, `border: 1px solid
  rgba(255,255,255,0.15)`, `border-radius: 16px`, `box-shadow: 0 4px
  20px rgba(0,0,0,0.3)`, `:hover` lifting all of the above (style.css,
  `.floating-card`). This is generic glassmorphism — every Apple
  WWDC-imitation site since 2021. Article X permits a refractive
  backplate *only when it carries optical depth*; the current cards
  are flat panels with a 1px stroke, which Article X explicitly names
  as the wrong default.
- **The status pill (`.floating-card__status`).** A 0.65rem uppercase
  letter-spaced label sitting in a coloured pill. This is the
  Material/shadcn data-tag register. Conservation status belongs as a
  sentence on the species page (Canon XI), not as a coloured pill on
  the planetary view.
- **The 3-pill bottom layer bar.** Rounded segmented control with
  blurred background, brand-coloured active state. This is the
  Linear/Stripe filter register. Article XII forbids the layer toggles
  appearing as a checkbox grid; a 3-pill bar is the same family.
- **The cursor-following tooltip.** `#globe-tooltip` follows the mouse
  in `globe.js:update`. Article 3 names this exact behaviour as
  forbidden ("Tooltips that follow the cursor"). The label exists on
  the planetary view; it should be anchored or absent.
- **Column-as-bar-chart.** Cylinders of varying scale-y encoding media
  count is a 3D bar chart on a sphere. Article XI is written
  *explicitly* against this: "the globe is a body, not a chart". This
  is the most direct doctrinal violation on the page.
- **Continuous attention pulses.** Coming-soon markers and
  protected-area markers scale via a `Math.sin` of a global timer in
  `globe.js:update`. Article 3: forbidden gestures include
  "continuous attention-grabbing animation."
- **Hover emissive flash.** `emissiveIntensity = 1.0` on hover for
  columns. UI-celebration on hover. Article XV: "elements acknowledge,
  they do not pop."
- **Centred-globe composition.** Camera lands at `(0, 0.3, 5.5)` with
  the globe at the origin, occupying the centre of the viewport. The
  composition is portrait-symmetrical. Spatial humility (§1 of the
  experiential references) calls for the subject to claim the frame
  *off-centre*; the current frame is product-shot-style symmetry.

## 3. What breaks the intended ecological atmosphere

Atmosphere here means specifically: ecological immersion, environmental
presence, slowness, contemplative interaction (§1 of the experiential
references). The homepage actively erodes each:

- **Ecological immersion is broken** because the surround is a uniform
  near-black `#0a0a1a` with no biome register and no tonal variation
  with the visible hemisphere. The viewer is in a void looking at an
  object, not in the optical register of a place.
- **Environmental presence is broken** because the only continuous
  motion is decorative — pulsing markers, dancing flora-fauna sprites
  — which read as UI animation rather than as a place existing on its
  own. The globe itself stops rotating once drag inertia damps. There
  is no slow ambient spin that would suggest "this is here whether you
  are watching."
- **Slowness is broken** by the fast loading screen exit (1.3s minimum,
  0.8s tween) followed immediately by a 3s camera fly-in, then
  cards/UI fading in over 0.6s. The total time from first paint to
  full chrome is roughly 5s. There is no held silence anywhere in the
  sequence; every moment is animating *toward* the next moment.
- **Contemplative interaction is broken** by the instant chrome
  reveal: the layer-toggle bar and floating cards arrive at the same
  moment as the globe. The viewer is given the controls before they
  have looked at the place. The contract for a contemplative
  interaction is "place first, affordances second, after a hold." The
  current homepage gives them simultaneously.
- **Sound is absent.** Article XVI permits ambient bed; the homepage
  has nothing. The ecological register is silent. (This is not a
  defect to fix in this audit; it is named so a future contributor
  knows the absence is felt.)

## 4. What feels like portfolio / template behaviour

The fingerprints of generic web aesthetics on this page, named so they
can be removed deliberately:

- **"LOADING EXPERIENCE" + bouncing dots** — Webflow / Framer / agency
  template default loader.
- **Centred 3D object on near-black** — the WebGL portfolio homepage of
  the last six years.
- **`backdrop-filter: blur(16px)` + 1px white-alpha border + 16px
  border-radius** — Apple WWDC clone, Vercel landing-page clone.
- **Tailwind green-400 (`#4ade80`) as the eco-tech accent** — the
  default conservation-startup colour.
- **Sentinel orange `#ff6b35`** — the default "alert / threat" pop on
  every dashboard.
- **Three floating pills at the bottom centre as the navigation
  metaphor** — Linear's command bar, Stripe's product nav, every
  shadcn segmented-control demo.
- **Cursor-following tooltip showing the hovered object's name** —
  every Three.js demo, every WebGL portfolio piece since 2017.
- **Hover lift: bg brighter + border brighter + shadow grows** — the
  hover convention of every framework starter template.
- **Title tag "Eco-Cinema Observatory"** — brand-pitch register, like
  a museum-exhibit working title. The site is a publication, not a
  brand.
- **`<meta name="description" content="A cinematic exploration of
  species on screen and in the wild.">`** — "cinematic exploration"
  is a marketing phrase; Canon XV explicitly forbids "experience,
  journey, story" and the "cinematic" register used as a brag.

## 5. What should be preserved

Equally important: the parts of the current homepage that are doing the
right work and should not be re-engineered.

- **The architecture.** Fixed canvas, content overlays via
  `#globe-ui-container`, layered DOM with `pointer-events` toggling
  per layer (`style.css` `.floating-card`,
  `#floating-cards-container`). This is correct.
- **There is no menu, no breadcrumb, no nav.** The homepage *is* the
  planetary view; the viewer arrives at the place, not at a list of
  links. Canon XX in spirit. Preserve.
- **The drag-to-rotate verb.** The body responds to the hand. Right
  verb, right organ. Inertia damping is acceptable; the clamp on x
  rotation (±π/3) is editorial restraint. Preserve.
- **The 3-second camera landing.** The duration is right (Principle
  III scale). The destination is wrong (centred symmetry); the
  duration should not change.
- **The hotspot dataset (`HOTSPOTS` in `globe.js`).** 29 entries,
  ecosystem-tagged, hand-placed at editorial latitudes. This is the
  editorial backbone of the planetary view. Preserve unchanged.
- **The atmosphere shader.** The `BackSide` rim glow with
  `pow(0.6 - dot(vNormal, viewDir), 3.0)` and 0.4 alpha is doing the
  right perceptual work — atmosphere as light, not as decoration. Its
  colour saturation should be reduced (currently `vec4(0.4, 0.6, 1.0,
  ...)` reads as a bright Earth-from-space marketing blue; should be
  desaturated to a dawn ochre or twilight blue depending on Article
  V), but the math is sound. Preserve the shader; tune the colour.
- **The species data pipeline.** `_loadMediaCounts` with
  `Promise.allSettled` and `whenDataLoaded()` is sound architecture:
  partial failure is tolerated, the globe stays interactive, cards
  skip species that failed. Preserve unchanged.
- **The `noscript` block as a structure.** Editorial fallback listing
  ten species pages with direct links. Right idea, wrong copy and
  wrong colour (drop `style="color:#4ade80"` from each link). The
  structure is correct.

## 6. Five highest-leverage homepage improvements

Ordered by the ratio of perceptual change to implementation cost. Each
is cheap; together they take the homepage from "generic WebGL
portfolio" to "begins to feel like the project it is."

### 1. Replace the loading screen with a held darkness and one editorial sentence

**Effect:** Sets the entire register before any 3D appears. The viewer
is given a sentence to read in the body type before the place reveals.
Closes the single most generic template signal on the page.

**Change:**

- `index.html` `#loading-screen`: drop `.loading__dots` element. Replace
  `<p class="loading__text">Loading experience</p>` with one sentence
  in editorial form. Candidate: *"Ten species, observed in their
  habitats and in the films that name them."* (Canon I, Canon X, Canon
  II; tense and posture all governed.)
- `style.css`: drop `.loading__dots` and the `@keyframes loadingDot`.
  `.loading__text` re-tuned: no uppercase, no letter-spacing, weight
  400, size 1.05rem, opacity transitions from 0 → 0.7 over 1.6s, holds
  1.4s, fades 0.8s.
- `main.js` `init()`: extend the delay so the sentence is *read*, not
  glimpsed. Replace `delay: 0.5, duration: 0.8` with the held-read
  cadence above (Principle III: holds are sized to reading time, not
  to the viewer's patience).

### 2. Strip brand accents `#4ade80` and `#ff6b35`

**Effect:** Removes the Tailwind-default-eco-tech and the
sentinel-orange product-pop. Replaces two of the three most identifiable
template signals on the page in one CSS pass.

**Change:**

- `style.css`:
  - `.layer-toggle-btn.active { background: rgba(74, 222, 128, 0.25); border-color: rgba(74, 222, 128, 0.5); color: #4ade80; }` → no fill, no green border, no green text. Active state is an editorial 1px underline at baseline, in `--frame-paper`.
  - `.floating-card__status { background: rgba(74, 222, 128, 0.2); color: #4ade80; }` → remove the entire `.floating-card__status` element from `floating-cards.js` rendering and the rule from CSS. Conservation status belongs on the species page (Canon XI), not as a pill.
- `noscript` species links: drop `style="color:#4ade80"`. Use default
  link styling (underline, frame-paper colour).
- `globe.js` `_createProtectedAreaMarkers`: `0xff6b35` → desaturated
  ochre per biome (the relevant `HOTSPOTS` entry already carries an
  ecosystem colour, e.g. `#c4842c` savanna; pick from the linked
  hotspot, not from a global sentinel).

### 3. Replace floating-card chrome with anchored editorial labels

**Effect:** Removes the most identifiable template fingerprint on the
page (frosted-glass cards). Returns the planetary frame to silhouette;
the place is no longer cluttered by ten panels.

**Change:**

- `style.css` `.floating-card`:
  - Remove `background`, `backdrop-filter`, `-webkit-backdrop-filter`,
    `border`, `border-radius`, `box-shadow`, `padding`.
  - Remove the entire `.floating-card:hover` block.
  - Keep `position: fixed; top: 0; left: 0; opacity: 0; transition:
    opacity 0.3s ease;` and the `will-change`.
- `floating-cards.js`: drop the `<img class="thumb">` and the `<div
  class="status">` from the rendered template. Render only the
  species name in `var(--font-body)` at 0.95rem, frame-paper colour
  at 0.85 opacity, with a 1px frame-paper underline at the baseline
  to mark it as a target. Result: each anchor is the species name in
  editorial type, hovering at its projected screen position.
- Mobile (`@media (max-width: 480px)` `.floating-card`): currently
  collapses to a 36px circular thumbnail. After this change there is
  no thumbnail; the mobile rule should hide labels entirely below
  480px and rely on tap-to-reveal at the hotspot, since label
  collisions on small viewports are unmanageable.

### 4. Retire columns, pulses, and cursor tooltip on the globe

**Effect:** Removes the three most direct cinematic-vocabulary
violations in one Three.js refactor. The globe stops being a chart and
starts being a body.

**Change:**

- `globe.js` `_createColumns`: replace the `CylinderGeometry` with a
  small alpha-discs/glow at each hotspot at radius `1.502`. No height
  encoding. Single luminance. Hover lifts luminance by ~15% via
  material colour (not emissive flash).
- `globe.js` `update()`: remove the `protectedAreaMeshes.forEach(...sin
  ...0.3)` and `comingSoonMeshes.forEach(...sin ...0.2)` blocks.
  Markers are persistent and quiet.
- `globe.js` `update()`: remove the `emissiveIntensity = 1.0` flash on
  hover; the previous-hovered emissive reset can stay but the value is
  the same as the rest state (no pop on enter or exit).
- `globe.js` `update()` and `index.html`: delete `#globe-tooltip` and
  the entire cursor-tracking branch in `update()`. The label is the
  anchored card from improvement #3; there is no cursor-following
  layer.
- `globe.js` `_createFloraFauna`: defer to a future audit. The sprites
  are doing decorative work, not environmental work, but their removal
  is a separate decision; do not bundle into this minimum-viable pass.

### 5. Replace the body font family

**Effect:** One CSS variable change cascades through every line of text
on the homepage. Shifts the register from "framework default" to
"publication." Lower visual change than #1–4 in pixels, higher in
felt-tone.

**Change:**

- `style.css`:
  ```css
  :root {
    --font-body: "IBM Plex Serif", "Source Serif Pro", Georgia, serif;
    /* or, when paid licenses are available: Tiempos Text, Editorial New, Spectral */
    --font-display: var(--font-body);
    --frame-black: #0d1014;
    --frame-paper: #e8e2d6;
    --frame-paper-low: rgba(232, 226, 214, 0.55);
  }
  body {
    font-family: var(--font-body);
    background: var(--frame-black);
    color: var(--frame-paper);
    /* keep the rest as-is */
  }
  ```
- `.loading__text`, `.layer-toggle-btn`, `.return-to-globe`,
  `.globe-tooltip` (the latter being deleted under #4): switch to
  `var(--font-body)` and `var(--frame-paper)`.
- The same variables become the foundation of any future type
  hierarchy. Loading the family from `fonts.bunny.net` (no third-party
  tracking) or self-hosting via `@font-face` is acceptable; adding
  Google Fonts is not (Canon XXI: the apparatus stays out of the
  experience).

These five changes together are roughly 80 lines of code modified
across `index.html`, `style.css`, `globe.js`, and `floating-cards.js`.
The architecture is unchanged.

## 7. Revised homepage interaction flow

The flow currently is: spinner → fade → camera fly-in → all chrome
appears together → drag/hover/click. The revised flow is one
continuous arrival; nothing "loads" in front of the experience.

| t | what is on screen | what the viewer feels |
|---|---|---|
| 0–600ms | held darkness, no copy | orientation; the page is dark and steady |
| 600ms–2.2s | one sentence in body type fades in to 0.7 opacity at centre-low (not centre-mid) | a contract: this asks me to read |
| 2.2s–3.6s | sentence holds | the hold is read, then re-read |
| 3.6s–4.4s | sentence fades out to 0 | clean dissolve |
| 4.4s–7.4s | camera lands; globe rises out of darkness via atmosphere shader brightening from 0; biome ambient slowly accumulates | recognition; this is a body, not a panel |
| 7.4s–8.2s | atmosphere settled, globe at oblique tilt (not centre-symmetry — see below); slow ambient rotation begins | the place exists |
| 8.2s onward | anchored species labels fade in one-by-one over ~2s with stagger; layer toggles fade in last | quiet curiosity; affordances come *after* attention has settled |

Total to full availability: ~10s, which is roughly twice the current
~5s. This is correct: the homepage is paced for a viewer who has
chosen to be here, not for a viewer who must be re-engaged.

Composition change to support this: camera target shifts from `(0,0,0)`
to `(0.4, -0.2, 0)` so the globe sits **upper-left** in the frame,
with negative space at the lower-right. This is Article VI in
practice; the composition is asymmetric, the silhouette is preserved,
and the layer-toggle copy at the bottom centre no longer competes with
the globe.

Drag still rotates; the rotation now resumes a slow ambient drift on
release rather than damping to zero. The drift is at roughly 0.0003
rad/frame (one full revolution every ~6 minutes). Not a turntable;
a body.

## 8. Revised emotional progression

The progression maps the felt sequence the homepage should produce.
Each stage is a perceptual moment, not a UI state.

1. **Settled darkness** — the viewer's attention is given nothing to
   contend with. The room is theirs.
2. **A sentence to read** — the project introduces itself in editorial
   voice. No claim of importance; just a statement of the subject.
3. **A place reveals** — the globe is not produced by the interface;
   it emerges from the same darkness the sentence dissolved into.
4. **Quiet markers** — the hotspots are present, low-luminance,
   anchored. The viewer can choose to look at them or not.
5. **The body responds** — a drag rotates the globe; the place is
   addressable.
6. **A name is approached** — hovering a hotspot lifts its anchored
   label slightly; clicking begins the Descent.

Currently the progression is: spinner (frustration), reveal
(novelty), affordances appear (operating), hover (UI feedback),
click (state change). The revised progression replaces *operating*
with *attending*.

## 9. Minimum viable visual changes

The exact set of edits required to achieve §6.1–§6.5. Listed in
implementation order; each is small, reversible, and self-contained.

### 9.1 `index.html`

- `<title>Eco-Cinema Observatory</title>` →
  `<title>Species on Screen — habitats and the films that name them</title>`.
- `<meta name="description" content="A cinematic exploration of species on screen and in the wild.">` →
  `<meta name="description" content="Ten species, observed in their habitats and in the films that name them.">`.
- Inside `noscript`:
  - `<h1>Eco-Cinema Observatory</h1>` → `<h1>Species on Screen</h1>`.
  - `<p>The Eco-Cinema Observatory explores the relationship between species representation in film and real-world conservation outcomes. The full interactive experience requires JavaScript to render the 3D globe and interactive interface.</p>` → editorial form, e.g.:
    `<p>This page presents ten species in their habitats and in the films that name them. The planetary view requires JavaScript; the species pages are below.</p>`.
  - Drop every `style="color:#4ade80;"` from the `<a>` tags.
  - Drop `<p style="font-size:0.9rem;color:#999;">Please enable JavaScript for the full 3D interactive experience.</p>`. The species links are themselves the answer; no plea is needed.
- `#loading-screen` inner: replace
  ```html
  <div class="loading__content">
    <p class="loading__text">Loading experience</p>
    <div class="loading__dots"><span></span><span></span><span></span></div>
  </div>
  ```
  with
  ```html
  <p class="landing-sentence">Ten species, observed in their habitats and in the films that name them.</p>
  ```
- `<button class="return-to-globe" style="display:none;">Return to Globe</button>` → `Return to the planet`. (Canon XVII; "Globe" is title-cased UI; "the planet" is editorial.) The `display:none` initial state stays; this is only the copy.
- Drop the `<div id="globe-tooltip" class="globe-tooltip"></div>` line. (Tooltip is being removed under §6.4.)
- `.sr-only` content: replace `This page presents an interactive 3D globe experience exploring the relationship between species in film and conservation. Interact with the globe by dragging to rotate, and click on species cards to explore individual species.` with editorial form:
  `Ten species, observed in their habitats and in the films that name them. Drag to rotate the planet; press a species name to enter its habitat.`

### 9.2 `src/style.css`

- Add the `:root` block from §6.5 (variables).
- `body { font-family: -apple-system, ... }` → `body { font-family: var(--font-body); background: var(--frame-black); color: var(--frame-paper); }` (other body properties unchanged).
- Drop `.loading__text`, `.loading__dots`, `.loading__dots span`, and `@keyframes loadingDot`.
- Add:
  ```css
  .landing-sentence {
    font-family: var(--font-body);
    font-size: 1.05rem;
    font-weight: 400;
    line-height: 1.55;
    color: var(--frame-paper);
    opacity: 0;
    max-width: 32rem;
    text-align: center;
    padding: 0 2rem;
  }
  ```
  (Opacity is animated by `main.js`.)
- `.floating-card`: remove `background`, `backdrop-filter`,
  `-webkit-backdrop-filter`, `border`, `border-radius`, `padding`,
  `box-shadow`, and the `gap`. Add
  `font-family: var(--font-body); font-size: 0.95rem; color: var(--frame-paper); text-decoration: underline; text-decoration-color: rgba(232, 226, 214, 0.4); text-underline-offset: 4px;`.
- Drop the `.floating-card:hover` block.
- Drop `.floating-card__thumb`, `.floating-card__status`,
  `.floating-card__info`, `.floating-card__name`. (After
  `floating-cards.js` is updated to render only the name, these are
  unused.)
- `.layer-toggle-btn`: remove `border`, `border-radius`, `background`,
  `backdrop-filter`, `-webkit-backdrop-filter`. Set `color:
  var(--frame-paper-low)`, `font-family: var(--font-body)`,
  `letter-spacing: 0`, `font-weight: 400`. Active state: remove green
  fill/border/colour; replace with `color: var(--frame-paper);
  text-decoration: underline; text-decoration-thickness: 1px;
  text-underline-offset: 6px;`.
- `.layer-toggle-bar`: remove `gap: 0.5rem`; use a thin character
  separator between buttons rendered inline (or a plain `gap: 1.6rem`
  with no chrome on the buttons themselves).
- `.return-to-globe`: same chrome strip as `.layer-toggle-btn`.
- Drop `.globe-tooltip` and its mobile rule (the element is gone).
- `@media (max-width: 480px) .floating-card { border-radius: 50%; }`:
  drop, since cards have no shape; replace with
  `display: none;` (mobile relies on tap-to-reveal at the hotspot).

### 9.3 `src/main.js`

- `runLandingSequence`: extend the timeline so the sentence is held
  before the camera departs. Sketch:
  ```js
  function runLandingSequence() {
    const landingSentence = document.querySelector('.landing-sentence');
    const globeUI = document.getElementById('globe-ui-container');
    const tl = gsap.timeline();

    tl.to(landingSentence, { opacity: 0.7, duration: 1.6, ease: 'power2.out' }, 0.6);
    tl.to(landingSentence, { opacity: 0.7, duration: 1.4 }, '+=0');           // hold
    tl.to(landingSentence, { opacity: 0, duration: 0.8, ease: 'power2.in' });
    tl.add(() => { landingSentence.style.display = 'none'; });

    const targetPos = new THREE.Vector3(0.6, 0.3, 5.5);    // off-centre
    const targetLookAt = new THREE.Vector3(0.4, -0.2, 0);  // upper-left composition
    tl.add(engine.flyCamera(targetPos, targetLookAt, 3, 'power3.inOut'), '+=0');

    tl.eventCallback('onComplete', () => {
      if (globeUI) globeUI.classList.add('active');
      if (floatingCards) floatingCards.show();
    });
  }
  ```
- The existing `gsap.to(loadingScreen, { opacity: 0, ... onComplete: runLandingSequence })` block in `init()` should be removed; the loading screen *is* the sentence, and the sentence is dissolved by `runLandingSequence` itself.

### 9.4 `src/globe.js`

- `_createColumns`: replace `CylinderGeometry(0.015, 0.015, 1, 8)` and
  the `column.scale.y = 0.05 + ...` line with a small disc geometry
  (`CircleGeometry(0.025, 24)`) at radius 1.502, oriented to the
  surface normal, with a low-alpha additive material. No
  `_updateColumnHeights` (delete the method and its call).
- `update()`: delete the
  `if (this.activeLayer === 'protected_areas' || this.activeLayer === 'threats') { this.protectedAreaMeshes.forEach((marker, i) => { marker.scale.setScalar(1.0 + Math.sin(this.floraFaunaTime * 3 + i) * 0.3); }); }`
  block and the
  `this.comingSoonMeshes.forEach((marker, i) => { marker.scale.setScalar(1.0 + Math.sin(this.floraFaunaTime * 2 + i * 1.5) * 0.2); });`
  block.
- `update()`: delete the entire tooltip-positioning branch (everything
  that touches `document.getElementById('globe-tooltip')`). Drop the
  variable.
- `update()`: change the hover treatment from
  `hit.material.emissiveIntensity = 1.0;` to a 15% colour lift via
  `material.color.lerp(restColour, 0.15)` or equivalent. The
  rest-state reset on the previous-hovered marker stays but uses the
  same restored colour rather than the prior emissive value.
- `_setupDragRotate` / `update()`: on drag release, replace
  damp-to-zero with a slow ambient drift floor:
  ```js
  const AMBIENT_DRIFT = 0.0003;
  if (!this._isDragging) {
    this._velocity.x *= this._damping;
    this._velocity.y *= this._damping;
    if (Math.abs(this._velocity.x) < AMBIENT_DRIFT) {
      this._velocity.x = AMBIENT_DRIFT;
    }
    this.group.rotation.y += this._velocity.x;
    this.group.rotation.x += this._velocity.y;
    this.group.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.group.rotation.x));
  }
  ```
  This produces the "exists whether you are watching" property
  without becoming a turntable.
- Atmosphere shader: change
  `gl_FragColor = vec4(0.4, 0.6, 1.0, intensity * 0.4);`
  to a desaturated dawn tone, e.g.
  `vec4(0.55, 0.50, 0.42, intensity * 0.35);`
  (a warm low-saturation rim). The exact value is editorial; the
  current bright Earth-marketing-blue is the failure mode.

### 9.5 `src/floating-cards.js`

- Render only the species name. Remove the `<img>` thumbnail and the
  `<div>` status pill from the template. The card element has no
  inner divs; it is a single anchored text node.
- `setLayerVisibility`: keep the same signature; the visibility
  semantics do not change.
- `hide()` / `show()`: unchanged.

## 10. What this audit deliberately does not touch

- The safari scene composition, type, or pacing.
- The 3D-map shift (globe → terrain) — that is governed by the
  Visual-Spatial System work currently on `docs/visual-spatial-system`.
- Sound. Article XVI is observed by absence; the homepage is silent
  in this audit.
- The flora-fauna sprite layer in `_createFloraFauna`. It is
  decorative and probably wrong, but its removal is a separate
  editorial decision; bundling it into a minimum-viable pass would
  inflate scope.
- Mobile composition beyond the one rule named in §9.2. Mobile is
  governed by a separate audit.

The point of a minimum-viable change set is that the homepage is
*coherent* after, not *finished*.
