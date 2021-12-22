import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarService } from '../navbar/_services/navbar.service';
import { DeviceService } from './_services/device.service';
import { AuthService } from '../login/_services/auth.service';
import { WindowService } from '../others/window/_services/window.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {

  devices:any = [];
  spinner: boolean = true;
  internalError:boolean = false;
  devicesList:boolean = false;
  current_host:any;
  obs: Observable<any>;
  filter = new FormControl('');

  displayedColumns: string[] = ['sf_application_name', 'sf_dev_eui',
  'sf_location', 'sf_device_status',
  'sf_device_last_seen', 'sf_device_name'];
dataSource = new MatTableDataSource(this.devices);
private paginator: MatPaginator;
private sort: any;

@ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
  this.paginator = mp;
  this.setDataSourceAttributes();
}
@ViewChild(MatSort) set content(content: ElementRef) {
  this.sort = content;
  if (this.sort) {
    this.dataSource.sort = this.sort;
  }
}

setDataSourceAttributes() {
  this.dataSource.paginator = this.paginator;
  this.obs = this.dataSource.connect();
  this.dataSource.sort = this.sort;
}
ngOnDestroy() {
  if (this.dataSource) {
    this.dataSource.disconnect();
  }
}
ngAfterContentChecked() {
  this.changeDetectorRef.detectChanges();
}

  constructor(public deviceService: DeviceService,
                        private router: Router,
                        private navbarService:NavbarService,
                        public authService: AuthService,
                        private changeDetectorRef: ChangeDetectorRef,
                        private windowService:WindowService) {
    this.navbarService.Title = "Devices";
   }

  ngOnInit(): void {
    this.current_host = this.windowService.currenthost();
    this.getDevices();
  }


  // This method will display list of devices along with the health status.
  getDevices(){
    this.deviceService.getTenantDevicesWHeathS().subscribe( response =>{
      this.spinner = false;
      this.devices = response;
      if(this.devices.length == 0){
        this.devicesList = true;
      }else{
        this.devicesList = false;
      }
      if(response == false || response['Unsuccessful']){
        this.spinner = false;
        this.internalError = true;
      }else{
        this.devices = response;
        if(this.devices.length == 0){
          this.devicesList = true;
        }else{
          this.devicesList = false;
          this.dataSource.data=this.devices;
        }
      }

    }, error=>{
      this.spinner = false;
      this.internalError = true;
    })
  }




  deviceanlysis(data:any){
      this.deviceService.selected_device_info = data['sf_dev_eui'];
      localStorage.setItem('selected_device_info', data['sf_dev_eui']);
      this.deviceService.selected_device_app_name = data['app_name'];
      this.router.navigate(['/device/trends']);
  }



}
