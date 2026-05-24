import './species-page.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_IMAGE_LARGE = 'https://image.tmdb.org/t/p/original';
const slug = document.body.dataset.species;

// ============================================================
// Lenis Smooth Scrolling
// ============================================================
function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
}

// ============================================================
// Data Loading
// ============================================================
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

// ============================================================
// Main Render
// ============================================================
function renderSpeciesPage(data) {
  const main = document.getElementById('main-content');
  const sections = [
    renderHero(data),
    renderParallaxDivider(data.photos && data.photos[1] ? data.photos[1].url : '', getSpeciesQuote(data, 0)),
    renderComicStrip(data),
    renderParallaxDivider(data.photos && data.photos[2] ? data.photos[2].url : '', getSpeciesQuote(data, 1)),
    renderScience(data),
    renderPhotos(data),
    renderCulturalDepth(data),
    renderRootCauses(data),
    renderOnScreen(data),
    renderInterestingFacts(data),
    renderProtectedAreas(data),
    renderEvidence(data),
    renderReferences(data),
    renderFooter()
  ].filter(Boolean);

  main.innerHTML = sections.join('');
  initBackToTop();
  initCulturalCardToggles();
}

function getSpeciesQuote(data, index) {
  const name = data.taxonomy && data.taxonomy.common_name ? data.taxonomy.common_name : 'this species';
  const quotes = [
    `In wildness is the preservation of the world.`,
    `The greatness of a nation can be judged by the way its animals are treated.`
  ];
  return quotes[index] || quotes[0];
}

// ============================================================
// Section: Hero
// ============================================================
function renderHero(data) {
  const name = data.taxonomy && data.taxonomy.common_name;
  const scientific = data.taxonomy && data.taxonomy.scientific_name;
  const status = data.conservation && data.conservation.iucn_status;
  const heroStat = data.hero_stat;

  let bgImage = '';
  let photoCredit = '';
  if (data.photos && data.photos.length > 0) {
    bgImage = data.photos[0].url;
    photoCredit = data.photos[0].photographer || data.photos[0].credit || '';
  } else if (data.hero_image && data.hero_image.url) {
    bgImage = data.hero_image.url;
  }

  let bgStyle = '';
  if (bgImage) {
    bgStyle = `style="background-image: linear-gradient(to bottom, rgba(250,250,248,0.3) 0%, rgba(250,250,248,0.6) 50%, rgba(250,250,248,0.9) 100%), url('${escapeHtml(bgImage)}')"`;
  }

  return `
    <section class="sp-section sp-hero" ${bgStyle}>
      <div class="sp-hero__content">
        <h1 class="sp-hero__title">${escapeHtml(name)}</h1>
        ${scientific ? `<p class="sp-hero__scientific">${escapeHtml(scientific)}</p>` : ''}
        ${status ? `<span class="sp-badge sp-badge--${statusClass(status)}">${escapeHtml(status)}</span>` : ''}
        ${heroStat ? `<p class="sp-hero__stat">${escapeHtml(heroStat)}</p>` : ''}
      </div>
      ${photoCredit ? `<div class="sp-hero__credit">${escapeHtml(photoCredit)}</div>` : ''}
    </section>
  `;
}

// ============================================================
// Section: Comic Strip
// ============================================================
function renderComicStrip(data) {
  const habitat = data.habitat;
  const threats = data.threats;
  const media = data.tmdb_media;
  const conservation = data.conservation;
  const speciesName = data.taxonomy && data.taxonomy.common_name;
  const photos = data.photos || [];

  const habitatDesc = habitat && habitat.description
    ? habitat.description.split('\n\n')[0].slice(0, 150) + '...'
    : 'Habitat information unavailable.';

  const primaryThreat = threats && threats.length > 0 ? threats[0] : null;
  const threatName = primaryThreat ? primaryThreat.name : 'Unknown';
  const threatDesc = primaryThreat ? primaryThreat.description.slice(0, 120) + '...' : '';

  const mediaCount = media ? media.length : 0;

  const iucnStatus = conservation ? conservation.iucn_status : 'Unknown';
  const keyProgram = conservation && conservation.key_programs && conservation.key_programs.length > 0
    ? conservation.key_programs[0]
    : 'Conservation programs active';

  const panelData = [
    { label: 'In the Wild', title: habitat ? habitat.type : 'Natural Habitat', text: habitatDesc },
    { label: 'Under Threat', title: threatName, text: threatDesc },
    { label: 'On Screen', title: `${mediaCount} Films & Documentaries`, text: `Explored in cinema as a symbol of ${speciesName ? speciesName.toLowerCase() : 'wildlife'} conservation.` },
    { label: 'The Future', title: iucnStatus, text: keyProgram }
  ];

  const panelsHtml = panelData.map((panel, i) => {
    const photo = photos[i % photos.length];
    const bgUrl = photo ? photo.url : '';
    return `
      <div class="comic-panel">
        ${bgUrl ? `<div class="comic-panel__bg" style="background-image: url('${escapeHtml(bgUrl)}')"></div>` : ''}
        <div class="comic-panel__content">
          <span class="comic-panel__label">${escapeHtml(panel.label)}</span>
          <h3 class="comic-panel__title">${escapeHtml(panel.title)}</h3>
          <p class="comic-panel__text">${escapeHtml(panel.text)}</p>
        </div>
      </div>
    `;
  }).join('');

  return `
    <section class="sp-section sp-comic sp-section--alt">
      <div class="sp-section__inner">
        <h2 class="sp-section__heading">The Story of the ${escapeHtml(speciesName)}</h2>
        <div class="comic-panels">
          ${panelsHtml}
        </div>
      </div>
    </section>
  `;
}

