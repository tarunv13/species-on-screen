import{t as e}from"./gsap-C81z-gCV.js";import{D as t,E as n,O as r,S as i,T as a,_ as o,a as s,i as c,k as l,t as u,u as d,v as f,y as p}from"./cinematic-engine-DRBFx0qO.js";import{n as m,t as h}from"./lenis-DZ3MJKTi.js";var g=[{lat:21.9,lng:89.2,name:`Tiger`,species:`tiger`,ecosystem:`tropical-forest`,color:`#4a7c59`}],_=[`tiger`];function v(e,t,n){let r=(90-e)*(Math.PI/180),i=(t+180)*(Math.PI/180);return new l(-(n*Math.sin(r)*Math.cos(i)),n*Math.cos(r),n*Math.sin(r)*Math.sin(i))}var y=class{constructor(e,t,n){this.scene=e,this.camera=t,this.renderer=n,this.group=new d,this.scene.add(this.group),this.mediaCounts={},this.columnMeshes=[],this.habitatMeshes=[],this.protectedAreaMeshes=[],this.protectedAreaData=[],this.comingSoonMeshes=[],this.speciesDataCache={},this.activeLayer=`media`,this.raycaster=new i,this.mouse=new r(-999,-999),this.hoveredIndex=-1,this.isHovered=!1,this._isDragging=!1,this._prevPointer={x:0,y:0},this._velocity={x:0,y:0},this._damping=.95,this._createGlobe(),this._createColumns(),this._createHabitatLayer(),this._createFloraFauna(),this._createComingSoonMarkers(),this._setupInteraction(),this._dataLoadPromise=this._loadMediaCounts()}whenDataLoaded(){return this._dataLoadPromise}_createGlobe(){let e=new n(1.5,128,128),r=new t,i=new p({roughness:.8,metalness:.1});this.sphere=new o(e,i),this.group.add(this.sphere),r.load(`https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg`,e=>{i.map=e,i.needsUpdate=!0},void 0,()=>{i.color=new s(4491434),i.needsUpdate=!0});let c=new n(1.58,64,64),l=new a({vertexShader:`varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`varying vec3 vNormal; void main() { float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0); gl_FragColor = vec4(0.55, 0.50, 0.42, intensity * 0.35); }`,blending:1,side:1,transparent:!0,depthWrite:!1});this.atmosphere=new o(c,l),this.group.add(this.atmosphere)}_createColumns(){let e=new c(.025,24);g.forEach((t,n)=>{let r=v(t.lat,t.lng,1.502),i=r.clone().normalize(),a=new s(t.color),c=new f({color:a.clone(),transparent:!0,opacity:.5,side:2,blending:2,depthWrite:!1}),l=new o(e.clone(),c);l.position.copy(r),l.lookAt(r.clone().add(i)),l.userData={hotspotIndex:n,species:t.species,name:t.name,restColor:a.clone()},this.group.add(l),this.columnMeshes.push(l)})}_createHabitatLayer(){let e=new c(.06,24);g.forEach(t=>{let n=v(t.lat,t.lng,1.505),r=n.clone().normalize(),i=new f({color:new s(t.color),transparent:!0,opacity:.4,side:2,depthWrite:!1}),a=new o(e.clone(),i);a.position.copy(n),a.lookAt(n.clone().add(r)),a.userData={species:t.species,name:t.name},a.visible=!1,this.group.add(a),this.habitatMeshes.push(a)})}_createProtectedAreaMarkers(e){let t=new n(.02,12,12),r=new p({color:16739125,emissive:16739125,emissiveIntensity:.6,transparent:!0,opacity:.9});e.forEach(e=>{let n=v(e.lat,e.lng,1.52),i=new o(t.clone(),r.clone());i.position.copy(n),i.userData={name:e.name,species:e.species,country:e.country},i.visible=!1,this.group.add(i),this.protectedAreaMeshes.push(i),this.protectedAreaData.push(e)})}setLayer(e){this.activeLayer=e,this.columnMeshes.forEach(e=>{e.visible=!1}),this.habitatMeshes.forEach(e=>{e.visible=!1}),this.protectedAreaMeshes.forEach(e=>{e.visible=!1}),e===`media`||e===`species`?this.columnMeshes.forEach(e=>{e.visible=!0}):e===`habitat`?this.habitatMeshes.forEach(e=>{e.visible=!0}):(e===`protected_areas`||e===`threats`)&&this.protectedAreaMeshes.forEach(e=>{e.visible=!0})}_createFloraFauna(){this.floraFaunaTime=0,this.floraFaunaMeshes=[]}_createComingSoonMarkers(){}_setupDragRotate(){}_setupInteraction(){let e=this.renderer.domElement;this._onMouseMove=e=>{this.mouse.x=e.clientX/window.innerWidth*2-1,this.mouse.y=-(e.clientY/window.innerHeight)*2+1},this._onMouseEnter=()=>{this.isHovered=!0},this._onMouseLeave=()=>{this.isHovered=!1,this.mouse.set(-999,-999)},e.addEventListener(`mousemove`,this._onMouseMove),e.addEventListener(`mouseenter`,this._onMouseEnter),e.addEventListener(`mouseleave`,this._onMouseLeave)}getScreenPositions(e){let t={};g.forEach(e=>{t[e.species]||(t[e.species]=[]),t[e.species].push(e)});let n=[],r=window.innerWidth,i=window.innerHeight;return this.group.updateMatrixWorld(),Object.entries(t).forEach(([t,a])=>{let o=new l;a.forEach(e=>{o.add(v(e.lat,e.lng,1.5))}),o.divideScalar(a.length);let s=o.clone().applyMatrix4(this.group.matrixWorld),c=new l;e.getWorldDirection(c);let u=s.clone().normalize().dot(c)>-.2,d=s.clone().project(e),f=(d.x*.5+.5)*r,p=(-d.y*.5+.5)*i,m=s.distanceTo(e.position),h=Math.max(.7,Math.min(1.3,5/m));n.push({species:t,screenX:f,screenY:p,scale:h,visible:u,data:this.speciesDataCache[t]})}),n}getSpeciesPosition(e){let t=g.filter(t=>t.species===e);if(t.length===0)return new l;let n=new l;return t.forEach(e=>{n.add(v(e.lat,e.lng,1.5))}),n.divideScalar(t.length),n}async _loadMediaCounts(){let e=[],t=[],n=[];return(await Promise.allSettled(_.map(async e=>{let t=await fetch(`/species-on-screen/preview/39/data/${e}.json`);if(!t.ok)throw Error(`HTTP ${t.status}`);return{slug:e,data:await t.json()}}))).forEach((r,i)=>{let a=_[i];if(r.status===`fulfilled`){let{data:n}=r.value;this.speciesDataCache[a]=n,this.mediaCounts[a]=n.tmdb_media?n.tmdb_media.length:0,n.globe_layers&&n.globe_layers.protected_areas&&n.globe_layers.protected_areas.forEach(t=>{e.push({...t,species:a})}),t.push(a)}else{this.mediaCounts[a]=0;let e=r.reason&&r.reason.message?r.reason.message:String(r.reason);n.push({slug:a,reason:e}),console.warn(`[globe] Species data unavailable: ${a} (${e}). Hotspot retained, card skipped.`)}}),this._updateColumnHeights(),this._createProtectedAreaMarkers(e),{loaded:t,failed:n}}_updateColumnHeights(){}update(){let e=this.isHovered?this.mouse.x*.0018:0;this.group.rotation.y+=3e-4+e}dispose(){let e=this.renderer.domElement;e.removeEventListener(`mousemove`,this._onMouseMove),e.removeEventListener(`mouseenter`,this._onMouseEnter),e.removeEventListener(`mouseleave`,this._onMouseLeave),this.columnMeshes.forEach(e=>{e.geometry.dispose(),e.material.dispose()}),this.habitatMeshes.forEach(e=>{e.geometry.dispose(),e.material.dispose()}),this.protectedAreaMeshes.forEach(e=>{e.geometry.dispose(),e.material.dispose()}),this.comingSoonMeshes.forEach(e=>{e.geometry.dispose(),e.material.dispose()}),this.floraFaunaMeshes.forEach(e=>{e.geometry.dispose(),e.material.dispose()}),this.sphere&&(this.sphere.geometry.dispose(),this.sphere.material.dispose()),this.atmosphere&&(this.atmosphere.geometry.dispose(),this.atmosphere.material.dispose()),this.scene.remove(this.group)}};e.registerPlugin(m);var b={"tropical-forest":{skyTop:`#0a1e0a`,skyBottom:`#1a4a2e`},"tropical forest":{skyTop:`#0a1e0a`,skyBottom:`#1a4a2e`},"temperate-forest":{skyTop:`#0a1a0a`,skyBottom:`#2a5a3a`},"temperate forest":{skyTop:`#0a1a0a`,skyBottom:`#2a5a3a`},ocean:{skyTop:`#0a1628`,skyBottom:`#1a3a5c`},"coral-reef":{skyTop:`#0a1428`,skyBottom:`#1a4a6e`},"coral reef":{skyTop:`#0a1428`,skyBottom:`#1a4a6e`},arctic:{skyTop:`#1a2a3a`,skyBottom:`#4a6a8a`},savanna:{skyTop:`#1a1008`,skyBottom:`#4a3a1a`},mountain:{skyTop:`#1a1a2a`,skyBottom:`#3a4a5a`},freshwater:{skyTop:`#0a1a28`,skyBottom:`#1a4a5c`}};function x(e){return e?String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`):``}function S(e,t){return e?e.length<=t?e:e.slice(0,t).replace(/\s+\S*$/,``)+`...`:``}function C(e,t){return typeof e==`string`&&/^#[0-9a-fA-F]{3,8}$/.test(e)?e:t||`#1a1a2a`}var w=class{constructor(e){this.container=e,this.lenis=null,this._lenisCallback=null,this._scrollTriggers=[]}async enter(e,t){this.container.scrollTop=0;let n=t;if(!n){let t=await fetch(`/species-on-screen/preview/39/data/${e}.json`);if(!t.ok)throw Error(`Failed to load ${e}`);n=await t.json()}this._render(n),this._initLenis(),this._initScrollAnimations()}exit(){this._scrollTriggers.forEach(e=>e.kill()),this._scrollTriggers=[],m.getAll().forEach(e=>{e.vars&&e.vars.scroller===this.container&&e.kill()}),this.lenis&&=(this._lenisCallback&&=(e.ticker.remove(this._lenisCallback),null),this.lenis.destroy(),null),this.container.innerHTML=``,m.refresh()}_initLenis(){this.lenis=new h({wrapper:this.container,content:this.container.querySelector(`.safari-scene`),smooth:!0,smoothTouch:!1}),this._lenisCallback=e=>{this.lenis&&this.lenis.raf(e*1e3)},e.ticker.add(this._lenisCallback)}_initScrollAnimations(){this.container.querySelectorAll(`.comic-panel`).forEach(t=>{let n=m.create({trigger:t,scroller:this.container,start:`top 85%`,onEnter:()=>{e.to(t,{opacity:1,y:0,duration:.6,ease:`power2.out`})},once:!0});this._scrollTriggers.push(n)}),this.container.querySelectorAll(`.safari-intro, .safari-threats, .safari-media, .safari-culture, .safari-facts`).forEach(t=>{e.set(t,{opacity:0,y:20});let n=m.create({trigger:t,scroller:this.container,start:`top 85%`,onEnter:()=>{e.to(t,{opacity:1,y:0,duration:.7,ease:`power2.out`})},once:!0});this._scrollTriggers.push(n)})}_getComicPanels(e){if(e.comic_strip&&Array.isArray(e.comic_strip)&&e.comic_strip.length>=6)return e.comic_strip.map(e=>({number:String(e.panel_number).padStart(2,`0`),label:e.label||``,title:e.title||``,text:e.narrative_text||``,source:e.source||``,sourceUrl:e.source_url||``}));let t=[],n=e.habitat||{},r=e.threats||[],i=e.conservation||{},a=e.cultural_depth||{},o=e.cultural_significance||{},s=Object.keys(a);t.push({number:`01`,label:`In the Wild`,title:n.type||`Habitat`,text:S(n.description||``,200),source:``,sourceUrl:``});let c=s[0],l=c?a[c]:null;t.push({number:`02`,label:`Ancient Bonds`,title:c?c.replace(/_/g,` `).replace(/^\w/,e=>e.toUpperCase()):`Cultural Heritage`,text:S(l?l.description:o.mythology||``,200),source:l&&l.source||``,sourceUrl:l&&l.source_url||``});let u=r[0]||{};t.push({number:`03`,label:`Under Threat`,title:u.name||`Threats`,text:S(u.description||``,200),source:``,sourceUrl:``});let d=s[1],f=d?a[d]:null;t.push({number:`04`,label:`The Human Story`,title:d?d.replace(/_/g,` `).replace(/^\w/,e=>e.toUpperCase()):`Cultural Connection`,text:S(f?f.description:o.cinema||``,200),source:f&&f.source||``,sourceUrl:f&&f.source_url||``});let p=i.key_programs||[];return t.push({number:`05`,label:`Fighting Back`,title:p[0]||`Conservation`,text:p.length>1?`Active programs include ${p.slice(0,3).join(`, `)}, working to protect and restore populations.`:`Conservation efforts are underway to protect this species and its habitat.`,source:``,sourceUrl:``}),t.push({number:`06`,label:`The Future`,title:i.population_trend||`Population Outlook`,text:`Current population estimate: ${i.population_estimate||`Unknown`}. Trend: ${i.population_trend||`Unknown`}.`,source:``,sourceUrl:``}),t}_render(e){let t=e.taxonomy||{},n=e.habitat||{},r=e.conservation||{},i=e.threats||[],a=e.tmdb_media||[],o=e.cultural_depth||{},s=e.interesting_facts||[],c=e.photos||[],l=t.common_name||``,u=t.scientific_name||``,d=r.iucn_status||``,f=e.hero_stat||``,p=r.population_estimate||`Unknown`,m=r.population_trend||`Unknown`,h=b[(n.type||``).toLowerCase().replace(/\s+/g,`-`)]||b[n.type?.toLowerCase()]||b.ocean,g=e.safari_scene,_=C(g?g.sky_gradient[0]:null,h.skyTop),v=C(g?g.sky_gradient[1]:null,h.skyBottom),y=C(g?g.silhouette_color:null,`#1a2a1a`),S=C(g?g.mid_color:null,`#2a4a2a`),w=C(g?g.foreground_color:null,`#0a1a0a`),T=c.length>0?c[0].url:``,E=c.length>0&&c[0].alt||l,D=this._getComicPanels(e),O=`<div class="safari-scene">`;O+=`
      <div class="safari-hero" style="--sky-top: ${_}; --sky-bottom: ${v}; --silhouette-color: ${y}; --mid-color: ${S}; --foreground-color: ${w};">
        <div class="safari-layer safari-layer--sky"></div>
        <div class="safari-layer safari-layer--far"></div>
        <div class="safari-layer safari-layer--mid"></div>
        <div class="safari-layer safari-layer--subject">
          ${T?`<img src="${x(T)}" alt="${x(E)}" />`:``}
        </div>
        <div class="safari-layer safari-layer--near"></div>
        <div class="safari-hero__title">
          <h1>${x(l)}</h1>
          <p>${x(u)}</p>
        </div>
      </div>
    `,O+=`
      <div class="safari-intro">
        <span class="safari-badge">${x(d)}</span>
        <p class="safari-stat">${x(f)}</p>
        <p class="safari-pop">Population: ${x(p)} (${x(m)})</p>
      </div>
    `,O+=`
      <div class="safari-comic">
        <h2>The Story</h2>
        <div class="comic-panels">
    `,D.forEach(e=>{O+=`
          <div class="comic-panel">
            <span class="comic-panel__number">${x(e.number)}</span>
            <span class="comic-panel__label">${x(e.label)}</span>
            <h3 class="comic-panel__title">${x(e.title)}</h3>
            <p class="comic-panel__text">${x(e.text)}</p>
            ${e.source?`<cite class="comic-panel__source"><a href="${x(e.sourceUrl)}">${x(e.source)}</a></cite>`:``}
          </div>
      `}),O+=`
        </div>
      </div>
    `,i.length>0&&(O+=`
        <div class="safari-threats">
          <h2>Threats</h2>
          <div class="safari-threats__grid">
      `,i.forEach(e=>{O+=`
            <div class="safari-threat-card">
              <h3>${x(e.name)}</h3>
              <p>${x(e.description)}</p>
            </div>
        `}),O+=`
          </div>
        </div>
      `),a.length>0&&(O+=`
        <div class="safari-media">
          <h2>On Screen</h2>
          <div class="safari-media__grid">
      `,a.slice(0,8).forEach(e=>{let t=e.poster_path?`https://image.tmdb.org/t/p/w300${e.poster_path}`:``;O+=`
            <div class="safari-media-card">
              ${t?`<img class="safari-media-card__poster" src="${x(t)}" alt="${x(e.title)}" />`:``}
              <div class="safari-media-card__info">
                <div class="safari-media-card__title">${x(e.title)}</div>
                <div class="safari-media-card__year">${e.year||``}</div>
              </div>
            </div>
        `}),O+=`
          </div>
        </div>
      `);let k=Object.keys(o);k.length>0&&(O+=`
        <div class="safari-culture">
          <h2>Cultural Significance</h2>
          <div class="safari-culture__grid">
      `,k.forEach(e=>{let t=o[e],n=e.replace(/_/g,` `).replace(/^\w/,e=>e.toUpperCase());O+=`
            <div class="safari-culture-card">
              <div class="safari-culture-card__title">${x(n)}</div>
              <p class="safari-culture-card__text">${x(t.description||``)}</p>
            </div>
        `}),O+=`
          </div>
        </div>
      `),s.length>0&&(O+=`
        <div class="safari-facts">
          <h2>Did You Know?</h2>
          <div class="safari-facts__grid">
      `,s.forEach(e=>{O+=`
            <div class="safari-fact-card">
              <p class="safari-fact-card__text">${x(e.text)}</p>
              ${e.source_url?`<cite class="safari-fact-card__source"><a href="${x(e.source_url)}">Source</a></cite>`:``}
            </div>
        `}),O+=`
          </div>
        </div>
      `),O+=`
      <div class="safari-footer">
        <p>Data sourced from IUCN, GBIF, TRAFFIC, and peer-reviewed literature</p>
      </div>
    `,O+=`</div>`,this.container.innerHTML=O}},T=null,E=null,D=null,O=null,k=!1,A=null;function j(){let t=document.getElementById(`cinematic-canvas`);if(!t)return;let n=document.getElementById(`loading-screen`);T=new u(t),E=new y(T.getScene(),T.getCamera(),T.renderer);let r=document.getElementById(`safari-container`);r&&(O=new w(r)),E.setLayer(`species`),window.addEventListener(`resize`,z),T.onUpdate(e=>{E&&E.update(e)}),n?e.to(n,{opacity:0,duration:1.4,delay:1.5,ease:`power2.inOut`,onComplete:()=>{n.style.display=`none`,L()}}):L(),R(),M()}function M(){D=document.getElementById(`page-caption`),D&&D.addEventListener(`click`,e=>{let t=D.dataset.species;t&&(e.preventDefault(),N(t))})}function N(t){if(k)return;k=!0,P(),E._velocity.x=0,E._velocity.y=0;let n=E.getSpeciesPosition(t);E.group.updateMatrixWorld();let r=n.clone().applyMatrix4(E.group.matrixWorld),i=r.clone().normalize(),a=r.clone().add(i.clone().multiplyScalar(2)),o=r.clone(),s=e.timeline();A=s,s.add(()=>{D&&D.classList.remove(`is-visible`)},0),s.add(T.flyCamera(a,o,.8,`power3.inOut`),.6),s.to(`#cinematic-canvas`,{opacity:.3,duration:.6,ease:`power2.inOut`},1.4),s.add(()=>{let e=document.getElementById(`safari-container`),t=document.querySelector(`.return-to-globe`);e&&e.classList.add(`active`),t&&(t.style.display=`block`)},1.6),s.to(`#safari-container`,{opacity:1,duration:.4,ease:`power2.out`},1.6),s.eventCallback(`onComplete`,async()=>{try{let e=E.speciesDataCache[t];await O.enter(t,e),k=!1,A=null}catch(e){console.warn(`[main] Safari enter failed for "${t}", rolling back transition state:`,e),I({force:!0})}})}function P(){A&&=(A.kill(),null)}function F(){I({force:!1})}function I({force:t=!1}={}){if(k&&!t)return;if(k=!0,P(),O&&typeof O.exit==`function`)try{O.exit()}catch{}let n=e.timeline();A=n,n.to(`#safari-container`,{opacity:0,duration:.4,ease:`power2.inOut`},0),n.add(()=>{let e=document.getElementById(`safari-container`),t=document.querySelector(`.return-to-globe`);e&&e.classList.remove(`active`),t&&(t.style.display=`none`)},.4),n.to(`#cinematic-canvas`,{opacity:1,duration:.5,ease:`power2.out`},.3);let r=new l(1,.3,5.5),i=new l(0,0,0);n.add(T.flyCamera(r,i,1,`power3.inOut`),.3),n.add(()=>{D&&D.classList.add(`is-visible`),k=!1,A=null},1.3)}function L(){let t=document.getElementById(`globe-ui-container`),n=new l(1,.3,5.5),r=new l(0,0,0);T.flyCamera(n,r,6,`power3.inOut`).eventCallback(`onComplete`,()=>{e.delayedCall(.9,()=>{t&&t.classList.add(`active`),D&&D.classList.add(`is-visible`)})})}function R(){let e=document.querySelector(`.return-to-globe`);e&&e.addEventListener(`click`,F)}function z(){T&&T.resize()}document.addEventListener(`DOMContentLoaded`,j);