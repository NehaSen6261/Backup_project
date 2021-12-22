import { Component, OnInit, ViewChild } from '@angular/core';
import { interval  } from 'rxjs';
import { NavbarService } from '../navbar/_services/navbar.service';
import { AuthService } from '../login/_services/auth.service';
import { FactoryCtrlpanelService } from './_services/factory-ctrlpanel.service';
import { FormControl, Validators } from '@angular/forms';
import { PlantService } from '../plants/_services/plant.service';
import { WorkcenterService } from '../workcenters/_services/workcenter.service';
import { AssetService } from '../assets/_services/asset.service';
import { SnackbarComponent } from '../others/snackbar/snackbar.component';
import { OthersService } from '../others/_services/others.service';
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexLegend,
  ApexResponsive,
  ChartComponent
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive | ApexResponsive[];
};

@Component({
  selector: 'factory-controlpanel',
  templateUrl: './factory-controlpanel.component.html',
  styleUrls: ['./factory-controlpanel.component.scss']
})
export class FactoryControlpanelComponent implements OnInit {

  savebtndisabled:boolean = false;
  workcenter_internalError:boolean;
  no_workcenter:boolean;
  plant_workcenters:any=[];
  plants:any = [];
  assets_list:any=[];
  no_plants:boolean;
  assets_internalError:boolean;
  no_assets:boolean;
  plants_internalError:boolean;
  is_screen_expanded:boolean = false;
  plant = new FormControl('', [Validators.required]);
  work_center= new FormControl('', [Validators.required]);
  sf_asset_id= new FormControl('', [Validators.required]);
  browser_timezone:string;
  factoryCntrlPanel:any=[]
  no_asset_cntrl_panel:boolean;
  asset_cntrl_panel_error:boolean;
  asset_cntrl_panel_spinner:boolean = true;
  factory_panel_id:any;
  assetname:string;
  error_status= "Error";

  constructor(
    private navbarService:NavbarService,
    public authService: AuthService,
    private fCtrlpanelService: FactoryCtrlpanelService,
    private plantService:PlantService,
    private workcenterService:WorkcenterService,
    private assetService: AssetService,
    private snackbar: SnackbarComponent,
    private othersService: OthersService
  ) {
    this.navbarService.Title = "Control Room";
    this.othersService.setTitle(this.navbarService.Title);
  }

  // Charts config
@ViewChild("chart") chart: ChartComponent;
public chartOptions: Partial<ChartOptions>;

  ngOnInit(): void {
    this.browser_timezone= Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.getPlants();
    this.controlPanelAnalysis();
    interval(60000).subscribe((val) => {
      this.controlPanelAnalysis();
        this.controlPanelAnalysis();
    });
    this.getthefactorycntrlPanle();
  }

    // error messages
    PlantErrorMessages() {
      if (this.plant.hasError('required')) {
        return 'You must choose a value';
      }
    }
    WorkcentersErrorMessages() {
      if (this.work_center.hasError('required')) {
        return 'You must choose a value';
      }
    }
    AsstesErrorMessages() {
      if (this.sf_asset_id.hasError('required')) {
        return 'You must choose a value';
      }
    }

   // This method will display the plants.
 getPlants(){
  this.plantService.getplantlistS().subscribe(response =>{
    if(response['Unsuccessful']){
        this.plants_internalError = true;
    }else{
      this.plants = response;
      if(this.plants.length == 0){
        this.no_plants = true;
      }else{
        this.no_plants = false;
      }
    }
  }, error =>{
    this.plants_internalError = true;
  })
}

// This method will display the all the plant work centers.
getplantWorkcenters(plant_id){
  this.workcenterService.getPlantWorkcentersListS(plant_id).subscribe(response =>{
    if(response['Unsuccessful']){
      this.workcenter_internalError = true;
    }else{
      this.plant_workcenters = response;
      if(this.plant_workcenters.length == 0){
        this.no_workcenter = true;
      }else{
        this.no_workcenter = false;
      }
    }
  }, error=>{
    this.workcenter_internalError = true;
  })
}

// This method will display the all the assets.
getAssets(workcenter_id){
  this.assetService.getWorkcenterAssetsListS(workcenter_id).subscribe(response =>{
    if(response['Unsuccessful']){
      this.assets_internalError = true;
    }else{
      this.assets_list = response;
      if(this.assets_list.length == 0){
        this.no_assets = true;
      }else{
        this.no_assets = false;
      }
    }
  }, error=>{
    this.assets_internalError = true;
  })
}

// this method  will display the control panel items.
  no_analysis_available:boolean;
  getthefactorycntrlPanle(){
    this.fCtrlpanelService.getTenantFactoryCntrlPanelS(this.browser_timezone).subscribe(response=>{
      this.asset_cntrl_panel_spinner = false;
      if(response){
        this.factoryCntrlPanel = response;
        this.no_analysis_available = false;
        if(this.factoryCntrlPanel.length == 0){
          this.no_asset_cntrl_panel = true;
          }else{
            this.no_asset_cntrl_panel = false;
          }
      }else{
        this.no_analysis_available = true;
      }
    }, error =>{
      this.asset_cntrl_panel_spinner = false;
      this.asset_cntrl_panel_error = true;
    })
  }

