import { SPECIES } from './data/species-registry.js';

/**
 * Species Gallery - renders species cards into the #species-section container
 * with ecosystem filtering and glass card hover effects.
 */

const IUCN_LABELS = {
  CR: 'Critically Endangered',
  EN: 'Endangered',
  VU: 'Vulnerable',
  NT: 'Near Threatened',
  LC: 'Least Concern'
};

const HOOK_SENTENCES = {
  tiger: 'The most culturally visible big cat, yet fewer than 4,500 remain in the wild.',
  'snow-leopard': 'The ghost of the mountains, rarely seen on camera or in the wild.',
  orangutan: 'Our closest forest-dwelling relative, losing habitat to palm oil.',
  'hawksbill-turtle': 'Ancient mariners of coral reefs, hunted for their beautiful shells.',
  'blue-whale': 'The largest animal ever to live, still recovering from whaling.',
  'african-elephant': 'Keystone engineers of the savanna, threatened by ivory trade.',
  'polar-bear': 'Icons of the Arctic, their sea ice habitat is disappearing.',
  'giant-panda': 'Conservation success story and global symbol of endangered wildlife.',
  'coral-reef': 'Not a single species but an entire ecosystem under threat.',
  'amazon-river-dolphin': 'Pink phantoms of the Amazon, entangled in local mythology.'
};

function getEcosystems() {
  const ecosystems = new Set();
  SPECIES.forEach(s => ecosystems.add(s.ecosystem));
  return ['All', ...Array.from(ecosystems).sort()];
}

function createFilterButtons(container, onFilter) {
  const ecosystems = getEcosystems();
  const filterBar = document.createElement('div');
  filterBar.className = 'species-gallery__filters';
  filterBar.setAttribute('role', 'toolbar');
  filterBar.setAttribute('aria-label', 'Filter by ecosystem');

  ecosystems.forEach(eco => {
    const btn = document.createElement('button');
    btn.className = 'species-gallery__filter-btn glass-card';
    btn.textContent = eco;
    btn.dataset.ecosystem = eco;
    if (eco === 'All') btn.classList.add('species-gallery__filter-btn--active');
    btn.addEventListener('click', () => {
      container.querySelectorAll('.species-gallery__filter-btn').forEach(b =>
        b.classList.remove('species-gallery__filter-btn--active')
      );
      btn.classList.add('species-gallery__filter-btn--active');
      onFilter(eco);
    });
    filterBar.appendChild(btn);
  });

  return filterBar;
}

function createSpeciesCard(species) {
  const card = document.createElement('a');
  card.className = 'glass-card species-gallery__card';
  card.href = `species/${species.id}.html`;
  card.dataset.ecosystem = species.ecosystem;
  card.setAttribute('aria-label', `View ${species.commonName} profile`);

  card.innerHTML = `
    <div class="species-gallery__card-header">
      <span class="species-gallery__iucn-badge species-gallery__iucn-badge--${species.iucnStatus.toLowerCase()}">${species.iucnStatus}</span>
      <span class="species-gallery__ecosystem-tag">${species.ecosystem}</span>
    </div>
    <h3 class="species-gallery__card-name">${species.commonName}</h3>
    <p class="species-gallery__card-scientific">${species.scientificName}</p>
    <p class="species-gallery__card-hook">${HOOK_SENTENCES[species.id] || ''}</p>
    <div class="species-gallery__card-accent" style="background-color: ${species.accentColor}"></div>
  `;

  return card;
}

function filterCards(container, ecosystem) {
  const cards = container.querySelectorAll('.species-gallery__card');
  cards.forEach(card => {
    if (ecosystem === 'All' || card.dataset.ecosystem === ecosystem) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

export function initSpeciesGallery() {
  const section = document.getElementById('species-section');
  if (!section) return;

  const content = section.querySelector('.section__content');
  if (!content) return;

  // Create filter buttons
  const filterBar = createFilterButtons(content, (eco) => {
    filterCards(grid, eco);
  });
  content.appendChild(filterBar);

  // Create card grid
  const grid = document.createElement('div');
  grid.className = 'species-gallery__grid';

  SPECIES.forEach(species => {
    const card = createSpeciesCard(species);
    grid.appendChild(card);
  });

  content.appendChild(grid);
}
