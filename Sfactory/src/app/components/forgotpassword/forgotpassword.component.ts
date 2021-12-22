import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ForgotpswService } from '../forgotpassword/_services/forgotpsw.service';
import { SnackbarComponent } from '../others/snackbar/snackbar.component';
import { OthersService } from '../others/_services/others.service';
import { WindowService  } from '../others/window/_services/window.service';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  mail_success= true;
  psw_success = false;
  current_host:any;

  err_msg_text = "Unable to process your request, please try later !! ";
  mail_success_msg = "We have sent password reset instructions to your Email address !!";
  invalid_email = "This email address is not registered with us !!";
  invalid_otp = "Wrong OTP Entered !!";
  psw_updated_success = "Password updated successfully !!";
  psw_not_matched = "New password and confirm password did not match !!";
  connectionStatus:string;
  public img_logo_color:string;
  error_status= "Error";

  constructor(
    private forgotpswService: ForgotpswService,
    private snackbar: SnackbarComponent,
    private othersService: OthersService,
    private windowService:WindowService) {
    this.img_logo_color=this.othersService.images_domain+"sfactory_logo.png";
    this.othersService.setTitle("Forgot Password");
    }

  ngOnInit(): void {
    this.connectionStatus = this.othersService.internetconnStatus();
    if (this.connectionStatus == "OFFLINE"){
        this.snackbar.top_snackbar("No internet connection detected !!",this.error_status);
    }
    this.current_host = this.windowService.currenthost();
  }


  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();
  otpFormControl = new FormControl();

    // This method will execute on click of the update password button and It will verify the user and generates the OTP.
    otp
    generateOTP(){
      this.ngOnInit();
      localStorage.setItem("fpsw_email",  this.emailFormControl['value']);
      let email = this.emailFormControl['value'];      
      if(email == ""){
        this.snackbar.top_snackbar("Enter email address !!", this.error_status);
      }else{
        this.forgotpswService.getOtpS(email).subscribe(response =>{     
          if(response['otp']){
            this.mail_success = false;  
            this.otp = response['otp'];
            localStorage.setItem('generated_otp', this.otp );
            this.snackbar.top_snackbar(this.mail_success_msg, "Successful");
          }else if(response["licence_error"]){
            this.mail_success = true;
            this.snackbar.top_snackbar(response["licence_error"], this.error_status);
          }else if(response["Unsucessfull"]){
            this.mail_success = true;
            this.snackbar.top_snackbar(this.err_msg_text,this.error_status);
          }else{
            this.snackbar.top_snackbar(this.invalid_email,this.error_status);
            this.mail_success = true;
          }
        }, error =>{
          this.snackbar.top_snackbar(this.err_msg_text,this.error_status);
        })
      }

    }

// This method will verify the OTP.
isOTPEnabled:boolean = true;
verifyOTP(){
  this.ngOnInit();
  let generated_otp = localStorage.getItem('generated_otp' );
  if(this.otpFormControl.value == "" || this.otpFormControl.value != generated_otp){
    this.snackbar.top_snackbar(this.invalid_otp,this.error_status);
   }
  if(this.otpFormControl.value == generated_otp) {
    this.isOTPEnabled = false;
  }

}


new_password
confirm_password

// This method will update the password.
updatepassword(data){
  this.ngOnInit();
  let email = localStorage.getItem("fpsw_email");
  data['updated_by'] = email;
  data['update_psw_from'] = "forgot_password";
  if(data['new_password']  == undefined || data["confirm_password"] == undefined){
    this.snackbar.top_snackbar("new password and confirm password didn't matched !!",this.error_status);
  }else{
    if(data['new_password'] == data["confirm_password"]){
      this.forgotpswService.forgetPassword( email,  data).subscribe( response =>{
        this.psw_success = true;
      }, error =>{
        this.snackbar.top_snackbar(this.err_msg_text,this.error_status);
      })
    }else{
      this.snackbar.top_snackbar(this.psw_not_matched,this.error_status);
    }
  }
  localStorage.removeItem("fpsw_email");
}

@HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event['keyCode'] == 13){
      this.generateOTP()
    }

  }
}
