import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
   {
     path: 'create-pixelart',
     loadChildren: () => import('./pixelart/pixelart.module')
         .then(m => m.PixelartModule),
    // canActivate: [AuthGuard]
 }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
