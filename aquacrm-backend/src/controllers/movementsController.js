import InventoryItem from "../models/InventoryItem.js";
import Warehouse from "../models/Warehouse.js";
import Movement from "../models/Movement.js";
import mongoose from "mongoose";

// Эта функция будет обрабатывать все перемещения
export const transferStock = async (req, res) => {
  // Данные, которые мы ожидаем от фронтенда
  const {
    productId,
    quantity,
    fromWarehouseId,
    fromCategory,
    fromSubcategory,
    toWarehouseId,
    toCategory,
    toSubcategory,
  } = req.body;

  if (
    !productId ||
    !quantity ||
    quantity <= 0 ||
    !fromWarehouseId ||
    !toWarehouseId
  ) {
    return res.status(400).json({
      message: "Не все обязательные поля заполнены или количество некорректно",
    });
  }

  // Проверяем, является ли склад назначения объектом
  const toWarehouse = await Warehouse.findById(toWarehouseId);
  if (toWarehouse.type === "site" && !toCategory) {
    return res.status(400).json({
      message: "Для склада-объекта необходимо указать категорию назначения",
    });
  }

  // Используем транзакцию, чтобы обе операции (списание и пополнение) выполнились успешно, или ни одна из них
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Списание товара со склада-источника
    const sourceItem = await InventoryItem.findOneAndUpdate(
      {
        warehouseId: fromWarehouseId,
        productId: productId,
        category: fromCategory || null,
        subcategory: fromSubcategory || null,
        quantity: { $gte: quantity }, // Убедимся, что товара достаточно
      },
      { $inc: { quantity: -quantity } },
      { new: true, session }
    );

    if (!sourceItem) {
      throw new Error(
        "Товара на складе-источнике недостаточно или он не найден"
      );
    }

    // 2. Пополнение товара на складе-назначении
    await InventoryItem.findOneAndUpdate(
      {
        warehouseId: toWarehouseId,
        productId: productId,
        category: toCategory || null,
        subcategory: toSubcategory || null,
      },
      { $inc: { quantity: quantity } },
      { new: true, upsert: true, session } // upsert: true создаст запись, если она не найдена
    );

    // Создаем запись в журнале перемещений
    const newMovement = new Movement({
      productId,
      quantity,
      type: "transfer",
      from: {
        warehouseId: fromWarehouseId,
        category: fromCategory || null,
        subcategory: toSubcategory || null,
      },
      to: {
        warehouseId: toWarehouseId,
        category: toCategory || null,
        subcategory: toSubcategory || null,
      },
    });

    await newMovement.save({ session });

    await session.commitTransaction(); // Завершаем транзакцию
    res.status(200).json({ message: "Перемещение успешно выполнено" });
  } catch (error) {
    await session.abortTransaction(); // Откатываем изменения в случае ошибки
    res
      .status(500)
      .json({ message: "Ошибка во время перемещения", error: error.message });
  } finally {
    session.endSession(); // Завершаем сессию
  }
};

// функція для оприбуткування товару
export const incomeStock = async (req, res) => {
  // Очікуємо ID складу та масив товарів
  const { warehouseId, items } = req.body;

  if (!warehouseId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Необхідно вказати склад та список товарів' })
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
     // Проходимо по кожному товару з накладної
     for (const item of items) {
      const { productId, quantity, price } = item;

      if (!productId || !quantity || quantity <= 0) {
        throw new Error(`Некоректні дані для товару: ${productId}`);
     }

     // 1. Оновлюємо або створюємо залишок на складі
     await InventoryItem.findOneAndUpdate(
      {
        warehouseId: warehouseId,
        productId: productId,
        category: null,
        subcategory: null,
      },
      { $inc: { quantity: quantity } },
      { new: true, upsert: true, session }
     );

     // 2. Створюємо запис в журналі переміщень
     const newMovement = new Movement({
      productId,
      quantity,
      type: 'income',
      to: { warehouseId: warehouseId},

     });
     await newMovement.save({ session });
  }

  await session.commitTransaction();
  res.status(200).json({ message: 'Товари успішно оприбутковані' });

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: 'Помилка при оприбуткуванні товарів', error: error.message });
  } finally {
    session.endSession();
  }
};
