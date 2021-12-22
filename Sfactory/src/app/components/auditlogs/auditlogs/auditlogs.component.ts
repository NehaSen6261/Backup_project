import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  PipeTransform,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { NavbarService } from '../../navbar/_services/navbar.service';
import { AuthService } from '../../login/_services/auth.service';
import { AuditlogService } from '../_services/auditlog.service';
import { map, startWith } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { OthersService } from '../../others/_services/others.service';



@Component({
  selector: 'auditlogs',
  templateUrl: './auditlogs.component.html',
  styleUrls: ['./auditlogs.component.scss'],
  providers: [DecimalPipe],
})
export class AuditlogsComponent implements OnInit {
  currentlyOpenedItemIndex = -1;
  spinner: boolean = true;
  internalError: boolean = false;
  displaydata: boolean = false;
  obs: Observable<any>;
  auditlogs: any = [];
  filter = new FormControl('');
  plant_name: string;
  wc_name: string;
  asset_name: string;
  app_name: string;
  device_name: string;
  eui_id: string;
  event_type: string;
  event_desc: string;
  event_src: string;
  event_trig: string;

  constructor(
    private navbarService: NavbarService,
    public authService: AuthService,
    private auditlogsService: AuditlogService,
    private changeDetectorRef: ChangeDetectorRef,
    pipe: DecimalPipe,
    private othersService: OthersService,
  ) {
    this.navbarService.Title = 'Activity logs';
    this.othersService.setTitle(this.navbarService.Title);
 
  }

  ngOnInit(): void {
    this.getAuditlogs();
  }

  displayedColumns: string[] = [
    'sf_event_type',
    'sf_event_description',
    'sf_source_name',
    'sf_event_time',
  ];
  dataSource = new MatTableDataSource(this.auditlogs);
  @ViewChild(MatPaginator) paginator: MatPaginator;
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
    this.changeDetectorRef.detectChanges();
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

  getAuditlogs() {
    this.auditlogsService.getAuditlogsS().subscribe(
      (response) => {
        this.spinner = false;
        if (response['Unsucessfull'] || response == null) {
          this.spinner = false;
          this.internalError = true;
        } else {
          this.auditlogs = response;
          if (this.auditlogs.length == 0) {
            this.displaydata = true;
          }

          this.dataSource.data = this.auditlogs;
        }
      },
      (error) => {
        this.spinner = false;
        this.internalError = true;
      }
    );
  }

  trackById(index, eventaudit) {
    return eventaudit.sf_event_audit_id;
  }

  // This method will trigger on click of any row in the table.
  auditinfo(data) {
    this.plant_name = data['sf_plant_name'];
    this.wc_name = data['sf_work_centre_name'];
    this.asset_name = data['sf_asset_code'];
    this.app_name = data['fw_application_name'];
    this.device_name = data['sf_device_name'];
    this.eui_id = data['sf_event_audit_id'];
    this.event_type = data['sf_event_type'];
    this.event_desc = data['sf_event_description'];
    this.event_src = data['sf_source_name'];
    this.event_trig = data['sf_event_time'];
  }

  // this method for searching the table
  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //this method is used to change more or less
  setOpened(itemIndex) {
    this.currentlyOpenedItemIndex = itemIndex;
  }

  setClosed(itemIndex) {
    if(this.currentlyOpenedItemIndex === itemIndex) {
      this.currentlyOpenedItemIndex = -1;
    }
  }
}
