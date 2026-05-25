import{t as e}from"./gsap-C81z-gCV.js";import{A as t,E as n,S as r,a as i,b as a,d as o,g as s,k as c,l,p as u,s as d,t as f,x as p,y as m}from"./cinematic-engine-Bgg4WkDz.js";function h(e,t){let n=Math.sin(e*127.1+t*311.7)*43758.5453;return n-Math.floor(n)}function g(e,t){let n=Math.floor(e),r=Math.floor(t),i=e-n,a=t-r,o=i*i*(3-2*i),s=a*a*(3-2*a),c=h(n,r),l=h(n+1,r),u=h(n,r+1),d=h(n+1,r+1);return c+(l-c)*o+(u-c)*s+(c-l-u+d)*o*s}function _(e,t){return 1-Math.abs(g(e,t)*2-1)}function v(e,t,n){let r=0,i=1,a=1,o=0;for(let s=0;s<n;s++){let n=_(e*a,t*a);r+=i*n**1.4,o+=i,i*=.5,a*=2.07}return r/o}function y(e,t,n){let r=0,i=1,a=1,o=0;for(let s=0;s<n;s++)r+=i*g(e*a,t*a),o+=i,i*=.5,a*=2.05;return r/o}var b=class extends m{constructor({mobile:e=!1}={}){let t=e?128:256,n=2e3,i=new r(n,n,t,t);i.rotateX(-Math.PI/2);let a=i.attributes.position,o=.0028,s=.7;for(let e=0;e<a.count;e++){let t=a.getX(e),r=a.getZ(e),i=v(t*o,r*o,6),c=y((t+350)*o*.8,(r+350)*o*.8,4),l=i*s+c*(1-s),u=Math.max(0,-r)/n;l*=.55+.5*u;let d=Math.max(0,r)/n,f=Math.max(0,t)/1e3;l-=d*(.3+.18*f),l=Math.max(l,-.15),a.setY(e,l*1500)}i.computeVertexNormals();let c=new p({roughness:.85,metalness:0,color:16777215});c.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vWorldNormal_alpine;`).replace(`#include <beginnormal_vertex>`,`#include <beginnormal_vertex>
vWorldNormal_alpine = normalize(mat3(modelMatrix) * objectNormal);`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec3 vWorldNormal_alpine;`).replace(`#include <map_fragment>`,`float slope = 1.0 - clamp(vWorldNormal_alpine.y, 0.0, 1.0);
vec3 snow = vec3(0.85, 0.86, 0.88);
vec3 rock = vec3(0.18, 0.16, 0.14);
vec3 alpineAlbedo = mix(snow, rock, smoothstep(0.32, 0.60, slope));
diffuseColor.rgb = alpineAlbedo;
`)},super(i,c),this.castShadow=!0,this.receiveShadow=!0}};function x(e){let t=document.createElement(`canvas`);t.width=e,t.height=e;let r=t.getContext(`2d`),a=r.createImageData(e,e),o=(e,t)=>{let n=Math.sin(e*127.1+t*311.7)*43758.5453;return n-Math.floor(n)},c=(e,t)=>{let n=Math.floor(e),r=Math.floor(t),i=e-n,a=t-r,s=i*i*(3-2*i),c=a*a*(3-2*a),l=o(n,r),u=o(n+1,r),d=o(n,r+1),f=o(n+1,r+1);return l+(u-l)*s+(d-l)*c+(l-u-d+f)*s*c},l=(e,t)=>{let n=0,r=1,i=1,a=0;for(let o=0;o<5;o++)n+=r*c(e*i,t*i),a+=r,r*=.5,i*=2;return n/a};for(let t=0;t<e;t++)for(let n=0;n<e;n++){let r=n/e,i=t/e,o=l(r*4,i*4),s=(Math.max(0,o-.35)*1.4)**1.4;s=Math.min(.85,s);let c=(t*e+n)*4;a.data[c]=255,a.data[c+1]=255,a.data[c+2]=255,a.data[c+3]=Math.floor(s*255)}r.putImageData(a,0,0);let u=new i(t);return u.wrapS=n,u.wrapT=n,u.minFilter=s,u.magFilter=s,u}var S=class extends m{constructor({mobile:e=!1}={}){let t=new r(4e3,4e3,1,1);t.rotateX(-Math.PI/2);let n=x(e?256:512),i=new d(.92,.88,.82),o=new a({map:n,transparent:!0,depthWrite:!1,side:2,fog:!0,color:new d(.72,.75,.8).clone().lerp(i,.37)});super(t,o),this.position.y=600,this.renderOrder=1,this._tex=n}update(e){this._tex.offset.x+=e*.0015}},C=class extends m{constructor(){let e=new t(8e3,32,16),n=new c({side:1,depthWrite:!1,fog:!1,vertexShader:`
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
      `});super(e,n),this.frustumCulled=!1,this.renderOrder=-1}};function w(){return window.matchMedia(`(hover: none) and (pointer: coarse)`).matches}function T(){return window.matchMedia(`(prefers-reduced-motion: reduce)`).matches}function E(){let t=document.querySelector(`canvas#alpine`);if(!t)return;let n=w(),r=new f(t);r.particles&&r.scene.remove(r.particles),r.scene.background=null,r.scene.children.filter(e=>e.isAmbientLight||e.isDirectionalLight).forEach(e=>r.scene.remove(e)),r.renderer.shadowMap.enabled=!n,r.renderer.shadowMap.type=2;let i=r.getCamera();i.fov=26,i.near=1,i.far=12e3,i.updateProjectionMatrix();let a=window.innerWidth/window.innerHeight<1?-80:0;r.setCameraPosition({x:0,y:720+a,z:1100},{x:0,y:540+a,z:-200}),r.scene.fog=new o(10331053,6e-4);let s=new C,c=new b({mobile:n}),d=new S({mobile:n});r.scene.add(s),r.scene.add(c),r.scene.add(d);let p=new l(16773344,1.4);p.position.set(60,18,-8),p.target.position.set(0,200,0),p.castShadow=!n,p.shadow.mapSize.set(2048,2048),p.shadow.camera.left=-300,p.shadow.camera.right=300,p.shadow.camera.top=300,p.shadow.camera.bottom=-300,p.shadow.camera.near=10,p.shadow.camera.far=1500,p.shadow.bias=-5e-4,p.shadow.normalBias=.05,r.scene.add(p),r.scene.add(p.target);let m=new u(4872296,3814704,.06);r.scene.add(m),r.onUpdate(e=>{d.update(e)}),window.addEventListener(`resize`,()=>{r.resize();let e=window.innerWidth/window.innerHeight<1?-80:0,t=r._cameraTarget.x;r.setCameraPosition({x:0,y:720+e,z:1100},{x:t,y:540+e,z:-200})}),document.addEventListener(`visibilitychange`,()=>{document.hidden?e.globalTimeline.pause():e.globalTimeline.resume()}),r.composer.render(),requestAnimationFrame(()=>D(r))}function D(t){if(T())return;let n=t._cameraTarget,r=e.timeline({defaults:{ease:`none`}});r.to({},{duration:2}),r.to(n,{x:90,duration:8,ease:`none`}),r.to(n,{x:100,duration:2,ease:`power2.out`})}document.addEventListener(`DOMContentLoaded`,E);