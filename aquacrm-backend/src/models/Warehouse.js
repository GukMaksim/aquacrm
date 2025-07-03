import mongoose from "mongoose";

// Описываем схему данных для склада
const warehouseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, enum: ['main', 'site'] },
  address: { type: String, required: true },
}, { timestamps: true }); // Добавляет поля createdAt и updatedAt


const Warehouse = mongoose.model("Warehouse", warehouseSchema);

export default Warehouse;
