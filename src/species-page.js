import './style.css';
import './species-page.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w300';
const slug = document.body.dataset.species;

async function loadSpeciesData() {
  const loadingEl = document.querySelector('.species-page-loading');
  try {
    const response = await fetch(`/species-on-screen/data/${slug}.json`);
    if (!response.ok) throw new Error(`Failed to load data for ${slug}`);
    const data = await response.json();
    renderSpeciesPage(data);
    initAnimations();
  } catch (error) {
    console.error(error);
    if (loadingEl) {
      loadingEl.textContent = 'Unable to load species data. Please try again later.';
    }
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderSpeciesPage(data) {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    ${renderHero(data)}
    ${renderHabitat(data.habitat)}
    ${renderMedia(data.tmdb_media, data.taxonomy.common_name)}
    ${renderThreats(data.threats)}
    ${renderConservation(data.conservation)}
    ${renderCulturalSignificance(data.cultural_significance)}
    ${renderFooter()}
  `;
}

function renderHero(data) {
  return `
    <section class="sp-section sp-hero">
      <div class="sp-hero__content">
        <h1 class="sp-hero__title">${escapeHtml(data.taxonomy.common_name)}</h1>
        <p class="sp-hero__scientific">${escapeHtml(data.taxonomy.scientific_name)}</p>
        <div class="sp-hero__meta">
          <span class="sp-badge sp-badge--status sp-badge--${statusClass(data.conservation.iucn_status)}">${escapeHtml(data.conservation.iucn_status)}</span>
          <span class="sp-badge sp-badge--ecosystem">${escapeHtml(data.habitat.type)}</span>
        </div>
        ${data.conservation.population_estimate ? `
          <p class="sp-hero__stat">Estimated population: <strong>${escapeHtml(data.conservation.population_estimate)}</strong></p>
        ` : ''}
      </div>
    </section>
  `;
}

function renderHabitat(habitat) {
  const paragraphs = habitat.description.split('\n\n').map(p => `<p>${escapeHtml(p)}</p>`).join('');
  return `
    <section class="sp-section sp-habitat">
      <div class="section__content">
        <h2 class="sp-section__heading">Habitat</h2>
        <div class="glass-panel sp-panel">
          <div class="sp-habitat__description">${paragraphs}</div>
          <div class="sp-habitat__details">
            <div class="sp-habitat__range">
              <h3>Range</h3>
              <p>${escapeHtml(habitat.range_countries.join(', '))}</p>
            </div>
            <div class="sp-habitat__locations">
              <h3>Key Locations</h3>
              <ul>${habitat.key_locations.map(loc => `<li>${escapeHtml(loc)}</li>`).join('')}</ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderMedia(media, speciesName) {
  if (!media || media.length === 0) {
    return `
      <section class="sp-section sp-media">
        <div class="section__content">
          <h2 class="sp-section__heading">On Screen</h2>
          <p class="sp-media__empty">No films or documentaries catalogued yet for ${escapeHtml(speciesName)}. Check back as our database grows.</p>
        </div>
      </section>
    `;
  }

  const cards = media.slice(0, 12).map(item => {
    const posterUrl = item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : null;
    const year = item.year || '';
    const rating = item.vote_average ? item.vote_average.toFixed(1) : '';
    const overview = item.overview || '';
    const truncatedOverview = overview.length > 150 ? overview.slice(0, 150) + '...' : overview;

    return `
      <article class="sp-media-card glass-card">
        ${posterUrl
          ? `<img class="sp-media-card__poster" src="${posterUrl}" alt="Movie poster for ${escapeHtml(item.title)}" loading="lazy" />`
          : `<div class="sp-media-card__no-poster" aria-hidden="true"><span>No Poster</span></div>`
        }
        <div class="sp-media-card__info">
          <h3 class="sp-media-card__title">${escapeHtml(item.title)}</h3>
          <div class="sp-media-card__meta">
            ${year ? `<span class="sp-media-card__year">${year}</span>` : ''}
            ${rating ? `<span class="sp-media-card__rating" aria-label="Rating: ${rating} out of 10">&#9733; ${rating}</span>` : ''}
          </div>
          ${truncatedOverview ? `<p class="sp-media-card__overview">${escapeHtml(truncatedOverview)}</p>` : ''}
        </div>
      </article>
    `;
  }).join('');

  return `
    <section class="sp-section sp-media">
      <div class="section__content">
        <h2 class="sp-section__heading">On Screen</h2>
        <p class="sp-section__subtitle">Films and documentaries featuring ${escapeHtml(speciesName)}</p>
        <div class="sp-media-grid">${cards}</div>
      </div>
    </section>
  `;
}

function renderThreats(threats) {
  if (!threats || threats.length === 0) return '';

  const items = threats.map(threat => `
    <div class="sp-threat glass-panel">
      <h3 class="sp-threat__name">${escapeHtml(threat.name)}</h3>
      <p class="sp-threat__description">${escapeHtml(threat.description)}</p>
    </div>
  `).join('');

  return `
    <section class="sp-section sp-threats">
      <div class="section__content">
        <h2 class="sp-section__heading">Threats</h2>
        <div class="sp-threats__grid">${items}</div>
      </div>
    </section>
  `;
}

function renderConservation(conservation) {
  return `
    <section class="sp-section sp-conservation">
      <div class="section__content">
        <h2 class="sp-section__heading">Conservation Status</h2>
        <div class="glass-panel sp-panel sp-conservation__panel">
          <div class="sp-conservation__grid">
            <div class="sp-conservation__item">
              <span class="sp-conservation__label">IUCN Status</span>
              <span class="sp-conservation__value sp-badge--${statusClass(conservation.iucn_status)}">${escapeHtml(conservation.iucn_status)}</span>
            </div>
            <div class="sp-conservation__item">
              <span class="sp-conservation__label">Population</span>
              <span class="sp-conservation__value">${escapeHtml(conservation.population_estimate || 'Unknown')}</span>
            </div>
            <div class="sp-conservation__item">
              <span class="sp-conservation__label">Trend</span>
              <span class="sp-conservation__value">${escapeHtml(conservation.population_trend || 'Unknown')}</span>
            </div>
          </div>
          ${conservation.key_programs && conservation.key_programs.length > 0 ? `
            <div class="sp-conservation__programs">
              <h3>Key Programs</h3>
              <ul>${conservation.key_programs.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ul>
            </div>
          ` : ''}
        </div>
      </div>
    </section>
  `;
}

function renderCulturalSignificance(cultural) {
  if (!cultural) return '';

  const sections = [
    { key: 'cinema', label: 'Cinema', icon: '&#127916;' },
    { key: 'literature', label: 'Literature', icon: '&#128214;' },
    { key: 'mythology', label: 'Mythology & Symbolism', icon: '&#127757;' },
    { key: 'media_presence', label: 'Media Presence', icon: '&#128250;' },
    { key: 'cultural_paradox', label: 'The Paradox', icon: '&#9889;' },
  ].filter(s => cultural[s.key])
   .map(s => `
    <div class="sp-cultural__item glass-card">
      <span class="sp-cultural__icon" aria-hidden="true">${s.icon}</span>
      <h3>${s.label}</h3>
      <p>${escapeHtml(cultural[s.key])}</p>
    </div>
  `).join('');

  if (!sections) return '';

  return `
    <section class="sp-section sp-cultural">
      <div class="section__content">
        <h2 class="sp-section__heading">Cultural Significance</h2>
        <div class="sp-cultural__grid">${sections}</div>
      </div>
    </section>
  `;
}

function renderFooter() {
  return `
    <footer class="sp-footer">
      <div class="section__content">
        <p>Eco-Cinema Observatory - An open research project</p>
        <p><a href="/species-on-screen/">Return to the Observatory</a></p>
      </div>
    </footer>
  `;
}

function statusClass(status) {
  if (!status) return '';
  return status.toLowerCase().replace(/\s+/g, '-');
}

function initAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const sections = document.querySelectorAll('.sp-section');
  sections.forEach((section, i) => {
    if (i === 0) return; // Skip hero
    const heading = section.querySelector('.sp-section__heading');
    const panels = section.querySelectorAll('.glass-panel, .glass-card, .sp-media-card');

    if (heading) {
      gsap.set(heading, { opacity: 0, y: 30 });
      gsap.to(heading, {
        opacity: 1, y: 0, ease: 'power2.out', duration: 0.8,
        scrollTrigger: { trigger: heading, start: 'top 80%' }
      });
    }

    panels.forEach((panel, j) => {
      gsap.set(panel, { opacity: 0, y: 30 });
      gsap.to(panel, {
        opacity: 1, y: 0, ease: 'power2.out', duration: 0.6, delay: j * 0.1,
        scrollTrigger: { trigger: panel, start: 'top 85%' }
      });
    });
  });
}

if (slug) {
  loadSpeciesData();
}
