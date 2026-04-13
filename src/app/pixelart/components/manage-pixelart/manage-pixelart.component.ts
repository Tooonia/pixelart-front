import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Point } from '../../model/pixel-coordinates';
import { Pixel } from '../../model/pixel';
import { PixelartSimpleItem } from '../../model/pixelart-simple-item';
import { PixelartRequestItem } from '../../model/pixelart-request-item';
import { CanvasService } from 'src/app/core/services/canvas.service';

/**
 * ManagePixelartComponent
 *
 * A reusable canvas-based form component for both creating and editing a pixelart item.
 * It is a pure "presentational + interaction" component: it receives all data via @Input
 * and communicates results back to the parent via @Output. It does NOT fetch data or
 * navigate — those responsibilities belong to the parent page component (PixelartFormPageComponent).
 *
 * Usage (edit mode):
 *   <app-manage-pixelart
 *     [editMode]="true"
 *     [pixelartSimpleItem]="itemToEdit"
 *     (savedAction)="onSave($event)"
 *     (cancelledAction)="onCancel()">
 *   </app-manage-pixelart>
 *
 * Usage (create mode):
 *   <app-manage-pixelart
 *     [editMode]="false"
 *     [pixelartRequestItem]="emptyItem"
 *     (savedActionForCreate)="onSave($event)"
 *     (cancelledAction)="onCancel()">
 *   </app-manage-pixelart>
 */

