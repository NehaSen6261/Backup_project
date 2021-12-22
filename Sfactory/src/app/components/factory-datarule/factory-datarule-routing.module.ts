import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FactoryDataruleComponent } from './factory-datarule.component';

const routes: Routes = [
  {
    path: '',
    component: FactoryDataruleComponent
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
export class FactoryDataruleRoutingModule { }
