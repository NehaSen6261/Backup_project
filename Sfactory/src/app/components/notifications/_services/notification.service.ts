import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../login/_services/auth.service';
import { notifications } from '../../../../environments/urls';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private put_notification=notifications.put_notification;
  private get_tenant_noti_list = notifications.get_tenant_noti_list;
  private get_tenant_noti_limit = notifications.get_tenant_noti_limit;
  private get_tenant_noti_count = notifications.get_tenant_noti_count;
  private get_tenant_noti_alert_cmd_event_count_list = notifications.get_tenant_noti_alert_cmd_event_count_list;
  private get_tenant_list_plant_id = notifications.get_tenant_list_plant_id;



  constructor(
    private http: HttpClient,
    private authService:AuthService,
  ) { }

  // This method will call the API for PUT method.
putNotificationS(message_id:any, update_data:any){
  return this.http.put(this.put_notification+message_id, update_data).pipe(map(response=>{ }));
}

 // This function will call the API for GET method and It will display all the Notification list for a tenant.
 getNotificationListS(){
  if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2 ||  this.authService.currentUser['role_id'] == "MV1001"){
     return this.http.get(this.get_tenant_noti_list+this.authService.currentUser['tenant_id']);
  }
  else if(this.authService.currentUser['role_id'] == 'PA1001'||this.authService.currentUser['role_id'] == 'PV1001'  || this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001'|| this.authService.currentUser['role_id'] == 'ASA1001' ||this.authService.currentUser['role_id'] == 'ASV1001'){
    return this.http.get(this.get_tenant_list_plant_id + this.authService.currentUser['sf_plant_id']);
  }
  }

  // This function will call the API for GET method and It will display all the Notification limit 50 for a tenant.
  getNotificationLimitS(){
    if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == "MV1001" ){
       return this.http.get(this.get_tenant_noti_limit+this.authService.currentUser['tenant_id']);
    }
    else if(this.authService.currentUser['role_id'] == 'PA1001'||this.authService.currentUser['role_id'] == 'PV1001'  || this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001'|| this.authService.currentUser['role_id'] == 'ASA1001' ||this.authService.currentUser['role_id'] == 'ASV1001'){
      return this.http.get(this.get_tenant_list_plant_id + this.authService.currentUser['sf_plant_id']);
    }
  }

 // This function will call the API for GET method and It will display all the Notification count for a tenant.
 getNotificationCountS(){
  if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == "MV1001"||this.authService.currentUser['role_id'] == 'PV1001'||this.authService.currentUser['role_id'] == 'PA1001'){
    return this.http.get(this.get_tenant_noti_count+this.authService.currentUser['tenant_id']);
 }
}

// This function will call the API for GET method and It will display alerts and commands count with on monthly  basis for sparkline charts for tenant.
getTenantAlertsCmdNotiS(){
if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2 ||this.authService.currentUser['role_id'] == "MV1001"||this.authService.currentUser['role_id'] == 'PV1001'||this.authService.currentUser['role_id'] == 'PA1001'){
  return this.http.get(this.get_tenant_noti_alert_cmd_event_count_list+this.authService.currentUser['tenant_id']);
}

 }


}
