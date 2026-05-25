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



/* ---------- Stress-test examples ---------- */

/*
  Two additional EcologicalNarrative objects, written to test the
  schema against ecological diversity and editorial restraint.

  Neither extends the schema. Neither adds a field. Neither redefines
  an enum. Both use only the kinds, types, and statuses already
  declared above. They are illustrative, not build artifacts.

  #1 — Atacama / tamarugo. A radically different ecology to Sundarbans:
       hyperarid desert basin instead of tidal-saturated mangrove,
       a long-lived tree instead of an apex mammal, a Pleistocene
       aquifer instead of a twice-daily tide. Exercises the
       satellite_imagery source kind that the Sundarbans example does
       not.

  #2 — Postojna karst / olm. A non-charismatic species in an obscure,
       subterranean place: a small, blind, depigmented cave
       salamander beneath the Dinaric Alps. Exercises the oral_account
       source kind. The longevity observation tests the boundary of
       observation.type cleanly.
*/

/**
 * Schema stress-test #1 — radically different ecology.
 * Hyperarid desert basin in northern Chile; a tree that draws on a
 * Pleistocene aquifer to hold a canopy where almost no rain falls.
 */
export const atacamaTamarugoFossilWater: EcologicalNarrative = {
  id: 'atacama-tamarugo-fossil-water',
  place: {
    id: 'pampa-del-tamarugal',
    name: 'Pampa del Tamarugal',
    type: 'hyperarid desert basin',
    countries: ['Chile'],
    protectedArea: 'Pampa del Tamarugal National Reserve',
    coordinates: { latitude: -20.50, longitude: -69.62 },
    editorialPlaceLine:
      'A basin where almost no rain falls, and a forest stands anyway.'
  },
  species: {
    id: 'prosopis-tamarugo',
    commonName: 'tamarugo',
    scientificName: 'Prosopis tamarugo',
    taxonomy: { family: 'Fabaceae', order: 'Fabales', class: 'Magnoliopsida' },
    iucnStatus: 'endangered'
  },
  observation: {
    summary:
      'The tamarugo of the Pampa del Tamarugal sustains its canopy by ' +
      'tap-rooting many metres into a Pleistocene-charged aquifer; where ' +
      'the water table has dropped under sustained groundwater extraction, ' +
      'satellite-tracked canopies have thinned and seedling cohorts have ' +
      'failed.',
    type: 'habitat_dependency',
    year: [1965, 2016]
  },
  sources: [
    {
      kind: 'peer_reviewed',
      title:
        'Further observations on the water relations of Prosopis tamarugo ' +
        'of the northern Atacama desert',
      authors: [
        'Mooney, H. A.', 'Gulmon, S. L.', 'Rundel, P. W.', 'Ehleringer, J.'
      ],
      journal: 'Oecologia',
      year: 1980
    },
    {
      kind: 'peer_reviewed',
      title:
        '50 years of water extraction in the Pampa del Tamarugal basin: ' +
        'Can Prosopis tamarugo trees survive in the hyper-arid Atacama ' +
        'Desert (Northern Chile)?',
      authors: [
        'Chávez, R. O.', 'Clevers, J. G. P. W.', 'Decuyper, M.',
        'de Bruin, S.', 'Herold, M.'
      ],
      journal: 'Journal of Arid Environments',
      year: 2016
    },
    {
      kind: 'satellite_imagery',
      provider: 'USGS / NASA',
      sensor: 'Landsat',
      year: 2015,
      identifier:
        'Landsat archive, Pampa del Tamarugal time series (1984–2015)'
    }
  ],
  editorial: {
    fragment: 'the rain that fed it never fell in this century',
    body:
      'The Pampa del Tamarugal lies in the rain shadow of the Andes. ' +
      'Some meteorological stations have recorded years between ' +
      'measurable rainfall events. A forest stands here regardless.\n\n' +
      'The tamarugo descends a taproot many metres into the basin floor ' +
      'and draws on water charged into the aquifer during the ' +
      'Pleistocene. It lifts that ancient water through its tissues ' +
      'into a canopy of small, salt-tolerant leaves. The forest is not ' +
      'made by rain. It is made by the slow inheritance of a wetter ' +
      'climate.\n\n' +
      'Since the mid-twentieth century, groundwater has been withdrawn ' +
      'from the basin to supply mining and municipal demand. Where the ' +
      'water table has fallen below what the trees can reach, canopies ' +
      'have thinned and seedling cohorts have failed. Decades of ' +
      'Landsat imagery document the retreat.',
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

/**
 * Schema stress-test #2 — non-charismatic species, obscure place.
 * A small, blind, depigmented cave salamander beneath the Dinaric
 * Alps. The famous observation is its longevity: extreme for a
 * vertebrate of its size.
 */
export const dinaricOlmCenturyLifespan: EcologicalNarrative = {
  id: 'dinaric-olm-century-lifespan',
  place: {
    id: 'postojna-karst',
    name: 'Postojna karst',
    type: 'subterranean karst aquifer',
    countries: ['Slovenia'],
    protectedArea: 'Postojnska jama (Postojna Cave system)',
    coordinates: { latitude: 45.7833, longitude: 14.2039 },
    editorialPlaceLine:
      'A river that runs in the dark, in a country of limestone.'
  },
  species: {
    id: 'proteus-anguinus',
    commonName: 'olm',
    scientificName: 'Proteus anguinus',
    taxonomy: { family: 'Proteidae', order: 'Urodela', class: 'Amphibia' },
    iucnStatus: 'vulnerable'
  },
  observation: {
    summary:
      'A cave-laboratory population of olms followed across half a ' +
      'century in the French Pyrenees yields survival parameters ' +
      'consistent with an average adult lifespan near sixty-eight ' +
      'years and a maximum approaching or exceeding a century — ' +
      'extreme longevity for a vertebrate of its size.',
    type: 'behavioral_adaptation',
    year: [1958, 2010]
  },
  sources: [
    {
      kind: 'peer_reviewed',
      title:
        'Extreme lifespan of the human fish (Proteus anguinus): ' +
        'a challenge for ageing mechanisms',
      authors: [
        'Voituron, Y.', 'de Fraipont, M.', 'Issartel, J.',
        'Guillaume, O.', 'Clobert, J.'
      ],
      journal: 'Biology Letters',
      year: 2011,
      doi: '10.1098/rsbl.2010.0539'
    },
    {
      kind: 'peer_reviewed',
      title:
        'Distribution of Proteus (Amphibia: Urodela: Proteidae) and its ' +
        'possible explanation',
      authors: ['Sket, B.'],
      journal: 'Journal of Biogeography',
      year: 1997
    },
    {
      kind: 'oral_account',
      contributor: 'Postojna Cave guide',
      relation: 'speleological-tour interpreter, Postojnska jama',
      yearRecorded: 2019
    }
  ],
  editorial: {
    fragment: 'a vertebrate kept at the speed of stone',
    body:
      'Beneath the Dinaric Alps, water moves slowly through limestone. ' +
      'A river system runs in the dark, fed by the karst.\n\n' +
      'In that water lives the olm: a salamander that does not ' +
      'metamorphose, has no functional eyes, retains no pigment, and ' +
      'feeds — when it feeds — on small invertebrates carried in by ' +
      'the current. Its metabolism is among the lowest known for a ' +
      'vertebrate. Captive individuals have gone years without taking ' +
      'food.\n\n' +
      'A reproducing population held in a constant-temperature cave ' +
      'laboratory in the French Pyrenees was followed across more than ' +
      'fifty years. The survival curve fitted to that record implies ' +
      'an average adult lifespan close to seven decades, with the ' +
      'longest individuals reaching or exceeding a hundred years. Few ' +
      'vertebrates of comparable size live half as long.\n\n' +
      'Cave guides at Postojna have been showing the animal to ' +
      'visitors since the nineteenth century. Most of what they show, ' +
      'by lamp light, is barely moving.',
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
