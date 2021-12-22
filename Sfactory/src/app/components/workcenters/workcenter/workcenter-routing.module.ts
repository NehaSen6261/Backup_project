import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { WorkcenterComponent } from './workcenter.component';

const routes: Routes = [
  {
    path: '',
    component: WorkcenterComponent
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
export class WorkcenterRoutingModule { }
