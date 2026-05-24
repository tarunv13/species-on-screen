import * as THREE from 'three';

// ----------------------------------------------------------------------------
// Deterministic seedable RNG (mulberry32). The prop-root forest is generated
// once at startup and must be reproducible across sessions/devices so the
// composition is composed, not stochastic-on-each-load. (A reload that
// produces a different forest reads as instability; cinematography is
// composed.)
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

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _t = new THREE.Vector3();
const _s = new THREE.Vector3();

/**
 * Prop-root forest as a single InstancedMesh.
 *
 * Composition rules (the "different place, same patient observational
 * register" point — alpine's terrain is a heightfield; mangrove's
 * structure is sparse vertical instances):
 *
 *   • Roots are clustered. A solitary cylinder reads as scaffolding;
 *     six tilted cylinders sharing a base read as a prop-root system.
 *     Each cluster spawns 8–14 (desktop) / 6–10 (mobile) roots.
 *
 *   • Clusters are arranged in two side bands flanking a clear central
 *     channel. The boat drift travels down the channel; the channel
 *     must stay legible as the camera advances.
 *
 *   • Cluster Z-positions span ~25 units of depth. Forward drift
 *     unveils new clusters from haze and absorbs old clusters behind
 *     the camera — the structural occlusion depth the brief asks for.
 *
 *   • Roots tilt outward from cluster centre by 0–22°, with random
 *     azimuth. They are not branching; the visual density of the
 *     bundle does the work that branch geometry would.
 *
 *   • Heights vary 1.4–3.6 units; radii vary 0.04–0.10. Most roots
 *     do not reach the canopy. The canopy is its own primitive.
 *
 * Material:
 *   MeshStandardMaterial with an `onBeforeCompile` patch that height-
 *   blends three palettes against world-space Y:
 *
 *     • below 0.0  → wet-tannin bark (near-black, slight green cast)
 *     • 0.0–0.10   → narrow algae band (desaturated muddy green)
 *     • above 0.10 → dry bark (dark warm brown)
 *
 *   This is the prop-root analogue of alpine's slope-blended snow/rock
 *   patch — same technique, completely different content.
 */
export class MangroveRoots extends THREE.InstancedMesh {
  constructor({ mobile = false } = {}) {
    const rng = makeRng(0xC0FFEE);

    const clusterCount = mobile ? 8 : 14;
    const rootsPerCluster = () => (mobile ? 6 + Math.floor(rng() * 5) : 8 + Math.floor(rng() * 7));

    // First pass: enumerate cluster bases and their root counts so we know
    // the total instance count up front.
    const clusters = [];
    let total = 0;
    for (let i = 0; i < clusterCount; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      // Side band: |x| in [1.8, 7], with light z-jitter across the band.
      const cx = side * (1.8 + rng() * 5.2);
      const cz = -14 + (i / clusterCount) * 26 + (rng() - 0.5) * 2.5;
      // Slight base-elevation variance — most clusters sit at the
      // waterline; a few perch a fingerwidth above.
      const cy = -0.05 + rng() * 0.18;
      const n = rootsPerCluster();
      clusters.push({ cx, cy, cz, n });
      total += n;
    }

    // Geometry: simple tapered cylinder, 6-sided. Higher segment counts
    // do not earn their cost at the angular sizes we render at.
    const geom = new THREE.CylinderGeometry(0.04, 0.07, 1.0, 6, 1, false);
    // Translate so origin is at the *base* of the cylinder, not its
    // centre. This makes per-instance Y-scaling pivot from the
    // waterline rather than embedding the cylinder mid-height.
    geom.translate(0, 0.5, 0);

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.92,
      metalness: 0.0,
      fog: true
    });

    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
varying vec3 vWorldPos_root;`
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
#ifdef USE_INSTANCING
vWorldPos_root = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
#else
vWorldPos_root = (modelMatrix * vec4(transformed, 1.0)).xyz;
#endif`
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
varying vec3 vWorldPos_root;`
        )
        .replace(
          '#include <map_fragment>',
          `// World-Y blend. The waterline sits at y = 0.
float y = vWorldPos_root.y;

// Submerged: deep tannin-stained wet bark, near-black with a faint
// green cast from light scatter through the water.
vec3 wetBark = vec3(0.055, 0.060, 0.040);

// Dry bark: warm dark brown. Not orange. Not chocolate. The colour
// of mangrove bark photographed in late afternoon shade.
vec3 dryBark = vec3(0.180, 0.130, 0.090);

// A narrow algae band sits in the splash zone right at the waterline.
vec3 algae = vec3(0.110, 0.135, 0.075);

// Below 0 → wet, above 0.10 → dry, smooth blend in between.
float wetness = 1.0 - smoothstep(-0.04, 0.10, y);
vec3 bark = mix(dryBark, wetBark, wetness);

// Algae as a narrow gaussian-ish band centred at y=0.05.
float band = exp(-pow((y - 0.05) * 9.0, 2.0));
bark = mix(bark, algae, band * 0.55);

diffuseColor.rgb = bark;
`
        );
    };

    super(geom, material, total);
    this.castShadow = !mobile;
    this.receiveShadow = true;
    this.frustumCulled = false; // we know the bounds; avoid pop-out

    // Second pass: write per-instance matrices.
    let idx = 0;
    for (const c of clusters) {
      for (let r = 0; r < c.n; r++) {
        // Radial offset within cluster: most roots within 0.55 units of
        // cluster centre; a few stragglers further out.
        const offRadius = Math.pow(rng(), 1.6) * 0.85;
        const offAngle = rng() * Math.PI * 2;
        const ox = Math.cos(offAngle) * offRadius;
        const oz = Math.sin(offAngle) * offRadius;

        // Tilt: outward from cluster centre, 0–22°.
        const tiltAmount = (rng() * 0.40); // radians, up to ~23°
        const tiltDir = Math.atan2(oz, ox); // outward
        // Build an Euler that tilts about an axis perpendicular to the
        // outward direction — i.e. rotates the cylinder away from the
        // centre. Cylinder default axis is +Y. We rotate about
        // (sin(tiltDir+π/2), 0, cos(tiltDir+π/2)) — the perpendicular
        // horizontal axis — by tiltAmount.
        const axisAngle = tiltDir + Math.PI / 2;
        _e.set(
          Math.sin(axisAngle) * tiltAmount,
          rng() * Math.PI * 2, // free yaw rotation around its own axis
          -Math.cos(axisAngle) * tiltAmount,
          'YXZ'
        );
        _q.setFromEuler(_e);

        // Scale: per-root height and radius variance.
        const heightScale = 1.4 + rng() * 2.2;
        const radiusScale = 0.7 + rng() * 0.6;
        _s.set(radiusScale, heightScale, radiusScale);

        _t.set(c.cx + ox, c.cy, c.cz + oz);

        _m.compose(_t, _q, _s);
        this.setMatrixAt(idx, _m);
        idx++;
      }
    }
    this.instanceMatrix.needsUpdate = true;
  }
}
