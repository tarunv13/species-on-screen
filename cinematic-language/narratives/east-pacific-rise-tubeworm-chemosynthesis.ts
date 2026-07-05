/**
 * East Pacific Rise vent field \u00b7 Riftia pachyptila, chemosynthetic
 * trophic chain.
 *
 * Mid-ocean spreading ridge at roughly 2,500 metres depth. Vents emit
 * mineral-rich, sulfide-laden fluid heated to several hundred degrees
 * by the underlying magma chamber. The vestimentiferan tubeworm
 * Riftia pachyptila clusters around these plumes; adults possess no
 * mouth and no gut. Cavanaugh and Felbeck reported independently in
 * Science in 1981 that the worm's trunk holds a dense organ \u2014 the
 * trophosome \u2014 packed with sulfur-oxidising bacterial endosymbionts
 * that fix inorganic carbon using the energy of sulfide oxidation.
 * The animal's plume haemoglobin shuttles hydrogen sulfide and oxygen
 * down to the bacteria. The trophic chain has no sun in it.
 *
 * This file is one record. The schema is in
 * `../ecological-narrative.example.ts`. The runtime registry that
 * discovers this file is in `../narrative-registry.ts`.
 */

import type { EcologicalNarrative } from '../ecological-narrative.example';

const narrative: EcologicalNarrative = {
  id: 'east-pacific-rise-tubeworm-chemosynthesis',
  place: {
    id: 'east-pacific-rise-vents',
    name: 'East Pacific Rise vent field',
    type: 'hydrothermal vent field',
    countries: ['international waters'],
    coordinates: { latitude: 9.83, longitude: -104.29 },
    editorialPlaceLine:
      'A spreading ridge where the rock heats the water the sun cannot reach.'
  },
  species: {
    id: 'riftia-pachyptila',
    commonName: 'giant tubeworm',
    scientificName: 'Riftia pachyptila',
    taxonomy: { family: 'Siboglinidae', order: 'Sabellida', class: 'Polychaeta' },
    iucnStatus: 'not_evaluated'
  },
  observation: {
    summary:
      'Adult Riftia pachyptila on the East Pacific Rise have neither ' +
      'mouth nor digestive tract; the worm sustains itself entirely ' +
      'on sulfur-oxidising bacterial endosymbionts housed in a dense ' +
      'internal organ, the trophosome, with hydrogen sulfide and ' +
      'oxygen carried to the bacteria by specialised haemoglobins ' +
      'in the external plume \u2014 a trophic chain whose primary ' +
      'production runs on vent chemistry rather than sunlight.',
    type: 'trophic_relation',
    year: [1981, 1991]
  },
  sources: [
    {
      kind: 'peer_reviewed',
      title:
        'Prokaryotic cells in the hydrothermal vent tube worm ' +
        'Riftia pachyptila Jones: possible chemoautotrophic symbionts',
      authors: [
        'Cavanaugh, C. M.', 'Gardiner, S. L.', 'Jones, M. L.',
        'Jannasch, H. W.', 'Waterbury, J. B.'
      ],
      journal: 'Science',
      year: 1981,
      doi: '10.1126/science.213.4505.340'
    },
    {
      kind: 'peer_reviewed',
      title:
        'Chemoautotrophic potential of the hydrothermal vent tube ' +
        'worm, Riftia pachyptila Jones (Vestimentifera)',
      authors: ['Felbeck, H.'],
      journal: 'Science',
      year: 1981,
      doi: '10.1126/science.213.4505.336'
    },
    {
      kind: 'peer_reviewed',
      title:
        'Sulfide and carbon dioxide uptake by the hydrothermal vent ' +
        'tubeworm, Riftia pachyptila, and its bacterial symbionts',
      authors: [
        'Childress, J. J.', 'Fisher, C. R.', 'Favuzzi, J. A.',
        'Sanders, N. K.'
      ],
      journal: 'Physiological Zoology',
      year: 1991
    }
  ],
  editorial: {
    fragment: 'the meal arrives dissolved in the water',
    body:
      'The East Pacific Rise is a spreading boundary between two ' +
      'oceanic plates, opening at roughly five centimetres a year. ' +
      'Where the rock cracks, seawater enters the crust, is heated ' +
      'against the underlying magma, and returns to the seafloor ' +
      'saturated with metals and dissolved hydrogen sulfide. No ' +
      'surface light reaches the depths at which it vents.\n\n' +
      'Around the plumes at roughly 2,500 metres, clusters of ' +
      'white tubes rise from the basalt, capped by red plumes the ' +
      'colour of arterial blood. The animal inside is Riftia ' +
      'pachyptila. The larva briefly carries a gut; the adult has ' +
      'neither mouth nor digestive tract.\n\n' +
      'Cavanaugh and colleagues reported in Science in 1981 that ' +
      'the worm\u2019s trunk holds a dense organ \u2014 the ' +
      'trophosome \u2014 packed with sulfur-oxidising bacteria. ' +
      'Felbeck, in the same issue, demonstrated that those bacteria ' +
      'fix inorganic carbon by chemosynthesis, using the energy of ' +
      'sulfide oxidation. Specialised haemoglobins in the plume ' +
      'carry hydrogen sulfide and oxygen down to the bacteria ' +
      'without disabling either.\n\n' +
      'The trophic chain has no sun in it. The food is the ' +
      'chemistry of the rock.',
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
