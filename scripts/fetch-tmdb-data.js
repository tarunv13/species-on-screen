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
// RESEARCH QUESTIONS
// ============================================================
const RESEARCH_QUESTIONS = [
  "RQ1: What is the evidence of digital content helping enhance awareness and effective changes in attitudes and behaviour towards conservation?",
  "RQ2: What narrative techniques are utilised in nature documentaries, and how do they affect public perception, audience engagement, and emotional response?",
  "RQ3: How can non-commercial video games be used to engage more with biodiversity and conservation?",
  "RQ4: What are the best practices to evaluate the effectiveness of digital content in raising awareness and enhancing public engagement in conservation initiatives?"
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
    methodology_notes: 'Tiger connects to RQ1 through measurable donation spikes following broadcast events; RQ2 through comparison of observational vs presenter-led documentary engagement; RQ4 through Project Tiger monitoring data providing baseline for media impact assessment.',
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
    methodology_notes: 'Snow leopard connects to RQ1 through donation tracking post-broadcast; RQ2 through analysis of dramatic cliff-hunting sequences as adventure-narrative technique; RQ3 through potential for mountain ecosystem simulation games; RQ4 through Snow Leopard Trust community monitoring programmes.',
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
    methodology_notes: 'Bornean orangutan connects to RQ1 through consumer behaviour change tracking post-documentary; RQ2 through emotional narrative techniques using infant rescue stories; RQ3 through supply-chain simulation game potential; RQ4 through RSPO certification uptake as measurable outcome.',
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
    methodology_notes: 'Hawksbill turtle connects to RQ1 through plastic policy changes linked to marine documentaries; RQ2 through underwater cinematography as observational technique; RQ3 through reef ecosystem simulation potential; RQ4 through beach monitoring volunteer recruitment post-broadcast.',
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
    methodology_notes: 'Blue whale connects to RQ1 through measurable public attitude shifts toward marine protection post-documentary; RQ2 through analysis of scale-revelation as sublime narrative technique; RQ3 through ocean exploration game design potential; RQ4 through marine protected area support polling as outcome measure.',
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
    methodology_notes: 'African elephant connects to RQ1 through documented policy change following documentary broadcast; RQ2 through investigative journalism as narrative technique in wildlife crime films; RQ3 through anti-poaching strategy game potential; RQ4 through ivory market closure as measurable policy outcome.',
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
    methodology_notes: 'Polar bear connects to RQ1 through climate attitude polling linked to documentary exposure; RQ2 through analysis of isolated-animal-in-peril as emotional narrative technique; RQ3 through climate simulation game design; RQ4 through public opinion polling on climate policy as outcome measure.',
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
    methodology_notes: 'Giant panda connects to RQ1 through WWF brand recognition and fundraising data; RQ2 through anthropomorphic narrative technique analysis in Kung Fu Panda vs observational documentaries; RQ3 through bamboo forest ecosystem management simulation; RQ4 through population recovery metrics as long-term outcome measure.',
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
    methodology_notes: 'Staghorn coral connects to RQ1 through Chasing Coral impact assessment data; RQ2 through time-lapse as dramatic-reconstruction narrative technique; RQ3 through reef-building simulation game potential; RQ4 through coral nursery volunteer recruitment as measurable engagement outcome.',
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
    methodology_notes: 'Amazon river dolphin connects to RQ1 through freshwater conservation awareness campaigns; RQ2 through mystical/folklore narrative integration in documentaries; RQ3 through river ecosystem management simulation; RQ4 through community attitude surveys in riverside communities as outcome measure.',
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

  // If it has trap genres but ALSO has nature keywords in overview, it might be legitimate
  const overviewLower = (movie.overview || '').toLowerCase();
  const titleLower = (movie.title || '').toLowerCase();
  const speciesLower = speciesName.toLowerCase();

  const hasNatureContext = NATURE_KEYWORDS.some(kw => overviewLower.includes(kw));
  const overviewMentionsSpecies = overviewLower.includes(speciesLower) &&
    (overviewLower.includes('animal') || overviewLower.includes('wildlife') ||
     overviewLower.includes('wild') || overviewLower.includes('nature') ||
     overviewLower.includes('endangered') || overviewLower.includes('conservation'));

  // It's a trap if it has trap genres and NO nature context
  if (!hasNatureContext && !overviewMentionsSpecies) return true;
  return false;
}

