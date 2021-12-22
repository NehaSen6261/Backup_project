import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { NavbarService } from '../../navbar/_services/navbar.service';
import { SubtenantService } from '../_services/subtenant.service';
import { AuthService } from './../../login/_services/auth.service';
import { DeviceService } from '../../devices/_services/device.service';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { OthersService } from '../../others/_services/others.service';

@Component({
  selector: 'subtenant',
  templateUrl: './subtenant.component.html',
  styleUrls: ['./subtenant.component.scss']
})
export class SubtenantComponent implements OnInit {
  popup_title: string;
  sub_tenant_name: string;
  location: string;
  devices_licenced: Number;
  is_user_management: boolean;
  invalid_dev_count: boolean = false;
  // spinner:boolean= false;
  InternalError: boolean = false;
  invalid_dev_count_text: string;
  devices: any = []

  deviceInternalError: boolean = false;
  displayDevice: boolean = true;
  devicesList: any = [];

  alldev_Selected = false;

  @ViewChild('select') select: MatSelect;
  spinner: boolean = true;
  internalError: boolean = false;
  no_sub_tenants: boolean = false;
  obs: Observable<any>;
  filter: string;
  subtenant_info_error: boolean = false;
  subtenantid: Number;
  element: HTMLElement = document.getElementById('auto_trigger') as HTMLElement;

  constructor(private navbarService: NavbarService,
    private subtenantService: SubtenantService,
    public deviceService: DeviceService,
    private router: Router,
    public authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private othersService: OthersService,
  ) {
    this.navbarService.Title = "Guest Account";
    this.element
    this.othersService.setTitle(this.navbarService.Title);
  }

  displayedColumns: string[] = ['fl_subtenant_id', 'sub_tenant_name', 'devices_licenced', 'location', 'action'];
  TenantSubtenants: any = [];

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

  dataSource = new MatTableDataSource(this.TenantSubtenants);
  ngOnInit(): void {
    this.gettenantSubtenant();
    this.getDevices();
    // this.getsubtenantInfo();
    this.userRolefunction();
  }

  userRolefunction() {
    if (this.authService.currentUser['role_id'] == 2 ||this.authService.currentUser['role_id'] == 'MV1001' ||this.authService.currentUser['role_id'] == 'PA1001'||this.authService.currentUser['role_id'] == 'PV1001') {
      this.GuestForm.get('sf_sub_tenant_name').disable();
      this.GuestForm.get('sf_location').disable();
      this.GuestForm.get('devices').disable();
      this.GuestForm.get('sf_is_user_management').disable();

    }
    else if (this.authService.currentUser['role_id'] == 1) {
      this.GuestForm.get('sf_sub_tenant_name').enable();
      this.GuestForm.get('sf_location').enable();
      this.GuestForm.get('devices').enable();
      this.GuestForm.get('sf_is_user_management').enable();


    }
  }

