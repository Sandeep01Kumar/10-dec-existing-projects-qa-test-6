/**
 * Global Error Handler Middleware
 * 
 * This middleware catches all errors from route handlers and middleware,
 * logs errors using Winston logger, and sends appropriate JSON error responses.
 * 
 * CRITICAL: This middleware MUST be mounted LAST in the Express middleware stack
 * (after all routes) to catch any errors that bubble up from the application.
 * 
 * Features:
 * - Catches synchronous errors thrown in route handlers
 * - Handles promise rejections from async handlers (Express 5 auto-catches these)
 * - Handles errors passed via next(err) from other middleware
 * - Logs complete error stack traces for debugging
 * - Returns structured JSON error responses
 * - Hides error details in production for security
 * - Exposes full error details in development for debugging
 * 
 * @module src/middleware/errorHandler
 */

'use strict';

const logger = require('../utils/logger');

/**
 * Express error handling middleware function
 * 
 * Uses the Express 4-argument signature (err, req, res, next) to identify
 * this as an error-handling middleware. Express will route errors here
 * when next(err) is called or an exception is thrown.
 * 
 * @param {Error} err - The error object caught from route handlers or middleware
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
    // Log the complete error stack trace for debugging and monitoring
    // Uses the stack if available, otherwise logs just the message
    logger.error(err.stack || err.message);

    // Determine the appropriate HTTP status code
    // Use the error's statusCode or status if available, otherwise default to 500
    const statusCode = err.statusCode || err.status || 500;

    // Determine error message
    // Use the error's message if available, otherwise use generic message
    const message = err.message || 'Internal Server Error';

    // Build the error response object
    // In production, hide implementation details for security
    // In development, expose full error details for debugging
    const errorResponse = {
        error: {
            message: message,
            status: statusCode,
            // Only include stack trace in non-production environments
            ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
        }
    };

    // Send the JSON error response with appropriate status code
    res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
