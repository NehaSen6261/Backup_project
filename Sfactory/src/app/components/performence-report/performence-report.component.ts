import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../login/_services/auth.service';
import { OthersService } from '../others/_services/others.service';
import { NavbarService } from '../navbar/_services/navbar.service';
import { AssetService } from '../assets/_services/asset.service';
import { PerformenceReportService } from './_services/performence-report.service'
import { SnackbarComponent } from '../others/snackbar/snackbar.component';
import { AssetAnalysisComponent } from '../assets/asset-analysis/asset-analysis.component';



@Component({
  selector: 'performence-report',
  templateUrl: './performence-report.component.html',
  styleUrls: ['./performence-report.component.scss'],
  providers: [DecimalPipe]
})
export class PerformenceReportComponent implements OnInit {

  @ViewChild(AssetAnalysisComponent) assest: AssetAnalysisComponent
  popup_title: string;

  obs: Observable<any>;
  PfTabledata: any = [];
  spinner: boolean = true;
  internalError: boolean = false;
  displaydata: boolean;
  record: boolean
  error_status= "Error";

  public res_plant:any;
  public payload_value:any;
  public sf_work_centre_name:any;
  public sf_asset_name:any;
  public sf_asset_code:any;
  public created_by_date:any;
  public asset_state:any;
  public plant_name:any;
  public plant_idfactory:any;
  public assest_payload:any;
  public stratdate:any;
  public enddate:any;
  public start_date:any;
  public end_date:any;
  public loaddata = false
  public assetKey:any;
  public assetValue:any;
  public assetpayloadvalue:any;
  public table_assetPayload:any;
  //form control name
  sf_asset_payload = new FormControl('');
  assets = new FormControl('');
  filter = new FormControl('');
  browser_timezone: string;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });


  // this function will disable the date's greater then the current date in date picker
  unavailableDays(calendarDate: Date): boolean {
    return calendarDate < new Date();
  }


  displayedColumns: string[] = ['sf_plant_name', 'sf_work_centre_name', 'sf_asset_name', 'created_by_date', 'sf_project_code', 'action'];
  dataSource = new MatTableDataSource(this.PfTabledata);
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

  constructor(
    private navbarService: NavbarService,
    public authService: AuthService,
    private performenceReportService: PerformenceReportService,
    private changeDetectorRef: ChangeDetectorRef,
    private snackBar: SnackbarComponent,
    public datepipe: DatePipe,
    public assetService: AssetService,
    private othersService: OthersService,
    private routelocationInfo: Location
  ) {
    this.navbarService.Title = "Data Explorer";
    this.othersService.setTitle(this.navbarService.Title);
  }

  ngOnInit(): void {
     this.stratdate = this.range.controls['start'].setValue(new Date(new Date().setDate(new Date().getDate() - 30)))
     this.enddate = this.range.controls['end'].setValue(new Date())
     this.selected_asset_info = localStorage.getItem('selected_asset');
      this.browser_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      this.getAssets();
      
  }
 
 // This method will take to the previous route.
  backloc(){
    this.routelocationInfo.back();
  }

  // This method will display the all the factory data stream data
  getPfReportTables() {
    this.start_date = this.datepipe.transform(this.range.value['start'], 'yyyy-MM-dd');
    this.end_date = this.datepipe.transform(this.range.value['end'], 'yyyy-MM-dd');
    if (this.end_date == null) {
        this.snackBar.top_snackbar("Please Select End Date!!",this.error_status)      
    }else if (this.end_date != null) {    
    this.assets.value
    this.displaydata = false;
    this.spinner = true;
    this.internalError = false;
    this.performenceReportService.getPfReportTable(this.start_date, this.end_date, this.assets.value, this.browser_timezone).subscribe(response => {
     this.loaddata = false;
      if (response['Unsuccessful']) {
        this.internalError = true;
        this.spinner = false;
        this.loaddata = false;
      }
      else {
        this.PfTabledata = response;
        if (this.PfTabledata.length == 0  ) {
          this.spinner = false
          this.displaydata = true
          this.internalError = false;
          this.loaddata = false;
          this.record = false
        } else {
          this.displaydata = false;
          this.spinner = false;
          this.internalError = false;
          this.loaddata = false;
          this.record = false
        }
        this.dataSource.data = this.PfTabledata;
      }
    },
     error => {      
      this.internalError = true;
      this.loaddata = false;
      this.spinner = false;
    });
  }
  }

  // this method for searching the table
  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // This method will display the all the data on Pop-form
  pFInfo(PfInfo: any) {
    this.assest_payload = PfInfo['sf_asset_payload']
    this.payload_value = JSON.stringify(this.assest_payload)
    this.assetpayloadvalue= Object.keys(this.assest_payload).map(key => {
    return this.assest_payload[key];})
    let assetQTY= Object.keys(this.assest_payload)
    let assetQTYValue = Object.values(this.assest_payload)
    this.assetKey = assetQTY[0];
    this.assetValue = assetQTYValue[0]
    this.sf_work_centre_name = PfInfo['sf_work_centre_name']
    this.sf_asset_name = PfInfo['sf_asset_name']
    this.sf_asset_code = PfInfo['sf_asset_code']
    this.created_by_date = PfInfo['created_by_date']
    this.asset_state = PfInfo['sf_project_code']
    this.plant_name = PfInfo['sf_plant_name']
    this.sf_asset_payload.disable()

  }

  //assest
  is_asset_loaded: boolean;
  displayAsset: boolean = true;
  assetInternalError: boolean = false;
  assetList: any = [];
  assestdata : boolean = false;
  // this method will display the assets.
 
  selected_asset_info: any;
  getAssets() {
    this.selected_asset_info = localStorage.getItem('selected_asset');
    this.is_asset_loaded = true;
    this.spinner = false;
    this.assetService.getAssetslistS().subscribe(response => {
      this.is_asset_loaded = false;
      if (response['Unsuccessful']  ) {
        this.assetInternalError = true;
        this.is_asset_loaded=false
        this.spinner = false;
      }
     else if (response == false ){
      this.assestdata = true;
      this.displayAsset = false;
      this.internalError = false;
     }
      else {
        this.assetList = response;
        localStorage.setItem('selected_asset', this.assetList[0]['sf_asset_id']);
        if (this.selected_asset_info) {
          this.assets.setValue(Number(this.selected_asset_info));
        }else{
          this.assets.setValue(this.assetList[0]['sf_asset_id']);
          this.selected_asset_info = this.assetList[0]['sf_asset_id'];
        }
      }
      if (this.assetList.length == 0 || this.assetList == null) {
        this.displayAsset = false;
        this.internalError =false
       this.displaydata= false
       this.loaddata= false
      }
      this.getPfReportTables();
    },(error) => {        
       if(error.status == 0) {
         this.displaydata = false
        this.assetInternalError = true;
        this.is_asset_loaded = false;
       }
      }
    );

  }

  setAssetanalysis(data:any){
    localStorage.setItem('selected_asset', data);
    this.ngOnInit();
  }

  // export option config.
// This method will allow the user to download data in CSV format.
saveAsFile(monthlydimcsvdata){
  this.writeContents(monthlydimcsvdata, 'DataExplorer'+'.csv', 'text/plain');
}
writeContents(content, fileName, contentType) {
  var csvdata = document.createElement('a');
  var file = new Blob([content], {type: contentType});
  csvdata.href = URL.createObjectURL(file);
  csvdata.download = fileName;
  csvdata.click();
}

DatalogsCSV:any =[];
getDatalogsCSVInfo( start_date:any, end_date:any, assets:any,browser_timezone:string){
  this.performenceReportService.getAssetDatalogsCSVS(start_date, end_date, assets, browser_timezone).subscribe(response =>{
   this.DatalogsCSV = response;
   this.saveAsFile(this.DatalogsCSV)
 });
}


//  This method will triger on click of  export as CSV button.
export_CSV(){
   this.getDatalogsCSVInfo(this.start_date, this.end_date, this.assets.value, this.browser_timezone);
  }




}
