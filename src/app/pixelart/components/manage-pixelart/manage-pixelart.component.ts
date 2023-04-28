import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class ManagePixelartComponent implements OnInit {
  // TODO: without in Rudi, public for Jeremy, azt hiszem, a default a public:
  managePixelartForm!: FormGroup;
  @Input() pixelartItem!: PixelartItem;
  @Output() savedAction = new EventEmitter<PixelartItem>();
  @Output() cancelledAction = new EventEmitter<PixelartItem>();
  editMode: boolean = false;
  id!: number;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route:  ActivatedRoute,
    private pixelartService: PixelartService
    ) { }

  // Test validity of form
  get isValid(): boolean {
    return this.managePixelartForm.valid;
  }

  ngOnInit(): void {
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
              console.log('EZ ?' + this.pixelartItem.user); //object Object csak az eredmeny!!!???
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
}
