import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { UserGetItem } from 'src/app/pixelart/model/user-get-item';
import { AuthService } from './auth.service';
// TODO: Review all methods and interfaces!!!
import { ApiService } from './api.service';

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

  constructor(
    private apiService: ApiService,
    private authService: AuthService) { }

  /**
   * GET all users with public profile
   */
  public getAllUsers(): Observable<UserGetItem[]> {
    console.log('UserService: Fetching all users');
    return this.apiService.get<UserGetItem[]>('/users');
  }

  /**
   * GET public user profile
   */
  public getUserProfile(id: number): Observable<UserGetItem> {
    console.log('UserService: Fetching user profile for ID:', id);
    return this.apiService.get<UserGetItem>(`/user/${id}`);
  }

  /**
   * GET private user profile on /my-profile of the connected user by user id
   */
  public getPrivateUserProfileById(id: number): Observable<UserGetItem> {
    console.log('UserService: Fetching private user profile for ID:', id);
    return this.apiService.get<UserGetItem>(`/my-profile/${id}`);
  }

  /**
   * GET public user profile by email
   */
  public getUserProfileByEmail(email: string): Observable<UserGetItem> {
    console.log('UserService: Fetching user profile by email:', email);
    const params = new HttpParams().set('email', email);
    return this.apiService.get<UserGetItem>('/me', params);
  }

  /**
   * GET private profile of connected user
   */
  public getPrivateUserProfile(): Observable<UserGetItem> {
    console.log('UserService: Fetching current user private profile');
    return this.apiService.get<UserGetItem>('/user/me');
  }

  /**
   * GET public content, list of Users
   */
  public getPublicContent(): Observable<PublicContentResponse> {
    console.log('UserService: Fetching public content');
    return this.apiService.get<PublicContentResponse>('/users');
  }

  /**
   * GET user board
   */
  public getUserBoard(): Observable<UserBoardResponse> {
    console.log('UserService: Fetching user board');
    return this.apiService.get<UserBoardResponse>('/pixelart-create');
  }

  /**
   * DELETE user account
   */
  public deleteAccount(id: number): Observable<UserGetItem> {
    console.log('UserService: Deleting user account for ID:', id);
    return this.apiService.delete<UserGetItem>(`/my-profile/${id}`);
  }
}
