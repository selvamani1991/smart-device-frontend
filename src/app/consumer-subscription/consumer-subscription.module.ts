import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TemplateModule} from '../template/template.module';
import { LayoutModule} from '../layout/layout.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';

import { ConsumerSubscriptionService } from './services/consumer-subscription.service';

import { ConsumerSubscriptionRoutingModule } from './consumer-subscription-routing.module';



@NgModule({
    declarations: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent
    ],

    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TemplateModule,
        NgbModule,
        LayoutModule,
        PerfectScrollbarModule,
        ConsumerSubscriptionRoutingModule,
    ],

    exports: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent
    ],

    providers: [ConsumerSubscriptionService],
    bootstrap: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent
    ]
})
export class ConsumerSubscriptionModule { }
