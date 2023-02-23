import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { PixelartItem } from 'src/app/pixelart/model/pixelart-item';
import { PixelartItemModel } from 'src/app/pixelart/model/pixelart-item-model';
import { UserItem } from 'src/app/pixelart/model/user-item';
import { UserPrivateItem } from 'src/app/pixelart/model/user-private-item';
import { UserPrivateModel } from 'src/app/pixelart/model/user-private-model';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  @Input() idUser!: number; //TODO ???
  isSignedin = false;

	signedinUserEmail: string = '';
  // @Input() signedinUser!: UserPrivateItem;
  // pixelarts! : PixelartItem[];
  // @Input() signedinUser!: UserPrivateModel;
  pixelarts! : PixelartItemModel[];
  signedinUser! : UserPrivateModel;

	greeting: any[] = [];

  private basePath = 'http://localhost:8085/api';

	constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService) {}

	ngOnInit() {
		this.isSignedin = this.authService.isUserSignedin();
    if(!this.authService.isUserSignedin()) {
			this.router.navigateByUrl('/signin');
		}
		// this.signedinUserEmail = this.authService.getSignedinUser();
    // this.signedinUser = this.authService.getUserInfo();

    // this.userService.getPrivateUserProfile();

    // this.signedinUser = this.userService.getPrivateUserProfile();

    //2nd solution: with this, current user data is loged out in console!!!
    //TODO: this works! But buhera!!! Es inkabb a user.service.ts-ben kellene ezt csinalni!
    // this.userService.getPrivateUserProfile().subscribe(data => {
    //   this.signedinUser = data;
    //   this.signedinUser.id = data.id;
    //   this.signedinUser.alias = data.alias;
    //   this.signedinUser.user_email = data.user_email;
    //   this.signedinUser.pixelarts = data.pixelarts;


    //   console.log(data);
    //   console.log(this.signedinUser.id);
    //   console.log(this.signedinUser);
    //   console.log(this.signedinUser.user_email);//undefined ???
    //   //Plusz: az alias-ra azt mondja, h "can not read properties of undefined (reading alias)"

    // });

    //3rd solution with models!!! Works.
    // Volt egyy error:az alias-ra azt mondja, h "can not read properties of undefined (reading alias)"
    // Mikor beirtam egy ?-et a signedInUser moge, eltunt. TODO: atnezni!!!
      this.userService.getPrivateUserProfile().subscribe(data => {

      this.signedinUser = data;

      console.log(this.signedinUser.id);
      console.log(this.signedinUser);
      console.log(this.signedinUser.user_email);
      // console.log(this.signedinUser.pixelarts[1].name);
      }  )



		// if(this.isSignedin) {
		// 	this.greetingService.getByUserRole().subscribe((result: string) => this.greeting.push(result), () => console.log('/user - You are not authorize'));
		// 	this.greetingService.getByAdminRole().subscribe((result: string) => this.greeting.push(result), () => console.log('/admin - You are not authorized'));
		// 	this.greetingService.getByUserOrAdminRole().subscribe((result: string) => this.greeting.push(result), () => console.log('/userOrAdmin - You are not authorized'));
		// 	this.greetingService.getByAnonymousRole().subscribe((result: string) => this.greeting.push(result), () => console.log('/anonymous - You are not authorized'));
		// }
	}

  signout(): void {
    this.authService.signOut();
    window.location.reload();

  }
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
