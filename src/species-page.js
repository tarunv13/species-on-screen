import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SPECIES } from './data/species-registry.js';
import { initNav } from './nav.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Species Page - loads and renders individual species profile data.
 * Detects which species from the URL path, fetches JSON, populates sections.
 */

const BASE_PATH = '/species-on-screen/';

function getSlugFromPath() {
  const path = window.location.pathname;
  const match = path.match(/species\/([a-z0-9-]+)\.html/);
  return match ? match[1] : null;
}

function showLoading() {
  const loader = document.getElementById('species-loader');
  if (loader) loader.style.display = 'flex';
}

function hideLoading() {
  const loader = document.getElementById('species-loader');
  if (loader) loader.style.display = 'none';
}

function showError(message) {
  hideLoading();
  const errorEl = document.getElementById('species-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

function renderTaxonomy(data) {
  const container = document.getElementById('taxonomy-content');
  if (!container || !data.taxonomy) return;

  const taxonomy = data.taxonomy;
  const fields = [
    ['Kingdom', taxonomy.kingdom],
    ['Phylum', taxonomy.phylum],
    ['Class', taxonomy.class],
    ['Order', taxonomy.order],
    ['Family', taxonomy.family],
    ['Genus', taxonomy.genus],
    ['Species', taxonomy.species]
  ].filter(([, value]) => value);

  let html = '<table class="taxonomy-table">';
  fields.forEach(([label, value]) => {
    html += `<tr><th>${label}</th><td>${value}</td></tr>`;
  });
  html += '</table>';

  if (taxonomy.description) {
    html += `<p class="taxonomy-description">${taxonomy.description}</p>`;
  }

  container.innerHTML = html;
}

function renderHabitat(data) {
  const container = document.getElementById('habitat-content');
  if (!container || !data.habitat) return;

  const habitat = data.habitat;
  let html = '';

  if (habitat.description) {
    html += `<p>${habitat.description}</p>`;
  }
  if (habitat.range) {
    html += `<p><strong>Range:</strong> ${habitat.range}</p>`;
  }
  if (habitat.biome) {
    html += `<p><strong>Biome:</strong> ${habitat.biome}</p>`;
  }
  if (habitat.countries && habitat.countries.length > 0) {
    html += `<p><strong>Countries:</strong> ${habitat.countries.join(', ')}</p>`;
  }

  container.innerHTML = html;
}

function renderMedia(data) {
  const container = document.getElementById('media-content');
  if (!container || !data.media) return;

  if (data.media.length === 0) {
    container.innerHTML = '<p>No media appearances documented yet.</p>';
    return;
  }

  let html = '<div class="media-grid">';
  data.media.forEach(item => {
    html += `
      <div class="glass-card media-card">
        <h4 class="media-card__title">${item.title || 'Unknown'}</h4>
        <p class="media-card__year">${item.year || ''}</p>
        <p class="media-card__type">${item.type || 'Film'}</p>
        ${item.description ? `<p class="media-card__desc">${item.description}</p>` : ''}
      </div>
    `;
  });
  html += '</div>';

  container.innerHTML = html;
}

function renderThreats(data) {
  const container = document.getElementById('threats-content');
  if (!container || !data.threats) return;

  if (data.threats.length === 0) {
    container.innerHTML = '<p>No specific threats documented.</p>';
    return;
  }

  let html = '<ul class="threats-list">';
  data.threats.forEach(threat => {
    if (typeof threat === 'string') {
      html += `<li class="threats-list__item">${threat}</li>`;
    } else {
      html += `<li class="threats-list__item"><strong>${threat.name || ''}</strong>${threat.description ? ': ' + threat.description : ''}</li>`;
    }
  });
  html += '</ul>';

  container.innerHTML = html;
}

function renderConservation(data) {
  const container = document.getElementById('conservation-content');
  if (!container || !data.conservationStatus) return;

  const status = data.conservationStatus;
  let html = '';

  if (status.iucnStatus) {
    html += `<p><strong>IUCN Red List:</strong> ${status.iucnStatus}</p>`;
  }
  if (status.populationTrend) {
    html += `<p><strong>Population Trend:</strong> ${status.populationTrend}</p>`;
  }
  if (status.populationEstimate) {
    html += `<p><strong>Estimated Population:</strong> ${status.populationEstimate}</p>`;
  }
  if (status.description) {
    html += `<p>${status.description}</p>`;
  }
  if (status.efforts && status.efforts.length > 0) {
    html += '<h4>Conservation Efforts</h4><ul class="conservation-efforts">';
    status.efforts.forEach(effort => {
      html += `<li>${effort}</li>`;
    });
    html += '</ul>';
  }

  container.innerHTML = html;
}

function renderCulturalSignificance(data) {
  const container = document.getElementById('cultural-content');
  if (!container || !data.culturalSignificance) return;

  const cultural = data.culturalSignificance;
  let html = '';

  if (typeof cultural === 'string') {
    html = `<p>${cultural}</p>`;
  } else {
    if (cultural.description) {
      html += `<p>${cultural.description}</p>`;
    }
    if (cultural.mythology) {
      html += `<p><strong>Mythology:</strong> ${cultural.mythology}</p>`;
    }
    if (cultural.symbolism) {
      html += `<p><strong>Symbolism:</strong> ${cultural.symbolism}</p>`;
    }
    if (cultural.modernCulture) {
      html += `<p><strong>Modern Culture:</strong> ${cultural.modernCulture}</p>`;
    }
  }

  container.innerHTML = html;
}

function renderNavigation(slug) {
  const navContainer = document.getElementById('species-nav');
  if (!navContainer) return;

  const currentIndex = SPECIES.findIndex(s => s.id === slug);
  if (currentIndex === -1) return;

  const prevSpecies = SPECIES[(currentIndex - 1 + SPECIES.length) % SPECIES.length];
  const nextSpecies = SPECIES[(currentIndex + 1) % SPECIES.length];

  navContainer.innerHTML = `
    <a href="${prevSpecies.id}.html" class="species-nav__link species-nav__link--prev glass-card">
      <span class="species-nav__arrow">&larr;</span>
      <span class="species-nav__label">${prevSpecies.commonName}</span>
    </a>
    <a href="${nextSpecies.id}.html" class="species-nav__link species-nav__link--next glass-card">
      <span class="species-nav__label">${nextSpecies.commonName}</span>
      <span class="species-nav__arrow">&rarr;</span>
    </a>
  `;
}

function initScrollAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const panels = document.querySelectorAll('.species-page__section');
  panels.forEach(panel => {
    gsap.set(panel, { opacity: 0, y: 40 });
    gsap.to(panel, {
      opacity: 1,
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: panel,
        start: 'top 85%',
        end: 'top 55%',
        scrub: 1
      }
    });
  });
}

async function initSpeciesPage() {
  const slug = getSlugFromPath();
  if (!slug) {
    showError('Could not determine species from URL.');
    return;
  }

  showLoading();

  try {
    const response = await fetch(`${BASE_PATH}data/${slug}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load species data (${response.status})`);
    }

    const data = await response.json();
    hideLoading();

    renderTaxonomy(data);
    renderHabitat(data);
    renderMedia(data);
    renderThreats(data);
    renderConservation(data);
    renderCulturalSignificance(data);
    renderNavigation(slug);

    // Initialize scroll animations after content is rendered
    requestAnimationFrame(() => {
      initScrollAnimations();
    });
  } catch (error) {
    showError(`Unable to load species data. ${error.message}`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-loaded');
  initNav();
  initSpeciesPage();
});
