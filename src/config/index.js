/**
 * Centralized Configuration Loader Module
 * 
 * This module serves as the single source of truth for all application configuration values.
 * It uses dotenv to load environment variables from the .env file and exports a typed
 * configuration object with sensible defaults for development and production environments.
 * 
 * Configuration values:
 * - port: Server listening port (default: 3000)
 * - nodeEnv: Current environment (development/production)
 * - logLevel: Winston logging level (debug in development, warn in production)
 * - dbHost: Database host connection string
 * - isDevelopment: Boolean helper for development environment checks
 * - isProduction: Boolean helper for production environment checks
 * 
 * @module src/config/index
 */

'use strict';

// Load environment variables from .env file into process.env
// This must be called before accessing any environment variables
require('dotenv').config();

/**
 * Current environment mode
 * Defaults to 'development' if NODE_ENV is not set
 * @type {string}
 */
const nodeEnv = process.env.NODE_ENV || 'development';

/**
 * Server listening port
 * Parses PORT from environment variable as integer, defaults to 3000
 * Matches the original server.js default port behavior
 * @type {number}
 */
const port = parseInt(process.env.PORT, 10) || 3000;

/**
 * Logging level for Winston logger
 * Environment-aware: uses 'debug' in development for verbose output,
 * 'warn' in production for stability and reduced log volume
 * Can be overridden via LOG_LEVEL environment variable
 * @type {string}
 */
const logLevel = process.env.LOG_LEVEL || (nodeEnv === 'production' ? 'warn' : 'debug');

/**
 * Database host connection string
 * Loaded from DB_HOST environment variable
 * Defaults to empty string if not configured
 * @type {string}
 */
const dbHost = process.env.DB_HOST || '';

/**
 * Boolean flag indicating if running in development environment
 * Useful for conditional logic that should only run in development
 * @type {boolean}
 */
const isDevelopment = nodeEnv === 'development';

/**
 * Boolean flag indicating if running in production environment
 * Useful for conditional logic that should only run in production
 * @type {boolean}
 */
const isProduction = nodeEnv === 'production';

/**
 * Centralized configuration object
 * Exports all configuration values for use throughout the application
 * Imported by server.js for port binding and src/utils/logger.js for log level configuration
 * 
 * @exports config
 * @type {Object}
 * @property {number} port - Server listening port (default: 3000)
 * @property {string} nodeEnv - Current environment mode (development/production)
 * @property {string} logLevel - Winston logging level (debug/info/warn/error)
 * @property {string} dbHost - Database host connection string
 * @property {boolean} isDevelopment - True if running in development environment
 * @property {boolean} isProduction - True if running in production environment
 */
module.exports = {
  port,
  nodeEnv,
  logLevel,
  dbHost,
  isDevelopment,
  isProduction
};
