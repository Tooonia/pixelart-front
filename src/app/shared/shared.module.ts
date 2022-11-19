import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MaterialModules } from './shared.constant';
import { CoreModule } from '../core/core.module';
import { RouterModule } from '@angular/router';
import { PixelartModule } from '../pixelart/pixelart.module';



@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    ...MaterialModules,
    CoreModule,
    // Routermodule needed to be imported so routerLink could work inside the header.component!
    RouterModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    MaterialModules
  ]
})
export class SharedModule { }
