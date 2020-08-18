import * as execa from 'execa';
import * as yup from 'yup';
import { Command, Usage } from 'clipanion';
import { BaseCommand } from '../../core';

import { HttpServer, ApiHandler, DEFAULT_SERVER_PORT, DEFAULT_SERVER_HOST } from './server';

export class WebCommand extends BaseCommand {
  static usage: Usage = Command.Usage({
    description: 'Start the locally served web-app for the lrt UI.',
    details: `
      This command will will start a local HTTP server to serve a web application that can be used to interact with the \`lrt\` command line tool.

      Through the app, you can explore the workspace dependencies, visualize them in a graph and you can also run a series of checks to audit the dependencies and the health of the project workspace.

      When the \`--port\` option is used, the server will listen on that specific port number, and when the \`--host\` option is used, it will listen on that specific host address (IPV4 or IPV6).

      By default, the server will listen on the \`${DEFAULT_SERVER_HOST}\` address on port number \`${DEFAULT_SERVER_PORT}\`.
      `,
    examples: [
      [
        'Start the app when the `@lerepo/cli` is installed as a dev dependency in the project.',
        'yarn lrt web'
      ],
      ['Start the web application using yarn dlx.', 'yarn dlx -p @lerepo/cli lrt web']
    ]
  });

  static schema = yup.object().shape({
    port: yup.number().integer(),
    host: yup
      .string()
      .matches(
        /^((((1?\d)?\d|2[0-4]\d|25[0-5])\.){3}((1?\d)?\d|2[0-4]\d|25[0-5]))|([\dA-Fa-f]{1,4}(:[\dA-Fa-f]{1,4}){7})|(([\dA-Fa-f]{1,4}:){0,5}::([\dA-Fa-f]{1,4}:){0,5}[\dA-Fa-f]{1,4})$/,
        {
          excludeEmptyString: true,
          message: 'The host option should match an IPV4 or IPV6 address.'
        }
      )
  });

  @Command.String('--port')
  public port?: number;

  @Command.String('--host')
  public host?: string;

  @Command.Path('web')
  async execute(): Promise<0 | 1> {
    this.context.stdout.write('start web server');

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
    server.init(this.port, this.host);

    return Promise.resolve(0);
  }
}
