import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { DetailComponent } from './pages/detail/detail.component';
import { UpdateComponent } from './pages/update/update.component';
import { CreateComponent } from './pages/create/create.component';
import { TestCreationComponent } from './pages/test-creation/test-creation.component';

const routes: Routes = [
  {
    // Path Pixelart Cards
    path: 'catalog',
    component: ListComponent
    // ,
    // canActivate: [AuthGuard]
  },
  {
    path: ':id',
    component: DetailComponent
    // ,
    // canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'catalog',
    pathMatch: 'full'
    // ,
    // canActivate: [AuthGuard]
  },
  {
    path: 'edit-pixelart/:id',
    component: UpdateComponent
    // ,
    // canActivate: [AuthGuard]
  }
  ,
  {
    path: 'create-pixelart',
    component: CreateComponent
    // ,
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
