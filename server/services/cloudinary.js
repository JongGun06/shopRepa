const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Настройка Cloudinary
cloudinary.config({
  cloud_name: 'ddtq1ack5',
  api_key: '845634458425448',
  api_secret: 'ZTt9tU5JtlAhH5pwfYIU7dMYmzU'
});

// Создаем папку uploads если её нет
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

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
    cb(new Error('Error: Images only (jpeg, jpg, png)!'));
  }
});

// ИЗМЕНЕНО: Функция теперь возвращает полный URL изображения
exports.uploadImage = async (file, options = {}) => {
  try {
    const uploadOptions = {
      folder: options.folder || 'marketplace',
      use_filename: true,
      unique_filename: true,
      transformation: [
        { width: 800, height: 600, crop: 'limit' }, // Ограничиваем размер для оптимизации
        { quality: 'auto' } // Автоматическая оптимизация качества
      ],
      ...options
    };
    
    const result = await cloudinary.uploader.upload(file.path, uploadOptions);
    
    // Удаляем временный файл после загрузки
    fs.unlinkSync(file.path);
    
    // ИЗМЕНЕНО: Возвращаем полный URL вместо public_id
    return result.secure_url; // Возвращаем HTTPS URL изображения
  } catch (error) {
    // Удаляем временный файл в случае ошибки
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw new Error('Image upload failed: ' + error.message);
  }
};

// Функция для получения URL по public_id (если понадобится)
exports.getImageUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    ...options,
    secure: true // Всегда используем HTTPS
  });
};

// Функция для удаления изображения по URL
exports.deleteImage = async (imageUrl) => {
  try {
    // Извлекаем public_id из URL
    const publicId = imageUrl.split('/').pop().split('.')[0];
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error('Image deletion failed: ' + error.message);
  }
};

// Экспорт Multer middleware
exports.uploadMiddleware = upload.single('image');