import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { Observable } from 'rxjs';
import { DatePipe, DecimalPipe, Location, SlicePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatOption, MatOptionSelectionChange } from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';
import { ProjectService } from '../_services/project.service';
import { AuthService } from '../../login/_services/auth.service';
import { AssetService } from '../../assets/_services/asset.service';
import { PlantService } from '../../plants/_services/plant.service';
import { NavbarService } from '../../navbar/_services/navbar.service';
import { OthersService } from './../../others/_services/others.service';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { WorkorderService } from '../../workorders/_services/workorder.service';
import { WorkcenterService } from '../../workcenters/_services/workcenter.service';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { SimulatorService } from '../../simulator/_services/simulator.service';
import { projects } from 'src/environments/urls';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { P } from '@angular/cdk/keycodes';
declare var $: any;
@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  providers: [DecimalPipe]
})
export class ProjectComponent implements OnInit {
  popup_title: string;
  plants_internalError: boolean;
  plants: any = [];
  no_plants: boolean;
  job_wrk_internalError:boolean;
  job_workers:any=[];
  no_jobWorkers: boolean;
  workcenter_internalError: boolean;
  no_workcenter: boolean;
  plant_workcenters: any = [];
  asset_internalError: boolean;
  no_asset: boolean;
  workcenter_asset: any = [];
  is_disabled :boolean = false;
  inactiveActiveAssetInternalError: boolean;
  noInactiveActiveAsset: boolean;
  inactiveActiveAsset: any = [];
  allwrkcntr_Selected = false;
  allAssets_Selected = false;
  obs: Observable<any>;
  spinner: boolean = true;
  internalError: boolean = false;
  displaydata: boolean;
  show_rework: boolean = true;
  public projects: any = [];
  public img_tour_ends: string;
  element: HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
  partcode: any =[];
  no_partcode :boolean;
  partcode_internalerror : boolean = false;
  error_status= "Error";
  todayDate:Date = new Date();


  selected_workcenter: any;
  public  status_progress;

  workordernameList: any = []

  minDate = new Date();
  // @ViewChild('select') select: MatSelect;
  filter = new FormControl('');

  displayedColumns: string[] = ['sf_project_code', 'sf_project_start_date', 'sf_project_quantity', 'total_scrap_produced', 'sf_project_status', 'job_progress', 'action'];
  dataSource = new MatTableDataSource(this.projects);
  private paginator: MatPaginator;
  private sort: any;
  public status_dropdwon: boolean
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


  excel = [];
  constructor(
    public router: Router,
    private navbarService: NavbarService,
    private plantService: PlantService,
    private workcenterService: WorkcenterService,
    private assetService: AssetService,
    private projectService: ProjectService,
    private changeDetectorRef: ChangeDetectorRef,
    private snackbar: SnackbarComponent,
    private WorkorderService: WorkorderService,
    private othersService: OthersService,
    private cookieService: CookieService,
    private routelocationInfo: Location,
    public datepipe: DatePipe,
    private simulatorService: SimulatorService,  
    public authService: AuthService
  ) {
    
    if(this.authService.currentUser['role_id'] == 'JB1001'){
      this.navbarService.Title = "My Jobs";
    }else{
      this.navbarService.Title = "Jobs";
    }
    this.img_tour_ends = this.navbarService.images_domain + "tourend.png";
    setInterval(() => {
      this.element;
    }, 100);
    this.othersService.setTitle(this.navbarService.Title);
  }

  
  selected_view:any;
   toggle_tile(event:MatButtonToggleChange){
    localStorage.setItem("selected_view",event.value)
  }
  toggletileview(){
    this.selected_view = localStorage.getItem("selected_view");
    if(this.selected_view == undefined){
      this.selected_view = 'tableview'
    }else{
      this.selected_view = localStorage.getItem("selected_view");
    }
  }
  ngOnInit(): void {
    this.simulatorService.getRefreshNeededS().subscribe(()=>{
      this.getprojects();
    })
    this.getprojects();
    this.getPlants();
    this.tenant_and_subtenant();
    this.workorderNameList();
    this.getPartCode();
    // this.getJobworkers();
    this.toggletileview();
    }

  // This method will take to the previous route.
  backloc(){
    this.routelocationInfo.back();
  }

