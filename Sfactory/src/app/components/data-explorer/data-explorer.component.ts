import { Component, OnInit, ViewChild, ElementRef, HostListener,ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { NavbarService } from '../navbar/_services/navbar.service';
import { DatalogsService } from './_services/datalogs.service';
import { DeviceService } from '../devices/_services/device.service';
import { DeviceAttrsService } from '../device_attributes/_services/device-attrs.service';
import { OthersService } from '../others/_services/others.service';
import { SnackbarComponent } from '../others/snackbar/snackbar.component';
import { Observable } from 'rxjs';
import { ApexAxisChartSeries, ApexChart, ApexXAxis,  ApexDataLabels,  ApexYAxis,  ApexFill,  ApexMarkers,  ApexStroke,  ApexTooltip} from "ng-apexcharts";


  @Component({
    selector: 'data-explorer',
    templateUrl: './data-explorer.component.html',
  styleUrls: ['./data-explorer.component.scss']
})
export class DataExplorerComponent implements OnInit {

  dlogs:any=[];
  spinner: boolean = false;
  internalError: boolean = false;
  displaydata: boolean = false;
  displayDevice: boolean = true;
  deviceInternalError: boolean = false;
  noDatalogs:boolean = true;
  show_attributes:boolean = false;
  attribute_error:boolean = false;
  displaylinechart: boolean = false;
  displaybarchart: boolean = false;
  displaychart: boolean = false;
  chart_error: boolean = false;
  chart_spinner: boolean = false;
  app_name:string;
  device_name: string;
  dev_eui_id_:string;
  payload:any;
  attr_key:string;
  attr_value:string;
  received_on:string;
  payload_key:string;
  selected:any;
  alldev_Selected=false;
  device_attr
  device_attributes_list:any=[];
  dlogs_canvas:any;
  dlogs_ctx:any;
  dlogs_myChartData:any;
  toggle: boolean = false;
  time
  no_chartdata:boolean;
  maxDate: Date;
  obs: Observable<any>;
  filter:string;
  browser_timezone:string;

  // apex chart config.
  public series: ApexAxisChartSeries;
  public chart: ApexChart;
  public dataLabels: ApexDataLabels;
  public markers: ApexMarkers;
  public fill: ApexFill;
  public yaxis: ApexYAxis;
  public xaxis: ApexXAxis;
  public tooltip: ApexTooltip;
  public stroke: ApexStroke;



  constructor(
      public datalogService: DatalogsService,
      public datepipe: DatePipe,
      public deviceService: DeviceService,
      private navbarService:NavbarService,
      private deviceattrsService:DeviceAttrsService,
      private otherService: OthersService,
      private snackBar: SnackbarComponent,
      private changeDetectorRef: ChangeDetectorRef,
      public othersService: OthersService,
      ) {
      this.navbarService.Title = "Data Explorer";
      this.time = new Date().toLocaleTimeString();
      this.othersService.setTitle(this.navbarService.Title);
  }

  ngOnInit(): void {
    this.browser_timezone= Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.getDevices();
  }



  // select device dropdown
  toppings = new FormControl();
  toppingList: any = [];


  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  device_attributes_fc = new FormControl();


  @ViewChild('select') select: MatSelect;
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

  // this function will disable the date's greater then the current date in date picker
  unavailableDays(calendarDate: Date): boolean {
    return calendarDate < new Date();
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


// select all functionaly related functions starts here.
  toggleAllSelection() {
    if (this.alldev_Selected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
    this.getMultiDeviceAttributes();

  }

  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.alldev_Selected = newStatus;
    this.getMultiDeviceAttributes();

  }

// select all functionaly related functions ends here.

  displayedColumns: string[] = ['application_name', 'sf_dev_eui', 'device_name', 'payload_value', 'created_date'];
  dataSource = new MatTableDataSource(this.dlogs);


  // This method will be called on click of enter button.
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event['keyCode'] == 13){
      this.get_datalogs();
    }

  }


 // This method will display the data logs from start date, end date and gateway_id.
 getOnDemandDataLogs(gateway_id:any, attribute:any, startdate:any, enddate:any){
   this.displaydata = true;
   this.spinner = true;
   this.internalError = false;
  this.datalogService.getOnDemandDatalogs(gateway_id,attribute, startdate, enddate,  this.browser_timezone).subscribe( api_response =>{
    this.spinner = false;
    let response = this.datalogService.datalog_table_response;
    if(response['Unsuccessful'] || response == null){
      this.spinner = false;
      this.internalError = true;
      this.displaydata = false;
    }else{
      this.dlogs= response;
      this.payload_key = this.dlogs[0]['payload_key'];
      this.dataSource.data = this.dlogs;
      if(this.dlogs.length == 0){
        this.spinner = false;
        this.displaydata = true;
        this.noDatalogs = true;
      }else{
        this.noDatalogs = false;
        this.dlogsmetricsdata(this.dlogs);
      }

    }


  }, error =>{
    this.spinner = false;
    this.internalError = true;
    this.displaydata = false;
  })
 }

 ondemand_response_data:any=[];
 data_values:any;
 to_many_data:boolean;
 // This method will display the data logs from start date, end date and gateway_id for graph.
 getOnDemandDatalogsGraph(chart_type:string){
  this.chart_spinner = true;
   this.datalogService.getOnDemandDatalogsGraphS(this.devices, this.attribute, this.start_date, this.end_date, this.browser_timezone).subscribe( api_response =>{
     let response = this.datalogService.datalog_graph_response;
     this.chart_spinner = false;
     if(response['Unsuccessful']){
        this.chart_error = true;
     }else{
      this.chart_error = false;
      this.ondemand_response_data = response;
      let max_val = this.ondemand_response_data['max_val'];
      if(max_val == 0){
       this.no_chartdata = true;
      }else{
      if(this.ondemand_response_data.length == 10001){
            this.to_many_data = true;
        }else{
          this.to_many_data = false;
          this.no_chartdata = false;
          this.displaychart = true;

          if(chart_type == "line"){
            this.datalogLineChart()
          }
        }

      }
     }

   }, error =>{
      this.chart_spinner = false;
      this.chart_error = true;
   })

 }


//  This method will triger on click of get button.
start_date:any;
end_date:any;
devices:any;
attribute:any;
action = "Dismiss";
chart_type:string;
 get_datalogs(){
  this.time = new Date().toLocaleTimeString();
   this.chart_type = "line";
   this.start_date = this.datepipe.transform(this.range.value['start'], 'yyyy-MM-dd');
   this.end_date =  this.datepipe.transform(this.range.value['end'], 'yyyy-MM-dd');
   this.devices = this.toppings.value;
   this.attribute = this.device_attributes_fc['_pendingValue']
   if(this.start_date == null || this.end_date == null || this.devices == null || this.attribute == undefined ){
     let message_text = "Choose valid date range, device, and attribute."
     this.snackBar.snackbar(message_text);
  }else{
    this.getOnDemandDataLogs(this.devices, this.attribute, this.start_date, this.end_date);
    this.getOnDemandDatalogsGraph(this.chart_type);
   }
 }

// This method will call the getTenantDevicesS method  from DeviceService which will display all the devices by tenant id.
is_device_loaded:boolean;
is_dev_attr_loaded:boolean;
getDevices(){
  this.is_device_loaded = true;
  this.deviceService.getTenantDevicesS().subscribe( response =>{
    this.is_device_loaded = false;
    if(response['Unsuccessful'] || response == false){
      this.deviceInternalError = true;
      this.displayDevice = false;
    }else{
      this.toppingList=response;
    }
    if(this.toppingList.length == 0 || this.toppingList==null){
      this.displayDevice = false;
    }
  }, error=>{
    this.deviceInternalError = true;
    this.is_device_loaded = false;
  })
}

// This method will be called  on click of the row for the pop up.
data_exp(data){
  this.app_name = data['application_name'];
  this.device_name = data['device_name'];
  this.dev_eui_id_ = data['sf_dev_eui'];
  this.attr_key = data['payload_key'];
  this.attr_value = data['payload_value'];
  this.received_on = data['created_date'];
  this.payload = data['sf_payload_attributes'];
}

// This method will allow the user to download data in CSV format.
saveAsFile(monthlydimcsvdata){
  this.writeContents(monthlydimcsvdata, 'dataexplorer'+'.csv', 'text/plain');
}
writeContents(content, fileName, contentType) {
  var csvdata = document.createElement('a');
  var file = new Blob([content], {type: contentType});
  csvdata.href = URL.createObjectURL(file);
  csvdata.download = fileName;
  csvdata.click();
}

DatalogsCSV:any =[];
getDatalogsCSVInfo(gateway_id:any, attribute:any, startdate:any, enddate:any){
  this.datalogService.getOnDemandDatalogsCSVS(gateway_id, attribute, startdate, enddate, this.browser_timezone).subscribe(response =>{
   this.DatalogsCSV = response;
   this.saveAsFile(this.DatalogsCSV)
 });
}


//  This method will triger on click of  export as CSV button.
get_datalogsCSV(){
  let start_date = this.datepipe.transform(this.range.value['start'], 'yyyy-MM-dd');
  let end_date =  this.datepipe.transform(this.range.value['end'], 'yyyy-MM-dd');
  let devices = this.toppings.value;
  let attribute = this.device_attributes_fc['_pendingValue']


  if(start_date == null || end_date == null ||  devices == null || attribute == undefined ){
   let message_text = "Choose valid date range, device, and attribute."
   this.snackBar.snackbar(message_text);
  }else{
   this.getDatalogsCSVInfo( devices, attribute, start_date, end_date);
  }
}
// This method will display the attibutes for one or multipule devices.
getMultiDeviceAttributes(){
  this.is_dev_attr_loaded = false;
  let devices = this.toppings.value;
  if(devices){

  }else{
    this.show_attributes = false;
  }
  if(devices.length == 0){
    this.is_dev_attr_loaded = false;
  }


  this.deviceattrsService.getMultiDeviceAttributesS(devices).subscribe( response =>{
    this.device_attributes_list = response;
    if(response['Unsuccessful']){
      this.attribute_error = true;
    }else{
      if(this.device_attributes_list.length == 0){
        this.show_attributes = false;
      }else{
        this.show_attributes = true;
        this.is_dev_attr_loaded = true;
      }
    }

  }, error =>{
    this.attribute_error = true;
  })
}


// This method will  seperate the received date time, and values from the datalog response.
dlogsmetricsdata(data){
  let time_period:any = []
  let values:any = []
  if(data){
      for(let element of data){
        var date = new Date(element['created_date'])
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        var minutes = date.getMinutes();
        var hours = date.getHours();
        var seconds = date.getSeconds();
        var myFormattedDate = day+"-"+(monthIndex+1)+"-"+year+" "+ hours+":"+minutes+":"+seconds;
        time_period.push(myFormattedDate)
        values.push(element['payload_value']);
      }
  }
}


// Data log line chart.
public datalogLineChart(): void {
  this.series =  this.ondemand_response_data['data'];
  this.chart = {
    type: "area",
    stacked: true,
    height: 350,
    zoom: {
      type: "x",
      enabled: true,
      autoScaleYaxis: false
    },
    toolbar: {
      autoSelected: "zoom",
      show: true
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: {
          enabled: true,
          delay: 150
      },
      dynamicAnimation: {
          enabled: true,
          speed: 350
      }
    }
  },

  this.dataLabels = {
    enabled: false
  };
  this.markers = {
    size: 0
  };
  this.stroke ={
    show: true,
    width: 2,
    curve: 'smooth',
  },

  this.fill = {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0,
      stops: [0, 10, 100]
    },
    pattern: {
      strokeWidth: 0.5
    }
  };
  this.yaxis = {
    min:this.ondemand_response_data['min_val'],
    title: {
      text: this.ondemand_response_data['attr_uom']
    },
    labels: {
      formatter: function(val) {
        return (val / 1).toFixed(0);
      }
    }
  };
  this.xaxis = {
    type: "datetime"
  };
  this.tooltip = {
    shared: false,
    y: {
      formatter: function(val) {
        return (val / 1).toFixed(1);
      }
    }
  };
}

}
