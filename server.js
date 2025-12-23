/**
 * Express.js Server Entry Point
 * 
 * This is the main application entry point that configures and starts the Express.js server.
 * It sets up the middleware stack, mounts routes, and initializes error handling.
 * 
 * Middleware Stack Order:
 * 1. Helmet - Security HTTP headers
 * 2. CORS - Cross-origin resource sharing
 * 3. Compression - Response compression (gzip/deflate)
 * 4. Morgan - HTTP request logging
 * 5. express.json() - JSON body parsing
 * 6. express.urlencoded() - URL-encoded body parsing
 * 7. Routes - Application routes
 * 8. 404 Handler - Catch unmatched routes
 * 9. Error Handler - Global error handling (must be last)
 * 
 * @module server
 */

'use strict';

// External dependencies - Express.js and middleware
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');

// Internal modules
const config = require('./src/config');
const logger = require('./src/utils/logger');
const routes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');

/**
 * Create Express application instance
 * @type {express.Application}
 */
const app = express();

// =============================================================================
// MIDDLEWARE STACK
// =============================================================================

/**
 * 1. Helmet - Security middleware
 * Sets various HTTP headers to help protect the application from well-known
 * web vulnerabilities including XSS, clickjacking, and other attacks.
 */
app.use(helmet());

/**
 * 2. CORS - Cross-Origin Resource Sharing
 * Enables cross-origin requests from different domains.
 * Configure appropriately for production to restrict allowed origins.
 */
app.use(cors());

/**
 * 3. Compression - Response compression
 * Compresses response bodies using gzip/deflate for improved performance.
 * Reduces payload sizes and speeds up response delivery.
 */
app.use(compression());

/**
 * 4. Morgan - HTTP request logger
 * Logs incoming HTTP requests in 'combined' format.
 * Piped to Winston logger via stream for unified logging.
 */
app.use(morgan('combined', { stream: logger.stream }));

/**
 * 5. JSON Body Parser
 * Parses incoming requests with JSON payloads.
 * Built into Express 5.x (no need for body-parser package).
 */
app.use(express.json());

/**
 * 6. URL-Encoded Body Parser
 * Parses incoming requests with URL-encoded payloads.
 * extended: true allows for rich objects and arrays to be encoded.
 */
app.use(express.urlencoded({ extended: true }));

// =============================================================================
// ROUTES
// =============================================================================

/**
 * Mount all application routes
 * Routes are aggregated in src/routes/index.js and include:
 * - /health - Health check endpoint
 * - /api - API routes (including /api/hello for original Hello World)
 * - / - Root welcome endpoint
 */
app.use('/', routes);

// =============================================================================
// ERROR HANDLING
// =============================================================================

/**
 * 404 Handler - Catch unmatched routes
 * Handles requests that don't match any defined route.
 * Returns a JSON response with 404 status.
 */
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Not Found'
    });
});

/**
 * Global Error Handler
 * Must be registered LAST in the middleware stack.
 * Catches all errors from route handlers and middleware,
 * logs them, and sends appropriate JSON error responses.
 */
app.use(errorHandler);

// =============================================================================
// SERVER STARTUP
// =============================================================================

/**
 * Start the Express server
 * Listens on configured port (default: 3000)
 * Binds to 0.0.0.0 for container compatibility
 */
const server = app.listen(config.port, '0.0.0.0', () => {
    logger.info(`Server running on port ${config.port}`);
    logger.info(`Environment: ${config.nodeEnv}`);
    logger.info(`Log level: ${config.logLevel}`);
});

/**
 * Handle graceful shutdown
 * Closes server connections when process is terminated
 */
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

module.exports = app;
