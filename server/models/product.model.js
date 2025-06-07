const mongoose = require('mongoose');

// Схема для пользователей
let UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String }, // Путь или ID изображения
  favorites: [
    {
      product: { type: String }, // ID товара
    }
  ],
  items: [
    {
      product: { type: String }, // ID товара, созданного пользователем
    }
  ],
  orders: [
    {
      order: { type: String }, // ID заказа в статусе "в получении"
    }
  ],
  registrationDate: { type: String, default: new Date().toISOString() }
});

// Схема для товаров
let ProductSchema = mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  containerCoordinates: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  image: { type: String, required: false }, // Путь к файлу или ID в Cloudinary
  category: { type: String }, // ID категории
  author: { type: String, required: true }, // ID пользователя
  quantity: { type: Number, required: true, min: 0 },
  additionalInfo: { type: String },
  createDate: { type: String, default: new Date().toISOString() }
});

// Схема для категорий
let CategorySchema = mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

// Схема для заказов
let OrderSchema = mongoose.Schema({
  user: { type: String, required: true }, // ID пользователя
  product: { type: String, required: true }, // ID товара
  status: { type: String, enum: ['pending', 'delivered'], default: 'pending' },
  createDate: { type: String, default: new Date().toISOString() }
});

// Модели
let User = mongoose.model('User', UserSchema);
let Product = mongoose.model('Product', ProductSchema);
let Category = mongoose.model('Category', CategorySchema);
let Order = mongoose.model('Order', OrderSchema);

// Экспортируем модели
module.exports = { User, Product, Category, Order };