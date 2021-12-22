import { Injectable } from '@angular/core';
import { ConnectionService } from 'ng-connection-service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthService } from '../../login/_services/auth.service';
import { images_domain } from '../../../../environments/domains';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class OthersService {
  conn_status = "ONLINE";
  isConnected = true;
  plant_ref:any;  
  public images_domain=images_domain.image_url;
  // private previousUrl: string;
  // private currentUrl: string;
  
  constructor(
    private router: Router,
    private connectionService: ConnectionService,    
    public authService: AuthService,
    private cookieService: CookieService,
    private titleService: Title) {
      // this.currentUrl = this.router.url;
      // router.events.subscribe(event => {
      //   if (event instanceof NavigationEnd) {        
      //     this.previousUrl = this.currentUrl;
      //     this.currentUrl = event.url;
      //   };
      // });
   }

   // This function will check the internet connection and it wil return the status.
internetconnStatus(){
  this.connectionService.monitor().subscribe(isConnected => {
    this.isConnected = isConnected;
    if (this.isConnected) {
      this.conn_status = "ONLINE";
     }
    else {
      this.conn_status = "OFFLINE";
    }
  });

  return this.conn_status;
}


 // This function will return the step value based on the max value for Charts it will take max value as array.
getChartStepValue(max_value:any){
  let max_val =  Math.max(...max_value)
  let stepvalue: Number;
  if (max_val <= 10){
    stepvalue = 1;
  } else {
    stepvalue = null;
  }
  return stepvalue
}

// This function will return the step value based on the max value for Charts.
getminvalue(min_value:any){
  let min_valu =  Math.min(...min_value)
  return min_valu
}

// This function will return the step value based on the max value for Charts it will take max value as array.
getCStepValue(max_val:any){
  let stepvalue: Number;
  if (max_val <= 10){
    stepvalue = 1;
  } else {
    stepvalue = null;
  }
  return stepvalue
}


// chart colors.
public chartColors = {
  bright_yellow: "#fdcb6e",
  pink: '#ff006a',
  blue: '#009EDC',
  red: '#ff6384',
  purple: '#7b00ff',
  grey: '#4a6a75',
  robins_egg_blue:"#00cec9",
  mint_leaf:"#00b894",
  electron_blue:"#0984e3",
  american_river:"#636e72",
  orange_ville:"#e17055",
  green_teal:"#00923f",
  wizard_grey:"#535c68"
}

// This method will block user entering negative values;
blockNegativevalues(){
  var number = document.getElementById('number');
  number.onkeydown = function(e) {
      if(!((e.keyCode > 95 && e.keyCode < 106)
        || (e.keyCode > 47 && e.keyCode < 58)
        || e.keyCode == 8)) {
          return false;
      }
  }
  }

//  This method will reload the current route.
reloadCurrentRoute() {
  let currentUrl = this.router.url;
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
  });
}

// This method will be responsible for enabling and disabling buttons.
public enable_disable_role(){
  if(this.authService.currentUser['role_id'] == 0 || this.authService.currentUser['role_id'] == 1  ||
    this.authService.currentUser['role_id'] == 'MV1001' || this.authService.currentUser['role_id'] == 'PA1001'
   || this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'ASA1001')
   {
     return false;
  }else if (this.authService.currentUser['role_id'] == 2  || this.authService.currentUser['role_id'] == 'PV1001' || this.authService.currentUser['role_id'] == 'WCV1001' || this.authService.currentUser['role_id'] == 'ASV1001'){
    return true;
  }
}


// This method will set the cookie for tour guide if not available, if yes then it will check the cookie.
checkTourGuide(){
  let cookieValue = this.cookieService.get('tour_guide');
  if(cookieValue){
    return true;
  }else{
    return false;    
  } 
}

public setTitle(newTitle: string) {
  this.titleService.setTitle("SFactrix.ai"  +" " + "|" +" " + newTitle);
}




}
