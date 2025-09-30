// lib/api/fetch.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  success?: boolean;
  message?: string;
}

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Get token from localStorage (client-side only)
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Remove token and redirect to login
const handleAuthError = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  }
};

// Main fetch function
export async function apiFetch<T>(
  endpoint: string, 
  options: FetchOptions = {}
): Promise<T> {
  const { requireAuth = true, headers = {}, ...fetchOptions } = options;
  
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  // Setup headers
  const requestHeaders = new Headers({
    'Content-Type': 'application/json',
  });

  // Add custom headers
  if (headers) {
    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        requestHeaders.set(key, value);
      });
    } else if (Array.isArray(headers)) {
      headers.forEach(([key, value]) => {
        requestHeaders.set(key, value);
      });
    } else {
      Object.entries(headers).forEach(([key, value]) => {
        requestHeaders.set(key, value);
      });
    }
  }

  // Add authorization header if required
  if (requireAuth) {
    const token = getToken();
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
    });

    // Handle auth errors
    if (response.status === 401 && requireAuth) {
      handleAuthError();
      throw new ApiError('Unauthorized', 401);
    }

    // Handle other HTTP errors
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      
      throw new ApiError(
        errorData.message || errorData.error || `HTTP ${response.status}`,
        response.status,
        errorData
      );
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return {} as T;
    }

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string, options: Omit<FetchOptions, 'method'> = {}) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: any, options: Omit<FetchOptions, 'method' | 'body'> = {}) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: any, options: Omit<FetchOptions, 'method' | 'body'> = {}) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options: Omit<FetchOptions, 'method'> = {}) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};