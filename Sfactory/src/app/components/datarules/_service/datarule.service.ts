import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../login/_services/auth.service';
import { datarules } from 'src/environments/urls';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class DataruleService {

  private tenant_drules = datarules.get_tenant_drules;
  private user_drules = datarules.get_user_drules;
  private drule_info = datarules.get_drule_info;
  private add_drule = datarules.post_dlue;
  private delete_drule = datarules.delete_dlure;
  private inactivate_dlure = datarules.inactivate_dlure;
  private get_drule_plant = datarules.get_drule_plant

  message_text:any;
  action = "Dismiss";
  response_status:string;
  constructor(
                private http: HttpClient,
                private authService: AuthService,
                private snackBar: SnackbarComponent,
                private router:Router) { }

     // This function will call the API for GET method, It will display the data rules based on tenantid or user.
    getTUDrules(){
      if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == "MV1001"){
        return this.http.get(this.tenant_drules + this.authService.currentUser['tenant_id']);
      }
      else if(this.authService.currentUser['role_id'] == 'PA1001' || this.authService.currentUser['role_id'] == 'PV1001' ){
        return this.http.get(this.get_drule_plant + this.authService.currentUser['sf_plant_id']);
      }
      else{
        return this.http.get(this.user_drules + this.authService.currentUser['email']);
      }
    }

     // This function will display the particular Datarule information based on Drule Id
      getDruleInfo(){
        let drule_id = localStorage.getItem("drule_id");
        return this.http.get(this.drule_info+drule_id);
      }

    // This function will activate and deactivate  particular the data rule
    activate_deactivateDRuleS(status:string, drule:Number){
      return this.http.delete(this.inactivate_dlure+status+'/' + drule).pipe(map(response=>{
        if(response['Successful']){
          this.response_status = "Successful";
          this.message_text = response['Successful'];
          this.snackBar.top_snackbar(this.message_text,this.response_status  );
        }else{
          this.response_status = "Unsuccessful";
          this.message_text = response['Unsuccessful'];
          this.snackBar.top_snackbar(this.message_text,this.response_status  );
        }
      }));
    }

    // This function will delete  particular the data rule
    DeleteDataRuleS(drule:Number){
      return this.http.delete(this.delete_drule+drule).pipe(map(response=>{
        if(response['Successful']){
          this.response_status = "Successful";
          this.message_text = response['Successful'];
          this.snackBar.top_snackbar(this.message_text,this.response_status  );
          this.router.navigate(['/datarules'])
        }else{
          this.response_status = "Unsuccessful";
          this.message_text = response['Unsuccessful'];
          this.snackBar.top_snackbar(this.message_text,this.response_status  );
        }
      }));
    }

     //  This function will call the API for POST method.
    postDrule(post_data:any){
      return this.http.post(this.add_drule, post_data).pipe(map(response=>{
        if(response['Successful']){
          this.response_status = "Successful";
          this.message_text = response['Successful'];
          this.snackBar.top_snackbar(this.message_text,this.response_status  );
      }else{
        this.response_status = "Unsuccessful";
        this.message_text = response['Unsuccessful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status  );
      }
    }));
    }

}
