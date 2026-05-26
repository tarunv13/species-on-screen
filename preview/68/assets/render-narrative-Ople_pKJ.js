import{t as e}from"./narrative-registry-BFxtckJu.js";var t={least_concern:`Least Concern`,near_threatened:`Near Threatened`,vulnerable:`Vulnerable`,endangered:`Endangered`,critically_endangered:`Critically Endangered`,extinct_in_wild:`Extinct in the Wild`,extinct:`Extinct`,data_deficient:`Data Deficient`,not_evaluated:`Not Evaluated`},n={peer_reviewed:`peer-reviewed`,field_report:`field report`,camera_trap:`camera trap`,satellite_imagery:`satellite imagery`,oral_account:`oral account`},r={draft:`Draft`,in_review:`In review`,verified:`Verified`,published:`Published`};function i(e){return Array.isArray(e)?`${e[0]}\u2013${e[1]}`:String(e)}function a(e){return!e||e.length===0?``:e.length===1?e[0]:e.length===2?`${e[0]} & ${e[1]}`:e.slice(0,-1).join(`, `)+`, & `+e[e.length-1]}function o(e){let t=`<span class="source-kind">${n[e.kind]}</span>`;switch(e.kind){case`peer_reviewed`:{let n=e.doi?` <a href="https://doi.org/${encodeURIComponent(e.doi)}">doi:${s(e.doi)}</a>`:e.url?` <a href="${s(e.url)}">link</a>`:``;return`<li>${t}${s(a(e.authors))} (${e.year}). ${s(e.title)}. <cite>${s(e.journal)}</cite>.${n}</li>`}case`field_report`:{let n=e.url?` <a href="${s(e.url)}">link</a>`:``;return`<li>${t}${s(a(e.authors))} (${e.year}). ${s(e.title)}. <cite>${s(e.organization)}</cite>.${n}</li>`}case`camera_trap`:{let n=e.location?`, ${s(e.location)}`:``;return`<li>${t}${s(e.label)} \u00b7 ${s(e.operator)}${n} (${e.year}).</li>`}case`satellite_imagery`:return`<li>${t}${s(e.provider)} ${s(e.sensor)} \u00b7 ${s(e.identifier)} (${e.year}).</li>`;case`oral_account`:return`<li>${t}${s(e.contributor)} (${s(e.relation)}), recorded ${e.yearRecorded}.</li>`;default:return``}}function s(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}function c(e){return e.split(/\n\n+/).map(e=>`<p>${s(e.trim())}</p>`).join(``)}function l(e){let n=[[`IUCN status`,t[e.species.iucnStatus]],[`Place type`,e.place.type],[`Countries`,e.place.countries.join(`, `)]];return e.place.protectedArea&&n.push([`Protected area`,e.place.protectedArea]),e.place.coordinates&&n.push([`Coordinates`,`${e.place.coordinates.latitude.toFixed(2)}, ${e.place.coordinates.longitude.toFixed(2)}`]),n.push([`Observed`,i(e.observation.year)]),n.map(([e,t])=>`<dt>${s(e)}</dt><dd>${s(t)}</dd>`).join(``)}function u(e){return`
    <dt>Schema</dt><dd>v${s(e.schemaVersion)}</dd>
    <dt>Status</dt><dd>${s(r[e.status]||e.status)}</dd>
    <dt>Contributor</dt><dd>${s(e.contributor)}</dd>
    <dt>Created</dt><dd>${s(e.created)}</dd>
    <dt>Updated</dt><dd>${s(e.updated)}</dd>
  `}function d(e){let t=document.getElementById(`narrative`);t&&(t.innerHTML=`
    <header>
      <h1>${s(e.place.name)}</h1>
      <p class="subtitle">
        <em>${s(e.species.commonName)}</em>
        &middot; ${s(e.species.scientificName)}
      </p>
      <dl class="identifiers">
        ${l(e)}
      </dl>
    </header>

    <p class="place-line">${s(e.place.editorialPlaceLine)}</p>

    <section class="claim" aria-label="Sourced observation">
      <p class="observation">${s(e.observation.summary)}</p>
    </section>

    <section class="body">
      ${c(e.editorial.body)}
    </section>

    <p class="fragment">&mdash; ${s(e.editorial.fragment)}</p>

    <section class="sources">
      <h2>Sources</h2>
      <ol>
        ${e.sources.map(o).join(``)}
      </ol>
    </section>

    <footer class="metadata">
      ${u(e.metadata)}
    </footer>
  `,document.title=`${e.place.name} \u00b7 ${e.species.commonName} \u2014 Notes`)}function f(e){let t=document.getElementById(`narrative`);t&&(t.innerHTML=`
    <header>
      <h1>Narrative not found</h1>
      <p class="subtitle">
        No narrative is registered with id <code>${s(e)}</code>.
      </p>
    </header>
  `,document.title=`Notes — not found`)}function p(){return(location.pathname.replace(/\/$/,``).split(`/`).pop()||``).replace(/\.html$/,``)}var m=p(),h=e(m);h?d(h):f(m);