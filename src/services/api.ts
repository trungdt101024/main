import axios, { AxiosError, AxiosResponse } from 'axios';
import { Product, Category, User, AuthResponse, ErrorResponse, CartItem } from '../interface/product';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    // Log out user if token is invalid or expired
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Helper to transform backend product to frontend format
const transformProduct = (product: any): Product => ({
  id: product._id,
  _id: product._id,
  name: product.name,
  price: product.price,
  image: product.image,
  images: product.images,
  category: product.category,
  description: product.description,
  createdAt: product.createdAt,
  discount: product.discount,
  originalPrice: product.originalPrice,
  rating: product.rating,
  ratingCount: product.ratingCount,
  tags: product.tags,
  countInStock: product.countInStock || 0,
  numReviews: product.numReviews || 0,
  updatedAt: product.updatedAt || product.createdAt
});

// Helper to transform backend category to frontend format
const transformCategory = (category: any): Category => ({
  id: category._id,
  _id: category._id,
  name: category.name,
  image: category.image,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt || category.createdAt
});

export const authService = {
  register: async (userData: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data || { error: 'Registration failed' };
    }
  },

  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data || { error: 'Login failed' };
    }
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  validateToken: async (): Promise<User | null> => {
    try {
      const response = await api.get<User>('/auth/me');
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch {
      // Remove invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  },

  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  }
};

export const categoryService = {
  getAll: async (): Promise<AxiosResponse<Category[]>> => {
    const response = await api.get<Category[]>('/categories');
    response.data = response.data.map(transformCategory);
    return response;
  },
  
  getById: async (id: string): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`);
    return transformCategory(response.data);
  },
  
  create: async (formData: FormData): Promise<AxiosResponse<Category>> => {
    const response = await api.post<Category>('/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    response.data = transformCategory(response.data);
    return response;
  },
  
  update: async (id: string, formData: FormData): Promise<AxiosResponse<Category>> => {
    const response = await api.put<Category>(`/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    response.data = transformCategory(response.data);
    return response;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  }
};

export const productService = {
  getAll: async (): Promise<AxiosResponse<Product[]>> => {
    const response = await api.get<Product[]>('/products');
    response.data = response.data.map(transformProduct);
    return response;
  },
  
  getById: async (id: string): Promise<AxiosResponse<Product>> => {
    const response = await api.get<Product>(`/products/${id}`);
    response.data = transformProduct(response.data);
    return response;
  },
  
  create: async (formData: FormData): Promise<AxiosResponse<Product>> => {
    const response = await api.post<Product>('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    response.data = transformProduct(response.data);
    return response;
  },
  
  update: async (id: string, formData: FormData): Promise<AxiosResponse<Product>> => {
    const response = await api.put<Product>(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    response.data = transformProduct(response.data);
    return response;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
  
  getByCategoryId: async (categoryId: string): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/products/category/${categoryId}`);
    return response.data.map(transformProduct);
  },
  
  getBestSellers: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data.map(transformProduct);
  },
  
  getNewArrivals: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data.map(transformProduct);
  }
};

// Add cartService implementation
export const cartService = {
  getCart: async (): Promise<AxiosResponse<CartItem[]>> => {
    const response = await api.get('/cart');
    return response;
  },
  
  addToCart: async (productId: string, quantity: number = 1): Promise<AxiosResponse<CartItem[]>> => {
    const response = await api.post('/cart', { productId, quantity });
    return response;
  },
  
  updateQuantity: async (productId: string, quantity: number): Promise<AxiosResponse<CartItem[]>> => {
    const response = await api.put(`/cart/${productId}`, { quantity });
    return response;
  },
  
  removeItem: async (productId: string): Promise<AxiosResponse<CartItem[]>> => {
    const response = await api.delete(`/cart/${productId}`);
    return response;
  },
  
  clearCart: async (): Promise<AxiosResponse<void>> => {
    const response = await api.delete('/cart');
    return response;
  }
};

export const adminService = {
  getDashboardData: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  }
};

// Add CustomerInfo interface
interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export const paymentService = {
  async createVNPayPayment(paymentData: {
    amount: number;
    customerInfo: CustomerInfo;
    orderDescription: string;
  }) {
    const response = await axios.post(`${API_URL}/payments/create-vnpay`, {
      ...paymentData,
      returnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:5173/payment-return'
    });
    return response;
  },
};
export const revenueService = {
  // Keep existing methods
  
  getAdminRevenueStatistics: async (params: { timeRange: string }) => {
    const response = await api.get('/admin/revenue', { params });
    return response;
  }
};
export const orderService = {
  getUserOrders: async () => {
    const response = await api.get('/orders');
    return response;
  },
  
  getOrderById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response;
  },
  
  getAllOrders: async () => {
    const response = await api.get('/admin/orders');
    return response;
  },
  
  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await api.put(`/admin/orders/${orderId}/status`, { status });
    return response;
  },
  
  updatePaymentStatus: async (orderId: string, status: string) => {
    const response = await api.put(`/admin/orders/${orderId}/payment-status`, { status });
    return response;
  }
};
export default api;
// Add this to your existing revenueService object

