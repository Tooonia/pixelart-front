import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserGetItem } from 'src/app/pixelart/model/user-get-item';
import { AuthService } from './auth.service';

// TODO: Review all methods and interfaces!!!

const REQUEST_TIMEOUT = 15000; // 15 seconds

// Define response types for better typing
interface PublicContentResponse {
  users: UserGetItem[];
  total?: number;
}

interface UserBoardResponse {
  // Define based on actual API response
  message?: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private basePath = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService) { }

  /**
   * GET all users with public profile
   */
  public getAllUsers(): Observable<UserGetItem[]> {
    return this.http.get<UserGetItem[]>(`${this.basePath}/users`).pipe(
      timeout(REQUEST_TIMEOUT),
      catchError((error) => {
        console.error('Get all users error:', error);
        return throwError(() => new Error('Failed to load users. Please try again.'));
      })
    );
  }

  /**
   * GET public user profile
   */
  public getUserProfile(id: number): Observable<UserGetItem> {
    return this.http.get<UserGetItem>(`${this.basePath}/user/${id}`).pipe(
      timeout(REQUEST_TIMEOUT),
      catchError((error) => {
        console.error('Get user profile error:', error);
        return throwError(() => new Error('Failed to load user profile. Please try again.'));
      })
    );
  }

  /**
   * GET private user profile on /my-profile of the connected user by user id
   */
  public getPrivateUserProfileById(id: number): Observable<UserGetItem> {
    return this.http.get<UserGetItem>(`${this.basePath}/my-profile/${id}`).pipe(
      timeout(REQUEST_TIMEOUT),
      catchError((error) => {
        console.error('Get private user profile error:', error);
        return throwError(() => new Error('Failed to load private profile. Please try again.'));
      })
    );
  }

  /**
   * GET public user profile by email << DOES NOT WORK YET; TODO: vajon kell ide a params: email?
   */
  public getUserProfileByEmail(email: string): Observable<UserGetItem> {
    return this.http.get<UserGetItem>(`${this.basePath}/me`, { params: {email} }).pipe(
      timeout(REQUEST_TIMEOUT),
      catchError((error) => {
        console.error('Get user profile by email error:', error);
        return throwError(() => new Error('Failed to load user profile. Please try again.'));
      })
    );
  }

  /**
   * GET private profile of connected user
   */
  public getPrivateUserProfile(): Observable<UserGetItem> {
    return this.http.get<UserGetItem>(`${this.basePath}/user/me`).pipe(
      timeout(REQUEST_TIMEOUT),
      catchError((error) => {
        console.error('Get private user profile error:', error);
        return throwError(() => new Error('Failed to load your profile. Please try again.'));
      })
    );
  }

  /**
   * GET public content, list of Users
   */
  public getPublicContent(): Observable<PublicContentResponse> {
    return this.http.get<PublicContentResponse>(`${this.basePath}/users`).pipe(
      timeout(REQUEST_TIMEOUT),
      catchError((error) => {
        console.error('Get public content error:', error);
        return throwError(() => new Error('Failed to load public content. Please try again.'));
      })
    );
  }

  /**
   * POST a pixelart
   */
  // public createPixelart()

  public getUserBoard(): Observable<UserBoardResponse> {
    return this.http.get<UserBoardResponse>(`${this.basePath}/pixelart-create`).pipe(
      timeout(REQUEST_TIMEOUT),
      catchError((error) => {
        console.error('Get user board error:', error);
        return throwError(() => new Error('Failed to load user board. Please try again.'));
      })
    );
  }

  /**
   * DELETE user account
   */
  public deleteAccount(id: number): Observable<UserGetItem> {
    return this.http.delete<UserGetItem>(`${this.basePath}/my-profile/${id}`).pipe(
      timeout(REQUEST_TIMEOUT),
      catchError((error) => {
        console.error('Delete account error:', error);
        return throwError(() => new Error('Failed to delete account. Please try again.'));
      })
    );
  }
}
