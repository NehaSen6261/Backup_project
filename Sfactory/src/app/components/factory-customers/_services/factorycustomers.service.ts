import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { customers } from '../../../../environments/urls'
import { AuthService } from '../../login/_services/auth.service';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';


@Injectable({
  providedIn: 'root'
})
export class FactorycustomersService {

  private post_add_customer = customers.post_add_customers;
  private get_customer_plant_details = customers.get_customer_plant_details;
  private update_customer_details = customers.update_customer_details;
  private delete_customer_details = customers.delete_customer_details;
  private get_customer_list = customers.get_customer_list;

  message_text: any;
  action = "Dismiss";
  response_status:string;
  constructor(
    private http: HttpClient,
    private snackBar: SnackbarComponent,
    private authService: AuthService,
    private router:Router
  ) { }


  postCustomerS(post_data: any) {
    return this.http.post(this.post_add_customer, post_data).pipe(map(response => {
      if (response['Successful']) {
        this.response_status = "Successful";
        this.message_text = response['Successful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status);
      } else {
        this.response_status = "Unsuccessful";
        this.message_text = response['Unsuccessful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status);
      }
    }));
  }

// this method will call the API to update the customer details by passing the customer id .
putCustomerdeatilS(customer_id:string, data:any){
return this.http.put(this.update_customer_details+customer_id,data).pipe(map(response=>{
  if (response['Successful']) {
    this.response_status = "Successful";
    this.message_text = response['Successful'];
    this.snackBar.top_snackbar(this.message_text,this.response_status);
  } else {
    this.response_status = "Unsuccessful";
    this.message_text = response['Unsuccessful'];
    this.snackBar.top_snackbar(this.message_text,this.response_status);
  }
}))
}

// this method will delete the particular customer by passing the customer id
deleteCustomerS(customer_id:string){
return this.http.delete(this.delete_customer_details + customer_id).pipe(map(response=>{
  if(response['Successful']){
    this.response_status = "Successful";
    this.message_text = response['Successful'];
    this.snackBar.top_snackbar(this.message_text,this.response_status );
  }else{
    this.response_status = "Unsuccessful";
    this.message_text = response['Unsuccessful'];
    this.snackBar.top_snackbar(this.message_text,this.response_status );
  }
}))
}

    // This function will call the API for GET method and It will display all the Customer details for a tenant and plant .
    getCustomerDetailsS() {
      if (this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == "MV1001" || this.authService.currentUser['role_id'] == 'PA1001' || this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001'|| this.authService.currentUser['role_id'] == 'ASA1001'|| this.authService.currentUser['role_id'] == 'ASV1001') {
        return this.http.get(this.get_customer_list + this.authService.currentUser['tenant_id']);
      }else if (this.authService.currentUser['role_id'] == 'PV1001'){
        return this.http.get(this.get_customer_plant_details + this.authService.currentUser['sf_plant_id'])
      }
    }
    // This method will call the API to get the list of customers list  by passing tenantID
getCustomerListS(){
  return this.http.get(this.get_customer_list + this.authService.currentUser['tenant_id'])
}


}
