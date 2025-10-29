
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

export const AUTHENTICATED_USER = 'authenticatedUser';
export const TOKEN = 'token';
export const PAGE_ID = 'pageId';
export const USER_ID = 'userId';
export const ROLE = 'role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  public baseUrl = "https://8080-cddcccedbacfffceebfaeeaaeddacfffbcfdda.premiumproject.examly.io/api";

 
  constructor(private http: HttpClient) { }

  register(user : User) : Observable<any> {
    return this.http.post(`${this.baseUrl}/register`,user);
  }

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, { username, password }).pipe(
      map(
        data => {
          localStorage.setItem(USER_ID, "" + data.userId);
          localStorage.setItem(AUTHENTICATED_USER, username);
          // localStorage.setItem(TOKEN, `Bearer ${data.token}`);
          localStorage.setItem(ROLE, data.userRole);
          return data;
        }
      )
    );
  }

  getRole(): string {
    return this.getAuthenticatedRole();
  }

  isLoggedIn(): boolean {
    let user = localStorage.getItem(AUTHENTICATED_USER);
    return !(user == null);
  }
  logout(): void { localStorage.clear(); }
  isAdmin(): boolean { return this.getAuthenticatedRole() === 'ADMIN'; }
  isUser(): boolean { return this.getAuthenticatedRole() === 'USER'; }

  getAuthenticatedUserId(): number {
    return parseInt(localStorage.getItem(USER_ID) || "0");
  }

  getAuthenticatedUser() {
    return localStorage.getItem(AUTHENTICATED_USER);
  }

  getAuthenticatedRole() {
    return localStorage.getItem(ROLE);
  }

  getAuthenticatedToken() {
    if (this.getAuthenticatedUser())
      return localStorage.getItem(TOKEN);
  }

  pageId(): string {
    var pageId = localStorage.getItem(PAGE_ID);
    if (pageId === null) {
      localStorage.setItem(PAGE_ID, 'login');
    }
    return pageId;
  }

  setPageId(pageId: string) {
    localStorage.setItem(PAGE_ID, pageId);
  }

}

