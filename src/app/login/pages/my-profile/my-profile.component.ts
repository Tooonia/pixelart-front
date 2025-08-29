import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { UserGetItem } from 'src/app/pixelart/model/user-get-item';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  isSignedin = false;
  signedinUser! : UserGetItem;

	constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService) {}

	ngOnInit() {
		this.isSignedin = this.authService.isUserSignedin();
    if(!this.authService.isUserSignedin()) {
			this.router.navigateByUrl('/signin');
		}

    this.userService.getPrivateUserProfile().subscribe(data => {
      this.signedinUser = data;
      console.log(this.signedinUser.pixelarts); //TODO: Wrong print out in console: pixelarts do not have user property!!!
      console.log(this.signedinUser);
    })
	}

  goToMyPortfolio() : void {
    this.router.navigate(['/pixelart/my-pixelart'])
  }

  // TODO: egyelore nem hasznalom!
  // signout(): void {
  //   this.authService.signOut();
  //   window.location.reload();

  // }

  // deleteAccount(idUser: number): void {
  //   // idUser = 25;
  //   this.userService.deleteAccount(idUser).subscribe((resp) => {
  //     console.log("Delete OK: ", resp)
  //   });
  //   this.authService.signout();
  //   // window.location.reload();
  //   // this.router.navigate(['/pixelart/catalog'])
  // }
}
