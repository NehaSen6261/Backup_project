import { Component, OnInit, ViewChild,ChangeDetectorRef,ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NavbarService } from '../../navbar/_services/navbar.service';
import { DeviceAttrsService } from '../../device_attributes/_services/device-attrs.service';
import { AnalysisService } from '../_services/analysis.service';
import { OthersService } from '../../others/_services/others.service';
import { DeviceService } from '../../devices/_services/device.service';
import { MetricsChartTypesService } from '../../metrics_chart_types/_services/metrics-chart-types.service';
import { AuthService } from '../../login/_services/auth.service';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { WindowService  } from '../../others/window/_services/window.service';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexStroke, ApexMarkers,
  ApexYAxis, ApexGrid, ApexTitleSubtitle, ApexLegend, ApexPlotOptions, ApexFill } from "ng-apexcharts";

  export type ChartOptions = {
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
  };


interface MetricsValues {
  value: string;
  viewValue: string;
}

interface CharttypeValues {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'analysis-detailed-view',
  templateUrl: './analysis-detailed-view.component.html',
  styleUrls: ['./analysis-detailed-view.component.scss']
})
export class AnalysisDetailedViewComponent implements OnInit {


  dlogs:any=[];
  device_parameter:string;
  device_name: string;
  gateway_id
  attribute
  attribute_id
  attribute_data_type:string;
  time_interval:string;
  payload_key: string;
  attr_type:string;
  last24hr_spinner:boolean;
  days7_spinner:boolean = true;
  months12_spinner:boolean = true;
  days30_spinner:boolean = true;
  table_spinner:boolean = true;
  no30days_data:boolean;
  no24hrs_data:boolean;
  no12months_data:boolean;
  last24hr_error:boolean = false;
  days7_error:boolean = false;
  months12_error:boolean = false;
  days30_error:boolean = false;
  table_internalError:boolean = false;
  current_status_int_error:boolean = false;

  device_attributes_list:any=[];
  hr24_respone_data:any = [];
  days7_respone_data:any = [];
  months12_respone_data:any = [];
  days30_respone_data:any = [];

  current_uom:any
  current_analysis_updated_at;
  parameter_data_type:string;
  curr_res_null:boolean = false;
  current_string_val:string;
  currstatus_spinner:boolean = true;
  application_name:string;
  location:string;
  dev_eui_id:string;
  attr_uom:string;
  time
  public barChartType = "bar" ;
  obs: Observable<any>;
  filter:string;
  current_host:any;

  internal_error_text = "Unable to process your request please try after some time !!"

  currentdate = new Date()
  browser_timezone:string;
  private paginator: MatPaginator;
  private sort: any;
  error_status= "Error";

//  chart configs.
@ViewChild("chart") chart: ChartComponent;
public LC_L24hrsN_Chartoptions: Partial<ChartOptions>;
public BC_L24hrsN_Chartoptions: Partial<ChartOptions>;
public LC_7DaysN_Data__Chartoptions: Partial<ChartOptions>;
public BC_7DaysN_Data__Chartoptions: Partial<ChartOptions>;
public LC_30DaysN_Data__Chartoptions: Partial<ChartOptions>;
public BC_30DaysN_Data__Chartoptions: Partial<ChartOptions>;
public LC_12mnsN_Data__Chartoptions: Partial<ChartOptions>;
public BC_12mnsN_Data__Chartoptions: Partial<ChartOptions>;

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
  constructor( public  analysisService: AnalysisService,
                        private navbarService:NavbarService,
                        private deviceattrsService:DeviceAttrsService,
                        private routelocationInfo: Location,
                        private otherService: OthersService,
                        private deviceService: DeviceService,
                        private metricsChartTypesService: MetricsChartTypesService,
                        private authService:AuthService,
                        private snackbarComponent :SnackbarComponent,
                        private changeDetectorRef: ChangeDetectorRef,
                        private windowService:WindowService
                        ) {
    this.navbarService.Title = "Trend View";
    this.time = new Date().toLocaleTimeString();
   }

   metric_form = new FormControl('', [Validators.required]);
   chart_type_form = new FormControl('', [Validators.required]);
   card_name = new FormControl('', [Validators.minLength(3), Validators.maxLength(40)]);
   default_settings =  new FormControl('');;

   metrics: MetricsValues[] = [
    {value: 'amm', viewValue: 'Average, Minimum, Maximum'},
    {value: 'count', viewValue: 'Count'},
    {value: 'sum', viewValue: 'Sum'},
    {value: 'variance', viewValue: 'Variance'},
    {value: 'standard_deviation', viewValue: 'Standard deviation'},
    {value: 'median', viewValue: 'Median'},
  ];

  chart_type: CharttypeValues[] = [
   {value: 'line', viewValue: 'Line Chart'},
   {value: 'bar', viewValue: 'Bar Chart'},
 ];


  ngOnInit(): void {
    this.browser_timezone= Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.current_host = this.windowService.currenthost();
    this.attribute_id = localStorage.getItem("analysis_attr_id");
    this.attribute_data_type = localStorage.getItem("analysis_datatype");
    this.device_parameter = localStorage.getItem('analysis_key');
    this.gateway_id = localStorage.getItem('analysis_gtw');
    this.attribute = localStorage.getItem('analysis_key');

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.device_attributes();
    this.getDeviceInfo();

    if(this.attribute_data_type == "Number"){
       this.getL24HattrMetrics();
       this.getL7DattrMetrics();
       this.getL12MattrMetrics();
       this.getL30DattrMetrics();
    }else if(this.attribute_data_type == "String"){
      this.getL24HattrStrMetrics();
      this.get7DattrStrMetrics();
      this.get30DattrStrMetrics();
      this.get12MattrStrMetrics();
   }
   else{
     this.current_status_int_error = true;
     this.last24hr_error = true;
     this.days7_error = true;
     this.months12_error = true;
     this.days30_error = true;
   }
    this.currentanalysis();
    this.allattranalysis();

    this.attr_uom = localStorage.getItem('analysis_uom');
  }




  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();
  }

  displayedColumns: string[] = ['gateway_name', 'application_name', 'device_eui_id', 'payload_value', 'created_date'];
  dataSource = new MatTableDataSource(this.dlogs);

// This method will take to the top of the screen.
public goToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

    // error messages.
  MetricMessages() {
      if (this.metric_form.hasError('required')) {
        return 'You must choose a value';
       }
    }
  ChartMessages() {
    if (this.chart_type_form.hasError('required')) {
      return 'You must choose a value';
     }
  }
  CardNameErrorMessages(){
    if (this.card_name.hasError('minlength')) {
      return 'Minimum 3 characters required !';
    }
    if (this.card_name.hasError('maxlength')) {
      return 'Maximum 40 characters allowed !';
    }
  }


 // select dropdown
 selectedValue: string;


  // This method will redirect to the previous page.
  bacloc(){
    this.routelocationInfo.back();
  }


    // This method will display all the device attributes for dropdown.
    device_attr
    device_attributes(){
        this.deviceattrsService.getDeviceAttributesS().subscribe(response =>{
          this.device_attributes_list = response;
          this.device_attr= localStorage.getItem('analysis_key');
        })
    }

    // This method will be triggered on click of the attribute from attribute dropdown.
    getAnalysis (attribute:string){
      localStorage.setItem("analysis_datatype", attribute['sf_attribute_datatype']);
      localStorage.setItem('analysis_key', attribute['sf_attribute_key']);
      localStorage.setItem("analysis_attr_id", attribute['sf_attribute_id']);
      this.ngOnInit();
      this.time = new Date().toLocaleTimeString();
    }

    // This method will display the device Information.
    getDeviceInfo(){
        this.deviceService.getDeviceInfoS(this.gateway_id).subscribe(response =>{
            this.device_name = response['gateway_name'];
            this.application_name = response['app_name'];
            this.location = response['location'];
            this.dev_eui_id = response['dev_eui'];
        })
      }

    //  This method will call metricsChartTypesService to create the chart type metrics.
    postAttrMetrics(){
      if(this.metric_form.status == "INVALID" || this.chart_type_form.status == "INVALID"){
        this.snackbarComponent.top_snackbar("Fill all the required feilds !!",this.error_status);
      }else{
        let data = {}
        let card_no:string;
        if(this.time_interval == '24H'){
          card_no = 'card3'
        }else if(this.time_interval == '7D'){
          card_no = 'card4'
        }else if(this.time_interval == '12M'){
          card_no = 'card5'
        }else if(this.time_interval == '30D'){
          card_no = 'card6'
        }
        data['sf_dev_eui'] = this.dev_eui_id;
        data['sf_attribute_id'] = this.attribute_id ;
        data['sf_metrics_type'] = this.metric_form.value;
        data['sf_time_interval'] = this.time_interval;
        data['sf_chart_type'] = this.chart_type_form.value;
        data['sf_screen_name'] = "attribute_analysis";
        data['sf_card_title'] = this.card_name.value;
        data['sf_card_no'] = card_no;
        data['created_by'] = this.authService.currentUser['email'];
        this.metricsChartTypesService.postAttrMetricsS(data).subscribe(response =>{
          if(this.metricsChartTypesService.response_status == "Successful"){
            this.metric_form.reset();
            this.chart_type_form.reset();
            this.card_name.reset();
            this.ngOnInit();
          }
        }, error =>{
          this.snackbarComponent.top_snackbar(this.internal_error_text,this.error_status);
        })
      }
    }

  //  This method will call metricsChartTypesService to create the chart type metrics.
  putAttrMetrics(){
      if(this.metric_form.status == "INVALID" || this.chart_type_form.status == "INVALID"){
        this.snackbarComponent.top_snackbar("Fill all the required feilds !!",this.error_status);
      }else{
        let data = {}
        if(this.default_settings.value == false){
          data['sf_metrics_type'] = this.metric_form.value;
          data['sf_chart_type'] = this.chart_type_form.value;
          data['sf_card_title'] = this.card_name.value;
        }else{
          data['sf_metrics_type'] = "amm";
          data['sf_chart_type'] = "line";
          if(this.time_interval == "24H"){
            data['sf_card_title'] = "Last 24 Hours";
           }else if(this.time_interval == "7D"){
           data['sf_card_title'] = "Last 7 Days";
           }else if(this.time_interval == "30D"){
            data['sf_card_title'] = "Last 30 Days";
           }else{
            data['sf_card_title'] = "Last 12 Months";
           }
          }
        data['updated_by'] = this.authService.currentUser['email'];
        this.metricsChartTypesService.putAttrMetricsS(this.time_interval, "attribute_analysis", data).subscribe(response =>{
          this.default_settings.reset();
          this.ngOnInit();
        }, error =>{
          this.snackbarComponent.top_snackbar(this.internal_error_text,this.error_status);
        })
      }
   }

  // This method will set the default values on the modal.
  setDefaultsettings(){
    if(this.default_settings.value == false || this.default_settings.value == null){
      this.metric_form.setValue("amm");
      this.chart_type_form.setValue("line");
      this.metric_form.disabled
      if(this.time_interval == "24H"){
        this.card_name.setValue("last 24 Hours");
      }else if(this.time_interval == "7D"){
        this.card_name.setValue("last 7 Days");
      }else if(this.time_interval == "30D"){
        this.card_name.setValue("last 30 Days");
      }else if(this.time_interval == "12M"){
        this.card_name.setValue("last 12 Months");
      }
    }else{
      if(this.time_interval == "24H"){
        this.setL24HattrMetrics();
      }else if(this.time_interval == "7D"){
        this.setL7DattrMetrics();
      }else if(this.time_interval == "30D"){
        this.setL30DattrMetrics();
      }else if(this.time_interval == "12M"){
        this.setL12MattrMetrics();
      }
    }

  }



