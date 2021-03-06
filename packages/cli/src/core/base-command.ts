import { CommandContext } from './context';
import { Command } from 'clipanion';

export abstract class BaseCommand extends Command<CommandContext> {
  @Command.String(`--cwd`, { hidden: true })
  cwd?: string;

  abstract execute(): Promise<number | void>;
}
