import { Component, OnInit, ViewChild,ChangeDetectorRef, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, Validators } from '@angular/forms';
import { NavbarService } from '../../navbar/_services/navbar.service';
import { NotificationService } from '../_services/notification.service';
import { WindowService  } from '../../others/window/_services/window.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { AuthService } from '../../login/_services/auth.service';
import { ChartComponent, ApexAxisChartSeries, ApexChart,  ApexFill, ApexTooltip, ApexXAxis, ApexLegend,  ApexDataLabels,
              ApexTitleSubtitle, ApexPlotOptions, ApexYAxis } from "ng-apexcharts";
import { MatSort } from '@angular/material/sort';
import { OthersService } from '../../others/_services/others.service';

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
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})

export class NotificationComponent implements OnInit {

  list_spinner:boolean = true;
  list_internalError:boolean = false;
  count_spinner:boolean = true;
  count_internalError:boolean = false;
  notis:any = [];
  commands_list:any = [];
  no_commands:boolean = false;
  no_notis:boolean = false;
  filter:string;
  spinner:boolean = true;
  total_event:any;
  critical_event:any;
  info_event:any;
  warning_event:any;
  panelOpenState = false;
  obs: Observable<any>;
  cmds_obs: Observable<any>;
  current_host:any;
  message_id:any;
  resolution_type = new FormControl('');
  resolution = new FormControl('', [Validators.required]);



  cmd_dataSource = new MatTableDataSource(this.commands_list);
  alert_dataSource = new MatTableDataSource(this.notis);

  @ViewChild('paginatoralert', {static: true}) paginatoralert: MatPaginator;
  @ViewChild('paginatorcmdlist', {static: true}) paginatorcmdlist: MatPaginator;


  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginatoralert = mp;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator) set matPaginator1(mp2: MatPaginator) {
    this.paginatorcmdlist = mp2;
    this.setDataSourceAttributes2();
  }

  setDataSourceAttributes() {
    this.changeDetectorRef.detectChanges();
    this.alert_dataSource.paginator = this.paginatoralert;
    this.obs = this.alert_dataSource.connect();
  }
  setDataSourceAttributes2()
  {
    this.changeDetectorRef.detectChanges();
    this.cmd_dataSource.paginator= this.paginatorcmdlist;
    this.cmds_obs = this.cmd_dataSource.connect();
  }

  ngOnDestroy() {
    if (this.cmd_dataSource) {
      this.cmd_dataSource.disconnect();
    }
    if(this.alert_dataSource)
    {
      this.alert_dataSource.disconnect();
    }
}

  constructor(
          private navbarService:NavbarService,
          private notificationService:NotificationService,
          private changeDetectorRef: ChangeDetectorRef,
          public authService:AuthService,
          private windowService:WindowService,
          private othersService: OthersService,
  ) {
    this.navbarService.Title = "Notifications";
  }

  ngOnInit(): void {
    this.current_host = this.windowService.currenthost();
    this.getNotiAlertEvenets();
    this.getNotificationList();
    this.othersService.setTitle(this.navbarService.Title);
  }
  ngAfterViewInit() {
    this.alert_dataSource.paginator = this.paginatoralert;
    this.cmd_dataSource.paginator= this.paginatorcmdlist;
  }

  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();
  }





  // This function will call the API for GET method and It will display all the Notification list for a tenant.
  getNotificationList(){
    this.notificationService.getNotificationListS().subscribe(response =>{
      this.list_spinner = false;
      if(response["Unsucessfull"]){
          this.list_internalError = true;
      }else{
        this.notis = response['event_data'];
        this.commands_list = response['command_data'];
        // this.dataSource.data = this.notis;

        if(this.notis.length == 0){
          this.no_notis = true;
        }else{
          this.no_notis = false;
        }
        if(this.commands_list.length == 0){
          this.no_commands= true;
        }else{
          this.no_commands = false;          
          this.cmd_dataSource.data = this.commands_list;
          this.alert_dataSource.data = this.notis;

        }

      }
    }, error =>{
      this.list_internalError = true;
      this.list_spinner = false;
    })
  }


  // This function will display alerts count with on weekly basis for sparkline charts for tenant.
  getNotiAlertEvenets(){
    this.notificationService.getTenantAlertsCmdNotiS().subscribe(response =>{
      this.spinner = false;
      if( response == false){

      }else{
        // alerts
        this.totalAlerts(response['alert']['Total']);
        this.infoAlerts(response['alert']['info']);
        this.warningAlerts(response['alert']['warning']);
        this.criticalAlerts(response['alert']['critical']);
        // commands
        this.sCcommands(response['command']['scheduled']);
        this.oDcommands(response['command']['on_demand']);
        this.rBcommands(response['command']['rule_based']);
        this.totalcommands(response['command']['Total']);

      }
    }, error  =>{
      this.spinner = false;
    })
  }


