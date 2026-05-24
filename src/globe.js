import * as THREE from 'three';

/**
 * Species hotspot data - 31 locations with lat/lng, species name, ecosystem type
 */
const HOTSPOTS = [
  // Tiger - Tropical Forest
  { lat: 21.9, lng: 89.2, name: 'Tiger', species: 'tiger', ecosystem: 'tropical-forest', color: '#4a7c59' },
  { lat: 26.0, lng: 76.5, name: 'Tiger', species: 'tiger', ecosystem: 'tropical-forest', color: '#4a7c59' },
  { lat: -0.5, lng: 101.5, name: 'Tiger', species: 'tiger', ecosystem: 'tropical-forest', color: '#4a7c59' },
  // Snow Leopard - Mountain
  { lat: 28.0, lng: 84.0, name: 'Snow Leopard', species: 'snow-leopard', ecosystem: 'mountain', color: '#e8e4f0' },
  { lat: 49.0, lng: 88.0, name: 'Snow Leopard', species: 'snow-leopard', ecosystem: 'mountain', color: '#e8e4f0' },
  { lat: 42.0, lng: 75.0, name: 'Snow Leopard', species: 'snow-leopard', ecosystem: 'mountain', color: '#e8e4f0' },
  // Orangutan - Tropical Forest
  { lat: 1.0, lng: 114.0, name: 'Bornean Orangutan', species: 'bornean-orangutan', ecosystem: 'tropical-forest', color: '#4a7c59' },
  { lat: 2.5, lng: 98.5, name: 'Bornean Orangutan', species: 'bornean-orangutan', ecosystem: 'tropical-forest', color: '#4a7c59' },
  // Hawksbill Turtle - Coral Reef
  { lat: 18.0, lng: -64.0, name: 'Hawksbill Turtle', species: 'hawksbill-turtle', ecosystem: 'coral-reef', color: '#1a4f6e' },
  { lat: -18.3, lng: 147.7, name: 'Hawksbill Turtle', species: 'hawksbill-turtle', ecosystem: 'coral-reef', color: '#1a4f6e' },
  { lat: 22.0, lng: 38.0, name: 'Hawksbill Turtle', species: 'hawksbill-turtle', ecosystem: 'coral-reef', color: '#1a4f6e' },
  // Blue Whale - Ocean
  { lat: -65.0, lng: -60.0, name: 'Blue Whale', species: 'blue-whale', ecosystem: 'ocean', color: '#1a4f6e' },
  { lat: 34.0, lng: -120.0, name: 'Blue Whale', species: 'blue-whale', ecosystem: 'ocean', color: '#1a4f6e' },
  { lat: 7.0, lng: 80.0, name: 'Blue Whale', species: 'blue-whale', ecosystem: 'ocean', color: '#1a4f6e' },
  // African Elephant - Savanna
  { lat: -2.5, lng: 34.8, name: 'African Elephant', species: 'african-elephant', ecosystem: 'savanna', color: '#c4842c' },
  { lat: -24.0, lng: 31.5, name: 'African Elephant', species: 'african-elephant', ecosystem: 'savanna', color: '#c4842c' },
  { lat: 0.5, lng: 22.0, name: 'African Elephant', species: 'african-elephant', ecosystem: 'savanna', color: '#c4842c' },
  { lat: -2.6, lng: 37.2, name: 'African Elephant', species: 'african-elephant', ecosystem: 'savanna', color: '#c4842c' },
  // Polar Bear - Arctic
  { lat: 78.0, lng: 16.0, name: 'Polar Bear', species: 'polar-bear', ecosystem: 'arctic', color: '#e8e4f0' },
  { lat: 58.7, lng: -94.2, name: 'Polar Bear', species: 'polar-bear', ecosystem: 'arctic', color: '#e8e4f0' },
  { lat: 71.0, lng: -179.5, name: 'Polar Bear', species: 'polar-bear', ecosystem: 'arctic', color: '#e8e4f0' },
  // Giant Panda - Temperate Forest
  { lat: 31.0, lng: 103.5, name: 'Giant Panda', species: 'giant-panda', ecosystem: 'temperate-forest', color: '#4a7c59' },
  { lat: 33.5, lng: 107.5, name: 'Giant Panda', species: 'giant-panda', ecosystem: 'temperate-forest', color: '#4a7c59' },
  // Staghorn Coral - Coral Reef
  { lat: 24.5, lng: -81.5, name: 'Staghorn Coral', species: 'staghorn-coral', ecosystem: 'coral-reef', color: '#1a4f6e' },
  { lat: 16.8, lng: -88.0, name: 'Staghorn Coral', species: 'staghorn-coral', ecosystem: 'coral-reef', color: '#1a4f6e' },
  { lat: 24.0, lng: -76.0, name: 'Staghorn Coral', species: 'staghorn-coral', ecosystem: 'coral-reef', color: '#1a4f6e' },
  // Amazon River Dolphin - Freshwater
  { lat: -3.4, lng: -60.0, name: 'Amazon River Dolphin', species: 'amazon-river-dolphin', ecosystem: 'freshwater', color: '#1a4f6e' },
  { lat: 6.0, lng: -67.0, name: 'Amazon River Dolphin', species: 'amazon-river-dolphin', ecosystem: 'freshwater', color: '#1a4f6e' },
  { lat: -3.0, lng: -49.5, name: 'Amazon River Dolphin', species: 'amazon-river-dolphin', ecosystem: 'freshwater', color: '#1a4f6e' },
];

