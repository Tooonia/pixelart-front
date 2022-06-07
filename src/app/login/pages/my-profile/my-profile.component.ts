import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  
  isSignedin = false;

	signedinUser: string = '';

	greeting: any[] = [];

	constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private authService: AuthService) {}

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
  deleteAccount(): void {
    
  }
  
  
  
  // 1st solution-hoz
  // currentUser: any;
  
  // constructor(private token: TokenStorageService) { }

  // ngOnInit(): void {
  //   // this.currentUser = this.token.getUser();
  // }

}
