import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NumberValueAccessor } from '@angular/forms';
import { NavbarService } from '../../navbar/_services/navbar.service';
import { AuthService } from '../../login/_services/auth.service';
import { AssetService } from '../_services/asset.service';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { ApexNonAxisChartSeries, ApexPlotOptions, ApexChart, ApexFill, ChartComponent, ApexStroke,
         ApexAxisChartSeries, ApexXAxis, ApexDataLabels, ApexTitleSubtitle, ApexGrid, ApexMarkers, ApexYAxis,
         ApexLegend, ApexResponsive} from "ng-apexcharts";
import { OthersService } from '../../others/_services/others.service';
import { SimulatorService } from '../../simulator/_services/simulator.service';
import { DashboardService } from '../../dashboard/_services/dashboard.service';
import * as moment from 'moment';
import 'moment-timezone';
import { DatePipe } from '@angular/common';
declare var $ :any;

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
};

export type ChartOptions2 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: any;
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
  selector: 'asset-analysis',
  templateUrl: './asset-analysis.component.html',
  styleUrls: ['./asset-analysis.component.scss']
})
export class AssetAnalysisComponent implements OnInit {

  selected_asset = new FormControl('');
  selected_metric_type = new FormControl('');
  chart_type = new FormControl('');
  card_title = new FormControl('');
  browser_timezone:string;
  time_interval:string;
  error_status= "Error";
  time:any;
  @ViewChild("chart") chart: ChartComponent;
  @ViewChild("chart2") chart2: ChartOptions2;


  // Chart configurations.
  public chartOptions: Partial<ChartOptions2>;
  public Current_chartOptions: Partial<ChartOptions>;
  public availability_chartOptions: Partial<ChartOptions2>;
  public quality_chartOptions: Partial<ChartOptions2>;
  public performance_chartOptions: Partial<ChartOptions2>;
  public oee_chartOptions: Partial<ChartOptions2>;
  public today_runtime_downtime_chartOptions: Partial<ChartOptions2>;
  public runtime_downtimeACOption: Partial<ChartOptions2>;
  public planned_prod_time_chartOptions: Partial<ChartOptions2>;
  public net_runtime_chartOptions: Partial<ChartOptions2>;
  public fully_prod_time_chartOptions: Partial<ChartOptions2>;
  public availabilityLosschartOptions: Partial<ChartOptions2>;
  public performanceLosschartOptions: Partial<ChartOptions2>;
  public qualityLosschartOptions: Partial<ChartOptions2>;
  public mtbfchartOptions: Partial<ChartOptions2>;
  public mttrchartOptions: Partial<ChartOptions2>;
  public faultTrendchartOption: Partial<ChartOptions2>;

// metrics type dropdown.
  public metrics_types:any=[
    {value: 'performance_based', viewValue:'Performance Based'},
    {value: 'time_based', viewValue:'Time Based'},
    {value: 'loss_based', viewValue:'Loss Based'},
    {value: 'maintenance_kpi', viewValue:'Maintenance KPI'}
    
  ];

  constructor(
    private assetService: AssetService,
    private navbarService: NavbarService,
    private snackbarComponent: SnackbarComponent,
    public authService: AuthService,
    private othersService: OthersService,
    public simulatorService: SimulatorService,
    public dashboardService :DashboardService,
    public datepipe: DatePipe,
  ) {
    if(this.authService.currentUser['role_id'] == 'JB1001'){
      this.navbarService.Title = "Performance Metrics";
    }else{
      this.navbarService.Title = "Metrics";
    }  
    this.othersService.setTitle(this.navbarService.Title);
  }

