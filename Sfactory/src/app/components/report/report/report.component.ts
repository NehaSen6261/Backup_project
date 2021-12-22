import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../login/_services/auth.service';
import { OthersService } from '../../others/_services/others.service';
import { NavbarService } from '../../navbar/_services/navbar.service';
import { AssetService } from '../../assets/_services/asset.service';
import { SnackbarComponent } from '../../others/snackbar/snackbar.component';
import { AssetAnalysisComponent } from '../../assets/asset-analysis/asset-analysis.component';
import { ReportService } from '../services/report.service'

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  @ViewChild(AssetAnalysisComponent) assest: AssetAnalysisComponent
  popup_title: string;

  obs: Observable<any>;
  OEEDatatable: any = [];
  spinner: boolean = true;
  internalError: boolean = false;
  displaydata: boolean;
  record: boolean;
  max_date:any;
  error_status= "Error";
  public stratdate:any;
  public enddate:any;
  public start_date:any;
  public end_date:any;
  public loaddata = false

  //form control name
  assets = new FormControl('');
  filter = new FormControl('');
  metrics = new FormControl('');
  browser_timezone: string;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  
  // this function will disable the date's greater then the current date in date picker
  unavailableDays(calendarDate: Date): boolean {
    return calendarDate < new Date();
  }

  dataSource = new MatTableDataSource(this.OEEDatatable);
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
    private reportservice:ReportService,
    private changeDetectorRef: ChangeDetectorRef,
    private snackBar: SnackbarComponent,
    public datepipe: DatePipe,
    public assetService: AssetService,
    private othersService: OthersService,
    private routelocationInfo: Location
  ) {
    this.navbarService.Title = "Reports";
    this.othersService.setTitle(this.navbarService.Title);
  }

  ngOnInit(): void {
     this.stratdate = this.range.controls['start'];
     this.enddate = this.range.controls['end'];
     this.max_date = new Date(new Date().setDate(new Date().getDate() - 1));
     this.selected_asset_info = localStorage.getItem('selected_asset');
      this.browser_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      this.getAssets();
      
  }
 
 // This method will take to the previous route.
  backloc(){
    this.routelocationInfo.back();
  }

  // This method will display the all the Report data
  Datalog:string;
  metricvalue:any;
  submit:boolean=false;
  getPfReportTables() {
    this.start_date = this.datepipe.transform(this.range.value['start'], 'yyyy-MM-dd');
    this.end_date = this.datepipe.transform(this.range.value['end'], 'yyyy-MM-dd');
    if (this.end_date == null) {
        this.snackBar.top_snackbar("Please Select  End Date!!",this.error_status)      
    }
    else if(this.assets.invalid){
      this.snackBar.top_snackbar("Please Choose an Asset!!",this.error_status)      
    }
    else if(this.metrics.invalid){
      this.snackBar.top_snackbar("Please Choose Metrics Type!!",this.error_status)      
    }
    else if (this.end_date != null) {    
    this.assets.value;
    this.metrics.value;
    this.metricvalue=this.metrics.value;
    this.displaydata = false;
    this.spinner = true;
    this.internalError = false;
    this.Datalog = 'Raw';
    this.reportservice.getreports(this.start_date, this.end_date, this.assets.value, this.metrics.value,this.Datalog).subscribe(response => {
     this.loaddata = false;
      if (response['Unsuccessful']) {
        this.internalError = true;
        this.spinner = false;
        this.loaddata = false;
      }
      else {
        this.OEEDatatable = response;
        if (this.OEEDatatable.length == 0  ) {
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
        this.dataSource.data = this.OEEDatatable;
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
      }
      if (this.assetList.length == 0 || this.assetList == null) {
        this.displayAsset = false;
        this.internalError =false
       this.displaydata= false
       this.loaddata= false
      }
    },(error) => {        
       if(error.status == 0) {
         this.displaydata = false
        this.assetInternalError = true;
        this.is_asset_loaded = false;
       }
      }
    );

  }

  metricsList: any = [
    {value: 'OEE', viewValue: 'Overall Equipment Effectiveness'},
    {value: 'Production_performance', viewValue: 'Production Performance'},
  ]

  setAssetanalysis(data:any){
    localStorage.setItem('selected_asset', data);
    this.ngOnInit();
  }

  // export option config.
// This method will allow the user to download data in CSV format.
saveAsFile(monthlydimcsvdata){
  this.writeContents(monthlydimcsvdata, 'Reports'+'.csv', 'text/plain');
}
writeContents(content, fileName, contentType) {
  var csvdata = document.createElement('a');
  var file = new Blob([content], {type: contentType});
  csvdata.href = URL.createObjectURL(file);
  csvdata.download = fileName;
  csvdata.click();
}

DatalogsCSV:any =[];
getDatalogsCSVInfo( start_date:any, end_date:any, assets:any,metrics:any,Datalog:any){
  this.reportservice.getreports(start_date, end_date, this.assets.value, this.metrics.value,Datalog).subscribe(response =>{
   this.DatalogsCSV = response;
   this.saveAsFile(this.DatalogsCSV)
 });
}


//  This method will triger on click of  export as CSV button.
export_CSV(){
  this.Datalog = 'CSV';
   this.getDatalogsCSVInfo(this.start_date, this.end_date, this.assets.value, this.metrics.value, this.Datalog);
  }

}
