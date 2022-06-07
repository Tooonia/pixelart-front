import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PixelartItem } from 'src/app/pixelart/model/pixelart-item';
import { PixelartModel } from 'src/app/pixelart/model/pixelart-model';

/**
 * Class responsible to call the server side REST API
 * We put all pixelart related services here.
 */ 

// TODO:similar to: projekt.service.ts = l'API by openapi generator and
//  projekt-metier.service.ts = that has projekt.service.ts in its constructor
            //  (/ konsult-metier.service.ts)
// TODO Mathieu: I am missing/mixing here Interface and Implementation?

// TODO: film.service.ts
// orders.service.ts (Jeremy)
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

/**
 * GET all pixelart from one User
 * @param pixelartModel 
 * @returns 
 */
public getAllPixelArtByUser(id: number): Observable<PixelartItem[]> {
  return this.http.get<PixelartItem[]>(`${this.basePath}/pixelart-by-user/${id}`)
}


/**
 * CREATE pixelart
 * @param pixelartModel 
 * @returns 
 */ 
  public add(pixelartModel: PixelartModel): Observable<PixelartModel> {


    return this.http.post<PixelartModel>(`${this.basePath}/pixelart-create`, pixelartModel, {
      headers: {
        'Authorization': '***REMOVED***',
      }
    });
  }
  // TODO: This is with the interface:
  // public add(pixelartItem: PixelartItem): Observable<PixelartItem> {
  //   return this.http.post<PixelartItem>(`${this.basePath}/pixelart`, pixelartItem);
  // }

  // UPDATE pixelart by id
  public update(pixelartItem: PixelartItem): Observable<PixelartItem> {
    return this.http.put<PixelartItem>(`${this.basePath}/pixelart-edit/${pixelartItem.id}`, pixelartItem);
// public update(pixelartItem: PixelartItem, pixelartId: Number): Observable<PixelartItem> {
    // return this.http.put<PixelartItem>(`${this.basePath}/pixelart`, pixelartItem);
  }

  // DELETE pixelart by id
  // TODO: why <any> for Observable here?:
  public deleteById(id: number): Observable<any> {
    return this.http.delete<any>(`${this.basePath}/pixelart-edit/${id}`);
    // return this.http.delete(`${this.basePath}/pixelart/${id}`, {
    //   responseType: 'json',
    // });
    // return this.http.delete<PixelartItem>(`${this.basePath}/pixelart/${id}`).pipe();
    // Did not work with .pipe(tap()) <<< could not importe 'tap'?!
    // TODO : Doing here the refreshcollection, instead of adding it to the delete button!!!
  }
}

