import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { AuthService } from '../login/_services/auth.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { SnackbarComponent } from '../../components/others/snackbar/snackbar.component';
import { WorkorderService } from '../../components/workorders/_services/workorder.service';
import { NavbarService } from '../../components/navbar/_services/navbar.service';
import { FactorycustomersService } from '../factory-customers/_services/factorycustomers.service';
import {​​​​​​​​ UsersService }​​​​​​​​ from'../users/_services/users.service';
import { OthersService } from '../others/_services/others.service';
import { CookieService } from 'ngx-cookie-service';
import { Title } from '@angular/platform-browser';
import { PartservicesService } from '../partmanagement/_services/partservices.service';



interface priority {
  name: string;
}

@Component({
  selector: 'workorders',
  templateUrl: './workorders.component.html',
  styleUrls: ['./workorders.component.scss'],
  providers: [DecimalPipe]
})
export class WorkordersComponent implements OnInit {
 

  obs: Observable<any>;
  popup_title: string;
  workorder_details: any = [];
  no_wordorder_details: boolean;
  wordorder_internalError: boolean = false;
  spinner :boolean=true;
  minDate = new Date();
  cust_list:any=[];
  customerList_internalError:boolean;
  no_customer:boolean;
  workorder_partcode: any =[];
  no_workorder_partcode :boolean;
  workorder_partcode_internalerror : boolean = false
  error_status= "Error";
  part_lead_time_mins : any;
  element:HTMLElement = document.getElementById('auto_trigger') as HTMLElement;

  Priority: priority[] = [
    { name: 'High'},
    { name: 'Medium'},
    { name: 'Low'}
  ];
  @ViewChild('select') select: MatSelect;
  filter = new FormControl('');

  work_order_owner = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  work_order_name  = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  work_order_code = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  desc  = new FormControl('', [Validators.minLength(3), Validators.maxLength(100)]);
  cust_name   = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  work_order_qty  = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  time_estimation  = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  start_date  = new FormControl(new Date(), [Validators.required]);
  startDate:Date = new Date();
  end_date  = new FormControl('', [Validators.required]);
  sf_priority = new FormControl('', [Validators.required]);
  status = new FormControl('notstarted', [Validators.required]);
  part_code = new FormControl('', [Validators.required]);
  batch_num = new FormControl('', [Validators.required,Validators.minLength(3), Validators.maxLength(40)]);
  lot_num = new FormControl('', [Validators.required,Validators.minLength(3), Validators.maxLength(40)]);
  sales_ordr_num = new FormControl('', [Validators.required,Validators.minLength(3), Validators.maxLength(40)]);
  userlist:any=[];
  Userlist_internalError:boolean;
  no_user:boolean;

  displayedColumns: string[] = ['sf_customer_name','work_order_name', 'work_order_code','part_code','sf_priority', 'status', 'workorder_owner', 'work_order_qty', 'start_date','end_date', 'action'];
  dataSource = new MatTableDataSource(this.workorder_details);
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
    private wordorderService: WorkorderService,
    private customerService:FactorycustomersService,
    private usersService: UsersService,    
    private othersService: OthersService,
    private cookieService: CookieService,
    public authService: AuthService,
    public datepipe: DatePipe,
    private partservicesService : PartservicesService
  ) {
    this.navbarService.Title = "Work Order";

  setInterval (() => {​​​​​​​​
    this.element;
      }​​​​​​​​, 100);this.othersService.setTitle(this.navbarService.Title);
     }

 
  ngOnInit(): void {
    this.getWorkOrderDetails();
    this.getCustomerList();
    this.userRoleFunction();
    this.getUserList();
    this.getPartCode();
  }

 

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();
  }

  status_select:any  = [
    { value: 'notstarted', viewValue: 'Yet to Start' },
    { value: 'inprogress', viewValue: 'In Progress' },
    { value: 'completed', viewValue: 'Completed' },
    { value: 'cancel', viewValue: 'Cancel' },
    { value: 'expired', viewValue: 'Pending' },
  ];

