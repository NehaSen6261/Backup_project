import { Component, OnInit, ViewChildren } from '@angular/core';
import { AuthService } from '../../login/_services/auth.service';
import { NavbarService } from '../../navbar/_services/navbar.service';
import { DataruleService } from '../_service/datarule.service';
import { PlantService } from '../../plants/_services/plant.service';
import { WorkcenterService } from '../../workcenters/_services/workcenter.service';
import { AssetService } from '../../assets/_services/asset.service';
import { OthersService } from '../../others/_services/others.service';
import { FormControl, Validators } from '@angular/forms';
import { DeviceService } from '../../devices/_services/device.service';
import { DeviceAttrsService } from '../../device_attributes/_services/device-attrs.service';

export interface Alerts{
  value:number;
  viewValue:string;
}
export interface command{
  value:number;
  viewValue:string;
}
@Component({
  selector: 'app-view-datarule',
  templateUrl: './view-datarule.component.html',
  styleUrls: ['./view-datarule.component.scss']
})
export class ViewDataruleComponent implements OnInit {

inbound_data:string;
device_name:string;
created_by:string;
drule_id:Number;
drule_status:string;
isActivedrule:boolean;
greater_than:boolean= false;
lesser_than:boolean= false;
equal:boolean= false;
contain:boolean= false;
custom_data_value:string;
yes:boolean= false;
no:boolean= false;
on:boolean= false;
off:boolean= false;
alert_type:string;
email:string;
sms:string;
webhook:any;
command:any;
is_sms_enabled:boolean;
is_email_enabled:boolean;
is_webhook_enabled:boolean;
is_command_enabled:boolean;
workcenter_internalError:boolean;
  no_workcenter:boolean;
  plant_workcenters:any=[];
  plants:any = [];
  assets_list:any=[];
  no_plants:boolean;
  assets_internalError:boolean;
  no_assets:boolean;
  plants_internalError:boolean;
  assetError:boolean;
  no_assetDevice :boolean;
  asset_devices : any=[];
  asset_id:any;
  spinner:boolean;
  attribute_error:boolean = false;
  device_info_attr:boolean=false;
  plant;
work_center;
assets;
devices ;
// This method will display the alerts.
alerts:Alerts[] = [
  {value: 20, viewValue: 'Warning'},
  {value: 21, viewValue: 'Critical'},
  {value: 6,  viewValue:  'Info'}
]
cmd : command[]= [
  {   value:1, viewValue :'motion detection ' },
  {   value:2, viewValue :'high alkaline water  ' },
  {   value:3, viewValue :'motion speed' },
  {   value:4, viewValue :'fire dectection' },
]
  constructor(
    private navbarService: NavbarService,
    private dataruleService: DataruleService,
    public authService: AuthService,
    private plantService:PlantService,
    private workcenterService:WorkcenterService,
    private assetService: AssetService,
    private deviceService: DeviceService,
    private deviceattrsService:DeviceAttrsService,
  ) {
    this.navbarService.Title = "View Data Rule";
   }

  ngOnInit(): void {
    this.getDruleInfo();
    this.actionInfo();
    this.getPlants();
  }
  tooltipStatus;

  @ViewChildren('tooltip') tooltips


  toggleTooltips() {
    this.tooltipStatus = !this.tooltipStatus;
  }


  // This method will display the action information of a tenant.
actionInfo(){
  let action = this.authService.currentUser['data_rule_act_info'];
  this.is_sms_enabled =  action.includes("sms");
  this.is_email_enabled = action.includes("email");
  this.is_webhook_enabled = action.includes("webhook");
  this.is_command_enabled = action.includes("command");
}



