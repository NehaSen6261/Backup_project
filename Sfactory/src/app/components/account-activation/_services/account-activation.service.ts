import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { account_activations} from 'src/environments/urls';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AccountActivationService {
 //  defining urls.
 private activateuser = account_activations.activateuser;


constructor(private http: HttpClient, private router: Router) { }

// This function will call the API for GET method and It will display all the active user

getActivateUser(email){
  return this.http.get(this.activateuser + email)
 }



}
