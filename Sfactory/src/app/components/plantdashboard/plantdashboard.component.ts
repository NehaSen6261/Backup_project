import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavbarService } from '../navbar/_services/navbar.service';
import { PlantdashboardService } from './_services/plantdashboard.service';
import { AuthService } from '../login/_services/auth.service';
import { SnackbarComponent } from '../others/snackbar/snackbar.component';
import { WindowService  } from '../others/window/_services/window.service';
import { AssetService } from '../assets/_services/asset.service';
import { WorkorderService } from '../workorders/_services/workorder.service';
import { ProjectService } from '../projects/_services/project.service';
import { OthersService } from '../others/_services/others.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JoyrideService } from 'ngx-joyride';
import { CookieService } from 'ngx-cookie-service';
import { ApexNonAxisChartSeries,  ApexPlotOptions, ApexChart, ApexFill,  ChartComponent, ApexStroke, ApexAxisChartSeries, ApexTooltip,
              ApexXAxis, ApexDataLabels, ApexMarkers,  ApexYAxis, ApexGrid, ApexTitleSubtitle, ApexLegend, ApexResponsive} from "ng-apexcharts";
import { SimulatorService } from '../simulator/_services/simulator.service';
import { PlantService } from '../plants/_services/plant.service';
import * as moment from 'moment';
import 'moment-timezone';
declare var $ :any;

// apex radial chart options
export type RchartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
};

// line or bar chart options.
export type LBchartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: ApexTooltip;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  colors: string[];
  responsive: ApexResponsive[];
};

@Component({
  selector: 'plantdashboard',
  templateUrl: './plantdashboard.component.html',
  styleUrls: ['./plantdashboard.component.scss']
})
export class PlantdashboardComponent implements OnInit {
  time
  usertheme_data:any = [];
  plant_list:any = [];
  error_status= "Error";

  df_1002_card_clicked:string;
  df_1002_card1_title:string;
  df_1002_card1_subtitle:string;
  df_1002_card2_title:string;
  df_1002_card2_subtitle:string;
  df_1002_card3_title:string;
  df_1002_card3_subtitle:string;
  df_1002_card4_title:string;
  df_1002_card4_subtitle:string;
  df_1002_card5_subtitle:string;
  df_1002_card5_title:string;
  df_1002_card6_title:string;
  df_1002_card7_title:string;
  df_1002_card8_title:string;
  df_1002_card9_title:string;

  no_df_1002_card1_data:boolean;
  card1_has_device:boolean;
  card1_dev_attr_num_datatype:boolean = false;
  card2_has_device:boolean;
  card2_dev_attr_num_datatype:boolean = false;
  card3_has_device:boolean;
  card3_dev_attr_num_datatype:boolean = false;
  card4_has_device:boolean;
  card5_has_device:boolean;
  card4_dev_attr_num_datatype:boolean = false;

  no_plant:boolean;

  no_df_1002_card2_data:boolean;
  no_df_1002_card3_data:boolean;
  no_df_1002_card4_data:boolean;
  no_df_1002_card5_data:boolean;
  no_df_1002_card6_data:boolean;
  no_df_1002_card7_data:boolean;
  no_df_1002_card8_data:boolean;
  no_df_1002_card9_data:boolean;
  no_card3_data:boolean;
  display_card3_chart:boolean;
  display_card4_chart:boolean;
  no_card4_data:boolean;
  no_card5_data:boolean;
  no_card6_data:boolean;
  is_db_configured:boolean = true;
  is_df_1002_card1_configured:boolean = true;
  is_df_1002_card2_configured:boolean = true;
  is_df_1002_card3_configured:boolean = true;
  is_df_1002_card4_configured:boolean = true;
  is_df_1002_card5_configured:boolean = true;
  is_df_1002_card6_configured:boolean;
  is_df_1002_card7_configured:boolean;
  is_df_1002_card8_configured:boolean;
  is_df_1002_card9_configured:boolean;
  disable_save_btn:boolean = true;

  // spinner booleans.
   df_1002_card1_spinner:boolean = true;
   df_1002_card2_spinner:boolean = true;
   df_1002_card3_spinner:boolean = true;
   df_1002_card4_spinner:boolean = true;
   df_1002_card5_spinner:boolean = true;
   df_1002_card6_spinner:boolean = true;
   df_1002_card7_spinner:boolean = true;
   df_1002_card8_spinner:boolean = true;
   df_1002_card9_spinner:boolean = true;

  // error booleans
  db_internal_error:boolean;
  df_1002_card1_internal_err:boolean;
  df_1002_card2_internal_err:boolean;
  df_1002_card3_internal_err:boolean;
  df_1002_card4_internal_err:boolean;
  df_1002_card5_internal_err:boolean;
  df_1002_card6_internal_err:boolean;
  df_1002_card7_internal_err:boolean;
  df_1002_card8_internal_err:boolean;
  df_1002_card9_internal_err:boolean;
  plant_internal_err:boolean;
  device_attrs_internal_err:boolean;


  // card3 charts configs.
  public card3_chart_data = [];
  public card3_chart_labels = [];
  public card3_chart_options = {};
  public card3_chart_type:string;
  public card3_chart_legend= true;

  // card4 charts configs.
  public card4_chart_data = [];
  public card4_chart_labels = [];
  public card4_chart_options = {};
  public card4_chart_type:string;
  public card4_chart_legend= true;
  public plant_time_zone;

  current_host:any;
  browser_timezone:string;
  workorders_list:any=[];

