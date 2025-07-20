require('dotenv').config();

const config = {
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development'
  },
  api: {
    rateLimitWindowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    rateLimitMaxRequests:
      parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS) || 100
  },
  cache: {
    ttlSeconds: parseInt(process.env.CACHE_TTL_SECONDS) || 300, // 5 minutes
    checkPeriodSeconds: parseInt(process.env.CACHE_CHECK_PERIOD_SECONDS) || 120 // 2 minutes
  },
  external: {
    nseDataSourceUrl:
      process.env.NSE_DATA_SOURCE_URL || 'https://afx.kwayisi.org/nse/',
    requestTimeoutMs: parseInt(process.env.REQUEST_TIMEOUT_MS) || 30000,
    maxRetries: parseInt(process.env.MAX_RETRIES) || 3,
    retryDelayMs: parseInt(process.env.RETRY_DELAY_MS) || 2000,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH || 'logs/app.log'
  },
  docs: {
    title: process.env.API_TITLE || 'NSE Scraper API',
    version: process.env.API_VERSION || '2.0.0',
    description:
      process.env.API_DESCRIPTION ||
      'A fast and reliable API for scraping Nairobi Securities Exchange stock prices'
  }
};

module.exports = config;
