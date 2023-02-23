import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PixelartItem } from 'src/app/pixelart/model/pixelart-item';
import { PixelartItemModel } from 'src/app/pixelart/model/pixelart-item-model';
import { UserItem } from 'src/app/pixelart/model/user-item';
import { UserPrivateItem } from 'src/app/pixelart/model/user-private-item';
import { UserPrivateModel } from 'src/app/pixelart/model/user-private-model';
import { AuthService } from './auth.service';

// A class member can not a "const" keyword, that is why this declaration is here.
// const API_URL = 'http://localhost:8085/api';

// const signedinUser: UserPrivateItem = {
//   id: ,
//   alias: '',
//   email: '',
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

  // Those are, again, URLs in Back-end code:
  /**
   * GET public user profile
   * @returns
   */
  public getUserProfile(id: number): Observable<any> {
    // return this.http.get(API_URL + '/my-profile', { responseType: 'text' });
    return this.http.get<any>((`${this.basePath}/user/${id}`), { responseType: 'json'});
  }
  // /**
  //  * GET private user profile on my-profile of the connected user
  //  * @returns
  //  */
  // public getConnectedUserPrivateProfileByEmail(email: string): Observable<UserPrivateItem> {
  //   // this.authService.getSignedinUser;
  //   return this.http.get<UserPrivateItem>((`${this.basePath}/my-profile`), { responseType: 'json'});
  // }
  /**
   * GET private user profile on my-profile of the connected user
   * @returns
   */
  public getPrivateUserProfileById(id: number): Observable<UserPrivateItem> {
    // this.authService.getSignedinUser;
    return this.http.get<UserPrivateItem>((`${this.basePath}/my-profile/${id}`), { responseType: 'json'});
  }

  // /**
  //  * GET private profile of connected user
  //  * This work together with 2nd solution in my-profile.component:
  //  */
  // public getPrivateUserProfile(): Observable<UserPrivateItem> {
  //   return this.http.get<UserPrivateItem>((`${this.basePath}/user/me`), { responseType: 'json'});
  // }

  /**
   * GET private profile of connected user
   * 3rd option, works!!! TODO: finish it!
   */
  public getPrivateUserProfile(): Observable<UserPrivateModel> {
    return this.http.get<UserPrivateModel>((`${this.basePath}/user/me`), { responseType: 'json'})
    .pipe(
      map((data:any) => new UserPrivateModel(
        data.id,
        data.alias,
        data.user_email,
        data.pixelarts ? data.pixelarts.map((pixelart:any) => new PixelartItemModel(
          pixelart.id,
          pixelart.name,
          pixelart.user //TODO: lehet, h ez nem is fontos ide, vagyis PixelartItemModel lehet, h eleg csak ehhez az esethez id/name-mel.
          // Mert itt a user a console-ban undefined!!!
        )) : []
        )));
  }

  /**
   * //TODO: GET public content, list of Users for give it a try << works! But not logical to have it on 'home' page!
   */
   public getPublicContent(): Observable<any> {
    return this.http.get((`${this.basePath}/users`), { responseType: 'json'});
  }

  /**
 * GET all pixelart from one User
 * @param pixelartModel
 * @returns
 */
public getAllPixelArtByUser(id: number): Observable<PixelartItem[]> {
  return this.http.get<PixelartItem[]>(`${this.basePath}/pixelart-by-user/${id}`)
}

  /**
   * POST a pixelart
   */
  // public createPixelart()

  public getUserBoard(): Observable<any> {
    return this.http.get((`${this.basePath}/pixelart-create`), { responseType: 'json'}); //TODO: what a method name?
  }

  public deleteAccount(id: number): Observable<UserItem> {
    return this.http.delete<UserItem>(`${this.basePath}/my-profile/${id}`, {
      responseType: 'json',
    });
    // this.http.delete<any>(`${this.basePath}/my-profile/${id}`);
  }
}
