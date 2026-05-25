/**
 * Sundarbans · Bengal tiger, saline swimmer.
 *
 * Mangrove tidal forest in the Ganges–Brahmaputra delta. Panthera
 * tigris tigris regularly swims between forested islands across
 * brackish tidal channels in pursuit of prey and territory.
 *
 * This file is one record. The schema is in
 * `../ecological-narrative.example.ts`. The runtime registry that
 * discovers this file is in `../narrative-registry.ts`.
 */

import type { EcologicalNarrative } from '../ecological-narrative.example';

const narrative: EcologicalNarrative = {
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
      'by swimming between forested islands — a regular behavior in ' +
      'pursuit of prey and territory.',
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
      'the mud — because the saline silt of the delta admits no air. ' +
      'Among them, a tiger that swims.',
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
