import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pixelart/pages/home/home.component';

const routes: Routes = [
  {
    // Path Canvas TODO: esetleg kulonvenni a pixelart folder-bol!
    path: 'home',
    // loadChildren: () => import('./pixelart/pixelart.module')
    //      .then(m => m.PixelartModule),
    component: HomeComponent
    // ,
    // canActivate: [AuthGuard]
  },
   {
    //  path: 'create-pixelart',
     path: 'pixelart',
     loadChildren: () => import('./pixelart/pixelart.module')
         .then(m => m.PixelartModule),
    // canActivate: [AuthGuard]
 },
 {
  path: 'login',
  loadChildren: () => import('./login/login.module')
      .then(m => m.LoginModule),
  // canActivate: [AuthGuard]
},
 {
  // Empty Path
  path: '',
  redirectTo: 'pixelart',
  pathMatch: 'full',
  // canActivate: [AuthGuard]
}
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // When set to enabled or enabledBlocking, the initial navigation starts 
    // before the root component is created. The bootstrap is blocked until the initial navigation is complete. 
    // This value is required for server-side rendering to work.
    // initialNavigation: 'enabled'
    // Jeremy-nel ellenben igy:
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
