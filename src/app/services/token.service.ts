import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor() {}

  /**
   * Decode a JWT token and return its payload
   * Also handles simple base64 JSON tokens for demo purposes
   */
  decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      
      // Handle standard JWT format (header.payload.signature)
      if (parts.length === 3) {
        const payload = parts[1];
        const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decodedPayload);
      }
      
      // Handle simple base64 JSON (for demo mock tokens)
      if (parts.length === 1) {
        const decodedPayload = atob(token);
        return JSON.parse(decodedPayload);
      }
      
      throw new Error('Invalid token format');
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Get the expiration date from a JWT token
   */
  getTokenExpirationDate(token: string): Date | null {
    const decoded = this.decodeToken(token);

    if (!decoded || !decoded.exp) {
      return null;
    }

    // JWT exp is in seconds, JavaScript Date uses milliseconds
    return new Date(decoded.exp * 1000);
  }

  /**
   * Check if a token is expired
   */
  isTokenExpired(token: string): boolean {
    if (!token) {
      return true;
    }

    const expirationDate = this.getTokenExpirationDate(token);

    if (!expirationDate) {
      return true;
    }

    // Check if token has expired
    return expirationDate.getTime() <= Date.now();
  }

  /**
   * Check if token is valid (exists, properly formatted, not expired)
   */
  isTokenValid(token: string): boolean {
    if (!token) {
      return false;
    }

    try {
      const decoded = this.decodeToken(token);
      if (!decoded) {
        return false;
      }

      return !this.isTokenExpired(token);
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  /**
   * Get the time remaining until token expiration (in milliseconds)
   */
  getTimeUntilExpiration(token: string): number {
    const expirationDate = this.getTokenExpirationDate(token);

    if (!expirationDate) {
      return 0;
    }

    return Math.max(0, expirationDate.getTime() - Date.now());
  }

  /**
   * Check if token should be refreshed based on buffer time
   */
  shouldRefreshToken(token: string, bufferTime: number): boolean {
    const timeRemaining = this.getTimeUntilExpiration(token);
    return timeRemaining > 0 && timeRemaining < bufferTime;
  }
}
