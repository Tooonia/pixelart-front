import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { DetailComponent } from './pages/detail/detail.component';
import { ListContainerComponent } from './components/list-container/list-container.component';
import { PixelartCardComponent } from './components/pixelart-card/pixelart-card.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { PixelartRoutingModule } from './pixelart-routing.module';
import { ManagePixelartComponent } from './components/manage-pixelart/manage-pixelart.component';
import { HomeComponent } from './pages/home/home.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { PixelartFormPageComponent } from './pages/pixelart-form-page/pixelart-form-page.component';


@NgModule({
  declarations: [
    DetailComponent,
    ListComponent,
    ListContainerComponent,
    PixelartCardComponent,
    ManagePixelartComponent,
    HomeComponent,
    PortfolioComponent,
    PixelartFormPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    PixelartRoutingModule
  ],
  exports: [
    ListContainerComponent,
    PixelartCardComponent,
    ManagePixelartComponent
  ]
})
export class PixelartModule { }