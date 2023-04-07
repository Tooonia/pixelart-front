import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { DetailComponent } from './pages/detail/detail.component';
import { UpdateComponent } from './pages/update/update.component';
import { CreateComponent } from './pages/create/create.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';

/**
 * Routes here are preceded by "/pixelart" as in app-routing.module.ts
 */
const routes: Routes = [
  {
    path: '',
    redirectTo: '/catalog',
    pathMatch: 'full'
    // ,
    // canActivate: [AuthGuard]
  },
  {
    // Path Pixelart Cards
    path: 'catalog',
    component: ListComponent
    // canActivate: [AuthGuard]
  },
  {
    // Paths need to be declared in the right order: https://angular.io/guide/router#route-order
    // Eg.: when that particular declared later in that list, then not recognized and component not rendered in the browser!
    path: 'create-pixelart',
    component: CreateComponent
    // canActivate: [AuthGuard]
  },
  {//TODO: check if this is the right order in that routing list, or position needs to be changed!
    path: 'user/:id',
    component: PortfolioComponent
    // canActivate: [AuthGuard]
  },
  {//TODO: check if this is the right order in that routing list, or position needs to be changed!
    path: 'my-pixelart',
    component: PortfolioComponent
    // canActivate: [AuthGuard]
  },
  {
    path: ':id',
    component: DetailComponent
    // ,
    // canActivate: [AuthGuard]
  },
  {
    path: 'edit-pixelart/:id',
    component: UpdateComponent
    // ,
    // canActivate: [AuthGuard]
  },
  {
   // Wildcard Path
   path: '**',
   redirectTo: '/catalog'
   // canActivate: [AuthGuard]
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PixelartRoutingModule { }
