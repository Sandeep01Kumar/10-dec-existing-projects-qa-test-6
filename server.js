/**
 * @file Simple HTTP Server
 * @module server
 * @description A minimal HTTP server that responds with "Hello, World!" to all requests.
 *              Demonstrates basic Node.js HTTP server patterns using only built-in modules.
 * @author hxu
 * @version 1.0.0
 * @license MIT
 * @requires http
 */

const http = require('http');

/**
 * Server hostname - binds to localhost for development
 * @constant {string}
 * @default '127.0.0.1'
 * @description The hostname/IP address where the server listens. Using 127.0.0.1 
 *              restricts access to local machine only (secure for development).
 *              Change to '0.0.0.0' to allow external connections.
 */
const hostname = '127.0.0.1';

/**
 * Server port number
 * @constant {number}
 * @default 3000
 * @description The TCP port where the server listens for connections.
 *              Port 3000 is a common convention for Node.js development servers.
 *              Ensure no other process is using this port before starting.
 */
const port = 3000;

/**
 * HTTP Server instance
 * @type {http.Server}
 * @description Creates an HTTP server that invokes the callback function
 *              for each incoming request. The server handles all HTTP methods
 *              (GET, POST, PUT, DELETE, etc.) with the same response.
 */
const server = http.createServer((req, res) => {
  // Request handler callback - invoked for every incoming HTTP request
  // @param {http.IncomingMessage} req - The incoming request object containing method, url, headers
  // @param {http.ServerResponse} res - The response object used to send data back to client

  // Set HTTP status code to 200 OK - indicates successful request processing
  res.statusCode = 200;

  // Set Content-Type header to inform client the response body is plain text
  res.setHeader('Content-Type', 'text/plain');

  // End the response and send the "Hello, World!" message body to the client
  res.end('Hello, World!\n');
});

/**
 * Start the HTTP server
 * @description Binds the server to the specified hostname and port,
 *              and begins listening for incoming connections.
 *              The callback function is invoked once the server is ready.
 * @example
 * // Run the server from command line:
 * // $ node server.js
 * // Output: Server running at http://127.0.0.1:3000/
 */
server.listen(port, hostname, () => {
  // Startup confirmation callback - logs when server is ready to accept connections
  console.log(`Server running at http://${hostname}:${port}/`);
});
