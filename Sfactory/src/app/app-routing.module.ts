
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AnalysisComponent } from './components/analysis/analysis/analysis.component';
import { AnalysisDetailedViewComponent } from './components/analysis/analysis-detailed-view/analysis-detailed-view.component';
import { DataExplorerComponent } from './components/data-explorer/data-explorer.component';
import { DevicesComponent } from './components/devices/devices.component';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { SpinnerComponent } from './components/others/spinner/spinner.component';
import { AuthGaurd } from './components/login/_services/auth-gaurd.service';
import { AdminGuard } from './components/login/_services/admin.guard';
import { ViewerGuard } from './components/login/_services/viewer.guard'
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { SnackbarComponent } from './components/others/snackbar/snackbar.component';
import { SubtenantComponent } from './components/subtenant/subtenant/subtenant.component';
import { UsersComponent } from './components/users/users/users.component';
import { DatarulesComponent } from './components/datarules/datarules/datarules.component';
import { AddDataruleComponent } from './components/datarules/add-datarule/add-datarule.component';
import { ViewDataruleComponent } from './components/datarules/view-datarule/view-datarule.component';
import { ControlpanelComponent } from './components/controlpanel/controlpanel/controlpanel.component';
import { UnauthorizedAccessComponent } from './components/others/unauthorized-access/unauthorized-access.component';
import { PagenotfoundComponent } from './components/others/pagenotfound/pagenotfound.component';
import { TenantAdminAuthGaurd } from './components/login/_services/admin-auth-gaurd.service';
import { TenantAdnVwrAuthGaurdService  } from './components/login/_services/tenant-adn-vwr-auth-gaurd.service';
import { SubtenantAdmAuthGaurdService } from './components/login/_services/subtenant-adm-auth-gaurd.service';
import { NotificationComponent } from './components/notifications/notification/notification.component';
import { SettingsComponent } from './components/settings/settings/settings.component';
import { PlantComponent } from './components/plants/plant/plant.component';
import { WorkcenterComponent } from './components/workcenters/workcenter/workcenter.component';
import { AssetComponent } from './components/assets/asset/asset.component';
import { MapperComponent } from './components/mapper/mapper/mapper.component';
import { CommandComponent } from './components/commands/command/command.component';
import { AddCommandComponent } from './components/commands/add-command/add-command.component';
import { EditCommandComponent } from './components/commands/edit-command/edit-command.component';
import { AuditlogsComponent } from './components/auditlogs/auditlogs/auditlogs.component';
import { ProjectComponent } from './components/projects/project/project.component';
import { AccountInfoComponent } from './components/account-info/account-info.component';
import { NotificationSidebarComponent } from './components/navbar/notification-sidebar/notification-sidebar.component';
import { AssetAnalysisComponent } from './components/assets/asset-analysis/asset-analysis.component';
import { RegistrationComponent } from './components/registration/registration/registration.component';
import { PerformenceReportComponent } from './components/performence-report/performence-report.component';
import { FactoryControlpanelComponent } from './components/factory-controlpanel/factory-controlpanel.component';
import { FactoryCustomersComponent } from './components/factory-customers/factory-customers.component';
import { WorkordersComponent } from './components/workorders/workorders.component';
import { MaintenanceLogComponent } from './components/maintenance-log/maintenance-log.component';
import { FactoryDataruleComponent } from './components/factory-datarule/factory-datarule.component';
import { AssetNotisComponent } from './components/asset-notis/asset-notis.component';
import { AccountActivationComponent} from './components/account-activation/account-activation.component';
import { ControlroomGuard } from './components/login/_services/controlroom.guard'
import { PartmanagementComponent } from './components/partmanagement/partmanagement.component';
import { ControllerComponent } from './components/controller/controller.component';
import { MainLeftContentComponent } from './components/others/main-left-content/main-left-content.component';
import {JoboperatorguardGuard} from './components/login/_services/joboperatorguard.guard'
import {OperatorsgGuard} from './components/login/_services/operatorsg.guard';
import { PlantdashboardGuard } from './components/login/_services/plantdashboard.guard';
import { DashboardGuard } from './components/login/_services/dashboard.guard'
import { PlantdashboardComponent} from './components/plantdashboard/plantdashboard.component';
import { VerifyAccountComponent } from './components/verify-account/verify-account.component';
import { ReportComponent } from './components/report/report/report.component'

