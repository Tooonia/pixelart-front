import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { PixelartItem } from '../../model/pixelart-item';
import { PixelartService } from 'src/app/core/services/pixelart.service';
import { map } from 'rxjs/operators';
import { Point } from '../../model/pixel-coordinates';
import { Pixel } from '../../model/pixel';
import { PixelartSimpleItem } from '../../model/pixelart-simple-item';
//TODO: documention to write for that class!!! Purpose of it?


@Component({
  selector: 'app-manage-pixelart',
  templateUrl: './manage-pixelart.component.html',
  styleUrls: ['./manage-pixelart.component.scss']
})
export class ManagePixelartComponent implements OnInit, AfterViewInit {
  @ViewChild('myCanvas', {static: true}) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myPickedColor', {static: true}) pickedColor!: ElementRef;
  @ViewChild('pixelDrawingBlockContainer', {static: true}) containerDivForDrawingBlock!: ElementRef;
  @ViewChild('gridSizeSettingContainer', {static: true}) containerDivForGridSizeSetting!: ElementRef;
  @ViewChild('canvasDiv', {static: true}) containerDivForCanvas!: ElementRef;
  // TODO: without in Rudi, public for Jeremy, azt hiszem, a default a public:
  managePixelartForm!: FormGroup;
  manageCanvasForm!: FormGroup;
  @Input() pixelartSimpleItem!: PixelartSimpleItem;
  @Output() savedAction = new EventEmitter<PixelartSimpleItem>();
  @Output() cancelledAction = new EventEmitter<PixelartSimpleItem>();
  editMode: boolean = false;
  id!: number;
  context!: CanvasRenderingContext2D | null; //Without "| null" there was an error:
  // Type 'CanvasRenderingContext2D | null' is not assignable to type 'CanvasRenderingContext2D'.
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
    private clickDrag: boolean[] = [];
  mousePosition = new Point(-100, -100);
  pixelsClicked: Pixel[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route:  ActivatedRoute,
    private pixelartService: PixelartService,
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef
    ) { }

  // Test validity of form
  get isValid(): boolean {
    return this.managePixelartForm.valid;
  }

