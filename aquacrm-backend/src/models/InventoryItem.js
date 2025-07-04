import mongoose from "mongoose";

const InventoryItemSchema = new mongoose.Schema({
  // Ссылка на конкретный товар из коллекции 'products'
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  // Ссылка на склад, где находится товар
  warehouseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  // Для склада-объекта это поле обязательно, для основного - null
  category: {
    type: String,
    trim: true,
    default: null,
    enum: ['Сантехника', 'Электрика']
  },
  // Может быть null, если товар лежит просто в категории
  subcategory: {
    type: String,
    trim: true,
    default: null
  },
}, { timestamps: true });

InventoryItemSchema.index({ productId: 1, warehouseId: 1, category: 1, subcategory: 1 }, { unique: true });

const InventoryItem = mongoose.model("InventoryItem", InventoryItemSchema);

export default InventoryItem;