update_status_btn:boolean;

L24Hcard_title:string;
L24Hchart_type:string;
l24chart_type:string;
l24metrics_type:string;

L7Dcard_title:string;
L7Dchart_type:string;
l7dchart_type:string;
l7dmetrics_type:string;

L12Mcard_title:string;
L12Mchart_type:string;
l12mchart_type:string;
l12mmetrics_type:string;

L30Dcard_title:string;
L30Dchart_type:string;
l30dchart_type:string;
l30dmetrics_type:string;

// --------------------------------------------------------------------------------------------------------
//  Number data type api calls
// --------------------------------------------------------------------------------------------------------

// This method will display the attribute metrics info for last 24 hours card.
getL24HattrMetrics(){
  this.last24hr_spinner = true;
  this.metricsChartTypesService.getattrMetricsS(this.gateway_id, this.attribute_id, "24H","attribute_analysis",this.device_parameter, this.browser_timezone).subscribe(response =>{
    if(response['Unsucessfull']){
      this.L24Hcard_title = "Last 24 hours";
      this.last24hr_error = true;
      this.last24hr_spinner = false;
    }else{
      this.last24hr_spinner = false;
      this.last24hr_error = false;
      if (Object.keys(response['attr_metric_info']).length === 0) {
        this.L24Hcard_title = "Last 24 hours";
        let metrics_data:any = []
        metrics_data = response['metrics_data']
        this.L24Hchart_type = "line";
        // if(metrics_data['max_range'] == 0){
        //   this.no24hrs_data  = true;
        // }else{
          this.last24HDTNumLchart(metrics_data, "amm");
          this.no24hrs_data  = false;
        // }
      }else{
        let metrics_info = response['attr_metric_info'];
        this.L24Hcard_title  = metrics_info['sf_card_title'];
        this.l24chart_type = metrics_info['sf_chart_type'];
        this.l24metrics_type = metrics_info['sf_metrics_type'];
        let metrics_data:any = []
        metrics_data = response['metrics_data'];
        let max_value = metrics_data['max_range'];
        // if(max_value == 0){
          // this.no24hrs_data = true;
        // }else{
          this.no24hrs_data = false;
          this.L24Hchart_type = metrics_info['sf_chart_type'];
          if(this.L24Hchart_type == "line"){
            this.last24HDTNumLchart(metrics_data, metrics_info['sf_metrics_type']);
          }
          if(this.L24Hchart_type == "bar"){
            this.last24HDTNumBchart(metrics_data, metrics_info['sf_metrics_type']);
          }

        // }
      }
    }
  }, error =>{
    this.L24Hcard_title = "Last 24 hours";
    this.last24hr_error = true;
    this.last24hr_spinner = false;
  })
}


// This method will set the last 24 hours pop up values.
setL24HattrMetrics(){
  if(this.l24metrics_type){
    this.metric_form.setValue(this.l24metrics_type);
  }else{
    this.metric_form.setValue("amm");
  }
  if(this.l24chart_type){
    this.chart_type_form.setValue(this.l24chart_type);
  }else{
    this.chart_type_form.setValue("line");
  }

  this.card_name.setValue(this.L24Hcard_title);
  if(this.l24metrics_type == undefined){
    this.update_status_btn = false;
  }else{
    this.update_status_btn = true;
  }
}


// This method will display the attribute metrics info for last 7 days card.
getL7DattrMetrics(){
  this.days7_spinner  = true;
  this.metricsChartTypesService.getattrMetricsS(this.gateway_id, this.attribute_id, "7D","attribute_analysis",this.device_parameter, this.browser_timezone).subscribe(response =>{
    if(response['Unsucessfull']){
      this.L7Dcard_title = "Last 7 days";
      this.days7_error = true;
      this.days7_spinner  = false;
    }else{
      this.days7_spinner  = false;
      this.days7_error = false;
      if (Object.keys(response['attr_metric_info']).length === 0) {
        this.L7Dcard_title = "Last 7 days";
        let metrics_data:any = []
        metrics_data = response['metrics_data']
        this.L7Dchart_type = "line";
        if(metrics_data['max_range'] == 0){
          this.no7days_data  = true;
        }else{
          this.last7DDTNumLchart(metrics_data, "amm");
          this.no7days_data  = false;
        }
      }else{
        let metrics_info = response['attr_metric_info'];
        this.L7Dcard_title  = metrics_info['sf_card_title'];
        this.l7dchart_type = metrics_info['sf_chart_type'];
        this.l7dmetrics_type = metrics_info['sf_metrics_type'];
        let metrics_data:any = []
        metrics_data = response['metrics_data'];
        let max_value = metrics_data['max_range'];
        if(max_value == 0){
          this.no7days_data  = true;
        }else{
          this.no7days_data  = false;
          this.L7Dchart_type = metrics_info['sf_chart_type'];
          if(this.L7Dchart_type == "line"){
            this.last7DDTNumLchart(metrics_data, metrics_info['sf_metrics_type']);
          }
          if(this.L7Dchart_type == "bar"){
            this.last7DDTNumBchart(metrics_data, metrics_info['sf_metrics_type']);
          }

        }
      }
    }
  }, error =>{
    this.L7Dcard_title = "Last 7 days";
    this.days7_error = true;
    this.days7_spinner  = false;
  })
}


// This method will set the last 7 days pop up values.
setL7DattrMetrics(){
  if(this.l7dmetrics_type){
    this.metric_form.setValue(this.l7dmetrics_type);
  }else{
    this.metric_form.setValue("amm");
  }
  if(this.l7dchart_type){
    this.chart_type_form.setValue(this.l7dchart_type);
  }else{
    this.chart_type_form.setValue("line");
  }

  this.card_name.setValue(this.L7Dcard_title);
  if(this.l7dmetrics_type == undefined){
    this.update_status_btn = false;
  }else{
    this.update_status_btn = true;
  }
}


// This method will display the attribute metrics info for last 12 months card.
getL12MattrMetrics(){
  this.months12_spinner  = true;
  this.metricsChartTypesService.getattrMetricsS(this.gateway_id, this.attribute_id, "12M","attribute_analysis",this.device_parameter, this.browser_timezone).subscribe(response =>{
    if(response['Unsucessfull']){
      this.L12Mcard_title = "Last 12 Months";
      this.months12_error = true;
      this.months12_spinner  = false;
    }else{
      this.months12_spinner  = false;
      this.months12_error = false;
      if (Object.keys(response['attr_metric_info']).length === 0) {
        this.L12Mcard_title = "Last 12 Months";
        let metrics_data:any = []
        metrics_data = response['metrics_data']
        this.L12Mchart_type = "line";
        if(metrics_data['max_range'] == 0){
          this.no12months_data  = true;
        }else{
          this.last12MDTNumLchart(metrics_data, "amm");
          this.no12months_data  = false;
        }
      }else{

        let metrics_info = response['attr_metric_info'];
        this.L12Mcard_title  = metrics_info['sf_card_title'];
        this.l12mchart_type = metrics_info['sf_chart_type'];
        this.l12mmetrics_type = metrics_info['sf_metrics_type'];
        let metrics_data:any = []
        metrics_data = response['metrics_data'];
        let max_value = metrics_data['max_range'];
        if(max_value == 0){
          this.no12months_data  = true;
        }else{
          this.no12months_data  = false;
          this.L12Mchart_type = metrics_info['sf_chart_type'];
          if(this.L12Mchart_type == "line"){
            this.last12MDTNumLchart(metrics_data, metrics_info['sf_metrics_type']);
          }
          if(this.L12Mchart_type == "bar"){
            this.last12MDTNumBchart(metrics_data, metrics_info['sf_metrics_type']);
          }

        }
      }
    }
  }, error =>{
    this.L12Mcard_title = "Last 12 Months";
    this.months12_spinner  = false;
    this.months12_error = true;
  })
}