  public error_msg = "Unable to process your request please try after some time !!"
  constructor(
              private router:Router,
              private plantdashboardService: PlantdashboardService,              
              private navbarService:NavbarService,
              private snackBar: SnackbarComponent,
              private windowService:WindowService,
              private assetService:AssetService,
              private plantService:PlantService,
              private workorderService: WorkorderService,
              private projectService: ProjectService,              
              private modalService: NgbModal,
              private cookieService: CookieService,
              private readonly joyride: JoyrideService,
              public othersService: OthersService,
              public authService: AuthService,
              public simulatorService: SimulatorService
             ) {
    this.navbarService.Title = "Dashboard";
    this.time = new Date().toLocaleTimeString();
    this.othersService.setTitle(this.navbarService.Title);
   }

  // apex chart configs.
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<RchartOptions>;
  public card5ChartOptions: Partial<LBchartOptions>;
  public card6ChartOptions: Partial<LBchartOptions>;

// form controller's
plant = new FormControl('');
asset_metric= new FormControl('');
devices_map_view = new FormControl('');
devices_table_view = new FormControl('');
workorder = new FormControl('');
workorder_progress = new FormControl('');
assets_status = new FormControl('');
@ViewChild('content') content;
  ngOnInit(): void {
      this.browser_timezone= Intl.DateTimeFormat().resolvedOptions().timeZone;
      this.current_host = this.windowService.currenthost();
      this.getUserTheme();
      this.getPlant();
      this.getWorkorders();
     
         // if the fault record is added the get method is updated by calling refresh observable
    this.simulatorService.getRefreshNeededS().subscribe(()=>{
      this.getUserTheme();
    })
  }

  ngAfterViewInit() {
    if(!this.othersService.checkTourGuide()){
      this.openModal();
    }
    
  }
  // This method will open the modal pop up
  openModal(){
    this.modalService.open(this.content, { centered: true,windowClass: 'customDialog',backdrop: 'static',
    keyboard: false });
  }
  // This method will close the modal pop up.
  closeWelcomeScreen(){
    this.joyride.closeTour();
    this.modalService.dismissAll()
  }

