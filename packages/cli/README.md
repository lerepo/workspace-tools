# Workspace tools command line interface

LeRepo CLI `lrt` is the entry point to the collection of workspace tools for
enhancing and simplifying the experience of using multi-workspace monorepos.

It currently supports the following commands:

- **lrt web**: a locally served web app to visualize and analyze dependencies
  inside a multi-workspace project,

## Usage

The easiest way to invoke the CLI with zero impact on the project is to run it
through `yarn dlx`. For example:

```shell
$ yarn dlx -p @lerepo/cli lrt web
➤ YN0000: ┌ Resolution step
➤ YN0000: └ Completed in 15.34s
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed in 0.25s
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed in 0.55s
➤ YN0000: Done in 16.18s

Start web server
Server is listening at http://localhost:3211
```
