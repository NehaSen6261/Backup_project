import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { asset_datalog, assets } from '../../../../environments/urls';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class SimulatorService {

  private post_asset_dlog = asset_datalog.post_asset_dlog;
  private get_asset_status = assets.get_asset_info;

  public is_increment:boolean;

  message_text:any;
  action = "Dismiss";
  response_status:string;

  constructor(
    private http: HttpClient,
     private snackBar: SnackbarComponent) { }


  // This method will call the asset status by passing the asset id
  getAssetStatusS(asset_id:any) {
    return this.http.get(this.get_asset_status + asset_id);
  }
  
  private _refreshNeeded = new Subject<void>();
  getRefreshNeededS(){
    return this._refreshNeeded;
  }
   // This function will call the API for POST method, It will display the current day alerts  count based on tenantid.
   Sendpayload(post_data:any, page:string){
    return this.http.post(this.post_asset_dlog, post_data).pipe(tap((response)=>{
      this._refreshNeeded.next();
      if(response['Successful']){
        this.is_increment = true;
        this.response_status = "Successful";
        this.message_text = response['Successful'];
        if(page == "simulator"){
          if(response['is_increment']){
            this.is_increment = true;
          }
          this.snackBar.top_snackbar(this.message_text,this.response_status);
        }
        else{
          this.snackBar.top_snackbar(this.message_text,this.response_status);}
        }else{
          if(response['is_increment'] == false){
            this.is_increment = false;
            this.response_status = "warning";
          }else{
            this.response_status = "Unsuccessful";
          }          
          this.message_text = response['Unsuccessful'];
          this.snackBar.top_snackbar(this.message_text ,this.response_status);
        }
    })
      
      // map(response=>{
      // if(response['Successful']){
      //   this.is_increment = true;
      //   this.response_status = "Successful";
      //   this.message_text = response['Successful'];
      //   if(page == "simulator"){
      //     if(response['is_increment']){
      //       this.is_increment = true;
      //     }
      //     this.snackBar.top_snackbar(this.message_text,this.response_status);
      //   }else{
      //     this.snackBar.top_snackbar("Successfully Stopped /Running the asset !",this.response_status);
      //   }
      //   }else{
      //     if(response['is_increment'] == false){
      //       this.is_increment = false;
      //       this.response_status = "warning";
      //     }else{
      //       this.response_status = "Unsuccessful";
      //     }          
      //     this.message_text = response['Unsuccessful'];
      //     this.snackBar.top_snackbar(this.message_text ,this.response_status);
      //   }
      //  }
       
       );
     }


}
