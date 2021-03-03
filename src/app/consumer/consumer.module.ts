import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { TemplateModule} from '../template/template.module';
import { LayoutModule} from '../layout/layout.module';
import { ConsumerListComponent } from '../consumer/views/consumer-list/consumer-list.component';
import { ConsumerSubscriptionListComponent } from './views/consumer-subscription-list/consumer-subscription-list.component';
import { SubscriptionCreateComponent } from './views/subscription-create/subscription-create.component';
import { DeviceListComponent } from './views/device-list/device-list.component';
import { ConsumerProductTypeModule} from './consumer-product-type/consumer-product-type.module';
import { ConsumerProductModule} from './consumer-product/consumer-product.module';
import { ConsumerTicketModule} from './consumer-ticket/consumer-ticket.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ConsumerRoutingModule } from './consumer-routing.module';
import { ConsumerService } from './services/consumer.service';

@NgModule({
    declarations: [
        ConsumerListComponent,
        ConsumerSubscriptionListComponent,
        SubscriptionCreateComponent,
        DeviceListComponent
    ],

    imports: [
        TranslateModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        TemplateModule,
        NgbModule,
        LayoutModule,
        PerfectScrollbarModule,
        ConsumerRoutingModule,
        ConsumerProductTypeModule,
        ConsumerTicketModule,
        ConsumerProductModule
    ],

    exports: [
        ConsumerListComponent,
        ConsumerSubscriptionListComponent,
        SubscriptionCreateComponent,
        DeviceListComponent
    ],

    providers: [ConsumerService
    ],

    bootstrap: [
        ConsumerListComponent,
        ConsumerSubscriptionListComponent,
        SubscriptionCreateComponent,
        DeviceListComponent
    ]
})
export class ConsumerModule { }
