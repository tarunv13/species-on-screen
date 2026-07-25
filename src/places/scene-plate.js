/*
  Scene plate slot — Sprint V1.2
  (governed by .agents/decisions/2026-07-25-visual-layer-recovery.md)
  ------------------------------------------------------------------
  Additive, drop-in upgrade of a cinematic place's PROCEDURAL horizon to
  authored plates that are held in darkness (Article VI), captionless, and
  given no UI (cinematic purity; D3 affordance-sink). One level up from the
  species plate slot (public/art/STYLE-GUIDE.md): here the PLACE itself is
  the plate.

  STRICTLY ADDITIVE. With an empty public/art/ this creates no element,
  hides no procedural drawing, and the scene renders byte-identical to the
  procedural baseline. A plate only ever mutates the DOM once its image has
  actually loaded; absence is the silent, unchanged default.

  Resolution order (per the sprint spec): 3D (if wired) -> layered -> flat
  -> procedural. This DOM surface wires LAYERED and FLAT; the 3D tier is
  reserved (no 3D renderer is wired into the DOM descent — that slot lives
  on the living-place threshold prototype, public/art/3d/<biome>.glb).

  Spatially-forward, without a new motion system:
    - Depth is DECLARED canonically in cinematic-language/place-manifest.json
      (cinematic.scene.layers[].z, notional metres). Those z values are what
      a future spatial/WebXR renderer extrudes into a scene graph.
    - At runtime a plate is mounted INSIDE its existing parallax layer
      element, so it inherits that layer's descent-timeline transform AND
      its breath/cursor parallax offset unchanged — exactly the mechanism
      #sceneInscription already relies on. The descent timeline, the scroll
      governor, and the Descent Approval invariants (C1-C5+R) are untouched.
      Per-layer offset therefore still scales inversely with the declared z,
      via the existing DEPTH_COEF, not via anything computed here.

  File convention (drop a file, no code change):
    layered : public/art/scene/<sceneSlug>/<layerId>.{webp,png,jpg,svg}
    flat    : public/art/scene/<sceneSlug>.{webp,png,jpg,svg}
*/

const EXTS = ['webp', 'png', 'jpg', 'svg'];
const BASE = import.meta.env.BASE_URL || '/';

/** Resolve one image URL. Resolves to the loaded <img>, or null on failure. */
function probe(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/** First candidate that loads, trying extensions in order. */
async function firstThatLoads(prefix) {
  for (const ext of EXTS) {
    const img = await probe(`${BASE}${prefix}.${ext}`);
    if (img) return img;
  }
  return null;
}

function hideProcedural(el) {
  if (!el) return;
  // Hide only the procedural drawing (the <svg>). The layer <div> keeps its
  // descent/parallax animation, and non-svg children (e.g. #sceneInscription)
  // are left untouched.
  el.querySelectorAll('svg').forEach((svg) => { svg.style.display = 'none'; });
}

function mountInto(el, img, name, flat) {
  if (!el) return;
  hideProcedural(el);
  img.classList.add('scene-plate');
  if (flat) img.classList.add('scene-plate--flat');
  img.setAttribute('data-plate', name);
  img.setAttribute('aria-hidden', 'true');
  img.alt = '';
  img.draggable = false;
  // Insert behind existing children so any sibling (the inscription) stays on
  // top and the plate takes the hidden procedural drawing's place.
  el.insertBefore(img, el.firstChild);
}

/**
 * Mount authored scene plates for one cinematic place, if any exist.
 *
 * @param {string} sceneSlug  cinematic slug, e.g. 'sundarbans'
 * @param {{id:string, selector:string}[]} layers  far->near; each maps a
 *        declared layer id to the parallax layer element it mounts inside.
 * @param {{flatSelector?:string}} [opts]  where a single flat backdrop mounts
 *        (defaults to the farthest layer). Choose a layer that is visible at
 *        the threshold and opacity-stable through the descent.
 * @returns {Promise<{tier:'layered'|'flat'|'procedural', mounted:string[]}>}
 *          Fire-and-forget; the descent never awaits this. Returned for QA.
 */
export async function mountScenePlates(sceneSlug, layers, opts = {}) {
  // Tier: LAYERED. Each layer independently uses its plate if present, else
  // keeps its procedural drawing — so authoring is progressive (far first is
  // fine). The tier is "active" if at least one layer plate loaded.
  const hits = await Promise.all(
    layers.map(async (ly) => ({ ly, img: await firstThatLoads(`art/scene/${sceneSlug}/${ly.id}`) }))
  );
  if (hits.some((h) => h.img)) {
    const mounted = [];
    for (const { ly, img } of hits) {
      if (img) { mountInto(document.querySelector(ly.selector), img, ly.id, false); mounted.push(ly.id); }
    }
    return { tier: 'layered', mounted };
  }

  // Tier: FLAT. A single backdrop replaces the whole procedural horizon.
  const flat = await firstThatLoads(`art/scene/${sceneSlug}`);
  if (flat) {
    for (const ly of layers) hideProcedural(document.querySelector(ly.selector));
    const flatSel = opts.flatSelector || (layers[0] && layers[0].selector);
    mountInto(document.querySelector(flatSel), flat, `${sceneSlug}-flat`, true);
    return { tier: 'flat', mounted: [`${sceneSlug}-flat`] };
  }

  // Tier: PROCEDURAL. Nothing authored — byte-identical to baseline.
  return { tier: 'procedural', mounted: [] };
}

/**
 * Load a single flat scene plate for a place, for CANVAS surfaces that draw
 * the backdrop themselves (Sprint V1.2b — crossing / epr-vents). Uses the
 * SAME probe (BASE, EXTS) as the DOM slot above.
 *   public/art/scene/<sceneSlug>.{webp,png,jpg,svg}
 *
 * @param {string} sceneSlug  cinematic slug, e.g. 'crossing'
 * @returns {Promise<HTMLImageElement|null>}  the loaded image, or null if
 *          none is authored (caller then renders byte-identical to today).
 */
export async function loadFlatPlate(sceneSlug) {
  return firstThatLoads(`art/scene/${sceneSlug}`);
}
