import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { registartion } from '../../../../environments/urls';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private register = registartion.register;
  private email_validations = registartion.email_validations;
  private promocode_validations = registartion.promocode_validations;

  message_text:any;
  action = "Dismiss";
  response_status:string;

  constructor(
    private http: HttpClient,
    private snackBar: SnackbarComponent,
    private router:Router
  ) { }

  // This function will call the API for POST method.
  postRegistartionS(post_data:any){
  return this.http.post(this.register, post_data).pipe(map(response=>{
  if(response['Successful']){
    this.response_status = "Successful";
    // this.message_text = response['Successful'];
    // this.snackBar.top_snackbar(this.message_text, this.response_status );
    this.router.navigate(['/verifyacccount'])
  }else{
    this.response_status = "Unsuccessful";
    this.message_text = response['Unsuccessful'];
    this.snackBar.top_snackbar(this.message_text, this.response_status );
  }
  }));
}

getEmailValidations(email:any){
  return this.http.get(this.email_validations + email);
}

getPromoCodeValidations(promocode:any){
  return this.http.get(this.promocode_validations + promocode);
}
}
