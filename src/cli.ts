import { Command } from 'commander';
import { toolsCommand } from './commands/tools.js';
import { callCommand } from './commands/call.js';
import { resourcesCommand } from './commands/resources.js';
import { promptsCommand } from './commands/prompts.js';
import { getPromptCommand } from './commands/get-prompt.js';
import { readResourceCommand } from './commands/read-resource.js';

export const program = new Command();

program
  .name('mcpcli')
  .description('CLI for interacting with MCP servers — TypeScript alternative to mcptools')
  .version('0.1.0')
  .option('-f, --format <format>', 'Output format: table, json, or pretty', 'table')
  .option('--server-logs', 'Show server stderr logs');

// tools <server...>
program
  .command('tools')
  .description('List available tools from an MCP server')
  .argument('<server...>', 'Server command and arguments (or HTTP URL)')
  .action(async (server: string[]) => {
    const { format, serverLogs } = program.opts<{ format: string; serverLogs: boolean }>();
    try {
      await toolsCommand(server, { format, serverLogs: !!serverLogs });
    } catch (err) {
      console.error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

// call <tool-name> <server...>
program
  .command('call')
  .description('Call a tool on an MCP server')
  .argument('<tool-name>', 'Name of the tool to call')
  .argument('<server...>', 'Server command and arguments (or HTTP URL)')
  .option('-p, --params <json>', 'JSON parameters to pass to the tool', '{}')
  .action(async (toolName: string, server: string[], opts: { params: string }) => {
    const { format, serverLogs } = program.opts<{ format: string; serverLogs: boolean }>();
    try {
      await callCommand(server, toolName, opts.params, { format, serverLogs: !!serverLogs });
    } catch (err) {
      console.error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

// resources <server...>
program
  .command('resources')
  .description('List resources from an MCP server')
  .argument('<server...>', 'Server command and arguments (or HTTP URL)')
  .action(async (server: string[]) => {
    const { format, serverLogs } = program.opts<{ format: string; serverLogs: boolean }>();
    try {
      await resourcesCommand(server, { format, serverLogs: !!serverLogs });
    } catch (err) {
      console.error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

// prompts <server...>
program
  .command('prompts')
  .description('List prompts from an MCP server')
  .argument('<server...>', 'Server command and arguments (or HTTP URL)')
  .action(async (server: string[]) => {
    const { format, serverLogs } = program.opts<{ format: string; serverLogs: boolean }>();
    try {
      await promptsCommand(server, { format, serverLogs: !!serverLogs });
    } catch (err) {
      console.error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

// get-prompt <prompt-name> <server...>
program
  .command('get-prompt')
  .description('Get a prompt from an MCP server')
  .argument('<prompt-name>', 'Name of the prompt to retrieve')
  .argument('<server...>', 'Server command and arguments (or HTTP URL)')
  .option('-p, --params <json>', 'JSON parameters to pass to the prompt', '{}')
  .action(async (promptName: string, server: string[], opts: { params: string }) => {
    const { format, serverLogs } = program.opts<{ format: string; serverLogs: boolean }>();
    try {
      await getPromptCommand(server, promptName, opts.params, { format, serverLogs: !!serverLogs });
    } catch (err) {
      console.error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

// read-resource <uri> <server...>
program
  .command('read-resource')
  .description('Read a resource from an MCP server')
  .argument('<uri>', 'URI of the resource to read')
  .argument('<server...>', 'Server command and arguments (or HTTP URL)')
  .action(async (uri: string, server: string[]) => {
    const { format, serverLogs } = program.opts<{ format: string; serverLogs: boolean }>();
    try {
      await readResourceCommand(server, uri, { format, serverLogs: !!serverLogs });
    } catch (err) {
      console.error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });
