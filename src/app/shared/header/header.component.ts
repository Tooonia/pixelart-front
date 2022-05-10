import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

// export class HeaderComponent implements OnInit { <<< Why without OnInit?
export class HeaderComponent {

  // Is the collapsable element is collapsed? (For menu burger)
  isCollapsed = true;

  // Are we connected?
  isConnectedAsUser = false;

  constructor(
    public router: Router
  ) { }

  // Click event on Logo pixel avatar
  handleClickGoMonCompte(): void {
    // If we are connected: open menu list of connected user: (this.open()?)
    if (this.isConnectedAsUser) {
        // this.router.navigate(['/myaccount']);
    }
    // Not connected ? go /login
    else {
        this.router.navigate(['/login']);
    }
}
handleClickChangeLanguage(): void {
  
}

}
