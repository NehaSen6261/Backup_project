import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { userroles } from '../../../../environments/urls';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private get_factory_user_roles = userroles.get_factory_user_roles;
  constructor(private http: HttpClient) { }

getFactoryUserrolesS(){
 return this.http.get(this.get_factory_user_roles)
}

}
