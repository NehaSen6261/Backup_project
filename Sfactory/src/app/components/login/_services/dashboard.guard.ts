import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {
  constructor(private authService: AuthService,  private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let user_role = this.authService.currentUser;
      if(user_role){
      
      if(user_role['role_id'] == 1000 ||
       user_role['role_id'] == 1 ||user_role['role_id'] == 2 || user_role['role_id'] == 'MV1001'
         || user_role['role_id']=='WCA1001' || user_role['role_id']=='WCV1001'
         || user_role['role_id']=='ASA1001' || user_role['role_id']=='ASV1001'){
        return true
      }
     
      else{
        this.router.navigate(['/unauthorized']);
      }
    }
  }
  
}
