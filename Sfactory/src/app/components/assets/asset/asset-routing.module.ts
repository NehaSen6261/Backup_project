import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetComponent} from './asset.component'
import { Routes, RouterModule } from '@angular/router';
import {AssetAnalysisComponent} from '../asset-analysis/asset-analysis.component'
const routes: Routes = [
  {
    path: '',
    component: AssetComponent
  },
  {
    path: '',
    component: AssetAnalysisComponent
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
export class AssetRoutingModule { }
