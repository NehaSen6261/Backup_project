import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../login/_services/auth.service';
import { NavbarService } from '../navbar/_services/navbar.service';
import { OthersService } from '../others/_services/others.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AssetService } from '../assets/_services/asset.service';
import { FormControl, Validators } from '@angular/forms';
import { SnackbarComponent } from '../../components/others/snackbar/snackbar.component';
import { SimulatorService } from '../simulator/_services/simulator.service';
import { JoyrideService } from 'ngx-joyride';
import { DatePipe } from '@angular/common';
import { ProjectService } from '../projects/_services/project.service';
import { HttpResponseBase } from '@angular/common/http';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          transform: 'translate3d(0,0,0)',
        })
      ),
      state(
        'out',
        style({
          transform: 'translate3d(100%, 0, 0)',
        })
      ),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out')),
    ]),
  ],
})
export class NavbarComponent implements OnInit {

  public user_disable: boolean;
  currentLocation: string;
  connectionStatus: string;
  no_notis: boolean = false;
  menuState: string = 'out';

  startbutton: boolean;
  breakbutton: boolean;
  stopbutton: boolean;
  faultbutton: boolean;
  scrap_btn: boolean;
  enable_payload: boolean = false;
  error_status= "Error";
  hideTooltip: boolean = true;
  reason = new FormControl('');
  public asset_status: string;
  public asset_quantity: any;
  public asset_quality;
  public asset_quality_reason: any;
  public asset_fault_reason: any;
  project = new FormControl('', [Validators.required]);
  payload = new FormControl('');
  rejection_reason_value  = new FormControl('',[Validators.required]);
  cust_entry = new FormControl('');
  good_qlty = 0;
  good_qlty_field = new FormControl('0');
  counter = 0;
  counter_field = new FormControl('0');
  is_asset_clicked: boolean = false;
  public asset_status_info: string;
  asset_info: any;
  public start_btn_text: string;
  public rsume_btn_text: string;
  public break_btn_text: string;
  public stop_btn_text: string;
  public fault_btn_text: string;
  public part_name: string;
  public asset_name :string;
  public job_total_qty = 0;
  public job_total_scrap = 0;
  public job_total_qty_produced = 0;
  public is_increment:boolean=true;
  public is_decrement:boolean=true;

  // image URLS
  public img_ctl_room:string;
  public img_notifications:string;
  public img_play_store:string;
  public img_app_store:string;
  public img_play_store_ep:string;
  public img_app_store_ep:string;
  public buttonDisabled: boolean;
  public buttonDisabledJob:boolean

  constructor(
    public authService: AuthService,
    private navbarService: NavbarService,
    private router: Router,
    private otherService: OthersService,    
    public assetService: AssetService,
    private snackbar: SnackbarComponent,
    private simulatorService: SimulatorService,    
    private readonly joyride: JoyrideService,
    public projectService: ProjectService,
    public datepipe: DatePipe,
    
  ) {
    this.currentLocation = this.router.url;

    localStorage.setItem('setEmail', this.authService.currentUser['email']);
    localStorage.setItem(
      'setFirstName',
      this.authService.currentUser['first_name']
    );
    if (this.authService.currentUser['role_id'] == 'JB1001' ) {
      this.buttonDisabled = true;
      this.buttonDisabledJob = false;
    }
    else if (this.authService.currentUser['role_id'] != 'JB1001' ) {
      this.buttonDisabled = false;
      this.buttonDisabledJob =true;
    }
  

    this.connectionStatus = this.otherService.internetconnStatus();

     // image URLS
    this.img_ctl_room= this.navbarService.images_domain+"factory_croom.svg";
    this.img_notifications= this.navbarService.images_domain+"notification-darkblue.svg";
    this.img_play_store= this.navbarService.images_domain+"available_gplay.svg";
    this.img_app_store= this.navbarService.images_domain+"avail_appstore.svg";
    this.img_play_store_ep= "https://play.google.com/store/apps/details?id=com.factana.sfactrix.operator&hl=en_US&gl=US";
    this.img_app_store_ep= "https://apps.apple.com/us/app/sfactrix/id1574627141";
 
   
  }

