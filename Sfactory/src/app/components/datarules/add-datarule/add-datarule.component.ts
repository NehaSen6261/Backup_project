import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { NavbarService } from '../../navbar/_services/navbar.service';
import { DeviceService } from '../../devices/_services/device.service';
import { DeviceAttrsService } from '../../device_attributes/_services/device-attrs.service';
import { DataruleService } from '../_service/datarule.service';
import { AuthService } from '../../login/_services/auth.service';
import { PlantService } from '../../plants/_services/plant.service';
import { WorkcenterService } from '../../workcenters/_services/workcenter.service';
import { AssetService } from '../../assets/_services/asset.service';
import { OthersService } from '../../others/_services/others.service';
import { FormControl,  Validators } from '@angular/forms';
import { CommandsService } from '../../commands/_services/commands.service';

export interface Alerts {
  value: number;
  viewValue: string;
}


@Component({
  selector: 'add-datarule',
  templateUrl: './add-datarule.component.html',
  styleUrls: ['./add-datarule.component.scss']
})
export class AddDataruleComponent implements OnInit {

  constructor(
    private navbarService: NavbarService,
    private deviceService: DeviceService,
    private deviceattrsService: DeviceAttrsService,
    private dataruleService: DataruleService,
    private authService: AuthService,
    private plantService: PlantService,
    private workcenterService: WorkcenterService,
    private assetService: AssetService,
    private otherService: OthersService,
    private commandsService: CommandsService
  ) {
    this.navbarService.Title = "Add Data Rule";
  }

  ngOnInit(): void {
    this.actionInfo();
    this.getPlants();
  }
  deviceInternalError: boolean = false;
  wrkcenterInternalError: boolean = false;
  assetInternalError: boolean = false;
  displayDevice: boolean = true;
  noWrkCenter: boolean = true;
  asset: boolean = true;
  displaydata: boolean = false;
  internalError: boolean = false;
  display_attrs: boolean = true;
  devicesList: any = [];
  workcenter_internalError: boolean;
  no_workcenter: boolean;
  plant_workcenters: any = [];
  plants: any = [];
  assets_list: any = [];
  no_plants: boolean;
  assets_internalError: boolean;
  no_assets: boolean;
  plants_internalError: boolean;

  device_attributes_list: any = [];
  attribute_error: boolean = false;
  device_info_attr: boolean = false;
  disabled: boolean = false;
  attrCheckedIndex
  inboundcustom_entry;
  attribute;
  Greater: boolean = false;
  Lesser: boolean = false;
  Equal: boolean = false;
  Contains: boolean = false;
  Yes: boolean = false;
  No: boolean = false;
  On: boolean = false;
  Off: boolean = false;
  Email: boolean;
  Sms: boolean;
  Webhook: boolean;
  cmdCenter: boolean;
  SendCmd: boolean;
  customSelect: string;
  command: string;
  value_customInput: string;
  inboundKey: false;
  alert_type
  is_inbound_selected: boolean = false;
  is_sms_enabled: boolean;
  is_email_enabled: boolean;
  is_webhook_enabled: boolean;
  is_command_enabled: boolean;
  adddruleData: any = [];
  spinner: boolean;
  assetError: boolean;
  no_assetDevice: boolean;
  asset_devices: any = [];
  asset_id: any;
  is_inbound_selected_plant:boolean;
  is_inbound_selected_wrkcenter:boolean;
  is_inbound_selected_asset:boolean;
  is_inbound_selected_dev:boolean;

  // This method will display the alerts.
  alerts: Alerts[] = [{
      value: 20,
      viewValue: 'Warning'
    },
    {
      value: 21,
      viewValue: 'Critical'
    },
    {
      value: 6,
      viewValue: 'Info'
    }
  ]


  plant = new FormControl('', [Validators.required]);
  work_center = new FormControl('', [Validators.required]);
  assets = new FormControl('', [Validators.required]);
  devices = new FormControl('', [Validators.required]);


