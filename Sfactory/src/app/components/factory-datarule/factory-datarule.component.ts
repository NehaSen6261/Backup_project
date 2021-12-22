import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NavbarService } from '../../components/navbar/_services/navbar.service';
import { AssetService } from '../assets/_services/asset.service';
import { AuthService } from '../login/_services/auth.service';
import { FactrydruleService } from '../factory-datarule/_services/factrydrule.service';
import { SnackbarComponent } from '../others/snackbar/snackbar.component';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OthersService } from '../others/_services/others.service';

export interface Alerts {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'factory-datarule',
  templateUrl: './factory-datarule.component.html',
  styleUrls: ['./factory-datarule.component.scss']
})
export class FactoryDataruleComponent implements OnInit {
  popup_title: string;
  filter = new FormControl('');
  oee: boolean = false;
  performance: boolean = false;
  Availability: boolean = false;
  error_status= "Error";
  // Qunatity: boolean = false;
  Quality: boolean = false;
  fualt: boolean = false;
  Rejection: boolean = false;
  Greater: boolean = false;
  Lesser: boolean = false;
  Contains: boolean = false;
  Equal: boolean = false;
  Yes: boolean = false;
  No: boolean = false;
  On: boolean = false;
  Off:boolean =false;
  Webhook:boolean;
  Sms:boolean;
  value_customInput:string;
  alert_type
  Email:boolean;
  assets = new FormControl('',[Validators.required]);
  assetInternalError:boolean;
  no_assets:boolean;
  assetlist:any=[];
  obs: Observable<any>;
  factorydrule:any=[];
  plant_id:any;
  workcenter_id:any;
  spinner:boolean = true;
  internalError:boolean = false;
  nofactorydrule: boolean;
  assetsname;
  factory_drule_status:string;
  isActivedrule:boolean;
  element:HTMLElement = document.getElementById('triger') as HTMLElement;
  public user_disable:boolean;

 @ViewChild('myCheckbox') myCheckbox;
 public Showhide : boolean = false;
  checkvalue(event){
 
   if (event.checked == true && this.fualt == true ){
     this.Showhide = true;
  }
  else{
    this.Showhide = false;
  }
 }

 alerts: Alerts[] = [{
  value: 20,
  viewValue: 'Warning'
},
{
  value: 21,
  viewValue: 'Critical'
},
{
  value: 6,
  viewValue: 'Info'
}
]


  constructor(
    public authService: AuthService,
    private navbarService: NavbarService,
    private assetService: AssetService,
    private factoryDrule: FactrydruleService,
    private snackBar: SnackbarComponent,
    private changeDetectorRef: ChangeDetectorRef,
    private othersService: OthersService
    ) {
    this.navbarService.Title = "Rules";
    setInterval (() => {
      this.element;
    }, 100);
    this.othersService.setTitle(this.navbarService.Title);
  }

  displayedColumns: string[] = ['sf_alert_type', 'sf_value','sf_rule_condition','sf_action','sf_rule_data' ,'sf_asset_name','Action'];
  private paginator: MatPaginator;
  private sort: any;

  dataRules: any=[];

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
      this.dataSource.disconnect(); }
      }
    ngAfterContentChecked() {
      this.changeDetectorRef.detectChanges();
      }

dataSource = new MatTableDataSource(this.factorydrule);

  ngOnInit(): void {
    this.user_disable = this.othersService.enable_disable_role();
    this.assetLists();
    this.getfactoryDrule();
  }

//this method will display the assets.
assetLists(){
  this.assetService.getAssetslistS().subscribe(response=>{
    if (response['Unsuccessful'])    {
      this.assetInternalError = true;
    }
    else{
      this.assetlist = response
      if( this.assetlist.length == 0)      {
         this.no_assets = true;
        }else{
        this.no_assets = false;
      }
    }
  }, error => {
    this.assetInternalError = true;
  })
}


