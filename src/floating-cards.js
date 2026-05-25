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

      // Audit §9.5: render only the species name. The frosted-glass
      // backplate, 40px round thumbnail, and lime-green uppercase status
      // pill are all retired (Article X — the cards were the most
      // identifiable template fingerprint on the page; Canon XI —
      // conservation status belongs as a sentence on the species page,
      // not as a coloured pill on the planetary view).
      // The card is now a single anchored text node. textContent (not
      // innerHTML) avoids any markup-injection surface from the data file.
      card.textContent = name;

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
