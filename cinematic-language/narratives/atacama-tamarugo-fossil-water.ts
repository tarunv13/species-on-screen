/**
 * Pampa del Tamarugal · tamarugo on a Pleistocene aquifer.
 *
 * Hyperarid desert basin in northern Chile. Prosopis tamarugo holds
 * a canopy where almost no rain falls by tap-rooting many metres
 * into water charged into the basin during the Pleistocene; under
 * sustained groundwater extraction those canopies have thinned and
 * seedling cohorts have failed.
 *
 * This file is one record. The schema is in
 * `../ecological-narrative.example.ts`. The runtime registry that
 * discovers this file is in `../narrative-registry.ts`.
 */

import type { EcologicalNarrative } from '../ecological-narrative.example';

const narrative: EcologicalNarrative = {
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

export default narrative;
