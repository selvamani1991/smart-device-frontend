import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SharedModule} from '../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule }   from '@angular/forms';

import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TopNavbarComponent } from './topnavbar/topnavbar.component';
import { PageTitleComponent } from './pagetitle/page-title.component';
import { PublicPageTitleComponent } from './publicpagetitle/public-page-title.component';
import { LetterIconComponent } from './letter-icon/letter-icon.component';
import { ListHeaderComponent } from './list-header/list-header.component';
import { ProductListHeaderComponent } from './product-list-header/product-list-header.component';
import { DataListHeaderComponent } from './data-list-header/data-list-header.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ContentMainComponent } from './content-main/content-main.component';
import { ContainerMainComponent } from './container-main/container-main.component';
import { FormBottomComponent } from './form-bottom/form-bottom.component';
import { FormControlLabelComponent } from './form-control-label/form-control-label.component';
import { FormVerifyLabelComponent } from './form-verify-label/form-verify-label.component';
import { FormValidateComponent } from './form-validate/form-validate.component';
import { ReportValidateComponent } from './report-validate/report-validate.component';
import { SearchHeaderComponent } from './search-header/search-header.component';
import { AssetReportHeaderComponent } from './asset-report-header/asset-report-header.component';
import { ResponseHeaderComponent } from './response-header/response-header.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PaginationHeaderComponent } from './pagination-header/pagination-header.component';

@NgModule({
  declarations:[
      SidebarComponent,
      NavbarComponent,
      TopNavbarComponent,
      PageTitleComponent,
      LetterIconComponent,
      ListHeaderComponent,
      ProductListHeaderComponent,
      PaginationComponent,
      ContentMainComponent,
      FormBottomComponent,
      ContainerMainComponent,
      PublicPageTitleComponent,
      FormControlLabelComponent,
      FormVerifyLabelComponent,
      FormValidateComponent,
      SearchHeaderComponent,
      AssetReportHeaderComponent,
      ResponseHeaderComponent,
      DataListHeaderComponent,
      PaginationHeaderComponent,
      ReportValidateComponent
  ],
  imports: [
      TranslateModule,
      HttpClientModule,
      CommonModule,
      SharedModule,
      NgbModule,
      RouterModule,
      PerfectScrollbarModule,
      FormsModule
  ],
  exports:[
      SidebarComponent,
      NavbarComponent,
      TopNavbarComponent,
      PageTitleComponent,
      LetterIconComponent,
      ListHeaderComponent,
      ProductListHeaderComponent,
      PaginationComponent,
      ContentMainComponent,
      FormBottomComponent,
      ContainerMainComponent,
      PublicPageTitleComponent,
      FormControlLabelComponent,
      FormVerifyLabelComponent,
      FormValidateComponent,
      SearchHeaderComponent,
      AssetReportHeaderComponent,
      ResponseHeaderComponent,
      DataListHeaderComponent,
      PaginationHeaderComponent,
      ReportValidateComponent
  ],
  providers: [],
  bootstrap: [
      SidebarComponent,
      NavbarComponent,
      TopNavbarComponent,
      PageTitleComponent,
      LetterIconComponent,
      ListHeaderComponent,
      ProductListHeaderComponent,
      PaginationComponent,
      ContentMainComponent,
      FormBottomComponent,
      ContainerMainComponent,
      PublicPageTitleComponent,
      FormControlLabelComponent,
      FormVerifyLabelComponent,
      FormValidateComponent,
      SearchHeaderComponent,
      AssetReportHeaderComponent,
      ResponseHeaderComponent,
      DataListHeaderComponent,
      PaginationHeaderComponent,
      ReportValidateComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class TemplateModule {

}
