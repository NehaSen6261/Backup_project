import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ɵConsole } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { NavbarService } from '../../navbar/_services/navbar.service';
import { UsersService } from '../../users/_services/users.service';
import { AuthService } from '../../login/_services/auth.service';
import { FormControl, Validators } from '@angular/forms';
import { SubtenantService } from '../../subtenant/_services/subtenant.service';
import { RolesService } from '../../roles/_services/roles.service';
import { PlantService } from '../../plants/_services/plant.service';
import { WorkcenterService } from '../../workcenters/_services/workcenter.service';
import { AssetService } from '../../assets/_services/asset.service';
import { DecimalPipe } from '@angular/common';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { OthersService } from '../../others/_services/others.service';

export class User_Role_select {
  value: any;
  viewValue: string;
}


@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [DecimalPipe]
})
export class UsersComponent implements OnInit {

  user_role_select: User_Role_select[];
  factory_usr_roles:any=[]
  User_Role_selected: any

  selectedContentType = null
  popup_title: string;
  plants_internalError: boolean;
  plants: any = [];
  no_plants: boolean;
  workcenter_internalError: boolean;
  no_workcenter: boolean;
  plant_workcenters: any = [];
  asset_internalError: boolean;
  no_asset: boolean;

 


  workcenter_asset: any = [];
  error_status= "Error";
  spinner: boolean = true;
  internalError: boolean = false;
  displaydata: boolean = false;
  obs: Observable<any>;
  filter = new FormControl('');
  TenantUsers: any = [];
  displayedColumns: string[] = ['user_first_name', 'user_last_name', 'role_name', 'user_email_id', 'action'];
  dataSource = new MatTableDataSource(this.TenantUsers);
  private paginator: MatPaginator;
  private sort: any;
  subtenant_error: boolean = false;
  no_subtenants: boolean = false;
  usrroles_error: boolean = false;
  no_usrroles: boolean = false;
  InternalError: boolean = false;
  multi_workcenter_assets: any = [];
  multi_workcenter_internalError: boolean;
  no_asset_multi_workcenter: boolean;
  subTenants: any = [];
  Roles: any = [];
  role_id: any;
  allroles: any = [];
  checked:boolean;
  selected:string

  //variable declaration for user

  public factory_user = false;
  public guest_account_user = false
  public user_role = false
  rate: string

  // plant declaration
  public plant_rsp
  public plant_list
  // variable name of role
  public srole
  //post method variable
  public data: any
  public data_assest: any
  public data_assest_value: any
  public data_work: any
  public data_work_value: any

  // role capture variable
  public all_plant = false
  public work_plant: boolean
  public assest: boolean

  // get all role
  public element_all_role
  // Update the user info
  public user_info: any;
  public user_email: string;
  public user_type: string;
  public usersrole: any;
  // plant changes function variable
  public plant_selection
  public disableBtn:boolean = true;
  public closebtn:boolean = false;
  public is_acc_usr_enabled:boolean = true;

  element:HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
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

  constructor(private navbarService: NavbarService,
    private userService: UsersService,
    public  authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private plantService: PlantService,
    private workcenterService: WorkcenterService,
    private assetService: AssetService,
    private subtenantService: SubtenantService,
    private userroleService: RolesService,
    private usersService: UsersService,
    private snackbar: SnackbarComponent,
    private othersService: OthersService,
  ) {
    this.navbarService.Title = "Users";
    setInterval (() => {​​​​​​​​
      this.element;
        }​​​​​​​​, 100);
        this.othersService.setTitle(this.navbarService.Title);
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
    this.getTenantUsers();
    this.gettenantSubtenant();
    this.getsubtenantRoles();
    this.getPlants();
    this.get_all_roles();
    this.user_role_select = [
      { value: 1, viewValue: 'Account Admin' },
      { value: 2, viewValue: 'Account Viewer' },
    ]


  }
  alldev_Selected=false;
  @ViewChild('select') select: MatSelect;
// select all functionally related functions starts here.
toggleAllSelection() {
  if (this.alldev_Selected) {
    this.select.options.forEach((item: MatOption) => item.select());
  } else {
    this.select.options.forEach((item: MatOption) => item.deselect());
  }

}
  @ViewChild('workcenter_select') workcenter_select: MatSelect;
  alldev_Selected_workcenter=false;
   toggleAllSelectioWorkcenter(){
    if (this.alldev_Selected_workcenter) {
    this.workcenter_select.options.forEach((item: MatOption) => item.select());
  } else {
    this.workcenter_select.options.forEach((item: MatOption) => item.deselect());
  }

}



// for asset multiselect.
optionClick() {
  let newStatus = true;
  this.select.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.alldev_Selected = newStatus;
}

