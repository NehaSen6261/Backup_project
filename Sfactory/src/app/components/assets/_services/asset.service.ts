import { Injectable, ɵConsole } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../login/_services/auth.service';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { assets, asset_analysis, assetEfficencyAnalysis, assetMetricMaster} from 'src/environments/urls';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  private post_asset = assets.post_asset;
  private put_asset = assets.put_asset;
  private delete_asset = assets.delete_asset;
  private get_asset_info = assets.get_asset_info;
  private get_tenant_assets = assets.get_tenant_assets;
  private get_tenant_assets_list = assets.get_tenant_assets_list;
  private get_workcenter_assets = assets.get_workcenter_assets;
  private get_workcenters_assets_list = assets.get_workcenters_assets_list;
  private get_assets_plant_id = assets.get_assets_plant_id;
  private get_workcenter_asset_id = assets.get_workcenter_asset_id;
  private latest_asset_calculations =  asset_analysis.get_latest_analysis;
  private trend_asset_calculations = asset_analysis.trend_latest_analysis;
  private get_tenant_assets_status = assets.get_tenant_assets_status;
  private get_plantassets_status = assets.get_plantassets_status;
  private get_job_assest = assets.get_job_assest;
  private get_assetlist_date = assets.get_assetlist_date;
  private get_plantjobasset = assets.get_plantjobasset;
  private get_asset_assets = assets.get_asset_assets;
  private get_job_operator_assets = assets.get_job_operator_assets;  
  private get_all_tenant_assetlist = assets.get_all_tenant_assetlist
  private get_multi_wc_asset = assets.get_multi_wc_asset
  private get_todayoee =  assetEfficencyAnalysis.get_todayoee;
  private get_slow_cycle= assetEfficencyAnalysis.get_slow_cycle;
  private get_todayperformance =  assetEfficencyAnalysis.get_todayperformance;
  private get_todayavailability =  assetEfficencyAnalysis.get_todayavailability;
  private get_todayquality =  assetEfficencyAnalysis.get_todayquality;
  private get_lastdaysoee =  assetEfficencyAnalysis.get_lastdaysoee;
  private get_lastdaysperformance =  assetEfficencyAnalysis.get_lastdaysperformance;
  private get_lastdaysavailability =  assetEfficencyAnalysis.get_lastdaysavailability;
  private get_lastdaysquality =  assetEfficencyAnalysis.get_lastdaysquality;
  private get_today_TB_metrics= assetEfficencyAnalysis.get_today_TB_metrics;
  private get_lastdaysppn = assetEfficencyAnalysis.get_lastdaysppn;
  private get_lastdaysnrr = assetEfficencyAnalysis.get_lastdaysnrr;
  private get_lastdaysftp = assetEfficencyAnalysis.get_lastdaysftp;
  private get_todayqlscp = assetEfficencyAnalysis.get_todayqlscp;
  private get_lastdaysqlyloss = assetEfficencyAnalysis.get_lastdaysqlyloss;
  private get_lastdaysperfloss = assetEfficencyAnalysis.get_lastdaysperfloss;
  private get_lastdaysavailloss = assetEfficencyAnalysis.get_lastdaysavailloss;
  private get_lastdaysrdftime = assetEfficencyAnalysis.get_lastdaysrdftime;
  private get_lastdaysqsip = assetEfficencyAnalysis.get_lastdaysqsip;

  private get_mean_Time_Between_Replacements = assetEfficencyAnalysis.get_mean_Time_Between_Replacements
  private get_mean_Time_To_Repair= assetEfficencyAnalysis.get_mean_Time_To_Repair;
  private get_fault_trend =assetEfficencyAnalysis.get_fault_trend;

  private post_assetmetric = assetMetricMaster.post_assetmetric;
  private put_assetmetric = assetMetricMaster.put_assetmetric;
 
  private get_assets_plant_workcenter_id = assets.get_assets_plant_workcenter_id; 

  message_text:any;
  action = "Dismiss";
  response_status:string;

  constructor(
    private http: HttpClient,
    private snackBar: SnackbarComponent,
    private authService:AuthService,
  ) { }

  // This function will call the API for POST method.
  postAssetS(post_data:any){
    return this.http.post(this.post_asset, post_data).pipe(map(response=>{
    if(response['Successful']){
      this.response_status = "Successful";
      this.message_text = response['Successful'];
      this.snackBar.top_snackbar(this.message_text,this.response_status);
    }else{
      this.response_status = "Unsuccessful";
      this.message_text = response['Unsuccessful'];
      this.snackBar.top_snackbar(this.message_text,this.response_status);
    }
   }));
  }

