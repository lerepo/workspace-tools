// Dependencies
import { createServer, Server, IncomingMessage, ServerResponse } from 'http';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import { ParsedUrlQuery } from 'querystring';

const WEBAPP_PACKAGE = '@lerepo/web-app';
const DEFAULT_SERVER_PORT = 3000;
const DEFAULT_SERVER_HOST = '127.0.0.1';

export type ApiHandler = (
  path: string,
  query: ParsedUrlQuery,
  resultHandler: (
    statusCode: number,
    contentType: string,
    data,
    headers?: Array<[string, string]>
  ) => void
) => void;

export class HttpServer {
  // Allowed Mime types for static content
  private readonly _mimeTypes = new Map([
    ['.html', 'text/html'],
    ['.css', 'text/css'],
    ['.js', 'text/javascript'],
    ['.ico', 'image/x-icon'],
    ['.json', 'application/json'],
    ['.woff', 'font/woff'],
    ['.woff2', 'font/woff2']
  ]);

  // Object to hold known dynamic paths and their corresponding handlers.
  // Use the setApiHandler() method to associate supported dynamic paths with
  // the corresponding handlers
  private _apiHandlers = new Map<string, ApiHandler>();

  // The HTTP server
  private _httpServer: Server;

  constructor() {
    this._httpServer = createServer((request, response): void => {
      const requestUrl = request.url;
      if (requestUrl) {
        const pathname = url.parse(requestUrl, false).pathname;
        if (pathname) {
          const dynamicPath = this._apiHandlers.has(pathname);
          if (dynamicPath) {
            return this._serveDynamicContent(request, response);
          } else {
            return this._serveStaticContent(pathname, response);
          }
        }
      }
      // Most likely a bad request if it does not have a well-formed request URL
      response.writeHead(400);
      response.end();
    });
  }

  /**
   * Register an API dynamic path and its corresponding handler.
   * @param path the API path (e.g. /api/deps)
   * @param handler the handler that will process the request for that path
   */
  setApiHandler(path: string, handler: ApiHandler): void {
    this._apiHandlers.set(path, handler);
  }

  /**
   * Main method to start the server.
   * @param {integer} port - default value 3000
   * @param {string} host - default value 127.0.0.1
   *
   */
  init = (port = DEFAULT_SERVER_PORT, host = DEFAULT_SERVER_HOST): void => {
    this._httpServer.listen(port, host, () => {
      console.info(`Server is listening at http://${host}:${port}`);
    });
  };

  /**
   * Get the content type for a given path.
   * @param {string} url - url extracted from request.url
   */
  private _getContentType = (url: string): string => {
    // Set the default content type to application/octet-stream
    let contentType = 'application/octet-stream';
    // Get the file extension
    const extname = path.extname(url);
    console.log('extension: ', extname);
    // Set the contentType based on the mime type
    const mimeType = this._mimeTypes.get(extname);
    if (mimeType) {
      contentType = mimeType;
    }
    return contentType;
  };

  /**
   * Serve the static content.
   * @param {string} pathname - request.url eg: /index.html
   * @param {Object} response - response object
   */
  private _serveStaticContent = (pathname: string, response) => {
    // Resolve the root path to '/index.html'
    if (pathname === '/') pathname = '/index.html';

    // Try to locate the file in the webapp package and serve it
    try {
      const filePath = require.resolve(`${WEBAPP_PACKAGE}/dist${pathname}`);

      // Get content type based on the file extension
      const contentType = this._getContentType(pathname);
      // Set the Content-Type response header
      response.setHeader('Content-Type', contentType);

      console.info(`serving static from: ${filePath}`);

      // The next call is safe. We only server files from the web app package
      // and they will only be resolved successfully if they are located within
      // the webapp package. Nothing outside of that package gets ever touched.

      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.readFile(filePath, (error, data) => {
        if (!error) {
          response.writeHead(200);
          response.end(data);
        } else {
          response.writeHead(404);
          response.end();
        }
      });
    } catch (error) {
      console.error(error);
      if (pathname !== '/index.html') {
        // fallback to the home page in an attempt to recover smoothly from this
        // failure
        return this._serveStaticContent('/index.html', response);
      } else {
        response.writeHead(404);
        response.end();
      }
    }
  };

  /**
   * Serve dynamic content in response to an API request.
   * @param {string} pathname - dynamic path
   * @param {Object} response - response object
   */
  private _serveDynamicContent = (request: IncomingMessage, response: ServerResponse): void => {
    // Retrieve the HTTP method
    const method = request.method || 'GET';
    if (method.toLowerCase() !== 'get') {
      console.error(`Only GET requests are allowed, but received a request with ${method} method.`);
      response.writeHead(400);
      response.end();
    }

    // Parse the incoming request url
    const requestUrl = request.url;
    if (requestUrl) {
      const parsedUrl = url.parse(requestUrl, true);

      // Retrieve the pathname and query object from the parsed url
      const { pathname, query } = parsedUrl;

      if (pathname) {
        // Retrieve the handler for the path
        const handler = this._apiHandlers.get(pathname);
        /**
         * Call the handler for the path
         * @param {Object} responseData
         * @param {function} callback function definition
         *
         */
        handler &&
          handler(
            pathname,
            query,
            (
              statusCode: number,
              contentType: string,
              data,
              headers: Array<[string, string]> = []
            ) => {
              for (const header of headers) {
                response.setHeader(...header);
              }
              response.setHeader('Content-Type', contentType);
              response.writeHead(statusCode);
              response.end(data);
            }
          );
        return;
      }
    }

    response.writeHead(400);
    response.end();
  };
}
