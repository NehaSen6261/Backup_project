import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DatePipe, DecimalPipe ,Location} from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { NavbarService } from '../navbar/_services/navbar.service';
import { SnackbarComponent } from '../others/snackbar/snackbar.component';
import { AuthService } from '../login/_services/auth.service';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { PlantService } from '../plants/_services/plant.service';
import { MaintenanceLogService } from './_services/maintenance-log.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSelect } from '@angular/material/select';
import { WorkcenterService } from '../workcenters/_services/workcenter.service';
import { AssetService } from '../assets/_services/asset.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { OthersService } from '../others/_services/others.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import { SimulatorService } from '../simulator/_services/simulator.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'maintenance-log',
  templateUrl: './maintenance-log.component.html',
  styleUrls: ['./maintenance-log.component.scss'],
  providers: [
    DecimalPipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter  
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class MaintenanceLogComponent implements OnInit {
  obs: Observable<any>;
  popup_title: string;
  maintenancelog: any = [];
  internalError: boolean = false;
  spinner: boolean = true;
  no_maintenancelog: boolean;
  minDate = new Date();
  plants_internalError: boolean;
  startDate:Date = new Date();
  plants: any = [];
  no_plants: boolean;
  workcenter_internalError: boolean;
  no_workcenter: boolean;
  plant_workcenters: any = [];
  asset_internalError: boolean;
  no_asset: boolean;
  workcenter_asset: any = [];
  maintanence_id: any;
  model: NgbDateStruct;
  error_status= "Error";
  element: HTMLElement = document.getElementById('auto_trigger') as HTMLElement;


  @ViewChild('select') select: MatSelect;
  filter = new FormControl('');

  plant = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  work_center = new FormControl('', [Validators.required]);
  asstes = new FormControl('', [Validators.required]);
  duration = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  next_cycle = new FormControl('', [Validators.minLength(3), Validators.maxLength(40)]);
  start_date = new FormControl('', [Validators.required]);
  end_date = new FormControl('');
  assest_name = new FormControl('');
  starttime = new FormControl('',[Validators.required]);
  endtime = new FormControl('');
  maintenance_note = new FormControl('');
  maintenance_type = new FormControl('', [Validators.required]);
  closed = new FormControl('');
  browser_timezone:string;

  displayedColumns: string[] = ['sf_plant_name', 'sf_work_centre_name', 'sf_asset_name', 'sf_maintenance_type', 'sf_service_start_date', 'sf_service_end_date', 'sf_duration', 'sf_next_maintenance_cycle', 'action'];
  dataSource = new MatTableDataSource(this.maintenancelog);
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

  constructor(    
    private navbarService: NavbarService,
    private changeDetectorRef: ChangeDetectorRef,
    private snackBar: SnackbarComponent,
    private plantService: PlantService,
    private workcenterService: WorkcenterService,
    private assetService: AssetService,
    private maintanenceService: MaintenanceLogService,    
    private othersService: OthersService,
    public authService: AuthService,
    public datepipe: DatePipe,
    public simulatorService: SimulatorService,
    private routelocationInfo: Location,
  ) {
    this.navbarService.Title = "Maintenance Register";
    this.othersService.setTitle(this.navbarService.Title);
  }
  ngOnInit(): void {
    this.browser_timezone= Intl.DateTimeFormat().resolvedOptions().timeZone;
    // if the fault record is added the get method is updated by calling refresh observable
    this.simulatorService.getRefreshNeededS().subscribe(()=>{
      this.getmaintanencelog();
    })
    this.getmaintanencelog();
    this.getPlants();
    this.userRolefunction();
  }


  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();
  }

  maitainence_select: any = [
    { value: 'On Demand', viewValue: 'On Demand' },
    { value: 'Fault repair', viewValue: 'Fault repair' },
    { value: 'Regular', viewValue: 'Regular' },

  ];

  //  Error messages
  PlantErrorMessages() {
    if (this.plant.hasError('required')) {
      return 'You must choose a plant';
    }
  }
  WorkcentersErrorMessages() {
    if (this.work_center.hasError('required')) {
      return 'You must choose a workcenter';
    }
  }
  AsstesErrorMessages() {
    if (this.asstes.hasError('required')) {
      return 'You must choose a asset';
    }
  }
  maintenance_typeerror() {
    if (this.maintenance_type.touched) {
      return 'Please enter the details'
    }
  }

  durationErrorMessages() {
    if (this.duration.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.duration.hasError('minlength')) {
      return 'Minimum 1 characters required !';
    }
    if (this.duration.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !';
    }
  }

  enddateerror(){
    if(this.end_date.invalid){
      return 'please enter the end date !'
    }
  }

  maintenancenoteerror(){
    if(this.maintenance_note.invalid){
      return 'please enter the maintenence note !'
    }
  }

  endtimeerror(){
    if(this.endtime.invalid){
      return 'please enter the end time !' 
    }
  }

  nextcycleerror(){
    if(this.next_cycle.invalid){
      return 'please enter the next cycle !'
    }
  }



  // This method will post the maintanence log data by calling the API
  end_date_time:any;
  public disabled_enable_button : boolean;

  saveMaintenancelogs() {
    if (this.plant.status == 'INVALD' || this.workcenter_asset.length == 0|| this.plant_workcenters.length ==0 ||
      this.work_center.status == 'INVALD' || this.maintenance_type.status == 'INVALD' ||
      this.next_cycle.status == 'INVALD' || this.duration.status == 'INVALD' ||
      this.start_date.status == 'INVALD' || this.starttime.status == 'INVALD'|| 
      this.endtime.status == 'INVALD'|| this.start_date.hasError('required') || 
      this.maintenance_type.hasError('required') || this.plant.hasError('required') ||
      this.work_center.hasError('required') || this.asstes.hasError('required')||
      this.starttime.hasError('required') || this.endtime.hasError('required')
    ) {
      this.snackBar.top_snackbar("Enter all required Fields !!",this.error_status)
    }
    else if((this.end_date.touched && this.end_date.status=='INVALID') || ((this.start_date.value >= this.end_date.value) && (this.starttime.value >= this.endtime.value)))
    {
      this.snackBar.top_snackbar("Enter Valid end date and end time !!",this.error_status)
    }
    else {
      let add_maintenancelogs = {}
      add_maintenancelogs['fw_tenant_id'] = this.authService.currentUser['tenant_id'];
      add_maintenancelogs['sf_plant_id'] = this.plant.value;
      add_maintenancelogs['sf_work_center_id'] = this.work_center.value;
      add_maintenancelogs['sf_asset_id'] = this.asstes.value;
      add_maintenancelogs['sf_maintenance_type'] = this.maintenance_type.value;
      add_maintenancelogs['sf_service_start_date'] = this.datepipe.transform(this.start_date.value, 'yyyy-MM-dd') + ' ' + this.starttime.value ;
      this.end_date_time = this.datepipe.transform(this.end_date.value, 'yyyy-MM-dd') + ' ' + this.endtime.value
      if(this.end_date_time == "null null" || this.end_date_time == null + " " + this.endtime.value || this.end_date_time == this.datepipe.transform(this.end_date.value, 'yyyy-MM-dd')+ " " + null){
        this.end_date_time = null;
      add_maintenancelogs['sf_service_end_date'] = this.end_date_time;
      }else{
      add_maintenancelogs['sf_service_end_date'] =  this.datepipe.transform(this.end_date.value, 'yyyy-MM-dd') + ' ' + this.endtime.value   
      }
      add_maintenancelogs['sf_duration'] = this.duration.value;
      add_maintenancelogs['sf_service_note'] = this.maintenance_note.value;
      add_maintenancelogs['sf_next_maintenance_note'] = "";
      add_maintenancelogs['sf_next_maintenance_cycle'] = this.datepipe.transform(this.next_cycle.value, 'yyyy-MM-dd')
      add_maintenancelogs['created_by'] = this.authService.currentUser['email'];
      add_maintenancelogs['source'] = "maintenance";
      add_maintenancelogs['time_zone'] = this.browser_timezone;
      this.disabled_enable_button = true; 
      this.maintanenceService.postMaintenancelogs(add_maintenancelogs).subscribe(response => {
        if (this.maintanenceService.response_status == "Unsuccessful" ) { 
          this.disabled_enable_button = false;   
        }
        else if (this.maintanenceService.response_status == "Successful" ) { 
          this.disabled_enable_button = false;   
          this.ngOnInit();
          this.cleardata();
        }
      })

     
    }

  }
  // this method will reset the form data.
  cleardata() {
    this.workcenter_asset.length = 0
    this.plant_workcenters.length = 0
    this.plant.reset()
    this.asstes.reset();
    this.work_center.reset();
    this.maintenance_type.reset();
    this.duration.reset();
    this.next_cycle.reset()
    this.start_date.reset();
    this.end_date.reset();
    this.starttime.reset();
    this.endtime.reset();
    this.maintenance_note.reset();
    this.closed.reset();
    this.startDate = new Date();
    this.status=' ';

  }
  
  // This method will take to the previous route.
  backloc(){
    this.routelocationInfo.back();
  }

  // This function will display  all maintenancelogs.
  getmaintanencelog() {
    this.maintanenceService.getMaintenancelog_data(this.browser_timezone).subscribe(response => {
      this.spinner = false;
      if (response['Unsuccessful']) {
        this.internalError = true;
      } else {
        this.maintenancelog = response;
        this.maintenancelog.forEach(element => {
          if(element['sf_service_end_date'] == null){
            element['sf_service_end_date'] = 'NA'
          }
        });
        if (this.maintenancelog.length == 0) {
          this.no_maintenancelog = true;
        } else {
          this.no_maintenancelog = false;
          this.dataSource.data = this.maintenancelog;
        }
      }
    }, error => {
      this.spinner = false;
      this.internalError = true;
    })
  }

  filteredOptions: Observable<any[]>;

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



  filteredOptions_workcenter: Observable<any[]>;
  // This method will display the all the plant work centers.
  getplantWorkcenters(plant_id: any) {
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



  filteredOptions_asset: Observable<any[]>;
  // This method will display the all the assest based on workcenter_id.
  getWCAssets(workcenter_id: any) {
    this.assetService.getWorkcenterAssetsListS(workcenter_id).subscribe(response => {
      if (response['Unsuccessful']) {
        this.asset_internalError = true;
      } else {
        this.workcenter_asset = response;
        if(this.workcenter_asset.length == 0) {
          this.no_asset = true;
        } else {
          this.no_asset = false;
        }
      }
    }, error => {
      this.asset_internalError = true;
    })
  }


  // this method will  maintenancelogs info.
  status:any;
  public start_service_date:string;
  maintanencelog_info(maintanencelog: any) {
    this.status=maintanencelog['maintenance_status'];
    this.maintanence_id = maintanencelog['sf_maintenance_log_id'];
    this.plant.setValue(maintanencelog['sf_plant_id']);
    this.work_center.setValue(maintanencelog['sf_work_centre_id']);
    maintanencelog['maintanencelog']
    this.startDate= new Date();    ;
    this.getplantWorkcenters(maintanencelog['sf_plant_id']);
    this.getWCAssets(maintanencelog['sf_work_centre_id']);
    this.start_service_date = maintanencelog['sf_service_start_date'];
    let split_date_time = maintanencelog['sf_service_start_date'];
    let split_end_date_time = maintanencelog['sf_service_end_date'];

    let strtdate = split_date_time.split(' ', 2)
    let end_date = split_end_date_time.split(' ', 2)

    this.timeselect.push({value: strtdate[1], viewValue:strtdate[1]});
    this.timeselect.push({value: end_date[1], viewValue:end_date[1]});

    let strttime = strtdate[1] //time
    let totaldate = strtdate[0]  //date

    this.start_date.setValue(moment(totaldate));    
    this.starttime.setValue(String(strttime));

    //end date    
    let end_startdate = end_date[0];
    let end_time = end_date[1]; //time

    this.end_date.setValue(moment(end_startdate));
    this.endtime.setValue(end_time)
    
    this.removeTimeDuplicates();
    this.maintenance_type.setValue(maintanencelog['sf_maintenance_type']);
    this.duration.setValue(maintanencelog['sf_duration']);

    this.next_cycle.setValue(maintanencelog['sf_next_maintenance_cycle']);
    this.asstes.setValue(maintanencelog['sf_asset_id']);
    this.assest_name.setValue(maintanencelog['sf_asset_name']);
    this.maintenance_note.setValue(maintanencelog['sf_service_note']); 
    this.ngOnInit();

  }
// Check the validation for the closing the maintenance record.
  maintenancelogstatus(){
    if((this.end_date.status=="INVALID" || this.endtime.status=="INVALID")&&(this.maintenance_note.value == null || this.maintenance_note.value == "")&&this.datepipe.transform(this.next_cycle.value, 'yyyy-MM-dd')==null)
      {
        this.maintenance_note.markAsTouched();
        this.maintenance_note.setErrors({ 'incorrect': true});
        this.endtime.setErrors({ 'incorrect': true});
        this.end_date.setErrors({ 'incorrect': true});
        this.endtime.markAsTouched();
        this.end_date.markAsTouched();
        this.next_cycle.markAsTouched();
        this.next_cycle.setErrors({ 'incorrect': true});
        this.snackBar.top_snackbar("Enter End date, Maintenance note and next cycle !!",this.error_status);
      }
      else if((this.end_date.status=="INVALID" || this.endtime.status=="INVALID") && this.datepipe.transform(this.next_cycle.value, 'yyyy-MM-dd')==null)
      {
        this.endtime.setErrors({ 'incorrect': true});
        this.end_date.setErrors({ 'incorrect': true});
        this.endtime.markAsTouched();
        this.end_date.markAsTouched();
        this.next_cycle.markAsTouched();
        this.next_cycle.setErrors({ 'incorrect': true});
        this.snackBar.top_snackbar("Enter End date and next cycle !!",this.error_status);
      }
      else if((this.end_date.status=="INVALID" || this.endtime.status=="INVALID")&&(this.maintenance_note.value == null || this.maintenance_note.value == ""))
      {
        this.maintenance_note.markAsTouched();
        this.maintenance_note.setErrors({ 'incorrect': true});
        this.endtime.setErrors({ 'incorrect': true});
        this.end_date.setErrors({ 'incorrect': true});
        this.endtime.markAsTouched();
        this.end_date.markAsTouched();
        this.snackBar.top_snackbar("Enter End date and Maintenance note !!",this.error_status);
      }
      else if((this.maintenance_note.value == null || this.maintenance_note.value == "")&&this.datepipe.transform(this.next_cycle.value, 'yyyy-MM-dd')==null)
      {
        this.maintenance_note.markAsTouched();
        this.maintenance_note.setErrors({ 'incorrect': true});
        this.next_cycle.markAsTouched();
        this.next_cycle.setErrors({ 'incorrect': true});
        this.snackBar.top_snackbar("Enter Maintenance note and next cycle !!",this.error_status);
      }
      else if(this.datepipe.transform(this.next_cycle.value, 'yyyy-MM-dd')==null){
        this.next_cycle.setErrors({ 'incorrect': true});
        this.next_cycle.markAsTouched();
        this.snackBar.top_snackbar("Enter next cycle !!",this.error_status);
      }
      else if(this.maintenance_note.value == null || this.maintenance_note.value == "")
      {
        this.maintenance_note.markAsTouched();
        this.maintenance_note.setErrors({ 'incorrect': true});
        this.snackBar.top_snackbar("Enter Maintenance note !!",this.error_status);
      }
      else if(this.end_date.status=="INVALID" || this.endtime.status=="INVALID"){
        this.endtime.setErrors({ 'incorrect': true});
        this.end_date.setErrors({ 'incorrect': true});
        this.endtime.markAsTouched();
        this.end_date.markAsTouched();
        this.snackBar.top_snackbar("Enter Proper End date !!",this.error_status);
      } 
       else{
      this.closed.setValue('closed');
      this.updatemaintanencelog();
      this.closed.reset();
    }
  }

  // this method will update the maintanencelog  details.
  updatemaintanencelog() {    
    if (this.plant.status == 'INVALD' ||this.workcenter_asset.length == 0||
    this.plant_workcenters.length ==0 ||
    this.work_center.status == 'INVALD' || this.maintenance_type.status == 'INVALD' ||
    this.next_cycle.status == 'INVALD' || this.duration.status == 'INVALD' ||
    this.start_date.status == 'INVALD' || 
    this.starttime.status == 'INVALD'|| this.endtime.status == 'INVALD'||
    this.start_date.hasError('required') || 
    this.maintenance_type.hasError('required') || this.plant.hasError('required') ||
    this.work_center.hasError('required') || this.asstes.hasError('required')||
    this.starttime.hasError('required') || this.endtime.hasError('required')||
    this.starttime.status == null || this.endtime.status == null
  ){
    this.snackBar.top_snackbar("Enter all required Fields !!",this.error_status)
  }
  else if((this.end_date.touched && this.end_date.status=='INVALID') || ((this.start_date.value >= this.end_date.value) && (this.starttime.value >= this.endtime.value)))
  {
    this.snackBar.top_snackbar("Enter Valid end date and end time !!",this.error_status)
  }
  else{   
      let end_time_:any
      let update_maintenancelogs = {}
      update_maintenancelogs['fw_tenant_id'] = this.authService.currentUser['tenant_id'];
      update_maintenancelogs['sf_plant_id'] = this.plant.value;
      update_maintenancelogs['sf_work_center_id'] = this.work_center.value;
      update_maintenancelogs['sf_asset_id'] = this.asstes.value;
      update_maintenancelogs['sf_maintenance_type'] = this.maintenance_type.value;
      if(this.starttime.value !='NA' || this.starttime.value){
        update_maintenancelogs['sf_service_start_date'] = this.datepipe.transform(this.start_date.value, 'yyyy-MM-dd') + ' ' + this.starttime.value;
      }else{
        update_maintenancelogs['sf_service_start_date'] = this.datepipe.transform(this.start_date.value, 'yyyy-MM-dd') + ' ' + "00:00";
      }
      if(this.endtime.value == undefined || this.endtime.value == null){
        end_time_ = "00:00";
      }else{
        end_time_ = this.endtime.value;
      }
      if(this.end_date.value._i !='NA'){
        update_maintenancelogs['sf_service_end_date'] = this.datepipe.transform(this.end_date.value, 'yyyy-MM-dd') + ' ' + end_time_;
      }else{
        update_maintenancelogs['sf_service_end_date'] = null;
      }
      update_maintenancelogs['sf_service_note'] = this.maintenance_note.value;
      update_maintenancelogs['sf_next_maintenance_note'] = this.maintenance_note.value;
      update_maintenancelogs['sf_next_maintenance_cycle'] = this.datepipe.transform(this.next_cycle.value, 'yyyy-MM-dd');
      update_maintenancelogs['updated_by'] = this.authService.currentUser['email'];
      update_maintenancelogs['time_zone'] = this.browser_timezone;
      update_maintenancelogs['sf_maintenance_status']= this.closed.value;
      this.maintanenceService.putMaintenancelogs(this.maintanence_id, update_maintenancelogs).subscribe(response => {
        this.ngOnInit();
      })
    }

  }

  // this method will delete particular customer details by passing the Maintanence id.
  deleteMaintenancelogs() {
    this.maintanenceService.deleteMaintenancelog_info(this.maintanence_id).subscribe(response => {
      this.othersService.reloadCurrentRoute();
    })
  }



  // this method for searching the table
  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // this method is used to disable the add edit and delete button for viewer roles
  public addbutton = true
  userRolefunction() {
    if ((this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == "MV1001" || this.authService.currentUser['role_id'] == "PA1001" || this.authService.currentUser['role_id'] == 'PV1001' || this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001' || this.authService.currentUser['role_id'] == 'ASV1001'|| this.authService.currentUser['role_id']=='JB1001') && this.status!='closed') {
      this.plant.disable()
      this.work_center.disable()
      this.next_cycle.disable()
      this.duration.disable()
      this.maintenance_type.disable()
      this.asstes.disable()
      this.start_date.disable();
      this.end_date.disable();
      this.starttime.disable();
      this.endtime.disable();
      this.maintenance_note.disable();
      this.addbutton = false
    }
    else if (this.status=='closed') {
      this.plant.disable()
      this.work_center.disable()
      this.next_cycle.disable()
      this.duration.disable()
      this.maintenance_type.disable()
      this.asstes.disable()
      this.start_date.disable();
      this.end_date.disable();
      this.starttime.disable();
      this.endtime.disable();
      this.maintenance_note.disable();
    }
    else if ((this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 0  || this.authService.currentUser['role_id'] == 'ASA1001') && this.status!='closed') {
      this.plant.enable()
      this.work_center.enable()
      this.next_cycle.enable()
      this.duration.enable()
      this.maintenance_type.enable()
      this.asstes.enable()
      this.start_date.enable();
      this.start_date.enable();
      this.starttime.enable();
      this.endtime.enable();
      this.end_date.enable();
      this.maintenance_note.enable();
      this.addbutton = true
    }
  }

  timeselect: any = [
    { value: "00:00", viewValue:'00:00'},
    { value: "00:30", viewValue:'00:30'},
    { value: "01:00", viewValue:'01:00'},
    { value: "01:30", viewValue:'01:30'},
    { value: "02:00", viewValue:'02:00'},
    { value: "02:30", viewValue:'02:30'},
    { value: "03:00", viewValue:'03:00'},
    { value: "03:30", viewValue:'03:30'},
    { value: "04:00", viewValue:'04:00'},
    { value: "04:30", viewValue:'04:30'},
    { value: "05:00", viewValue:'05:00'},
    { value: "05:30", viewValue:'05:30'},
    { value: "06:00", viewValue:'06:00'},
    { value: "06:30", viewValue:'06:30'},
    { value: "07:00", viewValue:'07:00'},
    { value: "07:30", viewValue:'07:30'},
    { value: "08:00", viewValue:'08:00'},
    { value: "08:30", viewValue:'08:30'},
    { value: "09:00", viewValue:'09:00'},
    { value: "09:30", viewValue:'09:30'},
    { value: "10:00", viewValue:'10:00'},
    { value: "10:30", viewValue:'10:30'},
    { value: "11:00", viewValue:'11:00'},
    { value: "11:30", viewValue:'11:30'},
    { value: "12:00", viewValue:'12:00'},
    { value: "12:30", viewValue:'12:30'},
    { value: "13:00", viewValue:'13:00'},
    { value: "13:30", viewValue:'13:30'},
    { value: "14:00", viewValue:'14:00'},
    { value: "14:30", viewValue:'14:30'},
    { value: "15:00", viewValue:'15:00'},
    { value: "15:30", viewValue:'15:30'},
    { value: "16:00", viewValue:'16:00'},
    { value: "16:30", viewValue:'16:30'},
    { value: "17:00", viewValue:'17:00'},
    { value: "17:30", viewValue:'17:30'},
    { value: "18:00", viewValue:'18:00'},
    { value: "18:30", viewValue:'18:30'},
    { value: "19:00", viewValue:'19:00'},
    { value: "19:30", viewValue:'19:30'},
    { value: "20:00", viewValue:'20:00'},
    { value: "20:30", viewValue:'20:30'},
    { value: "21:00", viewValue:'21:00'},
    { value: "21:30", viewValue:'21:30'},
    { value: "22:00", viewValue:'22:00'},
    { value: "22:30", viewValue:'22:30'},
    { value: "23:00", viewValue:'23:00'},
    { value: "23:30", viewValue:'23:30'}
 ];

 // This function will reset the work center and assets.
 ifchange(data:any){
  this.asstes.reset();
  this.work_center.reset();
}

// This function will remove the duplicates from the time select array and remove's undefined elements.
removeTimeDuplicates(){
  var duplicates = [];
    var valid_times = this.timeselect.filter(function(el) {
      if (duplicates.indexOf(el.value) == -1) {
        duplicates.push(el.value);
        return true;
      }
      return false;
    });    
    var filtered_times = valid_times.filter(function (el) {      
      return el.value != undefined;
    });
    this.timeselect = filtered_times;  
}


}
