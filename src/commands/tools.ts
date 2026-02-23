import { createClient } from '../client.js';
import { output } from '../format/index.js';
import { resolveFormat } from '../utils/tty.js';

export async function toolsCommand(
  serverArgs: string[],
  options: { format?: string; serverLogs?: boolean }
): Promise<void> {
  const format = resolveFormat(options.format);
  const client = await createClient(serverArgs, options.serverLogs ?? false);
  try {
    const result = await client.listTools();
    output(result, format, 'tools');
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await client.close();
  }
}
