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
      return this.service.getRole() === 'USER';
    }
  
    confirmLogout(): void {
      this.showLogoutPopup = true;
    }
  
    cancelLogout(): void {
      this.showLogoutPopup = false;
    }
    showAppointmentsDropdown = false;
    showFeedbackDropdown = false;

  toggleAppointmentsDropdown() {
    this.showAppointmentsDropdown = !this.showAppointmentsDropdown;
    this.showFeedbackDropdown = false;
  }

  toggleFeedbackDropdown() {
    this.showFeedbackDropdown = !this.showFeedbackDropdown;
    this.showAppointmentsDropdown = false;
  }
  
  logout(): void {
      this.service.logout();
      this.showLogoutPopup = false;
  }

  closeAllDropdowns() {
    this.showAppointmentsDropdown = false;
    this.showFeedbackDropdown = false;
  }
  
}
