import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
// import { YourAuthService } from ''; // Update with actual path

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angularapp';
  userRole: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getRole(); // Make sure this returns 'ADMIN' or 'USER'
  }

  isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }

  isUser(): boolean {
    return this.userRole === 'USER';
  }
}