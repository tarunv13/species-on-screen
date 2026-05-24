import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

/**
 * Ambient particle system - soft golden/green motes floating in space
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
        gl_FragColor = vec4(0.6, 0.8, 0.4, alpha * 0.4);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });

  return new THREE.Points(geometry, material);
}

/**
 * Camera keyframes - positions and lookAt targets for each chapter
 */
const CAMERA_KEYFRAMES = [
  // 0% - Hero: close-up
  { position: new THREE.Vector3(0, 0.5, 4.5), target: new THREE.Vector3(0, 0, 0) },
  // 25% - Globe: centered
  { position: new THREE.Vector3(0, 0.3, 5.5), target: new THREE.Vector3(0, 0, 0) },
  // 50% - Orbital side view
  { position: new THREE.Vector3(3, 2, 4), target: new THREE.Vector3(0, 0, 0) },
  // 75% - Species gallery
  { position: new THREE.Vector3(-2, 1.5, 5), target: new THREE.Vector3(0, 0, 0) },
  // 100% - Far pullback
  { position: new THREE.Vector3(0, 1, 8), target: new THREE.Vector3(0, 0, 0) },
];

/**
 * Cubic ease in-out for smooth interpolation
 */
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Interpolate camera position between keyframes with cubic easing
 */
function interpolateKeyframes(progress) {
  const segments = CAMERA_KEYFRAMES.length - 1;
  const rawIndex = progress * segments;
  const index = Math.min(Math.floor(rawIndex), segments - 1);
  const localT = rawIndex - index;
  const easedT = easeInOutCubic(localT);

  const from = CAMERA_KEYFRAMES[index];
  const to = CAMERA_KEYFRAMES[index + 1];

  const position = new THREE.Vector3().lerpVectors(from.position, to.position, easedT);
  const target = new THREE.Vector3().lerpVectors(from.target, to.target, easedT);

  return { position, target };
}

/**
 * CinematicEngine - core Three.js scene manager
 */
export class CinematicEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();
    this.scrollProgress = 0;
    this._updateCallbacks = [];
    this._paused = false;
    this._lastTime = performance.now();

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
    this.scene.background = new THREE.Color(0xf5f5f0);
    this.scene.fog = new THREE.FogExp2(0xf5f5f0, 0.04);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.copy(CAMERA_KEYFRAMES[0].position);
    this.camera.lookAt(CAMERA_KEYFRAMES[0].target);
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
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
      0.15,  // strength
      0.4,   // radius
      0.9    // threshold
    );
    this.composer.addPass(bloomPass);
  }

  _initParticles() {
    this.particles = createParticleSystem();
    this.scene.add(this.particles);
  }

  _initLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xfff5e6, 1.0);
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

      // Update particle drift
      this.particles.material.uniforms.time.value = elapsed;

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
   * Update camera based on scroll progress (0-1)
   */
  update(progress) {
    this.scrollProgress = Math.max(0, Math.min(1, progress));
    const { position, target } = interpolateKeyframes(this.scrollProgress);
    this.camera.position.copy(position);
    this.camera.lookAt(target);
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
