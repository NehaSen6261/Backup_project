import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { NavbarService} from '../../navbar/_services/navbar.service';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { AuthService } from '../../login/_services/auth.service';
import { PlantService } from '../../plants/_services/plant.service';
import { WorkcenterService} from '../../workcenters/_services/workcenter.service';
import { OthersService } from '../../others/_services/others.service';
import { AssetService } from '../../assets/_services/asset.service';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { DeviceService } from '../../devices/_services/device.service';
import { CommandsService } from '../_services/commands.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormGroup } from "@angular/forms"
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export function jsonValidator(control: AbstractControl): ValidationErrors | null {
  try {
    JSON.parse(control.value);
  } catch (e) {
    return { jsonInvalid: true };
  }

  return null;
};


interface executionMode {
  name: string;
}
interface week_days {
  nameOfday: string;
}

@Component({
  selector: 'add-command',
  templateUrl: './add-command.component.html',
  styleUrls: ['./add-command.component.scss']
})
export class AddCommandComponent implements OnInit {
  time
  daily: boolean = false;
  weekly: boolean = false;
  monthly: boolean = false;
  plants: any = [];
  plant_workcenters: any = [];
  assets_list: any = [];
  devces: any = []
  no_plants: boolean;
  plants_internalError: boolean;
  workcenter_internalError: boolean;
  no_workcenter: boolean;
  assets_internalError: boolean;
  device_internalError: boolean;
  no_assets: boolean;
  no_devices: boolean;
  spinner: boolean;
  asset_devices: any = [];
  assetError: boolean;
  no_assetDevice: boolean;
  savebtndisabled: boolean = false;
  clear_checkboxes: boolean = true;
  dev_list: any = [];
  application_id;
  gateway_id;
  tenant_id;
  client_id_info;
  listofdays: any[];
  day;
  total_noof_days;

  minDate = new Date();
  errorMsg : string = "Not VALID JSON";

  constructor(
    config: NgbTimepickerConfig,
    private location: Location,
    public authService: AuthService,
    private navbarService: NavbarService,
    private snackbar: SnackbarComponent,
    private plantService: PlantService,
    private workcenterService: WorkcenterService,
    private assetService: AssetService,
    private deviceService: DeviceService,
    private otherService: OthersService,
    private commandService: CommandsService,
    private fb: FormBuilder
  ) {
    this.navbarService.Title = "Add command";
    config.spinners = false;
  }

  ngOnInit(): void {
    this.getPlants();
    this.getDaysInMonthUTC();
  }

  form = this.fb.group({
    command_payload: [null, [Validators.required , jsonValidator]]

  });

  plant = new FormControl('', [Validators.required]);
  work_center = new FormControl('', [Validators.required]);
  devices = new FormControl('', [Validators.required]);
  command_name = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  command_payload = new FormControl('', [Validators.required]);
  execution_mode = new FormControl('', [Validators.required]);
  month_date = new FormControl('', [Validators.required]);
  week_day = new FormControl('', [Validators.required]);
  start_date = new FormControl('', [Validators.required]);
  end_date = new FormControl('', [Validators.required]);
  start_time = new FormControl('', [Validators.required]);
  end_time = new FormControl('', [Validators.required]);
  assets = new FormControl('', [Validators.required]);
  dailyCheck = new FormControl('', [Validators.required]);
  weeklyCheck = new FormControl('', [Validators.required]);
  monthlyCheck = new FormControl('', [Validators.required]);

  executionMode: executionMode[] = [{name: 'Scheduled' }, {name: 'On Demand' }, {name: 'Rule Based' }];
  week_Days: week_days[] = [{ nameOfday: 'Sunday' }, {nameOfday: 'Monday' }, { nameOfday: 'Tuesday' },
                                              {nameOfday: 'Wednesday' }, {nameOfday: 'Thursday'}, { nameOfday: 'Friday' }, {nameOfday: 'Saturday' }]

  // error messages.
  PlantMessages() {
    if (this.plant.hasError('required')) {
      return 'You must choose a value';
    }
  }
  WCMessages() {
    if (this.work_center.hasError('required')) {
      return 'You must choose a value';
    }
  }
  AssetsMessages() {
    if (this.assets.hasError('required')) {
      return 'You must choose a value';
    }
  }
  InputErrorMessages() {
    if (this.command_name.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.command_name.hasError('minlength')) {
      return 'Minimum 3 characters required !';
    }
    if (this.command_name.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !';
    }
  }
  DevicesErrorMessages() {
    if (this.work_center.hasError('required')) {
      return 'You must choose a value';
    }
  }

