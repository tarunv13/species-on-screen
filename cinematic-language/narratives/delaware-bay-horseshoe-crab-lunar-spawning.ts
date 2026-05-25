/**
 * Delaware Bay · Atlantic horseshoe crab, lunar-tide spawning.
 *
 * For roughly six weeks each spring, on the high-tide nights of the
 * new and full moons, the Atlantic horseshoe crab comes ashore to
 * spawn on the upper-shore sand of Delaware Bay. Adults aggregate in
 * dense breeding congregations along the bay's beaches; females dig
 * shallow nests and release eggs in clutches of around four
 * thousand; clasping males release sperm over the surface as the
 * tide retreats. The lunar-tide synchrony has been documented in
 * scientific literature since at least the early twentieth century.
 *
 * This file is one record. The schema is in
 * `../ecological-narrative.example.ts`. The runtime registry that
 * discovers this file is in `../narrative-registry.ts`.
 */

import type { EcologicalNarrative } from '../ecological-narrative.example';

const narrative: EcologicalNarrative = {
  id: 'delaware-bay-horseshoe-crab-lunar-spawning',
  place: {
    id: 'delaware-bay',
    name: 'Delaware Bay',
    type: 'temperate Atlantic estuary',
    countries: ['United States'],
    coordinates: { latitude: 39.0, longitude: -75.1 },
    editorialPlaceLine:
      'An estuary where the same animal has come ashore for four ' +
      'hundred million years.'
  },
  species: {
    id: 'limulus-polyphemus',
    commonName: 'Atlantic horseshoe crab',
    scientificName: 'Limulus polyphemus',
    taxonomy: { family: 'Limulidae', order: 'Xiphosurida', class: 'Merostomata' },
    iucnStatus: 'vulnerable'
  },
  observation: {
    summary:
      'Atlantic horseshoe crabs in Delaware Bay aggregate to spawn ' +
      'on the upper-shore sand on the high-tide nights of the new ' +
      'and full moons across roughly six weeks each spring — a ' +
      'lunar-tide synchrony at this scale recorded in no other ' +
      'arthropod.',
    type: 'seasonal_pattern',
    year: [1989, 2019]
  },
  sources: [
    {
      kind: 'peer_reviewed',
      title:
        'Reproductive risk: high mortality associated with spawning ' +
        'by horseshoe crabs (Limulus polyphemus) in Delaware Bay, USA',
      authors: ['Botton, M. L.', 'Loveland, R. E.'],
      journal: 'Marine Biology',
      year: 1989
    },
    {
      kind: 'peer_reviewed',
      title: 'Mating behavior of horseshoe crabs, Limulus polyphemus',
      authors: ['Brockmann, H. J.'],
      journal: 'Behaviour',
      year: 1990
    },
    {
      kind: 'field_report',
      title:
        '2019 Horseshoe Crab Benchmark Stock Assessment and Peer ' +
        'Review Report',
      authors: ['Atlantic States Marine Fisheries Commission'],
      organization: 'Atlantic States Marine Fisheries Commission',
      year: 2019
    }
  ],
  editorial: {
    fragment: 'the moon and the tide arrive in the same body',
    body:
      'For about six weeks each spring, on the high-tide nights of ' +
      'the new and full moons, the Atlantic horseshoe crab comes ' +
      'ashore on the upper-shore sand of Delaware Bay. Adults ' +
      'aggregate in dense breeding congregations along the bay\u2019s ' +
      'beaches; females dig shallow nests and release eggs in ' +
      'clutches of around four thousand; clasping males release ' +
      'sperm over the surface as the tide retreats.\n\n' +
      'The synchrony has been recorded in scientific literature ' +
      'since at least the early twentieth century, and far longer ' +
      'by Lenape and later European observers. The genus Limulus ' +
      'has been recognisable in the fossil record for over four ' +
      'hundred million years.\n\n' +
      'Bay-wide population indices declined through the 1990s and ' +
      'early 2000s; attributed causes include harvest pressure for ' +
      'whelk-fishery bait and biomedical bleeding for endotoxin ' +
      'testing. The lunar-tide spawning rhythm itself has not ' +
      'changed.',
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

export default narrative;
