import { Injectable } from '@angular/core';

// const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }
  signOut(): void {
    window.sessionStorage.clear();
  }
  public saveToken(token: string): void {

    // This works so it saves in Session storage (vagy lehet, nem ezert felelos?)
    // window.sessionStorage.removeItem(USER_KEY);
    // window.sessionStorage.setItem(USER_KEY, token);
    // My 2nd try:
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
  /**
     * Gets the token of authentication that will be inserted into all the requests to the server
     */
  // public getToken(): string | null {
  // public getToken(): string | null {
    // const token = window.sessionStorage.getItem(TOKEN_KEY);
    
    // token.split(':').pop().split('"').pop().split('"')[0]; 

    
    // Ez mukodott avval, mikor saveToken()-t is USER_KEY-re valtoztattam.
    // return window.sessionStorage.getItem(USER_KEY);
    // return token;
    // return window.sessionStorage.getItem(TOKEN_KEY) as string;
  // }
  // }
  // public saveUser(user: any): void {
  //   window.sessionStorage.removeItem(USER_KEY);
  //   window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  // }
  // public getUser(): any {
  //   const user = window.sessionStorage.getItem(USER_KEY);
  //   // const user = window.sessionStorage.getItem(TOKEN_KEY);
  //   if (user) {
  //     console.log("Return value of getUser: " + JSON.parse(user));
  //     console.log("Value of user: " + user);
  //     return JSON.parse(user);
  //   }
  //   return {};
  // }

  // ??? Ugyan a 2. kodbol valo, de furcsa
  // public isUserSignedin() {
	// 	return sessionStorage.getItem(USER_KEY) !== null;
	// 	// return sessionStorage.getItem('token') !== null;
	// }
}
