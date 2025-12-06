import { Injectable } from '@angular/core';
import { Tokens } from '../models/auth-response.model';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly PREFIX = environment.storagePrefix;
  private readonly TOKENS_KEY = `${this.PREFIX}tokens`;
  private readonly USER_KEY = `${this.PREFIX}user`;
  private readonly REMEMBER_KEY = `${this.PREFIX}remember`;
  private readonly REDIRECT_URL_KEY = `${this.PREFIX}redirect_url`;

  constructor() {}

  // Generic storage operations
  setItem<T>(key: string, value: T, useSession = false): void {
    const storage = useSession ? sessionStorage : localStorage;
    const prefixedKey = `${this.PREFIX}${key}`;

    try {
      storage.setItem(prefixedKey, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  }

  getItem<T>(key: string, useSession = false): T | null {
    const storage = useSession ? sessionStorage : localStorage;
    const prefixedKey = `${this.PREFIX}${key}`;

    try {
      const item = storage.getItem(prefixedKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  }

  removeItem(key: string, bothStorages = false): void {
    const prefixedKey = `${this.PREFIX}${key}`;

    localStorage.removeItem(prefixedKey);

    if (bothStorages) {
      sessionStorage.removeItem(prefixedKey);
    }
  }

  clear(): void {
    // Clear only items with our prefix
    this.clearStorage(localStorage);
    this.clearStorage(sessionStorage);
  }

  private clearStorage(storage: Storage): void {
    const keysToRemove: string[] = [];

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && key.startsWith(this.PREFIX)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => storage.removeItem(key));
  }

  // Specific auth storage methods
  saveTokens(tokens: Tokens, rememberMe: boolean): void {
    const storage = rememberMe ? localStorage : sessionStorage;

    try {
      storage.setItem(this.TOKENS_KEY, JSON.stringify(tokens));
      localStorage.setItem(this.REMEMBER_KEY, JSON.stringify(rememberMe));
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  }

  getTokens(): Tokens | null {
    // Check localStorage first
    let tokens = this.getFromStorage<Tokens>(localStorage, this.TOKENS_KEY);

    // If not found, check sessionStorage
    if (!tokens) {
      tokens = this.getFromStorage<Tokens>(sessionStorage, this.TOKENS_KEY);
    }

    return tokens;
  }

  getAccessToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.accessToken || null;
  }

  getRefreshToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.refreshToken || null;
  }

  removeTokens(): void {
    localStorage.removeItem(this.TOKENS_KEY);
    sessionStorage.removeItem(this.TOKENS_KEY);
  }

  saveUser(user: User, rememberMe: boolean): void {
    const storage = rememberMe ? localStorage : sessionStorage;

    try {
      storage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  getUser(): User | null {
    // Check localStorage first
    let user = this.getFromStorage<User>(localStorage, this.USER_KEY);

    // If not found, check sessionStorage
    if (!user) {
      user = this.getFromStorage<User>(sessionStorage, this.USER_KEY);
    }

    return user;
  }

  removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.USER_KEY);
  }

  getRememberMe(): boolean {
    try {
      const remember = localStorage.getItem(this.REMEMBER_KEY);
      return remember ? JSON.parse(remember) : false;
    } catch {
      return false;
    }
  }

  setRedirectUrl(url: string): void {
    localStorage.setItem(this.REDIRECT_URL_KEY, url);
  }

  getRedirectUrl(): string | null {
    return localStorage.getItem(this.REDIRECT_URL_KEY);
  }

  removeRedirectUrl(): void {
    localStorage.removeItem(this.REDIRECT_URL_KEY);
  }

  private getFromStorage<T>(storage: Storage, key: string): T | null {
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage parse error:', error);
      return null;
    }
  }
}
