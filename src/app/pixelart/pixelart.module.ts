import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { DetailComponent } from './pages/detail/detail.component';
import { ListContainerComponent } from './components/list-container/list-container.component';
import { PixelartCardComponent } from './components/pixelart-card/pixelart-card.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { PixelartRoutingModule } from './pixelart-routing.module';
import { UpdateComponent } from './pages/update/update.component';
import { ManagePixelartComponent } from './components/manage-pixelart/manage-pixelart.component';
import { CreateComponent } from './pages/create/create.component';
import { HomeComponent } from './pages/home/home.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';


@NgModule({
  declarations: [
    DetailComponent,
    ListComponent,
    ListContainerComponent,
    PixelartCardComponent,
    UpdateComponent,
    ManagePixelartComponent,
    CreateComponent,
    HomeComponent,
    PortfolioComponent
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
