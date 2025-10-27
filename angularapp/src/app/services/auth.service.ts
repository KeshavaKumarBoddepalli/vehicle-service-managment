import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Login } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private httpClient : HttpClient) { }
  
  public baseUrl = "https://8080-cddcccedbacfffceebfaeeaaeddacfffbcfdda.premiumproject.examly.io/api/user";

  

  registerUser(user : User) : Observable<User> {
     return this.httpClient.post<User>(this.baseUrl  + "/register", user);
  }

  loginUser(loginDto :Login) : Observable<any> {
      return this.httpClient.post<any>(this.baseUrl + "/login",  loginDto);
  }

  setUser(user : User){
    this.userSubject.next(user);
  }

 

}