# The entrance is amended: first contact becomes attested geography

**Date:** 2026-09-12
**Status:** Ratified
**Scope:** The homepage entrance. Four `.kiro/steering/` provisions rebound; one frozen copy string changed; one manifest enum renamed.
**Occasion:** V1.7. The V1.5 occurrence map demonstrated that the project can show real coordinates with honest uncertainty; the entrance was still showing a planet.

## Decision

**The globe is retired from the entrance. First contact becomes a real map of
the five built and registered places, at their real coordinates, held in
darkness.**

This is an **amendment, not a deletion**. Article VI (held darkness) and the
approach beat are preserved unchanged. Only the *subject* of first contact
changes.

## The reason, stated correctly

An earlier framing of this ruling said the globe was retired for being
"procedurally rendered". **That was wrong and is retracted.** Since V1.3 Part A
(`848b5e4`) the globe has been NASA Blue Marble Next Generation and Black
Marble photographic imagery on a custom day/night shader — and
`.kiro/steering/cinematic-vocabulary.md` line 38 states as doctrine that *"The
globe is photographed, not rendered."* The shipped globe **satisfied** that
line. Retiring it for being rendered would have been retiring it for a property
it did not have.

The actual reason survives the correction and is stronger:

> However beautifully photographed, the globe is an **establishing shot that
> carries no record**. It shows the planet; it does not show the observations.
> The entrance becomes attested geography — the same five places, at their real
> coordinates, drawn from the archives. The register is preserved: held
> darkness, photographed rather than drawn, planetary scale. Only the subject of
> first contact changes, from the planet to the places on it.

This matters beyond the entrance. The project's claim is that a stranger is
lowered into a place until they care. An establishing shot of Earth is the one
image every nature documentary opens with; five coordinates with an archive
behind each is the thing only this project can open with.

## Preserved, explicitly

- **Article VI — held darkness.** The map is dark. The entrance is not a bright
  product map, and a basemap that arrived bright would be veiled rather than
  accepted.
- **The approach beat.** ~6s approach, then the **0.9s hold** — the "this place
  exists" beat cited in-code to Audit §9.3 — then the captions land.
- **Two distinct curves, not unified.** The approach is GSAP `power3.inOut`;
  the caption fade is CSS `--duration-fade` with `--ease-editorial`. They were
  never the same curve and are not made the same now.
- **Sundarbans keeps its camera arc at 2.0s.** See below.
- C1–C5, the Article III dip at p≈0.40, tiger-as-absence, the descent /
  arrival / inhabitation beats, the evidence layer, D4–D6, the eight-session
  gate.

## Sundarbans' arc survives — an arc is an arc

Sundarbans' arrival is `kind: entrance-hotspot` (renamed; see below), and
`arrive()` arcs the camera to the place over **2.0s** inside the Article III
Departure → Approach → Crossing → Cut sequence.

That arc is preserved at exactly 2.0s. MapLibre expresses it natively with
`flyTo` at matched duration and easing. **What changed is only what the camera
arcs toward:** a hotspot on a map rather than a hotspot on a sphere. Sundarbans
does **not** become a `dip`, and no beat is retimed.

## Four doctrine provisions rebound

Each provision's **principle survives unchanged**; only the noun moves from the
globe object to the entrance view. Each site cites this record inline rather
than being edited silently.

1. **`pacing-principles.md` §2 — "Planetary time".** The term is kept and
   rebound to the entrance view rather than to the globe object. Slow drift,
   ambient inertia, no urgent durations — all unchanged. A map at world view
   keeps planetary time as well as a sphere did.

2. **`pacing-principles.md` Principle IV — inertia is bounded.** Rotation
   continuity becomes **camera continuity**: the entrance is delivered back at
   the bearing, zoom and centre it held at the moment of the Descent's
   Departure, not at a default pose. The principle — *the world persists across
   a departure; the Descent suspends planetary time and the Return resumes it*
   — is untouched. Only "rotational velocity" becomes "camera state", because a
   map has no rotational inertia to zero.

3. **`experiential-references.md` — embodied exploration.** *"The primary way to
   reach a species is to touch the globe, not to read its name from a menu."*
   **Preserved and strengthened.** Touching a place at its real coordinate is a
   more literal instance of the principle than touching a sphere; the noun is
   rebound and the prohibition on menus stands. It is also why the no-WebGL
   fallback is not a list — see below.

4. **`experiential-references.md` — Eliasson / Article XI.** *"The globe is the
   largest body in the experience and is composed to be looked at, not
   interacted with first."* The map at world view is that largest body and
   holds before it invites. Noun rebound; the composition rule is unchanged.

No provision failed the rebinding. Had one failed, the instruction was to stop
and report rather than force it.

## One authorised copy edit

The copy freeze is otherwise absolute. One string is changed:

`index.html` noscript previously read *"The planetary view requires
JavaScript."* Once the planetary view is gone that sentence is **false**, and
honesty outranks the freeze — a frozen string that has become a lie is not
preserved by leaving it alone.

The replacement says what is true in the same plain voice, and this record is
the receipt so that the freeze is not read as broken. **This exception covers
this one sentence and nothing else.**

## The no-WebGL fallback is not a menu

A plain text list of five places is exactly the menu that
`experiential-references.md` forbids. The fallback is instead the five places
as **positioned links at their real coordinates** over a dark field —
touch-the-place survives without WebGL.

**Reported rather than sourced:** the repository holds no compliant dark world
plate, and sourcing one is not this turn's work. The interim is a positioned
layout over a plain dark field, which satisfies the principle; a world plate can
replace the field later without moving a single link.

## The manifest enum is renamed, not retired

`arrival.kind: "globe-hotspot"` becomes **`"entrance-hotspot"`** in
`place-manifest.schema.json` and `scripts/check-manifest.js`, with the manifest
rows migrated and `hotspotId` **still required**. `dip` is unchanged.

A retired-but-valid enum value would rot: a later session reading the schema
would find `globe-hotspot` admissible and bind to a globe that no longer
exists. The check is renamed, never weakened.

## Coordinates

All five come from `scripts/ingest/landscapes.json` `center`, never typed from
memory. The archives carry individual occurrence coordinates that differ
slightly from the place centroid, as they should — an occurrence is a record, a
centroid is where the place is.

## Ratification

**Ratified by:** the principal, 2026-09-12, who also supplied the corrected
reason after the original premise was found inaccurate.
