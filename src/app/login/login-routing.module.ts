import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full'
    // canActivate: [AuthGuard]
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'my-profile',
    component: MyProfileComponent,
    // canActivate: [AuthGuard]
  },
  {
    // Wildcard Path
    path: '**',
    redirectTo: ''
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
export class LoginRoutingModule { }
