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
    // Tracks the most recently focused card slug so that focus can be
    // restored to the same card after a safari round-trip. Updated only
    // by real focus events on cards (mouse, keyboard, programmatic).
    // Read by show() and only acted on if document.activeElement is the
    // body (i.e. the user has not navigated focus elsewhere).
    this._lastFocusedSlug = null;

    this._createCards();
  }

  _createCards() {
    const slugs = Object.keys(this.speciesDataCache);

    slugs.forEach((slug) => {
      const data = this.speciesDataCache[slug];
      if (!data) return;

      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'floating-card';
      card.dataset.species = slug;

      const name = data.taxonomy?.common_name || slug.replace(/-/g, ' ');
      const status = data.conservation?.iucn_status || '';
      const photo = data.photos && data.photos.length > 0 ? data.photos[0].url : '';

      // Accessible name for screen readers. Visible text remains the
      // single source of visual truth; aria-label overrides the
      // accessible name so AT users hear a single clean phrase.
      const ariaLabel = status
        ? `${name}. Conservation status: ${status}.`
        : `${name}.`;
      card.setAttribute('aria-label', ariaLabel);

      let thumbHtml = '';
      if (photo) {
        thumbHtml = `<img class="floating-card__thumb" src="${photo}" alt="" />`;
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

      // Track focus for restoration after safari exit. Fires for every
      // focus source (Tab, programmatic, mouse-on-Windows). The handler
      // does not clear on blur — "last focused" is the right semantic.
      card.addEventListener('focus', () => {
        this._lastFocusedSlug = slug;
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

    // Restore keyboard focus to the most recently focused card, but
    // only if the user has not actively moved focus elsewhere. This
    // closes the "keyboard user returns from safari and focus is on
    // body" gap without ever fighting an explicit user action. For
    // mouse users on platforms where button click does not auto-focus
    // (macOS Safari), _lastFocusedSlug is null and this is a no-op.
    if (this._lastFocusedSlug && document.activeElement === document.body) {
      const card = this.cards[this._lastFocusedSlug];
      if (card && typeof card.focus === 'function') {
        try {
          card.focus({ preventScroll: true });
        } catch {
          card.focus();
        }
      }
    }
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