function calculateRelevanceScore(movie, speciesTerms) {
  let score = 0;
  const genreIds = new Set(movie.genre_ids);
  const overviewLower = (movie.overview || '').toLowerCase();
  const titleLower = (movie.title || '').toLowerCase();

  // Documentary genre = +50
  if (genreIds.has(99)) {
    score += 50;
  }

  // Overview contains actual species terms = +30
  const speciesInOverview = speciesTerms.some(term => overviewLower.includes(term.toLowerCase()));
  if (speciesInOverview) {
    score += 30;
  }

  // Title contains species + nature term = +20
  const speciesInTitle = speciesTerms.some(term => titleLower.includes(term.toLowerCase()));
  const natureInTitle = NATURE_KEYWORDS.some(kw => titleLower.includes(kw));
  if (speciesInTitle && natureInTitle) {
    score += 20;
  } else if (speciesInTitle) {
    score += 10;
  }

  // Overview mentions wildlife/conservation = +15
  const conservationTerms = ['wildlife', 'conservation', 'endangered', 'habitat', 'ecosystem', 'biodiversity', 'species', 'extinction'];
  const hasConservationContext = conservationTerms.some(t => overviewLower.includes(t));
  if (hasConservationContext) {
    score += 15;
  }

  // Overview mentions nature/environment = +5
  const environmentTerms = ['nature', 'forest', 'ocean', 'jungle', 'reef', 'marine', 'safari', 'wild'];
  const hasEnvironmentContext = environmentTerms.some(t => overviewLower.includes(t));
  if (hasEnvironmentContext && !hasConservationContext) {
    score += 5;
  }

  return score;
}

function classifyNarrativeTechnique(movie) {
  const genreIds = new Set(movie.genre_ids);
  const overviewLower = (movie.overview || '').toLowerCase();
  const titleLower = (movie.title || '').toLowerCase();

  // Documentary genre
  if (genreIds.has(99)) {
    // Check for presenter-led indicators
    if (overviewLower.includes('host') || overviewLower.includes('presenter') ||
        overviewLower.includes('attenborough') || overviewLower.includes('narrat') ||
        overviewLower.includes('guide') || overviewLower.includes('explores')) {
      return 'presenter-led';
    }
    // Check for adventure-narrative
    if (overviewLower.includes('journey') || overviewLower.includes('quest') ||
        overviewLower.includes('expedition') || overviewLower.includes('adventure') ||
        overviewLower.includes('trek') || overviewLower.includes('search')) {
      return 'adventure-narrative';
    }
    // Check for dramatic-reconstruction
    if (overviewLower.includes('recreat') || overviewLower.includes('dramatiz') ||
        overviewLower.includes('re-enact') || overviewLower.includes('reconstruct') ||
        overviewLower.includes('time-lapse') || overviewLower.includes('timelapse')) {
      return 'dramatic-reconstruction';
    }
    // Check for educational
    if (overviewLower.includes('learn') || overviewLower.includes('teach') ||
        overviewLower.includes('educational') || overviewLower.includes('children') ||
        overviewLower.includes('school') || overviewLower.includes('explain')) {
      return 'educational';
    }
    // Default documentary = observational
    return 'observational';
  }

  // Animation often anthropomorphic
  if (genreIds.has(16)) {
    if (overviewLower.includes('animal') || overviewLower.includes('creature') ||
        overviewLower.includes('talk') || overviewLower.includes('voice')) {
      return 'anthropomorphic';
    }
    return 'fiction-featuring';
  }

  // Family/Adventure films
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

  // Build multiple targeted queries
  const queries = [
    `"${name}" wildlife`,
    `"${name}" nature documentary`,
    `"${name}" conservation`,
    name
  ];

  const allResults = new Map(); // id -> { movie, query_source }

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

  // Filter and score
  const filtered = [];
  let rejectedTraps = 0;
  let rejectedLowScore = 0;

  for (const [id, { movie, query_source }] of allResults) {
    // Check for semantic traps
    if (isSemanticTrap(movie, name)) {
      rejectedTraps++;
      continue;
    }

    // Calculate relevance score
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

  // Sort by relevance score descending
  filtered.sort((a, b) => b.relevance_score - a.relevance_score);

  // Take top 15 results maximum
  const top = filtered.slice(0, 15);

  // Enrich with movie details (director, backdrop)
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
  // Find the highest-rated documentary with a backdrop
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

  // Fallback: any result with backdrop
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

    const output = {
      taxonomy: species.taxonomy,
      habitat: species.habitat,
      threats: species.threats,
      conservation: species.conservation,
      cultural_significance: species.cultural_significance,
      hero_stat: species.hero_stat,
      hero_image,
      root_causes_comb: species.root_causes_comb,
      evidence_summary: species.evidence_summary,
      methodology_notes: species.methodology_notes,
      research_questions: RESEARCH_QUESTIONS,
      academic_references: [...SHARED_ACADEMIC_REFERENCES, ...(species.academic_references || [])],
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
