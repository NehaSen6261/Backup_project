import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { RegistrationService } from '../_services/registration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OthersService } from '../../others/_services/others.service';
import { NavbarService } from '../../navbar/_services/navbar.service';

@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  currentRoute: string;
  hide = true;
  error_status= "Error";
  public img_logo_color:string;
  constructor(
    private snackbar: SnackbarComponent,
    private registrationService: RegistrationService,
    private route: ActivatedRoute,
    private othersService:OthersService ,
    private navbarService: NavbarService,   
    private router: Router,
  ) {
    this.img_logo_color=this.othersService.images_domain+"sfactory_logo.png";
    this.navbarService.Title = "Registartion";
    this.othersService.setTitle(this.navbarService.Title);
  }
  public firstParam: any
  ngOnInit(): void {
    this.firstParam = this.route.snapshot.queryParamMap.get('key');
    if (this.firstParam == null) {
      this.promCode = false
    }
  }

  public regex = '^[^@]+@(?!(yahoo.com|hotmail|gmail))[^@]+\.[a-z]{2,}$';

  public checkboxValue: boolean;
  firstname = new FormControl('', [Validators.required]);
  lastname = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  orgname = new FormControl('', [Validators.required]);
  purpose = new FormControl('', [Validators.required]);
  location = new FormControl('', [Validators.required]);
  checkboxfromcontrol = new FormControl(false, [Validators.requiredTrue]);
  password = new FormControl('', [Validators.required, Validators.minLength(8),
  Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
  ]);
  promocode = new FormControl('');

  is_signup_allowed:boolean = false;
  signup() {
    if (this.firstname.status == "INVALID" || this.lastname.status == "INVALID" || this.email.hasError('required') || this.orgname.status == "INVALID" ||
      this.purpose.status == "INVALID" || this.location.status == "INVALID" ||
      this.password.status == "INVALID" || this.checkboxfromcontrol.hasError('requiredTrue')) {
      this.snackbar.top_snackbar("Enter all required Fields !!",this.error_status);
    }

    else if (this.checkboxfromcontrol.value == false) {
      this.snackbar.top_snackbar("Please Accept term and conditions!!",this.error_status);
    }
    else {
      if(this.promCode){
        if(this.is_promo_verified){
          this.is_signup_allowed = true;
        }else{
          this.is_signup_allowed = false;
        }
      }else{
        this.is_signup_allowed = true;
      }
      if(this.is_signup_allowed){
        let data = {}
        data['first_name'] = this.firstname.value;
        data['last_name'] = this.lastname.value;
        data['email'] = this.email.value;
        data['company_college'] = this.orgname.value;
        data['purpose'] = this.purpose.value;
        data['location'] = this.location.value;
        data['password'] = this.password.value;
        data['created_by'] = this.email.value;
        data['first_name'] = this.firstname.value;
        this.registrationService.postRegistartionS(data).subscribe(response => {
          if (this.registrationService.response_status == 'Successful') {
            this.router.navigate(['/verifyacccount']);
            this.clearall();
          }
        });
      }else{
        this.snackbar.top_snackbar("Enter valid promo code !!",this.error_status);
      }
     
    }
  }

  // This method will clear all the input  feilds.
  clearall() {
    this.firstname.reset();
    this.lastname.reset();
    this.email.reset();
    this.orgname.reset();
    this.location.reset();
    this.password.reset();
    this.purpose.reset();
  }

 public promCode: boolean = false
 public is_promo_verified:boolean = false;
 loading_btn: boolean=false;
 internal_error:boolean =false;
  // This function will be used for  Business mail 
  emailValidation() {
     this.registrationService.getEmailValidations(this.email.value).subscribe(response => {
      if (response['invalid_mail'] == "Please enter business email address or valid special code !!") {
        this.snackbar.top_snackbar(response['invalid_mail'],this.error_status );
        this.promCode = true
      }
      else{
        this.promCode = false
      }
  
    });
   
  }


  // This function will be used for Promocode
  promocodevalidations() {
    this.registrationService.getPromoCodeValidations(this.promocode.value).subscribe(response => {
      if(response['invalid_code']){
        this.is_promo_verified = false;
        this.snackbar.top_snackbar(response['invalid_code'],this.error_status);
      }else if(response['valid_code']){
        this.is_promo_verified = true;
      }else{
        this.is_promo_verified = false;
      }
     }, error =>{
      this.snackbar.top_snackbar("Please enter a valid special code !!",this.error_status);
     });
   }

}
