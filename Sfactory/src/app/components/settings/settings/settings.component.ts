import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JoyrideService }from 'ngx-joyride';
import { NavbarService } from '../../navbar/_services/navbar.service';
import { AuthService } from '../../login/_services/auth.service';
import { OthersService } from '../../others/_services/others.service';
import { CookieService } from 'ngx-cookie-service';
declare var $ :any;


@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public imagePathPlant:string;
  public imagePathWorkCenter:string;
  public imagePathAsset :string;
  public imagePathCustomer :string;
  public imagePathAccountInfo : string;
  public imagePathMaintenance :string;
  public imagePathJobs :string;
  public imagePathWorkOrder :string 
  public imagePathDataRule :string;
  public imagePathReport : string;
  public imagePathAssestNotification : string;
  public imagePathLogManagment : string;
  public imagePathPerformenceReport : string;
  public imagePathUser : string;
  public imagePathUserProfile : string;
  public imagePathGuest : string;
  public imagePathDevice : string;
  public imagePathMapper : string;
  public imagePathCommand : string;
  public imagePathDeviceRule : string;
  public img_tour_ends: string;
  public imagePathPart: string;

  constructor(
    public router:Router,
    private navbarService:NavbarService,
    public authService: AuthService,
    public othersService: OthersService,
    private readonly joyride: JoyrideService,
    private cookieService: CookieService
    ) {
    this.navbarService.Title = "Settings";
    this.othersService.setTitle(this.navbarService.Title);
    this.imagePathPlant  = this.navbarService.images_domain+"plant.svg";
    this.imagePathWorkCenter  = this.navbarService.images_domain+"workcenter.svg";
    this.imagePathAsset = this.navbarService.images_domain+"asset.svg";
    this.imagePathCustomer = this.navbarService.images_domain+"factory_customers.svg";
    this.imagePathAccountInfo = this.navbarService.images_domain+"account_info.svg";
    this.imagePathMaintenance = this.navbarService.images_domain+"maintenance_log.svg";
    this.imagePathJobs = this.navbarService.images_domain+"settings_job.svg";
    this.imagePathWorkOrder = this.navbarService.images_domain+"work_order.svg";
    this.imagePathDataRule = this.navbarService.images_domain+"data_rules.svg";
    this.imagePathReport = this.navbarService.images_domain+"report.svg";
    this.imagePathAssestNotification = this.navbarService.images_domain+"noti_settings.svg";
    this.imagePathLogManagment = this.navbarService.images_domain+"auditlog.svg";
    this.imagePathPerformenceReport = this.navbarService.images_domain+"performence_report.svg";
    this.imagePathUser = this.navbarService.images_domain+"user_settings.svg";
    this.imagePathUserProfile = this.navbarService.images_domain+"usp_settings.svg";
    this.imagePathGuest = this.navbarService.images_domain+"guest.svg";
    this.imagePathDevice = this.navbarService.images_domain+"device_settings.svg";
    this.imagePathMapper = this.navbarService.images_domain+"mapper.svg";
    this.imagePathCommand = this.navbarService.images_domain+"command.svg";
    this.imagePathDeviceRule = this.navbarService.images_domain+"device_rules.svg";
    this.img_tour_ends  = this.navbarService.images_domain+"tourend.png";
    this.imagePathPart = this.navbarService.images_domain+"part_mng.svg";
    }
    plantArray=["plant@settings","add_plant@plant","add_plant@plant",
    "workcntr@settings","addwrkcenter@workcenter","addwrkcenter@workcenter",
    "asset@settings", "addAsset@asset", "addAsset@asset", "partmgmt@settings","add_part@parts","add_part@parts",
    "customerPg@settings","addCustomer@customer","addCustomer@customer",
    "wrkOrder@settings","addwrkorder@workorders","addwrkorder@workorders" ,
    "jobs@settings", "addjob@jobs", "addjob@jobs"                                                                                    
    ];
    mgt_plant_array=["plant@settings","add_plant@plant","add_plant@plant",
    "workcntr@settings","addwrkcenter@workcenter","addwrkcenter@workcenter",
    "asset@settings", "addAsset@asset", "addAsset@asset", "partmgmt@settings","view_part@parts","view_part@parts",
    "customerPg@settings","addCustomer@customer","addCustomer@customer",
    "wrkOrder@settings","viewwrkorder@workorders","viewwrkorder@workorders" ,
    "jobs@settings"                                                                                   
    ];
    plant_admin_array =["plant@settings","view_plant@plant","view_plant@plant",
    "workcntr@settings","addwrkcenter@workcenter","addwrkcenter@workcenter",
    "asset@settings", "addAsset@asset", "addAsset@asset", "partmgmt@settings","add_part@parts","add_part@parts",
    "customerPg@settings","addCustomer@customer","addCustomer@customer",
    "wrkOrder@settings","addwrkorder@workorders","addwrkorder@workorders" ,
    "jobs@settings", "addjob@jobs", "addjob@jobs"                                                                                
    ];
    account_viewer_array =["plant@settings","view_plant@plant","view_plant@plant",
    "workcntr@settings","viewwrkcenter@workcenter","viewwrkcenter@workcenter",
    "asset@settings", "viewAsset@asset", "viewAsset@asset", "partmgmt@settings","view_part@parts","view_part@parts",
    "customerPg@settings","viewCustomer@customer","viewCustomer@customer",
    "wrkOrder@settings","viewwrkorder@workorders","viewwrkorder@workorders" ,
    "jobs@settings"                                                                                    
    ];
    plant_viewer_array =["plant@settings","view_plant@plant","view_plant@plant",
    "workcntr@settings","viewwrkcenter@workcenter","viewwrkcenter@workcenter",
    "asset@settings", "viewAsset@asset", "viewAsset@asset", "partmgmt@settings","view_part@parts","view_part@parts",
    "customerPg@settings","viewCustomer@customer","viewCustomer@customer",
    "wrkOrder@settings","viewwrkorder@workorders","viewwrkorder@workorders" ,
    "jobs@settings"                                                                                   
    ];
    wrkcntr_admin_array=["workcntr@settings","viewwrkcenter@workcenter","viewwrkcenter@workcenter",
    "asset@settings", "addAsset@asset", "addAsset@asset", "partmgmt@settings","add_part@parts","add_part@parts",
    "customerPg@settings","addCustomer@customer","addCustomer@customer",
    "wrkOrder@settings","addwrkorder@workorders","addwrkorder@workorders" ,
    "jobs@settings", "addjob@jobs", "addjob@jobs"                                                                                    
    ];
    wrkcenter_viewer_array=["workcntr@settings","viewwrkcenter@workcenter","viewwrkcenter@workcenter",
    "asset@settings", "viewAsset@asset", "viewAsset@asset", "partmgmt@settings","view_part@parts","view_part@parts",
    "customerPg@settings","viewCustomer@customer","viewCustomer@customer",
    "wrkOrder@settings","viewwrkorder@workorders","viewwrkorder@workorders" ,
    "jobs@settings"                                                                                 
    ];  
    asset_Admin_array=["asset@settings", "addAsset@asset", "addAsset@asset", "partmgmt@settings","view_part@parts","view_part@parts",
    "customerPg@settings","viewCustomer@customer","viewCustomer@customer",
    "wrkOrder@settings","addwrkorder@workorders","addwrkorder@workorders" ,
    "jobs@settings", "addjob@jobs", "addjob@jobs"                                                                                    
    ];  
    asset_viewer_array= ["asset@settings", "viewAsset@asset", "viewAsset@asset", "partmgmt@settings","view_part@parts","view_part@parts",
    "customerPg@settings","viewCustomer@customer","viewCustomer@customer",
    "wrkOrder@settings","viewwrkorder@workorders","viewwrkorder@workorders" ,
    "jobs@settings"                                                                                   
    ]; 
  ngOnInit(): void {    
    if(!this.othersService.checkTourGuide()){
      this.startTour();
    }
   
  }


 public steps_arry:any; 
