import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user = {
    username: '',
    email: '',
    mobile: '',
    avatar: 'assets/profilelogo.webp' 
  };

  constructor() { }

  ngOnInit(): void {
  }

}


