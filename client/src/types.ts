// client/src/store/types.ts (НОВЫЙ ФАЙЛ)

// Тип для параметров фильтрации
export interface GetProductsParams {
  search?: string;
  category?: string;
  price_gte?: number;
  price_lte?: number;
  sortBy?: string;
}

// Тип для категории
export interface Category {
  _id: string;
  name: string;
  icon: string;
}

// client/src/types.ts (НОВЫЙ ФАЙЛ)

// Тип для профиля пользователя из нашей базы MongoDB
export interface UserProfile {
  _id: string;
  firebaseUid: string;
  email: string;
  name: string;
  avatar?: string;
  favorites: { product: string }[]; // Массив ID избранных товаров
}

// Тип для товара из нашей базы MongoDB
export interface Product {
  _id: string;
  title: string;
  price: number;
  oldPrice?: number;
  brand?: string;
  rating?: number;
  image: string;
  category: string;
  author: string;
  quantity: number;
}