  // This method will close the tour guide permanently.
  closeTourGuide(){
    this.cookieService.set('tour_guide', 'inactive', 300);
  }
  
// this method with route the page to workcenter if there is not workcenters associated to plant.
redirectSettings(){  
    this.router.navigate(['/settings']); 
    window.scroll(0,0); 
}

// ---------------------------------------------------------------------------------------------------------
//  User theme visualization section
// ---------------------------------------------------------------------------------------------------------
//  This method will display the user theme based on email.
card1_factory_data:boolean=false;
card2_factory_data:boolean=false;
card3_factory_data:boolean=false;
card4_factory_data:boolean=false;
card5_factory_data:boolean=false;
card6_factory_data:boolean=false;
card7_factory_data:boolean=false;
card8_factory_data:boolean=false;
card9_factory_data:boolean=false;
no_df_1002_card1_data_txt:string;
no_df_1002_card2_data_txt:string;
no_df_1002_card3_data_txt:string;
no_df_1002_card4_data_txt:string;
no_workorder_performance:boolean;
card1_factory_series:any = [];
card2_factory_series:any = [];
card3_factory_series:any = [];
card4_factory_series:any = [];
card1_factory_label:any = [];
card2_factory_label:any = [];
card3_factory_label:any = [];
card4_factory_label:any = [];
public timeshow:any

getUserTheme(){
 
  let plant_id= this.authService.currentUser['sf_plant_id']
  this.plantdashboardService.getPlantTimeZone(plant_id).subscribe(response =>{
    this.plant_time_zone = response['plant_tzone']
    var timezond = moment.tz(this.plant_time_zone);
    var  formate = moment(timezond).format('h:mm:ss A z')
    this.timeshow = formate;
 
  this.plantdashboardService.getUserThemeS(this.plant_time_zone).subscribe(response =>{    
    this.usertheme_data = response;
    if(this.usertheme_data["Unsucessfull"]){
      this.db_internal_error = true;
    }else{
      this.db_internal_error = false;
      if (Object.keys(this.usertheme_data).length == 0 ) {
        this.is_db_configured = false;
        this.df_1002_card1_title = "Card1";
        this.df_1002_card2_title = "Card2";
        this.df_1002_card3_title = "Card3";
        this.df_1002_card4_title = "Card4";
        this.df_1002_card5_title = "Card5";
        this.df_1002_card6_title = "Card6";
        this.df_1002_card7_title = "Card7";
        this.df_1002_card8_title = "Card8";
        this.df_1002_card9_title = "Card9"

        this.df_1002_card1_spinner =false;
        this.df_1002_card2_spinner =false;
        this.df_1002_card3_spinner =false;
        this.df_1002_card4_spinner =false;
        this.df_1002_card5_spinner =false;
        this.df_1002_card6_spinner =false;
        this.df_1002_card7_spinner =false;
        this.df_1002_card8_spinner =false;
        this.df_1002_card9_spinner =false;

        this.df_1002_card1_internal_err = false;
        this.df_1002_card2_internal_err = false;
        this.df_1002_card3_internal_err = false;
        this.df_1002_card4_internal_err = false;
        this.df_1002_card5_internal_err = false;
        this.df_1002_card6_internal_err = false;
        this.df_1002_card7_internal_err = false;
        this.df_1002_card8_internal_err = false;
        this.df_1002_card9_internal_err = false;

        this.is_df_1002_card5_configured = false;
        this.is_df_1002_card6_configured = false;
        this.is_df_1002_card7_configured = false;
        this.is_df_1002_card8_configured = false;
        this.is_df_1002_card9_configured = false;

        this.asset_metric.disable();
      }else{
        this.is_db_configured = true;
        // DF1001 .....................................card1............................................
        if(this.usertheme_data['card1']){
          this.df_1002_card1_spinner =false;
          this.is_df_1002_card1_configured = true;
           if(this.usertheme_data['card1']['plant_info']){
            this.no_df_1002_card1_data = false;
            this.df_1002_card1_internal_err = false;
            this.card1_has_device = true;
            this.df_1002_card1_title = this.usertheme_data['card1']['plant_info']['plant_name'];
            this.card1_factory_data  = true;
            this.card1_factory_series =  this.usertheme_data['card1']['plant_info']['value'];
            this.card1_factory_label =  this.usertheme_data['card1']['plant_info']['label'];
            this.CurrentGaugeAnalysis();
           }else if(this.usertheme_data['card1']['no_data']){
            this.no_df_1002_card1_data = true;
            this.df_1002_card1_internal_err = false;
            this.card1_has_device = false;
            this.card1_factory_data  = false;
            this.df_1002_card1_title = this.usertheme_data['card1']['no_data']['plant_name'];
            this.no_df_1002_card1_data_txt = this.usertheme_data['card1']['no_data']['message'];
           }else if(this.usertheme_data['card1']['error']){
            this.df_1002_card1_internal_err = true;
            this.card1_has_device = false;
            this.card1_factory_data  = false;
            this.df_1002_card1_title = this.usertheme_data['card1']['error']['plant_name'];
            this.no_df_1002_card1_data_txt = this.usertheme_data['card1']['error']['message'];
           }
           else{
            this.card1_factory_data  = false;
            this.card1_has_device = false;
            this.df_1002_card1_title = "Card 1";
          }
          }else{
          this.df_1002_card1_title = "Card1";
          this.is_df_1002_card1_configured = false;
          this.df_1002_card1_spinner =false;
          this.no_df_1002_card1_data = false;
        }

        // DF1001 .....................................card2............................................
        if(this.usertheme_data['card2']){
          this.df_1002_card2_spinner =false;
          this.is_df_1002_card2_configured = true;
           if(this.usertheme_data['card2']['plant_info']){
            this.no_df_1002_card2_data = false;
            this.card2_has_device = true;
            this.df_1002_card2_internal_err = false;
            this.df_1002_card2_title = this.usertheme_data['card2']['plant_info']['plant_name'];
             this.card2_factory_data  = true;
            this.card2_factory_series =  this.usertheme_data['card2']['plant_info']['value'];
            this.card2_factory_label =  this.usertheme_data['card2']['plant_info']['label'];
            this.CurrentGaugeAnalysis();
           }else if(this.usertheme_data['card2']['no_data']){
            this.no_df_1002_card2_data = true;
            this.card2_has_device = false;
            this.card2_factory_data  = false;
            this.df_1002_card2_internal_err = false;
            this.df_1002_card2_title = this.usertheme_data['card2']['no_data']['plant_name'];
            this.no_df_1002_card2_data_txt = this.usertheme_data['card2']['no_data']['message'];
           }else if(this.usertheme_data['card2']['error']){
            this.df_1002_card2_internal_err = true;
            this.card2_has_device = false;
            this.card2_factory_data  = false;
            this.df_1002_card2_title = this.usertheme_data['card2']['error']['plant_name'];
            this.no_df_1002_card2_data_txt = this.usertheme_data['card2']['error']['message'];
           }
           else{
            this.card2_factory_data  = false;
            this.card2_has_device = false;
            this.df_1002_card2_title = this.usertheme_data['card2'];
          }
          }else{
          this.df_1002_card2_title = "Card2";
          this.is_df_1002_card2_configured = false;
          this.df_1002_card2_spinner =false;
          this.no_df_1002_card2_data = false;
        }

        // DF1001 .....................................card3............................................
        if(this.usertheme_data['card3']){
        this.df_1002_card3_spinner =false;
        this.is_df_1002_card3_configured = true;
          if(this.usertheme_data['card3']['plant_info']){
          this.no_df_1002_card3_data = false;
          this.card3_has_device = true;
          this.df_1002_card3_internal_err = false;
          this.card3_factory_data  = true;
          this.df_1002_card3_title = this.usertheme_data['card3']['plant_info']['plant_name'];
          this.card3_factory_series =  this.usertheme_data['card3']['plant_info']['value'];
          this.card3_factory_label =  this.usertheme_data['card3']['plant_info']['label'];
          this.CurrentGaugeAnalysis();
          }else if(this.usertheme_data['card3']['no_data']){
            this.no_df_1002_card3_data = true;
            this.df_1002_card3_internal_err = false;
            this.card3_has_device = false;
            this.card3_factory_data  = false;
            this.df_1002_card3_title = this.usertheme_data['card3']['no_data']['plant_name'];
            this.no_df_1002_card3_data_txt = this.usertheme_data['card3']['no_data']['message'];
           }else if(this.usertheme_data['card3']['error']){
            this.df_1002_card3_internal_err = true;
            this.card3_has_device = false;
            this.card3_factory_data  = false;
            this.df_1002_card3_title = this.usertheme_data['card3']['error']['plant_name'];
            this.no_df_1002_card3_data_txt = this.usertheme_data['card3']['error']['message'];
           }
          else{
          this.card3_factory_data  = false;
          this.card3_has_device = false;
          this.df_1002_card3_title = this.usertheme_data['card3'];
        }
        }else{
        this.df_1002_card3_title = "Card3";
        this.is_df_1002_card3_configured = false;
        this.df_1002_card3_spinner =false;
        this.no_df_1002_card3_data = false;
        }
        // DF1001 .....................................card4............................................
        if(this.usertheme_data['card4']){
          this.df_1002_card4_spinner =false;
          this.is_df_1002_card4_configured = true;
            if(this.usertheme_data['card4']['plant_info']){
            this.no_df_1002_card4_data = false;
            this.card4_has_device = true;
            this.df_1002_card3_internal_err = false;
            this.df_1002_card4_title = this.usertheme_data['card4']['plant_info']['plant_name'];
            this.card4_factory_data  = true;
            this.card4_factory_series =  this.usertheme_data['card4']['plant_info']['value'];
            this.card4_factory_label =  this.usertheme_data['card4']['plant_info']['label'];
            this.CurrentGaugeAnalysis();
            }else if(this.usertheme_data['card4']['no_data']){
              this.no_df_1002_card4_data = true;
              this.card4_has_device = false;
              this.card4_factory_data  = false;
              this.df_1002_card3_internal_err = false;
              this.df_1002_card4_title = this.usertheme_data['card4']['no_data']['plant_name'];
              this.no_df_1002_card4_data_txt = this.usertheme_data['card4']['no_data']['message'];
             }else if(this.usertheme_data['card4']['error']){
              this.df_1002_card4_internal_err = true;
              this.card4_has_device = false;
              this.card4_factory_data  = false;
              this.df_1002_card4_title = this.usertheme_data['card4']['error']['plant_name'];
              this.no_df_1002_card4_data_txt = this.usertheme_data['card4']['error']['message'];
             }
             else{
            this.card4_factory_data = false;
            this.card4_has_device = false;
            this.df_1002_card4_title = this.usertheme_data['card4'];
          }
          }else{
          this.df_1002_card4_title = "Card4";
          this.is_df_1002_card4_configured = false;
          this.df_1002_card4_spinner =false;
          this.no_df_1002_card4_data = false;
          }

        // DF1001 .....................................card5............................................
        if(this.usertheme_data['card5']){
            this.is_df_1002_card5_configured = true;
            if(this.usertheme_data['card5']['plant_info']){
            this.no_df_1002_card5_data = false;
            this.card5_has_device = true;
            this.card5_factory_data  = true;
            this.df_1002_card5_title = this.usertheme_data['card5']['plant_info']['plant_name'];
            this.assetRuntimeDowntime(this.usertheme_data['card5']['plant_info']['plant_id']);
            }else{
            this.card5_factory_data = false;
            this.card5_has_device = false;
            this.df_1002_card5_title = "Card5";
          }
        }else{
          this.df_1002_card5_title = "Card5";
          this.is_df_1002_card5_configured = false;
          this.df_1002_card5_spinner = false;
          this.no_df_1002_card5_data = true;
        }

        // DF1001 .....................................card6............................................
        if(this.usertheme_data['card6']){
          this.is_df_1002_card6_configured = true;
          if(this.usertheme_data['card6']['plant_info']){
            this.no_df_1002_card6_data = false;
            this.card6_factory_data  = true;
            this.df_1002_card6_title = this.usertheme_data['card6']['plant_info']['plant_name'];
            this.get_todayqlscpC(this.usertheme_data['card6']['plant_info']['plant_id']);
          }else{
            this.card6_factory_data  = false;
            this.df_1002_card6_title = "Card6";
          }

          }else{
          this.df_1002_card6_title = "Card6";
          this.is_df_1002_card6_configured = false;
          this.df_1002_card6_spinner =false;
          this.no_df_1002_card6_data = true;
          }


        // DF1001 .....................................card7............................................
        if(this.usertheme_data['card7']){
          if(this.usertheme_data['card7']['plant_info']){
            this.is_df_1002_card7_configured = true;
            this.df_1002_card7_spinner =false;
            this.card7_factory_data  = true;
            this.no_df_1002_card7_data = false;
            this.df_1002_card7_title = this.usertheme_data['card7']['plant_info']['plant_name'];
            this.getWorkOrderProgress(this.usertheme_data['card7']['plant_info']['plant_id']);
          }else{
            this.no_workorder_performance = false;
            this.is_df_1002_card7_configured = false;
            this.card7_factory_data = false;
            this.no_df_1002_card7_data = true;
            this.df_1002_card7_title = "Card7";
          }
        }else{
        this.df_1002_card7_title = "Card7";
        this.is_df_1002_card7_configured = false;
        this.df_1002_card7_spinner =false;
        this.no_df_1002_card7_data = true;
        }

        // DF1001 .....................................card8............................................
        if(this.usertheme_data['card8']){
          this.is_df_1002_card8_configured = true;
          if(this.usertheme_data['card8']['plant_info']){
            this.df_1002_card8_spinner =false;
            this.no_df_1002_card8_data = false;
            this.card8_factory_data  = true;
            this.df_1002_card8_title = this.usertheme_data['card8']['plant_info']['plant_name'];
            this.getWoJobprogressC(this.usertheme_data['card8']['plant_info']['plant_id']);
          }else{
            this.card8_factory_data  = false;
            this.no_df_1002_card8_data = true;
            this.df_1002_card8_title = "Card8";
          }
          }else{
          this.df_1002_card8_title = "Card8";
          this.is_df_1002_card8_configured = false;
          this.df_1002_card8_spinner =false;
          this.no_df_1002_card8_data = true;
          }

        // DF1001 .....................................card9............................................
        if(this.usertheme_data['card9']){
          this.df_1002_card9_spinner = false;
          this.is_df_1002_card9_configured = true;
          this.card9_factory_data = false;
          this.no_df_1002_card9_data = false;
          this.df_1002_card9_title = this.usertheme_data['card9'];
          this.getAssets();
          }else{
          this.df_1002_card9_title = "Card9";
          this.is_df_1002_card9_configured = false;
          this.df_1002_card9_spinner =false;
          this.no_df_1002_card9_data = true;
          }
      }

    }

  }, error =>{
    this.db_internal_error = true;
  });
});
}

// -------------------------------------------------------------------------------------------------------------
// Create user theme.
// --------------------------------------------------------------------------------------------------------------
// This method will save the user dashboard cards attributes.
datainfo = {"card1": null, "card2": null, "card3": null,  "card4": null, "card5": null,
            "card6":null,  "card7":null,  "card8": null, "card9": null }
savedata= {};
card1_plant_info:any;
card2_plant_info:any;
card3_plant_info:any;
card4_plant_info:any;
card5_plant_info:any;
card6_plant_info:any;
card7_plant_info:any;
card8_plant_info:any;
is_asset_selected:boolean;
saveUserTheme(){
  this.time = new Date().toLocaleTimeString();
  // card 1
  if(this.df_1002_card_clicked == 'Card1'){
    if(this.plant.value){
      if(this.asset_metric.value){
        this.is_asset_selected = true;
        this.card1_plant_info = {"plant_id": this.plant.value, "metric_type":this.asset_metric.value};
        let card1_data = {"factory":this.card1_plant_info, "calculation_level": "plant"};
        this.datainfo['card1'] = JSON.stringify(card1_data);
        this.getplantzone(this.plant.value)
        $('#AttributesModal').modal('hide')  
      }else{
        this.is_asset_selected = false;
        this.snackBar.top_snackbar("Please choose a metric type !!",this.error_status);
        $('#AttributesModal').modal('show')
      }            
    }else{
      this.is_asset_selected = false;
      this.snackBar.top_snackbar("Please choose an plant !!",this.error_status);
      $('#AttributesModal').modal('show')
    }
  }

 // card 2
  if(this.df_1002_card_clicked == 'Card2' ){
    if(this.plant.value){
      if(this.asset_metric.value){
        this.is_asset_selected = true;
        this.card2_plant_info = {"plant_id": this.plant.value, "metric_type":this.asset_metric.value};
        let card2_data = {"factory":this.card2_plant_info, "calculation_level": "plant"};
        this.datainfo['card2'] = JSON.stringify(card2_data);
        this.getplantzone(this.plant.value)
        $('#AttributesModal').modal('hide')
       
      }else{
        this.is_asset_selected = false;
        this.snackBar.top_snackbar("Please choose a metric type !!",this.error_status);
        $('#AttributesModal').modal('show')
      }      
    }else{
      this.is_asset_selected = false;
      this.snackBar.top_snackbar("Please choose an plant !!",this.error_status);
      $('#AttributesModal').modal('show')
    }
   }

// card 3
if(this.df_1002_card_clicked == 'Card3' ){
  if(this.plant.value){
    if(this.asset_metric.value){
      this.is_asset_selected = true;
      this.card3_plant_info = {"plant_id": this.plant.value, "metric_type":this.asset_metric.value};
      let card3_data = {"factory":this.card3_plant_info, "calculation_level": "plant"};
      this.datainfo['card3'] = JSON.stringify(card3_data);
      this.getplantzone(this.plant.value)
      $('#AttributesModal').modal('hide')
    }else{
      this.is_asset_selected = false;
      this.snackBar.top_snackbar("Please choose a metric type !!",this.error_status);
      $('#AttributesModal').modal('show')
    }
 
  }else{
    this.is_asset_selected = false;
    this.snackBar.top_snackbar("Please choose an plant !!",this.error_status);
    $('#AttributesModal').modal('show')
  }
  }

// card 4
if(this.df_1002_card_clicked == 'Card4' ){
  if(this.plant.value){
    if(this.asset_metric.value){
      this.is_asset_selected = true;
      this.card4_plant_info = {"plant_id": this.plant.value, "metric_type":this.asset_metric.value};
      let card4_data = {"factory":this.card4_plant_info, "calculation_level": "plant"};
      this.datainfo['card4'] = JSON.stringify(card4_data);
      this.getplantzone(this.plant.value)
      $('#AttributesModal').modal('hide')
    }else{
      this.is_asset_selected = false;
      this.snackBar.top_snackbar("Please choose a metric type !!",this.error_status);
      $('#AttributesModal').modal('show')
    }    
  }else{
    this.is_asset_selected = false;
    this.snackBar.top_snackbar("Please choose an plant !!",this.error_status);
    $('#AttributesModal').modal('show')
  }
  }


  // card 5
if(this.df_1002_card_clicked == 'Card5' ){
  if(this.plant.value){
    this.is_asset_selected = true;
    this.card5_plant_info = {"plant_id": this.plant.value, "metric_type":"runtime_vs_downtime"};
    let card5_data = {"factory":this.card5_plant_info, "calculation_level": "plant"};
    this.datainfo['card5'] = JSON.stringify(card5_data);
    this.getplantzone(this.plant.value)
    $('#AttributesModal').modal('hide')
  }else{
    this.is_asset_selected = false;
    this.snackBar.top_snackbar("Please choose an plant !!",this.error_status);
    $('#AttributesModal').modal('show')
  }
  }

// card 6
if(this.df_1002_card_clicked == 'Card6' ){
  if(this.plant.value){
    this.is_asset_selected = true;
    this.card6_plant_info = {"plant_id": this.plant.value, "metric_type":"netruntime"};
    let card6_data = {"factory":this.card6_plant_info, "calculation_level": "plant"};
    this.datainfo['card6'] = JSON.stringify(card6_data);
    this.getplantzone(this.plant.value)
    $('#AttributesModal').modal('hide')
  }else{
    this.is_asset_selected = false;
    this.snackBar.top_snackbar("Please choose an plant !!",this.error_status);
    $('#AttributesModal').modal('show')
  }
  }


  //card7
  if(this.df_1002_card_clicked == 'Card7' ){
    if(this.plant.value){
      this.is_asset_selected = true;
      this.card7_plant_info = {"plant_id": this.plant.value, "metric_type":"workorder_progress"};
      let card7_data = {"factory":this.card7_plant_info, "calculation_level": "work_order"};
      this.datainfo['card7'] = JSON.stringify(card7_data);
      this.getplantzone(this.plant.value)
      $('#AttributesModal').modal('hide')
    }else{
      this.is_asset_selected = false;
      this.snackBar.top_snackbar("Please choose an plant!!",this.error_status);
      $('#AttributesModal').modal('show')
    }
  }

  //card8
  if(this.df_1002_card_clicked == 'Card8' ){
    if(this.plant.value){
      this.is_asset_selected = true;
      this.card8_plant_info = {"plant_id": this.plant.value, "metric_type":"workorder_progress"};
      let card8_data = {"factory":this.card8_plant_info, "calculation_level": "work_order"};
      this.datainfo['card8'] = JSON.stringify(card8_data);
      this.getplantzone(this.plant.value)
      $('#AttributesModal').modal('hide')
    }else{
      this.is_asset_selected = false;
      this.snackBar.top_snackbar("Please choose an plant!!",this.error_status);
      $('#AttributesModal').modal('show')
    }
  }

  //card9.
  if(this.df_1002_card_clicked == 'Card9' ){
    if(this.assets_status.value){
      this.is_asset_selected = true;
      this.datainfo['card9'] = "assets status";
      $('#AttributesModal').modal('hide')
    }else{
      this.is_asset_selected = false;
      this.snackBar.top_snackbar("Please select asset status !!",this.error_status);
      $('#AttributesModal').modal('show')
    }
  }

// master info
this.savedata['template_attributes'] = this.datainfo;
this.savedata['fw_tenant_id'] = this.authService.currentUser['tenant_id'];
this.savedata['email'] = this.authService.currentUser['email'];
this.savedata['sf_template_typeid'] = "DF1002";
if(this.is_asset_selected){
  this.plantdashboardService.saveUserDBCardsS(this.savedata).subscribe(response =>{
    if(this.plantdashboardService.card_update_response['Successful']){
      let snackbar_txt = "Successfully updated :"
      this.snackBar.top_snackbar(snackbar_txt  + this.df_1002_card_clicked + " Attributes","Successful");
      this.ngOnInit();
      this.resetCardpopup();
   
    }
  });
}



}


getplantzone(plant_id:any){
  this.plantdashboardService.getPlantTimeZone(plant_id).subscribe(response =>{
    this.plant_time_zone = response['plant_tzone']
    var timezond = moment.tz(this.plant_time_zone);
    var  formate = moment(timezond).format('h:mm:ss A z')
    this.timeshow = formate;
  })
}
// This method will display the assets of the user .
getPlant(){
  this.plantdashboardService.getPlantDahboard().subscribe(response =>{
    if(response['Unsuccessful'] || response == false){
      this.plant_internal_err = true;
      this.no_plant = false;
    }else{
      this.plant_list = response;
    }
    if(this.plant_list.length == 0 || this.plant_list==null){
      this.no_plant = false;
    }else{
      this.no_plant = true;
    }
  }, error =>{
    this.plant_internal_err = true;
    this.no_plant = false;
  })
}



//  This method will display the workorders of a user role
getWorkorders(){
  this.plantdashboardService.getWorkOrderListS().subscribe(response =>{
    if(response['Unsuccessful'] || response == false){
     }else{
      this.workorders_list = response;
    }
  })
}


//  this variable will display the  asset metric types.
public asset_metrics = [
  { value: "Availability", viewValue: "Availability"},
  { value: "Performance", viewValue: "Performance"},
  { value: "Quality", viewValue: "Quality"},
  { value: "OEE", viewValue: "OEE"}
]

// -----------------------------------------
// setting card inputs
// -----------------------------------------

// card 1 config.
df1001_card1_config(){
this.df_1002_card_clicked = "Card1";
this.plant.reset();
this.asset_metric.reset();
if(this.no_df_1002_card1_data){
  this.plant.setValue(this.usertheme_data['card1']['no_data']['plant_id']);
  this.asset_metric.setValue(this.usertheme_data['card1']['no_data']['label'][0]);
}else if(this.df_1002_card1_internal_err){
  this.plant.setValue(this.usertheme_data['card1']['error']['plant_id']);
  this.asset_metric.setValue(this.usertheme_data['card1']['error']['label'][0]);
}else{
  this.plant.setValue(this.usertheme_data['card1']['plant_info']['plant_id']);
  this.asset_metric.setValue(this.usertheme_data['card1']['plant_info']['label'][0]);
}
}

// card 2 config.
df1001_card2_config(){
  this.df_1002_card_clicked = "Card2";
  this.plant.reset();
  this.asset_metric.reset();
  if(this.no_df_1002_card2_data){
    this.plant.setValue(this.usertheme_data['card2']['no_data']['plant_id']);
    this.asset_metric.setValue(this.usertheme_data['card2']['no_data']['label'][0]);
  }else if(this.df_1002_card2_internal_err){
    this.plant.setValue(this.usertheme_data['card2']['error']['plant_id']);
    this.asset_metric.setValue(this.usertheme_data['card2']['error']['label'][0]);
  }else{
    this.plant.setValue(this.usertheme_data['card2']['plant_info']['plant_id']);
    this.asset_metric.setValue(this.usertheme_data['card2']['plant_info']['label'][0]);
  }
}

// card 3 config.
df1001_card3_config(){
  this.df_1002_card_clicked = "Card3";
  this.plant.reset();
  this.asset_metric.reset();
  if(this.no_df_1002_card3_data){
    this.plant.setValue(this.usertheme_data['card3']['no_data']['asset_id']);
    this.asset_metric.setValue(this.usertheme_data['card3']['no_data']['label'][0]);
  }else if(this.df_1002_card3_internal_err){
    this.plant.setValue(this.usertheme_data['card3']['error']['asset_id']);
    this.asset_metric.setValue(this.usertheme_data['card3']['error']['label'][0]);
  }else{
    this.plant.setValue(this.usertheme_data['card3']['plant_info']['asset_id']);
    this.asset_metric.setValue(this.usertheme_data['card3']['plant_info']['label'][0]);
  }
}

// card 4 config.
df1001_card4_config(){
  this.df_1002_card_clicked = "Card4";
  this.plant.reset();
  this.asset_metric.reset();
  if(this.no_df_1002_card4_data){
    this.plant.setValue(this.usertheme_data['card4']['no_data']['asset_id']);
    this.asset_metric.setValue(this.usertheme_data['card4']['no_data']['label'][0]);
  }else if(this.df_1002_card4_internal_err){
    this.plant.setValue(this.usertheme_data['card4']['error']['asset_id']);
    this.asset_metric.setValue(this.usertheme_data['card4']['error']['label'][0]);
  }else{
    this.plant.setValue(this.usertheme_data['card4']['plant_info']['asset_id']);
    this.asset_metric.setValue(this.usertheme_data['card4']['plant_info']['label'][0]);
  }
}

// card 5 config.
df1001_card5_config(){
  this.df_1002_card_clicked = "Card5";
  this.plant.reset();
  this.asset_metric.reset();
  if(this.is_df_1002_card5_configured && !this.no_df_1002_card5_data){
    this.plant.setValue(this.usertheme_data['card5']['plant_info']['asset_id']);
  }
  
}

// card 6 config.
df1001_card6_config(){
  this.df_1002_card_clicked = "Card6";
  this.plant.reset();
  this.asset_metric.reset();
  if(this.is_df_1002_card6_configured && !this.no_df_1002_card6_data){
    this.plant.setValue(this.usertheme_data['card6']['plant_info']['plant_id']);
  }
  
}



// card 7 config.
df1001_card7_config(){
  this.df_1002_card_clicked = "Card7";
  this.plant.reset();
  if(this.is_df_1002_card7_configured && !this.no_df_1002_card7_data){
    this.plant.setValue(this.usertheme_data['card7']['plant_info']['plant_id']);
  }  
}

// card 8 config.
df1001_card8_config(){
  this.df_1002_card_clicked = "Card8";
  this.plant.reset();
  if(this.is_df_1002_card8_configured && !this.no_df_1002_card8_data){
    this.plant.setValue(this.usertheme_data['card8']['plant_info']['plant_id']);
  }
  
}

// card 9 config.
df1001_card9_config(){
  this.df_1002_card_clicked = "Card9";
  if(this.df_1002_card9_title == "assets status"){
    this.assets_status.setValue(true);
  }
}


// this function will reset pop up values.
resetCardpopup(){
  this.plant.reset();
  this.asset_metric.reset();
  this.assets_status.reset();
  this.workorder_progress.reset();

}

enable_savebtn(){
  this.disable_save_btn = false;
}
// -----------------------------------------------------------------------------------------------------
// Other API calls
// -----------------------------------------------------------------------------------------------------

// This method will display asset runtime and downtime metrics through API call.
assetRuntimeDowntime(plant_id:any){
  let response_data:any;
  this.df_1002_card5_spinner = true;
  this.plantdashboardService.getPlantTimeZone(plant_id).subscribe(response =>{
    this.plant_time_zone = response['plant_tzone']
  this.plantdashboardService.get_lastdaysrdftimeS(plant_id, this.plant_time_zone).subscribe(response =>{
    this.df_1002_card5_spinner = false;
    if(response){
      response_data = response;
      this.card5ChartConfigs(response_data);
    }else{
      this.df_1002_card5_internal_err = true;
    }
  }, error =>{
    this.df_1002_card5_spinner = false;
    this.df_1002_card5_internal_err = true;
  })
})
}


// This method will display netRuntime through API call.
public get_todayqlscpC(plant_id:any){

  let response_data:any;
  this.df_1002_card6_spinner = true;
  this.plantdashboardService.getPlantTimeZone(plant_id).subscribe(response =>{
    this.plant_time_zone = response['plant_tzone']
  this.plantdashboardService.get_lastdaysqsipS(plant_id, this.plant_time_zone).subscribe(response =>{
    this.df_1002_card6_spinner = false;
    if(response){
      response_data = response;
      this.card6ChartConfigs(response_data);
    }else{
      this.df_1002_card6_internal_err = true;
    }
  }, error =>{
    this.df_1002_card6_spinner = false;
    this.df_1002_card6_internal_err = true;
  })
})

}


//  This method will display the particular workorder progress for card 7.
work_orderprogress:any = [];
no_work_order_progress:boolean;
public getWorkOrderProgress(plant_id:any){
  this.df_1002_card7_spinner = true;
  this.plantdashboardService.getPlantTimeZone(plant_id).subscribe(response =>{
    this.plant_time_zone = response['plant_tzone'];
  this.plantdashboardService.getPlantDashWorkoderPerformenceS(plant_id, this.plant_time_zone).subscribe(response =>{
    this.df_1002_card7_spinner = false;
    this.no_workorder_performance = false;
    if(response){
      this.work_orderprogress = response;
      if( this.work_orderprogress.length == null){
        this.no_workorder_performance = true;
     }else{
        this.no_workorder_performance = false;
      }
      }else{
      this.df_1002_card7_internal_err = true;
    }
  }, error =>{
    this.df_1002_card7_spinner = false;
    this.df_1002_card7_internal_err = true;
  })
})
}

