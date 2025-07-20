const axios = require('axios');
const cheerio = require('cheerio');
const cache = require('../utils/cache');
const logger = require('../utils/logger');
const config = require('../config');
const { AppError } = require('../middleware/errorHandler');

class StockDataService {
  constructor() {
    this.axiosInstance = axios.create({
      timeout: 15000, // 15 seconds timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
  }

  async fetchStockData() {
    const cacheKey = 'nse_stock_data';
    
    // Try to get data from cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      logger.info('Serving stock data from cache');
      return {
        data: cachedData.stocks,
        cached: true,
        lastUpdated: cachedData.lastUpdated
      };
    }

    try {
      logger.info('Fetching fresh stock data from source');
      const response = await this.axiosInstance.get(config.external.nseDataSourceUrl);
      
      if (response.status !== 200) {
        throw new AppError(`External API returned status ${response.status}`, 502);
      }

      const stocks = this.parseStockData(response.data);
      
      if (!stocks || stocks.length === 0) {
        throw new AppError('No stock data could be parsed from the source', 502);
      }

      const stockData = {
        stocks,
        lastUpdated: new Date().toISOString()
      };

      // Cache the data
      cache.set(cacheKey, stockData);
      
      logger.info(`Successfully fetched and cached ${stocks.length} stocks`);
      
      return {
        data: stocks,
        cached: false,
        lastUpdated: stockData.lastUpdated
      };

    } catch (error) {
      logger.error('Error fetching stock data:', error);
      
      if (error instanceof AppError) {
        throw error;
      }

      // Check if it's a network error
      if (error.code === 'ECONNABORTED') {
        throw new AppError('Request timeout - external service is taking too long to respond', 504);
      }
      
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new AppError('Unable to connect to external data source', 502);
      }

      throw new AppError('Failed to fetch stock data from external source', 502);
    }
  }

  parseStockData(html) {
    try {
      const $ = cheerio.load(html);
      const stocks = [];

      $('div.t > table > tbody > tr', html).each(function () {
        try {
          const row = {};
          const cells = $(this).find('td');
          
          if (cells.length >= 5) {
            row['ticker'] = $(cells[0]).text().trim() || '';
            row['name'] = $(cells[1]).text().trim() || '';
            row['volume'] = $(cells[2]).text().trim() || '0';
            row['price'] = $(cells[3]).text().trim() || '0.00';
            row['change'] = $(cells[4]).text().trim() || '+0.00 (+0.00%)';
            
            // Only add if we have at least ticker and name
            if (row.ticker && row.name) {
              stocks.push(row);
            }
          }
        } catch (parseError) {
          logger.warn('Error parsing stock row:', parseError);
        }
      });

      return stocks;
    } catch (error) {
      logger.error('Error parsing HTML:', error);
      throw new AppError('Failed to parse stock data from source', 502);
    }
  }

  searchStocks(stocks, searchTerm) {
    if (!searchTerm || typeof searchTerm !== 'string') {
      return stocks;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return stocks.filter(stock => {
      return stock.ticker.toLowerCase().includes(lowerSearchTerm) ||
             stock.name.toLowerCase().includes(lowerSearchTerm);
    });
  }

  sortStocks(stocks, sortBy = 'ticker', order = 'asc') {
    const validSortFields = ['ticker', 'name', 'price', 'change', 'volume'];
    
    if (!validSortFields.includes(sortBy)) {
      sortBy = 'ticker';
    }

    return stocks.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      // Handle numeric fields
      if (sortBy === 'price') {
        aVal = parseFloat(aVal.replace(/[^0-9.-]/g, '')) || 0;
        bVal = parseFloat(bVal.replace(/[^0-9.-]/g, '')) || 0;
      } else if (sortBy === 'volume') {
        aVal = parseInt(aVal.replace(/[^0-9]/g, '')) || 0;
        bVal = parseInt(bVal.replace(/[^0-9]/g, '')) || 0;
      } else {
        aVal = aVal.toString().toLowerCase();
        bVal = bVal.toString().toLowerCase();
      }

      if (order === 'desc') {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
      
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    });
  }
}

const stockDataService = new StockDataService();

module.exports = { stockDataService };
