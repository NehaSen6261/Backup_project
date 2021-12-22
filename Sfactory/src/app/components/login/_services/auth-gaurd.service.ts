import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGaurd {

  constructor(private authService: AuthService,  private router: Router) { }
  canActivate(route, state: RouterStateSnapshot): boolean{
    let user_role = this.authService.currentUser;
    if (this.authService.isLoggedIn()){
      return true
    }
    else{
      this.router.navigate(['/'], {queryParams:{ returnUrl :  state.url}});
      return false
    }
  }

}
