import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInUser: any = null
  constructor() {
    const userData = localStorage.getItem('loggedInUser');
    if (userData) {
      this.loggedInUser = JSON.parse(userData);
    }
  }

  logout() {
      
  }
  
  getLoggedInUser(): any {
    return this.loggedInUser;
  }

  getRole():string {
    return 'user';
      
  }

  
  getAuthenticatedUser(){

  }


  isLoggedIn():boolean {
    return false;
      
  }
  

}

