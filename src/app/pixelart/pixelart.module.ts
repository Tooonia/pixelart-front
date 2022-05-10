import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { DetailComponent } from './pages/detail/detail.component';
import { ListContainerComponent } from './components/list-container/list-container.component';
import { PixelartCardComponent } from './components/pixelart-card/pixelart-card.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { PixelartRoutingModule } from './pixelart-routing.module';



@NgModule({
  declarations: [
    DetailComponent,
    ListComponent,
    ListContainerComponent,
    PixelartCardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    PixelartRoutingModule
  ],
  exports: [
    ListContainerComponent,
    PixelartCardComponent
  ]
})
export class PixelartModule { }
