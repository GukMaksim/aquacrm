import express from 'express';
import {  createProduct, getAllProducts } from '../controllers/productController.js';

const productRouter = express.Router();

// Маршрут для создания продукта (POST /api/products)
productRouter.post('/', createProduct);

// Маршрут для получения всех продуктов (GET /api/products)
productRouter.get('/', getAllProducts);

export default productRouter;
