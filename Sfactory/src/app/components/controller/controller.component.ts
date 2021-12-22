import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NavbarService } from '../navbar/_services/navbar.service';
import { AssetService } from '../assets/_services/asset.service';
import { AuthService } from '../login/_services/auth.service';
import { SimulatorService } from '../simulator/_services/simulator.service';
import { SnackbarComponent } from '../../components/others/snackbar/snackbar.component';
import { ProjectService } from '../projects/_services/project.service';
import { OthersService } from '../others/_services/others.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss']
})
export class ControllerComponent implements OnInit {
  public projectlist:any=[];
  public asset_info:any;
  public asset_quantity:any;
  public asset_quality:any;
  public job_progress:any;
  public asset_quality_reason:any;
  public part_name:string;
  public asset_status:string;
  public img_play_store:string;
  public img_app_store:string;
  public start_btn_text:string;
  public rsume_btn_text:string;
  public break_btn_text:string;
  public stop_btn_text:string;
  public fault_btn_text:string;
  public asset_status_info:string;
  public asset_name:string;
  public job_total_qty=0;
  public job_total_scrap=0;
  public job_total_qty_produced=0;
  public good_qlty = 0;
  public counter = 0;
  good_qlty_field = new FormControl('0');
  counter_field = new FormControl('0');
  public is_api_call_allowed:any=false;
  public is_screen_expanded:boolean=false;
  public projectInternalError:boolean=false;
  public is_asset_clicked:boolean=false;

  public startbutton:boolean;
  public breakbutton:boolean;
  public stopbutton:boolean;
  public faultbutton:boolean;
  public scrap_btn:boolean;
  public enable_payload:boolean=false;
  public error_status="Error";
  public selected_project_code:Number;
  public is_increment:boolean=true;
  public is_decrement:boolean=true;
  public is_scrap_increment:boolean=false;
  public is_scrap_decrement:boolean=false;
  public img_play_store_ep:string;
  public img_app_store_ep:string;
  hideTooltip: boolean = true;

  public project = new FormControl('', [Validators.required]);
  payload = new FormControl('');
  rejection_reason_value  = new FormControl('',[Validators.required]);
  constructor(
      public authService:AuthService,
      private navbarService:NavbarService,
      private assetService:AssetService,
      private snackbar:SnackbarComponent,
      private simulatorService:SimulatorService,
      private projectService:ProjectService,
      private othersService: OthersService,
      public datepipe: DatePipe,
      ){ 

        this.navbarService.Title = "Controls";
        this.othersService.setTitle(this.navbarService.Title);
        this.img_play_store= this.navbarService.images_domain+"available_gplay.svg";
        this.img_app_store= this.navbarService.images_domain+"avail_appstore.svg";
        this.img_play_store_ep= "https://play.google.com/store/apps/details?id=com.factana.sfactrix.operator&hl=en_US&gl=US";
        this.img_app_store_ep= "https://apps.apple.com/us/app/sfactrix/id1574627141";
      }

  ngOnInit(): void {
    this.start_btn_text = "Start";
    this.break_btn_text = "Break";
    this.stop_btn_text = "Stop";
    this.fault_btn_text = "Fault";
    this.projectLists();
  }

  // This method will expand the screen.
  openFullscreen(){
    this.is_screen_expanded = true;​​​​​​​​
    let elem :any = document.getElementById("expanScreen");
    if (elem.requestFullscreen || elem.webkitRequestFullscreen) {​​​​​​​​
    elem.requestFullscreen();
    }​​​​​​​​
  }​​​​​​​​

