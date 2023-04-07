import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PixelartItem } from 'src/app/pixelart/model/pixelart-item';
import { catchError, map } from 'rxjs/operators';

/**
 * Class responsible to call the server side REST API
 * We put all pixelart related services here.
 */
@Injectable({
  providedIn: 'root'
})
export class PixelartService {
  pixelartSelected = new EventEmitter<PixelartItem>();
  private basePath = 'http://localhost:8085/api';

  constructor(private http: HttpClient) { }

/**
 * GET all pixelart (catalog)
 * @returns
 */
  public findAll(): Observable<PixelartItem[]> {
    // Url from the Back
    return this.http.get<PixelartItem[]>(`${this.basePath}/pixelart-catalog`);
  }

/**
 * GET one pixelart by id
 * @param id
 * @returns
 */
  public getById(id: number): Observable<PixelartItem> {
    return this.http.get<PixelartItem>(`${this.basePath}/pixelart/${id}`);
  }

/**
 * GET all pixelart from one User by user id
 * @param id
 * @returns
 */
  public getAllPixelArtByUser(id: number): Observable<PixelartItem[]> {
    return this.http.get<PixelartItem[]>(`${this.basePath}/pixelart-by-user/${id}`)
    // .pipe(
    //   map((data:any) => new PixelartItemModel[] (
    //     data.id,
    //     data.name,
    //     data.user ? data.user.map((user: any) => new UserPrivateItemModel(
    //       user.id,
    //       user.alias,
    //       user.user_email,
    //       user.pixelarts
    //     )) : [] //Megerteni ezt a reszt!
    //   )));
  }

/**
 * CREATE pixelart
 * @param pixelartItem //works with pixelartModel as well
 * @returns
 */
  // TODO: Defining handleError() in a separate config.service.ts/http-error-handler.service.ts
  // as recommended in https://angular.io/guide/http#handling-request-errors ??? But then
  // }).pipe(
  //   catchError(this.handleError('add', pixelartModel))
  // );
  // }
  public add(pixelartItem: PixelartItem): Observable<PixelartItem> {
    return this.http.post<PixelartItem>(`${this.basePath}/pixelart-create`, pixelartItem, {
      responseType: 'json',
      // When we had the Bearer token problem previously, we managed to test methods by typing token value here:
      // headers: {
      //   'Authorization': '***REMOVED***',
      // }
    });
  }

/**
 * UPDATE pixelart by id
 * @param pixelartItem
 * @returns
 */
  public update(pixelartToUpdate: PixelartItem): Observable<PixelartItem> {
    return this.http.put<PixelartItem>(`${this.basePath}/pixelart-edit/${pixelartToUpdate.id}`, pixelartToUpdate, {
      responseType: 'json',
    });
  }

  /**
   * DELETE pixelart by id
   * @param id
   * @returns
   */
  public deleteById(id: number): Observable<any> {
    return this.http.delete<any>(`${this.basePath}/pixelart-edit/${id}`, {
      responseType: 'json',
    });
  }
}