  cleardata(){
    this.plant.reset();
    this.work_center.reset();
    this.sf_asset_id.reset();
    this.savebtndisabled = false;
    this.plant_workcenters.length=0;
    this.assets_list.length=0;
    }


  public disabled_enable_button : boolean;
  post_asset_Ctrlpanel(){
    if(this.plant.hasError('required') || this.work_center.hasError('required')|| this.sf_asset_id.hasError('required')||
    this.plant.status == "INVALID" ||   this.work_center.status == "INVALID" ||  this.sf_asset_id.status == "INVALID"){
        this.snackbar.top_snackbar("Enter all required Fields !!",this.error_status)
       }
     else{
      let add_data: any = {}
      add_data['fw_tenant_id'] = this.authService.currentUser['tenant_id'];
      add_data['created_by'] = this.authService.currentUser['email'];
      add_data['sf_plant_id'] = this.plant.value;
      add_data['sf_work_centre_id']= this.work_center.value;
      add_data['sf_asset_id'] = this.sf_asset_id.value;
      add_data['sf_subtenant_id'] = null;
      this.disabled_enable_button = true; 
      this.fCtrlpanelService.postAssetCntrlPanelS(add_data).subscribe(response =>{
        if (this.fCtrlpanelService.response_status == "Unsuccessful" ) { 
          this.disabled_enable_button = false;   
        }
        else if (this.fCtrlpanelService.response_status == "Successful" ) { 
          this.disabled_enable_button = false;   
          this.ngOnInit();
          this.cleardata();
        }         
      });
    }
  }

  // This method will expand the screen.
openFullscreen(){
  this.is_screen_expanded = true;​​​​​​​​
  let elem :any = document.getElementById("expanScreen");
  if (elem.requestFullscreen || elem.webkitRequestFullscreen) {​​​​​​​​
  elem.requestFullscreen();
  }​​​​​​​​
}​​​​​​​​

// this method will get the selected asset cntrl panel asset details.
get_asset_cntrl_panel_details(data){
  this.factory_panel_id = data['sf_factory_control_panel_id'];
  this.assetname = data['asset_name']
  }


// This method is used to delete the asset control  panel.
deleteAsset_cntrl_panel(){
  this.fCtrlpanelService.deleteAssetCtrlpanelS(this.factory_panel_id).subscribe(response=>{
    this.othersService.reloadCurrentRoute();
  })
}



// This method will plot the radial chart.
controlPanelAnalysis(){
  this.chartOptions = {
    chart: {
      height: 300,
      width:'100%',
      type: "radialBar"
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: "30%",
          background: "transparent",
          image: undefined
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            show: false
          }
        }
      }
    },
    colors: ["#00E396", "#008FFB", "#2B908F", "#FF9800"],
    labels: this.factoryCntrlPanel['labels'],
    legend: {
        show: true,
        floating: true,
        fontSize: "12px",
        position: "left",
        offsetX: 30,
        offsetY: 5,
      labels: {
        useSeriesColors: true
      },
      formatter: function(seriesName, opts) {
        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
      },
      itemMargin: {
        horizontal: 1
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            show: false
          }
        }
      }
    ]
  };
}


}
