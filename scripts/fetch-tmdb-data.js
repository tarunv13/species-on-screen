import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TMDB_API_KEY = 'ab7c1810da1a84fbc50d3fe313f42a72';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';
const OUTPUT_DIR = resolve(__dirname, '..', 'public', 'data');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ============================================================
// SHARED ACADEMIC REFERENCES
// ============================================================
const SHARED_ACADEMIC_REFERENCES = [
  "Rose, G. (2016). Visual Methodologies: An Introduction to Researching with Visual Materials. 4th ed. London: Sage.",
  "Balmford, A. et al. (2002). Why Conservationists Should Heed Pokemon. Science, 295(5564), pp.2367.",
  "Silk, M.J. et al. (2018). The implications of digital visual media for human-nature relationships. People and Nature, 1(1), pp.1-12.",
  "Jones, J.P.G. et al. (2019). Nature documentaries and saving nature. People and Nature, 1(4), pp.479-491.",
  "Macdonald, E.A. et al. (2016). Conservation inequality and the charismatic cat. Global Ecology and Biogeography, 25(12), pp.1459-1469.",
  "Michie, S. et al. (2011). The behaviour change wheel. Implementation Science, 6(42)."
];

// ============================================================
// SEMANTIC TRAP GENRES (action, crime, thriller, war)
// ============================================================
const TRAP_GENRES = new Set([28, 80, 53, 10752]);

// Nature/wildlife keywords for semantic validation
const NATURE_KEYWORDS = [
  'wildlife', 'nature', 'conservation', 'animal', 'endangered',
  'habitat', 'ecosystem', 'species', 'forest', 'jungle', 'ocean',
  'reef', 'marine', 'safari', 'sanctuary', 'wilderness', 'migration',
  'predator', 'prey', 'ecological', 'biodiversity', 'zoo',
  'documentary', 'national park', 'wild', 'poaching', 'extinction'
];