// This function will call the API for PUT method to update asset based on asset_id.
putAssetS(asset_id:string, asset_data:any){
   return this.http.put(this.put_asset+asset_id, asset_data).pipe(map(response=>{
     if(response['Successful']){
       this.response_status = "Successful";
       this.message_text = response['Successful'];
       this.snackBar.top_snackbar(this.message_text ,this.response_status);
     }else{
       this.response_status = "Unsuccessful";
       this.message_text = response['Unsuccessful'];
       this.snackBar.top_snackbar(this.message_text, this.response_status);
     }
 }));
}

  // This function deletes the particular  Asset bt asset id.
  deleteAssetS(plant_id:string){
    return this.http.delete(this.delete_asset+ plant_id).pipe(map(response=> {
      if(response['Successful']){
        this.response_status = "Successful";
        this.message_text = response['Successful'];
        this.snackBar.top_snackbar(this.message_text, this.response_status );
      }else{
        this.response_status = "Unsuccessful";
        this.message_text = response['Unsuccessful'];
        this.snackBar.top_snackbar(this.message_text , this.response_status );
      }
    }))
  }

  // This function will call the API for GET method, It will display the  asset info by asset id.
  getAssetinfoS(asset_id:any){
    return this.http.get(this.get_asset_info +asset_id);
  }

  
 // This function will call the API for GET method, It will display the all the assets by tenant id. 
 getAssetsS(){
  let params = new HttpParams();     
  if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2|| this.authService.currentUser['role_id'] == 'MV1001'){ 
    return this.http.get(this.get_tenant_assets + this.authService.currentUser['tenant_id']); 
  }else if(this.authService.currentUser['role_id'] == 'PA1001'||this.authService.currentUser['role_id'] == 'PV1001' ){ 
     params = params.append('plant_id', this.authService.currentUser['sf_plant_id'].toString()); 
    return this.http.get(this.get_assets_plant_workcenter_id, {params: params})
  }else if( this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001'){ 
   params = params.append('work_centre_id',this.authService.currentUser['work_centre_id'].toString()); 
  return this.http.get(this.get_assets_plant_workcenter_id, {params: params}); 
  }else if(this.authService.currentUser['role_id'] == 'ASA1001' || this.authService.currentUser['role_id'] == 'ASV1001'){
  return this.http.get(this.get_workcenter_asset_id + this.authService.currentUser['email']); 
  } 

}

// This function will call the API for GET method, It will display the all the assets list for dropdown by tenant id. 
getAssetslistS(){ 
 let params = new HttpParams(); 
  if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2|| this.authService.currentUser['role_id'] == 'MV1001' ){ 
  return this.http.get(this.get_tenant_assets_list + this.authService.currentUser['tenant_id']); 
  }else if(this.authService.currentUser['role_id'] == 'PA1001'||this.authService.currentUser['role_id'] == 'PV1001' ){ 
   params = params.append('plant_id', this.authService.currentUser['sf_plant_id'].toString()); 
   return this.http.get(this.get_assets_plant_workcenter_id, {params: params}); 
  }else if( this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001'){ 
    params = params.append('work_centre_id',this.authService.currentUser['work_centre_id'].join(',')); 
    return this.http.get(this.get_assets_plant_workcenter_id,{params: params}); 
  }else{ 
     return this.http.get(this.get_job_operator_assets + this.authService.currentUser['email']); 
   } 
} 

 // This function will call the API for GET method, It will display the all the assets by workcenter id.
 getWorkcenterAssetsS(workcenter_id:any){
    return this.http.get(this.get_workcenter_assets + workcenter_id);
 }

// This function will call the API for GET method, It will display the all the assets  list by workcenter id.
  getWorkcenterAssetsListS(workcenter_id:any){
    if(this.authService.currentUser['role_id'] == 'ASA1001' ||this.authService.currentUser['role_id'] == 'ASV1001'){ 
      return this.http.get(this.get_workcenter_asset_id + this.authService.currentUser['email']); 
      }else{
        return this.http.get(this.get_workcenters_assets_list + workcenter_id);
      }
    }

// This function will call the API for GET method, It will display the all the assets  list by all workcenter id.
getMultiWCAsset(workcenters_id:any){
  return this.http.get(this.get_multi_wc_asset + workcenters_id);
  
 }

 
// This function will call the API for GET method, It will display the all the assets  list by tenant id.
getInactiveActiveAssetsList(){
 return this.http.get(this.get_all_tenant_assetlist + this.authService.currentUser['tenant_id']);
}

//this function will get the slow cycle record
getslowcycles(asset_id:any){
  return this.http.get(this.get_slow_cycle + asset_id);
 
}

// This function will call the API for GET method, It will display the all the current asset analysis by asset id.
getAssetanalysisS(asset_id:any, time_zone:string){
  return this.http.get(this.latest_asset_calculations + asset_id + '/' + time_zone);
}

