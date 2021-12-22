import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, PipeTransform } from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { Observable } from 'rxjs';
import { NavbarService } from '../../navbar/_services/navbar.service';
import { AuthService } from '../../login/_services/auth.service';
import { CommandsService } from '../_services/commands.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';


@Component({
  selector: 'command',
  templateUrl: './command.component.html',
  styleUrls: ['./command.component.scss'],
  providers: [DecimalPipe]
})
export class CommandComponent implements OnInit {

  spinner:boolean = true;
  internalError:boolean = false;
  displaydata:boolean;
  commands:any = [];
  filter = new FormControl('');
  obs: Observable<any>;
  cmd_master:number;

  constructor(
        private navbarService:NavbarService,
        public authService: AuthService,
        private commandsService:CommandsService,
        private changeDetectorRef: ChangeDetectorRef,
        private router:Router,
        pipe: DecimalPipe
        ) {
          this.navbarService.Title = "Commands";
          this.obs = this.filter.valueChanges.pipe(
            startWith(''),
            map(text => this.search(text, pipe))
          );
        }

  ngOnInit(): void {
    this.getCommands();
  }
  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();
  }

  animation = 'pulse';
  displayedColumns: string[] = ['gateway_name', 'dev_eui', 'command_name', 'execution_mode' , 'Action'];
  dataSource = new MatTableDataSource(this.commands);
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
    this.dataSource.paginator = this.paginator;
    this.obs = this.dataSource.connect();
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
}

// This method will display the commands.
getCommands(){
  this.commandsService.getCommandsS().subscribe(response =>{
    this.spinner = false;
    if(response['Unsucessfull'] || response == null || response == false){
      this.spinner = false;
      this.internalError = true;
      this.displaydata = true;
    }else{
      this.commands = response;
      this.displaydata=false;
      if(this.commands.length == 0){
        this.displaydata = true;
      }
      this.dataSource.data = this.commands;
    }
  }, error =>{
    this.spinner = false;
    this.internalError = true;

  })
}

  // This method redirects to view command component page .
  redirectToviewCommand(data){
    localStorage.setItem("command_master_id",data.command_master_id);
    this.router.navigate(['/command/info']);
  }

  trackById(index, command){
    return command.command_master_id;
  }

  // this method for searching the table
search(text: string, pipe: PipeTransform) {
  return this.commands.filter(response => {
    const term = text.toLowerCase();
    return response.gateway_name.toLowerCase().includes(term)
        || pipe.transform(response.dev_eui).includes(term)
        || pipe.transform(response.command_name).includes(term)
        || pipe.transform(response.execution_mode).includes(term);

  });
}
}
