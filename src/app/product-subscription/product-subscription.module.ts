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
import { ProductSubscriptionService } from './services/product-subscription.service';
import { ProductSubscriptionRoutingModule } from './product-subscription-routing.module';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { CityModule} from '../city/city.module';
import { MachineModule} from '../machine/machine.module';

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
        ProductSubscriptionRoutingModule,
        CityModule,
        MachineModule
    ],

    exports: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent

    ],

    providers: [ProductSubscriptionService],
    bootstrap: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent


    ]
})
export class ProductSubscriptionModule { }