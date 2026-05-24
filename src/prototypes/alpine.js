import './alpine.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { CinematicEngine } from '../cinematic-engine.js';
import { Terrain } from './Terrain.js';
import { CloudSea } from './CloudSea.js';
import { SkyDome } from './SkyDome.js';

function isMobile() {
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function init() {
  const canvas = document.querySelector('canvas#alpine');
  if (!canvas) return;

  const mobile = isMobile();
  const engine = new CinematicEngine(canvas);

  // ---------------------------------------------------------------------
  // 1. Strip engine defaults that don't apply to this shot.
  //    Particle reference is kept (the engine's animation loop reads
  //    a uniform on it every frame); the mesh is just unparented.
  // ---------------------------------------------------------------------
  if (engine.particles) engine.scene.remove(engine.particles);
  engine.scene.background = null;

  const lightsToRemove = engine.scene.children.filter(
    (c) => c.isAmbientLight || c.isDirectionalLight
  );
  lightsToRemove.forEach((c) => engine.scene.remove(c));

  // ---------------------------------------------------------------------
  // 2. Renderer config the engine doesn't enable.
  // ---------------------------------------------------------------------
  engine.renderer.shadowMap.enabled = !mobile;
  engine.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ---------------------------------------------------------------------
  // 3. Camera config — long lens, deep far plane.
  //    Portrait phones drop the camera and target so the foreground
  //    slope still occupies the lower third of frame.
  // ---------------------------------------------------------------------
  const camera = engine.getCamera();
  camera.fov = 26;
  camera.near = 1;
  camera.far = 12000;
  camera.updateProjectionMatrix();

  const aspect = window.innerWidth / window.innerHeight;
  const portraitOffset = aspect < 1.0 ? -80 : 0;
  engine.setCameraPosition(
    { x: 0, y: 720 + portraitOffset, z: 1100 },
    { x: 0, y: 540 + portraitOffset, z: -200 }
  );

  // ---------------------------------------------------------------------
  // 4. Fog — colour matches the lower-sky horizon stop.
  // ---------------------------------------------------------------------
  engine.scene.fog = new THREE.FogExp2(0x9da3ad, 0.0006);

  // ---------------------------------------------------------------------
  // 5. World.
  // ---------------------------------------------------------------------
  const sky = new SkyDome();
  const terrain = new Terrain({ mobile });
  const cloud = new CloudSea({ mobile });
  engine.scene.add(sky);
  engine.scene.add(terrain);
  engine.scene.add(cloud);

  // ---------------------------------------------------------------------
  // 6. Lights — single warm key + low hemispheric ambient.
  // ---------------------------------------------------------------------
  const sun = new THREE.DirectionalLight(0xfff0e0, 1.4);
  sun.position.set(60, 18, -8);
  sun.target.position.set(0, 200, 0);
  sun.castShadow = !mobile;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -300;
  sun.shadow.camera.right = 300;
  sun.shadow.camera.top = 300;
  sun.shadow.camera.bottom = -300;
  sun.shadow.camera.near = 10;
  sun.shadow.camera.far = 1500;
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.05;
  engine.scene.add(sun);
  engine.scene.add(sun.target);

  const hemi = new THREE.HemisphereLight(0x4a5868, 0x3a3530, 0.06);
  engine.scene.add(hemi);

  // ---------------------------------------------------------------------
  // 7. Per-frame cloud UV drift.
  // ---------------------------------------------------------------------
  engine.onUpdate((delta) => {
    cloud.update(delta);
  });

  // ---------------------------------------------------------------------
  // 8. Resize / orientation handling — recompose camera height for
  //    portrait/landscape so the foreground slope stays in frame.
  //    Preserves whatever lateral offset the timeline has reached.
  // ---------------------------------------------------------------------
  window.addEventListener('resize', () => {
    engine.resize();
    const a = window.innerWidth / window.innerHeight;
    const off = a < 1.0 ? -80 : 0;
    const currentTargetX = engine._cameraTarget.x;
    engine.setCameraPosition(
      { x: 0, y: 720 + off, z: 1100 },
      { x: currentTargetX, y: 540 + off, z: -200 }
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
  // Reduced-motion users hold the opening composition for the full duration.
  if (prefersReducedMotion()) return;

  const target = engine._cameraTarget;
  const tl = gsap.timeline({ defaults: { ease: 'none' } });

  // 0.0–2.0s: held composition.
  tl.to({}, { duration: 2.0 });

  // 2.0–10.0s: linear lateral yaw drift via lookAt-target translation.
  tl.to(target, { x: 90, duration: 8.0, ease: 'none' });

  // 10.0–12.0s: decelerated settle. Final frame is held, not looped.
  tl.to(target, { x: 100, duration: 2.0, ease: 'power2.out' });
}

document.addEventListener('DOMContentLoaded', init);
