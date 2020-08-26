import { Command } from 'clipanion';
import { BaseCommand } from './base-command';

export class VersionCommand extends BaseCommand {
  @Command.Path(`--version`)
  @Command.Path(`-v`)
  async execute(): Promise<0 | 1> {
    this.context.stdout.write(`${this.cli.binaryVersion}\n`);
    return 0;
  }
}
