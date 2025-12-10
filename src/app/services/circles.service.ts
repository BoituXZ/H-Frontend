import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, delay } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Circle,
  CircleDetail,
  CircleMember,
  CreateCircleDto,
  JoinCircleDto,
  PayoutEntry,
} from '../models/circle.model';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root',
})
export class CirclesService {
  private http = inject(HttpClient);
  private mockDataService = inject(MockDataService);
  private apiUrl = `${environment.apiUrl}/circles`;

  getCircles(): Observable<Circle[]> {
    // Use mock data directly if configured
    if (environment.useMockData) {
      return this.mockDataService.getCircles().pipe(delay(300));
    }
    
    return this.http.get<Circle[]>(`${this.apiUrl}/my-circles`).pipe(
      catchError((error) => {
        console.warn('API call failed, using mock data:', error);
        return this.mockDataService.getCircles().pipe(delay(300));
      })
    );
  }

  getCircleById(id: string): Observable<CircleDetail> {
    // Use mock data directly if configured
    if (environment.useMockData) {
      const mockDetail = this.mockDataService.getMockCircleDetail(id);
      if (mockDetail) {
        return of(mockDetail).pipe(delay(300));
      }
      throw new Error(`Circle with id ${id} not found in mock data`);
    }
    
    return this.http.get<CircleDetail>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.warn('API call failed, using mock data:', error);
        const mockDetail = this.mockDataService.getMockCircleDetail(id);
        if (mockDetail) {
          return of(mockDetail).pipe(delay(300));
        }
        throw error;
      })
    );
  }

  createCircle(dto: CreateCircleDto): Observable<CircleDetail> {
    // Use mock data directly if configured
    if (environment.useMockData) {
      const mockDetail: CircleDetail = {
        id: Date.now().toString(),
        name: dto.name,
        description: dto.description || '',
        contributionAmount: dto.contributionAmount,
        frequency: dto.frequency,
        maxMembers: dto.maxMembers,
        isPublic: dto.isPublic || false,
        status: 'active',
        inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        creatorId: 'current-user',
        createdAt: new Date().toISOString(),
      };
      return of(mockDetail).pipe(delay(300));
    }
    
    return this.http.post<CircleDetail>(this.apiUrl, dto).pipe(
      catchError((error) => {
        console.warn('API call failed, using mock data:', error);
        const mockDetail: CircleDetail = {
          id: Date.now().toString(),
          name: dto.name,
          description: dto.description || '',
          contributionAmount: dto.contributionAmount,
          frequency: dto.frequency,
          maxMembers: dto.maxMembers,
          isPublic: dto.isPublic || false,
          status: 'active',
          inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          creatorId: 'current-user',
          createdAt: new Date().toISOString(),
        };
        return of(mockDetail).pipe(delay(300));
      })
    );
  }

  joinCircle(dto: JoinCircleDto): Observable<CircleDetail> {
    // Use mock data directly if configured
    if (environment.useMockData) {
      const mockDetail = this.mockDataService.getMockCircleDetail('1');
      if (mockDetail) {
        return of(mockDetail).pipe(delay(300));
      }
      throw new Error('Circle not found in mock data');
    }
    
    return this.http.post<CircleDetail>(`${this.apiUrl}/join`, dto).pipe(
      catchError((error) => {
        console.warn('API call failed, using mock data:', error);
        const mockDetail = this.mockDataService.getMockCircleDetail('1');
        if (mockDetail) {
          return of(mockDetail).pipe(delay(300));
        }
        throw error;
      })
    );
  }

  getCircleMembers(circleId: string): Observable<CircleMember[]> {
    // Use mock data directly if configured
    if (environment.useMockData) {
      return of(this.mockDataService.getMockCircleMembers(circleId)).pipe(delay(300));
    }
    
    return this.http.get<CircleMember[]>(`${this.apiUrl}/${circleId}/members`).pipe(
      catchError((error) => {
        console.warn('API call failed, using mock data:', error);
        return of(this.mockDataService.getMockCircleMembers(circleId)).pipe(delay(300));
      })
    );
  }

  getCircleTimeline(circleId: string): Observable<PayoutEntry[]> {
    // Use mock data directly if configured
    if (environment.useMockData) {
      return of(this.mockDataService.getMockCircleTimeline(circleId)).pipe(delay(300));
    }
    
    return this.http.get<PayoutEntry[]>(`${this.apiUrl}/${circleId}/timeline`).pipe(
      catchError((error) => {
        console.warn('API call failed, using mock data:', error);
        return of(this.mockDataService.getMockCircleTimeline(circleId)).pipe(delay(300));
      })
    );
  }

  startCircle(circleId: string): Observable<CircleDetail> {
    // Use mock data directly if configured
    if (environment.useMockData) {
      const mockDetail = this.mockDataService.getMockCircleDetail(circleId);
      if (mockDetail) {
        const updatedDetail = { ...mockDetail, status: 'active' };
        return of(updatedDetail).pipe(delay(300));
      }
      throw new Error(`Circle with id ${circleId} not found in mock data`);
    }
    
    return this.http.post<CircleDetail>(`${this.apiUrl}/${circleId}/start`, {}).pipe(
      catchError((error) => {
        console.warn('API call failed, using mock data:', error);
        const mockDetail = this.mockDataService.getMockCircleDetail(circleId);
        if (mockDetail) {
          const updatedDetail = { ...mockDetail, status: 'active' };
          return of(updatedDetail).pipe(delay(300));
        }
        throw error;
      })
    );
  }
}
