/*
  Ecological Narrative — schema (v1).
  -----------------------------------
  ONE attested ecological story unit. Knits a place, a species, an
  observation, archival sources, and an editorial framing into a
  single durable record. The cinematic surface extracts a tiny subset;
  the research surface renders the whole thing.

  Cinematic extraction (only these fields may surface inside cinematic
  space, governed by `cinematic-principles.md` and `platform-architecture.md`):

    place.name                 — only after sustained inhabitation
    place.editorialPlaceLine   — may be used as threshold framing copy
    editorial.fragment         — the scene-inscription text

  Every other field belongs to the research surface and never appears
  in cinematic space.

  This file defines the schema only. Individual narrative records live
  in `./narratives/`, one per file. The runtime registry that
  discovers them is `./narrative-registry.ts`. Do not add narrative
  consts to this file.

  The filename retains the `.example.ts` suffix for historical reasons
  (the schema and a canonical example were once co-located here). The
  rename to `ecological-narrative.schema.ts` is listed as a future
  cleanup item in `.agents/tasks/task-repo-consolidation/`.
*/

type ID = string;
type ISODate = string;        // 'YYYY' | 'YYYY-MM' | 'YYYY-MM-DD'

interface Place {
  id: ID;
  name: string;
  type: string;                       // 'mangrove tidal forest' | 'salt pan' | …
  countries: string[];
  protectedArea?: string;
  coordinates?: { latitude: number; longitude: number };
  /** Single literary line about the place. Cinematic-extractable. */
  editorialPlaceLine: string;
}

interface Species {
  id: ID;
  commonName: string;
  scientificName: string;
  taxonomy: { family: string; order: string; class: string };
  iucnStatus:
    | 'least_concern'
    | 'near_threatened'
    | 'vulnerable'
    | 'endangered'
    | 'critically_endangered'
    | 'extinct_in_wild'
    | 'extinct'
    | 'data_deficient'
    | 'not_evaluated';
}

interface Observation {
  /** Single sourced factual claim, editorially worded. */
  summary: string;
  /** Coarse category for research-surface indexing. Not a tag array. */
  type:
    | 'behavioral_adaptation'
    | 'population_trend'
    | 'habitat_dependency'
    | 'trophic_relation'
    | 'threat_dynamic'
    | 'seasonal_pattern';
  /** Single year or inclusive [start, end] range. */
  year: number | [number, number];
}

type Source =
  | {
      kind: 'peer_reviewed';
      title: string;
      authors: string[];
      journal: string;
      year: number;
      doi?: string;
      url?: string;
    }
  | {
      kind: 'field_report';
      title: string;
      authors: string[];
      organization: string;
      year: number;
      url?: string;
    }
  | {
      kind: 'camera_trap';
      label: string;                  // identifier for the deployment
      operator: string;               // organization or researcher
      year: number;
      location?: string;
    }
  | {
      kind: 'satellite_imagery';
      provider: string;
      sensor: string;
      year: number;
      identifier: string;
    }
  | {
      kind: 'oral_account';
      contributor: string;
      relation: string;               // 'fisher, third generation' | …
      yearRecorded: number;
      transcriptId?: string;
    };

interface Editorial {
  /** Short, italic, observational. THE ONLY field that may surface
   *  inside cinematic space, via the scene-inscription pattern. */
  fragment: string;
  /** Article-length editorial body. Research surface only. Markdown. */
  body: string;
  voice: string;
}

interface NarrativeMetadata {
  schemaVersion: '1';
  contributor: string;
  created: ISODate;
  updated: ISODate;
  status: 'draft' | 'in_review' | 'verified' | 'published';
}

/**
 * The canonical unit of attested ecological storytelling. One record
 * binds a place, a species, an observation, sources, and an editorial
 * framing. Cinematic and research surfaces read from the same record
 * and render disjoint subsets.
 *
 * To add a new narrative: create a new `.ts` file under `./narratives/`
 * named `<id>.ts`, default-export an `EcologicalNarrative` object, and
 * the registry in `./narrative-registry.ts` will discover it at build
 * time. Validation rules and rejection criteria are in
 * `./narrative-ingestion-workflow.md`.
 */
export interface EcologicalNarrative {
  id: ID;
  place: Place;
  species: Species;
  observation: Observation;
  /** At least one source is required. A narrative without sources is
   *  not attested and must not be published. */
  sources: Source[];
  editorial: Editorial;
  metadata: NarrativeMetadata;
}
