const mongoose = require('mongoose');

// Схема для пользователей
let UserSchema = mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true, index: true }, // ID из Firebase, уникальный и индексированный для быстрого поиска
  email: { type: String, required: true, unique: true },
  name: { type: String, default: '' }, // Имя, которое пользователь может потом указать
  avatar: { type: String, default: '' }, // Ссылка на фото профиля
  favorites: [{
    product: { type: String }
  }],
  items: [{
    product: { type: String }
  }],
  orders: [{
    order: { type: String }
  }]
}, { timestamps: true }); // Добавили timestamps

// Схема для товаров
// Схема для товаров (ИСПРАВЛЕННАЯ ВЕРСИЯ)
const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Меняем 'name' на 'title'
  price: { type: Number, required: true },
  containerCoordinates: { // Меняем 'location' на 'containerCoordinates'
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  image: { type: String, required: true }, // Теперь это просто URL, как и в твоем контроллере
  category: { type: String, required: true }, // ID категории
  author: { type: String, required: true },   // ID пользователя
  quantity: { type: Number, required: true },
  additionalInfo: { type: String },
  sizes: [String], // Массив строк для размеров
  createDate: { type: Date, default: Date.now }
}, { timestamps: true }); // timestamps все еще полезны

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
const ProductModel = mongoose.model('Product', ProductSchema);
let Category = mongoose.model('Category', CategorySchema);
let Order = mongoose.model('Order', OrderSchema);

// Экспортируем модели
module.exports = { User, ProductModel, Category, Order };