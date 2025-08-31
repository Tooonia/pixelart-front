import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PixelartItem } from 'src/app/pixelart/model/pixelart-item';
import { PixelartSimpleItem } from 'src/app/pixelart/model/pixelart-simple-item';
import { PixelartRequestItem } from 'src/app/pixelart/model/pixelart-request-item';
import { ApiService } from './api.service';

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

  constructor(private apiService: ApiService) { }

  /**
   * GET all pixelart (catalog)
   */
  public findAll(): Observable<PixelartItem[]> {
    console.log('PixelartService: Fetching all pixelart catalog');
    return this.apiService.get<PixelartItem[]>('/pixelart-catalog');
  }

  /**
   * GET one pixelart by id
   */
  public getById(id: number): Observable<PixelartItem> {
    console.log('PixelartService: Fetching pixelart by ID:', id);
    return this.apiService.get<PixelartItem>(`/pixelart/${id}`);
  }

  /**
   * GET all pixelart from one User by user id
   */
  public getAllPixelArtByUser(id: number): Observable<PixelartItem[]> {
    console.log('PixelartService: Fetching pixelart for user ID:', id);
    return this.apiService.get<PixelartItem[]>(`/pixelart-by-user/${id}`);
  }

  /**
   * CREATE pixelart
   * //@param pixelartSimpleItem <<< works with pixelartModel as well
   */
  public add(pixelartSimpleItem: PixelartRequestItem): Observable<PixelartRequestItem> {
    console.log('PixelartService: Creating new pixelart:', pixelartSimpleItem);
    return this.apiService.post<PixelartRequestItem>('/pixelart-create', pixelartSimpleItem);
  }

  /**
   * UPDATE pixelart by id
   */
  public update(pixelartToUpdate: PixelartSimpleItem): Observable<PixelartSimpleItem> {
    console.log('PixelartService: Updating pixelart ID:', pixelartToUpdate.id, pixelartToUpdate);
    return this.apiService.put<PixelartSimpleItem>(`/pixelart-edit/${pixelartToUpdate.id}`, pixelartToUpdate);
  }

  /**
   * DELETE pixelart by id
   */
  public deleteById(id: number): Observable<PixelartItem> {
    console.log('PixelartService: Deleting pixelart ID:', id);
    return this.apiService.delete<PixelartItem>(`/pixelart-edit/${id}`);
  }
}

