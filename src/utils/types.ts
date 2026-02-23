export type OutputFormat = 'table' | 'json' | 'pretty';

export interface BaseOptions {
  format: OutputFormat;
  serverLogs: boolean;
}
