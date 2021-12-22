import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { performenceReport } from 'src/environments/urls';

@Injectable({
  providedIn: 'root'
})
export class PerformenceReportService {
  message_text:any;
  response_status:string;

  private get_tenant_pf_report_table = performenceReport.get_tenant_pf_report_table;
  private get_asset_datalog_csv = performenceReport.get_asset_datalog_csv;

  constructor(
    private http: HttpClient
  ) { }

    // This function will call the API for the GET method and it will display performence reports for table view.
    getPfReportTable(startdate:any ,enddate:any,assest_id:any,timezone:string){
        return this.http.get(this.get_tenant_pf_report_table + startdate + '/'+ enddate+ '/' + assest_id+'/'+timezone);
     }
    // This function will call the API for GET method, It will display the On asset data logs based on start date, end date.
    getAssetDatalogsCSVS(startdate:any, enddate:any,assest_id:any, timezone:string){
      return this.http.get(this.get_asset_datalog_csv + startdate + '/'+ enddate+ '/' + assest_id+'/'+timezone, {responseType: 'text'});
    }
}