 // This function will display the particular work order job's progress.
 wo_jobprogress:any = [];
 no_wo_job_progress:boolean;
getWoJobprogressC(plant_id:any){
  let wo_progress:any=[];
  this.df_1002_card8_spinner = true;
  this.plantdashboardService.getPlantTimeZone(plant_id).subscribe(response =>{
    this.plant_time_zone = response['plant_tzone'];
  this.projectService.getPlantWojobprogressS(plant_id, this.plant_time_zone).subscribe(response =>{
    this.df_1002_card8_spinner = false;
    if(response){
      wo_progress = response;
      if(wo_progress.length == 0){
        this.no_wo_job_progress = true;
      }else{
        this.no_wo_job_progress = false;
        this.wo_jobprogress = response;
      }
    }else{
      this.df_1002_card8_internal_err = true;
    }
  }, error =>{
    this.df_1002_card8_spinner = false;
    this.df_1002_card8_internal_err = true;
  })
})
}


  // This function will display  all assets.
  assets_list_info:any = [];
  no_asset_list_info:boolean;
  getAssets() {
    this.assetService.getAssetsS().subscribe(response => {
      this.df_1002_card9_spinner = false;
      if (response['Unsuccessful']) {
        this.df_1002_card9_internal_err = true;
      } else {
        this.assets_list_info = response;
        if (this.assets_list_info.length == 0) {
          this.no_asset_list_info = true;
        } else {
          this.no_asset_list_info = false;
        }
      }
    }, error => {
      this.df_1002_card9_spinner = false;
      this.df_1002_card9_internal_err = true;
    })
  }


// -----------------------------------------------------------------------------------------------------
// Chart configs
// -----------------------------------------------------------------------------------------------------

//  Factory gauge chart configs for CARD 1, CARD2, CARD3, CARD4.
CurrentGaugeAnalysis(){
  this.chartOptions = {
    chart: {
      height: 250,
      type: "radialBar",
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: "70%",
          background: "#fff",
          image: undefined,
          position: "front",
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24
          }
        },
        track: {
          background: "#fff",
          strokeWidth: "67%",
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35
          }
        },

        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: "#000000",
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            fontSize: "18px"
          },
        
          value: {
            formatter: function(val) {
              return val + "%";
            },
            color: "#111",
            fontSize: "36px",
            show: true
          }
        }
      }
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#ABE5A1"],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: "round"
    }
  };
}

