import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject, of } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment';
import {
  RegisterRequest,
  RegisterResponse,
  AuthResponse,
  Tokens,
  VerifyOtpRequest,
  ResendOtpRequest,
  ResendOtpResponse
} from '../models/auth-response.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  // Signals for auth state
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);

  // Public readonly versions
  public currentUser = this.currentUserSignal.asReadonly();
  public isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  // Subject for token refresh
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  public refreshToken$ = this.refreshTokenSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.initializeAuthState();
  }

  /**
   * Initialize auth state from storage on app bootstrap
   */
  initializeAuthState(): void {
    const user = this.storageService.getUser();
    const accessToken = this.storageService.getAccessToken();

    if (user && accessToken && this.tokenService.isTokenValid(accessToken)) {
      this.currentUserSignal.set(user);
      this.isAuthenticatedSignal.set(true);
    } else {
      // Clear invalid data
      this.clearAuthData();
    }
  }

  /**
   * Register a new user
   */
  register(data: RegisterRequest): Observable<RegisterResponse> {
    if (environment.useMockData) {
      return of({
        success: true,
        message: 'Registration successful. Please verify your phone number.',
        userId: 'mock-user-' + Date.now()
      }).pipe(tap(() => console.log('Mock register:', data)));
    }

    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, data);
  }

  /**
   * Extract user information from JWT token
   */
  private extractUserFromToken(token: string): User {
    const decoded = this.tokenService.decodeToken(token);

    // Handle mock tokens that can't be decoded
    if (!decoded) {
      return {
        id: 'mock-user-id',
        phoneNumber: '0712345678',
        name: 'Mock User',
        ecocashNumber: '0712345678',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    return {
      id: decoded.sub || '',
      phoneNumber: decoded.phone || '',
      name: decoded.name || '',
      ecocashNumber: decoded.ecocashNumber || '',
      verified: decoded.verified || true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Verify OTP after registration
   */
  verifyOtp(userId: string, code: string): Observable<AuthResponse> {
    const payload: VerifyOtpRequest = { userId, code };

    if (environment.useMockData) {
      const mockResponse: AuthResponse = {
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now()
      };

      return of(mockResponse).pipe(
        tap(response => {
          const rememberMe = this.storageService.getRememberMe();
          const user = this.extractUserFromToken(response.accessToken);

          this.setAuthData(
            {
              accessToken: response.accessToken,
              refreshToken: response.refreshToken
            },
            user,
            rememberMe
          );
          console.log('Mock OTP verification for user:', userId);
        })
      );
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/verify-otp`, payload).pipe(
      tap(response => {
        const rememberMe = this.storageService.getRememberMe();
        const user = this.extractUserFromToken(response.accessToken);

        this.setAuthData(
          {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken
          },
          user,
          rememberMe
        );
      })
    );
  }

  /**
   * Resend OTP code
   */
  resendOtp(userId: string): Observable<ResendOtpResponse> {
    const payload: ResendOtpRequest = { userId };

    if (environment.useMockData) {
      return of({
        success: true,
        message: 'OTP sent successfully'
      }).pipe(tap(() => console.log('Mock resend OTP for user:', userId)));
    }

    return this.http.post<ResendOtpResponse>(`${this.apiUrl}/auth/resend-otp`, payload);
  }

  /**
   * Login user
   */
  login(phoneNumber: string, password: string, rememberMe: boolean): Observable<AuthResponse> {
    if (environment.useMockData) {
      const mockResponse: AuthResponse = {
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now()
      };

      return of(mockResponse).pipe(
        tap(response => {
          const user = this.extractUserFromToken(response.accessToken);

          this.setAuthData(
            {
              accessToken: response.accessToken,
              refreshToken: response.refreshToken
            },
            user,
            rememberMe
          );
          console.log('Mock login for user:', phoneNumber);
        })
      );
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, {
      phoneNumber,
      password
    }).pipe(
      tap(response => {
        const user = this.extractUserFromToken(response.accessToken);

        this.setAuthData(
          {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken
          },
          user,
          rememberMe
        );
      })
    );
  }

  /**
   * Refresh access token using refresh token
   */
  refreshAccessToken(): Observable<{ accessToken: string }> {
    const refreshToken = this.storageService.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    if (environment.useMockData) {
      const mockResponse = { accessToken: 'mock-refreshed-token-' + Date.now() };

      return of(mockResponse).pipe(
        tap(response => {
          // Update tokens in storage
          const tokens = this.storageService.getTokens();
          if (tokens) {
            const updatedTokens: Tokens = {
              ...tokens,
              accessToken: response.accessToken
            };
            const rememberMe = this.storageService.getRememberMe();
            this.storageService.saveTokens(updatedTokens, rememberMe);
          }
          this.refreshTokenSubject.next(response.accessToken);
          console.log('Mock token refresh');
        })
      );
    }

    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/auth/refresh-token`, {
      refreshToken
    }).pipe(
      tap(response => {
        // Update tokens in storage
        const tokens = this.storageService.getTokens();
        if (tokens) {
          const updatedTokens: Tokens = {
            ...tokens,
            accessToken: response.accessToken
          };
          const rememberMe = this.storageService.getRememberMe();
          this.storageService.saveTokens(updatedTokens, rememberMe);
        }
        this.refreshTokenSubject.next(response.accessToken);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    const accessToken = this.storageService.getAccessToken();

    // Call logout endpoint if token exists and not using mock data
    if (accessToken && !environment.useMockData) {
      this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe({
        error: (error) => console.error('Logout API error:', error)
      });
    }

    // Clear local data
    this.clearAuthData();

    // Navigate to login
    this.router.navigate(['/login']);
  }

  /**
   * Set authentication data
   */
  setAuthData(tokens: Tokens, user: User, rememberMe = false): void {
    this.storageService.saveTokens(tokens, rememberMe);
    this.storageService.saveUser(user, rememberMe);

    this.currentUserSignal.set(user);
    this.isAuthenticatedSignal.set(true);
  }

  /**
   * Clear authentication data
   */
  clearAuthData(): void {
    this.storageService.removeTokens();
    this.storageService.removeUser();
    this.storageService.removeRedirectUrl();

    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
  }

  /**
   * Check if user is authenticated (helper method)
   */
  isUserAuthenticated(): boolean {
    return this.isAuthenticatedSignal();
  }

  /**
   * Get current user (helper method)
   */
  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }

  /**
   * Update user data
   */
  updateUserData(user: User): void {
    const rememberMe = this.storageService.getRememberMe();
    this.storageService.saveUser(user, rememberMe);
    this.currentUserSignal.set(user);
  }
}