  ngOnInit(): void {
  
    this.assetLists();
    this.simulatorService.getRefreshNeededS().subscribe(()=>{
              this.assetLists();
   })
 }

  

assetlist:any=[];
assetInternalError:boolean= false;
no_assets:boolean;
latest_analysis:any = [];
no_current_analysis:boolean;
current_analysis_error:boolean;
trends_analysis_spinner:boolean = true;

oee_spinner:boolean =true;
performance_spinner:boolean= true;
availability_spinner:boolean = true;
qualiity_spinner:boolean = true;
runtime_downtime_spinner:boolean = true;
planned_prod_spinner:boolean = true;
netruntime_spinner:boolean = true;
fully_prod_time_spinner:boolean = true;
trends_analysis_error:boolean;

public availability_loss_InternalError: boolean = false;
public performance_loss_InternalError: boolean = false;
public quality_loss_InternalError: boolean = false
public availability_loss_spinner: boolean = true;
public performance_loss_spinner: boolean = true;
public quality_loss_spinner: boolean = true;

public today_oee_series:any;
public today_oee_received_on:any;
public today_performance_series:any;
public today_performance_received_on:any;
public today_availability_series:any;
public today_availability_received_on:any;
public today_quality_series:any;
public today_quality_received_on:any;

public time_frame_clicked: string ;
public time_frame_fault :string;
public fault_time_frame_clicked: string ;
public asset_name:string;
public metrics_type:string;
public card_no:string;
public Plant_time_zone:any; 


// this method will set the local storage item and it will call the current analysis.
setAssetanalysis(data:any){
 
  localStorage.setItem('selected_asset', data['sf_asset_id']);
  localStorage.setItem('selected_asset_name', data['sf_asset_name']);
  this.selected_asset_info = localStorage.getItem('selected_asset');
  let selected_metric_type_info = localStorage.getItem('selected_metrics_type');
  this.dashboardService.getTimeZone(this.selected_asset_info).subscribe(response =>{
    this.Plant_time_zone = response['plant_tzone'];
      var timezond = moment.tz(this.Plant_time_zone);
      var  formate = moment(timezond).format('h:mm:ss A z')
      this.timeshow = formate;
  
  this.assetService.getAssetslistS().subscribe(response=>{    
    if (response['Unsuccessful']){
      this.assetInternalError = true;
    }
    else{
      this.assetlist = response;
      this.daystabs = true;
      if( this.assetlist.length == 0)      {
         this.no_assets = true;
         this.daystabs = false;
        }else{
          if(selected_metric_type_info){
            this.selected_metric_type.setValue(selected_metric_type_info);
          }
          
        if(this.selected_asset_info){
          localStorage.setItem('selected_asset', this.selected_asset_info);
          this.selected_asset.setValue(Number(this.selected_asset_info));
          this.asset_name = localStorage.getItem("selected_asset_name");
        }else{
          localStorage.setItem('selected_asset', this.assetlist[0]['sf_asset_id']);
          this.selected_asset.setValue(this.assetlist[0]['sf_asset_id']);
          this.asset_name = this.assetlist[0]['sf_asset_name'];          
          this.selected_asset_info = localStorage.getItem('selected_asset');
        }
        if(this.time_frame_clicked == '1D' || this.time_frame_fault =='1' ){
          
          this.todayAssetperformanceMetrics();
        }
        else if(this.time_frame_clicked == '7D' || this.time_frame_fault =='7'){
          this.todayAssetperformanceMetrics();
        }
        else if(this.time_frame_clicked == '30D' || this.time_frame_fault =='30'){
          this.todayAssetperformanceMetrics();
        }
       
      }
    }
  },error => {
    this.assetInternalError = true;
  }) 
})
}

public timeshow:any

//  this method will display the assets.
selected_asset_info:any;
public daystabs;
assetLists(){
  this.selected_asset_info = localStorage.getItem('selected_asset');
  let selected_metric_type_info = localStorage.getItem('selected_metrics_type');
  let selected_asset_name=localStorage.getItem('selected_asset_name');

  
  this.dashboardService.getTimeZone(this.selected_asset_info).subscribe(response =>{
    this.Plant_time_zone = response['plant_tzone'];
      var timezond = moment.tz(this.Plant_time_zone);
      var  formate =moment(timezond).format('h:mm:ss A z')
      this.timeshow = formate;
    
  })
  this.assetService.getAssetslistS().subscribe(response=>{  
    if (response['Unsuccessful'])    {
      this.assetInternalError = true;
    }
    else{
      this.assetlist = response;
      this.daystabs = true;
      if( this.assetlist.length == 0)      {
         this.no_assets = true;
         this.daystabs = false;
        }else{
          if(selected_metric_type_info && this.selected_asset_info && selected_asset_name){
            this.selected_metric_type.setValue(selected_metric_type_info);
            localStorage.setItem('selected_asset', this.selected_asset_info);
            localStorage.setItem('selected_asset_name',selected_asset_name);
            this.selected_asset.setValue(Number(this.selected_asset_info));
            this.asset_name = localStorage.getItem("selected_asset_name");
          }else{
            this.selected_metric_type.setValue('performance_based');
            localStorage.setItem('selected_asset', this.assetlist[0]['sf_asset_id']);
            localStorage.setItem('selected_asset_name',this.assetlist[0]['sf_asset_name']);
            this.selected_asset.setValue(this.assetlist[0]['sf_asset_id']);
            this.asset_name = String(this.assetlist[0]['sf_asset_name']);
          }
          this.selected_asset_info = localStorage.getItem('selected_asset');
          this.time_frame_clicked = '1D';
          this.time_frame_fault = '1';
          this.todayAssetperformanceMetrics();
          this.no_assets = false;        
      }
    }
  },error => {
    this.assetInternalError = true;
  }) 
}


//  this method will display the asset trend analysis.
availability_values:any=[];
availability_charts_time_period:any=[];
public asset_metrics_type:string;

oee_metrics:any;
performance_metrics:any;
availability_metrics:any;
quality_metrics:any;
set_run_dowtime_metrics:any;
set_plannedprd_schedule:any;
set_netruntime:any;
set_flp_qlyloss:any;
availability_loss_metrics:any;
perf_loss_metrics:any;
quality_loss_metrics:any;
mtbf_metrics:any;
mttr_metrics:any;
faluttrend_metrics:any;
public is_save_btn:boolean;

// this method will call the current metrics metrics based on asset id, metrics type and it will update the metrics type.
todayAssetperformanceMetrics(){
  this.time = new Date().toLocaleTimeString();
  let selected_asset_ = localStorage.getItem('selected_asset');
  if(this.selected_metric_type.value){
    this.asset_metrics_type = this.selected_metric_type.value;
    localStorage.setItem("selected_metrics_type", this.asset_metrics_type);
  }else{
    this.asset_metrics_type = "performance_based";
    localStorage.setItem("selected_metrics_type", this.asset_metrics_type);
  }
if(selected_asset_){
// performance based API call.
if(this.asset_metrics_type == "performance_based"){
  if(this.time_frame_clicked == "1D"){
    this.gettodayOEEC();
    this.gettodayPerformanceC();
    this.getslowcycledata();
    this.gettodayAvailabilityC();
    this.gettodayQualityC();
  }else if(this.time_frame_clicked == "7D"){
      this.getlastdaysOEEC("7D");
      this.getlastdaysPerformanceC("7D");
      this.getlastdaysAvailabilityC("7D");
      this.getlastdaysQualityC("7D");
  }else{
      this.getlastdaysOEEC("30D");
      this.getlastdaysPerformanceC("30D");
      this.getlastdaysAvailabilityC("30D");
      this.getlastdaysQualityC("30D");
  }

}else if(this.asset_metrics_type == "time_based"){
    this.assetRuntimeDowntime(this.time_frame_clicked);
    this.get_lastdaysppn(this.time_frame_clicked);
    this.get_lastdaysnrrC(this.time_frame_clicked);
    this.get_lastdaysftpC(this.time_frame_clicked);
}else if(this.asset_metrics_type == "loss_based"){
    this.availabilityLoss(this.time_frame_clicked);
    this.performanceloss(this.time_frame_clicked);
    this.qualityLoss(this.time_frame_clicked);
}

else if(this.asset_metrics_type == "maintenance_kpi"){
  this.mttr(this.time_frame_clicked);
  this.mtbf(this.time_frame_clicked);
  this.faulTrend(this.time_frame_fault);
}

}else{
  this.no_assets = true;
  this.snackbarComponent.top_snackbar("Please choose an Asset !!",this.error_status);
}


}

// Last 7 days AssetperformanceMetrics.
public l7DAssetperformanceMetrics(){
  this.time = new Date().toLocaleTimeString();
  if(this.selected_asset_info){
    // performance based API call.
    if(this.asset_metrics_type == "performance_based"){
      this.getlastdaysOEEC("7D");
      this.getlastdaysPerformanceC("7D");
      this.getlastdaysAvailabilityC("7D");
      this.getlastdaysQualityC("7D");
    }else if(this.asset_metrics_type == "time_based"){
      this.assetRuntimeDowntime("7D");
      this.get_lastdaysppn("7D");
      this.get_lastdaysnrrC("7D");
      this.get_lastdaysftpC("7D");
    }else if(this.asset_metrics_type == "loss_based"){
      this.availabilityLoss("7D");
      this.performanceloss("7D");
      this.qualityLoss("7D");
      }
      else if(this.asset_metrics_type == "maintenance_kpi"){
        this.mttr("7D");
         this.mtbf("7D");
         this.faulTrend("7");
      }
  }
}

// Last 30 days AssetperformanceMetrics.
public l30DAssetperformanceMetrics(){
  if(this.selected_asset_info){
    // performance based API call.
    if(this.asset_metrics_type == "performance_based"){
      this.getlastdaysOEEC("30D");
      this.getlastdaysPerformanceC("30D");
      this.getlastdaysAvailabilityC("30D");
      this.getlastdaysQualityC("30D");
    }else if(this.asset_metrics_type == "time_based"){
      this.assetRuntimeDowntime("30D");
      this.get_lastdaysppn("30D");
      this.get_lastdaysnrrC("30D");
      this.get_lastdaysftpC("30D");
    }else if(this.asset_metrics_type == "loss_based"){
      this.availabilityLoss("30D");
      this.performanceloss("30D");
      this.qualityLoss("30D");
    }
    else if(this.asset_metrics_type == "maintenance_kpi"){
      this.mttr("30D");
      this.mtbf("30D");
      this.faulTrend("30");
    }
  }
}


// ---------------------------------SET METRICS----------------------------------------
// this function will set OEE metrics info.
public setoee(){
  if(this.oee_metrics['sf_chart_type'] == 'no_chart'){
    this.chart_type.setValue('area_chart');
    this.is_save_btn = true;
  }else{
    this.chart_type.setValue(this.oee_metrics['sf_chart_type']);
    this.is_save_btn = false;
  }
}

// this function will set Performance metrics info.
public setPerformance(){
  if(this.performance_metrics['sf_chart_type'] == 'no_chart'){
    this.chart_type.setValue('area_chart');
    this.is_save_btn = true;
  }else{
    this.chart_type.setValue(this.performance_metrics['sf_chart_type']);
    this.is_save_btn = false;
  }
}

// this function will set availability metrics info.
public setAvailaibility(){
  if(this.availability_metrics['sf_chart_type'] == 'no_chart'){
    this.chart_type.setValue('area_chart');
    this.is_save_btn = true;
  }else{
    this.chart_type.setValue(this.availability_metrics['sf_chart_type']);
    this.is_save_btn = false;
  }
}

// this function will set Quality metrics info.
public setQuality(){
  if(this.quality_metrics['sf_chart_type'] == 'no_chart'){
    this.chart_type.setValue('area_chart');
    this.is_save_btn = true;
  }else{
    this.chart_type.setValue(this.quality_metrics['sf_chart_type']);
    this.is_save_btn = false;
  }
}

// this function will set assetRuntimeDowntime metrics info.
public setRuntimeDowntime(){
  if(this.set_run_dowtime_metrics['sf_chart_type'] == 'no_chart'){
    this.chart_type.setValue('column_chart');
    this.is_save_btn = true;
  }else{
    this.chart_type.setValue(this.set_run_dowtime_metrics['sf_chart_type']);
    this.is_save_btn = false;
  }
}

// this function will set Planned Production vs Schedule loss metrics info.
public setPlannedprodSchedule(){
  if(this.set_plannedprd_schedule['sf_chart_type'] == 'no_chart'){
    this.chart_type.setValue('column_chart');
    this.is_save_btn = true;
  }else{
    this.chart_type.setValue(this.set_plannedprd_schedule['sf_chart_type']);
    this.is_save_btn = false;
  }
}

// this function will set Planned net runtime metrics info.
public setNetRuntime(){
  if(this.set_netruntime['sf_chart_type'] == 'no_chart'){
    this.chart_type.setValue('column_chart');
    this.is_save_btn = true;
  }else{
    this.chart_type.setValue(this.set_netruntime['sf_chart_type']);
    this.is_save_btn = false;
  }
}

// this function will set Planned net runtime metrics info.
public setFullyProdQlyLoss(){
  if(this.set_flp_qlyloss['sf_chart_type'] == 'no_chart'){
    this.chart_type.setValue('column_chart');
    this.is_save_btn = true;
  }else{
    this.chart_type.setValue(this.set_flp_qlyloss['sf_chart_type']);
    this.is_save_btn = false;
  }
}

// this function will set availability loss metrics info.
public setAvailabilityLoss(){
  if(this.availability_loss_metrics['sf_chart_type'] == 'no_chart'){
    this.chart_type.setValue('column_chart');
    this.is_save_btn = true;
  }else{
    this.chart_type.setValue(this.availability_loss_metrics['sf_chart_type']);
    this.is_save_btn = false;
  }
}

// this function will set availability loss metrics info.
public setPerformanceLoss(){
  if(this.perf_loss_metrics['sf_chart_type'] == 'no_chart'){
    this.chart_type.setValue('column_chart');
    this.is_save_btn = true;
  }else{
    this.chart_type.setValue(this.perf_loss_metrics['sf_chart_type']);
    this.is_save_btn = false;
  }
}

// this function will set quality loss metrics info.
public setQualityLoss(){
  if(this.quality_loss_metrics['sf_chart_type'] == 'no_chart'){
    this.chart_type.setValue('column_chart');
    this.is_save_btn = true;
  }else{
    this.chart_type.setValue(this.quality_loss_metrics['sf_chart_type']);
    this.is_save_btn = false;
  }
}

// this function will set quality loss metrics info.
public setmttr(){
 if(this.mttr_metrics['sf_chart_type'] == 'no_chart'){
    this.chart_type.setValue('column_chart');
    this.is_save_btn = true;
  }else{
    this.chart_type.setValue(this.mttr_metrics['sf_chart_type']);
    this.is_save_btn = false;
  }
}

public setmtbr(){
  if(this.mtbf_metrics['sf_chart_type'] == 'no_chart'){
    this.chart_type.setValue('column_chart');
    this.is_save_btn = true;
  }else{
    this.chart_type.setValue(this.mtbf_metrics['sf_chart_type']);
    this.is_save_btn = false;
  }
}

public setfaultTrend(){
  if(this.faluttrend_metrics['sf_chart_type'] == 'no_chart'){
    this.chart_type.setValue('column_chart');
    this.is_save_btn = true;
  }else{
    this.chart_type.setValue(this.faluttrend_metrics['sf_chart_type']);
    this.is_save_btn = false;
  }
}

// ----------------------------------------------------------------------------------------
public oee_error:boolean=false;
public performance_error:boolean=false;
public availability_error:boolean=false;
public quality_error:boolean=false;


//  This method will display today asset efficiency metrics( only OEE) by asset_id and timezone.
gettodayOEEC(){
  this.dashboardService.getTimeZone(this.selected_asset_info).subscribe(response =>{
  this.Plant_time_zone = response['plant_tzone'];
  this.oee_spinner = true;
  this.assetService.gettodayOEES(this.selected_asset_info, this.Plant_time_zone).subscribe(response =>{
    this.oee_spinner = false;
    if(response){
      if(response['no_data']){
          this.no_current_analysis = true;
      }else{
        this.no_current_analysis = false;
        this.today_oee_series = response['value'];
        this.today_oee_received_on = response['received_on'];        
        this.CurrentAnalysis(); 
      }
    }else{
      this.oee_error = true;
    }
  }, error =>{
    this.oee_spinner = false;
    this.oee_error = true;
  })
})
}

//  This method will display today asset efficiency metrics( only PERFORMANCE) by asset_id and timezone.
gettodayPerformanceC(){
  this.dashboardService.getTimeZone(this.selected_asset_info).subscribe(response =>{
    this.Plant_time_zone = response['plant_tzone'];
  this.performance_spinner = true;
  this.assetService.gettodayPerformanceS(this.selected_asset_info, this.Plant_time_zone).subscribe(response =>{
    this.performance_spinner = false;
    if(response){
      if(response['no_data']){
          this.no_current_analysis = true;
      }else{
      this.no_current_analysis = false;
      this.today_performance_series = response['value'];
      this.today_performance_received_on = response['received_on'];
      this.CurrentAnalysis();
      }
    }else{
      this.performance_error = true;
    }
  }, error =>{
    this.performance_spinner = false;
    this.performance_error = true;
  })
})
}

//this method will display the slowcycle data
slowCycleSpinner:boolean;
slowCycleError:boolean = false;
slow_cycle:number;
efficiency:number;
goodQuantity:number;
totalQuantity:number;
rejection:Number;
getslowcycledata(){
  this.slowCycleSpinner=true;
  this.assetService.getslowcycles(this.selected_asset_info).subscribe(response=>{
      this.slowCycleSpinner=false;
      this.slowCycleError = false;
      this.slow_cycle=response['slow_cycle_time'];
      this.efficiency=response['machine_effiency'];
      this.goodQuantity=response['total_good_count'];
      this.totalQuantity=response['total_qty'];
      this.rejection=response['total_rejection_count'];
  },error =>{
    this.slowCycleSpinner = false;
    this.slowCycleError = true;
  })
}

//  This method will display today asset efficiency metrics( only AVAILABILITY) by asset_id and timezone.
gettodayAvailabilityC(){ 
  this.dashboardService.getTimeZone(this.selected_asset_info).subscribe(response =>{
    this.Plant_time_zone = response['plant_tzone'];
    this.availability_spinner = true; 
    this.assetService.gettodayAvailabilityS(this.selected_asset_info, this.Plant_time_zone).subscribe(response =>{    
    this.availability_spinner = false;
    if(response){
      if(response['no_data']){
          this.no_current_analysis = true;
      }else{
        this.no_current_analysis = false;
        this.today_availability_series = response['value'];
        this.today_availability_received_on = response['received_on'];
        this.CurrentAnalysis();
      }
    }else{
      this.availability_error = true;
    }
  }, error =>{
    this.availability_spinner = false;
    this.availability_error = true;
  })
})
}

//  This method will display today asset efficiency metrics( only QUALITY) by asset_id and timezone.
gettodayQualityC(){
  this.dashboardService.getTimeZone(this.selected_asset_info).subscribe(response =>{
  this.Plant_time_zone = response['plant_tzone'];
  this.qualiity_spinner = true;
  this.assetService.gettodayQualityS(this.selected_asset_info, this.Plant_time_zone).subscribe(response =>{
    this.qualiity_spinner = false;
    if(response){
      if(response['no_data']){
          this.no_current_analysis = true;
      }else{
        this.no_current_analysis = false;
      this.today_quality_series = response['value'];
      this.today_quality_received_on = response['received_on'];
      this.CurrentAnalysis();
      }
    }else{
      this.quality_error = true;
    }
  }, error =>{
    this.qualiity_spinner = false;
    this.quality_error = true;
  })
})
}

// This method will display last 7 or 30 days asset efficiency metrics( only OEE) by asset_id, time interval and timezone.
oeeData:boolean = false;
oeeDatavalue:number;
getlastdaysOEEC(timeinterval:string){
  this.dashboardService.getTimeZone(this.selected_asset_info).subscribe(response =>{
  this.Plant_time_zone = response['plant_tzone'];
  this.oee_spinner = true;
  this.assetService.getlastdaysOEES(this.selected_asset_info, timeinterval, this.Plant_time_zone).subscribe(response =>{
    this.oee_spinner = false;    
    this.oeeDatavalue=response['oee']['data']['oee'].reduce((prev,next)=>prev+next,0);
    this.oee_spinner = false;
    if(this.oeeDatavalue == 0){
      this.oeeData = true;
    }  
    else if(response){ 
      this.oeeData = false;          
      this.oee_metrics = response['metric_info'];
      if(response['metric_info']['sf_chart_type'] == "column_chart"){
        this.OEEchartOptionsColumn(response['oee']);
      }else{
        this.OEEchartOptions(response['oee']);        
      }
    }else{
      this.oee_error = true;
    }
  }, error =>{
    this.oee_spinner = false;
    this.oee_error = true;
  })
})
}

// This method will display last 7 or 30 days asset efficiency metrics( only PERFORMANCE) by asset_id, time interval and timezone.
performancedata:boolean = false;
performancedatavalue:number;
getlastdaysPerformanceC(timeinterval:string){
  this.dashboardService.getTimeZone(this.selected_asset_info).subscribe(response =>{
    this.Plant_time_zone = response['plant_tzone'];
  this.performance_spinner = true;
  this.assetService.getlastdaysPerformanceS(this.selected_asset_info, timeinterval, this.Plant_time_zone).subscribe(response =>{
    this.performancedatavalue=response['performance']['data']['performance'].reduce((prev,next)=>prev+next,0);
       this.performance_spinner = false;
        if(this.performancedatavalue == 0)
        {
          this.performancedata = true;
        }  
      else if(response){    
      this.performancedata = false;
      this.performance_metrics = response['metric_info'];
      if(response['metric_info']['sf_chart_type'] == "column_chart"){
        this.performenceAnalysisColumn(response['performance']);
      }else{
        this.performenceAnalysis(response['performance']);        
      }
    }else{
      this.performance_error = true;
    }
  }, error =>{
    this.performance_spinner = false;
    this.performance_error = true;
  });
});
}

// This method will display last 7 or 30 days asset efficiency metrics( only AVAILABILITY) by asset_id, time interval and timezone.
avaliabilitydata:boolean = false;
availabilitydatavalue:number;
getlastdaysAvailabilityC(timeinterval:string){
  this.dashboardService.getTimeZone(this.selected_asset_info).subscribe(response =>{
    this.Plant_time_zone = response['plant_tzone'];
  this.availability_spinner = true;

  this.assetService.getlastdaysAvailabilityS(this.selected_asset_info, timeinterval, this.Plant_time_zone).subscribe(response =>{
    this.availabilitydatavalue=response['availability']['data']['availability'].reduce((prev,next)=>prev+next,0);
     this.availability_spinner = false;    
        if(this.availabilitydatavalue == 0){
          this.avaliabilitydata = true;
        }   
      else if(response){    
      this.avaliabilitydata = false;     
      this.availability_metrics = response['metric_info'];
      if(response['metric_info']['sf_chart_type'] == "column_chart"){
        this.availablityAnalysisColumn(response['availability']);
      }else{
        this.availablityAnalysis(response['availability']);        
      }
    }else{
      this.availability_error = true;
    }
  }, error =>{
    this.availability_spinner = false;
    this.availability_error = true;
  });
});
}

// This method will display last 7 or 30 days asset efficiency metrics( only QUALITY) by asset_id, time interval and timezone.
qualitydata:boolean = false;
qualitydatavalue:number;
getlastdaysQualityC(timeinterval:string){
  this.dashboardService.getTimeZone(this.selected_asset_info).subscribe(response =>{
    this.Plant_time_zone = response['plant_tzone'];
  this.qualiity_spinner = true;
  this.assetService.getlastdaysQualityS(this.selected_asset_info, timeinterval, this.Plant_time_zone).subscribe(response =>{
    this.qualitydatavalue=response['quality']['data']['quality'].reduce((prev,next)=>prev+next,0);
   this.qualiity_spinner = false;
    if(this.qualitydatavalue == 0)
    {
      this.qualitydata = true;
    } 
    else if(response){  
      this.qualitydata = false;    
      this.quality_metrics = response['metric_info'];
      if(response['metric_info']['sf_chart_type'] == "column_chart"){
        this.qualityAnalysisColumn(response['quality']);
      }else{
        this.qualityAnalysis(response['quality']);        
      }
    }else{
      this.quality_error = true;
    }
  }, error =>{
    this.qualiity_spinner = false;
    this.quality_error = true;
  });
});
}


// This method will display asset runtime and downtime metrics through API call.
runtimevalue:number;
planneddowntimevalue:number;
unplanneddowntimevalue:number;
rundown:boolean = false;
public assetRuntimeDowntime(timeinterval:string){  

  this.dashboardService.getTimeZone(this.selected_asset_info).subscribe(response =>{
  this.Plant_time_zone = response['plant_tzone'];
  this.assetService.gettodayTBmetricsS(this.selected_asset_info, timeinterval, this.Plant_time_zone).subscribe(response =>{        
    this.runtimevalue=response['run_down']['data'][0]['data'].reduce((prev,next)=>prev+next,0);
    this.planneddowntimevalue=response['run_down']['data'][1]['data'].reduce((prev,next)=>prev+next,0);
    this.unplanneddowntimevalue=response['run_down']['data'][2]['data'].reduce((prev,next)=>prev+next,0);      
    this.runtime_downtime_spinner = false;
    if(this.runtimevalue == 0 && this.planneddowntimevalue == 0 && this.unplanneddowntimevalue == 0)
    {
      this.rundown = true;
    }
    else if(response){ 
      this.rundown = false;
      this.set_run_dowtime_metrics = response['metric_info'];
      if(response['metric_info']['sf_chart_type'] == "area_chart"){
        this.runtime_downtimeAnalysisArea(response['run_down']);
      }else{
        this.runtime_downtimeAnalysis(response['run_down']);       
      }      
    }else{
      this.assetInternalError = true;
    }
  }, error =>{
    this.runtime_downtime_spinner = false;
    this.assetInternalError = true;
  });
})

}

//  This method will display asset planned production time and scheduled loss through API call.
plannedproductionvalue:number;
schedulelossvalue:number;
plannedscheduledata:boolean = false;
public get_lastdaysppn(timeinterval:string){;

  this.dashboardService.getTimeZone(this.selected_asset_info).subscribe(response =>{
  this.Plant_time_zone = response['plant_tzone'];
  this.assetService.get_lastdaysppnS(this.selected_asset_info, timeinterval, this.Plant_time_zone).subscribe(response =>{
  this.plannedproductionvalue=response['plannedprod_scheduleloss']['data'][0]['data'].reduce((prev,next)=>prev+next,0);
    this.schedulelossvalue=response['plannedprod_scheduleloss']['data'][1]['data'].reduce((prev,next)=>prev+next,0);
    this.planned_prod_spinner = false;
    if(this.plannedproductionvalue == 0 && this.schedulelossvalue == 0)
    {
      this.plannedscheduledata = true;
    }
    else if(response){
      this.plannedscheduledata = false;
      this.set_plannedprd_schedule = response['metric_info'];
      if(response['metric_info']['sf_chart_type'] == "area_chart"){
        this.plannedprodAnalysisArea(response['plannedprod_scheduleloss']);
      }else{
        this.plannedprodAnalysis(response['plannedprod_scheduleloss']);        
      }       
    }else{
      this.assetInternalError = true;
    }
  }, error =>{
    this.planned_prod_spinner = false;
    this.assetInternalError = true;
  });
});

}

//  This method will display asset Net runrate through API call.
runratedata:boolean = false;
performancevalue:number;
runratedatavalue:number;
public get_lastdaysnrrC(timeinterval:string){

  this.dashboardService.getTimeZone(this.selected_asset_info).subscribe(response =>{
    this.Plant_time_zone = response['plant_tzone'];
  this.assetService.get_lastdaysnrrS(this.selected_asset_info, timeinterval, this.Plant_time_zone).subscribe(response =>{
   this.netruntime_spinner = false;    
   this.runratedatavalue=response['nrr']['data'][0]['data'].reduce((prev,next)=>prev+next,0);
   this.performancevalue=response['nrr']['data'][1]['data'].reduce((prev,next)=>prev+next,0);
    if(this.runratedatavalue == 0  && this.performancevalue == 0)
    {
      this.runratedata = true;
    }  
   else if(response){   
      this.runratedata = false; 
      this.set_netruntime = response['metric_info'];
      if(response['metric_info']['sf_chart_type'] == "area_chart"){
        this.netRunrateAnalysisArea(response['nrr']);
      }else{
        this.netRunrateAnalysis(response['nrr']);        
      } 
    }else{
      this.assetInternalError = true;
    }
  }, error =>{
    this.netruntime_spinner = false;
    this.assetInternalError = true;
  });
});
}

//  This method will display asset Fully productive time through API call.
fullyproductionvalue:number;
qualitylossvalue:number;
productionqualitydata:boolean = false;
public get_lastdaysftpC(timeinterval:string){

  this.dashboardService.getTimeZone(this.selected_asset_info).subscribe(response =>{
    this.Plant_time_zone = response['plant_tzone'];
  this.assetService.get_lastdaysftpS(this.selected_asset_info, timeinterval, this.Plant_time_zone).subscribe(response =>{
   this.fully_prod_time_spinner = false;
   this.fullyproductionvalue=response['fpqs']['data'][0]['data'].reduce((prev,next)=>prev+next,0);
   this.qualitylossvalue=response['fpqs']['data'][1]['data'].reduce((prev,next)=>prev+next,0);
    if(this.fullyproductionvalue == 0 && this.qualitylossvalue == 0){
      this.productionqualitydata = true;
    }
    else if(response){
      this.productionqualitydata = false;
      if(response==false){
        this.assetInternalError = true;
      }else{
      this.set_flp_qlyloss = response['metric_info'];
      if(response['metric_info']['sf_chart_type'] == "area_chart"){
        this.fullProdTimeAnalysisArea(response['fpqs']);
      }else{
        this.fullProdTimeAnalysis(response['fpqs']);        
      } 
    }
    }
    else{
      this.assetInternalError = true;
    }
  }, error =>{
    this.fully_prod_time_spinner = false;
    this.assetInternalError = true;
  });
});
}


// This method will display availabilityLoss through API call.
avaliabilitylossdata:boolean = false;
availabilitylossdatavalue:number;
public availabilityLoss(timeinterval:string) {  

  this.dashboardService.getTimeZone(this.selected_asset_info).subscribe(response =>{
    this.Plant_time_zone = response['plant_tzone'];
    this.assetService.get_lastdaysAvailloss(this.selected_asset_info, timeinterval, this.Plant_time_zone).subscribe(response => {    
 this.availability_loss_spinner = false;
    this.performance_spinner = false;
    this.availabilitylossdatavalue=response['availability_loss']['data'][0]['data'].reduce((prev,next)=>prev+next,0);   
    if(this.availabilitylossdatavalue == 0){
      this.avaliabilitylossdata = true;
    }
    else if (response) {
      this.avaliabilitylossdata = false;
      if (response == false) {
        this.availability_loss_InternalError = true;
      }
      else {        
        this.availability_loss_metrics = response['metric_info'];
        if(response['metric_info']['sf_chart_type'] == "area_chart"){
          this.availabilityLosschartArea(response['availability_loss']);
        }else{
          this.availabilityLosschart(response['availability_loss']);        
        } 
      }
    }
  }, error => {
    this.availability_loss_spinner = false;
    this.availability_loss_InternalError = false;
  })
})

}

