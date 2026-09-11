/*
  The trophic-role palette — one definition, two consumers.

  These nine colours were authored for the interaction web's canvas actors and
  are now also read by the occurrence map, so they live here rather than in
  either. The V1.5 map spec says "colour by trophic role using the existing
  interaction-web palette, no new colours"; the only way to guarantee that
  mechanically is for there to be exactly one array to read.

  Values are unchanged from field-record.js, where they were defined. This is
  extraction, not re-authoring — the same move the cinematic sheets made for
  their measures on 2026-09-10.
*/
export const ROLE_PALETTE = {
  primary_producer: [127, 214, 160],
  pollinator: [255, 212, 128],
  herbivore: [206, 196, 150],
  detritivore: [184, 152, 120],
  consumer: [120, 182, 212],
  predator: [128, 205, 222],
  mesopredator: [176, 200, 210],
  apex_predator: [232, 150, 96],
  human_community: [236, 170, 112],
};
