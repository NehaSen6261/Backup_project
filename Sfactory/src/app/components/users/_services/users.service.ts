import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../login/_services/auth.service';
import { users } from 'src/environments/urls';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { userprofile } from 'src/environments/urls';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private tenant_users = users.Tenant_Users;
  private post_user = users.post_user;
  private put_user = users.put_user;
  private delete_user = users.delete_user;
  private subtenant_users = users.SubTenant_Users;
  private post_sub_tenant_user = users.post_sub_tenant_user;
  private update_userprofile = userprofile.User_profile;
  private put_subtenant_usr = users.put_sub_tenant_user;
  private delete_tenant_users = users.Delete_Tenant_Users;
  private delete_sub_tenant_user = users.delete_sub_tenant_user;
  private get_Tenant_User_Info = users.get_Tenant_User_Info;
  private get_sub_Tenant_User_Info = users.get_SubTenant_User_Info;
  private get_tenant_users_list = users.get_tenant_users_list;

  message_text:any;
  action = "Dismiss";
  response_status:string;

  constructor(
              private http: HttpClient,
              private authService: AuthService,
              private snackBar: SnackbarComponent,
              private router:Router
            ) { }




 //  This method will create a account user, factory user and guest user.
 postUserS(post_data:any){
  return this.http.post(this.post_user, post_data).pipe(map(response=>{
    if(response['Successful']){
      this.message_text = response['Successful'];
      this.response_status = "Successful";
      this.snackBar.top_snackbar(this.message_text ,this.response_status);
    }else{
      this.response_status = "Unsuccessful";
      this.message_text = response['Unsuccessful'];
      this.snackBar.top_snackbar(this.message_text ,this.response_status);
    }
  }));

 }


 // This function will call the API for PUT method to particular tenant user details based on email.
 putUserS(email:string, user_data:any){
  return this.http.put(this.put_user+email, user_data).pipe(map(response=>{    
        if(response['Successful']){
          this.message_text = response['Successful'];
          this.response_status = "Successful";
          this.snackBar.top_snackbar(this.message_text ,this.response_status);
        }else{
          this.response_status = "Unsuccessful";
          this.message_text = response['Unsuccessful'];
          this.snackBar.top_snackbar(this.message_text ,this.response_status);
        }
    }));
    }

// This function will call the API for PUT method to particular tenant user details based on email and user type.
    deleteUserS(user_email_id:string, user_type:string){
      return this.http.delete(this.delete_user+ user_email_id + '/' + user_type).pipe(map(response=> {
        if(response['Successful']){
          this.response_status = "Successful";
          this.message_text = response['Successful'];
          this.snackBar.top_snackbar(this.message_text ,this.response_status);
        }else{
          this.response_status = "Unsuccessful";
          this.message_text = response['Unsuccessful'];
          this.snackBar.top_snackbar(this.message_text ,this.response_status);
        }
      }))
    }


// This method will create a sub tenant user.
postSubTenantUserS(post_data:any){
  return this.http.post(this.post_sub_tenant_user, post_data).pipe(map(response=>{
    if(response['Successful']){
      this.message_text = response['Successful'];
      this.snackBar.snackbar(this.message_text );
    }else{
      this.message_text = response['Unsuccessful'];
      this.snackBar.snackbar(this.message_text );
    }
  }));
}
   // This function will call the API for PUT method to particular tenant user details based on email.
   putUserProfileS(email:string, user_data:any){
    return this.http.put(this.update_userprofile+email, user_data).pipe(map(response=>{
      if(response['Successful']){
        this.router.navigate(['/users']);
        this.message_text = response['Successful'];
        this.snackBar.snackbar(this.message_text );
      }else{
        this.message_text = response['Unsucessfull'];
        this.snackBar.snackbar(this.message_text );
      }
  }));
  }

   // This function will call the API for PUT method to particular sub tenant user details based on email.
   putSubTenantUserS(email:string, user_data:any){
    return this.http.put(this.put_subtenant_usr+email, user_data).pipe(map(response=>{
      if(response['Successful']){
        this.router.navigate(['/users']);
        this.message_text = response['Successful'];
        this.snackBar.snackbar(this.message_text );
      }else{
        this.message_text = response['Unsucessfull'];
        this.snackBar.snackbar(this.message_text );
      }
  }));
  }


  // This function will call the API for GET method, It will display the all the users except job operators
  // based on tenant_id.
  getTenantUsersListS(){    
      return this.http.get(this.get_tenant_users_list + this.authService.currentUser['tenant_id']);   
  }


  // This function will call the API for GET method, It will display the all the users info based on tenant_id.
  getTenantUsersS(){
    if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == 'MV1001' || this.authService.currentUser['role_id'] == 'PA1001'|| this.authService.currentUser['role_id'] == 'PV1001' || this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001' || this.authService.currentUser['role_id'] == 'ASA1001' || this.authService.currentUser['role_id'] == 'ASV1001'){
      return this.http.get(this.tenant_users + this.authService.currentUser['tenant_id']);
    }else{
      return this.http.get(this.subtenant_users + this.authService.currentUser['subtenant_id']);
    }
  }

// This method will get the specific tenant user information
getTenantUserInfoS(){
  let userEmailId = localStorage.getItem('user_emailid');
  let role_id = localStorage.getItem('user_role');
  if(role_id == '1' || role_id== '2'){
  return this.http.get(this.get_Tenant_User_Info+ userEmailId);
  }else{
    return this.http.get(this.get_sub_Tenant_User_Info + userEmailId);
  }

}


}
