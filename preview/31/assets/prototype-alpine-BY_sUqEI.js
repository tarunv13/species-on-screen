import{t as e}from"./gsap-C81z-gCV.js";import{S as t,c as n,d as r,f as i,g as a,h as o,i as s,l as c,m as l,o as u,p as d,t as f,x as p,y as m}from"./cinematic-engine-Bwi3lRnL.js";function h(e,t){let n=Math.sin(e*127.1+t*311.7)*43758.5453;return n-Math.floor(n)}function g(e,t){let n=Math.floor(e),r=Math.floor(t),i=e-n,a=t-r,o=i*i*(3-2*i),s=a*a*(3-2*a),c=h(n,r),l=h(n+1,r),u=h(n,r+1),d=h(n+1,r+1);return c+(l-c)*o+(u-c)*s+(c-l-u+d)*o*s}function _(e,t){return 1-Math.abs(g(e,t)*2-1)}function v(e,t,n){let r=0,i=1,a=1,o=0;for(let s=0;s<n;s++){let n=_(e*a,t*a);r+=i*n**1.4,o+=i,i*=.5,a*=2.07}return r/o}function y(e,t,n){let r=0,i=1,a=1,o=0;for(let s=0;s<n;s++)r+=i*g(e*a,t*a),o+=i,i*=.5,a*=2.05;return r/o}var b=class extends d{constructor({mobile:e=!1}={}){let t=e?128:256,n=2e3,r=new a(n,n,t,t);r.rotateX(-Math.PI/2);let i=r.attributes.position,s=.0028,c=.7;for(let e=0;e<i.count;e++){let t=i.getX(e),r=i.getZ(e),a=v(t*s,r*s,6),o=y((t+350)*s*.8,(r+350)*s*.8,4),l=a*c+o*(1-c),u=Math.max(0,-r)/n;l*=.55+.5*u;let d=Math.max(0,r)/n,f=Math.max(0,t)/1e3;l-=d*(.3+.18*f),l=Math.max(l,-.15),i.setY(e,l*1500)}r.computeVertexNormals();let l=new o({roughness:.85,metalness:0,color:16777215});l.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vWorldNormal_alpine;`).replace(`#include <beginnormal_vertex>`,`#include <beginnormal_vertex>
vWorldNormal_alpine = normalize(mat3(modelMatrix) * objectNormal);`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec3 vWorldNormal_alpine;`).replace(`#include <map_fragment>`,`float slope = 1.0 - clamp(vWorldNormal_alpine.y, 0.0, 1.0);
vec3 snow = vec3(0.85, 0.86, 0.88);
vec3 rock = vec3(0.18, 0.16, 0.14);
vec3 alpineAlbedo = mix(snow, rock, smoothstep(0.32, 0.60, slope));
diffuseColor.rgb = alpineAlbedo;
`)},super(r,l),this.castShadow=!0,this.receiveShadow=!0}};function x(e){let t=document.createElement(`canvas`);t.width=e,t.height=e;let n=t.getContext(`2d`),r=n.createImageData(e,e),a=(e,t)=>{let n=Math.sin(e*127.1+t*311.7)*43758.5453;return n-Math.floor(n)},o=(e,t)=>{let n=Math.floor(e),r=Math.floor(t),i=e-n,o=t-r,s=i*i*(3-2*i),c=o*o*(3-2*o),l=a(n,r),u=a(n+1,r),d=a(n,r+1),f=a(n+1,r+1);return l+(u-l)*s+(d-l)*c+(l-u-d+f)*s*c},c=(e,t)=>{let n=0,r=1,i=1,a=0;for(let s=0;s<5;s++)n+=r*o(e*i,t*i),a+=r,r*=.5,i*=2;return n/a};for(let t=0;t<e;t++)for(let n=0;n<e;n++){let i=n/e,a=t/e,o=c(i*4,a*4),s=(Math.max(0,o-.35)*1.4)**1.4;s=Math.min(.85,s);let l=(t*e+n)*4;r.data[l]=255,r.data[l+1]=255,r.data[l+2]=255,r.data[l+3]=Math.floor(s*255)}n.putImageData(r,0,0);let l=new s(t);return l.wrapS=m,l.wrapT=m,l.minFilter=i,l.magFilter=i,l}var S=class extends d{constructor({mobile:e=!1}={}){let t=new a(4e3,4e3,1,1);t.rotateX(-Math.PI/2);let n=x(e?256:512),r=new u(.92,.88,.82),i=new l({map:n,transparent:!0,depthWrite:!1,side:2,fog:!0,color:new u(.72,.75,.8).clone().lerp(r,.37)});super(t,i),this.position.y=600,this.renderOrder=1,this._tex=n}update(e){this._tex.offset.x+=e*.0015}},C=class extends d{constructor(){let e=new t(8e3,32,16),n=new p({side:1,depthWrite:!1,fog:!1,vertexShader:`
        varying vec3 vViewDir;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vViewDir = normalize(worldPos.xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        varying vec3 vViewDir;
        // Cheap hash for dithering
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        void main() {
          float t = clamp(vViewDir.y, 0.0, 1.0);
          vec3 lower = vec3(0.62, 0.62, 0.66);   // warmed grey near horizon
          vec3 mid   = vec3(0.22, 0.32, 0.46);   // muted blue
          vec3 upper = vec3(0.08, 0.13, 0.24);   // deep cool zenith
          vec3 sky = mix(
            mix(lower, mid, smoothstep(0.0, 0.35, t)),
            upper,
            smoothstep(0.35, 0.85, t)
          );
          // 8-bit dither against gradient banding
          float dither = (hash(gl_FragCoord.xy) - 0.5) / 255.0;
          sky += dither;
          gl_FragColor = vec4(sky, 1.0);
        }
      `});super(e,n),this.frustumCulled=!1,this.renderOrder=-1}};function w(){return window.matchMedia(`(hover: none) and (pointer: coarse)`).matches}function T(){return window.matchMedia(`(prefers-reduced-motion: reduce)`).matches}function E(){let t=document.querySelector(`canvas#alpine`);if(!t)return;let i=w(),a=new f(t);a.particles&&a.scene.remove(a.particles),a.scene.background=null,a.scene.children.filter(e=>e.isAmbientLight||e.isDirectionalLight).forEach(e=>a.scene.remove(e)),a.renderer.shadowMap.enabled=!i,a.renderer.shadowMap.type=2;let o=a.getCamera();o.fov=26,o.near=1,o.far=12e3,o.updateProjectionMatrix();let s=window.innerWidth/window.innerHeight<1?-80:0;a.setCameraPosition({x:0,y:720+s,z:1100},{x:0,y:540+s,z:-200}),a.scene.fog=new c(10331053,6e-4);let l=new C,u=new b({mobile:i}),d=new S({mobile:i});a.scene.add(l),a.scene.add(u),a.scene.add(d);let p=new n(16773344,1.4);p.position.set(60,18,-8),p.target.position.set(0,200,0),p.castShadow=!i,p.shadow.mapSize.set(2048,2048),p.shadow.camera.left=-300,p.shadow.camera.right=300,p.shadow.camera.top=300,p.shadow.camera.bottom=-300,p.shadow.camera.near=10,p.shadow.camera.far=1500,p.shadow.bias=-5e-4,p.shadow.normalBias=.05,a.scene.add(p),a.scene.add(p.target);let m=new r(4872296,3814704,.06);a.scene.add(m),a.onUpdate(e=>{d.update(e)}),window.addEventListener(`resize`,()=>{a.resize();let e=window.innerWidth/window.innerHeight<1?-80:0,t=a._cameraTarget.x;a.setCameraPosition({x:0,y:720+e,z:1100},{x:t,y:540+e,z:-200})}),document.addEventListener(`visibilitychange`,()=>{document.hidden?e.globalTimeline.pause():e.globalTimeline.resume()}),a.composer.render(),requestAnimationFrame(()=>D(a))}function D(t){if(T())return;let n=t._cameraTarget,r=e.timeline({defaults:{ease:`none`}});r.to({},{duration:2}),r.to(n,{x:90,duration:8,ease:`none`}),r.to(n,{x:100,duration:2,ease:`power2.out`})}document.addEventListener(`DOMContentLoaded`,E);