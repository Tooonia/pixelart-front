import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { PixelartItem } from '../../model/pixelart-item';
import { PixelartService } from 'src/app/core/services/pixelart.service';
import { map } from 'rxjs/operators';
import { Point } from '../../model/pixel-coordinates';
import { Pixel } from '../../model/pixel';
import { PixelartSimpleItem } from '../../model/pixelart-simple-item';
import { PixelartRequestItem } from '../../model/pixelart-request-item';
//TODO: documention to write for that class!!! Purpose of it?


@Component({
  selector: 'app-manage-pixelart',
  templateUrl: './manage-pixelart.component.html',
  styleUrls: ['./manage-pixelart.component.scss']
})
export class ManagePixelartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('myCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myPickedColor', { static: true }) pickedColor!: ElementRef;
  @ViewChild('pixelDrawingBlockContainer', { static: true }) containerDivForDrawingBlock!: ElementRef;
  @ViewChild('gridSizeSettingContainer', { static: true }) containerDivForGridSizeSetting!: ElementRef;
  @ViewChild('canvasDiv', { static: true }) containerDivForCanvas!: ElementRef;
  managePixelartForm!: UntypedFormGroup;
  manageCanvasForm!: UntypedFormGroup;
  @Input() pixelartSimpleItem!: PixelartSimpleItem;
  @Input() pixelarRequestItem!: PixelartRequestItem;
  @Output() savedAction = new EventEmitter<PixelartSimpleItem>();
  @Output() savedActionForCreate = new EventEmitter<PixelartRequestItem>();
  @Output() cancelledAction = new EventEmitter<PixelartSimpleItem>();
  editMode: boolean = false;
  gridValidationMode: boolean = true;
  id!: number;
  context!: CanvasRenderingContext2D | null;
  canvasHeight: number = 0;
  canvasWidth: number = 0;
  canvasColor: string = '';
  isBackgroundWhite: boolean = false;
  isBackgroundGrey: boolean = false;
  scaleToSize!: number;
  imageData!: ImageData;
  image!: HTMLImageElement;
  paint: boolean = false;
  clickedX: number[] = [];
  clickedY: number[] = [];
  mousePosition = new Point(-100, -100);
  pixelsClicked: Pixel[] = [];
  private resizeTimeout: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pixelartService: PixelartService,
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef
  ) { }

  // Test validity of form
  get isValid(): boolean {
    return this.managePixelartForm.valid;
  }

  ngOnInit(): void {
    this.managePixelartForm = new UntypedFormGroup({
      'name': new UntypedFormControl(''),
      'width': new UntypedFormControl(0),
      'height': new UntypedFormControl(0)
    });

    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        if (this.editMode) {
          this.pixelartService.getById(this.id).subscribe((data: PixelartItem) => {
            // this.pixelartService.getById(this.id).pipe(map((data: PixelartItem) => {
            this.pixelartSimpleItem.name = data.name;
            this.pixelartSimpleItem.width = data.width;
            this.pixelartSimpleItem.height = data.height;
            this.pixelartSimpleItem.canvas = data.canvas;

            // TODO: elvileg nem kell ide se az "id", se a "user".
            this.managePixelartForm.setValue({
              'name': this.pixelartSimpleItem.name,
              'width': this.pixelartSimpleItem.width,
              'height': this.pixelartSimpleItem.height
            });

            if (this.canvas.nativeElement.getContext('2d') !== null) {
              this.context = this.canvas.nativeElement.getContext('2d');

              this.onValidateCanvasSize();
            }

            this.renderer.setStyle(this.containerDivForDrawingBlock.nativeElement, 'display', 'block');
          })
        } else {
          this.renderer.setStyle(this.containerDivForDrawingBlock.nativeElement, 'display', 'none');
          this.gridValidationMode = true;
        }
      });
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
    if (this.canvas.nativeElement.getContext('2d', { willReadFrequently: true }) !== null) {
      this.context = this.canvas.nativeElement.getContext('2d');
      this.pixelarRequestItem = {
        'name': '',
        'width': 0,
        'height': 0,
        'canvas': ([])
      }
    }
  }

  addInteractions() {
    if (!this.canvas || !this.canvas.nativeElement) {
      console.error('Canvas not available');
      return;
    }

    console.log('Adding mouse and touch interactions');

    // ========== MOUSE EVENTS ==========
    this.renderer.listen(this.canvas.nativeElement, 'mousedown', (e: MouseEvent) => {
      e.preventDefault();
      this.paint = true;
      const point = this.getCanvasCoordinates(e);
      this.mousePosition = point;

      if (point.x >= 0 && point.y >= 0) {
        this.pixelsClicked.push(this.colorPixel(point));
      }
    });

    this.renderer.listen(this.canvas.nativeElement, 'mousemove', (e: MouseEvent) => {
      const point = this.getCanvasCoordinates(e);
      this.mousePosition = point; // Update display

      if (this.paint && point.x >= 0 && point.y >= 0) {
        this.pixelsClicked.push(this.colorPixel(point));
      }
    });

    this.renderer.listen(this.canvas.nativeElement, 'mouseup', () => {
      this.paint = false;
    });

    this.renderer.listen(this.canvas.nativeElement, 'mouseleave', () => {
      this.paint = false;
      this.mousePosition = new Point(-100, -100);
    });

    // ========== TOUCH EVENTS (Mobile Support) ==========
    this.renderer.listen(this.canvas.nativeElement, 'touchstart', (e: TouchEvent) => {
      e.preventDefault(); // Prevent page scroll
      this.paint = true;
      const point = this.getCanvasCoordinates(e);
      this.mousePosition = point;

      if (point.x >= 0 && point.y >= 0) {
        this.pixelsClicked.push(this.colorPixel(point));
      }
    });

    this.renderer.listen(this.canvas.nativeElement, 'touchmove', (e: TouchEvent) => {
      e.preventDefault(); // Prevent page scroll
      const point = this.getCanvasCoordinates(e);
      this.mousePosition = point;

      if (this.paint && point.x >= 0 && point.y >= 0) {
        this.pixelsClicked.push(this.colorPixel(point));
      }
    });

    this.renderer.listen(this.canvas.nativeElement, 'touchend', (e: TouchEvent) => {
      e.preventDefault();
      this.paint = false;
    });

    this.renderer.listen(this.canvas.nativeElement, 'touchcancel', (e: TouchEvent) => {
      e.preventDefault();
      this.paint = false;
      this.mousePosition = new Point(-100, -100);
    });

    console.log('All event listeners attached');
  }

  public saveAction(): void {
    if (this.managePixelartForm.valid) {
      if (this.context) {
        this.imageData = this.context.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
        console.log(this.imageData.data); //HURRAAA!!! Vegre megjelennek az ertekek!!!

        if (this.editMode) {
          this.pixelartSimpleItem.name = this.managePixelartForm.value.name;
          this.pixelartSimpleItem.width = this.managePixelartForm.value.width;
          this.pixelartSimpleItem.height = this.managePixelartForm.value.height;
          this.pixelartSimpleItem.canvas = Array.from(this.imageData.data);
          this.savedAction.emit(this.pixelartSimpleItem);
        } else {
          this.pixelarRequestItem.name = this.managePixelartForm.value.name;
          this.pixelarRequestItem.width = this.managePixelartForm.value.width;
          this.pixelarRequestItem.height = this.managePixelartForm.value.height;
          this.pixelarRequestItem.canvas = Array.from(this.imageData.data);
          this.savedActionForCreate.next(this.pixelarRequestItem);
        }
      }
    }
  }

  public cancelAction(): void {
    this.cancelledAction.emit(this.pixelartSimpleItem); //TODO: maybe no need to have an eventemitter<PixelItem> on that function?
  }

  onValidateCanvasSize() {
    // Set canvas actual pixel dimensions
    if (this.editMode) {
      this.canvas.nativeElement.width = this.pixelartSimpleItem.width;
      this.canvas.nativeElement.height = this.pixelartSimpleItem.height;
    } else {
      this.canvas.nativeElement.width = this.managePixelartForm.value.width;
      this.canvas.nativeElement.height = this.managePixelartForm.value.height;

      // Validate dimensions
      if (this.canvas.nativeElement.width < 1 || this.canvas.nativeElement.height < 1 || this.canvas.nativeElement.width > 128 || this.canvas.nativeElement.height > 128) {
        alert('Grid size must be between 1 and 128');
        return;
      }
      this.makeGrid(this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }

    this.renderer.setStyle(this.containerDivForDrawingBlock.nativeElement, 'display', 'block');
    this.gridValidationMode = false;

    // Use setTimeout to wait for DOM to update before measuring
    setTimeout(() => {
      this.calculateCanvasSize();
    }, 0);

    // Initialize canvas context
    if (this.canvas.nativeElement.getContext('2d') !== null) {
      this.context = this.canvas.nativeElement.getContext('2d');
      this.addInteractions();
    }

    // Load existing pixel art if in edit mode
    if (this.editMode) {
      this.imageData = new ImageData(this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      for (let i = 0; i < this.imageData.data.length; i += 1) {
        if (this.pixelartSimpleItem.canvas[i] <= 255 && this.pixelartSimpleItem.canvas[i] >= 0) {
          this.imageData.data[i] = this.pixelartSimpleItem.canvas[i];
        }

        if (this.context) {
          this.context.putImageData(this.imageData, 0, 0);
        }
      }
    } else {
      this.imageData = new ImageData(this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }
  }

    /**
   * Handle window resize - recalculate canvas display size
   * Uses debouncing to avoid too many calculations
   */
  @HostListener('window:resize', ['$event'])
  onWindowResize(event?: Event): void {
    // Only resize if canvas is visible and has been created
    if (!this.canvas ||
        !this.canvas.nativeElement ||
        this.gridValidationMode ||
        !this.canvas.nativeElement.width) {
      return;
    }

    // Clear previous timeout
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    // Debounce resize - wait 150ms after user stops resizing
    this.resizeTimeout = setTimeout(() => {
      this.calculateCanvasSize();
    }, 150);
  }

  /**
   * Recalculate and apply canvas display size based on current container size
   */
  private calculateCanvasSize(): void {
      // RESPONSIVE SCALE CALCULATION
      // Get the container size dynamically
      const containerSize = this.containerDivForCanvas.nativeElement;
      const containerRect = containerSize.getBoundingClientRect();

      // Calculate display size to fit container and
      // use 95% of container to leave some padding
      const availableSize = Math.min(containerRect.width, containerRect.height) * 0.95;

      console.log('Container size:', containerRect.width, 'x', containerRect.height);
      console.log('Available size for canvas:', availableSize);
      console.log('Canvas dimensions:', this.canvas.nativeElement.width, 'x', this.canvas.nativeElement.height);

      // Calculate scale to fit container
      const scaleX = availableSize / this.canvas.nativeElement.width;
      const scaleY = availableSize / this.canvas.nativeElement.height;

      // Use the smaller scale to ensure it fits
      this.scaleToSize = Math.min(scaleX, scaleY);

      // Calculate final display dimensions (keeping aspect ratio)
      const displayWidth = this.canvas.nativeElement.width * this.scaleToSize;
      const displayHeight = this.canvas.nativeElement.height * this.scaleToSize;

      // FIX: Set CSS dimensions instead of transform scale
      // This ensures proper layout flow
      this.renderer.setStyle(this.canvas.nativeElement, 'width', `${displayWidth}px`);
      this.renderer.setStyle(this.canvas.nativeElement, 'height', `${displayHeight}px`);

      // Show the canvas
      this.renderer.setStyle(this.canvas.nativeElement, 'display', 'block');

      // Force change detection
      this.cdRef.detectChanges();
  }

  makeGrid(width: number, height: number) {
    console.log('Hello elejen!')
    if (this.context) {
      for (let j = 0; j < height; j += 1) {
        if (this.isBackgroundGrey) {
          this.isBackgroundWhite = false;
          for (let i = 0; i < width; i += 1) {
            if (!this.isBackgroundWhite) {
              this.context.fillStyle = 'lightgrey';
            } else {
              this.context.fillStyle = 'white';
            }
            this.context.fillRect(i, j, 1, 1);
            this.isBackgroundWhite = !this.isBackgroundWhite;
          }
        } else {
          this.isBackgroundWhite = true;
          for (let i = 0; i < width; i += 1) {
            if (this.isBackgroundWhite) {
              this.context.fillStyle = 'white';
            } else {
              this.context.fillStyle = 'lightgrey';
            }
            this.context.fillRect(i, j, 1, 1);
            this.isBackgroundWhite = !this.isBackgroundWhite;
          }
        }
        this.isBackgroundGrey = !this.isBackgroundGrey;
      }
    }
  }

  colorPixel(point: Point): Pixel {
    let pickedColorToSet = this.pickedColor.nativeElement.value;
    let pixelToColor = new Pixel((point.x - 1), (point.y - 1), 1, 1);

    if (this.context) {
      this.context.fillStyle = pickedColorToSet;
      this.context.fillRect(pixelToColor.x, pixelToColor.y, pixelToColor.width, pixelToColor.height);
    }
    return pixelToColor;
  }

  /**
 * Get accurate canvas coordinates accounting for CSS size vs pixel size
 * Returns 1-indexed coordinates (1,1 to width,height)
 */
  private getCanvasCoordinates(event: MouseEvent | TouchEvent): Point {
    const canvas = this.canvas.nativeElement;
    const rect = canvas.getBoundingClientRect();

    let clientX: number;
    let clientY: number;

    // Handle both mouse and touch events
    if (event instanceof TouchEvent) {
      if (event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        // No touch points, return invalid position
        return new Point(-100, -100);
      }
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    // Get position relative to canvas
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Account for CSS scale transform
    // The canvas is displayed larger than its actual pixel dimensions
    // We need to convert from display coordinates to canvas pixel coordinates
    const scaleX = rect.width / this.canvas.nativeElement.width;
    const scaleY = rect.height / this.canvas.nativeElement.height;

    // Convert to canvas pixel coordinates
    const canvasX = Math.floor(x / scaleX);
    const canvasY = Math.floor(y / scaleY);

    // Validate bounds
    if (canvasX < 0 || canvasX >= this.canvas.nativeElement.width ||
      canvasY < 0 || canvasY >= this.canvas.nativeElement.height) {
      return new Point(-100, -100);
    }

    // Convert to 1-indexed for display (1,1 to width,height)
    const displayX = canvasX + 1;
    const displayY = canvasY + 1;

    console.log('Display coords:', x, y);
    console.log('Scale:', scaleX, scaleY);
    console.log('Canvas coords:', canvasX, canvasY);

    return new Point(displayX, displayY);
  }

  ngOnDestroy(): void {
    // Clean up resize timeout
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }
}
