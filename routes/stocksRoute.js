import express from 'express';
const router = express.Router();
import { getStocks, getStock } from '../controller/stocksController.js';

router.get('/stocks', getStocks);
router.get('/stocks/:searchId', getStock);

export { router };
