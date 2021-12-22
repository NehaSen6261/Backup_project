import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { auditlogs } from 'src/environments/urls';
import { AuthService } from '../../login/_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuditlogService {

  private get_tenant_audits = auditlogs.get_tenant_audits;
  private get_plant_audits = auditlogs.get_plant_audits;
  constructor(
    private http: HttpClient,
    private authService:AuthService
  ) { }

  // This function will call the API for GET method, It will display the all the auditlogs by tenant id.
  getAuditlogsS(){
    if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2|| this.authService.currentUser['role_id'] == 'MV1001' )
    {
      return this.http.get(this.get_tenant_audits + this.authService.currentUser['tenant_id']);
    }
    else if(this.authService.currentUser['role_id'] == 'PV1001'|| this.authService.currentUser['role_id'] == 'PA1001' || this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001' ||this.authService.currentUser['role_id'] == 'ASA1001' || this.authService.currentUser['role_id'] == 'ASV1001'){
      return this.http.get(this.get_plant_audits + this.authService.currentUser['sf_plant_id']);
     }
  }

}
