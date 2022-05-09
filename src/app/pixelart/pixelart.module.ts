import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { DetailComponent } from './pages/detail/detail.component';
import { ListContainerComponent } from './components/list-container/list-container.component';
import { PixelartCardComponent } from './components/pixelart-card/pixelart-card.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    DetailComponent,
    ListComponent,
    ListContainerComponent,
    PixelartCardComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class PixelartModule { }
