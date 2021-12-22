import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { NavbarService } from '../navbar/_services/navbar.service';
import { PartservicesService } from '../partmanagement/_services/partservices.service';
import { AuthService } from '../login/_services/auth.service';
import { SnackbarComponent } from '../others/snackbar/snackbar.component';
import { OthersService } from '../others/_services/others.service';
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';
import { SimulatorService } from '../simulator/_services/simulator.service';


interface makeprocess {
  value: string;
  viewValue: string;
}
interface currencyList {
  code: any
  text: any
}
@Component({
  selector: 'partmanagement',
  templateUrl: './partmanagement.component.html',
  styleUrls: ['./partmanagement.component.scss']
})
export class PartmanagementComponent implements OnInit {
  obs: Observable<any>;
  filter = new FormControl('');
  popup_title:string;
  if_child: boolean = false;
  part_management:any = [];
  internalError:boolean = false;
  spinner: boolean = true;
  no_partmgmt: boolean;
  parent_partCode:any=[];
  parent_p_code_internalError:boolean;
  no_parent_part_code:boolean;
  error_status= "Error";
  selected ="Tableview"
  element:HTMLElement = document.getElementById('auto_trigger') as HTMLElement;

  make_process: makeprocess[] = [
    {value: '0', viewValue: 'Parallel'},
    {value: '1', viewValue: 'Sequence'},
  ];
  CurrencyList: currencyList[] = [
    {code:"AFN",text:"Afghanistan Afghanis – AFN"},
    {code:"ALL",text:"Albania Leke – ALL"},
    {code:"DZD",text:"Algeria Dinars – DZD"},
    {code:"ARS",text:"Argentina Pesos – ARS"},
    {code:"AUD",text:"Australia Dollars – AUD"},
    {code:"ATS",text:"Austria Schillings – ATS"},
    {code:"BSD",text:"Bahamas Dollars – BSD"},
    {code:"BHD",text:"Bahrain Dinars – BHD"},
    {code:"BDT",text:"Bangladesh Taka – BDT"},
    {code:"BBD",text:"Barbados Dollars – BBD"},
    {code:"BEF",text:"Belgium Francs – BEF"},
    {code:"BMD",text:"Bermuda Dollars – BMD"},
    {code:"BRL",text:"Brazil Reais – BRL"},
    {code:"BGN",text:"Bulgaria Leva – BGN"},
    {code:"CAD",text:"Canada Dollars – CAD"},
    {code:"XOF",text:"CFA BCEAO Francs – XOF"},
    {code:"XAF",text:"CFA BEAC Francs – XAF"},
    {code:"CLP",text:"Chile Pesos – CLP"},
    {code:"CNY",text:"China Yuan Renminbi – CNY"},
    {code:"COP",text:"Colombia Pesos – COP"},
    {code:"XPF",text:"CFP Francs – XPF"},
    {code:"CRC",text:"Costa Rica Colones – CRC"},
    {code:"HRK",text:"Croatia Kuna – HRK"},
    {code:"CYP",text:"Cyprus Pounds – CYP"},
    {code:"CZK",text:"Czech Republic Koruny – CZK"},
    {code:"DKK",text:"Denmark Kroner – DKK"},
    {code:"DEM",text:"Deutsche (Germany) Marks – DEM"},
    {code:"DOP",text:"Dominican Republic Pesos – DOP"},
    {code:"NLG",text:"Dutch (Netherlands) Guilders - NLG"},
    {code:"XCD",text:"Eastern Caribbean Dollars – XCD"},
    {code:"EGP",text:"Egypt Pounds – EGP"},
    {code:"EEK",text:"Estonia Krooni – EEK"},
    {code:"EUR",text:"Euro – EUR"},
    {code:"FJD",text:"Fiji Dollars – FJD"},
    {code:"FIM",text:"Finland Markkaa – FIM"},
    {code:"FRF",text:"France Francs – FRF"},
    {code:"DEM",text:"Germany Deutsche Marks – DEM"},
    {code:"XAU",text:"Gold Ounces – XAU"},
    {code:"GRD",text:"Greece Drachmae – GRD"},
    {code:"GTQ",text:"Guatemalan Quetzal – GTQ"},
    {code:"NLG",text:"Holland (Netherlands) Guilders – NLG"},
    {code:"HKD",text:"Hong Kong Dollars – HKD"},
    {code:"HUF",text:"Hungary Forint – HUF"},
    {code:"ISK",text:"Iceland Kronur – ISK"},
    {code:"XDR",text:"IMF Special Drawing Right – XDR"},
    {code:"INR",text:"India Rupees – INR"},
    {code:"IDR",text:"Indonesia Rupiahs – IDR"},
    {code:"IRR",text:"Iran Rials – IRR"},
    {code:"IQD",text:"Iraq Dinars – IQD"},
    {code:"IEP",text:"Ireland Pounds – IEP"},
    {code:"ILS",text:"Israel New Shekels – ILS"},
    {code:"ITL",text:"Italy Lire – ITL"},
    {code:"JMD",text:"Jamaica Dollars – JMD"},
    {code:"JPY",text:"Japan Yen – JPY"},
    {code:"JOD",text:"Jordan Dinars – JOD"},
    {code:"KES",text:"Kenya Shillings – KES"},
    {code:"KRW",text:"Korea (South) Won – KRW"},
    {code:"KWD",text:"Kuwait Dinars – KWD"},
    {code:"LBP",text:"Lebanon Pounds – LBP"},
    {code:"LUF",text:"Luxembourg Francs – LUF"},
    {code:"MYR",text:"Malaysia Ringgits – MYR"},
    {code:"MTL",text:"Malta Liri – MTL"},
    {code:"MUR",text:"Mauritius Rupees – MUR"},
    {code:"MXN",text:"Mexico Pesos – MXN"},
    {code:"MAD",text:"Morocco Dirhams – MAD"},
    {code:"NLG",text:"Netherlands Guilders – NLG"},
    {code:"NZD",text:"New Zealand Dollars – NZD"},
    {code:"NOK",text:"Norway Kroner – NOK"},
    {code:"OMR",text:"Oman Rials – OMR"},
    {code:"PKR",text:"Pakistan Rupees – PKR"},
    {code:"XPD",text:"Palladium Ounces – XPD"},
    {code:"PEN",text:"Peru Nuevos Soles – PEN"},
    {code:"PHP",text:"Philippines Pesos – PHP"},
    {code:"XPT",text:"Platinum Ounces – XPT"},
    {code:"PLN",text:"Poland Zlotych – PLN"},
    {code:"PTE",text:"Portugal Escudos – PTE"},
    {code:"QAR",text:"Qatar Riyals – QAR"},
    {code:"RON",text:"Romania New Lei – RON"},
    {code:"ROL",text:"Romania Lei – ROL"},
    {code:"RUB",text:"Russia Rubles – RUB"},
    {code:"SAR",text:"Saudi Arabia Riyals – SAR"},
    {code:"XAG",text:"Silver Ounces – XAG"},
    {code:"SGD",text:"Singapore Dollars – SGD"},
    {code:"SKK",text:"Slovakia Koruny – SKK"},
    {code:"SIT",text:"Slovenia Tolars – SIT"},
    {code:"ZAR",text:"South Africa Rand – ZAR"},
    {code:"KRW",text:"South Korea Won – KRW"},
    {code:"ESP",text:"Spain Pesetas – ESP"},
    {code:"XDR",text:"Special Drawing Rights (IMF) – XDR"},
    {code:"LKR",text:"Sri Lanka Rupees – LKR"},
    {code:"SDD",text:"Sudan Dinars – SDD"},
    {code:"SEK",text:"Sweden Kronor – SEK"},
    {code:"CHF",text:"Switzerland Francs – CHF"},
    {code:"TWD",text:"Taiwan New Dollars – TWD"},
    {code:"THB",text:"Thailand Baht – THB"},
    {code:"TTD",text:"Trinidad and Tobago Dollars – TTD"},
    {code:"TND",text:"Tunisia Dinars – TND"},
    {code:"TRY",text:"Turkey New Lira – TRY"},
    {code:"AED",text:"United Arab Emirates Dirhams – AED"},
    {code:"GBP",text:"United Kingdom Pounds – GBP"},
    {code:"USD",text:"United States Dollars – USD"},
    {code:"VEB",text:"Venezuela Bolivares – VEB"},
    {code:"VND",text:"Vietnam Dong – VND"},
    {code:"ZMK",text:"Zambia Kwacha – ZMK"},
  ];
  constructor(private changeDetectorRef: ChangeDetectorRef,
    private navbarService: NavbarService,
    private partService : PartservicesService,
    public authService :AuthService,
    private snackbar :SnackbarComponent,
    private othersService: OthersService,
    private cookieService: CookieService,
    private routelocationInfo: Location,
    private simulatorService: SimulatorService,
    ) { 
      this.navbarService.Title = "Part / Item";
      setInterval (() => {
        this.element;
      }, 100);
      this.othersService.setTitle(this.navbarService.Title);
    }
  displayedColumns: string[] = ['part_code', 'part_name', 'part_lead_time_mins', 'part_parent_code', 'part_sales_price','part_qty_in_Stock', 'action'];
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

