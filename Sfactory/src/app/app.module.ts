import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxGaugeModule } from 'ngx-gauge';
import { AgmCoreModule } from '@agm/core';
import { RouterModule } from '@angular/router'
import { NgxMatIntlTelInputModule } from 'ngx-mat-intl-tel-input';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MaterialModuleComponents } from './app-material-components.module';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { environment } from 'src/environments/environment.prod';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AuthGaurd } from './components/login/_services/auth-gaurd.service';
import { AuthInterceptor } from './components/login/login.component';
import { PagenotfoundComponent } from './components/others/pagenotfound/pagenotfound.component';
import { TenantAdminAuthGaurd } from './components/login/_services/admin-auth-gaurd.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ServiceWorkerModule } from '@angular/service-worker';
import { WINDOW_PROVIDERS } from './components/others/window/_services/window.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgpImagePickerModule } from 'ngp-image-picker';
import { NgxFileDragDropModule } from 'ngx-file-drag-drop';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from "@mat-datetimepicker/core";
import { JoyrideModule } from 'ngx-joyride';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import {MatChipsModule} from '@angular/material/chips';



@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
  ],


  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModuleComponents,
    AppRoutingModule,
    NgbModule,
    NgxGaugeModule,
    HttpClientModule,
    NgxMatIntlTelInputModule,
    Ng2SearchPipeModule,
    NgxSpinnerModule,
    NgApexchartsModule,
    NgpImagePickerModule,
    NgxFileDragDropModule,
    MatDatetimepickerModule,
    MatNativeDatetimeModule,
    FormsModule,
    MatChipsModule,
    NgxSkeletonLoaderModule.forRoot(),
    JoyrideModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: environment.googlemaps_key
    }),
    RouterModule.forRoot([
      {path: '**', component: PagenotfoundComponent}
    ]),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerImmediately' }),
  ],
  providers: [
    DatePipe,
    AuthGaurd,
    TenantAdminAuthGaurd,
    CookieService,
    WINDOW_PROVIDERS,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
