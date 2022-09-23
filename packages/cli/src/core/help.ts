import { BaseCommand } from './base-command';

export class HelpCommand extends BaseCommand {
  static paths = [[`help`, `--help`, `-h`]];
  async execute(): Promise<0 | 1> {
    this.context.stdout.write(this.cli.usage(null));
    return Promise.resolve(0);
  }
}
