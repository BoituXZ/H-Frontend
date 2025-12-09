import { User } from './user.model';

export interface RegisterRequest {
  name: string;
  phoneNumber: string;
  ecocashNumber: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
  // success field is not returned by backend, but we can derive it from userId presence
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken?: string;
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
