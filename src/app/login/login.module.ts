import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { LoginRoutingModule } from './login-routing.module';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { PixelartModule } from '../pixelart/pixelart.module';



@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent,
    MyProfileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    LoginRoutingModule
    // ,
    // PixelartModule //Elvileg nem kell ez ide megsem! A model-ek miatt kerult ide, h hozzaferjen!
  ]
})
export class LoginModule { }
