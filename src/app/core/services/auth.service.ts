import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JwtRequestItem } from 'src/app/pixelart/model/jwt-request-item';
import { JwtResponseItem } from 'src/app/pixelart/model/jwt-response-item';
import { RequestSignupItem } from 'src/app/pixelart/model/request-signup-item';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private baseUrl = environment.apiUrl;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  signin(request: JwtRequestItem): Observable<JwtResponseItem> {
    return this.http
      .post<JwtResponseItem>(`${this.baseUrl}/authenticate`, request)
      .pipe(
        map((resp) => {
          sessionStorage.setItem('user', request.email);
          sessionStorage.setItem('auth-token', resp.jwtToken);
          return resp;
        })
      );
  }



  // 3rd method finally works, used in the 1st solution within sign-up.component.ts
  // we need to specify the name of parameters as written in the Back-end code (=JsonProperty names)
  // register(alias: string, email: string, password: string): Observable<any> {
  register(signupRequest: RequestSignupItem): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/signup`,
      {
        alias: signupRequest.alias,
        userEmail: signupRequest.userEmail,
        userPassword: signupRequest.userPassword
      }
    );
  }

  // signout() {
  //   sessionStorage.removeItem('user');

  //   this.router.navigateByUrl('/pixelart/catalog');
  // }

  isUserSignedin() {
    return sessionStorage.getItem('auth-token') !== null;
  }

  // 'user' here represents the email of the user
  getSignedinUser()  {
    return sessionStorage.getItem('user') as string;

  }

  signOut(): void {
    window.sessionStorage.clear();
    this.router.navigateByUrl('/pixelart/catalog');
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
