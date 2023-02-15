import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PixelartItem } from 'src/app/pixelart/model/pixelart-item';

// A class member can not a "const" keyword, that is why this declaration is here.
// const API_URL = 'http://localhost:8085/api';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private basePath = 'http://localhost:8085/api';

  constructor(private http: HttpClient) { }

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
  //  * GET public user profile
  //  * @returns
  //  */
  // public getUserProfile(id: number): Observable<any> {
  //   // return this.http.get(API_URL + '/my-profile', { responseType: 'text' });
  //   return this.http.get<any>(API_URL + '/my-profile/', {responseType: 'text' as 'json'}).pipe(new Map((resp: any) => {
  //       return resp;
  //     }));
  // }

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
    return this.http.get((`${this.basePath}/pixelart-create`), { responseType: 'json'});
  }

  public deleteAccount(id: number): Observable<any> {
    return this.http.delete<any>(`${this.basePath}/my-profile/${id}`, {
      responseType: 'json',
    });
    // this.http.delete<any>(`${this.basePath}/my-profile/${id}`);
  }
}
