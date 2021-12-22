import { Injectable, ɵConsole } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { AuthService } from '../../login/_services/auth.service';
import { workcenters } from '../../../../environments/urls';



@Injectable({
  providedIn: 'root'
})
export class WorkcenterService {

  message_text:any;
  action = "Dismiss";
  response_status:string;

  private post_workcentre = workcenters.post_workcentre;
  private put_workcentre = workcenters.put_workcentre;
  private delete_workcenter = workcenters.delete_workcenter;
  private get_plant_workcenters = workcenters.get_plant_workcenters;
  private get_tenant_workcenters = workcenters.get_tenant_workcenters;
  private get_tenant_workcenters_list = workcenters.get_tenant_workcenters_list;
  private get_plant_workcenter_list = workcenters.get_plant_workcenter_list;
  private workcenter_info = workcenters.get_workcenter_info;
  private get_time_zone = workcenters.get_time_zone;
  private get_workcenter_wrkcntrid = workcenters.get_workcenter_wrkcntrid;
  private get_workcenter_list = workcenters.get_workcenter_list;
    constructor(
    private http: HttpClient,
    private snackBar: SnackbarComponent,
    private authService:AuthService
  ) { }

   // This function will call the API for POST method.
   postWorkCenterS(post_data:any){
    return this.http.post(this.post_workcentre, post_data).pipe(map(response=>{
    if(response['Successful']){
    this.response_status = "Successful";
    this.message_text = response['Successful'];
    this.snackBar.top_snackbar(this.message_text ,this.response_status);
    }else{
      this.response_status = "Unsuccessful";
      this.message_text = response['Unsuccessful'];
      this.snackBar.top_snackbar(this.message_text ,this.response_status);
    }
   }));
  }

   // This function will call the API for PUT method to update workcenter based on workcenter_id.
   putWorkCenterS(workcenter_id:string, workcenter_data:any){
    return this.http.put(this.put_workcentre+workcenter_id, workcenter_data).pipe(map(response=>{
      if(response['Successful']){
        this.response_status = "Successful";
        this.message_text = response['Successful'];
        this.snackBar.top_snackbar(this.message_text ,this.response_status);
      }else{
        this.response_status = "Unsuccessful";
        this.message_text = response['Unsuccessful'];
        this.snackBar.top_snackbar(this.message_text ,this.response_status);
      }
  }));
  }

    // This function deletes the particular  workcenter.
    deleteWorkcenterS(workcenter_id:string){
      return this.http.delete(this.delete_workcenter+ workcenter_id).pipe(map(response=> {
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

   // This function will call the API for GET method and It will display all the workcenters by plant id.
   getPlantWorkcentersS(plant_id:any, time_zone:string){
     return this.http.get(this.get_plant_workcenters+ plant_id + '/' + time_zone);
  }
  
  // This function will call the API for GET method and It will display all the workcenters list for dropdown by plant id.
  getPlantWorkcentersListS(plant_id: any) {
    if (this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == 'MV1001') {
    return this.http.get(this.get_plant_workcenter_list + plant_id);
    }else if (this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001'
     || this.authService.currentUser['role_id'] == 'ASA1001' || this.authService.currentUser['role_id'] == 'ASV1001'){
       return this.http.get(this.get_workcenter_list + this.authService.currentUser['work_centre_id'].toString());
     }else{
      return this.http.get(this.get_plant_workcenter_list + this.authService.currentUser['sf_plant_id']);
    }
  }

  // This function will call the API for GET method and It will display all the workcenters by tenant id.
  getWorkcentersS(time_zone:string, browser_date:string) {
   if (this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == 'MV1001') {
       return this.http.get(this.get_tenant_workcenters + this.authService.currentUser['tenant_id'] + '/' + time_zone + '/' + browser_date);
     }else if (this.authService.currentUser['role_id'] == 'PA1001'||this.authService.currentUser['role_id'] == 'PV1001') {
       return this.http.get(this.get_plant_workcenters + this.authService.currentUser['sf_plant_id'] + '/' + time_zone + '/' + browser_date);
     } else if (this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001') {
      return this.http.get(this.get_workcenter_wrkcntrid + this.authService.currentUser['work_centre_id'].join(', ') + '/' + time_zone + '/' + browser_date);
    }else if(this.authService.currentUser['role_id'] == 'ASA1001' || this.authService.currentUser['role_id'] == 'ASV1001'){
      return this.http.get(this.get_workcenter_wrkcntrid + this.authService.currentUser['work_centre_id'].join(', ') + '/' + time_zone + '/' + browser_date);
    }
    else if(this.authService.currentUser['role_id'] == 'ASA1001' || this.authService.currentUser['role_id'] == 'ASV1001'){
      return this.http.get(this.get_workcenter_wrkcntrid + this.authService.currentUser['work_centre_id'].join(', ') + '/' + time_zone + '/' + browser_date);
    }
   }

  // This function will call the API for GET method and It will display all the workcenters by work center id.
   getWorkcentersInfoS(workcenter_id:any){
     return this.http.get(this.workcenter_info+ workcenter_id);
   }

  // This function will call the API for GET method and It will display all the workcenters list for dropdown  by tenant id.
  getWorkcentersListS(){
     return this.http.get(this.get_tenant_workcenters_list+ this.authService.currentUser['tenant_id']);
  }


// This function will call the API for GET method and It will display all the time zone for dropdown  by plant id.
    getTimezonePlantId(plant_id){
      return this.http.get(this.get_time_zone+ plant_id);
   }
 
}
