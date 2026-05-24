import * as THREE from 'three';

// ----------------------------------------------------------------------------
// Procedural ripple normal map.
//
// Generated once at startup from FBM, evaluated as forward-difference
// derivatives, then encoded as an RGB tangent-space normal. Tile-able
// because the same FBM is sampled on a torus (wrapping the input
// coordinates through (sin, cos) at unit radius gives a seam-free 2D
// noise field for any rectangular sample grid).
//
// The amplitude is deliberately small. We are not trying to make a
// choppy lake; we are trying to give a still tannin channel the tiny
// surface texture that catches glints from canopy gaps. Without this
// the water reads as plastic.
// ----------------------------------------------------------------------------
function generateRippleNormalMap(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);

  const hash = (x, y) => {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const smooth = (x, y) => {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const u = fx * fx * (3 - 2 * fx);
    const v = fy * fy * (3 - 2 * fy);
    const a = hash(ix, iy);
    const b = hash(ix + 1, iy);
    const c = hash(ix, iy + 1);
    const d = hash(ix + 1, iy + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  // Tileable FBM by sampling a torus parameterisation.
  const torusFbm = (u, v) => {
    const ang1 = u * Math.PI * 2;
    const ang2 = v * Math.PI * 2;
    let val = 0;
    let amp = 1;
    let max = 0;
    let r = 4;
    for (let i = 0; i < 4; i++) {
      const x = Math.cos(ang1) * r;
      const y = Math.sin(ang1) * r;
      const z = Math.cos(ang2) * r;
      const w = Math.sin(ang2) * r;
      val += amp * smooth(x + z, y + w);
      max += amp;
      amp *= 0.5;
      r *= 2.0;
    }
    return val / max;
  };

  // Compute heights on a slightly larger grid than `size` so we can do
  // wrapped finite differences cleanly.
  const heights = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      // Two octave scales summed: a slow large-wave and a faster fine ripple.
      const slow = torusFbm(u, v);
      const fast = torusFbm(u * 3.0 + 0.13, v * 3.0 + 0.71);
      heights[y * size + x] = slow * 0.65 + fast * 0.35;
    }
  }

  const strength = 4.0; // visual normal-map strength
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const xL = (x - 1 + size) % size;
      const xR = (x + 1) % size;
      const yU = (y - 1 + size) % size;
      const yD = (y + 1) % size;
      const dx = heights[y * size + xR] - heights[y * size + xL];
      const dy = heights[yD * size + x] - heights[yU * size + x];
      // Tangent-space normal. Y is up in tangent space; X and Z come
      // from the height gradient.
      let nx = -dx * strength;
      let nz = -dy * strength;
      let ny = 1.0;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      nx /= len; ny /= len; nz /= len;

      const idx = (y * size + x) * 4;
      img.data[idx]     = Math.floor((nx * 0.5 + 0.5) * 255);
      img.data[idx + 1] = Math.floor((ny * 0.5 + 0.5) * 255);
      img.data[idx + 2] = Math.floor((nz * 0.5 + 0.5) * 255);
      img.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  // Normal maps are linear data, NOT colour data. Marking it so prevents
  // the renderer from applying sRGB->linear conversion that would
  // distort the encoded normals.
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

/**
 * Tannin-stained tidal water surface.
 *
 * Geometry:
 *   PlaneGeometry rotated to lie in XZ. Segment density tuned per device.
 *
 * Material:
 *   MeshStandardMaterial. Three things give it body:
 *
 *     1. Procedural ripple normal map (tile-able tangent-space normal,
 *        generated from torus-wrapped FBM derivatives). Repeats across
 *        the plane and scrolls slowly with the tide. This produces the
 *        tiny canopy-gap glints that signify "wet surface."
 *
 *     2. Tidal vertex displacement — sum of slow sines on the XZ plane
 *        drives a small Y offset. Geometric variation visible against
 *        the directional sun. One ambient motion (Principle XVIII).
 *
 *     3. World-position-keyed tannin albedo + leaf-litter overlay,
 *        injected via shader patch. Palette is lifted from the previous
 *        version so the surface is no longer crushed by ACES; tannin
 *        deep is now ~0.07 instead of 0.04.
 *
 *   Roughness 0.42 (was 0.55) — wet surface, accepts spec from env map
 *   and direct lights. Without env map (mobile), the lower roughness
 *   still produces visible sun glints through canopy alpha gaps.
 */
export class MangroveWater extends THREE.Mesh {
  constructor({ mobile = false } = {}) {
    const segs = mobile ? 48 : 96;
    const size = 400;
    const geometry = new THREE.PlaneGeometry(size, size, segs, segs);
    geometry.rotateX(-Math.PI / 2);

    const uniforms = {
      uTime: { value: 0 }
    };

    const rippleNormal = generateRippleNormalMap(mobile ? 256 : 512);
    rippleNormal.repeat.set(8, 8);

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.42,
      metalness: 0.0,
      normalMap: rippleNormal,
      normalScale: new THREE.Vector2(0.55, 0.55),
      envMapIntensity: 0.6,
      fog: true
    });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.uTime;

      // ---- Vertex shader patch: tidal displacement + world-pos varying ----
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
uniform float uTime;
varying vec3 vWorldPos_mangrove;`
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
{
  float wx = position.x;
  float wz = position.z;
  // Slightly larger amplitudes than the first pass — still gentle, but
  // now the surface visibly breathes against side-light. Sum is bounded
  // at ~0.07 units which keeps the plane physically calm.
  float a = sin(wx * 0.15 + uTime * 0.35) * 0.025;
  float b = sin(wz * 0.11 - uTime * 0.27 + 1.7) * 0.030;
  float c = sin((wx + wz) * 0.04 + uTime * 0.18) * 0.018;
  transformed.y += a + b + c;
}`
        )
        .replace(
          '#include <project_vertex>',
          `#include <project_vertex>
vWorldPos_mangrove = (modelMatrix * vec4(transformed, 1.0)).xyz;`
        );

      // ---- Fragment shader patch: lifted tannin palette + drifting litter ----
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
uniform float uTime;
varying vec3 vWorldPos_mangrove;

