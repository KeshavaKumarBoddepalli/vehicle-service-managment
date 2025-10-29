import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  canActivate(): boolean {
    let role = localStorage.getItem('userRole');
    if(role == undefined || role !='ADMIN') return false;
    return true;
  }
  
}