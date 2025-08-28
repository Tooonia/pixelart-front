import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { DetailComponent } from './pages/detail/detail.component';
import { ListContainerComponent } from './components/list-container/list-container.component';
import { PixelartCardComponent } from './components/pixelart-card/pixelart-card.component';
import { CoreModule } from '../core/core.module';
import { PixelartRoutingModule } from './pixelart-routing.module';
import { UpdateComponent } from './pages/update/update.component';
import { ManagePixelartComponent } from './components/manage-pixelart/manage-pixelart.component';
import { CreateComponent } from './pages/create/create.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    DetailComponent,
    ListComponent,
    ListContainerComponent,
    PixelartCardComponent,
    UpdateComponent,
    ManagePixelartComponent,
    CreateComponent,
    PortfolioComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    PixelartRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  exports: [
    ListContainerComponent,
    PixelartCardComponent,
    ManagePixelartComponent
  ]
})
export class PixelartModule { }
