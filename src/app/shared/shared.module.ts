import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MaterialModules } from './shared.constant';
import { CoreModule } from '../core/core.module';



@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    ...MaterialModules,
    CoreModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    MaterialModules,
    CoreModule
  ]
})
export class SharedModule { }
