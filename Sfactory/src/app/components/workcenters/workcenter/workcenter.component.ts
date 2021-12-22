import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ɵConsole} from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { NavbarService } from '../../navbar/_services/navbar.service';
import { WorkcenterService } from '../_services/workcenter.service';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { AuthService } from '../../login/_services/auth.service';
import { PlantService } from '../../plants/_services/plant.service';
import { OthersService } from '../../others/_services/others.service';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

@Component({
  selector: 'workcenter',
  templateUrl: './workcenter.component.html',
  styleUrls: ['./workcenter.component.scss'],
  providers: [DecimalPipe]
})
export class WorkcenterComponent implements OnInit {


  work_centers: any = [];
  internalError: boolean = false;
  spinner: boolean = true;
  no_work_centers: boolean;
  popup_title: string;
  plants: any = [];
  no_plants: boolean;
  plants_internalError: boolean;
  workcenter_id: any;
  error_status= "Error";
  element:HTMLElement = document.getElementById('triger') as HTMLElement;
  browser_timezone:string;
  browser_date:string;
  filter = new FormControl('');
  filter_tzone :string;
  obs: Observable<any>;
  displayedColumns: string[] = ['sf_work_centre_name', 'sf_work_centre_operation',  'sf_work_centre_capacity', 'no_of_asset_associated',   'sf_plant_name', 'sf_plant_location'];
  dataSource = new MatTableDataSource(this.work_centers);
  private paginator: MatPaginator;
  private sort: any;
  public day_value :any[];
  // Mat chips.
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  remDayCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  // weekDays: string[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  weekDays: string[] = [];
  remDays: string[] = [];