  ngOnInit(): void {
    // this.manageCanvasForm = new FormGroup( {
    //   'width': new FormControl(0),
    //   'height': new FormControl(0)
    // });

    // if (this.canvas.nativeElement.getContext('2d', { willReadFrequently: true }) !== null) {
    //   this.context = this.canvas.nativeElement.getContext('2d');
    //   // this.image = new Image();
    //   // this.image.addEventListener("load", () => {
    //   //   // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas#getting_the_pixel_data_for_a_context
    //   //   // TODO: lehet ide kell a DB-bol a kep URL!
    //   //   this.context?.drawImage(this.image, 0, 0);
    //   //   this.image.style.display = "none";
    //   //   console.log(this.context);
    //   //   console.log(this.image);
    //   // EZ VOLT ITT:
    //     // this.renderer.listen(this.canvas.nativeElement, 'click', (event) => {
    //     //   this.colorPixel(event, this.imageData)}); //EDDIG
    //   // });
    //   // this.redraw();
    //   // this.colorPixel();
    //   // this.createUserEvents();
    //   this.addInteractions();
    // }
    // else {} // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage#checking_for_support

    // if (this.context) {
    //   // this.context.stroke();
    //   // this.context.fillRect(20, 20, 100, 100);
    //   // this.context.stroke();
    //   this.context.strokeRect(20, 20, 10, 10);
    //   this.context.strokeRect(22, 22, 10, 10);

    // }

    // console.log('Initialization elott : ' + this.managePixelartForm.value); // NEM LATSZIK
      // console.log('Initialization elott : ' + this.pixelartItem.name); // NEM LATSZIK
      // this.managePixelartForm = this.formBuilder.group( { // NEM LATSZIK
      this.managePixelartForm = new FormGroup( {

        // title: ['this.pixelartItem.name']
        // id: [''],
       //  name: [''] // Ez volt itt!
        'name': new FormControl(''), // Ez volt itt!
        'width': new FormControl(0),
        'height': new FormControl(0)
        // , 'width': new FormControl(null),
        // 'height': new FormControl(null),
        // 'pixels': new FormControl(null)
        // id: [this.pixelartItem.id]
      });
      console.log('managePixelartForm: ' + this.managePixelartForm.value); // NEM LATSZIK

    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        // console.log('managePixelartForm: ' + this.managePixelartForm); //Here its value is undefined!
        // let pixelartTitle = '';
        // We want to check the 'edit mode or not' condition whenever the parameters change:
        // Then we assign a new value to 'editMode', by checking whether 'params' has an 'id' or not:
        // 'null' value will represent 'undefined', so not present.
        this.editMode = params['id'] != null;
               console.log('this.editMode : ' + this.editMode);
               console.log('this.id : ' + this.id);
               console.log('this.pixelartService.getById(this.id) : ' + this.pixelartService.getById(this.id));
        if (this.editMode) {
            this.pixelartService.getById(this.id).subscribe((data: PixelartItem) => {
            // this.pixelartService.getById(this.id).pipe(map((data: PixelartItem) => {
              this.pixelartSimpleItem.name = data.name;
              this.pixelartSimpleItem.width = data.width;
              this.pixelartSimpleItem.height = data.height;
              this.pixelartSimpleItem.canvas = data.canvas;
              console.log(data);
              // console.log('pixels.length ?: ' + this.pixelartItem.pixels.length);

              // TODO: elvileg nem kell ide se az "id", se a "user".
              // this.managePixelartForm.value.name = this.pixelartItem.name;
              this.managePixelartForm.setValue({
                'name': this.pixelartSimpleItem.name,
                'width': this.pixelartSimpleItem.width,
                'height': this.pixelartSimpleItem.height
                // ,
                // 'width': this.pixelartItem.width,
                // 'height': this.pixelartItem.height,
                // 'pixels': this.pixelartItem.pixels
              });
              // this.manageCanvasForm.setValue({

              // });

              if (this.canvas.nativeElement.getContext('2d') !== null) {
                  this.context = this.canvas.nativeElement.getContext('2d');

                  this.onValidateCanvasSize();
                  // if(this.context) {
                  //   this.imageData = (this.pixelartItem.pixels, this.pixelartItem.width, this.pixelartItem.height);
                  //   this.context.putImageData(this.imageData, 0, 0);
                  // }


                }


              console.log('EZ form name ?' + this.managePixelartForm.value.name);
              console.log('EZ this.pixelartItem.name ?' + this.pixelartSimpleItem.name); //EZ VISZONT MUKODIK! kiirja az eredmeny!!!???
              console.log('EZ this.pixelartItem.id ?' + this.pixelartSimpleItem.id); //object Object csak az eredmeny!!!???
              // console.log('EZ a this.pixelartItem.user : ' + this.pixelartSimpleItem.user); //object Object csak az eredmeny!!!???
              console.log('EZ data.name ?' + data.name);
              console.log('EZ data.id?' + data.id);

              this.renderer.setStyle(this.containerDivForGridSizeSetting.nativeElement, 'display', 'none');
              this.renderer.setStyle(this.containerDivForDrawingBlock.nativeElement, 'display', 'block');
              // TODO: rendering is nagyon darabos!!! Az elejen megjelenik az is, aminek nem kellene!!! setTimout?
            // .pipe(
              //   map((data:any) => new PixelartItemModel[] (
              //     data.id,
              //     data.name,
              //     data.user ? data.user.map((user: any) => new UserPrivateItemModel(
              //       user.id,
              //       user.alias,
              //       user.user_email,
              //       user.pixelarts
              //     )) : [] //Megerteni ezt a reszt!
              //   )));

        })
      } else {
        this.renderer.setStyle(this.containerDivForDrawingBlock.nativeElement, 'display', 'none');
      }
      // console.log('Initialization elott : ' + this.managePixelartForm.value); // NEM LATSZIK
      // console.log('Initialization elott : ' + this.pixelartItem.name); // NEM LATSZIK
      // this.managePixelartForm = this.formBuilder.group( { // NEM LATSZIK
      // // this.managePixelartForm = new FormGroup( {

      //   // title: ['this.pixelartItem.name']
      //   // id: [''],
      //  //  name: [''] // Ez volt itt!
      //   name: (this.pixelartItem.name) // Ez volt itt!

      //   // id: [this.pixelartItem.id]
      // });
      // console.log('managePixelartForm: ' + this.managePixelartForm.value); // NEM LATSZIK
      });
      // console.log('Initialization elott : ' + this.managePixelartForm.value); // NEM LATSZIK
      // console.log('Initialization elott : ' + this.pixelartItem.name); // NEM LATSZIK
      // this.managePixelartForm = this.formBuilder.group( { // NEM LATSZIK
      // // this.managePixelartForm = new FormGroup( {

      //   // title: ['this.pixelartItem.name']
      //   // id: [''],
      //  //  name: [''] // Ez volt itt!
      //   name: (this.pixelartItem.name) // Ez volt itt!

      //   // id: [this.pixelartItem.id]
      // });
      // console.log('managePixelartForm: ' + this.managePixelartForm.value); // NEM LATSZIK
  }

  ngAfterViewInit(): void {
    // if (this.canvas.nativeElement.getContext('2d') !== null) {
    //   this.context = this.canvas.nativeElement.getContext('2d');
    // }
    // this.image = new Image();
    //   console.log('this.image az elejen: ' + this.image); //Works!

    //   // this.canvas.nativeElement.addEventListener("load", () => {
    //   this.image.addEventListener("load", () => {
    //     // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas#getting_the_pixel_data_for_a_context
    //     // TODO: lehet ide kell a DB-bol a kep URL!
    //     console.log('Hello!');
    //     this.context?.drawImage(this.image, 0, 0);
    //     this.image.style.display = "none";
    //     console.log('this.context inside onValidateCanvasSize(): ' + this.context);
    //     console.log('this.image inside onValidateCanvasSize(): ' + this.image);
    //     console.log('this.context inside onValidateCanvasSize(): ' + this.context);

    //   });

      // this.canvas.nativeElement.addEventListener("load", () => {
      // this.imageData.addEventListener("load", () => {
      //   // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas#getting_the_pixel_data_for_a_context
      //   // TODO: lehet ide kell a DB-bol a kep URL!
      //   console.log('Hello!');
      //   this.context?.drawImage(this.image, 0, 0);
      //   this.image.style.display = "none";
      //   console.log('this.context inside onValidateCanvasSize(): ' + this.context);
      //   console.log('this.image inside onValidateCanvasSize(): ' + this.image);
      //   console.log('this.context inside onValidateCanvasSize(): ' + this.context);

      // });
      this.cdRef.detectChanges();
      if (this.canvas.nativeElement.getContext('2d', { willReadFrequently: true }) !== null) {
        this.context = this.canvas.nativeElement.getContext('2d');
        // this.image = new Image();
        // this.image.addEventListener("load", () => {
        //   // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas#getting_the_pixel_data_for_a_context
        //   // TODO: lehet ide kell a DB-bol a kep URL!
        //   this.context?.drawImage(this.image, 0, 0);
        //   this.image.style.display = "none";
        //   console.log(this.context);
        //   console.log(this.image);
        // EZ VOLT ITT:
          // this.renderer.listen(this.canvas.nativeElement, 'click', (event) => {
          //   this.colorPixel(event, this.imageData)}); //EDDIG
        // });
        // this.redraw();
        // this.colorPixel();
        // this.createUserEvents();
        // this.addInteractions();
      }

    // this.canvas.nativeElement.addEventListener('click', this.colorPixel.bind(this));
    // this.canvas.nativeElement.addEventListener('click', (event: MouseEvent | TouchEvent) => this.colorPixel(event, this.imageData));
    // this.canvas.nativeElement.addEventListener('click', (event: MouseEvent | TouchEvent) => this.colorPixel(event, {x: Number, y: Number}));
  }
