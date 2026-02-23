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
  // Pass full process.env so API keys (FAL_KEY, etc.) are inherited.
  // The SDK default only passes HOME, PATH, SHELL, TERM, USER, LOGNAME.
  return new StdioClientTransport({
    command: serverArgs[0],
    args: serverArgs.slice(1),
    env: { ...process.env } as Record<string, string>,
    stderr: serverLogs ? 'pipe' : 'ignore',
  });
}
