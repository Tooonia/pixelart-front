import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { RequestSignup } from 'src/app/pixelart/model/request-signup';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  // 2nd solution
  // constructor(private authService: AuthService) { }

  // alias: string = '';
	// email: string = '';
	// password: string = '';

	// error: string = '';
	// success: string = '';

	// ngOnInit(): void {
	// }

	// doSignup() {
	// 	if(this.email !== '' && this.email !== null && this.password !== '' && this.password !== null
  //   && this.alias !== '' && this.alias !== null) {
	// 		const request: RequestSignup = { alias: this.alias, email: this.email, password: this.password };

	// 		this.authService.signup(request).subscribe((result)=> {
	// 			//console.log(result);
	// 			//this.success = 'Signup successful';
	// 			this.success = result;
	// 		}, (err) => {
	// 			//console.log(err);
	// 			this.error = 'Something went wrong during signup';
	// 		});
	// 	} else {
	// 		this.error = 'All fields are mandatory';
	// 	}
	// }











// 1st solution
  form: any = {
    alias: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }
  onSubmit(): void {
    const { alias, email, password } = this.form;
    this.authService.register(alias, email, password).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}
