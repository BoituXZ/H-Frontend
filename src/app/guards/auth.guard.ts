import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Check if user is authenticated
    if (this.authService.isUserAuthenticated()) {
      return true;
    }

    // For demo: Auto-login as Takudzwanashe if not authenticated
    // This ensures all pages are accessible for demo purposes
    const takudzwanashe = {
      id: 'user-takudzwanashe',
      name: 'Takudzwanashe Mahachi',
      phoneNumber: '+263 77 412 3456',
      ecocashNumber: '+263 77 412 3456',
      verified: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    };

    // Generate JWT-like tokens
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const mockTokenPayload = {
      sub: takudzwanashe.id,
      phone: takudzwanashe.phoneNumber,
      name: takudzwanashe.name,
      ecocashNumber: takudzwanashe.ecocashNumber,
      verified: true,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
    };
    const payload = btoa(JSON.stringify(mockTokenPayload));
    const signature = btoa('mock-signature');
    const mockAccessToken = `${header}.${payload}.${signature}`;
    const refreshPayload = btoa(JSON.stringify({ ...mockTokenPayload, type: 'refresh' }));
    const mockRefreshToken = `${header}.${refreshPayload}.${signature}`;

    this.authService.setAuthData(
      {
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken
      },
      takudzwanashe,
      false
    );

    return true;
  }
}
