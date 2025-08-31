import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtRequestItem } from 'src/app/pixelart/model/jwt-request-item';
import { JwtResponseItem } from 'src/app/pixelart/model/jwt-response-item';
import { RequestSignupItem } from 'src/app/pixelart/model/request-signup-item';
import { ApiService } from './api.service';

const TOKEN_KEY = 'auth-token';

// Define response type for signup
interface SignupResponse {
  message?: string;
  success?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  signin(request: JwtRequestItem): Observable<JwtResponseItem> {
    console.log('AuthService: Attempting signin with:', request);

    return this.apiService.post<JwtResponseItem>('/authenticate', request).pipe(
      map((resp) => {
        console.log('AuthService: Signin successful, response:', resp);
        sessionStorage.setItem('user', request.email);
        sessionStorage.setItem('auth-token', resp.jwtToken);
        return resp;
      })
    );
  }
// we need to specify the name of parameters as written in the Back-end code (=JsonProperty names)
  register(signupRequest: RequestSignupItem): Observable<SignupResponse> {
    return this.apiService.post<SignupResponse>('/signup', {
      alias: signupRequest.alias,
      userEmail: signupRequest.userEmail,
      userPassword: signupRequest.userPassword
    });
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
