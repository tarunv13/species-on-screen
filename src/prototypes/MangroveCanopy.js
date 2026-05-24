import * as THREE from 'three';

// ----------------------------------------------------------------------------
// Procedural canopy alpha texture (RGBA — dark green-brown leaf colour, with
// alpha mask of leaf clusters and gaps). Generated once at startup with FBM.
//
// Tuned distinct from the alpine cumulus generator:
//   - higher base frequency (smaller features → leaves, not clouds)
//   - harder edge curve (a leaf-cluster has a sharper boundary than a cumulus)
//   - target ~80% coverage (a closed canopy with occasional sky gaps), where
//     the alpine cumulus targeted ~30% coverage
//   - colour is dark green-brown, not white (the underside of a canopy in
//     filtered late-afternoon light)
// ----------------------------------------------------------------------------
function generateCanopyTexture(size) {
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
  const fbm = (x, y) => {
    let v = 0, amp = 1, freq = 1, max = 0;
    for (let i = 0; i < 5; i++) {
      v += amp * smooth(x * freq, y * freq);
      max += amp;
      amp *= 0.5;
      freq *= 2.13;
    }
    return v / max;
  };

  // Three sampled noise channels, then combined: large clumps + leaf detail
  // + colour variance. The biome palette never leaves desaturated greens
  // and warm umbers.
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;

      const clumps = fbm(u * 5.0, v * 5.0);          // slow leaf masses
      const detail = fbm(u * 18.0, v * 18.0);        // leaf-cluster grain
      const tint = fbm(u * 3.5 + 17, v * 3.5 + 9);  // colour drift

      // Coverage curve: bias toward closed canopy with occasional gaps.
      // The (clumps - 0.18) term carves the gaps; the detail term roughens
      // the cluster edges so they don't read as cut-out shapes.
      const mask = (clumps - 0.18) * 1.7 + (detail - 0.5) * 0.35;
      let alpha = Math.min(1.0, Math.max(0.0, mask + 0.15));
      // Steepen the leaf-edge curve slightly so alphaTest=0.5 makes
      // crisp-but-not-aliased leaf-pattern shadows.
      alpha = Math.pow(alpha, 0.85);

      // Colour: dark, desaturated green with warm-umber drift. The under-
      // side of a canopy in late filtered light is not a green tint; it
      // is mostly dark with warm bleed-through where the light hits.
      const warmth = tint;            // 0..1
      const r = 0.06 + warmth * 0.10; // 0.06..0.16
      const g = 0.08 + warmth * 0.08; // 0.08..0.16
      const b = 0.05 + warmth * 0.05; // 0.05..0.10

      const idx = (y * size + x) * 4;
      img.data[idx]     = Math.floor(r * 255);
      img.data[idx + 1] = Math.floor(g * 255);
      img.data[idx + 2] = Math.floor(b * 255);
      img.data[idx + 3] = Math.floor(alpha * 255);
    }
  }

  ctx.putImageData(img, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  // The texture is colour data, not linear data — let the renderer
  // interpret it in sRGB so the dark greens don't crush.
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Overhead canopy plane.
 *
 * A single horizontal plane suspended ~12 units above the water, draped in a
 * procedural leaf-alpha texture. Two roles:
 *
 * 1. Visible enclosure. When the camera tilts up or the eye reads above the
 *    horizon line, the canopy reads as a dark green-brown ceiling — there
 *    is no sky in this biome.
 *
 * 2. Light filtering. The canopy casts shadow into the directional sun
 *    light's shadow map, with `alphaTest` enforced. The leaf gaps become
 *    real shadow holes on the water plane below — dappled patches of warm
 *    light without volumetric godrays (Article V forbids the latter).
 *
 * `castShadow` is honoured by Three's default depth material because the
 * material has `alphaTest > 0` and a `map`; the depth pass discards the
 * same fragments the colour pass does.
 */
export class MangroveCanopy extends THREE.Mesh {
  constructor({ mobile = false } = {}) {
    const size = 80;
    const geometry = new THREE.PlaneGeometry(size, size, 4, 4);
    geometry.rotateX(Math.PI / 2); // face down, normal pointing −y

    const texture = generateCanopyTexture(mobile ? 256 : 512);
    // Tile the texture across the plane so leaf clusters read at a
    // believable angular size from a 1.4-unit eyeline.
    texture.repeat.set(4, 4);

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.5,
      side: THREE.DoubleSide,
      roughness: 0.95,
      metalness: 0.0,
      // White colour multiplier so the canvas RGB shows through unmodified.
      color: 0xffffff,
      // Fog applies normally — distant edges of the canopy fade into haze.
      fog: true
    });

    super(geometry, material);
    this.position.y = 12;
    // The canopy itself does not need to receive its own shadow; only cast.
    this.castShadow = !mobile;
    this.receiveShadow = false;
    this.renderOrder = 0;
  }
}
