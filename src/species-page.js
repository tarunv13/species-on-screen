import './species-page.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w300';
const TMDB_IMAGE_LARGE = 'https://image.tmdb.org/t/p/original';
const slug = document.body.dataset.species;

async function loadSpeciesData() {
  const loadingEl = document.querySelector('.species-page-loading');
  try {
    const response = await fetch(`/species-on-screen/data/${slug}.json`);
    if (!response.ok) throw new Error(`Failed to load data for ${slug}`);
    const data = await response.json();
    renderSpeciesPage(data);
    document.body.classList.add('sp-loaded');
    initAnimations();
  } catch (error) {
    console.error(error);
    if (loadingEl) {
      loadingEl.textContent = 'Unable to load species data. Please try again later.';
    }
  }
}

window.addEventListener('error', () => document.body.classList.remove('sp-loaded'));

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderSpeciesPage(data) {
  const main = document.getElementById('main-content');
  const sections = [
    renderHero(data),
    renderScience(data),
    renderOnScreen(data),
    renderRootCauses(data),
    renderEvidence(data),
    renderReferences(data),
    renderFooter()
  ].filter(Boolean);

  main.innerHTML = sections.join('');
  initBackToTop();
}

// ============================================================
// Section 1: Hero Moment
// ============================================================
function renderHero(data) {
  const name = data.taxonomy && data.taxonomy.common_name;
  const scientific = data.taxonomy && data.taxonomy.scientific_name;
  const status = data.conservation && data.conservation.iucn_status;
  const heroStat = data.hero_stat;

  let bgStyle = '';
  if (data.hero_image && data.hero_image.url) {
    bgStyle = `style="background-image: linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.7) 60%, #0a0a0f 100%), url('${data.hero_image.url}')"`;
  }

  return `
    <section class="sp-section sp-hero" ${bgStyle}>
      <div class="sp-hero__content">
        <h1 class="sp-hero__title">${escapeHtml(name)}</h1>
        ${scientific ? `<p class="sp-hero__scientific">${escapeHtml(scientific)}</p>` : ''}
        ${status ? `<span class="sp-badge sp-badge--${statusClass(status)}">${escapeHtml(status)}</span>` : ''}
        ${heroStat ? `<p class="sp-hero__stat">${escapeHtml(heroStat)}</p>` : ''}
      </div>
    </section>
  `;
}

