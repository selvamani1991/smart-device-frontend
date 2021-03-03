import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsumerListComponent } from '../consumer/views/consumer-list/consumer-list.component';
import { ConsumerSubscriptionListComponent } from './views/consumer-subscription-list/consumer-subscription-list.component';
import { SubscriptionCreateComponent } from './views/subscription-create/subscription-create.component';
import { DeviceListComponent } from './views/device-list/device-list.component';
import { ConsumerProductTypeModule} from './consumer-product-type/consumer-product-type.module';
import { ConsumerProductModule} from './consumer-product/consumer-product.module';
import { ConsumerTicketModule} from './consumer-ticket/consumer-ticket.module';
import { ConsumerModule} from '../consumer/consumer.module';
import { CONSUMER_CONSTANTS } from './constants';
import {AuthGuard} from '../auth/services/auth.guard';

const consumerRoutes: Routes = [
    { path: CONSUMER_CONSTANTS.LINK.CONSUMER_PRODUCT_TYPE, loadChildren: () => ConsumerProductTypeModule },
    { path: CONSUMER_CONSTANTS.LINK.CONSUMER_PRODUCT, loadChildren: () => ConsumerProductModule },
    { path: CONSUMER_CONSTANTS.LINK.CONSUMER_TICKET, loadChildren: () => ConsumerTicketModule },
    { path: CONSUMER_CONSTANTS.LINK.CONSUMER_LIST, component: ConsumerListComponent, canActivate: [AuthGuard] },
    { path: CONSUMER_CONSTANTS.LINK.CONSUMER_SUBSCRIPTION_LIST, component: ConsumerSubscriptionListComponent, canActivate: [AuthGuard] },
    { path: CONSUMER_CONSTANTS.LINK.SUBSCRIPTION_CREATE, component: SubscriptionCreateComponent, canActivate: [AuthGuard] },
    { path: CONSUMER_CONSTANTS.LINK.DEVICE_LIST, component: DeviceListComponent, canActivate: [AuthGuard] }


];

@NgModule({
    imports: [RouterModule.forChild(consumerRoutes)],
    exports: [RouterModule]
})
export class ConsumerRoutingModule {}
