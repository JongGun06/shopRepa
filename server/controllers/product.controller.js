const { User, Product, Category, Order } = require('../models/product.model.js');
const { uploadImage, deleteImage } = require('../services/cloudinary.js');

// ================== USER CONTROLLER ==================
exports.userController = {
  registerOrLogin: async (req, res) => {
    try {
      const { firebaseUid, email } = req.body;
      if (!firebaseUid || !email) { return res.status(400).json({ error: 'Отсутствует firebaseUid или email' }); }
      let user = await User.findOne({ firebaseUid });
      if (user) { return res.json(user); }
      const newUser = new User({ firebaseUid, email, name: email.split('@')[0] });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) { res.status(500).json({ error: 'Ошибка на сервере' }); }
  },
  updateProfile: async (req, res) => {
    try {
      const { firebaseUid, name } = req.body;
      if (!firebaseUid) return res.status(400).json({ error: 'firebaseUid is required' });
      let updateData = {};
      if (name) updateData.name = name;
      if (req.file) {
        const avatarUrl = await uploadImage(req.file, { folder: 'marketplace/avatars' });
        updateData.avatar = avatarUrl;
      }
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'Нет данных для обновления' });
      }
      const user = await User.findOneAndUpdate({ firebaseUid }, updateData, { new: true });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  getUserProducts: async (req, res) => {
    try {
      const { authorId } = req.params;
      if (!authorId) { return res.status(400).json({ error: 'Author ID is required' }); }
      const products = await Product.find({ author: authorId }).sort({ createdAt: -1 });
      res.json(products);
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  addFavorite: async (req, res) => {
    try {
      const { firebaseUid, productId } = req.body;
      if (!firebaseUid || !productId) { return res.status(400).json({ error: 'firebaseUid and productId are required' }); }
      const user = await User.findOneAndUpdate({ firebaseUid }, { $addToSet: { favorites: { product: productId } } }, { new: true });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user.favorites);
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  removeFavorite: async (req, res) => {
    try {
      const { firebaseUid, productId } = req.body;
      if (!firebaseUid || !productId) { return res.status(400).json({ error: 'firebaseUid and productId are required' }); }
      const user = await User.findOneAndUpdate({ firebaseUid }, { $pull: { favorites: { product: productId } } }, { new: true });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user.favorites);
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  getFavorites: async (req, res) => {
    try {
      const { firebaseUid } = req.query;
      if (!firebaseUid) { return res.status(400).json({ error: 'firebaseUid is required' }); }
      const user = await User.findOne({ firebaseUid }).populate({ path: 'favorites.product', model: 'Product' });
      if (!user) { return res.status(404).json({ error: 'User not found' }); }
      const favoriteProducts = user.favorites.map(fav => fav.product).filter(p => p != null);
      res.json(favoriteProducts);
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().sort({ createdAt: -1 });
      res.json(users);
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  approveUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findByIdAndUpdate(userId, { status: 'approved', role: 'seller' }, { new: true });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
};

// ================== PRODUCT CONTROLLER ==================
exports.productController = {
  createProduct: async (req, res) => {
    try {
      const { firebaseUid, title, description, price, category, containerX, containerY, quantity, brand, rating, oldPrice, sizes, additionalInfo } = req.body;
      const author = await User.findOne({ firebaseUid });
      if (!author) {
        return res.status(404).json({ error: 'Автор не найден' });
      }
      if (author.role !== 'seller' || author.status !== 'approved') {
        return res.status(403).json({ error: 'Только одобренные продавцы могут добавлять товары' });
      }
      if (!req.file) { return res.status(400).json({ error: 'Изображение обязательно' }); }
      const imageUrl = await uploadImage(req.file, { folder: 'marketplace/products' });
      const product = new Product({
        title, description, price: parseFloat(price), image: imageUrl, category,
        author: author._id,
        containerCoordinates: { x: parseFloat(containerX || '0'), y: parseFloat(containerY || '0') },
        quantity: quantity ? parseInt(quantity) : 1,
        brand: brand || "No Brand",
        rating: rating ? parseFloat(rating) : 0,
        oldPrice: oldPrice ? parseFloat(oldPrice) : null,
        sizes: sizes ? JSON.parse(sizes) : [],
        additionalInfo,
      });
      await product.save();
      await User.findByIdAndUpdate(author._id, { $push: { items: { product: product._id } } });
      res.status(201).json(product);
    } catch (error) {
      console.error("Product creation error:", error);
      res.status(500).json({ error: error.message });
    }
  },
  getProducts: async (req, res) => {
    try {
      const { search, category, price_gte, price_lte, sortBy = 'default' } = req.query;
      let query = { quantity: { $gt: 0 } }; // Исключаем товары с quantity <= 0
      if (search) { query.title = { $regex: search, $options: 'i' }; }
      if (category) { query.category = category; }
      const priceFilter = {};
      if (price_gte) priceFilter.$gte = Number(price_gte);
      if (price_lte) priceFilter.$lte = Number(price_lte);
      if (Object.keys(priceFilter).length > 0) query.price = priceFilter;
      let sort = {};
      switch (sortBy) {
        case 'priceAsc': sort = { price: 1 }; break;
        case 'priceDesc': sort = { price: -1 }; break;
        case 'dateNew': sort = { createdAt: -1 }; break;
      }
      const products = await Product.find(query).sort(sort);
      res.json(products);
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate('author', 'name avatar');
      if (!product) { return res.status(404).json({ error: 'Товар не найден' }); }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message }); }
  },
};

// ================== CATEGORY CONTROLLER ==================
exports.categoryController = {
  getCategories: async (req, res) => { 
    try { 
      const categories = await Category.find(); 
      res.json(categories); 
    } catch (error) { 
      res.status(500).json({ error: error.message }); }
  },
};

// ================== ORDER CONTROLLER ==================
exports.orderController = {
  createOrder: async (req, res) => {
    try {
      const { firebaseUid, products } = req.body;
      if (!firebaseUid || !products || !products.length) {
        return res.status(400).json({ error: 'firebaseUid and products are required' });
      }
      const user = await User.findOne({ firebaseUid });
      if (!user) return res.status(404).json({ error: 'User not found' });
      const productIds = products.map(p => p.productId);
      const dbProducts = await Product.find({ _id: { $in: productIds } }).populate('author');
      if (dbProducts.length !== products.length) {
        return res.status(404).json({ error: 'Some products not found' });
      }
      for (let { productId, quantity } of products) {
        const product = dbProducts.find(p => p._id.toString() === productId);
        if (!product) {
          return res.status(404).json({ error: `Product ${productId} not found` });
        }
        if (product.quantity < quantity) {
          return res.status(400).json({ 
            error: `Недостаточно товара "${product.title}". Доступно: ${product.quantity}, заказано: ${quantity}` 
          });
        }
      }
      const sellers = [...new Set(dbProducts.map(p => p.author._id))];
      const order = new Order({
        user: user._id,
        products: products.map(p => ({ product: p.productId, quantity: p.quantity })),
        sellers,
        status: 'pending',
      });
      await order.save();
      for (let { productId, quantity } of products) {
        await Product.findByIdAndUpdate(productId, { $inc: { quantity: -quantity } });
      }
      await User.findByIdAndUpdate(user._id, { $push: { orders: { order: order._id } } });
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getUserOrders: async (req, res) => {
    try {
      const { firebaseUid } = req.query;
      if (!firebaseUid) return res.status(400).json({ error: 'firebaseUid is required' });
      const user = await User.findOne({ firebaseUid }).populate({
        path: 'orders.order',
        populate: { path: 'products.product', model: 'Product' },
      });
      if (!user) return res.status(404).json({ error: 'User not found' });
      const orders = user.orders.map(o => o.order).filter(o => o != null);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getSellerOrders: async (req, res) => {
    try {
      const { firebaseUid } = req.query;
      if (!firebaseUid) return res.status(400).json({ error: 'firebaseUid is required' });
      const user = await User.findOne({ firebaseUid });
      if (!user) return res.status(404).json({ error: 'User not found' });
      const orders = await Order.find({ sellers: user._id }).populate({
        path: 'products.product',
        model: 'Product',
        populate: { path: 'author', model: 'User' },
      }).populate('user', 'name email');
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateOrderStatus: async (req, res) => {
    try {
      const { orderId, status, firebaseUid } = req.body;
      if (!orderId || !status || !firebaseUid) {
        return res.status(400).json({ error: 'orderId, status, and firebaseUid are required' });
      }
      if (!['pending', 'delivered'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      const user = await User.findOne({ firebaseUid });
      if (!user) return res.status(404).json({ error: 'User not found' });
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      if (order.user.toString() !== user._id.toString() && !order.sellers.includes(user._id)) {
        return res.status(403).json({ error: 'Unauthorized to update this order' });
      }
      order.status = status;
      await order.save();
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};