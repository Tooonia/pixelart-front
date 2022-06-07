import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { JwtRequest } from 'src/app/pixelart/model/jwt-request';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
// 4th solution
// form:FormGroup;

//     constructor(private fb:FormBuilder, 
//                  private authService: AuthService, 
//                  private router: Router) {

//         this.form = this.fb.group({
//             email: ['',Validators.required],
//             password: ['',Validators.required]
//         });
//     }

//     login() {
//         const val = this.form.value;

//         if (val.email && val.password) {
//             this.authService.login(val.email, val.password)
//                 .subscribe(
//                     () => {
//                         console.log("User is logged in");
//                         this.router.navigateByUrl('/my-profile');
//                     }
//                 );
//         }
//     }






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
  // form!: JwtRequest;
  form:  JwtRequest = {
    email: '',
    password: ''
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  // roles: string[] = [];
  alias!: string;
  email!: string;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      // this.roles = this.tokenStorage.getUser().roles;
      // this.alias = this.tokenStorage.getUser().alias;
      // this.email = this.tokenStorage.getUser().email; //TODO: these values are "undefined"!!!
      // console.log("ngOninit value in logincomponent.ts :" + this.tokenStorage.getUser().email);
    }
  }
  onSubmit(): void {
    // const { email, password } = this.form; //appeler jwtRequest
    this.authService.login(this.form).subscribe({
      next: data => { // appeler jwtResponse
        this.tokenStorage.saveToken(data.jwtToken);
        // this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        // this.roles = this.tokenStorage.getUser().roles;
        // this.alias = this.tokenStorage.getUser().alias;
        // this.email = this.tokenStorage.getUser().email;
        // console.log("Value of onSubmit in logincomponent.ts: " + this.tokenStorage.getUser().email); // not visible in Console
        this.reloadPage();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }
  reloadPage(): void {
    // console.log("Value of onSubmit in logincomponent.ts 2nd position: " + this.tokenStorage.getUser().email); // not visible in Console
    window.location.reload();
  }
}