  public Title = this.navbarService.Title;

  ngOnInit(): void {
    this.start_btn_text = "Start";
    this.break_btn_text = "Break";
    this.stop_btn_text = "Stop";
    this.fault_btn_text = "Fault";
    this.user_disable = this.otherService.enable_disable_role();
    if(this.authService.currentUser['role_id'] != 'JB1001'){
      this.projectService.get_refreshNeededS().subscribe(()=>{
        this.getProjectList();
      })
      this.getProjectList();
    }  
  
  }

  // error messages
  projectErrorMessages() {
    if (this.project.hasError('required')) {
      return 'You must choose a value';
    }
  }

  // ----------------------------------------------
  // Asset control button logic
  // ----------------------------------------------
  // this method will enable the other asset control btns except START.
  startBtn() {
    this.start_btn_text = "Running";
    this.break_btn_text = "Break";
    this.stop_btn_text = "Stop";
    this.fault_btn_text = "Fault";
    this.startbutton = false;
    this.breakbutton = true;
    this.stopbutton = true;
    this.faultbutton = true;
    this.is_api_call_allowed = true;
    if (this.rsume_btn_text == "Resume") {
      this.asset_status_info = "Resume";
    } else {
      this.asset_status_info = "Start";
    }
  }

  // this method will enable the other asset control btns except BREAK.
  breakBtn() {
    this.start_btn_text = "Resume";
    this.break_btn_text = "On Break";
    this.stop_btn_text = "Stop";
    this.fault_btn_text = "Fault";
    this.rsume_btn_text = "Resume";
    this.asset_status_info='Break';
    this.startbutton = true;
    this.breakbutton = false;
    this.stopbutton = true;
    this.faultbutton = true;
    this.is_api_call_allowed = true;
  }

  // this method will enable the other asset control btns except STOP.
  stopBtn() {
    this.start_btn_text = "Start";
    this.break_btn_text = "Break";
    this.stop_btn_text = "Stopped";
    this.fault_btn_text = "Fault";
    this.rsume_btn_text = "";
    this.asset_status_info='Stop';
    this.startbutton = true;
    this.breakbutton = true;
    this.stopbutton = false;
    this.faultbutton = true;
    this.is_api_call_allowed = true;
  }

  // this method will enable the other asset control btns except FAULT.
  faultBtn() {
    this.start_btn_text = "Resume";
    this.break_btn_text = "Break";
    this.stop_btn_text = "Stop";
    this.fault_btn_text = "Faulty";
    this.rsume_btn_text = "Resume";
    this.asset_status_info='Fault';    
    this.startbutton = true;
    this.breakbutton = true;
    this.stopbutton = true;
    this.faultbutton = false;
  }

  increment_value: any;
  decrement_value: any;
  is_api_call_allowed: any = false;


  // Quality increment.
  increment() {
    if(this.project.status == 'VALID' && this.is_increment) {
      this.counter++;
      this.counter_field.setValue(this.counter)
      this.job_total_qty_produced++;
      this.is_api_call_allowed = true;
    }
  }
  incrementbyfive() {
    if(this.project.status == 'VALID' && this.is_increment) {
      this.counter = this.counter + 5;
      this.counter_field.setValue(this.counter);
      this.job_total_qty_produced = this.job_total_qty_produced + 5;
      this.is_api_call_allowed = true;
    }
  }

  incrementbyten() {
    if (this.project.status == 'VALID' && this.is_increment) {
      this.counter = this.counter + 10;
      this.counter_field.setValue(this.counter);
      this.job_total_qty_produced = this.job_total_qty_produced + 10;
      this.is_api_call_allowed = true;
    }
  }
  decrement() {
    if(this.project.status == 'VALID' && this.is_decrement) {
      this.counter--;
      this.counter_field.setValue(this.counter);
      this.job_total_qty_produced--;
      this.is_api_call_allowed = true;
    } else{
      this.is_api_call_allowed = false;
    }
  }

