// server/models/product.model.js (ПОЛНАЯ ВЕРСИЯ)
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, default: '' },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'seller'], default: 'user' },
  status: { type: String, enum: ['pending', 'approved', 'blocked'], default: 'pending' },
  favorites: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' } }],
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' } }],
  orders: [{ order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' } }]
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  oldPrice: { type: Number },
  brand: { type: String },
  rating: { type: Number, default: 0 },
  containerCoordinates: { x: { type: Number }, y: { type: Number } },
  image: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, default: 1 },
  additionalInfo: { type: String },
  sizes: [String],
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String }
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  status: { type: String, enum: ['pending', 'delivered'], default: 'pending' },
  createDate: { type: String, default: new Date().toISOString() }
});

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Category = mongoose.model('Category', CategorySchema);
const Order = mongoose.model('Order', OrderSchema);

module.exports = { User, Product, Category, Order };