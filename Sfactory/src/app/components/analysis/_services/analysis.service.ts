import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { analysis } from 'src/environments/urls';


@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  // urls variables
  private analysis_list = analysis.analysis_list;
  private currnt_attr_analysis = analysis.current_attr_analysis;
  private attr_detailed_analysis = analysis.attr_detailed_analysis;
  private last_24hr_attr_analysis = analysis.last_24hr_attr_analysis;
  private last_7days_attr_analysis = analysis.last_7days_attr_analysis;
  private last_12months_attr_analysis = analysis.last_12months_attr_analysis;
  private last_30days_attr_analysis = analysis.last_30days_attr_analysis;
  private all_device_attr_analysis = analysis.all_device_attr_analysis;


  constructor(private http: HttpClient) { }

     // This function will call the API for GET method, It will display the analysis based on gateway id.
      getDeviceAnalysisS(gateway_id){
        return this.http.get(this.analysis_list + gateway_id);
      }

     // This function will call the API for GET method, It will display the current device attributes analysis based on gateway id and attribute.
     getCurrent_S(gateway_id, attribute){
      return this.http.get(this.currnt_attr_analysis + gateway_id + '/' + attribute);
     }

      // This function will call the API for GET method, It will display the device attributes analysis based on card no, and screen name.
      getAttrDetailedAnalysisS(cardno:string, screenname:string, attribute_id:any, timezone:string, euiid:string){
        return this.http.get(this.attr_detailed_analysis + cardno + '/' + screenname + '/' + attribute_id + '/' + timezone + '/' + euiid);
      }

      // This function will call the API for GET method, It will display the last 24 hours device attributes analysis based on gateway id and attribute.
      getLast24hrDA_S(gateway_id, attribute){
        return this.http.get(this.last_24hr_attr_analysis + gateway_id + '/' + attribute);
      }

     // This function will call the API for GET method, It will display the last 7 days device attributes analysis based on gateway id and attribute.
     getLast7daysDA_S(gateway_id, attribute){
        return this.http.get(this.last_7days_attr_analysis + gateway_id + '/' + attribute);
     }

     // This function will call the API for GET method, It will display the last 12 months device attributes analysis based on gateway id and attribute.
     getLast12monthsDA_S(gateway_id, attribute){
      return this.http.get(this.last_12months_attr_analysis + gateway_id + '/' + attribute);
   }

    // This function will call the API for GET method, It will display the last 30 days device attributes analysis based on gateway id and attribute.
    getLast30daysDA_S(gateway_id, attribute){
         return this.http.get(this.last_30days_attr_analysis + gateway_id + '/' + attribute);
    }

    // This function will call the API for GET method, It will display the all device attributes anaysis based on gateway id and attribute for table.
    getallDA_S(gateway_id, attribute){
      return this.http.get(this.all_device_attr_analysis + gateway_id + '/' + attribute);
 }


}
