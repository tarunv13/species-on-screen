import"./modulepreload-polyfill-Dezn_h7o.js";import{t as e}from"./gsap-D_956-p2.js";import{C as t,D as n,E as r,S as i,T as a,_ as o,a as s,b as c,c as l,d as u,f as d,g as f,h as p,i as m,l as h,m as g,n as _,o as v,p as y,r as b,s as x,t as S,u as C,v as w,w as T,x as E,y as D}from"./three.module-iOtoceOb.js";import{n as O}from"./place-manifest-b-sYIR9x.js";var k={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},A=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},j=new p(-1,1,1,-1,0,1),M=new class extends m{constructor(){super(),this.setAttribute(`position`,new h([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new h([0,2,0,0,2,0],2))}},N=class{constructor(e){this._mesh=new d(M,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,j)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},P=class extends A{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof c?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=T.clone(e.uniforms),this.material=new c({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new N(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},F=class extends A{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},I=class extends A{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},L=class{constructor(e,r){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),r===void 0){let t=e.getSize(new a);this._width=t.width,this._height=t.height,r=new n(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:u}),r.texture.name=`EffectComposer.rt1`}else this._width=r.width,this._height=r.height;this.renderTarget1=r,this.renderTarget2=r.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new P(k),this.copyPass.material.blending=0,this.timer=new t}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}F!==void 0&&(r instanceof F?n=!0:r instanceof I&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new a);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},R=class extends A{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new x}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},z={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new x(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},B=class e extends A{constructor(e,t=1,i,o){super(),this.strength=t,this.radius=i,this.threshold=o,this.resolution=e===void 0?new a(256,256):new a(e.x,e.y),this.clearColor=new x(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),l=Math.round(this.resolution.y/2);this.renderTargetBright=new n(s,l,{type:u}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new n(s,l,{type:u});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let r=new n(s,l,{type:u});r.texture.name=`UnrealBloomPass.v`+e,r.texture.generateMipmaps=!1,this.renderTargetsVertical.push(r),s=Math.round(s/2),l=Math.round(l/2)}let d=z;this.highPassUniforms=T.clone(d.uniforms),this.highPassUniforms.luminosityThreshold.value=o,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new c({uniforms:this.highPassUniforms,vertexShader:d.vertexShader,fragmentShader:d.fragmentShader}),this.separableBlurMaterials=[];let f=[6,10,14,18,22];s=Math.round(this.resolution.x/2),l=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(f[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new a(1/s,1/l),s=Math.round(s/2),l=Math.round(l/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let p=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=p,this.bloomTintColors=[new r(1,1,1),new r(1,1,1),new r(1,1,1),new r(1,1,1),new r(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=T.clone(k.uniforms),this.blendMaterial=new c({uniforms:this.copyUniforms,vertexShader:k.vertexShader,fragmentShader:k.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new x,this._oldClearAlpha=1,this._basic=new y,this._fsQuad=new N(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new a(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);return new c({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new a(.5,.5)},direction:{value:new a(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new c({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};B.BlurDirectionX=new a(1,0),B.BlurDirectionY=new a(0,1);function V(){let e=1e3,t=new Float32Array(e*3),n=new Float32Array(e),r=new Float32Array(e);for(let i=0;i<e;i++)t[i*3]=(Math.random()-.5)*20,t[i*3+1]=(Math.random()-.5)*20,t[i*3+2]=(Math.random()-.5)*20,n[i]=Math.random()*3+1,r[i]=Math.random()*.3+.1;let i=new m;return i.setAttribute(`position`,new b(t,3)),i.setAttribute(`aSize`,new b(n,1)),i.setAttribute(`aOpacity`,new b(r,1)),new o(i,new c({uniforms:{time:{value:0},pixelRatio:{value:Math.min(window.devicePixelRatio,2)}},vertexShader:`
      attribute float aSize;
      attribute float aOpacity;
      uniform float time;
      uniform float pixelRatio;
      varying float vOpacity;

      void main() {
        vOpacity = aOpacity;
        vec3 pos = position;
        pos.x += sin(time * 0.1 + position.z) * 0.05;
        pos.y += cos(time * 0.15 + position.x) * 0.05;
        pos.z += sin(time * 0.12 + position.y) * 0.03;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = aSize * pixelRatio * (80.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,fragmentShader:`
      varying float vOpacity;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, dist) * vOpacity;
        gl_FragColor = vec4(0.4, 0.6, 0.9, alpha * 0.4);
      }
    `,transparent:!0,depthWrite:!1,blending:1}))}var H=class{constructor(e){this.canvas=e,this.clock=new v,this._updateCallbacks=[],this._paused=!1,this._lastTime=performance.now(),this._cameraTarget=new r(0,0,0),this._initScene(),this._initRenderer(),this._initPostProcessing(),this._initParticles(),this._initLighting(),this._initVisibilityHandler(),this._startLoop()}_initScene(){this.scene=new D,this.scene.background=new x(657946),this.camera=new f(60,window.innerWidth/window.innerHeight,.1,100),this.camera.position.set(0,2,20),this.camera.lookAt(this._cameraTarget)}_initRenderer(){this.renderer=new S({canvas:this.canvas,antialias:!0,alpha:!1}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.toneMapping=4,this.renderer.toneMappingExposure=1}_initPostProcessing(){this.composer=new L(this.renderer);let e=new R(this.scene,this.camera);this.composer.addPass(e);let t=new B(new a(window.innerWidth,window.innerHeight),.3,.4,.85);this.composer.addPass(t)}_initParticles(){this.particles=V(),this.scene.add(this.particles)}_initLighting(){let e=new _(16777215,.6);this.scene.add(e);let t=new l(16774630,1.2);t.position.set(5,5,3),this.scene.add(t)}_initVisibilityHandler(){this._visibilityHandler=()=>{document.hidden?(this._paused=!0,this.clock.stop()):(this._paused=!1,this.clock.start(),this._lastTime=performance.now())},document.addEventListener(`visibilitychange`,this._visibilityHandler)}_startLoop(){let e=()=>{if(this._animationId=requestAnimationFrame(e),this._paused)return;let t=this.clock.getElapsedTime(),n=performance.now(),r=(n-this._lastTime)/1e3;this._lastTime=n,this.particles.material.uniforms.time.value=t,this.camera.lookAt(this._cameraTarget);for(let e of this._updateCallbacks)e(r);this.composer.render()};e()}onUpdate(e){this._updateCallbacks.push(e)}flyCamera(t,n,r=1.5,i=`power3.inOut`){let a=e.timeline();return a.to(this.camera.position,{x:t.x,y:t.y,z:t.z,duration:r,ease:i},0),a.to(this._cameraTarget,{x:n.x,y:n.y,z:n.z,duration:r,ease:i},0),a}setCameraPosition(e,t){this.camera.position.set(e.x,e.y,e.z),this._cameraTarget.set(t.x,t.y,t.z),this.camera.lookAt(this._cameraTarget)}resize(){let e=window.innerWidth,t=window.innerHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.composer.setSize(e,t),this.particles.material.uniforms.pixelRatio.value=Math.min(window.devicePixelRatio,2)}getScene(){return this.scene}getCamera(){return this.camera}getDomElement(){return this.renderer.domElement}dispose(){this._animationId&&cancelAnimationFrame(this._animationId),document.removeEventListener(`visibilitychange`,this._visibilityHandler),this.renderer.dispose(),this.composer.dispose()}},U=[{lat:21.9,lng:89.2,name:`Tiger`,species:`tiger`,ecosystem:`tropical-forest`,color:`#4a7c59`}],W=[`tiger`];function G(e,t,n){let i=(90-e)*(Math.PI/180),a=(t+180)*(Math.PI/180);return new r(-(n*Math.sin(i)*Math.cos(a)),n*Math.cos(i),n*Math.sin(i)*Math.sin(a))}var K=class{constructor(e,t,n){this.scene=e,this.camera=t,this.renderer=n,this.group=new C,this.scene.add(this.group),this.mediaCounts={},this.columnMeshes=[],this.habitatMeshes=[],this.protectedAreaMeshes=[],this.protectedAreaData=[],this.comingSoonMeshes=[],this.speciesDataCache={},this.activeLayer=`media`,this.raycaster=new w,this.mouse=new a(-999,-999),this.hoveredIndex=-1,this.isHovered=!1,this._reduce=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,this._isDragging=!1,this._prevPointer={x:0,y:0},this._velocity={x:0,y:0},this._damping=.95,this._createGlobe(),this._createColumns(),this._createHabitatLayer(),this._createFloraFauna(),this._createComingSoonMarkers(),this._setupInteraction(),this._dataLoadPromise=this._loadMediaCounts()}whenDataLoaded(){return this._dataLoadPromise}_createGlobe(){let e=new E(1.5,128,128),t=new i,n=new g({roughness:.8,metalness:.1});this.sphere=new d(e,n),this.group.add(this.sphere),t.load(`https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg`,e=>{n.map=e,n.needsUpdate=!0},void 0,()=>{n.color=new x(4491434),n.needsUpdate=!0});let r=new E(1.58,64,64),a=new c({vertexShader:`varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`varying vec3 vNormal; void main() { float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0); gl_FragColor = vec4(0.55, 0.50, 0.42, intensity * 0.35); }`,blending:1,side:1,transparent:!0,depthWrite:!1});this.atmosphere=new d(r,a),this.group.add(this.atmosphere)}_createColumns(){let e=new s(.025,24);U.forEach((t,n)=>{let r=G(t.lat,t.lng,1.502),i=r.clone().normalize(),a=new x(t.color),o=new y({color:a.clone(),transparent:!0,opacity:.5,side:2,blending:2,depthWrite:!1}),s=new d(e.clone(),o);s.position.copy(r),s.lookAt(r.clone().add(i)),s.userData={hotspotIndex:n,species:t.species,name:t.name,restColor:a.clone()},this.group.add(s),this.columnMeshes.push(s)})}_createHabitatLayer(){let e=new s(.06,24);U.forEach(t=>{let n=G(t.lat,t.lng,1.505),r=n.clone().normalize(),i=new y({color:new x(t.color),transparent:!0,opacity:.4,side:2,depthWrite:!1}),a=new d(e.clone(),i);a.position.copy(n),a.lookAt(n.clone().add(r)),a.userData={species:t.species,name:t.name},a.visible=!1,this.group.add(a),this.habitatMeshes.push(a)})}_createProtectedAreaMarkers(e){let t=new E(.02,12,12),n=new g({color:16739125,emissive:16739125,emissiveIntensity:.6,transparent:!0,opacity:.9});e.forEach(e=>{let r=G(e.lat,e.lng,1.52),i=new d(t.clone(),n.clone());i.position.copy(r),i.userData={name:e.name,species:e.species,country:e.country},i.visible=!1,this.group.add(i),this.protectedAreaMeshes.push(i),this.protectedAreaData.push(e)})}setLayer(e){this.activeLayer=e,this.columnMeshes.forEach(e=>{e.visible=!1}),this.habitatMeshes.forEach(e=>{e.visible=!1}),this.protectedAreaMeshes.forEach(e=>{e.visible=!1}),e===`media`||e===`species`?this.columnMeshes.forEach(e=>{e.visible=!0}):e===`habitat`?this.habitatMeshes.forEach(e=>{e.visible=!0}):(e===`protected_areas`||e===`threats`)&&this.protectedAreaMeshes.forEach(e=>{e.visible=!0})}_createFloraFauna(){this.floraFaunaTime=0,this.floraFaunaMeshes=[]}_createComingSoonMarkers(){}_setupDragRotate(){}_setupInteraction(){let e=this.renderer.domElement;this._onMouseMove=e=>{this.mouse.x=e.clientX/window.innerWidth*2-1,this.mouse.y=-(e.clientY/window.innerHeight)*2+1},this._onMouseEnter=()=>{this.isHovered=!0},this._onMouseLeave=()=>{this.isHovered=!1,this.mouse.set(-999,-999)},e.addEventListener(`mousemove`,this._onMouseMove),e.addEventListener(`mouseenter`,this._onMouseEnter),e.addEventListener(`mouseleave`,this._onMouseLeave)}getScreenPositions(e){let t={};U.forEach(e=>{t[e.species]||(t[e.species]=[]),t[e.species].push(e)});let n=[],i=window.innerWidth,a=window.innerHeight;return this.group.updateMatrixWorld(),Object.entries(t).forEach(([t,o])=>{let s=new r;o.forEach(e=>{s.add(G(e.lat,e.lng,1.5))}),s.divideScalar(o.length);let c=s.clone().applyMatrix4(this.group.matrixWorld),l=new r;e.getWorldDirection(l);let u=c.clone().normalize().dot(l)>-.2,d=c.clone().project(e),f=(d.x*.5+.5)*i,p=(-d.y*.5+.5)*a,m=c.distanceTo(e.position),h=Math.max(.7,Math.min(1.3,5/m));n.push({species:t,screenX:f,screenY:p,scale:h,visible:u,data:this.speciesDataCache[t]})}),n}getSpeciesPosition(e){let t=U.filter(t=>t.species===e);if(t.length===0)return new r;let n=new r;return t.forEach(e=>{n.add(G(e.lat,e.lng,1.5))}),n.divideScalar(t.length),n}async _loadMediaCounts(){let e=[],t=[],n=[];return(await Promise.allSettled(W.map(async e=>{let t=await fetch(`/species-on-screen/preview/76/data/${e}.json`);if(!t.ok)throw Error(`HTTP ${t.status}`);return{slug:e,data:await t.json()}}))).forEach((r,i)=>{let a=W[i];if(r.status===`fulfilled`){let{data:n}=r.value;this.speciesDataCache[a]=n,this.mediaCounts[a]=n.tmdb_media?n.tmdb_media.length:0,n.globe_layers&&n.globe_layers.protected_areas&&n.globe_layers.protected_areas.forEach(t=>{e.push({...t,species:a})}),t.push(a)}else{this.mediaCounts[a]=0;let e=r.reason&&r.reason.message?r.reason.message:String(r.reason);n.push({slug:a,reason:e}),console.warn(`[globe] Species data unavailable: ${a} (${e}). Hotspot retained, card skipped.`)}}),this._updateColumnHeights(),this._createProtectedAreaMarkers(e),{loaded:t,failed:n}}_updateColumnHeights(){}update(){let e=this.isHovered?this.mouse.x*.0018:0;this._reduce||(this.group.rotation.y+=3e-4+e)}dispose(){let e=this.renderer.domElement;e.removeEventListener(`mousemove`,this._onMouseMove),e.removeEventListener(`mouseenter`,this._onMouseEnter),e.removeEventListener(`mouseleave`,this._onMouseLeave),this.columnMeshes.forEach(e=>{e.geometry.dispose(),e.material.dispose()}),this.habitatMeshes.forEach(e=>{e.geometry.dispose(),e.material.dispose()}),this.protectedAreaMeshes.forEach(e=>{e.geometry.dispose(),e.material.dispose()}),this.comingSoonMeshes.forEach(e=>{e.geometry.dispose(),e.material.dispose()}),this.floraFaunaMeshes.forEach(e=>{e.geometry.dispose(),e.material.dispose()}),this.sphere&&(this.sphere.geometry.dispose(),this.sphere.material.dispose()),this.atmosphere&&(this.atmosphere.geometry.dispose(),this.atmosphere.material.dispose()),this.scene.remove(this.group)}},q=null,J=null,Y=[],X=!1,Z=null;function Q(){let t=document.getElementById(`cinematic-canvas`);if(!t)return;let n=document.getElementById(`loading-screen`);try{q=new H(t),J=new K(q.getScene(),q.getCamera(),q.renderer)}catch(e){console.error(`Cinematic engine unavailable (WebGL); showing the static entrance.`,e),ie();return}J.setLayer(`species`),window.addEventListener(`resize`,ae),q.onUpdate(e=>{J&&J.update(e)}),n?e.to(n,{opacity:0,duration:1.4,delay:1.5,ease:`power2.inOut`,onComplete:()=>{n.style.display=`none`,$()}}):$(),te()}function ee(e){return O((e.getAttribute(`href`)||``).split(`/`).pop().replace(/\.html$/,``))}function te(){document.querySelectorAll(`#globe-ui-container a.page-caption`).forEach(e=>{let t=ee(e);!t||!t.surfaces.cinematic||(Y.push(e),e.addEventListener(`click`,n=>{n.preventDefault(),ne(t,e)}))})}function ne(t,n){if(X)return;X=!0,re(),J.isHovered=!1;let r=t.surfaces.cinematic,i=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches?.5:1,a=`/species-on-screen/preview/76/places/${r.slug}.html`,o=e.timeline();if(Z=o,r.arrival.kind===`globe-hotspot`){J.group.updateMatrixWorld();let e=J.getSpeciesPosition(r.arrival.hotspotId).clone().applyMatrix4(J.group.matrixWorld),t=e.clone().normalize(),s=e.clone().add(t.clone().multiplyScalar(3)),c=e.clone();o.to(n,{opacity:0,duration:.7*i,ease:`sine.inOut`},0),o.to(`#globe-ui-container`,{opacity:0,duration:.7*i,ease:`sine.inOut`},0),o.add(q.flyCamera(s,c,2*i,`power3.inOut`),.4*i),o.add(()=>{let e=document.getElementById(`loading-screen`);e&&(e.style.display=`block`,e.style.opacity=`0`)},1.9*i),o.to(`#loading-screen`,{opacity:1,duration:1*i,ease:`power2.inOut`},1.9*i),o.to(`#cinematic-canvas`,{opacity:0,duration:.9*i,ease:`power2.inOut`},2*i),o.add(()=>{window.location.assign(a)},3*i)}else o.to(`#globe-ui-container`,{opacity:0,duration:.7*i,ease:`sine.inOut`},0),o.add(()=>{let e=document.getElementById(`loading-screen`);e&&(e.style.display=`block`,e.style.opacity=`0`)},.5*i),o.to(`#loading-screen`,{opacity:1,duration:.9*i,ease:`power2.inOut`},.5*i),o.to(`#cinematic-canvas`,{opacity:0,duration:.8*i,ease:`power2.inOut`},.6*i),o.add(()=>{window.location.assign(a)},1.5*i)}function re(){Z&&=(Z.kill(),null)}function ie(){let e=document.getElementById(`loading-screen`),t=document.getElementById(`cinematic-canvas`),n=document.getElementById(`globe-ui-container`);e&&(e.style.display=`none`),t&&(t.style.display=`none`),n&&n.classList.add(`active`),document.querySelectorAll(`#globe-ui-container a.page-caption`).forEach(e=>e.classList.add(`is-visible`))}function $(){let t=document.getElementById(`globe-ui-container`),n=new r(1,.3,5.5),i=new r(0,0,0);q.flyCamera(n,i,6,`power3.inOut`).eventCallback(`onComplete`,()=>{e.delayedCall(.9,()=>{t&&t.classList.add(`active`),Y.forEach(e=>e.classList.add(`is-visible`))})})}function ae(){q&&q.resize()}document.addEventListener(`DOMContentLoaded`,Q);