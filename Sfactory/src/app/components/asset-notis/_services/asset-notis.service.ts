import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from '../../login/_services/auth.service';
import { assetNotifications } from '../../../../environments/urls';


@Injectable({
  providedIn: 'root'
})
export class AssetNotisService {

  private put_notification=assetNotifications.put_notification;
  private get_tenantmsgs=assetNotifications.get_tenantmsgs;
  private get_plantmsgs=assetNotifications.get_plantmsgs;
  private get_tenantthmsgs=assetNotifications.get_tenantthmsgs;
  private get_plantthmsgs=assetNotifications.get_plantthmsgs;
  private get_tenanttomsgs=assetNotifications.get_tenanttomsgs;
  private get_planttomsgs=assetNotifications.get_planttomsgs;
  private get_tenantallalts=assetNotifications.get_tenantallalts;
  private get_plantallalts=assetNotifications.get_plantallalts;  
  private get_tenantmsgscsv = assetNotifications.get_tenantmsgscsv;
  private get_plantmsgscsv = assetNotifications.get_plantmsgscsv;
  


  constructor(
    private http: HttpClient,
    private authService:AuthService
    ) { }

  // This method will call the API for PUT method.
putNotificationS(message_id:any, update_data:any){  
  return this.http.put(this.put_notification+message_id, update_data).pipe(map(response=>{ }));
}



// This function will call the API for GET method and It will display last total count of info, warning, and
//  critical alerts by tenant id and plant id.
getallaltsS(){
  if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2 ||  this.authService.currentUser['role_id'] == "MV1001"){
    return this.http.get(this.get_tenantallalts+this.authService.currentUser['tenant_id']);
 }
  else if(this.authService.currentUser['role_id'] == 'PA1001'||this.authService.currentUser['role_id'] == 'PV1001'  || this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001'|| this.authService.currentUser['role_id'] == 'ASA1001' ||this.authService.currentUser['role_id'] == 'ASV1001'){
  return this.http.get(this.get_plantallalts + this.authService.currentUser['sf_plant_id']);
}
}

// This function will call the API for GET method and it will display last 30 days total alerts.
gettotalaltsS(){
  if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2 ||  this.authService.currentUser['role_id'] == "MV1001"){
    return this.http.get(this.get_tenanttomsgs+this.authService.currentUser['tenant_id']);
 }
  else if(this.authService.currentUser['role_id'] == 'PA1001'||this.authService.currentUser['role_id'] == 'PV1001'  || this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001'|| this.authService.currentUser['role_id'] == 'ASA1001' ||this.authService.currentUser['role_id'] == 'ASV1001'){
  return this.http.get(this.get_planttomsgs + this.authService.currentUser['sf_plant_id']);
}
}


// This function will call the API for GET method and it will display last 30 days info, warning, and critical alerts.
getIWCthmsgsS(alert_type:any){
  if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2 ||  this.authService.currentUser['role_id'] == "MV1001"){
    return this.http.get(this.get_tenantthmsgs+this.authService.currentUser['tenant_id']+'/'+alert_type);
 }
  else if(this.authService.currentUser['role_id'] == 'PA1001'||this.authService.currentUser['role_id'] == 'PV1001'  || this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001'|| this.authService.currentUser['role_id'] == 'ASA1001' ||this.authService.currentUser['role_id'] == 'ASV1001' ){
  return this.http.get(this.get_plantthmsgs + this.authService.currentUser['sf_plant_id']+'/'+alert_type);
}
}

 // This function will call the API for GET method and It will display all the Notification list for a tenant.
 getNotificationListS(timezone:any, limit:any){
  if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2 ||  this.authService.currentUser['role_id'] == "MV1001"){
     return this.http.get(this.get_tenantmsgs+this.authService.currentUser['tenant_id']+'/'+timezone+'/'+limit);
  }else{
   return this.http.get(this.get_plantmsgs + this.authService.currentUser['sf_plant_id']+'/'+timezone+'/'+limit);
 }
}


// This function will call the API for GET method and it will export the data to CSV
getTenantmsgS(timezone:string){
  if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2 ||  this.authService.currentUser['role_id'] == "MV1001"){
    return this.http.get(this.get_tenantmsgscsv+this.authService.currentUser['tenant_id']+'/'+timezone,{responseType: 'text'});
 }
  else if(this.authService.currentUser['role_id'] == 'PA1001'||this.authService.currentUser['role_id'] == 'PV1001'  || this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001'|| this.authService.currentUser['role_id'] == 'ASA1001' ||this.authService.currentUser['role_id'] == 'ASV1001'){
  return this.http.get(this.get_plantmsgscsv + this.authService.currentUser['sf_plant_id']+'/'+timezone,{responseType: 'text'});
}
}
}
