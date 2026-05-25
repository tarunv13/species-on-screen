import * as THREE from 'three';

// Final homepage reduction (post-§9.x): the planetary view carries one
// canonical anchor — Sundarbans, Bengal tiger — per the mangrove canonical
// spec (2026-05-25). The other nine species remain reachable as their own
// pages and as data files on disk; they are simply no longer the homepage's
// concern. A magazine cover shows one story.
const HOTSPOTS = [
  { lat: 21.9, lng: 89.2, name: 'Tiger', species: 'tiger', ecosystem: 'tropical-forest', color: '#4a7c59' },
];

const SPECIES_FILES = [
  'tiger',
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
    this._dataLoadPromise = this._loadMediaCounts();
  }

  /**
   * Resolves once species data fetching has settled (success or partial failure).
   * @returns {Promise<{loaded: string[], failed: {slug: string, reason: string}[]}>}
   */
  whenDataLoaded() {
    return this._dataLoadPromise;
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
      fragmentShader: `varying vec3 vNormal; void main() { float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0); gl_FragColor = vec4(0.55, 0.50, 0.42, intensity * 0.35); }`,
      blending: THREE.NormalBlending, side: THREE.BackSide, transparent: true, depthWrite: false,
    });
    this.atmosphere = new THREE.Mesh(atmosGeometry, atmosMaterial);
    this.group.add(this.atmosphere);
  }

  _createColumns() {
    // Audit §9.4: marker is a small disc at the surface, no height encoding,
    // single low-alpha luminance. The variable name `columnMeshes` is kept
    // to preserve the engine integration contract (raycast targets, hover
    // index, dispose iteration) without a wider rename.
    //
    // Audit §9.x supplement: the bright RingGeometry halo (opacity 0.7)
    // that previously surrounded each disc is retired. With the disc
    // dropped to additive low-alpha in §9.4, the halo became visually
    // dominant — the disc read as the halo's interior, the halo read as
    // the marker. The hierarchy was inverted. The halo is gone; the disc
    // alone is the marker.
    const discGeometry = new THREE.CircleGeometry(0.025, 24);
    HOTSPOTS.forEach((hotspot, i) => {
      const basePos = latLngToVector3(hotspot.lat, hotspot.lng, 1.502);
      const normal = basePos.clone().normalize();
      const baseColor = new THREE.Color(hotspot.color);
      const discMaterial = new THREE.MeshBasicMaterial({
        color: baseColor.clone(),
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const column = new THREE.Mesh(discGeometry.clone(), discMaterial);
      column.position.copy(basePos);
      column.lookAt(basePos.clone().add(normal));
      column.userData = {
        hotspotIndex: i,
        species: hotspot.species,
        name: hotspot.name,
        // Hover lift target stored alongside rest colour so update() can
        // restore on exit without recomputing.
        restColor: baseColor.clone(),
      };
      this.group.add(column); this.columnMeshes.push(column);
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
    // Audit §6.4 deferral expired (perceptual review after §9.4):
    // with pulses, tooltips, and count-encoded columns gone, the
    // ~200 shimmering ecosystem sprites became the loudest motion
    // on the page. Continuous shimmer is exactly the attention-
    // extraction pattern Article 3 forbids.
    //
    // The method body is retired. The two fields it formerly set
    // (floraFaunaTime, floraFaunaMeshes) are kept as initialised
    // defaults so update() and dispose() iterate over an empty
    // array without further conditionals — preserving the engine
    // integration contract without restoring the noise.
    this.floraFaunaTime = 0;
    this.floraFaunaMeshes = [];
  }

  _createComingSoonMarkers() {
    // Audit §9.x supplement: the seven grey spheres marking
    // "coming soon" biomes (Galapagos, Madagascar, Yellowstone,
    // Congo, Himalayas, Great Barrier Reef, Barents Sea) are
    // retired. They were a roadmap signal — a marketing register
    // ("more product is being built") in editorial space. The
    // homepage now shows what exists; absence is not advertised.
    //
    // The comingSoonMeshes field is preserved as an empty array so
    // update()'s allTargets concatenation and dispose()'s iteration
    // stay unchanged. The COMING_SOON_HOTSPOTS module-level array
    // is left in place as data; this method simply does not consume
    // it. If the doctrine ever shifts to advertise upcoming biomes,
    // restoring the markers is a one-line change.
  }

  _setupDragRotate() {
    // Final reduction: drag-to-rotate is retired. The page presents; it
    // does not offer manipulation. The visitor's only verb is `enter` —
    // a single click on the page-caption into the species page.
    //
    // The contemplative middle ground replaces drag with a cursor-
    // presence drift bias in update() below: the planet's slow rotation
    // is faintly biased by where the cursor sits horizontally in the
    // frame, when the cursor is over the canvas. Discoverable, not
    // operable. The visitor's gaze is acknowledged; the planet is not
    // grabbable.
    //
    // The four pointer event listeners (pointerdown/move/up/leave) are
    // gone. The cursor never changes from the browser default. The
    // method is preserved as a no-op so any external lookup against it
    // does not throw; nothing in the engine integration contract calls
    // it post-construction.
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
    const allProtectedAreas = [];
    const loaded = [];
    const failed = [];

    const settled = await Promise.allSettled(
      SPECIES_FILES.map(async (slug) => {
        const res = await fetch(`${basePath}data/${slug}.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return { slug, data };
      })
    );

    settled.forEach((result, i) => {
      const slug = SPECIES_FILES[i];
      if (result.status === 'fulfilled') {
        const { data } = result.value;
        this.speciesDataCache[slug] = data;
        this.mediaCounts[slug] = data.tmdb_media ? data.tmdb_media.length : 0;
        if (data.globe_layers && data.globe_layers.protected_areas) {
          data.globe_layers.protected_areas.forEach((area) => {
            allProtectedAreas.push({ ...area, species: slug });
          });
        }
        loaded.push(slug);
      } else {
        this.mediaCounts[slug] = 0;
        const reason = result.reason && result.reason.message
          ? result.reason.message
          : String(result.reason);
        failed.push({ slug, reason });
        // eslint-disable-next-line no-console
        console.warn(`[globe] Species data unavailable: ${slug} (${reason}). Hotspot retained, card skipped.`);
      }
    });

    this._updateColumnHeights();
    this._createProtectedAreaMarkers(allProtectedAreas);

    return { loaded, failed };
  }

  _updateColumnHeights() {
    // Audit §9.4: column-as-bar-chart removed. Markers are uniform discs;
    // height-encoding the media count is the doctrinal violation we're
    // retiring (Article XI). Method retained as a no-op so the data-load
    // pipeline call site does not need a coordinated change.
  }

  update(/* delta */) {
    // Final reduction: the planet has one motion source — ambient drift —
    // and one acknowledgement of the visitor — a small bias on that drift,
    // proportional to the cursor's horizontal position in the frame, when
    // the cursor is over the canvas.
    //
    // At rest (no cursor present), drift is AMBIENT_DRIFT (~one revolution
    // per ~6 minutes). When the cursor is over the canvas at the right
    // edge, the planet drifts about 7x faster eastward; at the left edge,
    // it drifts the same amount westward, briefly reversing direction.
    // There is no flick, no inertia, no velocity tracked from input. The
    // cursor's position is read each frame; it does not write velocity
    // state. Release the cursor, leave the canvas, and the bias decays to
    // zero on the next frame — the planet returns to ambient drift with
    // no easing, because there is no momentum to ease.
    //
    // This is the editorial middle: the page is observational, but the
    // planet acknowledges that you are present.
    const AMBIENT_DRIFT = 0.0003;
    const CURSOR_BIAS = 0.0018; // ±6x ambient at full pointer offset.
    const bias = this.isHovered ? this.mouse.x * CURSOR_BIAS : 0;
    this.group.rotation.y += AMBIENT_DRIFT + bias;

    // Latitude is locked at 0. The planet does not tilt with cursor Y;
    // doctrine calls for horizon, not roll. The post-§9.3 camera framing
    // (1.0, 0.3, 5.5) gives a slight downward gaze that already places the
    // northern hemisphere — including the Sundarbans — in the visible
    // half. No vertical interaction is needed or offered.
    //
    // The raycast / hover-acknowledgement / cursor-pointer machinery from
    // pre-final-reduction is retired. The disc on the planet is not the
    // navigation target — the page-caption (HTML, fixed position) is. The
    // canvas does not announce affordance; cursor stays at browser default.
  }

  dispose() {
    const domElement = this.renderer.domElement;
    domElement.removeEventListener('mousemove', this._onMouseMove);
    domElement.removeEventListener('mouseenter', this._onMouseEnter);
    domElement.removeEventListener('mouseleave', this._onMouseLeave);
    // Final reduction: drag-to-rotate's four pointer listeners
    // (pointerdown/move/up/leave) were retired with _setupDragRotate.
    // No removeEventListener is needed; the listeners were never added.
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
