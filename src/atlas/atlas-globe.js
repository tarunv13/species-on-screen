/*
  Living Atlas — dreamy globe.
  ----------------------------
  A self-contained Three.js widget: a slowly drifting blue-marble
  planet that serves as the entry surface for the Atlas. Unlike the
  cinematic homepage globe (src/globe.js), this one is NOT reduced to
  a single anchor — the Atlas is a research-surface experience and is
  allowed to present every documented habitat as an entry point.

  Responsibilities are deliberately narrow:
    - render the planet + atmosphere + soft points at each habitat
    - rotate gently (ambient drift, with a faint cursor bias)
    - each frame, project every habitat's 3D position to 2D screen
      space and hand those positions to a callback, so the controller
      can place real, clickable glass DOM chips over the points.

  Patterns (camera/renderer/lights/texture/fallback/latLngToVector3)
  mirror src/globe.js and src/cinematic-engine.js, which are the
  proven, shipping implementations in this repo.
*/

import * as THREE from 'three';

const GLOBE_RADIUS = 1.5;
const POINT_RADIUS = 1.512;

function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

export class AtlasGlobe {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{lat:number,lng:number}} [opts]
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.points = [];          // { id, base: Vector3, mesh: Mesh }
    this._frameCbs = [];
    this._mouse = new THREE.Vector2(0, 0);
    this._hovering = false;
    this._raf = null;
    this._disposed = false;

    this._initRenderer();
    this._initScene();
    this._initGlobe();
    this._bindInput();
    this._startLoop();
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true, // transparent so the CSS mesh-gradient shows behind
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
  }

  _initScene() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0.35, 4.4);
    this.camera.lookAt(0, 0, 0);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const dir = new THREE.DirectionalLight(0xfff3e0, 1.05);
    dir.position.set(5, 3, 5);
    this.scene.add(dir);

    this.group = new THREE.Group();
    this.scene.add(this.group);
  }

  _initGlobe() {
    const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 128, 128);
    const material = new THREE.MeshStandardMaterial({
      color: 0x2a4a6a,
      roughness: 0.85,
      metalness: 0.05,
    });
    this.sphere = new THREE.Mesh(geometry, material);
    this.group.add(this.sphere);

    // Best-effort texture; the solid colour above is the graceful
    // fallback if the network (or the host) refuses the image.
    new THREE.TextureLoader().load(
      'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
      (texture) => {
        if (this._disposed) { texture.dispose(); return; }
        material.map = texture;
        material.color = new THREE.Color(0xffffff);
        material.needsUpdate = true;
      },
      undefined,
      () => { /* keep the solid-colour fallback */ }
    );

    // Soft dawn-rim atmosphere (same shader idea as src/globe.js).
    const atmosGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.06, 64, 64);
    const atmosMaterial = new THREE.ShaderMaterial({
      vertexShader:
        'varying vec3 vNormal; void main(){ vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader:
        'varying vec3 vNormal; void main(){ float i = pow(0.62 - dot(vNormal, vec3(0.0,0.0,1.0)), 3.0); gl_FragColor = vec4(0.62,0.70,0.90, i*0.5); }',
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    this.atmosphere = new THREE.Mesh(atmosGeometry, atmosMaterial);
    this.group.add(this.atmosphere);
  }

  /**
   * Register habitat entry points.
   * @param {Array<{id:string, lat:number, lng:number}>} list
   */
  addPoints(list) {
    const discGeo = new THREE.CircleGeometry(0.02, 20);
    list.forEach((p) => {
      if (!Number.isFinite(p.lat) || !Number.isFinite(p.lng)) return;
      const base = latLngToVector3(p.lat, p.lng, POINT_RADIUS);
      const normal = base.clone().normalize();
      const mat = new THREE.MeshBasicMaterial({
        color: 0xeaf2ff,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(discGeo.clone(), mat);
      mesh.position.copy(base);
      mesh.lookAt(base.clone().add(normal));
      this.group.add(mesh);
      this.points.push({ id: p.id, base, mesh });
    });
  }

  /**
   * Project every registered point to screen space. Mirrors
   * src/globe.js#getScreenPositions: a point is `visible` when it is
   * on the camera-facing hemisphere.
   * @returns {Array<{id:string, x:number, y:number, visible:boolean}>}
   */
  getScreenPositions() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.group.updateMatrixWorld();
    const camDir = new THREE.Vector3();
    this.camera.getWorldDirection(camDir);

    return this.points.map(({ id, base }) => {
      const world = base.clone().applyMatrix4(this.group.matrixWorld);
      const normal = world.clone().normalize();
      const facing = normal.dot(camDir) < 0.15; // toward camera
      const projected = world.clone().project(this.camera);
      return {
        id,
        x: (projected.x * 0.5 + 0.5) * width,
        y: (-projected.y * 0.5 + 0.5) * height,
        visible: facing && projected.z < 1,
      };
    });
  }

  /** Register a per-frame callback receiving projected positions. */
  onFrame(cb) {
    this._frameCbs.push(cb);
  }

  _bindInput() {
    this._onMove = (e) => {
      this._hovering = true;
      this._mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    };
    this._onLeave = () => { this._hovering = false; };
    window.addEventListener('mousemove', this._onMove, { passive: true });
    window.addEventListener('mouseout', this._onLeave, { passive: true });
  }

  _startLoop() {
    const AMBIENT = 0.0006;   // ~1 rev / ~3 min
    const BIAS = 0.0016;
    const tick = () => {
      if (this._disposed) return;
      this._raf = requestAnimationFrame(tick);
      const bias = this._hovering ? this._mouse.x * BIAS : 0;
      this.group.rotation.y += AMBIENT + bias;
      this.renderer.render(this.scene, this.camera);
      if (this._frameCbs.length) {
        const positions = this.getScreenPositions();
        for (const cb of this._frameCbs) cb(positions);
      }
    };
    tick();
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  dispose() {
    this._disposed = true;
    if (this._raf) cancelAnimationFrame(this._raf);
    window.removeEventListener('mousemove', this._onMove);
    window.removeEventListener('mouseout', this._onLeave);
    this.points.forEach(({ mesh }) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
    if (this.sphere) { this.sphere.geometry.dispose(); this.sphere.material.dispose(); }
    if (this.atmosphere) { this.atmosphere.geometry.dispose(); this.atmosphere.material.dispose(); }
    this.renderer.dispose();
  }
}
