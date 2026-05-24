import * as THREE from 'three';
import { prefersReducedMotion } from './reduced-motion.js';

const HOTSPOTS = [
  { lat: 21.9, lng: 89.2, name: 'Tiger', species: 'tiger', ecosystem: 'tropical-forest', color: '#4a7c59' },
  { lat: 26.0, lng: 76.5, name: 'Tiger', species: 'tiger', ecosystem: 'tropical-forest', color: '#4a7c59' },
  { lat: -0.5, lng: 101.5, name: 'Tiger', species: 'tiger', ecosystem: 'tropical-forest', color: '#4a7c59' },
  { lat: 28.0, lng: 84.0, name: 'Snow Leopard', species: 'snow-leopard', ecosystem: 'mountain', color: '#e8e4f0' },
  { lat: 49.0, lng: 88.0, name: 'Snow Leopard', species: 'snow-leopard', ecosystem: 'mountain', color: '#e8e4f0' },
  { lat: 42.0, lng: 75.0, name: 'Snow Leopard', species: 'snow-leopard', ecosystem: 'mountain', color: '#e8e4f0' },
  { lat: 1.0, lng: 114.0, name: 'Bornean Orangutan', species: 'bornean-orangutan', ecosystem: 'tropical-forest', color: '#4a7c59' },
  { lat: 2.5, lng: 98.5, name: 'Bornean Orangutan', species: 'bornean-orangutan', ecosystem: 'tropical-forest', color: '#4a7c59' },
  { lat: 18.0, lng: -64.0, name: 'Hawksbill Turtle', species: 'hawksbill-turtle', ecosystem: 'coral-reef', color: '#1a4f6e' },
  { lat: -18.3, lng: 147.7, name: 'Hawksbill Turtle', species: 'hawksbill-turtle', ecosystem: 'coral-reef', color: '#1a4f6e' },
  { lat: 22.0, lng: 38.0, name: 'Hawksbill Turtle', species: 'hawksbill-turtle', ecosystem: 'coral-reef', color: '#1a4f6e' },
  { lat: -65.0, lng: -60.0, name: 'Blue Whale', species: 'blue-whale', ecosystem: 'ocean', color: '#1a4f6e' },
  { lat: 34.0, lng: -120.0, name: 'Blue Whale', species: 'blue-whale', ecosystem: 'ocean', color: '#1a4f6e' },
  { lat: 7.0, lng: 80.0, name: 'Blue Whale', species: 'blue-whale', ecosystem: 'ocean', color: '#1a4f6e' },
  { lat: -2.5, lng: 34.8, name: 'African Elephant', species: 'african-elephant', ecosystem: 'savanna', color: '#c4842c' },
  { lat: -24.0, lng: 31.5, name: 'African Elephant', species: 'african-elephant', ecosystem: 'savanna', color: '#c4842c' },
  { lat: 0.5, lng: 22.0, name: 'African Elephant', species: 'african-elephant', ecosystem: 'savanna', color: '#c4842c' },
  { lat: -2.6, lng: 37.2, name: 'African Elephant', species: 'african-elephant', ecosystem: 'savanna', color: '#c4842c' },
  { lat: 78.0, lng: 16.0, name: 'Polar Bear', species: 'polar-bear', ecosystem: 'arctic', color: '#e8e4f0' },
  { lat: 58.7, lng: -94.2, name: 'Polar Bear', species: 'polar-bear', ecosystem: 'arctic', color: '#e8e4f0' },
  { lat: 71.0, lng: -179.5, name: 'Polar Bear', species: 'polar-bear', ecosystem: 'arctic', color: '#e8e4f0' },
  { lat: 31.0, lng: 103.5, name: 'Giant Panda', species: 'giant-panda', ecosystem: 'temperate-forest', color: '#4a7c59' },
  { lat: 33.5, lng: 107.5, name: 'Giant Panda', species: 'giant-panda', ecosystem: 'temperate-forest', color: '#4a7c59' },
  { lat: 24.5, lng: -81.5, name: 'Staghorn Coral', species: 'staghorn-coral', ecosystem: 'coral-reef', color: '#1a4f6e' },
  { lat: 16.8, lng: -88.0, name: 'Staghorn Coral', species: 'staghorn-coral', ecosystem: 'coral-reef', color: '#1a4f6e' },
  { lat: 24.0, lng: -76.0, name: 'Staghorn Coral', species: 'staghorn-coral', ecosystem: 'coral-reef', color: '#1a4f6e' },
  { lat: -3.4, lng: -60.0, name: 'Amazon River Dolphin', species: 'amazon-river-dolphin', ecosystem: 'freshwater', color: '#1a4f6e' },
  { lat: 6.0, lng: -67.0, name: 'Amazon River Dolphin', species: 'amazon-river-dolphin', ecosystem: 'freshwater', color: '#1a4f6e' },
  { lat: -3.0, lng: -49.5, name: 'Amazon River Dolphin', species: 'amazon-river-dolphin', ecosystem: 'freshwater', color: '#1a4f6e' },
];