  // This method will display the particular data rule Information.
  drulInfoList: any = [];
  getDruleInfo(){
    this.dataruleService.getDruleInfo().subscribe(response =>{
      this.drulInfoList = response;
      this.device_name =  this.drulInfoList['gateway_name'];
      this.plant = this.drulInfoList['sf_plant_name'];
      this.work_center = this.drulInfoList['sf_work_centre_name'];
      this.assets = this.drulInfoList['sf_asset_code'];
      this.devices = this.drulInfoList['sf_device_name'];
      this.created_by = this.drulInfoList['created_by'];
      this.drule_id = this.drulInfoList['drule_id'];
      this.inbound_data = this.drulInfoList['inbound_data'];
      this.plant = this.drulInfoList['sf_plant_name']
      if(this.drulInfoList['inactive'] == true){
        this.drule_status = 'Active'
        this.isActivedrule = true;
      }
      if(this.drulInfoList['inactive'] == false){
        this.drule_status = 'InActive';
        this.isActivedrule = false;
      }
      if(this.drulInfoList['data_rule'] == "Lesser Than"){
        this.lesser_than = true;
      }else if(this.drulInfoList['data_rule'] == "Greater Than"){
        this.greater_than = true;
      }else if(this.drulInfoList['data_rule'] == "Equal To"){
        this.equal = true;
      }else if(this.drulInfoList['data_rule'] == "Contains"){
        this.contain = true;
      }

      if(this.drulInfoList['value'] == "Yes"){
        this.yes = true;
      }else if(this.drulInfoList['value'] == "No"){
        this.no = true;
      }else if(this.drulInfoList['value'] == "On"){
        this.on = true;
      }else if(this.drulInfoList['value'] == "Off"){
        this.off = true;
      }else{
        this.custom_data_value = this.drulInfoList['value'];
      }
      if(this.drulInfoList["alert_type"] == '20'){
        this.alert_type = 'Warning';
      }else if(this.drulInfoList["alert_type"] == '21'){
        this.alert_type = 'Critical';
      }else{
        this.alert_type = 'Info'
      }

      if(this.drulInfoList['email_notification'] != "" || this.drulInfoList['email_notification'] != null){
        this.email = this.drulInfoList['email_notification'];
      }else{
        this.email = "NA";
      }
      if(this.drulInfoList['sms_notification'] != "" || this.drulInfoList['sms_notification'] != null){
        this.sms = this.drulInfoList['sms_notification'];
      }else{
        this.sms = "NA";
      }
      if(this.drulInfoList['url_webhook'] != "" || this.drulInfoList['url_webhook'] != null){
        this.webhook = this.drulInfoList['url_webhook'];
      }else{
        this.webhook = "NA";
      }

      if(this.drulInfoList['command'] != "" || this.drulInfoList['command'] != null){
        this.command = this.drulInfoList['command_name'];
      }else{
        this.command = "NA";
      }

    })
  }
// this method will list the plants
  getPlants(){
    this.plantService.getplantlistS().subscribe(response =>{
      if(response['Unsuccessful']){
          this.plants_internalError = true;
      }else{
        this.plants = response;
        if(this.plants.length == 0){
          this.no_plants = true;
        }else{
          this.no_plants = false;
        }
      }
    }, error =>{
      this.plants_internalError = true;
    })
  }
  // This method will display the all the plant work centers.
  getplantWorkcenters(plant_id){
    this.workcenterService.getPlantWorkcentersListS(plant_id).subscribe(response =>{
      if(response['Unsuccessful']){
        this.workcenter_internalError = true;
      }else{
        this.plant_workcenters = response;
        if(this.plant_workcenters.length == 0){
          this.no_workcenter = true;
        }else{
          this.no_workcenter = false;
        }
      }
    }, error=>{
      this.workcenter_internalError = true;
    })
  }
  // This method will display the all the assets.
  getAssets(workcenter_id){
    this.assetService.getWorkcenterAssetsListS(workcenter_id).subscribe(response =>{
      if(response['Unsuccessful']){
        this.assets_internalError = true;
      }else{
        this.assets_list = response;
        if(this.assets_list.length == 0){
          this.no_assets = true;
        }else{
          this.no_assets = false;
        }
      }
    }, error=>{
      this.assets_internalError = true;
    })
  }



// This method will get device attribute list
deviceAttributeList;
noattrs_available:boolean;
getdevAttributeList(dev_eui){
    this.deviceattrsService.getDeviceAttributeInfoS(dev_eui).subscribe(response=>{
    this.spinner  = false;
    this.deviceAttributeList =response;
    if(response['Unsuccessful']){
      this.attribute_error = true;
      }
      else{
        if(this.deviceAttributeList.length == 0){
          this.noattrs_available = true;
        }else{
          this.noattrs_available = false;
          this.deviceAttributeList.forEach(element => {
            element['disabled'] = false;
            element['checked'] = false;
            });
        }
   }
},error =>{
  this.spinner = false;
  this.attribute_error = true;
}
)
}

  // This method will activate and inactivate the particular data rule.
  act_inact_drule(){
    if(this.isActivedrule == true){
      this.drule_status = 'InActive';
      let dstatus = "Off"
      this.dataruleService.activate_deactivateDRuleS(dstatus, this.drule_id).subscribe( response =>{  })
    }
    if(this.isActivedrule == false){
      this.drule_status = 'Active';
      let dstatus = "On"
      this.dataruleService.activate_deactivateDRuleS(dstatus, this.drule_id).subscribe( response =>{ })

    }
  }

// This method will delete the particular data rule based on d rule id.
deleteDataRule(){
  this.dataruleService.DeleteDataRuleS(this.drule_id).subscribe(response=>{})
}


}
