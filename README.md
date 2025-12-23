# Express.js Production-Ready Server

A production-ready Express.js server with comprehensive middleware stack, structured routing, Winston/Morgan logging, environment configuration, and PM2 process management for enterprise deployments.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Available npm Scripts](#available-npm-scripts)
- [PM2 Deployment](#pm2-deployment)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Middleware Stack](#middleware-stack)
- [Logging](#logging)
- [License](#license)

## Features

- **Express.js 5.x Framework** - Modern web application framework with async/await support
- **Security Hardening** - Helmet middleware for HTTP security headers
- **CORS Support** - Cross-Origin Resource Sharing configuration
- **Response Compression** - Gzip/deflate compression for improved performance
- **Structured Logging** - Winston logger with console and file transports
- **HTTP Request Logging** - Morgan middleware integrated with Winston
- **Environment Configuration** - Centralized configuration with dotenv
- **Health Checks** - Built-in health endpoint for load balancer monitoring
- **PM2 Process Management** - Production deployment with cluster mode and auto-restart
- **Modular Architecture** - Organized routes, middleware, and utilities

## Prerequisites

- **Node.js** v18.0.0 or higher (v20+ recommended)
- **npm** v8.0.0 or higher
- **PM2** (optional, for production deployment)

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env with your configuration
   nano .env
   ```

4. **Verify installation:**

   ```bash
   npm start
   ```

   The server should start and display: `Server running on port 3000 in development mode`

## Quick Start

### Development Mode

Start the server with file watching for automatic restarts during development:

```bash
npm run dev
```

### Standard Mode

Start the server in standard mode:

```bash
npm start
```

### Production Mode

Start the server with production optimizations:

```bash
npm run prod
```

### Test the Server

Once running, test the server with:

```bash
# Health check
curl http://localhost:3000/health

# API hello endpoint
curl http://localhost:3000/api/hello

# Root endpoint
curl http://localhost:3000/
```

## Environment Setup

The application uses environment variables for configuration. Create a `.env` file in the project root with the following variables:

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server listening port |
| `NODE_ENV` | `development` | Environment mode (`development`, `production`, `test`) |
| `LOG_LEVEL` | `debug` | Winston logging level (`error`, `warn`, `info`, `http`, `debug`) |
| `DB_HOST` | - | Database host connection string (for future use) |

### Example .env File

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Logging Configuration
LOG_LEVEL=debug

# Database Configuration (for future use)
DB_HOST=db.internal:12345
```

### Environment-Specific Behavior

| Environment | Log Level | Features |
|-------------|-----------|----------|
| `development` | `debug` | Verbose logging, detailed error messages |
| `production` | `warn` | Minimal logging, generic error messages |
| `test` | `error` | Errors only, optimized for test runners |

## Available npm Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm start` | `node server.js` | Start the server in standard mode |
| `npm run dev` | `node --watch server.js` | Start with file watching (auto-restart on changes) |
| `npm run prod` | `NODE_ENV=production node server.js` | Start in production mode |
| `npm run pm2:start` | `pm2 start ecosystem.config.js` | Start with PM2 process manager (cluster mode) |
| `npm run pm2:stop` | `pm2 stop ecosystem.config.js` | Stop all PM2 managed processes |
| `npm run pm2:restart` | `pm2 restart ecosystem.config.js` | Restart PM2 managed processes |
| `npm run pm2:logs` | `pm2 logs` | View real-time PM2 logs |

### Script Examples

```bash
# Development workflow
npm run dev

# Production deployment
npm run pm2:start

# View logs
npm run pm2:logs

# Stop production
npm run pm2:stop
```

## PM2 Deployment

PM2 provides production-grade process management with automatic clustering, load balancing, and zero-downtime reloads.

### Starting with PM2

```bash
# Start the application with PM2
npm run pm2:start

# Or directly with PM2 CLI
pm2 start ecosystem.config.js
```

### PM2 Cluster Mode

The `ecosystem.config.js` is configured for cluster mode, which:

- **Auto-scales** to use all available CPU cores
- **Load balances** incoming requests across workers
- **Auto-restarts** crashed processes
- **Memory limits** to prevent memory leaks

### PM2 Management Commands

```bash
# View running processes
pm2 list

# Monitor processes in real-time
pm2 monit

# View logs
pm2 logs

# Restart all processes
pm2 restart ecosystem.config.js

# Reload with zero downtime
pm2 reload ecosystem.config.js

# Stop all processes
pm2 stop ecosystem.config.js

# Delete processes from PM2
pm2 delete ecosystem.config.js
```

### PM2 Startup on Boot

To ensure the server starts automatically after system reboot:

```bash
# Generate startup script
pm2 startup

# Save current process list
pm2 save
```

### PM2 Configuration (ecosystem.config.js)

The ecosystem configuration includes:

- **Cluster mode** with automatic instance scaling
- **Environment variables** for production
- **Memory restart threshold** (500MB)
- **Log file configuration**
- **Watch mode disabled** for production stability

## Project Structure

```
├── server.js                    # Main application entry point
├── package.json                 # Package manifest and scripts
├── ecosystem.config.js          # PM2 deployment configuration
├── .env                         # Environment variables (not in git)
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore patterns
├── README.md                    # This documentation
│
├── src/
│   ├── config/
│   │   └── index.js            # Centralized configuration loader
│   │
│   ├── routes/
│   │   ├── index.js            # Route aggregator
│   │   ├── health.js           # Health check endpoint
│   │   └── api.js              # API routes
│   │
│   ├── middleware/
│   │   └── errorHandler.js     # Global error handling middleware
│   │
│   └── utils/
│       └── logger.js           # Winston logger configuration
│
└── logs/
    ├── .gitkeep                # Placeholder for git tracking
    ├── error.log               # Error-level logs (generated)
    └── combined.log            # All logs combined (generated)
```

### Directory Descriptions

| Directory | Purpose |
|-----------|---------|
| `src/config/` | Configuration management and environment loading |
| `src/routes/` | Express router modules for different endpoints |
| `src/middleware/` | Custom middleware functions |
| `src/utils/` | Utility modules (logging, helpers) |
| `logs/` | Application log files (auto-generated) |

## API Endpoints

### Health Check

```http
GET /health
```

Returns server health status for load balancer monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

### API Information

```http
GET /api
```

Returns API information and available endpoints.

**Response:**
```json
{
  "message": "API is running",
  "version": "1.0.0",
  "endpoints": [
    "GET /api",
    "GET /api/hello"
  ]
}
```

### Hello World

```http
GET /api/hello
```

Returns the classic "Hello, World!" message.

**Response:**
```
Hello, World!
```

### Root Endpoint

```http
GET /
```

Returns welcome message.

**Response:**
```json
{
  "message": "Welcome to Express.js Production Server",
  "documentation": "/api"
}
```

### Error Responses

All error responses follow a consistent format:

```json
{
  "error": "Error message",
  "status": 404,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Middleware Stack

The application uses the following middleware in order:

| Order | Middleware | Purpose |
|-------|------------|---------|
| 1 | `helmet()` | Security HTTP headers |
| 2 | `cors()` | Cross-Origin Resource Sharing |
| 3 | `compression()` | Response compression (gzip/deflate) |
| 4 | `morgan()` | HTTP request logging |
| 5 | `express.json()` | JSON body parsing |
| 6 | `express.urlencoded()` | URL-encoded body parsing |
| 7 | Routes | Application route handlers |
| 8 | 404 Handler | Unmatched route handling |
| 9 | Error Handler | Global error handling |

### Security Headers (Helmet)

Helmet automatically sets the following security headers:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection`
- `Strict-Transport-Security` (HSTS)

## Logging

### Winston Logger

The application uses Winston for structured logging with multiple transports:

- **Console Transport** - Colorized output for development
- **File Transport** - JSON formatted logs for production

### Log Levels

| Level | Priority | Usage |
|-------|----------|-------|
| `error` | 0 | Error conditions |
| `warn` | 1 | Warning conditions |
| `info` | 2 | Informational messages |
| `http` | 3 | HTTP request logs |
| `debug` | 4 | Debug information |

### Log Files

- `logs/error.log` - Contains error-level logs only
- `logs/combined.log` - Contains all log levels

### Morgan HTTP Logging

Morgan logs all HTTP requests with the following information:

- Remote address
- Request method
- URL
- HTTP version
- Status code
- Response time
- User agent

Morgan logs are integrated with Winston at the `http` level.

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

**PM2 processes not stopping:**
```bash
# Force kill all PM2 processes
pm2 kill

# Restart PM2 daemon
pm2 resurrect
```

**Environment variables not loading:**
- Ensure `.env` file exists in project root
- Check for syntax errors in `.env` file
- Restart the application after changes

### Debug Mode

Enable verbose logging for troubleshooting:

```bash
# Set debug log level
LOG_LEVEL=debug npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC License - see the [LICENSE](LICENSE) file for details.
