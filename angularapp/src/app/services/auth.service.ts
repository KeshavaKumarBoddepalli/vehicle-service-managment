import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  logout() {
      
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