  // This method will display performanceloss through API call.
  performancelossdata:boolean = false;
  performancelossdatavalue:number;

public performanceloss(timeinterval:string) { 
  this.dashboardService.getTimeZone(this.selected_asset_info).subscribe(response =>{
  this.Plant_time_zone = response['plant_tzone']; 
  this.assetService.get_lastdaysPerfloss(this.selected_asset_info, timeinterval, this.Plant_time_zone).subscribe(response => {
this.performancelossdatavalue=response['performance_loss']['data'][0]['data'].reduce((prev,next)=>prev+next,0); 
this.performance_loss_spinner = false;
  if(this.performancelossdatavalue == 0){
    this.performancelossdata = true;
  }
   else if (response) {
    this.performancelossdata = false;
      if (response == false) {
        this.performance_loss_InternalError = true;
      }
      else {       
        this.perf_loss_metrics = response['metric_info'];
        if(response['metric_info']['sf_chart_type'] == "area_chart"){
          this.performanceLosschartArea(response['performance_loss']);
        }else{
          this.performanceLosschart(response['performance_loss']);        
        } 
      }
    }
  }, error => {
    this.performance_loss_spinner = false;
    this.performance_loss_InternalError = true;
  })
})
}

// This method will display qualityLoss through API call.
qualitylossdata:boolean = false;
qualitylossdatavalue:number;
public qualityLoss(timeinterval:string) { 
 this.dashboardService.getTimeZone(this.selected_asset_info).subscribe(response =>{
  this.Plant_time_zone = response['plant_tzone']; 
  this.assetService.get_lastdaysqlyLoss(this.selected_asset_info, timeinterval, this.Plant_time_zone).subscribe(response => {
    this.quality_loss_spinner = false;    
    this.qualitylossdatavalue=response['qly_loss']['data'][0]['data'].reduce((prev,next)=>prev+next,0); 
    this.quality_loss_spinner = false;  
    if(this.qualitylossdatavalue == 0){
      this.qualitylossdata = true;
    } else if (response) { 
      this.qualitylossdata = false;
     this.quality_loss_metrics = response['metric_info'];
      if(response['metric_info']['sf_chart_type'] == "area_chart"){
        this.qualityLosschartArea(response['qly_loss']);
      }else{
        this.qualityLosschart(response['qly_loss']);        
      }
    } else {
      this.quality_loss_InternalError = true;
    }
  }, error => {
    this.quality_loss_spinner = false;
    this.quality_loss_InternalError = true;
  });
});
}


// This method will display  availability loss metrics(Time Based Analysis) by asset_id, time_interval, timezone.

public mtbf_value:any;
public mtbf_unit :any;
public mtbf_spinner: boolean = true;
public mtbf_InternalError: boolean = false;
public total_downtime :any
public total_downtime_unit :any;
public total_time_spent_unit:any;
public total_time_spent:any;
mtbfdata:boolean = false;

public mtbf(timeinterval:string){
  this.dashboardService.getTimeZone(this.selected_asset_info).subscribe(response =>{
  this.Plant_time_zone = response['plant_tzone']; 
  this.assetService.mean_Time_Between_Replacements(this.selected_asset_info,this.Plant_time_zone, timeinterval ).subscribe(response => {
    this.mtbf_spinner = false; 
    if(timeinterval =="7D" && response['mtbf']['data'][0]['mtbf_value'].reduce((prev,next)=>prev+next,0)== 0 ){
      this.mtbfdata = true;
    } 
    else if(timeinterval =="30D" && response['mtbf']['data'][0]['mtbf_value'].reduce((prev,next)=>prev+next,0)== 0 ){
      this.mtbfdata = true;
    } 
    
    else if (response) {  
      this.mtbfdata = false;    
      this.mtbf_metrics = response['metric_info'];
      this.mtbf_value = response['mtbf']['data'][0]['mtbf_value'];
      this.mtbf_unit = response['mtbf']['data'][0]['mtbf_unit'];
      this.total_downtime = response['mtbf']['data'][0]['total_downtime'];
      this.total_downtime_unit = response['mtbf']['data'][0]['total_downtime_unit'];
      this.total_time_spent = response['mtbf']['data'][0]['total_time_spent'];
      this.total_time_spent_unit = response['mtbf']['data'][0]['total_time_spent_unit'];
      if(response['metric_info']['sf_chart_type'] == "area_chart"){
        this.mtbfchartArea(response['mtbf']);
      }else{
        this.mtbfchart(response['mtbf']);        
      }
    } else {
      this.mtbf_InternalError = true;
    }
  }, error => {
    this.mtbf_spinner = false;
    this.mtbf_InternalError = true;
  })
})
}


// This method will display  availability loss metrics(Time Based Analysis) by asset_id, time_interval, timezone.

public mttr_value:any
public mttr_spinner: boolean = true;
public mttr_InternalError: boolean = false;
public mttr_unit:any;
public mttrdata:boolean = false; 
public mttr(timeinterval:string){
  this.dashboardService.getTimeZone(this.selected_asset_info).subscribe(response =>{
    this.Plant_time_zone = response['plant_tzone']; 
    this.assetService.mean_Time_To_Repair(this.selected_asset_info,this.Plant_time_zone, timeinterval ).subscribe(response => {
    this.mttr_spinner = false;
     
    if(timeinterval =="7D" && response['mttr']['data'][0]['mttr_value'].reduce((prev,next)=>prev+next,0)== 0 ){
      this.mttrdata = true;
    } 
    else if(timeinterval =="30D" && response['mttr']['data'][0]['mttr_value'].reduce((prev,next)=>prev+next,0)== 0 ){
      this.mttrdata = true;
    }    
    else if (response) { 
      this.mttrdata = false;     
      this.mttr_metrics = response['metric_info'];
      this.mttr_value = response['mttr']['data'][0]['mttr_value'];
      this.mttr_unit = response['mttr']['data'][0]['unit'];
     if(response['metric_info']['sf_chart_type'] == "area_chart"){
        this.mttrchartArea(response['mttr']);
      }else{
        this.mttrchart(response['mttr']);        
      }
    } else {
      this.mttr_InternalError = true;
    }
  }, error => {
    this.mttr_spinner = false;
    this.mttr_InternalError = true;
  })
})
}

public faultTrend_spinner: boolean = true;
public faultTrend_InternalError: boolean = false;
public faulttrenddata:boolean = false; 
faulTrend(timeinterval:string){
  this.assetService.faultTrend(this.selected_asset_info, timeinterval ).subscribe(response => {
   this.faultTrend_spinner = false; 
     if(response['fault_trend']==0) {
       this.faulttrenddata = true;
     }   
    else if (response) {  
      this.faulttrenddata = false;    
      this.faluttrend_metrics = response['metric_info'];
      if(response['metric_info']['sf_chart_type'] == "area_chart"){
        this.faultTrendArea(response['fault_trend']);
      }else{
        this.faultTrend(response['fault_trend']);  
              
      }
    } else {
      this.faultTrend_InternalError = true;
    }
  }, error => {
    this.faultTrend_spinner = false;
    this.faultTrend_InternalError = true;
  })

}

// -------------------------------------------------------------------------------------------------------------------------
//  Asset metrics configurations.
// -------------------------------------------------------------------------------------------------------------------------

// This method will update the particular card.
public updateCardInfo(){
  if(this.metrics_type=='runtime_downtime' && this.card_no=='1D-1'){
    this.assetRuntimeDowntime("1D");
  }else if(this.metrics_type=='runtime_downtime' && this.card_no=='7D-1'){
    this.assetRuntimeDowntime("7D");
  }else if(this.metrics_type=='runtime_downtime' && this.card_no=='30D-1'){
    this.assetRuntimeDowntime("30D");
  }
 if(this.metrics_type=='plannedprod_scheduleloss' && this.card_no=='1D-2'){
    this.get_lastdaysppn("1D");
  }else if(this.metrics_type=='plannedprod_scheduleloss' && this.card_no=='7D-2'){
    this.get_lastdaysppn("7D");
  }else if(this.metrics_type=='plannedprod_scheduleloss' && this.card_no=='30D-2'){
    this.get_lastdaysppn("30D");
  }
  if(this.metrics_type=='net_runtime' && this.card_no=='1D-3'){
    this.get_lastdaysnrrC("1D");
  }else if(this.metrics_type=='net_runtime' && this.card_no=='7D-3'){
    this.get_lastdaysnrrC("7D");
  }else if(this.metrics_type=='net_runtime' && this.card_no=='30D-3'){
    this.get_lastdaysnrrC("30D");
  }
  if(this.metrics_type=='fpql_runtime' && this.card_no=='1D-4'){
    this.get_lastdaysftpC("1D");
  }else if(this.metrics_type=='fpql_runtime' && this.card_no=='7D-4'){
    this.get_lastdaysftpC("7D");
  }else if(this.metrics_type=='fpql_runtime' && this.card_no=='30D-4'){
    this.get_lastdaysftpC("30D");
  }
  if(this.metrics_type=='oee' && this.card_no=='7D-1'){
    this.getlastdaysOEEC("7D");
  }else if(this.metrics_type=='oee' && this.card_no=='30D-1'){
    this.getlastdaysOEEC("30D");
  }
  if(this.metrics_type=='performance' && this.card_no=='7D-2'){
    this.getlastdaysPerformanceC("7D");
  }else if(this.metrics_type=='performance' && this.card_no=='30D-2'){
    this.getlastdaysPerformanceC("30D");
  }  
  if(this.metrics_type=='availability' && this.card_no=='7D-3'){
    this.getlastdaysAvailabilityC("7D");
  }else if(this.metrics_type=='availability' && this.card_no=='30D-3'){
    this.getlastdaysAvailabilityC("30D");
  }  
  if(this.metrics_type=='quality' && this.card_no=='7D-4'){
    this.getlastdaysQualityC("7D");
  }else if(this.metrics_type=='quality' && this.card_no=='30D-4'){
    this.getlastdaysQualityC("30D");
  }
  if(this.metrics_type=='availability_loss' && this.card_no=='1D-1'){
    this.availabilityLoss("1D");
  }  
  else if(this.metrics_type=='availability_loss' && this.card_no=='7D-1'){
    this.availabilityLoss("7D");
  }else if(this.metrics_type=='availability_loss' && this.card_no=='30D-1'){
    this.availabilityLoss("30D");
  }

  if(this.metrics_type=='performance_loss' && this.card_no=='1D-2'){
    this.performanceloss("1D");
  }  
  else if(this.metrics_type=='performance_loss' && this.card_no=='7D-2'){
    this.performanceloss("7D");
  }else if(this.metrics_type=='performance_loss' && this.card_no=='30D-2'){
    this.performanceloss("30D");
  }

  if(this.metrics_type=='quality_loss' && this.card_no=='1D-3'){
    this.qualityLoss("1D");
  }  
  else if(this.metrics_type=='quality_loss' && this.card_no=='7D-3'){
    this.qualityLoss("7D");
  }else if(this.metrics_type=='quality_loss' && this.card_no=='30D-3'){
    this.qualityLoss("30D");
  }

  if(this.metrics_type=='MTTR' && this.card_no=='1D-1'){
    this.mttr("1D");
  } 
  else if(this.metrics_type=='MTTR' && this.card_no=='7D-1'){
    this.mttr("7D");
  } 

  else if(this.metrics_type=='MTTR' && this.card_no=='30D-1'){
    this.mttr("30D");
  } 

  if(this.metrics_type=='MTBF' && this.card_no=='1D-2'){
    this.mtbf("1D");
  } 

  else if(this.metrics_type=='MTBF' && this.card_no=='7D-2'){
    this.mtbf("7D");
  } 
  else if(this.metrics_type=='MTBF' && this.card_no=='30D-2'){
    this.mtbf("30D");
  } 
 

  if(this.metrics_type=="Fault trend" && this.card_no=='1-3'){
    this.faulTrend("1");
  } 
  else if(this.metrics_type=="Fault trend" && this.card_no=='7-3'){
    this.faulTrend("7");
  } 

  else if(this.metrics_type=="Fault trend" && this.card_no=="30-3"){
    this.faulTrend("30");
  } 

}



openModal : boolean = false
// This method will save the asset metrics configuration.
public postAssetMetric(){
  let data = {}
  if(this.chart_type.value){
    data['fw_tenant_id'] = this.authService.currentUser['tenant_id'];        
    data['sf_asset_id'] = this.selected_asset.value;
    data['sf_metrics_type'] = this.metrics_type;
    if (this.metrics_type =="Fault trend"){
    data['sf_time_interval'] = this.time_frame_fault;
    } 
    else if (this.metrics_type !="Fault trend"){
      data['sf_time_interval'] = this.time_frame_clicked;
    } 
  
    data['sf_chart_type'] = this.chart_type.value;
    data['sf_screen_name'] = 'asset_metrics';
    data['sf_card_title'] = '';
    data['sf_card_no'] = this.card_no;
    data['created_by'] = this.authService.currentUser['email'];
     this.assetService.postAssetMetricS(data).subscribe(response =>{
      $('#MetricsModalTitle').modal('hide')
      this.updateCardInfo();
    });
  }else{
    this.snackbarComponent.top_snackbar("Choose an chart type !!",this.error_status)
    $('#MetricsModalTitle').modal('show');
  }
}

// This method will update the asset metrics configuration.
public putAssetMetric(){
  let data = {}
  if(this.chart_type.value){        
    data['sf_metrics_type'] = this.metrics_type;
    if (this.metrics_type =="Fault trend"){
      data['sf_time_interval'] = this.time_frame_fault;
    } 
    else if (this.metrics_type !="Fault trend"){
      data['sf_time_interval'] = this.time_frame_clicked;
    } 
    data['sf_chart_type'] = this.chart_type.value;
    data['sf_screen_name'] = 'asset_metrics';
    data['sf_card_title'] = '';
    data['sf_card_no'] = this.card_no;
    data['updated_by'] = this.authService.currentUser['email'];
    this.assetService.putAssetMetricS(data).subscribe(response =>{
     this.updateCardInfo();
     $('#MetricsModalTitle').modal('hide')
    });
  }else{
    this.snackbarComponent.top_snackbar("Choose an chart type !!",this.error_status)
    $('#MetricsModalTitle').modal('show')
  }
}

// Clear all method
clearall(){
  this.chart_type.reset();
}



// -------------------------------------------------------------------------------------------------------------------------
//  Charts configurations.
// -------------------------------------------------------------------------------------------------------------------------

//  current analysis.
public CurrentAnalysis(){
  this.Current_chartOptions = {
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


// -------------------------OEE. ------------------------------.
// Area Chart.
public OEEchartOptions(data:any){
  this.oee_chartOptions = {
    series: [
      {
        name: "OEE",
        data: data['data']['oee']
      }
    ],
    chart: {
      height: 250,
      type: "area",
      zoom: {
        enabled: false
      },
      dropShadow: {
        enabled: false,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: true,
        offsetX: -25,
        offsetY: -50,
        tools: {
          download: '<i class="fas fa-download"></i>'
        },
        export: {
          csv: {
            filename: "OEE",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          },
          // svg: {
          //   filename: "OEE",
          // },
          // png: {
          //   filename: "OEE",
          // }
        },
        autoSelected: 'zoom' 
      },              
      animations: {
        enabled: false
      }  
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 2,
      curve: "smooth",
      colors: ["#FF9800"],
    },
    colors: ["#FF9800"],
    fill:{
      colors: ["#FF9800"],
    },
    markers: {
      colors: ["#FF9800"],
    },
    tooltip: {
      marker: {
        show: true,
    },
    y: {
      formatter: function(val) {
        return  val + " %";
      }
    }
    },
    xaxis: {
      categories: data['data']['time_period'],
      labels: {
        rotate: -45,
         rotateAlways: true,
        }
    
    }
  };
}

// Column Chart.
public OEEchartOptionsColumn(data:any){
  this.oee_chartOptions = {
    series: [
      {
        'name': 'OEE',
        'data':data['data']['oee']
      }
    ],
    chart: {
      type: "bar",
      height: 250,
      stacked: true,
      toolbar: {
        show: true,
        offsetX: -25,
        offsetY: -50,
        tools: {
          download: '<i class="fas fa-download"></i>'
        },
        export: {
          csv: {
            filename: "OEE",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          },   
        },
      },
      zoom: {
        enabled: false
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold'        
       },
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
      categories: data['data']['time_period'],
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
      show: true,
      showForSingleSeries: true,
      markers: {
        fillColors: ["#FF9800"]
      }
    },
    colors: ["#FF9800"],
    fill: {
      opacity: 1,
      colors: ["#FF9800"]
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return  val + " %";
        }
      }
    }
  };
}

// ------------------------- Performance Chart ------------------------------.
// Area Chart.
public performenceAnalysis(data:any){
  this.performance_chartOptions = {
    series: [
      {
        name: "Performance",
        data: data['data']['performance']
      }
    ],
    chart: {
      height: 250,
      type: "area",
      zoom: {
        enabled: false
      },
      dropShadow: {
        enabled: false,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: true,
        offsetX: -25,
        offsetY: -50,
        tools: {
          download: '<i class="fas fa-download"></i>'
        },
        export: {
          csv: {
            filename: "Performance",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          },
        },
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 2,
      curve: "smooth",
      colors: ["#2B908F"],
    },
    colors: ["#2B908F"],
    fill:{
      colors: ["#2B908F"],
    },
    markers: {
      colors: ["#2B908F"],
    },
    tooltip: {
      marker: {
        show: true,
    },
    y: {
      formatter: function(val) {
        return  val + " %";
      }
    }
  },
    xaxis: {
      categories:data['data']['time_period'],
      labels: {
        rotate: -45,
         rotateAlways: true,
        }
    
    }
  };
}

// Column Chart.
public performenceAnalysisColumn(data:any){
  this.performance_chartOptions = {
    series: [
      {
        'name': 'Performance',
        'data':data['data']['performance']
      }
    ],
    chart: {
      type: "bar",
      height: 250,
      stacked: true,
      toolbar: {
        show: true,
        offsetX: -25,
        offsetY: -50,
        tools: {
          download: '<i class="fas fa-download"></i>'
        },
        export: {
          csv: {
            filename: "Performance",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          },
        },
      },
      zoom: {
        enabled: false
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold'
        },
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
      categories: data['data']['time_period'],
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
      show: true,
      showForSingleSeries: true,
      markers: {
        fillColors: ["#2B908F"]
      }
    },
    colors: ["#2B908F"],
    fill: {
      opacity: 1,
      colors: ["#2B908F"]
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return  val + " %";
        }
      }
    }
  };
}

