import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from '../../login/_services/auth.service';
import { datalogs } from 'src/environments/urls';




@Injectable({
  providedIn: 'root'
})
export class DatalogsService {

  private on_demand_datalogs = datalogs.Ondemand_datalogs;
  private ondemand_datalogs_graph = datalogs.Ondemand_datalogsGraph;
  private on_demand_datalogs_csv = datalogs.Ondemand_datalogsCSV;
  private lastdays_tenant_datalogs = datalogs.lastdays_tenant_datalogs;
  private lastdays_subtenant_datalogs = datalogs.lastdays_subtenant_datalogs;

  public datalog_graph_response:any;
  public datalog_table_response:any;

  constructor(private http: HttpClient, private authService: AuthService) { }

  // This function will call the API for GET method, It will display the On Demand data logs based on start date, end date and device gateway_id.
  getOnDemandDatalogs(gateway_id:any, attribute:any, startdate:any, enddate:any, timezone:string){
    let get_data = {
      'gateway_id': gateway_id,
      'attribute':attribute,
      'startdate':startdate,
      'enddate': enddate,
      'timezone': timezone
    }
    return this.http.post(this.on_demand_datalogs, get_data).pipe(map(response=>{
      this.datalog_table_response = response;
   }));
  }

    // This function will call the API for GET method, It will display the On Demand data logs based on start date, end date and device gateway_id for Graph.
     getOnDemandDatalogsGraphS(gateway_id:any, attribute:any, startdate:any, enddate:any, timezone:string){
      let get_data = {
        'gateway_id': gateway_id,
        'attribute':attribute,
        'startdate':startdate,
        'enddate': enddate,
        'timezone': timezone
      }
      return this.http.post(this.ondemand_datalogs_graph, get_data).pipe(map(response=>{
        this.datalog_graph_response = response;
     }));
    }


  // This function will call the API for GET method, It will display the On Demand data logs based on start date, end date and device gateway_id.
    getOnDemandDatalogsCSVS(gateway_id:any, attribute:any, startdate:any, enddate:any, timezone:string){
      return this.http.get(this.on_demand_datalogs_csv+gateway_id+'/' +attribute+'/'+ startdate + '/' + enddate + '/' + timezone, {responseType: 'text'});
    }

  // This function will call the API for GET method, It will display the last 7 days and last 30 days data logs based on tenant id.
  getLast7and30daysTenantsDlogsS(day){
    if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == "MV1001"){
      return this.http.get(this.lastdays_tenant_datalogs+this.authService.currentUser['tenant_id'] + "/" + day);
    }else{
      return this.http.get(this.lastdays_subtenant_datalogs+this.authService.currentUser['subtenant_id'] + "/" + day);
    }
  }




}
