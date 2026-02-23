import type { OutputFormat } from '../utils/types.js';
import { formatJson } from './json.js';
import { formatPretty } from './pretty.js';
import * as table from './table.js';

export function output(data: unknown, format: OutputFormat, kind: string): void {
  if (format === 'json') {
    process.stdout.write(formatJson(data) + '\n');
    return;
  }
  if (format === 'pretty') {
    process.stdout.write(formatPretty(data) + '\n');
    return;
  }

  // Table format — dispatch based on kind
  let text: string;
  switch (kind) {
    case 'tools':
      text = table.formatToolsTable((data as any).tools ?? []);
      break;
    case 'call':
      text = table.formatCallResult(data as any);
      break;
    case 'resources':
      text = table.formatResourcesTable((data as any).resources ?? []);
      break;
    case 'prompts':
      text = table.formatPromptsTable((data as any).prompts ?? []);
      break;
    case 'prompt':
      text = table.formatPromptResult(data as any);
      break;
    case 'resource':
      text = table.formatResourceResult(data as any);
      break;
    default:
      text = formatPretty(data);
  }
  process.stdout.write(text + '\n');
}