// This method will set the last 12 months pop up values.
setL12MattrMetrics(){
  if(this.l12mmetrics_type){
    this.metric_form.setValue(this.l12mmetrics_type);
  }else{
    this.metric_form.setValue("amm");
  }
  if(this.l12mchart_type){
    this.chart_type_form.setValue(this.l12mchart_type);
  }else{
    this.chart_type_form.setValue("line");
  }
  this.card_name.setValue(this.L12Mcard_title);
}


// This method will display the attribute metrics info for last 30 days card.
getL30DattrMetrics(){
  this.days30_spinner  = true;
  this.metricsChartTypesService.getattrMetricsS(this.gateway_id, this.attribute_id, "30D","attribute_analysis",this.device_parameter, this.browser_timezone).subscribe(response =>{
    if(response['Unsucessfull']){
      this.L30Dcard_title = "Last 30 Days";
      this.days30_error = true;
      this.days30_spinner  = false;
    }else{
      this.days30_spinner  = false;
      this.days30_error = false;
      if (Object.keys(response['attr_metric_info']).length === 0) {
        this.L30Dcard_title = "Last 30 Days";
        let metrics_data:any = []
        metrics_data = response['metrics_data']
        this.L30Dchart_type = "line";
        if(metrics_data['max_range'] == 0){
          this.no30days_data  = true;
        }else{
          this.last30DDTNumLchart(metrics_data, "amm");
          this.no30days_data  = false;
        }

      }else{

        let metrics_info = response['attr_metric_info'];
        this.L30Dcard_title  = metrics_info['sf_card_title'];
        this.l30dchart_type = metrics_info['sf_chart_type'];
        this.l30dmetrics_type = metrics_info['sf_metrics_type'];
        let metrics_data:any = []
        metrics_data = response['metrics_data'];
        let max_value = metrics_data['max_range'];
        if(max_value == 0){
          this.no30days_data  = true;
        }else{
          this.no30days_data  = false;
          this.L30Dchart_type = metrics_info['sf_chart_type'];
          if(this.L30Dchart_type == "line"){
            this.last30DDTNumLchart(metrics_data, metrics_info['sf_metrics_type']);
          }
          if(this.L30Dchart_type == "bar"){
            this.last30DDTNumBchart(metrics_data, metrics_info['sf_metrics_type']);
          }

        }
      }
    }
  }, error =>{
    this.L30Dcard_title = "Last 30 Days";
    this.days30_spinner  = false;
    this.days30_error = true;
  })
}


// This method will set the last 12 months pop up values.
setL30DattrMetrics(){
  if(this.l30dmetrics_type){
    this.metric_form.setValue(this.l30dmetrics_type);
  }else{
    this.metric_form.setValue("amm");
  }
  if(this.l30dchart_type){
    this.chart_type_form.setValue(this.l30dchart_type);
  }else{
    this.chart_type_form.setValue("line");
  }
  this.card_name.setValue(this.L30Dcard_title);
}

// --------------------------------------------------------------------------------------------------------
//  Chart String data type api calls
// --------------------------------------------------------------------------------------------------------
//  last 24 hours.
getL24HattrStrMetrics(){
  this.last24hr_spinner = true;
  this.metricsChartTypesService.getattrStrMetricsS(this.gateway_id, "24H", this.device_parameter, this.browser_timezone, this.attribute_id).subscribe(response =>{
    if(response == false){
      this.last24hr_error = true;
      this.last24hr_spinner = false;
    }else{
      this.last24hr_spinner = false;
      this.last24hr_error = false;
      this.L24Hcard_title = "Last 24 hours";
      this.L24Hchart_type == "bar"
      this.hr24_respone_data = response;
      let max_value = this.hr24_respone_data['max_range'];
      if(max_value == 0){
        this.no24hrs_data = true;
      }else{
          this.no24hrs_data = false;
          this.last24hoursStringC(this.hr24_respone_data['data'], this.hr24_respone_data['time_period'])
      }
    }
  }, error =>{
    this.last24hr_error = true;
    this.last24hr_spinner = false;
  })
}

// last 7 days.
no7days_data:boolean
get7DattrStrMetrics(){
  this.days7_spinner = true;
  this.metricsChartTypesService.getattrStrMetricsS(this.gateway_id, "7D", this.device_parameter, this.browser_timezone, this.attribute_id).subscribe(response =>{
    this.days7_spinner = false;
    if(response == false){
      this.days7_error = true;
      this.days7_spinner = false;
    }else{
      this.L7Dcard_title = "Last 7 days";
      this.days7_respone_data = response;
      if (this.days7_respone_data['max_range'] == 0) {
        this.no7days_data = true;
      }else{
        this.no7days_data =  false;
        this.L7Dchart_type = 'bar';
        let data_arry:any =[];
        let time_period:any = this.days7_respone_data['time_period'];
        let attr_keys = Object.keys(this.days7_respone_data['data']);
        let data_obj:any ={}
        for(let key of attr_keys){
          data_obj =  {label : key,
                              data: this.days7_respone_data['data'][key],
                              stack: 'a',
                              barPercentage: 0.5,
                              barThickness: 30
                              }
          data_arry.push(data_obj)
        }
        this.last7daysStringC(data_arry, time_period);
      }
    }
  }, error =>{
    this.days7_error = true;
    this.days7_spinner = false;
  })
}

// last 30 days.
get30DattrStrMetrics(){
  this.days30_spinner = true;
  this.metricsChartTypesService.getattrStrMetricsS(this.gateway_id, "30D", this.device_parameter, this.browser_timezone, this.attribute_id).subscribe(response =>{
    this.days30_spinner = false;
    if(response == false){
      this.days30_spinner = false;
      this.days30_error = true;
    }else{
      this.L30Dcard_title = "Last 30 days";
      this.days30_respone_data = response;
      let max_value = this.days30_respone_data['max_range'];
      if (max_value == 0){
        this.no30days_data = true;
    }else{
      this.no30days_data = false;
      this.L30Dchart_type = "bar";
      let data_arry:any =[];
      let time_period:any = this.days30_respone_data['time_period'];
      let attr_keys = Object.keys(this.days30_respone_data['data']);
      let data_obj:any ={}
      for(let key of attr_keys){
        data_obj =  {label : key,
                            data: this.days30_respone_data['data'][key],
                            stack: 'a',
                            barPercentage: 0.5,
                            barThickness: 30
                            }
        data_arry.push(data_obj)
      }
      this.last30daysStringC(data_arry, time_period, max_value);
    }
    }



  }, error=>{
    this.days30_spinner = false;
    this.days30_error = true;
  })
}

// last 12 months.
get12MattrStrMetrics(){
  this.months12_spinner = true;
  this.metricsChartTypesService.getattrStrMetricsS(this.gateway_id, "12M", this.device_parameter, this.browser_timezone, this.attribute_id).subscribe(response =>{
    this.months12_spinner = false;
    if(response == false){
      this.months12_spinner = false;
      this.months12_error = true;
    }else{
      this.L12Mcard_title = "Last  12 Months";
      this.months12_respone_data = response;
      let max_value = this.months12_respone_data['max_range'];
      if(max_value == 0){
        this.no12months_data = true;
      }else{
        this.no12months_data = false;
        this.L12Mchart_type = "bar";
        let data_arry:any =[];
        let time_period:any = this.months12_respone_data['time_period'];
        let attr_keys = Object.keys(this.months12_respone_data['data']);
        let data_obj:any ={}
        for(let key of attr_keys){
          data_obj =  {label : key,
                              data: this.months12_respone_data['data'][key],
                              stack: 'a',
                              barPercentage: 0.5,
                              barThickness: 30
                              }
          data_arry.push(data_obj)
        }
        this.last12monthsStringC(data_arry, time_period, max_value);
      }
    }
  }, error=>{
    this.months12_spinner = false;
    this.months12_error = true;
  })
}

  //  This method will display the current device attribute analysis.
  gaugeType= "arch";
  gaugeValue:any;
  gaugeLabel:any;
  gaugeAppendText:any;
  thick=15;
  cap="round";
  Color = this.otherService.chartColors.purple;
  gauge_max:any


  currentanalysis(){
      this.currstatus_spinner = true;
      this.analysisService.getCurrent_S(this.gateway_id, this.attribute).subscribe(response =>{
        this.currstatus_spinner = false;
        if(response == false){
          this.current_analysis_updated_at = this.currentdate;
          this.gaugeValue = 0;
          this.current_status_int_error = true;
        }else{
          if(response == null){
            this.curr_res_null = true;
            this.current_status_int_error = true;
          }else{
            this.curr_res_null = false;
            this.current_status_int_error = false;
            this.current_analysis_updated_at = response['created_by_date'];
            this.parameter_data_type = response['data_type'];
            localStorage.setItem('analysis_uom', response['uom']);
            if(this.parameter_data_type == "Number"){
              this.gaugeValue = response['value'];
              this.current_uom = response['uom'];
              this.gauge_max = response['max_val'];
            }
            if(this.parameter_data_type  == "String"){
                this.current_string_val = response['value'];
                this.current_uom = response['uom'];
            }


          }

        }
      }, error => {
          this.current_analysis_updated_at = this.currentdate;
          this.gaugeValue = 0;
          this.current_status_int_error = true;
          this.currstatus_spinner = false;
      })
    }


