export type Engines = {
  npm?: string;
  pnpm?: string;
  yarn?: string;
} & Record<string, string>;

export type Manifest = {
  engines?: Engines;
} & Record<string, unknown>;
