import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PixelartItem } from 'src/app/pixelart/model/pixelart-item';
import { PixelartSimpleItem } from 'src/app/pixelart/model/pixelart-simple-item';
import { PixelartRequestItem } from 'src/app/pixelart/model/pixelart-request-item';

/**
 * Class responsible to call the server side REST API
 * We put all pixelart related services here.
 */
@Injectable({
  providedIn: 'root'
})
export class PixelartService {
  pixelartSelected = new EventEmitter<PixelartItem>();
  pixelartClickedForDetail = new Subject<number>();
  private basePath = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * GET all pixelart (catalog)
   * @returns
   */
  public findAll(): Observable<PixelartItem[]> {
    console.log('findAll method : ' + this.http.get<PixelartItem[]>(`${this.basePath}/pixelart-catalog`));
    return this.http.get<PixelartItem[]>(`${this.basePath}/pixelart-catalog`);
  }

  /**
   * GET one pixelart by id
   * @param id
   * @returns
   */
  public getById(id: number): Observable<PixelartItem> {
    console.log('Hello, getById does not work ' + this.http.get<PixelartItem>(`${this.basePath}/pixelart/${id}`));
    return this.http.get<PixelartItem>(`${this.basePath}/pixelart/${id}`);
  }

  /**
   * GET all pixelart from one User by user id
   * @param id
   * @returns
   */
  public getAllPixelArtByUser(id: number): Observable<PixelartItem[]> {
    return this.http.get<PixelartItem[]>(`${this.basePath}/pixelart-by-user/${id}`);
  }

  /**
   * CREATE pixelart
   * @param pixelartSimpleItem //works with pixelartModel as well
   * @returns
   */
  public add(pixelartSimpleItem: PixelartRequestItem): Observable<PixelartRequestItem> {
    return this.http.post<PixelartRequestItem>(`${this.basePath}/pixelart-create`, pixelartSimpleItem);
  }

  /**
   * UPDATE pixelart by id
   * @param pixelartSimpleItem
   * @returns
   */
  public update(pixelartToUpdate: PixelartSimpleItem): Observable<PixelartSimpleItem> {
    return this.http.put<PixelartSimpleItem>(`${this.basePath}/pixelart-edit/${pixelartToUpdate.id}`, pixelartToUpdate);
  }

  /**
   * DELETE pixelart by id
   * @param id
   * @returns
   */
  public deleteById(id: number): Observable<PixelartItem> {
    return this.http.delete<PixelartItem>(`${this.basePath}/pixelart-edit/${id}`);
  }
}

