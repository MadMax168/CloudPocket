// User Types
export interface User {
  ID: number;
  name: string;
  email: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// Wallet Types
export interface Wallet {
  index: number;
  name: string;
  target: string;
  goal: number;
  code: string;
}

export interface WalletInput {
  name: string;
  code: string;
  target: string;
  goal: number;
}

export interface WalletResponse {
  success: boolean;
  data: Wallet[];
}

// Transaction Types
export interface Transaction {
  ID: number;
  title: string;
  type: string;
  amount: number;
  date: string;
  category: string;
  desc: string;
  status: boolean;
  WalletID: number;
  UserID: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface TransactionInput {
  title: string;
  type: string;
  amount: number;
  date: string;
  category: string;
  desc: string;
}

// Share Types
export interface WalletShare {
  ID: number;
  wallet_id: number;
  owner_id: number;
  shared_with_id: number;
  permission: string;
  status: string;
  Wallet: {
    ID: number;
    name: string;
    code: string;
    target: string;
    goal: number;
  };
  Owner: {
    ID: number;
    name: string;
    email: string;
  };
  SharedWith: {
    ID: number;
    name: string;
    email: string;
  };
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ShareWalletInput {
  email: string;
  permission: string;
}

// Auth Types
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
  data: User;
  message: string;
}