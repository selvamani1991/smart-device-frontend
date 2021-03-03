import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import { AlertComponent } from './directives/alert/alert.component';
import { LanguageSwitcherComponent } from './directives/language-switcher/language-switcher.component';

import { AlertService } from './services/alert.service';
import { TelemetricService } from './services/telemetric.service';
import { ChartService } from './services/chart.service';
import { DateService } from './services/date.service';
import { MenuService } from './services/menu.service';
import { TooltipService } from './services/tooltip.service';
import { HttpClientService } from './services/http-client.service';
import { HttpResponseService } from './services/http-response.service';
import { BreadCrumService } from './services/bread-crum.service';
import { SweetAlertService } from './services/sweet-alert.service';
import { AddressService } from './services/address.service';
import { AdminService } from './services/admin.service';


@NgModule({
  declarations: [
      AlertComponent,
      LanguageSwitcherComponent
    ],
  imports: [
      CommonModule,
      TranslateModule
  ],
  exports:[
      AlertComponent,
      LanguageSwitcherComponent
  ],
  providers: [
      AlertService,BreadCrumService,ChartService,SweetAlertService,DateService,TooltipService,HttpResponseService,MenuService,AddressService,AdminService,TelemetricService
  ],
  bootstrap: [
      AlertComponent,
      LanguageSwitcherComponent
  ]
})
export class SharedModule {

}
