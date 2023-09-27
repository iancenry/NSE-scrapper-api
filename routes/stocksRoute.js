import express from 'express';
const router = express.Router();
import {
  getStocks,
  getStock,
  welcome,
} from '../controller/stocksController.js';

router.get('/', welcome);
router.get('/stocks', getStocks);
router.get('/stocks/:searchId', getStock);

module.exports = router;
