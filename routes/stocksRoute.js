const express = require('express');
const router = express.Router();
const {
  getStocks,
  getStock,
  welcome,
  healthCheck
} = require('../controller/stocksController.js');
const { validate, validateQuery, schemas } = require('../middleware/validation');
const rateLimits = require('../middleware/rateLimiter');

// Apply rate limiting to all routes
router.use(rateLimits.general);

// Routes
router.get('/', welcome);

router.get('/health', healthCheck);

router.get('/stocks', 
  validateQuery(schemas.queryParams),
  getStocks
);

router.get('/stocks/:searchId', 
  validate(schemas.searchStock),
  validateQuery(schemas.queryParams),
  getStock
);

module.exports = router;
