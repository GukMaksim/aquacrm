import express from "express";
import { transferStock, incomeStock } from "../controllers/movementsController.js";

const movementRouter = express.Router();

// Маршрут для выполнения перемещения
// POST /api/movements/transfer
movementRouter.post("/transfer", transferStock);

// Маршрут для виконання приходу товару
// POST /api/movements/income
movementRouter.post("/income", incomeStock);

export default movementRouter;