//   private createUserEvents() {
//     // let canvas = this.canvas;

//     this.canvas.nativeElement.addEventListener("mousedown", this.pressEventHandler);
//     this.canvas.nativeElement.addEventListener("mousemove", this.dragEventHandler);
//     this.canvas.nativeElement.addEventListener("mouseup", this.releaseEventHandler);
//     this.canvas.nativeElement.addEventListener("mouseout", this.cancelEventHandler);

//     this.canvas.nativeElement.addEventListener("touchstart", this.pressEventHandler);
//     this.canvas.nativeElement.addEventListener("touchmove", this.dragEventHandler);
//     this.canvas.nativeElement.addEventListener("touchend", this.releaseEventHandler);
//     this.canvas.nativeElement.addEventListener("touchcancel", this.cancelEventHandler);
//   }
//   private pressEventHandler = (e: MouseEvent | TouchEvent) => {
//     let mouseX = (e as TouchEvent).changedTouches ?
//         (e as TouchEvent).changedTouches[0].pageX :
//         (e as MouseEvent).pageX;
//     let mouseY = (e as TouchEvent).changedTouches ?
//         (e as TouchEvent).changedTouches[0].pageY :
//         (e as MouseEvent).pageY;
//     mouseX -= this.canvas.nativeElement.offsetLeft;
//     mouseY -= this.canvas.nativeElement.offsetTop;

