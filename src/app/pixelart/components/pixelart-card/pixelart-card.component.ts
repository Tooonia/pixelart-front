import { Component, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import * as EventEmitter from 'events'; DOES NOT WORK WITH THIS IMPORT!!!
import { PixelartService } from 'src/app/core/services/pixelart.service';
import { PixelartItem } from '../../model/pixelart-item';

@Component({
  selector: 'app-pixelart-card',
  templateUrl: './pixelart-card.component.html',
  styleUrls: ['./pixelart-card.component.scss']
})
export class PixelartCardComponent implements OnInit {
  // TODO: see why does it work with "!" definite assignment assertion,
  // and not with "undefined" added:
  // @Input() pixelartItem: PixelartItem | undefined;
  @ViewChild('myCanvas', {static: true}) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasDiv', {static: true}) containerDivForCanvas!: ElementRef;
  @Input() pixelartItem!: PixelartItem;
  @Input() index!: number;
  // @Output() selectedPixelartItem = new EventEmitter<void>(); //n°118: no need for that
  // @Output() pixelartItemDetailClick = new EventEmitter<PixelartSimpleItem>();
  context!: CanvasRenderingContext2D | null; //Without "| null" there was an error:
  scaleToSize!: number;
  imageData!: ImageData;

  constructor(
    // GET pixelart by id on '/pixelart/id' works without these 2:
    private pixelartService: PixelartService,
    // private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2
  ) { }

  // TODO: Est-ce qu'il doit être dans ngOnInit?
  // TODO: Comme doublon ici et et dans detail.component pour les méthodes déclarations?
  ngOnInit(): void {
    // this.id = this.route.snapshot.params.id;
    // this.pixelartService.getById(this.id).subscribe(data => {
    //   this.pixelartItem = data;
    // });
    if (this.canvas.nativeElement.getContext('2d') !== null) {
      this.context = this.canvas.nativeElement.getContext('2d');
    }
    this.canvas.nativeElement.width = this.pixelartItem.width; // TODO: vagy: this.manageCanvasForm.value.width, as fentebb kijelolve!
      this.canvas.nativeElement.height = this.pixelartItem.height;

      this.scaleToSize =
      (this.canvas.nativeElement.width >= this.canvas.nativeElement.height ?
      Math.floor(380/this.canvas.nativeElement.width) :
      Math.floor(380/this.canvas.nativeElement.height));

      this.renderer.setStyle(this.canvas.nativeElement, 'transform', `scale(${ this.scaleToSize })`); // Can have incorrect CSS values applied to them.

      this.imageData = new ImageData(this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      for (let i = 0; i < this.imageData.data.length; i += 1) {
        console.log('data.length az onValidateCanvasban: ' + this.imageData.data.length);
        if (this.pixelartItem.canvas[i] <= 255 && this.pixelartItem.canvas[i] >= 0) {
          this.imageData.data[i] = this.pixelartItem.canvas[i];
        }
        // this.imageData.data.length === this.pixelartItem.pixels.length &&

        if (this.context) {
          this.context.putImageData(this.imageData, 0, 0);
        }

    }
  }

  // Here to prepare: select() and / or goToDetail()
  goToDetail(index: number): void { //TODO: itt elvileg nem lehetne /void, ha even-et adok meg parameterben, nem?
    if(this.pixelartItem.id) {
      this.index = index;
      // this.selectedPixelartItem.emit();
      // this.pixelartItem =
      // this.pixelartService.pixelartSelected.emit(this.pixelartItem);
      this.router.navigate(['/pixelart/' + this.pixelartItem.id])
  }
  }
}
