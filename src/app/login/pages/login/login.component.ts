import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
// 2nd solution
  // username: string = '';
// 	password : string = '';

// 	isSignedin = false;

// 	error: string = '';

// 	constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {}

// 	ngOnInit() {
// 		this.isSignedin = this.authService.isUserSignedin();

// 		if(this.isSignedin) {
// 			this.router.navigateByUrl('home');
// 		}
// 	}

// 	doSignin() {
// 		if(this.username !== '' && this.username !== null && this.password !== '' && this.password !== null) {
// 			const request: Request = { userName: this.username, userPwd: this.password};

// 			this.authService.signin(request).subscribe((result)=> {
// 				//this.router.navigate(['/home']);
// 				this.router.navigateByUrl('home');
// 			}, () => {
// 				this.error = 'Either invalid credentials or something went wrong';
// 			});
// 		} else {
// 			this.error = 'Invalid Credentials';
// 		}
// 	}











// 1st solution
  form: any = {
    email: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }
  onSubmit(): void {
    const { email, password } = this.form;
    this.authService.login(email, password).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.reloadPage();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }
  reloadPage(): void {
    window.location.reload();
  }
}
