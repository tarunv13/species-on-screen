import './mangrove.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { CinematicEngine } from '../cinematic-engine.js';
import { MangroveWater } from './MangroveWater.js';
import { MangroveRoots } from './MangroveRoots.js';
import { MangroveCanopy } from './MangroveCanopy.js';

function isMobile() {
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function init() {
  const canvas = document.querySelector('canvas#mangrove');
  if (!canvas) return;

  const mobile = isMobile();
  const engine = new CinematicEngine(canvas);

  // ---------------------------------------------------------------------
  // 1. Strip engine defaults that don't apply to this shot.
  // ---------------------------------------------------------------------
  if (engine.particles) engine.scene.remove(engine.particles);
  engine.scene.background = null;

  const lightsToRemove = engine.scene.children.filter(
    (c) => c.isAmbientLight || c.isDirectionalLight || c.isHemisphereLight
  );
  lightsToRemove.forEach((c) => engine.scene.remove(c));

  // ---------------------------------------------------------------------
  // 2. Renderer config the engine doesn't enable.
  //    Exposure raised from 1.0 → 1.6 so ACES no longer crushes the
  //    low-key palette into uniform black. The palette itself has also
  //    been lifted in each material; the two changes together produce
  //    the tonal hierarchy the previous pass was missing.
  // ---------------------------------------------------------------------
  engine.renderer.shadowMap.enabled = !mobile;
  engine.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  engine.renderer.toneMappingExposure = 1.6;

  // ---------------------------------------------------------------------
  // 3. Camera config — unchanged from the first pass.
  //    fov 32, near 0.1, far 250, eyeline at y=1.4 (low boat).
  // ---------------------------------------------------------------------
  const camera = engine.getCamera();
  camera.fov = 32;
  camera.near = 0.1;
  camera.far = 250;
  camera.updateProjectionMatrix();

  const aspect = window.innerWidth / window.innerHeight;
  const portraitOffset = aspect < 1.0 ? 0.18 : 0;
  const startCamPos = { x: 0, y: 1.4 + portraitOffset, z: 8 };
  const startCamTarget = { x: 0, y: 1.0 + portraitOffset * 0.4, z: -10 };
  engine.setCameraPosition(startCamPos, startCamTarget);

  // ---------------------------------------------------------------------
  // 4. Fog — slightly warmer-and-brighter than the first pass so the
  //    medium itself reads as illuminated air, which is what
  //    communicates humidity. Distant objects fade INTO a brighter
  //    background, so the eye reads atmospheric perspective rather
  //    than a uniform mid-dark slurry.
  // ---------------------------------------------------------------------
  engine.scene.fog = new THREE.FogExp2(0x584a36, 0.020);

  // ---------------------------------------------------------------------
  // 5. World — same three primitives, all augmented internally.
  // ---------------------------------------------------------------------
  const water = new MangroveWater({ mobile });
  const roots = new MangroveRoots({ mobile });
  const canopy = new MangroveCanopy({ mobile });
  engine.scene.add(water);
  engine.scene.add(roots);
  engine.scene.add(canopy);

  // ---------------------------------------------------------------------
  // 6. Lights — overhauled.
  //
  //    Sun:
  //      - position (10, 14, 5) [was (8, 60, 12) — was almost overhead]
  //        so trunks now have a lit edge and a dark edge. Modeling
  //        roots in 3D is what makes them stop reading as silhouettes.
  //      - intensity 1.4 [was 0.7] — the unfiltered source must be
  //        bright so the canopy gaps that survive read as actual hits,
  //        not as slightly-less-dark patches.
  //      - colour 0xffd28a [was 0xfff0d0] — warmer, late-afternoon
  //        gold rather than neutral warm white.
  //
  //    Hemi:
  //      - sky 0x8a7240 [was 0x6a5a32] — lifted so the canopy
  //        underside fills surfaces it can't directly light.
  //      - ground 0x251810 [was 0x1a1208] — the water is dark but
  //        not black; bounce off it has presence.
  //      - intensity 0.45 [was 0.25].
  //
  //    Forward fill: a small 0xb89870 light sitting just below
  //    eyeline ahead of the camera. Simulates the ambient bounce of
  //    the channel itself — the light that comes from the medium of
  //    humid air. Intensity 0.20.
  // ---------------------------------------------------------------------
  const sun = new THREE.DirectionalLight(0xffd28a, 1.4);
  sun.position.set(10, 14, 5);
  sun.target.position.set(0, 0, -8);
  sun.castShadow = !mobile;
  sun.shadow.mapSize.set(2048, 2048);
  // Frustum re-tuned for the new sun position. The new angle means the
  // shadow camera covers a slightly wider area of the channel.
  sun.shadow.camera.left = -16;
  sun.shadow.camera.right = 16;
  sun.shadow.camera.top = 18;
  sun.shadow.camera.bottom = -18;
  sun.shadow.camera.near = 4;
  sun.shadow.camera.far = 80;
  sun.shadow.bias = -0.0008;
  sun.shadow.normalBias = 0.06;
  engine.scene.add(sun);
  engine.scene.add(sun.target);

  const hemi = new THREE.HemisphereLight(0x8a7240, 0x251810, 0.45);
  engine.scene.add(hemi);

  // Forward fill — small, low, slightly behind the camera's lookAt
  // direction so it lifts the front-facing side of approaching roots.
  const fill = new THREE.DirectionalLight(0xb89870, 0.20);
  fill.position.set(0, 0.4, 6); // forward of camera, near eyeline
  fill.target.position.set(0, 0.6, -8);
  engine.scene.add(fill);
  engine.scene.add(fill.target);

  // ---------------------------------------------------------------------
  // 6b. Environment map — PMREM-baked from the scene itself.
  //     The water and (to a lesser extent) the wet bark gain specular
  //     response to the canopy above and the channel below. Without
  //     this, MeshStandardMaterial has nothing to reflect, so wet
  //     surfaces read as matte mud. Skipped on mobile to preserve
  //     the perf envelope.
  //
  //     Bake happens AFTER the world is added so the env capture sees
  //     prop-roots, canopy, water — the actual diffuse surround.
  // ---------------------------------------------------------------------
  if (!mobile) {
    const pmrem = new THREE.PMREMGenerator(engine.renderer);
    pmrem.compileEquirectangularShader();
    const envRT = pmrem.fromScene(engine.scene, 0.04, 0.1, 100);
    engine.scene.environment = envRT.texture;
    pmrem.dispose();
  }

  // ---------------------------------------------------------------------
  // 7. Per-frame water tidal update. One ambient motion (Principle XVIII).
  // ---------------------------------------------------------------------
  engine.onUpdate((delta) => {
    if (prefersReducedMotion()) return;
    water.update(delta);
  });

  // ---------------------------------------------------------------------
  // 8. Resize / orientation.
  // ---------------------------------------------------------------------
  window.addEventListener('resize', () => {
    engine.resize();
    const a = window.innerWidth / window.innerHeight;
    const off = a < 1.0 ? 0.18 : 0;
    const currentZ = engine.getCamera().position.z;
    const currentTargetZ = engine._cameraTarget.z;
    engine.setCameraPosition(
      { x: 0, y: 1.4 + off, z: currentZ },
      { x: 0, y: 1.0 + off * 0.4, z: currentTargetZ }
    );
  });

  // ---------------------------------------------------------------------
  // 9. GSAP visibility pause.
  // ---------------------------------------------------------------------
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) gsap.globalTimeline.pause();
    else gsap.globalTimeline.resume();
  });

  // ---------------------------------------------------------------------
  // 10. Warm shaders, then start timeline.
  // ---------------------------------------------------------------------
  engine.composer.render();
  requestAnimationFrame(() => startTimeline(engine));
}

function startTimeline(engine) {
  if (prefersReducedMotion()) return;

  const camera = engine.getCamera();
  const tl = gsap.timeline({ defaults: { ease: 'none' } });

  // 0.0–2.0 s: held composition. Article I.
  tl.to({}, { duration: 2.0 });

  // 2.0–10.0 s: linear forward dolly. Article II Drift on Z axis.
  tl.to(camera.position, { z: -8, duration: 8.0, ease: 'none' });

  // 10.0–12.0 s: decelerated settle. Final frame is held.
  tl.to(camera.position, { z: -10, duration: 2.0, ease: 'power2.out' });
}

document.addEventListener('DOMContentLoaded', init);
