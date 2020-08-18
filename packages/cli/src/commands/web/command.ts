import * as execa from 'execa';
import { Command, Usage } from 'clipanion';
import { BaseCommand } from '../../core';

import { HttpServer, ApiHandler } from './server';

export class WebCommand extends BaseCommand {
  static usage: Usage = Command.Usage({
    description: 'Start the locally served web-app for the lrt UI.',
    details: `
      This command will will start a local HTTP server to serve a web application
      that can be used to interact with the \`lrt\` command line tool. Through the
      app, you can explore the workspace dependencies, visualize them in a graph and
      you can also run a series of checks to audit the dependencies and the health
      of the project workspace.`,
    examples: [
      [
        'Start the app when the `@lerepo/cli` is installed as a dev dependency in the project.',
        'yarn lrt web'
      ],
      ['Start the web application using yarn dlx.', 'yarn dlx -p @lerepo/cli lrt web']
    ]
  });

  @Command.Path('web')
  async execute(): Promise<0 | 1> {
    this.context.stdout.write('start web server');

    const host = 'localhost';
    const port = 3211;

    const listWorkspaces = () => {
      const { stdout } = execa.sync('yarn', ['workspaces', 'list', '--verbose', '--json']);
      return stdout;
    };

    const depsApiHandler: ApiHandler = (path, query, resultHandler) => {
      try {
        const json = listWorkspaces();
        resultHandler(200, 'text/plain; charset=utf8', json);
      } catch (error) {
        this.context.stderr.write(`Failed to list workspaces: ${error.message}`);
        resultHandler(200, 'application/json', JSON.stringify(error));
      }
    };

    const server = new HttpServer();
    server.setApiHandler('/api/deps', depsApiHandler);
    server.init(port, host);

    return Promise.resolve(0);
  }
}
