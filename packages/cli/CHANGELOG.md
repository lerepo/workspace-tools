# @lerepo/cli

## 0.2.3

### Patch Changes

- 44ca1cb: Fix: force higher versions for dependencies to resolve known security issues

  https://github.com/lerepo/workspace-tools/security/dependabot/33
  https://github.com/lerepo/workspace-tools/security/dependabot/34
  https://github.com/lerepo/workspace-tools/security/dependabot/35

- Updated dependencies [44ca1cb]
  - @lerepo/web-app@0.2.3

## 0.2.2

### Patch Changes

- 76d4a22: Fix tsc compilation and types declaration output.
- bc7b619: Refactor the build system to properly work with monorepo workspaces.

  - babel: hierarchical config with babel.config.js at the monorepo root and .babelrc.js in each workspace. Build is run at the specific workspace root, but the config is built in layers starting with the root. To run the build from the monorepo root, use: `yarn g:build`.

  - jest: at the monorepo root, a `jest.config.js` references the different workspaces, and then each workspace has its own jest configuration. Tests can be run at the root with `yarn test` and at each workspace, also with `yarn test`. Tests also run seamlessly inside vscode. The jest config uses a custom transformer, placed under `<root>/tools/test` that enables `babel-jest` to take advantage of babel's hierarchical config.

  - typescript: config is hierarchical, with the root config having references to the workspaces. Each workspace then has custom specific config added in its own config files. Compilation scripts should be started from a specific
    workspace.

  - eslint: although the configuration is only defined at the monorepo root,
    linting can be seamlessly started from a specific workspace to limit the scope
    to that workspace with `yarn lint`, or from the monorepo for global linting
    with `yarn g:lint`.

  - prettier: similarly to linting, the configuration for prettier is only defined
    at the monorepo root. This is simply because the action of formatting applies
    either to all files or to the staged files and is not specific to a
    workspace. The scripts can be launched from the root with `yarn g:format` or
    from any workspace with `yarn format`.

- Updated dependencies [76d4a22]
- Updated dependencies [bc7b619]
  - @lerepo/web-app@0.2.2

## 0.2.1

### Patch Changes

- Reformatted code for consistent style.
- Updated dependencies
  - @lerepo/web-app@0.2.1

## 0.2.0

### Minor Changes

- Added release lifecycle

### Patch Changes

- Updated dependencies
  - @lerepo/web-app@0.2.0

## 0.1.0

### Minor Changes

- Update dependencies and do a major cleanup of source code.

### Patch Changes

- Updated dependencies
  - @lerepo/web-app@0.1.0

## 0.0.9

### Patch Changes

- Updated dependencies [8713e47]
- Updated dependencies [f806376]
  - @lerepo/web-app@0.0.7

## 0.0.8

### Patch Changes

- b604416: chore: use babel defines across all projects
- Updated dependencies [67293d5]
- Updated dependencies [b604416]
  - @lerepo/web-app@0.0.6

## 0.0.7

### Patch Changes

- 1923f05: chore: remove too verbose console log.
- 2087a39: fix: typos and console messages
- e76d402: chore: use default port (3000) to open browser in dev environment.
- 6633cf3: feat: add version command (--version, -v)
- 08a5d55: fix: use correct version from package.json

## 0.0.6

### Patch Changes

- 371995f: chore: update dependencies
- Updated dependencies [371995f]
  - @lerepo/web-app@0.0.5

## 0.0.5

### Patch Changes

- Updated dependencies [0fb864d]
- Updated dependencies [3f7b86d]
  - @lerepo/web-app@0.0.4

## 0.0.3

### Patch Changes

- 4c63bae: feat: configurable server port and host as command line options to the `web` command.
- cc60b7e: chore: update dependencies
- Updated dependencies [eac4bc5]
- Updated dependencies [cc60b7e]
- Updated dependencies [a28c47f]
  - @lerepo/web-app@0.0.2

## 0.0.1

### Patch Changes

- a1d0ceb: chore: add usage information to the web command

- Updated dependencies [661f13a]

  - @lerepo/web-app@0.0.1
