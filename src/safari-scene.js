import './safari-scene.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Color palettes for different habitat/ecosystem types
 */
const HABITAT_PALETTES = {
  'tropical-forest': { skyTop: '#0a1e0a', skyBottom: '#1a4a2e' },
  'tropical forest': { skyTop: '#0a1e0a', skyBottom: '#1a4a2e' },
  'temperate-forest': { skyTop: '#0a1a0a', skyBottom: '#2a5a3a' },
  'temperate forest': { skyTop: '#0a1a0a', skyBottom: '#2a5a3a' },
  'ocean': { skyTop: '#0a1628', skyBottom: '#1a3a5c' },
  'coral-reef': { skyTop: '#0a1428', skyBottom: '#1a4a6e' },
  'coral reef': { skyTop: '#0a1428', skyBottom: '#1a4a6e' },
  'arctic': { skyTop: '#1a2a3a', skyBottom: '#4a6a8a' },
  'savanna': { skyTop: '#1a1008', skyBottom: '#4a3a1a' },
  'mountain': { skyTop: '#1a1a2a', skyBottom: '#3a4a5a' },
  'freshwater': { skyTop: '#0a1a28', skyBottom: '#1a4a5c' },
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncate(text, maxLen) {
  if (!text) return '';
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, '') + '...';
}

/**
 * SafariScene - manages the full-screen habitat experience
 */
export class SafariScene {
  constructor(container) {
    this.container = container;
    this.lenis = null;
    this._lenisCallback = null;
    this._scrollTriggers = [];
  }

  async enter(speciesSlug) {
    const basePath = import.meta.env.BASE_URL || '/';
    try {
      const res = await fetch(`${basePath}data/${speciesSlug}.json`);
      if (!res.ok) return;
      const data = await res.json();
      this._render(data);
      this._initLenis();
      this._initScrollAnimations();
    } catch (e) {
      // Fail silently - safari just won't populate
    }
  }

