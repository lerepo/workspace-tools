import { execaSync } from 'execa';
import * as t from 'typanion';
import { Command, Option, Usage } from 'clipanion';
import { BaseCommand } from '../../core';

import {
  HttpServer,
  ApiHandler,
  DEFAULT_SERVER_PORT,
  DEFAULT_SERVER_HOST
} from './server';

export class WebCommand extends BaseCommand {
  static paths = [[`web`]];

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
      [
        'Start the web application using yarn dlx.',
        'yarn dlx -p @lerepo/cli lrt web'
      ]
    ]
  });

  public port? = Option.String('--port', {
    required: false,
    validator: t.cascade(t.isNumber(), [
      t.isInteger(),
      t.isInInclusiveRange(1, 65535)
    ])
  });

  public host? = Option.String(`--host`, {
    required: false,
    validator: t.cascade(
      t.isString(),
      t.matchesRegExp(
        /^(25[0-5]|2[0-4]\d|[01]?\d{1,2})\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})$/
      )
    )
  });

  async execute(): Promise<0 | 1> {
    this.context.stdout.write('Start web server\n');

    const listWorkspaces = () => {
      const { stdout } = execaSync('yarn', [
        'workspaces',
        'list',
        '--verbose',
        '--json'
      ]);
      return stdout;
    };

    const depsApiHandler: ApiHandler = (path, query, resultHandler) => {
      try {
        const json = listWorkspaces();
        resultHandler(200, 'text/plain; charset=utf8', json);
      } catch (error) {
        this.context.stderr.write(
          `Failed to list workspaces: ${
            error instanceof Error ? error.message : 'unknown'
          }`
        );
        resultHandler(200, 'application/json', JSON.stringify(error));
      }
    };

    const server = new HttpServer();
    server.setApiHandler('/api/deps', depsApiHandler);
    server.init(Number(this.port), this.host);

    return Promise.resolve(0);
  }
}
