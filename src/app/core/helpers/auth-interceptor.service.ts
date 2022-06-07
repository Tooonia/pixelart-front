import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';

// 1st solution
const TOKEN_HEADER_KEY = 'Authorization';       // for Spring Boot back-end

//Eredetileg igy volt a generated class-ban, de a kodban root nelkul van!
// @Injectable({
//   providedIn: 'root'
// })

/**
 * Class adding authentification information to every client request
 */
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
// 2nd solution
  // constructor(private authService: AuthService) { }
  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //     if (this.authService.isUserSignedin() && this.authService.getToken()) {
  //         const request = req.clone({
  //             headers: new HttpHeaders({
  //                 'Authorization': this.authService.getToken()
  //             })
  //         });
  //         return next.handle(request).pipe(
  //     catchError(err => {
  //       if(err instanceof HttpErrorResponse && err.status === 401) {
  //         this.authService.signout();
  //       }
  //       return throwError(err);
  //     })
  //   );
  //     }
     
  // return next.handle(req);
  // }









// TODO: kipotolni 1st solution exception-nel!!! Es az egesz strukturaja jobb annak!

// 1st solution
  constructor(private tokenStorageService: TokenStorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.tokenStorageService.getToken();
    console.log(token);
    if (token != null) {
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    }
    return next.handle(authReq);
  }
}
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
];
