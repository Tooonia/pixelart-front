import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { RequestSignupItem } from 'src/app/pixelart/model/request-signup-item';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
// 1st solution
  form: RequestSignupItem = {
    alias: '',
    email: '',
    password: ''
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
  }
  onSubmit(): void {
    const { alias, email, password } = this.form;
    this.authService.register(alias, email, password).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        // TODO: message to user that sign-up was successful!
        this.router.navigateByUrl('/login');
        // if(this.isSuccessful) { //TODO: nem igy kellene irni?
        //   this.router.navigateByUrl('/login');
        // }
      },
      error: err => {
        this.errorMessage = err.error.message;//TODO: proper error message to write!?
        this.isSignUpFailed = true;
      }
    });
  }
}
