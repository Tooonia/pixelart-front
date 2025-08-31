import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PixelartService } from 'src/app/core/services/pixelart.service';
import { PixelartRequestItem } from '../../model/pixelart-request-item';

//TODO: Normally, this will be our home.component.
// In any case: when Save button is clicked, it should ask to login if not yet!!! And after that login
// the browser should go back to that pixelart to save, and NOT to /my-profile as at initial login from Login button.

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  public pixelartItemToCreate: PixelartRequestItem = {
    'name': '',
    'width': 0,
    'height': 0,
    'canvas': ([])
  };
  content?: string;

  isSignedin = false;

	signedinUser: string = '';

  constructor(
    private pixelartService: PixelartService,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  public closeCreateNewPixelart(): void {
    this.router.navigate(['/pixelart/catalog'])
  }

  public onCancelGoBackToCatalog(): void {
    this.router.navigate(['/pixelart/catalog'])
  }

  // TODO: in the argument of the method, it should be (event : Event) if we have that in .html
  public onSaveCreatePixelart(createdPixelartItem: PixelartRequestItem): void {
    console.log("Received new pixelartItem: ", createdPixelartItem);
    // TODO: needs a user message to pop out: You have to be signed in!
    // Ideal process: when Save button clicked, and user is not signed in, navigating to Signin, where user
    // can also process Signup, and the once loged in, the program goes back to the pixelart to be saved, so
    // at the process of the creation. Changes are saved in the browser (?)
    this.pixelartItemToCreate = createdPixelartItem;
    this.pixelartService.add(this.pixelartItemToCreate).subscribe(() =>
          this.router.navigate(['/pixelart/catalog'])
       );}
}
