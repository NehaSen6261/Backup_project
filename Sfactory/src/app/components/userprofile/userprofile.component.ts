import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';
import { AuthService } from '../login/_services/auth.service';
import { NavbarService } from '../navbar/_services/navbar.service';
import { UserprofileService } from '../userprofile/_services/userprofile.service';
import { ForgotpswService } from '../forgotpassword/_services/forgotpsw.service';
import { UsersService } from '../users/_services/users.service';
import { SubtenantService } from '../subtenant/_services/subtenant.service';
import { WindowService } from '../others/window/_services/window.service';
import { OthersService } from '../others/_services/others.service';


@Component({
  selector: 'userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent implements OnInit {

firstname:string;
lastname:string;
email:string;
username:string;
account_role:string;


tenant_name:string;
tenant_type:string;
network_type:string;
number_of_devices:string;
payload:string;

otpFormControl = new FormControl();
staticAlertClosed = true;
pasw_unmatchAlert = true;
psw_successAlert = true;
psw_success = false;

sub_tenant_name:string;
location:string;
user_management:boolean;
devices_licenced:Number;
current_host:any;
account_role_:string;
  constructor(public authService: AuthService,
              private userprofileService: UserprofileService,
              private forgotpswService: ForgotpswService,
              private navbarService:NavbarService,
              private subtenantService: SubtenantService,
              private userService:UsersService,
              private windowService:WindowService,
              private routelocationInfo: Location,
              private othersService: OthersService,) {

    this.navbarService.Title = "User Profile";
    this.othersService.setTitle(this.navbarService.Title);
    this.firstname = authService.currentUser['first_name'];
    this.lastname = authService.currentUser['last_name'];
    this.email  = authService.currentUser['email'];
    this.username =  authService.currentUser['username'];
  }
  ngOnInit(): void {
    this.accountRoleType();
    this.current_host = this.windowService.currenthost();
    setTimeout(() => this.staticAlertClosed = true, 10000);
    setTimeout(() => this.pasw_unmatchAlert = true, 10000);
    setTimeout(() => this.psw_successAlert = true, 10000);
  }

  // Method to Check the current user role type
  accountRoleType(){
    if(this.authService.currentUser['role_id'] == 1){
      this.account_role = "Account Admin";
    }else if(this.authService.currentUser['role_id'] == 2){
      this.account_role = "Account Viewer";
    }else if(this.authService.currentUser['role_id'] == 'MV1001'){
      this.account_role = "Executive";
    }else if(this.authService.currentUser['role_id'] == 'PA1001'){
      this.account_role = "Plant Manager";
    }else if(this.authService.currentUser['role_id'] == 'PV1001'){
      this.account_role = "Plant Viewer";
    }else if(this.authService.currentUser['role_id'] == 'WCA1001'){
      this.account_role = "Workcenter Manager";
    }else if(this.authService.currentUser['role_id'] == 'WCV1001'){
      this.account_role = "Workcenter Viewer";
    }else if(this.authService.currentUser['role_id'] == 'ASA1001'){
      this.account_role = "Asset Manager";
    }else if(this.authService.currentUser['role_id'] == 'ASV1001'){
      this.account_role = "Asset Viewer";
    }else{
      this.account_role = "Job Worker";
    }
  }

// This method will be called for update.
putUserprofile(user_data:any){
  if(user_data['firstname'] && user_data['lastname']){
    user_data['updated_by'] = this.authService.currentUser['email'];
    user_data['user_type'] = this.authService.currentUser['sf_user_type'];
    this.userprofileService.putUserProfileS(user_data).subscribe(response => {});
  }
}


// This method will be called for sub tenant admin and sub tenant viewer update.
subtenant_update_data ={}
sub_tenantAdm_tenantVwr(user_data:any){
  if(user_data['firstname'] && user_data['lastname']){
    this.subtenant_update_data['user_first_name'] = user_data['firstname'];
    this.subtenant_update_data['user_last_name'] = user_data['lastname'];
    this.subtenant_update_data['updated_by'] = this.authService.currentUser['email'];
    this.userService.putSubTenantUserS(this.authService.currentUser['email'], this.subtenant_update_data).subscribe( )
  }
}


// This function will display the tenant information of the user.
  getTenantInfo(){
    this.userprofileService.getTenantInfoS().subscribe(response =>{
      if(response == false){
        this.tenant_name  = "NA";
        this.tenant_type = "NA";
        this.network_type = "NA";
        this.number_of_devices = "NA";
        this.payload = "NA";
      }else if(response){
        this.tenant_name  = response['tenant_name'];
        this.tenant_type = response['tenant_type'];
        this.network_type = response['network_type'];
        this.number_of_devices = response['no_devices'];
        this.payload = response['payload_sizemb'];
      }

    }, error=>{
        this.tenant_name  = "NA";
        this.tenant_type = "NA";
        this.network_type = "NA";
        this.number_of_devices = "NA";
        this.payload = "NA";
    })
  }


  // This method will execute on click of the update password button and It will verify the user and generates the OTP.
  public otp:any
  generateOTP(){
    let email = this.authService.currentUser['email'];
    this.forgotpswService.getOtpS(email).subscribe(response =>{
      this.otp = response['otp'];
      localStorage.setItem('generated_otp', this.otp );
    })
  }

// This method will verify the OTP.
isOTPEnabled:boolean = true;
verifyOTP(){
  let generated_otp = localStorage.getItem('generated_otp' );
  if(this.otpFormControl.value == "" || this.otpFormControl.value != generated_otp){
      this.staticAlertClosed = false;
   }
  if(this.otpFormControl.value == generated_otp) {
    this.isOTPEnabled = false;

  }

}

public new_password:string
public confirm_password:string

// This method will update the password.
updatepassword(data:any){
  data['updated_by'] = this.authService.currentUser['email'];
  data['user_role'] = this.authService.currentUser['role_id'];
  data['user_type'] = this.authService.currentUser['sf_user_type'];
  data['update_psw_from'] = "profile";
  if(data['new_password']  == undefined || data["confirm_password"] == undefined){

  }else{
    if(data['new_password'] == data["confirm_password"]){
      this.forgotpswService.forgetPassword( this.authService.currentUser['email'], data).subscribe( response =>{
        this.psw_success = true;
      })
    }else{
      this.pasw_unmatchAlert = false;
    }
  }


}

// This method will display the sub tenant Information based on sub tenant id.
getsubtanantInfo(){
  this.subtenantService.getsubtanantInfoS(this.authService.currentUser['subtenant_id']).subscribe(response =>{
    if(response['Unsuccessful']){
      this.sub_tenant_name = "NA";
      this.location = "NA";
      this.user_management = false;
      this.devices_licenced = 0;
    }else{
      this.sub_tenant_name = response['sub_tenant_name'];
      this.location = response['location'];
      this.user_management = response['is_user_management'];
      this.devices_licenced = response['devices_licenced'];
    }
  }, error =>{
      this.sub_tenant_name = "NA";
      this.location = "NA";
      this.user_management = false;
      this.devices_licenced = 0;
  })
}

// This method will take to the previous route.
backloc(){
  this.routelocationInfo.back();
}

}
