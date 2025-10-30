import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-adminnavbar',
  templateUrl: './adminnavbar.component.html',
  styleUrls: ['./adminnavbar.component.css']
})
export class AdminnavbarComponent {
  showLogoutPopup = false;
  showSerDropdown: boolean;

  constructor(public service: AuthService , private router:Router) {}

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
    this.router.navigate(['/']);
  }


toggleSerDropdown(): void {
  this.showSerDropdown = !this.showSerDropdown;
}

closeDropdown(): void {
  this.showSerDropdown = false;
}


}