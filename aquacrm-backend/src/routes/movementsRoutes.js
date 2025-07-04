import express from "express";
import { transferStock } from "../controllers/movementsController.js";

const movementRouter = express.Router();

// Маршрут для выполнения перемещения
// POST /api/movements/transfer
movementRouter.post("/transfer", transferStock);

export default movementRouter;
