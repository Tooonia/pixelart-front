import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PixelartService } from '../../../core/services/pixelart.service';
import { PixelartItem } from '../../model/pixelart-item';

/**
 * Class responsible to call pixelart service and get all pixelart items
 */

@Component({
  selector: 'app-list-container',
  templateUrl: './list-container.component.html',
  styleUrls: ['./list-container.component.scss']
})
export class ListContainerComponent implements OnInit {
  // IMPORTANT: it seems @Input() and @Output() declarations needs to be added before properties.
  // @Output() pixelartItemSelected = new EventEmitter<PixelartItem>(); //n°118 szerint
  pixelartItemsList: PixelartItem[] | undefined;

  // pixelartItem: PixelartItem | undefined;


  constructor(
    private pixelartService: PixelartService,
    // private route: ActivatedRoute,
    // private router: Router

  ) { }

  ngOnInit(): void {
    this.pixelartService.findAll().subscribe((data: PixelartItem[]) => {
      this.pixelartItemsList = data;
    },
    error => {
      console.log(error);
    })
  }

  // onSelectedPixelart(pixelartItem : PixelartItem) {
  //   this.pixelartItemSelected.emit(pixelartItem);
  // }

}