// ------------------------- Availability Chart ------------------------------.
// Area Chart.
public availablityAnalysis(data:any){
  this.availability_chartOptions = {
    series: [
      {
        name: "Avalilability",
        data: data['data']['availability']
      }
    ],
    chart: {
      height: 250,
      type: "area",
      zoom: {
        enabled: false
      },
      dropShadow: {
        enabled: false,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: true,
        offsetX: -25,
        offsetY: -50,
        tools: {
          download: '<i class="fas fa-download"></i>'
        },
        export: {
          csv: {
            filename: "Avalilability",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          },
        },
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 2,
      curve: "smooth",
      colors: ["#00E396"],
    },
    colors: ["#00E396"],
    fill:{
      colors: ["#00E396"],
    },
    markers: {
      colors: ["#00E396"],
    },
    tooltip: {
      marker: {
        show: true,
    },
    y: {
      formatter: function(val) {
        return  val + " %";
      }
    }
  },
    xaxis: {
      categories: data['data']['time_period'],
    
      labels: {
        rotate: -45,
         rotateAlways: true,
        }
    
    }
  };
}

// Column Chart.
public availablityAnalysisColumn(data:any){  
  this.availability_chartOptions = {
    series: [
      {
        'name': 'Avalilability',
        'data': data['data']['availability']
      }
    ],
    chart: {
      type: "bar",
      height: 250,
      stacked: true,
      toolbar: {
        show: true,
        offsetX: -25,
        offsetY: -50,
        tools: {
          download: '<i class="fas fa-download"></i>'
        },
        export: {
          csv: {
            filename: "Avalilability",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          }
        },
      },
      zoom: {
        enabled: false
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold'        
       },
    }
     ,
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
      categories: data['data']['time_period'],
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
      show: true,
      showForSingleSeries: true,
      markers: {
        fillColors: ["#00E396"]
      }
    },
    colors: ["#00E396"],
    fill: {
      opacity: 1,
      colors: ["#00E396"]
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return  val + " %";
        }
      }
    }
  };
}


