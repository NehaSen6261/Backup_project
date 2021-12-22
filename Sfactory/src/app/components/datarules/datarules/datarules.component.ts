import { Component, OnInit, ViewChild, ElementRef,ChangeDetectorRef, PipeTransform } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { NavbarService } from '../../navbar/_services/navbar.service';
import { DataruleService } from '../_service/datarule.service';
import { AuthService } from '../../login/_services/auth.service';
import { FormControl } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { map, startWith } from 'rxjs/operators';



@Component({
  selector: 'datarules',
  templateUrl: './datarules.component.html',
  styleUrls: ['./datarules.component.scss'],
  providers: [DecimalPipe]
})
export class DatarulesComponent implements OnInit {
  spinner:boolean = true;
  internalError:boolean = false;
  noDataRules: boolean = false;
  obs: Observable<any>;
  // filter:string;
  filter = new FormControl('');

  constructor(
          private navbarService: NavbarService,
          private dataruleService: DataruleService,
          public authService: AuthService,
          private router:Router,
          private changeDetectorRef: ChangeDetectorRef,
          pipe: DecimalPipe
  ) {
    this.navbarService.Title = "Data Rules";
    this.obs = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text, pipe))
    );
  }
  displayedColumns: string[] = ['gateway_name', 'inbound_data','data_rule','value','action' ,'Action'];
  private paginator: MatPaginator;
  private sort: any;

  dataRules: any=[];

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

dataSource = new MatTableDataSource(this.dataRules);


ngOnInit(): void {
  this.getDataRules();
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}

// This method will display the data rules for both Tenant and User
getDataRules(){
    this.dataruleService.getTUDrules().subscribe(response=>  {
      this.spinner=false;
      this.dataRules = response;
      if(this.dataRules.length == 0){
        this.noDataRules = true;
      }else{
        if(response == false )  {
          this.internalError=true;
        }else{
            this.dataSource.data= this.dataRules;
        }
      }

    }, error =>{
      this.spinner = false;
      this.internalError = true;
    }
    )

}

// This method will trigger on click of view icon and the page will rediect to view data rule.
redirectViewTenant(data:any){
localStorage.setItem("drule_id",data['drule_id']);
this.router.navigate(['/datarules/view'])
}

// this method for searching the table
search(text: string, pipe: PipeTransform) {
  return this.dataRules.filter(response => {
    const term = text.toLowerCase();
    return response.gateway_name.toLowerCase().includes(term)
        || pipe.transform(response.inbound_data).includes(term)
        || pipe.transform(response.data_rule).includes(term)
        || pipe.transform(response.value).includes(term);

  });
}

}
