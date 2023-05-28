import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PixelartService } from 'src/app/core/services/pixelart.service';
import { PixelartItem } from '../../model/pixelart-item';


// Error message: "mat-form-field must contain a MatFormFieldControl"!!!
// Normally solved with correct import!

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  public pixelartItemToUpdate!: PixelartItem;

  constructor(
    private pixelartService: PixelartService,
    private route: ActivatedRoute,
    private router: Router
  ) {

   }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const pixelartItemId = Number(params.get('id'));
      console.log('Inside update.ts ngOnInit: ' + pixelartItemId);
      this.pixelartService.getById(pixelartItemId).subscribe((pixelartItem: PixelartItem) => {
        this.pixelartItemToUpdate = pixelartItem;
      })
    })
  }

  public onSaveUpdatePixelart(modifiedPixelartItem: PixelartItem): void {
    console.log(modifiedPixelartItem);
    console.log(this.pixelartItemToUpdate.id);
    // On vient de rajouter l'id dans le payload/dans le body de la requête:
    modifiedPixelartItem.id = this.pixelartItemToUpdate.id;
    this.pixelartService.update(modifiedPixelartItem).subscribe(() => {
      this.router.navigate(['pixelart', modifiedPixelartItem.id])
    })
  }

  public onCancelGoBackToDetails(): void {
    this.router.navigate(['/pixelart/' + this.pixelartItemToUpdate.id])
  }

  public closePixelartEditDetails(): void {
    this.router.navigate(['/pixelart/' + this.pixelartItemToUpdate.id])
  }

}
