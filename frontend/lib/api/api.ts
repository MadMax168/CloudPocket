import { api } from '@/lib/api/fetch';
import { 
    User, 
    LoginRequest, 
    LoginResponse,
    RegisterRequest, 
    RegisterResponse,
    Wallet,
    WalletInput,
    WalletShare,
    WalletResponse,
    Transaction,
    TransactionInput,
    ShareWalletInput,
} from '@/lib/types';

// Auth API
export const authApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/login', data, { requireAuth: false }),

  register: (data: RegisterRequest) =>
    api.post<RegisterResponse>('/register', data, { requireAuth: false }),

  getMe: () =>
    api.get<User>('/api/me'),

  updatePassword: (oldPassword: string, newPassword: string) =>
    api.put<{ message: string }>('/api/me/password', {
      old_password: oldPassword,
      new_password: newPassword,
    }),

  updateEmail: (email: string) =>
    api.put<User>('/api/me/email', { email }),

  deleteAccount: () =>
    api.delete<void>('/api/me'),
};

// Wallet API
export const walletApi = {
  getWallets: () =>
    api.get<WalletResponse>('/api/wallets'),

  createWallet: (data: WalletInput) =>
    api.post<Wallet>('/api/wallets', data),

  updateWallet: (id: number, data: Partial<WalletInput>) =>
    api.put<Wallet>(`/api/wallets/${id}`, data),

  deleteWallet: (id: number) =>
    api.delete<void>(`/api/wallets/${id}`),
};

// Transaction API
export const transactionApi = {
  getTransactions: (walletId: number) =>
    api.get<Transaction[]>(`/api/wallets/${walletId}/transactions`),

  createTransaction: (walletId: number, data: TransactionInput) =>
    api.post<Transaction>(`/api/wallets/${walletId}/transactions`, data),

  updateTransaction: (walletId: number, transactionId: number, data: Partial<TransactionInput>) =>
    api.put<Transaction>(`/api/wallets/${walletId}/transactions/${transactionId}`, data),

  deleteTransaction: (walletId: number, transactionId: number) =>
    api.delete<void>(`/api/wallets/${walletId}/transactions/${transactionId}`),
};

// Share API
export const shareApi = {
  shareWallet: (walletId: number, data: ShareWalletInput) =>
    api.post<WalletShare>(`/api/wallets/${walletId}/share`, data),

  getSharedWallets: () =>
    api.get<WalletShare[]>('/api/shared-wallets'),

  getPendingShares: () =>
    api.get<WalletShare[]>('/api/pending-shares'),

  respondToShare: (shareId: number, status: string) =>
    api.put<{ message: string }>(`/api/shares/${shareId}`, { status }),
};

// Token Management
export const tokenManager = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  },
};