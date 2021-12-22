import { Component, OnInit, HostListener, ViewChild, ElementRef, ChangeDetectorRef, PipeTransform } from '@angular/core';
import { NavbarService } from '../../navbar/_services/navbar.service';
import { MapperService } from '../_services/mapper.service';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { AuthService } from '../../login/_services/auth.service';
import { WorkcenterService } from '../../workcenters/_services/workcenter.service';
import { DeviceService } from '../../devices/_services/device.service';
import { PlantService } from '../../plants/_services/plant.service';
import { AssetService } from '../../assets/_services/asset.service';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';
import { OthersService } from '../../others/_services/others.service';

@Component({
  selector: 'mapper',
  templateUrl: './mapper.component.html',
  styleUrls: ['./mapper.component.scss'],
  providers: [DecimalPipe]
})
export class MapperComponent implements OnInit {

  mappers: any = [];
  internalError: boolean = false;
  spinner: boolean = true;
  no_mappers: boolean;
  plants: any = [];
  plant_workcenters: any = [];
  assets_list: any = [];
  devces: any = []
  no_plants: boolean;
  no_devices: boolean;
  no_workcenter: boolean;
  no_assets: boolean;
  plants_internalError: boolean;
  workcenter_internalError: boolean;
  device_internalError: boolean;
  assets_internalError: boolean;
  alldev_Selected = false;
  popup_title: string;
  obs: Observable<any>;
  mapping_id: string;
  mapper_name: string;
  mapping_internalError: boolean;
  element: HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
  @ViewChild('select') select: MatSelect;
  filter = new FormControl('');

  displayedColumns: string[] = ['sf_plant_name', 'sf_work_centre_name', 'sf_asset_code', 'sf_device_name', 'action'];
  dataSource = new MatTableDataSource(this.mappers);
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

