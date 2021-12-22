import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { AuthService } from '../../login/_services/auth.service';
import { PartManagement } from '../../../../environments/urls';
@Injectable({
  providedIn: 'root'
})
export class PartservicesService {
  private post_part_management = PartManagement.post_part_management;
  private get_all_part_management = PartManagement.get_all_part_management;
  private get_Tenant_parent_part_code_list = PartManagement.get_Tenant_parent_part_code_list;
  private get_all_tenant_part_list_by_partid = PartManagement.get_all_tenant_part_list_by_partid;
  private put_Tenant_part_by_partid = PartManagement.put_Tenant_part_by_partid;
  private delete_part_by_partid = PartManagement.delete_part_by_partid;
  message_text:any;
  action = "Dismiss";
  response_status:string;
  constructor( private http: HttpClient,
    private snackBar: SnackbarComponent,
    private authService:AuthService,
    private router:Router
  ) { }

     // This function will call the API for POST method.
     post_partmgmt(post_data:any){
      return this.http.post(this.post_part_management, post_data).pipe(map(response=>{
      if(response['Successful']){
        this.response_status = "Successful";
        this.message_text = response['Successful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status  );
      }else{
        this.response_status = "Unsuccessful";
        this.message_text = response['Unsuccessful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status );
      }
      }));
  }

  // This method will call the API for UPDATE method 
  updatePartMgmtS(part_id:number,partmgmtdata:any){
    return this.http.put(this.put_Tenant_part_by_partid+part_id, partmgmtdata).pipe(map(response=>{
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
    // This function will call the API for GET method and It will display all the plants for a tenant.
    getAllPartMgmt() {
      return this.http.get(this.get_all_part_management + this.authService.currentUser['tenant_id']);
    }

    // This method will list all the tenant  parent part code list by passing TenantID.
    getTenantParentPartCodeS(){
      return this.http.get(this.get_Tenant_parent_part_code_list + this.authService.currentUser['tenant_id']);
    }

    getTPPartCodebyPartIDS(partid){
      return this.http.get(this.get_all_tenant_part_list_by_partid + this.authService.currentUser['tenant_id'] + '/' + partid );
    }
    // This method  will call the API DELETE method by passing the part ID.   
    deletePartS(part_id:number){
      return this.http.delete(this.delete_part_by_partid+ part_id).pipe(map(response=> {
        if(response['Successful']){
          this.response_status = "Successful";
          this.message_text = response['Successful'];
          this.snackBar.top_snackbar(this.message_text ,this.response_status );
        }else{
          this.response_status = "Unsuccessful";
          this.message_text = response['Unsuccessful'];
          this.snackBar.top_snackbar(this.message_text,this.response_status );
        }
      }))
    }
}
