import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

export function createTransport(
  serverArgs: string[],
  serverLogs: boolean
): StdioClientTransport | SSEClientTransport | StreamableHTTPClientTransport {
  const first = serverArgs[0];

  if (first.startsWith('http://') || first.startsWith('https://')) {
    const url = new URL(first);
    if (first.endsWith('/sse')) {
      return new SSEClientTransport(url);
    } else {
      return new StreamableHTTPClientTransport(url);
    }
  }

  // Stdio transport: first arg is the command, rest are args
  return new StdioClientTransport({
    command: serverArgs[0],
    args: serverArgs.slice(1),
    stderr: serverLogs ? 'pipe' : 'ignore',
  });
}