  // Scrap increment.
  scrap_increment() {
    if (this.project.status == 'VALID') {
      // let total = this.counter - this.good_qlty;
      // if(total >= 1 ){
        this.good_qlty++;
        this.good_qlty_field.setValue(this.good_qlty);
        this.job_total_scrap++;
        this.is_api_call_allowed = true;
      // } 
      // else {
      //   this.is_api_call_allowed = false;
      // }
 
    } else {
      this.is_api_call_allowed = false;
    }
  }

  scrap_incrementbytwo() {
    if(this.project.status == 'VALID' ){
      // let total = this.counter - this.good_qlty;
      // if(total >= 5){
        this.good_qlty = this.good_qlty + 5;
        this.good_qlty_field.setValue(this.good_qlty);
        this.job_total_scrap = this.job_total_scrap + 5;
        this.is_api_call_allowed = true;
      // } else {
      //   this.is_api_call_allowed = false;
      // }
    } else {
      this.is_api_call_allowed = false;
    }
  }
  scrap_incrementbyten() {
    if(this.project.status == 'VALID' ){
      // let total = this.counter - this.good_qlty;
      // if(total >= 10){
        this.good_qlty = this.good_qlty + 10;
        this.good_qlty_field.setValue(this.good_qlty);
        this.job_total_scrap = this.job_total_scrap + 10;
        this.is_api_call_allowed = true;
      // } else {
      //   this.is_api_call_allowed = false;
      // }
    } else {
      this.is_api_call_allowed = false;
    }
  }
  scrap_decrement(){
    if (this.project.status == 'VALID' && this.is_decrement) {
      this.good_qlty--;
      this.good_qlty_field.setValue(this.good_qlty);
      this.job_total_scrap--;
      this.is_api_call_allowed = true;
    } else {
      this.is_api_call_allowed = false;
    }
  }


  

  // This method will call the getTenantDevicesS method  from DeviceService which will display all the devices by tenant id.
  is_project_loaded: boolean;
  display_project: boolean = true;
  projectInternalError: boolean = false;
  projectList: any = [];
  getProjectList(){
    this.is_project_loaded = true;
    this.projectService.getProjectCodeList().subscribe(response => {
      this.is_project_loaded = false;
      if (response['Unsuccessful'] || response == false) {
        this.projectInternalError = true;
        this.display_project = false;
      } else {
        this.projectList = response;
      }
      if (this.projectList.length == 0 || this.projectList == null) {
        this.display_project = false;
      }
    },
      (error) => {
        this.projectInternalError = true;
        this.is_project_loaded = false;
      }
    );
  }



  // toggle the notification slider
  toggle_notification() {
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
  }

