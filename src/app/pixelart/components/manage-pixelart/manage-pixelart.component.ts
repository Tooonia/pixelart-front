import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { PixelartItem } from '../../model/pixelart-item';
import { PixelartService } from 'src/app/core/services/pixelart.service';
import { map } from 'rxjs/operators';
import { Point } from '../../model/pixel-coordinates';
import { Pixel } from '../../model/pixel';
//TODO: documention to write for that class!!! Purpose of it?


@Component({
  selector: 'app-manage-pixelart',
  templateUrl: './manage-pixelart.component.html',
  styleUrls: ['./manage-pixelart.component.scss']
})
export class ManagePixelartComponent implements OnInit, AfterViewInit {
  @ViewChild('myCanvas', {static: true}) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myPickedColor', {static: true}) pickedColor!: ElementRef;
  // TODO: without in Rudi, public for Jeremy, azt hiszem, a default a public:
  managePixelartForm!: FormGroup;
  manageCanvasForm!: FormGroup;
  @Input() pixelartItem!: PixelartItem;
  @Output() savedAction = new EventEmitter<PixelartItem>();
  @Output() cancelledAction = new EventEmitter<PixelartItem>();
  editMode: boolean = false;
  id!: number;
  context!: CanvasRenderingContext2D | null; //Without "| null" there was an error:
  // Type 'CanvasRenderingContext2D | null' is not assignable to type 'CanvasRenderingContext2D'.
  canvasHeight: number = 0;
  canvasWidth: number = 0;
  canvasColor: string = '';
  isBackgroundWhite: boolean = false;
  isBackgroundGrey: boolean = false;
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
    this.manageCanvasForm = new FormGroup( {
      'height': new FormControl(0),
      'width': new FormControl(0),
      'color': new FormControl(null),
    });

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
        'name': new FormControl(null) // Ez volt itt!

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
              this.pixelartItem.name = data.name;
              // this.managePixelartForm.value.name = this.pixelartItem.name;
              this.managePixelartForm.setValue({
                'name': this.pixelartItem.name
              })
              console.log('EZ form name ?' + this.managePixelartForm.value.name);
              console.log('EZ name ?' + this.pixelartItem.name); //EZ VISZONT MUKODIK! kiirja az eredmeny!!!???
              console.log('EZ ?' + this.pixelartItem.id); //object Object csak az eredmeny!!!???
              console.log('EZ a user : ' + this.pixelartItem.user); //object Object csak az eredmeny!!!???
              console.log('EZ?' + data.name);
              console.log('EZ?' + data.id);
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
        this.addInteractions();
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
    this.canvas.nativeElement.addEventListener('click', (event) => {
      this.calculateMousePositionInCanvas(event);
      const clickedPixel = this.colorPixel(this.mousePosition);
      console.log('clickedPixel value: ' + clickedPixel);
      this.pixelsClicked.push(clickedPixel);
    })
  }

  calculateMousePositionInCanvas(e: MouseEvent) {
    this.mousePosition = new Point(
      e.clientX  -
        // this.canvas.nativeElement.offsetLeft,
        this.canvas.nativeElement.offsetLeft,
      e.clientY -
        this.canvas.nativeElement.offsetTop
    );
    console.log(e.clientX);
    console.log(e.clientY);
    console.log('mousePosition: ' + this.mousePosition.x + ' and ' + this.mousePosition.y);
    console.log('offseftLeft: ' + this.canvas.nativeElement.offsetLeft);
    console.log('offsetTop: ' + this.canvas.nativeElement.offsetTop);
  }

  public saveAction(): void {
    console.log("Current form: ", this.managePixelartForm);
    console.log("Form has been submitted: ", this.managePixelartForm.value);
// Previously, but I think this is not the managePixelartForm that should be sent with emit:
    // this.savedAction.emit(this.managePixelartForm.value);
    // this.pixelartItem = this.managePixelartForm.value;
    // this.savedAction.emit(this.pixelartItem);
    this.savedAction.emit(this.managePixelartForm.value);
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
    this.cancelledAction.emit(this.pixelartItem); //TODO: maybe no need to have an eventemitter<PixelItem> on that function?
  }

  onValidateCanvasSize() {
    // this.canvasHeight = this.manageCanvasForm.value.height;
    // this.canvasWidth = this.manageCanvasForm.value.width;
    this.canvas.nativeElement.width = this.manageCanvasForm.value.width;
    this.canvas.nativeElement.height = this.manageCanvasForm.value.height;

    // this.canvasColor = this.manageCanvasForm.value.color;
    // this.manageCanvasForm.setValue({}, {emitEvent: false});//TODO: nem kellene megis ide valami a server fele?
    this.renderer.setStyle(this.canvas.nativeElement, 'display', 'block');
    this.makeGrid(this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.imageData = new ImageData(this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    console.log('this.imageData az elejen: ' + this.imageData);
    // console.log('this.imageData.colorSpace az elejen: ' + this.imageData.colorSpace);
    console.log('this.imageData.data az elejen: ' + this.imageData.data);
    console.log('this.imageData.height az elejen: ' + this.imageData.height);
    console.log('this.imageData.width az elejen: ' + this.imageData.width);
    console.log('this.imageData az elejen: ' + this.imageData);
    const blueComponent = this.imageData.data[50 * (this.imageData.width * 4) + 200 * 4 + 2];
    console.log('blueComponent: ' + blueComponent);
    const numBytes = this.imageData.data.length;
    console.log('numBytes: ' + numBytes);
    const xCoord = 2;
const yCoord = 3;
const canvasWidth = this.imageData.width;

const getColorIndicesForCoord = (x: number, y: number, width: number) => {
  const red = y * (width * 4) + x * 4;
  return [red, red + 1, red + 2, red + 3];
};

const colorIndices = getColorIndicesForCoord(xCoord, yCoord, canvasWidth);

const [redIndex, greenIndex, blueIndex, alphaIndex] = colorIndices;
console.log('colorIndecis: ' + colorIndices);
console.log('redIndex: ' + redIndex.valueOf()); //RETURNS the number of the bit.



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
    let pixelToColor = new Pixel(point.x, point.y, 10, 10);
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
        // let pickedColorToSet = this.pickedColor.nativeElement.value;
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
