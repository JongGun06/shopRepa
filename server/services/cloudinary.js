const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

// Настройка Cloudinary
cloudinary.config({
  cloud_name: 'ddtq1ack5',
  api_key: '845634458425448',
  api_secret: 'ZTt9tU5JtlAhH5pwfYIU7dMYmzU'
});

// Настройка Multer для временного хранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb('Error: Images only (jpeg, jpg, png)!');
  }
});

// Функция загрузки изображения в Cloudinary
exports.uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'marketplace',
      use_filename: true,
      unique_filename: true
    });
    return result.public_id; // Возвращаем public_id для сохранения в базе
  } catch (error) {
    throw new Error('Image upload failed: ' + error.message);
  }
};

// Экспорт Multer middleware
exports.uploadMiddleware = upload.single('image');