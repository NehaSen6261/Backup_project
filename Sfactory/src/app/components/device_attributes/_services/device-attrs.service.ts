import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { attributes } from 'src/environments/urls';



@Injectable({
  providedIn: 'root'
})
export class DeviceAttrsService {

  private device_attribute = attributes.attributes_list;
  private multi_device_attributes = attributes.multi_dev_attributes_list;
  private attribute_uom_info = attributes.attribute_uom_info;
  private device_attribute_list = attributes.device_attribute_list;
  constructor(private http: HttpClient) { }

  // This function will call the API for GET method, It will display the device attributes based on gateway id.
  getDeviceAttributesS(){
    let gateway_id = localStorage.getItem('analysis_gtw');
    return this.http.get(this.device_attribute + gateway_id);
  }

   // This function will call the API for GET method, It will display the multiple devicea attributes based on gateway id.
   getMultiDeviceAttributesS(gatewayid:any){
    return this.http.get(this.multi_device_attributes + gatewayid);
  }


//  This function will call the API for GET method, It will return UOM and other info of attribute by gateway_id and attribute
getAttrUOMInfoS(gatewayid:any, att_name:string){
  return this.http.get(this.attribute_uom_info + gatewayid + '/' + att_name);
}

   // This function will call the API for GET method, It will display the  device attribute Info based on devi_eui .
   getDeviceAttributeInfoS(dev_eui:number){
    return this.http.get(this.device_attribute_list + dev_eui);
 }

}
