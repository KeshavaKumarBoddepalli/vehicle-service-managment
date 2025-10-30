import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-usernavbar',
  templateUrl: './usernavbar.component.html',
  styleUrls: ['./usernavbar.component.css']
})
export class UsernavbarComponent {
    showLogoutPopup = false;

    constructor(public service: AuthService,public router:Router) {}
  
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
      this.router.navigate['/home'];
  }

  closeAllDropdowns() {
    this.showAppointmentsDropdown = false;
    this.showFeedbackDropdown = false;
  }
  
}
