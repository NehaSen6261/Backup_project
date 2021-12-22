import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../login/_services/auth.service';
import { alerts } from 'src/environments/urls';



@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  private tenant_curr_day_alerts = alerts.tenant_currentday_alerts;
  private tenant_weekly_alerts = alerts.tenant_weekly_alerts;
  private tenant_monthwise_alerts = alerts.tenant_monthwise_alerts;


  constructor(private http: HttpClient, private authService: AuthService) { }

   // This function will call the API for GET method, It will display the current day alerts  count based on tenantid.
   getTcurrDayAlertsS(){
    return this.http.get(this.tenant_curr_day_alerts + this.authService.currentUser['tenant_id']);
  }

  // This function will call the API for GET method, It will display the weekly alerts based on tenantid.
  getTweeklyAlertsS(){
    return this.http.get(this.tenant_weekly_alerts + this.authService.currentUser['tenant_id']);
  }

    // This function will call the API for GET method, It will display the monthwise alerts of an year based on tenant.
    getTMonthwiseAlertsS(year){
      return this.http.get(this.tenant_monthwise_alerts + this.authService.currentUser['tenant_id'] + '/' + year );
    }



}
