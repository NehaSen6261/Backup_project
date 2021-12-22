import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { login} from 'src/environments/urls';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   //  defining urls.
   private login_url = login.Login;
   invalid_usrlogin:string;

  constructor(private http: HttpClient, private router: Router) { }


  // login method.
  login(credentials) {
    return this.http.post(this.login_url, credentials).pipe(map(respone => {
      let result = respone;
      if (result && result['token']){
        localStorage.setItem('token', result['token']);
        return true;
      }else{
        this.invalid_usrlogin = respone['Unsuccessful'];
        return false;
      }

    }, error =>{
    }));
   }


  //  returns logged in or
isLoggedIn() {
    return !!localStorage.getItem('token');
 }

//  returns current user details.
 get currentUser(){
  let token = localStorage.getItem('token');
   if(!token){
     return null
   }else{
     return new JwtHelperService().decodeToken(token);
   }
}

 // logout functionality.
 logout() {
  this.router.navigate(['/']);
  localStorage.removeItem('token');
  localStorage.removeItem('analysis_gtw');
  localStorage.removeItem('analysis_key');
  localStorage.removeItem('analysis_device');
  localStorage.removeItem('subtenant_id');
  localStorage.removeItem('user_emailid');
  localStorage.removeItem('user_role');
  localStorage.removeItem('drule_id');
  localStorage.removeItem('setFirstName');
  localStorage.removeItem('setEmail');
  localStorage.removeItem("fpsw_email");
  localStorage.removeItem("generated_otp");
  localStorage.removeItem('analysis_attr_id');
  localStorage.removeItem("analysis_datatype");
  localStorage.removeItem('analysis_uom');
  localStorage.removeItem('selected_device_info');
  localStorage.removeItem('command_master_id');
  localStorage.removeItem('selected_asset');
  localStorage.removeItem('selected_asset_name');
  localStorage.removeItem('selected_metrics_type');
 }
}
