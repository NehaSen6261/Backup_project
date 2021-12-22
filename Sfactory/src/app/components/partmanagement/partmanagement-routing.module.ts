import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PartmanagementComponent } from './partmanagement.component';

const routes: Routes = [
  {
    path: '',
    component: PartmanagementComponent
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
export class PartmanagementRoutingModule { }
