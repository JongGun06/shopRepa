// client/src/types.ts (НОВЫЙ ФАЙЛ)

export interface UserProfile {
  _id: string;
  firebaseUid: string;
  email: string;
  name: string;
  avatar?: string;
}

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

export interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  oldPrice?: number;
  brand?: string;
  rating?: number;
  image: string;
  category: string;
  quantity: number;
}

export interface Category {
    _id: string;
    name: string;
    icon: string;
}