// These should be added to your interface/product.ts file:

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  category: string | Category;
  countInStock: number;
  rating: number;
  numReviews: number;
  discount?: number;
  originalPrice?: number;
  ratingCount?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  discount?: number;
  originalPrice?: number;
  ratingCount?: number;
  tags?: string[];
}

export interface Category {
  _id: string;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ErrorResponse {
  error: string;
  message?: string;
}

// Cart related interfaces
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  onSale?: {
    discountedPrice: number;
    discountPercentage: number;
  };
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: CartItem[];
  total: number;
  customerInfo: CustomerInfo;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RevenueData {
  date: string;
  total: number;
  vnpay: number;
  cod: number;
  completed: number;
  pending: number;
}