//  this function will display CARD5  chart configs.
public card5ChartConfigs(data:any){
  this.card5ChartOptions = {
    series: data.data,
    chart: {
      type: "bar",
      height: 260,
      stacked: true,
      toolbar: {
        show: true,
        offsetX: -25,
        offsetY: -50,
        tools: {
          download: '<i class="fas fa-download"></i>'
        }     
      },
      zoom: {
        enabled: false
      },
      animations: {
        enabled: false
      }
    },
      dataLabels: {
        enabled: true
      },
      plotOptions: {
        bar: {
          horizontal: false,
           dataLabels: {
            orientation: 'vertical',
            position: 'center'
          }
        }
      },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0
          }
        }
      }
    ],
    stroke: {
      show: false,
      width: 0,
      colors: ["transparent"]
    },
    xaxis: {
      type: "category",
      categories: data.timeframe,
      labels: {
      rotate: -45,
       rotateAlways: true,
      }

    },
    yaxis: {
        labels: {
          show: false
        },
        title: {
          text: '%'
        }
      },

    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: 0,
      offsetX: -5,
      showForSingleSeries: true,
      markers: {
        fillColors: ["#00E396", '#F9C80E', "#FF4560"]
      }
    },
    fill: {
      opacity: 1,
      colors: ['#00E396', '#F9C80E', '#FF4560']
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return  val + "%";
        }
      }
    }
  };
};

