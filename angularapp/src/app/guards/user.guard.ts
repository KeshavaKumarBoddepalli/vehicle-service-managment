import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  canActivate(): boolean {
    let role = localStorage.getItem('userRole');
    if(role == undefined || role != 'USER') return false;
    return true;
  }
  
}