  //  This function will triger onclick of enter button.
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event['keyCode'] == 13) {
      if (this.popup_title == 'Add Guest') {
        this.postSubTenant(this.GuestForm.value)
      } else if (this.popup_title == 'Edit Guest') {
        this.putSubTenant();
      }
    }
  }

  cleardata() {
    this.GuestForm.reset();

  }

  GuestForm = this.fb.group({
    sf_sub_tenant_name: new FormControl("", Validators.compose([
      Validators.minLength(3),
      Validators.maxLength(40), Validators.pattern(".*\\S.*[a-zA-z0-9_-]"),

    ])),
    sf_location: new FormControl("", Validators.compose([
      Validators.minLength(3),
      Validators.maxLength(40), Validators.pattern(".*\\S.*[a-zA-z0-9_-]"),

    ])),

    devices: [''],

    sf_is_user_management: ['']

  });

  error_messages = {

    'sf_sub_tenant_name': [
      { type: 'minlength', message: 'Minimum 3 charater require.' },
      { type: 'maxlenght', message: 'Max 40 charater allow.' },
      { type: 'pattern', message: 'can not contain space' },
    ],
    'sf_location': [
      { type: 'minlength', message: 'Minimum 3 charater require.' },
      { type: 'maxlenght', message: 'Max 40 charater allow.' },
      { type: 'pattern', message: 'can not contain space' },
    ],

  }

  // This method will display all the sub tenants for a tenant.
  gettenantSubtenant() {
    this.subtenantService.gettenantSubtenantS().subscribe(response => {      
      this.spinner = false;
      if (response['Unsuccessful']) {
        this.internalError = true;
      } else {
        this.TenantSubtenants = response;
        if (this.TenantSubtenants.length == 0) {
          this.no_sub_tenants = true;
        }
        this.dataSource.data = this.TenantSubtenants;

      }
    }, error => {
      this.spinner = false;
      this.internalError = true;
    })
  }

  // This method will Inactivate the sub tenant by sub tenant id.
  inactivateSubTenant(data: any) {
    this.subtenantService.inactivateSubTenantS(data['sf_is_sub_tenant_active'], data['sf_subtenant_id']).subscribe(response => {

    })
  }
  // select all functionaly related functions starts here.
  toggleAllSelection() {
    if (this.alldev_Selected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }

  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.alldev_Selected = newStatus;
  }

  // select all functionaly related functions ends here.

  // This method will display all the devices
  getDevices() {
    this.deviceService.getTenantDevicesS().subscribe(response => {
      if (response['Unsuccessful'] || response == false) {
        this.deviceInternalError = true;
        this.displayDevice = false;
      } else {
        this.devicesList = response;
      }
      if (this.devicesList.length == 0 || this.devicesList == null) {
        this.displayDevice = false;
      }
    }, error => {
      this.deviceInternalError = true;
    })
  }



  // This method will get the form data.
  postSubTenant(data: any) {
    if (this.popup_title == 'Add Guest') {
      let add_data = data.value;
      if (add_data['sf_location'] == undefined || add_data['sf_sub_tenant_name'] == undefined || add_data['devices'].length == 0) {
      } else {
        if (add_data['sf_is_user_management'] == undefined) {
          add_data['sf_is_user_management'] = false;
        }
        add_data['fw_tenant_id'] = this.authService.currentUser['tenant_id'];
        add_data['created_by'] = this.authService.currentUser['email'];
        add_data['sf_devices_list'] = { devices: add_data['devices'] };
        delete add_data['devices'];
        this.spinner = true;
        this.subtenantService.postSubTenantS(add_data).subscribe(response => {
          data.resetForm();
          this.spinner = false;
          this.ngOnInit();
          if (response['Unsuccessful']) {
            this.InternalError = true;
          }
        }, error => {
          this.spinner = false;
          this.InternalError = true;
        }

        )
      }
    } else if (this.popup_title == 'Edit Guest') {
      this.putSubTenant();
    }


  }





  // This method will display the particular subtenant information.
  subtenant_devices: any = [];
  getsubtenantInfo(data: any) {
    this.subtenantid = data['sf_subtenant_id'];
    this.sub_tenant_name = data['sf_sub_tenant_name'];
    this.location = data['sf_location'];
    this.is_user_management = data['sf_is_user_management'];
    this.subtenant_devices = data['sf_devices_list']['devices'];
    let device_ids = [];
    this.subtenant_devices.forEach(element => {

      device_ids.push(element['sf_dev_eui']);
    });
    this.devices = device_ids;
  }


  // This method will send the form data  to the API for update method.
  putSubTenant() {
    let update_data = this.GuestForm.value;
    if (update_data['sf_is_user_management'] == undefined) {
      update_data['sf_is_user_management'] = false;
    }
    update_data['updated_by'] = this.authService.currentUser['email'];
    update_data['sf_devices_list'] = { devices: update_data['devices'] };
    delete update_data['devices'];
    this.subtenantService.putSubTenantS(this.subtenantid, update_data).subscribe(response => {
      this.ngOnInit();
    })
  }

  // Thid function will delete the sub tenant.
  deleteSubTenant() {
    this.subtenantService.deleteSubTenantS(this.subtenantid).subscribe(response => {
      this.ngOnInit();
    })
  }


}
