import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

const TOKEN_HEADER_KEY = 'Authorization'; // for Spring Boot back-end

/**
 * Class adding authentification information to every client request
 */
@Injectable({ providedIn: 'root' })
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private authservice: AuthService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authservice.getToken();
    if (token) {
      var request = req.clone({
        headers: req.headers.set(TOKEN_HEADER_KEY, `Bearer ${token}`),
      });
    // When we had the functionning problem of that file, we added manually in the previous method:
    //     setHeaders: {
    //       // Authorization: `Bearer tokenToInsertHereEnDur`,
    //       Authorization: `Bearer ${this.authservice.getToken()}`,
    //     },
    //   });
      return next.handle(request).pipe(
        catchError((err) => {
          if (err instanceof HttpErrorResponse && err.status === 401) {
            this.authservice.clearToken();
            // Or: navigation to '/pixelart/catalog'
            // this.router.navigate(['/login']);
          }
          return throwError(() => err);
        })
      );
    }
    return next.handle(req);
  }

  // Previously when error in that file: maybe add here HTTP_INTERCEPTORS <<< Mustapha and Mathieu!!!
}