float mh_hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float mh_noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = mh_hash(i);
  float b = mh_hash(i + vec2(1.0, 0.0));
  float c = mh_hash(i + vec2(0.0, 1.0));
  float d = mh_hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float mh_fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    v += amp * mh_noise(p);
    p *= 2.07;
    amp *= 0.5;
  }
  return v;
}`
        )
        .replace(
          '#include <map_fragment>',
          `// Tannin water palette — lifted from the previous near-black values.
// Deep tannin still reads as deep amber-black after ACES, but is no
// longer crushed; mid-tannin now produces the warm body that
// communicates "stained but translucent" rather than "ink."
vec3 tanninDeep    = vec3(0.075, 0.052, 0.030);
vec3 tanninMid     = vec3(0.155, 0.105, 0.060);
vec3 tanninShallow = vec3(0.290, 0.205, 0.130);

// Slow-drifting leaf-litter mask. Direction matches the tidal sine
// phase so litter and water move as one body — Principle XVIII.
vec2 driftUv = vWorldPos_mangrove.xz * 0.18 + vec2(uTime * 0.05, uTime * 0.02);
float litter = mh_fbm(driftUv);
float litterMask = smoothstep(0.55, 0.78, litter);

// Larger-scale body mask — tannin pools thick vs thin. This is what
// makes the surface read as an aerial photograph of estuary water
// rather than as a uniform fill.
float bodyMask = mh_fbm(vWorldPos_mangrove.xz * 0.04 + vec2(11.0, 7.0));
float bodyT = smoothstep(0.30, 0.78, bodyMask);
vec3 waterBody = mix(tanninDeep, tanninShallow, bodyT);

// A medium-tannin band sits between deep and shallow — three-stop
// blend gives the surface the value variation that one-stop lacks.
float midBand = smoothstep(0.42, 0.62, bodyMask);
waterBody = mix(waterBody, tanninMid, midBand * 0.55);

// Leaf-litter colour: warm umber, more saturated than the water
// itself so it reads as floating organic matter.
vec3 litterColor = vec3(0.30, 0.21, 0.115);
vec3 surface = mix(waterBody, litterColor, litterMask * 0.65);

diffuseColor.rgb = surface;
`
        );
    };

    super(geometry, material);
    this.receiveShadow = true;
    this._uniforms = uniforms;
    this._normalMap = rippleNormal;
    this.renderOrder = 0;
  }

  /** Advance the tidal phase. delta is seconds since last frame. */
  update(delta) {
    this._uniforms.uTime.value += delta;
    // Slowly scroll the ripple normal map UVs in the same direction
    // as the litter drift, so the specular ripples track the tide.
    if (this._normalMap) {
      this._normalMap.offset.x += delta * 0.0042;
      this._normalMap.offset.y += delta * 0.0017;
    }
  }
}
