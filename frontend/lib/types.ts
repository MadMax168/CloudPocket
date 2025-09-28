export interface User {
  ID: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  success: boolean;
  data: User;
  message: string;
}