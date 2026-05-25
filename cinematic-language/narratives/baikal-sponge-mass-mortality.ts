/**
 * Lake Baikal · Lubomirskia baikalensis, mass mortality of an endemic sponge.
 *
 * Lake Baikal is a rift lake in southern Siberia, more than 1.6
 * kilometres deep and at least 25 million years old. Most of its
 * species are endemic. The Lubomirskiidae are a family of branching
 * freshwater sponges found only in the lake; in shallow nearshore
 * zones their dense, green-tinted colonies were until recently the
 * dominant sessile structure. Since 2011, monitoring sites along
 * the western shore have recorded steady increases in tissue
 * necrosis, colour loss and outright mortality. The associated
 * microbial community has shifted; cyanobacterial symbionts present
 * in healthy tissue are absent or replaced in sick ones. Causes
 * have not been resolved.
 *
 * This file is one record. The schema is in
 * `../ecological-narrative.example.ts`. The runtime registry that
 * discovers this file is in `../narrative-registry.ts`.
 */

import type { EcologicalNarrative } from '../ecological-narrative.example';

const narrative: EcologicalNarrative = {
  id: 'baikal-sponge-mass-mortality',
  place: {
    id: 'lake-baikal',
    name: 'Lake Baikal',
    type: 'oligotrophic ancient rift lake',
    countries: ['Russia'],
    protectedArea: 'Lake Baikal World Heritage Site',
    coordinates: { latitude: 53.5, longitude: 108.5 },
    editorialPlaceLine:
      'A rift lake old enough that most of its life is found nowhere else.'
  },
  species: {
    id: 'lubomirskia-baikalensis',
    commonName: 'Baikal sponge',
    scientificName: 'Lubomirskia baikalensis',
    taxonomy: { family: 'Lubomirskiidae', order: 'Spongillida', class: 'Demospongiae' },
    iucnStatus: 'not_evaluated'
  },
  observation: {
    summary:
      'Since 2011, monitoring sites along the western shore of Lake ' +
      'Baikal have recorded sustained tissue necrosis, colour loss ' +
      'and mortality in colonies of Lubomirskia baikalensis, with a ' +
      'concurrent shift in associated microbial communities; ' +
      'underlying causes have not been established.',
    type: 'threat_dynamic',
    year: [2011, 2019]
  },
  sources: [
    {
      kind: 'peer_reviewed',
      title:
        'Rapid ecological change in the coastal zone of Lake Baikal ' +
        '(East Siberia): Is the site of the world\u2019s greatest ' +
        'freshwater biodiversity in danger?',
      authors: [
        'Timoshkin, O. A.', 'Samsonov, D. P.', 'Yamamuro, M.',
        'Moore, M. V.', 'Belykh, O. I.', 'Malnik, V. V.'
      ],
      journal: 'Journal of Great Lakes Research',
      year: 2016
    },
    {
      kind: 'peer_reviewed',
      title:
        'Current state of the sponge fauna (Porifera: Lubomirskiidae) ' +
        'of Lake Baikal: sponge disease and the problem of ' +
        'conservation of diversity',
      authors: [
        'Khanaev, I. V.', 'Kravtsova, L. S.', 'Maikova, O. O.',
        'Bukshuk, N. A.', 'Sakirko, M. V.', 'Kulakova, N. V.',
        'Butina, T. V.', 'Nebesnykh, I. A.', 'Belikov, S. I.'
      ],
      journal: 'Journal of Great Lakes Research',
      year: 2018
    },
    {
      kind: 'peer_reviewed',
      title:
        'Diversity and shifts of the bacterial community associated ' +
        'with Baikal sponge mass mortalities',
      authors: [
        'Belikov, S. I.', 'Feranchuk, S.', 'Butina, T.',
        'Chernogor, L.', 'Rorex, C.', 'Khanaev, I.',
        'Maikova, O.', 'Kravtsova, L.'
      ],
      journal: 'PLoS ONE',
      year: 2019,
      doi: '10.1371/journal.pone.0213926'
    }
  ],
  editorial: {
    fragment: 'what was green is going pale',
    body:
      'Lake Baikal is a rift lake in southern Siberia, more than ' +
      '1.6 kilometres deep and at least twenty-five million years ' +
      'old. Most of its species are endemic.\n\n' +
      'The Lubomirskiidae are a family of branching freshwater ' +
      'sponges found only in the lake. In shallow nearshore zones, ' +
      'their dense, green-tinted colonies were until recently the ' +
      'dominant sessile structure on rock. Their colour comes from ' +
      'photosynthetic cyanobacteria that live in their tissues.\n\n' +
      'Since 2011, monitoring sites along the western shore have ' +
      'recorded sustained tissue necrosis, loss of colour and ' +
      'mortality in Lubomirskia baikalensis. The associated ' +
      'microbial community has shifted; the cyanobacterial ' +
      'symbionts present in healthy tissue are absent or replaced ' +
      'in sick ones.\n\n' +
      'Causes have not been resolved. The change is recent, ' +
      'ongoing, and observed at multiple independent sites.',
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
