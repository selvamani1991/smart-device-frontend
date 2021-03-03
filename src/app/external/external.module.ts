import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { TemplateModule} from '../template/template.module';
import { LayoutModule } from '../layout/layout.module';


import { AboutComponent } from './views/about/about.component';
import { ContactComponent } from './views/contact/contact.component';
import { PolicyComponent } from './views/policy/policy.component';
import { TermsComponent } from './views/terms/terms.component';

import { IslamComponent } from './views/islam/islam.component';
import { TauhidComponent } from './views/tauhid/tauhid.component';
import { NamaazComponent } from './views/namaaz/namaaz.component';
import { HajComponent } from './views/haj/haj.component';
import { JakaatComponent } from './views/jakaat/jakaat.component';
import { RozaComponent } from './views/roza/roza.component';
import { HadishComponent } from './views/hadish/hadish.component';

import { ExternalRoutingModule } from './external-routing.module';



@NgModule({
    declarations: [
        AboutComponent,
        ContactComponent,
        PolicyComponent,
        TermsComponent,
        IslamComponent,
        TauhidComponent,
        NamaazComponent,
        HajComponent,
        JakaatComponent,
        RozaComponent,
        HadishComponent
    ],
    imports: [
        TranslateModule,
        HttpClientModule,
        CommonModule,
        FormsModule,
        PerfectScrollbarModule,
        TemplateModule,
        LayoutModule,
        ExternalRoutingModule
    ],
    exports: [
        AboutComponent,
        ContactComponent,
        PolicyComponent,
        TermsComponent,
        IslamComponent,
        TauhidComponent,
        NamaazComponent,
        HajComponent,
        JakaatComponent,
        RozaComponent,
        HadishComponent
    ],
    providers: [],
    bootstrap: [
        AboutComponent,
        ContactComponent,
        PolicyComponent,
        TermsComponent,
        IslamComponent,
        TauhidComponent,
        NamaazComponent,
        HajComponent,
        JakaatComponent,
        RozaComponent,
        HadishComponent
    ]
})
export class ExternalModule { }