// ============================================================
// HELPER: Build Wikimedia Commons thumb URL
// ============================================================
function commonsThumbUrl(path) {
  const parts = path.split('/');
  const filename = parts[parts.length - 1];
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/1280px-${filename}`;
}

// ============================================================
// ENRICHMENT DATA: Taxonomy URLs
// ============================================================
const TAXONOMY_URLS = {
  'tiger': { gbif_url: 'https://www.gbif.org/species/5219404', iucn_url: 'https://www.iucnredlist.org/species/15955/221500984' },
  'snow-leopard': { gbif_url: 'https://www.gbif.org/species/2435024', iucn_url: 'https://www.iucnredlist.org/species/22732/102331691' },
  'bornean-orangutan': { gbif_url: 'https://www.gbif.org/species/5219159', iucn_url: 'https://www.iucnredlist.org/species/17975/123809220' },
  'hawksbill-turtle': { gbif_url: 'https://www.gbif.org/species/5220228', iucn_url: 'https://www.iucnredlist.org/species/8005/226534848' },
  'blue-whale': { gbif_url: 'https://www.gbif.org/species/2440172', iucn_url: 'https://www.iucnredlist.org/species/2477/166756914' },
  'african-elephant': { gbif_url: 'https://www.gbif.org/species/5219392', iucn_url: 'https://www.iucnredlist.org/species/181008073/223766485' },
  'polar-bear': { gbif_url: 'https://www.gbif.org/species/2435022', iucn_url: 'https://www.iucnredlist.org/species/22823/166773151' },
  'giant-panda': { gbif_url: 'https://www.gbif.org/species/2435013', iucn_url: 'https://www.iucnredlist.org/species/712/166502858' },
  'staghorn-coral': { gbif_url: 'https://www.gbif.org/species/2690188', iucn_url: 'https://www.iucnredlist.org/species/133381/166791869' },
  'amazon-river-dolphin': { gbif_url: 'https://www.gbif.org/species/2440845', iucn_url: 'https://www.iucnredlist.org/species/10831/123792024' }
};

// ============================================================
// ENRICHMENT DATA: Photos (Wikimedia Commons)
// ============================================================
const PHOTOS = {
  'tiger': [
    { path: '1/1a/24_Sumatran_Tiger.jpg', alt: 'Sumatran tiger in natural habitat', photographer: 'Mohan Moolepetlu', credit: 'Wikimedia Commons, CC BY-SA 4.0' },
    { path: 'c/c5/Tiger_in_Ranthambhore.jpg', alt: 'Bengal tiger in Ranthambore National Park', photographer: 'Koshy Koshy', credit: 'Wikimedia Commons, CC BY 2.0' },
    { path: '3/3a/Panthera_tigris_tigris.jpg', alt: 'Bengal tiger walking through grassland', photographer: 'Charles J. Sharp', credit: 'Wikimedia Commons, CC BY-SA 4.0' }
  ],
  'snow-leopard': [
    { path: 'a/a5/Snow_leopard_in_Chattar_Plain_%28cropped%29.jpg', alt: 'Snow leopard in Chattar Plain', photographer: 'Mohd Irsyad', credit: 'Wikimedia Commons, CC BY-SA 4.0' },
    { path: '2/20/SnowLeopard.jpg', alt: 'Snow leopard on rocky terrain', photographer: 'Bernard Landgraf', credit: 'Wikimedia Commons, CC BY-SA 3.0' },
    { path: '1/13/Snow_Leopard_Relaxing.jpg', alt: 'Snow leopard resting on rocks', photographer: 'Tambako The Jaguar', credit: 'Wikimedia Commons, CC BY-ND 2.0' }
  ],
  'bornean-orangutan': [
    { path: '6/6d/Bornean_Orangutan_%28Pongo_pygmaeus%29_-_young.jpg', alt: 'Young Bornean orangutan in canopy', photographer: 'Eleifert', credit: 'Wikimedia Commons, CC BY-SA 4.0' },
    { path: '0/0c/Pongo_pygmaeus_%28orangutang%29.jpg', alt: 'Bornean orangutan portrait', photographer: 'Mikael Haggstrom', credit: 'Wikimedia Commons, Public Domain' },
    { path: 'e/e1/Orang_Utan%2C_Pair.jpg', alt: 'Pair of orangutans in Borneo', photographer: 'Malene Thyssen', credit: 'Wikimedia Commons, CC BY-SA 3.0' }
  ],
  'hawksbill-turtle': [
    { path: '5/5b/Hawksbill_Sea_Turtle_Carey_de_Concha_%28rev%29.jpg', alt: 'Hawksbill sea turtle swimming over reef', photographer: 'Thierry Caro', credit: 'Wikimedia Commons, CC BY-SA 3.0' },
    { path: '9/9a/Eretmochelys-imbricata-K%C3%A9lonia-2.JPG', alt: 'Hawksbill turtle at Kelonia', photographer: 'B.navez', credit: 'Wikimedia Commons, CC BY-SA 3.0' },
    { path: 'b/b0/Hawksbill_Turtle_at_Tortuguero_National_Park.jpg', alt: 'Hawksbill turtle at Tortuguero National Park', photographer: 'David Stanley', credit: 'Wikimedia Commons, CC BY 2.0' }
  ],
  'blue-whale': [
    { path: '1/1c/Blue_Whale_001.jpg', alt: 'Blue whale surfacing in open ocean', photographer: 'NOAA', credit: 'Wikimedia Commons, Public Domain' },
    { path: '9/9a/Blue_whale_tail.jpg', alt: 'Blue whale tail fluke', photographer: 'Mike Baird', credit: 'Wikimedia Commons, CC BY 2.0' },
    { path: 'f/f0/Blue_Whale_Breaching.jpg', alt: 'Blue whale breaching', photographer: 'Merrill Gosho, NOAA', credit: 'Wikimedia Commons, Public Domain' }
  ],
  'african-elephant': [
    { path: '3/37/African_Bush_Elephant.jpg', alt: 'African bush elephant in savanna', photographer: 'Gorgo', credit: 'Wikimedia Commons, Public Domain' },
    { path: '3/32/African_Elephant_%28Loxodonta_africana%29_bull_%2831100819046%29.jpg', alt: 'African elephant bull', photographer: 'Bernard DUPONT', credit: 'Wikimedia Commons, CC BY-SA 2.0' },
    { path: '9/91/African_Elephant_in_Serengeti.jpg', alt: 'African elephant in Serengeti', photographer: 'Ikiwaner', credit: 'Wikimedia Commons, GFDL 1.2' }
  ],
  'polar-bear': [
    { path: '6/66/Polar_Bear_-_Alaska_%28cropped%29.jpg', alt: 'Polar bear in Alaska', photographer: 'Alan D. Wilson', credit: 'Wikimedia Commons, CC BY-SA 3.0' },
    { path: 'd/dc/Polar_Bear_2004-11-15.jpg', alt: 'Polar bear walking on snow', photographer: 'Ansgar Walk', credit: 'Wikimedia Commons, CC BY-SA 2.5' },
    { path: '8/84/Polar_Bear_-_Alaska.jpg', alt: 'Polar bear on ice in Alaska', photographer: 'Alan D. Wilson', credit: 'Wikimedia Commons, CC BY-SA 3.0' }
  ],
  'giant-panda': [
    { path: '0/0f/Grosser_Panda.JPG', alt: 'Giant panda eating bamboo', photographer: 'J. Patrick Fischer', credit: 'Wikimedia Commons, CC BY-SA 3.0' },
    { path: '3/3c/Giant_Panda_eating_Bamboo.JPG', alt: 'Giant panda chewing bamboo stem', photographer: 'Chen Wu', credit: 'Wikimedia Commons, CC BY 2.0' },
    { path: '4/41/Giant_panda_at_Vienna_Zoo_%28cropped%29.jpg', alt: 'Giant panda at Vienna Zoo', photographer: 'Manyman', credit: 'Wikimedia Commons, CC BY-SA 3.0' }
  ],
  'staghorn-coral': [
    { path: '4/44/Staghorn-coral-1.jpg', alt: 'Staghorn coral colony on reef', photographer: 'Acropora', credit: 'Wikimedia Commons, CC BY-SA 3.0' },
    { path: '2/25/Staghorn_coral_reefscape.jpg', alt: 'Staghorn coral reefscape', photographer: 'NOAA', credit: 'Wikimedia Commons, Public Domain' },
    { path: '8/84/Acropora_cervicornis.jpg', alt: 'Acropora cervicornis branches', photographer: 'NOAA', credit: 'Wikimedia Commons, Public Domain' }
  ],
  'amazon-river-dolphin': [
    { path: '0/0a/Amazon_river_dolphin_with_mouth_open.jpg', alt: 'Amazon river dolphin with mouth open', photographer: 'Jorge Andrade', credit: 'Wikimedia Commons, CC BY 2.0' },
    { path: '9/96/Amazon_river_dolphin.jpg', alt: 'Amazon river dolphin surfacing', photographer: 'Jorge Andrade', credit: 'Wikimedia Commons, CC BY 2.0' },
    { path: '3/30/Inia_geoffrensis.jpg', alt: 'Pink river dolphin in Amazon waters', photographer: 'Oceancetaceen', credit: 'Wikimedia Commons, CC BY-SA 2.0 DE' }
  ]
};

// ============================================================
// ENRICHMENT DATA: Cultural Depth
// ============================================================
const CULTURAL_DEPTH = {
  'tiger': {
    india_waghoba: {
      description: 'The Warli tribe of Maharashtra worship Waghoba, a tiger deity believed to protect villages from harm. Shrines at forest edges mark the boundary between human and tiger territory, and rituals ensure peaceful coexistence between communities and the great cats.',
      source: 'Karanth, K.K. et al. (2016)',
      source_url: 'https://doi.org/10.1017/S0030605316001101'
    },
    india_sundarbans: {
      description: 'In the Sundarbans mangrove forest, the goddess Bonbibi is worshipped as protector of forest-goers against tiger attacks. Honey collectors and fishers recite her legend before entering the forest, seeking divine protection from the man-eating tigers of the delta.',
      source: 'Jalais, A. (2010). Forest of Tigers. Routledge.',
      source_url: 'https://doi.org/10.4324/9780203847275'
    },
    china_zodiac: {
      description: 'The tiger is the third animal of the Chinese zodiac, representing bravery, power, and authority. In traditional Chinese medicine, tiger bone was prescribed for joint ailments, driving centuries of demand that contributed to wild population collapse.',
      source: 'Gratwicke, B. et al. (2008)',
      source_url: 'https://doi.org/10.1371/journal.pone.0003584'
    },
    korea_horangi: {
      description: 'The horangi (tiger) is a foundational symbol in Korean culture, appearing in the Dangun creation myth as a patient creature that earned human form. Tigers appear in Korean art as guardians, tricksters, and symbols of Korean identity and resilience.',
      source: 'National Museum of Korea',
      source_url: 'https://www.museum.go.kr/site/eng/content/permanent-exhibitions'
    }
  },
  'snow-leopard': {
    central_asia_mountain_spirit: {
      description: 'Across Central Asian pastoral communities, the snow leopard is considered a sacred mountain spirit whose presence indicates the health of alpine ecosystems. Killing one is believed to bring misfortune upon the herder and their family for generations.',
      source: 'Snow Leopard Trust Research',
      source_url: 'https://snowleopard.org/research/'
    },
    tibet_buddhist: {
      description: 'In Tibetan Buddhist iconography, the snow leopard appears as a symbol of meditation and solitary contemplation. Monasteries in snow leopard range have become important allies in conservation, with monks monitoring populations and discouraging poaching among local communities.',
      source: 'Li, J. et al. (2016)',
      source_url: 'https://doi.org/10.1111/cobi.12612'
    },
    kyrgyz_folklore: {
      description: 'In Kyrgyz folklore, the ilbirs (snow leopard) is a mystical guardian of mountain pastures. Traditional stories describe snow leopards as shape-shifting spirits that test the virtue of hunters, rewarding those who show restraint and punishing the greedy.',
      source: 'Global Snow Leopard & Ecosystem Protection Program',
      source_url: 'https://globalsnowleopard.org/'
    }
  },
  'bornean-orangutan': {
    dayak_forest_people: {
      description: 'The Dayak peoples of Borneo hold orangutans as forest guardians with near-human intelligence. Traditional stories describe orangutans as humans who retreated into the forest to avoid work or conflict, and some communities maintain taboos against hunting them.',
      source: 'Meijaard, E. et al. (2011)',
      source_url: 'https://doi.org/10.1371/journal.pone.0027491'
    },
    malay_etymology: {
      description: 'The name "orangutan" derives from Malay "orang hutan" meaning "person of the forest," reflecting the deep cultural recognition of their humanlike qualities. This linguistic connection reveals centuries of coexistence and the perception of orangutans as almost-human forest dwellers.',
      source: 'Rijksen, H.D. & Meijaard, E. (1999). Our Vanishing Relative. Kluwer Academic.',
      source_url: 'https://doi.org/10.1007/978-94-011-4521-1'
    },
    western_science: {
      description: 'Western scientific encounters with orangutans from the 17th century onward challenged European notions of human uniqueness. Alfred Russel Wallace observed orangutans in Borneo during his development of natural selection theory, describing their tool use and problem-solving with astonishment.',
      source: 'Wallace, A.R. (1869). The Malay Archipelago.',
      source_url: 'https://www.gutenberg.org/ebooks/2530'
    }
  },
  'hawksbill-turtle': {
    pacific_islands_navigation: {
      description: 'Pacific Island navigators observed sea turtle movements to locate distant islands and predict weather patterns. Hawksbill turtles, associated with reef systems, signalled the presence of shallow water and potential landfalls to voyagers crossing vast oceanic distances.',
      source: 'Johannes, R.E. (1981). Words of the Lagoon. UC Press.',
      source_url: 'https://doi.org/10.1525/9780520309135'
    },
    caribbean_shell_craft: {
      description: 'Caribbean and Mediterranean artisans transformed hawksbill shell (tortoiseshell) into combs, jewelry, and decorative objects for over two millennia. This trade, dating to ancient Rome, created demand that persisted into the 20th century and devastated populations.',
      source: 'Mortimer, J.A. & Donnelly, M. (2008)',
      source_url: 'https://www.iucnredlist.org/species/8005/226534848'
    },
    mesoamerica_mythology: {
      description: 'In Mayan cosmology, sea turtles carried the Earth on their backs and were associated with creation and renewal. The turtle glyph appears in Mayan calendrics, and turtle imagery adorns temples at coastal sites throughout the Yucatan Peninsula.',
      source: 'Miller, M.E. & Taube, K. (1993). The Gods and Symbols of Ancient Mexico and the Maya. Thames & Hudson.',
      source_url: 'https://www.Thames&Hudson.com'
    }
  },
  'blue-whale': {
    maori_tangaroa: {
      description: 'In Maori tradition, whales are descendants of Tangaroa, god of the sea, and are treated as sacred taonga (treasures). Whale strandings are viewed as gifts from the ocean requiring proper karakia (prayer) and respectful treatment of the remains.',
      source: 'Te Papa Tongarewa Museum of New Zealand',
      source_url: 'https://www.tepapa.govt.nz/discover-collections/read-watch-play/maori/whales-te-ao-maori'
    },
    inuit_sea_spirits: {
      description: 'Inuit cosmology connects whales to Sedna, goddess of sea creatures, who releases marine mammals to hunters who follow proper spiritual protocols. The bowhead whale hunt remains a central cultural practice for Arctic peoples, governed by elaborate spiritual preparation.',
      source: 'Laugrand, F. & Oosten, J. (2015). Hunters, Predators and Prey. Berghahn Books.',
      source_url: 'https://doi.org/10.3167/9781782384908'
    },
    basque_whaling: {
      description: 'Basque whalers were among the first to hunt large whales commercially from the 11th century, developing technologies later adopted worldwide. Their pursuit of right whales and eventual depletion of Atlantic stocks established the pattern of industrial overexploitation that nearly eliminated blue whales by the 20th century.',
      source: 'Aguilar, A. (1986). A Review of Old Basque Whaling.',
      source_url: 'https://doi.org/10.1017/S0030605300023049'
    }
  },
  'african-elephant': {
    hindu_ganesh: {
      description: 'Ganesha, the elephant-headed Hindu deity, is worshipped as the remover of obstacles and god of beginnings. Representing wisdom, learning, and auspiciousness, Ganesha is invoked at the start of new ventures and is among the most widely worshipped deities across South and Southeast Asia.',
      source: 'Brown, R.L. (1991). Ganesh: Studies of an Asian God. SUNY Press.',
      source_url: 'https://sunypress.edu/Books/G/Ganesh'
    },
    west_african_wisdom: {
      description: 'In West African folklore, the elephant is the wisest of animals, serving as judge and mediator in disputes among forest creatures. Akan proverbs teach that the elephant never tires of carrying its tusks, symbolizing the patient bearing of responsibility and leadership.',
      source: 'Yankah, K. (2012). The Proverb in the Context of Akan Rhetoric. Diasporic Africa Press.',
      source_url: 'https://doi.org/10.2307/j.ctvh8r0rz'
    },
    maasai_coexistence: {
      description: 'Maasai pastoralists have coexisted with elephants for centuries, developing cultural practices that minimize conflict. Elephants are respected as intelligent beings, and Maasai traditional knowledge of elephant behavior and movement patterns now informs modern conservation corridor planning.',
      source: 'Western, D. (2019). The Amboseli Elephants. University of Chicago Press.',
      source_url: 'https://doi.org/10.7208/chicago/9780226001708.001.0001'
    }
  },
  'polar-bear': {
    inuit_nanuq: {
      description: 'In Inuit cosmology, Nanuq (the polar bear) is a powerful spiritual being deserving of profound respect. Traditional hunting protocols require specific prayers, songs, and offerings. The polar bear is considered the most intelligent and dangerous of Arctic animals, capable of understanding human speech.',
      source: 'Dowsley, M. & Wenzel, G. (2008)',
      source_url: 'https://doi.org/10.1007/s10745-008-9174-7'
    },
    norse_mythology: {
      description: 'In Norse mythology, the ice bear appears as a form taken by warriors and gods. The berserkers, elite Viking warriors, wore bear skins and channeled ursine ferocity in battle. The polar bear pelt was among the most prized gifts exchanged between Nordic royalty.',
      source: 'Pluskowski, A. (2006). Wolves and the Wilderness in the Middle Ages. Boydell Press.',
      source_url: 'https://boydellandbrewer.com/9781843831532/wolves-and-the-wilderness-in-the-middle-ages/'
    },
    sami_tradition: {
      description: 'The Sami people of northern Scandinavia maintain traditional beliefs about the bear as a sacred ancestor requiring elaborate funeral rites after a hunt. Bear ceremonies, documented since the 17th century, reflect deep spiritual connections between Arctic peoples and ursine predators.',
      source: 'Ingold, T. (1994). From Trust to Domination. In: Manning & Serpell (eds) Animals and Human Society.',
      source_url: 'https://doi.org/10.4324/9780203421444'
    }
  },
  'giant-panda': {
    chinese_yinyang: {
      description: 'The giant panda has been described in Chinese texts for over two thousand years as a symbol of yin-yang balance, its black and white coloring representing the harmony of opposing forces in nature. Ancient texts describe the mo (panda) as a peaceful creature capable of mediating between warring states.',
      source: 'Schaller, G.B. (1993). The Last Panda. University of Chicago Press.',
      source_url: 'https://doi.org/10.7208/chicago/9780226736761.001.0001'
    },
    diplomatic_symbol: {
      description: 'China has practiced "panda diplomacy" since the Tang Dynasty, gifting pandas to allied nations. In the modern era, panda loans serve as diplomatic tools, with China lending pandas to countries that sign favorable trade agreements or maintain strong bilateral relations.',
      source: 'Buckingham, K.C. et al. (2013)',
      source_url: 'https://doi.org/10.1007/s10668-013-9449-3'
    },
    conservation_icon: {
      description: 'Since 1961, the giant panda has served as the logo of the World Wildlife Fund (WWF), making it arguably the most recognized conservation symbol globally. This single-species branding has raised billions for conservation while also drawing criticism for disproportionate resource allocation.',
      source: 'WWF International',
      source_url: 'https://www.worldwildlife.org/species/giant-panda'
    }
  },
  'staghorn-coral': {
    mediterranean_medusa: {
      description: 'Ancient Greeks and Romans believed coral was formed from the blood of Medusa when Perseus laid her severed head upon the seashore. Red coral (Corallium rubrum) became a powerful protective amulet worn to ward off evil spirits and ill fortune throughout the Mediterranean world.',
      source: 'Tescione, G. (1973). The Italians and Their Coral Fishing. Fausto Fiorentino.',
      source_url: 'https://www.biodiversitylibrary.org/page/27078392'
    },
    pacific_ancestor: {
      description: 'Pacific Island cultures view coral reefs as ancestral formations, living structures built by the accumulated work of countless generations. In some Polynesian traditions, specific reef formations are associated with particular family lineages and their destruction is a form of ancestral desecration.',
      source: 'Veitayaki, J. (2002). Taking the Last Harvest. University of the South Pacific.',
      source_url: 'https://doi.org/10.1016/S0964-5691(02)00012-6'
    },
    modern_canary: {
      description: 'Contemporary marine science positions coral reefs as "canaries in the coal mine" for global climate change. Their visible bleaching and death provide an emotionally compelling indicator of ocean warming that has galvanized public concern and policy action on emissions reduction.',
      source: 'Hughes, T.P. et al. (2017)',
      source_url: 'https://doi.org/10.1038/nature21707'
    }
  },
  'amazon-river-dolphin': {
    amazonian_boto_encantado: {
      description: 'In Amazonian folklore, the boto encantado (enchanted dolphin) transforms into a handsome young man dressed in white who seduces women at riverside festivals. This shapeshifting mythology historically provided protection for river dolphins, as killing one was believed to bring terrible misfortune.',
      source: 'Slater, C. (1994). Dance of the Dolphin. University of Chicago Press.',
      source_url: 'https://doi.org/10.7208/chicago/9780226761954.001.0001'
    },
    tupi_guardian: {
      description: 'The Tupi-Guarani peoples regard the boto as a guardian of rivers and fish, a spiritual intermediary between the underwater and human worlds. Fishers believe dolphins guide fish toward their nets when treated with respect, and harming a dolphin brings poor catches.',
      source: 'da Silva, V.M.F. & Best, R.C. (1996)',
      source_url: 'https://doi.org/10.1017/S0952836996000456'
    },
    colonial_encounter: {
      description: 'European naturalists encountering Amazon river dolphins in the 18th and 19th centuries were astonished by their pink coloration and flexible necks, features unknown in marine dolphins. These observations contributed to understanding cetacean diversity and the independent evolution of freshwater dolphin lineages.',
      source: 'Best, R.C. & da Silva, V.M.F. (1989). Amazon River Dolphin. In: Ridgway & Harrison (eds) Handbook of Marine Mammals.',
      source_url: 'https://doi.org/10.1016/B978-0-12-588504-1.50009-0'
    }
  }
};

// ============================================================
// ENRICHMENT DATA: COM-B (with sources)
// ============================================================
const COM_B = {
  'tiger': {
    capability: [
      { text: 'Lack of local knowledge about coexistence strategies', source: 'Karanth et al. (2016)', source_url: 'https://doi.org/10.1017/S0030605316001101' },
      { text: 'Limited ranger capacity for anti-poaching patrols', source: 'Linkie et al. (2015)', source_url: 'https://doi.org/10.1016/j.biocon.2015.06.012' },
      { text: 'Insufficient forensic tools for wildlife crime prosecution', source: 'TRAFFIC (2020)', source_url: 'https://www.traffic.org/publications/reports/reduced-to-skin-and-bones-revisited/' }
    ],
    opportunity: [
      { text: 'Expanding agriculture encroaches on forest corridors', source: 'Joshi et al. (2016)', source_url: 'https://doi.org/10.1016/j.biocon.2016.07.032' },
      { text: 'Black market demand creates financial incentive for poaching', source: 'TRAFFIC (2020)', source_url: 'https://www.traffic.org/publications/reports/reduced-to-skin-and-bones-revisited/' },
      { text: 'Inadequate cross-border enforcement between range states', source: 'Global Tiger Initiative', source_url: 'https://www.worldbank.org/en/topic/environment/brief/the-global-tiger-initiative' }
    ],
    motivation: [
      { text: 'Short-term economic gain from land conversion outweighs conservation value', source: 'Joshi et al. (2016)', source_url: 'https://doi.org/10.1016/j.biocon.2016.07.032' },
      { text: 'Cultural beliefs drive demand for tiger bone medicine', source: 'Gratwicke et al. (2008)', source_url: 'https://doi.org/10.1371/journal.pone.0003584' },
      { text: 'Retaliatory killing perceived as necessary for community safety', source: 'Inskip & Zimmermann (2009)', source_url: 'https://doi.org/10.1017/S0030605309990728' }
    ]
  },
  'snow-leopard': {
    capability: [
      { text: 'Remote communities lack livestock protection infrastructure', source: 'Jackson et al. (2010)', source_url: 'https://doi.org/10.1017/S0030605310000190' },
      { text: 'Limited veterinary support increases perceived losses to predation', source: 'Snow Leopard Trust', source_url: 'https://snowleopard.org/what-we-do/community-programs/' },
      { text: 'Insufficient monitoring technology in harsh terrain', source: 'Sharma et al. (2014)', source_url: 'https://doi.org/10.1017/S0030605313000483' }
    ],
    opportunity: [
      { text: 'Mining concessions granted in core habitat areas', source: 'Rosen et al. (2012)', source_url: 'https://doi.org/10.1016/j.biocon.2012.08.020' },
      { text: 'Climate change shifting tree lines reduces available alpine territory', source: 'Forrest et al. (2012)', source_url: 'https://doi.org/10.1016/j.biocon.2012.01.048' },
      { text: 'Cross-border cooperation hampered by geopolitical tensions', source: 'GSLEP Secretariat', source_url: 'https://globalsnowleopard.org/' }
    ],
    motivation: [
      { text: 'Livestock losses represent catastrophic economic damage for herders', source: 'Mishra et al. (2003)', source_url: 'https://doi.org/10.1016/S0006-3207(02)00318-X' },
      { text: 'Pelt trade offers significant income in impoverished regions', source: 'Nowell et al. (2016)', source_url: 'https://www.traffic.org/publications/reports/an-ounce-of-prevention/' },
      { text: 'Low awareness of snow leopard ecological importance among local communities', source: 'Li et al. (2016)', source_url: 'https://doi.org/10.1111/cobi.12612' }
    ]
  },
  'bornean-orangutan': {
    capability: [
      { text: 'Consumers unable to identify palm oil in products', source: 'Ostfeld et al. (2019)', source_url: 'https://doi.org/10.1016/j.scitotenv.2019.02.266' },
      { text: 'Smallholder farmers lack alternative livelihood training', source: 'Wich et al. (2012)', source_url: 'https://doi.org/10.1371/journal.pone.0049525' },
      { text: 'Rescue centres overwhelmed with displaced orphan orangutans', source: 'Borneo Orangutan Survival Foundation', source_url: 'https://www.orangutan.or.id/' }
    ],
    opportunity: [
      { text: 'Global palm oil demand creates irresistible economic pressure on forests', source: 'Meijaard et al. (2020)', source_url: 'https://doi.org/10.1016/j.oneear.2020.10.009' },
      { text: 'Weak enforcement of forestry laws in remote Borneo', source: 'Wich et al. (2012)', source_url: 'https://doi.org/10.1371/journal.pone.0049525' },
      { text: 'Fire as cheap land-clearing method remains accessible', source: 'Cattau et al. (2016)', source_url: 'https://doi.org/10.1073/pnas.1523785113' }
    ],
    motivation: [
      { text: 'Palm oil highly profitable compared to sustainable alternatives', source: 'Meijaard et al. (2020)', source_url: 'https://doi.org/10.1016/j.oneear.2020.10.009' },
      { text: 'Consumer disconnect between products and deforestation', source: 'Ostfeld et al. (2019)', source_url: 'https://doi.org/10.1016/j.scitotenv.2019.02.266' },
      { text: 'Short election cycles discourage long-term forest protection policies', source: 'Abood et al. (2015)', source_url: 'https://doi.org/10.1371/journal.pone.0101654' }
    ]
  },
  'hawksbill-turtle': {
    capability: [
      { text: 'Fishing communities lack affordable bycatch-reduction technology', source: 'Gilman et al. (2010)', source_url: 'https://doi.org/10.3354/esr00171' },
      { text: 'Limited public understanding of reef-turtle ecological linkage', source: 'Meylan & Donnelly (1999)', source_url: 'https://doi.org/10.2744/1071-8443(1999)003[0200:SJFLTH]2.0.CO;2' },
      { text: 'Coastal managers lack tools to monitor nesting beach disturbance', source: 'Sea Turtle Conservancy', source_url: 'https://conserveturtles.org/information-about-sea-turtles/' }
    ],
    opportunity: [
      { text: 'International shell trade persists through enforcement gaps', source: 'CITES Trade Database', source_url: 'https://trade.cites.org/' },
      { text: 'Coastal tourism development prioritized over nesting habitat protection', source: 'Witherington & Martin (2003)', source_url: 'https://doi.org/10.1016/S0006-3207(02)00297-5' },
      { text: 'Climate change degrading reef feeding grounds beyond local control', source: 'Hawkes et al. (2009)', source_url: 'https://doi.org/10.1016/j.tree.2009.06.009' }
    ],
    motivation: [
      { text: 'Tortoiseshell products culturally valued in East Asian markets', source: 'TRAFFIC (2019)', source_url: 'https://www.traffic.org/publications/reports/shell-shocked/' },
      { text: 'Egg harvesting seen as traditional right in coastal communities', source: 'Campbell (2003)', source_url: 'https://doi.org/10.1016/S0006-3207(02)00401-9' },
      { text: 'Economic returns from coastal development exceed conservation funding', source: 'Wilson et al. (2006)', source_url: 'https://doi.org/10.1126/science.1131774' }
    ]
  },
  'blue-whale': {
    capability: [
      { text: 'Shipping industry lacks affordable speed-reduction technology for whale zones', source: 'Laist et al. (2001)', source_url: 'https://doi.org/10.1111/j.1748-7692.2001.tb00980.x' },
      { text: 'Limited real-time whale detection systems for vessel operators', source: 'Silber et al. (2012)', source_url: 'https://doi.org/10.3354/esr00508' },
      { text: 'Difficulty monitoring vast oceanic ranges', source: 'Branch et al. (2004)', source_url: 'https://doi.org/10.1111/j.1748-7692.2004.tb01190.x' }
    ],
    opportunity: [
      { text: 'International shipping lanes overlap with critical feeding areas', source: 'Redfern et al. (2013)', source_url: 'https://doi.org/10.1016/j.biocon.2013.05.005' },
      { text: 'Climate change shifting krill distributions into busier waters', source: 'Atkinson et al. (2004)', source_url: 'https://doi.org/10.1038/nature02996' },
      { text: 'Noise pollution regulations difficult to enforce in international waters', source: 'Erbe et al. (2019)', source_url: 'https://doi.org/10.3389/fmars.2019.00606' }
    ],
    motivation: [
      { text: 'Economic pressure to maintain shipping schedules over speed reductions', source: 'Conn & Silber (2013)', source_url: 'https://doi.org/10.1890/ES13-00106.1' },
      { text: 'Whaling moratorium compliance varies by nation', source: 'IWC', source_url: 'https://iwc.int/management-and-conservation/whaling/moratorium' },
      { text: 'Public disconnect from open-ocean conservation issues due to remoteness', source: 'Jones et al. (2019)', source_url: 'https://doi.org/10.1002/pan3.10053' }
    ]
  },
  'african-elephant': {
    capability: [
      { text: 'Rangers under-equipped and outnumbered by poaching networks', source: 'Henson et al. (2016)', source_url: 'https://doi.org/10.1016/j.biocon.2016.09.027' },
      { text: 'Communities lack tools for non-lethal crop protection', source: 'Sitati et al. (2003)', source_url: 'https://doi.org/10.1017/S0030605303000347' },
      { text: 'Corruption undermines law enforcement at multiple levels', source: 'UNODC (2020)', source_url: 'https://www.unodc.org/unodc/en/data-and-analysis/wildlife.html' }
    ],
    opportunity: [
      { text: 'International ivory demand creates lucrative black market', source: 'Wittemyer et al. (2014)', source_url: 'https://doi.org/10.1073/pnas.1403984111' },
      { text: 'Vast ranges impossible to patrol effectively', source: 'Chase et al. (2016)', source_url: 'https://doi.org/10.7717/peerj.2354' },
      { text: 'Political instability enables armed poaching gangs', source: 'UNEP et al. (2013)', source_url: 'https://www.unep.org/resources/report/elephants-dust-african-elephant-crisis' }
    ],
    motivation: [
      { text: 'Ivory prices incentivize poaching above legitimate income sources', source: 'Wittemyer et al. (2014)', source_url: 'https://doi.org/10.1073/pnas.1403984111' },
      { text: 'Human-elephant conflict drives retaliatory killing', source: 'Sitati et al. (2003)', source_url: 'https://doi.org/10.1017/S0030605303000347' },
      { text: 'Demand for ivory as status symbol persists despite bans', source: 'Gao & Clark (2014)', source_url: 'https://doi.org/10.1016/j.biocon.2014.06.013' }
    ]
  },
  'polar-bear': {
    capability: [
      { text: 'Global emissions reduction requires systemic change beyond individual action', source: 'Amstrup et al. (2010)', source_url: 'https://doi.org/10.1038/nature09653' },
      { text: 'Arctic communities lack infrastructure to manage increasing bear encounters', source: 'Wilder et al. (2017)', source_url: 'https://doi.org/10.1002/wsb.783' },
      { text: 'Limited ability to create artificial feeding opportunities during extended ice-free periods', source: 'Stirling & Derocher (2012)', source_url: 'https://doi.org/10.1111/j.1365-2486.2012.02753.x' }
    ],
    opportunity: [
      { text: 'Fossil fuel infrastructure expanding into Arctic as ice retreats', source: 'Laidre et al. (2015)', source_url: 'https://doi.org/10.1111/cobi.12474' },
      { text: 'International climate agreements insufficient to halt warming trajectory', source: 'IPCC (2021)', source_url: 'https://www.ipcc.ch/report/ar6/wg1/' },
      { text: 'Arctic shipping routes opening, increasing disturbance', source: 'Hauser et al. (2018)', source_url: 'https://doi.org/10.1002/ece3.4518' }
    ],
    motivation: [
      { text: 'Economic incentives for Arctic resource extraction outweigh conservation concerns', source: 'Laidre et al. (2015)', source_url: 'https://doi.org/10.1111/cobi.12474' },
      { text: 'Climate change denial delays necessary policy action', source: 'Stirling & Derocher (2012)', source_url: 'https://doi.org/10.1111/j.1365-2486.2012.02753.x' },
      { text: 'Geographic remoteness reduces public urgency for Arctic protection', source: 'Silk et al. (2018)', source_url: 'https://doi.org/10.1002/pan3.6' }
    ]
  },
  'giant-panda': {
    capability: [
      { text: 'Bamboo corridor restoration requires decades of growth', source: 'Swaisgood et al. (2011)', source_url: 'https://doi.org/10.1111/j.1749-4877.2011.00247.x' },
      { text: 'Captive breeding struggles with low reproductive rates', source: 'Zhang et al. (2004)', source_url: 'https://doi.org/10.1126/science.1104407' },
      { text: 'Genetic management across fragmented populations technically challenging', source: 'Wei et al. (2015)', source_url: 'https://doi.org/10.1111/cobi.12582' }
    ],
    opportunity: [
      { text: 'Infrastructure development continues to fragment remaining habitat', source: 'Li et al. (2015)', source_url: 'https://doi.org/10.1016/j.biocon.2015.09.024' },
      { text: 'Climate change altering bamboo distribution faster than corridors can be restored', source: 'Tuanmu et al. (2013)', source_url: 'https://doi.org/10.1111/ele.12025' },
      { text: 'Tourism pressure on reserves increasing with prosperity', source: 'Zhou & Grumbine (2011)', source_url: 'https://doi.org/10.1016/j.biocon.2011.02.016' }
    ],
    motivation: [
      { text: 'Panda conservation heavily funded but benefits concentrated on one species', source: 'Macdonald et al. (2016)', source_url: 'https://doi.org/10.1111/geb.12374' },
      { text: 'Political symbolism sometimes prioritized over ecological effectiveness', source: 'Buckingham et al. (2013)', source_url: 'https://doi.org/10.1007/s10668-013-9449-3' },
      { text: 'Public preference for charismatic megafauna skews funding allocation', source: 'Macdonald et al. (2016)', source_url: 'https://doi.org/10.1111/geb.12374' }
    ]
  },
  'staghorn-coral': {
    capability: [
      { text: 'Coral restoration techniques cannot scale to match rate of loss', source: 'Boström-Einarsson et al. (2020)', source_url: 'https://doi.org/10.1371/journal.pone.0226631' },
      { text: 'Disease mechanisms poorly understood limiting treatment options', source: 'Aronson & Precht (2001)', source_url: 'https://doi.org/10.1023/A:1013103928980' },
      { text: 'Public cannot directly observe reef decline without diving equipment', source: 'Jones et al. (2019)', source_url: 'https://doi.org/10.1002/pan3.10053' }
    ],
    opportunity: [
      { text: 'Global CO2 emissions continue rising despite climate agreements', source: 'IPCC (2022)', source_url: 'https://www.ipcc.ch/report/ar6/wg2/' },
      { text: 'Coastal development runoff unregulated in many reef regions', source: 'Fabricius (2005)', source_url: 'https://doi.org/10.1016/j.marpolbul.2004.11.028' },
      { text: 'Marine protected areas cover insufficient reef area', source: 'Hughes et al. (2017)', source_url: 'https://doi.org/10.1038/nature21707' }
    ],
    motivation: [
      { text: 'Climate action perceived as economically costly in short term', source: 'IPCC (2022)', source_url: 'https://www.ipcc.ch/report/ar6/wg3/' },
      { text: 'Reef degradation invisible to most voters and policymakers', source: 'Jones et al. (2019)', source_url: 'https://doi.org/10.1002/pan3.10053' },
      { text: 'Tourism industry slow to invest in reef protection versus exploitation', source: 'Spalding et al. (2017)', source_url: 'https://doi.org/10.1016/j.marpol.2017.01.022' }
    ]
  },
  'amazon-river-dolphin': {
    capability: [
      { text: 'Fishers lack bycatch prevention technology for river gillnets', source: 'Mintzer et al. (2013)', source_url: 'https://doi.org/10.1016/j.biocon.2013.05.016' },
      { text: 'Mercury monitoring systems inadequate across vast river network', source: 'Mosquera-Guerra et al. (2019)', source_url: 'https://doi.org/10.1016/j.scitotenv.2018.12.122' },
      { text: 'Limited scientific capacity to survey remote river populations', source: 'da Silva et al. (2018)', source_url: 'https://www.iucnredlist.org/species/10831/123792024' }
    ],
    opportunity: [
      { text: 'Dam construction accelerating across Amazon tributaries', source: 'Latrubesse et al. (2017)', source_url: 'https://doi.org/10.1038/nature21763' },
      { text: 'Gold mining expanding into previously inaccessible areas', source: 'Mosquera-Guerra et al. (2019)', source_url: 'https://doi.org/10.1016/j.scitotenv.2018.12.122' },
      { text: 'Weak environmental enforcement in remote river communities', source: 'Mintzer et al. (2013)', source_url: 'https://doi.org/10.1016/j.biocon.2013.05.016' }
    ],
    motivation: [
      { text: 'Hydroelectric power prioritized as "green" energy despite biodiversity impact', source: 'Latrubesse et al. (2017)', source_url: 'https://doi.org/10.1038/nature21763' },
      { text: 'Dolphins perceived as fishing competitors by local communities', source: 'Mintzer et al. (2013)', source_url: 'https://doi.org/10.1016/j.biocon.2013.05.016' },
      { text: 'Gold mining provides livelihood in areas with few economic alternatives', source: 'Asner et al. (2013)', source_url: 'https://doi.org/10.1073/pnas.1318271110' }
    ]
  }
};

// ============================================================
// ENRICHMENT DATA: Interesting Facts (with source URLs)
// ============================================================
const INTERESTING_FACTS = {
  'tiger': [
    { text: 'No two tigers have the same stripe pattern; their markings are as unique as human fingerprints.', source_url: 'https://doi.org/10.1002/ece3.1387' },
    { text: 'Tigers can leap forward up to 10 metres in a single bound when attacking prey.', source_url: 'https://www.panthera.org/cat/tiger' },
    { text: 'A tiger\'s roar can be heard from up to 3 kilometres away and can temporarily paralyze prey with fear.', source_url: 'https://doi.org/10.1121/1.870688' },
    { text: 'Unlike most cats, tigers are powerful swimmers and often cool off in pools and streams.', source_url: 'https://www.worldwildlife.org/species/tiger' },
    { text: 'There are more tigers in captivity in the United States alone than remain in the wild worldwide.', source_url: 'https://www.worldwildlife.org/stories/more-tigers-in-american-backyards-than-in-the-wild' }
  ],
  'snow-leopard': [
    { text: 'Snow leopards cannot roar; they communicate through hisses, growls, mews, and a unique puffing sound called prusten.', source_url: 'https://snowleopard.org/about-snow-leopards/' },
    { text: 'Their extraordinarily long tail (nearly as long as their body) serves as a balance aid and a warm face-covering during blizzards.', source_url: 'https://doi.org/10.1017/S0030605310000190' },
    { text: 'Snow leopards can leap up to 15 metres horizontally across mountain crevasses.', source_url: 'https://www.panthera.org/cat/snow-leopard' },
    { text: 'They can bring down prey up to three times their own body weight on near-vertical cliff faces.', source_url: 'https://snowleopard.org/about-snow-leopards/' }
  ],
  'bornean-orangutan': [
    { text: 'Orangutans share approximately 97% of their DNA with humans, making them one of our closest living relatives.', source_url: 'https://doi.org/10.1038/nature09687' },
    { text: 'They construct a new sleeping nest every night from branches and leaves, sometimes adding a roof for rain protection.', source_url: 'https://doi.org/10.1073/pnas.1200473109' },
    { text: 'Orangutans have been observed using tools including sticks to extract honey and leaves as makeshift gloves.', source_url: 'https://doi.org/10.1007/s10764-006-9006-9' },
    { text: 'A mother orangutan nurses her young for up to 8 years, one of the longest dependency periods in the animal kingdom.', source_url: 'https://doi.org/10.1126/sciadv.1601517' }
  ],
  'hawksbill-turtle': [
    { text: 'Hawksbill turtles can consume sponges toxic to most other marine animals, playing a critical role in reef health.', source_url: 'https://doi.org/10.2744/1071-8443(1999)003[0200:SJFLTH]2.0.CO;2' },
    { text: 'They can navigate across thousands of ocean kilometres to return to the exact beach where they hatched decades earlier.', source_url: 'https://doi.org/10.1098/rspb.2007.1745' },
    { text: 'Hawksbill shell (tortoiseshell) trade dates back to ancient Egypt, with artifacts found in Tutankhamun\'s tomb.', source_url: 'https://www.cites.org/eng/gallery/species/reptile/hawksbill_turtle.html' },
    { text: 'A single hawksbill turtle can consume over 500 kilograms of sponges per year.', source_url: 'https://doi.org/10.3354/esr00165' }
  ],
  'blue-whale': [
    { text: 'The blue whale is the largest animal ever known to have existed, reaching up to 30 metres long and 180 tonnes.', source_url: 'https://doi.org/10.1111/j.1748-7692.2004.tb01190.x' },
    { text: 'A blue whale\'s heart is roughly the size of a small car and beats just 2-8 times per minute during deep dives.', source_url: 'https://doi.org/10.1073/pnas.1914273116' },
    { text: 'Blue whale calls at 188 decibels are the loudest sounds produced by any animal, detectable hundreds of kilometres away.', source_url: 'https://doi.org/10.3354/esr00508' },
    { text: 'They can consume up to 4 tonnes of krill in a single day during peak feeding.', source_url: 'https://doi.org/10.1038/s41586-021-03991-5' }
  ],
  'african-elephant': [
    { text: 'African elephants can communicate using infrasound below human hearing range, detectable by other elephants up to 10 km away.', source_url: 'https://doi.org/10.1016/0003-3472(88)90130-8' },
    { text: 'An elephant\'s brain weighs about 5 kg, the largest of any land animal, and they demonstrate self-awareness, grief, and empathy.', source_url: 'https://doi.org/10.1073/pnas.0607097103' },
    { text: 'Elephants are ecosystem engineers; a single individual disperses seeds across vast distances and creates water holes used by dozens of other species.', source_url: 'https://doi.org/10.1111/j.1365-2664.2009.01764.x' },
    { text: 'They can recognize and remember over 200 other individual elephants by their calls alone.', source_url: 'https://doi.org/10.1006/anbe.2000.1503' }
  ],
  'polar-bear': [
    { text: 'Polar bear fur is not white but transparent and hollow, appearing white due to light scattering; their skin is actually black.', source_url: 'https://doi.org/10.1364/AO.33.007518' },
    { text: 'They can detect a seal beneath a metre of snow from nearly a kilometre away using their extraordinary sense of smell.', source_url: 'https://www.worldwildlife.org/species/polar-bear' },
    { text: 'Polar bears are classified as marine mammals because they spend most of their lives on sea ice.', source_url: 'https://doi.org/10.1111/j.1365-2486.2012.02753.x' },
    { text: 'They can swim continuously for over 100 hours, covering distances of more than 680 kilometres.', source_url: 'https://doi.org/10.1139/z2012-033' }
  ],
  'giant-panda': [
    { text: 'Despite being classified as bears (order Carnivora), 99% of a giant panda\'s diet is bamboo.', source_url: 'https://doi.org/10.1111/cobi.12582' },
    { text: 'Pandas must eat 12-38 kilograms of bamboo daily because they digest only about 17% of what they consume.', source_url: 'https://doi.org/10.1128/mBio.00892-15' },
    { text: 'Giant pandas have an enlarged wrist bone (a "pseudo-thumb") that functions as an opposable digit for gripping bamboo.', source_url: 'https://doi.org/10.1038/s41586-022-04427-0' },
    { text: 'Newborn pandas weigh about 100 grams, roughly 1/900th of their mother\'s weight, one of the smallest mammalian birth-size ratios.', source_url: 'https://doi.org/10.1111/j.1749-4877.2011.00247.x' }
  ],
  'staghorn-coral': [
    { text: 'Staghorn coral can grow up to 20 centimetres per year, making it one of the fastest-growing reef corals.', source_url: 'https://doi.org/10.1007/s00338-008-0441-z' },
    { text: 'A single staghorn colony can house thousands of individual polyps working cooperatively to build the reef structure.', source_url: 'https://doi.org/10.1023/A:1013103928980' },
    { text: 'Coral reefs cover less than 1% of the ocean floor but support approximately 25% of all marine species.', source_url: 'https://doi.org/10.1038/nature21707' },
    { text: 'Staghorn coral can reproduce both sexually through spawning and asexually through fragmentation.', source_url: 'https://doi.org/10.1371/journal.pone.0226631' }
  ],
  'amazon-river-dolphin': [
    { text: 'Amazon river dolphins can turn their heads 180 degrees due to unfused neck vertebrae, unique among cetaceans.', source_url: 'https://doi.org/10.1017/S0952836996000456' },
    { text: 'Adult males turn increasingly pink with age; the coloring intensifies during social interactions and excitement.', source_url: 'https://doi.org/10.1016/j.biocon.2013.05.016' },
    { text: 'They use echolocation to navigate murky river waters where visibility can be near zero.', source_url: 'https://doi.org/10.1121/1.399439' },
    { text: 'River dolphins diverged from oceanic dolphins approximately 24 million years ago.', source_url: 'https://doi.org/10.1098/rspb.2011.1373' }
  ]
};

// ============================================================
// ENRICHMENT DATA: Globe Layers (Protected Areas)
// ============================================================
const GLOBE_LAYERS = {
  'tiger': {
    protected_areas: [
      { name: 'Ranthambore National Park', lat: 26.0173, lng: 76.5026, country: 'India' },
      { name: 'Sundarbans National Park', lat: 21.9497, lng: 88.8988, country: 'India' },
      { name: 'Corbett National Park', lat: 29.5300, lng: 78.7747, country: 'India' },
      { name: 'Sikhote-Alin Nature Reserve', lat: 45.3167, lng: 136.0000, country: 'Russia' },
      { name: 'Way Kambas National Park', lat: -4.9333, lng: 105.7500, country: 'Indonesia' }
    ]
  },
  'snow-leopard': {
    protected_areas: [
      { name: 'Hemis National Park', lat: 33.8900, lng: 77.5500, country: 'India' },
      { name: 'Sagarmatha National Park', lat: 27.9600, lng: 86.8200, country: 'Nepal' },
      { name: 'Altai Tavan Bogd National Park', lat: 48.8000, lng: 87.8000, country: 'Mongolia' },
      { name: 'Sarychat-Ertash Reserve', lat: 41.7500, lng: 78.5000, country: 'Kyrgyzstan' },
      { name: 'Qomolangma National Nature Preserve', lat: 28.2500, lng: 86.9300, country: 'China' }
    ]
  },
  'bornean-orangutan': {
    protected_areas: [
      { name: 'Tanjung Puting National Park', lat: -2.8333, lng: 111.8333, country: 'Indonesia' },
      { name: 'Danum Valley Conservation Area', lat: 4.9667, lng: 117.8000, country: 'Malaysia' },
      { name: 'Gunung Palung National Park', lat: -1.2167, lng: 109.9167, country: 'Indonesia' },
      { name: 'Kutai National Park', lat: 0.3333, lng: 117.1667, country: 'Indonesia' },
      { name: 'Kinabatangan Wildlife Sanctuary', lat: 5.5000, lng: 118.0000, country: 'Malaysia' }
    ]
  },
  'hawksbill-turtle': {
    protected_areas: [
      { name: 'Great Barrier Reef Marine Park', lat: -18.2861, lng: 147.7000, country: 'Australia' },
      { name: 'Tortuguero National Park', lat: 10.5430, lng: -83.5020, country: 'Costa Rica' },
      { name: 'Ras Al Jinz Turtle Reserve', lat: 22.4000, lng: 59.8000, country: 'Oman' },
      { name: 'Baa Atoll Biosphere Reserve', lat: 5.2500, lng: 72.9500, country: 'Maldives' },
      { name: 'Buck Island Reef National Monument', lat: 17.7889, lng: -64.6189, country: 'US Virgin Islands' }
    ]
  },
  'blue-whale': {
    protected_areas: [
      { name: 'Monterey Bay National Marine Sanctuary', lat: 36.8000, lng: -121.9000, country: 'United States' },
      { name: 'Pelagos Sanctuary', lat: 43.5000, lng: 8.5000, country: 'France/Italy/Monaco' },
      { name: 'South Georgia and South Sandwich Islands MPA', lat: -54.2500, lng: -36.7500, country: 'United Kingdom' },
      { name: 'Great Australian Bight Marine Park', lat: -34.0000, lng: 130.0000, country: 'Australia' },
      { name: 'Ross Sea Marine Protected Area', lat: -72.0000, lng: 175.0000, country: 'Antarctica' }
    ]
  },
  'african-elephant': {
    protected_areas: [
      { name: 'Amboseli National Park', lat: -2.6527, lng: 37.2606, country: 'Kenya' },
      { name: 'Chobe National Park', lat: -18.5000, lng: 25.0000, country: 'Botswana' },
      { name: 'Kruger National Park', lat: -23.9884, lng: 31.5547, country: 'South Africa' },
      { name: 'Serengeti National Park', lat: -2.3333, lng: 34.8333, country: 'Tanzania' },
      { name: 'Okavango Delta', lat: -19.5000, lng: 22.5000, country: 'Botswana' }
    ]
  },
  'polar-bear': {
    protected_areas: [
      { name: 'Wrangel Island Nature Reserve', lat: 71.2333, lng: -179.7667, country: 'Russia' },
      { name: 'Arctic National Wildlife Refuge', lat: 69.5000, lng: -144.5000, country: 'United States' },
      { name: 'Nordaust-Svalbard Nature Reserve', lat: 79.5000, lng: 24.0000, country: 'Norway' },
      { name: 'Wapusk National Park', lat: 57.3000, lng: -93.2000, country: 'Canada' },
      { name: 'Franz Josef Land Nature Reserve', lat: 80.5000, lng: 55.0000, country: 'Russia' }
    ]
  },
  'giant-panda': {
    protected_areas: [
      { name: 'Wolong National Nature Reserve', lat: 31.0000, lng: 103.1667, country: 'China' },
      { name: 'Foping National Nature Reserve', lat: 33.6667, lng: 107.8333, country: 'China' },
      { name: 'Tangjiahe National Nature Reserve', lat: 32.6333, lng: 104.7333, country: 'China' },
      { name: 'Wanglang National Nature Reserve', lat: 32.9167, lng: 104.0667, country: 'China' },
      { name: 'Giant Panda National Park', lat: 31.5000, lng: 103.5000, country: 'China' }
    ]
  },
  'staghorn-coral': {
    protected_areas: [
      { name: 'Florida Keys National Marine Sanctuary', lat: 24.5551, lng: -81.7800, country: 'United States' },
      { name: 'Belize Barrier Reef Reserve System', lat: 17.3200, lng: -87.5350, country: 'Belize' },
      { name: 'Bonaire National Marine Park', lat: 12.1500, lng: -68.2667, country: 'Netherlands' },
      { name: 'Dry Tortugas National Park', lat: 24.6285, lng: -82.8732, country: 'United States' },
      { name: 'Saba Marine Park', lat: 17.6333, lng: -63.2333, country: 'Netherlands' }
    ]
  },
  'amazon-river-dolphin': {
    protected_areas: [
      { name: 'Mamiraua Sustainable Development Reserve', lat: -3.0667, lng: -64.8667, country: 'Brazil' },
      { name: 'Pacaya-Samiria National Reserve', lat: -5.3333, lng: -75.0000, country: 'Peru' },
      { name: 'Jau National Park', lat: -1.8500, lng: -61.6500, country: 'Brazil' },
      { name: 'Amana Sustainable Development Reserve', lat: -2.5000, lng: -64.5000, country: 'Brazil' },
      { name: 'Yasuni National Park', lat: -1.0000, lng: -75.5000, country: 'Ecuador' }
    ]
  }
};

// ============================================================
// ENRICHMENT DATA: Data Sources (with URLs)
// ============================================================
const DATA_SOURCES = {
  'tiger': [
    { name: 'IUCN Red List', type: 'assessment', url: 'https://www.iucnredlist.org/species/15955/221500984' },
    { name: 'WWF Tiger Programme', type: 'conservation', url: 'https://www.worldwildlife.org/species/tiger' },
    { name: 'Global Tiger Initiative', type: 'policy', url: 'https://www.worldbank.org/en/topic/environment/brief/the-global-tiger-initiative' },
    { name: 'TRAFFIC Wildlife Trade Report', type: 'trade', url: 'https://www.traffic.org/publications/reports/reduced-to-skin-and-bones-revisited/' }
  ],
  'snow-leopard': [
    { name: 'IUCN Red List', type: 'assessment', url: 'https://www.iucnredlist.org/species/22732/102331691' },
    { name: 'Snow Leopard Trust', type: 'conservation', url: 'https://snowleopard.org/' },
    { name: 'Global Snow Leopard & Ecosystem Protection Program', type: 'policy', url: 'https://globalsnowleopard.org/' },
    { name: 'Panthera Snow Leopard Program', type: 'conservation', url: 'https://www.panthera.org/cat/snow-leopard' }
  ],
  'bornean-orangutan': [
    { name: 'IUCN Red List', type: 'assessment', url: 'https://www.iucnredlist.org/species/17975/123809220' },
    { name: 'WWF Borneo Programme', type: 'conservation', url: 'https://www.worldwildlife.org/species/bornean-orangutan' },
    { name: 'Borneo Orangutan Survival Foundation', type: 'conservation', url: 'https://www.orangutan.or.id/' },
    { name: 'Roundtable on Sustainable Palm Oil', type: 'industry', url: 'https://rspo.org/' }
  ],
  'hawksbill-turtle': [
    { name: 'IUCN Red List', type: 'assessment', url: 'https://www.iucnredlist.org/species/8005/226534848' },
    { name: 'Sea Turtle Conservancy', type: 'conservation', url: 'https://conserveturtles.org/information-about-sea-turtles/' },
    { name: 'CITES Appendix I', type: 'trade', url: 'https://www.cites.org/eng/gallery/species/reptile/hawksbill_turtle.html' },
    { name: 'WWF Marine Turtle Programme', type: 'conservation', url: 'https://www.worldwildlife.org/species/hawksbill-turtle' }
  ],
  'blue-whale': [
    { name: 'IUCN Red List', type: 'assessment', url: 'https://www.iucnredlist.org/species/2477/166756914' },
    { name: 'International Whaling Commission', type: 'policy', url: 'https://iwc.int/management-and-conservation/whaling/moratorium' },
    { name: 'NOAA Fisheries', type: 'government', url: 'https://www.fisheries.noaa.gov/species/blue-whale' },
    { name: 'WWF Whale Programme', type: 'conservation', url: 'https://www.worldwildlife.org/species/blue-whale' }
  ],
  'african-elephant': [
    { name: 'IUCN Red List', type: 'assessment', url: 'https://www.iucnredlist.org/species/181008073/223766485' },
    { name: 'CITES Elephant Trade Information System', type: 'trade', url: 'https://www.cites.org/eng/prog/etis' },
    { name: 'Great Elephant Census', type: 'research', url: 'https://www.greatelephantcensus.com/' },
    { name: 'WWF African Elephant Programme', type: 'conservation', url: 'https://www.worldwildlife.org/species/african-elephant' }
  ],
  'polar-bear': [
    { name: 'IUCN Red List', type: 'assessment', url: 'https://www.iucnredlist.org/species/22823/166773151' },
    { name: 'Polar Bear Specialist Group', type: 'research', url: 'https://www.iucn-pbsg.org/' },
    { name: 'WWF Arctic Programme', type: 'conservation', url: 'https://www.worldwildlife.org/species/polar-bear' },
    { name: 'NSIDC Sea Ice Data', type: 'climate', url: 'https://nsidc.org/data/seaice_index' }
  ],
  'giant-panda': [
    { name: 'IUCN Red List', type: 'assessment', url: 'https://www.iucnredlist.org/species/712/166502858' },
    { name: 'WWF Giant Panda Programme', type: 'conservation', url: 'https://www.worldwildlife.org/species/giant-panda' },
    { name: 'China State Forestry Administration Survey', type: 'government', url: 'https://www.forestry.gov.cn/' },
    { name: 'Chengdu Research Base of Giant Panda Breeding', type: 'research', url: 'https://www.panda.org.cn/' }
  ],
  'staghorn-coral': [
    { name: 'IUCN Red List', type: 'assessment', url: 'https://www.iucnredlist.org/species/133381/166791869' },
    { name: 'NOAA Coral Reef Conservation Program', type: 'government', url: 'https://coralreef.noaa.gov/' },
    { name: 'Coral Restoration Foundation', type: 'conservation', url: 'https://www.coralrestoration.org/' },
    { name: 'Global Coral Reef Monitoring Network', type: 'research', url: 'https://gcrmn.net/' }
  ],
  'amazon-river-dolphin': [
    { name: 'IUCN Red List', type: 'assessment', url: 'https://www.iucnredlist.org/species/10831/123792024' },
    { name: 'WWF Amazon Programme', type: 'conservation', url: 'https://www.worldwildlife.org/species/amazon-river-dolphin' },
    { name: 'South American River Dolphin Initiative', type: 'research', url: 'https://www.riverdolphins.org/' },
    { name: 'Mamiraua Institute for Sustainable Development', type: 'research', url: 'https://www.mamiraua.org.br/' }
  ]
};

// ============================================================
// SPECIES DATA ARRAY
// ============================================================
const SPECIES = [
  {
    slug: 'tiger',
    taxonomy: {
      scientific_name: 'Panthera tigris',
      common_name: 'Tiger',
      family: 'Felidae',
      order: 'Carnivora',
      class: 'Mammalia'
    },
    habitat: {
      type: 'Tropical Forest',
      description: 'The tiger prowls through some of the most biodiverse landscapes on Earth, from the steaming mangrove swamps of the Sundarbans to the dense sal forests of central India. These great cats require vast territories of unbroken forest, each individual commanding a home range that may span hundreds of square kilometres of tangled undergrowth, river corridors, and grassland margins.\n\nIn the humid tropics of Southeast Asia, tigers move like shadows through cathedral-like stands of dipterocarp trees, their striped coats dissolving into the dappled light that filters through the canopy. The forest floor, thick with leaf litter and crisscrossed by streams, provides perfect cover for ambush hunting.\n\nFrom the frozen birch forests of the Russian Far East to the tropical dry forests of Rajasthan, the tiger has adapted to an extraordinary range of forested habitats, testament to the remarkable plasticity of this apex predator.',
      range_countries: ['India', 'Russia', 'Indonesia', 'Malaysia', 'Thailand', 'Nepal', 'Bangladesh', 'Myanmar', 'Bhutan', 'China'],
      key_locations: ['Sundarbans', 'Ranthambore', 'Corbett National Park', 'Sikhote-Alin', 'Way Kambas']
    },
    threats: [
      { name: 'Habitat Loss', description: 'Deforestation for agriculture, palm oil plantations, and urban expansion has reduced tiger habitat by over 95% in the last century.' },
      { name: 'Poaching', description: 'Illegal hunting for traditional medicine trade, particularly for bones, skins, and other body parts, remains a critical threat.' },
      { name: 'Human-Wildlife Conflict', description: 'As forests shrink, tigers increasingly encounter human settlements, leading to retaliatory killings when livestock or people are attacked.' },
      { name: 'Prey Depletion', description: 'Overhunting of deer, wild boar, and other prey species by local communities reduces the food base tigers depend upon.' },
      { name: 'Climate Change', description: 'Rising sea levels threaten the Sundarbans mangrove habitat, while changing monsoon patterns affect prey availability across the range.' }
    ],
    conservation: {
      iucn_status: 'Endangered',
      population_estimate: '4,500',
      population_trend: 'Increasing',
      key_programs: ['Project Tiger (India)', 'TX2 Goal', 'Global Tiger Initiative', 'TRAFFIC anti-poaching networks']
    },
    cultural_significance: {
      cinema: 'From Life of Pi to The Jungle Book, tigers dominate wildlife cinema as symbols of untamed nature and spiritual power.',
      literature: 'William Blake\'s "Tyger Tyger, burning bright" established the tiger as poetry\'s most potent symbol of sublime natural force.',
      mythology: 'Sacred in Hindu mythology as the mount of Goddess Durga, and revered across Asian cultures as guardians and shape-shifters.',
      media_presence: 'Tigers appear in more wildlife documentaries than any other big cat, with BBC and National Geographic producing dedicated series.',
      cultural_paradox: 'The most culturally celebrated big cat is simultaneously among the most endangered, with more tigers in captivity than in the wild.'
    },
    hero_stat: '95% of tiger habitat lost in 100 years',
    root_causes_comb: {
      capability: ['Lack of local knowledge about coexistence strategies', 'Limited ranger capacity for anti-poaching patrols', 'Insufficient forensic tools for wildlife crime prosecution'],
      opportunity: ['Expanding agriculture encroaches on forest corridors', 'Black market demand creates financial incentive for poaching', 'Inadequate cross-border enforcement between range states'],
      motivation: ['Short-term economic gain from land conversion outweighs conservation value', 'Cultural beliefs drive demand for tiger bone medicine', 'Retaliatory killing perceived as necessary for community safety']
    },
    evidence_summary: 'Research indicates that high-profile tiger documentaries (e.g., BBC Tiger: Spy in the Jungle) correlate with increased donations to tiger conservation funds and heightened public awareness, though direct behavioural change remains difficult to measure (Jones et al., 2019).',
    academic_references: ['Karanth, K.U. & Nichols, J.D. (1998). Estimation of tiger densities using photographic captures and recaptures. Ecology, 79(8), pp.2852-2862.', 'Linkie, M. et al. (2015). Safeguarding Sumatran tigers: evaluating effectiveness of law enforcement patrols. Biological Conservation, 190, pp.42-49.'],
    search_terms: ['tiger', 'bengal tiger', 'sumatran tiger', 'siberian tiger']
  },
  {
    slug: 'snow-leopard',
    taxonomy: {
      scientific_name: 'Panthera uncia',
      common_name: 'Snow Leopard',
      family: 'Felidae',
      order: 'Carnivora',
      class: 'Mammalia'
    },
    habitat: {
      type: 'Mountain',
      description: 'The snow leopard inhabits the highest and most rugged mountain terrain on the planet, threading between rocky outcrops and scree slopes at altitudes of 3,000 to 5,500 metres across the great ranges of Central Asia. These ghost cats move through a world of thin air, extreme cold, and breathtaking vertical landscapes that would challenge any living creature.\n\nIn summer, snow leopards follow their prey into alpine meadows where blue sheep and ibex graze on sparse grasses between granite boulders. The cats use ridgelines and cliff edges as travel corridors, their pale grey coats blending perfectly with the lichen-covered rock.\n\nWinter drives both predator and prey to lower elevations, where snow leopards navigate frozen river valleys and sparse juniper forests. Their extraordinarily long, thick tails serve as both balance aids on precipitous terrain and warming scarves wrapped around their faces during blizzards.',
      range_countries: ['China', 'Mongolia', 'India', 'Nepal', 'Pakistan', 'Kyrgyzstan', 'Kazakhstan', 'Tajikistan', 'Uzbekistan', 'Afghanistan', 'Bhutan', 'Russia'],
      key_locations: ['Altai Mountains', 'Himalayas', 'Hindu Kush', 'Tian Shan', 'Karakoram']
    },
    threats: [
      { name: 'Retaliatory Killing', description: 'Herders kill snow leopards in retaliation for livestock predation, which can represent a significant economic loss for mountain communities.' },
      { name: 'Poaching', description: 'Illegal trade in pelts and bones drives targeted hunting, with snow leopard parts entering black markets across Asia.' },
      { name: 'Mining and Infrastructure', description: 'Road construction and mining operations fragment high-altitude habitats and disturb denning sites.' },
      { name: 'Climate Change', description: 'Rising temperatures push the tree line upward, shrinking alpine habitat and altering prey distribution patterns.' },
      { name: 'Prey Base Decline', description: 'Competition with domestic livestock for grazing reduces wild ungulate populations that snow leopards depend upon.' }
    ],
    conservation: {
      iucn_status: 'Vulnerable',
      population_estimate: '4,000-6,500',
      population_trend: 'Decreasing',
      key_programs: ['Snow Leopard Trust', 'Global Snow Leopard & Ecosystem Protection Program', 'Panthera', 'Snow Leopard Conservancy']
    },
    cultural_significance: {
      cinema: 'Planet Earth II brought unprecedented footage of snow leopards hunting on impossible cliff faces, captivating global audiences.',
      literature: 'Peter Matthiessen\'s "The Snow Leopard" transformed this elusive cat into a literary symbol of spiritual seeking and wildness.',
      mythology: 'Revered as mountain spirits across Central Asian cultures, snow leopards appear in Tibetan Buddhist iconography and Kyrgyz folklore.',
      media_presence: 'The difficulty of filming snow leopards makes every documentary appearance a landmark event, with some crews waiting years for footage.',
      cultural_paradox: 'Known as the "ghost of the mountains," the snow leopard\'s mystique grows even as climate change erodes its high-altitude realm.'
    },
    hero_stat: 'Snow leopards have lost 20% of their range in just 16 years',
    root_causes_comb: {
      capability: ['Remote communities lack livestock protection infrastructure', 'Limited veterinary support increases perceived losses to predation', 'Insufficient monitoring technology in harsh terrain'],
      opportunity: ['Mining concessions granted in core habitat areas', 'Climate change shifting tree lines reduces available alpine territory', 'Cross-border cooperation hampered by geopolitical tensions'],
      motivation: ['Livestock losses represent catastrophic economic damage for herders', 'Pelt trade offers significant income in impoverished regions', 'Low awareness of snow leopard ecological importance among local communities']
    },
    evidence_summary: 'Planet Earth II snow leopard sequences generated measurable increases in Snow Leopard Trust donations and social media engagement, demonstrating the power of rare wildlife footage to drive conservation support (Silk et al., 2018).',
    academic_references: ['Jackson, R.M. et al. (2006). Estimating snow leopard population abundance using photography and capture-recapture techniques. Wildlife Society Bulletin, 34(3), pp.772-781.', 'Li, J. et al. (2016). Role of Tibetan Buddhist monasteries in snow leopard conservation. Conservation Biology, 30(4), pp.735-745.'],
    search_terms: ['snow leopard', 'mountain cat', 'ghost cat']
  },
  {
    slug: 'bornean-orangutan',
    taxonomy: {
      scientific_name: 'Pongo pygmaeus',
      common_name: 'Bornean Orangutan',
      family: 'Hominidae',
      order: 'Primates',
      class: 'Mammalia'
    },
    habitat: {
      type: 'Tropical Forest',
      description: 'The Bornean orangutan dwells in the ancient dipterocarp rainforests of Borneo, spending nearly all its life in the canopy, moving through a three-dimensional world of branches, lianas, and fruiting trees. These forests, among the oldest on Earth, provide an aerial highway system that orangutans navigate with extraordinary spatial memory.\n\nIn the peat swamp forests of the lowlands, orangutans build nightly nests high in the trees, bending and weaving branches into platforms with the skill of practiced architects. The swamp forests, waterlogged and rich in fruit trees, support some of the densest orangutan populations remaining.\n\nHigher on the volcanic slopes of Borneo, montane forests offer a different menu of fruits, bark, and leaves. Here orangutans range more widely, their movements dictated by the irregular fruiting patterns of tropical trees, carrying a mental map of hundreds of food sources across their home ranges.',
      range_countries: ['Malaysia', 'Indonesia'],
      key_locations: ['Danum Valley', 'Kinabatangan River', 'Tanjung Puting', 'Gunung Palung', 'Kutai National Park']
    },
    threats: [
      { name: 'Palm Oil Deforestation', description: 'Industrial palm oil plantations have destroyed millions of hectares of orangutan habitat, fragmenting populations into isolated patches.' },
      { name: 'Illegal Pet Trade', description: 'Infant orangutans are captured for the pet trade, with mothers typically killed in the process.' },
      { name: 'Forest Fires', description: 'Peat fires, often set to clear land for agriculture, devastate orangutan habitat and can burn for months underground.' },
      { name: 'Logging', description: 'Both legal and illegal timber extraction removes the large fruiting trees that orangutans depend upon for food and nesting.' },
      { name: 'Hunting', description: 'In some areas orangutans are hunted for bushmeat or killed as crop pests when they venture into plantations.' }
    ],
    conservation: {
      iucn_status: 'Critically Endangered',
      population_estimate: '104,700',
      population_trend: 'Decreasing',
      key_programs: ['Borneo Orangutan Survival Foundation', 'Orangutan Foundation International', 'HUTAN-KOCP', 'Roundtable on Sustainable Palm Oil']
    },
    cultural_significance: {
      cinema: 'Orangutans feature prominently in documentaries about deforestation, becoming the poster species for the palm oil crisis.',
      literature: 'From Edgar Allan Poe\'s "Murders in the Rue Morgue" to Terry Pratchett\'s Librarian, orangutans occupy a unique space in fiction.',
      mythology: 'The name "orangutan" derives from Malay "orang hutan" meaning "person of the forest," reflecting indigenous recognition of their near-human qualities.',
      media_presence: 'David Attenborough\'s emotional encounters with orangutans have become some of the most shared wildlife television moments.',
      cultural_paradox: 'Our closest relatives in Asia face extinction primarily so that processed foods can contain cheap vegetable oil.'
    },
    hero_stat: '100 orangutans lost every week due to habitat destruction',
    root_causes_comb: {
      capability: ['Consumers unable to identify palm oil in products', 'Smallholder farmers lack alternative livelihood training', 'Rescue centres overwhelmed with displaced orphan orangutans'],
      opportunity: ['Global palm oil demand creates irresistible economic pressure on forests', 'Weak enforcement of forestry laws in remote Borneo', 'Fire as cheap land-clearing method remains accessible'],
      motivation: ['Palm oil highly profitable compared to sustainable alternatives', 'Consumer disconnect between products and deforestation', 'Short election cycles discourage long-term forest protection policies']
    },
    evidence_summary: 'Documentaries linking orangutan decline to palm oil consumption have measurably shifted consumer purchasing behaviour and supported growth of RSPO-certified products, though industry-wide change remains slow (Silk et al., 2018).',
    academic_references: ['Wich, S.A. et al. (2012). Understanding the impacts of land-use policies on a threatened species. PLoS ONE, 7(11), e49525.', 'Meijaard, E. et al. (2011). Quantifying killing of orangutans and human-orangutan conflict in Kalimantan. PLoS ONE, 6(11), e27491.'],
    search_terms: ['orangutan', 'borneo orangutan', 'orangutan rainforest']
  },
  {
    slug: 'hawksbill-turtle',
    taxonomy: {
      scientific_name: 'Eretmochelys imbricata',
      common_name: 'Hawksbill Turtle',
      family: 'Cheloniidae',
      order: 'Testudines',
      class: 'Reptilia'
    },
    habitat: {
      type: 'Coral Reef',
      description: 'The hawksbill turtle glides through the warm, crystalline waters of tropical coral reefs, its narrow, pointed beak perfectly adapted for extracting sponges from crevices in the reef structure. These ancient mariners inhabit a world of extraordinary colour and complexity, navigating between coral heads, sea fans, and underwater caves.\n\nCoral reefs represent the hawksbill\'s primary feeding grounds, where they play a crucial ecological role by consuming sponges that would otherwise overgrow and smother coral colonies. A single hawksbill may consume over 500 kilograms of sponges per year, maintaining the delicate balance of reef ecosystems.\n\nBeyond the reef, hawksbills traverse vast oceanic distances between feeding and nesting grounds, returning to the same beaches where they hatched decades earlier. Their nesting beaches, typically small, secluded strips of sand backed by coastal vegetation, are as critical to their survival as the reefs themselves.',
      range_countries: ['Australia', 'Indonesia', 'Philippines', 'Maldives', 'Seychelles', 'Mexico', 'Cuba', 'Solomon Islands', 'Papua New Guinea', 'Brazil'],
      key_locations: ['Great Barrier Reef', 'Coral Triangle', 'Caribbean Sea', 'Red Sea', 'Maldives atolls']
    },
    threats: [
      { name: 'Shell Trade', description: 'Despite international bans, hawksbill shells ("tortoiseshell") are still trafficked for jewelry and decorative items, particularly in East Asia.' },
      { name: 'Coral Reef Degradation', description: 'Ocean acidification, warming, and pollution destroy the reef ecosystems hawksbills depend upon for food.' },
      { name: 'Egg Harvesting', description: 'Coastal communities in many regions still collect turtle eggs from nesting beaches for consumption.' },
      { name: 'Bycatch', description: 'Hawksbills are accidentally caught in fishing nets, longlines, and trawls, often resulting in drowning.' },
      { name: 'Coastal Development', description: 'Beach construction, artificial lighting, and erosion destroy or degrade critical nesting habitat.' }
    ],
    conservation: {
      iucn_status: 'Critically Endangered',
      population_estimate: '20,000-23,000 nesting females',
      population_trend: 'Decreasing',
      key_programs: ['CITES Appendix I', 'Sea Turtle Conservancy', 'WWF Marine Turtle Programme', 'Coral Triangle Initiative']
    },
    cultural_significance: {
      cinema: 'Blue Planet and other ocean documentaries showcase hawksbills as jewels of the reef, their beauty contrasting with their precarious status.',
      literature: 'Sea turtles appear throughout Pacific Island literature as navigators and spiritual beings connecting the human and ocean worlds.',
      mythology: 'In many coastal cultures, sea turtles carry the world on their backs or serve as messengers between the land and sea spirits.',
      media_presence: 'Underwater cinematography has made hawksbills icons of marine conservation, their graceful swimming instantly recognizable.',
      cultural_paradox: 'The very beauty of their shells that inspired centuries of craftsmanship has driven them toward extinction.'
    },
    hero_stat: 'Hawksbill populations declined by 80% over three generations',
    root_causes_comb: {
      capability: ['Fishing communities lack affordable bycatch-reduction technology', 'Limited public understanding of reef-turtle ecological linkage', 'Coastal managers lack tools to monitor nesting beach disturbance'],
      opportunity: ['International shell trade persists through enforcement gaps', 'Coastal tourism development prioritized over nesting habitat protection', 'Climate change degrading reef feeding grounds beyond local control'],
      motivation: ['Tortoiseshell products culturally valued in East Asian markets', 'Egg harvesting seen as traditional right in coastal communities', 'Economic returns from coastal development exceed conservation funding']
    },
    evidence_summary: 'Blue Planet coral reef sequences featuring hawksbills generated significant public concern about marine plastics and reef health, contributing to policy discussions on single-use plastics in multiple countries (Jones et al., 2019).',
    academic_references: ['Mortimer, J.A. & Donnelly, M. (2008). Hawksbill Turtle (Eretmochelys imbricata). IUCN Red List Assessment.', 'Meylan, A.B. & Donnelly, M. (1999). Status justification for listing the hawksbill turtle as Critically Endangered. Chelonian Conservation and Biology, 3(2), pp.200-224.'],
    search_terms: ['hawksbill turtle', 'sea turtle', 'turtle reef', 'marine turtle']
  },
  {
    slug: 'blue-whale',
    taxonomy: {
      scientific_name: 'Balaenoptera musculus',
      common_name: 'Blue Whale',
      family: 'Balaenopteridae',
      order: 'Artiodactyla',
      class: 'Mammalia'
    },
    habitat: {
      type: 'Ocean',
      description: 'The blue whale, the largest animal ever to have lived on Earth, inhabits the vast open oceans of the world, undertaking migrations that span entire ocean basins. These leviathans cruise through the deep blue, their enormous bodies sustained by astronomical quantities of tiny krill.\n\nIn polar summer, blue whales congregate in the productive waters of the Southern Ocean and North Pacific, where upwellings bring nutrients to the surface and fuel explosive blooms of krill. A single blue whale may consume four tonnes of krill per day, its pleated throat expanding like a balloon to engulf entire schools.\n\nAs winter approaches, blue whales migrate toward tropical and subtropical waters to breed and calve, their low-frequency calls carrying across hundreds of kilometres of ocean. These calls, below the range of human hearing, form a communication network that spans the deep ocean.',
      range_countries: ['Global - all major oceans', 'Antarctica', 'Chile', 'Sri Lanka', 'California', 'Iceland', 'Australia', 'New Zealand'],
      key_locations: ['Southern Ocean', 'Gulf of California', 'Sri Lankan waters', 'Monterey Bay', 'South Georgia']
    },
    threats: [
      { name: 'Ship Strikes', description: 'Collisions with large vessels are a significant cause of mortality, particularly in busy shipping lanes that overlap with feeding areas.' },
      { name: 'Ocean Noise Pollution', description: 'Military sonar, seismic surveys, and shipping noise interfere with blue whale communication and may cause displacement from critical habitat.' },
      { name: 'Climate Change', description: 'Warming oceans alter krill distribution and abundance, potentially disrupting the feeding ecology blue whales depend upon.' },
      { name: 'Entanglement', description: 'Blue whales can become entangled in fishing gear, leading to injury, impaired feeding, and death.' },
      { name: 'Chemical Pollution', description: 'Persistent organic pollutants and microplastics accumulate in ocean food webs, concentrating in the tissues of filter-feeding whales.' }
    ],
    conservation: {
      iucn_status: 'Endangered',
      population_estimate: '10,000-25,000',
      population_trend: 'Increasing',
      key_programs: ['International Whaling Commission moratorium', 'IWC Southern Ocean Whale Sanctuary', 'NOAA Ship Speed Regulations', 'Antarctic Treaty System']
    },
    cultural_significance: {
      cinema: 'Blue whales represent the sublime in nature documentaries, their scale challenging the limits of what cameras can capture.',
      literature: 'From Moby Dick to contemporary ocean writing, great whales embody the mystery and immensity of the deep ocean.',
      mythology: 'Whale mythology spans from Jonah to Maori creation stories, whales serving as bridges between human and oceanic worlds.',
      media_presence: 'Blue Planet\'s blue whale sequences remain among the most watched and emotionally powerful moments in natural history television.',
      cultural_paradox: 'The largest animal ever to exist was hunted to near-extinction within a single human lifetime, now slowly recovering under protection.'
    },
    hero_stat: 'Blue whale population reduced by 99% before whaling ban',
    root_causes_comb: {
      capability: ['Shipping industry lacks affordable speed-reduction technology for whale zones', 'Limited real-time whale detection systems for vessel operators', 'Difficulty monitoring vast oceanic ranges'],
      opportunity: ['International shipping lanes overlap with critical feeding areas', 'Climate change shifting krill distributions into busier waters', 'Noise pollution regulations difficult to enforce in international waters'],
      motivation: ['Economic pressure to maintain shipping schedules over speed reductions', 'Whaling moratorium compliance varies by nation', 'Public disconnect from open-ocean conservation issues due to remoteness']
    },
    evidence_summary: 'Blue Planet broadcast events correlate with measurable increases in ocean conservation charity donations and public support for marine protected areas, with blue whale sequences among the most emotionally impactful (Jones et al., 2019).',
    academic_references: ['Branch, T.A. et al. (2004). Evidence for increases in Antarctic blue whales based on Bayesian modelling. Marine Mammal Science, 20(4), pp.726-754.', 'Attard, C.R.M. et al. (2012). Hybridization of Southern Hemisphere blue whale subspecies and implications for conservation. Conservation Genetics, 13(6), pp.1497-1507.'],
    search_terms: ['blue whale', 'whale ocean', 'whale documentary']
  },
  {
    slug: 'african-elephant',
    taxonomy: {
      scientific_name: 'Loxodonta africana',
      common_name: 'African Elephant',
      family: 'Elephantidae',
      order: 'Proboscidea',
      class: 'Mammalia'
    },
    habitat: {
      type: 'Savanna',
      description: 'The African elephant moves across the sweeping grasslands and scattered woodlands of sub-Saharan Africa, a keystone species whose presence shapes the very landscape it inhabits. Family groups led by experienced matriarchs follow ancient migration routes between water sources, their collective memory spanning generations.\n\nOn the open savanna, elephants create and maintain the mosaic of grassland and woodland that supports extraordinary biodiversity. By pushing over trees, stripping bark, and dispersing seeds across vast distances, they act as ecosystem engineers, creating habitat for countless other species.\n\nIn the seasonal wetlands and river corridors that thread through the African bush, elephants gather in spectacular concentrations during the dry season. The sight of hundreds of elephants converging on a shrinking water source remains one of Africa\'s most powerful natural spectacles.',
      range_countries: ['Botswana', 'Zimbabwe', 'Tanzania', 'Kenya', 'South Africa', 'Namibia', 'Zambia', 'Mozambique', 'Uganda', 'Democratic Republic of Congo'],
      key_locations: ['Amboseli', 'Chobe National Park', 'Serengeti', 'Kruger National Park', 'Okavango Delta']
    },
    threats: [
      { name: 'Ivory Poaching', description: 'Despite international trade bans, demand for ivory continues to fuel industrial-scale poaching, with tens of thousands killed annually.' },
      { name: 'Habitat Fragmentation', description: 'Expanding agriculture and infrastructure sever ancient migration corridors, isolating populations and increasing human-elephant conflict.' },
      { name: 'Human-Elephant Conflict', description: 'Crop raiding by elephants leads to retaliatory killings and poisoning as human settlements expand into elephant range.' },
      { name: 'Drought and Climate Change', description: 'Increasing drought frequency reduces water availability and food resources, concentrating elephants and increasing mortality.' },
      { name: 'Political Instability', description: 'Armed conflict and weak governance in parts of Africa undermine conservation efforts and enable poaching networks.' }
    ],
    conservation: {
      iucn_status: 'Endangered',
      population_estimate: '415,000',
      population_trend: 'Decreasing',
      key_programs: ['CITES ivory trade ban', 'MIKE monitoring programme', 'African Elephant Fund', 'Great Elephant Census', 'Elephant Protection Initiative']
    },
    cultural_significance: {
      cinema: 'From Disney\'s Dumbo to David Sheldrick Wildlife Trust documentaries, elephants are cinema\'s most emotionally resonant large mammals.',
      literature: 'Elephants feature in literature from Kipling to contemporary conservation writing as symbols of wisdom, memory, and gentle strength.',
      mythology: 'Sacred across African and Asian cultures, from Ganesh in Hinduism to the wisdom keepers of West African folklore.',
      media_presence: 'Elephant family dynamics, grief behaviors, and intelligence make them perennial subjects for documentary filmmakers.',
      cultural_paradox: 'Universally beloved and recognized as highly intelligent, yet killed in enormous numbers for decorative trinkets.'
    },
    hero_stat: 'One elephant killed every 15 minutes for ivory',
    root_causes_comb: {
      capability: ['Rangers under-equipped and outnumbered by poaching networks', 'Communities lack tools for non-lethal crop protection', 'Corruption undermines law enforcement at multiple levels'],
      opportunity: ['International ivory demand creates lucrative black market', 'Vast ranges impossible to patrol effectively', 'Political instability enables armed poaching gangs'],
      motivation: ['Ivory prices incentivize poaching above legitimate income sources', 'Human-elephant conflict drives retaliatory killing', 'Demand for ivory as status symbol persists despite bans']
    },
    evidence_summary: 'The documentary "The Ivory Game" (2016) contributed to China\'s decision to close its domestic ivory market, demonstrating direct policy impact from wildlife filmmaking (Jones et al., 2019).',
    academic_references: ['Wittemyer, G. et al. (2014). Illegal killing for ivory drives global decline in African elephants. PNAS, 111(36), pp.13117-13121.', 'Chase, M.J. et al. (2016). Continent-wide survey reveals massive decline in African savannah elephants. PeerJ, 4, e2354.'],
    search_terms: ['african elephant', 'elephant safari', 'elephant ivory', 'elephant conservation']
  },
  {
    slug: 'polar-bear',
    taxonomy: {
      scientific_name: 'Ursus maritimus',
      common_name: 'Polar Bear',
      family: 'Ursidae',
      order: 'Carnivora',
      class: 'Mammalia'
    },
    habitat: {
      type: 'Arctic',
      description: 'The polar bear reigns over the frozen realm of the Arctic, a marine mammal as much at home on drifting sea ice as on solid ground. These apex predators depend on the seasonal formation and breakup of sea ice to access the seals that form the foundation of their diet.\n\nAcross the vast expanse of the Arctic Ocean, polar bears patrol the edges of ice floes, waiting motionless beside breathing holes for hours until a ringed seal surfaces. The sea ice is not merely their hunting platform but their entire world, a shifting, cracking, refreezing landscape that determines where they can feed, mate, and travel.\n\nIn summer, as the ice retreats, polar bears are forced ashore in some regions, fasting for months while waiting for freeze-up. The lengthening ice-free season, driven by climate change, represents an existential challenge for a species evolved to exploit the frozen interface between ocean and atmosphere.',
      range_countries: ['Canada', 'Russia', 'United States (Alaska)', 'Norway (Svalbard)', 'Denmark (Greenland)'],
      key_locations: ['Hudson Bay', 'Svalbard', 'Wrangel Island', 'Beaufort Sea', 'Franz Josef Land']
    },
    threats: [
      { name: 'Sea Ice Loss', description: 'Arctic sea ice is declining at approximately 13% per decade, directly reducing the platform polar bears need to hunt seals.' },
      { name: 'Climate Change', description: 'Rising Arctic temperatures are melting sea ice earlier and forming it later, extending the fasting period beyond what many bears can survive.' },
      { name: 'Pollution', description: 'Persistent organic pollutants concentrate in Arctic food webs, accumulating to toxic levels in polar bear tissues.' },
      { name: 'Industrial Development', description: 'Oil and gas exploration, shipping, and mining in the Arctic disturb bears and risk catastrophic oil spills.' },
      { name: 'Human-Bear Conflict', description: 'As bears spend more time on land near communities, dangerous encounters increase, often ending fatally for the bear.' }
    ],
    conservation: {
      iucn_status: 'Vulnerable',
      population_estimate: '22,000-31,000',
      population_trend: 'Decreasing',
      key_programs: ['Agreement on Conservation of Polar Bears (1973)', 'Polar Bear Specialist Group', 'Arctic Council', 'TRAFFIC monitoring']
    },
    cultural_significance: {
      cinema: 'Polar bears became the defining image of climate change through documentaries showing them stranded on shrinking ice.',
      literature: 'Philip Pullman\'s armoured bears and countless children\'s books have made polar bears among the most familiar wild animals.',
      mythology: 'Central to Inuit cosmology as Nanuq, the polar bear is a spiritual being deserving of profound respect.',
      media_presence: 'From Coca-Cola advertisements to climate campaigns, the polar bear is perhaps the most recognizable conservation icon.',
      cultural_paradox: 'The ultimate symbol of climate crisis belongs to a region most people will never visit, creating emotional distance from the emergency.'
    },
    hero_stat: 'Arctic sea ice declining at 13% per decade since 1979',
    root_causes_comb: {
      capability: ['Global emissions reduction requires systemic change beyond individual action', 'Arctic communities lack infrastructure to manage increasing bear encounters', 'Limited ability to create artificial feeding opportunities during extended ice-free periods'],
      opportunity: ['Fossil fuel infrastructure expanding into Arctic as ice retreats', 'International climate agreements insufficient to halt warming trajectory', 'Arctic shipping routes opening, increasing disturbance'],
      motivation: ['Economic incentives for Arctic resource extraction outweigh conservation concerns', 'Climate change denial delays necessary policy action', 'Geographic remoteness reduces public urgency for Arctic protection']
    },
    evidence_summary: 'The iconic "stranded polar bear" imagery has become the most recognized visual metaphor for climate change, measurably increasing public concern and support for emissions reduction policies (Silk et al., 2018; Macdonald et al., 2016).',
    academic_references: ['Amstrup, S.C. et al. (2010). Greenhouse gas mitigation can reduce sea-ice loss and increase polar bear persistence. Nature, 468(7326), pp.955-958.', 'Stirling, I. & Derocher, A.E. (2012). Effects of climate warming on polar bears: a review of the evidence. Global Change Biology, 18(9), pp.2694-2706.'],
    search_terms: ['polar bear', 'arctic bear', 'polar bear climate', 'polar bear ice']
  },
  {
    slug: 'giant-panda',
    taxonomy: {
      scientific_name: 'Ailuropoda melanoleuca',
      common_name: 'Giant Panda',
      family: 'Ursidae',
      order: 'Carnivora',
      class: 'Mammalia'
    },
    habitat: {
      type: 'Temperate Forest',
      description: 'The giant panda inhabits the misty bamboo forests of central China, living at elevations between 1,500 and 3,000 metres in a world of perpetual dampness, steep slopes, and dense bamboo understory. These temperate forests, draped in moss and threaded with streams, represent one of the most restricted habitats of any large mammal.\n\nBamboo dominates every aspect of panda life. These bears spend up to 14 hours each day consuming bamboo, eating 12 to 38 kilograms daily to extract sufficient nutrition from this low-calorie food source. Different bamboo species grow at different elevations, and pandas must move seasonally between altitude bands as various species produce new shoots.\n\nThe cloud forests of Sichuan, Shaanxi, and Gansu provinces harbour the last wild pandas in fragmented mountain sanctuaries. Ancient conifers tower above the bamboo, creating a layered forest ecosystem where golden monkeys, red pandas, and takins share the panda\'s mountain realm.',
      range_countries: ['China'],
      key_locations: ['Wolong Nature Reserve', 'Foping Nature Reserve', 'Minshan Mountains', 'Qinling Mountains', 'Sichuan Basin margins']
    },
    threats: [
      { name: 'Habitat Fragmentation', description: 'Roads, railways, and agricultural expansion divide panda populations into isolated groups, reducing genetic diversity.' },
      { name: 'Bamboo Die-Off', description: 'Bamboo species periodically flower and die en masse; fragmented habitats prevent pandas from moving to alternative bamboo sources.' },
      { name: 'Small Population Size', description: 'Isolated populations are vulnerable to inbreeding depression and local extinction from stochastic events.' },
      { name: 'Climate Change', description: 'Changing temperatures and precipitation patterns may shift bamboo distribution beyond what pandas can track.' },
      { name: 'Tourism Pressure', description: 'While eco-tourism funds conservation, excessive visitor numbers in reserves can disturb pandas and degrade habitat.' }
    ],
    conservation: {
      iucn_status: 'Vulnerable',
      population_estimate: '1,864',
      population_trend: 'Increasing',
      key_programs: ['National Giant Panda Conservation Programme', 'Giant Panda National Park', 'Chengdu Research Base of Giant Panda Breeding', 'WWF (panda as logo species)']
    },
    cultural_significance: {
      cinema: 'Kung Fu Panda brought the species to global pop culture, while IMAX documentaries reveal the reality of panda conservation in China.',
      literature: 'Pandas appear throughout Chinese literature and art as symbols of peace, gentleness, and harmony with nature.',
      mythology: 'Ancient Chinese texts describe pandas as peaceful creatures that could mediate between warring tribes, symbols of yin-yang balance.',
      media_presence: 'As the WWF logo species since 1961, the panda is arguably the world\'s most recognizable conservation symbol.',
      cultural_paradox: 'Massive conservation investment in a single charismatic species raises questions about resource allocation while also funding broader ecosystem protection.'
    },
    hero_stat: 'Only 1,864 giant pandas remain in the wild across 30 fragmented populations',
    root_causes_comb: {
      capability: ['Bamboo corridor restoration requires decades of growth', 'Captive breeding struggles with low reproductive rates', 'Genetic management across fragmented populations technically challenging'],
      opportunity: ['Infrastructure development continues to fragment remaining habitat', 'Climate change altering bamboo distribution faster than corridors can be restored', 'Tourism pressure on reserves increasing with prosperity'],
      motivation: ['Panda conservation heavily funded but benefits concentrated on one species', 'Political symbolism sometimes prioritized over ecological effectiveness', 'Public preference for charismatic megafauna skews funding allocation']
    },
    evidence_summary: 'The giant panda demonstrates the "flagship species" effect where media attention on one charismatic species generates conservation funding that protects entire ecosystems, though critics note allocation inequity (Macdonald et al., 2016).',
    academic_references: ['Swaisgood, R.R. et al. (2011). Can science save the giant panda? Unifying science and policy in an adaptive management framework. Integrative Zoology, 6(3), pp.290-296.', 'Wei, F. et al. (2015). Progress in the ecology and conservation of giant pandas. Conservation Biology, 29(6), pp.1497-1507.'],
    search_terms: ['giant panda', 'panda china', 'panda bamboo', 'panda conservation']
  },
  {
    slug: 'staghorn-coral',
    taxonomy: {
      scientific_name: 'Acropora cervicornis',
      common_name: 'Staghorn Coral',
      family: 'Acroporidae',
      order: 'Scleractinia',
      class: 'Anthozoa'
    },
    habitat: {
      type: 'Coral Reef',
      description: 'Staghorn coral builds the three-dimensional architecture of tropical reefs, its branching colonies creating a complex underwater forest that shelters thousands of marine species. Growing in warm, clear, shallow waters between 1 and 30 metres depth, these corals are among the most important reef-building organisms in the Caribbean.\n\nEach branch of staghorn coral is a living colony of thousands of tiny polyps, each no larger than a pinhead, working collectively to deposit calcium carbonate skeletons at rates of up to 20 centimetres per year. This rapid growth allows staghorn coral to dominate reef ecosystems, creating the structural complexity that supports extraordinary biodiversity.\n\nIn healthy reef systems, staghorn thickets can extend across hectares of shallow seafloor, their interlocking branches providing nursery habitat for juvenile fish, shelter for invertebrates, and substrate for algae and sponges. The loss of these coral forests cascades through entire marine ecosystems.',
      range_countries: ['United States (Florida)', 'Bahamas', 'Cuba', 'Mexico', 'Belize', 'Honduras', 'Jamaica', 'US Virgin Islands', 'Puerto Rico', 'Curacao'],
      key_locations: ['Florida Keys', 'Mesoamerican Barrier Reef', 'Turks and Caicos', 'Bahamas Banks', 'US Virgin Islands']
    },
    threats: [
      { name: 'Ocean Warming', description: 'Rising sea temperatures cause coral bleaching, expelling the symbiotic algae that provide corals with energy, often leading to death.' },
      { name: 'Ocean Acidification', description: 'Increasing CO2 absorption makes seawater more acidic, reducing corals\' ability to build and maintain their calcium carbonate skeletons.' },
      { name: 'White Band Disease', description: 'A devastating bacterial disease has killed 80-98% of staghorn coral populations across the Caribbean since the 1980s.' },
      { name: 'Hurricane Damage', description: 'The branching structure of staghorn coral makes it particularly vulnerable to physical destruction by increasingly intense storms.' },
      { name: 'Sedimentation and Pollution', description: 'Runoff from coastal development smothers coral with sediment and introduces nutrients that fuel algal overgrowth.' }
    ],
    conservation: {
      iucn_status: 'Critically Endangered',
      population_estimate: 'Declined 80-98% since 1980',
      population_trend: 'Decreasing',
      key_programs: ['Coral Restoration Foundation', 'NOAA Coral Reef Conservation Program', 'Florida DEP coral nurseries', 'Caribbean Acropora Recovery Plan']
    },
    cultural_significance: {
      cinema: 'Chasing Coral (Netflix) documented coral bleaching in real-time, bringing reef collapse to mainstream audiences worldwide.',
      literature: 'Coral reefs feature in ocean literature as underwater cities, their decline serving as a powerful metaphor for ecological collapse.',
      mythology: 'Ancient Mediterranean cultures believed coral was the petrified blood of Medusa, while Pacific cultures see reefs as ancestral formations.',
      media_presence: 'Before-and-after bleaching imagery has made coral one of the most visually compelling symbols of climate change.',
      cultural_paradox: 'The most biodiverse marine ecosystems on Earth are collapsing faster than any terrestrial habitat, yet remain largely out of sight and mind.'
    },
    hero_stat: '80-98% of Caribbean staghorn coral lost since the 1980s',
    root_causes_comb: {
      capability: ['Coral restoration techniques cannot scale to match rate of loss', 'Disease mechanisms poorly understood limiting treatment options', 'Public cannot directly observe reef decline without diving equipment'],
      opportunity: ['Global CO2 emissions continue rising despite climate agreements', 'Coastal development runoff unregulated in many reef regions', 'Marine protected areas cover insufficient reef area'],
      motivation: ['Climate action perceived as economically costly in short term', 'Reef degradation invisible to most voters and policymakers', 'Tourism industry slow to invest in reef protection versus exploitation']
    },
    evidence_summary: 'Chasing Coral (2017) won the Audience Award at Sundance and generated measurable increases in coral reef awareness and conservation donations, demonstrating time-lapse documentation as powerful advocacy tool (Jones et al., 2019).',
    academic_references: ['Aronson, R.B. & Precht, W.F. (2001). White-band disease and the changing face of Caribbean coral reefs. Hydrobiologia, 460(1), pp.25-38.', 'Hughes, T.P. et al. (2017). Global warming and recurrent mass bleaching of corals. Nature, 543(7645), pp.373-377.'],
    search_terms: ['coral reef', 'coral bleaching', 'reef conservation', 'chasing coral']
  },
  {
    slug: 'amazon-river-dolphin',
    taxonomy: {
      scientific_name: 'Inia geoffrensis',
      common_name: 'Amazon River Dolphin',
      family: 'Iniidae',
      order: 'Artiodactyla',
      class: 'Mammalia'
    },
    habitat: {
      type: 'Freshwater',
      description: 'The Amazon river dolphin, or boto, navigates the murky, tanin-stained waters of the Amazon and Orinoco river basins, threading between submerged tree trunks in flooded forests and hunting fish in channels where visibility drops to zero. These remarkable cetaceans have evolved to thrive in one of the most complex freshwater environments on Earth.\n\nDuring the wet season, river dolphins follow the rising waters into the varzea floodplain forests, swimming between trees in water several metres deep. Their flexible necks and small eyes are adaptations to this cluttered environment, where echolocation replaces sight as the primary sense for navigation and hunting.\n\nIn the dry season, dolphins concentrate in the main river channels and deeper lakes, where receding waters trap fish in ever-shrinking pools. The pink coloration of adult males intensifies with age and activity, flushing brighter during social encounters in these seasonal congregations.',
      range_countries: ['Brazil', 'Bolivia', 'Colombia', 'Ecuador', 'Peru', 'Venezuela', 'Guyana'],
      key_locations: ['Amazon River mainstem', 'Rio Negro', 'Orinoco Basin', 'Madeira River', 'Mamiraua Reserve']
    },
    threats: [
      { name: 'Dam Construction', description: 'Hydroelectric dams fragment river systems, isolating dolphin populations and altering water flow, sediment, and fish migration patterns.' },
      { name: 'Mercury Pollution', description: 'Gold mining releases mercury into Amazonian waterways, bioaccumulating through the food chain to toxic levels in dolphin tissues.' },
      { name: 'Bycatch and Intentional Killing', description: 'Dolphins are caught in fishing nets and sometimes deliberately killed for use as fish bait or out of perceived competition with fisheries.' },
      { name: 'Deforestation', description: 'Loss of floodplain forests reduces the seasonal habitat that dolphins use for feeding during high water periods.' },
      { name: 'Water Pollution', description: 'Agricultural runoff, sewage, and industrial waste degrade water quality throughout the Amazon basin.' }
    ],
    conservation: {
      iucn_status: 'Endangered',
      population_estimate: 'Unknown - tens of thousands estimated',
      population_trend: 'Decreasing',
      key_programs: ['South American River Dolphin Initiative', 'WWF Amazon Programme', 'Mamiraua Sustainable Development Reserve', 'IWC Scientific Committee']
    },
    cultural_significance: {
      cinema: 'Pink river dolphins appear in Amazon documentaries as mystical inhabitants of flooded forests, their unusual appearance captivating audiences.',
      literature: 'The boto features in magical realist literature of South America, blurring boundaries between the natural and supernatural.',
      mythology: 'In Amazonian folklore, the boto can transform into a handsome man who seduces women at riverside festivals, explaining unexpected pregnancies.',
      media_presence: 'River dolphins represent the hidden biodiversity of freshwater systems, often featured in documentaries about Amazon threats.',
      cultural_paradox: 'Protected by folklore and superstition for centuries, river dolphins now face threats from the same modernization that erodes traditional beliefs.'
    },
    hero_stat: '65% population decline in Amazon river dolphins over 20 years',
    root_causes_comb: {
      capability: ['Fishers lack bycatch prevention technology for river gillnets', 'Mercury monitoring systems inadequate across vast river network', 'Limited scientific capacity to survey remote river populations'],
      opportunity: ['Dam construction accelerating across Amazon tributaries', 'Gold mining expanding into previously inaccessible areas', 'Weak environmental enforcement in remote river communities'],
      motivation: ['Hydroelectric power prioritized as "green" energy despite biodiversity impact', 'Dolphins perceived as fishing competitors by local communities', 'Gold mining provides livelihood in areas with few economic alternatives']
    },
    evidence_summary: 'Amazon documentaries featuring river dolphins have raised awareness of freshwater biodiversity threats, though measuring direct conservation impact is complicated by the remoteness of river dolphin habitat and limited baseline data.',
    academic_references: ['da Silva, V.M.F. et al. (2018). Amazon river dolphin (Inia geoffrensis). IUCN Red List Assessment.', 'Mintzer, V.J. et al. (2013). Effect of illegal fishing on population decline of the Amazonian boto. Biological Conservation, 165, pp.154-160.'],
    search_terms: ['amazon dolphin', 'river dolphin', 'pink dolphin amazon', 'boto dolphin']
  }
];

// ============================================================
// TMDB API FUNCTIONS
// ============================================================

async function searchTMDB(query, options = {}) {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    query,
    ...options
  });
  const url = `${TMDB_BASE}/search/movie?${params}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  TMDB request failed: ${res.status} for query "${query}"`);
    return [];
  }
  const data = await res.json();
  return (data.results || []).map((m) => ({
    title: m.title,
    year: m.release_date ? parseInt(m.release_date.split('-')[0], 10) : null,
    overview: m.overview || '',
    poster_path: m.poster_path,
    backdrop_path: m.backdrop_path,
    vote_average: m.vote_average,
    genre_ids: m.genre_ids || [],
    id: m.id
  }));
}

async function getMovieDetails(movieId) {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    append_to_response: 'credits'
  });
  const url = `${TMDB_BASE}/movie/${movieId}?${params}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  Failed to fetch details for movie ${movieId}: ${res.status}`);
    return null;
  }
  const data = await res.json();
  const director = data.credits?.crew?.find(c => c.job === 'Director');
  return {
    director: director ? director.name : null,
    backdrop_path: data.backdrop_path,
    genres: (data.genres || []).map(g => g.id)
  };
}

// ============================================================
// SEMANTIC FILTERING AND SCORING
// ============================================================

function textContainsNatureKeywords(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return NATURE_KEYWORDS.some(kw => lower.includes(kw));
}

function isSemanticTrap(movie, speciesName) {
  const genreIds = new Set(movie.genre_ids);
  const hasTrapGenre = [...genreIds].some(g => TRAP_GENRES.has(g));
  if (!hasTrapGenre) return false;

  const overviewLower = (movie.overview || '').toLowerCase();
  const speciesLower = speciesName.toLowerCase();

  const hasNatureContext = NATURE_KEYWORDS.some(kw => overviewLower.includes(kw));
  const overviewMentionsSpecies = overviewLower.includes(speciesLower) &&
    (overviewLower.includes('animal') || overviewLower.includes('wildlife') ||
     overviewLower.includes('wild') || overviewLower.includes('nature') ||
     overviewLower.includes('endangered') || overviewLower.includes('conservation'));

  if (!hasNatureContext && !overviewMentionsSpecies) return true;
  return false;
}

function calculateRelevanceScore(movie, speciesTerms) {
  let score = 0;
  const genreIds = new Set(movie.genre_ids);
  const overviewLower = (movie.overview || '').toLowerCase();
  const titleLower = (movie.title || '').toLowerCase();

  if (genreIds.has(99)) score += 50;

  const speciesInOverview = speciesTerms.some(term => overviewLower.includes(term.toLowerCase()));
  if (speciesInOverview) score += 30;

  const speciesInTitle = speciesTerms.some(term => titleLower.includes(term.toLowerCase()));
  const natureInTitle = NATURE_KEYWORDS.some(kw => titleLower.includes(kw));
  if (speciesInTitle && natureInTitle) {
    score += 20;
  } else if (speciesInTitle) {
    score += 10;
  }

  const conservationTerms = ['wildlife', 'conservation', 'endangered', 'habitat', 'ecosystem', 'biodiversity', 'species', 'extinction'];
  const hasConservationContext = conservationTerms.some(t => overviewLower.includes(t));
  if (hasConservationContext) score += 15;

  const environmentTerms = ['nature', 'forest', 'ocean', 'jungle', 'reef', 'marine', 'safari', 'wild'];
  const hasEnvironmentContext = environmentTerms.some(t => overviewLower.includes(t));
  if (hasEnvironmentContext && !hasConservationContext) score += 5;

  return score;
}

function classifyNarrativeTechnique(movie) {
  const genreIds = new Set(movie.genre_ids);
  const overviewLower = (movie.overview || '').toLowerCase();

  if (genreIds.has(99)) {
    if (overviewLower.includes('host') || overviewLower.includes('presenter') ||
        overviewLower.includes('attenborough') || overviewLower.includes('narrat') ||
        overviewLower.includes('guide') || overviewLower.includes('explores')) {
      return 'presenter-led';
    }
    if (overviewLower.includes('journey') || overviewLower.includes('quest') ||
        overviewLower.includes('expedition') || overviewLower.includes('adventure') ||
        overviewLower.includes('trek') || overviewLower.includes('search')) {
      return 'adventure-narrative';
    }
    if (overviewLower.includes('recreat') || overviewLower.includes('dramatiz') ||
        overviewLower.includes('re-enact') || overviewLower.includes('reconstruct') ||
        overviewLower.includes('time-lapse') || overviewLower.includes('timelapse')) {
      return 'dramatic-reconstruction';
    }
    if (overviewLower.includes('learn') || overviewLower.includes('teach') ||
        overviewLower.includes('educational') || overviewLower.includes('children') ||
        overviewLower.includes('school') || overviewLower.includes('explain')) {
      return 'educational';
    }
    return 'observational';
  }

  if (genreIds.has(16)) {
    if (overviewLower.includes('animal') || overviewLower.includes('creature') ||
        overviewLower.includes('talk') || overviewLower.includes('voice')) {
      return 'anthropomorphic';
    }
    return 'fiction-featuring';
  }

  if (genreIds.has(10751) || genreIds.has(12)) {
    if (overviewLower.includes('journey') || overviewLower.includes('adventure') ||
        overviewLower.includes('quest') || overviewLower.includes('discover')) {
      return 'adventure-narrative';
    }
  }

  return 'fiction-featuring';
}

function classifyMedia(movie) {
  const genreIds = new Set(movie.genre_ids);
  if (genreIds.has(99)) return 'documentary';
  if (genreIds.has(16) && (genreIds.has(10751) || genreIds.has(12))) return 'educational';
  return 'fiction';
}

// ============================================================
// SPECIES MEDIA FETCH WITH SEMANTIC FILTERING
// ============================================================

async function fetchSpeciesMedia(species) {
  const name = species.taxonomy.common_name;
  const searchTerms = species.search_terms || [name.toLowerCase()];

  const queries = [
    `"${name}" wildlife`,
    `"${name}" nature documentary`,
    `"${name}" conservation`,
    name
  ];

  const allResults = new Map();

  for (const query of queries) {
    const results = await searchTMDB(query);
    await sleep(250);
    for (const movie of results) {
      if (!allResults.has(movie.id)) {
        allResults.set(movie.id, { movie, query_source: query });
      }
    }
  }

  console.log(`    Raw results: ${allResults.size} unique films found`);

  const filtered = [];
  let rejectedTraps = 0;
  let rejectedLowScore = 0;

  for (const [id, { movie, query_source }] of allResults) {
    if (isSemanticTrap(movie, name)) {
      rejectedTraps++;
      continue;
    }

    const score = calculateRelevanceScore(movie, searchTerms);
    if (score < 40) {
      rejectedLowScore++;
      continue;
    }

    filtered.push({
      ...movie,
      relevance_score: score,
      query_source
    });
  }

  console.log(`    Rejected: ${rejectedTraps} semantic traps, ${rejectedLowScore} low-relevance`);
  console.log(`    Kept: ${filtered.length} relevant results`);

  filtered.sort((a, b) => b.relevance_score - a.relevance_score);
  const top = filtered.slice(0, 15);

  const enriched = [];
  for (const movie of top) {
    await sleep(250);
    const details = await getMovieDetails(movie.id);

    const entry = {
      title: movie.title,
      year: movie.year,
      director: details ? details.director : null,
      tmdb_url: `https://www.themoviedb.org/movie/${movie.id}`,
      poster_path: movie.poster_path,
      backdrop_path: details ? details.backdrop_path : movie.backdrop_path,
      overview: movie.overview,
      classification: classifyMedia(movie),
      narrative_technique: classifyNarrativeTechnique(movie),
      relevance_score: movie.relevance_score,
      query_source: movie.query_source,
      genre_ids: movie.genre_ids,
      vote_average: movie.vote_average
    };

    enriched.push(entry);
  }

  return enriched;
}

