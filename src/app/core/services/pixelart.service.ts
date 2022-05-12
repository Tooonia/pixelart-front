import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PixelartItem } from 'src/app/pixelart/model/pixelart-item';

// Class responsible to call the server side REST API
// We put all pixelart related services here.

// TODO:similar to: projekt.service.ts = l'API by openapi generator and
//  projekt-metier.service.ts = that has projekt.service.ts in its constructor
            //  (/ konsult-metier.service.ts)
// TODO Mathieu: I am missing/mixing here Interface and Implementation?

// film.service.ts
// orders.service.ts (Jeremy)
@Injectable({
  providedIn: 'root'
})
export class PixelartService {

  private basePath = 'http://localhost:8085/api';

  constructor(private http: HttpClient) { }

public refreshCollection(): void {

}

  // TODO: should this be inside constructor? like orders.service.ts (Jeremy)
  // GET all pixelart (catalog)
  public findAll(): Observable<PixelartItem[]> {
    // Url from the Back
    return this.http.get<PixelartItem[]>(`${this.basePath}/pixelart`)
  }

  // GET all pixelart by connected User <<< with authent!

  // GET pixelart by id
  public getById(id: number): Observable<PixelartItem> {
    return this.http.get<PixelartItem>(`${this.basePath}/pixelart/${id}`)
  }

  // CREATE pixelart <<< requires the canvas!!!
  // Orders of futur windows: When clicked on "Save pixelart", it allows to add a title, then it is saved in the DB.
  public add(pixelartItem: PixelartItem): Observable<PixelartItem> {
    return this.http.post<PixelartItem>(`${this.basePath}/pixelart`, pixelartItem);
  }

  // UPDATE pixelart by id
  public update(pixelartItem: PixelartItem): Observable<PixelartItem> {
    return this.http.put<PixelartItem>(`${this.basePath}/pixelart/${pixelartItem.id}`, pixelartItem);
// public update(pixelartItem: PixelartItem, pixelartId: Number): Observable<PixelartItem> {
    // return this.http.put<PixelartItem>(`${this.basePath}/pixelart`, pixelartItem);
  }

  // DELETE pixelart by id
  // TODO: why <any> for Observable here?:
  public deleteById(id: number): Observable<any> {
    return this.http.delete<any>(`${this.basePath}/pixelart/${id}`);
    // return this.http.delete(`${this.basePath}/pixelart/${id}`, {
    //   responseType: 'json',
    // });
    // return this.http.delete<PixelartItem>(`${this.basePath}/pixelart/${id}`).pipe();
    // Did not work with .pipe(tap()) <<< could not importe 'tap'?!
    // TODO : Doing here the refreshcollection, instead of adding it to the delete button!!!
  }
}

