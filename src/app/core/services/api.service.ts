import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const REQUEST_TIMEOUT = 15000; // 15 seconds

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Centralized error handling for all API calls
   */
  private handleError(operation: string, error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      // Client-side error (network, browser issues)
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // Server-side error - prioritize backend messages
      if (error.error && error.error.message) {
        // Use backend-provided message (preferred)
        errorMessage = error.error.message;
      } else {
        // Fallback to status-based messages
        switch (error.status) {
          case 400:
            errorMessage = 'Invalid request. Please check your input.';
            break;
          case 401:
            errorMessage = 'Authentication failed. Please check your credentials.';
            break;
          case 403:
            errorMessage = 'Access denied. You do not have permission for this action.';
            break;
          case 404:
            errorMessage = 'Resource not found.';
            break;
          case 409:
            errorMessage = 'Conflict. The resource already exists.';
            break;
          case 422:
            errorMessage = 'Validation failed. Please check your input.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          case 0:
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          default:
            errorMessage = `Request failed with status ${error.status}.`;
        }
      }
    }

    console.error(`${operation} failed:`, error);

    // Create a more robust error object that preserves the original error
    const customError = new Error(errorMessage);
    (customError as any).originalError = error;
    (customError as any).status = error.status;
    (customError as any).errorCode = error.error?.error || null;
    (customError as any).field = error.error?.field || null;

    return throwError(() => customError);
  }

  /**
   * GET request with centralized error handling and timeout
   */
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const options = params ? { params } : {};

    return this.http.get<T>(url, options).pipe(
      timeout(REQUEST_TIMEOUT),
      catchError(error => this.handleError(`GET ${endpoint}`, error))
    );
  }

  /**
   * POST request with centralized error handling and timeout
   */
  post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const options = headers ? { headers } : {};

    console.log(`ApiService: Making POST request to ${url}`, { body, options });

    return this.http.post<T>(url, body, options).pipe(
      timeout(REQUEST_TIMEOUT),
      catchError(error => {
        console.error(`ApiService: Error in POST ${endpoint}:`, error);
        return this.handleError(`POST ${endpoint}`, error);
      })
    );
  }

  /**
   * PUT request with centralized error handling and timeout
   */
  put<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const options = headers ? { headers } : {};

    return this.http.put<T>(url, body, options).pipe(
      timeout(REQUEST_TIMEOUT),
      catchError(error => this.handleError(`PUT ${endpoint}`, error))
    );
  }

  /**
   * DELETE request with centralized error handling and timeout
   */
  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;

    return this.http.delete<T>(url).pipe(
      timeout(REQUEST_TIMEOUT),
      catchError(error => this.handleError(`DELETE ${endpoint}`, error))
    );
  }

  /**
   * PATCH request with centralized error handling and timeout
   */
  patch<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const options = headers ? { headers } : {};

    return this.http.patch<T>(url, body, options).pipe(
      timeout(REQUEST_TIMEOUT),
      catchError(error => this.handleError(`PATCH ${endpoint}`, error))
    );
  }
}
