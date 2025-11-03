<<<<<<< HEAD
=======

>>>>>>> origin/main
import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
 
@Component({
  selector: 'app-adminnavbar',
  templateUrl: './adminnavbar.component.html',
  styleUrls: ['./adminnavbar.component.css']
})
export class AdminnavbarComponent implements OnInit {
  showLogoutPopup = false;
  showSerDropdown: boolean;
<<<<<<< HEAD
 
  constructor(public service: AuthService, private router: Router) {}
 
=======

  constructor(public service: AuthService, private router: Router) {}

>>>>>>> origin/main
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.showLogoutPopup = false;
      }
    });
  }
<<<<<<< HEAD
 
=======

>>>>>>> origin/main
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
<<<<<<< HEAD
 
=======

>>>>>>> origin/main
  toggleSerDropdown(): void {
    this.cancelLogout;
    this.showSerDropdown = !this.showSerDropdown;
  }
<<<<<<< HEAD
 
=======

>>>>>>> origin/main
  closeDropdown(): void {
    this.showSerDropdown = false;
  }
}