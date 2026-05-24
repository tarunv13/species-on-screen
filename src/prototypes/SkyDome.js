import * as THREE from 'three';

/**
 * Held vertical-gradient sky dome.
 *
 * Three colour stops (lower / mid / upper) sampled by view-direction Y.
 * Dithered to suppress 8-bit gradient banding. Fog disabled — the sky
 * itself defines the atmospheric colour the fog matches against.
 */
export class SkyDome extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.SphereGeometry(8000, 32, 16);

    const material = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      vertexShader: `
        varying vec3 vViewDir;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vViewDir = normalize(worldPos.xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vViewDir;
        // Cheap hash for dithering
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        void main() {
          float t = clamp(vViewDir.y, 0.0, 1.0);
          vec3 lower = vec3(0.62, 0.62, 0.66);   // warmed grey near horizon
          vec3 mid   = vec3(0.22, 0.32, 0.46);   // muted blue
          vec3 upper = vec3(0.08, 0.13, 0.24);   // deep cool zenith
          vec3 sky = mix(
            mix(lower, mid, smoothstep(0.0, 0.35, t)),
            upper,
            smoothstep(0.35, 0.85, t)
          );
          // 8-bit dither against gradient banding
          float dither = (hash(gl_FragCoord.xy) - 0.5) / 255.0;
          sky += dither;
          gl_FragColor = vec4(sky, 1.0);
        }
      `
    });

    super(geometry, material);
    this.frustumCulled = false;
    this.renderOrder = -1;
  }
}
