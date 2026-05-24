/**
 * FloatingCards - renders HTML cards positioned via Three.js world-to-screen projection
 */
export class FloatingCards {
  constructor(container, speciesDataCache, onCardClick) {
    this.container = container;
    this.speciesDataCache = speciesDataCache;
    this.onCardClick = onCardClick;
    this.cards = {};
    this._visible = false;
    this._activeLayer = 'species';

    this._createCards();
  }

  _createCards() {
    const slugs = Object.keys(this.speciesDataCache);

    slugs.forEach((slug) => {
      const data = this.speciesDataCache[slug];
      if (!data) return;

      const card = document.createElement('div');
      card.className = 'floating-card';
      card.dataset.species = slug;

      const name = data.taxonomy?.common_name || slug.replace(/-/g, ' ');
      const status = data.conservation?.iucn_status || '';
      const photo = data.photos && data.photos.length > 0 ? data.photos[0].url : '';

      let thumbHtml = '';
      if (photo) {
        thumbHtml = `<img class="floating-card__thumb" src="${photo}" alt="${name}" />`;
      }

      card.innerHTML = `
        ${thumbHtml}
        <div class="floating-card__info">
          <span class="floating-card__name">${name}</span>
          <span class="floating-card__status">${status}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        if (this.onCardClick) {
          this.onCardClick(slug);
        }
      });

      this.container.appendChild(card);
      this.cards[slug] = card;
    });
  }

  /**
   * Update card positions each frame based on globe screen projections
   */
  update(camera, globe) {
    if (!this._visible || this._activeLayer !== 'species') return;

    const positions = globe.getScreenPositions(camera);

    positions.forEach((item) => {
      const card = this.cards[item.species];
      if (!card) return;

      if (!item.visible) {
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
        return;
      }

      const scale = Math.max(0.7, Math.min(1.3, item.scale));
      card.style.opacity = '1';
      card.style.pointerEvents = 'auto';
      card.style.transform = `translate(${item.screenX}px, ${item.screenY}px) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
    });
  }

  show() {
    this._visible = true;
    this.container.style.opacity = '1';
  }

  hide() {
    this._visible = false;
    this.container.style.opacity = '0';
    Object.values(this.cards).forEach((card) => {
      card.style.opacity = '0';
      card.style.pointerEvents = 'none';
    });
  }

  setLayerVisibility(layer) {
    this._activeLayer = layer;
    if (layer !== 'species') {
      Object.values(this.cards).forEach((card) => {
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
      });
    }
  }
}
