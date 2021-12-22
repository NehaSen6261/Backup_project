import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { WindowService  } from '../window/_services/window.service';
import { OthersService } from '../_services/others.service';


@Component({
  selector: 'pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.scss']
})
export class PagenotfoundComponent implements OnInit {
  public current_host:any;
  public img_logo_color:string;
  constructor(
        private routelocationInfo: Location,
        private othersService:OthersService,
        private windowService:WindowService
        ){
          this.img_logo_color=this.othersService.images_domain+"sfactory_logo.png";
          this.othersService.setTitle("Page Not Found");
        }

  ngOnInit(): void {
    this.current_host = this.windowService.currenthost();
  }

// This method will take to the previous route.
  backloc(){
    this.routelocationInfo.back();
  }
}
