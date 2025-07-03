import Warehouse from "../models/Warehouse.js";

// Функция для создания нового склада
export const createWarehouse = async (req, res) => {
  try {
    const { name, type, address } = req.body;
    const newWarehouse = new Warehouse({ name, type, address });
    const savedWarehouse = await newWarehouse.save();

    res.status(201).json(savedWarehouse);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при создании склада", error: error.message });
  }
};

// Функция для получения всех складов
export const getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.status(200).json(warehouses);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении складов", error: error.message });
  }
};