//this method is to capture the selected asset details
  getassetinfo(data){
   this.plant_id =  data['sf_plant_id'];
   this.workcenter_id =  data['sf_work_centre_id'];
 
  }

  // This method will fetch the details of the selected factory drule.
  factory_drule_id;
  getfactorydruleinfo(data:any){
      this.factory_drule_id = data['sf_factory_rule_id']
      this.Email = data['sf_email_notification'];
      this.Sms = data['sf_sms_notification'];
      this.assetsname = data['sf_asset_name'] ;
      this.isActivedrule = data['sf_rule_status'];
      this.alert_type = data['sf_alert_type'];
      if(this.isActivedrule){
        this.factory_drule_status = "Active";
      }else{
        this.factory_drule_status = "In Active";
      }
      if(data['sf_rule_condition'] == "Greater Than" ||data['sf_rule_condition'] == "Lesser Than"||data['sf_rule_condition'] == "Equal To" &&  data['sf_rule_data'] == "Fault" ){
        this.Showhide = true
       }
      else {
        this.Showhide = false
      }

      if(data['sf_rule_data'] == 'Performance'){
        this.performance = true;
      } else if(data['sf_rule_data'] == 'OEE'){
        this.oee = true;
      } else if(data['sf_rule_data'] == 'Availability'){
        this.Availability = true;
      }   else if(data['sf_rule_data'] == 'Fault'){
        this.fualt = true;     
      } else if(data['sf_rule_data'] == 'Quality'){
        this.Quality = true;
      } 
      else if(data['sf_rule_data'] == 'Rejection'){
        this.Rejection = true;
      }

      if(data['sf_rule_condition'] == "Lesser Than"){
        this.Lesser = true;
      }else if(data['sf_rule_condition'] == "Greater Than"){
        this.Greater = true;
      }else if(data['sf_rule_condition'] == "Equal To"){
        this.Equal = true;
      }else if(data['sf_rule_condition'] == "Contains"){
        this.Contains = true;
      }

      if(data['sf_value'] == "Yes"){
        this.Yes = true;
      }else if(data['sf_value'] == "No"){
        this.No = true;
      }else if(data['sf_value'] == "On"){
        this.On = true;
      }else if(data['sf_value'] == "Off"){
        this.Off = true;
      }else{
        this.value_customInput = data['sf_value'];
      }

  }
// this method is used to get the factory drule by tenant id.
getfactoryDrule(){
  this.factoryDrule.getFactoryDruleS().subscribe(response=>{
    this.spinner=false;
      this.factorydrule = response;
      this.factorydrule.forEach(data=>{
        if(data["sf_alert_type"] == 20){
         data["sf_alert_type"] = 'Warning';
        }else if(data["sf_alert_type"] == 21){
         data["sf_alert_type"] = 'Critical';
        }else if(data["sf_alert_type"] == 6){
         data["sf_alert_type"] = 'Info'
        }
      })
      if(this.factorydrule.length == 0){
        this.nofactorydrule = true;
      }else{
        if(this.factorydrule == false )  {
          this.nofactorydrule= false;
          this.internalError=true;
        }else{
          this.nofactorydrule = false;
            this.dataSource.data= this.factorydrule;

        }
      }

    }, error =>{
      this.spinner = false;
      this.internalError = true;
    }
    )
}

