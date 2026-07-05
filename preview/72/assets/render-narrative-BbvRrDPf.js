import{t as e}from"./narrative-registry-DHoSO95Q.js";import{n as t}from"./place-manifest-b-sYIR9x.js";import{n}from"./subject-__X-91FE.js";function r(e){if(!e)return[];let t=e.surfaces||{},n=t.atlas||[],r=[];for(let e of n)e.kind===`field-record`&&r.push({href:`../atlas/${e.slug}.html`,label:`Interaction web →`});for(let e of n)e.kind===`companion`&&r.push({href:`../atlas/${e.slug}.html`,label:`Research companion →`});return t.cinematic&&r.push({href:`../places/${t.cinematic.slug}.html`,label:t.cinematic.enterLabel}),t.dwca&&t.dwca.slug&&r.push({href:`../evidence/${t.dwca.slug}.html`,label:`Evidence ledger →`}),r}var i={least_concern:`Least Concern`,near_threatened:`Near Threatened`,vulnerable:`Vulnerable`,endangered:`Endangered`,critically_endangered:`Critically Endangered`,extinct_in_wild:`Extinct in the Wild`,extinct:`Extinct`,data_deficient:`Data Deficient`,not_evaluated:`Not Evaluated`},a={peer_reviewed:`peer-reviewed`,field_report:`field report`,camera_trap:`camera trap`,satellite_imagery:`satellite imagery`,oral_account:`oral account`},o={draft:`Draft`,in_review:`In review`,verified:`Verified`,published:`Published`};function s(e){return Array.isArray(e)?`${e[0]}\u2013${e[1]}`:String(e)}function c(e){return!e||e.length===0?``:e.length===1?e[0]:e.length===2?`${e[0]} & ${e[1]}`:e.slice(0,-1).join(`, `)+`, & `+e[e.length-1]}function l(e){let t=`<span class="source-kind">${a[e.kind]}</span>`;switch(e.kind){case`peer_reviewed`:{let n=e.doi?` <a href="https://doi.org/${encodeURIComponent(e.doi)}">doi:${u(e.doi)}</a>`:e.url?` <a href="${u(e.url)}">link</a>`:``;return`<li>${t}${u(c(e.authors))} (${e.year}). ${u(e.title)}. <cite>${u(e.journal)}</cite>.${n}</li>`}case`field_report`:{let n=e.url?` <a href="${u(e.url)}">link</a>`:``;return`<li>${t}${u(c(e.authors))} (${e.year}). ${u(e.title)}. <cite>${u(e.organization)}</cite>.${n}</li>`}case`camera_trap`:{let n=e.location?`, ${u(e.location)}`:``;return`<li>${t}${u(e.label)} \u00b7 ${u(e.operator)}${n} (${e.year}).</li>`}case`satellite_imagery`:return`<li>${t}${u(e.provider)} ${u(e.sensor)} \u00b7 ${u(e.identifier)} (${e.year}).</li>`;case`oral_account`:return`<li>${t}${u(e.contributor)} (${u(e.relation)}), recorded ${e.yearRecorded}.</li>`;default:return``}}function u(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}function d(e){return e.split(/\n\n+/).map(e=>`<p>${u(e.trim())}</p>`).join(``)}function f(e){let t=[[`IUCN status`,i[e.species.iucnStatus]],[`Place type`,e.place.type],[`Countries`,e.place.countries.join(`, `)]];return e.place.protectedArea&&t.push([`Protected area`,e.place.protectedArea]),e.place.coordinates&&t.push([`Coordinates`,`${e.place.coordinates.latitude.toFixed(2)}, ${e.place.coordinates.longitude.toFixed(2)}`]),t.push([`Observed`,s(e.observation.year)]),t.map(([e,t])=>`<dt>${u(e)}</dt><dd>${u(t)}</dd>`).join(``)}function p(e){return`
    <dt>Schema</dt><dd>v${u(e.schemaVersion)}</dd>
    <dt>Status</dt><dd>${u(o[e.status]||e.status)}</dd>
    <dt>Contributor</dt><dd>${u(e.contributor)}</dd>
    <dt>Created</dt><dd>${u(e.created)}</dd>
    <dt>Updated</dt><dd>${u(e.updated)}</dd>
  `}function m(e){let i=t(e.id),a=r(i);if(!a.length)return``;let o=i?i.placeId:null;return`<nav class="surface-links" aria-label="Observatory surfaces">${a.map(e=>`<a href="${u(n(e.href,o))}">${u(e.label)}</a>`).join(``)}</nav>`}function h(e){let t=document.getElementById(`narrative`);t&&(t.innerHTML=`
    <header>
      <h1>${u(e.place.name)}</h1>
      <p class="subtitle">
        <em>${u(e.species.commonName)}</em>
        &middot; ${u(e.species.scientificName)}
      </p>
      <dl class="identifiers">
        ${f(e)}
      </dl>
    </header>

    <p class="place-line">${u(e.place.editorialPlaceLine)}</p>

    <section class="claim" aria-label="Sourced observation">
      <p class="observation">${u(e.observation.summary)}</p>
    </section>

    <section class="body">
      ${d(e.editorial.body)}
    </section>

    <p class="fragment">&mdash; ${u(e.editorial.fragment)}</p>

    <section class="sources">
      <h2>Sources</h2>
      <ol>
        ${e.sources.map(l).join(``)}
      </ol>
    </section>

    <footer class="metadata">
      ${p(e.metadata)}
    </footer>

    ${m(e)}
  `,document.title=`${e.place.name} \u00b7 ${e.species.commonName} \u2014 Notes`)}function g(e){let t=document.getElementById(`narrative`);t&&(t.innerHTML=`
    <header>
      <h1>Narrative not found</h1>
      <p class="subtitle">
        No narrative is registered with id <code>${u(e)}</code>.
      </p>
    </header>
  `,document.title=`Notes — not found`)}function _(){return(location.pathname.replace(/\/$/,``).split(`/`).pop()||``).replace(/\.html$/,``)}var v=_(),y=e(v);y?h(y):g(v);