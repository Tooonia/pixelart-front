import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PixelartService } from './services/pixelart.service';
import {httpInterceptorProviders} from "../http-interceptors";
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';

// TODO: see if needs to be completed or not!!!
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    httpInterceptorProviders,
    PixelartService,
    UserService,
    AuthService
  ]
})
export class CoreModule { }
