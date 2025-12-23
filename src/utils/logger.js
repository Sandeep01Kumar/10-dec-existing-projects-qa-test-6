/**
 * Winston Logger Utility Module
 * 
 * This module provides application-wide logging infrastructure with multiple transports
 * (console and file). It implements configurable log levels based on environment 
 * configuration and integrates with Morgan for HTTP request logging.
 * 
 * Log Levels (numeric priority):
 * - error: 0 (highest priority)
 * - warn: 1
 * - info: 2
 * - http: 3
 * - debug: 4 (lowest priority)
 * 
 * Features:
 * - Console transport with colorized output in development
 * - JSON format in production for structured logging
 * - File transport for persistent logs (combined.log and error.log)
 * - Stream interface for Morgan HTTP request logging integration
 * 
 * @module src/utils/logger
 */

'use strict';

const winston = require('winston');
const path = require('path');
const config = require('../config');

/**
 * Custom log levels with numeric priorities
 * Lower numbers indicate higher priority
 * @type {Object.<string, number>}
 */
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

/**
 * Colors for console output in development
 * Each level is assigned a distinct color for easy identification
 * @type {Object.<string, string>}
 */
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue'
};

// Register custom colors with Winston
winston.addColors(colors);

/**
 * Format configuration for log output
 * Uses JSON format in production for structured logging and machine parsing
 * Uses colorized human-readable format in development for easier debugging
 */
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    config.isProduction
        ? winston.format.json()
        : winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.printf(({ timestamp, level, message, stack }) =>
                `${timestamp} [${level}]: ${stack || message}`
            )
        )
);

/**
 * Array of Winston transport configurations
 * - Console transport: Always present, uses config.logLevel
 * - File transport (combined): All logs at configured level and above
 * - File transport (error): Only error-level logs for quick error identification
 * @type {winston.transport[]}
 */
const transports = [
    // Console transport for all environments
    new winston.transports.Console(),
    
    // File transport for error logs only
    new winston.transports.File({
        filename: path.join('logs', 'error.log'),
        level: 'error'
    }),
    
    // File transport for all combined logs
    new winston.transports.File({
        filename: path.join('logs', 'combined.log')
    })
];

/**
 * Winston logger instance configured with custom levels, format, and transports
 * @type {winston.Logger}
 */
const logger = winston.createLogger({
    level: config.logLevel,
    levels,
    format,
    transports
});

/**
 * Stream interface for Morgan HTTP request logger integration
 * Morgan writes HTTP request logs to this stream, which pipes them to Winston at 'http' level
 * This enables unified logging where both application logs and HTTP logs go through Winston
 * @type {{write: function(string): void}}
 */
logger.stream = {
    /**
     * Write method called by Morgan to log HTTP requests
     * @param {string} message - The HTTP request log message from Morgan
     */
    write: (message) => {
        // Use http level for HTTP request logs
        // Trim to remove the trailing newline that Morgan adds
        logger.http(message.trim());
    }
};

module.exports = logger;
