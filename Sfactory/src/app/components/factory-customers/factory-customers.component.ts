import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { NavbarService } from '../../components/navbar/_services/navbar.service';
import { AuthService } from '../login/_services/auth.service';
import { SnackbarComponent } from '../../components/others/snackbar/snackbar.component';
import { FactorycustomersService } from './_services/factorycustomers.service';
import { DecimalPipe } from '@angular/common';
import { OthersService } from '../others/_services/others.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'factory-customers',
  templateUrl: './factory-customers.component.html',
  styleUrls: ['./factory-customers.component.scss'],
  providers: [DecimalPipe]
})
export class FactoryCustomersComponent implements OnInit {
  obs: Observable<any>;
  popup_title: string;
  customer_details: any = [];
  no_customer_details: boolean;
  custdetail_internalError: boolean = false;
  spinner :boolean= true;
  error_status= "Error";
  element:HTMLElement = document.getElementById('auto_trigger') as HTMLElement;

  public regex = '(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})';


  @ViewChild('select') select: MatSelect;
  filter = new FormControl('');

  cust_name = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  cust_addr = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  mobile_num = new FormControl('', [Validators.pattern('[1-9]{1}[0-9]{9}')]);
  web_url =  new FormControl('', [Validators.minLength(3), Validators.maxLength(40)]);
  email = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.email]);
  cust_type = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  cust_desc = new FormControl('', [Validators.minLength(3), Validators.maxLength(100)]);
  comp_name= new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);


 displayedColumns: string[] = ['sf_customer_website', 'sf_customer_email', 'sf_customer_name', 'sf_customer_type' ,'sf_company_name','action'];

  dataSource = new MatTableDataSource(this.customer_details);
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
  constructor(private navbarService: NavbarService,
    private changeDetectorRef: ChangeDetectorRef,    
    private snackBar: SnackbarComponent,
    private customerService: FactorycustomersService,    
    private othersService:OthersService,
    private cookieService: CookieService,
    public authService: AuthService
  ) { this.navbarService.Title = "Customers";
setInterval (() => {​​​​​​​​
this.element;
  }​​​​​​​​, 100);
  this.othersService.setTitle(this.navbarService.Title);

 }

  ngOnInit(): void {
    this.getCustomerDetails()
    this.userRolefunction()
  }

  customerEmail() {
    if (this.email.hasError('required')) {
      return 'You must enter a valid email !!';
    }
    if (this.email.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.email.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
    if (this.email.hasError('email')) {
      return 'Email must be a valid email address';
    }
  }
  customerName() {
    if (this.cust_name.hasError('required')) {
      return 'You must enter customer name !!';
    }
    if (this.cust_name.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.cust_name.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
  }

  customerAddrress() {
    if (this.cust_addr.hasError('required')) {
      return 'You must enter your customer address !!';
    }
    if (this.cust_addr.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.cust_addr.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
  }

  webURL() {
    if (this.web_url.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.web_url.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
    if (this.web_url.hasError('pattern')) {
      return 'Please enter the valid website URL !!';
    }
  }

  custType() {
    if (this.cust_type.hasError('required')) {
      return 'You must enter customer type !!';
    }
    if (this.cust_type.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.cust_type.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }

  }
  custdesc() {
    if (this.cust_desc.hasError('minlength')) {
      return 'Minimum 3 characters required !';
    }
    if (this.cust_desc.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !';
    }
  }

  compName() {​​​​​​​​
  if (this.comp_name.hasError('required')) {​​​​​​​​
      return 'You must enter your company name !!';
      }​​​​​​​​
  if (this.comp_name.hasError('minlength')) {​​​​​​​​
      return 'Minimum 3 characters required !!';
      }​​​​​​​​
  if (this.comp_name.hasError('maxlength')) {​​​​​​​​
        return 'Maximum 40 characters allowed !!';
      }​​​​​​​​
    }​​​​​​​​



  // This method will post the customer data by calling the API
  public disabled_enable_button : boolean;
  saveCustomers() {
    if (this.cust_name.status == 'INVALID' || this.cust_addr.status == 'INVALID' || this.cust_name.status == 'INVALID' || this.comp_name.status == 'INVALID'||
      this.mobile_num.status == 'INVALID' || this.email.status == 'INVALID' || this.cust_type.status == 'INVALID') {
      this.snackBar.top_snackbar("Enter all required Fields !!",this.error_status)
    }
    else {
      let add_cutomer = {}
      add_cutomer['fw_tenant_id'] = this.authService.currentUser['tenant_id'];
      add_cutomer['sf_customer_name'] = this.cust_name.value;
      add_cutomer['sf_customer_address'] = this.cust_addr.value;
      add_cutomer['sf_customer_mobile_no'] = this.mobile_num.value;
      add_cutomer['sf_customer_website'] = this.web_url.value;
      add_cutomer['sf_customer_email'] = this.email.value;
      add_cutomer['sf_customer_type'] = this.cust_type.value;
      add_cutomer['sf_customer_description'] = this.cust_desc.value;
      add_cutomer['sf_company_name'] = this.comp_name.value;
      add_cutomer['created_by'] = this.authService.currentUser['email']
      this.filter_emptystring(add_cutomer);
      let Posted_value = this.filter_emptystring(add_cutomer);
      this.disabled_enable_button = true; 
      this.customerService.postCustomerS(Posted_value).subscribe(response => {
        if (this.customerService.response_status == "Unsuccessful" ) { 
          this.disabled_enable_button = false;   
        }
        else if (this.customerService.response_status == "Successful" ) { 
          this.disabled_enable_button = false;   
          this.ngOnInit();
          this.cleardata();
        } 
      })
    }

  }
  filter_emptystring(data){
  // filtering code
   return Object.keys(data).filter(function (k) {
    return data[k] != null;
  }) .reduce(function (acc, k) {
    acc[k] = data[k];
    return acc;
  }, {});
  }

  // This method will get the customer data by calling the API
  getCustomerDetails() {
    this.customerService.getCustomerDetailsS().subscribe(response => {
      this.spinner=true;
      if (response['Unsuccessful']) {
        this.custdetail_internalError = true;
        this.spinner=false;
      }
      else {
        this.customer_details = response;
        if (this.customer_details.length == 0) {
          this.cookieService.set('customer_tguide', 'active', 300);
          this.no_customer_details = true;
          this.spinner=false
        } else {
          this.cookieService.set('customer_tguide', 'inactive', 300);
          this.no_customer_details = false;
          this.spinner=false;
        }
        this.dataSource.data = this.customer_details;
      }
    }, error => {
      this.custdetail_internalError = true;
      this.spinner=false;
    })
  }

  // this method will reset the form data.
  cleardata() {
    this.cust_name.reset();
    this.cust_addr.reset();
    this.mobile_num.reset();
    this.web_url.reset();
    this.email.reset();
    this.cust_type.reset();
    this.cust_desc.reset();
    this.comp_name.reset();
  }


  // tour guide View method 
  customer_view(){
    if( this.authService.currentUser['role_id'] == 'PV1001' || this.authService.currentUser['role_id'] == 'WCV1001' || this.authService.currentUser['role_id'] == 'ASA1001' || this.authService.currentUser['role_id'] == 'ASV1001'|| this.authService.currentUser['role_id'] == 2){
      this.customerInfo(this.customer_details[0])
    }
  }
    // this method will edit the customer details.
customer_id;
  customerInfo(data){
    this.customer_id = data['sf_customer_id'];
    this.cust_addr.setValue(data['sf_customer_address']);
    this.cust_desc.setValue(data['sf_customer_description']);
    this.email.setValue(data['sf_customer_email']);
    this.mobile_num.setValue(data['sf_customer_mobile_no']);
    this.cust_name.setValue(data['sf_customer_name']);
    this.cust_type.setValue(data['sf_customer_type']);
    this.web_url.setValue(data['sf_customer_website']);
    this.comp_name.setValue(data['sf_company_name']);
  }

  // this method will update the customer details.
  updateCustomerinfo(){
    if (this.cust_name.status == 'INVALID' || this.cust_addr.status == 'INVALID' || this.cust_name.status == 'INVALID' ||
    this.mobile_num.status == 'INVALID' || this.comp_name.status == 'INVALID'||
    this.email.status == 'INVALID' || this.cust_type.status == 'INVALID') {
    this.snackBar.top_snackbar("Enter all required Fields !!",this.error_status)
  }
  else if(this.mobile_num.hasError('pattern')|| this.web_url.hasError('pattern')|| this.email.hasError('pattern')){
    this.snackBar.top_snackbar("Enter the correct details!!",this.error_status)
  }
  else {
    let update_cutomer = {}
    update_cutomer['fw_tenant_id'] = this.authService.currentUser['tenant_id'];
    update_cutomer['sf_customer_name'] = this.cust_name.value;
    update_cutomer['sf_customer_address'] = this.cust_addr.value;
    update_cutomer['sf_customer_mobile_no'] = this.mobile_num.value;
    update_cutomer['sf_customer_website'] = this.web_url.value;
    update_cutomer['sf_customer_email'] = this.email.value;
    update_cutomer['sf_customer_type'] = this.cust_type.value;
    update_cutomer['sf_customer_description'] = this.cust_desc.value;
    update_cutomer['sf_company_name'] = this.comp_name.value;
    update_cutomer['updated_by'] = this.authService.currentUser['email'];
    this.customerService.putCustomerdeatilS( this.customer_id ,update_cutomer).subscribe(response => {
      this.ngOnInit();
    })
  }
  }

  // this method will delete particular customer details by passing the customer id.
  deleteCustomer(){
    this.customerService.deleteCustomerS(this.customer_id).subscribe(response=>{
      this.othersService.reloadCurrentRoute();
    })
  }

  // this method is used to disable the add edit and delete button for viewer roles
  public addbutton = true
  userRolefunction() {
    if (this.authService.currentUser['role_id'] == 2  ||this.authService.currentUser['role_id'] == 'PV1001' || this.authService.currentUser['role_id'] == 'WCV1001' || this.authService.currentUser['role_id'] == 'ASV1001' || this.authService.currentUser['role_id'] == 'ASA1001') {
      this.cust_name.disable()
      this.comp_name.disable()
      this.cust_addr.disable()
      this.mobile_num.disable()
      this.web_url.disable()
      this.email.disable()
      this.cust_type.disable()
      this.cust_desc.disable()
      this.addbutton = false
    }
    else if (this.authService.currentUser['role_id'] == 1 ||this.authService.currentUser['role_id'] == "MV1001" || this.authService.currentUser['role_id'] == "PA1001" || this.authService.currentUser['role_id'] == 'WCA1001' ) {
      this.cust_name.enable()
      this.comp_name.enable()
      this.cust_addr.enable()
      this.mobile_num.enable()
      this.web_url.enable()
      this.email.enable()
      this.cust_type.enable()
      this.cust_desc.enable()
      this.addbutton = true
    }
  }

  // this method for searching the table
  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  callfunction_req(){
    this.popup_title = 'Add Customer';
    if(this.authService.currentUser['role_id'] == 2  ||this.authService.currentUser['role_id'] == 'PV1001' || this.authService.currentUser['role_id'] == 'WCV1001' || this.authService.currentUser['role_id'] == 'ASV1001' || this.authService.currentUser['role_id'] == 'ASA1001' ){
      this.customer_view();
    }
    if(this.authService.currentUser['role_id'] == 1 ||this.authService.currentUser['role_id'] == "MV1001" || this.authService.currentUser['role_id'] == "PA1001" || this.authService.currentUser['role_id'] == 'WCA1001'){
    this.cleardata();
  }
  }
}