// Species slug to data file map
const SPECIES_FILES = [
  'tiger', 'snow-leopard', 'bornean-orangutan', 'hawksbill-turtle',
  'blue-whale', 'african-elephant', 'polar-bear', 'giant-panda',
  'staghorn-coral', 'amazon-river-dolphin',
];

/**
 * Convert lat/lng to 3D position on sphere
 */
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

/**
 * Globe class - real Earth with data visualization columns
 */
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
    this.speciesDataCache = {};
    this.activeLayer = 'media';
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.hoveredIndex = -1;
    this.isHovered = false;
    this.autoRotateSpeed = 0.1;

    this._createGlobe();
    this._createColumns();
    this._createHabitatLayer();
    this._createFloraFauna();
    this._setupInteraction();
    this._loadMediaCounts();
  }

  _createGlobe() {
    // Main sphere with real Earth texture
    const geometry = new THREE.SphereGeometry(1.5, 128, 128);
    const textureLoader = new THREE.TextureLoader();

    const material = new THREE.MeshStandardMaterial({
      roughness: 0.8,
      metalness: 0.1,
    });
    this.sphere = new THREE.Mesh(geometry, material);
    this.group.add(this.sphere);

    textureLoader.load(
      'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
      (texture) => {
        material.map = texture;
        material.needsUpdate = true;
      },
      undefined,
      (err) => {
        console.warn('Globe texture failed to load, using fallback color:', err);
        material.color = new THREE.Color(0x4488aa);
        material.needsUpdate = true;
      }
    );

    // Atmosphere glow (soft light halo)
    const atmosGeometry = new THREE.SphereGeometry(1.58, 64, 64);
    const atmosMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          gl_FragColor = vec4(1.0, 0.98, 0.95, intensity * 0.3);
        }
      `,
      blending: THREE.NormalBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    this.atmosphere = new THREE.Mesh(atmosGeometry, atmosMaterial);
    this.group.add(this.atmosphere);
  }

  _createColumns() {
    const columnGeometry = new THREE.CylinderGeometry(0.015, 0.015, 1, 8);
    columnGeometry.translate(0, 0.5, 0); // pivot at base

    const ringGeometry = new THREE.RingGeometry(0.02, 0.04, 16);

    HOTSPOTS.forEach((hotspot, i) => {
      const basePos = latLngToVector3(hotspot.lat, hotspot.lng, 1.5);
      const normal = basePos.clone().normalize();

      // Default height (will be updated when media counts load)
      const height = 0.1;

      // Column with slightly transparent, brighter ecosystem colors
      const columnMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(hotspot.color),
        emissive: new THREE.Color(hotspot.color),
        emissiveIntensity: 0.5,
        metalness: 0.2,
        roughness: 0.5,
        transparent: true,
        opacity: 0.85,
      });
      const column = new THREE.Mesh(columnGeometry.clone(), columnMaterial);
      column.position.copy(basePos);
      column.scale.y = height;
      column.lookAt(basePos.clone().add(normal));
      column.rotateX(Math.PI / 2);
      column.userData = { hotspotIndex: i, species: hotspot.species, name: hotspot.name };
      this.group.add(column);
      this.columnMeshes.push(column);

      // Base ring - slightly more visible
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(hotspot.color),
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeometry.clone(), ringMaterial);
      ring.position.copy(basePos);
      ring.lookAt(basePos.clone().add(normal));
      this.group.add(ring);
    });
  }

  _createHabitatLayer() {
    const discGeometry = new THREE.CircleGeometry(0.06, 24);

    HOTSPOTS.forEach((hotspot) => {
      const basePos = latLngToVector3(hotspot.lat, hotspot.lng, 1.505);
      const normal = basePos.clone().normalize();

      const discMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(hotspot.color),
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const disc = new THREE.Mesh(discGeometry.clone(), discMaterial);
      disc.position.copy(basePos);
      disc.lookAt(basePos.clone().add(normal));
      disc.userData = { species: hotspot.species, name: hotspot.name };
      disc.visible = false;
      this.group.add(disc);
      this.habitatMeshes.push(disc);
    });
  }

  _createProtectedAreaMarkers(allProtectedAreas) {
    const sphereGeometry = new THREE.SphereGeometry(0.02, 12, 12);
    const markerMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6b35,
      emissive: 0xff6b35,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.9,
    });

    allProtectedAreas.forEach((area) => {
      const pos = latLngToVector3(area.lat, area.lng, 1.52);
      const marker = new THREE.Mesh(sphereGeometry.clone(), markerMaterial.clone());
      marker.position.copy(pos);
      marker.userData = { name: area.name, species: area.species, country: area.country };
      marker.visible = false;
      this.group.add(marker);
      this.protectedAreaMeshes.push(marker);
      this.protectedAreaData.push(area);
    });
  }

  setLayer(layerName) {
    this.activeLayer = layerName;

    // Hide all layer meshes
    this.columnMeshes.forEach(m => { m.visible = false; });
    this.habitatMeshes.forEach(m => { m.visible = false; });
    this.protectedAreaMeshes.forEach(m => { m.visible = false; });

    // Show selected layer
    if (layerName === 'media') {
      this.columnMeshes.forEach(m => { m.visible = true; });
    } else if (layerName === 'habitat') {
      this.habitatMeshes.forEach(m => { m.visible = true; });
    } else if (layerName === 'protected_areas') {
      this.protectedAreaMeshes.forEach(m => { m.visible = true; });
    }

    // Hide info panel on layer switch
    this._hideInfoPanel();
  }

  _showInfoPanel(speciesSlug, clickedName) {
    const panel = document.getElementById('globe-info-panel');
    if (!panel) return;

    const data = this.speciesDataCache[speciesSlug];
    const nameEl = panel.querySelector('.globe-info-panel__name');
    const statusEl = panel.querySelector('.globe-info-panel__status');
    const imgEl = panel.querySelector('.globe-info-panel__img');
    const exploreEl = panel.querySelector('.globe-info-panel__explore');

    nameEl.textContent = data ? (data.taxonomy?.common_name || clickedName) : clickedName;
    statusEl.textContent = data ? (data.conservation?.iucn_status || '') : '';

    if (data && data.photos && data.photos.length > 0) {
      imgEl.src = data.photos[0].url;
      imgEl.alt = data.photos[0].alt || clickedName;
      imgEl.style.display = '';
    } else {
      imgEl.style.display = 'none';
    }

    const basePath = import.meta.env.BASE_URL || '/';
    exploreEl.href = `${basePath}species/${speciesSlug}.html`;
    panel.style.display = 'flex';
  }

  _hideInfoPanel() {
    const panel = document.getElementById('globe-info-panel');
    if (panel) {
      panel.style.display = 'none';
    }
  }

  _createFloraFauna() {
    this.floraFaunaTime = 0;
    this.floraFaunaMeshes = [];

    // Group hotspots by ecosystem
    const ecosystems = {};
    HOTSPOTS.forEach(h => {
      if (!ecosystems[h.ecosystem]) ecosystems[h.ecosystem] = [];
      ecosystems[h.ecosystem].push(h);
    });

    // Sprite configs per ecosystem type - total capped at 200
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

      // Distribute sprites around hotspot locations
      for (let i = 0; i < count; i++) {
        const hotspot = hotspots[i % hotspots.length];
        const latOffset = (Math.random() - 0.5) * 10;
        const lngOffset = (Math.random() - 0.5) * 10;
        const radius = 1.55 + Math.random() * 0.1;
        const pos = latLngToVector3(hotspot.lat + latOffset, hotspot.lng + lngOffset, radius);

        positions[i * 3] = pos.x;
        positions[i * 3 + 1] = pos.y;
        positions[i * 3 + 2] = pos.z;
        seeds[i] = Math.random();
        sizes[i] = config.size * (0.7 + Math.random() * 0.6);
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('seed', new THREE.BufferAttribute(seeds, 1));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Vector3(...config.color) },
          speed: { value: config.speed },
        },
        vertexShader: `
          uniform float time;
          uniform float speed;
          attribute float seed;
          attribute float size;
          varying float vAlpha;

          void main() {
            vec3 pos = position;

            // Gentle sway using sine waves
            float offset = seed * 6.2831;
            pos.x += sin(time * speed + offset) * 0.03;
            pos.y += cos(time * 0.3 + offset * 1.5) * 0.02;
            pos.z += sin(time * 0.4 + offset * 0.7) * 0.02;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (200.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;

            // Alpha variation for organic pulsing
            vAlpha = 0.4 + 0.3 * sin(time * 0.2 + seed * 4.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          varying float vAlpha;

          void main() {
            // Soft circular falloff
            float dist = length(gl_PointCoord - vec2(0.5)) * 2.0;
            float alpha = smoothstep(1.0, 0.3, dist) * vAlpha;
            if (alpha < 0.01) discard;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });

      const points = new THREE.Points(geometry, material);
      this.group.add(points);
      this.floraFaunaMeshes.push(points);
    });
  }

  /**
   * Set a custom navigation handler for globe clicks (e.g. to use Barba.go)
   * @param {function} handler - receives the URL string
   */
  setNavigationHandler(handler) {
    this._navigationHandler = handler;
  }

  _setupInteraction() {
    const domElement = this.renderer.domElement;

    this._onMouseMove = (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    this._onClick = () => {
      if (this.hoveredIndex >= 0) {
        const hotspot = HOTSPOTS[this.hoveredIndex];
        this._showInfoPanel(hotspot.species, hotspot.name);
      } else if (this._hoveredProtectedArea >= 0) {
        const area = this.protectedAreaData[this._hoveredProtectedArea];
        this._showInfoPanel(area.species, area.name);
      } else if (this._hoveredHabitat >= 0) {
        const hotspot = HOTSPOTS[this._hoveredHabitat];
        this._showInfoPanel(hotspot.species, hotspot.name);
      }
    };

    this._onMouseEnter = () => {
      this.isHovered = true;
    };

    this._onMouseLeave = () => {
      this.isHovered = false;
      this.mouse.set(-999, -999);
    };

    domElement.addEventListener('mousemove', this._onMouseMove);
    domElement.addEventListener('click', this._onClick);
    domElement.addEventListener('mouseenter', this._onMouseEnter);
    domElement.addEventListener('mouseleave', this._onMouseLeave);
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

          // Collect protected areas
          if (data.globe_layers && data.globe_layers.protected_areas) {
            data.globe_layers.protected_areas.forEach((area) => {
              allProtectedAreas.push({ ...area, species: slug });
            });
          }

          return { slug, count };
        } catch {
          return { slug, count: 0 };
        }
      });

      const results = await Promise.all(promises);
      results.forEach(({ slug, count }) => {
        this.mediaCounts[slug] = count;
      });

      this._updateColumnHeights();
      this._createProtectedAreaMarkers(allProtectedAreas);
    } catch {
      // Fail silently - columns keep default height
    }
  }

  _updateColumnHeights() {
    const maxCount = Math.max(1, ...Object.values(this.mediaCounts));

    this.columnMeshes.forEach((column, i) => {
      const hotspot = HOTSPOTS[i];
      const count = this.mediaCounts[hotspot.species] || 0;
      // Scale height between 0.05 and 0.4
      const height = 0.05 + (count / maxCount) * 0.35;
      column.scale.y = height;
    });
  }

  /**
   * Update loop - call every frame
   */
  update(delta) {
    // Auto-rotation (pauses on hover)
    if (!this.isHovered) {
      this.group.rotation.y += this.autoRotateSpeed * delta;
    }

    // Update flora/fauna time uniform
    this.floraFaunaTime += delta;
    this.floraFaunaMeshes.forEach(mesh => {
      mesh.material.uniforms.time.value = this.floraFaunaTime;
    });

    // Pulsing animation for protected area markers
    if (this.activeLayer === 'protected_areas') {
      this.protectedAreaMeshes.forEach((marker, i) => {
        const scale = 1.0 + Math.sin(this.floraFaunaTime * 3 + i) * 0.3;
        marker.scale.setScalar(scale);
      });
    }

    // Raycasting for hover
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Determine which meshes to raycast against based on active layer
    let raycastTargets = [];
    if (this.activeLayer === 'media') {
      raycastTargets = this.columnMeshes;
    } else if (this.activeLayer === 'habitat') {
      raycastTargets = this.habitatMeshes;
    } else if (this.activeLayer === 'protected_areas') {
      raycastTargets = this.protectedAreaMeshes;
    }

    const intersects = this.raycaster.intersectObjects(raycastTargets);
    const tooltip = document.getElementById('globe-tooltip');
    const prevHovered = this.hoveredIndex;
    const prevHoveredPA = this._hoveredProtectedArea;
    const prevHoveredHab = this._hoveredHabitat;

    this._hoveredProtectedArea = -1;
    this._hoveredHabitat = -1;

    if (intersects.length > 0) {
      const hit = intersects[0].object;

      if (this.activeLayer === 'media') {
        const idx = hit.userData.hotspotIndex;
        this.hoveredIndex = idx;

        if (tooltip) {
          tooltip.textContent = hit.userData.name;
          tooltip.style.opacity = '1';
          const rect = this.renderer.domElement.getBoundingClientRect();
          const x = ((this.mouse.x + 1) / 2) * rect.width;
          const y = ((1 - this.mouse.y) / 2) * rect.height;
          tooltip.style.left = `${x + 15}px`;
          tooltip.style.top = `${y - 10}px`;
        }

        if (prevHovered !== idx) {
          if (prevHovered >= 0 && this.columnMeshes[prevHovered]) {
            this.columnMeshes[prevHovered].material.emissiveIntensity = 0.5;
          }
          hit.material.emissiveIntensity = 1.0;
        }
        this.renderer.domElement.style.cursor = 'pointer';

      } else if (this.activeLayer === 'habitat') {
        const idx = this.habitatMeshes.indexOf(hit);
        this._hoveredHabitat = idx;
        this.hoveredIndex = -1;

        if (tooltip) {
          tooltip.textContent = hit.userData.name;
          tooltip.style.opacity = '1';
          const rect = this.renderer.domElement.getBoundingClientRect();
          const x = ((this.mouse.x + 1) / 2) * rect.width;
          const y = ((1 - this.mouse.y) / 2) * rect.height;
          tooltip.style.left = `${x + 15}px`;
          tooltip.style.top = `${y - 10}px`;
        }
        this.renderer.domElement.style.cursor = 'pointer';

      } else if (this.activeLayer === 'protected_areas') {
        const idx = this.protectedAreaMeshes.indexOf(hit);
        this._hoveredProtectedArea = idx;
        this.hoveredIndex = -1;

        if (tooltip) {
          const area = this.protectedAreaData[idx];
          tooltip.textContent = area ? `${area.name} (${area.country})` : '';
          tooltip.style.opacity = '1';
          const rect = this.renderer.domElement.getBoundingClientRect();
          const x = ((this.mouse.x + 1) / 2) * rect.width;
          const y = ((1 - this.mouse.y) / 2) * rect.height;
          tooltip.style.left = `${x + 15}px`;
          tooltip.style.top = `${y - 10}px`;
        }
        this.renderer.domElement.style.cursor = 'pointer';
      }
    } else {
      this.hoveredIndex = -1;
      if (tooltip) {
        tooltip.style.opacity = '0';
      }
      if (prevHovered >= 0 && this.columnMeshes[prevHovered]) {
        this.columnMeshes[prevHovered].material.emissiveIntensity = 0.5;
      }
      this.renderer.domElement.style.cursor = '';
    }
  }

  /**
   * Dispose - remove event listeners, dispose geometries and materials, remove tooltip
   */
  dispose() {
    const domElement = this.renderer.domElement;
    domElement.removeEventListener('mousemove', this._onMouseMove);
    domElement.removeEventListener('click', this._onClick);
    domElement.removeEventListener('mouseenter', this._onMouseEnter);
    domElement.removeEventListener('mouseleave', this._onMouseLeave);

    // Dispose column meshes
    this.columnMeshes.forEach((column) => {
      column.geometry.dispose();
      column.material.dispose();
    });

    // Dispose habitat meshes
    this.habitatMeshes.forEach((disc) => {
      disc.geometry.dispose();
      disc.material.dispose();
    });

    // Dispose protected area meshes
    this.protectedAreaMeshes.forEach((marker) => {
      marker.geometry.dispose();
      marker.material.dispose();
    });

    // Dispose flora/fauna meshes
    this.floraFaunaMeshes.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });

    // Dispose globe sphere and atmosphere
    if (this.sphere) {
      this.sphere.geometry.dispose();
      this.sphere.material.dispose();
    }
    if (this.atmosphere) {
      this.atmosphere.geometry.dispose();
      this.atmosphere.material.dispose();
    }

    // Remove tooltip element
    const tooltip = document.getElementById('globe-tooltip');
    if (tooltip && tooltip.parentNode) {
      tooltip.parentNode.removeChild(tooltip);
    }

    // Hide info panel
    this._hideInfoPanel();

    // Remove group from scene
    this.scene.remove(this.group);
  }
}
