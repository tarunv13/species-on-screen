/**
 * Navigation component for the Eco-Cinema Observatory.
 * Renders a subtle glass navigation bar at the top of all pages.
 * On index: site title only.
 * On species pages: site title + breadcrumb (Species > {name}).
 */

const BASE_PATH = '/species-on-screen/';

export function initNav() {
  const nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.setAttribute('aria-label', 'Site navigation');

  const isSpeciesPage = window.location.pathname.includes('/species/');

  if (isSpeciesPage) {
    const speciesName = document.querySelector('.species-page__name');
    const name = speciesName ? speciesName.textContent : 'Species';

    nav.innerHTML = `
      <a href="${BASE_PATH}" class="site-nav__title">Eco-Cinema Observatory</a>
      <span class="site-nav__breadcrumb">
        <span class="site-nav__separator" aria-hidden="true">/</span>
        <span>Species</span>
        <span class="site-nav__separator" aria-hidden="true">/</span>
        <span aria-current="page">${name}</span>
      </span>
    `;
  } else {
    nav.innerHTML = `
      <span class="site-nav__title">Eco-Cinema Observatory</span>
    `;
  }

  document.body.insertBefore(nav, document.body.firstChild);
}
