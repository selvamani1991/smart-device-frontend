import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Routes, RouterModule} from '@angular/router';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { AppRoutingModule} from './app-routing.module';
import { TemplateModule} from './template/template.module';
import { LayoutModule} from './layout/layout.module';
import { SharedModule} from './shared/shared.module';
import { MainModule} from './main/main.module';
import { ExternalModule} from './external/external.module';
import { AuthModule} from './auth/auth.module';
import { UserModule} from './user/user.module';
import { PermissionModule} from './permission/permission.module';

import { CompanyBuildingModule} from './company-building/company-building.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from './auth/services/authentication.service';
import { AuthorizationService } from './auth/services/authorization.service';
import { HttpClientService } from './shared/services/http-client.service';
import { HttpResponseService } from './shared/services/http-response.service';

import { RequestInterceptor } from './auth/services/request-interceptor.interceptor';
import { ClientModule } from './client/client.module';
import { CityModule } from './city/city.module';
import { CompanyModule } from './company/company.module';
import { DistributorModule } from './distributor/distributor.module';
import { BoardModule } from './board/board.module';
import { BoardManufacturerModule } from './board-manufacturer/board-manufacturer.module';
import { MachineManufacturerModule} from './machine-manufacturer/machine-manufacturer.module';
import { VendorModule } from './vendor/vendor.module';
import { ProductModule } from './product/product.module';
import { ProductTypeModule } from './product-type/product-type.module';
import { MachineModule } from './machine/machine.module';
import { ConsumerModule } from './consumer/consumer.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TelemetricDataModule } from './telemetric-data/telemetric-data.module';
import { ZoneModule} from './zone/zone.module';
import { ReportModule} from './report/report.module';
import { ProductSubscriptionModule} from './product-subscription/product-subscription.module';
import { ProductCategoryModule} from './product-category/product-category.module';
import { InvoiceModule} from './invoice/invoice.module';
import { MediaModule} from './media/media.module';
import { ResourcesModule} from './resources/resources.module';
import { ProductWizardModule} from './product-wizard/product-wizard.module';
import { ConsumerSubscriptionModule} from './consumer-subscription/consumer-subscription.module';
import { RoomTypeModule} from './room-type/room-type.module';

import {} from 'googlemaps';


export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
      CommonModule,
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      TranslateModule.forRoot({
          loader: {
              provide: TranslateLoader,
              useFactory: (createTranslateLoader),
              deps: [HttpClient]
          }
      }),
      RouterModule,
      NgbModule,
      PerfectScrollbarModule,
      DragDropModule,
      LayoutModule,
      TemplateModule,
      SharedModule,
      MainModule,
      ExternalModule,
      AuthModule,
      UserModule,
      PermissionModule,
      AppRoutingModule,
      CityModule,
      CompanyBuildingModule,
      ClientModule,
      CompanyModule,
      DistributorModule,
      BoardModule,
      MachineManufacturerModule,
      VendorModule,
      ProductModule,
      MachineModule,
      ProductTypeModule,
      BoardManufacturerModule,
      ConsumerModule,
      SubscriptionModule,
      TelemetricDataModule,
      ZoneModule,
      ProductSubscriptionModule,
      ReportModule,
      ProductCategoryModule,
      InvoiceModule,
      MediaModule,
      ResourcesModule,
      ProductWizardModule,
      ConsumerSubscriptionModule,
      RoomTypeModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  providers: [
      CookieService,
      HttpClientService,
      AuthenticationService,
      HttpResponseService,
      AuthorizationService,
      {provide: PERFECT_SCROLLBAR_CONFIG,useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG},
      {provide: HTTP_INTERCEPTORS,useClass: RequestInterceptor,multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
