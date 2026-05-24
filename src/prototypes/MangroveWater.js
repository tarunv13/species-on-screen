import * as THREE from 'three';

/**
 * Tannin-stained tidal water surface.
 *
 * Geometry:
 *   PlaneGeometry, rotated to lie in XZ. Segments tuned per device. The
 *   segmentation is what allows the tidal vertex displacement to read as
 *   a slow surface undulation rather than a uniform plane lift.
 *
 * Material:
 *   MeshStandardMaterial (so fog and shadows just work) with three shader
 *   patches injected via `onBeforeCompile`:
 *
 *     1. Tidal vertex displacement — sum of two slow sine fields on the
 *        XZ plane drives a small Y offset. One ambient motion only,
 *        per Principle XVIII. Amplitude is small (~0.03 units) — this is
 *        a humid still channel at slack tide, not surf.
 *
 *     2. World-position varying — written from the displaced vertex so
 *        the fragment shader can sample world-space coordinates against
 *        a slow-scrolling leaf-litter mask, giving the surface a sense of
 *        flow direction even where the geometry is nominally flat.
 *
 *     3. Tannin albedo + leaf-litter overlay — replaces the diffuse map
 *        block with a deep amber-black base, modulated by a procedural
 *        FBM mask that reads as floating leaf litter. The mask scrolls
 *        with the same `uTime` as the tidal sines, so the litter drifts
 *        with the tide rather than independently of it.
 *
 * The water colour is deliberately desaturated and dark. Tannin water is
 * not turquoise; it is the colour of strong tea. Article VII binds the
 * biome palette to documentary register, not to tropical-postcard.
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

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.55,
      metalness: 0.0,
      fog: true
    });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.uTime;

      // ---- Vertex shader patch ----
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
uniform float uTime;
varying vec3 vWorldPos_mangrove;`
        )
        // Inject tidal displacement *before* normals are derived so the
        // standard normal pipeline still produces sensible shading.
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
{
  // World-XZ derived from object-space position — the plane was rotated
  // into XZ at construction, so position.x maps to world X and position.z
  // maps to world Z (negated; harmless for the sine field).
  float wx = position.x;
  float wz = position.z;
  float a = sin(wx * 0.15 + uTime * 0.35) * 0.018;
  float b = sin(wz * 0.11 - uTime * 0.27 + 1.7) * 0.022;
  // A slow cross-field, lower frequency, gives the surface a body.
  float c = sin((wx + wz) * 0.04 + uTime * 0.18) * 0.012;
  transformed.y += a + b + c;
}`
        )
        .replace(
          '#include <project_vertex>',
          `#include <project_vertex>
vWorldPos_mangrove = (modelMatrix * vec4(transformed, 1.0)).xyz;`
        );

      // ---- Fragment shader patch ----
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
uniform float uTime;
varying vec3 vWorldPos_mangrove;

// Cheap value-noise / FBM in the fragment shader. Five octaves is
// enough to produce believable leaf-litter clumping without
// dominating the GPU.
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
          `// Tannin water base. Deep amber-black, very low saturation —
// the colour of strong tea, not the colour of a swimming pool.
vec3 tanninDeep    = vec3(0.040, 0.028, 0.018);
vec3 tanninShallow = vec3(0.190, 0.135, 0.080);

// Slow-scrolling leaf-litter mask. The drift direction matches the
// tidal sine phase so litter and water move as one body — the
// single ambient motion that this biome is allowed (Principle XVIII).
vec2 driftUv = vWorldPos_mangrove.xz * 0.18 + vec2(uTime * 0.05, uTime * 0.02);
float litter = mh_fbm(driftUv);
float litterMask = smoothstep(0.55, 0.78, litter);

// A separate, larger-scale mask reads as where the tannin pools are
// thicker vs thinner — gives the surface a varied body even before
// the leaf litter sits on top.
float bodyMask = mh_fbm(vWorldPos_mangrove.xz * 0.04 + vec2(11.0, 7.0));

vec3 waterBody = mix(tanninDeep, tanninShallow, smoothstep(0.35, 0.75, bodyMask));

// Leaf-litter colour: warm umber, slightly more saturated than the
// water itself but still desaturated.
vec3 litterColor = vec3(0.22, 0.16, 0.09);
vec3 surface = mix(waterBody, litterColor, litterMask * 0.65);

diffuseColor.rgb = surface;
`
        );
    };

    super(geometry, material);
    this.receiveShadow = true;
    this._uniforms = uniforms;
    this.renderOrder = 0;
  }

  /** Advance the tidal phase. delta is seconds since last frame. */
  update(delta) {
    this._uniforms.uTime.value += delta;
  }
}
