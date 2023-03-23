import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PixelartSimpleItem } from 'src/app/pixelart/model/pixelart-simple-item';
import { UserGetItem } from 'src/app/pixelart/model/user-get-item';
import { AuthService } from './auth.service';

// A class member can not have a "const" keyword, that is why this declaration is here.
// const API_URL = 'http://localhost:8085/api';
// Other way to do: with private variable, inside the class, like basePath.

// const signedinUser: UserGetItem = {
//   id: ,
//   alias: '',
//   user_email: '',
//   pixelArtList: PixelartItem[] =

// };

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private basePath = 'http://localhost:8085/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService) { }

  // Those are, again, URLs from Back-end code:
  /**
   * GET public user profile
   * @returns
   */
  public getUserProfile(id: number): Observable<any> {
    // return this.http.get(API_URL + '/my-profile', { responseType: 'text' });
    return this.http.get<any>((`${this.basePath}/user/${id}`), { responseType: 'json'});
  }

  /**
   * GET private user profile on /my-profile of the connected user by user id
   * @param id
   * @returns
   */
  // TODO: connected user check to do here, in Front from session storage, or on the Back-end side, as in code now:
  public getPrivateUserProfileById(id: number): Observable<UserGetItem> {
    return this.http.get<UserGetItem>((`${this.basePath}/my-profile/${id}`), { responseType: 'json'});
  }

  // /**
  //  * GET public user profile by email
  //  */
  // public getUserProfileByEmail(email: string): Observable<UserGetItem> {
  //   return this.http.get<UserGetItem>((`${this.basePath}/me`), { responseType: 'json'});
  // }

  // /**
  //  * GET private profile of connected user
  //  * 2nd option : This works together with 2nd solution in my-profile.component:
  //  */
  // public getPrivateUserProfile(): Observable<UserGetItem> {
  //   return this.http.get<UserGetItem>((`${this.basePath}/user/me`), { responseType: 'json'});
  // }

  /**
   * GET private profile of connected user
   * 3rd option, works!!! TODO: finish it!
   */
  public getPrivateUserProfile(): Observable<UserGetItem> {
    return this.http.get<UserGetItem>((`${this.basePath}/user/me`), { responseType: 'json'})
  // public getPrivateUserProfile(): Observable<UserPrivateItemModel> {
  //   return this.http.get<UserPrivateItemModel>((`${this.basePath}/user/me`), { responseType: 'json'})
    // .pipe(
    //   map((data:any) => new UserPrivateItemModel(
    //     data.id,
    //     data.alias,
    //     data.user_email,
    //     data.pixelarts ? data.pixelarts.map((pixelart:any) => (
    //       pixelart.id,
    //       pixelart.name
    //       // pixelart.user //TODO: lehet, h ez nem is fontos ide, vagyis PixelartItemModel lehet, h eleg csak ehhez az esethez id/name-mel.
    //       // Mert itt a user a console-ban undefined!!!
    //     )) : [] //Megerteni ezt a reszt!
    //     )));
  }

  /**
   * //TODO: GET public content, list of Users for give it a try << works! But not logical to have it on 'home' page!
   */
   public getPublicContent(): Observable<any> {
    return this.http.get((`${this.basePath}/users`), { responseType: 'json'});
  }

  /**
   * POST a pixelart
   */
  // public createPixelart()

  public getUserBoard(): Observable<any> {
    return this.http.get((`${this.basePath}/pixelart-create`), { responseType: 'json'}); //TODO: what a method name?
  }

  public deleteAccount(id: number): Observable<UserGetItem> {
    return this.http.delete<UserGetItem>(`${this.basePath}/my-profile/${id}`, {
      responseType: 'json',
    });
    // this.http.delete<any>(`${this.basePath}/my-profile/${id}`);
  }
}
