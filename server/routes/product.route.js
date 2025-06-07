const express = require('express');
const router = express.Router();
const { userController, productController, categoryController, orderController } = require('../controllers/product.controller.js');
const { uploadMiddleware } = require('../services/cloudinary');

// Пользователи
router.post('/users', userController.createUser); // Создание пользователя
router.post('/users/profile', userController.getProfile); // Получение профиля
router.post('/users/avatar', uploadMiddleware, userController.updateAvatar); // Обновление аватарки
router.post('/users/favorites/:productId', userController.addFavorite); // Добавить в избранное
router.delete('/users/favorites/:productId', userController.removeFavorite); // Удалить из избранного

// Товары
router.post('/products', uploadMiddleware, productController.createProduct); // Создание товара
router.get('/products', productController.getProducts); // Получение списка товаров
router.get('/products/:id', productController.getProduct); // Получение одного товара

// Категории
router.get('/categories', categoryController.getCategories); // Получение списка категорий
router.post('/categories', categoryController.createCategory); // Создание категории

// Заказы
router.post('/orders', orderController.createOrder); // Создание заказа
router.post('/orders/list', orderController.getOrders); // Получение списка заказов

module.exports = router;