// this method is used to post the fcatory Drule.
public disabled_enable_button : boolean;
savefactoryDrule(data){
  if(this.assets.status == 'INVALID'){
    this.snackBar.top_snackbar("Please Choose an Asset !!",this.error_status);
  }
   else{
    let add_facDrule: any = {}
  let rulemetrics:any;
  let data_rule: any;
  let value: any;
  let action: any;
  if(this.oee){
    rulemetrics = 'OEE';
  } else if (this.performance){
    rulemetrics = 'Performance'
  } else if (this.Availability){
    rulemetrics = 'Availability'
  } else if (this.Quality){
    rulemetrics = 'Quality'
  } else if (this.fualt){
    rulemetrics = 'Fault'
  } else if (this.Rejection){
    rulemetrics = 'Rejection'
  }

  if (this.Greater) {
    data_rule = "Greater Than";
  } else if (this.Lesser) {
    data_rule = "Lesser Than"
  } else if (this.Equal) {
    data_rule = "Equal To"
  } else if (this.Contains) {
    data_rule = "Contains"
  }

  if (this.Yes) {
    value = "Yes";
  } else if (this.No) {
    value = "No"
  } else if (this.On) {
    value = "On"
  } else if (this.Off) {
    value = "Off"
  } else if (this.value_customInput) {
    value = this.value_customInput;
  }
  if (this.Email) {
    action = 'Email';
  }
  if (this.Sms) {
    action = 'Sms';
  }
  if (this.Email && this.Sms) {
    action = 'Email and Sms';
  }

  add_facDrule['fw_tenant_id'] = this.authService.currentUser['tenant_id'];
  if(this.authService.currentUser['role_id'] == 'ASA1001' || this.authService.currentUser['role_id'] == 'ASV1001')
  {
  add_facDrule['sf_plant_id'] = this.authService.currentUser['sf_plant_id'];;
  add_facDrule['sf_work_centre_id'] = this.authService.currentUser['work_centre_id'].join(',');
  }
  else{
    add_facDrule['sf_plant_id'] = this.plant_id;
    add_facDrule['sf_work_centre_id'] = this.workcenter_id;
  } 
  add_facDrule['sf_asset_id'] = this.assets.value;
  add_facDrule['sf_rule_data'] = rulemetrics;
  add_facDrule['sf_rule_condition'] = data_rule
  add_facDrule['sf_value'] = value;
  add_facDrule['sf_action'] = action;
  add_facDrule['sf_alert_type'] = this.alert_type;
  add_facDrule['sf_email_notification'] = this.Email;
  add_facDrule['sf_sms_notification'] = this.Sms;
  add_facDrule['sf_rule_status'] = true;
  add_facDrule['created_by'] = this.authService.currentUser['email'];
  this.disabled_enable_button = true; 
  this.factoryDrule.post_factoryDruleS(add_facDrule).subscribe(response=>{
    if (this.factoryDrule.response_status == "Unsuccessful" ) { 
      this.disabled_enable_button = false;   
    }
    else if (this.factoryDrule.response_status == "Successful" ) { 
    this.disabled_enable_button = false;   
      data.resetForm();
      this.assets.reset();
      this.Showhide= false;
      this.ngOnInit();
    }
   
  });
  }

}
// this is to clear the fields.
clear(){
  this.assets.reset();
  this.oee = false;
  this.Showhide= false;
  this.performance = false;
  this.Availability = false;
  this.Rejection = false;
  this.Quality = false;
  this.value_customInput = '';
}
// this method will activate and deactivate the factory data rule.
activate_deactivate_factory_drule(){
  if(!this.user_disable){
    if(this.isActivedrule){
      this.factory_drule_status = 'In Active';
      let dstatus = "On"
      this.factoryDrule.activateFactoryDruleS(dstatus, this.factory_drule_id).subscribe(response =>{
        this.ngOnInit();
      });
    }else{
      this.factory_drule_status = 'Active';
      let dstatus = "Off"
      this.factoryDrule.activateFactoryDruleS(dstatus, this.factory_drule_id).subscribe( response =>{
        this.ngOnInit();
      });      
    }      
  }

}


// delete method
deleteFactorydrule(){
  this.factoryDrule.deleteFactorydruleS(this.factory_drule_id).subscribe(response=>{
    this.othersService.reloadCurrentRoute();
  })
}

displayNoRecords:boolean;
// this method for searching the table
 search(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  if(this.dataSource.filteredData.length==0){
    this.displayNoRecords=true;
  }else{
    this.displayNoRecords=false;

  }
}

}
