const { getData } = require('./utils.js');

/**
 * @desc  Welcome notes
 * @route GET .
 * @access Public
 */
const welcome = async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ message: 'Hey you are using the NSE scrapper api 🚝🏄‍♂️🏄‍♂️😎' });
};

/**
 * @desc  Get all stocks
 * @route GET stocks
 * @access Public
 */
const getStocks = async (req, res) => {
  const data = await getData();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
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
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(stock);
};

module.exports = { getStocks, getStock, welcome };
