import { Component, OnInit } from '@angular/core';
import { AssetNotisService } from '../../asset-notis/_services/asset-notis.service';
import { NotificationService } from '../../notifications/_services/notification.service';

@Component({
  selector: 'notification-sidebar',
  templateUrl: './notification-sidebar.component.html',
  styleUrls: ['./notification-sidebar.component.scss']
})
export class NotificationSidebarComponent implements OnInit {
  browser_timezone:string;
  list_spinner:boolean = true;
  list_internalError:boolean = false;
  noti_lists:any = [];
  no_notis:boolean = false;
  constructor(
     private notificationService:NotificationService,
     private assetNotisService:AssetNotisService) { }

  ngOnInit(): void {
    this.browser_timezone= Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.getNotificationList();
  }

  // This function will call the API for GET method and It will display all the Notification list for a tenant.
  getNotificationList(){
    this.assetNotisService.getNotificationListS(this.browser_timezone, 25).subscribe( response =>{  
      this.list_spinner = false;
      if(response["Unsucessfull"] ){
          this.list_internalError = true;
      }
      else{
        this.noti_lists = response;
        if(this.noti_lists.length == 0){
          this.list_internalError = false;
          this.no_notis = true;
        }else{
          this.no_notis = false;
        }
      }
    }, error =>{
     
      this.list_internalError = true;
      this.list_spinner = false;
    })
  }

}