  dataSource = new MatTableDataSource(this.part_management);

  part_Code = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  part_name = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
  part_desc = new FormControl('', [Validators.minLength(3), Validators.maxLength(100)]);
  part_draw_url =  new FormControl('', [Validators.minLength(3), Validators.maxLength(40)]);
  p_lead_time = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(40)]);
  assembly_part = new FormControl('',[Validators.required]);
  parent_part = new FormControl('',[Validators.required]);
  parent_p_code= new FormControl('', [Validators.required,Validators.minLength(3), Validators.maxLength(40)]);
  is_buyable= new FormControl('', [Validators.required]);
  p_supplier_name= new FormControl('', [Validators.required,Validators.minLength(3), Validators.maxLength(40)]);
  supply_lead_time= new FormControl('', [Validators.required,Validators.minLength(1), Validators.maxLength(40)]);
  p_buy_price= new FormControl('', [Validators.minLength(3), Validators.maxLength(40)]);
  p_curr_code= new FormControl('', [Validators.minLength(3), Validators.maxLength(40)]);
  p_prod_cost= new FormControl('', [Validators.required,Validators.minLength(1), Validators.maxLength(40)]);
  p_prod_currency_code= new FormControl('', [Validators.required,Validators.minLength(3), Validators.maxLength(40)]);
  p_sales_cost= new FormControl('', [Validators.required,Validators.minLength(3), Validators.maxLength(40)]);
  p_sales_currency= new FormControl('', [Validators.required,Validators.minLength(3), Validators.maxLength(40)]);
  p_qnty_hand= new FormControl('', [Validators.minLength(3), Validators.maxLength(40)]);
  p_make_process= new FormControl('', [Validators.required]);
  p_supplier_modal_no = new FormControl('', [Validators.required,Validators.minLength(3), Validators.maxLength(40)]);
  p_supplier_price = new FormControl('', [Validators.required,Validators.minLength(3), Validators.maxLength(40)]);
  p_supplier_currency = new FormControl('', [Validators.required,Validators.minLength(3), Validators.maxLength(40)]);
  partmanagementvalue:any;



  
  // error messages.
  partCodeError() {
    if (this.part_Code.hasError('required')) {
      return 'You must  Part Code !!';
    }
    if (this.part_Code.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.part_Code.hasError('maxlength')) {
      return 'Minimum 40 characters allowed !!';
    }
    if(this.part_Code.invalid){
      return 'Part Code Already Exists !!'
    }
  }
  partNameErrorMessages() {
    if (this.part_name.hasError('required')) {
      return 'You must enter Part name !!';
    }
    if (this.part_name.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.part_name.hasError('maxlength')) {
      return 'Minimum 40 characters allowed !!';
    }
  }
  partDescErrorMessages() {
    if (this.part_desc.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.part_desc.hasError('maxlength')) {
      return 'Maximum 100 characters allowed !!';
    }
  }
  partMakeprocessErrorMessages() {
    if (this.p_make_process.hasError('required')) {
      return 'You must Choose Job Process !!';
    }
  }
  parentPartcodeErrorMessages(){
    if (this.parent_p_code.hasError('required')) {
      return 'You must Choose Job Process !!';
    } 
  }
  partLeadtimeErrorMessages(){
    if (this.p_lead_time.hasError('required')) {
      return 'You must enter Part Lead Time !!';
    }
    if (this.p_lead_time.hasError('minlength')) {
      return 'Minimum 1 characters required !!';
    }
    if (this.p_lead_time.hasError('maxlength')) {
      return 'Minimum 40 characters allowed !!';
    } 
  }
  ManufacturecostErrorMessages(){
    if (this.p_prod_cost.hasError('required')) {
      return 'You must enter Manufacture Cost !!';
    }
  }
  SalescostErrorMessages(){
    if (this.p_sales_cost.hasError('required')) {
      return 'You must enter Sales Cost !!';
    }
  }
  ManufacturecurrErrorMessages(){
    if (this.p_prod_currency_code.hasError('required')) {
      return 'You must Choose Manufacture Currency !!';
    }
  }
  supplierNameErrorMessages() {
    if (this.p_supplier_name.hasError('required')) {
      return 'You must Enter Supplier Name !!';
    }
    if (this.p_supplier_name.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.p_supplier_name.hasError('maxlength')) {
      return 'Minimum 40 characters allowed !!';
    }
  }
  supplierModelNumErrorMessages() {
    if (this.p_supplier_modal_no.hasError('required')) {
      return 'You must Enter Supplier Model Number !!';
    }
    if (this.p_supplier_modal_no.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.p_supplier_modal_no.hasError('maxlength')) {
      return 'Minimum 40 characters allowed !!';
    }
  }
  supplierLeadtimeErrorMessages(){
    if (this.supply_lead_time.hasError('required')) {
      return 'You must enter Supplier Lead Time !!';
    }
    if (this.supply_lead_time.hasError('minlength')) {
      return 'Minimum 1 characters required !!';
    }
    if (this.supply_lead_time.hasError('maxlength')) {
      return 'Minimum 40 characters allowed !!';
    } 
  }
  salesCurrErrorMessages(){
    if (this.p_sales_currency.hasError('required')) {
      return 'You must Choose Sales Currency !!';
    }
  }
  ngOnInit(): void {
    // if the Asset state is  added the get method is updated by calling refresh observable
    this.simulatorService.getRefreshNeededS().subscribe(()=>{
    this.get_part_mgmt();
    })
    this.get_part_mgmt();
    this.user_roles();
    this.getpartmanagementvalue();
  }

  ifChildPart(data){
    if(data.checked == true){
     this.if_child = true;
     this.p_sales_cost.disable();
     this.p_sales_currency.disable();
     this.parent_p_code.enable()
    }else{
      this.if_child = false;
      this.p_sales_cost.enable();
      this.p_sales_currency.enable();
      this.parent_p_code.disable()

    }
   
  }

  partmanagementtoggle($event: any) {
    localStorage.setItem("partmanagementvalue",$event.value)
  }
  getpartmanagementvalue(){
    this.partmanagementvalue = localStorage.getItem("partmanagementvalue");
    if(this.partmanagementvalue == undefined){
      this.partmanagementvalue = 'Tableview';
    }else{
      this.partmanagementvalue = localStorage.getItem("partmanagementvalue");
    }
  }
  // Check if the part code is already existing in the DB.
  validatepartcode(data){
    if(this.part_management.find((x) => x.part_code === data)) { 
      this.part_Code.setErrors({ 'incorrect': true});
    } else {
    }
  }
  
  enableSupplier_fields:boolean=false;
  ifPurchaseable(data){
    if(data.checked == true){
      this.enableSupplier_fields = true;
      this.p_supplier_name.enable();
      this.p_supplier_modal_no.enable();
      this.supply_lead_time.enable();
      this.p_supplier_price.enable();
      this.p_supplier_currency.enable();
      this.p_prod_cost.disable();
      this.p_prod_currency_code.disable();
      // this.p_prod_cost.reset();
      // this.p_prod_currency_code.reset();
    }else{
      this.enableSupplier_fields = false;
      this.p_supplier_name.disable();
      this.p_supplier_modal_no.disable();
      this.supply_lead_time.disable();
      this.p_supplier_price.disable();
      this.p_supplier_currency.disable();
      this.p_supplier_currency.reset();
      this.p_supplier_modal_no.reset();
      this.p_supplier_name.reset();
      this.p_supplier_price.reset();
      this.supply_lead_time.reset();
      this.p_prod_cost.enable();
      this.p_prod_currency_code.enable();
    }

  }


    // This method will CREATE an Asset.
    public posted_data =[];
    public disabled_enable_button : boolean;
    postPartManegment() {
      if (this.part_Code.status == "INVALID" || this.part_name.status == "INVALID"|| this.part_Code.hasError('required') || this.part_name.hasError('required')|| this.p_lead_time.hasError('required')||
        this.p_make_process.hasError('required')  || this.p_prod_cost.hasError('required') || this.p_prod_currency_code.hasError('required')) {
        this.snackbar.top_snackbar("Enter all required Fields !!",this.error_status)
      }
      else {
        if(this.if_child == true && this.parent_p_code.hasError('required')){
         this.snackbar.top_snackbar("Please Choose the Parent Part code",this.error_status)
        } else if(this.if_child == true && (this.part_Code.value == this.parent_p_code.value)){
          this.snackbar.top_snackbar("Child Part Code cannot be Same as Parent Part Code",this.error_status)
        } else if(this.enableSupplier_fields == true && (this.p_supplier_name.hasError('required') || this.p_supplier_modal_no.hasError('required')
        ||this.supply_lead_time.hasError('required')|| this.p_supplier_price.hasError('required')|| this.p_supplier_currency.hasError('required') || this.p_supplier_name.status == "INVALID" || this.p_supplier_modal_no.status == "INVALID"
        ||this.supply_lead_time.status == "INVALID"|| this.p_supplier_price.status == "INVALID"|| this.p_supplier_currency.status == "INVALID")){
          this.snackbar.top_snackbar("Please Enter Supplier Info",this.error_status)
        } else if(this.if_child == false && (this.p_sales_cost.hasError('required') || this.p_sales_currency.hasError('required') || this.p_sales_cost.status == "INVALID" || this.p_sales_currency.status == "INVALID")){
          this.snackbar.top_snackbar("Since you are creating Parent Part , please enter the Sales Cost and Currency ",this.error_status)
        } 
        else if( this.if_child == false && (this.p_sales_cost.value < this.p_prod_cost.value)){
          this.snackbar.top_snackbar("Manufacturing Cost is exceeding the Sales Cost !!",this.error_status)
        }
        else{
        let data = {}
        data['fw_tenant_id'] = this.authService.currentUser['tenant_id'];
        data['sf_tenant_id'] = this.authService.currentUser['tenant_id'];
        data['sf_part_code'] = this.part_Code.value;
        data['sf_part_name'] = this.part_name.value;
        data['sf_part_lead_time_mins'] = this.p_lead_time.value;
        data['sf_part_parent_code'] = this.parent_p_code.value;
        if(this.is_buyable.status == "INVALID" || ""){
          data['sf_part_is_purchasable'] = false;
        }else{
          data['sf_part_is_purchasable'] = this.is_buyable.value;
        }
        if(this.assembly_part.status == "INVALID" || ""){
          data['sf_part_is_assembled'] = false;
        }else{
          data['sf_part_is_assembled'] = this.assembly_part.value;
        }
        if(this.parent_part.status == "INVALID" || ""){
          data['sf_part_is_child'] = false;
        }else{
          data['sf_part_is_child'] = this.parent_part.value;
        }   
        data['sf_part_job_process'] = this.p_make_process.value; 
        data['sf_part_desc'] = this.part_desc.value
        data['sf_part_drawing_url'] = this.part_draw_url.value
        data['sf_part_manufacture_cost'] = this.p_prod_cost.value;
        data['sf_part_manufacture_currency'] = this.p_prod_currency_code.value;
        data['sf_part_sales_price'] = this.p_sales_cost.value;
        data['sf_part_sales_currency'] = this.p_sales_currency.value;
        data['sf_part_qty_in_Stock'] = this.p_qnty_hand.value;
        data['sf_part_supplier_name'] = this.p_supplier_name.value;
        data['sf_part_supplier_model_no'] = this.p_supplier_modal_no.value;
        data['sf_part_supply_leadtime_hrs'] = this.supply_lead_time.value;
        data['sf_part_supplier_price'] = this.p_supplier_price.value;
        data['sf_part_supplier_currency'] = this.p_supplier_currency.value;
        data['created_by'] = this.authService.currentUser['email'];
        this.filter_emptystring(data);
        let posted_value =  this.filter_emptystring(data);
        this.disabled_enable_button = true; 
        this.partService.post_partmgmt(posted_value).subscribe(response => {
        if (this.partService.response_status == "Unsuccessful" ) { 
            this.disabled_enable_button = false;   
          }
          else if (this.partService.response_status == "Successful" ) { 
            this.disabled_enable_button = false;   
            this.ngOnInit();
            this.cleardata();
          }
        })
      }
      }
    }
