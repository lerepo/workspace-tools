import * as execa from 'execa';
import { Command, Usage } from 'clipanion';
import { BaseCommand } from '../../core';

import { HttpServer, ApiHandler } from './server';

export class AnalyzeCommand extends BaseCommand {
  static usage: Usage = Command.Usage({
    category: `Workspace-related commands`,
    description: `Analyze and visualize dependencies between workspaces in the project`,
    details: `
      This command will analyze dependencies between all workspaces in the project and start a local web server to visualize and interact with the dependency graph.
    `,
    examples: [
      [
        `Analyze dependencies and start the visualization web server using defaults`,
        `yarn workspaces analyze`
      ]
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
