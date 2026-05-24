import{t as e}from"./gsap-C81z-gCV.js";import{E as t,M as n,N as r,O as i,S as a,_ as o,a as s,c,d as l,f as u,g as d,h as f,l as p,m,n as h,p as g,s as _,t as v,u as y,v as b,w as x,x as S,y as C}from"./cinematic-engine-Bgg4WkDz.js";function w(e){let n=document.createElement(`canvas`);n.width=e,n.height=e;let r=n.getContext(`2d`),i=r.createImageData(e,e),a=(e,t)=>{let n=Math.sin(e*127.1+t*311.7)*43758.5453;return n-Math.floor(n)},c=(e,t)=>{let n=Math.floor(e),r=Math.floor(t),i=e-n,o=t-r,s=i*i*(3-2*i),c=o*o*(3-2*o),l=a(n,r),u=a(n+1,r),d=a(n,r+1),f=a(n+1,r+1);return l+(u-l)*s+(d-l)*c+(l-u-d+f)*s*c},l=(e,t)=>{let n=e*Math.PI*2,r=t*Math.PI*2,i=0,a=1,o=0,s=4;for(let e=0;e<4;e++){let e=Math.cos(n)*s,t=Math.sin(n)*s,l=Math.cos(r)*s,u=Math.sin(r)*s;i+=a*c(e+l,t+u),o+=a,a*=.5,s*=2}return i/o},u=new Float32Array(e*e);for(let t=0;t<e;t++)for(let n=0;n<e;n++){let r=n/e,i=t/e,a=l(r,i),o=l(r*3+.13,i*3+.71);u[t*e+n]=a*.65+o*.35}for(let t=0;t<e;t++)for(let n=0;n<e;n++){let r=(n-1+e)%e,a=(n+1)%e,o=(t-1+e)%e,s=(t+1)%e,c=u[t*e+a]-u[t*e+r],l=u[s*e+n]-u[o*e+n],d=-c*4,f=-l*4,p=1,m=Math.sqrt(d*d+p*p+f*f);d/=m,p/=m,f/=m;let h=(t*e+n)*4;i.data[h]=Math.floor((d*.5+.5)*255),i.data[h+1]=Math.floor((p*.5+.5)*255),i.data[h+2]=Math.floor((f*.5+.5)*255),i.data[h+3]=255}r.putImageData(i,0,0);let f=new s(n);return f.wrapS=t,f.wrapT=t,f.minFilter=o,f.magFilter=d,f.generateMipmaps=!0,f.colorSpace=``,f}var T=class extends C{constructor({mobile:e=!1}={}){let t=e?48:96,r=new a(400,400,t,t);r.rotateX(-Math.PI/2);let i={uTime:{value:0}},o=w(e?256:512);o.repeat.set(8,8);let s=new S({color:16777215,roughness:.42,metalness:0,normalMap:o,normalScale:new n(.55,.55),envMapIntensity:.6,fog:!0});s.onBeforeCompile=e=>{e.uniforms.uTime=i.uTime,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
uniform float uTime;
varying vec3 vWorldPos_mangrove;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
{
  float wx = position.x;
  float wz = position.z;
  // Slightly larger amplitudes than the first pass — still gentle, but
  // now the surface visibly breathes against side-light. Sum is bounded
  // at ~0.07 units which keeps the plane physically calm.
  float a = sin(wx * 0.15 + uTime * 0.35) * 0.025;
  float b = sin(wz * 0.11 - uTime * 0.27 + 1.7) * 0.030;
  float c = sin((wx + wz) * 0.04 + uTime * 0.18) * 0.018;
  transformed.y += a + b + c;
}`).replace(`#include <project_vertex>`,`#include <project_vertex>
vWorldPos_mangrove = (modelMatrix * vec4(transformed, 1.0)).xyz;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
uniform float uTime;
varying vec3 vWorldPos_mangrove;

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
}`).replace(`#include <map_fragment>`,`// Tannin water palette — lifted from the previous near-black values.
// Deep tannin still reads as deep amber-black after ACES, but is no
// longer crushed; mid-tannin now produces the warm body that
// communicates "stained but translucent" rather than "ink."
vec3 tanninDeep    = vec3(0.075, 0.052, 0.030);
vec3 tanninMid     = vec3(0.155, 0.105, 0.060);
vec3 tanninShallow = vec3(0.290, 0.205, 0.130);

// Slow-drifting leaf-litter mask. Direction matches the tidal sine
// phase so litter and water move as one body — Principle XVIII.
vec2 driftUv = vWorldPos_mangrove.xz * 0.18 + vec2(uTime * 0.05, uTime * 0.02);
float litter = mh_fbm(driftUv);
float litterMask = smoothstep(0.55, 0.78, litter);

// Larger-scale body mask — tannin pools thick vs thin. This is what
// makes the surface read as an aerial photograph of estuary water
// rather than as a uniform fill.
float bodyMask = mh_fbm(vWorldPos_mangrove.xz * 0.04 + vec2(11.0, 7.0));
float bodyT = smoothstep(0.30, 0.78, bodyMask);
vec3 waterBody = mix(tanninDeep, tanninShallow, bodyT);

// A medium-tannin band sits between deep and shallow — three-stop
// blend gives the surface the value variation that one-stop lacks.
float midBand = smoothstep(0.42, 0.62, bodyMask);
waterBody = mix(waterBody, tanninMid, midBand * 0.55);

// Leaf-litter colour: warm umber, more saturated than the water
// itself so it reads as floating organic matter.
vec3 litterColor = vec3(0.30, 0.21, 0.115);
vec3 surface = mix(waterBody, litterColor, litterMask * 0.65);

diffuseColor.rgb = surface;
`)},super(r,s),this.receiveShadow=!0,this._uniforms=i,this._normalMap=o,this.renderOrder=0}update(e){this._uniforms.uTime.value+=e,this._normalMap&&(this._normalMap.offset.x+=e*.0042,this._normalMap.offset.y+=e*.0017)}};function E(e){let t=e>>>0;return function(){t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function D(e){let n=document.createElement(`canvas`);n.width=e,n.height=e;let r=n.getContext(`2d`),i=r.createImageData(e,e),a=(e,t)=>{let n=Math.sin(e*127.1+t*311.7)*43758.5453;return n-Math.floor(n)},c=(e,t)=>{let n=Math.floor(e),r=Math.floor(t),i=e-n,o=t-r,s=i*i*(3-2*i),c=o*o*(3-2*o),l=a(n,r),u=a(n+1,r),d=a(n,r+1),f=a(n+1,r+1);return l+(u-l)*s+(d-l)*c+(l-u-d+f)*s*c},l=new Float32Array(e*e);for(let t=0;t<e;t++)for(let n=0;n<e;n++){let r=n/e,i=t/e,o=0,s=.5,u=r*18,d=i*5;for(let e=0;e<4;e++)o+=s*c(u,d),u*=2.07,d*=2.07,s*=.5;let f=Math.floor(n/11),p=Math.floor(t/11);if(a(f*7.3,p*4.7)<.04){let e=n%11-11*.5,r=t%11-11*.5,i=Math.sqrt(e*e+r*r),a=Math.max(0,1-i/3.5);o-=a*.45}l[t*e+n]=o}for(let t=0;t<e;t++)for(let n=0;n<e;n++){let r=(n-1+e)%e,a=(n+1)%e,o=(t-1+e)%e,s=(t+1)%e,c=l[t*e+a]-l[t*e+r],u=l[s*e+n]-l[o*e+n],d=-c*6,f=-u*6,p=1,m=Math.sqrt(d*d+p*p+f*f);d/=m,p/=m,f/=m;let h=(t*e+n)*4;i.data[h]=Math.floor((d*.5+.5)*255),i.data[h+1]=Math.floor((p*.5+.5)*255),i.data[h+2]=Math.floor((f*.5+.5)*255),i.data[h+3]=255}r.putImageData(i,0,0);let u=new s(n);return u.wrapS=t,u.wrapT=t,u.minFilter=o,u.magFilter=d,u.generateMipmaps=!0,u.colorSpace=``,u}var O=new b,k=new x,A=new y,j=new r,M=new r,N=class extends u{constructor({mobile:e=!1}={}){super();let t=E(12648430),r=D(e?256:512),i=e=>{e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vWorldPos_root;
varying vec3 vInstanceTint_root;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
#ifdef USE_INSTANCING
vWorldPos_root = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
#else
vWorldPos_root = (modelMatrix * vec4(transformed, 1.0)).xyz;
#endif
#ifdef USE_INSTANCING_COLOR
vInstanceTint_root = vec3(instanceColor);
#else
vInstanceTint_root = vec3(1.0);
#endif`)},a=e=>{e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec3 vWorldPos_root;
varying vec3 vInstanceTint_root;`).replace(`#include <map_fragment>`,`// World-Y blend. The waterline sits at y = 0.
float y = vWorldPos_root.y;

// Palette — all values lifted ~50-80% from the previous pass so the
// roots no longer crush to silhouette under ACES. Wet bark stays the
// darkest band in the frame; dry bark sits in the lit-shadow midtone.
vec3 wetBark = vec3(0.090, 0.078, 0.055);
vec3 dryBark = vec3(0.275, 0.205, 0.140);
vec3 algae   = vec3(0.165, 0.190, 0.105);

// Below 0 → wet, above 0.10 → dry, smooth blend in between.
float wetness = 1.0 - smoothstep(-0.04, 0.10, y);
vec3 bark = mix(dryBark, wetBark, wetness);

// Algae as a narrow band centred at y=0.05.
float band = exp(-pow((y - 0.05) * 9.0, 2.0));
bark = mix(bark, algae, band * 0.55);

// A second, broader and dimmer tide-stain band sits ABOVE the
// waterline (y = 0.1..0.35) — the signature of dried algae from
// previous high-tides. Reads as biological history without animation.
float tideStain = smoothstep(0.10, 0.18, y) * (1.0 - smoothstep(0.32, 0.42, y));
vec3 stainColor = vec3(0.165, 0.135, 0.095);
bark = mix(bark, stainColor, tideStain * 0.35);

// Per-instance tint — multiplies the whole bark colour. Each cluster
// gets a slightly different albedo so the forest doesn't read as
// stamped clones.
bark *= vInstanceTint_root;

diffuseColor.rgb = bark;
`)},o=e?8:14,s=()=>e?6+Math.floor(t()*5):8+Math.floor(t()*7),l=[],u=0;for(let e=0;e<o;e++){let n=(e%2==0?-1:1)*(1.8+t()*5.2),r=-14+e/o*26+(t()-.5)*2.5,i=-.05+t()*.18,a=s(),c=.85+t()*.3,d=.92+t()*.2,f=.88+t()*.18;l.push({cx:n,cy:i,cz:r,n:a,tint:new _(d,c,f)}),u+=a}let d=new c(.04,.07,1,8,1,!1);d.translate(0,.5,0);let p=new S({color:16777215,roughness:.78,metalness:0,normalMap:r,normalScale:new n(.95,.95),envMapIntensity:.35,fog:!0});p.onBeforeCompile=e=>{i(e),a(e)};let h=new f(d,p,u);h.castShadow=!e,h.receiveShadow=!0,h.frustumCulled=!1;let g=new Float32Array(u*3),v=0;for(let e of l)for(let n=0;n<e.n;n++){let n=t()**1.6*.85,r=t()*Math.PI*2,i=Math.cos(r)*n,a=Math.sin(r)*n,o=t()*.4,s=Math.atan2(a,i)+Math.PI/2;A.set(Math.sin(s)*o,t()*Math.PI*2,-Math.cos(s)*o,`YXZ`),k.setFromEuler(A);let c=1.4+t()*2.2,l=.7+t()*.6;M.set(l,c,l),j.set(e.cx+i,e.cy,e.cz+a),O.compose(j,k,M),h.setMatrixAt(v,O);let u=.94+t()*.12,d=.94+t()*.12,f=.94+t()*.12;g[v*3]=e.tint.r*u,g[v*3+1]=e.tint.g*d,g[v*3+2]=e.tint.b*f,v++}h.instanceMatrix.needsUpdate=!0,h.instanceColor=new m(g,3),h.instanceColor.needsUpdate=!0,this.add(h);let y=e?18:36,b=l.length*y,x=new c(.012,.02,1,5,1,!1);x.translate(0,.5,0);let C=new S({color:16777215,roughness:.85,metalness:0,normalMap:r,normalScale:new n(.4,.4),envMapIntensity:.25,fog:!0});C.onBeforeCompile=e=>{i(e),a(e)};let w=new f(x,C,b);w.castShadow=!e,w.receiveShadow=!0,w.frustumCulled=!1;let T=new Float32Array(b*3),N=0;for(let e of l)for(let n=0;n<y;n++){let n=t()*Math.PI*2,r=.5+t()**.7*1.9,i=Math.cos(n)*r,a=Math.sin(n)*r,o=.06+t()**1.4*.16,s=.7+t()*.6;A.set((t()-.5)*.18,t()*Math.PI*2,(t()-.5)*.18,`YXZ`),k.setFromEuler(A),M.set(s,o,s),j.set(e.cx+i,e.cy-.02,e.cz+a),O.compose(j,k,M),w.setMatrixAt(N,O);let c=.78+t()*.18;T[N*3]=e.tint.r*c,T[N*3+1]=e.tint.g*c,T[N*3+2]=e.tint.b*c,N++}w.instanceMatrix.needsUpdate=!0,w.instanceColor=new m(T,3),w.instanceColor.needsUpdate=!0,this.add(w);let P=e?60:140,F=new c(.018,.024,1,5,1,!1);F.translate(0,.5,0);let I=new S({color:16777215,roughness:.88,metalness:0,normalMap:r,normalScale:new n(.5,.5),envMapIntensity:.3,fog:!0});I.onBeforeCompile=e=>{i(e),a(e)};let L=new f(F,I,P);L.castShadow=!e,L.receiveShadow=!0,L.frustumCulled=!1;let R=new Float32Array(P*3);for(let e=0;e<P;e++){let n=(t()<.5?-1:1)*(1.5+t()*6.5),r=-14+t()*28,i=12+(t()-.5)*.4,a=t(),o;o=a<.6?1.5+t()*2.5:a<.95?4+t()*4:8+t()*4.5,A.set(Math.PI,t()*Math.PI*2,(t()-.5)*.1,`YXZ`),k.setFromEuler(A);let s=.6+t()*.7;M.set(s,o,s),j.set(n,i,r),O.compose(j,k,M),L.setMatrixAt(e,O);let c=1.05+(t()-.5)*.1,l=1+(t()-.5)*.1,u=.95+(t()-.5)*.1;R[e*3]=c,R[e*3+1]=l,R[e*3+2]=u}L.instanceMatrix.needsUpdate=!0,L.instanceColor=new m(R,3),L.instanceColor.needsUpdate=!0,this.add(L)}};function P(e,n=0){let r=document.createElement(`canvas`);r.width=e,r.height=e;let a=r.getContext(`2d`),c=a.createImageData(e,e),l=n,u=(e,t)=>{let n=Math.sin((e+l)*127.1+(t+l*1.7)*311.7)*43758.5453;return n-Math.floor(n)},f=(e,t)=>{let n=Math.floor(e),r=Math.floor(t),i=e-n,a=t-r,o=i*i*(3-2*i),s=a*a*(3-2*a),c=u(n,r),l=u(n+1,r),d=u(n,r+1),f=u(n+1,r+1);return c+(l-c)*o+(d-c)*s+(c-l-d+f)*o*s},p=(e,t)=>{let n=0,r=1,i=1,a=0;for(let o=0;o<5;o++)n+=r*f(e*i,t*i),a+=r,r*=.5,i*=2.13;return n/a};for(let t=0;t<e;t++)for(let n=0;n<e;n++){let r=n/e,i=t/e,a=p(r*5,i*5),o=p(r*18,i*18),s=p(r*3.5+17,i*3.5+9),l=(a-.18)*1.7+(o-.5)*.35,u=Math.min(1,Math.max(0,l+.15));u**=.85;let d=1-Math.abs(u-.4)/.4,f=Math.max(0,d),m=s,h=.115+m*.165,g=.15+m*.155,_=.075+m*.075,v=h+(.55-h)*f*.55,y=g+(.5-g)*f*.55,b=_+(.2-_)*f*.55,x=(t*e+n)*4;c.data[x]=Math.floor(Math.min(1,v)*255),c.data[x+1]=Math.floor(Math.min(1,y)*255),c.data[x+2]=Math.floor(Math.min(1,b)*255),c.data[x+3]=Math.floor(u*255)}a.putImageData(c,0,0);let m=new s(r);return m.wrapS=t,m.wrapT=t,m.minFilter=o,m.magFilter=d,m.generateMipmaps=!0,m.colorSpace=i,m}var F=class extends u{constructor({mobile:e=!1}={}){super();let t=e?256:512,n=new a(80,80,4,4);n.rotateX(Math.PI/2);let r=P(t,0);r.repeat.set(4,4);let i=new C(n,new S({map:r,transparent:!0,alphaTest:.35,side:2,roughness:.95,metalness:0,color:16777215,fog:!0}));i.position.y=12,i.castShadow=!e,i.receiveShadow=!1,this.add(i);let o=new a(80,80,4,4);o.rotateX(Math.PI/2),o.rotateY(.42);let s=P(t,113);s.repeat.set(3.2,3.2),s.offset.set(.13,.27);let c=new C(o,new S({map:s,transparent:!0,alphaTest:.35,side:2,roughness:.95,metalness:0,color:16777215,fog:!0}));c.position.y=14.2,c.castShadow=!e,c.receiveShadow=!1,this.add(c)}};function I(){return window.matchMedia(`(hover: none) and (pointer: coarse)`).matches}function L(){return window.matchMedia(`(prefers-reduced-motion: reduce)`).matches}function R(){let t=document.querySelector(`canvas#mangrove`);if(!t)return;let n=I(),r=new v(t);r.particles&&r.scene.remove(r.particles),r.scene.background=null,r.scene.children.filter(e=>e.isAmbientLight||e.isDirectionalLight||e.isHemisphereLight).forEach(e=>r.scene.remove(e)),r.renderer.shadowMap.enabled=!n,r.renderer.shadowMap.type=2,r.renderer.toneMappingExposure=1.6;let i=r.getCamera();i.fov=32,i.near=.1,i.far=250,i.updateProjectionMatrix();let a=window.innerWidth/window.innerHeight<1?.18:0,o={x:0,y:1.4+a,z:8},s={x:0,y:1+a*.4,z:-10};r.setCameraPosition(o,s),r.scene.fog=new l(5786166,.02);let c=new T({mobile:n}),u=new N({mobile:n}),d=new F({mobile:n});r.scene.add(c),r.scene.add(u),r.scene.add(d);let f=new p(16765578,1.4);f.position.set(10,14,5),f.target.position.set(0,0,-8),f.castShadow=!n,f.shadow.mapSize.set(2048,2048),f.shadow.camera.left=-16,f.shadow.camera.right=16,f.shadow.camera.top=18,f.shadow.camera.bottom=-18,f.shadow.camera.near=4,f.shadow.camera.far=80,f.shadow.bias=-8e-4,f.shadow.normalBias=.06,r.scene.add(f),r.scene.add(f.target);let m=new g(9073216,2430992,.45);r.scene.add(m);let _=new p(12097648,.2);if(_.position.set(0,.4,6),_.target.position.set(0,.6,-8),r.scene.add(_),r.scene.add(_.target),!n){let e=new h(r.renderer);e.compileEquirectangularShader();let t=e.fromScene(r.scene,.04,.1,100);r.scene.environment=t.texture,e.dispose()}r.onUpdate(e=>{L()||c.update(e)}),window.addEventListener(`resize`,()=>{r.resize();let e=window.innerWidth/window.innerHeight<1?.18:0,t=r.getCamera().position.z,n=r._cameraTarget.z;r.setCameraPosition({x:0,y:1.4+e,z:t},{x:0,y:1+e*.4,z:n})}),document.addEventListener(`visibilitychange`,()=>{document.hidden?e.globalTimeline.pause():e.globalTimeline.resume()}),r.composer.render(),requestAnimationFrame(()=>z(r))}function z(t){if(L())return;let n=t.getCamera(),r=e.timeline({defaults:{ease:`none`}});r.to({},{duration:2}),r.to(n.position,{z:-8,duration:8,ease:`none`}),r.to(n.position,{z:-10,duration:2,ease:`power2.out`})}document.addEventListener(`DOMContentLoaded`,R);