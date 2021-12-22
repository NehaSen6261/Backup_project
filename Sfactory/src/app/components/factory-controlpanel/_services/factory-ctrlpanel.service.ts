import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { AuthService } from '../../login/_services/auth.service';
import { factory_controlpanel } from '../../../../environments/urls';


@Injectable({
  providedIn: 'root'
})

export class FactoryCtrlpanelService {
  private post_asset_cntrl_panel = factory_controlpanel.post_asset_cntrl_panel;
  private get_tenant_factory_cntrl_panel = factory_controlpanel.get_tenant_factory_cntrl_panel;
  private get_tenant_factory_plant_cntrl_panel = factory_controlpanel.get_tenant_factory_plant_cntrl_panel;
  private delete_asset_cntrl_panel = factory_controlpanel.delete_asset_cntrl_panel;

  message_text: any;
  action = "Dismiss";
  response_status:string;

  constructor(
    private http: HttpClient,
    private snackBar: SnackbarComponent,
    private authService: AuthService
  ) { }

// This method will call the API to post the asset control panel data
  postAssetCntrlPanelS(data:any){
    return this.http.post(this.post_asset_cntrl_panel ,data).pipe(map(response=>{
      if (response['Successful']) {
      this.response_status = "Successful";
      this.message_text = response['Successful'];
      this.snackBar.top_snackbar(this.message_text, this.response_status );
    } else {
      this.response_status = "Unsuccessful";
      this.message_text = response['Unsuccessful'];
      this.snackBar.top_snackbar(this.message_text, this.response_status );
    }
  }))
  }

// This method will call the API to get the asset control panel data.
  getTenantFactoryCntrlPanelS(time_zone:string){
    if (this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == "MV1001"){
      return this.http.get(this.get_tenant_factory_cntrl_panel + this.authService.currentUser['tenant_id'] + '/' + time_zone)
    }else{
      return this.http.get(this.get_tenant_factory_plant_cntrl_panel + this.authService.currentUser['sf_plant_id'] + '/' + time_zone)
    }
  }

  // This function will call the API for deleting the control panel.
  deleteAssetCtrlpanelS(factory_ctrl_id: Number) {
    return this.http.delete(this.delete_asset_cntrl_panel + factory_ctrl_id).pipe(map(response => {
      if (response['Successful']) {
        this.response_status = "Successful";
        this.message_text = response['Successful'];
        this.snackBar.top_snackbar(this.message_text, this.response_status );
      } else {
        this.response_status = "Unsuccessful";
        this.message_text = response['Unsuccessful'];
        this.snackBar.top_snackbar(this.message_text, this.response_status );
      }
    }))
  }

}
