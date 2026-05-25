/*
  Ecological Narrative — canonical example object
  ------------------------------------------------
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

  This file is illustrative. It is not a build artifact, not imported
  by any module, and not part of any runtime. It defines the canonical
  shape; persistence and CMS concerns are deliberately out of scope.
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

/* ---------- Canonical example ---------- */

export const sundarbansBengalTigerSwimmer: EcologicalNarrative = {
  id: 'sundarbans-bengal-tiger-saline-swimmer',
  place: {
    id: 'sundarbans',
    name: 'Sundarbans',
    type: 'mangrove tidal forest',
    countries: ['Bangladesh', 'India'],
    protectedArea: 'Sundarbans Reserved Forest / Sundarbans National Park',
    coordinates: { latitude: 21.95, longitude: 89.18 },
    editorialPlaceLine:
      'A tidal forest where the salt enters every root twice a day.'
  },
  species: {
    id: 'panthera-tigris-tigris',
    commonName: 'Bengal tiger',
    scientificName: 'Panthera tigris tigris',
    taxonomy: { family: 'Felidae', order: 'Carnivora', class: 'Mammalia' },
    iucnStatus: 'endangered'
  },
  observation: {
    summary:
      'The Bengal tigers of the Sundarbans cross brackish tidal channels ' +
      'by swimming between forested islands — a regular behavior in pursuit ' +
      'of prey and territory, unrecorded at this frequency in any other ' +
      'tiger population.',
    type: 'behavioral_adaptation',
    year: [1973, 2024]
  },
  sources: [
    {
      kind: 'peer_reviewed',
      title:
        'Distribution and abundance of tigers and their prey in the ' +
        'Sundarbans mangrove ecosystem',
      authors: ['Khan, M. M. H.'],
      journal: 'Bangladesh Journal of Zoology',
      year: 2012
    },
    {
      kind: 'field_report',
      title: 'Status of Tigers, Co-predators and Prey in India 2018',
      authors: ['Jhala, Y. V.', 'Qureshi, Q.', 'Nayak, A. K.'],
      organization:
        'National Tiger Conservation Authority & Wildlife Institute of India',
      year: 2020
    },
    {
      kind: 'camera_trap',
      label: 'STR-2018-C4',
      operator: 'West Bengal Forest Department',
      year: 2018,
      location: 'compartment 4, Sundarban Tiger Reserve'
    }
  ],
  editorial: {
    fragment: 'every root is also a lung',
    body:
      'In the Sundarbans, the tide rises twice a day. Mangroves breathe ' +
      'through pneumatophores — vertical aerial roots that protrude from ' +
      'the mud — because the saline silt of the delta admits no air. The ' +
      'forest is a community of organisms that have learned to live, daily, ' +
      'with what would kill almost any other terrestrial life. Among them, ' +
      'a tiger that swims.',
    voice: 'editorial team'
  },
  metadata: {
    schemaVersion: '1',
    contributor: 'tarunv13',
    created: '2026-05-25',
    updated: '2026-05-25',
    status: 'draft'
  }
};
