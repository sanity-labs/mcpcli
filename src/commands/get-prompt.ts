import { createClient } from '../client.js';
import { output } from '../format/index.js';
import { resolveFormat } from '../utils/tty.js';

export async function getPromptCommand(
  serverArgs: string[],
  promptName: string,
  params: string = '{}',
  options: { format?: string; serverLogs?: boolean }
): Promise<void> {
  let parsedParams: Record<string, string>;
  try {
    parsedParams = JSON.parse(params);
  } catch (err) {
    console.error(`Error: Invalid JSON in --params: ${err}`);
    process.exit(1);
  }

  const format = resolveFormat(options.format);
  const client = await createClient(serverArgs, options.serverLogs ?? false);
  try {
    const result = await client.getPrompt({ name: promptName, arguments: parsedParams });
    output(result, format, 'prompt');
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await client.close();
  }
}
