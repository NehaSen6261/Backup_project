import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarService } from '../../navbar/_services/navbar.service';
import { DeviceService } from '../../devices/_services/device.service';
import { AnalysisService } from '../_services/analysis.service';
import { OthersService } from '../../others/_services/others.service';

@Component({
  selector: 'analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {

  spinner: boolean = true;
  displayDevice: boolean = true;
  deviceInternalError: boolean = false;
  internalError:boolean = false;
  noAnalysis:boolean = false;
  app_name:string;
  devices

  constructor( private router: Router,
                        public deviceService: DeviceService,
                        public analysisService: AnalysisService,
                        private navbarService:NavbarService,
                        private otherService: OthersService
                        ) {
    this.navbarService.Title = "Device Trends";
  }

  ngOnInit(): void {
    this.getDevices();

  }

    // select dropdown
    selectedValue: string;
    devicesList: any = [];

  // Gauge charts.
    gaugeType= "arch";
    thick=15;
    cap="round";
    Color = this.otherService.chartColors.purple;

    detailedView(data:any){
      localStorage.setItem('analysis_key', data['parameter']);
      localStorage.setItem('analysis_attr_id', data['attribute_id']);
      localStorage.setItem('analysis_datatype', data['data_type']);
      localStorage.setItem('analysis_uom', data['UOM']);
      this.router.navigate(['/device/trends/view']);
    }


// This method will call the getTenantDevicesS method  from DeviceService which will display all the devices by tenant id.
device:any
getDevices(){
  let selected_device_info = localStorage.getItem('selected_device_info');
  this.deviceService.getTenantDevicesS().subscribe( response =>{
    if(response['Unsucessfull'] || response == false){
      this.spinner = false;
      this.deviceInternalError = true;
      this.displayDevice = false;
    }else{
      this.deviceInternalError = false;
      this.devicesList=response;
      if(selected_device_info == null || selected_device_info == "NaN")  {
        this.device = this.devicesList[0]['sf_dev_eui'];
        this.app_name = this.devicesList[0]['sf_application_name'];
        this.getAnalysis(this.device, this.app_name);
      }else{
        if(this.devicesList.length == 0 || this.devicesList==null){
          this.displayDevice = false;
        }else{
          this.device = selected_device_info;
          this.getAnalysis(this.device, this.app_name);
          localStorage.setItem('analysis_device', this.devicesList[0]['sf_device_name']);
        }

      }
    }

  }, error=>{
    this.spinner = false;
    this.deviceInternalError = true;
    this.displayDevice = false;
  })

}
data:any;
created_date:any;
getAnalysis(gateway:any, app_name:string){
  this.spinner = true;
  this.noAnalysis = false;
  localStorage.setItem('analysis_gtw', gateway);
  localStorage.setItem('selected_device_info',gateway);
  this.analysisService.getDeviceAnalysisS(gateway).subscribe(response =>{
    if(response == null){
    }
    this.spinner = false;
    if(response["Unsucessfull"]){
      this.internalError = true;
    }else{
      if(response['payload_attributes'] == "NA" || Object.keys(response).length === 0){
        this.noAnalysis = true;
      }else{
        this.noAnalysis = false;
        this.app_name = response['app_name'];
        this.data =  response['payload_attributes'];
        localStorage.setItem('analysis_device', response['device_name']);

      }
    }

  }, error=>{
    this.spinner = false;
    this.internalError = true;
  })
}


}
