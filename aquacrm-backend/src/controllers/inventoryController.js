import InventoryItem from "../models/InventoryItem.js";

// Функция для получения всех остатков на складах
export const getAllInventoryItems = async (req, res) => {
  try {
    const items = await InventoryItem.find()
      .populate('productId', 'name sku unit') // Взять из товара только поля name, sku, unit
      .populate('warehouseId', 'name type');   // Взять из склада только поля name и type

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({
      message: "Ошибка при получении остатков на складах",
      error: error.message
    });
  }
};

// Функция для добавления новой позиции на склад (для инициализации или тестов)
export const addInventoryItem = async (req, res) => {
  try {
    const { productId, warehouseId, quantity, category, subcategory } = req.body;

    // Проверяем, может такая позиция уже существует
    let item = await InventoryItem.findOne({ productId, warehouseId, category });

    if (item) {
      // Если существует, просто обновляем количество
      item.quantity += quantity;
    } else {
      // Если не существует, создаем новую позицию
      item = new InventoryItem({
        productId,
        warehouseId,
        quantity,
        category,
        subcategory
      });
    }

    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (error) {
    // Если ошибка связана с уникальным индексом, будет код 11000
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Эта позиция уже существует. Используйте операцию перемещения или прихода для изменения количества.' });
    }
    res.status(500).json({ message: 'Ошибка при добавлении позиции на склад', error: error.message });
  }
};