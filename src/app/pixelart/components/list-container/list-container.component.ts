import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PixelartService } from '../../../core/services/pixelart.service';
import { PixelartItem } from '../../model/pixelart-item';
import { Subscription } from 'rxjs';

/**
 * Class responsible to call pixelart service and get all pixelart items
 */

@Component({
  selector: 'app-list-container',
  templateUrl: './list-container.component.html',
  styleUrls: ['./list-container.component.scss']
})
export class ListContainerComponent implements OnInit, OnDestroy {
  // IMPORTANT: it seems @Input() and @Output() declarations needs to be added before properties.
  // @Output() pixelartItemSelected = new EventEmitter<PixelartItem>(); //n°118 szerint
  pixelartItemsList: PixelartItem[] | undefined;
  subscriptionToList!: Subscription;

  // pixelartItem: PixelartItem | undefined;


  constructor(
    private pixelartService: PixelartService,
    // private route: ActivatedRoute,
    // private router: Router

  ) { }

  ngOnInit(): void {
    this.subscriptionToList = this.pixelartService.findAll().subscribe((data: PixelartItem[]) => {
      this.pixelartItemsList = data;
      console.log('inside list-container ngOnInit: ' + data); // THIS IS object Object also, for all in console, but OK in Preview in Network tab!?
    },
    error => {
      console.log(error);
    })

    // this.pixelartService.findAll().pipe(
    //   map((data: PixelartItem[]) => {
    //     // return data;
    //     this.pixelartItemsList = data;
    //     return this.pixelartItemsList;// NEM MUKODIK EZ AZ EGESZ!
    //   })
  }

  onViewDetail(index: number) {
    this.pixelartService.pixelartClickedForDetail.next(index);
  }
  // onSelectedPixelart(pixelartItem : PixelartItem) {
  //   this.pixelartItemSelected.emit(pixelartItem);
  // }

  ngOnDestroy(): void {
    this.subscriptionToList.unsubscribe();
  }
}