// this will eliminate all the non mandatory , empty string and null values 
filter_emptystring(data){
// filtering code
 return Object.keys(data).filter(function (k) {
  return data[k] != null;
}) .reduce(function (obj, key) {
  obj[key] = data[key];
  return obj;
}, {});
}
  // this method for searching the table
  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  // tour guide View method 
part_view(){
  if(this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == 'MV1001' ||this.authService.currentUser['role_id'] == 'PV1001' || this.authService.currentUser['role_id'] == 'WCV1001'|| this.authService.currentUser['role_id'] == 'ASV1001' ||this.authService.currentUser['role_id'] == 'ASA1001'){
    this.partInfo(this.part_management[0]);
  }
}

  // This function will display  all part management in Table view
 make_buy_cost:string;
get_part_mgmt(){
  this.partService.getAllPartMgmt().subscribe(response =>{   
    this.spinner = false;
    if(response['Unsuccessful']){
        this.internalError = true;
    }else{
      this.part_management = response;
      this.part_management.forEach(element => {
        if(element['part_parent_code'] == ''){
          element['part_parent_code'] = null;
        }
        if(element['part_is_purchasable'] == true){
          element['make_buy_cost'] = element['part_supplier_price'] + ' ' + element['part_supplier_currency']
        }else{
          element['make_buy_cost'] = element['part_manufacture_cost'] + ' ' + element['part_manufacture_currency'];
        }

      });
     
      if(this.part_management.length == 0){
        this.no_partmgmt = true;
        this.cookieService.set('parts_tguide', 'active', 300);
      }else{
        this.cookieService.set('parts_tguide', 'inactive', 300);
        this.no_partmgmt = false;
        this.dataSource.data= this.part_management;        
      }
    }
  }, error =>{
    this.spinner = false;
    this.internalError = true;
  })
}

