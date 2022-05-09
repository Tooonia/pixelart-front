import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PixelartItem } from 'src/app/pixelart/model/pixelart-item';

// Class responsible to call the server side REST API
// similar to: projekt.service.ts / konsult-metier.service.ts
// film.service.ts
@Injectable({
  providedIn: 'root'
})
export class PixelartService {
  
  private basePath = 'http://localhost:8085/api';

  constructor(private http: HttpClient) { }

  // GET all pixelart (catalog)
  public findAll(): Observable<PixelartItem[]> {
    // Url from the Back
    return this.http.get<PixelartItem[]>(`${this.basePath}/pixelart`)
  }

  // GET all pixelart by User <<< with authent!
}