// ============================================================
// Section: The Science
// ============================================================
function renderScience(data) {
  const taxonomy = data.taxonomy;
  const conservation = data.conservation;
  const habitat = data.habitat;
  const dataSources = data.data_sources;

  if (!taxonomy && !conservation && !habitat) return '';

  const taxonomyRows = [];
  if (taxonomy) {
    if (taxonomy.class) taxonomyRows.push(['Class', taxonomy.class, null]);
    if (taxonomy.order) taxonomyRows.push(['Order', taxonomy.order, null]);
    if (taxonomy.family) taxonomyRows.push(['Family', taxonomy.family, null]);
    if (taxonomy.scientific_name) taxonomyRows.push(['Species', taxonomy.scientific_name, null]);
    if (taxonomy.gbif_url) taxonomyRows.push(['GBIF', 'View on GBIF', taxonomy.gbif_url]);
    if (taxonomy.iucn_url) taxonomyRows.push(['IUCN', 'View on IUCN Red List', taxonomy.iucn_url]);
  }

  const taxonomyTable = taxonomyRows.length > 0 ? `
    <div class="sp-science__taxonomy">
      <h3 class="sp-science__subheading">Taxonomy</h3>
      <table class="sp-taxonomy-table">
        <tbody>
          ${taxonomyRows.map(([label, value, url]) => `
            <tr>
              <td class="sp-taxonomy-table__label">${escapeHtml(label)}</td>
              <td class="sp-taxonomy-table__value">${url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(value)}</a>` : escapeHtml(value)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : '';

  // Find sources from the new array format
  let iucnSource = null;
  let populationSource = null;
  if (Array.isArray(dataSources)) {
    iucnSource = dataSources.find(s => s.type === 'assessment' || s.name.toLowerCase().includes('iucn'));
    populationSource = dataSources.find(s => s.type === 'population' || s.type === 'conservation');
  } else if (dataSources) {
    // Old object format fallback
    iucnSource = dataSources.iucn_status;
    populationSource = dataSources.population;
  }

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
              ${populationSource ? `<span class="citation">${populationSource.url ? `<a href="${escapeHtml(populationSource.url)}" target="_blank" rel="noopener noreferrer" class="sp-citation-link">${escapeHtml(populationSource.name || populationSource.source)}</a>` : escapeHtml(populationSource.name || populationSource.source)}</span>` : ''}
            </div>
          ` : ''}
          ${conservation.population_trend ? `
            <div class="sp-science__pop-item">
              <span class="sp-science__pop-label">Trend</span>
              <span class="sp-science__pop-value">${trendArrow} ${escapeHtml(conservation.population_trend)}</span>
            </div>
          ` : ''}
          ${conservation.iucn_status ? `
            <div class="sp-science__pop-item">
              <span class="sp-science__pop-label">IUCN Status</span>
              <span class="sp-science__pop-value">${escapeHtml(conservation.iucn_status)}</span>
              ${iucnSource ? `<span class="citation">${iucnSource.url ? `<a href="${escapeHtml(iucnSource.url)}" target="_blank" rel="noopener noreferrer" class="sp-citation-link">${escapeHtml(iucnSource.name || iucnSource.source)}</a>` : escapeHtml(iucnSource.name || iucnSource.source)}</span>` : ''}
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
// Section: Photos
// ============================================================
function renderPhotos(data) {
  if (!data.photos || data.photos.length === 0) return '';

  const speciesName = data.taxonomy && data.taxonomy.common_name;

  return `
    <section class="sp-section sp-photos sp-section--alt">
      <div class="sp-section__inner">
        <h2 class="sp-section__heading">${escapeHtml(speciesName)} in the Wild</h2>
        <div class="sp-photos__grid">
          ${data.photos.map(photo => `
            <div class="sp-photos__item">
              <img class="sp-photos__img" src="${escapeHtml(photo.url)}" alt="${escapeHtml(photo.alt)}" loading="lazy" onerror="this.parentElement.style.display='none'" />
              <div class="sp-photos__credit">${escapeHtml(photo.photographer || photo.credit)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

// ============================================================
// Section: Interesting Facts
// ============================================================
function renderInterestingFacts(data) {
  if (!data.interesting_facts || data.interesting_facts.length === 0) return '';

  return `
    <section class="sp-section sp-facts">
      <div class="sp-section__inner">
        <h2 class="sp-section__heading">Fascinating Facts</h2>
        <div class="sp-facts__grid">
          ${data.interesting_facts.map(item => {
            const factText = item.fact || item.text || '';
            const sourceLabel = item.source || (item.source_url ? 'Source' : '');
            const sourceUrl = item.source_url || '';
            return `
              <div class="sp-fact-card">
                <p class="sp-fact-card__text">${escapeHtml(factText)}</p>
                ${sourceUrl ? `<a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer" class="sp-citation-link sp-fact-card__citation">${escapeHtml(sourceLabel)}</a>` : (sourceLabel ? `<span class="sp-fact-card__citation">${escapeHtml(sourceLabel)}</span>` : '')}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </section>
  `;
}

// ============================================================
// Section: On Screen
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
// Section: Root Causes (COM-B)
// ============================================================
function renderRootCauses(data) {
  // Support new com_b format (objects with source links) or old root_causes_comb (string arrays)
  const comb = data.com_b || data.root_causes_comb;
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
          ${items.map(item => {
            if (typeof item === 'string') {
              return `<li>${escapeHtml(item)}</li>`;
            }
            // Object format with text, source, source_url
            const text = item.text || '';
            const source = item.source || '';
            const sourceUrl = item.source_url || '';
            return `<li>${escapeHtml(text)}${sourceUrl ? ` <a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer" class="sp-citation-link">${escapeHtml(source)}</a>` : (source ? ` <span class="citation">${escapeHtml(source)}</span>` : '')}</li>`;
          }).join('')}
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
// Section: Parallax Divider
// ============================================================
function renderParallaxDivider(imageUrl, text) {
  if (!imageUrl) return '';
  return `
    <div class="sp-parallax-divider" style="background-image: url('${escapeHtml(imageUrl)}')">
      <div class="sp-parallax-divider__overlay">
        <p class="sp-parallax-divider__text">${escapeHtml(text)}</p>
      </div>
    </div>
  `;
}

// ============================================================
// Section: Cultural Depth
// ============================================================
function renderCulturalDepth(data) {
  if (!data.cultural_depth || Object.keys(data.cultural_depth).length === 0) return '';

  const entries = Object.entries(data.cultural_depth);

  const formatTitle = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' - ')
      .replace(/ - /, ' - ');
  };

  const cardsHtml = entries.map(([key, entry]) => {
    const title = formatTitle(key);
    const desc = entry.description || '';
    const isLong = desc.length > 150;
    const truncated = isLong ? desc.slice(0, 150) + '...' : desc;

    return `
      <div class="sp-cultural-card ${isLong ? 'sp-cultural-card--collapsed' : ''}">
        <h3 class="sp-cultural-card__title">${escapeHtml(title)}</h3>
        <div class="sp-cultural-card__body">
          <p class="sp-cultural-card__text-full">${escapeHtml(desc)}</p>
          <p class="sp-cultural-card__text-truncated">${escapeHtml(truncated)}</p>
        </div>
        ${entry.source_url ? `<a href="${escapeHtml(entry.source_url)}" target="_blank" rel="noopener noreferrer" class="sp-citation-link">${escapeHtml(entry.source || 'Source')}</a>` : (entry.source ? `<span class="citation">${escapeHtml(entry.source)}</span>` : '')}
        ${isLong ? `<button class="sp-cultural-card__toggle" type="button">Read more</button>` : ''}
      </div>
    `;
  }).join('');

  return `
    <section class="sp-section sp-cultural-depth sp-section--alt">
      <div class="sp-section__inner">
        <h2 class="sp-section__heading">Cultural Significance</h2>
        <div class="sp-cultural-depth__grid">
          ${cardsHtml}
        </div>
      </div>
    </section>
  `;
}

// ============================================================
// Section: Protected Areas
// ============================================================
function renderProtectedAreas(data) {
  if (!data.globe_layers || !data.globe_layers.protected_areas || data.globe_layers.protected_areas.length === 0) return '';

  const areas = data.globe_layers.protected_areas;

  return `
    <section class="sp-section sp-protected-areas">
      <div class="sp-section__inner">
        <h2 class="sp-section__heading">Protected Areas</h2>
        <div class="sp-protected-areas__grid">
          ${areas.map(area => `
            <div class="sp-protected-area-card">
              <h3 class="sp-protected-area-card__name">${escapeHtml(area.name)}</h3>
              <p class="sp-protected-area-card__country">${escapeHtml(area.country)}</p>
              <p class="sp-protected-area-card__coords">${area.lat.toFixed(2)}, ${area.lng.toFixed(2)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

// ============================================================
// Cultural Card Toggle Handlers
// ============================================================
function initCulturalCardToggles() {
  const toggleButtons = document.querySelectorAll('.sp-cultural-card__toggle');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.sp-cultural-card');
      if (card) {
        const isCollapsed = card.classList.contains('sp-cultural-card--collapsed');
        card.classList.toggle('sp-cultural-card--collapsed');
        btn.textContent = isCollapsed ? 'Read less' : 'Read more';
      }
    });
  });
}

// ============================================================
// Section: The Evidence
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
// Section: References
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
        <p>Eco-Cinema Observatory - An open research project</p>
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
// GSAP Scroll Animations with Spring Physics
// ============================================================
function initAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.body.classList.remove('sp-loaded');
    return;
  }

  const sections = document.querySelectorAll('.sp-section');
  sections.forEach((section, i) => {
    if (i === 0) return;

    const heading = section.querySelector('.sp-section__heading');
    const panels = section.querySelectorAll('.sp-panel, .sp-media-card, .sp-comb__column, .sp-evidence__content, .sp-references__list');

    if (heading) {
      gsap.fromTo(heading,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: 'back.out(1.7)', duration: 0.9,
          scrollTrigger: { trigger: heading, start: 'top 85%' }
        }
      );
    }

    panels.forEach((panel, j) => {
      gsap.fromTo(panel,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, ease: 'back.out(1.4)', duration: 0.9, delay: j * 0.06,
          scrollTrigger: { trigger: panel, start: 'top 90%' }
        }
      );
    });
  });

  // Comic panels with elastic spring and stagger
  const comicPanels = document.querySelectorAll('.comic-panel');
  comicPanels.forEach((panel, i) => {
    gsap.fromTo(panel,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, ease: 'elastic.out(1, 0.5)', duration: 1.0, delay: i * 0.06,
        scrollTrigger: {
          trigger: panel,
          start: 'top 88%',
        }
      }
    );
  });

  // Fact cards with spring reveal
  const factCards = document.querySelectorAll('.sp-fact-card');
  factCards.forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, ease: 'elastic.out(1, 0.75)', duration: 1.2, delay: i * 0.1,
        scrollTrigger: { trigger: card, start: 'top 90%' }
      }
    );
  });

  // Photo items with scale entrance
  const photoItems = document.querySelectorAll('.sp-photos__item');
  photoItems.forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, ease: 'back.out(1.4)', duration: 0.8, delay: i * 0.06,
        scrollTrigger: { trigger: item, start: 'top 90%' }
      }
    );

    // Parallax effect on the image inside
    const img = item.querySelector('.sp-photos__img');
    if (img) {
      gsap.fromTo(img,
        { yPercent: -5 },
        { yPercent: 5, ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    }
  });

  // Parallax storytelling layers
  initParallax();

  // Cultural depth cards
  const culturalCards = document.querySelectorAll('.sp-cultural-card');
  culturalCards.forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, ease: 'back.out(1.4)', duration: 0.9, delay: i * 0.08,
        scrollTrigger: { trigger: card, start: 'top 90%' }
      }
    );
  });

  // Protected area cards
  const areaCards = document.querySelectorAll('.sp-protected-area-card');
  areaCards.forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, ease: 'back.out(1.4)', duration: 0.8, delay: i * 0.05,
        scrollTrigger: { trigger: card, start: 'top 90%' }
      }
    );
  });

  // Parallax dividers
  const dividers = document.querySelectorAll('.sp-parallax-divider');
  dividers.forEach(divider => {
    gsap.fromTo(divider.querySelector('.sp-parallax-divider__text'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, ease: 'power2.out', duration: 1.0,
        scrollTrigger: { trigger: divider, start: 'top 70%' }
      }
    );
  });

  ScrollTrigger.refresh();
}

// ============================================================
// Parallax Depth Layers
// ============================================================
function initParallax() {
  // Hero background subtle parallax
  const hero = document.querySelector('.sp-hero');
  if (hero) {
    gsap.to(hero, {
      backgroundPositionY: '30%',
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Section headings move slightly slower for depth effect
  document.querySelectorAll('.sp-section__heading').forEach(heading => {
    gsap.fromTo(heading,
      { y: -15 },
      { y: 15, ease: 'none',
        scrollTrigger: {
          trigger: heading,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });

  // Habitat/evidence cards with parallax offset
  document.querySelectorAll('.sp-science__habitat, .sp-evidence__content').forEach(el => {
    gsap.fromTo(el,
      { y: 20 },
      { y: -20, ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });
}

// ============================================================
// Init
// ============================================================
if (slug) {
  initLenis();
  loadSpeciesData();
}
