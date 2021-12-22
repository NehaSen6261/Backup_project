import { Component, OnInit, ViewChild,ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ChartComponent, ApexAxisChartSeries, ApexChart,  ApexFill, ApexTooltip, ApexXAxis, ApexLegend, 
         ApexDataLabels, ApexTitleSubtitle, ApexPlotOptions, ApexYAxis } from "ng-apexcharts";
import { OthersService } from '../others/_services/others.service';
import { AuthService } from '../login/_services/auth.service';
import { NavbarService } from '../navbar/_services/navbar.service';
import { AssetNotisService } from './_services/asset-notis.service';

// charts.
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  markers: any;
  stroke: any;
  yaxis: ApexYAxis | ApexYAxis[];
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  colors: string[];
  labels: string[] | number[];
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'asset-notis',
  templateUrl: './asset-notis.component.html',
  styleUrls: ['./asset-notis.component.scss']
})
export class AssetNotisComponent implements OnInit {
  browser_timezone:string;
  public img_total:string;
  public img_warning:string;
  public img_critical:string;
  public img_info:string;

  filter = new FormControl('');

  constructor(
    private navbarService:NavbarService,
    public authService:AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private assetNotisService:AssetNotisService,
    private othersService:OthersService,
    
  ) {
    this.navbarService.Title = "Notifications";
    this.img_total = this.navbarService.images_domain+"notification_lite.svg";
    this.img_warning = this.navbarService.images_domain+"notification_yellow.svg";
    this.img_critical = this.navbarService.images_domain+"notification_red.svg";
    this.img_info = this.navbarService.images_domain+"notification_liteblue.svg";
    
    this.othersService.setTitle( this.navbarService.Title);
   }

   resolution_type = new FormControl('');
  resolution = new FormControl('', [Validators.required]);
  message_id:any;
  private paginator: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
    }
  ngOnDestroy() {
    if (this.dataSource) {
    this.dataSource.disconnect(); }
    }
  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();
    }

  ngOnInit(): void {
    this.browser_timezone= Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.getallaltsC();
    this.gettotalaltsC();
    this.getInfoaltsC();
    this.getwarningaltsC();
    this.getcriticalaltsC();
    this.getNotificationListC();
    this.setDataSourceAttributes();
  }

  public total_alert_num:any;
  public info_alert_num:any;
  public warning_alert_num:any;
  public critical_alert_num:any;


  //This method will display last total count of info, warning, and critical alerts.
  getallaltsC(){
    this.assetNotisService.getallaltsS().subscribe(response =>{
      if(response){
        this.total_alert_num = response['total'];
        this.info_alert_num = response['info_alert'];
        this.warning_alert_num = response['warning_alert'];
        this.critical_alert_num = response['critical_alert'];
      }else{
        this.total_alert_num = 0;
        this.info_alert_num = 0;
        this.warning_alert_num = 0;
        this.critical_alert_num = 0;
      }
    }, error =>{
        this.total_alert_num = 0;
        this.info_alert_num = 0;
        this.warning_alert_num = 0;
        this.critical_alert_num = 0;
    });
  }


 public total_error:boolean=false;
 public total_spinner:boolean=true;
 public total_data:any;
 public total = false;

// This function display last 30 days total alerts.
gettotalaltsC(){
  let data_info:any = [];
  this.assetNotisService.gettotalaltsS().subscribe(response =>{
    this.total_spinner = false;
    if(response){
        data_info = response;
        this.total_data = response['data'];
        if (this.total_data.length == 1) {
          this.total = true;
        }else {
          this.total = false;
          this.totalAlerts(data_info);
        }   
    }else{
      this.total_error = true;
    }
  }, error =>{
    this.total_spinner = false;
    this.total_error = true;
  });
}

 public info_error:boolean=false;
 public info_spinner:boolean=true;
 public info_data:any;
 public info = false;
// This function display last 30 days info alerts.
getInfoaltsC(){
  let data_info:any = [];
  this.assetNotisService.getIWCthmsgsS(6).subscribe(response =>{
    this.info_spinner = false;
    if(response){
        data_info = response;
        this.info_data = response['data'];
        if (this.info_data.length == 1) {
          this.info = true;
        }else {
          this.info = false;
          this.infoAlerts(data_info);
        }
        
    }else{
      this.info_error = true;
    }
  }, error =>{
    this.info_spinner = false;
    this.info_error = true;
  });
}

