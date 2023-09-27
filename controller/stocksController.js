import axios from 'axios';
import * as cheerio from 'cheerio';
import { getData } from './utils';

/**
 * @desc  Get all stocks
 * @route GET stocks
 * @access Public
 */
const getStocks = async (req, res) => {
  const data = await getData();
  res.json(data);
};

/**
 * @desc  Get a single stocks
 * @route GET /stocks/:searchId - searchId should be any keyword that identifies the stock
 * @access Public
 */
const getStock = async (req, res) => {
  const allStocks = await getData();
  let stock = allStocks.filter(
    (item) =>
      item.ticker.toLowerCase().includes(req.params.searchId.toLowerCase()) ||
      item.name.toLowerCase().includes(req.params.searchId.toLowerCase())
  );
  res.json(stock);
};

export { getStocks, getStock };
