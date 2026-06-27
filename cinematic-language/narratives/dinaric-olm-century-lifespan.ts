/**
 * Postojna karst · olm at geological speed.
 *
 * Subterranean karst aquifer beneath the Dinaric Alps. Proteus
 * anguinus — a small, blind, depigmented cave salamander — survives
 * on a metabolism among the lowest known for a vertebrate. A
 * cave-laboratory population followed across half a century yields
 * survival parameters consistent with an average adult lifespan
 * near sixty-eight years and a maximum approaching or exceeding a
 * century.
 *
 * This file is one record. The schema is in
 * `../ecological-narrative.example.ts`. The runtime registry that
 * discovers this file is in `../narrative-registry.ts`.
 */

import type { EcologicalNarrative } from '../ecological-narrative.example';

const narrative: EcologicalNarrative = {
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
    taxonomy: { family: 'Proteidae', order: 'Caudata', class: 'Amphibia' },
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
    updated: '2026-06-27',
    status: 'verified'
  }
};

export default narrative;
