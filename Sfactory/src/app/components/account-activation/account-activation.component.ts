import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ActivatedRoute } from '@angular/router';
import { OthersService } from '../others/_services/others.service';
import { AccountActivationService } from './_services/account-activation.service'

@Component({
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.scss']
})
export class AccountActivationComponent implements OnInit {

  public message_text:any;
  public account_active:boolean;
  public no_account_active:boolean ;
  public img_logo_color: string;

  constructor(
            public route: ActivatedRoute,
            private routelocationInfo: Location,
            private accountActivationService: AccountActivationService,
            private othersService:OthersService,
          ) { 
              this.img_logo_color = this.othersService.images_domain +"sfactory_logo.png";    
           }

  ngOnInit(): void {
   this.getTokenKey();
  }

  getTokenKey(){
    let token_key = this.route.snapshot.queryParamMap.get('key');
    let decode_value= new JwtHelperService().decodeToken(token_key);
    this.accountActivationService.getActivateUser(decode_value.email).subscribe(response => {
      if (response['Successful']){
        this.account_active = true;
        this.no_account_active = false;
        this.message_text = response['Successful'];
      }else if(response['Unsuccessful']){
        this.account_active = false;
        this.no_account_active = true;
      }
   });
  }

  // This method will take to the previous route.
  backloc(){
    this.routelocationInfo.back();
  }
}
