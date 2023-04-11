import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { PixelartService } from 'src/app/core/services/pixelart.service';
import { UserService } from 'src/app/core/services/user.service';
import { PixelartItem } from 'src/app/pixelart/model/pixelart-item';
import { UserGetItem } from 'src/app/pixelart/model/user-get-item';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  isSignedin = false;
  signedinUser! : UserGetItem;
  // signedinUser! : UserPrivateItemModel;

  private basePath = 'http://localhost:8085/api';

	constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService,
    private pixelartService: PixelartService) {}

	ngOnInit() {
		this.isSignedin = this.authService.isUserSignedin();
    if(!this.authService.isUserSignedin()) {
			this.router.navigateByUrl('/signin');
		}
		// this.signedinUserEmail = this.authService.getSignedinUser();
    // this.signedinUser = this.authService.getUserInfo();

    // this.userService.getPrivateUserProfile();

    // this.signedinUser = this.userService.getPrivateUserProfile();

    //3rd solution with models!!! Works.
    // Volt egyy error:az alias-ra azt mondja, h "can not read properties of undefined (reading alias)"
    // Mikor beirtam egy ?-et a signedInUser moge, eltunt. TODO: atnezni!!!
      this.userService.getPrivateUserProfile().subscribe(data => {
        this.signedinUser = data;

        console.log(this.signedinUser.pixelarts);//TODO: Wrong print out in console: pixelarts do not have user property!!!
        // console.log(this.signedinUser.id);
        console.log(this.signedinUser);
        // console.log(this.signedinUser.user_email);
      }  )
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


  // 1st solution-hoz
  // currentUser: any;
  // constructor(private token: TokenStorageService) { }
  // ngOnInit(): void {
  //   // this.currentUser = this.token.getUser();
  // }

}
