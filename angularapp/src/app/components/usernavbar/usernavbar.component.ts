import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-usernavbar',
  templateUrl: './usernavbar.component.html',
  styleUrls: ['./usernavbar.component.css']
})
export class UsernavbarComponent {
    showLogoutPopup = false;

    constructor(public service: AuthService) {}
  
    isUserLoggedIn(): boolean {
      return this.service.isLoggedIn();
    }
  
    isCustomer(): boolean {
      return this.service.getRole() === 'user';
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
