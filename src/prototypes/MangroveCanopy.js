import * as THREE from 'three';

// ----------------------------------------------------------------------------
// Procedural canopy alpha texture (RGBA — leaf colour with leaf-cluster mask).
// Generated once at startup from FBM. Tuned distinct from the alpine cumulus
// generator:
//
//   - higher base frequency (smaller features → leaves, not clouds)
//   - softer alpha edge (was 0.5 alphaTest cutoff producing hard edges;
//     now grades from 0.35 with internal leaf-cluster brightening)
//   - target ~75-85% coverage (closed canopy with occasional gaps)
//   - leaf colour is darker green-brown with WARMER drift in lit zones
//     and brighter LUMINOUS-TRANSMISSION near alpha edges, so the
//     viewer reads "sunlight on the far side" rather than "leaf-shaped
//     sticker."
//
// `seedOffset` lets two layered canopy planes use independent FBM
// realisations of the same colour family, so they parallax against each
// other instead of moving as one.
// ----------------------------------------------------------------------------
function generateCanopyTexture(size, seedOffset = 0) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);

  const seed = seedOffset;
  const hash = (x, y) => {
    const s = Math.sin((x + seed) * 127.1 + (y + seed * 1.7) * 311.7) * 43758.5453;
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

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;

      const clumps = fbm(u * 5.0, v * 5.0);          // slow leaf masses
      const detail = fbm(u * 18.0, v * 18.0);        // leaf-cluster grain
      const tint   = fbm(u * 3.5 + 17, v * 3.5 + 9); // colour drift

      // Coverage curve. Carved gaps + roughened edges.
      const mask = (clumps - 0.18) * 1.7 + (detail - 0.5) * 0.35;
      let alpha = Math.min(1.0, Math.max(0.0, mask + 0.15));
      alpha = Math.pow(alpha, 0.85);

      // Distance-from-alpha-edge proxy: the closer to the cutoff, the
      // more "edge" this texel is. We brighten the colour at edges to
      // simulate luminous transmission of light through a leaf
      // (light visible through a leaf from below is its translucent
      // colour, not its opaque colour). This is the single most
      // important fix to the canopy underside reading as black.
      const edgeProximity = 1.0 - Math.abs(alpha - 0.4) / 0.4; // peaks at alpha≈0.4
      const transmission = Math.max(0, edgeProximity);

      // Base colour (opaque interior of leaf cluster): dark, desat green
      // with warm drift. Lifted from the previous pass which maxed at
      // ~0.16; now reaches ~0.34 in lit drift zones and ~0.11 in dark.
      const warmth = tint;
      const r = 0.115 + warmth * 0.165;  // 0.115 .. 0.280
      const g = 0.150 + warmth * 0.155;  // 0.150 .. 0.305
      const b = 0.075 + warmth * 0.075;  // 0.075 .. 0.150

      // Transmission tint: warmer and brighter, pushed toward the
      // golden-green of leaf translucency in late afternoon light.
      const trR = 0.55;
      const trG = 0.50;
      const trB = 0.20;

      const tR = r + (trR - r) * transmission * 0.55;
      const tG = g + (trG - g) * transmission * 0.55;
      const tB = b + (trB - b) * transmission * 0.55;

      const idx = (y * size + x) * 4;
      img.data[idx]     = Math.floor(Math.min(1, tR) * 255);
      img.data[idx + 1] = Math.floor(Math.min(1, tG) * 255);
      img.data[idx + 2] = Math.floor(Math.min(1, tB) * 255);
      img.data[idx + 3] = Math.floor(alpha * 255);
    }
  }

  ctx.putImageData(img, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Two-layer overhead canopy.
 *
 * Where the previous pass had a single plane, this is a Group of two
 * planes at slightly different heights with independent FBM masks.
 * Together they produce:
 *
 *   - Visible enclosure with depth: the lower layer reads as the
 *     foreground canopy, the upper layer reads as the canopy a few
 *     metres further up. As the camera drifts forward through the
 *     channel, the two layers parallax against each other, conveying
 *     occlusion depth that one plane cannot.
 *
 *   - Layered shadow casting: both layers contribute to the
 *     directional sun's shadow map. Where their alphas overlap, the
 *     shadow is dense; where one layer has a gap and the other does
 *     not, a softer dappling appears on the water — closer to the
 *     way real canopy filters light.
 *
 *   - Brighter under-canopy fill: the per-texel transmission
 *     brightening (see generator above) turns the alpha-edge regions
 *     into warm green-gold luminances, so the underside of the
 *     canopy is no longer a uniform black ceiling.
 */
export class MangroveCanopy extends THREE.Group {
  constructor({ mobile = false } = {}) {
    super();

    const size = 80;
    const texSize = mobile ? 256 : 512;

    // Lower layer ----------------------------------------------------
    const geo1 = new THREE.PlaneGeometry(size, size, 4, 4);
    geo1.rotateX(Math.PI / 2); // face down

    const tex1 = generateCanopyTexture(texSize, 0);
    tex1.repeat.set(4, 4);

    const mat1 = new THREE.MeshStandardMaterial({
      map: tex1,
      transparent: true,
      alphaTest: 0.35,
      side: THREE.DoubleSide,
      roughness: 0.95,
      metalness: 0.0,
      color: 0xffffff,
      fog: true
    });

    const lower = new THREE.Mesh(geo1, mat1);
    lower.position.y = 12;
    lower.castShadow = !mobile;
    lower.receiveShadow = false;
    this.add(lower);

    // Upper layer ----------------------------------------------------
    // Same generator but seeded differently and rotated/repeated
    // distinctly, so the two layers don't statistically coincide.
    const geo2 = new THREE.PlaneGeometry(size, size, 4, 4);
    geo2.rotateX(Math.PI / 2);
    geo2.rotateY(0.42); // 24° rotation to break alignment with the lower layer

    const tex2 = generateCanopyTexture(texSize, 113);
    tex2.repeat.set(3.2, 3.2); // slightly larger feature size at the upper layer
    tex2.offset.set(0.13, 0.27);

    const mat2 = new THREE.MeshStandardMaterial({
      map: tex2,
      transparent: true,
      alphaTest: 0.35,
      side: THREE.DoubleSide,
      roughness: 0.95,
      metalness: 0.0,
      color: 0xffffff,
      fog: true
    });

    const upper = new THREE.Mesh(geo2, mat2);
    upper.position.y = 14.2;
    upper.castShadow = !mobile;
    upper.receiveShadow = false;
    this.add(upper);
  }
}
