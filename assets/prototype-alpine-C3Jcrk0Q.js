import{t as e}from"./gsap-C81z-gCV.js";import{C as t,D as n,E as r,_ as i,c as a,f as o,g as s,i as c,m as l,o as u,t as d,u as f,v as p,y as m}from"./cinematic-engine-CvaXYqDU.js";function h(e,t){let n=Math.sin(e*127.1+t*311.7)*43758.5453;return n-Math.floor(n)}function g(e,t){let n=Math.floor(e),r=Math.floor(t),i=e-n,a=t-r,o=i*i*(3-2*i),s=a*a*(3-2*a),c=h(n,r),l=h(n+1,r),u=h(n,r+1),d=h(n+1,r+1);return c+(l-c)*o+(u-c)*s+(c-l-u+d)*o*s}function _(e,t){return 1-Math.abs(g(e,t)*2-1)}function v(e,t,n){let r=0,i=1,a=1,o=0;for(let s=0;s<n;s++){let n=_(e*a,t*a);r+=i*n**1.4,o+=i,i*=.5,a*=2.07}return r/o}function y(e,t,n){let r=0,i=1,a=1,o=0;for(let s=0;s<n;s++)r+=i*g(e*a,t*a),o+=i,i*=.5,a*=2.05;return r/o}var b=class extends s{constructor({mobile:e=!1}={}){let t=e?128:256,n=2e3,r=new m(n,n,t,t);r.rotateX(-Math.PI/2);let i=r.attributes.position,a=.0028,o=.7;for(let e=0;e<i.count;e++){let t=i.getX(e),r=i.getZ(e),s=v(t*a,r*a,6),c=y((t+350)*a*.8,(r+350)*a*.8,4),l=s*o+c*(1-o),u=Math.max(0,-r)/n;l*=.55+.5*u;let d=Math.max(0,r)/n,f=Math.max(0,t)/1e3;l-=d*(.3+.18*f),l=Math.max(l,-.15),i.setY(e,l*1500)}r.computeVertexNormals();let s=new p({roughness:.85,metalness:0,color:16777215});s.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vWorldNormal_alpine;`).replace(`#include <beginnormal_vertex>`,`#include <beginnormal_vertex>
vWorldNormal_alpine = normalize(mat3(modelMatrix) * objectNormal);`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec3 vWorldNormal_alpine;`).replace(`#include <map_fragment>`,`float slope = 1.0 - clamp(vWorldNormal_alpine.y, 0.0, 1.0);
vec3 snow = vec3(0.85, 0.86, 0.88);
vec3 rock = vec3(0.18, 0.16, 0.14);
vec3 alpineAlbedo = mix(snow, rock, smoothstep(0.32, 0.60, slope));
diffuseColor.rgb = alpineAlbedo;
`)},super(r,s),this.castShadow=!0,this.receiveShadow=!0}};function x(e){let n=document.createElement(`canvas`);n.width=e,n.height=e;let r=n.getContext(`2d`),i=r.createImageData(e,e),a=(e,t)=>{let n=Math.sin(e*127.1+t*311.7)*43758.5453;return n-Math.floor(n)},o=(e,t)=>{let n=Math.floor(e),r=Math.floor(t),i=e-n,o=t-r,s=i*i*(3-2*i),c=o*o*(3-2*o),l=a(n,r),u=a(n+1,r),d=a(n,r+1),f=a(n+1,r+1);return l+(u-l)*s+(d-l)*c+(l-u-d+f)*s*c},s=(e,t)=>{let n=0,r=1,i=1,a=0;for(let s=0;s<5;s++)n+=r*o(e*i,t*i),a+=r,r*=.5,i*=2;return n/a};for(let t=0;t<e;t++)for(let n=0;n<e;n++){let r=n/e,a=t/e,o=s(r*4,a*4),c=(Math.max(0,o-.35)*1.4)**1.4;c=Math.min(.85,c);let l=(t*e+n)*4;i.data[l]=255,i.data[l+1]=255,i.data[l+2]=255,i.data[l+3]=Math.floor(c*255)}r.putImageData(i,0,0);let u=new c(n);return u.wrapS=t,u.wrapT=t,u.minFilter=l,u.magFilter=l,u}var S=class extends s{constructor({mobile:e=!1}={}){let t=new m(4e3,4e3,1,1);t.rotateX(-Math.PI/2);let n=x(e?256:512),r=new u(.92,.88,.82),a=new i({map:n,transparent:!0,depthWrite:!1,side:2,fog:!0,color:new u(.72,.75,.8).clone().lerp(r,.37)});super(t,a),this.position.y=600,this.renderOrder=1,this._tex=n}update(e){this._tex.offset.x+=e*.0015}},C=class extends s{constructor(){let e=new n(8e3,32,16),t=new r({side:1,depthWrite:!1,fog:!1,vertexShader:`
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
      `});super(e,t),this.frustumCulled=!1,this.renderOrder=-1}};function w(){return window.matchMedia(`(hover: none) and (pointer: coarse)`).matches}function T(){return window.matchMedia(`(prefers-reduced-motion: reduce)`).matches}function E(){let t=document.querySelector(`canvas#alpine`);if(!t)return;let n=w(),r=new d(t);r.particles&&r.scene.remove(r.particles),r.scene.background=null,r.scene.children.filter(e=>e.isAmbientLight||e.isDirectionalLight).forEach(e=>r.scene.remove(e)),r.renderer.shadowMap.enabled=!n,r.renderer.shadowMap.type=2;let i=r.getCamera();i.fov=26,i.near=1,i.far=12e3,i.updateProjectionMatrix();let s=window.innerWidth/window.innerHeight<1?-80:0;r.setCameraPosition({x:0,y:720+s,z:1100},{x:0,y:540+s,z:-200}),r.scene.fog=new f(10331053,6e-4);let c=new C,l=new b({mobile:n}),u=new S({mobile:n});r.scene.add(c),r.scene.add(l),r.scene.add(u);let p=new a(16773344,1.4);p.position.set(60,18,-8),p.target.position.set(0,200,0),p.castShadow=!n,p.shadow.mapSize.set(2048,2048),p.shadow.camera.left=-300,p.shadow.camera.right=300,p.shadow.camera.top=300,p.shadow.camera.bottom=-300,p.shadow.camera.near=10,p.shadow.camera.far=1500,p.shadow.bias=-5e-4,p.shadow.normalBias=.05,r.scene.add(p),r.scene.add(p.target);let m=new o(4872296,3814704,.06);r.scene.add(m),r.onUpdate(e=>{u.update(e)}),window.addEventListener(`resize`,()=>{r.resize();let e=window.innerWidth/window.innerHeight<1?-80:0,t=r._cameraTarget.x;r.setCameraPosition({x:0,y:720+e,z:1100},{x:t,y:540+e,z:-200})}),document.addEventListener(`visibilitychange`,()=>{document.hidden?e.globalTimeline.pause():e.globalTimeline.resume()}),r.composer.render(),requestAnimationFrame(()=>D(r))}function D(t){if(T())return;let n=t._cameraTarget,r=e.timeline({defaults:{ease:`none`}});r.to({},{duration:2}),r.to(n,{x:90,duration:8,ease:`none`}),r.to(n,{x:100,duration:2,ease:`power2.out`})}document.addEventListener(`DOMContentLoaded`,E);