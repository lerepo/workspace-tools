# @lerepo/web-app

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

## 0.2.1

### Patch Changes

- Reformatted code for consistent style.

## 0.2.0

### Minor Changes

- Added release lifecycle

## 0.1.0

### Minor Changes

- Update dependencies and do a major cleanup of source code.

## 0.0.7

### Patch Changes

- 8713e47: chore: add storybook to the project.
- f806376: chore: add global theme decorator to storybook.

## 0.0.6

### Patch Changes

- 67293d5: chore: use @types/react 16.9.44 (exact) to fix tsc build.
- b604416: chore: use babel defines across all projects

## 0.0.5

### Patch Changes

- 371995f: chore: update dependencies

## 0.0.4

### Patch Changes

- 0fb864d: fix: use addListener instead of addEventListener on the MQL for dark mode as Safari does not support addEventListener.
- 3f7b86d: fix: graph filter text field should not shrink with flex.

## 0.0.3

### Patch Changes

- 2be4c99: ci: fix bad published package

## 0.0.2

### Patch Changes

- eac4bc5: fix: show spinner when API request is pending.
- cc60b7e: chore: update dependencies
- a28c47f: fix: chose a color for graph links more suitable for dark and light themes.

## 0.0.1

### Patch Changes

- 661f13a: chore: Initial version 0.0.1 for package publishing.
