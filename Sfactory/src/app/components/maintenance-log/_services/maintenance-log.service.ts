import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { AuthService } from '../../login/_services/auth.service';
import { maintenancelog } from '../../../../environments/urls';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceLogService {
  private post_maintenancelog = maintenancelog.post_maintenancelog;
  private get_maintenancelog_info = maintenancelog.get_maintenancelog_info;
  private update_maintenancelog_info = maintenancelog.update_maintenancelog_info;
  private delete_maintenancelog = maintenancelog.delete_maintenancelog;
  private get_maintenancelog_info_tenant_id = maintenancelog.get_maintenancelog_info_tenant_id;
  private get_maintenancelog_info_plant_id = maintenancelog.get_maintenancelog_info_plant_id;
  private get_asset_maintenance = maintenancelog.get_asset_maintenance;


  message_text:any;
  action = "Dismiss";
  response_status:string;

  constructor(
    private http: HttpClient,
    private snackBar: SnackbarComponent,
    private authService:AuthService,
    private router:Router
  ) { }

     // This function will call the API for POST method.
     postMaintenancelogs(post_data:any){
      return this.http.post(this.post_maintenancelog, post_data).pipe(map(response=>{
      if(response['Successful']){
        this.response_status = "Successful";
        this.message_text = response['Successful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status );
      }else{
        this.response_status = "Unsuccessful";
        this.message_text = response['Unsuccessful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status );
      }
      }));
  }

    // This function will call the API for PUT method to update maintenancelog details based on maintenancelog_id.
    putMaintenancelogs(maintenancelog_id:string, Maintenancelog_Data:any){
      return this.http.put(this.update_maintenancelog_info+maintenancelog_id, Maintenancelog_Data).pipe(map(response=>{
        if(response['Successful']){
          this.response_status = "Successful";
          this.message_text = response['Successful'];
          this.snackBar.top_snackbar(this.message_text,this.response_status );
        }else{
          this.response_status = "Unsuccessful";
          this.message_text = response['Unsuccessful'];
          this.snackBar.top_snackbar(this.message_text,this.response_status );
       }
    }));
   }

   // This function deletes the particular  maintenancelog.
  deleteMaintenancelog_info(maintenancelog_id:string){
    return this.http.delete(this.delete_maintenancelog+ maintenancelog_id).pipe(map(response=> {
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

  // This function will call the API for GET method and It will display all the Maintenancelog Info.
  getMaintenancelog_info() {
    if (this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == 'MV1001') {
      return this.http.get(this.get_maintenancelog_info);
    }

  }

 // This function will call the API for GET method and It will display all the Maintenancelog for a tenant.
  getMaintenancelog_info_tenant_id(time_zone:string){
    return this.http.get(this.get_maintenancelog_info_tenant_id + this.authService.currentUser['tenant_id'] + '/' + time_zone);
   }

   // This function will call the API for GET method and It will display all the Maintenancelog for a tenant.
   getMaintenancelog_data(time_zone:string) {
    if (this.authService.currentUser['role_id'] == 'PA1001' || this.authService.currentUser['role_id'] == 'PV1001'  || this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001') {
     return this.http.get(this.get_maintenancelog_info_plant_id + this.authService.currentUser['sf_plant_id']+'/'+time_zone)
    }else if(this.authService.currentUser['role_id'] == 'ASA1001' ||
     this.authService.currentUser['role_id'] == 'ASV1001' ||this.authService.currentUser['role_id'] == 'JB1001'){
      return this.http.get(this.get_asset_maintenance + this.authService.currentUser['email'] +'/'+time_zone)
    }else{
      return this.http.get(this.get_maintenancelog_info_tenant_id + this.authService.currentUser['tenant_id'] +'/'+time_zone)
    }
  }


}
