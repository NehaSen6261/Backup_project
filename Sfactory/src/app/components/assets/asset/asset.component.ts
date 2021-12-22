import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, Validators } from '@angular/forms';
import { FileValidators } from "ngx-file-drag-drop";
import { NavbarService } from '../../navbar/_services/navbar.service';
import { AssetService } from '../_services/asset.service';
import { PlantService } from '../../plants/_services/plant.service';
import { WorkcenterService } from '../../workcenters/_services/workcenter.service';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { AuthService } from '../../login/_services/auth.service';
import { OthersService } from '../../others/_services/others.service';
import { DecimalPipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { SimulatorService } from '../../simulator/_services/simulator.service';
import { resolveSanitizationFn } from '@angular/compiler/src/render3/view/template';
import { MatButtonToggleChange } from '@angular/material/button-toggle';


export interface ImagePickerConf {
  width?: string;
  height?: string;
  borderRadius?: string;
  compressInitial?: boolean;
  language?: string;
}


@Component({
  selector: 'asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss'],
  providers: [DecimalPipe]
})
export class AssetComponent implements OnInit {

  assets: any = [];
  internalError: boolean = false;
  spinner: boolean = true;
  no_assets: boolean;
  popup_title: string;
  plants: any = [];
  plant_workcenters: any = [];
  no_plants: boolean;
  plants_internalError: boolean;
  workcenter_internalError: boolean;
  no_workcenter: boolean;
  movable_asset;
  obs: Observable<any>;
  filter = new FormControl('');
  asset_id: any;
  error_status= "Error";
  years_list: any = [];
  selectarylist: any = [];

  constructor(
    private navbarService: NavbarService,
    private assetService: AssetService,
    private changeDetectorRef: ChangeDetectorRef,
    private plantService: PlantService,
    private workcenterService: WorkcenterService,
    private snackbar: SnackbarComponent,    
    private othersService: OthersService,
    private cookieService: CookieService,
    public authService: AuthService,
    private simulatorService: SimulatorService,
 
  ) {
    this.navbarService.Title = "Assets";
    this.userRolefunction();
    this.othersService.setTitle(this.navbarService.Title);
 
    setInterval (() => {​​​​​​​​
      this.element;
        }​​​​​​​​, 100);
  }

  displayedColumns: string[] = ['sf_asset_id', 'sf_asset_code', 'sf_asset_name','sf_asset_serial_number', 'sf_asset_ideal_runrate', 'sf_total_available_time','sf_asset_model',
  'sf_work_centre_name'];
  dataSource = new MatTableDataSource(this.assets);
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

  ngOnInit(): void {
       // if the Asset state is  added the get method is updated by calling refresh observable
       this.simulatorService.getRefreshNeededS().subscribe(()=>{
        this.getAssets();
      })
    this.getAssets();
    this.getPlants();
    this.years();
    this.getassettogglevalue();
  }


// years dropdown
years() {
  const current_year = new Date().getUTCFullYear();
  let year = Array(current_year - (current_year - 2)).fill('').map((v, idx) => current_year - idx) as Array<number>;
  this.years_list = year;
  for (var i = current_year - 30; i <= current_year; i++) {
    this.selectarylist.push(i)
  }
}

//table and tile view local storage in asset page
assettogglevalue:any;
assettoggle(event:MatButtonToggleChange) {
  localStorage.setItem("assettogglevalue",event.value)
}
getassettogglevalue(){
  this.assettogglevalue = localStorage.getItem("assettogglevalue");
  if(this.assettogglevalue == undefined){
    this.assettogglevalue='Tableview';
  }else{
    this.assettogglevalue = localStorage.getItem("assettogglevalue");
  }
}


  // This function will display  all assets.
  getAssets() {
    this.assetService.getAssetsS().subscribe(response => {   
      this.spinner = false;
      if (response['Unsuccessful']) {
        this.internalError = true;
      } else {
        this.assets = response;
        if (this.assets.length == 0) {
          this.no_assets = true;
          this.cookieService.set('assett_tguide', 'active', 300);
        } else {
          this.cookieService.set('assett_tguide', 'inactive', 300);
          this.no_assets = false;
          this.dataSource.data = this.assets;
        }
      }
    }, error => {
      this.spinner = false;
      this.internalError = true;
    })
  }

