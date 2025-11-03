// import { Component, OnInit } from '@angular/core';
// import { AuthService } from './services/auth.service';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent implements OnInit {
//   userRole: string = '';

//   constructor(private authService: AuthService) {}

//   ngOnInit(): void {
//     this.userRole = this.authService.getRole(); 
//   }

//   isUserLoggedIn(): boolean {
//     return this.authService.isLoggedIn();
//   }

//   isAdmin(): boolean {
//     return this.userRole === 'ADMIN';
//   }

//   isUser(): boolean {
//     return this.userRole === 'USER';
//   }
// }



import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  userRole: string = '';

  constructor(public authService: AuthService) {}

  // ngOnInit(): void {
  //   this.userRole = this.authService.getRole(); 
  // }

  // isUserLoggedIn(): boolean {
  //   return this.authService.isLoggedIn();
  // }

  // isAdmin(): boolean {
  //   return this.userRole === 'ADMIN';
  // }

  // isUser(): boolean {
  //   return this.userRole === 'USER';
  // }
}