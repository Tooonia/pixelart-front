import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
   {
    //  path: 'create-pixelart',
     path: 'pixelart',
     loadChildren: () => import('./pixelart/pixelart.module')
         .then(m => m.PixelartModule),
    // canActivate: [AuthGuard]
 },
 {
  // Empty Path
  path: '',
  redirectTo: 'pixelart',
  pathMatch: 'full'
  // ,
  // canActivate: [AuthGuard]
}
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // When set to enabled or enabledBlocking, the initial navigation starts 
    // before the root component is created. The bootstrap is blocked until the initial navigation is complete. 
    // This value is required for server-side rendering to work.
    // initialNavigation: 'enabled'
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
