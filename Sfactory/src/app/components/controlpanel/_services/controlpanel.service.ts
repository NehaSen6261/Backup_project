import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { AuthService } from '../../login/_services/auth.service';
import { controlpanel } from '../../../../environments/urls';

@Injectable({
  providedIn: 'root'
})
export class ControlpanelService {

  private post_ctrlpanel = controlpanel.post_ctrlpanel;
  private delete_ctrlpanel = controlpanel.delete_ctrlpanel;
  private get_tenant_ctrlpanels = controlpanel.get_tenant_ctrlpanels;
  private get_subtenant_ctrlpanels = controlpanel.get_subtenant_ctrlpanels;
  private get_controlpanel_plant = controlpanel.get_controlpanel_plant;

  message_text: any;
  action = "Dismiss";
  response_status:string;
  constructor(
    private http: HttpClient,
    private snackBar: SnackbarComponent,
    private authService: AuthService,
  ) { }


  // This function will call the API for POST method.
  postCtrlpanelS(post_data: any) {
    return this.http.post(this.post_ctrlpanel, post_data).pipe(map(response => {
      if (response['Successful']) {
        this.response_status ="Successful";
        this.message_text = response['Successful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status);
      } else {
        this.response_status ="Unsuccessful";
        this.message_text = response['Unsuccessful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status);
      }
    }));
  }

  // This function will call the API for deleteing the control panel.
  deleteCtrlpanelS(ctrl_id: Number) {
    return this.http.delete(this.delete_ctrlpanel + ctrl_id).pipe(map(response => {
      if (response['Successful']) {
        this.response_status ="Successful";
        this.message_text = response['Successful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status);
      } else {
        this.response_status ="Unsuccessful";
        this.message_text = response['Unsuccessful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status);
      }
    }))
  }

  // This function will call the API for GET method and It will display all the control panels for a tenant and sub tenant.
  getTenantandSubCtrlpanelS() {
    if (this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == "MV1001") {
      return this.http.get(this.get_tenant_ctrlpanels + this.authService.currentUser['tenant_id']);
    }

    else if (this.authService.currentUser['role_id'] == 'PA1001' || this.authService.currentUser['role_id'] == 'PV1001') {
      return this.http.get(this.get_controlpanel_plant + this.authService.currentUser['sf_plant_id'])
    }
    else {
      return this.http.get(this.get_subtenant_ctrlpanels + this.authService.currentUser['subtenant_id'])
    }
  }
}