// ------------------------- Quality Chart ------------------------------.

// Area Chart.
public qualityAnalysis(data:any){
  this.quality_chartOptions = {
    series: [
      {
        name: "Quality",
        data: data['data']['quality']
      }
    ],
    chart: {
    
      type: "area",
      height: 250,
      zoom: {
        enabled: false
      },
      dropShadow: {
        enabled: false,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: true,
        offsetX: -25,
        offsetY: -50,
        tools: {
          download: '<i class="fas fa-download"></i>'
        },
        export: {
          csv: {
            filename: "Quality",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          }
        },
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 2,
      curve: "smooth",
      colors: ["#008FFB"],
    },
    fill:{
      colors: ["#008FFB"],
    },
    colors: ["#008FFB"],
    markers: {
      colors: ["#008FFB"],
    },
    tooltip: {
      marker: {
        show: true,
    },
    y: {
      formatter: function(val) {
        return  val + " %";
      }
    }
  },
    xaxis: {
      categories:data['data']['time_period'],
      labels: {
        rotate: -45,
         rotateAlways: true,
        }
    }
  };
}

// Column Chart.
public qualityAnalysisColumn(data:any){  
  this.quality_chartOptions = {
    series: [
      {
        name: "Quality",
        data: data['data']['quality']
      }
    ],
    chart: {
      type: "bar",
      height: 250,
      stacked: true,
      toolbar: {
        show: true,
        offsetX: -25,
        offsetY: -50,
        tools: {
          download: '<i class="fas fa-download"></i>'
        },
        export: {
          csv: {
            filename: "Quality",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          }
        },
      },
      zoom: {
        enabled: false
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold'        
       },
    }
     ,
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
      categories: data['data']['time_period'],
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
      show: true,
      showForSingleSeries: true,
      markers: {
        fillColors: ["#008FFB"]
      }
    },
    colors: ["#008FFB"],
    fill: {
      opacity: 1,
      colors: ["#008FFB"]
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return  val + " %";
        }
      }
    }
  };
}


