import { Component, Input, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { PixelartService } from 'src/app/core/services/pixelart.service';
import { PixelartItem } from '../../model/pixelart-item';
import { CanvasService } from 'src/app/core/services/canvas.service';

@Component({
  selector: 'app-pixelart-card',
  templateUrl: './pixelart-card.component.html',
  styleUrls: ['./pixelart-card.component.scss']
})
export class PixelartCardComponent implements OnInit, AfterViewInit, OnDestroy {
  // TODO: see why does it work with "!" definite assignment assertion,
  // and not with "undefined" added:
  // @Input() pixelartItem: PixelartItem | undefined;
  @ViewChild('myCanvas', {static: true}) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasDiv', {static: true}) containerDivForCanvas!: ElementRef;
  @Input() pixelartItem!: PixelartItem;
  @Input() index!: number;

  context!: CanvasRenderingContext2D | null; //Without "| null" there was an error:
  scaleToSize!: number;
  private canvasCleanup?: () => void;
  imageData!: ImageData;

  constructor(
    // GET pixelart by id on '/pixelart/id' works without these 2:
    private pixelartService: PixelartService,
    private router: Router,
    private renderer: Renderer2,
    private canvasService: CanvasService
  ) { }

  // TODO: Est-ce qu'il doit être dans ngOnInit?
  // TODO: Comme doublon ici et et dans detail.component pour les méthodes déclarations?
  ngOnInit(): void {
    // Canvas rendering happens in ngAfterViewInit
  }

  ngAfterViewInit(): void {
    // Wait for DOM to be fully ready before rendering
    setTimeout(() => {
      this.renderCanvas();
    }, 0);
  }

  /**
   * Render the canvas using Canvas Service, with auto-resize enabled
   */

  private renderCanvas(): void {
    // Use Canvas Service with AUTO-RESIZE enabled
    const result = this.canvasService.setupCanvas(
      this.canvas.nativeElement,
      {
        width: this.pixelartItem.width,
        height: this.pixelartItem.height,
        containerElement: this.containerDivForCanvas.nativeElement,
        pixelData: this.pixelartItem.canvas,
        enableAutoResize: true
      }
    );

    // Store results
    this.scaleToSize = result.scale;
    this.context = result.context;

    // Store cleanup function
    if (result.cleanup) {
      this.canvasCleanup = result.cleanup;
    }
  }

  // Here to prepare: select() and / or goToDetail()
  /**
   * Navigate to detail view
   */
  goToDetail(index: number): void { //TODO: itt elvileg nem lehetne /void, ha even-et adok meg parameterben, nem?
    if(this.pixelartItem.id) {
      this.index = index;
      this.router.navigate(['/pixelart/' + this.pixelartItem.id])
    }
  }

  ngOnDestroy(): void {
    // Clean up auto-resize observer
    if (this.canvasCleanup) {
      this.canvasCleanup();
    }
  }
}