// this method will update the message using message log id.
  Setresolution(){
    let data  = {}
      data['resolution_type'] = this.resolution_type.value;
      data['resolution'] = this.resolution.value;
      data['updated_by'] = this.authService.currentUser['email'];
      data['tenant_id'] = this.authService.currentUser['tenant_id'];
      this.notificationService.putNotificationS(this.message_id, data).subscribe(response =>{
        this.ngOnInit();
        this.resolution_type.reset();
        this.resolution.reset();
      });
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
       title: {
            text:  data_info['total'],
            margin: 30,
            offsetX: 0,
            floating: false,
            style: {
              fontSize: "20px",
            }
          },
       subtitle: {
            text: "Total",
            margin: 10,
            offsetX: 0,
            floating: false,
            style: {
              fontSize: "14px"
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
       title: {
            text: data_info['total'],
            margin: 30,
            offsetX: 0,
            floating: false,
            style: {
              fontSize: "20px",
            }
          },
       subtitle: {
            text: "Info",
            margin: 10,
            offsetX: 0,
            floating: false,
            style: {
              fontSize: "14px"
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
        title: {
            text: data_info['total'],
            margin: 30,
            offsetX: 0,
            floating: false,
            style: {
              fontSize: "20px",
            }
          },
        subtitle: {
            text: "Warning ",
            margin: 10,
            offsetX: 0,
            floating: false,
            style: {
              fontSize: "14px"
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
    title: {
          text: data_info['total'],
          margin: 30,
          offsetX: 0,
          floating: false,
          style: {
            fontSize: "20px",
          }
        },
    subtitle: {
          text: "Critical",
          margin: 10,
          offsetX: 0,
          floating: false,
          style: {
            fontSize: "14px"
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





// --------------------------------------------------------------------------------------------------------------------------------------
//  Command Charts .
// --------------------------------------------------------------------------------------------------------------------------------------

// Total Commands config starts here.-------------------------------------
public totalcommandOption:Partial<ChartOptions>;
// this function will display total coomands chart.
totalcommands(data_info:any){
  this.totalcommandOption = {
    series: [
      {
        name: "Total Commands",
        data: data_info['data']
      }
    ],
  colors: ["#0984e3"],
  title: {
        text: data_info['total'],
        margin: 30,
        offsetX: 0,
        floating: false,
        style: {
          fontSize: "20px",
        }
      },
  subtitle: {
        text: "Total",
        margin: 10,
        offsetX: 0,
        floating: false,
        style: {
          fontSize: "14px"
        }
      }
  };
}

public totalcommandsOptions: Partial<ChartOptions> = {
  chart: {
    id: "totalcommands",
    group: "commands",
    type: "area",
    height: 130,
    sparkline: {
      enabled: true
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
// Total Commands config ends here.-------------------------------------


// Rule based commands config starts here.-------------------------------------
public rBcommandOption:Partial<ChartOptions>;
// this function will display rule based commands chart.
rBcommands(data_info:any){
  this.rBcommandOption = {
    series: [
      {
        name: "Rule Based Commands",
        data: data_info['data']
      }
    ],
  colors: ["#74b9ff"],
  title: {
        text: data_info['total'],
        margin: 30,
        offsetX: 0,
        floating: false,
        style: {
          fontSize: "20px",
        }
      },
  subtitle: {
        text: "Rule Based",
        margin: 10,
        offsetX: 0,
        floating: false,
        style: {
          fontSize: "14px"
        }
      }
  };
}

public rBcommandsOptions: Partial<ChartOptions> = {
  chart: {
    id: "rBcommands",
    group: "commands",
    type: "area",
    height: 130,
    sparkline: {
      enabled: true
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
// Rule based Commands config ends here.-------------------------------------


// Schedule based commands config starts here.-------------------------------------
public sCcommandOption:Partial<ChartOptions>;
// this function will display Schedule based commands chart.
sCcommands(data_info:any){
  this.sCcommandOption = {
    series: [
      {
        name: "Scheduled Commands",
        data: data_info['data']
      }
    ],
  colors: ["#6c5ce7"],
  title: {
        text: data_info['total'],
        margin: 30,
        offsetX: 0,
        floating: false,
        style: {
          fontSize: "20px",
        }
      },
  subtitle: {
        text: "Scheduled",
        margin: 10,
        offsetX: 0,
        floating: false,
        style: {
          fontSize: "14px"
        }
      }
  };
}

public sCcommandsOptions: Partial<ChartOptions> = {
  chart: {
    id: "sCcommands",
    group: "commands",
    type: "area",
    height: 130,
    sparkline: {
      enabled: true
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
// Schedule based Commands config ends here.-------------------------------------


// On demand based commands config starts here.-------------------------------------
public oDcommandOption:Partial<ChartOptions>;
// this function will display On demand commands chart.
oDcommands(data_info:any){
  this.oDcommandOption = {
    series: [
      {
        name: "On Demand commands",
        data: data_info['data']
      }
    ],
  colors: ["#a29bfe"],
  title: {
        text: data_info['total'],
        margin: 30,
        offsetX: 0,
        floating: false,
        style: {
          fontSize: "20px",
        }
      },
  subtitle: {
        text: "On Demand",
        margin: 10,
        offsetX: 0,
        floating: false,
        style: {
          fontSize: "14px"
        }
      }
  };
}

public oDcommandsOptions: Partial<ChartOptions> = {
  chart: {
    id: "oDcommands",
    group: "commands",
    type: "area",
    height: 130,
    sparkline: {
      enabled: true
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
// On demandbased Commands config ends here.-------------------------------------

}
