import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiError } from '../models/api-error.model';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let apiError: ApiError;

        // Network error (client-side or network issue)
        if (error.error instanceof ErrorEvent) {
          apiError = {
            message: 'Network error. Please check your connection and try again.',
            type: 'network',
            statusCode: 0
          };
        }
        // HTTP error (server-side)
        else {
          apiError = this.handleHttpError(error, req.url);
        }

        // Log error in development
        if (!req.url?.includes('/auth/refresh-token')) {
          console.error('HTTP Error:', {
            url: error.url,
            status: error.status,
            message: apiError.message,
            error: error.error
          });
        }

        return throwError(() => apiError);
      })
    );
  }

  private handleHttpError(error: HttpErrorResponse, url: string): ApiError {
    switch (error.status) {
      case 400:
        return {
          message: error.error?.message || 'Invalid request. Please check your input.',
          type: 'validation',
          errors: error.error?.errors || {},
          statusCode: 400
        };

      case 401:
        if (!url.includes('/auth/refresh-token')) {
          return {
            message: error.error?.message || 'Session expired. Please login again.',
            type: 'auth',
            statusCode: 401
          };
        } else {
          return {
            message: 'Authentication failed.',
            type: 'auth',
            statusCode: 401
          };
        }

      case 403:
        return {
          message: error.error?.message || 'Access denied. You don\'t have permission to perform this action.',
          type: 'forbidden',
          statusCode: 403
        };

      case 404:
        return {
          message: error.error?.message || 'Resource not found.',
          type: 'not-found',
          statusCode: 404
        };

      case 409:
        return {
          message: error.error?.message || 'This resource already exists.',
          type: 'validation',
          statusCode: 409
        };

      case 422:
        return {
          message: error.error?.message || 'Validation failed.',
          type: 'validation',
          errors: error.error?.errors || {},
          statusCode: 422
        };

      case 429:
        return {
          message: error.error?.message || 'Too many requests. Please try again later.',
          type: 'server',
          statusCode: 429
        };

      case 500:
        return {
          message: error.error?.message || 'Server error. Please try again later.',
          type: 'server',
          statusCode: 500
        };

      case 502:
      case 503:
      case 504:
        return {
          message: 'Service temporarily unavailable. Please try again later.',
          type: 'server',
          statusCode: error.status
        };

      default:
        return {
          message: error.error?.message || 'An unexpected error occurred. Please try again.',
          type: 'unknown',
          statusCode: error.status
        };
    }
  }
}