const SPECIES_FILES = [
  'tiger', 'snow-leopard', 'bornean-orangutan', 'hawksbill-turtle',
  'blue-whale', 'african-elephant', 'polar-bear', 'giant-panda',
  'staghorn-coral', 'amazon-river-dolphin',
];

const COMING_SOON_HOTSPOTS = [
  { lat: -0.95, lng: -91.0, name: 'Galapagos Islands' },
  { lat: -18.77, lng: 46.87, name: 'Madagascar' },
  { lat: 44.46, lng: -110.83, name: 'Yellowstone' },
  { lat: -4.0, lng: 21.75, name: 'Congo Basin' },
  { lat: 27.99, lng: 86.93, name: 'Himalayas' },
  { lat: -16.5, lng: 148.0, name: 'Great Barrier Reef' },
  { lat: 69.0, lng: 33.0, name: 'Barents Sea' },
];

function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

export class Globe {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.mediaCounts = {};
    this.columnMeshes = [];
    this.habitatMeshes = [];
    this.protectedAreaMeshes = [];
    this.protectedAreaData = [];
    this.comingSoonMeshes = [];
    this.speciesDataCache = {};
    this.activeLayer = 'media';
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.hoveredIndex = -1;
    this.isHovered = false;
    this._isDragging = false;
    this._prevPointer = { x: 0, y: 0 };
    this._velocity = { x: 0, y: 0 };
    this._damping = 0.95;
    this._createGlobe();
    this._createColumns();
    this._createHabitatLayer();
    this._createFloraFauna();
    this._createComingSoonMarkers();
    this._setupInteraction();
    this._setupDragRotate();
    this._loadMediaCounts();
  }

  _createGlobe() {
    const geometry = new THREE.SphereGeometry(1.5, 128, 128);
    const textureLoader = new THREE.TextureLoader();
    const material = new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0.1 });
    this.sphere = new THREE.Mesh(geometry, material);
    this.group.add(this.sphere);
    textureLoader.load(
      'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
      (texture) => { material.map = texture; material.needsUpdate = true; },
      undefined,
      () => { material.color = new THREE.Color(0x4488aa); material.needsUpdate = true; }
    );
    const atmosGeometry = new THREE.SphereGeometry(1.58, 64, 64);
    const atmosMaterial = new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `varying vec3 vNormal; void main() { float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0); gl_FragColor = vec4(0.4, 0.6, 1.0, intensity * 0.4); }`,
      blending: THREE.NormalBlending, side: THREE.BackSide, transparent: true, depthWrite: false,
    });
    this.atmosphere = new THREE.Mesh(atmosGeometry, atmosMaterial);
    this.group.add(this.atmosphere);
  }

  _createColumns() {
    const columnGeometry = new THREE.CylinderGeometry(0.015, 0.015, 1, 8);
    columnGeometry.translate(0, 0.5, 0);
    const ringGeometry = new THREE.RingGeometry(0.02, 0.04, 16);
    HOTSPOTS.forEach((hotspot, i) => {
      const basePos = latLngToVector3(hotspot.lat, hotspot.lng, 1.5);
      const normal = basePos.clone().normalize();
      const columnMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(hotspot.color), emissive: new THREE.Color(hotspot.color),
        emissiveIntensity: 0.5, metalness: 0.2, roughness: 0.5, transparent: true, opacity: 0.85,
      });
      const column = new THREE.Mesh(columnGeometry.clone(), columnMaterial);
      column.position.copy(basePos); column.scale.y = 0.1;
      column.lookAt(basePos.clone().add(normal)); column.rotateX(Math.PI / 2);
      column.userData = { hotspotIndex: i, species: hotspot.species, name: hotspot.name };
      this.group.add(column); this.columnMeshes.push(column);
      const ringMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(hotspot.color), transparent: true, opacity: 0.7, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeometry.clone(), ringMaterial);
      ring.position.copy(basePos); ring.lookAt(basePos.clone().add(normal));
      this.group.add(ring);
    });
  }

  _createHabitatLayer() {
    const discGeometry = new THREE.CircleGeometry(0.06, 24);
    HOTSPOTS.forEach((hotspot) => {
      const basePos = latLngToVector3(hotspot.lat, hotspot.lng, 1.505);
      const normal = basePos.clone().normalize();
      const discMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(hotspot.color), transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false });
      const disc = new THREE.Mesh(discGeometry.clone(), discMaterial);
      disc.position.copy(basePos); disc.lookAt(basePos.clone().add(normal));
      disc.userData = { species: hotspot.species, name: hotspot.name };
      disc.visible = false; this.group.add(disc); this.habitatMeshes.push(disc);
    });
  }

  _createProtectedAreaMarkers(allProtectedAreas) {
    const sphereGeometry = new THREE.SphereGeometry(0.02, 12, 12);
    const markerMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b35, emissive: 0xff6b35, emissiveIntensity: 0.6, transparent: true, opacity: 0.9 });
    allProtectedAreas.forEach((area) => {
      const pos = latLngToVector3(area.lat, area.lng, 1.52);
      const marker = new THREE.Mesh(sphereGeometry.clone(), markerMaterial.clone());
      marker.position.copy(pos);
      marker.userData = { name: area.name, species: area.species, country: area.country };
      marker.visible = false; this.group.add(marker);
      this.protectedAreaMeshes.push(marker); this.protectedAreaData.push(area);
    });
  }

  setLayer(layerName) {
    this.activeLayer = layerName;
    this.columnMeshes.forEach(m => { m.visible = false; });
    this.habitatMeshes.forEach(m => { m.visible = false; });
    this.protectedAreaMeshes.forEach(m => { m.visible = false; });
    if (layerName === 'media' || layerName === 'species') { this.columnMeshes.forEach(m => { m.visible = true; }); }
    else if (layerName === 'habitat') { this.habitatMeshes.forEach(m => { m.visible = true; }); }
    else if (layerName === 'protected_areas' || layerName === 'threats') { this.protectedAreaMeshes.forEach(m => { m.visible = true; }); }
  }

  _createFloraFauna() {
    this.floraFaunaTime = 0;
    this.floraFaunaMeshes = [];
    const ecosystems = {};
    HOTSPOTS.forEach(h => { if (!ecosystems[h.ecosystem]) ecosystems[h.ecosystem] = []; ecosystems[h.ecosystem].push(h); });
    const spriteConfigs = {
      'tropical-forest': { count: 30, color: [0.3, 0.7, 0.35], size: 4.0, speed: 0.5 },
      'mountain': { count: 25, color: [0.9, 0.92, 0.95], size: 3.0, speed: 0.4 },
      'coral-reef': { count: 25, color: [0.9, 0.45, 0.4], size: 3.5, speed: 0.6 },
      'ocean': { count: 25, color: [0.2, 0.5, 0.8], size: 3.0, speed: 0.3 },
      'savanna': { count: 25, color: [0.8, 0.7, 0.3], size: 3.0, speed: 0.5 },
      'arctic': { count: 25, color: [0.85, 0.9, 1.0], size: 2.5, speed: 0.3 },
      'temperate-forest': { count: 25, color: [0.35, 0.65, 0.3], size: 3.5, speed: 0.5 },
      'freshwater': { count: 20, color: [0.3, 0.6, 0.8], size: 3.0, speed: 0.6 },
    };
    Object.entries(ecosystems).forEach(([type, hotspots]) => {
      const config = spriteConfigs[type];
      if (!config) return;
      const count = config.count;
      const positions = new Float32Array(count * 3);
      const seeds = new Float32Array(count);
      const sizes = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const hotspot = hotspots[i % hotspots.length];
        const latOffset = (Math.random() - 0.5) * 10;
        const lngOffset = (Math.random() - 0.5) * 10;
        const radius = 1.55 + Math.random() * 0.1;
        const pos = latLngToVector3(hotspot.lat + latOffset, hotspot.lng + lngOffset, radius);
        positions[i * 3] = pos.x; positions[i * 3 + 1] = pos.y; positions[i * 3 + 2] = pos.z;
        seeds[i] = Math.random(); sizes[i] = config.size * (0.7 + Math.random() * 0.6);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('seed', new THREE.BufferAttribute(seeds, 1));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      const material = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 }, color: { value: new THREE.Vector3(...config.color) }, speed: { value: config.speed } },
        vertexShader: `uniform float time; uniform float speed; attribute float seed; attribute float size; varying float vAlpha; void main() { vec3 pos = position; float offset = seed * 6.2831; pos.x += sin(time * speed + offset) * 0.03; pos.y += cos(time * 0.3 + offset * 1.5) * 0.02; pos.z += sin(time * 0.4 + offset * 0.7) * 0.02; vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0); gl_PointSize = size * (200.0 / -mvPosition.z); gl_Position = projectionMatrix * mvPosition; vAlpha = 0.4 + 0.3 * sin(time * 0.2 + seed * 4.0); }`,
        fragmentShader: `uniform vec3 color; varying float vAlpha; void main() { float dist = length(gl_PointCoord - vec2(0.5)) * 2.0; float alpha = smoothstep(1.0, 0.3, dist) * vAlpha; if (alpha < 0.01) discard; gl_FragColor = vec4(color, alpha); }`,
        transparent: true, depthWrite: false, blending: THREE.NormalBlending,
      });
      const points = new THREE.Points(geometry, material);
      this.group.add(points); this.floraFaunaMeshes.push(points);
    });
  }

  _createComingSoonMarkers() {
    const sphereGeometry = new THREE.SphereGeometry(0.012, 10, 10);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.35 });
    COMING_SOON_HOTSPOTS.forEach((hotspot) => {
      const pos = latLngToVector3(hotspot.lat, hotspot.lng, 1.51);
      const marker = new THREE.Mesh(sphereGeometry.clone(), markerMaterial.clone());
      marker.position.copy(pos);
      marker.userData = { comingSoon: true, name: hotspot.name };
      this.group.add(marker);
      this.comingSoonMeshes.push(marker);
    });
  }

  _setupDragRotate() {
    const canvas = this.renderer.domElement;
    this._onPointerDown = (e) => { this._isDragging = true; this._prevPointer.x = e.clientX; this._prevPointer.y = e.clientY; this._velocity.x = 0; this._velocity.y = 0; };
    this._onPointerMove = (e) => {
      if (!this._isDragging) return;
      const dx = e.clientX - this._prevPointer.x; const dy = e.clientY - this._prevPointer.y;
      this._velocity.x = dx * 0.005; this._velocity.y = dy * 0.003;
      this.group.rotation.y += this._velocity.x; this.group.rotation.x += this._velocity.y;
      this.group.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.group.rotation.x));
      this._prevPointer.x = e.clientX; this._prevPointer.y = e.clientY;
    };
    this._onPointerUp = () => { this._isDragging = false; };
    canvas.addEventListener('pointerdown', this._onPointerDown);
    canvas.addEventListener('pointermove', this._onPointerMove);
    canvas.addEventListener('pointerup', this._onPointerUp);
    canvas.addEventListener('pointerleave', this._onPointerUp);
  }

  _setupInteraction() {
    const domElement = this.renderer.domElement;
    this._onMouseMove = (e) => { this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1; this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1; };
    this._onMouseEnter = () => { this.isHovered = true; };
    this._onMouseLeave = () => { this.isHovered = false; this.mouse.set(-999, -999); };
    domElement.addEventListener('mousemove', this._onMouseMove);
    domElement.addEventListener('mouseenter', this._onMouseEnter);
    domElement.addEventListener('mouseleave', this._onMouseLeave);
  }

  getScreenPositions(camera) {
    const uniqueSpecies = {};
    HOTSPOTS.forEach((h) => { if (!uniqueSpecies[h.species]) uniqueSpecies[h.species] = []; uniqueSpecies[h.species].push(h); });
    const results = [];
    const width = window.innerWidth; const height = window.innerHeight;
    this.group.updateMatrixWorld();
    Object.entries(uniqueSpecies).forEach(([slug, spots]) => {
      const avgPos = new THREE.Vector3();
      spots.forEach((s) => { avgPos.add(latLngToVector3(s.lat, s.lng, 1.5)); });
      avgPos.divideScalar(spots.length);
      const worldPos = avgPos.clone().applyMatrix4(this.group.matrixWorld);
      const camDir = new THREE.Vector3(); camera.getWorldDirection(camDir);
      const normal = worldPos.clone().normalize();
      const dot = normal.dot(camDir);
      const visible = dot > -0.2;
      const projected = worldPos.clone().project(camera);
      const screenX = (projected.x * 0.5 + 0.5) * width;
      const screenY = (-projected.y * 0.5 + 0.5) * height;
      const dist = worldPos.distanceTo(camera.position);
      const scale = Math.max(0.7, Math.min(1.3, 5.0 / dist));
      results.push({ species: slug, screenX, screenY, scale, visible, data: this.speciesDataCache[slug] });
    });
    return results;
  }

  getSpeciesPosition(slug) {
    const spots = HOTSPOTS.filter(h => h.species === slug);
    if (spots.length === 0) return new THREE.Vector3();
    const avg = new THREE.Vector3();
    spots.forEach((s) => { avg.add(latLngToVector3(s.lat, s.lng, 1.5)); });
    avg.divideScalar(spots.length);
    return avg;
  }

  async _loadMediaCounts() {
    const basePath = import.meta.env.BASE_URL || '/';
    try {
      const allProtectedAreas = [];
      const promises = SPECIES_FILES.map(async (slug) => {
        try {
          const res = await fetch(`${basePath}data/${slug}.json`);
          if (!res.ok) return { slug, count: 0 };
          const data = await res.json();
          this.speciesDataCache[slug] = data;
          const count = data.tmdb_media ? data.tmdb_media.length : 0;
          if (data.globe_layers && data.globe_layers.protected_areas) {
            data.globe_layers.protected_areas.forEach((area) => { allProtectedAreas.push({ ...area, species: slug }); });
          }
          return { slug, count };
        } catch { return { slug, count: 0 }; }
      });
      const results = await Promise.all(promises);
      results.forEach(({ slug, count }) => { this.mediaCounts[slug] = count; });
      this._updateColumnHeights();
      this._createProtectedAreaMarkers(allProtectedAreas);
    } catch { /* fail silently */ }
  }

  _updateColumnHeights() {
    const maxCount = Math.max(1, ...Object.values(this.mediaCounts));
    this.columnMeshes.forEach((column, i) => {
      const hotspot = HOTSPOTS[i];
      const count = this.mediaCounts[hotspot.species] || 0;
      column.scale.y = 0.05 + (count / maxCount) * 0.35;
    });
  }

  update(delta) {
    if (!this._isDragging) {
      this._velocity.x *= this._damping; this._velocity.y *= this._damping;
      this.group.rotation.y += this._velocity.x; this.group.rotation.x += this._velocity.y;
      this.group.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.group.rotation.x));
    }
    // Reduced-motion: hold floraFaunaTime at 0 so flora/fauna shaders
    // and marker pulses render their static t=0 frame. The shaders and
    // sin() expressions still execute (no branch in the render loop)
    // but with a frozen input, eliminating continuous orbital motion
    // while preserving the visual presence of all markers and motes.
    const reduced = prefersReducedMotion();
    if (!reduced) this.floraFaunaTime += delta;
    this.floraFaunaMeshes.forEach(mesh => { mesh.material.uniforms.time.value = this.floraFaunaTime; });
    if (this.activeLayer === 'protected_areas' || this.activeLayer === 'threats') {
      this.protectedAreaMeshes.forEach((marker, i) => {
        marker.scale.setScalar(reduced ? 1.0 : 1.0 + Math.sin(this.floraFaunaTime * 3 + i) * 0.3);
      });
    }
    this.comingSoonMeshes.forEach((marker, i) => {
      marker.scale.setScalar(reduced ? 1.0 : 1.0 + Math.sin(this.floraFaunaTime * 2 + i * 1.5) * 0.2);
    });
    this.raycaster.setFromCamera(this.mouse, this.camera);
    let raycastTargets = [];
    if (this.activeLayer === 'media' || this.activeLayer === 'species') raycastTargets = this.columnMeshes;
    else if (this.activeLayer === 'habitat') raycastTargets = this.habitatMeshes;
    else if (this.activeLayer === 'protected_areas' || this.activeLayer === 'threats') raycastTargets = this.protectedAreaMeshes;
    const allTargets = raycastTargets.concat(this.comingSoonMeshes);
    const intersects = this.raycaster.intersectObjects(allTargets);
    const tooltip = document.getElementById('globe-tooltip');
    const prevHovered = this.hoveredIndex;
    if (intersects.length > 0) {
      const hit = intersects[0].object;
      this.hoveredIndex = hit.userData.hotspotIndex !== undefined ? hit.userData.hotspotIndex : -1;
      if (tooltip) { const label = hit.userData.comingSoon ? `${hit.userData.name} - Coming Soon` : (hit.userData.name || ''); tooltip.textContent = label; tooltip.style.opacity = '1'; const rect = this.renderer.domElement.getBoundingClientRect(); const x = ((this.mouse.x + 1) / 2) * rect.width; const y = ((1 - this.mouse.y) / 2) * rect.height; tooltip.style.left = `${x + 15}px`; tooltip.style.top = `${y - 10}px`; }
      if (prevHovered !== this.hoveredIndex && prevHovered >= 0 && this.columnMeshes[prevHovered]) { this.columnMeshes[prevHovered].material.emissiveIntensity = 0.5; }
      if (hit.material && hit.material.emissiveIntensity !== undefined) hit.material.emissiveIntensity = 1.0;
      this.renderer.domElement.style.cursor = hit.userData.comingSoon ? 'default' : 'pointer';
    } else {
      this.hoveredIndex = -1;
      if (tooltip) tooltip.style.opacity = '0';
      if (prevHovered >= 0 && this.columnMeshes[prevHovered]) this.columnMeshes[prevHovered].material.emissiveIntensity = 0.5;
      this.renderer.domElement.style.cursor = 'grab';
    }
  }

  dispose() {
    const domElement = this.renderer.domElement;
    domElement.removeEventListener('mousemove', this._onMouseMove);
    domElement.removeEventListener('mouseenter', this._onMouseEnter);
    domElement.removeEventListener('mouseleave', this._onMouseLeave);
    domElement.removeEventListener('pointerdown', this._onPointerDown);
    domElement.removeEventListener('pointermove', this._onPointerMove);
    domElement.removeEventListener('pointerup', this._onPointerUp);
    domElement.removeEventListener('pointerleave', this._onPointerUp);
    this.columnMeshes.forEach((c) => { c.geometry.dispose(); c.material.dispose(); });
    this.habitatMeshes.forEach((d) => { d.geometry.dispose(); d.material.dispose(); });
    this.protectedAreaMeshes.forEach((m) => { m.geometry.dispose(); m.material.dispose(); });
    this.comingSoonMeshes.forEach((m) => { m.geometry.dispose(); m.material.dispose(); });
    this.floraFaunaMeshes.forEach((m) => { m.geometry.dispose(); m.material.dispose(); });
    if (this.sphere) { this.sphere.geometry.dispose(); this.sphere.material.dispose(); }
    if (this.atmosphere) { this.atmosphere.geometry.dispose(); this.atmosphere.material.dispose(); }
    this.scene.remove(this.group);
  }
}
