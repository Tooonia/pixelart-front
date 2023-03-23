import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { JwtRequestItem } from 'src/app/pixelart/model/jwt-request-item';
import { UserService } from 'src/app/core/services/user.service';
import { UserGetItem } from 'src/app/pixelart/model/user-get-item';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
// 1st solution
  // form!: JwtRequest;
  form:  JwtRequestItem = {
    email: '',
    password: ''
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  alias!: string;
  email!: string;
  connectedUser!: UserGetItem;

  isSignedin = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isUserSignedin();

		if(this.isLoggedIn) {
			this.router.navigateByUrl('/login/my-profile');//TODO: az app-routing login > loadChildren miatt nem '/my-profile' itt!
		}

    // 1st solution
    // if (this.tokenStorage.getToken()) {
    //   this.isLoggedIn = true;
    // }
  }
  onSubmit(): void {
    // const { email, password } = this.form; //appeler jwtRequest
    this.authService.signin(this.form).subscribe({
    // this.authService.login(this.form).subscribe({
      next: data => { // appeler jwtResponse
        this.authService.saveToken(data.jwtToken); //TODO: do I need saveUser here?
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.email = this.form.email; //THIS WORKS
        // this.email = this.authService.getSignedinUser(); //THIS WORKS
        // THE FOLLOWING DOES NOT WORK:
        // this.userService.getUserProfileByEmail(this.form.email).subscribe(data => {
        // // this.userService.getPrivateUserProfile().subscribe(data => {
        //     this.connectedUser = data;
        //     console.log(data);
        //   }
        // );
        this.reloadPage();
      },
      error: err => {
        if (err.error != null && err.error.message != null) {
        this.errorMessage = err.error.message;//TODO: proper error message to write!?

        } this.isLoginFailed = true;
      }
    });
  }
  reloadPage(): void {
    // console.log("Value of onSubmit in logincomponent.ts 2nd position: " + this.tokenStorage.getUser().email); // not visible in Console
    window.location.reload();
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
