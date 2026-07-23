import{t as e}from"./narrative-registry-DHoSO95Q.js";import"./modulepreload-polyfill-Dezn_h7o.js";/* empty css                     */var t=`/species-on-screen/preview/74/`,n=e(`coral-triangle-hawksbill-natal-homing`),r=e=>String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`);function i(e){let t=`${(e.authors||[]).join(`, `)} (${e.year}). ${e.title}. ${e.journal}.`,n=e.doi?`https://doi.org/${e.doi}`:e.url||``;return n?`<li><a href="${r(n)}" target="_blank" rel="noopener noreferrer">${r(t)}</a></li>`:`<li>${r(t)}</li>`}async function a(){if(!n){let e=document.getElementById(`cr-body`);e&&(e.innerHTML=`<div class="fr-card"><p class="muted">Narrative record not found.</p></div>`);return}let e=document.createElement(`nav`);e.className=`fr-nav`,e.setAttribute(`aria-label`,`Site navigation`),e.innerHTML=`<a href="${t}atlas/">← Living Atlas</a><a href="${t}places/crossing.html">Enter the crossing →</a>`;let a=document.getElementById(`fr`);a&&a.insertBefore(e,a.firstChild);let o=document.getElementById(`cr-title`);o&&(o.textContent=n.species.commonName);let s=document.getElementById(`cr-sub`);s&&(s.textContent=n.place.editorialPlaceLine),document.title=`${n.species.commonName} · Research companion`;let c=document.getElementById(`cr-body`),l=`
    <div class="fr-card">
      <div class="kicker">Observation &middot; ${Array.isArray(n.observation.year)?`${n.observation.year[0]}–${n.observation.year[1]}`:String(n.observation.year)}</div>
      <h2>${r(n.editorial.fragment)}</h2>
      <p>${r(n.observation.summary)}</p>
      <p>${r(n.editorial.body)}</p>
      <div class="fr-src"><span class="lbl">sources</span>Lohmann, Putman &amp; Lohmann (2008) PNAS &middot; Meylan &amp; Donnelly (1999) Chelonian Conservation and Biology</div>
    </div>`,u=null;try{let e=await fetch(`/species-on-screen/preview/74/data/hawksbill-turtle.json`);e.ok&&(u=await e.json())}catch{u=null}if(u&&Array.isArray(u.habitat.key_locations)){let e=u.habitat.key_locations.map(e=>`<span class="fr-chip">${r(e)}</span>`).join(``);l+=`
      <div class="fr-card">
        <div class="kicker">Key habitats</div>
        <h2>Where the crossing ends</h2>
        <p>Hawksbills nest on beaches at the sites named below. Geomagnetic imprinting means females return to the beach of their birth, so nesting activity concentrates at these sites across generations (Lohmann et al. 2008).</p>
        <div class="fr-chips">${e}</div>
        <div class="fr-src"><span class="lbl">source</span>IUCN Red List range data; Coral Triangle Initiative</div>
      </div>`}if(u&&Array.isArray(u.threats)&&u.threats.length){let e=u.threats.map(e=>`<li style="margin:0 0 0.75rem"><strong>${r(e.name)}</strong> — ${r(e.description)}</li>`).join(``);l+=`
      <div class="fr-card warn">
        <div class="kicker">Pressures</div>
        <h2>What interrupts the crossing</h2>
        <ul style="list-style:none;padding:0;margin:0.5rem 0 0;font-size:1rem;line-height:1.65;color:var(--fr-ink)">${e}</ul>
        <div class="fr-src"><span class="lbl">source</span>IUCN Red List assessment; cited per pressure above</div>
      </div>`}if(n.sources&&n.sources.length){let e=n.sources.map(i).join(``);l+=`
      <div class="fr-card">
        <div class="kicker">Peer-reviewed record</div>
        <h2>Sources</h2>
        <ol style="padding-left:1.3rem;margin:0.5rem 0 0;font-size:0.96rem;line-height:1.55;color:var(--fr-ink)">${e}</ol>
        <div class="fr-src"><span class="lbl">registry</span>cinematic-language/narratives/coral-triangle-hawksbill-natal-homing.ts &middot; status: verified</div>
      </div>`}l+=`
    <div style="display:flex;flex-wrap:wrap;gap:0.9rem;padding:2.5rem 0 6rem">
      <a href="${t}places/crossing.html" class="fr-archive">Enter the crossing →</a>
      <a href="${t}notes/coral-triangle-hawksbill-natal-homing.html" class="fr-archive">Field note →</a>
    </div>`,c.innerHTML=l}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,a):a();