import * as ppath from 'path';

import { Cli, Command } from 'clipanion';
import {
  detectPackageManagers,
  detectInstalledPackageManagers,
  PackageManager
} from '@lerepo/detect-package-manager';

export class HelpCommand extends Command {
  @Command.Path(`help`)
  @Command.Path(`--help`)
  @Command.Path(`-h`)
  async execute(): Promise<0 | 1> {
    this.context.stdout.write(this.cli.usage(DefaultCommand, { detailed: true }));
    return Promise.resolve(0);
  }
}

class DefaultCommand extends Command {
  static usage = Command.Usage({
    description: `Detect installed or used package managers.`,
    details:
      'This command will detect the package manager used in the workspace/project. ' +
      'It uses any available `engines` section in the package manifests or package ' +
      'manager specific files in the project hierarchy to identify the package ' +
      'manager. If no such information is available in the current working directory, ' +
      'it crawls the hierarchy until it finds the root project or it reaches the root ' +
      'of the filesystem. To set the starting working directory to a different value ' +
      'from the current one, you can use the `--cwd` option. If the `--installed` ' +
      'option is set, it will instead detect the installed package managers in the ' +
      'environment. If you want the output of the command to be in new-line-delimited ' +
      'JSON, set the `--json` option. The command may find presence of multiple package ' +
      'managers in the project or definitive choice in the package manifests. In such ' +
      'case, it will prefer the package managers in the following order `yarn > pnpm > npm`. ' +
      'To change the preference order, use the `--preference,-p` option (multiple times ' +
      'to set multiple preferences).',
    examples: [
      [`Detect using all default options`, `$0`],
      [`Detect and output the result in json format`, `$0 --json`],
      [`Detect and with specific preferences`, `$0 -p pnpm -p yarn`],
      [`Detect installed package managers`, `$0 --installed`]
    ]
  });

  @Command.Array('--preference,-p')
  public preference?: string[] = [];

  @Command.String('--cwd')
  public cwd?: string;

  @Command.Boolean('--json')
  public json?: boolean;

  @Command.Boolean('--installed')
  public detectInstalled?: boolean;

  @Command.Path('detect')
  @Command.Path()
  async execute() {
    if (this.detectInstalled) {
      const installed = await detectInstalledPackageManagers();
      if (this.json) {
        installed.map((pm) => {
          this.context.stdout.write(
            `${JSON.stringify({
              name: pm.name,
              version: pm.version,
              workspaces: pm.workspaces
            })}\n`
          );
        });
      } else {
        installed.map((pm) => {
          this.context.stdout.write(`${pm.name} ${pm.version}\n`);
        });
      }
      return;
    }

    const found: PackageManager = await detectPackageManagers({
      cwd: this.cwd ? ppath.resolve(process.cwd(), this.cwd) : process.cwd(),
      preference: this.preference
    });
    if (found !== null) {
      if (this.json) {
        this.context.stdout.write(
          JSON.stringify({
            name: found.name,
            version: found.version,
            workspaces: found.workspaces
          })
        );
      } else {
        this.context.stdout.write(`${found.name} ${found.version}\n`);
      }
    } else {
      this.context.stdout.write(
        "Unable to detect a package manager. Manifests do not contain an 'engines' property and no package manager specific files were found in the project hierarchy.\n"
      );
    }
  }
}

export async function main(): Promise<void> {
  async function run(): Promise<void> {
    const cli = new Cli({
      binaryLabel: `LeRepo Tools - Detect package manager`,
      binaryName: `detect-pm`,
      binaryVersion: `1.0.0`
    });

    cli.register(DefaultCommand);
    cli.register(HelpCommand);
    cli.register(Command.Entries.Version);

    await cli.runExit(process.argv.slice(2), {
      ...Cli.defaultContext
    });
  }

  return run().catch((error) => {
    process.stdout.write(error.stack || error.message);
    process.exitCode = 1;
  });
}
