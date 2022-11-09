---
'@lerepo/cli': patch
'@lerepo/detect-pm': patch
'@lerepo/detect-pm-cli': patch
'@lerepo/web-app': patch
---

Refactor the build system to properly work with monorepo workspaces.

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