  @ViewChild('remDayInput') remDayInput: ElementRef<HTMLInputElement>;

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
    private router:Router,
    private workcenterService: WorkcenterService,
    private changeDetectorRef: ChangeDetectorRef,
    private snackbar: SnackbarComponent,    
    private plantService: PlantService,
    private othersService:OthersService,
    private cookieService: CookieService,
    public  authService: AuthService,
    public datepipe: DatePipe,
  
  ) {
    this.navbarService.Title = "Work Center";
    setInterval (() => {
      this.element;
      }, 100);
      this.othersService.setTitle( this.navbarService.Title);       
  }
  


  ngOnInit(): void {
    this.browser_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.browser_date = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    this.getWorkcenters();
    this.getPlants();
    this.userRolefunction();
  }


  // This method will display all the workcenters.
  getWorkcenters() {
    this.workcenterService.getWorkcentersS(this.browser_timezone, this.browser_date).subscribe(response => {
      this.spinner = false;
      if (response['Unsuccessful']) {
        this.internalError = true;
      } else {
        this.work_centers = response;
        if (this.work_centers.length == 0) {
          this.no_work_centers = true;
          this.cookieService.set('wc_tguide', 'active', 300);
        } else {
          this.cookieService.set('wc_tguide', 'inactive', 300);
          this.no_work_centers = false;
          this.dataSource.data = this.work_centers;
        }
      }
    }, error => {
      this.spinner = false;
    })
  }

  trackById(index, work_center) {
    return work_center.sf_work_centre_id;
  }

  // this method with route the page to workcenter if there is not workcenters associated to plant.
  redirectAsset(){
    this.router.navigate(['/asset'])
  }

  // ---------------------------------------------------------------
  // Form control Name
  // ----------------------------------------------------------------
  sf_plant_name = new FormControl('', [Validators.required]);
  work_center_name = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  capacity = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(40)]);
  operation = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  uom = new FormControl('', [Validators.maxLength(5)]);
  number_of_shifts= new FormControl('', [Validators.required]);
  shift_1_start_hour = new FormControl('', [Validators.required]);
  shift_2_start_hour = new FormControl('', [Validators.required]);
  shift_3_start_hour = new FormControl('', [Validators.required]);
  shift_4_start_hour = new FormControl('', [Validators.required]);

  shift_1_start_time = new FormControl('', [Validators.required]);
  shift_2_start_time = new FormControl('', [Validators.required]);
  shift_3_start_time = new FormControl('', [Validators.required]);
  shift_4_start_time = new FormControl('', [Validators.required]);
  
  shift_1_end_hour = new FormControl('', [Validators.required]);
  shift_2_end_hour = new FormControl('', [Validators.required]);
  shift_3_end_hour = new FormControl('', [Validators.required]);
  shift_4_end_hour = new FormControl('', [Validators.required]);

  
  shift_1_end_time = new FormControl('', [Validators.required]);
  shift_2_end_time = new FormControl('', [Validators.required]);
  shift_3_end_time = new FormControl('', [Validators.required]);
  shift_4_end_time = new FormControl('', [Validators.required]);
  days_week  = new FormControl('');
  t_zone = new FormControl('', [Validators.required]);

  // error messages.
  UnitErrorMessages() {
    if (this.sf_plant_name.hasError('required')) {
      return 'You must choose an plant !!';
    }
  }
  WcNameErrorMessages() {
    if (this.work_center_name.hasError('required')) {
      return 'You must enter workcenter name !!';
    }
    if (this.work_center_name.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.work_center_name.hasError('maxlength')) {
      return 'Minimum 40 characters allowed !!';
    }
  }
  CapacityErrorMessages() {
    if (this.capacity.hasError('required')) {
      return 'You must enter capacity !!';
    }
    if (this.capacity.hasError('minlength')) {
      return 'Minimum 1 characters required !!';
    }
    if (this.capacity.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
  }
  OperationErrorMessages() {
    if (this.operation.hasError('required')) {
      return 'You must enter operation !!';
    }
    if (this.operation.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.operation.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
  }
  UOMErrorMessages() {​​​​​​​​​​​​​​​​
    if (this.uom.hasError('maxlength')) {​​​​​​​​
    return 'Maximum 5 characters allowed !!';
    }​​​​​​​​
  }​​​​​​​​

  numberOfShifts(){
    if (this.number_of_shifts.hasError('required')) {
      return 'Please Choose Number of shift !!';
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
          this.no_plants = false;
        }
      }
    }, error => {
      this.plants_internalError = true;
    })
  }


  // this function get the TimeZone by plant id
  TimeZone: any = [];
  getTimezonePlantId(plant_id:any){
    this.workcenterService.getTimezonePlantId(plant_id).subscribe(response => {
    this.TimeZone = response;
    this.t_zone.setValue(this.TimeZone['plant_tzone'])
    })
  }



   // -----------------------------------------------------------------
  // POST method implementation.
  // -----------------------------------------------------------------
  public disabled_enable_button : boolean;
  saveworkcenter() {

   if (this.sf_plant_name.status == "INVALID" || this.work_center_name.status == "INVALID" || this.capacity.status == "INVALID" ||
  this.operation.status == "INVALID" || this.uom.status == "INVALID"||this.number_of_shifts.status == "INVALID" || this.t_zone.status == "INVALID") {
    this.snackbar.top_snackbar("Enter all required Fields !!", this.error_status);
  } 

  else if( this.shift_1_start_hour.hasError('required') ||this.shift_1_start_time.hasError('required') 
   ||this.shift_1_end_hour.hasError('required') ||this.shift_1_end_time.hasError('required')||
  this.shift_2_start_hour.hasError('required') ||this.shift_2_start_time.hasError('required')|| 
  this.shift_2_end_hour.hasError('required') ||this.shift_2_end_time.hasError('required')||
  this.shift_3_start_hour.hasError('required') ||this.shift_3_start_time.hasError('required')||
 this.shift_3_end_hour.hasError('required') ||this.shift_3_end_time.hasError('required')||
this.shift_4_start_hour.hasError('required') ||this.shift_4_start_time.hasError('required')||
this.shift_4_end_hour.hasError('required') ||this.shift_4_end_time.hasError('required')
) {
    this.snackbar.top_snackbar("Enter all required Fields !!", this.error_status);
   }
  else if((this.number_of_shifts.value == 1) &&  (this.shift_1_end_hour.value+ ":" +  this.shift_1_end_time.value <= this.shift_1_start_hour.value+ ":" +  this.shift_1_start_time.value) ) {
   this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }
 
  else if((this.number_of_shifts.value == 2) &&  (this.shift_2_end_hour.value+ ":" +  this.shift_2_end_time.value <= this.shift_2_start_hour.value+ ":" +  this.shift_2_start_time.value)
    || (this.shift_1_end_hour.value+ ":" +  this.shift_1_end_time.value <= this.shift_1_start_hour.value+ ":" +  this.shift_1_start_time.value) ){
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }
  else if((this.number_of_shifts.value == 2) && (this.shift_1_end_hour.value+ ":" +  this.shift_1_end_time.value > this.shift_2_start_hour.value+ ":" +  this.shift_2_start_time.value))
  {
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }

  else if((this.number_of_shifts.value == 3) &&  ((this.shift_3_end_hour.value+ ":" +  this.shift_3_end_time.value) <= (this.shift_3_start_hour.value+ ":" +  this.shift_3_start_time.value)))
  {   
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }

  else if((this.number_of_shifts.value == 3) && (this.shift_2_end_hour.value+ ":" +  this.shift_2_end_time.value > this.shift_3_start_hour.value+ ":" +  this.shift_3_start_time.value))
  {
   this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }
  else if((this.number_of_shifts.value == 3) && ((this.shift_2_end_hour.value+ ":" +  this.shift_2_end_time.value) <= (this.shift_2_start_hour.value+ ":" +  this.shift_2_start_time.value)))
  {
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }

  else if((this.number_of_shifts.value == 3) && (this.shift_1_end_hour.value+ ":" +  this.shift_1_end_time.value > this.shift_2_start_hour.value+ ":" +  this.shift_2_start_time.value))
  {
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }

  else if((this.number_of_shifts.value == 4) &&  ((this.shift_4_end_hour.value+ ":" +  this.shift_4_end_time.value) <= (this.shift_4_start_hour.value+ ":" +  this.shift_4_start_time.value)))
  {
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }

  else if((this.number_of_shifts.value == 4) && (this.shift_3_end_hour.value+ ":" +  this.shift_3_end_time.value > this.shift_4_start_hour.value+ ":" +  this.shift_4_start_time.value))
  {
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }

  else if((this.number_of_shifts.value == 4) && ((this.shift_2_end_hour.value+ ":" +  this.shift_2_end_time.value) <= (this.shift_2_start_hour.value+ ":" +  this.shift_2_start_time.value)))
  {
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }

  else if((this.number_of_shifts.value == 4) && ((this.shift_3_end_hour.value+ ":" +  this.shift_3_end_time.value) <= (this.shift_3_start_hour.value+ ":" +  this.shift_3_start_time.value))){
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }

  else if((this.number_of_shifts.value == 4) && (this.shift_1_end_hour.value+ ":" +  this.shift_1_end_time.value > this.shift_2_start_hour.value+ ":" +  this.shift_2_start_time.value)){
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }

  else if((this.number_of_shifts.value == 4) && (this.shift_2_end_hour.value+ ":" +  this.shift_2_end_time.value > this.shift_3_start_hour.value+ ":" +  this.shift_3_start_time.value)){
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }
   

  else {
        let data = {}
        data['fw_org_id'] = this.authService.currentUser['org_id'];
        data['fw_tenant_id'] = this.authService.currentUser['tenant_id'];
        data['sf_plant_id'] = this.sf_plant_name.value;
        data['sf_work_centre_name'] = this.work_center_name.value;
        data['sf_work_centre_capacity'] = this.capacity.value;
        data['sf_work_centre_operation'] = this.operation.value;
        data['sf_capacity_uom'] = this.uom.value;
        data['created_by'] = this.authService.currentUser['email'];
        data["sf_work_days"]= this.weekDays,
        data["sf_wc_shifts"] = this.number_of_shifts.value,
        data["sf_no_shifts"] = this.number_of_shifts.value;
       
        if(this.number_of_shifts.value == 1){
          data['sf_shift_hours'] = [{
            "shift" :"shift-1",
            "start_time" : this.shift_1_start_hour.value+ ":" +  this.shift_1_start_time.value, 
            "end_time" : this.shift_1_end_hour.value + ":" + this.shift_1_end_time.value},
        ]}
        else if(this.number_of_shifts.value == 2){
          data['sf_shift_hours'] = [
            {
            "shift" :"shift-1",
            "start_time" : this.shift_1_start_hour.value+ ":" +  this.shift_1_start_time.value, 
            "end_time" : this.shift_1_end_hour.value + ":" + this.shift_1_end_time.value
          },
          {
            "shift" :"shift-2",
            "start_time" : this.shift_2_start_hour.value+ ":" +  this.shift_2_start_time.value, 
            "end_time" : this.shift_2_end_hour.value + ":" + this.shift_2_end_time.value,
          },
        ]
        }
        else if(this.number_of_shifts.value == 3){
        data['sf_shift_hours'] = [{
          "shift" :"shift-1",
          "start_time" : this.shift_1_start_hour.value+ ":" +  this.shift_1_start_time.value, 
          "end_time" : this.shift_1_end_hour.value + ":" + this.shift_1_end_time.value},
        {
          "shift" :"shift-2",
          "start_time" : this.shift_2_start_hour.value+ ":" +  this.shift_2_start_time.value, 
          "end_time" : this.shift_2_end_hour.value + ":" + this.shift_2_end_time.value,
        },
        {
          "shift" :"shift-3",
          "start_time" : this.shift_3_start_hour.value+ ":" +  this.shift_3_start_time.value, 
          "end_time" : this.shift_3_end_hour.value + ":" + this.shift_3_end_time.value,
       }
    ]
        
       }
        else if(this.number_of_shifts.value == 4){
          data['sf_shift_hours'] = [{
            "shift" :"shift-1",
            "start_time" : this.shift_1_start_hour.value+ ":" +  this.shift_1_start_time.value, 
            "end_time" : this.shift_1_end_hour.value + ":" + this.shift_1_end_time.value},
          {
            "shift" :"shift-2",
            "start_time" : this.shift_2_start_hour.value+ ":" +  this.shift_2_start_time.value, 
            "end_time" : this.shift_2_end_hour.value + ":" + this.shift_2_end_time.value,
          },
          {
            "shift" :"shift-3",
            "start_time" : this.shift_3_start_hour.value+ ":" +  this.shift_3_start_time.value, 
            "end_time" : this.shift_3_end_hour.value + ":" + this.shift_3_end_time.value,
         },
        {
          "shift" :"shift-4",
          "start_time" : this.shift_4_start_hour.value+ ":" +  this.shift_4_start_time.value, 
          "end_time" : this.shift_4_end_hour.value + ":" + this.shift_4_end_time.value,
    }
  ]
        }  
  
        this.disabled_enable_button = true;    
        this.workcenterService.postWorkCenterS(data).subscribe(response => {
          if (this.workcenterService.response_status == "Unsuccessful" ) { 
            this.disabled_enable_button = false;   
          }
          else if (this.workcenterService.response_status == "Successful" ) { 
            this.disabled_enable_button = false;   
            this.ngOnInit();
            this.cleardata();
          }
      });
    }
 }

  // clear from data.
  cleardata() {
    this.sf_plant_name.reset();
    this.work_center_name.reset();
    this.capacity.reset();
    this.operation.reset();
    this.uom.reset();
    this.number_of_shifts.reset();
    this.days_week.reset();
    this.filter_tzone = "";
    this.t_zone.disable();
    this.t_zone.reset();
    this.clearShift();
  }

  clear_Shift_1(){
    this.shift_1_start_hour.reset();
    this.shift_1_start_time.reset();
    this.shift_1_end_hour.reset();
    this.shift_1_end_time.reset();
  }

  clear_Shift_2(){
    this.shift_2_start_hour.reset();
    this.shift_2_start_time.reset();
    this.shift_2_end_hour.reset();
    this.shift_2_end_time.reset();
  }

  clear_Shift_3(){
   this.shift_3_start_hour.reset();
    this.shift_3_start_time.reset();
    this.shift_3_end_hour.reset();
    this.shift_3_end_time.reset();
  }

  clear_Shift_4(){
    this.shift_4_start_hour.reset();
     this.shift_4_start_time.reset();
     this.shift_4_end_hour.reset();
     this.shift_4_end_time.reset();
   }

   clearShift(){
     this.clear_Shift_1();
     this.clear_Shift_2();
     this.clear_Shift_3();
     this.clear_Shift_4();
     this.shift_1 = true
     this.shift_2 = false
     this.shift_3 = false
     this.shift_4 = false
   }


    // variable name
 public wc_shift_1_start_hour_time;
 public wc_shift_1_end_hour_time;
 public wc_shift_2_start_hour_time;
 public wc_shift_2_end_hour_time;
 public wc_shift_3_start_hour_time;
 public wc_shift_3_end_hour_time;
 public wc_shift_4_start_hour_time;
 public wc_shift_4_end_hour_time;

  // This method will display the workcenter info.
  workcenterInfo(workcenter:any) {
    this.weekDays=workcenter['work_days'];
    this.t_zone.disable();
    this.t_zone.setValue(workcenter['plant_tzone']);
    this.workcenter_id = workcenter['sf_work_centre_id'];
    this.sf_plant_name.setValue(workcenter['sf_plant_id']);
    this.work_center_name.setValue(workcenter['sf_work_centre_name']);
    this.capacity.setValue(workcenter['sf_work_centre_capacity']);
    this.operation.setValue(workcenter['sf_work_centre_operation']);
    this.uom.setValue(workcenter['sf_capacity_uom']);
    this.number_of_shifts.setValue(workcenter['no_shifts']);
    if(workcenter['no_shifts'] == 1 || workcenter['no_shifts'] == 2){
      this.wc_shift_1_start_hour_time = workcenter['shift_hours'][0]['start_time'].split(':');
      this.wc_shift_1_end_hour_time = workcenter['shift_hours'][0]['end_time'].split(':');       
      this.shift_1_start_hour.setValue((this.wc_shift_1_start_hour_time[0]));
      this.shift_1_start_time.setValue(this.wc_shift_1_start_hour_time[1]);
      this.shift_1_end_hour.setValue((this.wc_shift_1_end_hour_time[0]));
      this.shift_1_end_time.setValue((this.wc_shift_1_end_hour_time[1]));

      this.shift_1 = true;
      this.shift_2 = false;
      this.shift_4 = false;
      this.shift_3 = false;
      this.shift_Dis_Enb_1();
    }
   if(workcenter['no_shifts'] == 2){
    this.wc_shift_2_start_hour_time = workcenter['shift_hours'][1]['start_time'].split(':'); 
    this.wc_shift_2_end_hour_time = workcenter['shift_hours'][1]['end_time'].split(':');
    
    this.shift_2_start_hour.setValue((this.wc_shift_2_start_hour_time[0]));
    this.shift_2_start_time.setValue(this.wc_shift_2_start_hour_time[1]);
    this.shift_2_end_hour.setValue((this.wc_shift_2_end_hour_time[0]));
    this.shift_2_end_time.setValue((this.wc_shift_2_end_hour_time[1]));

    this.wc_shift_1_start_hour_time = workcenter['shift_hours'][0]['start_time'].split(':');
    this.wc_shift_1_end_hour_time = workcenter['shift_hours'][0]['end_time'].split(':'); 
    this.shift_1_start_hour.setValue((this.wc_shift_1_start_hour_time[0]));
    this.shift_1_start_time.setValue(this.wc_shift_1_start_hour_time[1]);
    this.shift_1_end_hour.setValue((this.wc_shift_1_end_hour_time[0]));
    this.shift_1_end_time.setValue((this.wc_shift_1_end_hour_time[1]));

    this.shift_1 = true;
    this.shift_2 = true;
    this.shift_4 = false;
    this.shift_3 = false;
    this.shift_Dis_Enb_2();
    }
   if(workcenter['no_shifts'] == 3){
     this.wc_shift_3_start_hour_time = workcenter['shift_hours'][2]['start_time'].split(':'); 
     this.wc_shift_3_end_hour_time = workcenter['shift_hours'][2]['end_time'].split(':');
    this.shift_3_start_hour.setValue((this.wc_shift_3_start_hour_time[0]));
    this.shift_3_start_time.setValue(this.wc_shift_3_start_hour_time[1]);
    this.shift_3_end_hour.setValue((this.wc_shift_3_end_hour_time[0]));
    this.shift_3_end_time.setValue((this.wc_shift_3_end_hour_time[1]));

    this.wc_shift_1_start_hour_time = workcenter['shift_hours'][0]['start_time'].split(':');
    this.wc_shift_1_end_hour_time = workcenter['shift_hours'][0]['end_time'].split(':'); 
    this.shift_1_start_hour.setValue((this.wc_shift_1_start_hour_time[0]));
    this.shift_1_start_time.setValue(this.wc_shift_1_start_hour_time[1]);
    this.shift_1_end_hour.setValue((this.wc_shift_1_end_hour_time[0]));
    this.shift_1_end_time.setValue((this.wc_shift_1_end_hour_time[1]));

    this.wc_shift_2_start_hour_time = workcenter['shift_hours'][1]['start_time'].split(':'); 
    this.wc_shift_2_end_hour_time = workcenter['shift_hours'][1]['end_time'].split(':');
    
    this.shift_2_start_hour.setValue((this.wc_shift_2_start_hour_time[0]));
    this.shift_2_start_time.setValue(this.wc_shift_2_start_hour_time[1]);
    this.shift_2_end_hour.setValue((this.wc_shift_2_end_hour_time[0]));
    this.shift_2_end_time.setValue((this.wc_shift_2_end_hour_time[1]));

    this.shift_1 = true;
    this.shift_2 = true;
    this.shift_3 = true;
    this.shift_4 = false;
    this.shift_Dis_Enb_3();
    }
   if(workcenter['no_shifts'] == 4){
     this.wc_shift_4_start_hour_time = workcenter['shift_hours'][3]['start_time'].split(':'); 
     this.wc_shift_4_end_hour_time = workcenter['shift_hours'][3]['end_time'].split(':'); 
    this.shift_4_start_hour.setValue((this.wc_shift_4_start_hour_time[0]));
    this.shift_4_start_time.setValue(this.wc_shift_4_start_hour_time[1]);
    this.shift_4_end_hour.setValue((this.wc_shift_4_end_hour_time[0]));
    this.shift_4_end_time.setValue((this.wc_shift_4_end_hour_time[1]));
   
    this.wc_shift_1_start_hour_time = workcenter['shift_hours'][0]['start_time'].split(':');
    this.wc_shift_1_end_hour_time = workcenter['shift_hours'][0]['end_time'].split(':'); 
    this.shift_1_start_hour.setValue((this.wc_shift_1_start_hour_time[0]));
    this.shift_1_start_time.setValue(this.wc_shift_1_start_hour_time[1]);
    this.shift_1_end_hour.setValue((this.wc_shift_1_end_hour_time[0]));
    this.shift_1_end_time.setValue((this.wc_shift_1_end_hour_time[1]));

    this.wc_shift_2_start_hour_time = workcenter['shift_hours'][1]['start_time'].split(':'); 
    this.wc_shift_2_end_hour_time = workcenter['shift_hours'][1]['end_time'].split(':');
    
    this.shift_2_start_hour.setValue((this.wc_shift_2_start_hour_time[0]));
    this.shift_2_start_time.setValue(this.wc_shift_2_start_hour_time[1]);
    this.shift_2_end_hour.setValue((this.wc_shift_2_end_hour_time[0]));
    this.shift_2_end_time.setValue((this.wc_shift_2_end_hour_time[1]));


   this.wc_shift_3_start_hour_time = workcenter['shift_hours'][2]['start_time'].split(':'); 
   this.wc_shift_3_end_hour_time = workcenter['shift_hours'][2]['end_time'].split(':');
   this.shift_3_start_hour.setValue((this.wc_shift_3_start_hour_time[0]));
   this.shift_3_start_time.setValue(this.wc_shift_3_start_hour_time[1]);
   this.shift_3_end_hour.setValue((this.wc_shift_3_end_hour_time[0]));
   this.shift_3_end_time.setValue((this.wc_shift_3_end_hour_time[1]));


    this.shift_1 = true;
    this.shift_2 = true;
    this.shift_3 = true;
    this.shift_4 = true;
    this.shift_Dis_Enb_4();
    }
   if(workcenter['no_shifts'] == null){
    this.clearShift();
   } 

}

 disabledForm(){
  this.number_of_shifts.disable();
  this.shift_1_start_hour.disable();
  this.shift_1_start_time.disable();
  this.shift_1_end_hour.disable();
  this.shift_1_end_time.disable();
  this.shift_2_start_hour.disable();
  this.shift_2_start_time.disable();
  this.shift_2_end_hour.disable();
  this.shift_2_end_time.disable();
  this.shift_3_start_hour.disable();
  this.shift_3_start_time.disable();
  this.shift_3_end_hour.disable();
  
  this.shift_3_end_time.disable();
  this.shift_4_start_hour.disable();
  this.shift_4_start_time.disable();
  this.shift_4_end_hour.disable();
  this.shift_4_end_time.disable();
 }
 
  addbutton = true
  public week_btn 
  userRolefunction() {
    if (
      this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == 'PV1001' || this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001' || this.authService.currentUser['role_id'] == 'ASA1001' || this.authService.currentUser['role_id'] == 'ASV1001') {
      this.sf_plant_name.disable();
      this.work_center_name.disable();
      this.capacity.disable();
      this.operation.disable();
      this.addbutton = false;
      this.uom.disable();
      this.number_of_shifts.disable();
      this.week_btn= true;
      this.days_week.disable();
    }
    else if (this.authService.currentUser['role_id'] == 1  || this.authService.currentUser['role_id'] == 'PA1001'|| this.authService.currentUser['role_id'] == 'MV1001' ) {
      this.sf_plant_name.enable();
      this.addbutton = true;
      this.work_center_name.enable()
      this.capacity.enable();
      this.operation.enable();
      this.uom.enable();
      this.number_of_shifts.enable();
      this.week_btn = false;
      this.days_week.enable();
      this.shift_1_start_hour.enable();
      this.shift_1_start_time.enable();
      this.shift_1_end_hour.enable();
      this.shift_1_end_time.enable();
      this.shift_2_start_hour.enable();
      this.shift_2_start_time.enable();
      this.shift_2_end_hour.enable();
      this.shift_2_end_time.enable();

      this.shift_3_start_hour.enable();
      this.shift_3_start_time.enable();
      this.shift_3_end_hour.enable();
      this.shift_3_end_time.enable();

      this.shift_4_start_hour.enable();
      this.shift_4_start_time.enable();
      this.shift_4_end_hour.enable();
      this.shift_4_end_time.enable();

   
    }
  }
 
