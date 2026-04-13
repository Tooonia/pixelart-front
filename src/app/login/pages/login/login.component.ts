import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { JwtRequestItem } from 'src/app/pixelart/model/jwt-request-item';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  // By using @ViewChild() to access the form, we can have access to it even earlier than of submitting it.
  @ViewChild('f', { static: false }) loginForm!: NgForm;

  form:  JwtRequestItem = {
    email: '',
    password: ''
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  private redirectTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isUserSignedin();

		if(this.isLoggedIn) {
			this.router.navigateByUrl('/pixelart/login/my-profile');//TODO: KELL IDE? az app-routing login > loadChildren miatt nem '/my-profile' itt!
		}

  }
  onSubmit(): void {
    // const { email, password } = this.form; //appeler jwtRequest
    this.form.email = this.loginForm.value.email;
    this.form.password = this.loginForm.value.password;

    this.authService.signIn(this.form).subscribe({
      next: () => { // appeler jwtResponse
        this.isLoginFailed = false;
        // isLoggedIn = true renders the login success banner instantly:
        this.isLoggedIn = true;
        // TODO: Maybe here the "intelligent" routing when signIn while saving a pixelart drawing!!!,
        // so to navigate back to the current drawing.
        // setTimeout 1500 keeps the logged in message on the screen for
        // 1,5 sec before navigating away to the my-profile page:
        setTimeout(() => {
          this.router.navigate(['/pixelart/login/my-profile']);
        }, 1500);
      },
      error: err => {
        if (err != null && err.message != null && err.status === 401) {
        this.errorMessage = 'The authentication credentials are invalid.';//TODO: Handle other error cases!
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    // console.log("Value of onSubmit in logincomponent.ts 2nd position: " + this.tokenStorage.getUser().email); // not visible in Console
    window.location.reload();
  }

  // Clearing the setTimeout timer ensures that even if the user navigates away
  // before the 1,5 sec timer ends, the setTimeout callback will not fire and navigate.
  ngOnDestroy(): void {
    clearTimeout(this.redirectTimer);
  }
//  4th solution
//  form:FormGroup;

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


//  2nd solution
//  username: string = '';
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
}