// -------------------------Runtime VS Down time Chart ------------------------------.

// Column Chart.
public runtime_downtimeAnalysis(data:any){  
  this.today_runtime_downtime_chartOptions = {
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
        } ,
        export: {
          csv: {
            filename: "Runtime VS Down time Chart",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          }
        },    
      },
      zoom: {
        enabled: false
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold'        
       },
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
        fillColors: ["#00E396", '#F9C80E', "#FF4560"]
      }
    },
    colors:["#00E396", '#F9C80E', "#FF4560"],
    fill: {
      opacity: 1,
      colors: ["#00E396", '#F9C80E', "#FF4560"]
    },
    tooltip: {
      y: {
        formatter: function(val:any) {
          return  val + " Mins";
        }
      }
    }
  };
}

// Area Chart.
public runtime_downtimeAnalysisArea(data:any) {
  this.today_runtime_downtime_chartOptions = {
    series: data['data'],
    chart: {
      height: 260,
      type: "area",
      zoom: {
        enabled: false
      },
      dropShadow: {
        enabled: false,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: true,
        offsetX: -25,
        offsetY: -50,
        tools: {
          download: '<i class="fas fa-download"></i>'
        },
        export: {
          csv: {
            filename: "Runtime VS Down Area Chart",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          }
        },       
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false,
      },
    stroke: {
      width: 2,
      curve: "smooth",
      colors: ["#00E396", '#F9C80E', "#FF4560"]
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
    colors: ["#00E396", '#F9C80E', "#FF4560"],
    fill:{
      colors: ["#00E396", "#FF4560"]
    },
    markers: {
      colors: ["#00E396", "#FF4560"]
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return  val + " Mins";
        }
      }
  },
    xaxis: {
      categories:data['timeframe'],
      labels: {
        rotate: -45,
         rotateAlways: true,
        }
    }
  };
}

