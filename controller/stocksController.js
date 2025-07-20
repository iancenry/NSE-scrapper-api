const { stockDataService } = require('./utils.js');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const cache = require('../utils/cache');

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     description: Returns a welcome message with API information
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Welcome to NSE Scraper API
 *                 version:
 *                   type: string
 *                   example: "2.0.0"
 *                 endpoints:
 *                   type: object
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
const welcome = async (req, res, next) => {
  try {
    logger.info('Welcome endpoint accessed', {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(200).json({
      success: true,
      message: 'Welcome to NSE Scraper API 🚀',
      version: '2.0.0',
      description:
        'A fast and reliable API for scraping Nairobi Securities Exchange (NSE) stock prices',
      endpoints: {
        stocks: '/stocks - Get all stocks',
        search: '/stocks/:searchId - Search for specific stocks',
        docs: '/api-docs - API documentation',
        health: '/health - Health check'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error in welcome endpoint:', error);
    next(error);
  }
};

/**
 * @swagger
 * /stocks:
 *   get:
 *     summary: Get all stocks
 *     description: Retrieve all NSE stock data with optional sorting and limiting
 *     tags: [Stocks]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *         description: Number of stocks to return
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [ticker, name, price, change, volume]
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Successfully retrieved stock data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       502:
 *         description: Bad gateway - external service error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const getStocks = async (req, res, next) => {
  try {
    const { limit, sort, order } = req.query;

    logger.info('Get all stocks endpoint accessed', {
      query: req.query,
      ip: req.ip
    });

    const result = await stockDataService.fetchStockData();
    let stocks = result.data;

    // Apply sorting if requested
    if (sort) {
      stocks = stockDataService.sortStocks(stocks, sort, order);
    }

    // Apply limit if requested
    if (limit) {
      const limitNum = parseInt(limit);
      stocks = stocks.slice(0, limitNum);
    }

    const response = {
      success: true,
      data: stocks,
      meta: {
        total: stocks.length,
        cached: result.cached,
        lastUpdated: result.lastUpdated,
        ...(limit && { limit: parseInt(limit) }),
        ...(sort && { sortBy: sort, sortOrder: order || 'asc' })
      },
      timestamp: new Date().toISOString()
    };

    logger.info(`Successfully returned ${stocks.length} stocks`, {
      cached: result.cached,
      total: stocks.length
    });

    res.status(200).json(response);
  } catch (error) {
    logger.error('Error in getStocks:', error);
    next(error);
  }
};

/**
 * @swagger
 * /stocks/{searchId}:
 *   get:
 *     summary: Search for specific stocks
 *     description: Search for stocks by ticker symbol or company name
 *     tags: [Stocks]
 *     parameters:
 *       - in: path
 *         name: searchId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-zA-Z0-9\s\-_.]+$'
 *           minLength: 1
 *           maxLength: 50
 *         description: Search term (ticker symbol or company name)
 *         example: EQTY
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *         description: Number of results to return
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [ticker, name, price, change, volume]
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Successfully found matching stocks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid search parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No stocks found matching search criteria
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const getStock = async (req, res, next) => {
  try {
    const { searchId } = req.params;
    const { limit, sort, order } = req.query;

    logger.info('Search stocks endpoint accessed', {
      searchId,
      query: req.query,
      ip: req.ip
    });

    const result = await stockDataService.fetchStockData();
    let stocks = stockDataService.searchStocks(result.data, searchId);

    if (stocks.length === 0) {
      const error = new AppError(`No stocks found matching '${searchId}'`, 404);
      return next(error);
    }

    // Apply sorting if requested
    if (sort) {
      stocks = stockDataService.sortStocks(stocks, sort, order);
    }

    // Apply limit if requested
    if (limit) {
      const limitNum = parseInt(limit);
      stocks = stocks.slice(0, limitNum);
    }

    const response = {
      success: true,
      data: stocks,
      meta: {
        total: stocks.length,
        searchTerm: searchId,
        cached: result.cached,
        lastUpdated: result.lastUpdated,
        ...(limit && { limit: parseInt(limit) }),
        ...(sort && { sortBy: sort, sortOrder: order || 'asc' })
      },
      timestamp: new Date().toISOString()
    };

    logger.info(
      `Successfully found ${stocks.length} stocks matching '${searchId}'`
    );

    res.status(200).json(response);
  } catch (error) {
    logger.error('Error in getStock:', error);
    next(error);
  }
};

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check the health status of the API and its dependencies
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   example: 3600.123
 *                 cache:
 *                   type: object
 *                 memory:
 *                   type: object
 *       503:
 *         description: Service unavailable
 */
const healthCheck = async (req, res, _next) => {
  try {
    const cacheStats = cache.getStats();
    const memUsage = process.memoryUsage();

    const healthData = {
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      cache: {
        keys: cacheStats.keys,
        hits: cacheStats.hits,
        misses: cacheStats.misses,
        hitRate: cacheStats.hits / (cacheStats.hits + cacheStats.misses) || 0
      },
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
      }
    };

    res.status(200).json(healthData);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  getStocks,
  getStock,
  welcome,
  healthCheck
};
