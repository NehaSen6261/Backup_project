import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { AuthService } from '../../login/_services/auth.service';
import { workorders } from '../../../../environments/urls';

@Injectable({
  providedIn: 'root'
})
export class WorkorderService {

  message_text:any;
  response_status:string;

  private workorder_performence = workorders.workorder_performence;
  private get_work_order_info = workorders.get_work_order_info;
  private get_work_order_plant_info = workorders.get_work_order_plant_info;
  private post_work_order = workorders.post_work_order;
  private update_work_order = workorders.update_work_order_info;
  private delete_work_order = workorders.delete_work_order;
  private tenant_workorders_progress = workorders.tenant_workorders_progress;
  private plant_workorders_progress = workorders.plant_workorders_progress;
  private get_work_order_name_list = workorders.get_work_order_name_list; 
  private get_dashboard_workorder_name_list = workorders.get_dashboard_workorder_name_list; 
  private get_work_order_name_Plant_list = workorders.get_work_order_name_Plant_list;
  private get_workorder_duration = workorders.get_workorder_duration;
  private get_workorder_quantity  = workorders.get_workorder_quantity;
  private get_workorder_partcode  = workorders.get_workorder_partcode;



  constructor(
    private http: HttpClient,
    private snackBar: SnackbarComponent,
    private authService:AuthService,
    private router:Router
  ) { }

 // This function will call the API for POST method to add the Customers.
 postWorkOrdersS(post_data: any) {
  return this.http.post(this.post_work_order, post_data).pipe(map(response => {
    if (response['Successful']) {
      this.message_text = response['Successful'];
      this.response_status = "Successful";
      this.snackBar.top_snackbar(this.message_text,this.response_status);
    } else {
      this.response_status = "Unsuccessful";
      this.message_text = response['Unsuccessful'];
      this.snackBar.top_snackbar(this.message_text,this.response_status);
    }
  }));
}

// this method will call the API to update the customer details by passing the customer id .
putWorkOrderDetailS(work_order_id:string, data:any){
return this.http.put(this.update_work_order+work_order_id,data).pipe(map(response=>{
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

deleteWorkOrderS(work_order_id:string){
return this.http.delete(this.delete_work_order + work_order_id).pipe(map(response=>{
if(response['Successful']){
  this.router.navigate(['/workorder']);
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

  // This function will call the API for the GET method which will display particular workorder performence for days.
  getWorkoderPerformenceS(workorderid:any,  timezone:string){
      return this.http.get(this.workorder_performence  + workorderid + '/' + timezone)
   }


  // This function will call the API for GET method and It will display all the workorders details for a tenant and plant .
getWorkOrderDetailsS() {
  return this.http.get(this.get_work_order_info + this.authService.currentUser['tenant_id']);  
  }

// This function will call the API for GET method and It will display all the workorders list only in dashboard.
getWorkOrderListS() {
    return this.http.get(this.get_dashboard_workorder_name_list+this.authService.currentUser['tenant_id']);
  }


// This function will call the API for GET method and It will display all the workorders list .
getWorkOrderProgressS() {
  return this.http.get(this.tenant_workorders_progress+this.authService.currentUser['tenant_id']);
}

// This method will call the API to get the list of workorders.
getWorkorderNameListS(){
    return this.http.get(this.get_work_order_name_list+this.authService.currentUser['tenant_id']);
}

// This function will display start date and end date based on work order id.
getWorkorderdurationS(workorder_id:any){
  return this.http.get(this.get_workorder_duration + workorder_id);
}
 
// This function will display remain  quantity  based on tenant id.
getWorkorderQuantity(){
  return this.http.get(this.get_workorder_quantity + this.authService.currentUser['tenant_id']);
}

  // This function will call the API for GET method and It will display all the partcode details for a tenant and plant .
 getWorkOrderpartcode() {
    return this.http.get(this.get_workorder_partcode + this.authService.currentUser['tenant_id']);  
 }

}