// ------------------------Planned production time Chart-------------------.
// Column Chart.
public plannedprodAnalysis(data:any){
  this.planned_prod_time_chartOptions = {
    series: data['data'],
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
        },
        export: {
          csv: {
            filename: "Planned production time Chart",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          }
        },   
      },
      zoom: {
        enabled: false
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold'        
       },
    }
     ,
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
      categories: data['timeframe'],
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
        fillColors: ["#33B2DF", "#F9C80E"]
      }
    },
    colors: ["#33B2DF", "#F9C80E"],
    fill: {
      opacity: 1,
      colors: ["#33B2DF", "#F9C80E"]
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return  val + " Mins";
        }
      }
    }
  };
}

// Area Chart.
public plannedprodAnalysisArea(data:any) {
  this.planned_prod_time_chartOptions = {
    series: data['data'],
    chart: {
      height: 260,
      type: "area",
      zoom: {
        enabled: false
      },
      dropShadow: {
        enabled: false,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: true,
        offsetX: -25,
        offsetY: -50,
        tools: {
          download: '<i class="fas fa-download"></i>'
        },
        export: {
          csv: {
            filename: "Planned production Area Chart",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
        }
        }
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 2,
      curve: "smooth",
      colors: ["#33B2DF", "#F9C80E"]
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: 0,
      offsetX: -5,
      showForSingleSeries: true,
      markers: {
        fillColors: ["#33B2DF", "#F9C80E"]
      }
    },
    colors: ["#33B2DF", "#F9C80E"],
    fill:{
      colors: ["#33B2DF", "#F9C80E"]
    },
    markers: {
      colors: ["#33B2DF", "#F9C80E"]
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return  val + " Mins";
        }
      }
  },
    xaxis: {
      categories:data['timeframe'],
      labels: {
        rotate: -45,
         rotateAlways: true,
        }
    }
  };
}


// ------------------------Net runrate time Chart-------------------.

// Column Chart.
public netRunrateAnalysis(data:any){  
  this.net_runtime_chartOptions = {
    series: [
      {
        'name':data.data[0]['name'],
        'data':data.data[0]['data']
      },
      {
        'name':data.data[1]['name'],
        'data':data.data[1]['data']
      }
    ],
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
        },
        export: {
          csv: {
            filename: "Net runrate time Chart",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          }
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
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold'        
       },
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
      categories: data['timeframe'],
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
      show: true,
      showForSingleSeries: true,
      markers: {
        fillColors: ["#FA4443","#F86624"]
      }
    },
    fill: {
      opacity: 1,
      colors: ["#FA4443","#F86624"]
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return  val + " Mins";
        }
      }
    }
  };
}

// Area Chart.
public netRunrateAnalysisArea(data:any){  
  this.net_runtime_chartOptions = {
    series: [
      {
        'name':data.data[0]['name'],
        'data':data.data[0]['data']
      },
      {
        'name':data.data[1]['name'],
        'data':data.data[1]['data']
      }
    ],
    chart: {
      height: 260,
      type: "area",
      zoom: {
        enabled: false
      },
      dropShadow: {
        enabled: false,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: true,
        offsetX: -25,
        offsetY: -50,
        tools: {
          download: '<i class="fas fa-download"></i>'
        },
        export: {
          csv: {
            filename: "Net Runtime",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          }
        }    
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 2,
      curve: "smooth",
      colors: ["#FA4443","#F86624"]
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: 0,
      offsetX: -5,
      showForSingleSeries: true,
      markers: {
        fillColors: ["#FA4443","#F86624"]
      }
    },
    colors: ["#FA4443","#F86624"],
    fill:{
      colors:["#FA4443","#F86624"]
    },
    markers: {
      colors: ["#FA4443","#F86624"]
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return  val + " Mins";
        }
      }
  },
    xaxis: {
      categories:data['timeframe'],
      labels: {
        rotate: -45,
         rotateAlways: true,
        }
    }
  };
}


// ------------------------Net Fully productive time vs Quality loss Chart.-------------------.
// Column Chart.
public fullProdTimeAnalysis(data:any){
  this.fully_prod_time_chartOptions = {
    series: data['data'],
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
        },
        export: {
          csv: {
            filename: "Net Fully productive time vs Quality loss Chart",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          }
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
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold'        
       },
    }
     ,
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
      categories: data['timeframe'],
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
      show: true,
      showForSingleSeries: true,
      markers: {
        fillColors:  ["#00E396", "#FF4560"]
      }
    },
    colors: ['#00E396', '#FF4560'],
    fill: {
      opacity: 1,
      colors: ['#00E396', '#FF4560']
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return  val + " Mins";
        }
      }
    }
  };
}

// Area Chart.
public fullProdTimeAnalysisArea(data:any){  
  this.fully_prod_time_chartOptions = {
    series: data['data'],
    chart: {
      height: 260,
      type: "area",
      zoom: {
        enabled: false
      },
      dropShadow: {
        enabled: false,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: true,
        offsetX: -25,
        offsetY: -50,
        tools: {
          download: '<i class="fas fa-download"></i>'
        },
        export: {
          csv: {
            filename: "Net Fully productive time vs Quality loss Chart",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          }
        }       
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 2,
      curve: "smooth",
      colors: ["#00E396", "#FF4560"]
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: 0,
      offsetX: -5,
      showForSingleSeries: true,
      markers: {
        fillColors: ["#00E396", "#FF4560"]
      }
    },
    colors: ["#00E396", "#FF4560"],
    fill:{      
      colors: ["#00E396", "#FF4560"]
    },
    markers: {
      colors: ["#00E396", "#FF4560"]
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return  val + " Mins";
        }
      }
  },
    xaxis: {
      categories:data['timeframe'],
      labels: {
        rotate: -45,
         rotateAlways: true,
        }
    }
  };
}


// ---------------------------Availability loss Chart--------------------------------------
// Column Chart.
public availabilityLosschart(data:any) {
this.availabilityLosschartOptions = {
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
      },
      export: {
        csv: {
          filename: "Availability loss Chart",
          columnDelimiter: ',',
          headerCategory: 'category',
          headerValue: 'value',
          dateFormatter(timestamp) {
            return new Date(timestamp).toDateString()
          }
        }
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
    enabled: true,
    style: {
      fontSize: '12px',
      fontWeight: 'bold'
    },
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
      fillColors: ["#FA4443"]
    }
  },
  fill: {
    opacity: 1,
    colors: ['#FA4443']
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " %";
      }
    }
  }
};
}

