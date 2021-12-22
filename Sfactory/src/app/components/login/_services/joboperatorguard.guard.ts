import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class JoboperatorguardGuard implements CanActivate {
  constructor(private authService: AuthService,  private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let user_role = this.authService.currentUser;
      if(user_role){
        if(user_role['role_id'] == "JB1001"){
            return true
        }
        else{
          this.router.navigate(['/unauthorized']);
        }
      }
  }
  
}
