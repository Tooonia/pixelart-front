import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PixelartItem } from '../../model/pixelart-item';
//TODO: documention to write for that class!!! Purpose of it?


@Component({
  selector: 'app-manage-pixelart',
  templateUrl: './manage-pixelart.component.html',
  styleUrls: ['./manage-pixelart.component.scss']
})
export class ManagePixelartComponent implements OnInit {
  // TODO: without in Rudi, public for Jeremy
  public managePixelartForm!: FormGroup;
  @Input() pixelartItem!: PixelartItem;
  @Output() savedAction = new EventEmitter<PixelartItem>();
  @Output() cancelledAction = new EventEmitter<PixelartItem>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
    ) { }

  // Test validity of form
  get isValid(): boolean {
    return this.managePixelartForm.valid;
  }

  ngOnInit(): void {
    this.managePixelartForm = this.formBuilder.group( {
      // title: ['this.pixelartItem.name']
      // id: [''],
      name: ['']

      // id: [this.pixelartItem.id]
    })
  }

  public saveAction(): void {
    console.log("Current form: ", this.managePixelartForm);
    console.log("Form has been submitted: ", this.managePixelartForm.value);
// Previously, but I think this is not the managePixelartForm that should be sent with emit:
    // this.savedAction.emit(this.managePixelartForm.value);
    this.pixelartItem = this.managePixelartForm.value;
    this.savedAction.emit(this.pixelartItem);
  }
// reuse-declaration.component.ts, clickCancel()
  public cancelAction(): void {
    // TODO: with route-history.service.ts, to goBackIfPossibleToGoBack()
    // specially when updatePixelArt: we must go back to Details!!!
    // CREATE can go back to catalog!
    // TODO/QUESTION: correct?: emit(this.managePixelartForm.value)
    // Previously, but I think this is not the managePixelartForm that should be sent with emit:
    // this.cancelledAction.emit(this.managePixelartForm.value)
    this.pixelartItem = this.managePixelartForm.value; //TODO: amikor forditva voltak az = ket vegen, nem mukodott!!!
    this.cancelledAction.emit(this.pixelartItem); //TODO: maybe no need to have an eventemitter<PixelItem> on that function?
  }
}
