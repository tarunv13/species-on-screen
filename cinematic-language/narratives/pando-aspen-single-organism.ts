/**
 * Pando, Fishlake National Forest, Utah · quaking aspen, single organism.
 *
 * A 43-hectare stand of around 47,000 quaking aspen stems on the
 * southwestern edge of Fishlake, Utah. Genetic analysis confirms
 * one male clone — a single organism reproducing almost entirely by
 * suckering from a shared root system. Repeated demographic surveys
 * since the 1990s document a steady shift toward older, taller stems
 * with little replacement underneath, attributed to sustained
 * browsing pressure on the suckers by elk and mule deer.
 *
 * This file is one record. The schema is in
 * `../ecological-narrative.example.ts`. The runtime registry that
 * discovers this file is in `../narrative-registry.ts`.
 */

import type { EcologicalNarrative } from '../ecological-narrative.example';

const narrative: EcologicalNarrative = {
  id: 'pando-aspen-single-organism',
  place: {
    id: 'pando-fishlake',
    name: 'Pando',
    type: 'temperate quaking-aspen grove',
    countries: ['United States'],
    protectedArea: 'Fishlake National Forest',
    coordinates: { latitude: 38.5247, longitude: -111.7503 },
    editorialPlaceLine:
      'A grove that has been the same organism since long before ' +
      'the last glaciation.'
  },
  species: {
    id: 'populus-tremuloides',
    commonName: 'quaking aspen',
    scientificName: 'Populus tremuloides',
    taxonomy: { family: 'Salicaceae', order: 'Malpighiales', class: 'Magnoliopsida' },
    iucnStatus: 'least_concern'
  },
  observation: {
    summary:
      'The Pando stand of quaking aspen — approximately 47,000 ' +
      'stems sharing one root system across roughly 43 hectares — ' +
      'is a single male clone whose demographic structure has ' +
      'shifted, across multiple decades of monitoring, toward older ' +
      'and taller stems with little sucker recruitment, attributed ' +
      'to sustained browsing by elk and mule deer.',
    type: 'population_trend',
    year: [1976, 2018]
  },
  sources: [
    {
      kind: 'peer_reviewed',
      title: 'Clone size in American aspens',
      authors: ['Kemperman, J. A.', 'Barnes, B. V.'],
      journal: 'Canadian Journal of Botany',
      year: 1976
    },
    {
      kind: 'peer_reviewed',
      title:
        '\u2018Pando\u2019 lives: Molecular evidence of a giant aspen ' +
        'clone in central Utah',
      authors: [
        'DeWoody, J.', 'Rowe, C. A.', 'Hipkins, V. D.', 'Mock, K. E.'
      ],
      journal: 'Western North American Naturalist',
      year: 2008
    },
    {
      kind: 'peer_reviewed',
      title:
        'Mule deer impede Pando\u2019s recovery: Implications for ' +
        'aspen resilience from a single-genotype forest',
      authors: ['Rogers, P. C.', 'McAvoy, D. J.'],
      journal: 'PLoS ONE',
      year: 2018,
      doi: '10.1371/journal.pone.0203619'
    }
  ],
  editorial: {
    fragment: 'one root, the shape of a forest',
    body:
      'On the southwestern edge of Fishlake, in central Utah, ' +
      'around 47,000 quaking aspen stems share a single root ' +
      'system. Genetic analysis confirms one male clone. Estimates ' +
      'of the clone\u2019s age range from several thousand to ' +
      'tens of thousands of years.\n\n' +
      'The grove reproduces almost entirely by suckering: new ' +
      'stems emerge from the existing roots rather than from seed. ' +
      'Where elk and mule deer concentrate, young suckers are ' +
      'browsed before they can reach the canopy. Decades of repeat ' +
      'photography and stem-density transects document a steady ' +
      'demographic shift toward older, taller stems with little ' +
      'replacement underneath.\n\n' +
      'The visible thing is a forest. The organism is one tree, ' +
      'ageing without children.',
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
