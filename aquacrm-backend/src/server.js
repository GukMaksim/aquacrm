import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

// Импортируем маршруты
import warehouseRouter from './routes/warehouseRoutes.js';
import productRouter from './routes/productRoutes.js';
import inventoryRouter from './routes/inventoryRoutes.js';
import movementRouter from './routes/movementsRoutes.js';

// Подключаем middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('❌ Не задана переменная окружения MONGO_URI!');
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB подключена успешно!');
  } catch (error) {
    console.error('❌ Ошибка подключения к MongoDB:', error.message);
    process.exit(1); // Завершение процесса при ошибке подключения
  }
};

connectDB(); // Вызываем функцию подключения

// тестовый маршрут
app.get('/', (req, res) => {
  res.send('API для AquaCRM работает!');
});

// Подключаем маршруты
app.use('/api/warehouses', warehouseRouter);
app.use('/api/products', productRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/movements', movementRouter);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});