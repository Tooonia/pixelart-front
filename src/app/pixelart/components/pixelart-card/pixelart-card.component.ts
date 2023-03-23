import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import * as EventEmitter from 'events'; DOES NOT WORK WITH THIS IMPORT!!!
import { PixelartService } from 'src/app/core/services/pixelart.service';
import { PixelartItem } from '../../model/pixelart-item';
import { PixelartSimpleItem } from '../../model/pixelart-simple-item';

@Component({
  selector: 'app-pixelart-card',
  templateUrl: './pixelart-card.component.html',
  styleUrls: ['./pixelart-card.component.scss']
})
export class PixelartCardComponent implements OnInit {
  // TODO: see why does it work with "!" definite assignment assertion,
  // and not with "undefined" added:
  // @Input() pixelartItem: PixelartItem | undefined;
  @Input() pixelartItem!: PixelartSimpleItem;
  @Output() selectedPixelartItem = new EventEmitter<void>();
  // @Output() pixelartItemDetailClick = new EventEmitter<PixelartSimpleItem>();

  constructor(
    // GET pixelart by id on '/pixelart/id' works without these 2:
    // private pixelartService: PixelartService,
    // private route: ActivatedRoute,
    private router: Router
  ) { }

  // TODO: Est-ce qu'il doit être dans ngOnInit?
  // TODO: Comme doublon ici et et dans detail.component pour les méthodes déclarations?
  ngOnInit(): void {
    // this.id = this.route.snapshot.params.id;
    // this.pixelartService.getById(this.id).subscribe(data => {
    //   this.pixelartItem = data;
    // });
  }

  // Here to prepare: select() and / or goToDetail()
  goToDetail(): void { //TODO: itt elvileg nem lehetne /void, ha even-et adok meg parameterben, nem?
    if(this.pixelartItem.id) {
      this.selectedPixelartItem.emit();
      // this.pixelartItem =
      this.router.navigate(['/pixelart/' + this.pixelartItem.id])
  }
  }
}
