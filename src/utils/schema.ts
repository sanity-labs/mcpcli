/**
 * Convert a JSON Schema property definition to a short display type string.
 * e.g. { type: 'string' } → 'str', { type: 'array', items: { type: 'number' } } → 'num[]'
 */
export function schemaToDisplay(schema: Record<string, unknown>): string {
  const type = schema['type'];
  if (type === 'string') return 'str';
  if (type === 'number' || type === 'integer') return 'num';
  if (type === 'boolean') return 'bool';
  if (type === 'object') return 'obj';
  if (type === 'array') {
    const items = schema['items'] as Record<string, unknown> | undefined;
    if (items) {
      return `${schemaToDisplay(items)}[]`;
    }
    return 'any[]';
  }
  if (Array.isArray(schema['enum'])) return 'enum';
  return 'any';
}

/**
 * Format a params object for display (compact JSON).
 */
export function formatParams(params: Record<string, unknown>): string {
  return JSON.stringify(params);
}

/**
 * Parse a JSON Schema object into a simplified display structure.
 */
export function parseSchema(schema: unknown): Record<string, unknown> {
  if (typeof schema !== 'object' || schema === null) return {};
  return schema as Record<string, unknown>;
}
