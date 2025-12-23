/**
 * Route Aggregator Module
 * 
 * This module serves as the central routing configuration that imports and mounts
 * all sub-routers at their appropriate paths. It is the single entry point for
 * all application routes, providing clean separation of routing concerns.
 * 
 * Route Mounting:
 * - /health - Health check endpoint for monitoring
 * - /api - API routes including hello endpoint
 * - / - Root welcome/info endpoint
 * 
 * Usage in server.js:
 * const routes = require('./src/routes');
 * app.use('/', routes);
 * 
 * @module src/routes/index
 */

'use strict';

const express = require('express');

/**
 * Express Router instance for route aggregation
 * @type {express.Router}
 */
const router = express.Router();

// Import sub-route modules
const healthRoutes = require('./health');
const apiRoutes = require('./api');

/**
 * Mount health check routes at /health
 * Used for load balancer and PM2 monitoring
 */
router.use('/health', healthRoutes);

/**
 * Mount API routes at /api
 * Includes /api and /api/hello endpoints
 */
router.use('/api', apiRoutes);

/**
 * GET / - Root welcome endpoint
 * 
 * Returns a simple JSON response indicating the API is available.
 * Provides a friendly entry point for developers exploring the API.
 * 
 * @route GET /
 * @returns {Object} Welcome response
 * @returns {string} response.message - Welcome message
 */
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Express.js API'
    });
});

module.exports = router;
