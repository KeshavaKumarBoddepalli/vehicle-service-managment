import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  showLogoutPopup = false;

  constructor(public service: AuthService) {}

  isUserLoggedIn(): boolean {
    return this.service.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.service.getRole() === 'admin';
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