  // This method will display the action information of a tenant.
  actionInfo() {
    let action = this.authService.currentUser['data_rule_act_info'];
    this.is_sms_enabled = action.includes("sms");
    this.is_email_enabled = action.includes("email");
    this.is_webhook_enabled = action.includes("webhook");
    this.is_command_enabled = action.includes("command");
  }


  // This method will display the plants.
  getPlants() {
    this.plantService.getplantlistS().subscribe(response => {
      if (response['Unsuccessful']) {
        this.plants_internalError = true;
      } else {
        this.plants = response;
        if (this.plants.length == 0) {
          this.no_plants = true;
        } else {

          this.no_plants = false;
        }
      }
    }, error => {
      this.plants_internalError = true;
    })
  }
  // This method will display the all the plant work centers.
  getplantWorkcenters(plant_id) {
    this.workcenterService.getPlantWorkcentersListS(plant_id).subscribe(response => {
      this.is_inbound_selected_wrkcenter=false;
      if (response['Unsuccessful']) {
        this.workcenter_internalError = true;
      } else {
        this.plant_workcenters = response;
        if (this.plant_workcenters.length == 0) {
          this.no_workcenter = true;
        } else {
          this.no_workcenter = false;
        }
      }
    }, error => {
      this.workcenter_internalError = true;
    })
  }

  // This method will display asset device  info.
  getAssetDeviceInfo(asset_id:any) {
    this.deviceService.getAssetDeviceslistS(asset_id).subscribe(response => {
      this.is_inbound_selected_dev=false;
      this.spinner = false;
      if (response['Unsuccessful']) {
        this.assetError = true;
      } else {
        this.asset_devices = response;
        if (this.asset_devices.length == 0) {
          this.no_assetDevice = true;
        } else {
          this.no_assetDevice = false;
        }
      }
    }, error => {
      this.spinner = false;
      this.assetError = true;
    })
  }
  // This method will display the all the assets.
  getAssets(workcenter_id) {
    this.assetService.getWorkcenterAssetsListS(workcenter_id).subscribe(response => {
      this.is_inbound_selected_asset=false;
      if (response['Unsuccessful']) {
        this.assets_internalError = true;
      } else {
        this.assets_list = response;
        if (this.assets_list.length == 0) {
          this.no_assets = true;
        } else {
          this.no_assets = false;
        }
      }
    }, error => {
      this.assets_internalError = true;
    })
  }

  // This method will get device attribute list
  deviceAttributeList: any = [];
  noattrs_available: boolean;
  getdevAttributeList(dev_eui:any){
    this.display_attrs = false;
    localStorage.setItem('analysis_gtw', dev_eui)
    this.deviceattrsService.getDeviceAttributesS().subscribe(response => {
        this.spinner = false;
        this.deviceAttributeList = response;
        if (response['Unsuccessful']) {
          this.attribute_error = true;
        } else {
          if (this.deviceAttributeList.length == 0) {
            this.noattrs_available = true;
          } else {
            this.noattrs_available = false;
            this.deviceAttributeList.forEach(element => {
              element['disabled'] = false;
              element['checked'] = false;
            });
            this.display_attrs = false;
          }
        }
      }, error => {
        this.spinner = false;
        this.attribute_error = true;
      }

    )
  }

  // This function will display the device command list using the gateway id
  device_cmd_list;
  getDeviceCommand(dev_eui) {
    this.commandsService.getDeviceCommands(dev_eui).subscribe(response => {
      this.device_cmd_list = response;
    })
  }

