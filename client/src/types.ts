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
  author: UserProfile;
  quantity: number;
  containerCoordinates?: { x: number; y: number };
  additionalInfo?: string;
  sizes?: string[];
}

export interface Category {
  _id: string;
  name: string;
  icon: string;
}

export interface Order {
  _id: string;
  user: UserProfile;
  products: { product: Product; quantity: number }[];
  sellers: UserProfile[];
  status: 'pending' | 'delivered';
  createDate: string;
}