import axios from 'axios';
import { IUser, IProduct, IOrder, IMessage, INotice, UserRole } from '../types';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept to add token if in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('communimart_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  me: () => api.get<{ success: boolean; user: IUser }>('/auth/me'),
  login: (data: any) => api.post<{ success: boolean; user: IUser; token: string }>('/auth/login', data),
  register: (data: any) => api.post<{ success: boolean; user: IUser; token: string }>('/auth/register', data),
  demoLogin: (role: UserRole) => api.post<{ success: boolean; user: IUser; token: string }>('/auth/demo-login', { role }),
  logout: () => api.post('/auth/logout'),
  updateProfile: (data: Partial<IUser>) => api.put<{ success: boolean; user: IUser }>('/auth/profile', data)
};

export const productsAPI = {
  list: (params?: any) => api.get<{ success: boolean; count: number; data: IProduct[] }>('/products', { params }),
  getById: (id: string) => api.get<{ success: boolean; data: IProduct }>(`/products/${id}`),
  create: (data: any) => api.post<{ success: boolean; data: IProduct }>('/products', data),
  update: (id: string, data: any) => api.put<{ success: boolean; data: IProduct }>(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  toggleAvailability: (id: string) => api.patch<{ success: boolean; data: IProduct }>(`/products/${id}/toggle-availability`)
};

export const ordersAPI = {
  create: (data: any) => api.post<{ success: boolean; data: IOrder }>('/orders', data),
  getMyOrders: () => api.get<{ success: boolean; count: number; data: IOrder[] }>('/orders/my-orders'),
  getById: (id: string) => api.get<{ success: boolean; data: IOrder }>(`/orders/${id}`),
  updateStatus: (id: string, status: string, note?: string) => 
    api.patch<{ success: boolean; data: IOrder }>(`/orders/${id}/status`, { status, note }),
  confirmPayment: (id: string, upiReference?: string) => 
    api.patch<{ success: boolean; data: IOrder }>(`/orders/${id}/pay`, { upiReference }),
  submitReview: (id: string, data: { rating: number; comment: string; badgesAwarded: string[] }) =>
    api.post<{ success: boolean; data: IOrder }>(`/orders/${id}/review`, data)
};

export const chatAPI = {
  getConversations: () => api.get<{ success: boolean; data: any[] }>('/chat/conversations'),
  getMessages: (contactId: string, productId?: string) => 
    api.get<{ success: boolean; data: IMessage[] }>(`/chat/messages/${contactId}`, { params: { productId } }),
  sendMessage: (data: { recipientId: string; text: string; productId?: string; orderId?: string; isQuickReply?: boolean }) =>
    api.post<{ success: boolean; data: IMessage }>('/chat/messages', data)
};

export const noticesAPI = {
  list: (category?: string) => api.get<{ success: boolean; count: number; data: INotice[] }>('/notices', { params: { category } }),
  create: (data: any) => api.post<{ success: boolean; data: INotice }>('/notices', data),
  toggleResolve: (id: string) => api.patch<{ success: boolean; data: INotice }>(`/notices/${id}/resolve`)
};

export const adminAPI = {
  getStats: () => api.get<{ success: boolean; data: any }>('/admin/stats'),
  getResidents: () => api.get<{ success: boolean; count: number; data: IUser[] }>('/admin/residents'),
  updateResident: (id: string, data: any) => api.patch<{ success: boolean; data: IUser }>(`/admin/residents/${id}`, data)
};

