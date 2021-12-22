import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { AuthService } from '../../login/_services/auth.service';
import { projects, jobProgessAnalysis } from '../../../../environments/urls';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  message_text:any;
  response_status:string;

  private post_project = projects.post_project;
  private get_project = projects.get_projects_info;
  private put_projects = projects.put_projects;
  private delete_projects = projects.delete_projects;
  private project_date_info = projects.project_date_info;
  private get_asset_projects = projects.get_asset_projects;
  private get_wojobprogress = jobProgessAnalysis.get_wojobprogress;
  private get_plant_job_progress = jobProgessAnalysis.get_plant_job_progress;
  private get_jobprogress = jobProgessAnalysis.get_jobprogress;
  private get_job_list = projects.get_job_list;
  private get_list_job_operators = projects.get_list_job_operators;
  private get_job_list_jobboperators = projects.get_job_list_jobboperators;
  private get_projects_info_wrkcenterid = projects.get_projects_info_wrkcenterid;
  private get_projects_info_plantid = projects.get_projects_info_plantid
  constructor(
    private http: HttpClient,
    private snackBar: SnackbarComponent,
    private authService:AuthService
  ) { }


  // This function will call the API for the GET method.
  getProjectinfoS(){
    if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2|| this.authService.currentUser['role_id'] == 'MV1001'){
      return this.http.get(this.get_project + this.authService.currentUser['tenant_id'])
    } else if(this.authService.currentUser['role_id'] == 'PA1001' || this.authService.currentUser['role_id'] == 'PV1001') {
       return this.http.get(this.get_projects_info_plantid + this.authService.currentUser['sf_plant_id'].toString());
    } else if (this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001'){
      return this.http.get(this.get_projects_info_wrkcenterid + this.authService.currentUser['work_centre_id'].toString());
     }else if ( this.authService.currentUser['role_id'] == 'ASA1001' || this.authService.currentUser['role_id'] == 'ASV1001'){
      return this.http.get(this.get_asset_projects + this.authService.currentUser['email']);
     }else if ( this.authService.currentUser['role_id'] == 'JB1001' ){
     return this.http.get(this.get_job_list_jobboperators + this.authService.currentUser['email']);
    }
  }
private _refreshNeeded = new Subject<void>();
  get_refreshNeededS(){
    return this._refreshNeeded; 
  }
  // This function will call the API for the GET job drop down.
  getProjectCodeList(){
    let params = new HttpParams();
    if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2|| this.authService.currentUser['role_id'] == 'MV1001'){
      params = params.append('tenant_id', this.authService.currentUser['tenant_id']);
        return this.http.get(this.get_job_list , {params: params});
      }else if(this.authService.currentUser['role_id'] == 'PA1001' || this.authService.currentUser['role_id'] == 'PV1001'){
      params = params.append('plant_id', this.authService.currentUser['sf_plant_id'].toString());
      return this.http.get(this.get_job_list, {params: params});
     } else if (this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001'){
      params = params.append('work_center_id',this.authService.currentUser['work_centre_id'].join(', '));
      return this.http.get(this.get_job_list, {params: params});
     } else if ( this.authService.currentUser['role_id'] == 'ASA1001' || this.authService.currentUser['role_id'] == 'ASV1001'){
     
      params = params.append('asset_id',this.authService.currentUser['asset_id'].join(', '));
      return this.http.get(this.get_job_list, {params: params});
    }else if ( this.authService.currentUser['role_id'] == 'JB1001' ){
      return this.http.get(this.get_job_list + "?" + "mail_id" + "=" +this.authService.currentUser['email']);
    }  
  }


  getJobOperatorListS(asset_id){
    if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 2|| this.authService.currentUser['role_id'] == 'MV1001'
    || this.authService.currentUser['role_id'] == 'PA1001'||this.authService.currentUser['role_id'] == 'PV1001' || this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001'){
    return this.http.get(this.get_list_job_operators + asset_id.join(', '))
  }
 else{
  return this.http.get(this.get_list_job_operators + asset_id.join(', '));
  }
}
  // This function will call the API for POST method.
  postProjectS(post_data:any){
  return this.http.post(this.post_project, post_data).pipe(tap((response)=>{
    this._refreshNeeded.next();
    if(response['Successful']){
            this.response_status = "Successful";
            this.message_text = response['Successful'];
            this.snackBar.top_snackbar(this.message_text ,this.response_status);
            }else{
            this.response_status = "Unsuccessful";
            this.message_text = response['Unsuccessful'];
            this.snackBar.top_snackbar(this.message_text,this.response_status );
          }
  })
);
}


  // This function will call the API for PUT method to update project based on project_id.
  putProjectsS(projectid:string, project_data:any){
    return this.http.put(this.put_projects+projectid, project_data).pipe(tap((response)=>{
      this._refreshNeeded.next();
      if(response['Successful']){
        this.response_status = "Successful";
        this.message_text = response['Successful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status );
      }else{
        this.response_status = "Unsuccessful";
        this.message_text = response['Unsuccessful'];
        this.snackBar.top_snackbar(this.message_text,this.response_status );
      }
    })
  );
  }

  // This function will call the API for PUT method to Delete project based on project_id.
  deleteProjectsS(projectid:string){
    return this.http.delete(this.delete_projects+ projectid).pipe(map(response=> {
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

    // This function will call the API for the GET method.
  getProjectDateinfoS(assest_id:any){​​​​​​​​
      return this.http.get(this.project_date_info + assest_id);
  }
  ​​​​​​​​
  // This function will display the particular work order job's progress.
  getWojobprogressS(workorder_id:any, timezone:any){
    return this.http.get(this.get_wojobprogress + workorder_id + '/' +timezone);
  }

   // This function will display the particular work order job's progress.
   getPlantWojobprogressS(plant_id:any, timezone:any){
    return this.http.get(this.get_plant_job_progress + plant_id + '/' +timezone);
  }



  // This function will display the particular job's progress based on sf_project_id.
  getjobprogressS(sf_project_id:any){
    return this.http.get(this.get_jobprogress + sf_project_id);
  }
  
}
