# Web UI to the workspace tools

You can anlyze and visualize dependencies inside a multi-workspace projects
using a graphical interface provided by a locally served web app.

## Usage

The easiest way to start the web app is to run it through `yarn dlx`:

```shell
$ yarn dlx -p @lerop/cli lrt web
➤ YN0000: ┌ Resolution step
➤ YN0000: └ Completed in 15.34s
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed in 0.25s
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed in 0.55s
➤ YN0000: Done in 16.18s

start web serverServer is listening at http://localhost:3211
```

Then simply open a web browser and point it at the server URL displayed by the
CLI command.
