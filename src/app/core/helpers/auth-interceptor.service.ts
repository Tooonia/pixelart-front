import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

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
//  @Injectable({
//    providedIn: 'root'
//  })
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









// TODO: kipotolni 2nd solution exception-nel!!! Es az egesz strukturaja jobb annak!

// 1st solution
  constructor(private authservice: AuthService) {
    console.log("value inside constructor"); }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("value of token inside intercept" + this.authservice.getToken()); //value null

    let token = '' + this.authservice.getToken();
    if ( typeof token === "string" && !(token.trim().length == 0)) {
    // if(token != null && token.length > 0) {
    // if (this.authservice.getToken()) {
     
        // req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + this.authservice.getToken())
        var request = req.clone({
          setHeaders: {
              Authorization: `Bearer ${this.authservice.getToken()}`
          }
      });
      
      return next.handle(request).pipe(
        catchError(err => {
          if(err instanceof HttpErrorResponse && err.status === 401) {
            this.authservice.signOut();
          }
      return throwError(err);
      }));
    }
    return next.handle(req);
}

  //   let authReq = req;
  //   const token = this.tokenStorageService.getToken();
    
  //   if (token) {
  //     authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
  
  //   return next.handle(authReq);
  //   }
  //   else {
  //     return next.handle(req);
  //   }
  // }

}
// export const authInterceptorProviders = [
//   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
// ];
