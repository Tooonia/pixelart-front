import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PixelartService } from 'src/app/core/services/pixelart.service';
import { PixelartItem } from '../../model/pixelart-item';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  // This declaration is not necessary for displyaing the list inside that class, all is done within list-container:
  // pixelartItems: PixelartItem[] | undefined;
  public pixelartItemToCreate!: PixelartItem;
  public pixelartItem!: PixelartItem;

  constructor(
    private router: Router,
    private pixelartService: PixelartService
  ) { }

  ngOnInit(): void {
    // NO NEED to repeat this call here, list-container.ts handles it!
    // this.pixelartService.findAll().subscribe(
    //   pixelartItems => this.pixelartItems = pixelartItems
    // )
  }
  public closeCreateNewPixelart(): void {
    this.router.navigate(['/pixelart/catalog'])
  }

  public onCancelGoBackToCatalog(): void {
    this.router.navigate(['/pixelart/catalog'])
  }

  // public onSaveCreatePixelart(createdPixelartItem: PixelartItem): void {
  //   console.log("Received new pixelartItem: ", createdPixelartItem);
  //   // createdPixelartItem.id = this.pixelartItemToCreate.id;
  //   // createdPixelartItem.name = this.pixelartItemToCreate.name;
  //   this.pixelartService.add(createdPixelartItem).subscribe(() => {
  //     this.router.navigate(['/pixelart/catalog'])
  //   })
  // }

  // public createPixelart(): void {
  //   this.router.navigate(['/pixelart/create-pixelart'])
  // }

}
