import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PixelartService } from 'src/app/core/services/pixelart.service';
import { UserService } from 'src/app/core/services/user.service';
import { PixelartItem } from '../../model/pixelart-item';
import { PixelartSimpleItem } from '../../model/pixelart-simple-item';

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
  public pixelartItemToCreate!: PixelartSimpleItem;
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

  // TODO: in the argument of the method, it should be (event : Event) if we have that in .html
  public onSaveCreatePixelart(createdPixelartItem: PixelartSimpleItem): void {
    console.log("Received new pixelartItem: ", createdPixelartItem);
    // TODO: needs a user message to pop out: You have to be signed in!
    // Ideal process: when Save button clicked, and user is not signed in, navigating to Signin, where user
    // can also process Signup, and the once loged in, the program goes back to the pixelart to be saved, so
    // at the process of the creation. Changes are saved in the browser (?)
    // this.pixelartItemToCreate = createdPixelartItem; //TODO: nem koherens az update method-dal! Mit veszek a method-ba add()-hez?
    this.pixelartItemToCreate.name = createdPixelartItem.name;
    this.pixelartItemToCreate.width = createdPixelartItem.width;
    this.pixelartItemToCreate.height = createdPixelartItem.height;
    this.pixelartItemToCreate.canvas = createdPixelartItem.canvas;
    this.pixelartService.add(this.pixelartItemToCreate).subscribe(() => {
      // When navigating, the catalog is shown as updated
      this.router.navigate(['/pixelart/catalog'])
    })

    // PROBA:
    // this.pixelartService.add(this.pixelartItemToCreate).subscribe({
    //   next: data => {
    //     setTimeout(() => {
    //       this.router.navigate(['/pixelart/catalog']);
    //     }, 2000);
    //   }
    // })
  }
}
