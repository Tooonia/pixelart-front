import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxNavbarModule } from 'ngx-bootstrap-navbar';
import { CoreModule } from './core/core.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthInterceptorService } from './core/helpers/auth-interceptor.service'
// import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {NoopInterceptor} from "./http-interceptors/noop-interceptor";
import {httpInterceptorProviders} from "./http-interceptors";
import { EmailAliasValidatorDirective } from './core/helpers/email-alias-validator.directive';
import { NG_ASYNC_VALIDATORS } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxNavbarModule,
    CoreModule,
    NgbModule
  ],
  providers: [
    httpInterceptorProviders
    ,
    // EmailAliasValidatorDirective
    {provide: NG_ASYNC_VALIDATORS,
    useExisting: EmailAliasValidatorDirective, multi: true}
  //   {
  //   provide: HTTP_INTERCEPTORS,
  //   useClass: AuthInterceptorService,
  //   multi: true
  // }

  ],
  // providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
