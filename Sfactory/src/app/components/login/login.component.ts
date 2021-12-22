import { Component, OnInit, Injectable, HostListener } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from './_services/auth.service';
import { OthersService } from '../others/_services/others.service';
import { SnackbarComponent } from '../others/snackbar/snackbar.component';
import { WindowService  } from '../others/window/_services/window.service';
import { NavbarService } from '../navbar/_services/navbar.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  msgtext:string;
  loading_btn: boolean=false;
  internal_error:boolean =false;
  invalid_cred:boolean =false;
  connectionStatus:string;
  current_host:any;
  error_status= "Error";
  public img_logo_color:string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private navbarService: NavbarService,
    private route: ActivatedRoute,
    private othersService:OthersService,
    private snackbarComponent: SnackbarComponent,
    private windowService:WindowService) 
    {
    this.img_logo_color=this.othersService.images_domain+"sfactory_logo.png";
    this.navbarService.Title = "Login";
    this.othersService.setTitle(this.navbarService.Title);
    }

  ngOnInit(): void {
    
    this.connectionStatus = this.othersService.internetconnStatus();
    if (this.connectionStatus == "OFFLINE"){
        this.snackbarComponent.top_snackbar("No internet connection detected !!",this.error_status)
    }
    this.current_host = this.windowService.currenthost();
  }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl();

  matcher = new MyErrorStateMatcher();
  hide = true;


  // This method will be called  after clicking login button.
  user_cred = {};
  login(){
    this.ngOnInit();
    let email_info = this.emailFormControl;
    let psw_info = this.passwordFormControl;

    if(email_info['value'] == "" || psw_info['value'] == ""){
      this.msgtext = "Enter Email/Password !!";
      this.invalid_cred = true;
      this.loading_btn = false;
      this.snackbarComponent.top_snackbar(this.msgtext,this.error_status);
    }if(email_info['status']== "VALID" || psw_info['status'] == "VALID"){
      this.loading_btn = true;
        this.user_cred['email']=this.emailFormControl['value'].trim()
        this.user_cred['password']=this.passwordFormControl['value'].trim()
        this.authService.login(this.user_cred).subscribe(response => {          
          if(response){
            let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
            if(this.authService.currentUser['role_id'] == 'JB1001'){
              this.router.navigate([returnUrl ||  '/controls']);
            }
            else if (this.authService.currentUser['role_id'] == 'PA1001'|| this.authService.currentUser['role_id'] == 'PV1001'){
              this.router.navigate([returnUrl ||  '/plantdashboard']);
            } else{
              this.router.navigate([returnUrl ||  '/dashboard']);
            }                        
          }else{
            this.loading_btn = false;
            this.invalid_cred = true;
            this.msgtext = this.authService.invalid_usrlogin;
            this.snackbarComponent.top_snackbar(this.msgtext,this.error_status);
          }
        }, error=>{
          this.loading_btn = false;
          this.internal_error = true;
          this.msgtext= "Unable to process your request, please try after some time !!";
          this.snackbarComponent.top_snackbar(this.msgtext,this.error_status);
        })
    }
  }
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event['keyCode'] == 13){
      this.login();
    }

  }

}


//  This component will send the token as a header to the APIs.
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req, next){
    const token = localStorage.getItem('token')
    let tokenizedreq = req.clone({
      setHeaders:{
        APIKEY :  ` ${ token }`
      }
    });

  return next.handle(tokenizedreq)
  }
}