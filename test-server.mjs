import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  { name: 'test-server', version: '1.0.0' },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// Tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'greet',
      description: 'Greet someone by name',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Name to greet' },
          enthusiasm: { type: 'integer', description: 'Number of exclamation marks' },
        },
        required: ['name'],
      },
    },
    {
      name: 'add',
      description: 'Add two numbers',
      inputSchema: {
        type: 'object',
        properties: {
          a: { type: 'number', description: 'First number' },
          b: { type: 'number', description: 'Second number' },
        },
        required: ['a', 'b'],
      },
    },
    {
      name: 'list_files',
      description: 'List files in a directory',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Directory path' },
          recursive: { type: 'boolean', description: 'Include subdirectories' },
          extensions: { type: 'array', items: { type: 'string' }, description: 'File extensions to filter' },
        },
        required: ['path'],
      },
    },
  ],
}));

// Tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === 'greet') {
    const bangs = '!'.repeat(args?.enthusiasm ?? 1);
    return {
      content: [{ type: 'text', text: `Hello, ${args?.name}${bangs}` }],
    };
  }
  
  if (name === 'add') {
    return {
      content: [{ type: 'text', text: `${args?.a} + ${args?.b} = ${(args?.a ?? 0) + (args?.b ?? 0)}` }],
    };
  }
  
  if (name === 'list_files') {
    return {
      content: [{ type: 'text', text: `Files in ${args?.path}:\n- README.md\n- package.json\n- src/index.ts` }],
    };
  }
  
  return {
    content: [{ type: 'text', text: `Unknown tool: ${name}` }],
    isError: true,
  };
});

// Resources
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    { uri: 'file:///README.md', name: 'README', description: 'Project documentation', mimeType: 'text/markdown' },
    { uri: 'config://app', name: 'App Config', description: 'Application configuration' },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => ({
  contents: [{ uri: request.params.uri, text: `Content of ${request.params.uri}`, mimeType: 'text/plain' }],
}));

// Prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: [
    {
      name: 'summarize',
      description: 'Summarize text content',
      arguments: [
        { name: 'text', description: 'Text to summarize', required: true },
        { name: 'style', description: 'Summary style (brief, detailed, bullet)', required: false },
      ],
    },
  ],
}));

server.setRequestHandler(GetPromptRequestSchema, async (request) => ({
  messages: [
    { role: 'user', content: { type: 'text', text: `Please summarize: ${request.params.arguments?.text ?? '(no text)'}` } },
  ],
}));

const transport = new StdioServerTransport();
await server.connect(transport);
