import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { WindowService  } from '../window/_services/window.service';
import { OthersService } from '../_services/others.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../login/_services/auth.service';

@Component({
  selector: 'unauthorized-access',
  templateUrl: './unauthorized-access.component.html',
  styleUrls: ['./unauthorized-access.component.scss']
})
export class UnauthorizedAccessComponent implements OnInit {
  public current_host:any;
  public img_logo_color:string;
  constructor(
      private routelocationInfo: Location,
      private othersService:OthersService,
      private windowService:WindowService,
      private router: Router,
      private authService:AuthService
      )
      {
        this.img_logo_color=this.othersService.images_domain+"sfactory_logo.png";
        this.othersService.setTitle("Unauthorized Access");
      }

  ngOnInit(): void {
    this.current_host = this.windowService.currenthost();
   }

  // This method will take to the previous route.
  backloc(){
    if ( this.authService.currentUser['role_id'] != 'JB1001' ){
      this.routelocationInfo.back();
     }
    else if ( this.authService.currentUser['role_id'] == 'JB1001' ){
      this.router.navigate(['/controls']);
    }
  }

 

}