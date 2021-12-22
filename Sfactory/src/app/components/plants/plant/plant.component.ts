import { Router } from '@angular/router';
import { Component, OnInit} from '@angular/core';
import { DecimalPipe, Location } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { NavbarService } from '../../navbar/_services/navbar.service';
import { PlantService } from '../_services/plant.service';
import { OthersService } from '../../others/_services/others.service'
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { AuthService } from '../../login/_services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss'],
  providers: [DecimalPipe]
})
export class PlantComponent implements OnInit {

  plants:any = [];
  internalError:boolean = false;
  spinner: boolean = true;
  no_plants: boolean;
  filter = new FormControl('');
  filter_tzone :string;
  popup_title:string;
  plant_id:any
  obs: Observable<any>;
  error_status= "Error";
  element:HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
  dataSource = new MatTableDataSource(this.plants);
  setDataSourceAttributes() {
    this.obs = this.dataSource.connect();
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
  constructor(
    private navbarService:NavbarService,
    private page_location: Location,
    private router:Router,
    private plantService: PlantService,
    private snackbar: SnackbarComponent,    
    private cookieService: CookieService,
    public otherService:OthersService,
    public authService: AuthService,
    private othersService: OthersService,
  ) {
    this.navbarService.Title = "Plant";
    this.element;    
    this.othersService.setTitle(this.navbarService.Title);
  }

  ngOnInit(): void { 
    this.getPlants();
    this.setDataSourceAttributes();
    this.setPlantInfo();
    setInterval (() => {
      this.element;
    }, 100);
  }



// this method will redirect to the previous location.
bacloc(){
   this.page_location.back();
}

// This function will display  all plants.
getPlants(){
  this.plantService.getplantS().subscribe(response =>{  
    this.spinner = false;
    if(response['Unsuccessful']){
        this.internalError = true;
    }else{
      this.plants = response;
      if(this.plants.length == 0){
        this.no_plants = true;
        this.cookieService.set('plant_tguide', 'active', 300);
      }else{
        this.cookieService.set('plant_tguide', 'inactive', 300);
        this.no_plants = false;
        this.dataSource.data= this.plants;        
      }
    }
  }, error =>{
    this.spinner = false;
    this.internalError = true;
  })
}

trackById(index, plant){
  return plant.sf_plant_id;
}



// ---------------------------------------------------------------------------------------
//  POST Method implementation.
// ---------------------------------------------------------------------------------------
sf_plant_name = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
unit_operation = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
capacity = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(40)]);
location = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);
latitude =  new FormControl('', [Validators.minLength(2), Validators.maxLength(10)]);
longitude = new FormControl('', [Validators.minLength(2), Validators.maxLength(10)]);
uom = new FormControl('', [Validators.maxLength(5)]);
t_zone = new FormControl('', [Validators.required]);
  // error messages.
  UnitErrorMessages() {
    if (this.sf_plant_name.hasError('required')) {
      return 'You must enter plant name !!';
    }
    if (this.sf_plant_name.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.sf_plant_name.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
  }
  OperationErrorMessages(){
    if (this.unit_operation.hasError('required')) {
      return 'You must enter operation !!';
    }
    if (this.unit_operation.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.unit_operation.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
  }
  CapacityErrorMessages(){
    if (this.capacity.hasError('required')) {
      return 'You must enter capacity !!';
    }
    if (this.capacity.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.capacity.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
  }
  LocationErrorMessages(){
    if (this.location.hasError('required')) {
      return 'You must enter location !!';
    }
    if (this.location.hasError('minlength')) {
      return 'Minimum 3 characters required !!';
    }
    if (this.location.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !!';
    }
  }

  LatitudeErrorMessages(){
    if (this.latitude.hasError('minlength')) {
      return 'Minimum 2 characters required !!';
    }
    if (this.latitude.hasError('maxlength')) {
      return 'Maximum 10 characters allowed !!';
    }
  }
  LongitudeErrorMessages(){
    if (this.longitude.hasError('minlength')) {
      return 'Minimum 2 characters required !!';
    }
    if (this.longitude.hasError('maxlength')) {
      return 'Maximum 10 characters allowed !!';
    }
  }

  UOMErrorMessages(){
    if (this.uom.hasError('required')) {​​​​​​​​
      return 'You must enter a value';
        }​​​​​​​​
    if (this.uom.hasError('maxlength')) {​​​​​​​​
        return 'Maximum 5 characters allowed !';
        }​​​​​​​​
      }

      timeZoneerror(){
        if (this.t_zone.hasError('required')) {
          return 'Please Choose the time zone !!';
        }
      }

  // clear from data.
  cleardata(){
    this.sf_plant_name.reset();
    this.unit_operation.reset();
    this.capacity.reset();
    this.location.reset();
    this.latitude.reset();
    this.longitude.reset();
    this.uom.reset();
    this.t_zone.reset();
    this.filter_tzone = ""
    this.t_zone.enable();
    }

    // this method with route the page to workcenter if there is not workcenters associated to plant.
    redirectWorkcenter(){
        this.router.navigate(['/workcenter']);
    }

  //  This method will CREATE a plant.
  public disabled_enable_button : boolean;
  saveplant(){
    this.plantService.setTimeZone(this.t_zone.value)
    if( this.sf_plant_name.status == "INVALID" ||   this.location.status == "INVALID" || this.uom.status == "INVALID" || this.unit_operation.status == "INVALID" || this.capacity.status == "INVALID"
    || this.t_zone.status == "INVALID"){
        this.snackbar.top_snackbar("Enter all required Fields !!", this.error_status)
    }else{
      let data = {}
      data['fw_org_id'] =  this.authService.currentUser['org_id'];
      data['fw_tenant_id'] =  this.authService.currentUser['tenant_id'];
      data['sf_plant_name'] = this.sf_plant_name.value;
      data['sf_plant_location'] = this.location.value;
      data['sf_plant_lati'] = this.latitude.value;
      data['sf_plant_long'] = this.longitude.value;
      data['sf_plant_operation'] = this.unit_operation.value;
      data['sf_plant_month_capacity'] = this.capacity.value;
      data['sf_capacity_uom'] = this.uom.value;
      data['created_by'] = this.authService.currentUser['email'];
      data['sf_plant_tzone'] = this.t_zone.value;
      this.disabled_enable_button = true;  
      this.plantService.postPlantS(data).subscribe(response=>{
       if (this.plantService.response_status == "Unsuccessful" ) { 
          this.disabled_enable_button = false;   
        }
        else if (this.plantService.response_status == "Successful" ) { 
          this.disabled_enable_button = false;   
          this.ngOnInit();
          this.cleardata();
        }
      })
    }
  }


// ---------------------------------------------------------------------------------------
//  PUT Method implementation.
// ---------------------------------------------------------------------------------------
// tour guide View method 
plant_view(){
  if(this.authService.currentUser['role_id'] == 'PV1001' || this.authService.currentUser['role_id'] == 'PA1001' || this.authService.currentUser['role_id'] == 2){
    this.plant_info(this.plants[0])
  }
}
// setting plant info.
plant_info(plant:any){
  this.plant_id = plant['sf_plant_id'];
  this.sf_plant_name.setValue(plant['sf_plant_name']);
  this.unit_operation.setValue(plant['sf_plant_operation']);
  this.capacity.setValue(plant['sf_plant_month_capacity']);
  this.location.setValue(plant['sf_plant_location']);
  this.latitude.setValue(plant['sf_plant_lati']);
  this.longitude.setValue(plant['sf_plant_long']);
  this.uom.setValue(plant['sf_capacity_uom']);
  this.t_zone.setValue(plant['plant_tzone'])
  this.t_zone.disable();
}

 // This method will UPDATE the plant.
updatePlant(){
   if( this.sf_plant_name.status == "INVALID" ||   this.location.status == "INVALID" || this.uom.status == "INVALID" || this.unit_operation.status == "INVALID" || this.capacity.status == "INVALID"
   || this.t_zone.status == "INVALID"){
      this.snackbar.top_snackbar("Enter all required Fields !!", this.error_status)
   }else{
     let data = {}
     data['sf_plant_name'] = this.sf_plant_name.value;
     data['sf_plant_operation'] = this.unit_operation.value;
     data['sf_plant_month_capacity'] = this.capacity.value;
     data['sf_plant_location'] = this.location.value;
     data['sf_plant_lati'] = this.latitude.value;
     data['sf_plant_long'] = this.longitude.value;
     data['sf_capacity_uom'] = this.uom.value;
     data['updated_by'] = this.authService.currentUser['email'];
     data['sf_plant_tzone'] = this.t_zone.value;
     this.plantService.putPlantS(this.plant_id, data).subscribe(response =>{
       this.ngOnInit();
     })
    }
}

// This method will delete the plant.
deletePlant(){
   this.plantService.deletePlantS(this.plant_id).subscribe(response=>{
    this.otherService.reloadCurrentRoute();
   })
}



  // this method for searching the table
  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  } 

// disabling the input form
 addplant =true;
setPlantInfo(){
  if( this.authService.currentUser['role_id'] == 1  || this.authService.currentUser['role_id'] == "MV1001"){
  this.sf_plant_name.enable();
  this.location.enable();
  this.capacity.enable();
  this.unit_operation.enable();
  this.latitude.enable();
  this.longitude.enable();
  this.addplant = false
  this.uom.enable();
 
  }
  else if(this.authService.currentUser['role_id'] == 2 || this.authService.currentUser['role_id'] == "PA1001"||this.authService.currentUser['role_id'] == 'PV1001' ||this.authService.currentUser['role_id'] == 'WCA1001' || this.authService.currentUser['role_id'] == 'WCV1001' || this.authService.currentUser['role_id'] == 'ASA1001' || this.authService.currentUser['role_id'] == 'ASV1001' ){
  this.sf_plant_name.disable();
  this.location. disable();
  this.capacity.disable();
  this.unit_operation .disable();
  this.latitude.disable();
  this.longitude.disable();
  this.uom.disable();
  this.addplant =true
  }
  }


}
