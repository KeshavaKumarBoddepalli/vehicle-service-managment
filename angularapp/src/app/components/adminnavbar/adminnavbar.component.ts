import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-adminnavbar',
  templateUrl: './adminnavbar.component.html',
  styleUrls: ['./adminnavbar.component.css']
})
export class AdminnavbarComponent {
  showLogoutPopup = false;

  constructor(public service: AuthService) {}

  isUserLoggedIn(): boolean {
    return this.service.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.service.getRole() === 'ADMIN';
  }

  confirmLogout(): void {
    this.showLogoutPopup = true;
  }

  cancelLogout(): void {
    this.showLogoutPopup = false;
  }

  logout(): void {
    this.service.logout();
    this.showLogoutPopup = false;
  }

}