// This method  will display all the device attribute analysis.
no_analysis_tab: boolean = false;
  allattranalysis(){
    this.table_spinner = true;
    this.analysisService.getallDA_S(this.gateway_id, this.attribute).subscribe(response =>{
      this.table_spinner = false;
      this.dlogs= response;
      if(this.dlogs.length == 0){
        this.no_analysis_tab = true;
        }else{
            this.no_analysis_tab = false;
            this.payload_key = this.dlogs[0]['payload_key'];
            this.dataSource.data = this.dlogs;
        }

      if(response['Unsucessfull'] || response == null){
        this.table_internalError =  true;
      }

    }, error =>{
      this.table_internalError = true;
      this.table_spinner = false;
    })
  }

  // chart variables.
public LC_L24hrsN_Data = [];


public LC_7DaysN_Data = [];
public LC_7DaysNLabels = [];
public LC_L7DaysNOptions = {};
public LC_L7DaysNColors = [];

public LC_12mnthsN_Data = [];
public LC_12mnthsNLabels = [];
public LC_12mnthsNOptions = {};
public LC_12mnthsNColors = [];


public LC_L30DaysN_Data = [];
public LC_L30DaysNLabels = [];
public LC_L30DaysNOptions = {};
public LC_L30DaysNColors = [];


public lineChartLegend = true;


chartColors = {
  pink: '#ff006a',
  purple: '#7b00ff',
  lite_green:"#02f7be",
  orange:"#f5ad42",
  red   : '#ff6384',
  yellow: '#ffce56',
  blue: '#009EDC',
  grey: '#4a6a75',
  themecolor:  'rgba(0, 0, 0, 0.1)',
  robins_egg_blue:"#00cec9",
  mint_leaf:"#00b894",
  electron_blue:"#0984e3",
  american_river:"#636e72",
  orange_ville:"#e17055"
};


// ---------------------------------------------------------------------------------------------------------------------------------------------
// last24hours Charts.
// ---------------------------------------------------------------------------------------------------------------------------------------------

//  Number data type line chart.
last24HDTNumLchart(dim_data:any, metrics_type:string) {
  if(metrics_type == "amm"){
        this.LC_L24hrsN_Chartoptions = {
          series: [
            {
              name: "Average",
              data: dim_data.average_values
            },
            {
              name: "Minimum",
              data: dim_data.minimum_values
            },
            {
              name: "Maximum",
              data: dim_data.maximum_values
            }
          ],
          chart: {
            height: 200,
            type: "line",
            toolbar: {
              show: false
            },
            zoom:{
              enabled:false
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            width: 2,
            curve: "smooth",
            dashArray: [0, 8, 5]
          },

          legend: {
            tooltipHoverFormatter: function(val, opts) {
              return (
                val +
                " - <strong>" +
                opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
                "</strong>"
              );
            },
            position: "top",
            horizontalAlign: "right",
            floating: true,
            offsetY: 0,
            offsetX: -5,
            showForSingleSeries: true
          },
          markers: {
            size: 0,
            hover: {
              sizeOffset: 6
            }
          },
          xaxis: {
            labels: {
              trim: false,
              rotate: -45,
              rotateAlways:true
            },
            categories: dim_data.time_period
          },
          yaxis:{
            title:{
              text:this.current_uom
            }
          },
          tooltip: {
            y: [
              {
                title: {
                  formatter: function(val) {
                    return val;
                  }
                }
              },
              {
                title: {
                  formatter: function(val) {
                    return val;
                  }
                }
              },
              {
                title: {
                  formatter: function(val) {
                    return val;
                  }
                }
              }
            ]
          },
          grid: {
            borderColor: "#f1f1f1"
          }
        };
  }
  else if(metrics_type == "count"){
      this.LC_L24hrsN_Chartoptions = {
        series: [
          {
            name: "Count",
            data: dim_data.count_values
          }
        ],
        chart: {
          height: 200,
          type: "area",
          dropShadow: {
            enabled: true,
            color: "#000",
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
          },
          toolbar: {
            show: false
          },
          zoom:{
            enabled:false
          }
        },
        colors: ["#00cec9"],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth"
        },

        grid: {
          borderColor: "#e7e7e7",
          row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.2
          }
        },
        markers: {
          size: 1
        },
        xaxis: {
          labels: {
            trim: false,
            rotate: -45,
            rotateAlways:true
          },
          categories: dim_data.time_period
        },
        yaxis: {
          title: {
            text:  this.current_uom
          }
        },
        legend: {
          tooltipHoverFormatter: function(val, opts) {
            return (
              val +
              " - <strong>" +
              opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
              "</strong>"
            );
          },
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: 0,
          offsetX: -5,
          showForSingleSeries: true
        }
      }
  }
  else if(metrics_type == "sum"){
    this.LC_L24hrsN_Chartoptions = {
      series: [
        {
          name: "Sum",
          data: dim_data.sum_values
        }
      ],
      chart: {
        height: 200,
        type: "area",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        },
        zoom:{
          enabled:false
        }
      },
      colors: ["#00b894"],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },

      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.2
        }
      },
      markers: {
        size: 1
      },
      xaxis: {
        labels: {
          trim: false,
          rotate: -45,
          rotateAlways:true
        },
        categories: dim_data.time_period
      },
      yaxis: {
        title: {
          text:  this.current_uom
        }
      },
      legend: {
        tooltipHoverFormatter: function(val, opts) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        },
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: 0,
        offsetX: -5,
        showForSingleSeries: true
      }
    }
  }
  else if(metrics_type == "variance"){
    this.LC_L24hrsN_Chartoptions = {
      series: [
        {
          name: "Variance",
          data: dim_data.variance_values
        }
      ],
      chart: {
        height: 200,
        type: "area",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        },
        zoom:{
          enabled:false
        }
      },
      colors: ["#00b894"],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },

      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.2
        }
      },
      markers: {
        size: 1
      },
      xaxis: {
        labels: {
          trim: false,
          rotate: -45,
          rotateAlways:true
        },
        categories: dim_data.time_period
      },
      yaxis: {
        title: {
          text:  this.current_uom
        }
      },
      legend: {
        tooltipHoverFormatter: function(val, opts) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        },
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: 0,
        offsetX: -5,
        showForSingleSeries: true
      }
    }

  }
  else if(metrics_type == "standard_deviation"){
    this.LC_L24hrsN_Chartoptions = {
      series: [
        {
          name: "Standard Deviation",
          data: dim_data.std_values
        }
      ],
      chart: {
        height: 200,
        type: "area",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        },
        zoom:{
          enabled:false
        }
      },
      colors: ["#00b894"],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },

      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.2
        }
      },
      markers: {
        size: 1
      },
      xaxis: {
        labels: {
          trim: false,
          rotate: -45,
          rotateAlways:true
        },
        categories: dim_data.time_period
      },
      yaxis: {
        title: {
          text:  this.current_uom
        }
      },
      legend: {
        tooltipHoverFormatter: function(val, opts) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        },
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: 0,
        offsetX: -5,
        showForSingleSeries: true
      }
    }
  }
  else if(metrics_type == "median"){
    this.LC_L24hrsN_Chartoptions = {
      series: [
        {
          name: "Median",
          data: dim_data.median_values
        }
      ],
      chart: {
        height: 200,
        type: "area",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        },
        zoom:{
          enabled:false
        }
      },
      colors: ["#00b894"],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },

      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.2
        }
      },
      markers: {
        size: 1
      },
      xaxis: {
        labels: {
          trim: false,
          rotate: -45,
          rotateAlways:true
        },
        categories: dim_data.time_period
      },
      yaxis: {
        title: {
          text:  this.current_uom
        }
      },
      legend: {
        tooltipHoverFormatter: function(val, opts) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        },
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: 0,
        offsetX: -5,
        showForSingleSeries: true
      }
    }
  }

}