  // close the JoyRide
  closeJoyRide() {
    this.joyride.closeTour();
  }
  // post method
  simulate(btnclicked: string) {
    if(this.project.status == 'INVALID') {
      this.snackbar.top_snackbar('Choose an Job Code !!', "info");
    }else if( btnclicked == 'scrap_qty' && this.rejection_reason_value.status == 'INVALID') {
      this.snackbar.top_snackbar('Please enter the Rejection Reason !!', "info");
    }
    else{
      let data = {};
      let payloaddetails = {};
      if(btnclicked == 'asset_status') {
        payloaddetails = {'$asset_state': this.asset_status_info, 'sf_asset_id': this.asset_info['sf_asset_id'], 'sf_project_code': this.asset_info['sf_project_code'],
        'sf_asset_code': this.asset_info['sf_asset_code'] , 'created_by_date':this.datepipe.transform(new Date(), 'yyyy-MM-dd h:mm:ss')};
      }else if (btnclicked == 'asset_qty') {
        if(this.asset_status_info == 'Start' || this.asset_status_info == "Resume") {
          this.asset_status_info = "Running";
        }else if(this.asset_status_info == 'Break' || this.asset_status_info == 'Stop' || this.asset_status_info == 'Fault') {
          this.asset_status_info = this.asset_status_info;
        } else{
          this.asset_status_info = this.asset_status_info;
        }
        payloaddetails = {'$asset_qty': Number(this.counter_field.value), 'sf_asset_id': this.asset_info['sf_asset_id'], '$asset_state': this.asset_status_info ,'sf_project_code': this.asset_info['sf_project_code'],'sf_asset_code': this.asset_info['sf_asset_code'], 'created_by_date':this.datepipe.transform(new Date(), 'yyyy-MM-dd h:mm:ss')};
      }else if(btnclicked == 'scrap_qty') {
        if(this.asset_status_info == 'Start' || this.asset_status_info == "Resume") {
          this.asset_status_info = "Running";
        }else if(this.asset_status_info == 'Break' || this.asset_status_info == 'Stop' || this.asset_status_info == 'Fault') {
          this.asset_status_info = this.asset_status_info;
        }else{
          this.asset_status_info = this.asset_status_info;
        }
        payloaddetails = {'sf_asset_id': this.asset_info['sf_asset_id'],'rejection_reason': this.rejection_reason_value.value, '$asset_scrap': Number(this.good_qlty_field.value), '$asset_state': this.asset_status_info, 'sf_project_code': this.asset_info['sf_project_code'],'sf_asset_code': this.asset_info['sf_asset_code'], 'created_by_date':this.datepipe.transform(new Date(), 'yyyy-MM-dd h:mm:ss')};
      }else if(btnclicked = 'fault_btn') {
        this.is_api_call_allowed = true;
   
        payloaddetails = {
          '$asset_state': this.asset_status_info, '$asset_fault_reason': this.payload.value, 'sf_asset_id': this.asset_info['sf_asset_id'] ,
          'sf_project_code': this.asset_info['sf_project_code'],'sf_asset_code': this.asset_info['sf_asset_code'],'created_by_date':this.datepipe.transform(new Date(), 'yyyy-MM-dd h:mm:ss')
        };
      }
      data['fw_tenant_id'] = this.authService.currentUser['tenant_id'];
      data['sf_plant_id'] = this.asset_info['sf_plant_id'];
      data['sf_work_centre_id'] = this.asset_info['sf_work_centre_id'];
      data['sf_asset_id'] = this.asset_info['sf_asset_id'];
      data['sf_job_id'] = this.asset_info['project_id'];
      data['sf_asset_payload'] = payloaddetails;
      data['created_by'] = this.authService.currentUser['email'];
      data['role_id'] = this.authService.currentUser['role_id'];
        if(this.is_api_call_allowed) {
          this.simulatorService.Sendpayload(data, "simulator").subscribe((response) => {
            if(this.simulatorService.is_increment){
              this.is_increment = true;
              this.is_decrement = true; 
              this.counter = 0;
              this.good_qlty = 0;  
              this.rejection_reason_value.reset(); 
              this.counter_field.setValue(0); 
              this.good_qlty_field.setValue(0); 
              this.total_Qty_produced_ = this.job_total_qty_produced;    
              this.total_rejection_produced =   this.job_total_scrap; 
            }else{
              this.is_increment = false;
              this.is_decrement = false;
              this.counter = 0;
              this.good_qlty = 0;
            }
            });
      }

    }
  }


  // check if the qty produced is exceeding the order qty
  hideplus5:boolean=true;
  hideplus10:boolean=true;
  orderQtyValidation(){
    if(this.project.status == 'INVALID'){
      this.hideTooltip = true;
    }
   else if(this.job_total_qty == (this.job_total_qty_produced - this.job_total_scrap) ){
      this.hideTooltip = false;
      this.hideplus5 = false;
      this.hideplus10 = false;
     
    }
   else{
     this.checkifQty5();
     this.checkifQty10();
   }
   
  }
  // Check if the total qty and qty produced is exceeding +5 or not and disable if the qty is below 4.  
  checkifQty5(){
    if((this.job_total_qty - (this.job_total_qty_produced - this.job_total_scrap)) <= 4 ){
      this.hideplus5 = false;
    }
  }
   // Check if the total qty and qty produced is exceeding +10 or not and disable if the qty is below 9. 
  checkifQty10(){
    if(((this.job_total_qty - (this.job_total_qty_produced - this.job_total_scrap)) <= 9 )){
      this.hideplus10 = false;
    }
  }
  ifDecremented_Qty(){
    if((this.job_total_qty - (this.job_total_qty_produced - this.job_total_scrap)) > 4 ){
      this.hideplus5 = true;
      this.hideplus10 = true;
      this.checkifQty5();
      this.checkifQty10();
    } 
  }
  