// ============================================================
// HERO IMAGE SELECTION
// ============================================================

function selectHeroImage(media) {
  const docs = media
    .filter(m => m.classification === 'documentary' && m.backdrop_path)
    .sort((a, b) => b.relevance_score - a.relevance_score);

  if (docs.length > 0) {
    return {
      url: `${TMDB_IMAGE_BASE}${docs[0].backdrop_path}`,
      credit: 'TMDB',
      source: 'tmdb'
    };
  }

  const withBackdrop = media.filter(m => m.backdrop_path);
  if (withBackdrop.length > 0) {
    return {
      url: `${TMDB_IMAGE_BASE}${withBackdrop[0].backdrop_path}`,
      credit: 'TMDB',
      source: 'tmdb'
    };
  }

  return { url: null, credit: null, source: null };
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Fetching TMDB data for ${SPECIES.length} species...`);
  console.log('');

  for (const species of SPECIES) {
    console.log(`Processing: ${species.taxonomy.common_name} (${species.slug})`);
    const tmdb_media = await fetchSpeciesMedia(species);
    const hero_image = selectHeroImage(tmdb_media);

    // Build enriched taxonomy with URLs
    const taxonomyUrls = TAXONOMY_URLS[species.slug] || {};
    const enrichedTaxonomy = {
      ...species.taxonomy,
      gbif_url: taxonomyUrls.gbif_url,
      iucn_url: taxonomyUrls.iucn_url
    };

    // Build photos array
    const photosData = PHOTOS[species.slug] || [];
    const photos = photosData.map(p => ({
      url: commonsThumbUrl(p.path),
      alt: p.alt,
      credit: p.credit,
      photographer: p.photographer
    }));

    // Get cultural_depth
    const cultural_depth = CULTURAL_DEPTH[species.slug] || {};

    // Get COM-B with sources
    const com_b = COM_B[species.slug] || {};

    // Get interesting facts with source URLs
    const interesting_facts = INTERESTING_FACTS[species.slug] || [];

    // Get globe layers with protected areas
    const globe_layers = GLOBE_LAYERS[species.slug] || {};

    // Get data sources with URLs
    const data_sources = DATA_SOURCES[species.slug] || [];

    const output = {
      taxonomy: enrichedTaxonomy,
      habitat: species.habitat,
      threats: species.threats,
      conservation: species.conservation,
      cultural_significance: species.cultural_significance,
      hero_stat: species.hero_stat,
      hero_image,
      root_causes_comb: species.root_causes_comb,
      com_b,
      evidence_summary: species.evidence_summary,
      academic_references: [...SHARED_ACADEMIC_REFERENCES, ...(species.academic_references || [])],
      interesting_facts,
      photos,
      cultural_depth,
      globe_layers,
      data_sources,
      tmdb_media
    };

    const filePath = resolve(OUTPUT_DIR, `${species.slug}.json`);
    writeFileSync(filePath, JSON.stringify(output, null, 2));
    console.log(`    Written: public/data/${species.slug}.json (${tmdb_media.length} media entries)`);
    console.log('');
  }

  console.log('Done! All species data files generated.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
