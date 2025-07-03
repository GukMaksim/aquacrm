import express from 'express';
import {createWarehouse, getAllWarehouses} from '../controllers/warehouseController.js';

const warehouseRouter = express.Router();

// Маршрут для создания склада (POST /api/warehouses)
warehouseRouter.post('/', createWarehouse);

// Маршрут для получения всех складов (GET /api/warehouses)
warehouseRouter.get('/', getAllWarehouses);

export default warehouseRouter;