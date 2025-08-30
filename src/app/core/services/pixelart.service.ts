import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PixelartItem } from 'src/app/pixelart/model/pixelart-item';
import { PixelartSimpleItem } from 'src/app/pixelart/model/pixelart-simple-item';
import { PixelartRequestItem } from 'src/app/pixelart/model/pixelart-request-item';

const REQUEST_TIMEOUT = 15000; // 15 seconds

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
   */
  public findAll(): Observable<PixelartItem[]> {
    console.log('findAll method : ' + this.http.get<PixelartItem[]>(`${this.basePath}/pixelart-catalog`));
    return this.http.get<PixelartItem[]>(`${this.basePath}/pixelart-catalog`).pipe(
      timeout(REQUEST_TIMEOUT),
      catchError((error) => {
        console.error('Find all pixelart error:', error);
        return throwError(() => new Error('Failed to load pixelart catalog. Please try again.'));
      })
    );
  }

  /**
   * GET one pixelart by id
   */
  public getById(id: number): Observable<PixelartItem> {
    console.log('Hello, getById does not work ' + this.http.get<PixelartItem>(`${this.basePath}/pixelart/${id}`));
    return this.http.get<PixelartItem>(`${this.basePath}/pixelart/${id}`).pipe(
      timeout(REQUEST_TIMEOUT),
      catchError((error) => {
        console.error('Get pixelart by id error:', error);
        return throwError(() => new Error('Failed to load pixelart details. Please try again.'));
      })
    );
  }

  /**
   * GET all pixelart from one User by user id
   */
  public getAllPixelArtByUser(id: number): Observable<PixelartItem[]> {
    return this.http.get<PixelartItem[]>(`${this.basePath}/pixelart-by-user/${id}`).pipe(
      timeout(REQUEST_TIMEOUT),
      catchError((error) => {
        console.error('Get pixelart by user error:', error);
        return throwError(() => new Error('Failed to load user pixelart. Please try again.'));
      })
    );
  }

  /**
   * CREATE pixelart
   * //@param pixelartSimpleItem <<< works with pixelartModel as well
   */
  public add(pixelartSimpleItem: PixelartRequestItem): Observable<PixelartRequestItem> {
    return this.http.post<PixelartRequestItem>(`${this.basePath}/pixelart-create`, pixelartSimpleItem).pipe(
      timeout(REQUEST_TIMEOUT),
      catchError((error) => {
        console.error('Create pixelart error:', error);
        return throwError(() => new Error('Failed to create pixelart. Please try again.'));
      })
    );
  }

  /**
   * UPDATE pixelart by id
   */
  public update(pixelartToUpdate: PixelartSimpleItem): Observable<PixelartSimpleItem> {
    return this.http.put<PixelartSimpleItem>(`${this.basePath}/pixelart-edit/${pixelartToUpdate.id}`, pixelartToUpdate).pipe(
      timeout(REQUEST_TIMEOUT),
      catchError((error) => {
        console.error('Update pixelart error:', error);
        return throwError(() => new Error('Failed to update pixelart. Please try again.'));
      })
    );
  }

  /**
   * DELETE pixelart by id
   */
  public deleteById(id: number): Observable<PixelartItem> {
    return this.http.delete<PixelartItem>(`${this.basePath}/pixelart-edit/${id}`).pipe(
      timeout(REQUEST_TIMEOUT),
      catchError((error) => {
        console.error('Delete pixelart error:', error);
        return throwError(() => new Error('Failed to delete pixelart. Please try again.'));
      })
    );
  }
}

