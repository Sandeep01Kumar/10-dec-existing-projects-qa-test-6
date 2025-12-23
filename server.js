/**
 * Express.js Application Entry Point
 * 
 * This module is the main entry point for the Express.js application server.
 * It sets up the complete middleware stack, mounts routes, configures error handling,
 * and starts the HTTP server.
 * 
 * Middleware Stack (in order):
 * 1. Helmet - Security headers
 * 2. CORS - Cross-Origin Resource Sharing
 * 3. Compression - Response compression (gzip/deflate)
 * 4. Morgan - HTTP request logging (integrated with Winston)
 * 5. express.json() - JSON body parser
 * 6. express.urlencoded() - URL-encoded body parser
 * 7. Routes - Application routes
 * 8. 404 Handler - Unmatched routes
 * 9. Error Handler - Global error handling (MUST be last)
 * 
 * Features:
 * - Security hardening via Helmet
 * - CORS support for cross-origin requests
 * - Response compression for performance
 * - Structured logging with Winston/Morgan integration
 * - Centralized configuration via dotenv
 * - Production-ready error handling
 * - Container-compatible binding (0.0.0.0)
 * 
 * @module server
 */

'use strict';

// External dependencies - Express.js framework and middleware
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');

// Internal dependencies - Configuration, logging, routes, and middleware
const config = require('./src/config');
const logger = require('./src/utils/logger');
const routes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');

/**
 * Create Express application instance
 * This replaces the native http.createServer() from the original implementation
 * @type {express.Application}
 */
const app = express();

// =============================================================================
// MIDDLEWARE STACK
// Order is critical - security middleware first, error handling last
// =============================================================================

/**
 * Helmet Security Middleware
 * Sets various HTTP headers to help protect the application from well-known 
 * web vulnerabilities including XSS, clickjacking, and other attacks.
 * - Content-Security-Policy
 * - X-Content-Type-Options: nosniff
 * - X-Frame-Options: DENY
 * - X-XSS-Protection
 * - Strict-Transport-Security (HSTS)
 */
app.use(helmet());

/**
 * CORS Middleware
 * Enables Cross-Origin Resource Sharing to allow the API to be accessed
 * from different domains. Handles preflight OPTIONS requests automatically.
 */
app.use(cors());

/**
 * Compression Middleware
 * Compresses response bodies using gzip or deflate encoding to reduce
 * payload sizes and improve network performance.
 */
app.use(compression());

/**
 * Morgan HTTP Request Logger
 * Logs incoming HTTP requests in the 'combined' Apache-style format.
 * Integrated with Winston logger via stream option for centralized logging.
 * Log output includes: remote-addr, remote-user, date, method, url, http-version,
 * status, res[content-length], referrer, user-agent
 */
app.use(morgan('combined', { stream: logger.stream }));

/**
 * JSON Body Parser
 * Parses incoming requests with JSON payloads and makes the parsed
 * data available on req.body. Uses Express 5.x built-in middleware.
 */
app.use(express.json());

/**
 * URL-encoded Body Parser
 * Parses incoming requests with URL-encoded payloads (form submissions)
 * and makes the parsed data available on req.body.
 * extended: true allows for rich objects and arrays to be encoded
 */
app.use(express.urlencoded({ extended: true }));

// =============================================================================
// ROUTES
// Mount all application routes from the route aggregator
// =============================================================================

/**
 * Mount Application Routes
 * All routes from src/routes/index.js are mounted at the root path.
 * This includes:
 * - GET / - Root welcome endpoint
 * - GET /health - Health check endpoint
 * - GET /api - API info endpoint
 * - GET /api/hello - Hello World endpoint (preserves original functionality)
 */
app.use('/', routes);

// =============================================================================
// ERROR HANDLING
// Must be defined AFTER all other middleware and routes
// =============================================================================

/**
 * 404 Not Found Handler
 * Catches all requests that don't match any route and returns a structured
 * JSON error response. Must be placed after all routes but before error handler.
 */
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
        statusCode: 404
    });
});

/**
 * Global Error Handler
 * Catches all errors from route handlers and middleware, logs them using
 * Winston logger, and sends appropriate JSON error responses.
 * MUST be the last middleware in the stack.
 */
app.use(errorHandler);

// =============================================================================
// SERVER STARTUP
// Bind to 0.0.0.0 for container compatibility (Docker, Kubernetes, PM2)
// =============================================================================

/**
 * Server bind hostname
 * Use 0.0.0.0 instead of 127.0.0.1 for container compatibility.
 * This allows the server to accept connections from any network interface,
 * which is required when running in Docker, Kubernetes, or behind a load balancer.
 * @type {string}
 */
const hostname = '0.0.0.0';

/**
 * Start Express server
 * Uses config.port from environment configuration (defaults to 3000)
 * Logs startup information using Winston logger
 */
app.listen(config.port, hostname, () => {
    logger.info(`Server running at http://${hostname}:${config.port}/`);
    logger.info(`Environment: ${config.nodeEnv}`);
    logger.info(`Log level: ${config.logLevel}`);
    logger.debug('Debug logging is enabled');
});

module.exports = app;
