import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService,  private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    let user_role = this.authService.currentUser;
    if(user_role){
      if(user_role['role_id'] == 1000 || user_role['role_id'] == 1){
        return true
      }
      else if(user_role['role_id'] == 2 || user_role['role_id'] == 'MV1001'|| user_role['role_id']=='PV1001') {
        this.router.navigate(['/unauthorized']);
      }
    }
  }

}
