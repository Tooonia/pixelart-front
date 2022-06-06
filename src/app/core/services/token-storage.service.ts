import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  tokenPureInfo!: string;
  constructor() { }
  signOut(): void {
    window.sessionStorage.clear();
  }
  public saveToken(token: string): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, token);
    // if (token !== '' && token !== null) {
    //   this.tokenPureInfo = token.split(':').pop().split('"').pop().split('"')[0];
    // }
    
    
  //  My first try:
    // window.sessionStorage.removeItem(USER_KEY);
    // this.tokenPureInfo = token.valueOf();
    // window.sessionStorage.setItem(USER_KEY, this.tokenPureInfo);

    // Original solution:
    // window.sessionStorage.removeItem(TOKEN_KEY);
    // window.sessionStorage.setItem(TOKEN_KEY, token);
  }
  public getToken(): string | null {
    return window.sessionStorage.getItem(USER_KEY);
    // return window.sessionStorage.getItem(TOKEN_KEY);
  }
  // }
  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  public isUserSignedin() {
		return sessionStorage.getItem(USER_KEY) !== null;
		// return sessionStorage.getItem('token') !== null;
	}
}
