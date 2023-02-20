import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

// 1st solution
const TOKEN_HEADER_KEY = 'Authorization'; // for Spring Boot back-end

/**
 * Class adding authentification information to every client request
 */
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authservice: AuthService) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // console.log(
    //   'value of token inside intercept' + this.authservice.getToken()
    // );
    // let authRequest = req;
    let token = this.authservice.getToken();
    if (token) {
      // authRequest = req.clone({ <<< TODO: works as well!
      var request = req.clone({
        headers: req.headers.set(TOKEN_HEADER_KEY, `Bearer ${token}`),
      });
      // TODO: exam version and not working!
    // let token = '' + this.authservice.getToken();
    // if (typeof token === 'string' && token.trim().length != 0) {
    //   var request = req.clone({
    //     setHeaders: {
    //       // Authorization: `***REMOVED***`,
    //       Authorization: `Bearer ${this.authservice.getToken()}`,
    //     },
    //   });

      return next.handle(request).pipe(
        catchError((err) => {
          if (err instanceof HttpErrorResponse && err.status === 401) {
            this.authservice.signOut();
          }
          return throwError(err);
        })
      );
    }
    return next.handle(req);//TODO: maybe as extra, and no need of it!
  }
  // TODO: maybe add here HTTP_INTERCEPTORS <<< Mustapha and Mathieu!!!
}
