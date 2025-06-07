const { User, Product, Category, Order } = require('../models/product.model.js');
const { uploadImage } = require('../services/cloudinary.js');

// Пользователи
exports.userController = {
  createUser: async (req, res) => {
    const { userId, name, email, password } = req.body;
    const user = new User({
      _id: userId,
      name,
      email,
      password,
      registrationDate: new Date().toISOString()
    });
    await user.save();
    res.json(user);
  },

  getProfile: async (req, res) => {
    const { userId } = req.body;
    const user = await User.findById(userId);
    res.json(user);
  },

  updateAvatar: async (req, res) => {
    const { userId } = req.body;
    const avatarId = await uploadImage(req.file, { folder: 'marketplace/avatars' });
    const user = await User.findByIdAndUpdate(userId, { avatar: avatarId }, { new: true });
    res.json(user);
  },

  addFavorite: async (req, res) => {
    const { userId } = req.body;
    const { productId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: { product: productId } } },
      { new: true }
    );
    res.json(user.favorites);
  },

  removeFavorite: async (req, res) => {
    const { userId } = req.body;
    const { productId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: { product: productId } } },
      { new: true }
    );
    res.json(user.favorites);
  }
};

// Товары
exports.productController = {
  createProduct: async (req, res) => {
    const { userId, title, price, containerCoordinates, category, quantity, additionalInfo } = req.body;
    const imageId = await uploadImage(req.file, { folder: 'marketplace/products' });
    const product = new Product({
      title,
      price,
      containerCoordinates: { x: parseFloat(containerCoordinates.x), y: parseFloat(containerCoordinates.y) },
      image: imageId,
      category,
      author: userId,
      quantity: parseInt(quantity),
      additionalInfo,
      createDate: new Date().toISOString()
    });
    await product.save();
    await User.findByIdAndUpdate(userId, { $push: { items: { product: product._id } } });
    res.json(product);
  },

  getProducts: async (req, res) => {
    const { search, category, sortBy } = req.query;
    let query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    let sort = {};
    if (sortBy === 'priceAsc') sort.price = 1;
    if (sortBy === 'priceDesc') sort.price = -1;
    if (sortBy === 'dateAsc') sort.createDate = 1;
    if (sortBy === 'dateDesc') sort.createDate = -1;
    const products = await Product.find(query).sort(sort);
    res.json(products);
  },

  getProduct: async (req, res) => {
    const product = await Product.findById(req.params.id);
    const author = await User.findOne({ _id: product.author });
    const category = await Category.findOne({ _id: product.category });
    res.json({ product, author: author ? { name: author.name, avatar: author.avatar } : null, category: category ? { name: category.name } : null });
  }
};

// Категории
exports.categoryController = {
  getCategories: async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
  },

  createCategory: async (req, res) => {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.json(category);
  }
};

// Заказы
exports.orderController = {
  createOrder: async (req, res) => {
    const { userId, productId } = req.body;
    const order = new Order({
      user: userId,
      product: productId,
      status: 'pending',
      createDate: new Date().toISOString()
    });
    await order.save();
    await User.findByIdAndUpdate(userId, { $push: { orders: { order: order._id } } });
    res.json(order);
  },

  getOrders: async (req, res) => {
    const { userId } = req.body;
    const orders = await Order.find({ user: userId });
    res.json(orders);
  }
};