// Number data type bar chart.
last24HDTNumBchart(dim_data:any, metrics_type:string){


if(metrics_type == "amm"){
  this.BC_L24hrsN_Chartoptions = {
    series: [
      {
        name: "Average",
        data: dim_data.average_values
      },
      {
        name: "Minimum",
        data: dim_data.minimum_values
      },
      {
        name: "Maximum",
        data: dim_data.maximum_values
      }
    ],
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: 0,
      offsetX: -5,
      showForSingleSeries: true
    },
    chart: {
      type: "bar",
      height: 200,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded"
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"]
    },
    xaxis: {
      labels: {
        trim: false,
        rotate: -45,
        rotateAlways:true
      },
      categories: dim_data.time_period,

    },
    yaxis: {
      title: {
        text: this.current_uom
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return  val;
        }
      }
    }
  };
  }

 else if(metrics_type == "count"){
      this.BC_L24hrsN_Chartoptions = {
        series: [
          {
            name: "Count",
            data: dim_data.count_values
          },
        ],

        chart: {
          type: "bar",
          height: 200,
          toolbar: {
            show: false
          }
        },
        legend: {
          tooltipHoverFormatter: function(val, opts) {
            return (
              val +
              " - <strong>" +
              opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
              "</strong>"
            );
          },
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: 0,
          offsetX: -5,
          showForSingleSeries: true
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          labels: {
            trim: false,
            rotate: -45,
            rotateAlways:true
          },
          categories: dim_data.time_period
        },
        yaxis: {
          title: {
            text: this.current_uom
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return  val;
            }
          }
        }
      };
  }

  else if(metrics_type == "sum"){
    this.BC_L24hrsN_Chartoptions = {
      series: [
        {
          name: "Sum",
          data: dim_data.sum_values
        },
      ],
      chart: {
        type: "bar",
        height: 200,
        toolbar: {
          show: false
        }
      },
      colors:["#00b894"],
      legend: {
        tooltipHoverFormatter: function(val, opts) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        },
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: 0,
        offsetX: -5,
        showForSingleSeries: true
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        labels: {
          trim: false,
          rotate: -45,
          rotateAlways:true
        },
        categories: dim_data.time_period
      },
      yaxis: {
        title: {
          text: this.current_uom
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return  val;
          }
        }
      }
    };
  }
  else if(metrics_type == "variance"){
    this.BC_L24hrsN_Chartoptions = {
      series: [
        {
          name: "Variance",
          data: dim_data.variance_values
        },
      ],
      chart: {
        type: "bar",
        height: 200,
        toolbar: {
          show: false
        }
      },
      colors:["#00b894"],
      legend: {
        tooltipHoverFormatter: function(val, opts) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        },
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: 0,
        offsetX: -5,
        showForSingleSeries: true
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        labels: {
          trim: false,
          rotate: -45,
          rotateAlways:true
        },
        categories: dim_data.time_period
      },
      yaxis: {
        title: {
          text: this.current_uom
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return  val;
          }
        }
      }
    };
  }

  else if(metrics_type == "standard_deviation"){
    this.BC_L24hrsN_Chartoptions = {
      series: [
        {
          name: "Standard Deviation",
          data: dim_data.std_values
        },
      ],
      chart: {
        type: "bar",
        height: 200,
        toolbar: {
          show: false
        }
      },
      colors:["#00b894"],
      legend: {
        tooltipHoverFormatter: function(val, opts) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        },
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: 0,
        offsetX: -5,
        showForSingleSeries: true
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        labels: {
          trim: false,
          rotate: -45,
          rotateAlways:true
        },
        categories: dim_data.time_period
      },
      yaxis: {
        title: {
          text: this.current_uom
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return  val;
          }
        }
      }
    };
  }

  else if(metrics_type == "median"){
    this.BC_L24hrsN_Chartoptions = {
      series: [
        {
          name: "Median",
          data: dim_data.median_values
        },
      ],
      chart: {
        type: "bar",
        height: 200,
        toolbar: {
          show: false
        }
      },
      colors:["#00b894"],
      legend: {
        tooltipHoverFormatter: function(val, opts) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        },
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: 0,
        offsetX: -5,
        showForSingleSeries: true
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        labels: {
          trim: false,
          rotate: -45,
          rotateAlways:true
        },
        categories: dim_data.time_period
      },
      yaxis: {
        title: {
          text: this.current_uom
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return  val;
          }
        }
      }
    };
  }

}

// String data type stacked bar chart.
last24hoursStringC(data_arry:any, time_period:any) {
  this.BC_L24hrsN_Chartoptions = {
    series: [
      data_arry
    ],

    chart: {
      type: "bar",
      height: 200,
      toolbar: {
        show: false
      }
    },
    legend: {
      tooltipHoverFormatter: function(val, opts) {
        return (
          val +
          " - <strong>" +
          opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
          "</strong>"
        );
      },
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: 0,
      offsetX: -5,
      showForSingleSeries: true
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded"
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"]
    },
    xaxis: {
      labels: {
        trim: false,
        rotate: -45,
        rotateAlways:true
      },
      categories: time_period
    },
    yaxis: {
      title: {
        text: this.current_uom
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return  val;
        }
      }
    }
  };
}


// ---------------------------------------------------------------------------------------------------------------------------------------------
// last7days Charts.
// ---------------------------------------------------------------------------------------------------------------------------------------------
//  Number data type line chart.
last7DDTNumLchart(dim_data:any, metrics_type:string) {
  if(metrics_type == "amm"){
    this.LC_7DaysN_Data__Chartoptions = {
      series: [
        {
          name: "Average",
          data: dim_data.average_values
        },
        {
          name: "Minimum",
          data: dim_data.minimum_values
        },
        {
          name: "Maximum",
          data: dim_data.maximum_values
        }
      ],
      chart: {
        height: 200,
        type: "line",
        toolbar: {
          show: false
        },
        zoom:{
          enabled:false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2,
        curve: "smooth",
        dashArray: [0, 8, 5]
      },

      legend: {
        tooltipHoverFormatter: function(val, opts) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        },
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: 0,
        offsetX: -5,
        showForSingleSeries: true
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        labels: {
          trim: false
        },
        categories: dim_data.time_period
      },
      yaxis:{
        title:{
          text:this.current_uom
        }
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function(val) {
                return val;
              }
            }
          },
          {
            title: {
              formatter: function(val) {
                return val;
              }
            }
          },
          {
            title: {
              formatter: function(val) {
                return val;
              }
            }
          }
        ]
      },
      grid: {
        borderColor: "#f1f1f1"
      }
    };
}
else if(metrics_type == "count"){
  this.LC_7DaysN_Data__Chartoptions = {
    series: [
      {
        name: "Count",
        data: dim_data.count_values
      }
    ],
    chart: {
      height: 200,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: false
      },
      zoom:{
        enabled:false
      }
    },
    colors: ["#00cec9"],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "smooth"
    },

    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.2
      }
    },
    markers: {
      size: 1
    },
    xaxis: {
      categories: dim_data.time_period
    },
    yaxis: {
      title: {
        text:  this.current_uom
      }
    },
    legend: {
      tooltipHoverFormatter: function(val, opts) {
        return (
          val +
          " - <strong>" +
          opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
          "</strong>"
        );
      },
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: 0,
      offsetX: -5,
      showForSingleSeries: true
    }
  }
}
else if(metrics_type == "sum"){
this.LC_7DaysN_Data__Chartoptions = {
  series: [
    {
      name: "Sum",
      data: dim_data.sum_values
    }
  ],
  chart: {
    height: 200,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#000",
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2
    },
    toolbar: {
      show: false
    },
    zoom:{
      enabled:false
    }
  },
  colors: ["#00b894"],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: "smooth"
  },

  grid: {
    borderColor: "#e7e7e7",
    row: {
      colors: ["#f3f3f3", "transparent"],
      opacity: 0.2
    }
  },
  markers: {
    size: 1
  },
  xaxis: {
    categories: dim_data.time_period
  },
  yaxis: {
    title: {
      text:  this.current_uom
    }
  },
  legend: {
    tooltipHoverFormatter: function(val, opts) {
      return (
        val +
        " - <strong>" +
        opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
        "</strong>"
      );
    },
    position: "top",
    horizontalAlign: "right",
    floating: true,
    offsetY: 0,
    offsetX: -5,
    showForSingleSeries: true
  }
}
}
else if(metrics_type == "variance"){
this.LC_7DaysN_Data__Chartoptions = {
  series: [
    {
      name: "Variance",
      data: dim_data.variance_values
    }
  ],
  chart: {
    height: 200,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#000",
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2
    },
    toolbar: {
      show: false
    },
    zoom:{
      enabled:false
    }
  },
  colors: ["#00b894"],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: "smooth"
  },

  grid: {
    borderColor: "#e7e7e7",
    row: {
      colors: ["#f3f3f3", "transparent"],
      opacity: 0.2
    }
  },
  markers: {
    size: 1
  },
  xaxis: {
    categories: dim_data.time_period
  },
  yaxis: {
    title: {
      text:  this.current_uom
    }
  },
  legend: {
    tooltipHoverFormatter: function(val, opts) {
      return (
        val +
        " - <strong>" +
        opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
        "</strong>"
      );
    },
    position: "top",
    horizontalAlign: "right",
    floating: true,
    offsetY: 0,
    offsetX: -5,
    showForSingleSeries: true
  }
}

}
else if(metrics_type == "standard_deviation"){
this.LC_7DaysN_Data__Chartoptions = {
  series: [
    {
      name: "Standard Deviation",
      data: dim_data.std_values
    }
  ],
  chart: {
    height: 200,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#000",
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2
    },
    toolbar: {
      show: false
    },
    zoom:{
      enabled:false
    }
  },
  colors: ["#00b894"],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: "smooth"
  },

  grid: {
    borderColor: "#e7e7e7",
    row: {
      colors: ["#f3f3f3", "transparent"],
      opacity: 0.2
    }
  },
  markers: {
    size: 1
  },
  xaxis: {
    categories: dim_data.time_period
  },
  yaxis: {
    title: {
      text:  this.current_uom
    }
  },
  legend: {
    tooltipHoverFormatter: function(val, opts) {
      return (
        val +
        " - <strong>" +
        opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
        "</strong>"
      );
    },
    position: "top",
    horizontalAlign: "right",
    floating: true,
    offsetY: 0,
    offsetX: -5,
    showForSingleSeries: true
  }
}
}
else if(metrics_type == "median"){
this.LC_7DaysN_Data__Chartoptions = {
  series: [
    {
      name: "Median",
      data: dim_data.median_values
    }
  ],
  chart: {
    height: 200,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#000",
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2
    },
    toolbar: {
      show: false
    },
    zoom:{
      enabled:false
    }
  },
  colors: ["#00b894"],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: "smooth"
  },

  grid: {
    borderColor: "#e7e7e7",
    row: {
      colors: ["#f3f3f3", "transparent"],
      opacity: 0.2
    }
  },
  markers: {
    size: 1
  },
  xaxis: {
    categories: dim_data.time_period
  },
  yaxis: {
    title: {
      text:  this.current_uom
    }
  },
  legend: {
    tooltipHoverFormatter: function(val, opts) {
      return (
        val +
        " - <strong>" +
        opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
        "</strong>"
      );
    },
    position: "top",
    horizontalAlign: "right",
    floating: true,
    offsetY: 0,
    offsetX: -5,
    showForSingleSeries: true
  }
}
}
}

