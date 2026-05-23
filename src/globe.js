import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Three.js interactive globe - a peaceful, contemplative Earth.
 * Procedural coloring with atmosphere glow and biodiversity hotspot markers.
 */

// Biodiversity hotspot locations [lat, lng, name, color] - 31 locations across 10 species
const HOTSPOTS = [
  // Tiger - Tropical Forest
  { lat: 21.9, lng: 89.2, name: 'Sundarbans (Tiger)', color: '#a8c5a0' },
  { lat: 26.0, lng: 76.5, name: 'Ranthambore (Tiger)', color: '#a8c5a0' },
  { lat: -0.5, lng: 101.5, name: 'Sumatra (Tiger)', color: '#a8c5a0' },
  // Snow Leopard - Mountain
  { lat: 28.0, lng: 84.0, name: 'Himalayas (Snow Leopard)', color: '#e8e4f0' },
  { lat: 49.0, lng: 88.0, name: 'Altai Mountains (Snow Leopard)', color: '#e8e4f0' },
  { lat: 42.0, lng: 75.0, name: 'Tian Shan (Snow Leopard)', color: '#e8e4f0' },
  // Orangutan - Tropical Forest
  { lat: 1.0, lng: 114.0, name: 'Borneo (Orangutan)', color: '#a8c5a0' },
  { lat: 2.5, lng: 98.5, name: 'Sumatra (Orangutan)', color: '#a8c5a0' },
  // Hawksbill Turtle - Coral Reef
  { lat: 18.0, lng: -64.0, name: 'Caribbean (Hawksbill Turtle)', color: '#8ecae6' },
  { lat: -18.3, lng: 147.7, name: 'Great Barrier Reef (Hawksbill Turtle)', color: '#8ecae6' },
  { lat: 22.0, lng: 38.0, name: 'Red Sea (Hawksbill Turtle)', color: '#8ecae6' },
  // Blue Whale - Ocean
  { lat: -65.0, lng: -60.0, name: 'Antarctic (Blue Whale)', color: '#8ecae6' },
  { lat: 34.0, lng: -120.0, name: 'California Coast (Blue Whale)', color: '#8ecae6' },
  { lat: 7.0, lng: 80.0, name: 'Sri Lanka (Blue Whale)', color: '#8ecae6' },
  // African Elephant - Savanna
  { lat: -2.5, lng: 34.8, name: 'Serengeti (African Elephant)', color: '#d4a574' },
  { lat: -24.0, lng: 31.5, name: 'Kruger (African Elephant)', color: '#d4a574' },
  { lat: 0.5, lng: 22.0, name: 'Congo Basin (African Elephant)', color: '#d4a574' },
  { lat: -2.6, lng: 37.2, name: 'Amboseli (African Elephant)', color: '#d4a574' },
  // Polar Bear - Arctic
  { lat: 78.0, lng: 16.0, name: 'Svalbard (Polar Bear)', color: '#e8e4f0' },
  { lat: 58.7, lng: -94.2, name: 'Churchill (Polar Bear)', color: '#e8e4f0' },
  { lat: 71.0, lng: -179.5, name: 'Wrangel Island (Polar Bear)', color: '#e8e4f0' },
  // Giant Panda - Temperate Forest
  { lat: 31.0, lng: 103.5, name: 'Sichuan (Giant Panda)', color: '#a8c5a0' },
  { lat: 33.5, lng: 107.5, name: 'Qinling (Giant Panda)', color: '#a8c5a0' },
  // Staghorn Coral - Coral Reef
  { lat: 24.5, lng: -81.5, name: 'Florida Keys (Staghorn Coral)', color: '#8ecae6' },
  { lat: 16.8, lng: -88.0, name: 'Belize (Staghorn Coral)', color: '#8ecae6' },
  { lat: 24.0, lng: -76.0, name: 'Bahamas (Staghorn Coral)', color: '#8ecae6' },
  // Amazon River Dolphin - Freshwater
  { lat: -3.4, lng: -60.0, name: 'Amazon (River Dolphin)', color: '#8ecae6' },
  { lat: 6.0, lng: -67.0, name: 'Orinoco (River Dolphin)', color: '#8ecae6' },
  { lat: -3.0, lng: -49.5, name: 'Tocantins (River Dolphin)', color: '#8ecae6' },
];

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
 * Create glowing hotspot markers
 */
function createMarkers() {
  const group = new THREE.Group();

  HOTSPOTS.forEach((hotspot) => {
    const position = latLngToVector3(hotspot.lat, hotspot.lng, 1.02);

    const geometry = new THREE.SphereGeometry(0.02, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(hotspot.color),
      transparent: true,
      opacity: 0.9,
    });

    const marker = new THREE.Mesh(geometry, material);
    marker.position.copy(position);
    marker.userData = { name: hotspot.name, baseOpacity: 0.9 };
    group.add(marker);

    // Add a slightly larger glow sphere around the marker
    const glowGeometry = new THREE.SphereGeometry(0.04, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(hotspot.color),
      transparent: true,
      opacity: 0.25,
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
        const pulse = 0.7 + Math.sin(time * 2 + i) * 0.3;
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
