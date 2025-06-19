// server/controllers/product.controller.js (ПОЛНАЯ ИСПРАВЛЕННАЯ ВЕРСИЯ)
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
    }
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
            additionalInfo
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
            let query = {};
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
            res.status(500).json({ error: error.message });
        }
    },
};

// ================== CATEGORY & ORDER CONTROLLERS ==================
exports.categoryController = {
    getCategories: async (req, res) => { try { const categories = await Category.find(); res.json(categories); } catch (error) { res.status(500).json({ error: error.message }); } },
};
exports.orderController = {};