//  this function will display CARD6 chart configs.
public card6ChartConfigs(data:any){
  this.card6ChartOptions = {
    series: data.data,
    chart: {
      type: "bar",
      height: 260,
      stacked: true,
      toolbar: {
        show: true,
        offsetX: -25,
        offsetY: -50,
        tools: {
          download: '<i class="fas fa-download"></i>'
        }     
      },
      zoom: {
        enabled: false
      },
      animations: {
        enabled: false
      }
    },
      dataLabels: {
        enabled: true
      },
      plotOptions: {
        bar: {
          horizontal: false,
           dataLabels: {
            orientation: 'vertical',
            position: 'center'
          }
        }
      },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0
          }
        }
      }
    ],
    stroke: {
      show: false,
      width: 0,
      colors: ["transparent"]
    },
    xaxis: {
      type: "category",
      categories: data.timeframe,
      labels: {
      rotate: -45,
       rotateAlways: true,
      }

    },
    yaxis: {
        labels: {
          show: false
        },
        title: {
          text: 'Mins'
        }
      },

    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: 0,
      offsetX: -5,
      showForSingleSeries: true,
      markers: {
        fillColors: ["#F86624"]
      }
    },
    fill: {
      opacity: 1,
      colors: ["#F86624"]
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return  val + " Mins";
        }
      }
    }
  };
};

}
