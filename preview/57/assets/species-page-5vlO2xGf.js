import{t as e}from"./gsap-D_956-p2.js";import{n as t,t as n}from"./lenis-DZ3MJKTi.js";e.registerPlugin(t);var r=`https://image.tmdb.org/t/p/w500`,i=document.body.dataset.species;function a(){let r=new n({duration:1.2,easing:e=>Math.min(1,1.001-2**(-10*e)),smoothWheel:!0});return r.on(`scroll`,t.update),e.ticker.add(e=>{r.raf(e*1e3)}),e.ticker.lagSmoothing(0),r}async function o(){let e=document.querySelector(`.species-page-loading`);try{let e=await fetch(`/species-on-screen/preview/57/data/${i}.json`);if(!e.ok)throw Error(`Failed to load data for ${i}`);c(await e.json()),document.body.classList.add(`sp-loaded`),O(),setTimeout(()=>{document.querySelectorAll(`.sp-loaded .sp-section`).forEach(e=>{getComputedStyle(e.querySelector(`.sp-section__heading`)||e).opacity===`0`&&document.body.classList.remove(`sp-loaded`)})},3e3)}catch(t){console.error(t),e&&(e.textContent=`Unable to load species data. Please try again later.`)}}window.addEventListener(`error`,()=>document.body.classList.remove(`sp-loaded`));function s(e){if(!e)return``;let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}function c(e){let t=document.getElementById(`main-content`);t.innerHTML=[u(e),y(e.photos&&e.photos[1]?e.photos[1].url:``,l(e,0)),d(e),y(e.photos&&e.photos[2]?e.photos[2].url:``,l(e,1)),f(e),m(e),b(e),v(e),g(e),h(e),x(e),C(e),w(e),T()].filter(Boolean).join(``),E(),S()}function l(e,t){e.taxonomy&&e.taxonomy.common_name&&e.taxonomy.common_name;let n=[`In wildness is the preservation of the world.`,`The greatness of a nation can be judged by the way its animals are treated.`];return n[t]||n[0]}function u(e){let t=e.taxonomy&&e.taxonomy.common_name,n=e.taxonomy&&e.taxonomy.scientific_name,r=e.conservation&&e.conservation.iucn_status,i=e.hero_stat,a=``,o=``;e.photos&&e.photos.length>0?(a=e.photos[0].url,o=e.photos[0].photographer||e.photos[0].credit||``):e.hero_image&&e.hero_image.url&&(a=e.hero_image.url);let c=``;return a&&(c=`style="background-image: linear-gradient(to bottom, rgba(250,250,248,0.3) 0%, rgba(250,250,248,0.6) 50%, rgba(250,250,248,0.9) 100%), url('${s(a)}')"`),`
    <section class="sp-section sp-hero" ${c}>
      <div class="sp-hero__content">
        <h1 class="sp-hero__title">${s(t)}</h1>
        ${n?`<p class="sp-hero__scientific">${s(n)}</p>`:``}
        ${r?`<span class="sp-badge sp-badge--${D(r)}">${s(r)}</span>`:``}
        ${i?`<p class="sp-hero__stat">${s(i)}</p>`:``}
      </div>
      ${o?`<div class="sp-hero__credit">${s(o)}</div>`:``}
    </section>
  `}function d(e){let t=e.habitat,n=e.threats,r=e.tmdb_media,i=e.conservation,a=e.taxonomy&&e.taxonomy.common_name,o=e.photos||[],c=t&&t.description?t.description.split(`

`)[0].slice(0,150)+`...`:`Habitat information unavailable.`,l=n&&n.length>0?n[0]:null,u=l?l.name:`Unknown`,d=l?l.description.slice(0,120)+`...`:``,f=r?r.length:0,p=i?i.iucn_status:`Unknown`,m=i&&i.key_programs&&i.key_programs.length>0?i.key_programs[0]:`Conservation programs active`,h=[{label:`In the Wild`,title:t?t.type:`Natural Habitat`,text:c},{label:`Under Threat`,title:u,text:d},{label:`On Screen`,title:`${f} Films & Documentaries`,text:`Explored in cinema as a symbol of ${a?a.toLowerCase():`wildlife`} conservation.`},{label:`The Future`,title:p,text:m}].map((e,t)=>{let n=o[t%o.length],r=n?n.url:``;return`
      <div class="comic-panel">
        ${r?`<div class="comic-panel__bg" style="background-image: url('${s(r)}')"></div>`:``}
        <div class="comic-panel__content">
          <span class="comic-panel__label">${s(e.label)}</span>
          <h3 class="comic-panel__title">${s(e.title)}</h3>
          <p class="comic-panel__text">${s(e.text)}</p>
        </div>
      </div>
    `}).join(``);return`
    <section class="sp-section sp-comic sp-section--alt">
      <div class="sp-section__inner">
        <h2 class="sp-section__heading">The Story of the ${s(a)}</h2>
        <div class="comic-panels">
          ${h}
        </div>
      </div>
    </section>
  `}function f(e){let t=e.taxonomy,n=e.conservation,r=e.habitat,i=e.data_sources;if(!t&&!n&&!r)return``;let a=[];t&&(t.class&&a.push([`Class`,t.class,null]),t.order&&a.push([`Order`,t.order,null]),t.family&&a.push([`Family`,t.family,null]),t.scientific_name&&a.push([`Species`,t.scientific_name,null]),t.gbif_url&&a.push([`GBIF`,`View on GBIF`,t.gbif_url]),t.iucn_url&&a.push([`IUCN`,`View on IUCN Red List`,t.iucn_url]));let o=a.length>0?`
    <div class="sp-science__taxonomy">
      <h3 class="sp-science__subheading">Taxonomy</h3>
      <table class="sp-taxonomy-table">
        <tbody>
          ${a.map(([e,t,n])=>`
            <tr>
              <td class="sp-taxonomy-table__label">${s(e)}</td>
              <td class="sp-taxonomy-table__value">${n?`<a href="${s(n)}" target="_blank" rel="noopener noreferrer">${s(t)}</a>`:s(t)}</td>
            </tr>
          `).join(``)}
        </tbody>
      </table>
    </div>
  `:``,c=null,l=null;Array.isArray(i)?(c=i.find(e=>e.type===`assessment`||e.name.toLowerCase().includes(`iucn`)),l=i.find(e=>e.type===`population`||e.type===`conservation`)):i&&(c=i.iucn_status,l=i.population);let u=``;if(n){let e=p(n.population_trend);u=`
      <div class="sp-science__population">
        <h3 class="sp-science__subheading">Population</h3>
        <div class="sp-science__pop-grid">
          ${n.population_estimate?`
            <div class="sp-science__pop-item">
              <span class="sp-science__pop-label">Estimate</span>
              <span class="sp-science__pop-value">${s(n.population_estimate)}</span>
              ${l?`<span class="citation">${l.url?`<a href="${s(l.url)}" target="_blank" rel="noopener noreferrer" class="sp-citation-link">${s(l.name||l.source)}</a>`:s(l.name||l.source)}</span>`:``}
            </div>
          `:``}
          ${n.population_trend?`
            <div class="sp-science__pop-item">
              <span class="sp-science__pop-label">Trend</span>
              <span class="sp-science__pop-value">${e} ${s(n.population_trend)}</span>
            </div>
          `:``}
          ${n.iucn_status?`
            <div class="sp-science__pop-item">
              <span class="sp-science__pop-label">IUCN Status</span>
              <span class="sp-science__pop-value">${s(n.iucn_status)}</span>
              ${c?`<span class="citation">${c.url?`<a href="${s(c.url)}" target="_blank" rel="noopener noreferrer" class="sp-citation-link">${s(c.name||c.source)}</a>`:s(c.name||c.source)}</span>`:``}
            </div>
          `:``}
        </div>
      </div>
    `}let d=``;if(r){let e=r.description?r.description.split(`

`).map(e=>`<p>${s(e)}</p>`).join(``):``;d=`
      <div class="sp-science__habitat">
        <h3 class="sp-science__subheading">Habitat${r.type?`: ${s(r.type)}`:``}</h3>
        ${e?`<div class="sp-science__habitat-desc">${e}</div>`:``}
        ${r.range_countries&&r.range_countries.length>0?`
          <div class="sp-science__range">
            <h4>Range Countries</h4>
            <p>${s(r.range_countries.join(`, `))}</p>
          </div>
        `:``}
        ${r.key_locations&&r.key_locations.length>0?`
          <div class="sp-science__locations">
            <h4>Key Locations</h4>
            <ul>${r.key_locations.map(e=>`<li>${s(e)}</li>`).join(``)}</ul>
          </div>
        `:``}
      </div>
    `}return`
    <section class="sp-section sp-science">
      <div class="sp-section__inner">
        <h2 class="sp-section__heading">The Science</h2>
        <div class="sp-science__grid">
          ${o}
          ${u}
        </div>
        ${d}
      </div>
    </section>
  `}function p(e){if(!e)return``;let t=e.toLowerCase();return t===`increasing`?`<span class="sp-trend sp-trend--up" aria-label="Increasing">&#9650;</span>`:t===`decreasing`?`<span class="sp-trend sp-trend--down" aria-label="Decreasing">&#9660;</span>`:`<span class="sp-trend sp-trend--stable" aria-label="Stable">&#9654;</span>`}function m(e){return!e.photos||e.photos.length===0?``:`
    <section class="sp-section sp-photos sp-section--alt">
      <div class="sp-section__inner">
        <h2 class="sp-section__heading">${s(e.taxonomy&&e.taxonomy.common_name)} in the Wild</h2>
        <div class="sp-photos__grid">
          ${e.photos.map(e=>`
            <div class="sp-photos__item">
              <img class="sp-photos__img" src="${s(e.url)}" alt="${s(e.alt)}" loading="lazy" onerror="this.parentElement.style.display='none'" />
              <div class="sp-photos__credit">${s(e.photographer||e.credit)}</div>
            </div>
          `).join(``)}
        </div>
      </div>
    </section>
  `}function h(e){return!e.interesting_facts||e.interesting_facts.length===0?``:`
    <section class="sp-section sp-facts">
      <div class="sp-section__inner">
        <h2 class="sp-section__heading">Fascinating Facts</h2>
        <div class="sp-facts__grid">
          ${e.interesting_facts.map(e=>{let t=e.fact||e.text||``,n=e.source||`View source`,r=e.source_url||``;return`
              <div class="sp-fact-card">
                <p class="sp-fact-card__text">${s(t)}</p>
                ${r?`<a href="${s(r)}" target="_blank" rel="noopener noreferrer" class="sp-citation-link sp-fact-card__citation">${s(n)}</a>`:n===`View source`?``:`<span class="sp-fact-card__citation">${s(n)}</span>`}
              </div>
            `}).join(``)}
        </div>
      </div>
    </section>
  `}function g(e){let t=e.tmdb_media,n=e.taxonomy&&e.taxonomy.common_name;if(!t||t.length===0)return`
      <section class="sp-section sp-onscreen sp-section--alt">
        <div class="sp-section__inner">
          <h2 class="sp-section__heading">On Screen</h2>
          <p class="sp-onscreen__empty">No films or documentaries catalogued yet for ${s(n||`this species`)}. Check back as our database grows.</p>
        </div>
      </section>
    `;let r={documentary:[],fiction:[],educational:[]};t.forEach(e=>{let t=(e.classification||`fiction`).toLowerCase();r[t]?r[t].push(e):r.fiction.push(e)});let i=[`documentary`,`fiction`,`educational`],a={documentary:`Documentaries`,fiction:`Fiction`,educational:`Educational`},o=``;return i.forEach(e=>{r[e].length!==0&&(o+=`
      <div class="sp-onscreen__group">
        <h3 class="sp-onscreen__group-label">${a[e]}</h3>
        <div class="sp-onscreen__grid">
          ${r[e].map(e=>_(e)).join(``)}
        </div>
      </div>
    `)}),`
    <section class="sp-section sp-onscreen sp-section--alt">
      <div class="sp-section__inner">
        <h2 class="sp-section__heading">On Screen</h2>
        <p class="sp-section__intro">Films and documentaries featuring ${s(n||`this species`)}, catalogued as part of the observatory's investigation into narrative techniques and audience engagement.</p>
        ${o}
      </div>
    </section>
  `}function _(e){let t=e.poster_path?`${r}${e.poster_path}`:null,n=e.year||``,i=e.overview||``,a=i.length>180?i.slice(0,180)+`...`:i,o=e.tmdb_url?`<a href="${s(e.tmdb_url)}" target="_blank" rel="noopener noreferrer" class="sp-media-card__title-link">${s(e.title)}</a>`:`<span>${s(e.title)}</span>`;return`
    <article class="sp-media-card">
      ${t?`<img class="sp-media-card__poster" src="${t}" alt="Poster for ${s(e.title)}" loading="lazy" onerror="this.style.display='none'" />`:`<div class="sp-media-card__no-poster"><span>No Poster</span></div>`}
      <div class="sp-media-card__info">
        <h4 class="sp-media-card__title">${o}</h4>
        <div class="sp-media-card__meta">
          ${n?`<span class="sp-media-card__year">${n}</span>`:``}
          ${e.director?`<span class="sp-media-card__director">${s(e.director)}</span>`:``}
        </div>
        <div class="sp-media-card__badges">
          ${e.classification?`<span class="sp-badge sp-badge--classification">${s(e.classification)}</span>`:``}
          ${e.narrative_technique?`<span class="sp-badge sp-badge--technique">${s(e.narrative_technique.replace(/-/g,` `))}</span>`:``}
        </div>
        ${a?`<p class="sp-media-card__overview">${s(a)}</p>`:``}
      </div>
    </article>
  `}function v(e){let t=e.com_b||e.root_causes_comb;if(!t||!(t.capability&&t.capability.length>0||t.opportunity&&t.opportunity.length>0||t.motivation&&t.motivation.length>0))return``;let n=(e,t,n)=>!t||t.length===0?``:`
      <div class="sp-comb__column sp-comb__column--${n}">
        <div class="sp-comb__header sp-comb__header--${n}">
          <h3>${s(e)}</h3>
        </div>
        <ul class="sp-comb__list">
          ${t.map(e=>{if(typeof e==`string`)return`<li>${s(e)}</li>`;let t=e.text||``,n=e.source||``,r=e.source_url||``;return`<li>${s(t)}${r?` <a href="${s(r)}" target="_blank" rel="noopener noreferrer" class="sp-citation-link">${s(n)}</a>`:n?` <span class="citation">${s(n)}</span>`:``}</li>`}).join(``)}
        </ul>
      </div>
    `;return`
    <section class="sp-section sp-comb sp-section--alt">
      <div class="sp-section__inner">
        <h2 class="sp-section__heading">Root Causes (COM-B)</h2>
        <p class="sp-section__intro">Applying the COM-B behaviour change model (Michie et al., 2011), the barriers to conservation for this species can be structured across three domains: what people and systems lack the capability to do, what opportunities are missing or blocked, and what motivational factors prevent engagement.</p>
        <div class="sp-comb__grid">
          ${n(`Capability`,t.capability,`capability`)}
          ${n(`Opportunity`,t.opportunity,`opportunity`)}
          ${n(`Motivation`,t.motivation,`motivation`)}
        </div>
      </div>
    </section>
  `}function y(e,t){return e?`
    <div class="sp-parallax-divider" style="background-image: url('${s(e)}')">
      <div class="sp-parallax-divider__overlay">
        <p class="sp-parallax-divider__text">${s(t)}</p>
      </div>
    </div>
  `:``}function b(e){if(!e.cultural_depth||Object.keys(e.cultural_depth).length===0)return``;let t=Object.entries(e.cultural_depth),n=e=>e.split(`_`).map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(` - `).replace(/ - /,` - `);return`
    <section class="sp-section sp-cultural-depth sp-section--alt">
      <div class="sp-section__inner">
        <h2 class="sp-section__heading">Cultural Significance</h2>
        <div class="sp-cultural-depth__grid">
          ${t.map(([e,t])=>{let r=n(e),i=t.description||``,a=i.length>150,o=a?i.slice(0,150)+`...`:i;return`
      <div class="sp-cultural-card ${a?`sp-cultural-card--collapsed`:``}">
        <h3 class="sp-cultural-card__title">${s(r)}</h3>
        <div class="sp-cultural-card__body">
          <p class="sp-cultural-card__text-full">${s(i)}</p>
          <p class="sp-cultural-card__text-truncated">${s(o)}</p>
        </div>
        ${t.source_url?`<a href="${s(t.source_url)}" target="_blank" rel="noopener noreferrer" class="sp-citation-link">${s(t.source||`Source`)}</a>`:t.source?`<span class="citation">${s(t.source)}</span>`:``}
        ${a?`<button class="sp-cultural-card__toggle" type="button">Read more</button>`:``}
      </div>
    `}).join(``)}
        </div>
      </div>
    </section>
  `}function x(e){return!e.globe_layers||!e.globe_layers.protected_areas||e.globe_layers.protected_areas.length===0?``:`
    <section class="sp-section sp-protected-areas">
      <div class="sp-section__inner">
        <h2 class="sp-section__heading">Protected Areas</h2>
        <div class="sp-protected-areas__grid">
          ${e.globe_layers.protected_areas.map(e=>`
            <div class="sp-protected-area-card">
              <h3 class="sp-protected-area-card__name">${s(e.name)}</h3>
              <p class="sp-protected-area-card__country">${s(e.country)}</p>
              <p class="sp-protected-area-card__coords">${e.lat.toFixed(2)}, ${e.lng.toFixed(2)}</p>
            </div>
          `).join(``)}
        </div>
      </div>
    </section>
  `}function S(){document.querySelectorAll(`.sp-cultural-card__toggle`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.closest(`.sp-cultural-card`);if(t){let n=t.classList.contains(`sp-cultural-card--collapsed`);t.classList.toggle(`sp-cultural-card--collapsed`),e.textContent=n?`Read less`:`Read more`}})})}function C(e){return e.evidence_summary?`
    <section class="sp-section sp-evidence">
      <div class="sp-section__inner">
        <h2 class="sp-section__heading">The Evidence</h2>
        <p class="sp-section__intro">What research shows about whether media coverage of ${s(e.taxonomy&&e.taxonomy.common_name||`this species`)} correlates with conservation outcomes.</p>
        <div class="sp-evidence__content">
          <p>${s(e.evidence_summary)}</p>
        </div>
      </div>
    </section>
  `:``}function w(e){return!e.academic_references||e.academic_references.length===0?``:`
    <section class="sp-section sp-references sp-section--alt">
      <div class="sp-section__inner">
        <h2 class="sp-section__heading">References</h2>
        <ol class="sp-references__list">
          ${e.academic_references.map(e=>`<li>${s(e)}</li>`).join(``)}
        </ol>
      </div>
    </section>
  `}function T(){return`
    <footer class="sp-footer">
      <div class="sp-section__inner">
        <p>Eco-Cinema Observatory - An open research project</p>
        <p><a href="/species-on-screen/">Return to the Observatory</a></p>
      </div>
    </footer>
  `}function E(){let e=document.createElement(`button`);e.className=`sp-back-to-top`,e.setAttribute(`aria-label`,`Back to top`),e.innerHTML=`&#9650;`,document.body.appendChild(e),e.addEventListener(`click`,()=>{window.scrollTo({top:0,behavior:`smooth`})}),window.addEventListener(`scroll`,()=>{window.scrollY>600?e.classList.add(`sp-back-to-top--visible`):e.classList.remove(`sp-back-to-top--visible`)})}function D(e){return e?e.toLowerCase().replace(/[^a-z0-9-]/g,`-`).replace(/-+/g,`-`).replace(/^-|-$/g,``):``}function O(){if(window.matchMedia(`(prefers-reduced-motion: reduce)`).matches){document.body.classList.remove(`sp-loaded`);return}document.querySelectorAll(`.sp-section`).forEach((t,n)=>{if(n===0)return;let r=t.querySelector(`.sp-section__heading`),i=t.querySelectorAll(`.sp-panel, .sp-media-card, .sp-comb__column, .sp-evidence__content, .sp-references__list`);r&&e.fromTo(r,{opacity:0,y:30},{opacity:1,y:0,ease:`back.out(1.7)`,duration:.9,scrollTrigger:{trigger:r,start:`top 85%`}}),i.forEach((t,n)=>{e.fromTo(t,{opacity:0,y:25},{opacity:1,y:0,ease:`back.out(1.4)`,duration:.9,delay:n*.06,scrollTrigger:{trigger:t,start:`top 90%`}})})}),document.querySelectorAll(`.comic-panel`).forEach((t,n)=>{e.fromTo(t,{opacity:0,y:40,scale:.95},{opacity:1,y:0,scale:1,ease:`elastic.out(1, 0.5)`,duration:1,delay:n*.06,scrollTrigger:{trigger:t,start:`top 88%`}})}),document.querySelectorAll(`.sp-fact-card`).forEach((t,n)=>{e.fromTo(t,{opacity:0,y:30},{opacity:1,y:0,ease:`elastic.out(1, 0.75)`,duration:1.2,delay:n*.1,scrollTrigger:{trigger:t,start:`top 90%`}})}),document.querySelectorAll(`.sp-photos__item`).forEach((t,n)=>{e.fromTo(t,{opacity:0,y:40,scale:.95},{opacity:1,y:0,scale:1,ease:`back.out(1.4)`,duration:.8,delay:n*.06,scrollTrigger:{trigger:t,start:`top 90%`}});let r=t.querySelector(`.sp-photos__img`);r&&e.fromTo(r,{yPercent:-5},{yPercent:5,ease:`none`,scrollTrigger:{trigger:t,start:`top bottom`,end:`bottom top`,scrub:!0}})}),k(),document.querySelectorAll(`.sp-cultural-card`).forEach((t,n)=>{e.fromTo(t,{opacity:0,y:30},{opacity:1,y:0,ease:`back.out(1.4)`,duration:.9,delay:n*.08,scrollTrigger:{trigger:t,start:`top 90%`}})}),document.querySelectorAll(`.sp-protected-area-card`).forEach((t,n)=>{e.fromTo(t,{opacity:0,y:25},{opacity:1,y:0,ease:`back.out(1.4)`,duration:.8,delay:n*.05,scrollTrigger:{trigger:t,start:`top 90%`}})}),document.querySelectorAll(`.sp-parallax-divider`).forEach(t=>{e.fromTo(t.querySelector(`.sp-parallax-divider__text`),{opacity:0,y:20},{opacity:1,y:0,ease:`power2.out`,duration:1,scrollTrigger:{trigger:t,start:`top 70%`}})}),t.refresh()}function k(){let t=document.querySelector(`.sp-hero`);t&&e.to(t,{backgroundPositionY:`30%`,ease:`none`,scrollTrigger:{trigger:t,start:`top top`,end:`bottom top`,scrub:!0}}),document.querySelectorAll(`.sp-section__heading`).forEach(t=>{e.fromTo(t,{y:-15},{y:15,ease:`none`,scrollTrigger:{trigger:t,start:`top bottom`,end:`bottom top`,scrub:!0}})}),document.querySelectorAll(`.sp-science__habitat, .sp-evidence__content`).forEach(t=>{e.fromTo(t,{y:20},{y:-20,ease:`none`,scrollTrigger:{trigger:t,start:`top bottom`,end:`bottom top`,scrub:!0}})})}i&&(a(),o());