// Area Chart.
public availabilityLosschartArea(data:any){  
  this.availabilityLosschartOptions = {
    series: data['data'],
    chart: {
      height: 260,
      type: "area",
      zoom: {
        enabled: false
      },
      dropShadow: {
        enabled: false,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: true,
        offsetX: -25,
        offsetY: -50,
        tools: {
          download: '<i class="fas fa-download"></i>'
        },
        export: {
          csv: {
            filename: "Availability loss Area Chart",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          }
        }    
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 2,
      curve: "smooth",
      colors: ["#FA4443"]
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: 0,
      offsetX: -5,
      showForSingleSeries: true,
      markers: {
        fillColors: ["#FA4443"]
      }
    },
    colors: ["#FA4443"],
    fill:{
      colors: ["#FA4443"]
    },
    markers: {
      colors: ["#FA4443"]
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return  val + " %";
        }
      }
  },
    xaxis: {
      categories:data['timeframe'],
      labels: {
        rotate: -45,
         rotateAlways: true,
        }
    }
  };
}

// ---------------------------Performance loss Chart--------------------------------------
// Column Chart.
public performanceLosschart(data:any) {
  this.performanceLosschartOptions = {
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
        },
        export: {
          csv: {
            filename: "Availability loss Column Chart",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          }
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
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold'
       },
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
        fillColors: ["#EA3546"]
      }
    },
    fill: {
      opacity: 1,
      colors: ['#EA3546']
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " %";
        }
      }
    }
  };
}

// Area Chart.
public performanceLosschartArea(data:any){  
  this.performanceLosschartOptions = {
    series: data['data'],
    chart: {
      height: 260,
      type: "area",
      zoom: {
        enabled: false
      },
      dropShadow: {
        enabled: false,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: true,
        offsetX: -25,
        offsetY: -50,
        tools: {
          download: '<i class="fas fa-download"></i>'
        },
        export: {
          csv: {
            filename: "Availability loss area Chart",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          }
        }     
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 2,
      curve: "smooth",
      colors: ["#FA4443"]
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: 0,
      offsetX: -5,
      showForSingleSeries: true,
      markers: {
        fillColors: ['#EA3546']
      }
    },
    colors: ['#EA3546'],
    fill:{
      colors: ['#EA3546']
    },
    markers: {
      colors: ['#EA3546']
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return  val + " %";
        }
      }
  },
    xaxis: {
      categories:data['timeframe'],
      labels: {
        rotate: -45,
         rotateAlways: true,
        }
    }
  };
}


// ---------------------------Quality loss Chart--------------------------------------
// Column Chart.
public qualityLosschart(data:any) {
 this.qualityLosschartOptions = {
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
        } ,
        export: {
          csv: {
            filename: "Quality loss column Chart",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          }
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
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        
       },
    }
     ,
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
        fillColors: ["#D7263D"]
      }
    },
    fill: {
      opacity: 1,
      colors: ['#D7263D']
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " %";
        }
      }
    }
  };
}

// Area Chart.
public qualityLosschartArea(data:any){  
  
  this.qualityLosschartOptions = {
    series: data['data'],
    chart: {
      height: 260,
      type: "area",
      zoom: {
        enabled: false
      },
      dropShadow: {
        enabled: false,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: true,
        offsetX: -25,
        offsetY: -50,
        tools: {
          download: '<i class="fas fa-download"></i>'
        } ,
        export: {
          csv: {
            filename: "Quality loss Area Chart",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          }
        }
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 2,
      curve: "smooth",
      colors: ["#FA4443"]
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: 0,
      offsetX: -5,
      showForSingleSeries: true,
      markers: {
        fillColors: ["#D7263D"]
      }
    },
    colors: ["#D7263D"],
    fill:{
      colors: ["#D7263D"]
    },
    markers: {
      colors: ["#D7263D"]
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return  val + " %";
        }
      }
  },
    xaxis: {
      categories:data['timeframe'],
      labels: {
        rotate: -45,
         rotateAlways: true,
        }
    }
  };
}



// ---------------------------mtbf Chart--------------------------------------
// Column Chart.
public mtbfchart(data:any) {
  this.mtbfchartOptions = {
    series: [
      {
        name: data['data'][0]['name'],
        data: data['data'][0]['mtbf_value']
       
      }
    ],
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
        } ,
        export: {
          csv: {
            filename: "MTBF column Chart",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          }
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
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        
       },
    }
     ,
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
        show: true
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
        fillColors: ["#2983FF"]
      }
    },
    fill: {
      opacity: 1,
      colors: ['#2983FF']
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return  val + " Mins";
        }
      }
    }
  };
}

// Area Chart.
public mtbfchartArea(data:any){  
  this.mtbfchartOptions = {
    series: [
      {
        name: data['data'][0]['name'],
        data: data['data'][0]['mtbf_value']
       
      }
    ],
    chart: {
      height: 260,
      type: "area",
      zoom: {
        enabled: false
      },
      dropShadow: {
        enabled: false,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: true,
        offsetX: -25,
        offsetY: -50,
        tools: {
          download: '<i class="fas fa-download"></i>'
        } ,
        export: {
          csv: {
            filename: "MTBF Area Chart",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          }
        }
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 2,
      curve: "smooth",
      colors: ["#2983FF"]
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: 0,
      offsetX: -5,
      showForSingleSeries: true,
      markers: {
        fillColors: ["#2983FF"]
      }
    },
    colors: ["#2983FF"],
    fill:{
      colors: ["#2983FF"]
    },
    markers: {
      colors: ["#2983FF"]
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return  val + " Mins";
        }
      }
  },
    xaxis: {
      categories:data['timeframe'],
      labels: {
        rotate: -45,
         rotateAlways: true,
        }
    }
  };
}


// ---------------------------mttr Chart--------------------------------------
// Column Chart.
public mttrchart(data:any) {
  this.mttrchartOptions = {
    series: [
      {
        name: data['data'][0]['name'],
        data: data['data'][0]['mttr_value']
       
      }
    ],
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
        } ,
        export: {
          csv: {
            filename: "MTTR column Chart",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          }
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
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        
       },
    }
     ,
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
        show: true
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
        fillColors: ["#13D8AA"]
      }
    },
    fill: {
      opacity: 1,
      colors: ['#13D8AA']
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return  val + " Mins";
        }
      }
    }
  };
}

// Area Chart.
public mttrchartArea(data:any){  
  this.mttrchartOptions = {
    series: [
      {
        name: data['data'][0]['name'],
        data: data['data'][0]['mttr_value']
       
      }
    ],
    chart: {
      height: 260,
      type: "area",
      zoom: {
        enabled: false
      },
      dropShadow: {
        enabled: false,
        color: "#13D8AA",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: true,
        offsetX: -25,
        offsetY: -50,
        tools: {
          download: '<i class="fas fa-download"></i>'
        } ,
        export: {
          csv: {
            filename: "MTTR Area Chart",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          }
        }
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 2,
      curve: "smooth",
      colors: ["#13D8AA"]
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: 0,
      offsetX: -5,
      showForSingleSeries: true,
      markers: {
        fillColors: ["#13D8AA"]
      }
    },
    colors: ["#13D8AA"],
    fill:{
      colors: ["#13D8AA"]
    },
    markers: {
      colors: ["#13D8AA"]
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return   val + " Mins";
        }
      }
  },
    xaxis: {
      categories:data['timeframe'],
      labels: {
        rotate: -45,
         rotateAlways: true,
        }
    }
  };
}

// ---------------------------mttr Chart--------------------------------------
// Column Chart.

public faultTrend(data:any) {
    this.faultTrendchartOption = {
    series: [{
       name: 'Fault trend',
      data: data['data']['value']    
      }],
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
        } ,
        export: {
          csv: {
            filename: "Fault Trend column Chart",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          }
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
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        
       },
    }
     ,
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
      categories: data['data']['key'],
      labels: {
        rotate: -45,
        rotateAlways: true,
      }

    },
    yaxis: {
      labels: {
        show: true
      },
      title: {
        text: 'Occurrence'
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
        fillColors: ["#D63031"]
      }
    },
    fill: {
      opacity: 1,
      colors: ['#D63031']
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return  val + " Occurrence";
        }
      }
    }
  };
}

// Area Chart.
public faultTrendArea(data:any){  
  this.faultTrendchartOption = {
    series: [{
      name: 'Fault trend',
      data:   data['data']['value']  
    }],
    chart: {
      height: 260,
      type: "area",
      zoom: {
        enabled: false
      },
      dropShadow: {
        enabled: false,
        color: "#D63031",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: true,
        offsetX: -25,
        offsetY: -50,
        tools: {
          download: '<i class="fas fa-download"></i>'
        } ,
        export: {
          csv: {
            filename: "Fault Trend Area Chart",
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          }
        }
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 2,
      curve: "smooth",
      colors: ["#D63031"]
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: 0,
      offsetX: -5,
      showForSingleSeries: true,
      markers: {
        fillColors: ["#D63031"]
      }
    },
    colors: ["#D63031"],
    fill:{
      colors: ["#D63031"]
    },
    markers: {
      colors: ["#D63031"]
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return   val + " Occurrence";
        }
      }
  },
    xaxis: {
     categories:  data['data']['key']  ,
      labels: {
        rotate: -45,
         rotateAlways: true,
        }
    }
  };

}

}