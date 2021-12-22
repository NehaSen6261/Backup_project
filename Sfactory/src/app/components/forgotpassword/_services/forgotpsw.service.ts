import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../login/_services/auth.service';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { otp, forgotpassword } from 'src/environments/urls';




@Injectable({
  providedIn: 'root'
})
export class ForgotpswService {
  error_status= "Error";
    // urls variables
    private generate_otp = otp.Otp;
    private forgot_password = forgotpassword.Forgot_password;


  constructor( private http: HttpClient,
               private snackbar: SnackbarComponent) { }

// This function will call the API for GET method, It will  generated the OTP by email id.
  getOtpS(email:string){
  return this.http.get(this.generate_otp + email);
}

//  This function will reset the password
forgetPassword(email:string, update_data:any){
  return this.http.put(this.forgot_password+email, update_data).pipe(map(response=>{
    if(response["NotMatched"]){
      this.snackbar.top_snackbar(response["NotMatched"],this.error_status);
    }
    if(response['Unsuccessful']){
      this.snackbar.top_snackbar(response['Unsuccessful'],this.error_status);
    }else{
      this.snackbar.top_snackbar(response['Successful'],this.error_status);
    }
  }));
}

}
