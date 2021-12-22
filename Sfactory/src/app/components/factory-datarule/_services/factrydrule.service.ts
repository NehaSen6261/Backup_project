import { Injectable } from '@angular/core';
import { factoryDrule } from '../../../../environments/urls'
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../login/_services/auth.service';
import { map } from 'rxjs/internal/operators/map';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';


@Injectable({
  providedIn: 'root'
})
export class FactrydruleService {
  private get_factory_drule = factoryDrule.get_factory_drule;
  private post_factory_drule = factoryDrule.post_factory_drule;
  private inactive_active_factory_drule = factoryDrule.inactive_active_factory_drule;
  private delete_factory_drule = factoryDrule.delete_factory_drule;
  private plant_factory_rule = factoryDrule.plant_factory_rule;

  message_text:any;
  action = "Dismiss";
  response_status:string;
  constructor(private http: HttpClient,
    private authService: AuthService,
    private snackBar: SnackbarComponent
    ) { }


  //This method is calls the API to get the factory drule info by tenant ID.
  getFactoryDruleS(){
    if (this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == "MV1001" ) {
      return this.http.get(this.get_factory_drule + this.authService.currentUser['tenant_id']);
    }else if ( this.authService.currentUser['role_id'] == 'PA1001'|| this.authService.currentUser['role_id'] == 'PV1001'|| this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001'|| this.authService.currentUser['role_id'] == 'ASA1001'|| this.authService.currentUser['role_id'] == 'ASV1001'){
      return this.http.get(this.plant_factory_rule + this.authService.currentUser['sf_plant_id'])
    }
  }

  // This method calls the API to POST the data
  post_factoryDruleS(data){
  return this.http.post(this.post_factory_drule , data).pipe(map(response=>{
    if(response['Successful']){
      this.response_status = "Successful";
      this.message_text = response['Successful'];
      this.snackBar.top_snackbar(this.message_text,this.response_status );
    } else{
      this.response_status = "Unsuccessful";
      this.message_text = response['Unsuccessful'];
      this.snackBar.top_snackbar(this.message_text,this.response_status );
    }
  }))
  }

  // this method is calls the API to activate and deactivate the factory data rule .
  activateFactoryDruleS(status:string, factDrule:Number){
    return this.http.delete(this.inactive_active_factory_drule +status+  '/'+ factDrule).pipe(map(response=>{
      if(response['Successful']){
        this.response_status = "Successful";
        this.message_text = response['Successful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status );
      }else{
        this.response_status = "Unsuccessful";
        this.message_text = response['Unsuccessful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status );
      }
    }))
  }

   // This function will delete  particular the data rule
   deleteFactorydruleS(drule:Number){
    return this.http.delete(this.delete_factory_drule+drule).pipe(map(response=>{
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
}
