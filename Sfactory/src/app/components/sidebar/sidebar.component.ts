import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../login/_services/auth.service';
import { NavbarService } from '../navbar/_services/navbar.service';
import { WindowService  } from '../others/window/_services/window.service';


@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  currentLocation:string;
  current_host:any;
  public logo_route:string;
  public imagePathLogo:string;
  public imagePathDashboard:string;
  public imagePathMetrics :string;
  public imagePathMaintenance :string;
  public imagePathJobs :string;
  public imagePathWorkorder :string;
  public imagePathDataExplore :string;
  public imagePathAssestRule :string;
  public imagePathSetting :string;
  public question_mark: string;
  public imagePathPart: string;
  public imagePathReport: string;

  
  constructor(
              public authService: AuthService,
              private router: Router,
              private windowService:WindowService,
              private navbarService: NavbarService
              ) {
                this.currentLocation = this.router.url;
                this.imagePathLogo = this.navbarService.images_domain+"sidebar_favicon.png";
                this.imagePathDashboard = this.navbarService.images_domain+"dashboard.svg";
                this.imagePathMaintenance  = this.navbarService.images_domain+"maintenance log_sidebar.svg";
                this.imagePathMetrics = this.navbarService.images_domain+"analysis.svg";
                this.imagePathJobs = this.navbarService.images_domain+"project.svg";
                this.imagePathWorkorder = this.navbarService.images_domain+"wo_32X32.svg";
                this.imagePathAssestRule = this.navbarService.images_domain+"rules_solidwhite.svg";
                this.imagePathSetting = this.navbarService.images_domain+"settings.svg";
                this.imagePathDataExplore = this.navbarService.images_domain+"pf_report_32X32.svg";
                this.question_mark = this.navbarService.images_domain+'question mark.svg';
                this.imagePathPart = this.navbarService.images_domain+"part_manage.svg";
                this.imagePathReport = this.navbarService.images_domain+"reportMenu.svg";
                if(this.authService.currentUser['role_id'] == 'JB1001'){
                  this.logo_route = "/controls";
                }
                else if(this.authService.currentUser['role_id']  == 'PA1001'|| this.authService.currentUser['role_id']  == 'PV1001'){
                  this.logo_route = "/plantdashboard";
                }
                else{
                  this.logo_route = "/dashboard";
                }
                }

  ngOnInit(): void {
    this.current_host = this.windowService.currenthost();
  }


}