  // these methods are used to disable the other checkboxes on select of one
  checkboxChangedaily(event: MatCheckboxChange) {
    if (event.checked) {
      this.weeklyCheck.disable();
      this.monthlyCheck.disable();
    } else {
      this.weeklyCheck.enable();
      this.monthlyCheck.enable();
    }
  }
  checkboxChangeweekly(event: MatCheckboxChange) {
    if (event.checked) {
      this.dailyCheck.disable();
      this.monthlyCheck.disable();
      this.weekly = true;
    } else {
      this.dailyCheck.enable();
      this.monthlyCheck.enable();
      this.weekly = false;
    }
  }
  checkboxChangemonthly(event: MatCheckboxChange) {
    if (event.checked) {
      this.dailyCheck.disable();
      this.weeklyCheck.disable();
      this.monthly = true;
    } else {
      this.dailyCheck.enable();
      this.weeklyCheck.enable();
      this.monthly = false;
    }
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
          if (this.otherService.plant_ref == undefined) {

          } else {
            this.plant.setValue(this.otherService.plant_ref.sf_plant_id);
            this.work_center.setValue(this.otherService.plant_ref.sf_work_centre_id);
          }
          this.no_plants = false;
        }
      }
    }, error => {
      this.plants_internalError = true;
    })
  }

  // This method will display the all the plant work centers.
  getplantWorkcenters(plant_id:any) {
      this.workcenterService.getPlantWorkcentersListS(plant_id).subscribe(response => {
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

  // This method will display the all the assets.
  getAssets(workcenter_id:any) {
    this.assetService.getWorkcenterAssetsListS(workcenter_id).subscribe(response => {
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

  // This method will get all the asset device list.
  getAssetDeviceList(asset_id:any) {
    this.deviceService.getAssetDeviceslistS(asset_id).subscribe(response => {
      this.dev_list = response;
    })
  }

  captureclientID(data) {
    this.client_id_info = data;
    this.application_id = this.client_id_info['fw_application_id'];
    this.gateway_id = this.client_id_info['fw_gateway_id'];
    this.tenant_id = this.client_id_info['fw_tenant_id'];
  }

    // this method is used to post the add command
    postaddCommand() {
      if (this.command_name.status == "INVALID" || this.command_payload.status == "INVALID" ||
        this.execution_mode.status == "INVALID" || this.start_date.status == "INVALID" || this.end_date.status == "INVALID" || this.start_time.status == "INVALID" || this.end_time.status == "INVALID") {
        this.snackbar.snackbar("Enter all required feilds !!")
      } else {
        let add_cmd_data = {};
        if (add_cmd_data['gateway_id'] == "") {} else {
          add_cmd_data['org_id'] = this.authService.currentUser['org_id'];
          add_cmd_data['tenant_id'] = this.tenant_id;
          add_cmd_data['created_by'] = this.authService.currentUser['email'];
          add_cmd_data['gateway_id'] = this.gateway_id;
          add_cmd_data['client_id'] = this.authService.currentUser['org_id'] + '-' + this.tenant_id + '-' + this.application_id + '-' + this.gateway_id;
        }

        add_cmd_data['command_name'] = this.command_name.value;
        add_cmd_data['command_payload'] = this.command_payload.value;
        add_cmd_data['execution_mode'] = this.execution_mode.value;

        if (this.execution_mode.value == ("On Demand" || "Rule Based")) {
          add_cmd_data['frequency'] == null;
          add_cmd_data['start_date'] == null;
          add_cmd_data['end_date'] == null;
          add_cmd_data['time_range'] == null;
        } else if (this.execution_mode.value == "Scheduled") {
          let frequency: string;
          if (this.dailyCheck.value == true) {
            frequency = 'daily';
          } else if (this.weeklyCheck.value == true) {
            frequency = 'weekly';
            if (this.week_day.status == "INVALID") {
              this.snackbar.snackbar("Enter all required feilds !!")
            }

          } else {
            frequency = 'monthly';
            if (this.month_date.status == "INVALID") {
              this.snackbar.snackbar("Enter all required feilds !!")
            }
          }
          add_cmd_data['frequency'] = frequency;
          let startTime = `${this.start_time.value.hour}:${this.start_time.value.minute}`
          let endTime = `${this.end_time.value.hour}:${this.end_time.value.minute}`
          var time_range = startTime.concat(' - ', endTime);
          add_cmd_data['time_range'] = time_range;
          add_cmd_data['start_date'] = this.start_date.value;
          add_cmd_data['end_date'] = this.end_date.value;
        }
        this.savebtndisabled = false;
        this.commandService.postCommanddeviceS(add_cmd_data).subscribe(response => {
          if(this.commandService.response_status == "Successful"){
            this.clear();
          }

        })
      }
    }

  // this method will list the days in a month
  daysarray() {
    this.total_noof_days = this.day;
  }
  getDaysInMonthUTC() {
    this.listofdays = Array.from(Array(32).keys());
    this.total_noof_days = this.listofdays.shift();
  }

    // disable the frequency feild if its rule and on demand
    isDisabled: boolean;
    onSelecetionChange(viewValue) {
      if (viewValue == "On Demand" || viewValue == "Rule Based") {
        this.dailyCheck.disable();
        this.weeklyCheck.disable();
        this.monthlyCheck.disable();
        this.start_date.disable();
        this.end_date.disable();
        this.start_time.disable();
        this.end_time.disable();
        this.week_day.disable();
        this.month_date.disable();
        this.savebtndisabled = true;
        this.dailyCheck.reset();
        this.weeklyCheck.reset();
        this.monthlyCheck.reset();
        this.month_date.reset();
        this.week_day.reset();

      } else if (viewValue == "Scheduled") {
        this.dailyCheck.enable();
        this.weeklyCheck.enable();
        this.monthlyCheck.enable();
        this.start_date.enable();
        this.end_date.enable();
        this.start_time.enable();
        this.end_time.enable();
        this.week_day.enable();
        this.month_date.enable();
        this.savebtndisabled = false;

      }
    }

  // this method to clear the form value
  clear() {
    this.plant.reset();
    this.work_center.reset();
    this.devices.reset();
    this.command_name.reset();
    this.command_payload.reset();
    this.execution_mode.reset();
    this.month_date.reset();
    this.week_day.reset();
    this.start_date.reset();
    this.end_date.reset();
    this.assets.reset();
    this.start_time.reset();
    this.end_time.reset();
    this.dailyCheck.enable();
    this.weeklyCheck.enable();
    this.monthlyCheck.enable();
    this.start_date.enable();
    this.end_date.enable();
    this.start_time.enable();
    this.end_time.enable();
    this.dailyCheck.reset();
    this.weeklyCheck.reset();
    this.monthlyCheck.reset();
    this.monthly = false;
    this.weekly = false;
  }
}
