import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { RequestSignupItem } from 'src/app/pixelart/model/request-signup-item';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) signupForm!: NgForm;

  form: RequestSignupItem = {
    alias: '',
    userEmail: '',
    userPassword: ''
  };

  isLoggedIn = false;
  isSignupSuccessful = false;
  isSignUpFailed = false;
  signupSubscription: Subscription | undefined;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isUserSignedin();

    if (this.isLoggedIn) {
      this.router.navigateByUrl('/pixelart/login/my-profile');
    }
  }

  onSubmit(): void {
    this.form.alias = this.signupForm.value.alias;
    this.form.userEmail = this.signupForm.value.email;
    this.form.userPassword = this.signupForm.value.password;

    console.log('SignUpComponent: Attempting registration with:', {
      alias: this.form.alias,
      email: this.form.userEmail,
      password: '***' // Don't log actual password
    });

    this.signupSubscription = this.authService.register(this.form).subscribe({
      next: data => {
        console.log('SignUpComponent: Registration successful:', data);
        this.isSignupSuccessful = true;
        this.isSignUpFailed = false;
        // TODO: message to user that sign-up was successful!

        setTimeout(() => {
          if (this.isSignupSuccessful) {
            this.router.navigateByUrl('/pixelart/login');
          }
        }, 2000);
      },
      error: err => {
        console.error('SignUpComponent: Registration failed:', err);
        this.isSignUpFailed = true;

        // Simplified error handling - rely on ApiService for meaningful messages
        if (err && err.message) {
          this.errorMessage = err.message;
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.signupSubscription) {
      this.signupSubscription.unsubscribe();
    }
  }
}
