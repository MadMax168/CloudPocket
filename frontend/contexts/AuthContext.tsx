// contexts/AuthContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, tokenManager } from '@/lib/api/api';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
}

// Export the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = tokenManager.getToken();
      if (token) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth check failed:', error);
          tokenManager.removeToken();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (token: string) => {
    try {
      tokenManager.setToken(token);
      const userData = await authApi.getMe();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      tokenManager.removeToken();
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    tokenManager.removeToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout, 
        updateUser, 
        isAuthenticated 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}