import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Circle,
  CircleDetail,
  CircleMember,
  CreateCircleDto,
  JoinCircleDto,
  PayoutEntry,
} from '../models/circle.model';

@Injectable({
  providedIn: 'root',
})
export class CirclesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/circles`;

  getCircles(): Observable<Circle[]> {
    return this.http.get<Circle[]>(`${this.apiUrl}/my-circles`);
  }

  getCircleById(id: string): Observable<CircleDetail> {
    return this.http.get<CircleDetail>(`${this.apiUrl}/${id}`);
  }

  createCircle(dto: CreateCircleDto): Observable<CircleDetail> {
    return this.http.post<CircleDetail>(this.apiUrl, dto);
  }

  joinCircle(dto: JoinCircleDto): Observable<CircleDetail> {
    return this.http.post<CircleDetail>(`${this.apiUrl}/join`, dto);
  }

  getCircleMembers(circleId: string): Observable<CircleMember[]> {
    return this.http.get<CircleMember[]>(`${this.apiUrl}/${circleId}/members`);
  }

  getCircleTimeline(circleId: string): Observable<PayoutEntry[]> {
    return this.http.get<PayoutEntry[]>(`${this.apiUrl}/${circleId}/timeline`);
  }

  startCircle(circleId: string): Observable<CircleDetail> {
    return this.http.post<CircleDetail>(`${this.apiUrl}/${circleId}/start`, {});
  }
}
