import * as THREE from 'three';

// ----------------------------------------------------------------------------
// 2D value-noise helpers (deterministic, dependency-free, runs once at startup)
// ----------------------------------------------------------------------------
function hash2(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function smoothNoise(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

// Ridged noise — sharp ridge crests, deep cuts. Mountains, not hills.
function ridged(x, y) {
  return 1 - Math.abs(smoothNoise(x, y) * 2 - 1);
}

function fbmRidged(x, y, octaves) {
  let value = 0;
  let amp = 1;
  let freq = 1;
  let max = 0;
  for (let i = 0; i < octaves; i++) {
    const r = ridged(x * freq, y * freq);
    value += amp * Math.pow(r, 1.4);
    max += amp;
    amp *= 0.5;
    freq *= 2.07;
  }
  return value / max;
}

function fbm(x, y, octaves) {
  let value = 0;
  let amp = 1;
  let freq = 1;
  let max = 0;
  for (let i = 0; i < octaves; i++) {
    value += amp * smoothNoise(x * freq, y * freq);
    max += amp;
    amp *= 0.5;
    freq *= 2.05;
  }
  return value / max;
}

/**
 * One 2km × 2km alpine heightfield.
 *
 * Geometry: PlaneGeometry rotated to lie in XZ, vertex Y displaced by
 * a ridged-FBM mix. Distant region (negative Z) is biased upward
 * to form the back range; the foreground (positive Z) is eased downward
 * so the camera reads a falling slope in the lower band of the frame.
 *
 * Material: MeshStandardMaterial (so fog and shadows just work) with
 * a shader patch that replaces the albedo using a slope-blended
 * snow/rock mix. A world-space normal varying is injected because the
 * default vNormal is in view space.
 */
export class Terrain extends THREE.Mesh {
  constructor({ mobile = false } = {}) {
    const segs = mobile ? 128 : 256;
    const size = 2000;
    const geometry = new THREE.PlaneGeometry(size, size, segs, segs);
    geometry.rotateX(-Math.PI / 2);

    const positions = geometry.attributes.position;
    const baseScale = 0.0028;
    const ridgeBias = 0.7;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);

      // Sharp ridges
      const r = fbmRidged(x * baseScale, z * baseScale, 6);
      // Soft underlying terrain (offset coords so the two layers don't align)
      const f = fbm((x + 350) * baseScale * 0.8, (z + 350) * baseScale * 0.8, 4);

      let height = r * ridgeBias + f * (1 - ridgeBias);

      // Push the back of the terrain higher (distant peaks)
      // z runs from -1000 (back) to +1000 (foreground)
      const back = Math.max(0, -z) / size; // 0..1
      height = height * (0.55 + 0.50 * back);

      // Asymmetric foreground: lower-right reads as a falling slope
      const foreEase = Math.max(0, z) / size; // 0..1
      const xRight = Math.max(0, x) / 1000;   // bias to the right
      height -= foreEase * (0.30 + 0.18 * xRight);

      // Floor so the deepest valleys aren't subterranean
      height = Math.max(height, -0.15);

      positions.setY(i, height * 1500);
    }

    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      roughness: 0.85,
      metalness: 0.0,
      color: 0xffffff
    });

    // Slope-blended albedo via shader patch.
    // Inject a world-space normal varying because vNormal is view-space.
    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
varying vec3 vWorldNormal_alpine;`
        )
        .replace(
          '#include <beginnormal_vertex>',
          `#include <beginnormal_vertex>
vWorldNormal_alpine = normalize(mat3(modelMatrix) * objectNormal);`
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
varying vec3 vWorldNormal_alpine;`
        )
        .replace(
          '#include <map_fragment>',
          `float slope = 1.0 - clamp(vWorldNormal_alpine.y, 0.0, 1.0);
vec3 snow = vec3(0.85, 0.86, 0.88);
vec3 rock = vec3(0.18, 0.16, 0.14);
vec3 alpineAlbedo = mix(snow, rock, smoothstep(0.32, 0.60, slope));
diffuseColor.rgb = alpineAlbedo;
`
        );
    };

    super(geometry, material);
    this.castShadow = true;
    this.receiveShadow = true;
  }
}
