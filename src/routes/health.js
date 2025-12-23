/**
 * Health Check Route Module
 * 
 * This module provides a health check endpoint for load balancer and PM2 monitoring.
 * The /health endpoint returns server status and uptime information in JSON format.
 * 
 * Endpoint: GET /health
 * Response: { status: 'ok', uptime: <seconds>, timestamp: <ISO8601> }
 * 
 * Use Cases:
 * - Container health checks (Docker, Kubernetes)
 * - PM2 process monitoring
 * - Load balancer health probes
 * - Application readiness verification
 * 
 * @module src/routes/health
 */

'use strict';

const express = require('express');

/**
 * Express Router instance for health check routes
 * @type {express.Router}
 */
const router = express.Router();

/**
 * GET / - Health check endpoint
 * 
 * Returns JSON response with server status and uptime information.
 * This endpoint should respond quickly without async operations
 * to ensure reliable health checks.
 * 
 * @route GET /health
 * @returns {Object} Health check response
 * @returns {string} response.status - Server status ('ok')
 * @returns {number} response.uptime - Server uptime in seconds
 * @returns {string} response.timestamp - Current server time in ISO 8601 format
 */
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
