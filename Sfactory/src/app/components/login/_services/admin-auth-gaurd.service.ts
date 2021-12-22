import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class TenantAdminAuthGaurd implements CanActivate  {

  constructor(private authService: AuthService,  private router: Router) { }
  canActivate():boolean{

    let user_role = this.authService.currentUser;
    if(user_role &&  user_role['role_id'] == 1){
      return true
    }else{
      this.router.navigate(['/unauthorized']);
    }

  }

}




