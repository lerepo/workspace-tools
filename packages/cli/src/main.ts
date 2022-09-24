import * as _ from 'lodash';
import { Cli } from 'clipanion';
import { VersionCommand } from 'clipanion/lib/advanced/builtins';

import { CommandContext } from '@/core/context';
import { HelpCommand } from '@/core/help';
import { WebCommand } from '@/commands/web/command';

import { version } from '../package.json';

export async function main(): Promise<void> {
  async function run(): Promise<void> {
    const cli = Cli.from<CommandContext>(
      [WebCommand, HelpCommand, VersionCommand],
      {
        binaryLabel: `LeRepo Tools`,
        binaryName: `lrt`,
        binaryVersion: version
      }
    );

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
