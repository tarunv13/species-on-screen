/*
  src/atlas/interaction-web.js
  ----------------------------
  Pure model of the atlas interaction web as a set of RO-typed, laterally
  FOLLOWABLE edges — the D4 primitive of the Observatory v2 Interaction Grammar
  ("follow = an RO-typed lateral edge at the same depth").

  For each actor it lists that actor's edges to its neighbours; each edge is
  typed by its OBO Relations Ontology relation (the controlled IRI the reference
  validator checks) and names the neighbour to FOLLOW to — a lateral move at the
  same analytical depth. Derived entirely from the archive's occurrence +
  resource-relationship records; nothing hand-authored.

  Dependency-free (no DOM, no imports) so it is unit-testable in Node and shared
  by src/atlas/field-record.js. Rendering (HTML) lives in the caller.
*/

// The controlled interaction-type IRI: the OBO Relations Ontology PURL pattern.
// Mirrors scripts/check-bindings.js CONTROLLED_RELATION_IRI exactly — an edge is
// "typed" iff its relationshipOfResourceID matches this. Standards reuse only.
export const RO_IRI = /^https?:\/\/purl\.obolibrary\.org\/obo\/RO_\d+$/;
export const isRoIri = (s) => RO_IRI.test((s == null ? '' : String(s)).trim());

/**
 * Build the followable, RO-typed interaction-web model.
 * @param {Array<{id:string,vern?:string,sci?:string}>} actors  occurrence actors.
 * @param {Array<{from:string,to:string,type?:string,roid?:string,according?:string}>} rels
 *        the ResourceRelationship edges.
 * @returns {Array<{id,vern,sci,edges:Array<{relType,iri,typed,dir,otherId,otherVern,according}>}>}
 *          one node per actor; `dir` is 'out' (actor is subject) or 'in' (object);
 *          `iri` is the controlled OBO RO IRI or null (`typed` false) — never faked.
 */
export function interactionWebModel(actors, rels) {
  const list = Array.isArray(actors) ? actors : [];
  const edgeList = Array.isArray(rels) ? rels : [];
  const byId = new Map(list.map((a) => [a.id, a]));
  return list.map((a) => {
    const edges = edgeList
      .filter((r) => r.from === a.id || r.to === a.id)
      .map((r) => {
        const outgoing = r.from === a.id;
        const otherId = outgoing ? r.to : r.from;
        const other = byId.get(otherId) || {};
        const typed = isRoIri(r.roid);
        return {
          relType: r.type || '',
          iri: typed ? String(r.roid).trim() : null,
          typed,
          dir: outgoing ? 'out' : 'in',
          otherId,
          otherVern: other.vern || otherId,
          according: r.according || '',
        };
      });
    return { id: a.id, vern: a.vern || a.id, sci: a.sci || '', edges };
  });
}
