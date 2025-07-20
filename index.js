const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import configurations and utilities
const config = require('./config');
const logger = require('./utils/logger');
const { swaggerUi, specs } = require('./docs/swagger');
const { globalErrorHandler, notFound } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Trust proxy if behind a reverse proxy (for rate limiting)
app.set('trust proxy', 1);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
        scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
        imgSrc: ["'self'", 'data:', 'https:']
      }
    }
  })
);

// CORS configuration
app.use(
  cors({
    origin:
      config.server.env === 'production'
        ? ['https://your-frontend-domain.com', 'https://api-docs-domain.com']
        : true,
    credentials: true,
    methods: ['GET', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// Logging middleware
const morganFormat = config.server.env === 'production' ? 'combined' : 'dev';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// API Documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'NSE Scraper API Documentation'
  })
);

// Routes
app.use('/', require('./routes/stocksRoute'));

// Handle unhandled routes
app.use('*', notFound);

// Global error handling middleware (must be last)
app.use(globalErrorHandler);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('👋 SIGINT RECEIVED. Shutting down gracefully...');
  process.exit(0);
});

// Start server
const PORT = config.server.port;
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${config.server.env} mode on port ${PORT}`);
  logger.info(
    `📚 API Documentation available at http://localhost:${PORT}/api-docs`
  );
  logger.info(`❤️ Health check available at http://localhost:${PORT}/health`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(`❌ Port ${PORT} is already in use`);
  } else {
    logger.error('❌ Server error:', err);
  }
  process.exit(1);
});

module.exports = app;