// Number data type bar chart.
last7DDTNumBchart(dim_data:any, metrics_type:string){
  if(metrics_type == "amm"){
    this.BC_7DaysN_Data__Chartoptions = {
      series: [
        {
          name: "Average",
          data: dim_data.average_values
        },
        {
          name: "Minimum",
          data: dim_data.minimum_values
        },
        {
          name: "Maximum",
          data: dim_data.maximum_values
        }
      ],
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: 0,
        offsetX: -5,
        showForSingleSeries: true
      },
      chart: {
        type: "bar",
        height: 200,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: dim_data.time_period
      },
      yaxis: {
        title: {
          text: this.current_uom
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return  val;
          }
        }
      }
    };
    }

   else if(metrics_type == "count"){
        this.BC_7DaysN_Data__Chartoptions = {
          series: [
            {
              name: "Count",
              data: dim_data.count_values
            },
          ],
          chart: {
            type: "bar",
            height: 200,
            toolbar: {
              show: false
            }
          },
          legend: {
            tooltipHoverFormatter: function(val, opts) {
              return (
                val +
                " - <strong>" +
                opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
                "</strong>"
              );
            },
            position: "top",
            horizontalAlign: "right",
            floating: true,
            offsetY: 0,
            offsetX: -5,
            showForSingleSeries: true
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "55%",
              endingShape: "rounded"
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ["transparent"]
          },
          xaxis: {
            categories: dim_data.time_period
          },
          yaxis: {
            title: {
              text: this.current_uom
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function(val) {
                return  val;
              }
            }
          }
        };
    }

    else if(metrics_type == "sum"){
      this.BC_7DaysN_Data__Chartoptions = {
        series: [
          {
            name: "Sum",
            data: dim_data.sum_values
          },
        ],
        chart: {
          type: "bar",
          height: 200,
          toolbar: {
            show: false
          }
        },
        colors:["#00b894"],
        legend: {
          tooltipHoverFormatter: function(val, opts) {
            return (
              val +
              " - <strong>" +
              opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
              "</strong>"
            );
          },
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: 0,
          offsetX: -5,
          showForSingleSeries: true
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: dim_data.time_period
        },
        yaxis: {
          title: {
            text: this.current_uom
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return  val;
            }
          }
        }
      };
    }
    else if(metrics_type == "variance"){
      this.BC_7DaysN_Data__Chartoptions = {
        series: [
          {
            name: "Variance",
            data: dim_data.variance_values
          },
        ],
        chart: {
          type: "bar",
          height: 200,
          toolbar: {
            show: false
          }
        },
        colors:["#00b894"],
        legend: {
          tooltipHoverFormatter: function(val, opts) {
            return (
              val +
              " - <strong>" +
              opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
              "</strong>"
            );
          },
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: 0,
          offsetX: -5,
          showForSingleSeries: true
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: dim_data.time_period
        },
        yaxis: {
          title: {
            text: this.current_uom
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return  val;
            }
          }
        }
      };
    }

    else if(metrics_type == "standard_deviation"){
      this.BC_7DaysN_Data__Chartoptions = {
        series: [
          {
            name: "Standard Deviation",
            data: dim_data.std_values
          },
        ],
        chart: {
          type: "bar",
          height: 200,
          toolbar: {
            show: false
          }
        },
        colors:["#00b894"],
        legend: {
          tooltipHoverFormatter: function(val, opts) {
            return (
              val +
              " - <strong>" +
              opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
              "</strong>"
            );
          },
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: 0,
          offsetX: -5,
          showForSingleSeries: true
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: dim_data.time_period
        },
        yaxis: {
          title: {
            text: this.current_uom
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return  val;
            }
          }
        }
      };
    }

    else if(metrics_type == "median"){
      this.BC_7DaysN_Data__Chartoptions = {
        series: [
          {
            name: "Median",
            data: dim_data.median_values
          },
        ],
        chart: {
          type: "bar",
          height: 200,
          toolbar: {
            show: false
          }
        },
        colors:["#00b894"],
        legend: {
          tooltipHoverFormatter: function(val, opts) {
            return (
              val +
              " - <strong>" +
              opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
              "</strong>"
            );
          },
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: 0,
          offsetX: -5,
          showForSingleSeries: true
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: dim_data.time_period
        },
        yaxis: {
          title: {
            text: this.current_uom
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return  val;
            }
          }
        }
      };
    }

}

// String data type stacked bar chart.
last7daysStringC(data_arry:any, time_period:any){
  let ma_val_array:any = [] ;
  data_arry.forEach(element => {
    element['data'].forEach(data_arr => {
      ma_val_array.push(data_arr)
    });
  });
  let  stepvalue = this.otherService.getChartStepValue(ma_val_array);

  var  Tooltip_options: any = {
    maintainAspectRatio: false,
    legend: {
      display: true
    },
    responsive: true,
    tooltips: {
      mode: 'index',
      intersect: false
    },
    scales: {
      yAxes: [{
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(29,140,248,0.0)',
          zeroLineColor: "transparent",
        },
        ticks: {
          stepSize:stepvalue,
          padding: 20,
          fontColor: "#9e9e9e"
        }
      }],

      xAxes: [{
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(0,242,195,0.1)',
          zeroLineColor: "transparent",
        },
        ticks: {
          padding: 20,
          fontColor: "#9e9e9e"
        }
      }]
    }
  };


  this.LC_7DaysN_Data  = data_arry;



  this.LC_7DaysNLabels  = time_period['date'];
  this.LC_L7DaysNOptions = Tooltip_options;

}


// ---------------------------------------------------------------------------------------------------------------------------------------------
// last 12 months Charts.
// ---------------------------------------------------------------------------------------------------------------------------------------------
//  Number data type line chart.
last12MDTNumLchart(dim_data:any, metrics_type:string) {
  if(metrics_type == "amm"){
    this.LC_12mnsN_Data__Chartoptions = {
      series: [
        {
          name: "Average",
          data: dim_data.average_values
        },
        {
          name: "Minimum",
          data: dim_data.minimum_values
        },
        {
          name: "Maximum",
          data: dim_data.maximum_values
        }
      ],
      chart: {
        height: 200,
        type: "line",
        toolbar: {
          show: false
        },
        zoom:{
          enabled:false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2,
        curve: "smooth",
        dashArray: [0, 8, 5]
      },

      legend: {
        tooltipHoverFormatter: function(val, opts) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        },
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: 0,
        offsetX: -5,
        showForSingleSeries: true
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        labels: {
          trim: false
        },
        categories: dim_data.time_period
      },
      yaxis:{
        title:{
          text:this.current_uom
        }
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function(val) {
                return val;
              }
            }
          },
          {
            title: {
              formatter: function(val) {
                return val;
              }
            }
          },
          {
            title: {
              formatter: function(val) {
                return val;
              }
            }
          }
        ]
      },
      grid: {
        borderColor: "#f1f1f1"
      }
    };
}
else if(metrics_type == "count"){
  this.LC_12mnsN_Data__Chartoptions = {
    series: [
      {
        name: "Count",
        data: dim_data.count_values
      }
    ],
    chart: {
      height: 200,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: false
      },
      zoom:{
        enabled:false
      }
    },
    colors: ["#00cec9"],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "smooth"
    },

    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.2
      }
    },
    markers: {
      size: 1
    },
    xaxis: {
      categories: dim_data.time_period
    },
    yaxis: {
      title: {
        text:  this.current_uom
      }
    },
    legend: {
      tooltipHoverFormatter: function(val, opts) {
        return (
          val +
          " - <strong>" +
          opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
          "</strong>"
        );
      },
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: 0,
      offsetX: -5,
      showForSingleSeries: true
    }
  }
}
else if(metrics_type == "sum"){
this.LC_12mnsN_Data__Chartoptions = {
  series: [
    {
      name: "Sum",
      data: dim_data.sum_values
    }
  ],
  chart: {
    height: 200,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#000",
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2
    },
    toolbar: {
      show: false
    },
    zoom:{
      enabled:false
    }
  },
  colors: ["#00b894"],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: "smooth"
  },

  grid: {
    borderColor: "#e7e7e7",
    row: {
      colors: ["#f3f3f3", "transparent"],
      opacity: 0.2
    }
  },
  markers: {
    size: 1
  },
  xaxis: {
    categories: dim_data.time_period
  },
  yaxis: {
    title: {
      text:  this.current_uom
    }
  },
  legend: {
    tooltipHoverFormatter: function(val, opts) {
      return (
        val +
        " - <strong>" +
        opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
        "</strong>"
      );
    },
    position: "top",
    horizontalAlign: "right",
    floating: true,
    offsetY: 0,
    offsetX: -5,
    showForSingleSeries: true
  }
}
}
else if(metrics_type == "variance"){
this.LC_12mnsN_Data__Chartoptions = {
  series: [
    {
      name: "Variance",
      data: dim_data.variance_values
    }
  ],
  chart: {
    height: 200,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#000",
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2
    },
    toolbar: {
      show: false
    },
    zoom:{
      enabled:false
    }
  },
  colors: ["#00b894"],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: "smooth"
  },

  grid: {
    borderColor: "#e7e7e7",
    row: {
      colors: ["#f3f3f3", "transparent"],
      opacity: 0.2
    }
  },
  markers: {
    size: 1
  },
  xaxis: {
    categories: dim_data.time_period
  },
  yaxis: {
    title: {
      text:  this.current_uom
    }
  },
  legend: {
    tooltipHoverFormatter: function(val, opts) {
      return (
        val +
        " - <strong>" +
        opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
        "</strong>"
      );
    },
    position: "top",
    horizontalAlign: "right",
    floating: true,
    offsetY: 0,
    offsetX: -5,
    showForSingleSeries: true
  }
}

}
else if(metrics_type == "standard_deviation"){
this.LC_12mnsN_Data__Chartoptions = {
  series: [
    {
      name: "Standard Deviation",
      data: dim_data.std_values
    }
  ],
  chart: {
    height: 200,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#000",
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2
    },
    toolbar: {
      show: false
    },
    zoom:{
      enabled:false
    }
  },
  colors: ["#00b894"],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: "smooth"
  },

  grid: {
    borderColor: "#e7e7e7",
    row: {
      colors: ["#f3f3f3", "transparent"],
      opacity: 0.2
    }
  },
  markers: {
    size: 1
  },
  xaxis: {
    categories: dim_data.time_period
  },
  yaxis: {
    title: {
      text:  this.current_uom
    }
  },
  legend: {
    tooltipHoverFormatter: function(val, opts) {
      return (
        val +
        " - <strong>" +
        opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
        "</strong>"
      );
    },
    position: "top",
    horizontalAlign: "right",
    floating: true,
    offsetY: 0,
    offsetX: -5,
    showForSingleSeries: true
  }
}
}
else if(metrics_type == "median"){
this.LC_12mnsN_Data__Chartoptions = {
  series: [
    {
      name: "Median",
      data: dim_data.median_values
    }
  ],
  chart: {
    height: 200,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#000",
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2
    },
    toolbar: {
      show: false
    },
    zoom:{
      enabled:false
    }
  },
  colors: ["#00b894"],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: "smooth"
  },

  grid: {
    borderColor: "#e7e7e7",
    row: {
      colors: ["#f3f3f3", "transparent"],
      opacity: 0.2
    }
  },
  markers: {
    size: 1
  },
  xaxis: {
    categories: dim_data.time_period
  },
  yaxis: {
    title: {
      text:  this.current_uom
    }
  },
  legend: {
    tooltipHoverFormatter: function(val, opts) {
      return (
        val +
        " - <strong>" +
        opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
        "</strong>"
      );
    },
    position: "top",
    horizontalAlign: "right",
    floating: true,
    offsetY: 0,
    offsetX: -5,
    showForSingleSeries: true
  }
}
}
}

