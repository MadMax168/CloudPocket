import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/login', { email, password }),
  register: (name: string, email: string, password: string) => 
    api.post('/register', { name, email, password }),
  getMe: () => api.get('/api/me'),
};

export const walletAPI = {
  getWallets: () => api.get('/api/wallets'),
  createWallet: (data: any) => api.post('/api/wallets', data),
  // ... more endpoints
};