  // To disable other Check box  items on click of  check boxs .
  checkbox_native_id;
  inbound_dataname: string;
  checkbox_native_checked: boolean;
  disableAll(ev: MatCheckboxChange) {
    if (ev.checked) {
      this.inboundcustom_entry = true;
      this.checkbox_native_id = ev.source._elementRef.nativeElement.id;
      this.inbound_dataname = ev.source.name;
      this.deviceAttributeList.filter(opt => opt.sf_attribute_id != ev.source._elementRef.nativeElement.id)
        .forEach(opt => (opt.disabled = true));
      this.deviceAttributeList.filter(opt => opt.sf_attribute_id == ev.source._elementRef.nativeElement.id)
        .forEach(opt => (opt.checked = true));
      this.is_inbound_selected = true;
      this.is_inbound_selected_plant = true;
    } else {
      this.deviceAttributeList.forEach(opt => (opt.disabled = false));
      this.inboundcustom_entry = false;
      this.is_inbound_selected = false;
      this.is_inbound_selected_plant = false;
    }
  }

  // To disable the inbound data check boxes on click of data rule check box
  attr_cheked: boolean;
  disable_inboundCB(ev: MatCheckboxChange) {
    if (ev.checked) {
      this.deviceAttributeList.forEach(opt => (opt.disabled = true));
    } else {
      this.inboundcustom_entry = false;
      this.deviceAttributeList.forEach(opt => (opt.disabled = false));
      this.deviceAttributeList.filter(opt => opt.sf_attribute_id == this.checkbox_native_id)
        .forEach(opt => (opt.checked = false));
    }
  }

  // This method will be called on click of the device dropdown and It will display the device Info.
  dev_application_id: Number
  dev_eui: Number;
  gateway_id: Number;
  getdeviceInfo(data: any) {
    this.dev_application_id = data['fw_application_id'];
    this.dev_eui = data['sf_dev_eui'];
    this.gateway_id = data['fw_gateway_id'];
  }


  // This method will create the data rule
  postDrule(data){
    let add_data: any = {}
    let value: any;
    let data_rule: any;
    let action: any;
    let data_value = data.value;
    if (this.Greater) {
      data_rule = "Greater Than";
    } else if (this.Lesser) {
      data_rule = "Lesser Than"
    } else if (this.Equal) {
      data_rule = "Equal To"
    } else if (this.Contains) {
      data_rule = "Contains"
    }

    if (this.Yes) {
      value = "Yes";
    } else if (this.No) {
      value = "No"
    } else if (this.On) {
      value = "On"
    } else if (this.Off) {
      value = "Off"
    } else if (this.value_customInput) {
      value = this.value_customInput;
    }
    if (this.Email) {
      action = 'Email';
    }
    if (this.Sms) {
      action = 'Sms';
    }
    if (this.Email && this.Sms) {
      action = 'Email and Sms';
    }
    if (this.Webhook) {
      action = "Webhook";
    }
    if (this.command) {
      action = "command"
    }
    add_data['org_id'] = this.authService.currentUser['org_id'];
    add_data['tenant_id'] = this.authService.currentUser['tenant_id'];
    add_data['application_id'] = this.dev_application_id;
    add_data['dev_eui'] = this.dev_eui;
    add_data['inbound_data'] = this.inbound_dataname;
    add_data['data_rule'] = data_rule;
    add_data['value'] = value;
    add_data['action'] = action;
    add_data['gateway_id'] = this.gateway_id
    add_data['email_notification'] = data_value['Email'];
    add_data['sms_notification'] = data_value['Sms'];
    add_data['url_webhook'] = data_value['url_webhook'];
    add_data['command_master_id'] = data_value['command']
    add_data['alert_type'] = data_value['alert_type'];
    add_data['created_by'] = this.authService.currentUser['email'];
    this.dataruleService.postDrule(add_data).subscribe(response => {
      data.resetForm();
      this.display_attrs = true;
      this.is_inbound_selected_plant = false;
      this.is_inbound_selected_wrkcenter = true;
      this.is_inbound_selected_asset = true;
      this.is_inbound_selected_dev = true;
    });
  }

cleardata(){
  this.is_inbound_selected_plant = false;
  this.is_inbound_selected_wrkcenter = true;
  this.is_inbound_selected_asset = true;
  this.is_inbound_selected_dev = true;
}
}
