import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component'
import { AuthService } from '../../login/_services/auth.service';
import { userprofile } from 'src/environments/urls';
import { tenant } from 'src/environments/urls';

@Injectable({
  providedIn: 'root'
})
export class UserprofileService {

    // urls variables
    private update_userprofile = userprofile.User_profile;
    private tenant_info = tenant.tenant_Info;

    message_text:string;
    action = "Dismiss";
    response_status:string;

  constructor(
        private http: HttpClient,
        private authService: AuthService,
        private snackBar: SnackbarComponent
        ) { }


   // This function will call the API for PUT method to particular user details based on email.
 putUserProfileS(user_data){
  return this.http.put(this.update_userprofile+this.authService.currentUser['email'], user_data).pipe(map(response=>{  
    if(response['Successful']){
      this.response_status = "Successful";
      this.message_text = response['Successful'];
      this.snackBar.top_snackbar(this.message_text ,this.response_status);
    }else{
      this.response_status = "Unsuccessful";
      this.message_text = response['Unsuccessful'];
      this.snackBar.top_snackbar(this.message_text ,this.response_status);
    }
}));
}


 // This function will call the API for GET method, It will display the tenant information based on tenant id.
getTenantInfoS(){
  return this.http.get(this.tenant_info+this.authService.currentUser['tenant_id']);
}

}
