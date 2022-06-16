import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtRequest } from 'src/app/pixelart/model/jwtrequest';
import { Usermodel } from 'src/app/pixelart/model/usermodel';
import { pluck, share, shareReplay, tap } from 'rxjs/operators';
import { JwtResponse } from 'src/app/pixelart/model/jwt-response';
import { RequestSignup } from 'src/app/pixelart/model/request-signup';

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

  signin(request: JwtRequest): Observable<JwtResponse> {
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

  signup(requestSignup: RequestSignup): Observable<any> {
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

  signout() {
    sessionStorage.removeItem('user');

    this.router.navigateByUrl('/pixelart/catalog');
  }

  isUserSignedin() {
    return sessionStorage.getItem('auth-token') !== null;
  }

  getSignedinUser() {
    return sessionStorage.getItem('user') as string;
  }

  register(alias: string, email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + '/signup',
      {
        alias,
        email,
        password,
      },
      httpOptions
    );
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
    console.log('getToken method' + token);
    return token;
  }
}
