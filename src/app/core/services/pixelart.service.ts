import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PixelartItem } from 'src/app/pixelart/model/pixelart-item';
import { PixelartModel } from 'src/app/pixelart/model/pixelart-model';

/**
 * Class responsible to call the server side REST API
 * We put all pixelart related services here.
 */
@Injectable({
  providedIn: 'root'
})
export class PixelartService {

  private basePath = 'http://localhost:8085/api';

  constructor(private http: HttpClient) { }

public refreshCollection(): void {

}

/**
 * GET all pixelart (catalog)
 * @returns
 */
  public findAll(): Observable<PixelartItem[]> {
    // Url from the Back
    return this.http.get<PixelartItem[]>(`${this.basePath}/pixelart-catalog`)
  }

/**
 * GET one pixelart by id
 * @param id
 * @returns
 */
  public getById(id: number): Observable<PixelartItem> {
    return this.http.get<PixelartItem>(`${this.basePath}/pixelart/${id}`)
  }

// /**
//  * GET all pixelart from one User
//  * @param pixelartModel
//  * @returns
//  */
// public getAllPixelArtByUser(id: number): Observable<PixelartItem[]> {
//   return this.http.get<PixelartItem[]>(`${this.basePath}/pixelart-by-user/${id}`)
// }


/**
 * CREATE pixelart
 * @param pixelartModel
 * @returns
 */
  public add(pixelartModel: PixelartModel): Observable<PixelartModel> {
    return this.http.post<PixelartModel>(`${this.basePath}/pixelart-create`, pixelartModel, {
      responseType: 'json',
    });
  }

/**
 * UPDATE pixelart by id
 * @param pixelartItem
 * @returns
 */
  public update(pixelartItem: PixelartItem): Observable<PixelartItem> {
    return this.http.put<PixelartItem>(`${this.basePath}/pixelart-edit/${pixelartItem.id}`, pixelartItem, {
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