  constructor(
    private navbarService: NavbarService,
    private mapperService: MapperService,
    private snackbar: SnackbarComponent,
    private plantService: PlantService,
    private workcenterService: WorkcenterService,
    private deviceService: DeviceService,
    private assetService: AssetService,
    public authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    pipe: DecimalPipe,
    private othersService: OthersService,

  ) {
    this.navbarService.Title = "Device Deployment";
    this.obs = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text, pipe))
    );
    this.othersService.setTitle(this.navbarService.Title);
  }

  ngOnInit(): void {
    this.getMappers();
    this.getPlants();
    this.getTenantdevices();
    this.element;
    this.userRolefunction()
  }

  plant = new FormControl('', [Validators.required]);
  work_center = new FormControl('', [Validators.required]);
  assets = new FormControl('', [Validators.required]);
  devices = new FormControl('', [Validators.required]);
  mapping_name = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  description = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  // error messages.

  public addbutton = true
  userRolefunction() {
    if (this.authService.currentUser['role_id'] == 2 ||this.authService.currentUser['role_id'] == "MV1001" || this.authService.currentUser['role_id'] == "PA1001"||this.authService.currentUser['role_id'] == 'PV1001') {
      this.plant.disable()
      this.work_center.disable()
      this.assets.disable()
      this.devices.disable()
      this.mapping_name.disable()
      this.description.disable()
      this.addbutton = false
    }
    else if (this.authService.currentUser['role_id'] == 1) {
      this.plant.enable()
      this.work_center.enable()
      this.assets.enable()
      this.devices.enable()
      this.mapping_name.enable()
      this.description.enable()
      this.addbutton = true

    }
  }
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
  DevicesErrorMessages() {
    if (this.work_center.hasError('required')) {
      return 'You must choose a value';
    }
  }
  MappingErrorMessages() {
    if (this.mapping_name.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.mapping_name.hasError('minlength')) {
      return 'Minimum 3 characters required !';
    }
    if (this.mapping_name.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !';
    }
  }
  DescErrorMessages() {
    if (this.description.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.description.hasError('minlength')) {
      return 'Minimum 3 characters required !';
    }
    if (this.description.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !';
    }
  }

  // This function will display  all assets.
  getMappers() {
    this.mapperService.getMappersS().subscribe(response => {
      this.spinner = false;
      if (response['Unsuccessful']) {
        this.internalError = true;
      } else {
        this.mappers = response;
        if (this.mappers.length == 0) {
          this.no_mappers = true;
        } else {
          this.no_mappers = false;
          this.dataSource.data = this.mappers;
        }
      }
    }, error => {
      this.spinner = false;
      this.internalError = true;
    })
  }

  trackById(index, mapper) {
    return mapper.sf_asset_device_map_id;
  }


  // add mapper
  // clear from data.
  cleardata() {
    this.plant.reset();
    this.work_center.reset();
    this.assets.reset();
    this.devices.reset();
    this.mapping_name.reset();
    this.description.reset();
  }

  //  This function will triger onclick of enter button.
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event['keyCode'] == 13) {
      if (this.popup_title == 'Add Mapper') {
        this.savemapping()
      } else if (this.popup_title == 'Edit Project') {
        this.upadatemapping();
      }
    }
  }

  //  Multi device select
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
  getAssets(workcenter_id) {
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

  // This method will display the all the devices which are  associated with any asset.
  // public dev:string;
  getTenantdevices() {
    this.deviceService.getTenantDevicesNAlistS().subscribe(response => {
      if (response['Unsuccessful']) {
        this.device_internalError = true;
      } else {
        this.devces = response;
        if (this.devces.length == 0) {
          this.no_devices = true;
        } else {
          this.no_devices = false;
        }
      }
    }, error => {
      this.device_internalError = true;
    })
  }

  // This method will create a mapper.
  savemapping() {
    if (this.plant.status == "INVALID" || this.work_center.status == "INVALID" || this.devices.status == "INVALID" ||
      this.mapping_name.status == "INVALID" || this.description.status == "INVALID" || this.assets.status == "INVALID") {
      this.snackbar.snackbar("Enter all required feilds !!")
    }
    else {
      let data = {}
      data['fw_tenant_id'] = this.authService.currentUser['tenant_id'];
      data['sf_asset_id'] = this.assets.value;
      data['sf_device_id'] = this.devices.value;
      data['sf_mapper_name'] = this.mapping_name.value;
      data['sf_mapper_description'] = this.description.value;
      data['created_by'] = this.authService.currentUser['email'];
      this.mapperService.postMapperS(data).subscribe(response => {
        if (this.mapperService.response_status == "Successful") {
          this.cleardata();
          this.ngOnInit();
        }
      })

    }
  }

  // This method will display the mapping info.
  getmappinginfo(response) {    
    this.mapping_id = response['sf_asset_device_map_id'];
    this.plant.setValue(response['sf_plant_id']);
    this.work_center.setValue(response['sf_work_centre_id']);
    this.assets.setValue(response['sf_asset_id']);
    this.devices.setValue(response['sf_device_id']);
    this.mapping_name.setValue(response['sf_mapper_name']);
    this.description.setValue(response['sf_mapper_description']);
    this.mapper_name = response['sf_mapper_name'];
    this.getplantWorkcenters(response['sf_plant_id']);
    this.getAssets(response['sf_work_centre_id']);
  }

  // This method will update the existing mapper.
  upadatemapping() {
    if (this.plant.status == "INVALID" || this.work_center.status == "INVALID" || this.devices.status == "INVALID" ||
      this.mapping_name.status == "INVALID" || this.description.status == "INVALID" || this.assets.status == "INVALID") {
      this.snackbar.snackbar("Enter all required feilds !!")
    }
    else {
      let data = {}
      data['sf_asset_id'] = this.assets.value;
      data['sf_device_id'] = this.devices.value;
      var tonum = data['sf_device_id']
      var device_id = tonum.map(function (ele) {
        return parseInt(ele, 10);
      });
      data['sf_device_id'] = device_id;
      data['sf_mapper_name'] = this.mapping_name.value;
      data['sf_mapper_description'] = this.description.value;
      data['updated_by'] = this.authService.currentUser['email'];
      this.mapperService.putMapperS(this.mapping_id, data).subscribe(response => { })
    }
  }

  // This method will delete the mapper by mapping id.
  deleteMapper() {
    this.mapperService.deleteMapperS(this.mapping_id).subscribe(response => {
      this.ngOnInit();
    })
  }

  // this method for searching the table
  search(text: string, pipe: PipeTransform) {
    return this.mappers.filter(response => {
      const term = text.toLowerCase();
      return response.sf_plant_name.toLowerCase().includes(term)
        || pipe.transform(response.sf_work_centre_name).includes(term)
        || pipe.transform(response.sf_asset_code).includes(term)
        || pipe.transform(response.sf_device_name).includes(term)

    });
  }
}
