const express = require('express');
const router = express.Router();
const { userController, productController, categoryController, orderController } = require('../controllers/product.controller');
const { uploadMiddleware } = require('../services/cloudinary');

// Пользователи, Профиль, Админка
router.post('/users/registerOrLogin', userController.registerOrLogin);
router.put('/users/profile', uploadMiddleware, userController.updateProfile);
router.get('/users/products/:authorId', userController.getUserProducts);
router.get('/users', userController.getAllUsers);
router.put('/users/approve/:userId', userController.approveUser);

// Избранное
router.get('/users/favorites', userController.getFavorites);
router.post('/users/favorites', userController.addFavorite);
router.delete('/users/favorites', userController.removeFavorite);

// Товары
router.post('/products', uploadMiddleware, productController.createProduct);
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);

// Категории
if (categoryController?.getCategories) {
  router.get('/categories', categoryController.getCategories);
}

// Заказы
router.post('/orders', orderController.createOrder);
router.get('/orders/user', orderController.getUserOrders);
router.get('/orders/seller', orderController.getSellerOrders);
router.put('/orders', orderController.updateOrderStatus);

module.exports = router;