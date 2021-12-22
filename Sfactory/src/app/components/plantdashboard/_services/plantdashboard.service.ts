import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from '../../login/_services/auth.service';
import { dashboard,plantdashboard } from 'src/environments/urls';


@Injectable({
  providedIn: 'root'
})
export class PlantdashboardService {

  private get_user_plant_theme = plantdashboard.get_user_plant_theme
  private cu_usr_th_cards = dashboard.cu_usr_th_cards;
  private get_lastdaysqsi_plant = plantdashboard.get_lastdaysqsi_plant;
  private get_lastdaysrdftime = plantdashboard.get_lastdaysrdftime;
  private get_plant_dashboard_work_ordar = plantdashboard.get_plant_dashboard_work_ordar;
  private get_plant_dashboard_workorder_name_list = plantdashboard.get_plant_dashboard_workorder_name_list;
  private get_plant_dashboard_list = plantdashboard.get_plant_dashboard_list
  private get_plant_time_zone = plantdashboard.get_plant_time_zone
  card_update_response:any;

  constructor(private http: HttpClient, private authService: AuthService) {  }

   // This function will call the API for GET method to display the user theme based on email.
    getUserThemeS(time_zone:string){
      return this.http.get(this.get_user_plant_theme + this.authService.currentUser['email'] + '/' + time_zone);
    }


  // This method will return netRuntime by plantid and time zone.
  get_lastdaysqsipS(plant_id:any, timezone:any){
    return this.http.get(this.get_lastdaysqsi_plant + plant_id +'/'+timezone);
  }
  // This method will return runtime and downtime by plantid and time zone.
  get_lastdaysrdftimeS(plant_id:any, timezone:any){
    return this.http.get(this.get_lastdaysrdftime + plant_id +'/'+timezone);
  }

    // This function will call the API for the GET method which will display particular workorder performence for days.
    getPlantDashWorkoderPerformenceS(plant_id:any,  timezone:string){
      return this.http.get(this.get_plant_dashboard_work_ordar  + plant_id + '/' + timezone)
   }

    // This function will call the API for GET method and It will display all the plant list only in plantdashboard.
 
   getPlantDahboard(){
      if (this.authService.currentUser['role_id'] == 'PA1001' || this.authService.currentUser['role_id'] == 'PV1001') {
        return this.http.get(this.get_plant_dashboard_list + this.authService.currentUser['email']);
      }  
  }
  // This function will call the API for GET method and It will display all the workorders list only in dashboard.
  getWorkOrderListS() {
   return this.http.get(this.get_plant_dashboard_workorder_name_list+this.authService.currentUser['sf_plant_id'].toString());
  }
  //  This function will call the API for POST method to save the user dashboard cards info.
  saveUserDBCardsS(data){
    return this.http.post(this.cu_usr_th_cards, data).pipe(map(response=>{
      this.card_update_response = response
    }));
  }

   // This function will call the API for GET method and It will display all the workorders list only in dashboard.
   getPlantTimeZone(plant_id){
    return this.http.get(this.get_plant_time_zone+plant_id);
  }

}

