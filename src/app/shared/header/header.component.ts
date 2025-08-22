import { Component, ElementRef, OnInit, Renderer2, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  @ViewChild('dropdownToggle') dropdownToggle!: ElementRef;
  title = 'pixelart-front';
  alias!: string;
  email!: string;
  isLoggedIn = false;
  username?: string;
  isDropdownOpen = false;
  isMobileMenuOpen = false;

  constructor(private authService: AuthService,
              private renderer: Renderer2,
              private router: Router) {
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.dropdownToggle && !this.dropdownToggle.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (window.innerWidth > 768) {
      this.closeMobileMenu();
    }
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

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.updateBodyScroll();
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.updateBodyScroll();
  }

  private updateBodyScroll(): void {
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}
