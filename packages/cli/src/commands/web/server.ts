// Dependencies
import { createServer, Server, IncomingMessage, ServerResponse } from 'http';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import { ParsedUrlQuery } from 'querystring';

// Base directory - Assuming minimal-dynamic-http-server will
// be accessed from its own folder
// const baseDir = path.join(__dirname, '../');

const moduleName = '@lerepo/web-app';

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
  /**
   * HANDLE STATIC CONTENT
   */
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

  /**
   * Object to hold allowed dynamic paths.
   * Use the setAllowedPaths() public method to set the dynamic paths
   * and the corresponding handlers.
   * {string}path/{function}handler
   * Example:
   * allowedPaths = {
   *                 '/api/somepath': somehandler,
   *                 '/api/anotherpath': anotherhandler
   *               }
   */
  private _apiHandlers = new Map<string, ApiHandler>();
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

      response.writeHead(400);
      response.end();
    });
  }

  setApiHandler(path: string, handler: ApiHandler): void {
    this._apiHandlers.set(path, handler);
  }

  /**
   * Main method to start the server
   * @param {integer} port - default value 3000
   * @param {string} host - default value 127.0.0.1
   *
   */
  init = (port = 3000, host = '127.0.0.1'): void => {
    this._httpServer.listen(port, host, () => {
      console.info(`Server is listening at http://${host}:${port}`);
    });
  };

  /**
   * Get the content type for a given path
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
   * Serve the static content
   * @param {string} pathname - request.url eg: /public/index.html
   * @param {Object} response - response object
   */
  private _serveStaticContent = (pathname: string, response) => {
    // Read the file and send the response
    if (pathname === '/') pathname = '/index.html';

    try {
      const filePath = require.resolve(`${moduleName}/dist${pathname}`);

      // Get content type based on the file extension
      const contentType = this._getContentType(pathname);
      // Set the Content-Type response header
      response.setHeader('Content-Type', contentType);

      console.info(`serving static from: ${filePath}`);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // const resolvedFilePath = __non_webpack_require__.resolve(`lodash/ceil`);
      // console.info(null, `serving static from: ${resolvedFilePath}`);

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
        // fallback to home page
        return this._serveStaticContent('/index.html', response);
      } else {
        response.writeHead(404);
        response.end();
      }
    }
  };

  /**
   * Serve the dynamic content
   * @param {string} pathname - dynamic path
   * @param {Object} response - response object
   *
   */
  private _serveDynamicContent = (request: IncomingMessage, response: ServerResponse): void => {
    // Retrieve the HTTP method
    // const method = request.method.toLowerCase();
    // TODO: Only GET is supported

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