//     this.paint = true;
//     this.addClick(mouseX, mouseY, false);
//     this.redraw();
// }
// private releaseEventHandler = () => {
//   this.paint = false;
//   this.redraw();
// }

// private cancelEventHandler = () => {
//   this.paint = false;
// }

// private dragEventHandler = (e: MouseEvent | TouchEvent) => {
//   let mouseX = (e as TouchEvent).changedTouches ?
//       (e as TouchEvent).changedTouches[0].pageX :
//       (e as MouseEvent).pageX;
//   let mouseY = (e as TouchEvent).changedTouches ?
//       (e as TouchEvent).changedTouches[0].pageY :
//       (e as MouseEvent).pageY;
//   mouseX -= this.canvas.nativeElement.offsetLeft;
//   mouseY -= this.canvas.nativeElement.offsetTop;

//   if (this.paint) {
//       this.addClick(mouseX, mouseY, true);
//       this.redraw();
//   }

//   e.preventDefault();
// }

// private addClick(x: number, y: number, dragging: boolean) {
//   this.clickedX.push(x);
//   this.clickedY.push(y);
//   this.clickDrag.push(dragging);
// }

// private redraw() {
//   let clickX = this.clickedX;
//   let context = this.context;
//   let clickDrag = this.clickDrag;
//   let clickY = this.clickedY;
//   for (let i = 0; i < clickX.length; ++i) {
//       this.context?.beginPath();
//       if (clickDrag[i] && i) {
//           this.context?.moveTo(clickX[i - 1], clickY[i - 1]);
//       } else {
//         this.context?.moveTo(clickX[i] - 1, clickY[i]);
//       }

