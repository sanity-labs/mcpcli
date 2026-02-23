import type { OutputFormat } from './types.js';

/**
 * Resolve the output format from a string option.
 * Falls back to 'table' if the value is not recognized or not provided.
 */
export function resolveFormat(format?: string): OutputFormat {
  if (format === 'json' || format === 'pretty' || format === 'table') {
    return format;
  }
  // Default: if running in a TTY use table, otherwise json
  return isTTY() ? 'table' : 'json';
}

export function isTTY(): boolean {
  return process.stdout.isTTY === true;
}
