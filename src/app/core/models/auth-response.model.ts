import { User } from './user.model';

export interface RegisterRequest {
  name: string;
  phoneNumber: string;
  ecocashNumber: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId: string;
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresAt?: number;
}

export interface VerifyOtpRequest {
  userId: string;
  code: string;
}

export interface ResendOtpRequest {
  userId: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message?: string;
}
