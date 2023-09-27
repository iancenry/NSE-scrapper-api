const express = require('express');
const router = express.Router();
const {
  getStocks,
  getStock,
  welcome,
} = require('../controller/stocksController.js');

router.get('/', welcome);
router.get('/stocks', getStocks);
router.get('/stocks/:searchId', getStock);

module.exports = router;
