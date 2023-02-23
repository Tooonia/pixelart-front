import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
// import { TokenStorageService } from './core/services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pixelart-front';

  // 1st solution
  // private roles: string[] = [];
  // 1st solution
  // private roles: string[] = [];

   alias!: string;
   email!: string;

  isLoggedIn = false;
  // showAdminBoard = false;
  // showModeratorBoard = false;
  username?: string;
  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    this.isLoggedIn = !!this.authService.getToken();
    // if (this.isLoggedIn) {
    //   const user = this.tokenStorageService.getUser();
    //   // const user = this.tokenStorageService.getUser();
    //   // this.roles = user.roles;
    //   // this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
    //   // this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
    //   this.username = user.alias;
      this.email = this.authService.getSignedinUser();
    //   this.email = user.email;
    // }
  }
  logout(): void {
    this.authService.signOut();
    window.location.reload();
  }
}