@Component({
  selector: 'app-manage-pixelart',
  templateUrl: './manage-pixelart.component.html',
  styleUrls: ['./manage-pixelart.component.scss']
})
export class ManagePixelartComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('myCanvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myPickedColor', { static: false }) pickedColor!: ElementRef;
  @ViewChild('canvasDiv', { static: false }) containerDivForCanvas!: ElementRef;
  @ViewChild('gridSizeSettingContainer', { static: true }) containerDivForGridSizeSetting!: ElementRef;
  @ViewChild('pixelDrawingBlockContainer', { static: false }) containerDivForDrawingBlock!: ElementRef;
  /** Set to true when editing an existing pixelart, false when creating a new one. */
  @Input() editMode: boolean = false;
  /** Populated by the parent in edit mode. The component will pre-fill the form and canvas from this. */
  @Input() pixelartSimpleItem!: PixelartSimpleItem;
  /** Populated by the parent in create mode (can be an empty PixelartRequestItem shell). */
  @Input() pixelartRequestItem!: PixelartRequestItem;
  /** Emitted when the user saves in edit mode. */
  @Output() savedAction = new EventEmitter<PixelartSimpleItem>();
  /** Emitted when the user saves in create mode. */
  @Output() savedActionForCreate = new EventEmitter<PixelartRequestItem>();
  /** Emitted when the user cancels (both modes). The parent decides where to navigate. */
  @Output() cancelledAction = new EventEmitter<PixelartSimpleItem>();

  managePixelartForm!: UntypedFormGroup;
  manageCanvasForm!: UntypedFormGroup;
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
  private canvasCleanup?: () => void;

  constructor(
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef,
    private canvasService: CanvasService
  ) { }

  // Test validity of form
  get isValid(): boolean {
    return this.managePixelartForm.valid;
  }

  // Lifecycle
  ngOnInit(): void {
    this.managePixelartForm = new UntypedFormGroup({
      'name': new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern(/^[^<>"'&]*$/)
      ]),
      'width': new UntypedFormControl(16, [
        Validators.required,
        Validators.min(1),
        Validators.max(128),
        Validators.pattern(/^[1-9][0-9]*$/) // No leading zeros
      ]),
      'height': new UntypedFormControl(16, [
        Validators.required,
        Validators.min(1),
        Validators.max(128),
        Validators.pattern(/^[1-9][0-9]*$/) // No leading zeros
      ])
    });

    if (this.editMode) {
      this.managePixelartForm.setValue({
        'name': this.pixelartSimpleItem.name,
        'width': this.pixelartSimpleItem.width,
        'height': this.pixelartSimpleItem.height
      });
      this.onValidateCanvasSize();
    }
  }

  /**
   * When the parent swaps the item (e.g. route param change) without destroying this instance,
   * sync the form and canvas. First input bind runs before ngOnInit; initial edit load uses ngOnInit.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.editMode || !changes['pixelartSimpleItem'] || !this.pixelartSimpleItem) {
      return;
    }
    if (!this.managePixelartForm) {
      return;
    }
    this.managePixelartForm.setValue({
      name: this.pixelartSimpleItem.name,
      width: this.pixelartSimpleItem.width,
      height: this.pixelartSimpleItem.height
    });
    this.onValidateCanvasSize();
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();

    this.pixelartRequestItem = {
      'name': '',
      'width': 0,
      'height': 0,
      'canvas': ([])
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
      // Get pixel data using Canvas Service
      const canvasData = this.canvasService.getCanvasPixelData(this.canvas.nativeElement);

      if (this.editMode) {
        this.pixelartSimpleItem.name = this.managePixelartForm.value.name;
        this.pixelartSimpleItem.width = this.managePixelartForm.value.width;
        this.pixelartSimpleItem.height = this.managePixelartForm.value.height;
        this.pixelartSimpleItem.canvas = canvasData;
        this.savedAction.emit(this.pixelartSimpleItem);
      } else {
        this.pixelartRequestItem.name = this.managePixelartForm.value.name;
        this.pixelartRequestItem.width = this.managePixelartForm.value.width;
        this.pixelartRequestItem.height = this.managePixelartForm.value.height;
        this.pixelartRequestItem.canvas = canvasData;
        this.savedActionForCreate.emit(this.pixelartRequestItem);
      }
    }
  }

  public cancelAction(): void {
    this.cancelledAction.emit(this.pixelartSimpleItem); //TODO: maybe no need to have an eventemitter<PixelItem> on that function?
  }

  onValidateCanvasSize() {
    // Get width and height from form
    let width: number;
    let height: number;

    // Set canvas actual pixel dimensions
    if (this.editMode) {
      width = this.pixelartSimpleItem.width;
      height = this.pixelartSimpleItem.height;
    } else {
      width = this.managePixelartForm.value.width;
      height = this.managePixelartForm.value.height;

      // Validate dimensions
      if (width < 1 || height < 1 || width > 128 || height > 128) {
        alert('Grid size must be between 1 and 128');
        return;
      }
    }

    this.gridValidationMode = false;
    this.cdRef.detectChanges();

    // Use setTimeout to wait for DOM to render (canvas *ngIf after gridValidationMode is false)
    setTimeout(() => {
      if (this.canvasCleanup) {
        this.canvasCleanup();
        this.canvasCleanup = undefined;
      }
      if (this.canvas && this.containerDivForCanvas) {
        // Show containers FIRST before measuring
        // this.renderer.setStyle(this.containerDivForDrawingBlock.nativeElement, 'display', 'block');

        // Set canvas pixel dimensions, needed for grid creation
        this.canvas.nativeElement.width = width;
        this.canvas.nativeElement.height = height;

        // Initialize canvas context
        if (this.canvas.nativeElement.getContext('2d') !== null) {
          this.context = this.canvas.nativeElement.getContext('2d');
        }

        // Use Canvas Service with AUTO-RESIZE enabled
        const result = this.canvasService.setupCanvas(
          this.canvas.nativeElement,
          {
            width,
            height,
            containerElement: this.containerDivForCanvas.nativeElement,
            pixelData: this.editMode ? this.pixelartSimpleItem.canvas : undefined,
            enableAutoResize: true
          }
        );

        // Store the scale and context results
        this.scaleToSize = result.scale;
        this.context = result.context;

        // Store cleanup function for later
        if (result.cleanup) {
          this.canvasCleanup = result.cleanup;
        }

        // Create grid if not in edit mode
        if (!this.editMode && this.context) {
          this.canvasService.createCheckerboardGrid(
            this.canvas.nativeElement,
            this.context
          );
        }

        // Add interactions
        this.addInteractions();
      } else {
        return;
      }
    }, 0);
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
   * Prevent non-numeric characters except backspace, delete, arrow keys
   */
  preventInvalidChars(event: KeyboardEvent): boolean {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    const key = event.key;

    // Allow control keys
    if (allowedKeys.includes(key)) {
      return true;
    }

    // Prevent decimal point
    if (key === '.' || key === ',') {
      event.preventDefault();
      return false;
    }

    // Prevent minus sign
    if (key === '-') {
      event.preventDefault();
      return false;
    }

    // Only allow digits
    if (!/^\d$/.test(key)) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  /**
   * Validate and clean integer input
   * Removes leading zeros and ensures valid range
   */
  validateIntegerInput(event: any, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove any non-digit characters
    value = value.replace(/[^\d]/g, '');

    // Remove leading zeros
    if (value.length > 1 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // If empty after cleaning, set to empty string
    if (value === '') {
      this.managePixelartForm.get(fieldName)?.setValue('', { emitEvent: false });
      input.value = '';
      return;
    }

    // Parse as integer
    let numValue = parseInt(value, 10);

    // Enforce min/max
    if (numValue < 1) {
      numValue = 1;
      value = '1';
    } else if (numValue > 128) {
      numValue = 128;
      value = '128';
    }

    // Update form control
    this.managePixelartForm.get(fieldName)?.setValue(numValue, { emitEvent: false });

    // Update input display
    input.value = value;
  }

  /**
 * Get accurate canvas coordinates accounting for CSS size vs pixel size
 * Returns 1-indexed coordinates (1,1 to width,height)
 */
  private getCanvasCoordinates(event: MouseEvent | TouchEvent): Point {
    // Use Canvas Service to get coordinates (1-indexed)
    const coordinates = this.canvasService.getCanvasPixelCoordinates(
      event,
      this.canvas.nativeElement,
      true  // Use 1-indexed coordinates
    );

    return new Point(coordinates.x, coordinates.y);
  }

  ngOnDestroy(): void {
    // Clean up auto-resize observer
    if (this.canvasCleanup) {
      this.canvasCleanup();
    }
  }
}