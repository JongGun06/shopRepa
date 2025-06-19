const { User, ProductModel: Product, Category, Order } = require('../models/product.model.js');
const { uploadImage, deleteImage } = require('../services/cloudinary.js');

// Пользователи
exports.userController = {
  createUser: async (req, res) => {
    try {
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
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProfile: async (req, res) => {
    try {
      const { userId } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateAvatar: async (req, res) => {
    try {
      const { userId } = req.body;
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const avatarId = await uploadImage(req.file, { folder: 'marketplace/avatars' });
      const user = await User.findByIdAndUpdate(userId, { avatar: avatarId }, { new: true });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  addFavorite: async (req, res) => {
    try {
      const { userId } = req.body;
      const { productId } = req.params;
      const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { favorites: { product: productId } } },
        { new: true }
      );
      res.json(user.favorites);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  removeFavorite: async (req, res) => {
    try {
      const { userId } = req.body;
      const { productId } = req.params;
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { favorites: { product: productId } } },
        { new: true }
      );
      res.json(user.favorites);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

// Товары
exports.productController = {
  createProduct: async (req, res) => {
    try {
      const { userId, title, price, containerCoordinates, category, quantity, additionalInfo, sizes } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
      }
      
      const imageId = await uploadImage(req.file, { folder: 'marketplace/products' });
      
      // Парсим координаты если они пришли как строка
      let coords = containerCoordinates;
      if (typeof containerCoordinates === 'string') {
        coords = JSON.parse(containerCoordinates);
      }

      // Парсим размеры если они пришли как строка
      let productSizes = null;
      if (sizes) {
        if (typeof sizes === 'string') {
          productSizes = JSON.parse(sizes);
        } else {
          productSizes = sizes;
        }
      }
      
      const product = new Product({
        title,
        price: parseFloat(price),
        containerCoordinates: { 
          x: parseFloat(coords.x), 
          y: parseFloat(coords.y) 
        },
        image: imageId,
        category,
        author: userId,
        quantity: parseInt(quantity),
        additionalInfo,
        sizes: productSizes || [],
        createDate: new Date().toISOString()
      });
      
      await product.save();
      await User.findByIdAndUpdate(userId, { $push: { items: { product: product._id } } });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProducts: async (req, res) => {
    try {
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
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      const author = await User.findOne({ _id: product.author });
      const category = await Category.findOne({ _id: product.category });
      
      res.json({ 
        product, 
        author: author ? { name: author.name, avatar: author.avatar } : null, 
        category: category ? { name: category.name } : null 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      // Удаляем изображение из Cloudinary если оно есть
      if (product.image) {
        try {
          await deleteImage(product.image);
        } catch (imageError) {
          console.log('Failed to delete image from Cloudinary:', imageError.message);
          // Продолжаем удаление товара даже если не удалось удалить изображение
        }
      }
      
      // Удаляем товар из избранного пользователей
      await User.updateMany(
        { 'favorites.product': req.params.id },
        { $pull: { favorites: { product: req.params.id } } }
      );
      
      // Удаляем товар из списка товаров автора
      await User.updateMany(
        { 'items.product': req.params.id },
        { $pull: { items: { product: req.params.id } } }
      );
      
      // Удаляем товар
      await Product.findByIdAndDelete(req.params.id);
      
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

// Категории
exports.categoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const category = new Category({ name });
      await category.save();
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

// Заказы
exports.orderController = {
  createOrder: async (req, res) => {
    try {
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
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getOrders: async (req, res) => {
    try {
      const { userId } = req.body;
      const orders = await Order.find({ user: userId });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};