  exit() {
    // Kill all ScrollTriggers
    this._scrollTriggers.forEach(st => st.kill());
    this._scrollTriggers = [];
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars && st.vars.scroller === this.container) {
        st.kill();
      }
    });

    // Destroy Lenis
    if (this.lenis) {
      if (this._lenisCallback) {
        gsap.ticker.remove(this._lenisCallback);
        this._lenisCallback = null;
      }
      this.lenis.destroy();
      this.lenis = null;
    }

    // Clear container
    this.container.innerHTML = '';
  }

  _initLenis() {
    this.lenis = new Lenis({
      wrapper: this.container,
      content: this.container.querySelector('.safari-scene'),
      smooth: true,
      smoothTouch: false,
    });

    this._lenisCallback = (time) => {
      if (this.lenis) this.lenis.raf(time * 1000);
    };
    gsap.ticker.add(this._lenisCallback);
  }

  _initScrollAnimations() {
    const panels = this.container.querySelectorAll('.comic-panel');
    panels.forEach((panel) => {
      const st = ScrollTrigger.create({
        trigger: panel,
        scroller: this.container,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(panel, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
          });
        },
        once: true,
      });
      this._scrollTriggers.push(st);
    });

    // Animate sections on scroll
    const sections = this.container.querySelectorAll(
      '.safari-intro, .safari-threats, .safari-media, .safari-culture, .safari-facts'
    );
    sections.forEach((section) => {
      gsap.set(section, { opacity: 0, y: 20 });
      const st = ScrollTrigger.create({
        trigger: section,
        scroller: this.container,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(section, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
          });
        },
        once: true,
      });
      this._scrollTriggers.push(st);
    });
  }

  _getComicPanels(data) {
    // If comic_strip exists in data, use it directly
    if (data.comic_strip && Array.isArray(data.comic_strip) && data.comic_strip.length >= 6) {
      return data.comic_strip.map(p => ({
        number: String(p.panel_number).padStart(2, '0'),
        label: p.label || '',
        title: p.title || '',
        text: p.narrative_text || '',
        source: p.source || '',
        sourceUrl: p.source_url || '',
      }));
    }

    // Auto-generate 6 panels from existing data
    const panels = [];
    const habitat = data.habitat || {};
    const threats = data.threats || [];
    const conservation = data.conservation || {};
    const culturalDepth = data.cultural_depth || {};
    const culturalSignificance = data.cultural_significance || {};
    const culturalKeys = Object.keys(culturalDepth);

    // Panel 1: In the Wild
    panels.push({
      number: '01',
      label: 'In the Wild',
      title: habitat.type || 'Habitat',
      text: truncate(habitat.description || '', 200),
      source: '',
      sourceUrl: '',
    });

    // Panel 2: Ancient Bonds
    const firstCultureKey = culturalKeys[0];
    const firstCulture = firstCultureKey ? culturalDepth[firstCultureKey] : null;
    panels.push({
      number: '02',
      label: 'Ancient Bonds',
      title: firstCultureKey ? firstCultureKey.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase()) : 'Cultural Heritage',
      text: truncate(firstCulture ? firstCulture.description : (culturalSignificance.mythology || ''), 200),
      source: firstCulture ? (firstCulture.source || '') : '',
      sourceUrl: firstCulture ? (firstCulture.source_url || '') : '',
    });

    // Panel 3: Under Threat
    const firstThreat = threats[0] || {};
    panels.push({
      number: '03',
      label: 'Under Threat',
      title: firstThreat.name || 'Threats',
      text: truncate(firstThreat.description || '', 200),
      source: '',
      sourceUrl: '',
    });

    // Panel 4: Human Story
    const secondCultureKey = culturalKeys[1];
    const secondCulture = secondCultureKey ? culturalDepth[secondCultureKey] : null;
    panels.push({
      number: '04',
      label: 'The Human Story',
      title: secondCultureKey ? secondCultureKey.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase()) : 'Cultural Connection',
      text: truncate(secondCulture ? secondCulture.description : (culturalSignificance.cinema || ''), 200),
      source: secondCulture ? (secondCulture.source || '') : '',
      sourceUrl: secondCulture ? (secondCulture.source_url || '') : '',
    });

    // Panel 5: Fighting Back
    const keyPrograms = conservation.key_programs || [];
    panels.push({
      number: '05',
      label: 'Fighting Back',
      title: keyPrograms[0] || 'Conservation',
      text: keyPrograms.length > 1
        ? `Active programs include ${keyPrograms.slice(0, 3).join(', ')}, working to protect and restore populations.`
        : 'Conservation efforts are underway to protect this species and its habitat.',
      source: '',
      sourceUrl: '',
    });

    // Panel 6: The Future
    panels.push({
      number: '06',
      label: 'The Future',
      title: conservation.population_trend || 'Population Outlook',
      text: `Current population estimate: ${conservation.population_estimate || 'Unknown'}. Trend: ${conservation.population_trend || 'Unknown'}.`,
      source: '',
      sourceUrl: '',
    });

    return panels;
  }

  _render(data) {
    const taxonomy = data.taxonomy || {};
    const habitat = data.habitat || {};
    const conservation = data.conservation || {};
    const threats = data.threats || [];
    const tmdbMedia = data.tmdb_media || [];
    const culturalDepth = data.cultural_depth || {};
    const interestingFacts = data.interesting_facts || [];
    const photos = data.photos || [];

    const commonName = taxonomy.common_name || '';
    const scientificName = taxonomy.scientific_name || '';
    const iucnStatus = conservation.iucn_status || '';
    const heroStat = data.hero_stat || '';
    const popEstimate = conservation.population_estimate || 'Unknown';
    const popTrend = conservation.population_trend || 'Unknown';

    // Determine color palette based on habitat type
    const habitatType = (habitat.type || '').toLowerCase().replace(/\s+/g, '-');
    const palette = HABITAT_PALETTES[habitatType] || HABITAT_PALETTES[habitat.type?.toLowerCase()] || HABITAT_PALETTES['ocean'];

    // Use safari_scene colors if available, otherwise fall back to HABITAT_PALETTES
    const safariScene = data.safari_scene;
    const skyTop = safariScene ? safariScene.sky_gradient[0] : palette.skyTop;
    const skyBottom = safariScene ? safariScene.sky_gradient[1] : palette.skyBottom;
    const silhouetteColor = safariScene ? safariScene.silhouette_color : '#1a2a1a';
    const midColor = safariScene ? safariScene.mid_color : '#2a4a2a';
    const foregroundColor = safariScene ? safariScene.foreground_color : '#0a1a0a';

    // Get first photo for the hero subject
    const heroPhoto = photos.length > 0 ? photos[0].url : '';
    const heroPhotoAlt = photos.length > 0 ? (photos[0].alt || commonName) : commonName;

    // Build comic panels
    const comicPanels = this._getComicPanels(data);

    // Build HTML
    let html = `<div class="safari-scene">`;

    // Hero section
    html += `
      <div class="safari-hero" style="--sky-top: ${skyTop}; --sky-bottom: ${skyBottom}; --silhouette-color: ${silhouetteColor}; --mid-color: ${midColor}; --foreground-color: ${foregroundColor};">
        <div class="safari-layer safari-layer--sky"></div>
        <div class="safari-layer safari-layer--far"></div>
        <div class="safari-layer safari-layer--mid"></div>
        <div class="safari-layer safari-layer--subject">
          ${heroPhoto ? `<img src="${escapeHtml(heroPhoto)}" alt="${escapeHtml(heroPhotoAlt)}" />` : ''}
        </div>
        <div class="safari-layer safari-layer--near"></div>
        <div class="safari-hero__title">
          <h1>${escapeHtml(commonName)}</h1>
          <p>${escapeHtml(scientificName)}</p>
        </div>
      </div>
    `;

    // Intro section
    html += `
      <div class="safari-intro">
        <span class="safari-badge">${escapeHtml(iucnStatus)}</span>
        <p class="safari-stat">${escapeHtml(heroStat)}</p>
        <p class="safari-pop">Population: ${escapeHtml(popEstimate)} (${escapeHtml(popTrend)})</p>
      </div>
    `;

    // Comic strip section
    html += `
      <div class="safari-comic">
        <h2>The Story</h2>
        <div class="comic-panels">
    `;
    comicPanels.forEach(panel => {
      html += `
          <div class="comic-panel">
            <span class="comic-panel__number">${escapeHtml(panel.number)}</span>
            <span class="comic-panel__label">${escapeHtml(panel.label)}</span>
            <h3 class="comic-panel__title">${escapeHtml(panel.title)}</h3>
            <p class="comic-panel__text">${escapeHtml(panel.text)}</p>
            ${panel.source ? `<cite class="comic-panel__source"><a href="${escapeHtml(panel.sourceUrl)}">${escapeHtml(panel.source)}</a></cite>` : ''}
          </div>
      `;
    });
    html += `
        </div>
      </div>
    `;

    // Threats section
    if (threats.length > 0) {
      html += `
        <div class="safari-threats">
          <h2>Threats</h2>
          <div class="safari-threats__grid">
      `;
      threats.forEach(threat => {
        html += `
            <div class="safari-threat-card">
              <h3>${escapeHtml(threat.name)}</h3>
              <p>${escapeHtml(threat.description)}</p>
            </div>
        `;
      });
      html += `
          </div>
        </div>
      `;
    }

    // On Screen (TMDB media) section
    if (tmdbMedia.length > 0) {
      html += `
        <div class="safari-media">
          <h2>On Screen</h2>
          <div class="safari-media__grid">
      `;
      tmdbMedia.slice(0, 8).forEach(media => {
        const posterUrl = media.poster_path
          ? `https://image.tmdb.org/t/p/w300${media.poster_path}`
          : '';
        html += `
            <div class="safari-media-card">
              ${posterUrl ? `<img class="safari-media-card__poster" src="${escapeHtml(posterUrl)}" alt="${escapeHtml(media.title)}" />` : ''}
              <div class="safari-media-card__info">
                <div class="safari-media-card__title">${escapeHtml(media.title)}</div>
                <div class="safari-media-card__year">${media.year || ''}</div>
              </div>
            </div>
        `;
      });
      html += `
          </div>
        </div>
      `;
    }

    // Cultural Depth section
    const cultureKeys = Object.keys(culturalDepth);
    if (cultureKeys.length > 0) {
      html += `
        <div class="safari-culture">
          <h2>Cultural Significance</h2>
          <div class="safari-culture__grid">
      `;
      cultureKeys.forEach(key => {
        const entry = culturalDepth[key];
        const title = key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
        html += `
            <div class="safari-culture-card">
              <div class="safari-culture-card__title">${escapeHtml(title)}</div>
              <p class="safari-culture-card__text">${escapeHtml(entry.description || '')}</p>
            </div>
        `;
      });
      html += `
          </div>
        </div>
      `;
    }

    // Interesting Facts section
    if (interestingFacts.length > 0) {
      html += `
        <div class="safari-facts">
          <h2>Did You Know?</h2>
          <div class="safari-facts__grid">
      `;
      interestingFacts.forEach(fact => {
        html += `
            <div class="safari-fact-card">
              <p class="safari-fact-card__text">${escapeHtml(fact.text)}</p>
              ${fact.source_url ? `<cite class="safari-fact-card__source"><a href="${escapeHtml(fact.source_url)}">Source</a></cite>` : ''}
            </div>
        `;
      });
      html += `
          </div>
        </div>
      `;
    }

    // Footer
    html += `
      <div class="safari-footer">
        <p>Data sourced from IUCN, GBIF, TRAFFIC, and peer-reviewed literature</p>
      </div>
    `;

    html += `</div>`; // close .safari-scene

    this.container.innerHTML = html;
  }
}
