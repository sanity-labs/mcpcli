import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { createTransport } from './transport/index.js';

export async function createClient(serverArgs: string[], serverLogs: boolean): Promise<Client> {
  const transport = createTransport(serverArgs, serverLogs);
  const client = new Client(
    { name: 'mcpcli', version: '0.1.0' },
    { capabilities: {} }
  );
  await client.connect(transport);
  // Forward server stderr to terminal when --server-logs is enabled
  if (serverLogs && transport instanceof StdioClientTransport) {
    transport.stderr?.pipe(process.stderr);
  }
  return client;
}
