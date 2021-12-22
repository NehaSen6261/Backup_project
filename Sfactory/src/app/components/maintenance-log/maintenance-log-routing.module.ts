import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaintenanceLogComponent } from './maintenance-log.component';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceLogComponent
  }
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)   
  ],
  exports:[RouterModule]
})
export class MaintenanceLogRoutingModule { }
