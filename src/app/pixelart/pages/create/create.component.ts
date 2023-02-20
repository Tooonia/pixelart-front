import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PixelartService } from 'src/app/core/services/pixelart.service';
import { UserService } from 'src/app/core/services/user.service';
import { PixelartItem } from '../../model/pixelart-item';
import { PixelartModel } from '../../model/pixelart-model';

//TODO: Normally, this will be our home.component.
// In any case: when Save button is clicked, it should ask to login if not yet!!! And after that login
// the browser should go back to that pixelart to save, and NOT to /my-profile as at initial login from Login button.

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  // public pixelartItemToCreate = new PixelartItem();
  // public pixelartItem!: PixelartItem;
  public pixelartItemToCreate!: PixelartItem;
  // public newPixelartModel = new PixelartModel();
  // public pixelartItemToCreate = new PixelartcreateModel();
  // newPixelartModel = {} as PixelartModel;
  content?: string;

  isSignedin = false;

	signedinUser: string = '';

  constructor(
    private pixelartService: PixelartService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private http: HttpClient

  ) { }

  ngOnInit(): void {
    // this.isSignedin = this.tokenStorageService.isUserSignedin();
		// this.signedinUser = this.tokenStorageService.getUser();

		// if(!this.tokenStorageService.isUserSignedin()) {
		// 	this.router.navigateByUrl('/signin');
		// }


			// this.router.navigateByUrl('/pixelart/create-pixelart');

  }

  public closeCreateNewPixelart(): void {
    this.router.navigate(['/pixelart/catalog'])
  }

  public onCancelGoBackToCatalog(): void {
    this.router.navigate(['/pixelart/catalog'])
  }

  public onSaveCreatePixelart(createdPixelartItem: PixelartItem): void {
    console.log("Received new pixelartItem: ", createdPixelartItem);
    // TODO: needs a user message to pop out: You have to be signed in!
    // Ideal process: when Save button clicked, and user is not signed in, navigating to Signin, where user
    // can also process Signup, and the once loged in, the program goes back to the pixelart to be saved, so
    // at the process of the creation. Changes are saved in the browser (?)
    this.pixelartService.add(createdPixelartItem).subscribe(() => {
      // When navigating, the catalog is shown as updated
      this.router.navigate(['/pixelart/catalog'])
    })
  }
}
