import { Component, OnInit } from '@angular/core';
import { interval  } from 'rxjs';
import { NavbarService } from '../../navbar/_services/navbar.service';
import { DeviceService } from '../../devices/_services/device.service';
import { DeviceAttrsService } from '../../device_attributes/_services/device-attrs.service';
import { AuthService } from '../../login/_services/auth.service';
import { ControlpanelService } from '../_services/controlpanel.service';
import { OthersService } from '../../others/_services/others.service';
import { FormControl, Validators } from '@angular/forms';
import { PlantService } from '../../plants/_services/plant.service';
import { WorkcenterService } from '../../workcenters/_services/workcenter.service';
import { AssetService } from '../../assets/_services/asset.service';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';


@Component({
  selector: 'controlpanel',
  templateUrl: './controlpanel.component.html',
  styleUrls: ['./controlpanel.component.scss']
})
export class ControlpanelComponent implements OnInit {
  deviceslist:any = [];
  device_attributes_list:any = [];
  device_attrs_error:boolean = false;
  no_device_attrs: boolean = false;
  device_attr:boolean = false;
  show_addbtn:boolean = true;
  attr_displayDevice: boolean = true;
  noctrlpitems:boolean = false;
  spinner: boolean = true;
  controlpanels:any = [];
  savebtndisabled:boolean = false;




  deviceInternalError:boolean = false;
  wrkcenterInternalError:boolean = false;
  assetInternalError:boolean = false;
  displayDevice:boolean = true;
  noWrkCenter : boolean = true;
  asset : boolean = true;
  displaydata: boolean = false;
  internalError: boolean = false;
  display_attrs: boolean = true;
  devicesList: any = [];
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
  attribute_error:boolean = false;
  is_screen_expanded:boolean = false;



// Gaugae chart global viarbles.
gaugeType= "arch";
thick=15;
cap="round";
Color ="#7b00ff";

current_datetime = new Date().toLocaleTimeString();

plant = new FormControl('', [Validators.required]);
work_center= new FormControl('', [Validators.required]);
sf_asset_id= new FormControl('', [Validators.required]);
sf_dev_eui = new FormControl('', [Validators.required]);
sf_attribute_id = new FormControl('', [Validators.required]);

  constructor(
    private navbarService:NavbarService,
    private deviceService: DeviceService,
    private attribuesService: DeviceAttrsService,
    public authService: AuthService,
    private controlpanelService: ControlpanelService,
    private plantService:PlantService,
    private workcenterService:WorkcenterService,
    private assetService: AssetService,
    private deviceattrsService:DeviceAttrsService,
    private snackbar: SnackbarComponent,
    private othersService: OthersService,

    ) {
      this.navbarService.Title = "Control Panel";
      this.othersService.setTitle(this.navbarService.Title);
    }

  ngOnInit(): void {
   
    this.getDevices();
    this.getTenantandSubCtrlpanel();
    interval(60000).subscribe((val) => {
      this.getTenantandSubCtrlpanel();
        this.getTenantandSubCtrlpanel();
    });
    this.getPlants();
    this.getTenantandSubCtrlpanel();
    this.addcntrlpanel();
  }
  addbtn:boolean= true
  addcntrlpanel()
  {
    if(this.authService.currentUser['role_id'] == 1){
      this.addbtn = true;
    }
    else if(this.authService.currentUser['role_id'] == 2 ){
      this.addbtn = false;
    }
  }

   // This method will display all the devices along with the health status.
   getDevices(){
    this.deviceService.getTenantDevicesS().subscribe( response =>{
      if(response['Unsuccessful'] || response == false){
        this.deviceInternalError = true;
        this.attr_displayDevice = false;
      }else{
        this.deviceslist = response;
      }
      if(this.deviceslist.length == 0 || this.deviceslist==null){
        this.attr_displayDevice = false;
      }
    }, error =>{
      this.deviceInternalError = true;
      this.attr_displayDevice = false;
    })
  }

   // This method will get the device and attribute selected and it pass the data to services.
   postCtrlpanel(data){
    let add_data: any = {}

     if(add_data['gateway_id'] == ""){}
     else{

      add_data['fw_tenant_id'] = this.authService.currentUser['tenant_id'];
      add_data['created_by'] = this.authService.currentUser['email'];
      if(this.authService.currentUser['role_id'] == 1000 || this.authService.currentUser['role_id'] == 1001){
        add_data['fl_subtenant_id'] = this.authService.currentUser['subtenant_id'];
      }
      add_data['sf_dev_eui'] = this.sf_dev_eui.value;
      add_data['sf_attribute_id'] = this.sf_attribute_id.value;
      if(this.sf_asset_id == null){

      }
      this.savebtndisabled = false;
      this.controlpanelService.postCtrlpanelS(add_data).subscribe(response =>{
        this.ngOnInit();
        this.cleardata();
      });


    }
  }
cleardata(){
  this.plant.reset();
  this.work_center.reset();
  this.sf_asset_id.reset();
  this.sf_dev_eui.reset();
  this.sf_attribute_id.reset();
  this.savebtndisabled = false;
}

  // This method will display the tenant and sub tenant control panels.
  getTenantandSubCtrlpanel(){
    this.controlpanelService.getTenantandSubCtrlpanelS().subscribe(response =>{     
      this.spinner = false;
      if(response["Unsucessfull"]){
          this.internalError = true;
      }else{
        this.controlpanels = response;
        if(this.controlpanels.length == 0 || this.controlpanels[0]['parameter'] == "NA"){
          this.noctrlpitems = true;
        }else{
          this.noctrlpitems = false;
        }
      }
    }, error =>{
      this.internalError = true;
      this.spinner = false;
    })
  }

// This method will be called on click of delete icon and It will display the control_panel_id.
control_panel_id:Number;
control_panel_dev_name:string;
control_panel_attr_name:string;
getcontrol_panel_info(data){
  this.control_panel_id = data['sf_control_panel_id'];
  this.control_panel_dev_name = data['device_name'];
  this.control_panel_attr_name = data['parameter'];
}


// This method will delete the cntrol panel Item.
deleteCtrlpanel(){
  this.controlpanelService.deleteCtrlpanelS(this.control_panel_id).subscribe(response =>{
    this.ngOnInit();
  });
}


// This method will expand the screen.
openFullscreen(){
  this.is_screen_expanded = true;​​​​​​​​
  let elem = document.getElementById("expanScreen");
  if (elem.requestFullscreen) {​​​​​​​​
  elem.requestFullscreen();
  }​​​​​​​​
}​​​​​​​​


 // This method will display the plants.
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

// This method will display asset device  info.
getAssetDeviceInfo(asset_id){
  this.deviceService.getAssetDeviceslistS(asset_id ).subscribe(response =>{
    this.spinner = false;
      if(response['Unsuccessful']){
      this.assetError = true;
      }else{
      this.asset_devices = response;
      if(this.asset_devices.length == 0)
      {
        this.no_assetDevice = true;
      }
      else{
        this.no_assetDevice = false;
      }
      }
  }, error =>{
    this.spinner = false;
    this.assetError = true;
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
deviceAttributeList: any=[];
noattrs_available:boolean;
getdevAttributeList(dev_eui){
    this.display_attrs = false;
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
          this.display_attrs = false;
        }
   }
},error =>{
  this.spinner = false;
  this.attribute_error = true;
}
)
}

}