public warning_error:boolean=false;
public warning_spinner:boolean=true;
public warn_data:any;
public value_info = false;
// This function display last 30 days warning alerts.
getwarningaltsC(){
 let data_info:any = [];
 this.assetNotisService.getIWCthmsgsS(20).subscribe(response =>{
   this.warning_spinner = false;
   if(response){
       data_info = response;
       this.warn_data = response['data'];
       if (this.warn_data.length == 1) {
        this.value_info = true;
      }
      else {
        this.value_info = false;
        this.warningAlerts(data_info);
      }
       
   }else{
     this.warning_error = true;
   }
 }, error =>{
   this.warning_spinner = false;
   this.warning_error = true;
 });
}

public critical_error:boolean=false;
public critical_spinner:boolean=true;
public critical_data:any;
public critical = false;
// This function display last 30 days critical alerts.
getcriticalaltsC(){
 let data_info:any = [];
 this.assetNotisService.getIWCthmsgsS(21).subscribe(response =>{   
   this.critical_spinner = false;
   if(response){
       data_info = response;
       this.critical_data = response['data'];
       if (this.critical_data.length == 1) {
        this.critical = true;
      }else {
        this.critical = false;
        this.criticalAlerts(data_info);
      }
       
   }else{     
     this.critical_error = true;
   }
 }, error =>{
   this.critical_spinner = false;
   this.critical_error = true;
 });
}



//  This method will display the all the notifications for table view.
public notification_list:any = [];
public no_notis:boolean = false;
public list_internalError:boolean = false
public list_spinner:boolean = true;
obs: Observable<any>;
dataSource = new MatTableDataSource(this.notification_list);
setDataSourceAttributes() {
  this.obs = this.dataSource.connect();
  this.dataSource.paginator = this.paginator;
}
getNotificationListC(){
  this.assetNotisService.getNotificationListS(this.browser_timezone, 1000).subscribe( response =>{    
    this.list_spinner = false;
    if(response){
      this.notification_list = response;
      this.dataSource.data = this.notification_list;      
      if(this.notification_list.length != 0){
        this.no_notis = false;      
      }else{
        this.no_notis = true;
      }
    }else{
      this.no_notis = true;
    }
  }, error =>{
    this.list_spinner = false;
    this.list_internalError = true;
  })
}

// this method will update the message using message log id.
Setresolution(){
  let data  = {}
    data['resolution_type'] = this.resolution_type.value;
    data['resolution_desc'] = this.resolution.value;
    data['updated_by'] = this.authService.currentUser['email'];    
    this.assetNotisService.putNotificationS(this.message_id, data).subscribe(response =>{
      this.ngOnInit();
      this.resolution_type.reset();
      this.resolution.reset();
    });
}



// get and set the value of the input fields
getinfo(data){
  this.resolution_type.setValue(data['resolution_type'])
  this.resolution.setValue(data['resolution_desc'])
}

// This method will allow the user to download data in CSV format.
saveAsFile(monthlydimcsvdata:any){  
  this.writeContents(monthlydimcsvdata, 'Assetnotification'+'.csv', 'text/plain');
}
writeContents(content, fileName, contentType) {
  var csvdata = document.createElement('a');
  var file = new Blob([content], {type: contentType});
  csvdata.href = URL.createObjectURL(file);
  csvdata.download = fileName;
  csvdata.click();
}

DatalogsCSV:any =[];
getDatalogsCSVInfo(browser_timezone){  
  this.assetNotisService.getTenantmsgS(browser_timezone).subscribe(response =>{
   this.DatalogsCSV = response;
   this.saveAsFile(this.DatalogsCSV)
 });
}


//  This method will trigger on click of  export as CSV button.
export_CSV(){
   this.getDatalogsCSVInfo(this.browser_timezone);
}

