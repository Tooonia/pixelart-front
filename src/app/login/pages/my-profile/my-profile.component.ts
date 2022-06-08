import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  
  @Input() idUser!: number;
  isSignedin = false;

	signedinUser: string = '';

	greeting: any[] = [];

  private basePath = 'http://localhost:8085/api';

	constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService) {}

	ngOnInit() {
		this.isSignedin = this.authService.isUserSignedin();
		this.signedinUser = this.authService.getSignedinUser();

		if(!this.authService.isUserSignedin()) {
			this.router.navigateByUrl('/signin');
		}

		// if(this.isSignedin) {
		// 	this.greetingService.getByUserRole().subscribe((result: string) => this.greeting.push(result), () => console.log('/user - You are not authorize'));
		// 	this.greetingService.getByAdminRole().subscribe((result: string) => this.greeting.push(result), () => console.log('/admin - You are not authorized'));
		// 	this.greetingService.getByUserOrAdminRole().subscribe((result: string) => this.greeting.push(result), () => console.log('/userOrAdmin - You are not authorized'));
		// 	this.greetingService.getByAnonymousRole().subscribe((result: string) => this.greeting.push(result), () => console.log('/anonymous - You are not authorized'));
		// }
	}
  
  signout(): void {
    this.authService.signOut();
    window.location.reload();

  }
  deleteAccount(idUser: number): void {
    // idUser = 25;
    this.userService.deleteAccount(idUser).subscribe((resp) => {
      console.log("Delete OK: ", resp)
    });
    this.authService.signout();
    // window.location.reload();
    // this.router.navigate(['/pixelart/catalog'])
  }

  
  
  
  // 1st solution-hoz
  // currentUser: any;
  
  // constructor(private token: TokenStorageService) { }

  // ngOnInit(): void {
  //   // this.currentUser = this.token.getUser();
  // }

}