const routes: Routes = [
  { path: '', component: LoginComponent }, 
  { path: 'register', component: RegistrationComponent }, 
  { path: 'forgotpassword', component: ForgotpasswordComponent }, 
  { path: 'verifyacccount', component:VerifyAccountComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGaurd,OperatorsgGuard,DashboardGuard] }, 
  { path: 'plantdashboard', component: PlantdashboardComponent, canActivate: [AuthGaurd,OperatorsgGuard,PlantdashboardGuard] }, 
  { path: 'devices', component: DevicesComponent, canActivate: [AuthGaurd,OperatorsgGuard] },
  { path: 'userprofile', component: UserprofileComponent, canActivate: [AuthGaurd] }, 
  { path: 'controlroom', component: FactoryControlpanelComponent, canActivate: [AuthGaurd,ControlroomGuard,OperatorsgGuard] }, 
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGaurd,OperatorsgGuard] }, 
  { path: 'plant', loadChildren: () => import('./components/plants/plant/plant.module').then(m => m.PlantModule), canActivate: [AuthGaurd,OperatorsgGuard]}, 
  { path: 'workcenter',  loadChildren: () => import('./components/workcenters/workcenter/workcenter.module').then(m => m.WorkcenterModule), canActivate: [AuthGaurd, OperatorsgGuard] }, 
  { path: 'asset', loadChildren: () => import('./components/assets/asset/asset.module').then(m => m.AssetModule), canActivate: [AuthGaurd, OperatorsgGuard] }, 
  { path: 'devicedeployment', component: MapperComponent, canActivate: [AuthGaurd,OperatorsgGuard] }, 
  { path: 'activitylogs', component: AuditlogsComponent, canActivate: [AuthGaurd,OperatorsgGuard] }, 
  { path: 'jobs', loadChildren: () => import('./components/projects/project/projects.module').then(m => m.ProjectsModule), canActivate: [AuthGaurd] }, 
  { path: 'guest', component: SubtenantComponent, canActivate: [AuthGaurd, TenantAdnVwrAuthGaurdService] }, 
  { path: 'accountinfo', component: AccountInfoComponent, canActivate: [AuthGaurd] }, 
  { path: 'users', component: UsersComponent, canActivate: [AuthGaurd,OperatorsgGuard] }, 
  { path: 'asset/metrics', component: AssetAnalysisComponent, canActivate: [AuthGaurd] }, 
  { path: 'device/trends', component: AnalysisComponent, canActivate: [AuthGaurd,OperatorsgGuard] }, 
  { path: 'device/trends/view', component: AnalysisDetailedViewComponent, canActivate: [AuthGaurd,OperatorsgGuard] }, 
  { path: 'dataexplorer', component: PerformenceReportComponent, canActivate: [AuthGaurd,OperatorsgGuard] }, 
  { path: 'customer', loadChildren: () => import('./components/factory-customers/factory-customers.module').then(m => m.FactoryCustomersModule), canActivate: [AuthGaurd,OperatorsgGuard] }, 
  { path: 'workorders',  loadChildren: () => import('./components/workorders/workorders.module').then(m => m.WorkordersModule), canActivate: [AuthGaurd,OperatorsgGuard] }, 
  { path: 'maintenancelog' , loadChildren: () => import('./components/maintenance-log/maintenance-log.module').then(m => m.MaintenanceLogModule), canActivate: [AuthGaurd]},
  { path: 'rules' ,loadChildren: () => import('./components/factory-datarule/factory-datarule.module').then(m => m.FactoryDataruleModule), canActivate: [AuthGaurd,OperatorsgGuard]}, 
  { path: 'notification' , component:AssetNotisComponent, canActivate: [AuthGaurd,OperatorsgGuard]},
  { path: 'parts' ,loadChildren: () => import('./components/partmanagement/partmanagement.module').then(m => m.PartmanagementModule), canActivate: [AuthGaurd]}, 
  { path: 'activation', component:AccountActivationComponent}, 
  { path: 'controls', component:ControllerComponent, canActivate: [AuthGaurd,JoboperatorguardGuard] }, 
  { path: 'reports', component:ReportComponent, canActivate: [AuthGaurd] },
  { 
   path: 'command', 
    children: [ 
      { path: '', component: CommandComponent, canActivate: [AuthGaurd] }, 
      { path: 'create', component: AddCommandComponent, canActivate: [AdminGuard] }, 
      { path: 'info', component: EditCommandComponent ,canActivate: [ViewerGuard] } 
    ] 
  }, 
  { path: 'unauthorized', component: UnauthorizedAccessComponent } 
]


@NgModule({
  imports : [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})


export class AppRoutingModule { }

export const routingComponents = [
  LoginComponent,
  RegistrationComponent,
  ForgotpasswordComponent,
  SidebarComponent,
  NavbarComponent,
  DashboardComponent,
  PlantdashboardComponent,
  AnalysisComponent,
  AnalysisDetailedViewComponent,
  DataExplorerComponent,
  DevicesComponent,
  UserprofileComponent,
  SpinnerComponent,
  SnackbarComponent,
  SubtenantComponent,
  UsersComponent,
  DatarulesComponent,
  AddDataruleComponent,
  ViewDataruleComponent,
  ControlpanelComponent,
  NotificationComponent,
  SettingsComponent,
  PlantComponent,
  WorkcenterComponent,
  AssetComponent,
  MapperComponent,
  CommandComponent,
  AddCommandComponent,
  EditCommandComponent,
  AuditlogsComponent,
  ProjectComponent,
  AccountInfoComponent,
  NotificationSidebarComponent,
  AssetAnalysisComponent,
  PerformenceReportComponent,
  FactoryControlpanelComponent,
  FactoryCustomersComponent,
  WorkordersComponent,
  MaintenanceLogComponent,
  FactoryDataruleComponent,
  AssetNotisComponent,
  PartmanagementComponent,
  ControllerComponent,
  AccountActivationComponent,
  UnauthorizedAccessComponent,
  MainLeftContentComponent,
  PagenotfoundComponent,
  VerifyAccountComponent,
  ReportComponent,
  ]
