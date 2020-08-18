import { Cli } from 'clipanion';
import { CommandContext } from './core/context';
import * as _ from 'lodash';
import { WebCommand } from './commands/web/command';

export async function main(): Promise<void> {
  async function run(): Promise<void> {
    const cli = Cli.from<CommandContext>([WebCommand], {
      binaryLabel: `LeRepo Tools`,
      binaryName: `lrt`,
      binaryVersion: `1.0.0`
    });

    // Strip global command line options (quiet, silent, colors)
    const args = _.slice(process.argv, 2);
    const commonOptions = _.pull(args, '--no-colors', '--quiet', '--silent');

    await cli.runExit(args, {
      ...Cli.defaultContext,
      cwd: process.cwd(),
      quiet: commonOptions.includes('--quiet'),
      silent: commonOptions.includes('--silent'),
      colors: !commonOptions.includes('--no-colors')
    });
  }

  return run().catch((error) => {
    process.stdout.write(error.stack || error.message);
    process.exitCode = 1;
  });
}
