import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  register(value: any):Observable<any> {
    throw new Error('Method not implemented.');
  }
  login(username: string, password: string):Observable<any> {
    throw new Error('Method not implemented.');
  }
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

