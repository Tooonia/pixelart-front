import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PixelartService } from 'src/app/core/services/pixelart.service';
import { UserService } from 'src/app/core/services/user.service';
import { PixelartItem } from '../../model/pixelart-item';
import { PixelartModel } from '../../model/pixelart-model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  // public pixelartItemToCreate = new PixelartItem();
  public pixelartItemToCreate!: PixelartItem;
  public newPixelartModel = new PixelartModel();
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

  public onSaveCreatePixelart(createdPixelartModel: PixelartModel): void {
    console.log("Received new pixelartItem: ", createdPixelartModel);
  
    this.pixelartService.add(createdPixelartModel).subscribe(() => {
      // TODO: The catalog should be updated/refreshed!!!
      this.router.navigate(['/pixelart/catalog'])
    })
  }


  // TODO: This is the part without the PixelartModel, but with the interface PixelartItem:
  
  // public onSaveCreatePixelart(createdPixelartItem: PixelartItem): void {
  //   console.log("Received new pixelartItem: ", createdPixelartItem);
  //   this.pixelartService.add(createdPixelartItem).subscribe(() => {
  //     this.router.navigate(['/pixelart/catalog'])
  //   })
  // }
  // public onSaveCreatePixelart(designedPixelartItem: PixelartItem): void {
  //   console.log("Received new pixelartItem: ", designedPixelartItem);
  //   this.pixelartService.add(designedPixelartItem).subscribe(() => {
  //     this.router.navigate(['/pixelart/catalog'])
  //   })
  // }

  

}