  trackById(index, plant) {
    return plant.sf_plant_id;
  }
 public  nonWhitespaceRegExp: RegExp = new RegExp("\\S");


  // ---------------------------------------------------------------
  // Common methods for POST and PUT operations
  // ----------------------------------------------------------------
  plant = new FormControl('', [Validators.required],);
  work_center = new FormControl('', [Validators.required]);
  brand_name = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  asset_model = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  asset_code = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  serial_number = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
  manu_year = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]);
  utility_percent = new FormControl('', [Validators.minLength(2), Validators.maxLength(3)]);
  life_time = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]); 
  availability_time = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(2),Validators.max(24)]);
  maintenance_frequency = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]);
  fileControl = new FormControl([], [FileValidators.required, FileValidators.maxFileCount(5)]);
  checkboxfromcontrol =  new FormControl('', [Validators.required]);
  asset_name  =  new FormControl('', [Validators.required,Validators.pattern(this.nonWhitespaceRegExp)]);
  ideal_run_rate = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]);

  element:HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
 public addbuttonassest = true
  userRolefunction() {
    if (this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == 'PV1001' || this.authService.currentUser['role_id'] == 'WCV1001'  || this.authService.currentUser['role_id'] == 'ASV1001') {
  
      this.plant.disable();
      this.work_center.disable();
      this.asset_name.disable();
      this.brand_name.disable();
      this.asset_model.disable();
      this.asset_code.disable();
      this.serial_number.disable();
      this.manu_year.disable();
      this.utility_percent.disable();
      this.life_time.disable();
      this.availability_time.disable();
      this.maintenance_frequency.disable();
      this.fileControl.disable();
       this.checkboxfromcontrol.disable();
       this.ideal_run_rate.disable();
      this.addbuttonassest = false;
      
    }
    else if (this.authService.currentUser['role_id'] == 1 ||  this.authService.currentUser['role_id'] == 'MV1001' || this.authService.currentUser['role_id'] == 'PA1001' || this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'ASA1001') {
      this.addbuttonassest = true;
      this.plant.enable();
      this.checkboxfromcontrol.enable();
      this.work_center.enable();
      this.asset_name.enable();
      this.brand_name.enable();
      this.asset_model.enable();
      this.asset_code.enable();
      this.serial_number.enable();
      this.manu_year.enable();
      this.utility_percent.enable();
      this.life_time.enable();
      this.availability_time.enable();
      this.maintenance_frequency.enable();
      this.fileControl.enable();
      this.ideal_run_rate.enable();
    }
  }


  // error messages.
  PlantMessages() {
    if (this.plant.hasError('required')) {
      return 'You must choose a plant !!';
    }
  }
  WCMessages() {
    if (this.work_center.hasError('required')) {
      return 'You must choose a workcenter !!';
    }
  }
  BrandNameErrorMessages() {
    if (this.brand_name.hasError('required')) {
      return 'You must enter brand name !!';
    }
    if (this.brand_name.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.brand_name.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
  }

  AssetCodeErrorMessages() {
    if (this.asset_model.hasError('required')) {
      return 'You must enter asset code !!';
    }
    if (this.asset_model.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.asset_model.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
  }
  AssetModelErrorMessages() {
    if (this.asset_model.hasError('required')) {
      return 'You must enter asset model !!';
    }
    if (this.asset_model.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.asset_model.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
  }
  AssetNameErrorMessages() {
    if (this.asset_name.hasError('required')) {
      return 'You must enter asset name !!';
    }
    if (this.asset_name.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.asset_name.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
    if(this.asset_name.hasError('pattern')){
      return 'Can not take spaces !!';
    }
  }

  ASCodeErrorMessages() {
    if (this.asset_code.hasError('required')) {
      return 'You must enter asset code';
    }
    if (this.asset_code.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.asset_code.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
    if(this.asset_code.invalid){
      return 'Asset Code Already Exists !!'
    }
  }

  SerialNumErrorMessages() {
    if (this.serial_number.hasError('required')) {
      return 'You must enter serial number !!';
    }
    if (this.serial_number.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.serial_number.hasError('maxlength')) {
      return 'Maximum 50 characters allowed !!';
    }
  }
  ManuYearErrorMessages() {
    if (this.manu_year.hasError('required')) {
      return 'You must choose year of manufactured !!';
    }
    if (this.manu_year.hasError('minlength')) {
      return 'Minimum 4 characters required !';
    }
    if (this.manu_year.hasError('maxlength')) {
      return 'Maximum 4 characters allowed !';
    }
  }
  UtilityErrorMessages() {
    if (this.utility_percent.hasError('required')) {
      return 'You must enter utilization percentage !!';
    }
    if (this.utility_percent.hasError('minlength')) {
      return 'Minimum 1 characters required !';
    }
    if (this.utility_percent.hasError('maxlength')) {
      return 'Maximum 3 characters allowed !';
    }
  }

  LifetimeErrorMessages() {
    if (this.life_time.hasError('required')) {
      return 'You must enter life time !!';
    }
    if (this.life_time.hasError('minlength')) {
      return 'Minimum 1 characters required !!';
    }
    if (this.life_time.hasError('maxlength')) {
      return 'Maximum 15 characters allowed !!';
    }
  }

  AvailabilityTimeErrorMessages() {
    if (this.availability_time.hasError('required')) {
      return 'You must enter availability !!';
    }
    if (this.availability_time.hasError('minlength')) {
      return 'Minimum 1 characters required !!';
    }
    if (this.availability_time.hasError('maxlength')) {
      return 'Maximum 15 characters allowed !!';
    }
   
    if (this.availability_time.hasError('max')) {
      return 'Maximum 24 Hour allowed !!';
    }
  }

  MFrequencyErrorMessages() {
    if (this.maintenance_frequency.hasError('required')) {
      return 'You must enter maintenance frequency !!';
    }
    if (this.maintenance_frequency.hasError('minlength')) {
      return 'Minimum 1 characters required !!';
    }
    if (this.maintenance_frequency.hasError('maxlength')) {
      return 'Maximum 10 characters allowed !!';
    }
  }

  Ideal_run_rateErrorMessages() {
    if (this.ideal_run_rate.hasError('required')) {
      return 'You must enter ideal run rate !!';
    }
    if (this.ideal_run_rate.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.ideal_run_rate.hasError('maxlength')) {
      return 'Maximum 50 characters allowed !!';
    }
  }



 // Check if the Asset code is already existing in the DB.
 validateAssetCode(data){
  if(this.assets.find((x) => x.sf_asset_code === data)) { 
    this.asset_code.setErrors({ 'incorrect': true});
  } else {
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

  // This method will display the all the plant work centers.
  getplantWorkcenters(plant_id: any) {
    this.workcenterService.getPlantWorkcentersListS(plant_id).subscribe(response => {
      if (response['Unsucessfull']) {
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


  image_config: ImagePickerConf = {
    borderRadius: "5px",
    language: "en",
    width: "220px",
    height: "120px",
  };



  // ---------------------------------------------------------------
  // POST method implementation.
  // ----------------------------------------------------------------
  // clear from data.
  cleardata() {
    this.plant.reset();
    this.work_center.reset();
    this.brand_name.reset();
    this.asset_model.reset();
    this.asset_code.reset();
    this.serial_number.reset();
    this.manu_year.reset();
    this.utility_percent.reset();
    this.life_time.reset();
    this.availability_time.reset();
    this.maintenance_frequency.reset();
    this.fileControl.reset();
    this.asset_name.reset();
    this.checkboxfromcontrol.reset();
    this.ideal_run_rate.reset();
    this.plant.enable();
    this.work_center.enable();
     this.plant_workcenters.length=0;
    }


  // This method will CREATE an Asset.
  public disabled_enable_button : boolean;
  saveAsset() {
    if (this.plant.hasError('required') || this.work_center.hasError('required')|| this.brand_name.hasError('required') ||
      this.asset_model.hasError('required')|| this.asset_code.hasError('required') || this.serial_number.hasError('required')||
      this.manu_year.hasError('required')|| this.ideal_run_rate.hasError('required')||this.availability_time.hasError('required') ||
      this.maintenance_frequency.hasError('required')) {
      this.snackbar.top_snackbar("Enter all required Fields !!",this.error_status)
    }    
    else if( this.availability_time.hasError('max') ){
      this.snackbar.top_snackbar("Maximum 24 Hour's allow!!",this.error_status)
    }
    else {
      let data = {}
      if (this.movable_asset == undefined) {
        this.movable_asset = false;
      }
      data['sf_asset_name']=this.asset_name.value
      data['fw_tenant_id'] = this.authService.currentUser['tenant_id'];
      data['sf_plant_id'] = this.plant.value;
      data['sf_work_centre_id'] = this.work_center.value;
      data['sf_asset_manu_year'] = this.manu_year.value;
      data['sf_asset_serial_number'] = this.serial_number.value;
      data['sf_asset_util_percent'] = Number(this.utility_percent.value);
      data['sf_asset_brand'] = this.brand_name.value;
      data['sf_asset_model'] = this.asset_model.value;
      data['sf_asset_code'] = this.asset_code.value;
      data['sf_is_movable_asset'] = this.movable_asset;
      data['sf_asset_image_url'] = "";
      data['sf_life_time'] = this.life_time.value;
      data['sf_total_available_time'] = this.availability_time.value;
      data['sf_maintenance_frequency'] = this.maintenance_frequency.value;
      data['sf_upload_spec'] = "";
      data['sf_asset_ideal_runrate']=this.ideal_run_rate.value;
      data['sf_asset_status']="Stop";
      data['created_by'] = this.authService.currentUser['email'];
      this.disabled_enable_button = true;
      this.assetService.postAssetS(data).subscribe(response => {
        if (this.assetService.response_status == "Unsuccessful" ) { 
          this.disabled_enable_button = false;   
        }
        else if (this.assetService.response_status == "Successful" ) { 
          this.disabled_enable_button = false;   
          this.ngOnInit();
          this.cleardata();
        }
      })
    }
  }

  // ---------------------------------------------------------------
  // PUT method implementation.
  // ----------------------------------------------------------------
// tour guide View method 
  asset_viewer(){    
    if(this.authService.currentUser['role_id'] == 'ASV1001' || this.authService.currentUser['role_id'] == 'WCV1001'|| this.authService.currentUser['role_id'] == 'PV1001'|| this.authService.currentUser['role_id'] == 2){
      this.assetInfo(this.assets[0])
    }
  }
  // This method will display the asset info.
  asset_state:string;
  asste_status:boolean;
  assetInfo(asset: any) {
    this.asset_id = asset['sf_asset_id'];
    this.plant.setValue(asset['sf_plant_id']);
    this.getplantWorkcenters(asset['sf_plant_id']);
    this.work_center.setValue(asset['sf_work_centre_id']);
    this.brand_name.setValue(asset['sf_asset_brand']);
    this.asset_model.setValue(asset['sf_asset_model']);
    this.asset_code.setValue(asset['sf_asset_code']);
    this.serial_number.setValue(asset['sf_asset_serial_number']);
    this.manu_year.setValue(Number(asset['sf_asset_manu_year']));
    this.utility_percent.setValue(asset['sf_asset_util_percent']);
    this.life_time.setValue(asset['sf_life_time']);
    this.availability_time.setValue(asset['sf_total_available_time']);
    this.maintenance_frequency.setValue(asset['sf_maintenance_frequency']);
    this.asset_name.setValue(asset['sf_asset_name']);
    this.ideal_run_rate.setValue(asset['sf_asset_ideal_runrate']);
    this.movable_asset = asset['sf_is_movable_asset'];
 
    if(this.popup_title == 'Edit Asset'){
    if (this.movable_asset == false){
      this.plant.disable()
      this.work_center.disable()
     
    }
    if (this.movable_asset == true){
      this.plant.enable()
      this.work_center.enable()
     
    }

    if(asset['sf_asset_status'] == null){
      this.asset_state = "NA";
      this.asste_status = true;
    }else if(asset['sf_asset_status'] == 'Stop'){
      this.asset_state = "Stopped";
      this.asste_status = false;
    }
    else if(asset['sf_asset_status'] == 'Fault'){
      this.asset_state = "Fault";
      this.asste_status = true;
    }
    else if(asset['sf_asset_status'] == 'Break'){
      this.asset_state = "Break";
      this.asste_status = true;
    }
    else if(asset['sf_asset_status'] == 'Start'){
      this.asset_state = "Running";
      this.asste_status = true;
    }
    else if(asset['sf_asset_status'] == 'Resume'){
      this.asset_state = "Running";
      this.asste_status = true;
    }
    else if(asset['sf_asset_status'] == 'Running'){
      this.asset_state = "Running";
      this.asste_status = true;
    }
    else{
      this.asset_state = "Stopped";
      this.asste_status = true;
    }
  }
  
  }

  check_en(event){
   if(this.popup_title == 'Edit Asset'){
    if (event.checked == true){
      this.plant.enable();
      this.work_center.enable();
    }
   else if (event.checked== false){
    this.plant.disable();
    this.work_center.disable();
     
    }
  }
  }

  // This method will UPDATE the asset.
  updateAsset() {
    if (this.plant.hasError('required') || this.work_center.hasError('required')|| this.brand_name.hasError('required') ||
    this.asset_model.hasError('required')|| this.asset_code.hasError('required') || this.serial_number.hasError('required')||
    this.manu_year.hasError('required')|| this.ideal_run_rate.hasError('required')||this.availability_time.hasError('required') ||
    this.maintenance_frequency.hasError('required')) {
    this.snackbar.top_snackbar("Enter all required Fields !!",this.error_status)
  }  
        
    else if( this.availability_time.hasError('max') ){
      this.snackbar.top_snackbar("Maximum 24 Hour's allow!!",this.error_status)
    }
    else {
      let data = {}
      if (this.movable_asset == undefined) {
        this.movable_asset = false;
      }
      data['sf_asset_name']=this.asset_name.value
      data['sf_plant_id'] = this.plant.value;
      data['sf_work_centre_id'] = this.work_center.value;
      data['sf_asset_manu_year'] = this.manu_year.value;
      data['sf_asset_serial_number'] = this.serial_number.value;
      data['sf_asset_util_percent'] = this.utility_percent.value;
      data['sf_asset_brand'] = this.brand_name.value;
      data['sf_asset_model'] = this.asset_model.value;
      data['sf_asset_code'] = this.asset_code.value;
      data['sf_is_movable_asset'] = this.movable_asset;
      data['sf_asset_image_url'] = "";
      data['sf_life_time'] = this.life_time.value;
      data['sf_total_available_time'] = this.availability_time.value;
      data['sf_maintenance_frequency'] = this.maintenance_frequency.value;
      data['sf_upload_spec'] = "";
      data['sf_asset_ideal_runrate']=this.ideal_run_rate.value;
      data['updated_by'] = this.authService.currentUser['email'];
   
      this.assetService.putAssetS(this.asset_id, data).subscribe(response => {
        this.ngOnInit();
      })
    }
  }


  // This method will DELETE the asset by asset id.
  deleteAsset() {
    this.assetService.deleteAssetS(this.asset_id).subscribe(response => {
      this.othersService.reloadCurrentRoute();
    })
  }

  // this method for searching the table
  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // this method will redirect to asset analysis.
  redirectAssetAnalysis(data:any){
    // localStorage.setItem("selected_asset", data['sf_asset_id']);
    // this.router.navigate(['/asset/analysis']);
  }

  // This function will reset the work center.
  ifchange(data){
    this.work_center.reset()
  }


  // this function will simulate the data for Asset only for start and stop.
  // post method
  simulate(event_: boolean, asset_info:any) {     
    let data = {};
    let payloaddetails = {};    
    let state:string;
    if(event_['checked'] == true){
      state = "Start";
      this.asset_state = "Running";
    }else{      
      state = "Stop";
      this.asset_state = "Stopped";
    }
     payloaddetails = { '$asset_state': state, 'sf_asset_id': asset_info['sf_asset_id'] };
      data['fw_tenant_id'] = this.authService.currentUser['tenant_id'];
      data['sf_plant_id'] = asset_info['sf_plant_id'];
      data['sf_work_centre_id'] = asset_info['sf_work_centre_id'];
      data['sf_asset_id'] = asset_info['sf_asset_id'];
      data['sf_asset_payload'] = payloaddetails;
      data['created_by'] = this.authService.currentUser['email'];
      data['role_id'] = this.authService.currentUser['role_id'];
      this.simulatorService.Sendpayload(data, "asset").subscribe((response) => {
      this.ngOnInit();
       });
       
       
  }

}
