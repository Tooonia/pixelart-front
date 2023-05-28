import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  @ViewChild('toggleButton') toggleButton!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;
  title = 'pixelart-front';
  alias!: string;
  email!: string;
  isLoggedIn = false;
  username?: string;

  constructor(private authService: AuthService,
              private renderer: Renderer2,
              private router: Router) {
    // When there is a click outside of the hamburger button, it closes the hambuerger menu on xs screen:
    this.renderer.listen('document', 'click',(e:Event)=>{
      if(e.target !== this.toggleButton.nativeElement ){
        this.renderer.removeClass(this.menu.nativeElement, 'show');
      }
    });
  }

  ngOnInit(): void {
    //'!!' returns a boolean value, true-ish if value is not 'null' or 'undefined'.
    this.isLoggedIn = !!this.authService.getToken();
    // if (this.isLoggedIn) {
    //   const user = this.tokenStorageService.getUser();
    //   // const user = this.tokenStorageService.getUser();
    //   // this.roles = user.roles;
    //   // this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
    //   // this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
    //   this.username = user.alias;
    this.email = this.authService.getSignedinUser();
    // console.log('In header the email: ' + this.email); //WORKS!
    //   this.email = user.email;
    // }
  }

  logout(): void {
    this.authService.signOut();
    this.isLoggedIn = false;
  }
}






// // 1st SOLUTION ORIGINALLY IN THAT CLASS:
// // export class HeaderComponent implements OnInit { <<< Why without OnInit?
// export class HeaderComponent {

//   // Is the collapsable element is collapsed? (For menu burger)
//   isCollapsed = true;

//   // Are we connected?
//   isConnectedAsUser = false;

//   constructor(
//     public router: Router
//   ) { }

//   // Click event on Logo pixel avatar
//   handleClickGoMonCompte(): void {
//     // If we are connected: open menu list of connected user: (this.open()?)
//     if (this.isConnectedAsUser) {
//       // TODO: create component!
//         // this.router.navigate(['/myaccount']);
//     }
//     // Not connected ? go /login
//     else {
//         this.router.navigate(['/login']);
//     }
// }
// handleClickChangeLanguage(): void {
//   // TODO!!!
// }

// }


// THE .HTML THAT COMES WITH THAT PREVIOUS 1ST SOLUTION CODE:
// <div class="header-container">
//     <div>
// <!--<div *ngIf="mediaSize.isLg || mediaSize.isXl || mediaSize.isXxl">  -->
//         <nav ngxNavbarDynamicExpand class="header-nav navbar navbar-expand navbar-light bg-light" aria-label="navbar-desktop">
//             <div>
//                 <!-- <img  width="100" height="100" > -->
//                 <img class="header-logo pl-3" src="https://s5.postimg.cc/dile2165z/Flower_Image.png" alt="Flower_Image">
//                 <div class="project-name">PixelArt</div>
//             </div>
//             <!-- <ngx-navbar-collapse class="justify-content-end pr-3"> -->
//             <!-- This #collapse is needed for small screens:-->
//             <ngx-navbar-collapse class="justify-content-end pr-3" #collapse="ngxNavbarCollapse">
//                 <ul class="navbar-nav mt-2 mt-lg-0 mr-2">
//                     <li class="nav-item" >
//                         <a class="nav-link pr-3"
//                         routerLinkActive="active"

//                         routerLink="pixelart/create-pixelart">
//                         <!-- <a class="nav-link pr-3"
//                         routerLinkActive="active"
//                         href="#"
//                         routerLink="/create-pixelart">  -->
//                     <!-- HERE: without href:
//                     <li class="nav-item">
//                         <a class="nav-link pr-3" href="#"
//                         rel="noopener noreferrer"
//                         routerLinkActive="active-item"
//                         routerLink="create-pixelart">  -->
//                         <!-- TODO: href / routerLink, duplicated here or OK?
//                         + "Create art" to : {{'header.createart'| translate}}-->
//                         Create art</a>
//                         <!-- Create art</a> -->
//                     </li>
//                     <li class="nav-item">
//                         <a class="nav-link pr-3"
//                         routerLinkActive="active"
//                         routerLink="pixelart/catalog"
//                         rel="noreferrer">
//                         <!-- Still inside <a> element: [routerLinkActive]="'active'" -->
//                         <span>Catalog</span></a>
//                     </li>
//                     <li class="nav-item">
//                         <a class="nav-link pr-3"
//                         routerLinkActive="active"
//                         routerLink="how-to"
//                         rel="noopener noreferrer">
//                         <!-- Still inside <a> element: [routerLinkActive]="'active'" -->
//                         <span>How to?</span></a>
//                     </li>
//                     <li class="nav-item">
//                         <a class="nav-link pr-3" href="#"
//                         (click)="handleClickChangeLanguage()"

//                         rel="noopener noreferrer">
//                         <!-- Still inside <a> element: [routerLinkActive]="'active'" -->
//                         <img src="../../../assets/icons/language_france.png" alt="Logo language option"></a>
//                     </li>
//                     <li class="nav-item">
//                         <a class="nav-link pr-3" href="#"
//                         routerLink="login"
//                         (click)="handleClickGoMonCompte()"

//                         rel="noopener noreferrer">
//                         <!-- routerLink="pixelart/login" -->
//                         <!-- Still inside <a> element: [routerLinkActive]="'active'" -->
//                         <div class="notification-connected" *ngIf="isConnectedAsUser"></div>
//                         <!-- TODO: Add a sort of nav list when connected user -->
//                         <img src="../../../assets/icons/pixel_avatar.png" alt="Logo pixel avatar"></a>
//                     </li>
//                 </ul>
//             </ngx-navbar-collapse>
//             <!-- That would be the bloc if other way does not work:
//              <div class="collapse navbar-collapse justify-content-end pr-3" id="navbarNavAltMarkup">
//                 <div class="navbar-nav">
//                 <a class="nav-item nav-link active pr-3" href="#" routerLink="create-pixelart">Create art <span class="sr-only">(current)</span></a>
//                 <a class="nav-item nav-link active pr-3" href="#" routerLink="catalog">Catalog <span class="sr-only">(current)</span></a>
//                 <a class="nav-item nav-link active pr-3" href="#" routerLink="how-to">How to?<span class="sr-only">(current)</span></a>
//                 <a class="nav-item nav-link pr-3" href="#" routerLink="language">
//                     <img src="../../../assets/icons/language_france.png" alt="Logo language option">
//                 </a>
//                 <a class="nav-item nav-link pr-3" href="#" routerLink="login">
//                     <img src="../../../assets/icons/pixel_avatar.png" alt="Logo pixel avatar">
//                 </a>
//                 </div>
//             </div> -->
//         </nav>
//     </div>
//     <!-- Bloc to develop: <div *ngIf="mediaSize.isSm || mediaSize.isMd"> -->
// </div>