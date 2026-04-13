import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtRequestItem } from 'src/app/pixelart/model/jwt-request-item';
import { JwtResponseItem } from 'src/app/pixelart/model/jwt-response-item';
import { RequestSignupItem } from 'src/app/pixelart/model/request-signup-item';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | null = null;   // The token lives only in JS memory
  private currentUserEmail: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  clearToken(): void {
    this.token = null;
  }

  private isTokenExpired(): boolean {
    if (!this.token) {
      return true
    }
    const payload = JSON.parse(atob(this.token.split('.')[1]));
    return (Date.now() / 1000) > payload.exp;
  }

  // The token is stored in-memory in that service instance
  // that all components share.
  signIn(request: JwtRequestItem): Observable<JwtResponseItem> {
    return this.http
      .post<JwtResponseItem>(`${environment.apiUrl}/authenticate`, request, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        map((resp) => {
          this.token = resp.jwtToken;
          this.currentUserEmail = request.email;
          return resp;
        })
      );
  }


  // 3rd method finally works, used in the 1st solution within sign-up.component.ts
  // we need to specify the name of parameters as written in the Back-end code (=JsonProperty names)
  // register(alias: string, email: string, password: string): Observable<any> {
  register(signupRequest: RequestSignupItem): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/signup`,
      {
        alias: signupRequest.alias,
        userEmail: signupRequest.userEmail,
        userPassword: signupRequest.userPassword,
      },
      httpOptions
    );
  }

  // It uses in-memory token and token expiry check.
  isUserSignedin(): boolean {
    return !!this.token && !this.isTokenExpired();
  }

  // 'user' here represents the email of the user
  getSignedinUser(): string | null {
    return this.currentUserEmail;
  }

  signOut(): void {
    this.token = null;
    this.currentUserEmail = null;
    this.router.navigateByUrl('/pixelart/catalog');
  }

  // public saveToken(token: string): void {
  //   window.sessionStorage.removeItem(TOKEN_KEY);
  //   window.sessionStorage.setItem(TOKEN_KEY, token);
  //   console.log('saveToken method' + window.sessionStorage.getItem(TOKEN_KEY));
  // }

  /**
   * Gets the token of authentication that will be inserted into all the requests to the server
   */
  public getToken(): string | null {
    return this.token;
  }
  // // TODO: talan nem kell!
  // public getUserInfo() {
  //   const token = this.getToken();
  //   let payload;
  //   if (token) {
  //     payload = token.split(".")[1];
  //     payload = window.atob(payload);
  //     console.log(payload);
  //     return JSON.parse(payload);
  //   } else {
  //     return null;
  //   }
  // }
}