  total_rejection_produced;
  total_Qty_produced_;
  // this method will call the API for knowing the asset status of the particular Asset ID.  
  assetStatus(asset_details: any) {
    this.is_asset_clicked = true;
    this.asset_info = asset_details;
    this.part_name = asset_details['part_name'];
    this.job_total_qty = asset_details['total_qty'];
    this.job_total_scrap = asset_details['total_scrap_produced'];
    this.total_rejection_produced =  asset_details['total_scrap_produced'];
    this.job_total_qty_produced = asset_details['total_qty_produced'];
    this.total_Qty_produced_ = asset_details['total_qty_produced'];
    this.asset_name = asset_details['sf_asset_name']
    this.simulatorService.getAssetStatusS(asset_details.sf_asset_id).subscribe(response => {
      this.asset_status = response['sf_asset_status'];
      if (response['sf_asset_status'] == 'Start' || response['sf_asset_status'] == 'Resume' || response['sf_asset_status'] == 'Running') {
        this.startBtn();
        if (response['sf_asset_status'] == 'Start' || response['sf_asset_status'] == 'Running') {
          this.asset_status_info = "Running";
        } else if (response['sf_asset_status'] == 'Resume') {
          this.asset_status_info = "Resume";
        }
      } else if (response['sf_asset_status'] == 'Break') {
        this.breakBtn();
      } else if (response['sf_asset_status'] == 'Stop') {
        this.stopBtn();
      } else {
        this.faultBtn();
      }
    });
  }


  // This function will clear the simulator console.
  clearSimulator() {
    this.part_name = null;
    this.asset_name = null;
    this.job_total_qty_produced = null;
    this.job_total_qty = null;
    this.job_total_scrap = null;
    this.project.reset();
    this.start_btn_text = "Start";
    this.break_btn_text = "Break";
    this.stop_btn_text = "Stop";
    this.fault_btn_text = "Fault";
    this.startbutton = false;
    this.breakbutton = false;
    this.stopbutton = false;
    this.faultbutton = false;
    this.counter = 0;
    this.counter_field.setValue(0);
    this.good_qlty = 0;
    this.good_qlty_field.setValue(0)
    this.total_Qty_produced_ = 0;
    this.total_rejection_produced = 0; 
    this.rejection_reason_value.reset();
    this.is_api_call_allowed = false;
    this.hideTooltip = true;
    this.hideplus5 = true;
    this.hideplus10 = true;
  }
  detectjobchange(event:MatSelectChange){
    this.hideTooltip = true;
    this.hideplus5 = true;
    this.hideplus10 = true;
    this.counter = 0;
    this.good_qlty = 0;
  }

  //  this function will clear fault reason.
  clearFaultReason() {
    this.payload.reset();
  }

 // this function will validate the Asset State and user permission for production.
validateSate(asset_data:any){
  if(asset_data['sf_asset_payload']['$asset_state'] == "Fault" ||
     asset_data['sf_asset_payload']['$asset_state'] == "Break" ||
     asset_data['sf_asset_payload']['$asset_state'] == "Stop" ||
     asset_data['sf_asset_payload']['$asset_state'] == undefined
   ){
    if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == "PA1001" ||
       this.authService.currentUser['role_id'] == 'ASA1001'){
        this.is_increment = true;
        this.is_decrement = true;
        return true;
    }else{
      if('$asset_qty' in asset_data['sf_asset_payload'] || '$asset_scrap' in asset_data['sf_asset_payload']){
        this.is_increment = false;
        this.is_decrement = false;
        return false;
      }else{
        this.is_decrement = true;
        this.is_increment = true;
        return true;
      }
    }     
  }else{
    this.is_decrement = true;
    this.is_increment = true;
    return true;
  }
 }    

}
