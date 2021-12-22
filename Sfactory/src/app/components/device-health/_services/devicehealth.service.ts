import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../login/_services/auth.service';
import { devicehealth } from 'src/environments/urls';



@Injectable({
  providedIn: 'root'
})
export class DevicehealthService {



  private tenant_current_device_health = devicehealth.tenant_current_health;
  private tenant_weekly_health = devicehealth.tenant_weekly_health;
  private tenant_weekly_health_table = devicehealth.tenant_weekly_health_table;

  constructor(private http: HttpClient, private authService: AuthService) { }

    // This function will call the API for GET method, It will display the connected, unconnected and disconnected devices based on tenantid.
    getTCurrDeviceHealthS(){
      return this.http.get(this.tenant_current_device_health + this.authService.currentUser['tenant_id']);
    }


  // This function will call the API for GET method, It will display the weekly device health based on tenantid.
  getTweeklyHealthS(){
    return this.http.get(this.tenant_weekly_health + this.authService.currentUser['tenant_id']);
  }

    // This function will call the API for GET method, It will display the weekly device health based on tenantid for table.
    getTweeklyHealthTabS(){
      return this.http.get(this.tenant_weekly_health_table + this.authService.currentUser['tenant_id']);
    }



}
