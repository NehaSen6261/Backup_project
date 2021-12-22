import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FactoryCustomersComponent } from './factory-customers.component';

const routes: Routes = [
  {
    path: '',
    component: FactoryCustomersComponent
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
export class FactoryCustomersRoutingModule { }
