import { BaseContext } from 'clipanion';

export type CommandContext = BaseContext & {
  cwd: string;
  quiet: boolean;
  silent: boolean;
  colors: boolean;
};