//       this.context?.lineTo(clickX[i], clickY[i]);
//       this.context?.stroke();
//   }
//   this.context?.closePath();
// }

  addInteractions() {
    this.renderer.listen(this.canvas.nativeElement, 'click', (event) => {
      this.calculateMousePositionInCanvas(event);
      const clickedPixel = this.colorPixel(this.mousePosition);
      console.log('clickedPixel value: ' + clickedPixel);
      this.pixelsClicked.push(clickedPixel); //TODO: FONTOS: update the array: a clicked pixel should appear there only once, with the lastly applied color!!!
      console.log(clickedPixel); // elotte levo szoveg nelkul rendesen kiirja az x, y, width es height adatokat.
      console.log(this.pixelsClicked); // TODO ERROR: it puts 2 identical Pixel element on each click to the array!!! WHY? MEG akkor is, ha outside the validated canvas size (5x5-nel kiirja a 6, 5, 1, 1-et!)
      console.log(this.imageData.data);
      // console.log('inside addInteractions: clickedPixel: ' + clickedPixel);
      // console.log('inside addInteractions: pixelsClicked array: ' + this.pixelsClicked); // TODO ERROR: it puts 2 identical Pixel element on each click to the array!!! WHY?
      // console.log('inside addInteractions: imageData.data: ' + this.imageData.data);
    });
    // this.canvas.nativeElement.addEventListener('mouseover', (event) => {

    //   this.calculateMousePositionInCanvas(event);
    //   console.log('mouseHover value: '+ this.mousePosition.x + this.mousePosition.y);
    // });
  }

  calculateMousePositionInCanvas(e: MouseEvent) {
    this.mousePosition = new Point(
      // e.clientX  -
      //   this.canvas.nativeElement.offsetLeft,
      // e.clientY -
      //   this.canvas.nativeElement.offsetTop
      e.offsetX
      , e.offsetY// offsetX and Y values sets the pixel position within the target element (canvas) from its edge.
      // TODO FONTOS: prevent x/y max width and height coordinate to be valide! 5,2 clicked and added to the
    );
    console.log(e.clientX);
    console.log(e.clientY);
    console.log(e.offsetX);
    console.log(e.offsetY);
    console.log(this.canvas.nativeElement.getBoundingClientRect());
    console.log('mousePosition: ' + this.mousePosition.x + ' and ' + this.mousePosition.y);
    console.log('offseftLeft: ' + this.canvas.nativeElement.offsetLeft);
    console.log('offsetTop: ' + this.canvas.nativeElement.offsetTop);
  }

  public saveAction(): void {



    if (this.managePixelartForm.valid) {
      if(this.context) {
        this.imageData = this.context.getImageData(0,0,this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      console.log('this.imageData megjelenik?');
      console.log(this.imageData.data); //HURRAAA!!! Vegre megjelennek az ertekek!!!

    this.pixelartSimpleItem.name = this.managePixelartForm.value.name;
    console.log(this.managePixelartForm.value.name);
    // console.log(this.pixelartSimpleItem.name);
    console.log(this.pixelartSimpleItem);
    // this.pixelartSimpleItem.width = this.manageCanvasForm.value.width;
    // this.pixelartSimpleItem.height = this.manageCanvasForm.value.height;
    this.pixelartSimpleItem.width = this.managePixelartForm.value.width;
    this.pixelartSimpleItem.height = this.managePixelartForm.value.height;

    this.pixelartSimpleItem.canvas = Array.from(this.imageData.data); //TODO FONTOS: megnezni, h ki lehet-e ezt a value-t jelolni, vagy setValue kell, mint fentebb?
    console.log('pixelartItem.canvas value at save: ' + this.pixelartSimpleItem.canvas);
    console.log("Current form: ", this.managePixelartForm);
    console.log("Form has been submitted: ", this.managePixelartForm.value);
    this.savedAction.emit(this.pixelartSimpleItem);
  }
  }




    // this.pixelartItem.name = this.managePixelartForm.value.name;
    // console.log(this.managePixelartForm.value.name);
    // console.log(this.pixelartItem.name);
    // console.log(this.pixelartItem);
    // this.pixelartItem.width = this.manageCanvasForm.value.width;
    // this.pixelartItem.height = this.manageCanvasForm.value.height;
    // this.pixelartItem.canvas = Array.from(this.imageData.data); //TODO FONTOS: megnezni, h ki lehet-e ezt a value-t jelolni, vagy setValue kell, mint fentebb?
    // console.log('pixelartItem.canvas value at save: ' + this.pixelartItem.canvas);
    // console.log("Current form: ", this.managePixelartForm);
    // console.log("Form has been submitted: ", this.managePixelartForm.value);
// Previously, but I think this is not the managePixelartForm that should be sent with emit:
    // this.savedAction.emit(this.managePixelartForm.value);
    // this.pixelartItem = this.managePixelartForm.value;
    // this.savedAction.emit(this.pixelartItem);
    // this.imageData = new ImageData(this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    // if(this.context) {
    //   this.imageData = this.context.getImageData(0,0,this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    // console.log('this.imageData megjelenik?');
    // console.log(this.imageData.data); //HURRAAA!!! Vegre megjelennek az ertekek!!!
    // this.managePixelartForm.value.width = this.manageCanvasForm.value.width;
    // this.managePixelartForm.value.height = this.manageCanvasForm.value.height;
    // this.managePixelartForm.value.pixels = this.imageData; //TODO FONTOS: megnezni, h ki lehet-e ezt a value-t jelolni, vagy setValue kell, mint fentebb?
    // }
    // this.savedAction.emit(this.managePixelartForm.value); //TODO FONTOS: megnezni, h egybe kell-e vegyem a ket form-ot



    // }

    // this.savedAction.emit(this.pixelartItem);
   //TODO FONTOS: megnezni, h egybe kell-e vegyem a ket form-ot
  }

// reuse-declaration.component.ts, clickCancel()
  public cancelAction(): void {
    // TODO: with route-history.service.ts, to goBackIfPossibleToGoBack()
    // specially when updatePixelArt: we must go back to Details!!!
    // CREATE can go back to catalog!
    // TODO/QUESTION: correct?: emit(this.managePixelartForm.value)
    // Previously, but I think this is not the managePixelartForm that should be sent with emit:
    // this.cancelledAction.emit(this.managePixelartForm.value)
    // this.pixelartItem = this.managePixelartForm.value; //TODO: amikor forditva voltak az = ket vegen, nem mukodott!!!
    this.cancelledAction.emit(this.pixelartSimpleItem); //TODO: maybe no need to have an eventemitter<PixelItem> on that function?
  }

  onValidateCanvasSize() { //TODO: rendszerezni a benne levo dolgokat, editMode reszt, ...
    // this.canvasHeight = this.manageCanvasForm.value.height;
    // this.canvasWidth = this.manageCanvasForm.value.width;

    if (this.editMode) {
      this.canvas.nativeElement.width = this.pixelartSimpleItem.width; // TODO: vagy: this.manageCanvasForm.value.width, as fentebb kijelolve!
      this.canvas.nativeElement.height = this.pixelartSimpleItem.height;
    } else {
        this.canvas.nativeElement.width = this.managePixelartForm.value.width;
        this.canvas.nativeElement.height = this.managePixelartForm.value.height;
        this.makeGrid(this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }


    // this.renderer.setAttribute(this.canvas.nativeElement, 'height', this.manageCanvasForm.value.height);
    // this.renderer.setAttribute(this.canvas.nativeElement, 'width', this.manageCanvasForm.value.width);

    // this.canvasColor = this.manageCanvasForm.value.color;
    // this.manageCanvasForm.setValue({}, {emitEvent: false});//TODO: nem kellene megis ide valami a server fele?
    this.renderer.setStyle(this.canvas.nativeElement, 'display', 'block');
    // const rectCanvas = this.canvas.nativeElement.getBoundingClientRect();

    // if (this.containerDivForCanvas.nativeElement.getAttribute('width') !== null) {
      this.scaleToSize =
                      (this.canvas.nativeElement.width >= this.canvas.nativeElement.height ?
                      Math.floor(380/this.canvas.nativeElement.width) :
                      Math.floor(380/this.canvas.nativeElement.height));

          // console.log('MathFloor: ' + Math.floor(this.containerDivForCanvas.nativeElement.width/this.canvas.nativeElement.width));
          console.log('MathFloor: ' + Math.floor(380/this.canvas.nativeElement.width));
          // console.log('divWidth: ' + this.containerDivForCanvas.nativeElement.offsetWidth);
    // }
    this.renderer.setStyle(this.canvas.nativeElement, 'transform', `scale(${ this.scaleToSize })`); // Can have incorrect CSS values applied to them.
    // this.renderer.setStyle(this.canvas.nativeElement, 'scale', this.scaleToSize);
    console.log('canvas size after resizing: ' + this.canvas.nativeElement.width, this.canvas.nativeElement.height); //20 20 values, ha 20x20as gridet csinaltam, amugy 380x380px.
    console.log(this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    // this.renderer.setProperty(this.canvas.nativeElement, 'height', '380px');
    // this.renderer.setProperty(this.canvas.nativeElement, 'width', '380px');
    console.log(this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    this.renderer.setStyle(this.containerDivForDrawingBlock.nativeElement, 'display', 'block');
    this.renderer.setStyle(this.containerDivForGridSizeSetting.nativeElement, 'display', 'none');

    if (this.canvas.nativeElement.getContext('2d', { willReadFrequently: true }) !== null) {
      this.context = this.canvas.nativeElement.getContext('2d');
      // this.image = new Image();
      // this.image.addEventListener("load", () => {
      //   // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas#getting_the_pixel_data_for_a_context
      //   // TODO: lehet ide kell a DB-bol a kep URL!
      //   this.context?.drawImage(this.image, 0, 0);
      //   this.image.style.display = "none";
      //   console.log(this.context);
      //   console.log(this.image);
      // EZ VOLT ITT:
        // this.renderer.listen(this.canvas.nativeElement, 'click', (event) => {
        //   this.colorPixel(event, this.imageData)}); //EDDIG
      // });
      // this.redraw();
      // this.colorPixel();
      // this.createUserEvents();
      this.addInteractions();
    }

    if (this.editMode) {
      this.imageData = new ImageData(this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      for (let i = 0; i < this.imageData.data.length; i += 1) {
        console.log('data.length az onValidateCanvasban: ' + this.imageData.data.length);
        if (this.pixelartSimpleItem.canvas[i] <= 255 && this.pixelartSimpleItem.canvas[i] >= 0) {
          this.imageData.data[i] = this.pixelartSimpleItem.canvas[i];
        }
        // this.imageData.data.length === this.pixelartItem.pixels.length &&

        if (this.context) {
          this.context.putImageData(this.imageData, 0, 0);
        }

    }
  } else {


    this.imageData = new ImageData(this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    console.log('this.imageData az elejen: ' + this.imageData);
    // console.log('this.imageData.colorSpace az elejen: ' + this.imageData.colorSpace);
    console.log('this.imageData.data az elejen: ' + this.imageData.data);
    console.log('this.imageData.data[2] az elejen: ' + this.imageData.data[2]); //Kiadja a 0-t.
    console.log('this.imageData.height az elejen: ' + this.imageData.height);
    console.log('this.imageData.width az elejen: ' + this.imageData.width);
    console.log('this.imageData az elejen: ' + this.imageData);
    console.log('this.imageData az elejen: ' + this.imageData.data.length);
  }
//     const blueComponent = this.imageData.data[50 * (this.imageData.width * 4) + 200 * 4 + 2];
//     console.log('blueComponent: ' + blueComponent);
//     const numBytes = this.imageData.data.length;
//     console.log('numBytes: ' + numBytes);
//     const xCoord = 2;
// const yCoord = 3;
// const canvasWidth = this.imageData.width;

// const getColorIndicesForCoord = (x: number, y: number, width: number) => {
//   const red = y * (width * 4) + x * 4;
//   return [red, red + 1, red + 2, red + 3];
// };

// const colorIndices = getColorIndicesForCoord(xCoord, yCoord, canvasWidth);

// const [redIndex, greenIndex, blueIndex, alphaIndex] = colorIndices;
// console.log('colorIndecis: ' + colorIndices);
// console.log('redIndex: ' + redIndex.valueOf()); //RETURNS the number of the bit.



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

      // this.context.stroke();
      // this.imageData = new ImageData(width, height);

      // this.image.addEventListener("load", () => {
      //   // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas#getting_the_pixel_data_for_a_context
      //   // TODO: lehet ide kell a DB-bol a kep URL!
      //   this.context?.drawImage(this.image, 0, 0);
      //   this.image.style.display = "none";
      //   console.log(this.context);
      //   console.log(this.image);
      // });
    }
  }

  // colorPixel(x: number, y: number, color: number) {
  // colorPixel(event: any, destination: any) {
  colorPixel(point: Point): Pixel {
    let pickedColorToSet = this.pickedColor.nativeElement.value;
    console.log(this.pickedColor.nativeElement.value); // FONTOS: rendben megjelenik a HEX ertek!: #000000
    console.log('pickedColorToSet value: ' + pickedColorToSet); // FONTOS: rendben megjelenik a HEX ertek!: #000000
    let pixelToColor = new Pixel(point.x, point.y, 1, 1);
    console.log('pixelToColor x value: '+ pixelToColor.x);
    console.log('pixelToColor y value: '+ pixelToColor.y);
    console.log('pixelToColor width value: '+ pixelToColor.width);
    console.log('pixelToColor height value: '+ pixelToColor.height);
    // this.context?.beginPath();
    if (this.context) {
        // this.context.beginPath();
        // this.context.moveTo(point.x, point.y);
        // this.context.lineTo(point.x + 5, point.y + 5);
        // this.context.stroke();
        // this.context.closePath(); //EZ A KOD VONALAT RAJZOL!

      // this.context.fillStyle = 'red';
      this.context.fillStyle = pickedColorToSet;
      console.log('fillStyle value: '+ this.context.fillStyle);
      this.context.fillRect(pixelToColor.x, pixelToColor.y, pixelToColor.width, pixelToColor.height);
    }
    // this.renderer.setStyle(pixelToColor, 'background-color', pickedColorToSet);
    return pixelToColor;
    // this.renderer.listen('myCanvas', 'click',(e:Event)=>{
    //   if(e.target === this.canvas.nativeElement && e.target !== null){
      // INNEN VOLT:
        // const bounding = this.canvas.nativeElement.getBoundingClientRect();
        // const x = this.canvas.nativeElement.clientLeft - bounding.left;
        // const y = this.canvas.nativeElement.clientTop - bounding.top;
        // console.log('canvas.clientLeft: ' + this.canvas.nativeElement.clientLeft);
        // console.log('canvas.clientWidth: ' + this.canvas.nativeElement.clientWidth);
        // console.log('canvas.clientHeight: ' + this.canvas.nativeElement.clientHeight);
        // console.log('canvas.clientTop: ' + this.canvas.nativeElement.clientTop);
        // console.log('bounding left: ' + bounding.left);
        // console.log('bounding top: ' + bounding.top);
        // const clickedPixel = this.context?.getImageData(x, y, 1, 1);
        // const data = clickedPixel?.data;
        // console.log('data: ' + data); //Prints out: 0,0,0,0
        // console.log('getImageData(x, y, 1, 1)' + this.context?.getImageData(x, y, 1, 1)); //Prints out: [object ImageData]
        // // let pickedColorToSet = this.pickedColor.nativeElement.value;
        // console.log(this.pickedColor.nativeElement.value); // FONTOS: rendben megjelenik a HEX ertek!: #000000
        // this.renderer.setStyle(data, 'background', pickedColorToSet);
        // // this.renderer.setStyle(data, 'background-color', pickedColorToSet);
        // console.log('this.imageData colorPixel() vegen: ' + this.imageData);
        // this.context?.putImageData(this.imageData, 0, 0);
        //EDDIG!
      // }
    // });

    // $('#pixelCanvas').on('click','td', function() {
    //   pickedColor = $('#colorPicker').val();
    //   $(this).css('background-color', pickedColor);
    // });

  }
}