// This function will call the API for GET method, It will display the all the trend asset analysis by asset id.
getAssetTrendanalysisS(time_interval:string, asset_id:any, time_zone:string){
  return this.http.get(this.trend_asset_calculations +time_interval + '/' + time_zone + '/' + asset_id);
}

// This function will call the API for GET method, It will display the all the assets and its status.
getAssetsStatusS(time_zone:string){
  if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2|| this.authService.currentUser['role_id'] == 'MV1001'  ){
    return this.http.get(this.get_tenant_assets_status + this.authService.currentUser['tenant_id']+'/'+time_zone);
  }
  else if(this.authService.currentUser['role_id'] == 'PA1001'||this.authService.currentUser['role_id'] == 'PV1001' ){
    return this.http.get(this.get_plantassets_status + this.authService.currentUser['sf_plant_id']+'/'+time_zone);
   }
  
}

// This method will display the assets which is associated any job.
Jobassetlist(){
  if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2|| this.authService.currentUser['role_id'] == 'MV1001' || this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001' ){
    return this.http.get(this.get_job_assest + this.authService.currentUser['tenant_id']);
}
  else if(this.authService.currentUser['role_id'] == 'PA1001' || this.authService.currentUser['role_id'] == 'PV1001'){
    return this.http.get(this.get_plantjobasset + this.authService.currentUser['sf_plant_id']);
   }else{
    return this.http.get(this.get_job_operator_assets + this.authService.currentUser['email']);
   }
}

// This function will display assest drop down based on start and End Date.
getAssetlistbydateS(startdate:any,enddate:any,work_order_id:any){
  return this.http.get(this.get_assetlist_date + startdate  + '/' + enddate+'/' +work_order_id);
}

// This method will display today asset efficiency metrics(Time Based Analysis) by asset_id, time_interval, timezone.
gettodayTBmetricsS(assetid:any, timeinterval:any, timezone:any){
 return this.http.get(this.get_today_TB_metrics + assetid +'/' +timeinterval+'/'+timezone + '/' + this.authService.currentUser['email']);
}


//  This method will display today asset efficiency metrics( only OEE) by asset_id and timezone.
gettodayOEES(assetid:any, timezone:any){
  return this.http.get(this.get_todayoee + assetid +'/'+timezone );
}

//  This method will display today asset efficiency metrics( only PERFORMANCE) by asset_id and timezone.
gettodayPerformanceS(assetid:any, timezone:any){
  return this.http.get(this.get_todayperformance + assetid +'/'+timezone);
}

//  This method will display today asset efficiency metrics( only AVAILABILITY) by asset_id and timezone.
gettodayAvailabilityS(assetid:any, timezone:any){
  return this.http.get(this.get_todayavailability + assetid +'/'+timezone);
}

//  This method will display today asset efficiency metrics( only QUALITY) by asset_id and timezone.
gettodayQualityS(assetid:any, timezone:any){
  return this.http.get(this.get_todayquality + assetid +'/'+timezone);
}


//  This method will display last 7 or 30 days asset efficiency metrics( only OEE) by asset_id and timezone.
getlastdaysOEES(assetid:any, timeframe:any, timezone:any){
  return this.http.get(this.get_lastdaysoee + assetid +'/'+ timeframe+'/' + timezone + '/' + this.authService.currentUser['email']);
}

//  This method will display 7 or 30 days asset efficiency metrics( only PERFORMANCE) by asset_id and timezone.
getlastdaysPerformanceS(assetid:any, timeframe:any, timezone:any){
  return this.http.get(this.get_lastdaysperformance + assetid +'/'+ timeframe+ '/' + timezone + '/' + this.authService.currentUser['email']);
}

//  This method will display 7 or 30 days asset efficiency metrics( only AVAILABILITY) by asset_id and timezone.
getlastdaysAvailabilityS(assetid:any, timeframe:any, timezone:any){
  return this.http.get(this.get_lastdaysavailability + assetid +'/'+ timeframe+ '/' + timezone + '/' + this.authService.currentUser['email']);
}

//  This method will display 7 or 30 days asset efficiency metrics( only QUALITY) by asset_id and timezone.
getlastdaysQualityS(assetid:any, timeframe:any, timezone:any){
  return this.http.get(this.get_lastdaysquality + assetid +'/'+ timeframe+ '/' + timezone + '/' + this.authService.currentUser['email']);
}

// This method will display asset efficiency metrics(Time Based Analysis)[Planned production time vs scheduled loss]
//  by asset_id, time_interval, timezone.
get_lastdaysppnS(assetid:any, timeframe:any, timezone:any){
  return this.http.get(this.get_lastdaysppn + assetid +'/'+ timeframe+ '/' + timezone + '/' + this.authService.currentUser['email']);
}

