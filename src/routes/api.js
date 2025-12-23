/**
 * API Routes Module
 * 
 * This module provides API endpoints for the application.
 * It preserves the original server's "Hello, World!" functionality
 * at the /api/hello endpoint while adding new API information endpoint.
 * 
 * Endpoints:
 * - GET /api - Returns API information
 * - GET /api/hello - Returns "Hello, World!" (preserves original functionality)
 * 
 * @module src/routes/api
 */

'use strict';

const express = require('express');

/**
 * Express Router instance for API routes
 * @type {express.Router}
 */
const router = express.Router();

/**
 * GET / - API information endpoint
 * 
 * Returns JSON response with API information including message and version.
 * Mounted at /api, so accessible at GET /api
 * 
 * @route GET /api
 * @returns {Object} API information response
 * @returns {string} response.message - API status message
 * @returns {string} response.version - API version number
 */
router.get('/', (req, res) => {
    res.json({
        message: 'API is running',
        version: '1.0.0'
    });
});

/**
 * GET /hello - Hello World endpoint
 * 
 * Preserves the original server.js functionality by returning "Hello, World!"
 * with text/plain content type, maintaining backward compatibility.
 * 
 * Original behavior from server.js:
 * - res.statusCode = 200;
 * - res.setHeader('Content-Type', 'text/plain');
 * - res.end('Hello, World!');
 * 
 * @route GET /api/hello
 * @returns {string} "Hello, World!" response in text/plain format
 */
router.get('/hello', (req, res) => {
    res.type('text/plain');
    res.send('Hello, World!');
});

module.exports = router;
