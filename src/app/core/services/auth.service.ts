import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtRequestItem } from 'src/app/pixelart/model/jwt-request-item';
import { pluck, share, shareReplay, tap } from 'rxjs/operators';
import { JwtResponseItem } from 'src/app/pixelart/model/jwt-response-item';
import { RequestSignupItem } from 'src/app/pixelart/model/request-signup-item';

// // 1st solution
const AUTH_API = 'http://localhost:8085/api';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private baseUrl = 'http://localhost:8085/api';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  signin(request: JwtRequestItem): Observable<JwtResponseItem> {
    return this.http
      .post<any>(this.baseUrl + '/authenticate', request, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        map((resp) => {
          sessionStorage.setItem('user', request.email);
          sessionStorage.setItem('auth-token', resp.jwtToken);
          return resp;
        })
      );
  }
//TODO: this method is used in the 2nd solution within sign-up.component.ts
  signup(requestSignup: RequestSignupItem): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + '/signup', requestSignup, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        responseType: 'text' as 'json',
      })
      .pipe(
        map((resp) => {
          return resp;
        })
      );
  }
  //TODO: 3rd method finally works, used in the 1st solution within sign-up.component.ts
// we need to specify the name of parameters as written in the Back-end code (=JsonProperty names)
  register(alias: string, email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + '/signup',
      {
        alias: alias,
        user_email: email,
        user_password: password,
      },
      httpOptions
    );
  }
  // //TODO: this method is used in the 1st solution within sign-up.component.ts
  // register(alias: string, email: string, password: string): Observable<any> {
  //   return this.http.post(
  //     AUTH_API + '/signup',
  //     {
  //       alias,
  //       email,
  //       password,
  //     },
  //     httpOptions
  //   );
  // }

  signout() {
    sessionStorage.removeItem('user');

    this.router.navigateByUrl('/pixelart/catalog');
  }

  isUserSignedin() {
    return sessionStorage.getItem('auth-token') !== null;
  }

  // 'user' here represents the email of the user
  getSignedinUser()  {
    return sessionStorage.getItem('user') as string;

  }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
    console.log('saveToken method' + window.sessionStorage.getItem(TOKEN_KEY));
  }

  /**
   * Gets the token of authentication that will be inserted into all the requests to the server
   */
  public getToken(): string | null {
    let token = window.sessionStorage.getItem(TOKEN_KEY);
    console.log('getToken method ' + token);
    return token;
  }

  // /**
  //  *
  //  */
  // public getSignedInUser(): any {
  //   const userEmail = this.getSignedinUser();
  //   //...

  //   return {};
  // }

  // TODO: talan nem kell!
  public getUserInfo() {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split(".")[1];
      payload = window.atob(payload);
      console.log(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

}
