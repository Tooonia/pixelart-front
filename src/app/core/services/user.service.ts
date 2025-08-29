import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserGetItem } from 'src/app/pixelart/model/user-get-item';
import { AuthService } from './auth.service';

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
    return this.http.get<UserGetItem[]>(`${this.basePath}/users`);
  }

  /**
   * GET public user profile
   * @returns
   */
  public getUserProfile(id: number): Observable<UserGetItem> {
    return this.http.get<UserGetItem>(`${this.basePath}/user/${id}`);
  }

  /**
   * GET private user profile on /my-profile of the connected user by user id
   * @param id
   * @returns
   */
  // TODO: connected user check to do here, in Front from session storage, or on the Back-end side, as in code now:
  public getPrivateUserProfileById(id: number): Observable<UserGetItem> {
    return this.http.get<UserGetItem>(`${this.basePath}/my-profile/${id}`);
  }

  /**
   * GET public user profile by email << DOES NOT WORK YET; TODO: vajon kell ide a params: email?
   */
  public getUserProfileByEmail(email: string): Observable<UserGetItem> {
    return this.http.get<UserGetItem>(`${this.basePath}/me`, { params: {email} });
  }

  /**
   * GET private profile of connected user
   * 3rd option, works!!! TODO: finish it!
   */
  public getPrivateUserProfile(): Observable<UserGetItem> {
    return this.http.get<UserGetItem>(`${this.basePath}/user/me`);
  }

  /**
   * //TODO: GET public content, list of Users for give it a try << works!
   */
   public getPublicContent(): Observable<any> {
    return this.http.get<any>(`${this.basePath}/users`);
  }

  /**
   * POST a pixelart
   */
  // public createPixelart()

  public getUserBoard(): Observable<any> {
    return this.http.get(`${this.basePath}/pixelart-create`);
  }

  public deleteAccount(id: number): Observable<UserGetItem> {
    return this.http.delete<UserGetItem>(`${this.basePath}/my-profile/${id}`);
  }
}
