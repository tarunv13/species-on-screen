/*
  Place Manifest — typed wrapper (ADR-001).
  -----------------------------------------
  The canonical source of truth is `place-manifest.json` (validated by
  `scripts/check-manifest.js` and described by `place-manifest.schema.json`).
  This wrapper imports that JSON and re-exports it with domain types, so
  browser/runtime consumers get typed access without making TypeScript the
  source (Node tooling reads the JSON directly).

  M23 Phase 0 — "describe, don't consume": nothing imports this wrapper yet,
  so it is not bundled and runtime behaviour is unchanged. Phase 1 will point
  the research, atlas, and homepage consumers at it, replacing their per-place
  branches. Cross-surface navigation links are DERIVED from `surfaces`; they
  are not stored on the entry.
*/

import manifest from './place-manifest.json';

export type ArrivalKind = 'globe-hotspot' | 'dip';
export type AtlasKind = 'field-record' | 'companion';

export interface ResearchSurface {
  /** notes/<slug>.html */
  slug: string;
}

export interface CinematicArrival {
  kind: ArrivalKind;
  /** Present when kind === 'globe-hotspot'. */
  hotspotId?: string;
}

export interface CinematicSurface {
  /** places/<slug>.html */
  slug: string;
  /** Editorial bridge label used by research/atlas to enter the place. */
  enterLabel: string;
  arrival: CinematicArrival;
}

export interface AtlasSurface {
  /** atlas/<slug>.html */
  slug: string;
  kind: AtlasKind;
}

export interface DwcaSurface {
  /** public/dwca/<slug>/ */
  slug: string;
  actors: number;
  interactions: number;
}

export interface PlaceSurfaces {
  research: ResearchSurface;
  cinematic?: CinematicSurface;
  atlas?: AtlasSurface[];
  dwca?: DwcaSurface;
}

export interface HomepageEntry {
  caption: string;
  /** Unique ordering among homepage-curated places. */
  order: number;
}

export interface PlaceEntry {
  /** Canonical, stable, unique place id; the join key across data models. */
  placeId: string;
  displayName: string;
  /** Biome type; drives atlas backdrop classification and overview card. */
  type: string;
  /** Registry key + notes slug of the bound narrative. */
  narrativeId: string;
  surfaces: PlaceSurfaces;
  /** Present only for places curated onto the planetary homepage. */
  homepage?: HomepageEntry;
}

interface ManifestFile {
  places: PlaceEntry[];
}

/** All manifest place entries, in authored order. */
export const PLACES: readonly PlaceEntry[] = (manifest as ManifestFile).places;

/** Look up a place by its canonical `placeId`. */
export function getPlaceById(placeId: string): PlaceEntry | undefined {
  return PLACES.find((p) => p.placeId === placeId);
}

/**
 * Resolve the held SUBJECT to its place by canonical subject id (= `placeId`),
 * the D1 URL-addressability entry (`?subject=`). The subject id is surface-
 * independent; each surface derives its own local slug from the resolved place.
 */
export function resolveSubject(subjectId: string): PlaceEntry | undefined {
  return getPlaceById(subjectId);
}

/** Look up a place by the bound narrative id. */
export function getPlaceByNarrativeId(narrativeId: string): PlaceEntry | undefined {
  return PLACES.find((p) => p.narrativeId === narrativeId);
}

/** Look up a place by a surface slug (cinematic, atlas, or dwca). */
export function getPlaceBySurfaceSlug(slug: string): PlaceEntry | undefined {
  return PLACES.find(
    (p) =>
      p.surfaces.cinematic?.slug === slug ||
      p.surfaces.dwca?.slug === slug ||
      (p.surfaces.atlas || []).some((a) => a.slug === slug)
  );
}

/** Homepage-curated places, sorted by their `homepage.order`. */
export function homepagePlaces(): PlaceEntry[] {
  return PLACES.filter((p) => p.homepage).sort(
    (a, b) => (a.homepage!.order) - (b.homepage!.order)
  );
}