disable_shifthours(){
  if(this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == 'PV1001' || this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001' || this.authService.currentUser['role_id'] == 'ASA1001' || this.authService.currentUser['role_id'] == 'ASV1001'){
    this.shift_1_start_hour.disable();
    this.shift_1_start_time.disable();
    this.shift_1_end_hour.disable();
    this.shift_1_end_time.disable();
    
    this.shift_2_start_hour.disable();
    this.shift_2_start_time.disable();
    this.shift_2_end_hour.disable();
    this.shift_2_end_time.disable();
  
    this.shift_3_start_hour.disable();
    this.shift_3_start_time.disable();
    this.shift_3_end_hour.disable();
    this.shift_3_end_time.disable();
  
    this.shift_4_start_hour.disable();
    this.shift_4_start_time.disable();
    this.shift_4_end_hour.disable();
    this.shift_4_end_time.disable();
  }

}


  // -----------------------------------------------------------------
  // PUT method implementation.
  // -----------------------------------------------------------------
 
updateworkcenter() {
  if (this.sf_plant_name.status == "INVALID" || this.work_center_name.status == "INVALID" || this.capacity.status == "INVALID" ||
  this.operation.status == "INVALID" || this.uom.status == "INVALID"||this.number_of_shifts.status == "INVALID" || this.t_zone.status == "INVALID") {
    this.snackbar.top_snackbar("Enter all required Fields 1st!!", this.error_status);
  } 
   else if((this.number_of_shifts.value == 1) && this.shift_1_start_time.hasError('required') 
   ||this.shift_1_end_hour.hasError('required') && this.shift_1_end_time.hasError('required') 
   &&this.shift_1_end_time.hasError('required')) {
    this.snackbar.top_snackbar("Enter all required Fields!!", this.error_status);
   }

   else if(this.number_of_shifts.value == 2 && this.shift_2_end_hour.value == "null"
     && this.shift_2_end_time.value == "null"
     ) {this.snackbar.top_snackbar("Enter all required Fields!!", this.error_status);
    }
  
    else if(this.number_of_shifts.value == 2 && this.shift_2_end_hour.value == null
    && this.shift_2_end_time.value == null
    ) {this.snackbar.top_snackbar("Enter all required Fields!!", this.error_status);
   }

   else if((this.number_of_shifts.value == 3)  &&this.shift_3_end_hour.value == 0 && this.shift_3_end_time.value == 0) {
    this.snackbar.top_snackbar("Enter all required Fields!!", this.error_status);
   }
 
   else if( this.number_of_shifts.value == 4 &&
    this.shift_4_end_hour.value == 0 && this.shift_4_end_time.value == 0){
  this.snackbar.top_snackbar("Enter all required Fields!!", this.error_status);
  }


  else if((this.number_of_shifts.value == 1) &&  (this.shift_1_end_hour.value+ ":" +  this.shift_1_end_time.value <= this.shift_1_start_hour.value+ ":" +  this.shift_1_start_time.value) ) {
   this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }
  else if((this.number_of_shifts.value == 2) &&  (this.shift_2_end_hour.value+ ":" +  this.shift_2_end_time.value <= this.shift_2_start_hour.value+ ":" +  this.shift_2_start_time.value)
    || (this.shift_1_end_hour.value+ ":" +  this.shift_1_end_time.value <= this.shift_1_start_hour.value+ ":" +  this.shift_1_start_time.value) ){
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }
  else if((this.number_of_shifts.value == 2) && (this.shift_1_end_hour.value+ ":" +  this.shift_1_end_time.value > this.shift_2_start_hour.value+ ":" +  this.shift_2_start_time.value))
  {
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }

  else if((this.number_of_shifts.value == 3) &&  (this.shift_3_end_hour.value+ ":" +  this.shift_3_end_time.value <= this.shift_3_start_hour.value+ ":" +  this.shift_3_start_time.value))
  {   
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }

  else if((this.number_of_shifts.value == 3) && (this.shift_2_end_hour.value+ ":" +  this.shift_2_end_time.value > this.shift_3_start_hour.value+ ":" +  this.shift_3_start_time.value))
  {
   this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }
  else if((this.number_of_shifts.value == 3) && (this.shift_2_end_hour.value+ ":" +  this.shift_2_end_time.value <= this.shift_2_start_hour.value+ ":" +  this.shift_2_start_time.value))
  {
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }

  else if((this.number_of_shifts.value == 3) && (this.shift_1_end_hour.value+ ":" +  this.shift_1_end_time.value > this.shift_2_start_hour.value+ ":" +  this.shift_2_start_time.value))
  {
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }

  else if((this.number_of_shifts.value == 4) &&  (this.shift_4_end_hour.value+ ":" +  this.shift_4_end_time.value <= this.shift_4_start_hour.value+ ":" +  this.shift_4_start_time.value))
  {
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }

  else if((this.number_of_shifts.value == 4) && (this.shift_3_end_hour.value+ ":" +  this.shift_3_end_time.value > this.shift_4_start_hour.value+ ":" +  this.shift_4_start_time.value))
  {
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }

  else if((this.number_of_shifts.value == 4) && (this.shift_2_end_hour.value+ ":" +  this.shift_2_end_time.value <= this.shift_2_start_hour.value+ ":" +  this.shift_2_start_time.value))
  {
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }

  else if((this.number_of_shifts.value == 4) && (this.shift_3_end_hour.value+ ":" +  this.shift_3_end_time.value <= this.shift_3_start_hour.value+ ":" +  this.shift_3_start_time.value)){
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }

  else if((this.number_of_shifts.value == 4) && (this.shift_1_end_hour.value+ ":" +  this.shift_1_end_time.value > this.shift_2_start_hour.value+ ":" +  this.shift_2_start_time.value)){
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }

  else if((this.number_of_shifts.value == 4) && (this.shift_2_end_hour.value+ ":" +  this.shift_2_end_time.value > this.shift_3_start_hour.value+ ":" +  this.shift_3_start_time.value)){
    this.snackbar.top_snackbar("Enter valid shift  hour's!!", this.error_status);
  }
   
   else {
       let data = {}
      data['sf_plant_id'] = this.sf_plant_name.value;
      data['sf_work_centre_name'] = this.work_center_name.value;
      data['sf_work_centre_capacity'] = this.capacity.value;
      data['sf_work_centre_operation'] = this.operation.value;
      data['sf_capacity_uom'] = this.uom.value;
      data["sf_work_days"]= this.weekDays,
      data["sf_wc_shifts"] = this.number_of_shifts.value,
      data["sf_no_shifts"] = this.number_of_shifts.value;
   
      if(this.number_of_shifts.value == 1){
        data['sf_shift_hours'] = [{
          "shift" :"shift-1",
          "start_time" : this.shift_1_start_hour.value+ ":" +  this.shift_1_start_time.value, 
          "end_time" : this.shift_1_end_hour.value + ":" + this.shift_1_end_time.value},
         ]
    }
      else if(this.number_of_shifts.value == 2){
        data['sf_shift_hours'] = [
          {
          "shift" :"shift-1",
          "start_time" : this.shift_1_start_hour.value+ ":" +  this.shift_1_start_time.value, 
          "end_time" : this.shift_1_end_hour.value + ":" + this.shift_1_end_time.value
        },
        {
          "shift" :"shift-2",
          "start_time" : this.shift_2_start_hour.value+ ":" +  this.shift_2_start_time.value, 
          "end_time" : this.shift_2_end_hour.value + ":" + this.shift_2_end_time.value,
        },
      ]
      }
      else if(this.number_of_shifts.value == 3){
      data['sf_shift_hours'] = [{
        "shift" :"shift-1",
        "start_time" : this.shift_1_start_hour.value+ ":" +  this.shift_1_start_time.value, 
        "end_time" : this.shift_1_end_hour.value + ":" + this.shift_1_end_time.value},
      {
        "shift" :"shift-2",
        "start_time" : this.shift_2_start_hour.value+ ":" +  this.shift_2_start_time.value, 
        "end_time" : this.shift_2_end_hour.value + ":" + this.shift_2_end_time.value,
      },
      {
        "shift" :"shift-3",
        "start_time" : this.shift_3_start_hour.value+ ":" +  this.shift_3_start_time.value, 
        "end_time" : this.shift_3_end_hour.value + ":" + this.shift_3_end_time.value,
     },
    
  ]
     }
      else if(this.number_of_shifts.value == 4){
        data['sf_shift_hours'] = [{
          "shift" :"shift-1",
          "start_time" : this.shift_1_start_hour.value+ ":" +  this.shift_1_start_time.value, 
          "end_time" : this.shift_1_end_hour.value + ":" + this.shift_1_end_time.value},
        {
          "shift" :"shift-2",
          "start_time" : this.shift_2_start_hour.value+ ":" +  this.shift_2_start_time.value, 
          "end_time" : this.shift_2_end_hour.value + ":" + this.shift_2_end_time.value,
        },
        {
          "shift" :"shift-3",
          "start_time" : this.shift_3_start_hour.value+ ":" +  this.shift_3_start_time.value, 
          "end_time" : this.shift_3_end_hour.value + ":" + this.shift_3_end_time.value,
       },
      {
        "shift" :"shift-4",
        "start_time" : this.shift_4_start_hour.value+ ":" +  this.shift_4_start_time.value, 
        "end_time" : this.shift_4_end_hour.value + ":" + this.shift_4_end_time.value,
  }
]
    }
    data['updated_by'] = this.authService.currentUser['email'];
    this.workcenterService.putWorkCenterS(this.workcenter_id, data).subscribe(response => {
      this.ngOnInit();
      });
  }

    
  }


 // This method will delete the workcenter.
  deleteWorkcenter() {
    this.workcenterService.deleteWorkcenterS(this.workcenter_id).subscribe(response => {
      this.othersService.reloadCurrentRoute();
    });
  }


