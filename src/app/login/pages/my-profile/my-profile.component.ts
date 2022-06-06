import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  currentUser: any;
  
  constructor(private token: TokenStorageService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }

}
