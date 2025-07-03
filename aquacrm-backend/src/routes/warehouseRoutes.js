import express from 'express';
import {createWarehouse, getAllWarehouses} from '../controllers/warehouseController.js';
const router = express.Router();

// Маршрут для создания склада (POST /api/warehouses)
router.post('/', createWarehouse);

// Маршрут для получения всех складов (GET /api/warehouses)
router.get('/', getAllWarehouses);

export default router;