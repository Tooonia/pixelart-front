import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { PixelartService } from 'src/app/core/services/pixelart.service';
import { UserService } from 'src/app/core/services/user.service';
import { PixelartItem } from '../../model/pixelart-item';
import { UserGetItem } from '../../model/user-get-item';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  isSignedin = false;
  signedinUserEmail: string = '';
  pixelarts!: PixelartItem[];
  signedinUser!: UserGetItem;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private pixelartService: PixelartService
  ) { }

  ngOnInit(): void {
    this.isSignedin = this.authService.isUserSignedin();

    if (!this.authService.isUserSignedin()) {
      this.router.navigateByUrl('/signin');
      return;
    }

    this.loadUserPortfolio();
  }

  private loadUserPortfolio(): void {
    this.userService.getPrivateUserProfile().subscribe(data => {
      this.signedinUser = data;
      this.pixelartService.getAllPixelArtByUser(this.signedinUser.id).subscribe((data: PixelartItem[]) => {
        this.pixelarts = data;
        console.log('PortfolioComponent: Loaded pixelarts:', this.pixelarts);
      });
    });
  }
}
