import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../login/_services/auth.service';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { mapper } from 'src/environments/urls';


@Injectable({
  providedIn: 'root'
})
export class MapperService {

  private post_mapper = mapper.post_mapper;
  private put_mapper = mapper.put_mapper;
  private delete_mapper = mapper.delete_mapper;
  private get_tenant_mappers = mapper.get_tenant_mappers;
  private get_mapper_info = mapper.get_mapper_info;
  private get_mapper_plannt_id =mapper.get_mapper_plannt_id


  message_text:any;
  action = "Dismiss";
  response_status:string;

  constructor(
    private http: HttpClient,
    private snackBar: SnackbarComponent,
    private authService:AuthService,
    private router:Router
  ) { }

  // This function will call the API for POST method.
 postMapperS(post_data:any){
  return this.http.post(this.post_mapper, post_data).pipe(map(response=>{
  if(response['Successful']){
    this.response_status = "Successful";
    this.message_text = response['Successful'];
    this.snackBar.snackbar(this.message_text );
  }else{
    this.response_status = "Unsuccessful";
    this.message_text = response['Unsuccessful'];
    this.snackBar.snackbar(this.message_text );
  }
 }));
}


// This function will call the API for PUT method to update mapping based on mapper id.
putMapperS(mapping_id:string, data:any){
    return this.http.put(this.put_mapper+mapping_id, data).pipe(map(response=>{
      if(response['Successful']){
        this.response_status = "Successful";
        this.message_text = response['Successful'];
        this.snackBar.snackbar(this.message_text );
      }else{
        this.message_text = response['Unsuccessful'];
        this.snackBar.snackbar(this.message_text );
      }
  }));
  }
  // This function deletes the particular Mapper by mapping id.
  deleteMapperS(mapping_id:string){
    return this.http.delete(this.delete_mapper+ mapping_id).pipe(map(response=> {
      if(response['Successful']){
        this.message_text = response['Successful'];
        this.snackBar.snackbar(this.message_text );
      }else{
        this.message_text = response['Unsuccessful'];
        this.snackBar.snackbar(this.message_text );
      }
    }))
  }

  // This function will call the API for GET method, It will display the all the asset and device mapping by tenant id.
  getMappersS(){
    if (this.authService.currentUser['role_id'] == 'PA1001'||this.authService.currentUser['role_id'] == 'PV1001') {
      return this.http.get(this.get_mapper_plannt_id + this.authService.currentUser['sf_plant_id']);
    }
    else{
     return this.http.get(this.get_tenant_mappers + this.authService.currentUser['tenant_id']);
    }
    }

  // This function will call the API for GET method, It will display the asset and device mapping info by mapping id.
  getMapperInfoS(mapper_id:string){
      return this.http.get(this.get_mapper_info + mapper_id);
  }

}
