import chalk from 'chalk';
import { schemaToDisplay, formatParams } from '../utils/schema.js';

// Format tools list as a table
export function formatToolsTable(
  tools: Array<{ name: string; description?: string; inputSchema?: any }>,
): string {
  if (tools.length === 0) return '(no tools)';

  const lines: string[] = [];

  for (const tool of tools) {
    const schema = tool.inputSchema ?? {};
    const properties: Record<string, any> = schema.properties ?? {};
    const required: string[] = schema.required ?? [];

    // Build the signature line
    let sig: string;
    if (Object.keys(properties).length > 0) {
      // Build param list inline, matching mcptools style: name:type, [name:type]
      const requiredSet = new Set(required);
      const parts: string[] = [];

      for (const [name, propSchema] of Object.entries(properties)) {
        const type = schemaToDisplay(propSchema as any);
        if (requiredSet.has(name)) {
          parts.push(chalk.green(`${name}:${type}`));
        } else {
          parts.push(chalk.yellow(`[${name}:${type}]`));
        }
      }

      sig = `${chalk.bold.white(tool.name)}(${parts.join(', ')})`;
    } else {
      sig = `${chalk.bold.white(tool.name)}()`;
    }

    lines.push(sig);

    if (tool.description) {
      lines.push(`     ${chalk.dim(tool.description)}`);
    }

    lines.push('');
  }

  // Remove trailing blank line
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }

  return lines.join('\n');
}

// Format resources list as a table
export function formatResourcesTable(
  resources: Array<{
    uri: string;
    name?: string;
    description?: string;
    mimeType?: string;
  }>,
): string {
  if (resources.length === 0) return '(no resources)';

  const lines: string[] = [];

  for (const resource of resources) {
    const header = resource.name
      ? `${chalk.bold(resource.uri)}  ${resource.name}`
      : chalk.bold(resource.uri);

    lines.push(header);

    if (resource.description) {
      lines.push(`     ${chalk.dim(resource.description)}`);
    }

    if (resource.mimeType) {
      lines.push(`     ${chalk.dim(resource.mimeType)}`);
    }

    lines.push('');
  }

  if (lines[lines.length - 1] === '') {
    lines.pop();
  }

  return lines.join('\n');
}

// Format prompts list as a table
export function formatPromptsTable(
  prompts: Array<{
    name: string;
    description?: string;
    arguments?: Array<{
      name: string;
      description?: string;
      required?: boolean;
    }>;
  }>,
): string {
  if (prompts.length === 0) return '(no prompts)';

  const lines: string[] = [];

  for (const prompt of prompts) {
    const args = prompt.arguments ?? [];

    let sig: string;
    if (args.length > 0) {
      const parts = args.map((arg) => {
        if (arg.required) {
          return chalk.green(`${arg.name}(str)`);
        }
        return chalk.yellow(`[${arg.name}(str)]`);
      });
      sig = `${chalk.bold(prompt.name)}(${parts.join(', ')})`;
    } else {
      sig = chalk.bold(prompt.name);
    }

    lines.push(sig);

    if (prompt.description) {
      lines.push(`     ${chalk.dim(prompt.description)}`);
    }

    lines.push('');
  }

  if (lines[lines.length - 1] === '') {
    lines.pop();
  }

  return lines.join('\n');
}

// Format a tool call result
export function formatCallResult(result: {
  content: Array<{
    type: string;
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}): string {
  const parts: string[] = [];

  for (const item of result.content) {
    let text: string;

    if (item.type === 'text') {
      text = item.text ?? '';
    } else if (item.type === 'image') {
      text = `[Image: ${item.mimeType ?? 'unknown'}]`;
    } else {
      text = `[${item.type}]`;
    }

    if (result.isError) {
      parts.push(chalk.red(text));
    } else {
      parts.push(text);
    }
  }

  return parts.join('\n');
}

// Format a prompt get result
export function formatPromptResult(result: {
  messages: Array<{
    role: string;
    content: { type: string; text?: string };
  }>;
  description?: string;
}): string {
  const lines: string[] = [];

  if (result.description) {
    lines.push(chalk.dim(result.description));
    lines.push('');
  }

  for (const message of result.messages) {
    lines.push(chalk.bold(`[${message.role}]`));
    if (message.content.type === 'text') {
      lines.push(message.content.text ?? '');
    } else {
      lines.push(`[${message.content.type}]`);
    }
    lines.push('');
  }

  if (lines[lines.length - 1] === '') {
    lines.pop();
  }

  return lines.join('\n');
}

// Format a resource read result
export function formatResourceResult(result: {
  contents: Array<{
    uri: string;
    text?: string;
    blob?: string;
    mimeType?: string;
  }>;
}): string {
  const parts: string[] = [];

  for (const content of result.contents) {
    if (result.contents.length > 1) {
      parts.push(chalk.bold(content.uri));
    }

    if (content.text !== undefined) {
      parts.push(content.text);
    } else if (content.blob !== undefined) {
      parts.push(`[Binary data: ${content.mimeType ?? 'unknown'}]`);
    } else {
      parts.push(`[Empty: ${content.uri}]`);
    }
  }

  return parts.join('\n');
}
