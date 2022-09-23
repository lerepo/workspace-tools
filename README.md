# A collection of workspace tools for monorepos

This repo contains a collection of tools to extend and enhance the user
experience inside multi-workspace projects. Currently only yarn v2 (berry)
workspaces are supported:

- **lrt web**: a locally served web app to visualize and analyze dependencies
  inside a multi-workspace project,

## Usage

All the tools are accessible through the CLI.
See [@lerop/cli](https://github.com/lerepo/Workspace-tools/tree/master/packages/cli)
for details.

```shell
yarn workspaces foreach run build
yarn dlx -p @lerepo/cli lrt web
```

This will do the monorepo analysis for this local repo, or if you want to see a
more complicated example:

```shell
yarn start
```

This will do the analysis on yarn berry's monorepo.
