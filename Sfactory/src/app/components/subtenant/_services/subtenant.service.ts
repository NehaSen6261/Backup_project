import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { AuthService } from '../../login/_services/auth.service';
import { subtenant } from '../../../../environments/urls';


@Injectable({
  providedIn: 'root'
})
export class SubtenantService {
  private post_subtenant = subtenant.post_subtenant;
  private put_subtenant = subtenant.put_subtenant;
  private inactive_subtenant = subtenant.inactivate_subtenant;
  private delete_subtenant = subtenant.delete_subtenant;
  private get_tenant_subtenant =subtenant.get_tenant_subtenant;
  private get_subtanat_info = subtenant.subtenant_info;

   message_text:any;
   action = "Dismiss";
   response_status:string;
  constructor( private http: HttpClient,
                        private snackBar: SnackbarComponent,
                        private authService:AuthService,
                        private router:Router) { }

  // This function will call the API for POST method.
postSubTenantS(post_data:any){
  return this.http.post(this.post_subtenant, post_data).pipe(map(response=>{
    if(response['Successful']){
      this.response_status="Successful";
      this.message_text = response['Successful'];
      this.snackBar.top_snackbar(this.message_text,this.response_status );
    }else{
      this.response_status="Unsuccessful";
      this.message_text = response['Unsuccessful'];
      this.snackBar.top_snackbar(this.message_text,this.response_status );
    }
  }));
}

// This method will call the API for PUT method.
putSubTenantS(subtenant_id:any, update_data:any){
  return this.http.put(this.put_subtenant+subtenant_id, update_data).pipe(map(response=>{
    if(response['Successful']){
      this.router.navigate(['/guest']);
      this.response_status="Successful";
      this.message_text = response['Successful'];
      this.snackBar.top_snackbar(this.message_text,this.response_status );
    }else{
      this.response_status="Unsuccessful";
      this.message_text = response['Unsuccessful'];
      this.snackBar.top_snackbar(this.message_text,this.response_status );
    }
  }));
}

// This function will call the API for Inactivating the sub tenant.
inactivateSubTenantS(status:string, subtenantid:Number){
  return this.http.delete(this.inactive_subtenant + status +'/'+ subtenantid).pipe(map(response =>{
    if(response['Successful']){
      this.response_status="Successful";
      this.message_text = response['Successful'];
      this.snackBar.top_snackbar(this.message_text,this.response_status );
    }else{
      this.response_status="Unsuccessful";
      this.message_text = response['Unsuccessful'];
      this.snackBar.top_snackbar(this.message_text,this.response_status );
    }
  }))
}

// This function will call the API for deleteing the sub tenant.
deleteSubTenantS( subtenantid:Number){
  return this.http.delete(this.delete_subtenant + subtenantid).pipe(map(response =>{
    if(response['Successful']){
      this.router.navigate(['/guest']);
      this.response_status="Successful";
      this.message_text = response['Successful'];
      this.snackBar.top_snackbar(this.message_text,this.response_status );
    }else{
      this.response_status="Unsuccessful";
      this.message_text = response['Unsuccessful'];
      this.snackBar.top_snackbar(this.message_text,this.response_status );
    }
  }))
}

// This function will call the API for GET method and It will display all the sub tenants for a tenant.
gettenantSubtenantS(){
  return this.http.get(this.get_tenant_subtenant+this.authService.currentUser['tenant_id'])
}

// This function will call the  API for GET methodand It will display  particular sub tenant information
getsubtanantInfoS(subtanatid){
 return this.http.get(this.get_subtanat_info + subtanatid )
}

}
