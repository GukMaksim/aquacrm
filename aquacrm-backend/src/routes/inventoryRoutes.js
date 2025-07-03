import express from 'express';
import { getAllInventoryItems, addInventoryItem } from '../controllers/inventoryController.js';

const inventoryRouter = express.Router();

// GET /api/inventory - получить все остатки
inventoryRouter.get('/', getAllInventoryItems);

// POST /api/inventory - добавить новую позицию (или обновить существующую)
inventoryRouter.post('/', addInventoryItem);

export default inventoryRouter;
