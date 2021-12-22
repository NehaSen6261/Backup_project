import { Component, ElementRef, OnInit, ViewChild ,ChangeDetectorRef} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { AuthService } from '../login/_services/auth.service';
import { NavbarService } from '../navbar/_services/navbar.service';
import { WindowService } from '../others/window/_services/window.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {

  current_host:any;
  accountdetails:any=[];
  email:string;
  firstname:string;
  last_name:string;
  username:string;
  userprofile_id:number;
  constructor(private navbarService:NavbarService,
    private changeDetectorRef: ChangeDetectorRef,
    private windowService:WindowService,
    public authService: AuthService,) {

    this.navbarService.Title = "Account Information";
   }

   obs: Observable<any>;
   displayedColumns: string[] = ['sf_asset_code', 'sf_asset_serial_number', 'sf_asset_brand', 'sf_asset_model',
                                                    'sf_plant_name', 'sf_work_centre_name'];
   dataSource = new MatTableDataSource();
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
  ngOnInit(): void {
    this.current_host = this.windowService.currenthost();

    this.accountdetails = this.authService.currentUser
    this.email=this.accountdetails['email']
    this.firstname = this.accountdetails['first_name']
    this.last_name = this.accountdetails['last_name']
    this.username = this.accountdetails['username']
    this.userprofile_id = this.accountdetails['user_profile_id']

  }

}
