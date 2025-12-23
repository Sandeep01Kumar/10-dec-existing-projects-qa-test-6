/**
 * PM2 Ecosystem Configuration File
 * 
 * This configuration file defines how PM2 manages the Express.js application
 * in production environments. PM2 is a production process manager for Node.js
 * applications that provides clustering, automatic restarts, load balancing,
 * and monitoring capabilities.
 * 
 * Features Enabled:
 * - Cluster Mode: Spawns multiple worker processes for multi-core CPU utilization
 * - Auto-restart: Automatically restarts crashed processes
 * - Memory Management: Restarts workers that exceed memory threshold
 * - Log Management: Centralized logging with timestamps
 * - Zero-downtime Reloads: Use `pm2 reload` for seamless updates
 * 
 * Usage:
 *   Start:    pm2 start ecosystem.config.js
 *   Start (production): pm2 start ecosystem.config.js --env production
 *   Stop:     pm2 stop ecosystem.config.js
 *   Restart:  pm2 restart ecosystem.config.js
 *   Reload:   pm2 reload ecosystem.config.js (zero-downtime)
 *   Logs:     pm2 logs
 *   Monitor:  pm2 monit
 *   List:     pm2 list
 * 
 * Environment-specific startup:
 *   Development: pm2 start ecosystem.config.js
 *   Production:  pm2 start ecosystem.config.js --env production
 * 
 * For system startup persistence:
 *   pm2 startup
 *   pm2 save
 * 
 * @module ecosystem.config
 * @see {@link https://pm2.keymetrics.io/docs/usage/application-declaration/}
 */

'use strict';

module.exports = {
  /**
   * Application Configuration Array
   * 
   * PM2 can manage multiple applications simultaneously. Each object in this
   * array defines a separate application with its own configuration.
   * Currently defines one application: the Express.js server.
   */
  apps: [
    {
      // =========================================================================
      // APPLICATION IDENTITY
      // =========================================================================
      
      /**
       * Process Name
       * Identifier used by PM2 to reference this application in commands.
       * Example: pm2 restart express-server
       * @type {string}
       */
      name: 'express-server',

      /**
       * Entry Point Script
       * The main Node.js file to execute when starting the application.
       * Path is relative to the ecosystem.config.js file location.
       * References the refactored Express.js server entry point.
       * @type {string}
       */
      script: 'server.js',

      // =========================================================================
      // CLUSTER MODE CONFIGURATION
      // Enables multi-core CPU utilization and load balancing
      // =========================================================================

      /**
       * Number of Instances
       * - 'max': Spawn as many workers as there are CPU cores
       * - number: Spawn a specific number of workers
       * - 0 or 'max': Auto-detect CPU count
       * 
       * Using 'max' ensures optimal resource utilization in production
       * by leveraging all available CPU cores for parallel request handling.
       * @type {string|number}
       */
      instances: 'max',

      /**
       * Execution Mode
       * - 'cluster': Enable cluster mode with built-in load balancer
       * - 'fork': Traditional single-process mode (default)
       * 
       * Cluster mode is required for multi-instance deployment. PM2's
       * built-in load balancer distributes incoming requests across
       * all worker processes using round-robin strategy.
       * @type {string}
       */
      exec_mode: 'cluster',

      // =========================================================================
      // FILE WATCHING
      // =========================================================================

      /**
       * Watch Mode
       * - true: Automatically restart on file changes (development)
       * - false: Disable file watching (production)
       * 
       * IMPORTANT: Always set to false in production to prevent
       * unexpected restarts due to log file changes or temporary files.
       * For development file watching, use `npm run dev` instead.
       * @type {boolean}
       */
      watch: false,

      // =========================================================================
      // MEMORY MANAGEMENT
      // =========================================================================

      /**
       * Maximum Memory Threshold
       * Automatically restart the process if it exceeds this memory limit.
       * This helps prevent memory leaks from crashing the application.
       * 
       * Supported formats: '500M', '1G', '1024K'
       * 
       * The 500MB limit is a reasonable default for most Express.js
       * applications. Adjust based on your application's actual memory usage.
       * @type {string}
       */
      max_memory_restart: '500M',

      // =========================================================================
      // ENVIRONMENT CONFIGURATION
      // =========================================================================

      /**
       * Default Environment Variables (Development)
       * These variables are set when starting without --env flag.
       * Used for local development and testing.
       * @type {Object}
       */
      env: {
        /**
         * Node.js Environment Mode
         * Controls Express.js behavior, error verbosity, and logging
         */
        NODE_ENV: 'development',
        
        /**
         * Server Listening Port
         * The port on which the Express.js server will listen
         */
        PORT: 3000
      },

      /**
       * Production Environment Variables
       * These variables are set when starting with --env production flag.
       * Example: pm2 start ecosystem.config.js --env production
       * @type {Object}
       */
      env_production: {
        /**
         * Node.js Environment Mode
         * Production mode enables optimizations and reduces verbose logging
         */
        NODE_ENV: 'production',
        
        /**
         * Server Listening Port
         * Same port as development; can be overridden by .env file
         */
        PORT: 3000
      },

      // =========================================================================
      // LOG CONFIGURATION
      // Centralized logging for all cluster workers
      // =========================================================================

      /**
       * Error Log File Path
       * Path to the file where stderr output and error logs are written.
       * All worker processes in cluster mode write to this single file.
       * Ensure the logs/ directory exists before starting PM2.
       * @type {string}
       */
      error_file: 'logs/pm2-error.log',

      /**
       * Output Log File Path
       * Path to the file where stdout output and info logs are written.
       * All worker processes in cluster mode write to this single file.
       * Ensure the logs/ directory exists before starting PM2.
       * @type {string}
       */
      out_file: 'logs/pm2-out.log',

      /**
       * Log Timestamp Format
       * Date format for log entries using moment.js format tokens.
       * - YYYY: 4-digit year
       * - MM: 2-digit month
       * - DD: 2-digit day
       * - HH: 24-hour format hour
       * - mm: minutes
       * - ss: seconds
       * - Z: timezone offset
       * @type {string}
       */
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // =========================================================================
      // PROCESS MANAGEMENT
      // Automatic restart and crash recovery settings
      // =========================================================================

      /**
       * Automatic Restart
       * Automatically restart the process if it crashes or exits unexpectedly.
       * Essential for production reliability and high availability.
       * @type {boolean}
       */
      autorestart: true,

      /**
       * Minimum Uptime
       * The minimum time a process must run before being considered
       * "successfully started". If the process exits before this time,
       * it's counted as an unstable restart.
       * 
       * This prevents restart loops for applications that crash immediately.
       * Common values: '5s', '10s', '30s', '1m'
       * @type {string}
       */
      min_uptime: '10s',

      /**
       * Maximum Restart Attempts
       * Maximum number of consecutive unstable restarts (restarts within
       * min_uptime) before PM2 stops trying to restart the process.
       * 
       * This prevents infinite restart loops for applications with
       * fundamental startup issues.
       * 
       * After reaching this limit, the application status becomes 'errored'.
       * Use `pm2 restart express-server` to manually retry.
       * @type {number}
       */
      max_restarts: 10
    }
  ]
};
