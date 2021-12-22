import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { AuthService } from '../../login/_services/auth.service';
import { plantdashboard, plants } from '../../../../environments/urls';
import { BehaviorSubject, Observable, Observer } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PlantService {

  private post_plant = plants.post_plant;
  private put_plant = plants.put_plant;
  private delete_plant = plants.delete_plant;
  private get_tenant_plants = plants.get_tenant_plants;
  private get_plant_info = plants.get_plant_info;
  private get_tenant_plant_list = plants.get_tenant_plant_list;
  private get_plant_plant_id = plants.get_plant_plant_id;
  private get_plant_dashboard_list = plantdashboard.get_plant_dashboard_list;

  message_text:any;
  action = "Dismiss";
  response_status:string;

  constructor(
    private http: HttpClient,
    private snackBar: SnackbarComponent,
    private authService:AuthService,
    private router:Router,
  ) { 
   
  }

  private detail :BehaviorSubject<any> = new BehaviorSubject(null)


  getTimeZone():Observable<any>{
     return this.detail.asObservable();
  }


  setTimeZone(planttimezone){
   this.detail.next(planttimezone)

  }

   // This function will call the API for POST method.
  postPlantS(post_data:any){
      return this.http.post(this.post_plant, post_data).pipe(map(response=>{
      if(response['Successful']){
        this.response_status = "Successful";
        this.message_text = response['Successful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status );
      }else{
        this.response_status = "Unsuccessful";
        this.message_text = response['Unsuccessful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status  );
      }
      }));
  }

  // This function will call the API for PUT method to update plant details based on plant_id.
  putPlantS(plant_id:string, plant_data:any){
     return this.http.put(this.put_plant+plant_id, plant_data).pipe(map(response=>{
       if(response['Successful']){
         this.router.navigate(['/plant']);
         this.response_status = "Successful";
         this.message_text = response['Successful'];
         this.snackBar.top_snackbar(this.message_text,this.response_status );
       }else{
        this.response_status = "Unsuccessful";
         this.message_text = response['Unsuccessful'];
         this.snackBar.top_snackbar(this.message_text,this.response_status  );
      }
   }));
  }

  // This function deletes the particular  plant.
  deletePlantS(plant_id:string){
    return this.http.delete(this.delete_plant+ plant_id).pipe(map(response=> {
      if(response['Successful']){
        this.router.navigate(['/plant']);
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

  // This function will call the API for GET method and It will display all the plants for a tenant.
  getplantS() {
    if (this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == 'MV1001') {
    return this.http.get(this.get_tenant_plants + this.authService.currentUser['tenant_id']);
    }
    else if (this.authService.currentUser['role_id'] == 'PA1001' || this.authService.currentUser['role_id'] == 'PV1001') {
     return this.http.get(this.get_plant_plant_id + this.authService.currentUser['sf_plant_id']);
     }
     else if(this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001'){
      return this.http.get(this.get_plant_plant_id + this.authService.currentUser['sf_plant_id']);
    }
    else if(this.authService.currentUser['role_id'] == 'ASA1001' || this.authService.currentUser['role_id'] == 'ASV1001')
    {
      return this.http.get(this.get_plant_plant_id + this.authService.currentUser['sf_plant_id']);
    }
    else if(this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001'){
      return this.http.get(this.get_plant_plant_id + this.authService.currentUser['sf_plant_id']);
    }
    else if(this.authService.currentUser['role_id'] == 'ASA1001' || this.authService.currentUser['role_id'] == 'ASV1001')
    {
      return this.http.get(this.get_plant_plant_id + this.authService.currentUser['sf_plant_id']);
    }
  }



// This function will call the API for GET method and It will display all the plants list  for a tenant.
getplantlistS() {
  if (this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == 'MV1001' ) {
    return this.http.get(this.get_tenant_plant_list + this.authService.currentUser['tenant_id']);
  }
  else if (this.authService.currentUser['role_id'] == 'PA1001' || this.authService.currentUser['role_id'] == 'PV1001') {
    return this.http.get(this.get_plant_dashboard_list + this.authService.currentUser['email']);
  } 
  else{
     return this.http.get(this.get_plant_plant_id + this.authService.currentUser['sf_plant_id']);
    }
}

// This function will call the API for GET method and It will display plant Information by plant id.
getplantInfoS(plant_id:any){
   return this.http.get(this.get_plant_info+ plant_id);
}




}
