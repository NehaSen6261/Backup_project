import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TenantAdnVwrAuthGaurdService {

  constructor(private authService: AuthService,  private router: Router) { }
  canActivate():boolean{

    let user_role = this.authService.currentUser;
    if(user_role){
      if(user_role['role_id'] == 1 || user_role['role_id'] == 2){
        return true
      }else{
        this.router.navigate(['/unauthorized']);
      }
    }


  }
}

