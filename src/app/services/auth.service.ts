import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject, of, catchError } from 'rxjs';
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
   * For demo: Auto-login as Takudzwanashe if no valid session
   */
  initializeAuthState(): void {
    const user = this.storageService.getUser();
    const accessToken = this.storageService.getAccessToken();

    if (user && accessToken && this.tokenService.isTokenValid(accessToken)) {
      this.currentUserSignal.set(user);
      this.isAuthenticatedSignal.set(true);
    } else {
      // For demo: Auto-login as Takudzwanashe
      this.autoLoginDemo();
    }
  }

  /**
   * Generate a mock JWT-like token for demo purposes
   */
  private generateMockToken(payload: any): string {
    // Create a JWT-like token: header.payload.signature
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadBase64 = btoa(JSON.stringify(payload));
    const signature = btoa('mock-signature');
    return `${header}.${payloadBase64}.${signature}`;
  }

  /**
   * Auto-login as Takudzwanashe for demo purposes
   */
  private autoLoginDemo(): void {
    const takudzwanashe: User = {
      id: 'user-takudzwanashe',
      name: 'Takudzwanashe Mahachi',
      phoneNumber: '+263 77 412 3456',
      ecocashNumber: '+263 77 412 3456',
      verified: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    };

    // Generate mock tokens with proper expiration
    const mockTokenPayload = {
      sub: takudzwanashe.id,
      phone: takudzwanashe.phoneNumber,
      name: takudzwanashe.name,
      ecocashNumber: takudzwanashe.ecocashNumber,
      verified: true,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
    };
    const mockAccessToken = this.generateMockToken(mockTokenPayload);
    const mockRefreshToken = this.generateMockToken({ ...mockTokenPayload, type: 'refresh' });

    const tokens: Tokens = {
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken
    };

    this.setAuthData(tokens, takudzwanashe, false);
  }

  /**
   * Register a new user
   */
  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, data);
  }

  /**
   * Extract user information from JWT token
   */
  private extractUserFromToken(token: string): User {
    const decoded = this.tokenService.decodeToken(token);

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
    return this.http.post<ResendOtpResponse>(`${this.apiUrl}/auth/resend-otp`, payload);
  }

  /**
   * Login user
   * For demo: Accept any credentials and return Takudzwanashe's data
   */
  login(phoneNumber: string, password: string, rememberMe: boolean): Observable<AuthResponse> {
    // For demo: Always return success with Takudzwanashe's data
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
      }),
      catchError(() => {
        // On error, return mock response for demo
        const takudzwanashe: User = {
          id: 'user-takudzwanashe',
          name: 'Takudzwanashe Mahachi',
          phoneNumber: '+263 77 412 3456',
          ecocashNumber: '+263 77 412 3456',
          verified: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date()
        };

        const mockTokenPayload = {
          sub: takudzwanashe.id,
          phone: takudzwanashe.phoneNumber,
          name: takudzwanashe.name,
          ecocashNumber: takudzwanashe.ecocashNumber,
          verified: true,
          exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
        };
        const mockAccessToken = this.generateMockToken(mockTokenPayload);
        const mockRefreshToken = this.generateMockToken({ ...mockTokenPayload, type: 'refresh' });

        const mockResponse: AuthResponse = {
          accessToken: mockAccessToken,
          refreshToken: mockRefreshToken
        };

        this.setAuthData(
          {
            accessToken: mockResponse.accessToken,
            refreshToken: mockResponse.refreshToken
          },
          takudzwanashe,
          rememberMe
        );

        return of(mockResponse);
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

    // Call logout endpoint if token exists
    if (accessToken) {
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
