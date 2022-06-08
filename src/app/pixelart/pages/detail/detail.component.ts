import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PixelartService } from 'src/app/core/services/pixelart.service';
import { PixelartItem } from '../../model/pixelart-item';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  // TODO: works with or without @Input() when used with get pixelartName method. Why?:
  //  @Input() private pixelartItem!: PixelartItem;
    // pixelartItem!: PixelartItem;
    @Input() pixelartItem!: PixelartItem;
    pixelartItemsList!: PixelartItem[];
  // private _pixelartItem!: PixelartItem;

  constructor(
    private pixelartService : PixelartService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
  
    this.pixelartService.getById(this.route.snapshot.params.id).subscribe(data => {
       this.pixelartItem = data;
      //  console.log(this.pixelartItem)
      });

  }

  // TODO: if I declare pixelartItem "private", then it only works with this following get method, otherwise this error message:
  // Property 'pixelartItem' is private and only accessible within class 'DetailComponent'.
  // QUESTON: better to use "private" for pixelartItem and this method,
  // or the usual "pixelartItem.name"?
  //    get pixelartItemName(): String {
  //       console.log(this.pixelartItem.name);
  //       return this.pixelartItem.name as String;
  //  }

  closePixelartDetails(): void {
    // TODO: see navigation history eventually instead : route-history.service.ts
    // For now, it is not smooth enough, when window changes
    this.router.navigate(['/pixelart/catalog'])
  }

  // When adding that route, it is needed to be added of course to pixelart-routing.module.ts too:
  editPixelart(pixelartItem: PixelartItem): void {
    this.router.navigate(['/pixelart/edit-pixelart', pixelartItem.id])
  }

  deletePixelart(pixelartItem: PixelartItem): void {
    console.log(pixelartItem.id);
    this.pixelartService.deleteById(pixelartItem.id).subscribe((resp) => {
      console.log("Delete OK: ", resp);
    });
// TODO Itt kellene lehet az a tab(), hogy tovabbi dolgokat csinalhassunk sans toucher à l'élément à voir?
// TODO vagy valahogy egy blokkba tenni ezt a ket subscribe dolgot?
// TODO This is supposed to be in the service.ts, with the delete() method, the refreshcollection part!
    this.pixelartService.findAll().subscribe((data: PixelartItem[]) => {
      this.pixelartItemsList = data;
      this.router.navigate(['/pixelart/catalog'])
    },
    error => {
      console.log(error);
    })

    
  }

}
