import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { PixelartService } from 'src/app/core/services/pixelart.service';
import { UserService } from 'src/app/core/services/user.service';
import { PixelartItem } from '../../model/pixelart-item';
import { PixelartSimpleItem } from '../../model/pixelart-simple-item';
import { UserGetItem } from '../../model/user-get-item';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  isSignedin = false;
	signedinUserEmail: string = '';
  // @Input() signedinUser!: UserGetItem;
  // pixelarts! : PixelartItem[];
  // @Input() signedinUser!: UserPrivateItemModel;
  // pixelarts! : PixelartItemModel[];
  pixelarts! : PixelartItem[];
  @Input() pixelartItem!: PixelartSimpleItem;
  // signedinUser! : UserPrivateItemModel;
  signedinUser!: UserGetItem;

  constructor(
     private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService,
    private pixelartService: PixelartService
  ) { }

  ngOnInit(): void {
    this.isSignedin = this.authService.isUserSignedin();
    if(!this.authService.isUserSignedin()) {
			this.router.navigateByUrl('/signin');
		}
    // 2nd solution: with this, current user data is written correctly in console!!!
    // TODO: this works! But buhera!!! Es inkabb a user.service.ts-ben kellene ezt csinalni!
    // this.userService.getPrivateUserProfile().subscribe(data => {
    //   this.signedinUser = data;
    //   this.signedinUser.id = data.id;
    //   this.signedinUser.alias = data.alias;
    //   this.signedinUser.user_email = data.user_email;
    //   this.signedinUser.pixelarts = data.pixelarts;
    //   this.pixelarts = this.signedinUser.pixelarts;

    //   console.log(data);
    //   console.log(this.signedinUser.id);
    //   console.log(this.signedinUser);
    //   console.log(this.signedinUser.user_email);//undefined ???
    //   //Plusz: az alias-ra azt mondja, h "can not read properties of undefined (reading alias)"
    //   console.log(this.pixelarts);
    // });

    //3rd solution with models!!! Works.
    // Volt egyy error:az alias-ra azt mondja, h "can not read properties of undefined (reading alias)"
    // Mikor beirtam egy ?-et a signedInUser moge, eltunt. TODO: atnezni!!!
      this.userService.getPrivateUserProfile().subscribe(data => {
        this.signedinUser = data;
        this.pixelartService.getAllPixelArtByUser(this.signedinUser.id).subscribe((data: PixelartItem[]) => {
          this.pixelarts = data;
          console.log(this.pixelarts);
      })
      // console.log(this.pixelarts);
      // console.log(this.signedinUser.id);
      // console.log(this.signedinUser);
      // console.log(this.signedinUser.user_email);
      // // console.log(this.signedinUser.pixelarts[1].name);
      })
  }
}
