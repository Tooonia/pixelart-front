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

  constructor(
    // These declarations are not necessary for displyaing the list inside that class, all is done within list-container:
    // private router: Router,
    // private pixelartService: PixelartService
  ) { }

  ngOnInit(): void {
    // NO NEED to repeat this call here, list-container.ts handles it!
    // this.pixelartService.findAll().subscribe(
    //   pixelartItems => this.pixelartItems = pixelartItems
    // )
  }

}