// Number data type bar chart.
last12MDTNumBchart(dim_data:any, metrics_type:string){
  if(metrics_type == "amm"){
    this.BC_12mnsN_Data__Chartoptions = {
      series: [
        {
          name: "Average",
          data: dim_data.average_values
        },
        {
          name: "Minimum",
          data: dim_data.minimum_values
        },
        {
          name: "Maximum",
          data: dim_data.maximum_values
        }
      ],
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: 0,
        offsetX: -5,
        showForSingleSeries: true
      },
      chart: {
        type: "bar",
        height: 200,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: dim_data.time_period
      },
      yaxis: {
        title: {
          text: this.current_uom
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return  val;
          }
        }
      }
    };
    }

   else if(metrics_type == "count"){
        this.BC_12mnsN_Data__Chartoptions = {
          series: [
            {
              name: "Count",
              data: dim_data.count_values
            },
          ],

          chart: {
            type: "bar",
            height: 200,
            toolbar: {
              show: false
            }
          },
          legend: {
            tooltipHoverFormatter: function(val, opts) {
              return (
                val +
                " - <strong>" +
                opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
                "</strong>"
              );
            },
            position: "top",
            horizontalAlign: "right",
            floating: true,
            offsetY: 0,
            offsetX: -5,
            showForSingleSeries: true
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "55%",
              endingShape: "rounded"
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ["transparent"]
          },
          xaxis: {
            categories: dim_data.time_period
          },
          yaxis: {
            title: {
              text: this.current_uom
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function(val) {
                return  val;
              }
            }
          }
        };
    }

    else if(metrics_type == "sum"){
      this.BC_12mnsN_Data__Chartoptions = {
        series: [
          {
            name: "Sum",
            data: dim_data.sum_values
          },
        ],
        chart: {
          type: "bar",
          height: 200,
          toolbar: {
            show: false
          }
        },
        colors:["#00b894"],
        legend: {
          tooltipHoverFormatter: function(val, opts) {
            return (
              val +
              " - <strong>" +
              opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
              "</strong>"
            );
          },
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: 0,
          offsetX: -5,
          showForSingleSeries: true
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: dim_data.time_period
        },
        yaxis: {
          title: {
            text: this.current_uom
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return  val;
            }
          }
        }
      };
    }
    else if(metrics_type == "variance"){
      this.BC_12mnsN_Data__Chartoptions = {
        series: [
          {
            name: "Variance",
            data: dim_data.variance_values
          },
        ],
        chart: {
          type: "bar",
          height: 200,
          toolbar: {
            show: false
          }
        },
        colors:["#00b894"],
        legend: {
          tooltipHoverFormatter: function(val, opts) {
            return (
              val +
              " - <strong>" +
              opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
              "</strong>"
            );
          },
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: 0,
          offsetX: -5,
          showForSingleSeries: true
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: dim_data.time_period
        },
        yaxis: {
          title: {
            text: this.current_uom
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return  val;
            }
          }
        }
      };
    }

    else if(metrics_type == "standard_deviation"){
      this.BC_12mnsN_Data__Chartoptions = {
        series: [
          {
            name: "Standard Deviation",
            data: dim_data.std_values
          },
        ],
        chart: {
          type: "bar",
          height: 200,
          toolbar: {
            show: false
          }
        },
        colors:["#00b894"],
        legend: {
          tooltipHoverFormatter: function(val, opts) {
            return (
              val +
              " - <strong>" +
              opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
              "</strong>"
            );
          },
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: 0,
          offsetX: -5,
          showForSingleSeries: true
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: dim_data.time_period
        },
        yaxis: {
          title: {
            text: this.current_uom
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return  val;
            }
          }
        }
      };
    }

    else if(metrics_type == "median"){
      this.BC_12mnsN_Data__Chartoptions = {
        series: [
          {
            name: "Median",
            data: dim_data.median_values
          },
        ],
        chart: {
          type: "bar",
          height: 200,
          toolbar: {
            show: false
          }
        },
        colors:["#00b894"],
        legend: {
          tooltipHoverFormatter: function(val, opts) {
            return (
              val +
              " - <strong>" +
              opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
              "</strong>"
            );
          },
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: 0,
          offsetX: -5,
          showForSingleSeries: true
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: dim_data.time_period
        },
        yaxis: {
          title: {
            text: this.current_uom
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return  val;
            }
          }
        }
      };
    }


}

// String data type stacked bar chart.
last12monthsStringC(data_arry:any, time_period:any, max_value:number){
  let stepvalue = this.otherService.getCStepValue(max_value);

  var  Tooltip_options: any = {
    maintainAspectRatio: false,
    legend: {
      display: true
    },
    responsive: true,
    tooltips: {
      mode: 'index',
      intersect: false
    },
    scales: {
      yAxes: [{
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(29,140,248,0.0)',
          zeroLineColor: "transparent",
        },
        ticks: {
          stepSize:stepvalue,
          padding: 20,
          fontColor: "#9e9e9e"
        }
      }],

      xAxes: [{
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(0,242,195,0.1)',
          zeroLineColor: "transparent",
        },
        ticks: {
          padding: 20,
          fontColor: "#9e9e9e"
        }
      }]
    }
  };


  this.LC_12mnthsN_Data  = data_arry;



  this.LC_12mnthsNLabels  = time_period['date'];
  this.LC_12mnthsNOptions = Tooltip_options;




}


