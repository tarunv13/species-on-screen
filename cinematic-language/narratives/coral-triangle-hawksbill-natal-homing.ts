/**
 * Coral Triangle · Hawksbill sea turtle, natal-homing crossing.
 *
 * The Coral Triangle is the most biologically rich marine area on Earth,
 * spanning six nations in the Indo-Pacific. Eretmochelys imbricata
 * (hawksbill sea turtle) navigates open-ocean crossings of hundreds to
 * thousands of kilometres, guided by geomagnetic imprinting at the birth
 * beach, returning to nest within a few kilometres of where they hatched.
 *
 * This record supports the Crossing cinematic surface (places/crossing.html).
 * Schema: cinematic-language/ecological-narrative.example.ts
 * Registry: cinematic-language/narrative-registry.ts
 */

import type { EcologicalNarrative } from '../ecological-narrative.example';

const narrative: EcologicalNarrative = {
  id: 'coral-triangle-hawksbill-natal-homing',
  place: {
    id: 'coral-triangle',
    name: 'Coral Triangle',
    type: 'tropical reef sea',
    countries: [
      'Indonesia', 'Philippines', 'Malaysia',
      'Papua New Guinea', 'Solomon Islands', 'Timor-Leste'
    ],
    protectedArea: 'Coral Triangle Initiative on Coral Reefs, Fisheries, and Food Security',
    coordinates: { latitude: 2.0, longitude: 130.0 },
    editorialPlaceLine:
      'A shallow tropical sea holding more reef species than anywhere else on Earth.'
  },
  species: {
    id: 'eretmochelys-imbricata',
    commonName: 'hawksbill sea turtle',
    scientificName: 'Eretmochelys imbricata',
    taxonomy: { family: 'Cheloniidae', order: 'Testudines', class: 'Reptilia' },
    iucnStatus: 'critically_endangered'
  },
  observation: {
    summary:
      'Female hawksbill sea turtles navigate open-ocean crossings of hundreds to ' +
      'thousands of kilometres, returning to nest within a few kilometres of their ' +
      'birth beach — guided by geomagnetic imprinting on the Earth\'s field at hatching.',
    type: 'behavioral_adaptation',
    year: [1980, 2023]
  },
  sources: [
    {
      kind: 'peer_reviewed',
      title:
        'Geomagnetic imprinting: A unifying hypothesis of long-distance natal ' +
        'homing in salmon and sea turtles',
      authors: ['Lohmann, K.J.', 'Putman, N.F.', 'Lohmann, C.M.F.'],
      journal: 'Proceedings of the National Academy of Sciences',
      year: 2008
    },
    {
      kind: 'peer_reviewed',
      title:
        'Status justification for listing the hawksbill turtle ' +
        '(Eretmochelys imbricata) as critically endangered on the 1996 ' +
        'IUCN Red List of Threatened Animals',
      authors: ['Meylan, A.B.', 'Donnelly, M.'],
      journal: 'Chelonian Conservation and Biology',
      year: 1999
    }
  ],
  editorial: {
    fragment: 'every crossing ends where it began',
    body:
      'Hawksbill sea turtles spend years crossing the open ocean, but females ' +
      'return to nest within a few kilometres of the beach where they hatched — ' +
      'decades after the first departure.\n\n' +
      'The mechanism is geomagnetic: each hatchling imprints on the Earth\'s ' +
      'magnetic field at its birth site and carries that signature as a lifelong ' +
      'bearing. The ocean crossing is not a search. It is a return.',
    voice: 'editorial team'
  },
  metadata: {
    schemaVersion: '1',
    contributor: 'tarunv13',
    created: '2026-06-27',
    updated: '2026-06-27',
    status: 'verified'
  }
};

export default narrative;
