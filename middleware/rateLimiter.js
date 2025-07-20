const rateLimit = require('express-rate-limit');
const config = require('../config');

const createRateLimit = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || config.api.rateLimitWindowMs,
    max: options.max || config.api.rateLimitMaxRequests,
    message: {
      success: false,
      error: 'Too Many Requests',
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(options.windowMs / 1000 / 60) || 15,
      timestamp: new Date().toISOString()
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: 'Too Many Requests',
        message: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(
          (options.windowMs || config.api.rateLimitWindowMs) / 1000 / 60
        ),
        timestamp: new Date().toISOString()
      });
    }
  });
};

// Different rate limits for different endpoints
const rateLimits = {
  general: createRateLimit(),
  strict: createRateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 20 // limit each IP to 20 requests per windowMs
  })
};

module.exports = rateLimits;
