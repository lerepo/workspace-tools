# Detect which package manager is being used

This is a library and a cli to automatically detect which package manager is
being used in the current project. The project can be a single workspace or a
multi-workspace project.

Detected package managers are:

- npm
- yarn (v1)
- yarn berry (v2)
- pnpm

## CLI Usage

The easiest way to invoke the CLI with zero impact on the project is to run it
through `yarn dlx` or `npx`. For example:

```shell
$ yarn dlx -p @lerepo/detect-package-manager detect-pm
yarn 2.1.1

$ yarn dlx -p @lerepo/detect-package-manager detect-pm --help
Detect installed or used package managers.

Usage:

$ detect-pm [--preference,-p #0] [--cwd #0] [--json] [--installed]

Details:

This command will detect the package manager used in the workspace/project. It
used any available `engines` section in the package manifests or package manager
specific files in the project hierarchy to identify the package manager. If no
such information is available in the current working directory, it crawls the
hierarchy until it finds the root project or it reaches the root of the
filesystem. To set the starting working directory to a different value from the
current one, you can use the `--cwd` option. If the `--installed` option is set,
it will instead detect the installed package managers in the environment. If you
want the output of the command to be in new-line-delimited JSON, set the
`--json` option. The command may find presence of multiple package managers in
the project or definitive choice in the package manifests. In such case, it will
prefer the package managers in the following order `yarn > pnpm > npm`. To
change the preference order, use the `--preference,-p` option (multiple times to
set multiple preferences).

Examples:

Detect using all default options
  $ detect-pm

Detect and output the result in json format
  $ detect-pm --json

Detect and with specific preferences
  $ detect-pm -p pnpm -p yarn

Detect installed package managers
  $ detect-pm --installed

```
