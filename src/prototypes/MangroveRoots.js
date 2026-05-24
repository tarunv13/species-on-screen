import * as THREE from 'three';

// ----------------------------------------------------------------------------
// Deterministic seedable RNG (mulberry32). The forest is generated once and
// reproducibly — a reload that produces a different forest reads as
// instability. Cinematography is composed.
// ----------------------------------------------------------------------------
function makeRng(seed) {
  let s = seed >>> 0;
  return function() {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ----------------------------------------------------------------------------
// Procedural bark normal map.
//
// Bark on real prop-roots reads as a near-vertical fissure pattern
// (height variance along Y, very little along the circumference) plus
// a sparse field of lenticels (small bright spots). We synthesise both:
//
//   • Vertical fissures: high-frequency 1D noise sampled on the X axis,
//     mildly modulated along Y, gives a wood-grain stripe pattern.
//
//   • Lenticels: a low-density Poisson-ish point set (just hashed grid
//     points with a threshold) producing small Gaussian bumps on top
//     of the fissure field.
//
// Encoded as tangent-space normal via finite differences, same
// technique as the water ripple map.
// ----------------------------------------------------------------------------
function generateBarkNormalMap(size) {
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

  // Heights as a 1D Float32 grid.
  const heights = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      // Vertical-bias FBM: x stretched 3.5x, y native — produces vertical streaks.
      let h = 0;
      let amp = 0.5;
      let fx = u * 18.0;
      let fy = v * 5.0;
      for (let i = 0; i < 4; i++) {
        h += amp * smooth(fx, fy);
        fx *= 2.07;
        fy *= 2.07;
        amp *= 0.5;
      }
      // Lenticel speckles: sparse positive bumps. Density ~0.6%.
      const cellSize = 11;
      const cx = Math.floor(x / cellSize);
      const cy = Math.floor(y / cellSize);
      const r = hash(cx * 7.3, cy * 4.7);
      if (r < 0.04) {
        const localX = (x % cellSize) - cellSize * 0.5;
        const localY = (y % cellSize) - cellSize * 0.5;
        const d = Math.sqrt(localX * localX + localY * localY);
        const bump = Math.max(0, 1 - d / 3.5);
        h -= bump * 0.45; // bumps recess inward — lenticels are lower than the bark surface
      }
      heights[y * size + x] = h;
    }
  }

  const strength = 6.0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const xL = (x - 1 + size) % size;
      const xR = (x + 1) % size;
      const yU = (y - 1 + size) % size;
      const yD = (y + 1) % size;
      const dx = heights[y * size + xR] - heights[y * size + xL];
      const dy = heights[yD * size + x] - heights[yU * size + x];
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
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _t = new THREE.Vector3();
const _s = new THREE.Vector3();

// ----------------------------------------------------------------------------
// Build one prop-root forest InstancedMesh + a sibling pneumatophore
// InstancedMesh + a sibling aerial-root InstancedMesh, returned as a
// single Group so the caller adds one Object3D to the scene.
//
// All three share the same bark normal map and roughly the same albedo
// shader, so the cluster reads as one biological structure rather than
// three separate primitives.
// ----------------------------------------------------------------------------
export class MangroveRoots extends THREE.Group {
  constructor({ mobile = false } = {}) {
    super();
    const rng = makeRng(0xC0FFEE);

    const barkNormal = generateBarkNormalMap(mobile ? 256 : 512);

    // Shared shader patches — written here so each material reuses the
    // same string, avoiding three near-identical copies further down.
    const writeBarkVertexPatch = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
varying vec3 vWorldPos_root;
varying vec3 vInstanceTint_root;`
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
#ifdef USE_INSTANCING
vWorldPos_root = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
#else
vWorldPos_root = (modelMatrix * vec4(transformed, 1.0)).xyz;
#endif
#ifdef USE_INSTANCING_COLOR
vInstanceTint_root = vec3(instanceColor);
#else
vInstanceTint_root = vec3(1.0);
#endif`
        );
    };
    const writeBarkFragmentPatch = (shader) => {
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
varying vec3 vWorldPos_root;
varying vec3 vInstanceTint_root;`
        )
        .replace(
          '#include <map_fragment>',
          `// World-Y blend. The waterline sits at y = 0.
float y = vWorldPos_root.y;

// Palette — all values lifted ~50-80% from the previous pass so the
// roots no longer crush to silhouette under ACES. Wet bark stays the
// darkest band in the frame; dry bark sits in the lit-shadow midtone.
vec3 wetBark = vec3(0.090, 0.078, 0.055);
vec3 dryBark = vec3(0.275, 0.205, 0.140);
vec3 algae   = vec3(0.165, 0.190, 0.105);

// Below 0 → wet, above 0.10 → dry, smooth blend in between.
float wetness = 1.0 - smoothstep(-0.04, 0.10, y);
vec3 bark = mix(dryBark, wetBark, wetness);

// Algae as a narrow band centred at y=0.05.
float band = exp(-pow((y - 0.05) * 9.0, 2.0));
bark = mix(bark, algae, band * 0.55);

// A second, broader and dimmer tide-stain band sits ABOVE the
// waterline (y = 0.1..0.35) — the signature of dried algae from
// previous high-tides. Reads as biological history without animation.
float tideStain = smoothstep(0.10, 0.18, y) * (1.0 - smoothstep(0.32, 0.42, y));
vec3 stainColor = vec3(0.165, 0.135, 0.095);
bark = mix(bark, stainColor, tideStain * 0.35);

// Per-instance tint — multiplies the whole bark colour. Each cluster
// gets a slightly different albedo so the forest doesn't read as
// stamped clones.
bark *= vInstanceTint_root;

diffuseColor.rgb = bark;
`
        );
    };

    // ---------------------------------------------------------------
    // 1. Prop-roots. Same generator as the previous pass but now
    //    writes a per-instance colour tint and uses a tile-able bark
    //    normal map.
    // ---------------------------------------------------------------
    const clusterCount = mobile ? 8 : 14;
    const rootsPerCluster = () => (mobile ? 6 + Math.floor(rng() * 5) : 8 + Math.floor(rng() * 7));

    const clusters = [];
    let propTotal = 0;
    for (let i = 0; i < clusterCount; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const cx = side * (1.8 + rng() * 5.2);
      const cz = -14 + (i / clusterCount) * 26 + (rng() - 0.5) * 2.5;
      const cy = -0.05 + rng() * 0.18;
      const n = rootsPerCluster();
      // Per-cluster albedo tint — each cluster is its own colour family
      // so the eye reads "this tree" rather than "stamped tree A".
      const tintHue = 0.85 + rng() * 0.30;     // 0.85..1.15
      const tintWarm = 0.92 + rng() * 0.20;    // 0.92..1.12
      const tintCool = 0.88 + rng() * 0.18;    // 0.88..1.06
      clusters.push({ cx, cy, cz, n, tint: new THREE.Color(tintWarm, tintHue, tintCool) });
      propTotal += n;
    }

    const propGeom = new THREE.CylinderGeometry(0.04, 0.07, 1.0, 8, 1, false);
    propGeom.translate(0, 0.5, 0);

    const propMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.78,
      metalness: 0.0,
      normalMap: barkNormal,
      normalScale: new THREE.Vector2(0.95, 0.95),
      envMapIntensity: 0.35,
      fog: true
    });
    propMat.onBeforeCompile = (shader) => {
      writeBarkVertexPatch(shader);
      writeBarkFragmentPatch(shader);
    };

    const props = new THREE.InstancedMesh(propGeom, propMat, propTotal);
    props.castShadow = !mobile;
    props.receiveShadow = true;
    props.frustumCulled = false;
    // Per-instance colour tints — Three's InstancedMesh exposes this
    // via `instanceColor`, surfaced into the shader as `instanceColor`
    // (vec3) when USE_INSTANCING_COLOR is defined.
    const instColors = new Float32Array(propTotal * 3);
    let pIdx = 0;
    for (const c of clusters) {
      // Each cluster also adds a small per-root jitter on top of the
      // cluster tint, so individual roots inside a cluster aren't
      // identical either.
      for (let r = 0; r < c.n; r++) {
        const offRadius = Math.pow(rng(), 1.6) * 0.85;
        const offAngle = rng() * Math.PI * 2;
        const ox = Math.cos(offAngle) * offRadius;
        const oz = Math.sin(offAngle) * offRadius;

        const tiltAmount = (rng() * 0.40);
        const tiltDir = Math.atan2(oz, ox);
        const axisAngle = tiltDir + Math.PI / 2;
        _e.set(
          Math.sin(axisAngle) * tiltAmount,
          rng() * Math.PI * 2,
          -Math.cos(axisAngle) * tiltAmount,
          'YXZ'
        );
        _q.setFromEuler(_e);

        const heightScale = 1.4 + rng() * 2.2;
        const radiusScale = 0.7 + rng() * 0.6;
        _s.set(radiusScale, heightScale, radiusScale);
        _t.set(c.cx + ox, c.cy, c.cz + oz);
        _m.compose(_t, _q, _s);
        props.setMatrixAt(pIdx, _m);

        // Per-root jitter: ±6% on each channel, applied on top of cluster tint.
        const jitterR = 0.94 + rng() * 0.12;
        const jitterG = 0.94 + rng() * 0.12;
        const jitterB = 0.94 + rng() * 0.12;
        instColors[pIdx * 3]     = c.tint.r * jitterR;
        instColors[pIdx * 3 + 1] = c.tint.g * jitterG;
        instColors[pIdx * 3 + 2] = c.tint.b * jitterB;
        pIdx++;
      }
    }
    props.instanceMatrix.needsUpdate = true;
    props.instanceColor = new THREE.InstancedBufferAttribute(instColors, 3);
    props.instanceColor.needsUpdate = true;
    this.add(props);

    // ---------------------------------------------------------------
    // 2. Pneumatophores. Tiny vertical sticks clustered around each
    //    prop-root cluster's base. Real mangroves push these out of
    //    the mud as breathing-roots; visually they dress the
    //    "ground-story" so the bases of the prop-roots don't look
    //    rooted in nothing.
    // ---------------------------------------------------------------
    const pneuPerCluster = mobile ? 18 : 36;
    const pneuTotal = clusters.length * pneuPerCluster;

    const pneuGeom = new THREE.CylinderGeometry(0.012, 0.020, 1.0, 5, 1, false);
    pneuGeom.translate(0, 0.5, 0);

    const pneuMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.85,
      metalness: 0.0,
      normalMap: barkNormal,
      normalScale: new THREE.Vector2(0.4, 0.4),
      envMapIntensity: 0.25,
      fog: true
    });
    pneuMat.onBeforeCompile = (shader) => {
      writeBarkVertexPatch(shader);
      writeBarkFragmentPatch(shader);
    };

    const pneus = new THREE.InstancedMesh(pneuGeom, pneuMat, pneuTotal);
    pneus.castShadow = !mobile;
    pneus.receiveShadow = true;
    pneus.frustumCulled = false;
    const pneuColors = new Float32Array(pneuTotal * 3);
    let pneuIdx = 0;
    for (const c of clusters) {
      for (let i = 0; i < pneuPerCluster; i++) {
        // Distributed in an annulus around the cluster: from r=0.5 to
        // r=2.4, with bias toward the outer edge so they "fan out."
        const ang = rng() * Math.PI * 2;
        const rad = 0.5 + Math.pow(rng(), 0.7) * 1.9;
        const ox = Math.cos(ang) * rad;
        const oz = Math.sin(ang) * rad;
        // Heights vary 0.06–0.22 — most barely break the surface, a
        // few stand a hand-width tall.
        const h = 0.06 + Math.pow(rng(), 1.4) * 0.16;
        const rScale = 0.7 + rng() * 0.6;
        // Slight random tilt so they don't read as a regimented army.
        _e.set((rng() - 0.5) * 0.18, rng() * Math.PI * 2, (rng() - 0.5) * 0.18, 'YXZ');
        _q.setFromEuler(_e);
        _s.set(rScale, h, rScale);
        _t.set(c.cx + ox, c.cy - 0.02, c.cz + oz);
        _m.compose(_t, _q, _s);
        pneus.setMatrixAt(pneuIdx, _m);

        // Slightly darker than prop-roots — they sit lower, often
        // freshly emerged from mud, so the eye reads them as "newer."
        const tintMul = 0.78 + rng() * 0.18;
        pneuColors[pneuIdx * 3]     = c.tint.r * tintMul;
        pneuColors[pneuIdx * 3 + 1] = c.tint.g * tintMul;
        pneuColors[pneuIdx * 3 + 2] = c.tint.b * tintMul;
        pneuIdx++;
      }
    }
    pneus.instanceMatrix.needsUpdate = true;
    pneus.instanceColor = new THREE.InstancedBufferAttribute(pneuColors, 3);
    pneus.instanceColor.needsUpdate = true;
    this.add(pneus);

    // ---------------------------------------------------------------
    // 3. Hanging aerial roots — thin cylinders descending from the
    //    canopy plane (y=12) to varying termination heights. Most
    //    don't reach the water; a few do. They are the second
    //    structural signature of mangrove ecology and were missing
    //    from the previous pass.
    // ---------------------------------------------------------------
    const aerialCount = mobile ? 60 : 140;
    const aerialGeom = new THREE.CylinderGeometry(0.018, 0.024, 1.0, 5, 1, false);
    aerialGeom.translate(0, 0.5, 0);

    const aerialMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.88,
      metalness: 0.0,
      normalMap: barkNormal,
      normalScale: new THREE.Vector2(0.5, 0.5),
      envMapIntensity: 0.3,
      fog: true
    });
    aerialMat.onBeforeCompile = (shader) => {
      writeBarkVertexPatch(shader);
      writeBarkFragmentPatch(shader);
    };

    const aerials = new THREE.InstancedMesh(aerialGeom, aerialMat, aerialCount);
    aerials.castShadow = !mobile;
    aerials.receiveShadow = true;
    aerials.frustumCulled = false;
    const aerialColors = new Float32Array(aerialCount * 3);
    for (let i = 0; i < aerialCount; i++) {
      // Spawn from anywhere on the canopy, but biased to the flanks
      // (|x| > 1.5) so the central drift channel stays clear.
      const side = rng() < 0.5 ? -1 : 1;
      const ax = side * (1.5 + rng() * 6.5);
      const az = -14 + rng() * 28;
      // Aerial root tops attach near canopy (y ≈ 12), with slight jitter.
      const topY = 12.0 + (rng() - 0.5) * 0.4;
      // Length: 60% are short stubs (1.5–4 units), 35% medium (4–8),
      // 5% reach the water (8–12+).
      const r2 = rng();
      let len;
      if (r2 < 0.60) len = 1.5 + rng() * 2.5;
      else if (r2 < 0.95) len = 4.0 + rng() * 4.0;
      else len = 8.0 + rng() * 4.5;
      // The cylinder geometry has its base at y=0 after the translate
      // above, with +Y its length axis. We want it hanging DOWN from
      // (ax, topY, az), so we rotate 180° around X (which inverts the
      // length axis to point downward) and place the origin at topY.
      _e.set(Math.PI, rng() * Math.PI * 2, (rng() - 0.5) * 0.10, 'YXZ');
      _q.setFromEuler(_e);
      const rScale = 0.6 + rng() * 0.7;
      _s.set(rScale, len, rScale);
      _t.set(ax, topY, az);
      _m.compose(_t, _q, _s);
      aerials.setMatrixAt(i, _m);

      // Aerial roots are slightly drier and lighter than prop-roots
      // because they aren't tide-washed.
      const tintR = 1.05 + (rng() - 0.5) * 0.10;
      const tintG = 1.00 + (rng() - 0.5) * 0.10;
      const tintB = 0.95 + (rng() - 0.5) * 0.10;
      aerialColors[i * 3]     = tintR;
      aerialColors[i * 3 + 1] = tintG;
      aerialColors[i * 3 + 2] = tintB;
    }
    aerials.instanceMatrix.needsUpdate = true;
    aerials.instanceColor = new THREE.InstancedBufferAttribute(aerialColors, 3);
    aerials.instanceColor.needsUpdate = true;
    this.add(aerials);
  }
}