public  plant;
// This function will be used for start Tour
startTour() {
if(this.authService.currentUser['role_id'] == 1){
this.plant =  this.plantArray;
}else if(this.authService.currentUser['role_id'] == 'MV1001' ){
  this.plant = this.mgt_plant_array;
  }else if(this.authService.currentUser['role_id'] == 'PA1001'){
this.plant = this.plant_admin_array;
}else if(this.authService.currentUser['role_id'] == 2){ 
  this.plant = this.account_viewer_array;
}else if(this.authService.currentUser['role_id'] == 'PV1001'){
  this.plant = this.plant_viewer_array;
  }else if(this.authService.currentUser['role_id'] == 'WCA1001'){
  this.plant= this.wrkcntr_admin_array;
  }else if(this.authService.currentUser['role_id'] == 'WCV1001'){
    this.plant= this.wrkcenter_viewer_array
    }else if(this.authService.currentUser['role_id'] == 'ASA1001'){
    this.plant= this.asset_Admin_array;
  }else if(this.authService.currentUser['role_id'] == 'ASV1001'){
    this.plant= this.asset_viewer_array;
  }
 
  let all_routes:any = ["plant@settings","add_plant@plant","add_plant@plant",
                  "workcntr@settings","addwrkcenter@workcenter","addwrkcenter@workcenter",
                  "asset@settings", "addAsset@asset", "addAsset@asset", 
                  "customerPg@settings","addCustomer@customer","addCustomer@customer",
                  "wrkOrder@settings","addwrkorder@workorders","addwrkorder@workorders" ,
                  "jobs@settings", "addjob@jobs", "addjob@jobs"                  
                  ]

  let plant_cookie = this.cookieService.get('plant_tguide');
  let workcenters:any = ["workcntr@settings","addwrkcenter@workcenter","addwrkcenter@workcenter",
                        "asset@settings", "addAsset@asset", "addAsset@asset", "partmgmt@settings","add_part@parts","add_part@parts",
                        "customerPg@settings","addCustomer@customer","addCustomer@customer",
                        "wrkOrder@settings","addwrkorder@workorders","addwrkorder@workorders" ,
                        "jobs@settings", "addjob@jobs", "addjob@jobs"
                         ]
  let workcenter_cookie = this.cookieService.get('wc_tguide');

  let assets:any = ["asset@settings", "addAsset@asset", "addAsset@asset","partmgmt@settings","add_part@parts","add_part@parts", 
                    "customerPg@settings","addCustomer@customer","addCustomer@customer",
                    "wrkOrder@settings","addwrkorder@workorders","addwrkorder@workorders" ,
                    "jobs@settings", "addjob@jobs", "addjob@jobs"
                   ]
  let assets_cookie = this.cookieService.get('assett_tguide');

  let parts:any = ["partmgmt@settings","add_part@parts","add_part@parts",
  "customerPg@settings","addCustomer@customer","addCustomer@customer",
  "wrkOrder@settings","addwrkorder@workorders","addwrkorder@workorders" ,
  "jobs@settings", "addjob@jobs", "addjob@jobs"
 ]
let parts_cookie = this.cookieService.get('parts_tguide');

  let customer:any = ["customerPg@settings","addCustomer@customer","addCustomer@customer",
                      "wrkOrder@settings","addwrkorder@workorders","addwrkorder@workorders" ,
                      "jobs@settings", "addjob@jobs", "addjob@jobs"
                     ]
  let customer_cookie = this.cookieService.get('customer_tguide');

  let work_order:any = ["wrkOrder@settings","addwrkorder@workorders","addwrkorder@workorders",
                        "jobs@settings", "addjob@jobs", "addjob@jobs"
                       ]
 let work_order_cookie = this.cookieService.get('wo_tguide');

 let jobs:any = ["jobs@settings", "addjob@jobs", "addjob@jobs"]
 let jobs_cookie = this.cookieService.get('job_tguide');

 let no_guide:any = []
 
  if(!plant_cookie || plant_cookie== "active"){
    this.steps_arry = this.plant;
  }else if(!workcenter_cookie || workcenter_cookie == "active"){
    this.steps_arry = workcenters;
  }else if(!assets_cookie || assets_cookie == "active"){
    this.steps_arry = assets;
  }else if(!parts_cookie || parts_cookie == "active"){
    this.steps_arry = parts;
  } else if(!customer_cookie || customer_cookie == "active"){
    this.steps_arry = customer;
  }else if(!work_order_cookie || work_order_cookie == "active"){
    this.steps_arry = work_order;
  }else if(!jobs_cookie || jobs_cookie == "active"){
    this.steps_arry = jobs;
  }
  else{
    if(plant_cookie == "inactive"){
      this.steps_arry = workcenters;
    }
    if(workcenter_cookie == "inactive"){
      this.steps_arry = assets;
    }
    if(assets_cookie == "inactive"){
      this.steps_arry = parts;
    }
    if(parts_cookie == "inactive"){
      this.steps_arry = customer;
    }
    if(customer_cookie == "inactive"){
      this.steps_arry = work_order;
    }
    if(work_order_cookie == "inactive"){
      this.steps_arry = jobs;
    }
    if(jobs_cookie == "inactive"){
      this.steps_arry = no_guide;      
      this.cookieService.set('tour_guide', 'inactive', 300);
      // this.onLoad();
   
    }
    
  }


  this.joyride.startTour(
    {
      steps: this.steps_arry,
      showPrevButton: true,
      stepDefaultPosition: 'bottom',
      showCounter:false
     }
    ).subscribe(
    
      (step) =>{
      },(error) => {
      },
    );  
}

onLoad(){
  if(this.authService.currentUser['role_id'] == 'MV1001' ||this.authService.currentUser['role_id'] == 'PV1001'||this.authService.currentUser['role_id'] == 'WCV1001' ||this.authService.currentUser['role_id'] == 'ASV1001' ||this.authService.currentUser['role_id'] == 2){
    $('#tourguideEnd').modal('show');
  }
}

}

