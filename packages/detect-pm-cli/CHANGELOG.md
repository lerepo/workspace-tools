# @lerepo/detect-package-manager-cli

## 0.4.2

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

- Updated dependencies [f169a74]
- Updated dependencies [76d4a22]
- Updated dependencies [bc7b619]
  - @lerepo/detect-pm@0.3.3

## 0.4.1

### Patch Changes

- Reformatted code for consistent style.
- Updated dependencies
  - @lerepo/detect-pm@0.3.1

## 0.4.0

### Minor Changes

- Added release lifecycle

### Patch Changes

- Updated dependencies
  - @lerepo/detect-pm@0.3.0

## 0.3.0

### Minor Changes

- Update dependencies and do a major cleanup of source code.

### Patch Changes

- Updated dependencies
  - @lerepo/detect-pm@0.2.0

## 0.2.1

### Patch Changes

- b604416: chore: use babel defines across all projects
- Updated dependencies [b604416]
  - @lerepo/detect-package-manager@0.1.1

## 0.2.0

### Minor Changes

- 4fa2e70: fix: fix typo in cli binary name

### Patch Changes

- 5b4c356: docs: fix command line example

## 0.1.0

### Minor Changes

- 46e2eba: feat: Initial version.

### Patch Changes

- Updated dependencies [46e2eba]
  - @lerepo/detect-package-manager@0.1.0