  // Form input handler's.
  usr_first_name = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  usr_last_name = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  usr_email = new FormControl('', [Validators.required, Validators.email]);
  usr_type = new FormControl('', [Validators.required]);
  usr_role = new FormControl('', [Validators.required]);  
  fac_plant_id = new FormControl('', [Validators.required]);
  fac_wc_id = new FormControl('', [Validators.required]);
  fac_asset_id = new FormControl('', [Validators.required]);

  selected_usertype:string;
  selected_fac_role:string;

  // Error messages.
  UsrFirstNameMessages() {
    if (this.usr_first_name.hasError('required')) {
      return 'You must enter first name !!';
    }
    if (this.usr_first_name.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.usr_first_name.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
  }
  UsrLastNameMessages() {
    if (this.usr_first_name.hasError('required')) {
      return 'You must enter last name !!';
    }
    if (this.usr_first_name.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.usr_first_name.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
  }
  UsrEmailMessages() {
    if (this.usr_email.hasError('required')) {
      return 'You must enter email !!';
    }
    if (this.usr_email.hasError('email')) {
      return 'Please enter valid email address !!';
    }
  }
  UsrUsrTypeMessages() {
    if (this.usr_type.hasError('required')) {
      return 'You must choose user type !!';
    }
  }
  UsrRoleTypeMessages() {
    if (this.usr_role.hasError('required')) {
      return 'You must choose user role !!';
    }
  }
  UsrPlantMessages() {
    if (this.fac_plant_id.hasError('required')) {
      return 'You must choose Plant !!';
    }
  }
  UsrWcMessages() {
    if (this.fac_wc_id.hasError('required')) {
      return 'You must choose Workcenter !!';
    }
  }
  UsrAssetMessages() {
    if (this.fac_asset_id.hasError('required')) {
      return 'You must choose Workcenter !!';
    }
  }

  show_user : boolean 
// This method will detect the user type change.
userTypeChange(event:any){
  this.show_user = true
  this.selected_usertype = event.value;
  if(this.selected_usertype == "account_user"){
    this.is_plant_enabled = false;
    this.is_wc_enabled = false;
    this.is_asset_enabled = false;
  }
}

// this method will detect the Factory user role change.
is_plant_enabled:boolean = false;
is_wc_enabled:boolean = false;
is_asset_enabled:boolean = false;

facUserRoleChange(event:any){
  this.selected_fac_role = event.value;

  // Management
  if(this.selected_fac_role == "MV1001" && this.selected_usertype == 'factory_user'){
    this.is_plant_enabled = false;
    this.is_wc_enabled = false;
    this.is_asset_enabled = false;
  
  }
  // plant Admin and Plant Viewer
  else if((this.selected_fac_role == "PA1001" || this.selected_fac_role == "PV1001") && this.selected_usertype == 'factory_user'){
    this.is_plant_enabled = true;
    this.is_wc_enabled = false;
    this.is_asset_enabled = false;
 
  }
  // Workcenter Admin and Viewer.
  else if((this.selected_fac_role == "WCA1001" || this.selected_fac_role == "WCV1001") && this.selected_usertype == 'factory_user'){
    this.is_plant_enabled = true;
    this.is_wc_enabled = true;
    this.is_asset_enabled = false;
 
  }
  // Asset Admin and Viewer.
  else if((this.selected_fac_role == "ASA1001" || this.selected_fac_role == "ASV1001") && this.selected_usertype == 'factory_user'){
    this.is_plant_enabled = true;
    this.is_wc_enabled = true;
    this.is_asset_enabled = true;
 
  }
   // Job Operator.
   else if((this.selected_fac_role == "JB1001") && this.selected_usertype == 'factory_user'){
    this.is_plant_enabled = true;
    this.is_wc_enabled = true;
    this.is_asset_enabled = true;
  
  }
}

// this method will display the plants.
  getPlants() {
    this.plantService.getplantlistS().subscribe(response => {
      this.plant_list = response
      this.plant_list.forEach(element => {
        this.plant_rsp = element.sf_plant_id
      });

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
  getplantWorkcenters() {        
    this.workcenterService.getPlantWorkcentersListS(this.fac_plant_id.value).subscribe(response => {
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

// This method will display the all the multiple asset .
 public multi_workcenter_id:any;
 getMultiWCAssets(workCenter_id:any) {
  this.multi_workcenter_id = this.fac_wc_id.value.toString() 
  this.assetService.getMultiWCAsset(this.multi_workcenter_id).subscribe(response => {
      if (response['Unsuccessful']) {
        this.multi_workcenter_internalError = true;
      } else {
        this.multi_workcenter_assets = response;
        if (this.multi_workcenter_assets.length == 0) {
          this.no_asset_multi_workcenter = true;
        } else {
          this.no_asset_multi_workcenter = false;
        }
      }
    }, error => {
      this.multi_workcenter_internalError = true;
    })
  }


  // This method will do validation for input fields
  postAllowed(){       
    if(this.usr_type.value == "account_user"){
      if(this.usr_first_name.value && this.usr_last_name.value && this.usr_email.value && this.usr_email.status != 'INVALID'  && this.usr_role.value){
        return true;
      }else{
        return false;
      }
    }else{
      // Management.
      if(this.usr_role.value == "MV1001"){
        if(this.usr_first_name.value && this.usr_last_name.value && this.usr_email.value && this.usr_email.status != 'INVALID' && this.usr_role.value){
          return true;
        }else{
          return false;
        }
      }
      // Plant admin and viewer
      else if(this.usr_role.value == "PA1001" || this.usr_role.value == "PV1001"){
          if(this.usr_first_name.value && this.usr_last_name.value && this.usr_email.value && this.usr_email.status != 'INVALID'
            && this.usr_role.value && this.fac_plant_id.value){
            return true;
          }else{
            return false;
          }        
      }
        // Workcenter admin and viewer
        else if(this.usr_role.value == "WCA1001"|| this.usr_role.value == "WCV1001"){
        if(this.usr_first_name.value && this.usr_last_name.value && this.usr_email.value && this.usr_email.status != 'INVALID'
          && this.usr_role.value && this.fac_plant_id.value && this.fac_wc_id.value){
          return true;
        }else{
          return false;
        }        
       }
        // Asset admin and viewer
        else if(this.usr_role.value == "ASA1001" || this.usr_role.value == "ASV1001"){
        if(this.usr_first_name.value && this.usr_last_name.value && this.usr_email.value && this.usr_email.status != 'INVALID'
          && this.usr_role.value && this.fac_plant_id.value && this.fac_wc_id.value && 
          this.fac_asset_id.value){
          return true;
        }else{
          return false;
        }        
        }
        // Job operator.
        else if(this.usr_role.value == "JB1001"){
        if(this.usr_first_name.value && this.usr_last_name.value && this.usr_email.value && this.usr_email.status != 'INVALID'
          && this.usr_role.value && this.fac_plant_id.value && this.fac_wc_id.value && 
          this.fac_asset_id.value){
          return true;
        }else{
          return false;
        }        
        }
    }  
  }



 // this method will create an user.
 public disabled_enable_button : boolean;
 post_method(){
   let is_post_allowed = this.postAllowed();
   let data = {}
  if(is_post_allowed){
    data['org_id'] = this.authService.currentUser['org_id'];
    data['tenant_id'] = this.authService.currentUser['tenant_id'];
    data['company_college'] = this.authService.currentUser['tenant_name'];
    data['first_name'] = this.usr_first_name.value;
    data['last_name'] = this.usr_last_name.value;
    data['email'] = this.usr_email.value;
    data['user_type'] = this.usr_type.value;
    data['role_id'] = this.usr_role.value;
    data['sf_plant_id'] = this.fac_plant_id.value;
    data['sf_work_centre_id'] = [this.fac_wc_id.value];
    data['sf_asset_id'] = this.fac_asset_id.value;
    data['created_by'] = this.authService.currentUser['email'];
    this.disabled_enable_button = true; 
    this.userService.postUserS(data).subscribe(response => {
     if (this.userService.response_status == "Unsuccessful" ) { 
        this.disabled_enable_button = false;   
      }
      else if (this.userService.response_status == "Successful" ) { 
        this.ngOnInit();
      this.disabled_enable_button = false;  
      this.ngOnInit();
      this.cleardata();
      } 
    });
  
  }else{
    this.snackbar.top_snackbar("Enter all required Fields !!",this.error_status)
  }
  
 }



// Set User Info.
setUserdata(user_data:any){
    this.show_user = true
    this.usr_email.disable();
    this.usr_first_name.setValue(user_data['user_first_name']);
    this.usr_last_name.setValue(user_data['user_last_name']);
    this.usr_email.setValue(user_data['user_email_id']);
    this.usr_type.setValue(user_data['sf_user_type']);
    this.usr_role.setValue(user_data['role_id']);
    this.selected_usertype = user_data['sf_user_type'];
    // Account Admin and Viewer
    if((user_data['role_id'] == 1 || user_data['role_id'] == 2) && this.selected_usertype == 'account_user'){
      this.is_plant_enabled = false;
      this.is_wc_enabled = false;
      this.is_asset_enabled = false;
      if(this.authService.currentUser['role_id'] == 1){
        if(this.usr_email.value == this.authService.currentUser['email']){
          this.disableFormInpts();
        }else{
          this.enableFormInpts();
        }
      }else{
        this.disableFormInpts();
      }
    }

    // management
    else if((user_data['role_id'] == "MV1001" ) && this.selected_usertype == 'factory_user'){
      this.is_plant_enabled = false;
      this.is_wc_enabled = false;
      this.is_asset_enabled = false;
      this.is_acc_usr_enabled = false;
      if(this.authService.currentUser['role_id'] == "MV1001"){
        if(user_data['role_id'] == 1 || user_data['role_id'] == 2){
          this.disableFormInpts();
        }else{
          if(this.usr_email.value == this.authService.currentUser['email']){
            this.disableFormInpts();
          }else{
            this.enableFormInpts();
          }
        }
      }else if(this.authService.currentUser['role_id'] == 1){
        this.enableFormInpts();
      }
      else{
        this.disableFormInpts();        
      }
    }
    // Plant Admin and Viewer
    else if((user_data['role_id'] == "PA1001" || user_data['role_id'] == "PV1001") && this.selected_usertype == 'factory_user'){
      this.is_plant_enabled = true;
      this.is_wc_enabled = false;
      this.is_asset_enabled = false;
      this.is_acc_usr_enabled = false;
      this.fac_plant_id.setValue(user_data['sf_plant_id']);
      if(this.authService.currentUser['role_id'] == "PA1001"){
        if(user_data['role_id'] == 1 || user_data['role_id'] == 2 || user_data['role_id'] == "MV1001"){
          this.disableFormInpts();
        }else{
          if(this.usr_email.value == this.authService.currentUser['email']){
            this.disableFormInpts();
          }else{
            this.enableFormInpts();
          }
        }
      }else if(this.authService.currentUser['role_id'] == "PV1001" || this.authService.currentUser['role_id'] == "WCV1001"
       || this.authService.currentUser['role_id'] == "WCA1001" || this.authService.currentUser['role_id'] == "ASA1001"
       || this.authService.currentUser['role_id'] == "ASV1001" || this.authService.currentUser['role_id'] == 2){
        this.disableFormInpts();
      }
      else{
        this.enableFormInpts();
      }
    }
    // Workcenter Admin and Viewer.
    else if((user_data['role_id'] == "WCA1001" || user_data['role_id'] == "WCV1001") && this.selected_usertype == 'factory_user'){
      this.is_plant_enabled = true;
      this.is_wc_enabled = true;
      this.is_asset_enabled = false;      
      this.is_acc_usr_enabled = false;
      
      this.fac_plant_id.setValue(user_data['sf_plant_id']);
      this.getplantWorkcenters();
      let workcenterSelectedList = user_data['sf_work_centre_id'][0].map(Number)
      this.fac_wc_id.setValue(workcenterSelectedList) 
      this.getMultiWCAssets(user_data['sf_work_centre_id'][0].toString());

      if(this.authService.currentUser['role_id'] == "WCA1001"){
        if(user_data['role_id'] == 1 || user_data['role_id'] == 2 || user_data['role_id'] == "MV1001" || 
           user_data['role_id'] == "PA1001" || user_data['role_id'] == "PV1001"){
          this.disableFormInpts();
        }else{
          if(this.usr_email.value == this.authService.currentUser['email']){
            this.disableFormInpts();
          }else{
            this.enableFormInpts();
          }
        }
      }else if(this.authService.currentUser['role_id'] == "PV1001" || this.authService.currentUser['role_id'] == "WCV1001" ||
        this.authService.currentUser['role_id'] == "ASA1001" || this.authService.currentUser['role_id'] == "ASV1001" ||
        this.authService.currentUser['role_id'] == 2){
        this.disableFormInpts();
      }else{
        this.enableFormInpts();
      }
    }
    // Asset Admin and Viewer.
    else if((user_data['role_id'] == "ASA1001" || user_data['role_id'] == "ASV1001") && this.selected_usertype == 'factory_user'){
      this.is_plant_enabled = true;
      this.is_wc_enabled = true;
      this.is_asset_enabled = true;
      this.is_acc_usr_enabled = false;
    
      this.fac_plant_id.setValue(user_data['sf_plant_id']);
      this.getplantWorkcenters();

      let workcenterSelectedList = user_data['sf_work_centre_id'][0].map(Number)
      this.fac_wc_id.setValue(workcenterSelectedList) 
      this.getMultiWCAssets(user_data['sf_work_centre_id'][0].toString());
      let asset_selectedList = user_data['sf_asset_id'].map(Number)
      this.fac_asset_id.setValue(asset_selectedList) 

      if(this.authService.currentUser['role_id'] == "ASA1001"){
        if(user_data['role_id'] == 1 || user_data['role_id'] == 2 || user_data['role_id'] == "MV1001" || 
           user_data['role_id'] == "PA1001" || user_data['role_id'] == "PV1001" || 
           user_data['role_id'] == "WCA1001" || user_data['role_id'] == "WCV1001"){
          this.disableFormInpts();
        }else{
          if(this.usr_email.value == this.authService.currentUser['email']){
            this.disableFormInpts();
          }else{
            this.enableFormInpts();
          }
        }
      }else if(this.authService.currentUser['role_id'] == "PV1001" || 
          this.authService.currentUser['role_id'] == "WCV1001" ||
          this.authService.currentUser['role_id'] == "ASV1001" || 
          this.authService.currentUser['role_id'] == 2){
        this.disableFormInpts();
      }else{
        this.enableFormInpts();
      }
    }
     // Job Operator
     else if((user_data['role_id'] == "JB1001") && this.selected_usertype == 'factory_user'){
      this.is_plant_enabled = true;
      this.is_wc_enabled = true;
      this.is_asset_enabled = true;
      this.is_acc_usr_enabled = false;
      this.fac_plant_id.setValue(user_data['sf_plant_id']);      
      this.getplantWorkcenters();
      let workcenterSelectedList = user_data['sf_work_centre_id'][0].map(Number)
      this.fac_wc_id.setValue(workcenterSelectedList) 
      this.getMultiWCAssets(user_data['sf_work_centre_id'][0].toString());
      let asset_selectedList = user_data['sf_asset_id'].map(Number)
      this.fac_asset_id.setValue(asset_selectedList) 
      if(this.authService.currentUser['role_id'] == 1 || 
         this.authService.currentUser['role_id'] == "PA1001" ||
         this.authService.currentUser['role_id'] == "WCA1001" ||
         this.authService.currentUser['role_id'] == "ASA1001" ||
         this.authService.currentUser['role_id'] == "MV1001"){
          this.enableFormInpts();
      }else{
        this.disableFormInpts();
      }
    }
}

// This method will enable all the form fields.
enableFormInpts(){
  this.usr_first_name.enable();
  this.usr_last_name.enable();
  this.usr_type.enable();
  this.usr_role.enable();
  this.fac_plant_id.enable();
  this.fac_wc_id.enable();
  this.fac_asset_id.enable();
  this.disableBtn = true;
  this.closebtn = false;
}


// This method will disable all the form fields.
disableFormInpts(){
    this.usr_first_name.disable();
    this.usr_last_name.disable();
    this.usr_email.disable();
    this.usr_type.disable();
    this.usr_role.disable();
    this.fac_plant_id.disable();
    this.fac_wc_id.disable();
    this.fac_asset_id.disable();
    this.disableBtn = false;
    this.closebtn = true;
}


// This method will update the user.
update_method(){
  let is_post_allowed = this.postAllowed();
   let data = {}
  if(is_post_allowed){    
    data['tenant_id'] = this.authService.currentUser['tenant_id'];
    data['first_name'] = this.usr_first_name.value;
    data['last_name'] = this.usr_last_name.value;
    data['email'] = this.usr_email.value;
    data['user_type'] = this.usr_type.value;
    data['role_id'] = this.usr_role.value;
    data['plant_id'] = this.fac_plant_id.value;
    data['workcenter_id'] = [this.fac_wc_id.value];
    data['asset_id'] = this.fac_asset_id.value;
    data['updated_by'] = this.authService.currentUser['email'];
  this.userService.putUserS(this.usr_email.value, data).subscribe(response => {
      if(this.userService.response_status == "Successful"){
        this.ngOnInit();
      }
    });
  
  }else{
    this.snackbar.top_snackbar("Enter all required Fields !!",this.error_status)
  }
}


//  This method will clear the form.
  cleardata(){
    this.show_user = false;
    this.is_wc_enabled = false;
    this.is_asset_enabled = false;
    this.usr_first_name.reset();
    this.usr_last_name.reset();
    this.usr_email.reset();
    this.usr_type.reset();
    this.usr_role.reset();    
    this.fac_plant_id.reset();
    this.fac_wc_id.reset();
    this.alldev_Selected_workcenter = false;
    this.alldev_Selected = false;
    this.fac_asset_id.reset();    
    this.usr_first_name.enable();
    this.usr_last_name.enable();
    this.usr_email.enable();
    this.usr_type.enable();
    this.usr_role.enable();    
    this.fac_plant_id.enable();
    this.fac_wc_id.enable();
    this.fac_asset_id.enable();   
    this.is_acc_usr_enabled= true 
  }

  

  // This method will list all roles in list format
  get_all_roles() {
    this.userroleService.getFactoryUserrolesS().subscribe(response => {
      this.allroles = response;
    })
  }


  // This method will display the tenant users.
  getTenantUsers() {
    this.userService.getTenantUsersS().subscribe(response => {
      this.spinner = false;
      if (response['Unsuccessful'] || response == null) {
        this.spinner = false;
        this.internalError = true;
      } else {
        this.TenantUsers = response;
        this.TenantUsers.forEach(element => {
          this.checked= true
        });
        if (this.TenantUsers.length == 0) {
          this.displaydata = true;
        }
        this.dataSource.data = this.TenantUsers;
      }

    }, error => {
      this.spinner = false;
      this.internalError = true;
    })
  }


  // This function will display the all the subtenants available for the tenant.
  gettenantSubtenant() {
    return this.subtenantService.gettenantSubtenantS().subscribe(response => {
      this.subTenants = response;
      if (this.subTenants.length == 0) {
        this.no_subtenants = true;
      }
    }, error => {
      this.subtenant_error = true;
    })
  }

  // This function will display the all the roles available for the sub tenant
  getsubtenantRoles() {
    this.userroleService.getFactoryUserrolesS().subscribe(response => {
      this.Roles = response;
      if (this.Roles.length == 0) {
        this.no_usrroles = true;
      }
    }, error => {
      this.usrroles_error = true;
    })
  }

  ngOnChanges() {
    throw new Error('Method not implemented.');
  }

  // this method for searching the table
  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  //This method will delete the user.
  deleteTenantUserInfo() {
    this.usersService.deleteUserS(this.usr_email.value, this.usr_type.value).subscribe(response => {
      this.ngOnInit();
    });
  }


}
