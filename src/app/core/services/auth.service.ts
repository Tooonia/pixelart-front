import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'src/app/pixelart/model/request';

// 1st solution
const AUTH_API = 'http://localhost:8085/api';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // 2nd solution
  // private baseUrl = 'http://localhost:8085/api';

	// constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

	// signin(request: Request): Observable<any> {
	// 	return this.http.post<any>(this.baseUrl + '/login', request, {headers: new HttpHeaders({ 'Content-Type': 'application/json' })}).pipe(map((resp) => {
	// 	var stringResponse = resp.split(':').pop().split('"').pop().split('"')[0];    
		
			
	// 		sessionStorage.setItem('user', stringResponse.email);
  //       sessionStorage.setItem('token', 'Bearer ' + stringResponse.token);
  //       return resp;
  //     }));
	// }

	// signup(request: Request): Observable<any> {
	// 	return this.http.post<any>(this.baseUrl + '/signup', request, {headers: new HttpHeaders({ 'Content-Type': 'application/json' }), responseType: 'text' as 'json'}).pipe(map((resp) => {                                                         
	// 		return resp;
	// 	}));
	// }

	// signout() {
	// 	sessionStorage.removeItem('user');
	// 	sessionStorage.removeItem('token');

	// 	this.router.navigateByUrl('/signin');
	// }

	// isUserSignedin() {
	// 	return sessionStorage.getItem('token') !== null;
	// }

	// getSignedinUser() {
	// 	return sessionStorage.getItem('user') as string;
	// }

	// getToken() {
	// 	let token = sessionStorage.getItem('token') as string;
	// 	return token;
	// }





// 1st solution
  constructor(private http: HttpClient) { }
  login(email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + '/authenticate', {
      email,
      password
    }, httpOptions);
  }
  register(alias: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + '/signup', {
      alias,
      email,
      password
    }, httpOptions);
  }
}
