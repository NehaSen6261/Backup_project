import { Injectable } from '@angular/core';
import { report } from '../../../../environments/urls';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private getreport = report.getreport;

  constructor(
    private http: HttpClient,
  ) { }

  getreports(startdate:any ,enddate:any,asset_id:any,metrics:any,datalog:any){
   const params = new HttpParams().set('start_date', startdate).set('end_date', enddate).set('asset_id',asset_id).set('metrics_type',metrics).set('data_format',datalog);
    return this.http.get(this.getreport+'?'+'start_date='+"'"+startdate+"'&"+'end_date='+"'"+enddate+"'&"+'asset_id='+asset_id+'&'+'metrics_type='+metrics+'&'+'data_format='+datalog) 
   
  }
}