// --------------------------------------------------------------
  // Charts
  // -------------------------------------------------------------
    // charts.
    @ViewChild("chart") chart: ChartComponent;
    // .........................................
    //  ALerts events
    // .........................................

    // total alerts config starts here.-------------------------------------

    public totalAlertOptions:Partial<ChartOptions>;
    // this function will display total alerts chart.
    totalAlerts(data_info:any){
      
      this.totalAlertOptions = {
        series: [
          {
            name: "Total Alerts",
            data: data_info['data']
          }
        ],
        colors: ["#12344D"],  
        tooltip: {
          y: {
            formatter: function(val) {              
              return (val).toFixed(0);
              }
          }
        }
      };
    }

    public totalAertsOptions: Partial<ChartOptions> = {
      chart: {
        id: "totalalerts",
        group: "alerts",
        type: "area",
        height: 130,
        sparkline: {
          enabled: true
        }  
      },

      stroke: {
        show: true,
        curve: "smooth",
        lineCap: 'butt',
        width: 2
      },
      fill: {
        opacity: 0.3,
      },
      yaxis: {
        min: 0,
        labels: {
          minWidth: 40
        }
      }

    };

    // total alerts config ends here.-------------------------------------

    // Info alerts config starts here.-------------------------------------

    public infoAlertOptions:Partial<ChartOptions>;
    // this function will display total alerts chart.
    infoAlerts(data_info:any){            
      this.infoAlertOptions = {
        series: [
          {
            name: "Info Alerts",
            data: data_info['data']
          }
        ],
       colors: ["#a3e6fa"], 
       tooltip: {
        y: {
          formatter: function(val) {              
            return (val).toFixed(0);
            }
        }
      }
      };

    }

    public infoAertsOptions: Partial<ChartOptions> = {
      chart: {
        id: "infoalerts",
        group: "alerts",
        type: "area",
        height: 130,
        sparkline: {
          enabled: true
        }      
      },
      stroke: {
        show: true,
        curve: "smooth",
        lineCap: 'butt',
        width: 2
      },
      fill: {
        opacity: 0.3,
      },
      yaxis: {
        min: 0      
      },
    };

    // Info alerts config ends here.-------------------------------------



    // Warning alerts config starts here.-------------------------------------
    public warningAlertOptions:Partial<ChartOptions>;
    // this function will display total alerts chart.
    warningAlerts(data_info:any){      
      this.warningAlertOptions = {
        series: [
          {
            name: "Warning Alerts",
            data: data_info['data']
          }
        ],
        colors: ["#fdcb6e"],
        tooltip: {
          y: {
            formatter: function(val) {              
              return (val).toFixed(0);
              }
          }
        }
      };



    }

    public warningAertsOptions: Partial<ChartOptions> = {
      chart: {
        id: "warningalerts",
        group: "alerts",
        type: "area",
        height: 130,
        sparkline: {
          enabled: true
        },
       
      },

      stroke: {
        show: true,
        curve: "smooth",
        lineCap: 'butt',
        width: 2
      },
      fill: {
        opacity: 0.3,
      },
      yaxis: {
        min: 0,
        labels: {
          minWidth: 40
        }
      },
    };

    // warning alerts config ends here.-------------------------------------


// Critical alerts config starts here.-------------------------------------
public criticalAlertOptions:Partial<ChartOptions>;
// this function will display total alerts chart.
criticalAlerts(data_info:any){
  this.criticalAlertOptions = {
    series: [
      {
        name: "critical Alerts",
        data: data_info['data']
      }
    ],
  colors: ["#ff7675"],
  tooltip: {
    y: {
      formatter: function(val) {              
        return (val).toFixed(0);
        }
    }
  }
  };



}

public criticalAertsOptions: Partial<ChartOptions> = {
  chart: {
    id: "criticalalerts",
    group: "alerts",
    type: "area",
    height: 130,
    sparkline: {
      enabled: true
    },
 
  },

  stroke: {
    show: true,
    curve: "smooth",
    lineCap: 'butt',
    width: 2
  },
  fill: {
    opacity: 0.3,
  },
  yaxis: {
    min: 0,
    labels: {
      minWidth: 40
    }
  },
};
// Critical alerts config ends here.-------------------------------------
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
