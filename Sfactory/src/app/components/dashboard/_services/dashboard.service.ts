import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from '../../login/_services/auth.service';
import { dashboard } from 'src/environments/urls';



@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private get_user_theme = dashboard.get_user_theme;
  private cu_usr_th_cards = dashboard.cu_usr_th_cards;
  private get_time_zone = dashboard.get_time_zone;

  card_update_response:any;

  constructor(private http: HttpClient, private authService: AuthService) {  }

   // This function will call the API for GET method to display the user theme based on email.
    getUserThemeS(time_zone:string){
        return this.http.get(this.get_user_theme + this.authService.currentUser['email'] + '/' + time_zone);
      }

  //  This function will call the API for POST method to save the user dashboard cards info.
  saveUserDBCardsS(data){
    return this.http.post(this.cu_usr_th_cards, data).pipe(map(response=>{
      this.card_update_response = response
    }));
  }

   // This function will call the API for GET method and It will display all the timezone list only in dashboard.
   getTimeZone(asset_id){
    return this.http.get(this.get_time_zone+asset_id);
  }

}
