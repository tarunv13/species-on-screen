import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SPECIES } from './data/species-registry.js';

/**
 * Three.js interactive globe - a peaceful, contemplative Earth.
 * Procedural coloring with atmosphere glow and species location markers.
 * Markers are generated from ALL species coordinates in the registry.
 */

// Generate markers from all species coordinates
function generateHotspots() {
  const hotspots = [];
  SPECIES.forEach(species => {
    species.coordinates.forEach(coord => {
      hotspots.push({
        lat: coord.lat,
        lng: coord.lng,
        name: `${species.commonName} - ${coord.label}`,
        color: species.accentColor
      });
    });
  });
  return hotspots;
}

const HOTSPOTS = generateHotspots();

let renderer, scene, camera, controls, globe, atmosphere, markers;
let animationId = null;
let container = null;
let visibilityObserver = null;
let isVisible = false;

/**
 * Convert latitude/longitude to 3D position on sphere surface
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
 * Create a procedural Earth texture with soft gradients
 */
function createEarthTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Ocean gradient - soft blues
  const gradient = ctx.createLinearGradient(0, 0, 0, size);
  gradient.addColorStop(0, '#b8d4e3'); // pale blue at poles
  gradient.addColorStop(0.3, '#8ecae6'); // water blue
  gradient.addColorStop(0.5, '#7ec4cf'); // turquoise equator
  gradient.addColorStop(0.7, '#8ecae6');
  gradient.addColorStop(1, '#b8d4e3');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Add soft land-mass patches using simple ellipses
  ctx.globalAlpha = 0.35;
  const landColor = '#a8c5a0'; // forest green

  // Approximate continental shapes with soft ellipses
  const continents = [
    // Africa
    { x: 0.53, y: 0.45, w: 0.08, h: 0.18 },
    { x: 0.55, y: 0.35, w: 0.06, h: 0.08 },
    // Eurasia
    { x: 0.55, y: 0.28, w: 0.25, h: 0.08 },
    { x: 0.65, y: 0.32, w: 0.1, h: 0.1 },
    { x: 0.75, y: 0.3, w: 0.08, h: 0.06 },
    // Americas
    { x: 0.25, y: 0.3, w: 0.08, h: 0.12 },
    { x: 0.28, y: 0.2, w: 0.06, h: 0.1 },
    { x: 0.27, y: 0.5, w: 0.05, h: 0.15 },
    // Australia
    { x: 0.82, y: 0.55, w: 0.06, h: 0.05 },
    // Southeast Asia
    { x: 0.78, y: 0.4, w: 0.04, h: 0.06 },
  ];

  ctx.fillStyle = landColor;
  continents.forEach(({ x, y, w, h }) => {
    ctx.beginPath();
    ctx.ellipse(
      x * size,
      y * size,
      w * size * 0.5,
      h * size * 0.5,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });

  // Add some noise/texture variation
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 200; i++) {
    const px = Math.random() * size;
    const py = Math.random() * size;
    const pr = 2 + Math.random() * 8;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fillStyle = Math.random() > 0.5 ? '#a8c5a0' : '#8ecae6';
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Create the atmosphere glow - a rim-lit transparent sphere
 */
function createAtmosphere() {
  const geometry = new THREE.SphereGeometry(1.08, 64, 64);
  const material = new THREE.ShaderMaterial({
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
        float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
        gl_FragColor = vec4(0.56, 0.79, 0.9, intensity * 0.6);
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  });

  return new THREE.Mesh(geometry, material);
}

/**
 * Create glowing hotspot markers color-coded by species accent color
 */
function createMarkers() {
  const group = new THREE.Group();

  HOTSPOTS.forEach((hotspot) => {
    const position = latLngToVector3(hotspot.lat, hotspot.lng, 1.02);
    const color = new THREE.Color(hotspot.color);

    const geometry = new THREE.SphereGeometry(0.015, 12, 12);
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.9,
    });

    const marker = new THREE.Mesh(geometry, material);
    marker.position.copy(position);
    marker.userData = { name: hotspot.name, baseOpacity: 0.9 };
    group.add(marker);

    // Add a slightly larger glow sphere around the marker
    const glowGeometry = new THREE.SphereGeometry(0.03, 12, 12);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.2,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.copy(position);
    group.add(glow);
  });

  return group;
}

export function initGlobe() {
  container = document.getElementById('globe-container');
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.z = 3;

  // Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Globe
  const earthTexture = createEarthTexture();
  const globeGeometry = new THREE.SphereGeometry(1, 64, 64);
  const globeMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
    shininess: 15,
    specular: new THREE.Color('#ffffff'),
  });
  globe = new THREE.Mesh(globeGeometry, globeMaterial);
  scene.add(globe);

  // Atmosphere
  atmosphere = createAtmosphere();
  scene.add(atmosphere);

  // Markers
  markers = createMarkers();
  scene.add(markers);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  controls.minDistance = 2;
  controls.maxDistance = 5;
  controls.enablePan = false;

  // Resize handler
  window.addEventListener('resize', onResize);

  // Observe visibility - only render when the globe is on screen
  visibilityObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            animate();
          }
        } else {
          isVisible = false;
          if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
          }
        }
      }
    },
    { threshold: 0 }
  );
  visibilityObserver.observe(container);
}

function onResize() {
  if (!container || !camera || !renderer) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function animate() {
  if (!isVisible) return;
  animationId = requestAnimationFrame(animate);

  // Pulse markers
  const time = performance.now() * 0.001;
  if (markers) {
    markers.children.forEach((child, i) => {
      if (child.userData && child.userData.name) {
        const pulse = 0.7 + Math.sin(time * 2 + i * 0.3) * 0.3;
        child.material.opacity = child.userData.baseOpacity * pulse;
      }
    });
  }

  if (controls) controls.update();
  if (renderer && scene && camera) renderer.render(scene, camera);
}

export function destroyGlobe() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  if (visibilityObserver) {
    visibilityObserver.disconnect();
    visibilityObserver = null;
  }
  isVisible = false;
  if (renderer) {
    renderer.dispose();
    if (container && renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  }
  if (controls) controls.dispose();
  window.removeEventListener('resize', onResize);
}
