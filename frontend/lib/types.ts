export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  success: boolean;
  data: {
    ID: number;
    name: string;
    email: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
  message: string;
}

export interface User {
  ID: number;
  name: string;
  email: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ApiError {
  message?: string;
  error?: string;
}