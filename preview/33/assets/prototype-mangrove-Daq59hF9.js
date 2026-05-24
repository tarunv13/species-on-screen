import{t as e}from"./gsap-C81z-gCV.js";import{A as t,C as n,T as r,c as i,f as a,g as o,h as s,i as c,l,m as u,p as d,s as f,t as p,u as m,v as h,x as g,y as _}from"./cinematic-engine-CvaXYqDU.js";var v=class extends o{constructor({mobile:e=!1}={}){let t=e?48:96,n=new _(400,400,t,t);n.rotateX(-Math.PI/2);let r={uTime:{value:0}},i=new h({color:16777215,roughness:.55,metalness:0,fog:!0});i.onBeforeCompile=e=>{e.uniforms.uTime=r.uTime,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
uniform float uTime;
varying vec3 vWorldPos_mangrove;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
{
  // World-XZ derived from object-space position — the plane was rotated
  // into XZ at construction, so position.x maps to world X and position.z
  // maps to world Z (negated; harmless for the sine field).
  float wx = position.x;
  float wz = position.z;
  float a = sin(wx * 0.15 + uTime * 0.35) * 0.018;
  float b = sin(wz * 0.11 - uTime * 0.27 + 1.7) * 0.022;
  // A slow cross-field, lower frequency, gives the surface a body.
  float c = sin((wx + wz) * 0.04 + uTime * 0.18) * 0.012;
  transformed.y += a + b + c;
}`).replace(`#include <project_vertex>`,`#include <project_vertex>
vWorldPos_mangrove = (modelMatrix * vec4(transformed, 1.0)).xyz;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
uniform float uTime;
varying vec3 vWorldPos_mangrove;

// Cheap value-noise / FBM in the fragment shader. Five octaves is
// enough to produce believable leaf-litter clumping without
// dominating the GPU.
float mh_hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float mh_noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = mh_hash(i);
  float b = mh_hash(i + vec2(1.0, 0.0));
  float c = mh_hash(i + vec2(0.0, 1.0));
  float d = mh_hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float mh_fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    v += amp * mh_noise(p);
    p *= 2.07;
    amp *= 0.5;
  }
  return v;
}`).replace(`#include <map_fragment>`,`// Tannin water base. Deep amber-black, very low saturation —
// the colour of strong tea, not the colour of a swimming pool.
vec3 tanninDeep    = vec3(0.040, 0.028, 0.018);
vec3 tanninShallow = vec3(0.190, 0.135, 0.080);

// Slow-scrolling leaf-litter mask. The drift direction matches the
// tidal sine phase so litter and water move as one body — the
// single ambient motion that this biome is allowed (Principle XVIII).
vec2 driftUv = vWorldPos_mangrove.xz * 0.18 + vec2(uTime * 0.05, uTime * 0.02);
float litter = mh_fbm(driftUv);
float litterMask = smoothstep(0.55, 0.78, litter);

// A separate, larger-scale mask reads as where the tannin pools are
// thicker vs thinner — gives the surface a varied body even before
// the leaf litter sits on top.
float bodyMask = mh_fbm(vWorldPos_mangrove.xz * 0.04 + vec2(11.0, 7.0));

vec3 waterBody = mix(tanninDeep, tanninShallow, smoothstep(0.35, 0.75, bodyMask));

// Leaf-litter colour: warm umber, slightly more saturated than the
// water itself but still desaturated.
vec3 litterColor = vec3(0.22, 0.16, 0.09);
vec3 surface = mix(waterBody, litterColor, litterMask * 0.65);

diffuseColor.rgb = surface;
`)},super(n,i),this.receiveShadow=!0,this._uniforms=r,this.renderOrder=0}update(e){this._uniforms.uTime.value+=e}};function y(e){let t=e>>>0;return function(){t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var b=new s,x=new g,S=new l,C=new t,w=new t,T=class extends d{constructor({mobile:e=!1}={}){let t=y(12648430),n=e?8:14,r=()=>e?6+Math.floor(t()*5):8+Math.floor(t()*7),i=[],a=0;for(let e=0;e<n;e++){let o=(e%2==0?-1:1)*(1.8+t()*5.2),s=-14+e/n*26+(t()-.5)*2.5,c=-.05+t()*.18,l=r();i.push({cx:o,cy:c,cz:s,n:l}),a+=l}let o=new f(.04,.07,1,6,1,!1);o.translate(0,.5,0);let s=new h({color:16777215,roughness:.92,metalness:0,fog:!0});s.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vWorldPos_root;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
#ifdef USE_INSTANCING
vWorldPos_root = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
#else
vWorldPos_root = (modelMatrix * vec4(transformed, 1.0)).xyz;
#endif`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec3 vWorldPos_root;`).replace(`#include <map_fragment>`,`// World-Y blend. The waterline sits at y = 0.
float y = vWorldPos_root.y;

// Submerged: deep tannin-stained wet bark, near-black with a faint
// green cast from light scatter through the water.
vec3 wetBark = vec3(0.055, 0.060, 0.040);

// Dry bark: warm dark brown. Not orange. Not chocolate. The colour
// of mangrove bark photographed in late afternoon shade.
vec3 dryBark = vec3(0.180, 0.130, 0.090);

// A narrow algae band sits in the splash zone right at the waterline.
vec3 algae = vec3(0.110, 0.135, 0.075);

// Below 0 → wet, above 0.10 → dry, smooth blend in between.
float wetness = 1.0 - smoothstep(-0.04, 0.10, y);
vec3 bark = mix(dryBark, wetBark, wetness);

// Algae as a narrow gaussian-ish band centred at y=0.05.
float band = exp(-pow((y - 0.05) * 9.0, 2.0));
bark = mix(bark, algae, band * 0.55);

diffuseColor.rgb = bark;
`)},super(o,s,a),this.castShadow=!e,this.receiveShadow=!0,this.frustumCulled=!1;let c=0;for(let e of i)for(let n=0;n<e.n;n++){let n=t()**1.6*.85,r=t()*Math.PI*2,i=Math.cos(r)*n,a=Math.sin(r)*n,o=t()*.4,s=Math.atan2(a,i)+Math.PI/2;S.set(Math.sin(s)*o,t()*Math.PI*2,-Math.cos(s)*o,`YXZ`),x.setFromEuler(S);let l=1.4+t()*2.2,u=.7+t()*.6;w.set(u,l,u),C.set(e.cx+i,e.cy,e.cz+a),b.compose(C,x,w),this.setMatrixAt(c,b),c++}this.instanceMatrix.needsUpdate=!0}};function E(e){let t=document.createElement(`canvas`);t.width=e,t.height=e;let i=t.getContext(`2d`),a=i.createImageData(e,e),o=(e,t)=>{let n=Math.sin(e*127.1+t*311.7)*43758.5453;return n-Math.floor(n)},s=(e,t)=>{let n=Math.floor(e),r=Math.floor(t),i=e-n,a=t-r,s=i*i*(3-2*i),c=a*a*(3-2*a),l=o(n,r),u=o(n+1,r),d=o(n,r+1),f=o(n+1,r+1);return l+(u-l)*s+(d-l)*c+(l-u-d+f)*s*c},l=(e,t)=>{let n=0,r=1,i=1,a=0;for(let o=0;o<5;o++)n+=r*s(e*i,t*i),a+=r,r*=.5,i*=2.13;return n/a};for(let t=0;t<e;t++)for(let n=0;n<e;n++){let r=n/e,i=t/e,o=l(r*5,i*5),s=l(r*18,i*18),c=l(r*3.5+17,i*3.5+9),u=(o-.18)*1.7+(s-.5)*.35,d=Math.min(1,Math.max(0,u+.15));d**=.85;let f=c,p=.06+f*.1,m=.08+f*.08,h=.05+f*.05,g=(t*e+n)*4;a.data[g]=Math.floor(p*255),a.data[g+1]=Math.floor(m*255),a.data[g+2]=Math.floor(h*255),a.data[g+3]=Math.floor(d*255)}i.putImageData(a,0,0);let d=new c(t);return d.wrapS=n,d.wrapT=n,d.minFilter=u,d.magFilter=u,d.colorSpace=r,d}var D=class extends o{constructor({mobile:e=!1}={}){let t=new _(80,80,4,4);t.rotateX(Math.PI/2);let n=E(e?256:512);n.repeat.set(4,4);let r=new h({map:n,transparent:!0,alphaTest:.5,side:2,roughness:.95,metalness:0,color:16777215,fog:!0});super(t,r),this.position.y=12,this.castShadow=!e,this.receiveShadow=!1,this.renderOrder=0}};function O(){return window.matchMedia(`(hover: none) and (pointer: coarse)`).matches}function k(){return window.matchMedia(`(prefers-reduced-motion: reduce)`).matches}function A(){let t=document.querySelector(`canvas#mangrove`);if(!t)return;let n=O(),r=new p(t);r.particles&&r.scene.remove(r.particles),r.scene.background=null,r.scene.children.filter(e=>e.isAmbientLight||e.isDirectionalLight||e.isHemisphereLight).forEach(e=>r.scene.remove(e)),r.renderer.shadowMap.enabled=!n,r.renderer.shadowMap.type=2;let o=r.getCamera();o.fov=32,o.near=.1,o.far=250,o.updateProjectionMatrix();let s=window.innerWidth/window.innerHeight<1?.18:0,c={x:0,y:1.4+s,z:8},l={x:0,y:1+s*.4,z:-10};r.setCameraPosition(c,l),r.scene.fog=new m(4862754,.022);let u=new v({mobile:n}),d=new T({mobile:n}),f=new D({mobile:n});r.scene.add(u),r.scene.add(d),r.scene.add(f);let h=new i(16773328,.7);h.position.set(8,60,12),h.target.position.set(0,0,-8),h.castShadow=!n,h.shadow.mapSize.set(2048,2048),h.shadow.camera.left=-12,h.shadow.camera.right=12,h.shadow.camera.top=16,h.shadow.camera.bottom=-16,h.shadow.camera.near=5,h.shadow.camera.far=100,h.shadow.bias=-6e-4,h.shadow.normalBias=.04,r.scene.add(h),r.scene.add(h.target);let g=new a(6969906,1708552,.25);r.scene.add(g),r.onUpdate(e=>{k()||u.update(e)}),window.addEventListener(`resize`,()=>{r.resize();let e=window.innerWidth/window.innerHeight<1?.18:0,t=r.getCamera().position.z,n=r._cameraTarget.z;r.setCameraPosition({x:0,y:1.4+e,z:t},{x:0,y:1+e*.4,z:n})}),document.addEventListener(`visibilitychange`,()=>{document.hidden?e.globalTimeline.pause():e.globalTimeline.resume()}),r.composer.render(),requestAnimationFrame(()=>j(r))}function j(t){if(k())return;let n=t.getCamera(),r=e.timeline({defaults:{ease:`none`}});r.to({},{duration:2}),r.to(n.position,{z:-8,duration:8,ease:`none`}),r.to(n.position,{z:-10,duration:2,ease:`power2.out`})}document.addEventListener(`DOMContentLoaded`,A);