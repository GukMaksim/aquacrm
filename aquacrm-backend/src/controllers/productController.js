import Product from "../models/Product.js";

// Функция для создания нового продукта
export const createProduct = async (req, res) => {
  try {
    const { sku, name, description, unit } = req.body;
    const newProduct = new Product({ sku, name, description, unit });
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при создании продукта", error: error.message });
  }
};

// Функция для получения всех продуктов
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении продуктов", error: error.message });
  }
};