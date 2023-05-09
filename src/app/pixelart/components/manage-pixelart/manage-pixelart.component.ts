import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { PixelartItem } from '../../model/pixelart-item';
import { PixelartService } from 'src/app/core/services/pixelart.service';
import { map } from 'rxjs/operators';
//TODO: documention to write for that class!!! Purpose of it?


@Component({
  selector: 'app-manage-pixelart',
  templateUrl: './manage-pixelart.component.html',
  styleUrls: ['./manage-pixelart.component.scss']
})
export class ManagePixelartComponent implements OnInit, AfterViewInit {
  @ViewChild('myCanvas', {static: true}) canvas!: ElementRef<HTMLCanvasElement>;
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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route:  ActivatedRoute,
    private pixelartService: PixelartService,
    private renderer: Renderer2
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

    if (this.canvas.nativeElement.getContext('2d') !== null) {
      this.context = this.canvas.nativeElement.getContext('2d');
    }

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
    this.canvas.nativeElement.height = this.manageCanvasForm.value.height;
    this.canvas.nativeElement.width = this.manageCanvasForm.value.width;

    // this.canvasColor = this.manageCanvasForm.value.color;
    // this.manageCanvasForm.setValue({'height' : this.canvasHeight, 'width' : this.canvasWidth, 'color' : "#ff6347"}, {emitEvent: false});
    // this.canvas.nativeElement.setAttribute(display: 'block');
    this.renderer.setStyle(this.canvas.nativeElement, 'display', 'block');
    // this.renderer.setStyle(this.canvas.nativeElement, 'width', 200);
    // this.renderer.setStyle(this.canvas.nativeElement, 'height', 200);
    this.makeGrid(this.canvas.nativeElement.height, this.canvas.nativeElement.width);
  }

  makeGrid(height: number, width: number) {
    if (this.context) {
      for (let j = 0; j < height; j += 1) {
        if (this.isBackgroundGrey) {
          this.isBackgroundWhite = false;
          for (let i = 0; i < width; i += 1) {
            if (!this.isBackgroundWhite) {
              this.context.fillStyle = 'lightgrey';
              // this.context.fillRect(i, j, 1, 1);
              // this.isBackgroundWhite = !this.isBackgroundWhite;
            } else {
              this.context.fillStyle = 'white';
              // this.context.fillRect(i, j, 1, 1);
              // this.isBackgroundWhite = !this.isBackgroundWhite;
            }
            this.context.fillRect(i, j, 1, 1);
            this.isBackgroundWhite = !this.isBackgroundWhite;
          }
        } else {
          this.isBackgroundWhite = true;
          for (let i = 0; i < width; i += 1) {

            if (this.isBackgroundWhite) {
              this.context.fillStyle = 'white';
              // this.context.fillRect(i, j, 1, 1);
              // this.isBackgroundWhite = !this.isBackgroundWhite;
            } else {
              this.context.fillStyle = 'lightgrey';
              // this.context.fillRect(i, j, 1, 1);
              // this.isBackgroundWhite = !this.isBackgroundWhite;
            }
            this.context.fillRect(i, j, 1, 1);
            this.isBackgroundWhite = !this.isBackgroundWhite;
          }
        }
        this.isBackgroundGrey = !this.isBackgroundGrey;
      }
      this.context.stroke();
    }
  }
}
