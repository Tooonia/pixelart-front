import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PixelartService } from 'src/app/core/services/pixelart.service';
import { PixelartItem } from '../../model/pixelart-item';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  // public pixelartItemToCreate = new PixelartItem();
  public pixelartItemToCreate!: PixelartItem;

  constructor(
    private pixelartService: PixelartService,
    private route: ActivatedRoute,
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

  public onSaveCreatePixelart(createdPixelartItem: PixelartItem): void {
    console.log("Received new pixelartItem: ", createdPixelartItem);
    this.pixelartService.add(createdPixelartItem).subscribe(() => {
      this.router.navigate(['/pixelart/catalog'])
    })
  }
  // public onSaveCreatePixelart(designedPixelartItem: PixelartItem): void {
  //   console.log("Received new pixelartItem: ", designedPixelartItem);
  //   this.pixelartService.add(designedPixelartItem).subscribe(() => {
  //     this.router.navigate(['/pixelart/catalog'])
  //   })
  // }

}