    // error messages
    projectErrorMessages() {
      if (this.project.hasError('required')) {
        return 'You must choose a value';
      }
    }

 
//  this method will display the project.
projectLists(){
  this.projectService.getProjectCodeList().subscribe(response=>{
    if (response['Unsuccessful'])    {
      this.projectInternalError = true;
    }
    else{
      this.projectlist = response;
    }
  },error => {
    this.projectInternalError = true;
  }) 
}

// This method will set the asset info in local storage.
setAssetinfo(asset_info:any) {
  localStorage.setItem('controller_asset', JSON.stringify(asset_info));
}
  // check if the qty produced is exceeding the order qty
  hideplus5:boolean=true;
  hideplus10:boolean=true;
  orderQtyValidation(){
    if(this.project.status == 'INVALID'){
      this.hideTooltip = true;
    }else if(this.job_total_qty == (this.job_total_qty_produced - this.job_total_scrap) ){
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
  this.selected_project_code = asset_details['project_id'];
  this.asset_name = asset_details['sf_asset_name']
  this.job_progress_info();
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
  this.total_Qty_produced_ = 0;
  this.total_rejection_produced = 0; 
  this.counter = 0;
  this.counter_field.setValue(0);
  this.good_qlty = 0;
  this.good_qlty_field.setValue(0)
  this.is_api_call_allowed = false;
  this.payload.reset();
  this.job_progress = 0;
  this.hideTooltip = true;
  this.hideplus5 = true;
  this.hideplus10 = true;
}

// this method will display the job progress based on the sf_project_id.
job_progress_info(){
  this.projectService.getjobprogressS(this.selected_project_code).subscribe(response =>{
    if(response["Unsucessfull"]){
      this.job_progress = 0;
    }else{
      this.job_progress = response['job_progressed'];
    }    
  }, error=>{
    this.job_progress = 0;
  })
}


// ----------------------------------------------
  // Asset control button logic
  // ----------------------------------------------
  // this method will enable the other asset control btns except START.
  startBtn(){
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
    } else{
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

  // Quality increment.
  increment() {
    if(this.project.status == 'VALID' && this.is_increment) {
      this.counter++;
      this.counter_field.setValue(this.counter);
      this.job_total_qty_produced++;
      this.is_api_call_allowed = true;
    }
  }
  incrementbyfive() {
    if (this.project.status == 'VALID' && this.is_increment) {
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
    }else{
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
      // } else {
      // this.is_api_call_allowed = false;
      // }
    } else {
      this.is_api_call_allowed = false;
    }
  }
  scrap_incrementbytwo() {
    if(this.project.status == 'VALID'){
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
    if(this.project.status == 'VALID'){
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
    if (this.project.status == 'VALID' && this.is_scrap_decrement) {
      this.good_qlty--;
      this.good_qlty_field.setValue(this.good_qlty);
      this.job_total_scrap--;
      this.is_api_call_allowed = true;
    } else {
      this.is_api_call_allowed = false;
    }
  }

    // post method
    simulate(btnclicked: string) {
      if (this.project.status == 'INVALID') {
        this.snackbar.top_snackbar('Choose an Job Code !!', this.error_status);
      } else if( btnclicked == 'scrap_qty' && this.rejection_reason_value.status == 'INVALID') {
        this.snackbar.top_snackbar('Please enter the Rejection Reason !!', "info");
      }else {
        let data = {};
        let payloaddetails = {};
        if(btnclicked == 'asset_status'){
          payloaddetails = {'$asset_state': this.asset_status_info, 'sf_asset_id': this.asset_info['sf_asset_id'], 'sf_project_code': this.asset_info['sf_project_code'],'sf_asset_code': this.asset_info['sf_asset_code'] , 'created_by_date':this.datepipe.transform(new Date(), 'yyyy-MM-dd h:mm:ss')};
        }else if(btnclicked == 'asset_qty') {
          if(this.asset_status_info == 'Start' || this.asset_status_info == "Resume") {
            this.asset_status_info = "Running";
          }else if (this.asset_status_info == 'Break' || this.asset_status_info == 'Stop' || this.asset_status_info == 'Fault') {
            this.asset_status_info = this.asset_status_info;
          }else {
            this.asset_status_info = this.asset_status_info;
          }
          payloaddetails = {'$asset_qty': Number(this.counter_field.value), 'sf_asset_id': this.asset_info['sf_asset_id'], '$asset_state': this.asset_status_info,'sf_project_code': this.asset_info['sf_project_code'],'sf_asset_code': this.asset_info['sf_asset_code'] ,'created_by_date':this.datepipe.transform(new Date(), 'yyyy-MM-dd h:mm:ss') };
        }else if (btnclicked == 'scrap_qty') {
          if(this.asset_status_info == 'Start' || this.asset_status_info == "Resume") {
            this.asset_status_info = "Running";
          }else if (this.asset_status_info == 'Break' || this.asset_status_info == 'Stop' || this.asset_status_info == 'Fault') {
            this.asset_status_info = this.asset_status_info;
          }else {
            this.asset_status_info = this.asset_status_info;
          }
          payloaddetails = { 'sf_asset_id': this.asset_info['sf_asset_id'],'rejection_reason': this.rejection_reason_value.value, '$asset_scrap': Number(this.good_qlty_field.value), '$asset_state': this.asset_status_info ,'sf_project_code': this.asset_info['sf_project_code'],'sf_asset_code': this.asset_info['sf_asset_code'] ,'created_by_date':this.datepipe.transform(new Date(), 'yyyy-MM-dd h:mm:ss') };
        } else if ((btnclicked = 'fault_btn')) {
          this.is_api_call_allowed = true;
          payloaddetails = {
            '$asset_state': this.asset_status_info, '$asset_fault_reason': this.payload.value, 'sf_asset_id': this.asset_info['sf_asset_id'] , 'sf_project_code': this.asset_info['sf_project_code'],'sf_asset_code': this.asset_info['sf_asset_code'], 'created_by_date':this.datepipe.transform(new Date(), 'yyyy-MM-dd h:mm:ss') 
          };
        }
        data['fw_tenant_id'] = this.authService.currentUser['tenant_id'];
        data['sf_plant_id'] = this.asset_info['sf_plant_id'];
        data['sf_work_centre_id'] = this.asset_info['sf_work_centre_id'];
        data['sf_asset_id'] = this.asset_info['sf_asset_id'];
        data['sf_asset_payload'] = payloaddetails;
        data['created_by'] = this.authService.currentUser['email'];
        data['role_id'] = this.authService.currentUser['role_id'];
        data['sf_job_id'] = this.asset_info['project_id'];
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
              this.job_progress_info();
              });
        }
      }
    }
}