// This method will list all the parent partcode as a drop down list .
TenantParent_partCode(partid_:any){
      this.partService.getTPPartCodebyPartIDS(partid_).subscribe(response => {
        if (response['Unsuccessful']) {
          this.parent_p_code_internalError = true;
        } else {
          this.parent_partCode = response;
          if (this.parent_partCode.length == 0) {
            this.no_parent_part_code = true;
          } else {
            this.no_parent_part_code = false;
          }
        }
      }, error => {
        this.parent_p_code_internalError = true;
      })
    }

    // Add parent part code drop down 
    addTparent_partCode(){
      this.partService.getTenantParentPartCodeS().subscribe(response => {
        if (response['Unsuccessful']) {
          this.parent_p_code_internalError = true;
        } else {
          this.parent_partCode = response;
          if (this.parent_partCode.length == 0) {
            this.no_parent_part_code = true;
          } else {
            this.no_parent_part_code = false;
          }
        }
      }, error => {
        this.parent_p_code_internalError = true;
      })
    }
    // Clear all the input fields 
    cleardata(){
      this.part_Code.reset();
      this.part_name.reset();
      this.parent_p_code.reset();
      this.part_desc.reset();
      this.p_lead_time.reset();
      this.is_buyable.reset();
      this.assembly_part.reset();
      this.parent_part.reset();
      this.p_make_process.reset();
      this.p_supplier_currency.reset();
      this.p_supplier_price.reset();
      this.p_supplier_modal_no.reset();
      this.p_sales_cost.reset();
      this.p_supplier_name.reset();
      this.p_sales_currency.reset();
      this.p_qnty_hand.reset();
      this.p_prod_currency_code.reset();
      this.p_prod_cost.reset();
      this.supply_lead_time.reset();
      this.part_draw_url.reset();
      this.if_child = false;
      this.p_sales_cost.enable();
      this.p_sales_currency.enable();
      this.p_supplier_name.disable();
      this.p_supplier_modal_no.disable();
      this.supply_lead_time.disable();
      this.p_supplier_price.disable();
      this.p_supplier_currency.disable();
      this.p_prod_cost.enable();
      this.p_prod_currency_code.enable();
      this.enableSupplier_fields = false;
      this.parent_p_code.enable()
    }
   public partid:number;
    partInfo(PartInfo:any){
      this.partid = PartInfo['part_id']
      this.part_Code.setValue(PartInfo['part_code'])
      this.part_name.setValue(PartInfo['part_name']);
      this.parent_part.setValue(PartInfo['part_is_child']);
      if(this.parent_part.value == true){
        this.if_child = true;
        this.p_sales_cost.disable();
        this.p_sales_currency.disable();
        this.parent_p_code.setValue(PartInfo['part_parent_code']);
        this.parent_p_code.enable()
      }else{
        this.if_child = false;
        this.p_sales_cost.enable();
        this.p_sales_currency.enable();
        this.parent_p_code.reset();
        this.parent_p_code.disable()

      }
      this.is_buyable.setValue(PartInfo['part_is_purchasable']);
      if(this.is_buyable.value == true){
        this. enableSupplier_fields = true;
        this.p_supplier_name.enable();
        this.p_supplier_modal_no.enable();
        this.supply_lead_time.enable();
        this.p_supplier_price.enable();
        this.p_supplier_currency.enable();
        this.p_prod_cost.disable();
        this.p_prod_currency_code.disable();
        // this.p_prod_cost.reset();
        // this.p_prod_currency_code.reset();
        this.p_supplier_currency.setValue(PartInfo['part_supplier_currency']);
        this.p_supplier_modal_no.setValue(PartInfo['part_supplier_model_no']);
        this.p_supplier_name.setValue(PartInfo['part_supplier_name']);
        this.p_supplier_price.setValue(PartInfo['part_supplier_price']);
        this.supply_lead_time.setValue(PartInfo['part_supply_leadtime_hrs']);
      }else{
        this. enableSupplier_fields = false;
        this.p_supplier_currency.reset();
        this.p_supplier_modal_no.reset();
        this.p_supplier_name.reset();
        this.p_supplier_price.reset();
        this.supply_lead_time.reset();
        this.p_supplier_name.disable();
        this.p_supplier_modal_no.disable();
        this.supply_lead_time.disable();
        this.p_supplier_price.disable();
        this.p_supplier_currency.disable();
        this.p_prod_cost.enable();
        this.p_prod_currency_code.enable();
        
      }
     
      this.p_lead_time.setValue(PartInfo['part_lead_time_mins']);
      this.part_desc.setValue(PartInfo['part_desc']);
      this.part_draw_url.setValue(PartInfo['part_drawing_url']);
      this.assembly_part.setValue(PartInfo['part_is_assembled']);
     
      this.p_make_process.setValue(PartInfo['part_job_process']);
      this.p_prod_cost.setValue(PartInfo['part_manufacture_cost']);
      this.p_prod_currency_code.setValue(PartInfo['part_manufacture_currency']);
      this.p_qnty_hand.setValue(PartInfo['part_qty_in_Stock']);
      this.p_sales_currency.setValue(PartInfo['part_sales_currency']);
      this.p_sales_cost.setValue(PartInfo['part_sales_price']);

    }


    // Update method for part management by part id
    updatePartMgmt() {
      if (this.part_Code.status == "INVALID" || this.part_name.status == "INVALID"||this.part_Code.hasError('required') || this.part_name.hasError('required')|| this.p_lead_time.hasError('required')||
        this.p_make_process.hasError('required')  ||  this.p_prod_cost.hasError('required') || this.p_prod_currency_code.hasError('required')) {
        this.snackbar.top_snackbar("Enter all required Fields !!",this.error_status)
      } else {
        if(this.if_child == true && this.parent_p_code.hasError('required')){
         this.snackbar.top_snackbar("Please Choose the Parent Part code",this.error_status)
        } 
        else if(this.if_child == true && (this.part_Code.value == this.parent_p_code.value)){
          this.snackbar.top_snackbar("Child Part Code cannot be Same as Parent Part Code",this.error_status)
        }  else if(this.enableSupplier_fields == true && (this.p_supplier_name.hasError('required') || this.p_supplier_modal_no.hasError('required')
          ||this.supply_lead_time.hasError('required')|| this.p_supplier_price.hasError('required')|| this.p_supplier_currency.hasError('required'))){
            this.snackbar.top_snackbar("Please Enter Supplier Info !!",this.error_status)
          }else if(this.if_child == false && (this.p_sales_cost.value == null || this.p_sales_currency.value == '')){
            this.snackbar.top_snackbar("Since you are creating Parent Part , please enter the Sales Cost and Currency ",this.error_status)
          }
          
          else if( this.if_child == false && (this.p_sales_cost.value < this.p_prod_cost.value)){
            this.snackbar.top_snackbar("Manufacturing Cost is exceeding the Sales Cost !!",this.error_status)
          }

        else{
        let update = {}
        update['fw_tenant_id'] = this.authService.currentUser['tenant_id'];
        update['sf_tenant_id'] = this.authService.currentUser['tenant_id'];
        update['sf_part_code'] = this.part_Code.value;
        update['sf_part_name'] = this.part_name.value;
        update['sf_part_lead_time_mins'] = this.p_lead_time.value;
        update['sf_part_parent_code'] = this.parent_p_code.value;
        if(this.is_buyable.status == "INVALID" || ""){
          update['sf_part_is_purchasable'] = false;
        }else{
          update['sf_part_is_purchasable'] = this.is_buyable.value;
        }
        if(this.assembly_part.status == "INVALID" || ""){
          update['sf_part_is_assembled'] = false;
        }else{
          update['sf_part_is_assembled'] = this.assembly_part.value;
        }
        if(this.parent_part.status == "INVALID" || ""){
          update['sf_part_is_child'] = false;
        }else{
          update['sf_part_is_child'] = this.parent_part.value;
        }   
        update['sf_part_job_process'] = this.p_make_process.value; 
        update['sf_part_desc'] = this.part_desc.value
        update['sf_part_drawing_url'] = this.part_draw_url.value
        update['sf_part_manufacture_cost'] = this.p_prod_cost.value;
        update['sf_part_manufacture_currency'] = this.p_prod_currency_code.value;
        update['sf_part_sales_price'] = this.p_sales_cost.value;
        update['sf_part_sales_currency'] = this.p_sales_currency.value;
        update['sf_part_qty_in_Stock'] = this.p_qnty_hand.value;
        update['sf_part_supplier_name'] = this.p_supplier_name.value;
        update['sf_part_supplier_model_no'] = this.p_supplier_modal_no.value;
        update['sf_part_supply_leadtime_hrs'] = this.supply_lead_time.value;
        update['sf_part_supplier_price'] = this.p_supplier_price.value;
        update['sf_part_supplier_currency'] = this.p_supplier_currency.value;
        update['updated_by'] = this.authService.currentUser['email'];
        this.partService.updatePartMgmtS(this.partid ,update).subscribe(response => {
            this.ngOnInit();
        })
      }
      }
    }

    // This method is called to delete a particular part by its part id.
  delete_part(){
    this.partService.deletePartS(this.partid).subscribe(response => {
      this.othersService.reloadCurrentRoute();
    })
  }

  // disabling the input form
  partrole:boolean;
