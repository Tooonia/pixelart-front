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
import { HTTP_INTERCEPTORS } from '@angular/common/http';

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
