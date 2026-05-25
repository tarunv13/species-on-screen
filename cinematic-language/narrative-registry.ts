/*
  Narrative Registry.
  -------------------
  The single runtime access point for EcologicalNarrative records.

  Discovery is filesystem-first: every `*.ts` file under
  `./narratives/` whose default export is a structurally valid
  EcologicalNarrative is registered at build time via Vite's
  `import.meta.glob({ eager: true })`. Malformed or duplicate-id files
  are excluded and their paths recorded for inspection; the registry
  itself never throws. Adding a narrative is creating a new file
  under `./narratives/` named `<id>.ts` and default-exporting an
  EcologicalNarrative.

  The registry is shared substrate for both the cinematic and
  research surfaces. Each surface picks its own subset of fields from
  each narrative. The registry does not enforce that picking — that
  is governed by `platform-architecture.md` §5 and is the consumer's
  responsibility.

  This module imports types only from `./ecological-narrative.example`
  (the v1 schema, frozen). It owns no doctrine.
*/

import type { EcologicalNarrative } from './ecological-narrative.example';

interface NarrativeModule {
  default: unknown;
}

const modules = import.meta.glob<NarrativeModule>(
  './narratives/*.ts',
  { eager: true }
);

const registry = new Map<string, EcologicalNarrative>();
const malformed: Array<{ path: string; reason: string }> = [];

for (const [path, mod] of Object.entries(modules)) {
  const candidate = (mod as NarrativeModule).default;
  const result = validate(candidate);
  if (!result.ok) {
    malformed.push({ path, reason: result.reason });
    continue;
  }
  if (registry.has(result.value.id)) {
    malformed.push({
      path,
      reason: `duplicate id "${result.value.id}"`
    });
    continue;
  }
  registry.set(result.value.id, result.value);
}

/* ---------- Public API ---------- */

/**
 * Look up a single narrative by its `id`. Returns `undefined` if the
 * id is not registered. Consumers must handle absence; the registry
 * never throws on missing ids.
 */
export function getNarrativeById(
  id: string
): EcologicalNarrative | undefined {
  return registry.get(id);
}

/**
 * Return every registered narrative, in arbitrary order. Useful for
 * indexes, archives, and anything that needs the full set. Does NOT
 * imply UI listing — the cinematic surface is forbidden from
 * rendering narrative lists per `platform-architecture.md` §3.
 */
export function listNarratives(): readonly EcologicalNarrative[] {
  return Array.from(registry.values());
}

/**
 * Return a list of narrative files that failed structural validation
 * or duplicate-id checks at build time, with a short reason per
 * entry. Useful for diagnostics and CI checks; never thrown by the
 * registry.
 */
export function getMalformed(): ReadonlyArray<{
  path: string;
  reason: string;
}> {
  return malformed;
}

/**
 * Return the count of registered narratives. Cheap; does not iterate.
 */
export function narrativeCount(): number {
  return registry.size;
}

/* ---------- Internal: structural validation ---------- */

type ValidationResult =
  | { ok: true; value: EcologicalNarrative }
  | { ok: false; reason: string };

/**
 * Minimum-viable structural check on an unknown candidate. The intent
 * is not to re-implement TypeScript at runtime but to catch the
 * realistic failure modes:
 *
 *   - the file's default export is missing or wrong shape
 *   - a required field is absent or empty
 *   - sources is empty (a narrative without sources is not attested
 *     and must not be served per the schema's own contract)
 *   - schemaVersion drift (a v2 narrative landing in a v1 registry)
 *
 * Stricter validation (enum membership, source-kind discrimination,
 * coordinate ranges) is left to TypeScript at author time.
 */
function validate(obj: unknown): ValidationResult {
  if (!obj || typeof obj !== 'object') {
    return { ok: false, reason: 'default export is not an object' };
  }
  const n = obj as Record<string, unknown>;

  if (typeof n.id !== 'string' || n.id.length === 0) {
    return { ok: false, reason: 'missing or empty id' };
  }

  const place = n.place as Record<string, unknown> | undefined;
  if (!place || typeof place.name !== 'string' || place.name.length === 0) {
    return { ok: false, reason: 'missing place.name' };
  }

  const species = n.species as Record<string, unknown> | undefined;
  if (
    !species ||
    typeof species.scientificName !== 'string' ||
    species.scientificName.length === 0
  ) {
    return { ok: false, reason: 'missing species.scientificName' };
  }

  const observation = n.observation as Record<string, unknown> | undefined;
  if (
    !observation ||
    typeof observation.summary !== 'string' ||
    observation.summary.length === 0
  ) {
    return { ok: false, reason: 'missing observation.summary' };
  }

  if (!Array.isArray(n.sources) || n.sources.length === 0) {
    return { ok: false, reason: 'sources must be a non-empty array' };
  }

  const editorial = n.editorial as Record<string, unknown> | undefined;
  if (
    !editorial ||
    typeof editorial.fragment !== 'string' ||
    editorial.fragment.length === 0
  ) {
    return { ok: false, reason: 'missing editorial.fragment' };
  }

  const metadata = n.metadata as Record<string, unknown> | undefined;
  if (!metadata || metadata.schemaVersion !== '1') {
    return {
      ok: false,
      reason: 'metadata.schemaVersion must be "1" (v1 registry)'
    };
  }

  return { ok: true, value: n as unknown as EcologicalNarrative };
}
