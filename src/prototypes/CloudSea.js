import * as THREE from 'three';

// ----------------------------------------------------------------------------
// Procedural cumulus alpha texture (white RGB, soft alpha mask).
// Generated once at startup with FBM noise. The MeshBasicMaterial.color
// uniform applies the precomputed sun-direction tint, so the shader
// stays trivial and fog applies automatically.
// ----------------------------------------------------------------------------
function generateCloudTexture(size) {
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
      freq *= 2.0;
    }
    return v / max;
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      const n = fbm(u * 4, v * 4);

      // Soft cumulus shape: bias around mid-values, soft edges, capped opacity
      let alpha = Math.pow(Math.max(0, n - 0.35) * 1.4, 1.4);
      alpha = Math.min(0.85, alpha);

      const idx = (y * size + x) * 4;
      img.data[idx]     = 255;
      img.data[idx + 1] = 255;
      img.data[idx + 2] = 255;
      img.data[idx + 3] = Math.floor(alpha * 255);
    }
  }

  ctx.putImageData(img, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Horizontal cloud-sea plane at fixed altitude.
 *
 * 4km × 4km flat plane. White cumulus alpha texture, transparent,
 * non-depth-writing so distant peaks above the plane occlude it
 * naturally. UV offset drifts at half the camera yaw rate so the
 * sea reads as moving with the wind aloft.
 *
 * Sun-direction tint is precomputed against sun direction (60, 18, -8),
 * matching the alpine.js key light. No per-frame lighting math.
 */
export class CloudSea extends THREE.Mesh {
  constructor({ mobile = false } = {}) {
    const geometry = new THREE.PlaneGeometry(4000, 4000, 1, 1);
    geometry.rotateX(-Math.PI / 2);

    const cloudTex = generateCloudTexture(mobile ? 256 : 512);

    // Sun (60, 18, -8) normalised → y ≈ 0.283.
    // Lift factor: y * 0.6 + 0.2 ≈ 0.37 (mix from shade toward lit)
    const colorLit   = new THREE.Color(0.92, 0.88, 0.82);
    const colorShade = new THREE.Color(0.72, 0.75, 0.80);
    const baseColor  = colorShade.clone().lerp(colorLit, 0.37);

    const material = new THREE.MeshBasicMaterial({
      map: cloudTex,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      fog: true,
      color: baseColor
    });

    super(geometry, material);
    this.position.y = 600;
    this.renderOrder = 1;

    this._tex = cloudTex;
  }

  /** Drift the cloud UVs laterally. delta is seconds since last frame. */
  update(delta) {
    this._tex.offset.x += delta * 0.0015;
  }
}