// This method will display asset efficiency metrics(Time Based Analysis)[Net Runrate] by asset_id, time_interval, and timezone.
get_lastdaysnrrS(assetid:any, timeframe:any, timezone:any){
  return this.http.get(this.get_lastdaysnrr + assetid +'/'+ timeframe+ '/' + timezone + '/' + this.authService.currentUser['email']);
}

// This method will display asset efficiency metrics(Time Based Analysis)[Fully Productive time] by asset_id, time_interval, and timezone.
get_lastdaysftpS(assetid:any, timeframe:any, timezone:any){
  return this.http.get(this.get_lastdaysftp + assetid +'/'+ timeframe+ '/' + timezone + '/' + this.authService.currentUser['email']);
}

// This method will display quality and Rejection related data for today by asset id and timezone.
get_todayqlscpS(assetid:any, timezone:any){
  return this.http.get(this.get_todayqlscp + assetid + '/' + timezone);
}

// This method will display Quality  loss metrics(Time Based Analysis) by asset_id, time_interval, timezone.   
get_lastdaysqlyLoss(assetid:any, timeinterval:any, timezone:any){
return this.http.get(this.get_lastdaysqlyloss + assetid +'/' +timeinterval+'/'+timezone + '/' + this.authService.currentUser['email']);  
}

// This method will display performance loss metrics(Time Based Analysis) by asset_id, time_interval, timezone.     
get_lastdaysPerfloss(assetid:any, timeinterval:any, timezone:any){
return this.http.get(this.get_lastdaysperfloss + assetid +'/' +timeinterval+'/'+timezone + '/' + this.authService.currentUser['email']);
}

// This method will display  availability loss metrics(Time Based Analysis) by asset_id, time_interval, timezone.
get_lastdaysAvailloss(assetid:any, timeinterval:any, timezone:any){
  return this.http.get(this.get_lastdaysavailloss + assetid +'/' +timeinterval+'/'+timezone + '/' + this.authService.currentUser['email']);
}

// This method will return asset run time, down time(planned breaks), and fault time by asset id and time zone.
get_lastdaysrdftimeS(assetid:any, timeinterval:any, timezone:any){
  return this.http.get(this.get_lastdaysrdftime + assetid +'/' +timeinterval+'/'+timezone);
}

// This method will return asset quantity, Rejection and ideal run rate by asset id and time zone.
get_lastdaysqsipS(assetid:any, timeinterval:any, timezone:any){
  return this.http.get(this.get_lastdaysqsip + assetid +'/' +timeinterval+'/'+timezone);
}


//KPI Maintance 


// This method will display  availability loss metrics(Time Based Analysis) by asset_id, time_interval, timezone.
mean_Time_Between_Replacements (assetid:any,  timezone:any,timeinterval:any){
  return this.http.get(this.get_mean_Time_Between_Replacements+assetid +'/'+timezone +'/'+timeinterval+'/'+ this.authService.currentUser['email'] );
  }

// This method will display  availability loss metrics(Time Based Analysis) by asset_id, time_interval, timezone.

mean_Time_To_Repair (assetid:any,  timezone:any,timeinterval:any){
  return this.http.get(this.get_mean_Time_To_Repair+assetid +'/'+timezone +'/'+timeinterval+'/'+ this.authService.currentUser['email'] );
   }  

   // This method will display  availability loss metrics(Time Based Analysis) by asset_id, time_interval, timezone.
faultTrend (assetid:any,timeinterval:any){
  return this.http.get(this.get_fault_trend+assetid +'/'+timeinterval+'/'+ this.authService.currentUser['email'] );
   } 

// -----------------------------------------------------------------------------------------
// Asset Metrics Master
// -----------------------------------------------------------------------------------------
// This function will call the API for POST method and it will save the asset metrics related info.
postAssetMetricS(post_data:any){
  return this.http.post(this.post_assetmetric, post_data).pipe(map(response=>{
  if(response['Successful']){
    this.response_status = "Successful";
    this.message_text = response['Successful'];
    this.snackBar.top_snackbar(this.message_text,this.response_status);
  }else{
    this.response_status = "Unsucessfull";
    this.message_text = response['Unsuccessful'];
    this.snackBar.top_snackbar(this.message_text,this.response_status);
  }
 }));
}

// This function will call the API for PUT method to update asset metrics related info based on assetmetric id.
putAssetMetricS(assetmetric_data:any){
 return this.http.put(this.put_assetmetric, assetmetric_data).pipe(map(response=>{
   if(response['Successful']){
     this.response_status = "Successful";
     this.message_text = response['Successful'];
     this.snackBar.top_snackbar(this.message_text ,this.response_status);
   }else{
     this.response_status = "Unsucessfull";
     this.message_text = response['Unsuccessful'];
     this.snackBar.top_snackbar(this.message_text,this.response_status );
   }
}));
}


}
