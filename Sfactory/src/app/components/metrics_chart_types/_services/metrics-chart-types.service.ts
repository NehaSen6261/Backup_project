import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { attributemetrics } from 'src/environments/urls';

@Injectable({
  providedIn: 'root'
})
export class MetricsChartTypesService {

  private post_attr_metrics = attributemetrics.post_attr_metrics;
  private put_attr_metrics = attributemetrics.put_attr_metrics;
  private post_put_attr_metrics = attributemetrics.post_put_attr_metrics;
  private get_attr_metrics = attributemetrics.get_attr_metrics;
  private get_attr_str_metrics = attributemetrics.get_attr_str_metrics;


  message_text:any;
  action = "Dismiss";
  response_status:string;
  constructor(
       private http: HttpClient,
       private snackBar: SnackbarComponent,
       ) { }

   // This function will call the API for POST method.
  postAttrMetricsS(post_data:any){
    return this.http.post(this.post_attr_metrics, post_data).pipe(map(response=>{
      if(response['Successful']){
        this.response_status = "Successful";
        this.message_text = response['Successful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status );
      }else{
        this.response_status = "Unsuccessful";
        this.message_text = response['Unsuccessful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status );
      }
    }));
}

  // This function will call the API for POST method and it will check the attribute metrics if it is available then it will update the existing record, else it will
// create a new record.
   postPutAttrMetricsS(post_data:any){
    return this.http.post(this.post_put_attr_metrics, post_data).pipe(map(response=>{
      if(response['Successful']){
        this.response_status = "Successful";
      }else{
        this.response_status = "Unsuccessful";
        this.message_text = response['Unsuccessful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status );
      }
    }));
}


// This method will call the API for PUT method by timeinterval and screenname.
putAttrMetricsS(timeinterval:string, screenname:string, update_data:any){
  return this.http.put(this.put_attr_metrics+timeinterval+'/'+screenname, update_data).pipe(map(response=>{
    if(response['Successful']){
      this.response_status = "Successful";
      this.message_text = response['Successful'];
      this.snackBar.top_snackbar(this.message_text,this.response_status );
    }else{
      this.response_status = "Unsuccessful";
      this.message_text = response['Unsuccessful'];
      this.snackBar.top_snackbar(this.message_text,this.response_status );
    }
  }));
}

// This function will call the API for GET method and It will display all the attribute metrics NUMBER.
getattrMetricsS(gateway_id:string, attribute_id:string, timeinterval:string, screenname:string, attr_name:string, time_zone:string ){
  return this.http.get(this.get_attr_metrics+gateway_id+'/'+attribute_id+'/'+timeinterval+'/'+screenname+'/'+attr_name + '/' + time_zone)
}

// This function will call the API for GET method and It will display all the attribute metrics for STRING data type.
getattrStrMetricsS(gateway_id:string, timeinterval:string, attr_name:string, time_zone:string, attribute_id:string  ){
  return this.http.get(this.get_attr_str_metrics+gateway_id+'/'+timeinterval+'/'+attr_name+ '/' + time_zone + '/' + attribute_id)
}



}