  alldev_Selected = false;
  @ViewChild('select') select_jbop: MatSelect;
// select all functionally related functions starts here.
toggleAllSelection() {
  if (this.alldev_Selected) {
    this.select_jbop.options.forEach((item: MatOption) => item.select());

  } else {
    this.select_jbop.options.forEach((item: MatOption) => item.deselect());
  }

}

optionClick() {
  let newStatus = true;
  this.select_jbop.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.alldev_Selected = newStatus;
}

  // ---------------------------------------------------------------
  // Common methods for POST and PUT operations
  // ----------------------------------------------------------------
  project_code = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  project_quantity = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(40)]);
  start_date = new FormControl('', [Validators.required]);
  end_date = new FormControl('', [Validators.required]);
  // no_of_shifts = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(2)]);
  project_status = new FormControl('notstarted', [Validators.required]);
  plant = new FormControl('', [Validators.required]);
  work_center = new FormControl('', [Validators.required]);
  asstes = new FormControl('', [Validators.required]);
  wrkOrderName = new FormControl('', [Validators.required]);
  rework = new FormControl('');
  part_code = new FormControl('', [Validators.required]);
  jb_worker = new FormControl('', [Validators.required]);
  jb_type = new FormControl('', [Validators.required]);
  startDate = new Date(2020, 0, 1);
  noassignee = new FormControl('');
  public operatorName;
  project_id: any;


  // error messages
  PlantErrorMessages() {
    if (this.plant.hasError('required')) {
      return 'You must choose a plant !!';
    }
  }
  WorkcentersErrorMessages() {
    if (this.work_center.hasError('required')) {
      return 'You must choose a work center !!';
    }
  }
  AsstesErrorMessages() {
    if (this.asstes.hasError('required')) {
      return 'You must choose a asset !!';
    }
  }
  StartdateErrorMessages() {
    if (this.start_date.hasError('required')) {
      return 'You must choose a start date !!';
    }
  }
  EnddateErrorMessages() {
    if (this.end_date.hasError('required')) {
      return 'You must choose a end date !!';
    }
  }
  ProjectCodeErrorMessages() {
    if (this.project_code.hasError('required')) {
      return 'You must enter a job code !!';
    }
    if (this.project_code.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.project_code.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
    if(this.project_code.invalid){
      return 'Job Code Already Exists !!'
    }
  }
  ProjectQtyErrorMessages() {
    if (this.project_quantity.hasError('required')) {
      return 'You must enter a quantity !!';
    }
    if (this.project_quantity.hasError('minlength')) {
      return 'Minimum 1 characters required !!';
    }
    if (this.project_quantity.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
    if(this.project_quantity.invalid){
      return 'Quantity should not exceed work order quantity !!'
    }

  }
  jb_typeErrorMessages() {
    if (this.jb_type.hasError('required')) {
      return 'You must choose a Job Type !!';
    }
  }
  WorkOrderErrorMessages() {
    if (this.wrkOrderName.hasError('required')) {
      return 'You must choose a workorder !!';
    }
  }

  partCodeError() {
    if (this.part_code.touched) {
      return 'Please choose Part Code !!'
    }
  }
  jb_workerError(){
    if (this.jb_worker.invalid) {
      return 'Please choose Job operator !!'
    }
  }
  

  // This function will display  qty should not exceed work order quantity.
  public work_order_select_qty
  public part_child_parents
 
  quantityCheck(data:any) {
   let quantity = data.target.value
 
    if (this.part_child_parents == false) {
       if (quantity > this.work_order_select_qty) {
        this.project_quantity.setErrors({ 'incorrect': true});
       }
      }
    else if (this.part_child_parents == true){
      return false
    }
  }


// Check if the project code is already existing in the DB.
  validateJobCode(data){
  if(this.projects.find((x) => x.sf_project_code === data)) { 
    this.project_code.setErrors({ 'incorrect': true});
  } else {
  }
 }

// This variable will hold project status values.
  project_status_list: any = [
    { value: 'notstarted', viewValue: 'Yet to start' },
    { value: 'inprogress', viewValue: 'In Progress' },
    { value: 'completed', viewValue: 'Completed' },
    { value: 'halt', viewValue: 'Halt' },
    { value: 'expired', viewValue: 'Expired' },
  ]

  // Job Type list
  job_type_list: any = [
    { value: 'Preparation', viewValue: 'Preparation' },
    { value: 'Production', viewValue: 'Production' },
    { value: 'Assembling', viewValue: 'Assembling' },
    { value: 'Processing', viewValue: 'Processing' },
    { value: 'Quality Check', viewValue: 'Quality Check' },
    { value: 'Packaging', viewValue: 'Packaging' },
  ]

  // This function is display all part code. 
  getPartCode(){
  this.WorkorderService.getWorkOrderpartcode().subscribe(response => {
    if (response['Unsuccessful']) {
      this.internalError = true;
    }
    else {
      this.partcode = response;
      if (this.partcode.length == 0) {
        this.no_partcode = true;
      } 
      else {
      this.no_partcode = false;
    }
    }
  }, error => {
    this.internalError = true;
  })
      
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

  // This method will display the all the plant work centers.
  getWCAssets(workcenter_id: any) {
    this.assetService.getWorkcenterAssetsListS(workcenter_id).subscribe(response => {
      if (response['Unsuccessful']) {
        this.asset_internalError = true;
      } else {
        this.workcenter_asset = response;
        if (this.workcenter_asset.length == 0) {
          this.no_asset = true;
        } else {
          this.no_asset = false;
        }
      }
    }, error => {
      this.asset_internalError = true;
    })
  }

  // this method will list all the workorder name

  // clear from data.
  cleardata() {
    this.plant.reset();
    this.work_center.reset();
    this.asstes.reset();
    this.jb_type.reset();
    this.project_quantity.reset();
    this.start_date.reset();
    this.end_date.reset();
    this.project_status.reset();
    this.project_code.reset();
    this.wrkOrderName.reset();
    this.enableForm();
    this.rework.reset();
    this.part_code.reset();
    this.status_dropdwon = false;
    this.plant_workcenters.length=0;
    this.workcenter_asset.length=0;
    this.work_order_list= true;
    this.work_order_project = false;
  }

 

  // -----------------------------------------------------------------
  // POST method implementation.
  // -----------------------------------------------------------------
  public disabled_enable_button : boolean;
  saveproject() {
    if (this.plant.status == "INVALID" || this.work_center.status == "INVALID" || this.asstes.status == "INVALID" || this.start_date.status == "INVALID" || this.wrkOrderName.status == "INVALID"
     || this.end_date.status == "INVALID" || this.project_code.status == "INVALID" || this.jb_type.status == "INVALID"){
      this.snackbar.top_snackbar("Enter all required Fields !!",this.error_status);
    }
    else{
      if (this.project_quantity.value > this.work_order_select_qty && this.part_child_parents == false) {
        return this.snackbar.top_snackbar("Quantity should not exceed work order quantity!!",this.error_status);
      } 
      else {
        let data = {}
        data['fw_tenant_id'] = this.authService.currentUser['tenant_id'];
        data['sf_plant_id'] = this.plant.value;
        data['sf_work_centre_id'] = [this.work_center.value];
        data['sf_asset_id'] = [this.asstes.value];
        // data['sf_no_of_shift'] = this.no_of_shifts.value;
        data['sf_project_quantity'] = this.project_quantity.value;
        data['sf_project_start_date'] = this.datepipe.transform(this.start_date.value, 'yyyy-MM-dd');
        data['sf_project_end_date'] = this.datepipe.transform(this.end_date.value, 'yyyy-MM-dd');
        data['sf_project_status'] = "notstarted";
        data['sf_project_code'] = this.project_code.value;
        data['sf_workorder_id'] = this.wrkOrderName.value;
        if(this.rework.value == ""){
          data['is_rework'] = null;
        }else{
          data['is_rework'] = this.rework.value;
        }
        data['sf_part_id'] = this.part_code.value;
        data['created_by'] = this.authService.currentUser['email'];
        data['sf_project_type'] = this.jb_type.value;
        this.disabled_enable_button = true;  
        this.projectService.postProjectS(data).subscribe(response => {
          if (this.projectService.response_status == "Unsuccessful" ) { 
            this.disabled_enable_button = false;   
          }
          else if (this.projectService.response_status == "Successful" ) { 
            this.disabled_enable_button = false;   
            this.ngOnInit();
            this.cleardata();
          }
        });
      }
    }

   
    
  }

  // -----------------------------------------------------------------
  // GET method implementation.
  // -----------------------------------------------------------------
 
  getprojects() {
    this.projectService.getProjectinfoS().subscribe(response => {
      this.spinner = false;
      if ( response == null || response == false) {
        this.spinner = false;
        this.displaydata = true;
      } else {
        this.projects = response;
       
        this.projects['factory_user_id']
        this.displaydata = false;
        if (this.projects.length == 0) {
          this.cookieService.set('job_tguide', 'active', 300);
          this.displaydata = true;
        } else {
          this.cookieService.set('job_tguide', 'inactive', 300);
          this.dataSource.data = this.projects;
        }
      }
    }, error => {
      this.spinner = false;
      this.internalError = true;

    })
  }

  // This method will list all the job workers associated with that tenant.
  getJobworkers(data){
    this.projectService.getJobOperatorListS(data).subscribe(response => {
      
      if (response['Unsuccessful']) {
        this.job_wrk_internalError = true;
      } else {
        this.job_workers = response;
        if (this.job_workers.length == 0) {
          this.no_jobWorkers = true;
        } else {
          this.no_jobWorkers = false;
        }
      }
    }, error => {
      this.job_wrk_internalError = true;
    })
  }
  // get inactive and activate asset list 
  getInactiveActiveAsset(){
    this.assetService.getInactiveActiveAssetsList().subscribe(response => {
      if (response['Unsuccessful']) {
        this.inactiveActiveAssetInternalError = true;
      } else {
        this.inactiveActiveAsset = response;
        if (this.inactiveActiveAsset.length == 0) {
          this.noInactiveActiveAsset = true;
        } else {
          this.noInactiveActiveAsset = false;
        }
      }
    }, error => {
      this.inactiveActiveAssetInternalError = true;
    })
  }
  
  
  total_qlty_produced_count:number;
  project_quantity_count:number;
  total_qty_produced_count:number;
  jb_progress:number;
  total_quantity:number;
 public work_order_list : boolean;
 public work_order_project: boolean;
  // This method will get the project info.
  projectInfo(project: any) {
    if(project['factory_user_id'] == null){
     this.jb_worker.setValue(project['factory_user_id'])
    }else if(project['factory_user_id'] != null){
      let job_selectedList = project['factory_user_id'].map(Number);
      this.jb_worker.setValue(job_selectedList)
      this.jb_worker.enable();
      this.noassignee.setValue(false)
    }
    let noassign= project['factory_user_id'] 
    if(noassign == null){
      noassign = true
      this.jb_worker.disable();
      this.noassignee.setValue(noassign)
    }
    this.total_qlty_produced_count = project['total_qlty_produced'];
    this.project_quantity_count = project['sf_project_quantity'];
    this.total_qty_produced_count = project['total_qty_produced']
    this.project_id = project['sf_project_id'];
    this.getplantWorkcenters(project['sf_plant_id']);
    this.getWCAssets(project['sf_work_centre_id']);
    this.plant.setValue(project['sf_plant_id']);
    this.rework.setValue(project['is_rework']);
    this.project_status.setValue(project['sf_project_status']);
   if(project['sf_project_status']=="notstarted" || project['sf_project_status']=="inprogress"){
    this.work_order_list= true;
    this.work_order_project = false;
   }
   if(project['sf_project_status']=="completed" || project['sf_project_status']=="halt"|| project['sf_project_status']=="expired"){
    this.work_order_list= false;
    this.work_order_project = true;
   }

  

    this.start_date.setValue(project['sf_project_start_date']);
    this.end_date.setValue(project['sf_project_end_date']);
    this.project_quantity.setValue(project['sf_project_quantity']);
    this.project_code.setValue(project['sf_project_code']);
    this.jb_type.setValue(project['project_type']);
    this.wrkOrderName.setValue(Number(project['sf_workorder_id']));
    this.work_center.setValue(Number(project['sf_work_centre_id']));
    this.asstes.setValue(Number(project['sf_asset_id']));
    this.selected_workcenter = Number(project['sf_work_centre_id']);
    this.part_code.setValue(project['part_id']);
    this.jb_progress = project['job_progress'];
    this.total_quantity=project['total_qty_produced'];
    this.status_progress = project['sf_project_status'];  
    this.status_dropdwon = true;
    this.ngOnInit();
  
  }


  // this function will display all the job operators names list
  jobOperatorName(data){
    this.operatorName = data;
  }
 

  // This method checks if the status is completed state , if the job status is completed modal opens up and on click of Yes the submit works
  completed_status(){
    if( this.project_status.value == "completed" && (this.total_qlty_produced_count < this.project_quantity_count)){
      $('#completed_alert').modal('show');
    }
    else{
     this.updateProject(); 
    }
  }

  // -----------------------------------------------------------------
  // PUT method implementation.
  // -----------------------------------------------------------------

  // This method will UPDATE the existing workcenter.
  updateProject() {
    if (this.plant.hasError('required') || this.work_center.hasError('required') ||
      this.wrkOrderName.hasError('required') || this.asstes.hasError('required') ||
      this.project_code.hasError('required') || this.project_quantity.hasError('required') ||
      this.start_date.hasError('required') || this.end_date.hasError('required') ||
      this.plant.status == "INVALID" || this.work_center.status == "INVALID" || this.asstes.status == "INVALID"
      || this.workcenter_asset.length == 0 || this.project_quantity.status == "INVALID" || this.start_date.status == null
      || this.end_date.status == null || this.project_code.status == "INVALID" || this.wrkOrderName.status == "INVALID" || this.jb_type.status == "INVALID") {
      this.snackbar.top_snackbar("Enter all required Fields !!",this.error_status);
      this.popup_title = 'Edit Job'
      $('#project').modal('show');
    } else if (this.end_date.status == null  || this.project_status.value == 'inprogress' && this.end_date.value < new Date().toISOString().slice(0, 10) == true) {
        this.snackbar.top_snackbar("Enter valid start date and end date !!",this.error_status);
        this.popup_title = 'Edit Job'
        $('#project').modal('show');
      }
      else if ( this.project_status.value == 'halt' && this.end_date.value < new Date().toISOString().slice(0, 10) == true) {
        this.snackbar.top_snackbar("Enter valid start date and end date !!",this.error_status);
        this.popup_title = 'Edit Job'
        $('#project').modal('show');
      }

      else {
        let data = {}
        data['fw_tenant_id'] = this.authService.currentUser['tenant_id'];
        data['sf_project_status'] = this.project_status.value;
        data['sf_project_start_date'] = this.datepipe.transform(this.start_date.value, 'yyyy-MM-dd');
        data['sf_project_end_date'] = this.datepipe.transform(this.end_date.value, 'yyyy-MM-dd');
        data['sf_plant_id'] = this.plant.value;
        data['sf_work_centre_id'] = [this.work_center.value];
        data['sf_project_code'] = this.project_code.value;
        data['sf_project_quantity'] = this.project_quantity.value;
        // data['sf_no_of_shift'] = this.no_of_shifts.value;
        data['sf_asset_id'] = [this.asstes.value];
        data['sf_workorder_id'] = this.wrkOrderName.value;
        data['is_rework'] = this.rework.value;
        data['sf_part_id'] = this.part_code.value;
        data['updated_by'] = this.authService.currentUser['email'];
        data['sf_project_type'] = this.jb_type.value;
        this.projectService.putProjectsS(this.project_id, data).subscribe(response => {
          this.ngOnInit();
        })
      } 
  }
  
  updateOperator(){
    
    if(this.end_date.status == "INVALID" || this.project_status.status == "INVALID"){
      this.snackbar.top_snackbar("Enter all required Fields !!",this.error_status);
    }else{
    let update_operator = {}

    update_operator['sf_asset_id'] = [this.asstes.value];
    update_operator['sf_project_start_date'] = this.datepipe.transform(this.start_date.value, 'yyyy-MM-dd');
    update_operator['sf_project_end_date'] = this.datepipe.transform(this.end_date.value, 'yyyy-MM-dd');
    if(this.noassignee.value == true){
      update_operator['sf_factory_user_id'] = null;
    }else if(this.noassignee.value == false){
      update_operator['sf_factory_user_id'] = this.jb_worker.value;
    }
    update_operator['sf_project_status'] = this.project_status.value;
    this.projectService.putProjectsS(this.project_id, update_operator).subscribe(response => {
      this.ngOnInit();
    })
  }
  }

 
  public  ischack
 showCheckRest(event:any){
    if(event.checked == false){
      this.ischack = false;
      this.jb_worker.enable();
    }else if(event.checked == true){
       this.select_jbop.options.forEach((item: MatOption) => item.deselect());
       this.ischack = true;
       this.jb_worker.disable();
      }
    }

  // This method will delete the projects.
  deleteProject() {
    this.projectService.deleteProjectsS(this.project_id).subscribe(response => {
      this.othersService.reloadCurrentRoute();
    })
  }

  // Clone screen keep the start , end , job code empty and remaining fields should be prefilled
  Clear_cloned_fields(){
    this.project_status.setValue('notstarted');
    this.project_code.reset();
    this.start_date.reset();
    this.end_date.reset();
    this.project_code.enable();
    this.start_date.enable();
    this.end_date.enable();
    this.part_code.enable();
    this.wrkOrderName.enable();
    this.project_status.disable();
    this.rework.reset();
    this.rework.enable();
    this.project_quantity.enable();
    this.work_order_list= true;
    this.work_order_project = false;
  }
    //Enable rework for yet to start disable rework if the job is in progress , halt , completed.
    disable_rework(event:MatSelectChange ){
      if(event.value =="inprogress" || event.value=="halt" || event.value=="completed" ){
        this.rework.disable();
      } 
      else{
        this.rework.enable();
      }
    }

  // this method will list all the workorder name
  wrkcenternameError: boolean;
  no_wrkcenter_name_list: boolean;
  workorderNameList() {
    this.WorkorderService.getWorkorderNameListS().subscribe(response => {
     if (response['Unsuccessful']) {
        this.wrkcenternameError = true;
      } else {
        this.workordernameList = response;
        if (this.workordernameList.length == 0) {
          this.no_wrkcenter_name_list = true;
        } else {
        this.no_wrkcenter_name_list = false;
        }
      }
    }, error => {
      this.wrkcenternameError = true;
    });
  }



  // this method for searching the table
  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // disabling the input form 
  addproject: boolean;
  tenant_and_subtenant() {
    if (this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 'PA1001' || this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'ASA1001') {
      if(this.status_progress =="completed"){
        this.disabledForm();
        this.addproject = false;
        }
      else if(this.status_progress == 'halt' || this.status_progress == 'expired'){
      this.halt_fields();
      }
      else if(this.status_progress == 'inprogress' ){
        this.inprogress_Filelds();
       }

      else if(this.status_progress == 'notstarted'){
        this.notStartedDisablEnable();
      }
        this.addproject = true;
    }
    else if (this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == 'MV1001' || this.authService.currentUser['role_id'] == 'PV1001' || this.authService.currentUser['role_id'] == 'WCV1001' || this.authService.currentUser['role_id'] == 'ASV1001'|| this.authService.currentUser['role_id'] == 'JB1001') {
      this.disabledForm();
      this.addproject = false;
    }
  }

    // This method will disabled enabled form control fields 
    notStartedDisablEnable(){
      this.plant.enable();
      this.work_center.enable();
      this.asstes.enable();
      this.project_code.enable();
      this.part_code.enable();
      this.start_date.enable();
      this.end_date.enable();
      this.project_status.enable();
      this.jb_type.enable();
      this.rework.enable();
      this.project_quantity.enable();
      this.wrkOrderName.enable();
      this.part_code.enable();
    }

 // This method will disabled form control fields 
  disabledForm(){
    this.plant.disable()
    this.work_center.disable()
    this.project_code.disable();
    this.start_date.disable();
    this.end_date.disable();
    this.jb_type.disable();
    this.project_status.disable();
    this.rework.disable();
    this.project_quantity.disable();
    this.wrkOrderName.disable();
    this.asstes.disable();
    this.part_code.disable();
  }

  // This method will enable form control fields 
   enableForm(){
    this.plant.enable();
    this.work_center.enable();
    this.project_code.enable();
    this.part_code.enable();
    this.start_date.enable();
    this.end_date.enable();
    this.asstes.enable();
    this.project_status.enable();
    this.jb_type.enable();
    this.rework.enable();
    this.project_quantity.enable();
    this.wrkOrderName.enable();
    this.asstes.enable();
    this.part_code.enable();
  }

// This method will handle the enable and disable fields if the job status is in progress and halt.
  halt_fields(){
    this.plant.enable();
    this.work_center.enable();
    this.project_code.disable();
    this.wrkOrderName.disable();
    this.part_code.disable();
    this.project_quantity.enable();
    this.start_date.enable();
    this.end_date.enable();
    this.rework.disable();
    this.asstes.enable();
    this.project_status.enable();
    this.jb_type.disable();
  }


  // This method will handle the enable and disable fields if the job status is in progress.
  inprogress_Filelds(){
    this.plant.disable();  
    this.work_center.disable()
    this.project_code.disable();
    this.start_date.disable();
    this.end_date.enable();
    this.jb_type.disable();
    this.project_status.enable();
    this.rework.disable();
    this.project_quantity.enable();
    this.wrkOrderName.disable();
    this.asstes.disable();
    this.part_code.disable();     
  }
  

  date_internalError: boolean;
  date_info: any = [];
  no_date_info: boolean;

  //  this method will return asset avail;ability.
  getassetAvailability(asset_id: any) {
    this.projectService.getProjectDateinfoS(asset_id).subscribe(response => {
      if (response['Unsucessfull']) {
        this.date_internalError = true;
      } else {
        this.date_info = response;

        this.date_info['sf_project_end_date'];
        if (this.popup_title == 'Add Job') {
          this.start_date.patchValue(this.date_info['sf_project_end_date']);
        }
        if (this.date_info.length == 0) {
          this.no_date_info = true;
        } else {
          this.no_date_info = false;
        }
      }
    }, error => {
      this.date_internalError = true;
    })
  }
  public end_date_show;
  //assest list variable
  assestlist_date_info: any = [];
  assest_internalError: boolean;
  no_assestlist: boolean;


  // Below get date info is no longer used in jobs , start and end date is  validation is removed.
  // This function will call the API for GET method to display the start date end date passing workcenter id.
  get_dateInfo(work_order_id: any) {
    this.WorkorderService.getWorkorderdurationS(work_order_id).subscribe(response => {
      if (response['Unsucessfull']) {
        this.date_internalError = true;
      } else {
        this.date_info = response;
        this.start_date.patchValue(this.date_info['start_date']);
        this.end_date_show = this.date_info['end_date']
        if (this.date_info.length == 0) {
          this.no_date_info = true;
        } else {
          this.no_date_info = false;
        }
      }
    }, error => {
      this.date_internalError = true;
    })
  }

  // This function will call the API for GET method to display Assest List by passing  the start date end date .
  getAssestlistbyDate(strat_date: any, enddate: any) {
    let start_date = this.datepipe.transform(strat_date, 'yyyy-MM-dd');
    let end_date = this.datepipe.transform(enddate, 'yyyy-MM-dd');
    this.assetService.getAssetlistbydateS(start_date, end_date, this.work_center.value).subscribe(response => {
      if (response['Unsuccessful'] || response == false) {
        this.asset_internalError = true;
      } else {
        this.assestlist_date_info = response;
        if (this.assestlist_date_info.length == 0) {
          this.no_assestlist = true;
        } else {
          this.no_assestlist = false;
        }
      }
    }, error => {
      this.assest_internalError = true;
    })
  }

  // This function will call the API for GET method to display Quantity by passing  workorder_id .
  public quantity_remain;
  public workorderqty;
  public currentvalue
  quantity_info: any = [];
  subdis: boolean = false;
  getQuantity() {
    this.WorkorderService.getWorkorderQuantity().subscribe(response => {
      this.quantity_info = response;
      this.quantity_remain = this.quantity_info[0]['remainig_quantity'];
      this.workorderqty = this.quantity_info[0]['work_order_qty'];
      this.project_quantity.valueChanges.subscribe(value => {
        this.currentvalue = value;
      });
    });
  }



  // this function will clear the workcenter and assets list dropdown.
  clearlength() {
    this.workcenter_asset.length = 0;
    this.assestlist_date_info.length = 0;
    this.plant_workcenters.length = 0;
   }

  //This method detects if the wrkcenter has changed the value and reset end and assets fields.
  ifchange(data) {
    this.end_date.reset();
    this.asstes.reset();
  }

// end of tour guide
  onLoad(){
    let modalshown :boolean = false;
    if(this.projects.length == 0){ 
        if( modalshown == false){
          $('#tourguideEnd').modal('show');
          $('#tourguideEnd').on('shown.bs.modal', function () {
            modalshown = true;
          })
        } else if (modalshown == true) {
          $('#tourguideEnd').modal('hide');
        }
    }
  }
}