//  Error messages
  custdesc() {
    if (this.desc.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.desc.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
  }

  workorderEror() {
    if (this.work_order_owner.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.work_order_owner.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
    if(this.work_order_owner.touched) {
      return 'Please choose workorder owner !!'
    }
  }

  partCodeError() {
  if(this.part_code.touched) {
      return 'Please choose Part Code !!'
    }
  }

  work_order_nameError(){
    if (this.work_order_name.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.work_order_name.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
    if(this.work_order_name.touched) {
      return 'Please enter workorder name !!'
    }
  }
  work_order_codeerror(){
    if (this.work_order_code.hasError('required')) {
      return 'Please enter workorder code !!';
    }
    if (this.work_order_code.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.work_order_code.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
    if(this.work_order_code.invalid){
      return 'Work Order Code Already Exists !!'
    }
  }
  work_order_qtyerror(){
    if (this.work_order_qty.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.work_order_qty.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
    if(this.work_order_qty.touched) {
      return 'Please enter quantity !!'
    }
  }
  time_estimationerror(){
    if (this.time_estimation.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.time_estimation.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
    if(this.time_estimation.touched) {
      return 'Please enter time estimation !!'
    }
  }
  statuserror(){
    if(this.status.touched) {
      return 'Please choose status !!'
    }
  }
  batch_numError(){
    if(this.batch_num.hasError('required')) {
      return 'Please enter Batch Number !!'
    }
    if (this.batch_num.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.batch_num.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
    if(this.batch_num.invalid){
      return 'Batch Number Already Exists !!'
    }
  }
  lot_numError(){
    if (this.lot_num.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.lot_num.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
    if(this.lot_num.touched) {
      return 'Please enter the Lot Number !!'
    }
  }
  sales_Order_numberError(){
    if (this.sales_ordr_num.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.sales_ordr_num.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
    if(this.sales_ordr_num.touched) {
      return 'Please enter the Sales Order Number !!'
    }
  }
public leadTime:any
partleadtime:any

   // This function is display all part code. 
  getPartCode(){
    this.partservicesService.getTenantParentPartCodeS().subscribe(response => {
      this.leadTime = response
     if (response['Unsuccessful']) {
        this.wordorder_internalError = true;
      }
      else {
        this.workorder_partcode = response;
        if (this.workorder_partcode.length == 0) {
          this.no_workorder_partcode = true;
       } 
       else {
        this.no_workorder_partcode = false;
      }
      }
    }, error => {
      this.wordorder_internalError = true;
   })
        
    }


    // This function is display  “Time estimated” should be calculated based on the lead time configured in the sf_part table. 
    time_estimated_calculate(part_lead_time_mins){
      if(part_lead_time_mins>61){
        var hours = (part_lead_time_mins / 60);
        this.time_estimation.setValue(Math.round(hours * this.work_order_qty.value))  
        }else{
          this.time_estimation.setValue(Math.round(part_lead_time_mins * this.work_order_qty.value))
        }
    }

   // This function will display  qty should not exceed work order quantity.
  
    quantityCheck(data:any) {
      let quantity = data.target.value;
      if( this.part_lead_time_mins>61){
        var hours = ( this.part_lead_time_mins / 60);
        let calculate = hours * quantity
        this.time_estimation.setValue( Math.round(calculate))  
        }else{
          this.time_estimation.setValue( Math.round(this.part_lead_time_mins *quantity))
        }
    }


 // Check if the work code is already existing in the DB.
  validateWorkCode(data){
      if(this.workorder_details.find((x) => x.work_order_code === data)) { 
        this.work_order_code.setErrors({ 'incorrect': true});
      } else {
      }
    }

     // Check if the Batch Number is already existing in the DB.
     batchNum_error:boolean = false;
     validateBatchNum(data){
    if(this.workorder_details.find((x) => x.batch_number === data)) { 
      this.batch_num.setErrors({ 'incorrect': true});
      this.batchNum_error = true;
    } else {
      this.batchNum_error = false;
    }
  }

  // This method will post the customer data by calling the API
  public disabled_enable_button : boolean;
  saveWorkOrder(){
    if (this.cust_name.status == 'INVALID' || this.work_order_name.status == 'INVALID' ||
      this.work_order_code.status == 'INVALID' || this.desc.status == 'INVALID' ||
      this.work_order_qty.status == 'INVALID' || this.time_estimation.status == 'INVALID' ||
      this.start_date.status == null || this.end_date.status == null  ||
      this.start_date.status == 'INVALID' || this.end_date.status == 'INVALID' ||
      this.sf_priority.status =='INVALID' || this.part_code.status == 'INVALID') {
      this.snackBar.top_snackbar("Enter all required Fields !!",this.error_status)
    }else if( this.status.value == 'expired' || this.status.value == 'inprogress' && this.end_date.value < new Date().toISOString().slice(0, 10) == true){ 
      this.snackBar.top_snackbar("Enter valid start date and end date!!",this.error_status)
    } else if(this.batchNum_error == true){
      this.snackBar.top_snackbar("Batch Number already exists, Enter valid Batch Number!!",this.error_status)
    }else if(this.batch_num.hasError('minlength') || this.batch_num.hasError('maxlength')){
      this.snackBar.top_snackbar(" Enter valid Batch Number!!",this.error_status)
    }   else if(this.lot_num.hasError('minlength') || this.lot_num.hasError('maxlength')){
      this.snackBar.top_snackbar(" Enter valid Lot Number!!",this.error_status)
    }else if(this.sales_ordr_num.hasError('minlength') || this.sales_ordr_num.hasError('maxlength')){
      this.snackBar.top_snackbar(" Enter valid Sales Order Number!!",this.error_status)
    }
    else{
      let add_wrkorder = {}
      add_wrkorder['fw_tenant_id'] = this.authService.currentUser['tenant_id'];
      add_wrkorder['sf_customer_id'] = this.cust_name.value;
      add_wrkorder['sf_priority'] = this.sf_priority.value;
      add_wrkorder['work_order_code'] = this.work_order_code.value;
      add_wrkorder['work_order_name'] = this.work_order_name.value;
      add_wrkorder['description'] = this.desc.value;
      add_wrkorder['status'] = "notstarted";
      add_wrkorder['workorder_owner'] = this.work_order_owner.value;
      add_wrkorder['work_order_qty'] = this.work_order_qty.value;
      add_wrkorder['time_estimated_hours'] = this.time_estimation.value;
      add_wrkorder['start_date'] = this.datepipe.transform( this.start_date.value, 'yyyy-MM-dd');
      add_wrkorder['end_date'] = this.datepipe.transform( this.end_date.value, 'yyyy-MM-dd');
      add_wrkorder['sf_part_id'] = this.part_code.value;
      add_wrkorder['sf_batch_number'] = this.batch_num.value;
      add_wrkorder['sf_lot_number'] = this.lot_num.value;
      add_wrkorder['sf_sales_order_number'] = this.sales_ordr_num.value;
      add_wrkorder['created_by'] = this.authService.currentUser['email']
      this.disabled_enable_button = true; 
      this.wordorderService.postWorkOrdersS(add_wrkorder).subscribe(response => {
        if (this.wordorderService.response_status == "Unsuccessful" ) { 
          this.disabled_enable_button = false;   
        }
        else if (this.wordorderService.response_status == "Successful" ) { 
          this.disabled_enable_button = false;   
          this.ngOnInit();
          this.cleardata();
        }
    })
    }

  }

 public status_dropdwon : boolean
   // this method will reset the form data.
   cleardata() {
    this.cust_name.reset();
    this.work_order_name.reset();
    this.work_order_code.reset();
    this.desc.reset();
    this.work_order_qty.reset();
    this.time_estimation.reset();
    this.start_date .reset();
    this.end_date.reset();
    this.work_order_owner.reset();
    this.sf_priority.reset();
    this.status.reset();
    this.enableForm();
    this.status_dropdwon = false
    this.part_code.reset();
    this.startDate = new Date();
    this.lot_num.reset();
    this.batch_num.reset();
    this.sales_ordr_num.reset();
  }
  public complete_status : boolean
  public edit_status : boolean
  // This method will get the customer data by calling the API
  getWorkOrderDetails() {
    this.wordorderService.getWorkOrderDetailsS().subscribe(response => {
      this.spinner=true;
      if (response['Unsuccessful']) {
        this.wordorder_internalError = true;
        this.spinner=false;
      }
      else {
        this.workorder_details = response;

        if (this.workorder_details.length == 0) {
          this.cookieService.set('wo_tguide', 'active', 300);
          this.no_wordorder_details = true;
          this.spinner=false
        } else{
          this.cookieService.set('wo_tguide', 'inactive', 300);
          this.no_wordorder_details = false;
          this.spinner=false;
        }
        this.dataSource.data = this.workorder_details;
      }
    }, error => {
      this.wordorder_internalError = true;
      this.spinner=false;
    })
  }

  // This method will get all the customer detail lists by tenant ID
  getCustomerList(){
    this.customerService.getCustomerListS().subscribe(response=>{
      if (response['Unsuccessful']) {
        this.customerList_internalError = true;
      } else {
        this.cust_list = response
        if (this.cust_list.length == 0) {
          this.no_customer = true;
        } else {
          this.no_customer = false;
        }
      }
    }, error => {
      this.customerList_internalError = true;
    })
  }


  
// tour guide View method 
  workorder_view(){
    if( this.authService.currentUser['role_id'] == 'PV1001' || this.authService.currentUser['role_id'] == 'WCV1001' || this.authService.currentUser['role_id'] == 'ASV1001' || this.authService.currentUser['role_id'] == 'MV1001'|| this.authService.currentUser['role_id'] == 2){
      this.workOrderInfo(this.workorder_details[0])
    }
  }
  // this method will edit the customer details.
  work_order_id;
  toSelect;
  public status_progress;
  public selected_status:string;
  workOrderInfo(data:any){
    this.cust_name.setValue(data['sf_customer_id']);
    this.work_order_id = data['sf_workorder_id'];
    this.start_date.setValue(data['start_date']);
    this.startDate = data['start_date'];
    this.time_estimation.setValue(data['time_estimated_hours']);
    this.desc.setValue(data['description']);
    this.work_order_qty.setValue(data['work_order_qty']);
    this.work_order_code.setValue(data['work_order_code']);
    this.work_order_name.setValue(data['work_order_name']);
    this.work_order_owner.setValue(data['workorder_owner']);
    this.end_date.setValue(data['end_date']);
    this.status_dropdwon = true ;
    this.toSelect = this.Priority.find(c => c.name == data['sf_priority']);
    this.sf_priority.setValue(this.toSelect.name); 
    this.part_code.setValue(data['part_id']);
    this.status.setValue(data['status']);
    this.status_progress = data['status'];
    this.batch_num.setValue(data['batch_number']);
    this.lot_num.setValue(data['lot_number']);
    this.sales_ordr_num.setValue(data['sales_order_number']);
    this.part_lead_time_mins=data['part_lead_time'];
    this.ngOnInit()
  }


  // this method will update the customer details.
  updatewrkOrderinfo(){
    if (this.cust_name.status == 'INVALID' || this.work_order_name.status == 'INVALID' ||  
    this.work_order_code.status == 'INVALID' || this.desc.status == 'INVALID' || this.work_order_owner.status == 'INVALID'||
    this.work_order_qty.status == 'INVALID' || this.time_estimation.status == 'INVALID' || this.start_date.status == null ||
    this.end_date.status == null || this.sf_priority.status =='INVALID'|| this.status.status =='INVALID' ||
    this.start_date.status == 'INVALID' || this.end_date.status == 'INVALID' ||this.part_code.status == 'INVALID'){
    this.snackBar.top_snackbar("Enter all required Fields !!",this.error_status)
  }  else if((this.status.value != 'expired' && this.status.value != 'completed') && this.end_date.value < new Date().toISOString().slice(0, 10) == true){ 
    this.snackBar.top_snackbar("Enter valid start date and end date!!",this.error_status)

  } 
  else if(this.status.value == 'cancel' && this.end_date.value < new Date().toISOString().slice(0, 10) == true){ 
    this.snackBar.top_snackbar("Enter valid start date and end date!!",this.error_status)
  }
  else if(this.batchNum_error == true){
    this.snackBar.top_snackbar("Batch Number already exists, Enter valid Batch Number!!",this.error_status)
  }else if(this.batch_num.hasError('minlength') || this.batch_num.hasError('maxlength')){
    this.snackBar.top_snackbar(" Enter valid Batch Number!!",this.error_status)
  }else if(this.lot_num.hasError('minlength') || this.lot_num.hasError('maxlength')){
    this.snackBar.top_snackbar(" Enter valid Lot Number!!",this.error_status)
  }else if(this.sales_ordr_num.hasError('minlength') || this.sales_ordr_num.hasError('maxlength')){
    this.snackBar.top_snackbar(" Enter valid Sales Order Number!!",this.error_status)
  }else {
    let update_wrkorder = {}
    update_wrkorder['fw_tenant_id'] = this.authService.currentUser['tenant_id'];
    update_wrkorder['sf_customer_id'] = this.cust_name.value;
    update_wrkorder['sf_priority'] = this.sf_priority.value;
    update_wrkorder['work_order_code'] = this.work_order_code.value;
    update_wrkorder['work_order_name'] = this.work_order_name.value;
    update_wrkorder['description'] = this.desc.value;
    update_wrkorder['status'] = this.status.value;
    update_wrkorder['workorder_owner'] = this.work_order_owner.value;
    update_wrkorder['work_order_qty'] = this.work_order_qty.value;
    update_wrkorder['time_estimated_hours'] = this.time_estimation.value;
    update_wrkorder['start_date'] = this.datepipe.transform( this.start_date.value, 'yyyy-MM-dd');
    update_wrkorder['end_date'] = this.datepipe.transform( this.end_date.value, 'yyyy-MM-dd');
    update_wrkorder['sf_part_id'] = this.part_code.value;
    update_wrkorder['sf_batch_number'] = this.batch_num.value;
    update_wrkorder['sf_lot_number'] = this.lot_num.value;
    update_wrkorder['sf_sales_order_number'] = this.sales_ordr_num.value;
    update_wrkorder['updated_by'] = this.authService.currentUser['email']
    this.wordorderService.putWorkOrderDetailS(this.work_order_id ,update_wrkorder).subscribe(response => {
      this.ngOnInit();
      
    })
  }

  }

  // this method will delete particular customer details by passing the customer id.
  deleteWorkOrder(){
    this.wordorderService.deleteWorkOrderS(this.work_order_id).subscribe(response=>{
      this.othersService.reloadCurrentRoute();
    })
  }

  viewDisabled:boolean;
  // this method is used to disable the add edit and delete button for viewer roles
  public addbutton = true;
  userRoleFunction() {
  
    if (this.authService.currentUser['role_id'] == 1  || this.authService.currentUser['role_id'] == "PA1001" || this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'ASA1001') {
       if(this.status_progress =="completed"){
        this.disabledForm();
      }
      else if( this.status_progress == 'inprogress' ||this.status_progress == 'In Progress' || this.status_progress == 'expired'){
        this.work_order_name.disable();
        this.work_order_code.disable();
        this.part_code.disable();
        this.work_order_qty.enable();
        this.time_estimation.disable();
        this.cust_name.disable();
        this.status.enable();
        this.sf_priority.enable();
        this.work_order_owner.enable();
        this.desc.enable();
        this.start_date.enable();
        this.end_date.enable();
      }
      else if(this.status_progress =="cancel"){
        this.cust_name.disable();
        this.work_order_qty.disable();
        this.work_order_name.disable();
        this.work_order_code.disable();
        this.sf_priority.disable();
        this.work_order_owner.disable();
        this.desc.disable();
        this.time_estimation.disable();
        this.start_date.enable();
        this.end_date.enable();
        this.part_code.disable()
        this.status.enable();
      }
      else if(this.status_progress == 'notstarted'){
        this.enableForm();
      }
      this.addbutton = true;
     }

  else if (this.authService.currentUser['role_id'] == 2 ||this.authService.currentUser['role_id'] == "MV1001"||this.authService.currentUser['role_id'] == 'PV1001' || this.authService.currentUser['role_id'] == 'WCV1001' || this.authService.currentUser['role_id'] == 'ASV1001') {
    this.disabledForm();
    this.addbutton = false;
   }
  }


 // This method will disabled form control fields 
  disabledForm(){
    this.cust_name.disable();
    this.work_order_qty.disable();
    this.work_order_name.disable();
    this.work_order_code.disable();
    this.status.disable();
    this.sf_priority.disable();
    this.work_order_owner.disable();
    this.desc.disable();
    this.time_estimation.disable();
    this.start_date.disable();
    this.end_date.disable();
    this.part_code.disable();
    this.lot_num.disable();
    this.batch_num.disable();
    this.sales_ordr_num.disable();
  }
  
   // This method will enable form control fields 
  enableForm(){
    this.cust_name.enable();
    this.work_order_name.enable();
    this.work_order_code.enable();
    this.status.enable();
    this.sf_priority.enable();
    this.work_order_owner.enable();
    this.desc.enable();
    this.time_estimation.enable();
    this.start_date.enable();
    this.end_date.enable();
    this.part_code.enable()
    this.work_order_qty.enable();
    this.lot_num.enable();
    this.batch_num.enable();
    this.sales_ordr_num.enable();
  }
  // this method for searching the table
  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


// This method will get all the user detail lists by tenant ID
getUserList(){
  this.usersService.getTenantUsersListS().subscribe(response=>{
    if (response['Unsuccessful']) {
      this.Userlist_internalError = true;
    } else {
      this.userlist = response
      if (this.userlist.length == 0) {
        this.no_user = true;
      } else {
        this.no_user = false;
      }
    }
  }, error => {
    this.Userlist_internalError = true;
  })
}


//This method is to capture the start date value on date change
// startlatestDate:any;
// OnstartDateChange(data){
//   this.startlatestDate= data;
//   if(this.startlatestDate == this.startlatestDate ){
//     this.OnendDateChange(this.endlatestDate)
//   }
  
// }
//This method is to capture the end date value on date change and calculate the hour difference between the start and end date.
// endlatestDate:any;
// diffstartandend:any;
// estimatedtimediff:any;
// rhours:any
// OnendDateChange(data){
// this.endlatestDate= data;
// this.diffstartandend = (this.endlatestDate.getTime() - this.startlatestDate.getTime()) / 1000
// this.estimatedtimediff = Math.floor(this.diffstartandend/60)
// var hours = (this.estimatedtimediff / 60);
// this.rhours = Math.floor(hours);
// this.time_estimation.setValue(this.rhours)


// }
// submitbtnDisable:boolean=false;
// timeEstimationChange(data){
//   let currentvalue = this.rhours
//   this.time_estimation.valueChanges.subscribe(data1 => {
//     if(data1 >  currentvalue){
//       this.snackBar.top_snackbar("Estimated Time is exceeding the date!!",this.error_status);
//       this.submitbtnDisable= true;
//     }else if(data1 == data1){
//       this.submitbtnDisable= false
//     }
//   })
// }

}