// ============================================================
// Section 2: The Science
// ============================================================
function renderScience(data) {
  const taxonomy = data.taxonomy;
  const conservation = data.conservation;
  const habitat = data.habitat;

  if (!taxonomy && !conservation && !habitat) return '';

  const taxonomyRows = [];
  if (taxonomy) {
    if (taxonomy.class) taxonomyRows.push(['Class', taxonomy.class]);
    if (taxonomy.order) taxonomyRows.push(['Order', taxonomy.order]);
    if (taxonomy.family) taxonomyRows.push(['Family', taxonomy.family]);
    if (taxonomy.scientific_name) taxonomyRows.push(['Species', taxonomy.scientific_name]);
  }

  const taxonomyTable = taxonomyRows.length > 0 ? `
    <div class="sp-science__taxonomy">
      <h3 class="sp-science__subheading">Taxonomy</h3>
      <table class="sp-taxonomy-table">
        <tbody>
          ${taxonomyRows.map(([label, value]) => `
            <tr>
              <td class="sp-taxonomy-table__label">${escapeHtml(label)}</td>
              <td class="sp-taxonomy-table__value">${escapeHtml(value)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : '';

  let populationHtml = '';
  if (conservation) {
    const trendArrow = getTrendArrow(conservation.population_trend);
    populationHtml = `
      <div class="sp-science__population">
        <h3 class="sp-science__subheading">Population</h3>
        <div class="sp-science__pop-grid">
          ${conservation.population_estimate ? `
            <div class="sp-science__pop-item">
              <span class="sp-science__pop-label">Estimate</span>
              <span class="sp-science__pop-value">${escapeHtml(conservation.population_estimate)}</span>
            </div>
          ` : ''}
          ${conservation.population_trend ? `
            <div class="sp-science__pop-item">
              <span class="sp-science__pop-label">Trend</span>
              <span class="sp-science__pop-value">${trendArrow} ${escapeHtml(conservation.population_trend)}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  let habitatHtml = '';
  if (habitat) {
    const paragraphs = habitat.description
      ? habitat.description.split('\n\n').map(p => `<p>${escapeHtml(p)}</p>`).join('')
      : '';

    habitatHtml = `
      <div class="sp-science__habitat">
        <h3 class="sp-science__subheading">Habitat${habitat.type ? `: ${escapeHtml(habitat.type)}` : ''}</h3>
        ${paragraphs ? `<div class="sp-science__habitat-desc">${paragraphs}</div>` : ''}
        ${habitat.range_countries && habitat.range_countries.length > 0 ? `
          <div class="sp-science__range">
            <h4>Range Countries</h4>
            <p>${escapeHtml(habitat.range_countries.join(', '))}</p>
          </div>
        ` : ''}
        ${habitat.key_locations && habitat.key_locations.length > 0 ? `
          <div class="sp-science__locations">
            <h4>Key Locations</h4>
            <ul>${habitat.key_locations.map(loc => `<li>${escapeHtml(loc)}</li>`).join('')}</ul>
          </div>
        ` : ''}
      </div>
    `;
  }

  return `
    <section class="sp-section sp-science">
      <div class="sp-section__inner">
        <h2 class="sp-section__heading">The Science</h2>
        <div class="sp-science__grid">
          ${taxonomyTable}
          ${populationHtml}
        </div>
        ${habitatHtml}
      </div>
    </section>
  `;
}

function getTrendArrow(trend) {
  if (!trend) return '';
  const lower = trend.toLowerCase();
  if (lower === 'increasing') return '<span class="sp-trend sp-trend--up" aria-label="Increasing">&#9650;</span>';
  if (lower === 'decreasing') return '<span class="sp-trend sp-trend--down" aria-label="Decreasing">&#9660;</span>';
  return '<span class="sp-trend sp-trend--stable" aria-label="Stable">&#9654;</span>';
}

// ============================================================
// Section 3: On Screen
// ============================================================
function renderOnScreen(data) {
  const media = data.tmdb_media;
  const speciesName = data.taxonomy && data.taxonomy.common_name;

  if (!media || media.length === 0) {
    return `
      <section class="sp-section sp-onscreen sp-section--alt">
        <div class="sp-section__inner">
          <h2 class="sp-section__heading">On Screen</h2>
          <p class="sp-onscreen__empty">No films or documentaries catalogued yet for ${escapeHtml(speciesName || 'this species')}. Check back as our database grows.</p>
        </div>
      </section>
    `;
  }

  // Group by classification
  const groups = { documentary: [], fiction: [], educational: [] };
  media.forEach(item => {
    const cls = (item.classification || 'fiction').toLowerCase();
    if (groups[cls]) {
      groups[cls].push(item);
    } else {
      groups.fiction.push(item);
    }
  });

  const order = ['documentary', 'fiction', 'educational'];
  const groupLabels = { documentary: 'Documentaries', fiction: 'Fiction', educational: 'Educational' };

  let mediaHtml = '';
  order.forEach(key => {
    if (groups[key].length === 0) return;
    mediaHtml += `
      <div class="sp-onscreen__group">
        <h3 class="sp-onscreen__group-label">${groupLabels[key]}</h3>
        <div class="sp-onscreen__grid">
          ${groups[key].map(item => renderMediaCard(item)).join('')}
        </div>
      </div>
    `;
  });

  return `
    <section class="sp-section sp-onscreen sp-section--alt">
      <div class="sp-section__inner">
        <h2 class="sp-section__heading">On Screen</h2>
        <p class="sp-section__intro">Films and documentaries featuring ${escapeHtml(speciesName || 'this species')}, catalogued as part of the observatory's investigation into narrative techniques and audience engagement.</p>
        ${mediaHtml}
      </div>
    </section>
  `;
}

function renderMediaCard(item) {
  const posterUrl = item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : null;
  const year = item.year || '';
  const overview = item.overview || '';
  const truncatedOverview = overview.length > 180 ? overview.slice(0, 180) + '...' : overview;
  const titleLink = item.tmdb_url
    ? `<a href="${escapeHtml(item.tmdb_url)}" target="_blank" rel="noopener noreferrer" class="sp-media-card__title-link">${escapeHtml(item.title)}</a>`
    : `<span>${escapeHtml(item.title)}</span>`;

  return `
    <article class="sp-media-card">
      ${posterUrl
        ? `<img class="sp-media-card__poster" src="${posterUrl}" alt="Poster for ${escapeHtml(item.title)}" loading="lazy" onerror="this.style.display='none'" />`
        : `<div class="sp-media-card__no-poster"><span>No Poster</span></div>`
      }
      <div class="sp-media-card__info">
        <h4 class="sp-media-card__title">${titleLink}</h4>
        <div class="sp-media-card__meta">
          ${year ? `<span class="sp-media-card__year">${year}</span>` : ''}
          ${item.director ? `<span class="sp-media-card__director">${escapeHtml(item.director)}</span>` : ''}
        </div>
        <div class="sp-media-card__badges">
          ${item.classification ? `<span class="sp-badge sp-badge--classification">${escapeHtml(item.classification)}</span>` : ''}
          ${item.narrative_technique ? `<span class="sp-badge sp-badge--technique">${escapeHtml(item.narrative_technique.replace(/-/g, ' '))}</span>` : ''}
        </div>
        ${truncatedOverview ? `<p class="sp-media-card__overview">${escapeHtml(truncatedOverview)}</p>` : ''}
      </div>
    </article>
  `;
}

// ============================================================
// Section 5: Root Causes (COM-B)
// ============================================================
function renderRootCauses(data) {
  const comb = data.root_causes_comb;
  if (!comb) return '';

  const hasContent = (comb.capability && comb.capability.length > 0) ||
                     (comb.opportunity && comb.opportunity.length > 0) ||
                     (comb.motivation && comb.motivation.length > 0);
  if (!hasContent) return '';

  const renderColumn = (title, items, colorClass) => {
    if (!items || items.length === 0) return '';
    return `
      <div class="sp-comb__column sp-comb__column--${colorClass}">
        <div class="sp-comb__header sp-comb__header--${colorClass}">
          <h3>${escapeHtml(title)}</h3>
        </div>
        <ul class="sp-comb__list">
          ${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </div>
    `;
  };

  return `
    <section class="sp-section sp-comb sp-section--alt">
      <div class="sp-section__inner">
        <h2 class="sp-section__heading">Root Causes (COM-B)</h2>
        <p class="sp-section__intro">Applying the COM-B behaviour change model (Michie et al., 2011), the barriers to conservation for this species can be structured across three domains: what people and systems lack the capability to do, what opportunities are missing or blocked, and what motivational factors prevent engagement.</p>
        <div class="sp-comb__grid">
          ${renderColumn('Capability', comb.capability, 'capability')}
          ${renderColumn('Opportunity', comb.opportunity, 'opportunity')}
          ${renderColumn('Motivation', comb.motivation, 'motivation')}
        </div>
      </div>
    </section>
  `;
}

// ============================================================
// Section 6: The Evidence
// ============================================================
function renderEvidence(data) {
  if (!data.evidence_summary) return '';

  const speciesName = data.taxonomy && data.taxonomy.common_name;

  return `
    <section class="sp-section sp-evidence">
      <div class="sp-section__inner">
        <h2 class="sp-section__heading">The Evidence</h2>
        <p class="sp-section__intro">What research shows about whether media coverage of ${escapeHtml(speciesName || 'this species')} correlates with conservation outcomes.</p>
        <div class="sp-evidence__content">
          <p>${escapeHtml(data.evidence_summary)}</p>
        </div>
      </div>
    </section>
  `;
}

// ============================================================
// Section 7: References
// ============================================================
function renderReferences(data) {
  if (!data.academic_references || data.academic_references.length === 0) return '';

  return `
    <section class="sp-section sp-references sp-section--alt">
      <div class="sp-section__inner">
        <h2 class="sp-section__heading">References</h2>
        <ol class="sp-references__list">
          ${data.academic_references.map(ref => `<li>${escapeHtml(ref)}</li>`).join('')}
        </ol>
      </div>
    </section>
  `;
}

// ============================================================
// Footer
// ============================================================
function renderFooter() {
  return `
    <footer class="sp-footer">
      <div class="sp-section__inner">
        <p>Eco-Cinema Observatory &mdash; An open research project</p>
        <p><a href="/species-on-screen/">Return to the Observatory</a></p>
      </div>
    </footer>
  `;
}

// ============================================================
// Back to Top Button
// ============================================================
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'sp-back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '&#9650;';
  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.add('sp-back-to-top--visible');
    } else {
      btn.classList.remove('sp-back-to-top--visible');
    }
  });
}

// ============================================================
// Utilities
// ============================================================
function statusClass(status) {
  if (!status) return '';
  return status.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

// ============================================================
// GSAP Scroll Animations
// ============================================================
function initAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.body.classList.remove('sp-loaded');
    return;
  }

  const sections = document.querySelectorAll('.sp-section');
  sections.forEach((section, i) => {
    if (i === 0) return; // Skip hero

    const heading = section.querySelector('.sp-section__heading');
    const panels = section.querySelectorAll('.sp-panel, .sp-media-card, .sp-comb__column, .sp-evidence__content, .sp-methodology__framework, .sp-methodology__notes, .sp-references__list');

    if (heading) {
      gsap.fromTo(heading,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.8,
          scrollTrigger: { trigger: heading, start: 'top 85%' }
        }
      );
    }

    panels.forEach((panel, j) => {
      gsap.fromTo(panel,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.6, delay: j * 0.1,
          scrollTrigger: { trigger: panel, start: 'top 90%' }
        }
      );
    });
  });

  ScrollTrigger.refresh();
}

// ============================================================
// Init
// ============================================================
if (slug) {
  loadSpeciesData();
}
