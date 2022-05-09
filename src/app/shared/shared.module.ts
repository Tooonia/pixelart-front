import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MaterialModules } from './shared.constant';



@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    ...MaterialModules
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    MaterialModules
  ]
})
export class SharedModule { }
