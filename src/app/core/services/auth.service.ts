import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JwtRequestItem } from 'src/app/pixelart/model/jwt-request-item';
import { JwtResponseItem } from 'src/app/pixelart/model/jwt-response-item';
import { RequestSignupItem } from 'src/app/pixelart/model/request-signup-item';

const TOKEN_KEY = 'auth-token';
const REQUEST_TIMEOUT = 15000; // 15 seconds

// Define response type for signup
interface SignupResponse {
  message?: string;
  success?: boolean;
}

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
        timeout(REQUEST_TIMEOUT),
        map((resp) => {
          sessionStorage.setItem('user', request.email);
          sessionStorage.setItem('auth-token', resp.jwtToken);
          return resp;
        }),
        catchError((error) => {
          console.error('Signin error:', error);

          // Provide more specific error messages based on the error type
          if (error.status === 401) {
            return throwError(() => new Error('Invalid email or password. Please check your credentials.'));
          } else if (error.status === 0 || error.name === 'TimeoutError') {
            return throwError(() => new Error('Connection timeout. Please check your internet connection.'));
          } else if (error.status >= 500) {
            return throwError(() => new Error('Server error. Please try again later.'));
          } else {
            return throwError(() => new Error('Authentication failed. Please try again.'));
          }
        })
      );
  }

  // we need to specify the name of parameters as written in the Back-end code (=JsonProperty names)
  // register(alias: string, email: string, password: string): Observable<any> {
  register(signupRequest: RequestSignupItem): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(
      `${this.baseUrl}/signup`,
      {
        alias: signupRequest.alias,
        userEmail: signupRequest.userEmail,
        userPassword: signupRequest.userPassword
      }
    ).pipe(
      timeout(REQUEST_TIMEOUT),
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError(() => new Error('Registration failed. Please try again.'));
      })
    );
  }

  isUserSignedin(): boolean {
    return sessionStorage.getItem('auth-token') !== null;
  }

  // 'user' here represents the email of the user
  getSignedinUser(): string | null {
    return sessionStorage.getItem('user');
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
  public getUserInfo(): any {
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
