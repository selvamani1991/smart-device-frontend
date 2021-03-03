import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {HttpClientModule} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SharedModule} from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';

import { TemplateModule} from '../template/template.module';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [
      HeaderComponent,
      FooterComponent,
      AdminComponent
  ],
  imports: [
      TranslateModule,
      HttpClientModule,
      CommonModule,
      SharedModule,
      RouterModule,
      PerfectScrollbarModule,
      FormsModule,
      TemplateModule
  ],
  exports: [
      HeaderComponent,
      FooterComponent,
      AdminComponent
  ],
  providers: [],
  bootstrap: [
      HeaderComponent,
      FooterComponent,
      AdminComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class LayoutModule { }
