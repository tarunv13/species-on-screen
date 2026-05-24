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
  // 1. Strip engine defaults that don't apply to this shot. Same ritual
  //    alpine.js performs — the engine ships a starfield + cool ambient
  //    + warm directional + dark blue background that none of our biomes
  //    inherit. Particles are unparented, not destroyed, because the
  //    engine's animate loop reads their uniform every frame.
  // ---------------------------------------------------------------------
  if (engine.particles) engine.scene.remove(engine.particles);
  engine.scene.background = null;

  const lightsToRemove = engine.scene.children.filter(
    (c) => c.isAmbientLight || c.isDirectionalLight || c.isHemisphereLight
  );
  lightsToRemove.forEach((c) => engine.scene.remove(c));

  // ---------------------------------------------------------------------
  // 2. Renderer config the engine doesn't enable.
  //    Shadow casting is the load-bearing affordance of this prototype:
  //    canopy → water dappled patches, roots → water silhouettes. Soft
  //    shadows are required for both to read as filtered light rather
  //    than as cut-out stencils. Mobile drops shadows entirely; the
  //    enclosure still reads, the dappling does not.
  // ---------------------------------------------------------------------
  engine.renderer.shadowMap.enabled = !mobile;
  engine.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ---------------------------------------------------------------------
  // 3. Camera config — long-ish lens, very shallow far plane.
  //    Eye-line sits at y = 1.4: a person low in a poled boat. Portrait
  //    phones lift the camera and target slightly so the foreground
  //    water still occupies the lower third — same offset-on-resize
  //    pattern alpine uses, with mangrove-specific values.
  //
  //    far = 250 (alpine: 12000). Humidity compresses depth. Anything
  //    further than ~80 units is already fog by the time it renders.
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
  // 4. Fog — humid warm-umber haze, roughly 37x denser than alpine's
  //    cool-grey thin fog. The colour matches the dim ambient bleed
  //    of late-afternoon canopy filtering, not the colour of any sky.
  //    There is no sky in this biome.
  // ---------------------------------------------------------------------
  engine.scene.fog = new THREE.FogExp2(0x4a3322, 0.022);

  // ---------------------------------------------------------------------
  // 5. World — three depth layers per Article XIII:
  //      far  : the haze itself (the fog wall)
  //      mid  : prop-root forest receding on both sides of the channel
  //      fore : tannin water surface and the closest cluster of roots
  // ---------------------------------------------------------------------
  const water = new MangroveWater({ mobile });
  const roots = new MangroveRoots({ mobile });
  const canopy = new MangroveCanopy({ mobile });
  engine.scene.add(water);
  engine.scene.add(roots);
  engine.scene.add(canopy);

  // ---------------------------------------------------------------------
  // 6. Lights — filtered overhead key + warm/dark hemispheric fill.
  //    Sun is high (y=60) and slightly behind-and-right of the boat
  //    so its shadows project forward through the channel, giving the
  //    forward boat-drift a parallax of moving shadow patterns on the
  //    water — the structural occlusion depth made temporal.
  //    Intensity is low (0.7 vs alpine's 1.4) because most of the sun
  //    is absorbed by the canopy before it ever reaches the surface.
  // ---------------------------------------------------------------------
  const sun = new THREE.DirectionalLight(0xfff0d0, 0.7);
  sun.position.set(8, 60, 12);
  sun.target.position.set(0, 0, -8);
  sun.castShadow = !mobile;
  sun.shadow.mapSize.set(2048, 2048);
  // Tight orthographic frustum around the visible channel — the
  // shadow map is dense over the area the camera will see, not
  // wasted on the haze.
  sun.shadow.camera.left = -12;
  sun.shadow.camera.right = 12;
  sun.shadow.camera.top = 16;
  sun.shadow.camera.bottom = -16;
  sun.shadow.camera.near = 5;
  sun.shadow.camera.far = 100;
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.04;
  engine.scene.add(sun);
  engine.scene.add(sun.target);

  // Hemispheric fill: warm filtered "sky" (i.e. canopy underside) above,
  // dark tannin "ground" (i.e. water) below. Higher intensity than
  // alpine's 0.06 because the diffuse fill matters more in an enclosed
  // space than on an open ridge.
  const hemi = new THREE.HemisphereLight(0x6a5a32, 0x1a1208, 0.25);
  engine.scene.add(hemi);

  // ---------------------------------------------------------------------
  // 7. Per-frame water tidal update.
  //    One ambient motion only (Principle XVIII). The leaf-litter UV
  //    drift is part of the water material — same tide, one motion.
  // ---------------------------------------------------------------------
  engine.onUpdate((delta) => {
    if (prefersReducedMotion()) return;
    water.update(delta);
  });

  // ---------------------------------------------------------------------
  // 8. Resize / orientation — recompose camera height for portrait so
  //    the water still occupies the lower third. Preserves whatever
  //    forward-Z position the timeline has reached, the same way
  //    alpine preserves its lateral target.x.
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
  // 9. Pause GSAP when tab is hidden. The engine already pauses its
  //    own clock on visibilitychange; this aligns the timeline.
  // ---------------------------------------------------------------------
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) gsap.globalTimeline.pause();
    else gsap.globalTimeline.resume();
  });

  // ---------------------------------------------------------------------
  // 10. Warm shaders by rendering one frame, then start the timeline.
  // ---------------------------------------------------------------------
  engine.composer.render();
  requestAnimationFrame(() => startTimeline(engine));
}

function startTimeline(engine) {
  // Reduced-motion: hold the opening composition for the full session.
  // The first frame has already rendered, so the user sees the fully
  // composed image; only the boat drift is suppressed.
  if (prefersReducedMotion()) return;

  const camera = engine.getCamera();
  const tl = gsap.timeline({ defaults: { ease: 'none' } });

  // 0.0–2.0 s: held composition. Article I. The viewer registers the
  // place — water, roots, haze — before anything moves.
  tl.to({}, { duration: 2.0 });

  // 2.0–10.0 s: linear forward dolly. Article II Drift, but on the
  // camera's own Z axis instead of a yaw-target. The boat is drifting
  // through the channel. Camera position changes; lookAt-target stays
  // ahead, so the line of sight stays roughly forward and slightly
  // down. Speed: 1.6 units/sec — at the typical mangrove root cluster
  // distances (x ≈ ±2.5, z within ±6 of the camera), the nearest
  // visible trunk passes from edge-of-frame to behind the camera in
  // ~6 seconds, satisfying the doctrinal "one screen-width every
  // 8–12 seconds" rule for the dominant subject.
  tl.to(camera.position, { z: -8, duration: 8.0, ease: 'none' });

  // 10.0–12.0 s: decelerated settle. Final frame is held, not looped.
  tl.to(camera.position, { z: -10, duration: 2.0, ease: 'power2.out' });
}

document.addEventListener('DOMContentLoaded', init);
