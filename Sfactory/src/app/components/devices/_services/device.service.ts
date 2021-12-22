import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { devices } from 'src/environments/urls';
import { AuthService } from '../../login/_services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  selected_device_info:any;
  selected_device_app_name:string;

  // urls variables
  private device_info = devices.Devices_info;
  private tenant_devices = devices.Tenant_devices;
  private tenant_devices_with_health = devices.Tenant_devices_with_health;
  private subtenant_devices = devices.SubTenant_devices;
  private subtenant_devices_with_health = devices.SubTenant_devices_with_health;
  private asset_devices = devices.asset_devices;
  private asset_devices_list = devices.asset_devices_list;
  private tenant_na_devices_list = devices.tenant_na_devices_list;

  constructor(private http: HttpClient, private authService: AuthService) { }

    // This function will call the API for GET method, It will display the devices based on tenant id or sub tenant id.
    getTenantDevicesS(){
      if(this.authService.currentUser['role_id'] == 1000 || this.authService.currentUser['role_id'] == 1001){
        return this.http.get(this.subtenant_devices + this.authService.currentUser['subtenant_id']);
      }else{
        return this.http.get(this.tenant_devices + this.authService.currentUser['tenant_id']);
      }

    }

    // This function will call the API for GET method, It will display the devices based on tenant id along with the health status.
    getTenantDevicesWHeathS(){
      if(this.authService.currentUser['role_id'] == 1000 || this.authService.currentUser['role_id'] == 1001){
        return this.http.get(this.subtenant_devices_with_health + this.authService.currentUser['subtenant_id']);
      }else{
        return this.http.get(this.tenant_devices_with_health + this.authService.currentUser['tenant_id']);
      }
     }

    // This function will call the API for GET method, It will display the device Info based on gateway id .
    getDeviceInfoS(gateway_id:number){
        return this.http.get(this.device_info + gateway_id);
     }

     // This function will call the API for GET method, It will display the asset devices based on asset id .
    getAssetDevicesS(asset_id:number){
      return this.http.get(this.asset_devices + asset_id);
   }

   // This function will call the API for GET method, It will display the asset devices based on asset id  for dropdown.
   getAssetDeviceslistS(asset_id:number){
    return this.http.get(this.asset_devices_list + asset_id);
  }

     // This function will call the API for GET method, It will display the  devices which is not associated with any asset by tenant id  for dropdown.
     getTenantDevicesNAlistS(){
      return this.http.get(this.tenant_na_devices_list + this.authService.currentUser['tenant_id']);
    }


}
