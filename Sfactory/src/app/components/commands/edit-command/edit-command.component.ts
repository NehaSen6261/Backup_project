import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../navbar/_services/navbar.service';
import { FormControl, Validators } from '@angular/forms';
import { DeviceService } from '../../devices/_services/device.service';
import { CommandsService } from '../_services/commands.service';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../login/_services/auth.service';

@Component({
  selector: 'edit-command',
  templateUrl: './edit-command.component.html',
  styleUrls: ['./edit-command.component.scss'],
})
export class EditCommandComponent implements OnInit {
  spinner: boolean = true;
  internalError: boolean = false;
  displaydata: boolean = false;
  commands: any = [];
  dev_eui: string;
  cmd_master: number;
  plant;
  wrk_center;
  assets;
  target_device;
  cmd_name;
  cmd;
  exe_mode;
  daily: boolean = false;
  weekly: boolean = false;
  monthly: boolean = false;
  week_day;
  day;
  time_range;
  start_date;
  end_date;
  commandinfo: any = [];
  monthly_value;
  monDetailValue;
  monDetailValueDiv;
  startTime;
  endTime;
  constructor(
    private navbarService: NavbarService,
    private deviceService: DeviceService,
    private commandsService: CommandsService,
    public  authService: AuthService,
    config: NgbTimepickerConfig
  ) {
    this.navbarService.Title = 'View Command';
  }

  ngOnInit(): void {
    this.getCommandDetailedInfo();
  }

  // This method will display all the command detailed info
  getCommandDetailedInfo() {
    this.spinner = true;
    let cmdMaster = localStorage.getItem('command_master_id');
    this.commandsService.getCommandInfoS(cmdMaster).subscribe((response) => {
      this.commandinfo = response;
      if(this.commandinfo['sf_plant_name'] == null){
        this.plant = 'N/A'
      }
      else{
        this.plant = this.commandinfo['sf_plant_name'];
      }

      if(this.commandinfo['sf_work_centre_name'] == null){
        this.wrk_center = 'N/A'
      }
      else{
        this.wrk_center = this.commandinfo['sf_work_centre_name'];
      }

      if(this.commandinfo['sf_asset_code'] == null){
        this.assets = 'N/A'
      }
      else{
        this.assets = this.commandinfo['sf_asset_code'];
      }
      this.cmd_name = this.commandinfo['command_name'];
      this.cmd = JSON.stringify(this.commandinfo['command_payload']);
      this.exe_mode = this.commandinfo['execution_mode'];
      this.target_device = this.commandinfo['gateway_name'];
      if (
        this.commandinfo['execution_mode'] == 'On Demand' ||
        this.commandinfo['execution_mode'] == 'Rule Based'
      ) {
        this.commandinfo['frequency'] = null;
        this.commandinfo['start_date'] = 'NA';
        this.start_date = this.commandinfo['start_date'];
        this.commandinfo['end_date'] = 'NA';
        this.end_date = this.commandinfo['end_date'];
        this.commandinfo['time_range'] = 'NA';
        this.startTime = this.commandinfo['time_range'];
        this.endTime = this.commandinfo['time_range'];
      } else if (this.commandinfo['execution_mode'] == 'Scheduled') {
        this.time_range = this.commandinfo['time_range'];
        this.startTime = this.time_range.slice(0, 5);
        this.endTime = this.time_range.slice(7, 13);
        this.start_date = this.commandinfo['start_date'];
        this.end_date = this.commandinfo['end_date'];
      }

      // if frequency is Daily
      if (this.commandinfo['frequency'] == 'daily') {
        this.daily = true;
        this.monDetailValueDiv = false;
      } else if (this.commandinfo['frequency'] == 'weekly') {
        this.weekly = true;
      } else if (this.commandinfo['frequency'] == 'monthly') {
        this.monthly = true;
        this.monDetailValueDiv = true;
      }
    });
  }

  // this method will delete the command of that particular ID.
  deleteCommand() {
    let cmdMaster = localStorage.getItem('command_master_id');
    this.commandsService.deleteCommandS(cmdMaster).subscribe((response) => {});
  }
}