// ---------------------------------------------------------------------------------------------------------------------------------------------
// last 30 days Charts.
// ---------------------------------------------------------------------------------------------------------------------------------------------
//  Number data type line chart.
last30DDTNumLchart(dim_data:any, metrics_type:string) {
  if(metrics_type == "amm"){
    this.LC_30DaysN_Data__Chartoptions = {
      series: [
        {
          name: "Average",
          data: dim_data.average_values
        },
        {
          name: "Minimum",
          data: dim_data.minimum_values
        },
        {
          name: "Maximum",
          data: dim_data.maximum_values
        }
      ],
      chart: {
        height: 250,
        type: "line",
        toolbar: {
          show: false
        },
        zoom:{
          enabled:false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2,
        curve: "smooth",
        dashArray: [0, 8, 5]
      },

      legend: {
        tooltipHoverFormatter: function(val, opts) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        },
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: 0,
        offsetX: -5,
        showForSingleSeries: true
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        labels: {
          trim: false
        },
        categories: dim_data.time_period
      },
      yaxis:{
        title:{
          text:this.current_uom
        }
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function(val) {
                return val;
              }
            }
          },
          {
            title: {
              formatter: function(val) {
                return val;
              }
            }
          },
          {
            title: {
              formatter: function(val) {
                return val;
              }
            }
          }
        ]
      },
      grid: {
        borderColor: "#f1f1f1"
      }
    };
}
else if(metrics_type == "count"){
  this.LC_30DaysN_Data__Chartoptions = {
    series: [
      {
        name: "Count",
        data: dim_data.count_values
      }
    ],
    chart: {
      height: 250,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: false
      },
      zoom:{
        enabled:false
      }
    },
    colors: ["#00cec9"],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "smooth"
    },

    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.2
      }
    },
    markers: {
      size: 1
    },
    xaxis: {
      categories: dim_data.time_period
    },
    yaxis: {
      title: {
        text:  this.current_uom
      }
    },
    legend: {
      tooltipHoverFormatter: function(val, opts) {
        return (
          val +
          " - <strong>" +
          opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
          "</strong>"
        );
      },
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: 0,
      offsetX: -5,
      showForSingleSeries: true
    }
  }
}
else if(metrics_type == "sum"){
this.LC_30DaysN_Data__Chartoptions = {
  series: [
    {
      name: "Sum",
      data: dim_data.sum_values
    }
  ],
  chart: {
    height: 250,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#000",
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2
    },
    toolbar: {
      show: false
    },
    zoom:{
      enabled:false
    }
  },
  colors: ["#00b894"],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: "smooth"
  },

  grid: {
    borderColor: "#e7e7e7",
    row: {
      colors: ["#f3f3f3", "transparent"],
      opacity: 0.2
    }
  },
  markers: {
    size: 1
  },
  xaxis: {
    categories: dim_data.time_period
  },
  yaxis: {
    title: {
      text:  this.current_uom
    }
  },
  legend: {
    tooltipHoverFormatter: function(val, opts) {
      return (
        val +
        " - <strong>" +
        opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
        "</strong>"
      );
    },
    position: "top",
    horizontalAlign: "right",
    floating: true,
    offsetY: 0,
    offsetX: -5,
    showForSingleSeries: true
  }
}
}
else if(metrics_type == "variance"){
this.LC_30DaysN_Data__Chartoptions = {
  series: [
    {
      name: "Variance",
      data: dim_data.variance_values
    }
  ],
  chart: {
    height: 250,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#000",
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2
    },
    toolbar: {
      show: false
    },
    zoom:{
      enabled:false
    }
  },
  colors: ["#00b894"],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: "smooth"
  },

  grid: {
    borderColor: "#e7e7e7",
    row: {
      colors: ["#f3f3f3", "transparent"],
      opacity: 0.2
    }
  },
  markers: {
    size: 1
  },
  xaxis: {
    categories: dim_data.time_period
  },
  yaxis: {
    title: {
      text:  this.current_uom
    }
  },
  legend: {
    tooltipHoverFormatter: function(val, opts) {
      return (
        val +
        " - <strong>" +
        opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
        "</strong>"
      );
    },
    position: "top",
    horizontalAlign: "right",
    floating: true,
    offsetY: 0,
    offsetX: -5,
    showForSingleSeries: true
  }
}

}
else if(metrics_type == "standard_deviation"){
this.LC_30DaysN_Data__Chartoptions = {
  series: [
    {
      name: "Standard Deviation",
      data: dim_data.std_values
    }
  ],
  chart: {
    height: 250,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#000",
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2
    },
    toolbar: {
      show: false
    },
    zoom:{
      enabled:false
    }
  },
  colors: ["#00b894"],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: "smooth"
  },

  grid: {
    borderColor: "#e7e7e7",
    row: {
      colors: ["#f3f3f3", "transparent"],
      opacity: 0.2
    }
  },
  markers: {
    size: 1
  },
  xaxis: {
    categories: dim_data.time_period
  },
  yaxis: {
    title: {
      text:  this.current_uom
    }
  },
  legend: {
    tooltipHoverFormatter: function(val, opts) {
      return (
        val +
        " - <strong>" +
        opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
        "</strong>"
      );
    },
    position: "top",
    horizontalAlign: "right",
    floating: true,
    offsetY: 0,
    offsetX: -5,
    showForSingleSeries: true
  }
}
}
else if(metrics_type == "median"){
this.LC_30DaysN_Data__Chartoptions = {
  series: [
    {
      name: "Median",
      data: dim_data.median_values
    }
  ],
  chart: {
    height: 250,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#000",
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2
    },
    toolbar: {
      show: false
    },
    zoom:{
      enabled:false
    }
  },
  colors: ["#00b894"],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: "smooth"
  },

  grid: {
    borderColor: "#e7e7e7",
    row: {
      colors: ["#f3f3f3", "transparent"],
      opacity: 0.2
    }
  },
  markers: {
    size: 1
  },
  xaxis: {
    categories: dim_data.time_period
  },
  yaxis: {
    title: {
      text:  this.current_uom
    }
  },
  legend: {
    tooltipHoverFormatter: function(val, opts) {
      return (
        val +
        " - <strong>" +
        opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
        "</strong>"
      );
    },
    position: "top",
    horizontalAlign: "right",
    floating: true,
    offsetY: 0,
    offsetX: -5,
    showForSingleSeries: true
  }
}
}
}

// Number data type bar chart.
last30DDTNumBchart(dim_data:any, metrics_type:string){
  if(metrics_type == "amm"){
    this.BC_30DaysN_Data__Chartoptions = {
      series: [
        {
          name: "Average",
          data: dim_data.average_values
        },
        {
          name: "Minimum",
          data: dim_data.minimum_values
        },
        {
          name: "Maximum",
          data: dim_data.maximum_values
        }
      ],
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: 0,
        offsetX: -5,
        showForSingleSeries: true
      },
      chart: {
        type: "bar",
        height: 250,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: dim_data.time_period
      },
      yaxis: {
        title: {
          text: this.current_uom
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return  val;
          }
        }
      }
    };
    }

   else if(metrics_type == "count"){
        this.BC_30DaysN_Data__Chartoptions = {
          series: [
            {
              name: "Count",
              data: dim_data.count_values
            },
          ],

          chart: {
            type: "bar",
            height: 250,
            toolbar: {
              show: false
            }
          },
          legend: {
            tooltipHoverFormatter: function(val, opts) {
              return (
                val +
                " - <strong>" +
                opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
                "</strong>"
              );
            },
            position: "top",
            horizontalAlign: "right",
            floating: true,
            offsetY: 0,
            offsetX: -5,
            showForSingleSeries: true
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "55%",
              endingShape: "rounded"
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ["transparent"]
          },
          xaxis: {
            categories: dim_data.time_period
          },
          yaxis: {
            title: {
              text: this.current_uom
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function(val) {
                return  val;
              }
            }
          }
        };
    }

    else if(metrics_type == "sum"){
      this.BC_30DaysN_Data__Chartoptions = {
        series: [
          {
            name: "Sum",
            data: dim_data.sum_values
          },
        ],
        chart: {
          type: "bar",
          height: 250,
          toolbar: {
            show: false
          }
        },
        colors:["#00b894"],
        legend: {
          tooltipHoverFormatter: function(val, opts) {
            return (
              val +
              " - <strong>" +
              opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
              "</strong>"
            );
          },
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: 0,
          offsetX: -5,
          showForSingleSeries: true
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: dim_data.time_period
        },
        yaxis: {
          title: {
            text: this.current_uom
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return  val;
            }
          }
        }
      };
    }
    else if(metrics_type == "variance"){
      this.BC_30DaysN_Data__Chartoptions = {
        series: [
          {
            name: "Variance",
            data: dim_data.variance_values
          },
        ],
        chart: {
          type: "bar",
          height: 250,
          toolbar: {
            show: false
          }
        },
        colors:["#00b894"],
        legend: {
          tooltipHoverFormatter: function(val, opts) {
            return (
              val +
              " - <strong>" +
              opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
              "</strong>"
            );
          },
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: 0,
          offsetX: -5,
          showForSingleSeries: true
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: dim_data.time_period
        },
        yaxis: {
          title: {
            text: this.current_uom
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return  val;
            }
          }
        }
      };
    }

    else if(metrics_type == "standard_deviation"){
      this.BC_30DaysN_Data__Chartoptions = {
        series: [
          {
            name: "Standard Deviation",
            data: dim_data.std_values
          },
        ],
        chart: {
          type: "bar",
          height: 250,
          toolbar: {
            show: false
          }
        },
        colors:["#00b894"],
        legend: {
          tooltipHoverFormatter: function(val, opts) {
            return (
              val +
              " - <strong>" +
              opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
              "</strong>"
            );
          },
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: 0,
          offsetX: -5,
          showForSingleSeries: true
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: dim_data.time_period
        },
        yaxis: {
          title: {
            text: this.current_uom
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return  val;
            }
          }
        }
      };
    }

    else if(metrics_type == "median"){
      this.BC_30DaysN_Data__Chartoptions = {
        series: [
          {
            name: "Median",
            data: dim_data.median_values
          },
        ],
        chart: {
          type: "bar",
          height: 250,
          toolbar: {
            show: false
          }
        },
        colors:["#00b894"],
        legend: {
          tooltipHoverFormatter: function(val, opts) {
            return (
              val +
              " - <strong>" +
              opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
              "</strong>"
            );
          },
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: 0,
          offsetX: -5,
          showForSingleSeries: true
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: dim_data.time_period
        },
        yaxis: {
          title: {
            text: this.current_uom
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return  val;
            }
          }
        }
      };
    }

}

// String data type stacked bar chart.
last30daysStringC(data_arry:any, time_period:any, max_value:number){
  let stepvalue = this.otherService.getCStepValue(max_value);
  var  Tooltip_options: any = {
    maintainAspectRatio: false,
    legend: {
      display: true
    },
    responsive: true,
    tooltips: {
      mode: 'index',
      intersect: false
    },
    scales: {
      yAxes: [{
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(29,140,248,0.0)',
          zeroLineColor: "transparent",
        },
        ticks: {
          max:max_value,
          stepSize:stepvalue,
          padding: 20,
          fontColor: "#9e9e9e"
        }
      }],

      xAxes: [{
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(0,242,195,0.1)',
          zeroLineColor: "transparent",
        },
        ticks: {
          padding: 20,
          fontColor: "#9e9e9e"
        }
      }]
    }
  };


  this.LC_L30DaysN_Data  = data_arry;



  this.LC_L30DaysNLabels  = time_period['date'];
  this.LC_L30DaysNOptions = Tooltip_options;


}

}
