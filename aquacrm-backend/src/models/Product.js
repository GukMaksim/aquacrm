import mongoose from "mongoose";

// Описываем схему данных для продукта
const productSchema = new mongoose.Schema({
  sku: { type: String, required: false},
  name: { type: String, required: true },
  description: { type: String, required: false },
  unit: { type: String, required: true, enum: ['кг', 'шт', 'м', 'км', 'л'] },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
