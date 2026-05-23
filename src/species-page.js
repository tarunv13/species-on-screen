import './style.css';

// Get species slug from body data attribute
const slug = document.body.dataset.species;

async function loadSpeciesData() {
  try {
    const response = await fetch(`/species-on-screen/data/${slug}.json`);
    if (!response.ok) throw new Error(`Failed to load data for ${slug}`);
    const data = await response.json();
    renderSpeciesPage(data);
  } catch (error) {
    console.error(error);
    document.querySelector('.species-page-loading').textContent =
      'Unable to load species data. Please try again later.';
  }
}

function renderSpeciesPage(data) {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <section class="section species-hero">
      <div class="section__content">
        <h1>${data.taxonomy.common_name}</h1>
        <p class="species__scientific-name">${data.taxonomy.scientific_name}</p>
        <span class="conservation-badge">${data.conservation.iucn_status}</span>
      </div>
    </section>
  `;
}

if (slug) {
  loadSpeciesData();
}
