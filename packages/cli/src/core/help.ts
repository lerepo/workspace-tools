import { BaseCommand } from './base-command';
import { Command } from 'clipanion';

export class HelpCommand extends BaseCommand {
  @Command.Path(`help`)
  @Command.Path(`--help`)
  @Command.Path(`-h`)
  async execute(): Promise<0 | 1> {
    this.context.stdout.write(this.cli.usage(null));
    return Promise.resolve(0);
  }
}
