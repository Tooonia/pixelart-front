import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscriber, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { RequestSignupItem } from 'src/app/pixelart/model/request-signup-item';
import { UserGetItem } from 'src/app/pixelart/model/user-get-item';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
// 1st solution
@ViewChild('f', { static: false }) signupForm!: NgForm;
  form: RequestSignupItem = {
    alias: '',
    userEmail: '',
    userPassword: ''
  };
  isLoggedIn = false;
  isSignupSuccessful = false;
  isSignUpFailed = false;
  aliasExists = false;
  emailExists = false;
  signupSubscription! : Subscription;
  userSubscription!: Subscription;
  errorMessage = '';

  users!: UserGetItem[];

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isUserSignedin();

		if(this.isLoggedIn) {
			this.router.navigateByUrl('/login/my-profile');//TODO: KELL IDE? az app-routing login > loadChildren miatt nem '/my-profile' itt!
		}

    // if(this.isSignupSuccessful) {
    //   this.router.navigateByUrl('/login');
    // }

  }
  onSubmit(): void {
    // const { alias, email, password } = this.form;
    this.form.alias = this.signupForm.value.alias;
    this.form.userEmail = this.signupForm.value.email;
    this.form.userPassword = this.signupForm.value.password;
    this.signupSubscription = this.authService.register(this.form).subscribe({
      next: data => {
        console.log(data);
        this.isSignupSuccessful = true;
        this.isSignUpFailed = false;
        // TODO: message to user that sign-up was successful!
        // this.router.navigateByUrl('/login');
        // if(this.isSignupSuccessful) { //TODO: nem igy kellene irni?
        //   this.router.navigateByUrl('/login');
        // }
        setTimeout(() => {
          // window.location.reload();
          if(this.isSignupSuccessful) {
          this.router.navigateByUrl('/login');
          }
        }, 2000);

      },
      error: err => {
        // this.isSignUpFailed = true;
        // console.log(this.signupForm);
        // if (err.errors === 'AliasAndEmailAreTaken') {

        //   this.errorMessage = 'This alias and email exist already.';
        // } else if (err.errors === 'AliasIsTaken') {
        //     this.errorMessage = 'This alias exists already. Please choose another one.';
        // } else if (err.errors === 'EmailIsTaken') {
        //     this.errorMessage = 'This email exists already. Please choose another one.';
        // } else {
        //   console.log(err);
        //   this.errorMessage = 'Something went wrong. Please try again later.';
        // }


        // AMI EDDIG VOLT ITT:
        // setTimeout(() => {
        this.isSignUpFailed = true;
        this.userSubscription = this.userService.getAllUsers().subscribe((users: UserGetItem[]) => {
          for (let i = 0; i < users.length; i++) {
          if (users[i].alias === this.signupForm.value.alias) {
            this.aliasExists = true;
              // this.errorMessage.push('alias');
          }
          if(users[i].userEmail === this.signupForm.value.email) {
            this.emailExists = true;
            // this.errorMessage.push(' and email')
          }
          }
        if(this.aliasExists && this.emailExists) {
          this.errorMessage = 'This alias and email exist already.';
        } else if(this.aliasExists) {
          this.errorMessage = 'This alias exists already. Please choose another one.';
        } else if(this.emailExists) {
          this.errorMessage = 'This email exists already. Please choose another one.';
        } else {
            this.errorMessage = 'Something went wrong. Please try again later.';
        }
        // this.signupSubscription.unsubscribe();
        console.log(err);
        console.log(this.signupForm);
      });
        // }, 1000);
        this.aliasExists = false;
        this.emailExists = false;
      }});


    }



        // EDDIG


        // this.isSignUpFailed = true;
        // const allUsers = this.userService.getAllUsers();
        // if(allUsers.indexOf(this.signupForm.value.alias))
        // this.userSubscription = this.userService.getAllUsers().subscribe((users: UserGetItem[]) => {
        //   for (let i = 0; i < users.length; i++) {
            // if(users[i].alias === this.signupForm.value.alias && users[i].user_email === this.signupForm.value.email) {
            //   this.errorMessage = 'This alias and email exist already';
            // } else

            //  if (users[i].alias === this.signupForm.value.alias) {
            //   this.errorMessage = 'This alias exists already. Please choose another one.';
            // } else if(users[i].user_email === this.signupForm.value.email) {
            //   this.errorMessage = 'This email exists already. Please choose another one.';
            // } else {
            //   this.errorMessage = 'Something went wrong. Please try again later.';
            // }

          //   if (users[i].alias === this.signupForm.value.alias) {
          //     this.aliasExists = true;
          //       // this.errorMessage.push('alias');
          //   }
          //   if(users[i].user_email === this.signupForm.value.email) {
          //     this.emailExists = true;
          //     // this.errorMessage.push(' and email')
          //   }
          // }

          // if(this.aliasExists && this.emailExists) {
          //   this.errorMessage = 'This alias and email exist already.';
          // } else if(this.aliasExists) {
          //   this.errorMessage = 'This alias exists already. Please choose another one.';
          // } else if(this.emailExists) {
          //   this.errorMessage = 'This email exists already. Please choose another one.';
          // } else {
          //     this.errorMessage = 'Something went wrong. Please try again later.';
          // }
          // if(use.indexOf(this.signupForm.value.alias) !== -1) {
          //   this.errorMessage = 'This alias already exists. Please choose another one.';
          //   // return this.errorMessage;
          // } else if(users.indexOf(this.signupForm.value.email) !== -1) {
          //   this.errorMessage = 'This email already exists. Please choose another one.';
          //   // return this.errorMessage;
          // } else {
            // this.errorMessage = err.error.message;

            // this.signupSubscription.unsubscribe();
    //       }
    //     );



  ngOnDestroy() {
    this.signupSubscription.unsubscribe();
    this.userSubscription?.unsubscribe();
    // if(this.userSubscription instanceof Subscriber) {
    //   this.userSubscription.unsubscribe();
    // } //WORKS ALSO.
  }
}