// tour guide View method 
workcenter_view(){
  if(this.authService.currentUser['role_id'] == 'WCA1001'||this.authService.currentUser['role_id'] == 'WCV1001'|| this.authService.currentUser['role_id'] == 'AV1001'|| this.authService.currentUser['role_id'] == 'PV1001'|| this.authService.currentUser['role_id'] == 2){
    this.workcenterInfo(this.work_centers[0])
  }
}

  // this method for searching the table
  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  Shifts_list = [
    { value: 1, viewValue: 1 },
    { value: 2, viewValue: 2 },
    { value: 3, viewValue: 3 },
    { value: 4, viewValue: 4 }
  ]

  // SHIFT Hours.
  shift_hours = [
    { value: '00', viewValue: '00' },
    { value: '01', viewValue: '01' },
    { value:'02', viewValue: '02' },
    { value: '03', viewValue: '03' },
    { value: '04', viewValue: '04' },
    { value: '05', viewValue: '05' },
    { value: '06', viewValue: '06' },
    { value: '07', viewValue: '07' },
    { value: '08', viewValue: '08' },
    { value: '09', viewValue: '09' },
    { value: '10', viewValue: '10' },
    { value: '11', viewValue: '11' },
    { value: '12', viewValue: '12' },
    { value: '13', viewValue: '13' },
    { value: '14', viewValue: '14' },
    { value: '15', viewValue: '15' },
    { value: '16', viewValue: '16' },
    { value: '17', viewValue: '17' },
    { value: '18', viewValue: '18' },
    { value: '19', viewValue: '19' },
    { value: '20', viewValue: '20' },
    { value: '21', viewValue: '21' },
    { value: '22', viewValue: '22' },
    { value: '23', viewValue: '23' }
  ];



  shift_1 : boolean = true;
  shift_2 : boolean;
  shift_3 : boolean;
  shift_4 : boolean;
  public selected_shift:any;

    // This method All will enable/disable the shift hours drop down.
  shift_Dis_Enb_1(){
    this.shift_1_start_hour.enable();
    this.shift_1_start_time.enable();
    this.shift_1_end_hour.enable();
    this.shift_1_end_time.enable();

    this.shift_2_start_hour.disable();
    this.shift_2_start_time.disable();
    this.shift_2_end_hour.disable();
    this.shift_2_end_time.disable();

    this.shift_3_start_hour.disable();
    this.shift_3_start_time.disable();
    this.shift_3_end_hour.disable();
    this.shift_3_end_time.disable();

    this.shift_4_start_hour.disable();
    this.shift_4_start_time.disable();
    this.shift_4_end_hour.disable();
    this.shift_4_end_time.disable();
  
  }
  shift_Dis_Enb_2(){
    this.shift_1_start_hour.enable();
    this.shift_1_start_time.enable();
    this.shift_1_end_hour.enable();
    this.shift_1_end_time.enable();

    this.shift_2_start_hour.enable();
    this.shift_2_start_time.enable();
    this.shift_2_end_hour.enable();
    this.shift_2_end_time.enable();

    this.shift_3_start_hour.disable();
    this.shift_3_start_time.disable();
    this.shift_3_end_hour.disable();
    this.shift_3_end_time.disable();

    this.shift_4_start_hour.disable();
    this.shift_4_start_time.disable();
    this.shift_4_end_hour.disable();
    this.shift_4_end_time.disable();
  
  }
  shift_Dis_Enb_3(){
    this.shift_1_start_hour.enable();
    this.shift_1_start_time.enable();
    this.shift_1_end_hour.enable();
    this.shift_1_end_time.enable();

    this.shift_2_start_hour.enable();
    this.shift_2_start_time.enable();
    this.shift_2_end_hour.enable();
    this.shift_2_end_time.enable();

    this.shift_3_start_hour.enable();
    this.shift_3_start_time.enable();
    this.shift_3_end_hour.enable();
    this.shift_3_end_time.enable();

    this.shift_4_start_hour.disable();
    this.shift_4_start_time.disable();
    this.shift_4_end_hour.disable();
    this.shift_4_end_time.disable();
  
  }
  shift_Dis_Enb_4(){
    this.shift_1_start_hour.enable();
    this.shift_1_start_time.enable();
    this.shift_1_end_hour.enable();
    this.shift_1_end_time.enable();

    this.shift_2_start_hour.enable();
    this.shift_2_start_time.enable();
    this.shift_2_end_hour.enable();
    this.shift_2_end_time.enable();

    this.shift_3_start_hour.enable();
    this.shift_3_start_time.enable();
    this.shift_3_end_hour.enable();
    this.shift_3_end_time.enable();

    this.shift_4_start_hour.enable();
    this.shift_4_start_time.enable();
    this.shift_4_end_hour.enable();
    this.shift_4_end_time.enable();
  
  }

  onChangeShifts(event) {
   this.selected_shift = event.value
   if(this.selected_shift == 1){
    this.shift_1 = true;
    this.shift_2 = false;
    this.shift_3 = false;
    this.shift_4 = false;
    this.shift_Dis_Enb_1();
    this.clear_Shift_2();
    this.clear_Shift_3();
    this.clear_Shift_4();
   }
   else if(this.selected_shift == 2){
    this.shift_1 = true;
    this.shift_2 = true;
    this.shift_3 = false;
    this.shift_4 = false;
    this.shift_Dis_Enb_2();
    this.clear_Shift_3();
    this.clear_Shift_4();
   }
  else if(this.selected_shift == 3){
    this.shift_1 = true;
    this.shift_2 = true;
    this.shift_3 = true;
    this.shift_4 = false;
    this.shift_Dis_Enb_3();
    this.clear_Shift_4();
   }
  else if(this.selected_shift == 4){
    this.shift_1 = true;
    this.shift_2 = true;
    this.shift_3 = true;
    this.shift_4 = true;
    this.shift_Dis_Enb_4();
  }
  }

  // these methods will capture the values on change of shift start and end times.
  public shift1_st_value:any;
  public sh_1_to_hr0:any;
  public sh_1_to_hr1:any;
  public sh_1_to_hr2:any;
  public sh_1_to_hr3:any;
  public sh_1_to_hr4:any;
  public sh_1_to_hr5:any;
  public sh_1_to_hr6:any;
  public sh_1_to_hr7:any;
  public sh_1_to_hr8:any;
  public sh_1_to_hr9:any;
  public sh_1_to_hr10:any;
  public sh_1_to_hr11:any;
  public sh_1_to_hr12:any;
  public sh_1_to_hr13:any;
  public sh_1_to_hr14:any;
  public sh_1_to_hr15:any;
  public sh_1_to_hr16:any;
  public sh_1_to_hr17:any;
  public sh_1_to_hr18:any;
  public sh_1_to_hr19:any;
  public sh_1_to_hr20:any;
  public sh_1_to_hr21:any;
  public sh_1_to_hr22:any;
  public sh_1_to_hr23:any;



  // changed
  onChange($event:MatButtonToggleChange) {
    this.weekDays=$event.value; 
  }
 
  time_zone_list: any =[
    {"label":"(GMT-12:00) International Date Line West","value":"Etc/GMT+12"},
    {"label":"(GMT-11:00) Midway Island, Samoa","value":"Pacific/Midway"},
    {"label":"(GMT-10:00) Hawaii","value":"Pacific/Honolulu"},
    {"label":"(GMT-09:00) Alaska","value":"US/Alaska"},
    {"label":"(GMT-08:00) Pacific Time (US & Canada)","value":"America/Los_Angeles"},
    {"label":"(GMT-08:00) Tijuana, Baja California","value":"America/Tijuana"},
    {"label":"(GMT-07:00) Arizona","value":"US/Arizona"},
    {"label":"(GMT-07:00) Chihuahua, La Paz, Mazatlan","value":"America/Chihuahua"},
    {"label":"(GMT-07:00) Mountain Time (US & Canada)","value":"US/Mountain"},
    {"label":"(GMT-06:00) Central America","value":"America/Managua"},
    {"label":"(GMT-06:00) Central Time (US & Canada)","value":"US/Central"},
    {"label":"(GMT-06:00) Guadalajara, Mexico City, Monterrey","value":"America/Mexico_City"},
    {"label":"(GMT-06:00) Saskatchewan","value":"Canada/Saskatchewan"},
    {"label":"(GMT-05:00) Bogota, Lima, Quito, Rio Branco","value":"America/Bogota"},
    {"label":"(GMT-05:00) Eastern Time (US & Canada)","value":"US/Eastern"},
    {"label":"(GMT-05:00) Indiana (East)","value":"US/East-Indiana"},
    {"label":"(GMT-04:00) Atlantic Time (Canada)","value":"Canada/Atlantic"},
    {"label":"(GMT-04:00) Caracas, La Paz","value":"America/Caracas"},
    {"label":"(GMT-04:00) Manaus","value":"America/Manaus"},
    {"label":"(GMT-04:00) Santiago","value":"America/Santiago"},
    {"label":"(GMT-03:30) Newfoundland","value":"Canada/Newfoundland"},
    {"label":"(GMT-03:00) Brasilia","value":"America/Sao_Paulo"},
    {"label":"(GMT-03:00) Buenos Aires, Georgetown","value":"America/Argentina/Buenos_Aires"},
    {"label":"(GMT-03:00) Greenland","value":"America/Godthab"},
    {"label":"(GMT-03:00) Montevideo","value":"America/Montevideo"},
    {"label":"(GMT-02:00) Mid-Atlantic","value":"America/Noronha"},
    {"label":"(GMT-01:00) Cape Verde Is.","value":"Atlantic/Cape_Verde"},
    {"label":"(GMT-01:00) Azores","value":"Atlantic/Azores"},
    {"label":"(GMT+00:00) Casablanca, Monrovia, Reykjavik","value":"Africa/Casablanca"},
    {"label":"(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London","value":"Etc/Greenwich"},
    {"label":"(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna","value":"Europe/Amsterdam"},
    {"label":"(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague","value":"Europe/Belgrade"},
    {"label":"(GMT+01:00) Brussels, Copenhagen, Madrid, Paris","value":"Europe/Brussels"},
    {"label":"(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb","value":"Europe/Sarajevo"},
    {"label":"(GMT+01:00) West Central Africa","value":"Africa/Lagos"},
    {"label":"(GMT+02:00) Amman","value":"Asia/Amman"},
    {"label":"(GMT+02:00) Athens, Bucharest, Istanbul","value":"Europe/Athens"},
    {"label":"(GMT+02:00) Beirut","value":"Asia/Beirut"},
    {"label":"(GMT+02:00) Cairo","value":"Africa/Cairo"},
    {"label":"(GMT+02:00) Harare, Pretoria","value":"Africa/Harare"},
    {"label":"(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius","value":"Europe/Helsinki"},
    {"label":"(GMT+02:00) Jerusalem","value":"Asia/Jerusalem"},
    {"label":"(GMT+02:00) Minsk","value":"Europe/Minsk"},
    {"label":"(GMT+02:00) Windhoek","value":"Africa/Windhoek"},
    {"label":"(GMT+03:00) Kuwait, Riyadh, Baghdad","value":"Asia/Kuwait"},
    {"label":"(GMT+03:00) Moscow, St. Petersburg, Volgograd","value":"Europe/Moscow"},
    {"label":"(GMT+03:00) Nairobi","value":"Africa/Nairobi"},
    {"label":"(GMT+03:00) Tbilisi","value":"Asia/Tbilisi"},
    {"label":"(GMT+03:30) Tehran","value":"Asia/Tehran"},
    {"label":"(GMT+04:00) Abu Dhabi, Muscat","value":"Asia/Muscat"},
    {"label":"(GMT+04:00) Baku","value":"Asia/Baku"},
    {"label":"(GMT+04:00) Yerevan","value":"Asia/Yerevan"},
    {"label":"(GMT+04:30) Kabul","value":"Asia/Kabul"},
    {"label":"(GMT+05:00) Yekaterinburg","value":"Asia/Yekaterinburg"},
    {"label":"(GMT+05:00) Islamabad, Karachi, Tashkent","value":"Asia/Karachi"},
    {"label":"(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi","value":"Asia/Calcutta"},
    {"label":"(GMT+05:30) Sri Jayawardenapura","value":"Asia/Calcutta"},
    {"label":"(GMT+05:45) Kathmandu","value":"Asia/Katmandu"},
    {"label":"(GMT+06:00) Almaty, Novosibirsk","value":"Asia/Almaty"},
    {"label":"(GMT+06:00) Astana, Dhaka","value":"Asia/Dhaka"},
    {"label":"(GMT+06:30) Yangon (Rangoon)","value":"Asia/Rangoon"},
    {"label":"(GMT+07:00) Bangkok, Hanoi, Jakarta","value":"Asia/Bangkok"},
    {"label":"(GMT+07:00) Krasnoyarsk","value":"Asia/Krasnoyarsk"},
    {"label":"(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi","value":"Asia/Hong_Kong"},
    {"label":"(GMT+08:00) Kuala Lumpur, Singapore","value":"Asia/Kuala_Lumpur"},
    {"label":"(GMT+08:00) Irkutsk, Ulaan Bataar","value":"Asia/Irkutsk"},
    {"label":"(GMT+08:00) Perth","value":"Australia/Perth"},
    {"label":"(GMT+08:00) Taipei","value":"Asia/Taipei"},
    {"label":"(GMT+09:00) Osaka, Sapporo, Tokyo","value":"Asia/Tokyo"},
    {"label":"(GMT+09:00) Seoul","value":"Asia/Seoul"},
    {"label":"(GMT+09:00) Yakutsk","value":"Asia/Yakutsk"},
    {"label":"(GMT+09:30) Adelaide","value":"Australia/Adelaide"},
    {"label":"(GMT+09:30) Darwin","value":"Australia/Darwin"},
    {"label":"(GMT+10:00) Brisbane","value":"Australia/Brisbane"},
    {"label":"(GMT+10:00) Canberra, Melbourne, Sydney","value":"Australia/Canberra"},
    {"label":"(GMT+10:00) Hobart","value":"Australia/Hobart"},
    {"label":"(GMT+10:00) Guam, Port Moresby","value":"Pacific/Guam"},
    {"label":"(GMT+10:00) Vladivostok","value":"Asia/Vladivostok"},
    {"label":"(GMT+11:00) Magadan, Solomon Is., New Caledonia","value":"Asia/Magadan"},
    {"label":"(GMT+12:00) Auckland, Wellington","value":"Pacific/Auckland"},
    {"label":"(GMT+12:00) Fiji, Kamchatka, Marshall Is.","value":"Pacific/Fiji"},
    {"label":"(GMT+13:00) Nuku'alofa","value":"Pacific/Tongatapu"}
]


  shift_min: any = [
    { value: "00", viewValue:'00'},
    { value: "01", viewValue:'01'},
    { value: "02", viewValue:'02'},
    { value: "03", viewValue:'03'},
    { value: "04", viewValue:'04'},
    { value: "05", viewValue:'05'},
    { value: "06", viewValue:'06'},
    { value: "07", viewValue:'07'},
    { value: "08", viewValue:'08'},
    { value: "09", viewValue:'09'},
    { value: "10", viewValue:'10'},

    { value: "11", viewValue:'11'},
    { value: "12", viewValue:'12'},
    { value: "13", viewValue:'13'},
    { value: "14", viewValue:'14'},
    { value: "15", viewValue:'15'},
    { value: "16", viewValue:'16'},
    { value: "17", viewValue:'17'},
    { value: "18", viewValue:'18'},
    { value: "19", viewValue:'19'},
    { value: "20", viewValue:'20'},

    { value: "21", viewValue:'21'},
    { value: "22", viewValue:'22'},
    { value: "23", viewValue:'23'},
    { value: "24", viewValue:'24'},
    { value: "25", viewValue:'25'},
    { value: "26", viewValue:'26'},
    { value: "27", viewValue:'27'},
    { value: "28", viewValue:'28'},
    { value: "29", viewValue:'29'},
    { value: "30", viewValue:'30'},

    { value: "31", viewValue:'31'},
    { value: "32", viewValue:'32'},
    { value: "33", viewValue:'33'},
    { value: "34", viewValue:'34'},
    { value: "35", viewValue:'35'},
    { value: "36", viewValue:'36'},
    { value: "37", viewValue:'37'},
    { value: "38", viewValue:'38'},
    { value: "39", viewValue:'39'},
    { value: "40", viewValue:'40'},

    { value: "41", viewValue:'41'},
    { value: "42", viewValue:'42'},
    { value: "43", viewValue:'43'},
    { value: "44", viewValue:'44'},
    { value: "45", viewValue:'45'},
    { value: "46", viewValue:'46'},
    { value: "47", viewValue:'47'},
    { value: "48", viewValue:'48'},
    { value: "49", viewValue:'49'},
    { value: "50", viewValue:'50'},

    { value: "51", viewValue:'51'},
    { value: "52", viewValue:'52'},
    { value: "53", viewValue:'53'},
    { value: "54", viewValue:'54'},
    { value: "55", viewValue:'55'},
    { value: "56", viewValue:'56'},
    { value: "57", viewValue:'57'},
    { value: "58", viewValue:'58'},
    { value: "59", viewValue:'59'},
  
   ]


  
}