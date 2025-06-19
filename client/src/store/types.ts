// client/src/types.ts
export interface UserProfile {
  _id: string;
  firebaseUid: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'seller';
  status: 'pending' | 'approved' | 'blocked';
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
  author: UserProfile; // <-- ВАЖНО: автор - это объект UserProfile
  quantity: number;
}

export interface Category {
    _id: string;
    name: string;
    icon: string;
}