user_roles(){
  if( this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 'PA1001' || this.authService.currentUser['role_id'] == 'WCA1001'){
  this.part_Code.enable();
  this.part_name.enable();
  this.part_desc.enable();
  this.parent_p_code.enable();
  this.p_lead_time.enable();
  this.is_buyable.enable();
  this.assembly_part.enable();
  this.parent_part.enable();
  this.p_make_process.enable();
  this.p_supplier_currency.disable();
  this.p_supplier_price.disable();
  this.p_supplier_modal_no.disable();
  this.p_sales_cost.enable();
  this.p_supplier_name.disable();
  this.p_sales_currency.enable();
  this.p_qnty_hand.enable();
  this.p_prod_currency_code.enable();
  this.p_prod_cost.enable();
  this.supply_lead_time.disable();
  this.part_draw_url.enable(); 
  this.partrole =true;

  }
  else if(this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == 'MV1001' ||this.authService.currentUser['role_id'] == 'PV1001' || this.authService.currentUser['role_id'] == 'WCV1001'|| this.authService.currentUser['role_id'] == 'ASV1001' || this.authService.currentUser['role_id'] == 'ASA1001' || this.authService.currentUser['role_id'] == 'JB1001'){
    this.part_Code.disable();
    this.part_name.disable();
    this.part_desc.disable();
    if(this.if_child == true){
      this.p_sales_cost.disable();
      this.p_sales_currency.disable();
      this.parent_p_code.disable();
    }else{
      this.p_sales_cost.disable();
      this.p_sales_currency.disable();
      this.parent_p_code.disable()
    }
    if(this.enableSupplier_fields == true){
      this.p_supplier_currency.disable();
      this.p_supplier_price.disable();
      this.p_supplier_modal_no.disable();
      this.p_supplier_name.disable();
      this.supply_lead_time.disable();
    }
    
    this.p_lead_time.disable();
    this.is_buyable.disable();
    this.assembly_part.disable();
    this.parent_part.disable();
    this.p_make_process.disable();
    this.p_sales_cost.disable();
    this.p_sales_currency.disable();
    this.p_qnty_hand.disable();
    this.p_prod_currency_code.disable();
    this.p_prod_cost.disable();
    this.part_draw_url.disable();
    this.partrole = false;
  }
  }
  callfunction_req(){
    this.popup_title = 'Add Part';
    if(this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == 'MV1001' ||this.authService.currentUser['role_id'] == 'PV1001' || this.authService.currentUser['role_id'] == 'WCV1001'|| this.authService.currentUser['role_id'] == 'ASV1001' || this.authService.currentUser['role_id'] == 'ASA1001'){
      this.part_view();
    }
    if(this.authService.currentUser['role_id'] == 1 || this.authService.currentUser['role_id'] == 'PA1001' || this.authService.currentUser['role_id'] == 'WCA1001'){
    this.cleardata();
  }
     this.addTparent_partCode();
  }

   // This method will take to the previous route.
   backloc(){
    this.routelocationInfo.back();
  }

}

