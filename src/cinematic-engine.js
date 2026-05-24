import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { gsap } from 'gsap';
import { prefersReducedMotion } from './reduced-motion.js';

/**
 * Ambient particle system - soft motes floating in space
 */
function createParticleSystem() {
  const count = 1000;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const opacities = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    sizes[i] = Math.random() * 3.0 + 1.0;
    opacities[i] = Math.random() * 0.3 + 0.1;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    },
    vertexShader: `
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
    `,
    fragmentShader: `
      varying float vOpacity;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, dist) * vOpacity;
        gl_FragColor = vec4(0.4, 0.6, 0.9, alpha * 0.4);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });

  return new THREE.Points(geometry, material);
}

/**
 * CinematicEngine - core Three.js scene manager
 */
export class CinematicEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();
    this._updateCallbacks = [];
    this._paused = false;
    this._lastTime = performance.now();

    // Camera target for lookAt (used by flyCamera)
    this._cameraTarget = new THREE.Vector3(0, 0, 0);

    this._initScene();
    this._initRenderer();
    this._initPostProcessing();
    this._initParticles();
    this._initLighting();
    this._initVisibilityHandler();
    this._startLoop();
  }

  _initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a1a);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    // Start camera far away for the fly-in
    this.camera.position.set(0, 2, 20);
    this.camera.lookAt(this._cameraTarget);
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
  }

  _initPostProcessing() {
    this.composer = new EffectComposer(this.renderer);

    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.3,   // strength
      0.4,   // radius
      0.85   // threshold
    );
    this.composer.addPass(bloomPass);
  }

  _initParticles() {
    this.particles = createParticleSystem();
    this.scene.add(this.particles);
  }

  _initLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xfff5e6, 1.2);
    directional.position.set(5, 5, 3);
    this.scene.add(directional);
  }

  _initVisibilityHandler() {
    this._visibilityHandler = () => {
      if (document.hidden) {
        this._paused = true;
        this.clock.stop();
      } else {
        this._paused = false;
        this.clock.start();
        this._lastTime = performance.now();
      }
    };
    document.addEventListener('visibilitychange', this._visibilityHandler);
  }

  _startLoop() {
    const animate = () => {
      this._animationId = requestAnimationFrame(animate);

      if (this._paused) return;

      const elapsed = this.clock.getElapsedTime();
      const now = performance.now();
      const delta = (now - this._lastTime) / 1000;
      this._lastTime = now;

      // Update particle drift. Reduced-motion: freeze the time uniform
      // at 0 so the 1000 ambient motes render at their initial random
      // positions — visually present as a starfield, no orbital motion.
      this.particles.material.uniforms.time.value = prefersReducedMotion() ? 0 : elapsed;

      // Update camera lookAt
      this.camera.lookAt(this._cameraTarget);

      // Run registered update callbacks (e.g., globe.update)
      for (const cb of this._updateCallbacks) {
        cb(delta);
      }

      // Render via composer
      this.composer.render();
    };
    animate();
  }

  /**
   * Register a callback to be called every frame with delta time
   */
  onUpdate(callback) {
    this._updateCallbacks.push(callback);
  }

  /**
   * Animate camera from current position to target position/lookAt using GSAP
   * Returns the GSAP timeline
   */
  flyCamera(toPos, toTarget, duration = 1.5, ease = 'power3.inOut') {
    const tl = gsap.timeline();

    tl.to(this.camera.position, {
      x: toPos.x,
      y: toPos.y,
      z: toPos.z,
      duration,
      ease,
    }, 0);

    tl.to(this._cameraTarget, {
      x: toTarget.x,
      y: toTarget.y,
      z: toTarget.z,
      duration,
      ease,
    }, 0);

    return tl;
  }

  /**
   * Immediately set camera position and lookAt target
   */
  setCameraPosition(pos, target) {
    this.camera.position.set(pos.x, pos.y, pos.z);
    this._cameraTarget.set(target.x, target.y, target.z);
    this.camera.lookAt(this._cameraTarget);
  }

  /**
   * Handle window resize
   */
  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);

    this.particles.material.uniforms.pixelRatio.value = Math.min(
      window.devicePixelRatio,
      2
    );
  }

  /**
   * Get the Three.js scene (for adding globe, etc.)
   */
  getScene() {
    return this.scene;
  }

  /**
   * Get the camera
   */
  getCamera() {
    return this.camera;
  }

  /**
   * Get the renderer DOM element
   */
  getDomElement() {
    return this.renderer.domElement;
  }

  /**
   * Dispose
   */
  dispose() {
    if (this._animationId) {
      cancelAnimationFrame(this._animationId);
    }
    document.removeEventListener('visibilitychange', this._visibilityHandler);
    this.renderer.dispose();
    this.composer.dispose();
  }
}
